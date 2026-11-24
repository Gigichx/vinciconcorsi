import { sameOrigin } from "../../_lib/util.js";
import { clearSession } from "../../_lib/session.js";

export async function onRequestPost({ request }) {
  if (!sameOrigin(request)) {
    return new Response("Origine non ammessa.", { status: 403 });
  }

  return new Response(null, {
    status: 204,
    headers: {
      "set-cookie": clearSession(request),
      "cache-control": "no-store",
    },
  });
}
