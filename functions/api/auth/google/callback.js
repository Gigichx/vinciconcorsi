import { fail, originOf, safeNext } from "../../../_lib/util.js";
import {
  clearOauthState,
  createSession,
  readOauthState,
} from "../../../_lib/session.js";
import { exchangeCode, verifyIdToken } from "../../../_lib/google.js";

function redirectTo(request, next, error) {
  const target = new URL(safeNext(next), originOf(request));
  if (error) target.searchParams.set("recensione", error);
  target.hash = "recensioni";
  return new Response(null, {
    status: 302,
    headers: { location: target.toString(), "cache-control": "no-store" },
  });
}

export async function onRequestGet({ request, env }) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !env.SESSION_SECRET) {
    return fail(500, "config", "Accesso con Google non ancora configurato.");
  }

  const url = new URL(request.url);
  const oauth = await readOauthState(request, env);
  // Lo stato è firmato, ma il percorso viene ricontrollato comunque: il
  // redirect resta interno anche se il cookie fosse stato emesso da una
  // versione precedente del sito.
  const next = safeNext(oauth?.next);

  if (url.searchParams.get("error")) {
    return redirectTo(request, next, "annullato");
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !oauth || !state || state !== oauth.state) {
    return fail(400, "state", "Accesso scaduto o non valido. Riprova.");
  }

  const base = String(env.APP_ORIGIN || originOf(request)).replace(/\/$/, "");

  try {
    const tokens = await exchangeCode({
      code,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      redirectUri: `${base}/api/auth/google/callback`,
    });

    const profile = await verifyIdToken(tokens.id_token, {
      clientId: env.GOOGLE_CLIENT_ID,
      nonce: oauth.nonce,
    });

    const session = await createSession(
      request,
      {
        sub: profile.sub,
        name: profile.name || "Utente Google",
        picture: profile.picture || "",
        email: profile.email || "",
      },
      env.SESSION_SECRET,
    );

    const headers = new Headers({
      location: new URL(next, originOf(request)).toString(),
      "cache-control": "no-store",
    });
    headers.append("set-cookie", session);
    headers.append("set-cookie", clearOauthState(request));
    return new Response(null, { status: 302, headers });
  } catch {
    return redirectTo(request, next, "errore");
  }
}
