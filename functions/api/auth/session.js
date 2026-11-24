import { json } from "../../_lib/util.js";
import { readSession } from "../../_lib/session.js";
import { isAdmin } from "../../_lib/reviews.js";

export async function onRequestGet({ request, env }) {
  const session = await readSession(request, env);
  if (!session) return json({ user: null });

  return json({
    user: {
      name: session.name,
      isAdmin: isAdmin(session, env),
    },
  });
}
