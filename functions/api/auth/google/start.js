import { fail, originOf, randomToken, safeNext } from "../../../_lib/util.js";
import { createOauthState } from "../../../_lib/session.js";
import { googleAuthUrl } from "../../../_lib/google.js";

export async function onRequestGet({ request, env }) {
  // Senza Client Secret il ritorno dal login non potrebbe completarsi: meglio
  // fermarsi subito, prima di mandare l'utente su Google.
  const clientId = env.GOOGLE_CLIENT_ID;
  if (!clientId || !env.GOOGLE_CLIENT_SECRET || !env.SESSION_SECRET) {
    return fail(500, "config", "Accesso con Google non ancora configurato.");
  }

  const url = new URL(request.url);
  const next = safeNext(url.searchParams.get("next"));
  const state = randomToken(24);
  const nonce = randomToken(16);
  const cookie = await createOauthState(
    request,
    { state, nonce, next },
    env.SESSION_SECRET,
  );

  const base = String(env.APP_ORIGIN || originOf(request)).replace(/\/$/, "");
  const redirectUri = `${base}/api/auth/google/callback`;

  return new Response(null, {
    status: 302,
    headers: {
      location: googleAuthUrl({ clientId, redirectUri, state, nonce }),
      "set-cookie": cookie,
      "cache-control": "no-store",
    },
  });
}
