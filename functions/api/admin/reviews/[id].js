import { fail, json, sameOrigin } from "../../../_lib/util.js";
import { readSession } from "../../../_lib/session.js";
import { isAdmin } from "../../../_lib/reviews.js";

export async function onRequestPatch({ request, env, params }) {
  if (!sameOrigin(request)) return fail(403, "origin", "Origine non ammessa.");

  const session = await readSession(request, env);
  if (!isAdmin(session, env)) {
    return fail(403, "forbidden", "Area riservata alla moderazione.");
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return fail(400, "body", "Richiesta non valida.");
  }

  const status = payload?.status;
  if (status !== "approved" && status !== "rejected") {
    return fail(400, "status", "Stato non riconosciuto.");
  }

  const result = await env.DB.prepare(
    "UPDATE reviews SET status = ?, decided_at = ?, decided_by = ? WHERE id = ?",
  )
    .bind(status, new Date().toISOString(), session.email || "", params.id)
    .run();

  if (!result.meta?.changes) {
    return fail(404, "missing", "Recensione non trovata.");
  }

  return json({ review: { id: params.id, status } });
}

export async function onRequestDelete({ request, env, params }) {
  if (!sameOrigin(request)) return fail(403, "origin", "Origine non ammessa.");

  const session = await readSession(request, env);
  if (!isAdmin(session, env)) {
    return fail(403, "forbidden", "Area riservata alla moderazione.");
  }

  const photos = await env.DB.prepare(
    "SELECT object_key FROM review_photos WHERE review_id = ?",
  )
    .bind(params.id)
    .all();

  const keys = (photos.results || []).map((row) => row.object_key);
  for (const key of keys) await env.FILES.delete(key).catch(() => {});

  await env.DB.prepare("DELETE FROM review_photos WHERE review_id = ?")
    .bind(params.id)
    .run();
  const result = await env.DB.prepare("DELETE FROM reviews WHERE id = ?")
    .bind(params.id)
    .run();

  if (!result.meta?.changes) {
    return fail(404, "missing", "Recensione non trovata.");
  }

  return json({ deleted: params.id });
}
