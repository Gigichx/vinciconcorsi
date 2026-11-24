import { b64urlDecode } from "./util.js";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const JWKS_URL = "https://www.googleapis.com/oauth2/v3/certs";

let jwksCache = { keys: [], at: 0 };

export function googleAuthUrl({ clientId, redirectUri, state, nonce }) {
  const url = new URL(AUTH_URL);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("nonce", nonce);
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

export async function exchangeCode({ code, clientId, clientSecret, redirectUri }) {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) throw new Error("token_exchange");
  return response.json();
}

async function getJwks(force = false) {
  if (!force && jwksCache.keys.length && Date.now() - jwksCache.at < 60 * 60 * 1000) {
    return jwksCache;
  }
  const response = await fetch(JWKS_URL, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error("jwks");
  const data = await response.json();
  jwksCache = { keys: data.keys || [], at: Date.now() };
  return jwksCache;
}

async function importKey(jwk) {
  return crypto.subtle.importKey(
    "jwk",
    { kty: "RSA", n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
}

/**
 * Verifica firma, emittente, audience, scadenza e nonce dell'ID token Google.
 * Restituisce il profilo solo se il token è autentico.
 */
export async function verifyIdToken(idToken, { clientId, nonce }) {
  const parts = String(idToken || "").split(".");
  if (parts.length !== 3) throw new Error("id_token");

  const header = JSON.parse(new TextDecoder().decode(b64urlDecode(parts[0])));
  if (header.alg !== "RS256" || !header.kid) throw new Error("alg");

  let set = await getJwks();
  let jwk = set.keys.find((key) => key.kid === header.kid);
  if (!jwk) {
    set = await getJwks(true);
    jwk = set.keys.find((key) => key.kid === header.kid);
  }
  if (!jwk) throw new Error("kid");

  const key = await importKey(jwk);
  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    b64urlDecode(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  );
  if (!valid) throw new Error("signature");

  const payload = JSON.parse(new TextDecoder().decode(b64urlDecode(parts[1])));
  const issuers = ["accounts.google.com", "https://accounts.google.com"];

  if (!issuers.includes(payload.iss)) throw new Error("issuer");
  if (payload.aud !== clientId) throw new Error("audience");
  if (!payload.exp || payload.exp * 1000 < Date.now() - 60 * 1000) {
    throw new Error("expired");
  }
  if (nonce && payload.nonce !== nonce) throw new Error("nonce");
  if (payload.email_verified !== true) throw new Error("email");
  if (!payload.sub) throw new Error("subject");

  return payload;
}
