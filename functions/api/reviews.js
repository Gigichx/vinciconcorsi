import { fail, json, sameOrigin } from "../_lib/util.js";
import { readSession } from "../_lib/session.js";
import {
  MAX_BODY,
  MAX_PHOTOS,
  listReviews,
  readUploads,
} from "../_lib/reviews.js";

const MESSAGES = {
  too_short: "Il testo è troppo breve: racconta l'esperienza in almeno 40 caratteri.",
  too_long: `Il testo supera i ${MAX_BODY} caratteri.`,
  too_many_photos: `Puoi allegare al massimo ${MAX_PHOTOS} foto.`,
  too_large: "Le foto sono troppo pesanti: il limite è 5 MB ciascuna.",
  photo_too_large: "Ogni foto deve pesare al massimo 5 MB.",
  photo_type: "Le foto devono essere JPEG, PNG o WebP.",
  consent: "Serve il consenso alla pubblicazione.",
  form: "Invio non valido. Riprova.",
};

export async function onRequestGet({ env }) {
  const reviews = await listReviews(env, "approved");
  return json(
    { reviews },
    { headers: { "cache-control": "public, max-age=60" } },
  );
}

export async function onRequestPost({ request, env }) {
  if (!sameOrigin(request)) {
    return fail(403, "origin", "Origine non ammessa.");
  }

  const session = await readSession(request, env);
  if (!session) {
    return fail(401, "auth", "Accedi con Google per pubblicare la recensione.");
  }

  const upload = await readUploads(request);
  if (upload.error) {
    return fail(400, upload.error, MESSAGES[upload.error] || MESSAGES.form);
  }

  const pending = await env.DB.prepare(
    "SELECT id FROM reviews WHERE google_sub = ? AND status = 'pending' LIMIT 1",
  )
    .bind(session.sub)
    .first();

  if (pending) {
    return fail(
      409,
      "pending",
      "Hai già una recensione in attesa di approvazione.",
    );
  }

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS total FROM reviews WHERE google_sub = ? AND created_at > ?",
  )
    .bind(session.sub, since)
    .first();

  if ((recent?.total || 0) >= 3) {
    return fail(
      429,
      "rate",
      "Hai inviato troppe recensioni oggi. Riprova domani.",
    );
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO reviews
      (id, google_sub, author_name, body, percorso, status, created_at)
     VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
  )
    .bind(
      id,
      session.sub,
      session.name || "Utente Google",
      upload.value.body,
      upload.value.percorso,
      now,
    )
    .run();

  const stored = [];

  try {
    for (const [position, photo] of upload.value.photos.entries()) {
      const photoId = crypto.randomUUID();
      const key = `reviews/${id}/${photoId}.${photo.ext}`;
      await env.FILES.put(key, await photo.file.arrayBuffer(), {
        httpMetadata: { contentType: photo.type },
      });
      stored.push({ key, photoId });

      await env.DB.prepare(
        `INSERT INTO review_photos
          (id, review_id, object_key, content_type, position, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
        .bind(photoId, id, key, photo.type, position, now)
        .run();
    }
  } catch {
    for (const item of stored) await env.FILES.delete(item.key).catch(() => {});
    await env.DB.prepare("DELETE FROM review_photos WHERE review_id = ?")
      .bind(id)
      .run()
      .catch(() => {});
    await env.DB.prepare("DELETE FROM reviews WHERE id = ?")
      .bind(id)
      .run()
      .catch(() => {});
    return fail(
      500,
      "storage",
      "Non siamo riusciti a salvare le foto. Riprova tra poco.",
    );
  }

  return json(
    { review: { id, status: "pending" } },
    { status: 201, headers: { "cache-control": "no-store" } },
  );
}
