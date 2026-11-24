export const PERCORSI = [
  "Carabinieri",
  "Polizia di Stato",
  "Guardia di Finanza",
  "Polizia Penitenziaria",
  "Altro",
];

export const MIN_BODY = 40;
export const MAX_BODY = 700;
export const MAX_PHOTOS = 3;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MAX_REQUEST_BYTES = 20 * 1024 * 1024;

export function cleanBody(value) {
  return String(value || "")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function validateBody(value) {
  const body = cleanBody(value);
  if (body.length < MIN_BODY) return { error: "too_short" };
  if (body.length > MAX_BODY) return { error: "too_long" };
  return { value: body };
}

export function normalizePercorso(value) {
  const percorso = String(value || "").trim();
  return PERCORSI.includes(percorso) ? percorso : "";
}

export function isAdmin(session, env) {
  if (!session?.email) return false;
  const allowed = String(env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  return allowed.includes(session.email.toLowerCase());
}

/** Riconosce JPEG, PNG e WebP dai byte iniziali, non dal tipo dichiarato. */
export async function detectPhotoType(file) {
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());

  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) {
    return { type: "image/jpeg", ext: "jpg" };
  }
  if (
    head[0] === 0x89 &&
    head[1] === 0x50 &&
    head[2] === 0x4e &&
    head[3] === 0x47 &&
    head[4] === 0x0d &&
    head[5] === 0x0a &&
    head[6] === 0x1a &&
    head[7] === 0x0a
  ) {
    return { type: "image/png", ext: "png" };
  }
  const riff = String.fromCharCode(...head.slice(0, 4));
  const webp = String.fromCharCode(...head.slice(8, 12));
  if (riff === "RIFF" && webp === "WEBP") {
    return { type: "image/webp", ext: "webp" };
  }
  return null;
}

export async function readUploads(request) {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > MAX_REQUEST_BYTES) return { error: "too_large" };

  let form;
  try {
    form = await request.formData();
  } catch {
    return { error: "form" };
  }

  const body = validateBody(form.get("body"));
  if (body.error) return { error: body.error };

  const photos = form
    .getAll("photos")
    .filter((entry) => entry && typeof entry.arrayBuffer === "function");

  if (photos.length > MAX_PHOTOS) return { error: "too_many_photos" };

  const uploads = [];
  for (const photo of photos) {
    if (photo.size > MAX_PHOTO_BYTES) return { error: "photo_too_large" };
    const detected = await detectPhotoType(photo);
    if (!detected) return { error: "photo_type" };
    uploads.push({ file: photo, ...detected });
  }

  if (String(form.get("consent") || "") !== "true") {
    return { error: "consent" };
  }

  return {
    value: {
      body: body.value,
      percorso: normalizePercorso(form.get("percorso")),
      photos: uploads,
    },
  };
}

/** Recensioni pubbliche o, per l'area di moderazione, filtrate per stato. */
export async function listReviews(env, status) {
  const query = status
    ? env.DB.prepare(
        "SELECT * FROM reviews WHERE status = ? ORDER BY created_at DESC LIMIT 200",
      ).bind(status)
    : env.DB.prepare(
        "SELECT * FROM reviews ORDER BY created_at DESC LIMIT 200",
      );

  const rows = (await query.all()).results || [];
  if (!rows.length) return [];

  const ids = rows.map((row) => row.id);
  const placeholders = ids.map(() => "?").join(", ");
  const photos = await env.DB.prepare(
    `SELECT id, review_id, position FROM review_photos
     WHERE review_id IN (${placeholders}) ORDER BY position ASC`,
  )
    .bind(...ids)
    .all();

  const byReview = new Map();
  for (const photo of photos.results || []) {
    const list = byReview.get(photo.review_id) || [];
    list.push({ id: photo.id });
    byReview.set(photo.review_id, list);
  }

  return rows.map((row) => ({
    id: row.id,
    name: row.author_name,
    body: row.body,
    percorso: row.percorso || "",
    status: row.status,
    createdAt: row.created_at,
    decidedAt: row.decided_at,
    photos: byReview.get(row.id) || [],
  }));
}

