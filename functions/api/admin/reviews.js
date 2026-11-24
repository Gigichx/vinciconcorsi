import { fail, json } from "../../_lib/util.js";
import { readSession } from "../../_lib/session.js";
import { isAdmin, listReviews } from "../../_lib/reviews.js";

const STATUSES = ["pending", "approved", "rejected"];

export async function onRequestGet({ request, env }) {
  const session = await readSession(request, env);
  if (!isAdmin(session, env)) {
    return fail(403, "forbidden", "Area riservata alla moderazione.");
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  if (status && !STATUSES.includes(status)) {
    return fail(400, "status", "Stato non riconosciuto.");
  }

  return json({ reviews: await listReviews(env, status || undefined) });
}
