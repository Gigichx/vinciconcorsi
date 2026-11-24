import { readSession } from "../../_lib/session.js";
import { isAdmin } from "../../_lib/reviews.js";

export async function onRequestGet({ params, request, env }) {
  const row = await env.DB.prepare(
    `SELECT p.object_key, p.content_type, p.review_id, r.status
     FROM review_photos p
     JOIN reviews r ON r.id = p.review_id
     WHERE p.id = ?`,
  )
    .bind(params.id)
    .first();

  if (!row) return new Response("Non trovata.", { status: 404 });

  if (row.status !== "approved") {
    const session = await readSession(request, env);
    if (!isAdmin(session, env)) {
      return new Response("Non trovata.", { status: 404 });
    }
  }

  const object = await env.FILES.get(row.object_key);
  if (!object) return new Response("Non trovata.", { status: 404 });

  const headers = new Headers({
    "content-type": row.content_type,
    "x-content-type-options": "nosniff",
    "cache-control":
      row.status === "approved"
        ? "public, max-age=31536000, immutable"
        : "private, no-store",
  });
  if (object.httpEtag) headers.set("etag", object.httpEtag);

  return new Response(object.body, { headers });
}
