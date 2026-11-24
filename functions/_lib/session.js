import {
  b64urlDecode,
  b64urlEncode,
  decodeJson,
  encodeJson,
  readCookie,
  serializeCookie,
} from "./util.js";

const SESSION_COOKIE = "vc_session";
const OAUTH_COOKIE = "vc_oauth";
const SESSION_TTL = 60 * 60 * 24 * 30;
const OAUTH_TTL = 60 * 10;

const keys = new Map();

async function getKey(secret) {
  if (!keys.has(secret)) {
    keys.set(
      secret,
      crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"],
      ),
    );
  }
  return keys.get(secret);
}

async function sign(payload, secret) {
  const body = encodeJson(payload);
  const signature = await crypto.subtle.sign(
    "HMAC",
    await getKey(secret),
    new TextEncoder().encode(body),
  );
  return `${body}.${b64urlEncode(new Uint8Array(signature))}`;
}

async function verify(token, secret) {
  const [body, signature] = String(token || "").split(".");
  if (!body || !signature) return null;
  try {
    const ok = await crypto.subtle.verify(
      "HMAC",
      await getKey(secret),
      b64urlDecode(signature),
      new TextEncoder().encode(body),
    );
    if (!ok) return null;
    return decodeJson(body);
  } catch {
    return null;
  }
}

export async function createSession(request, user, secret) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL;
  const token = await sign({ ...user, exp }, secret);
  return serializeCookie(request, SESSION_COOKIE, token, { maxAge: SESSION_TTL });
}

export async function readSession(request, env) {
  if (!env.SESSION_SECRET) return null;
  const data = await verify(readCookie(request, SESSION_COOKIE), env.SESSION_SECRET);
  if (!data || !data.sub || !data.exp) return null;
  if (data.exp * 1000 < Date.now()) return null;
  return data;
}

export function clearSession(request) {
  return serializeCookie(request, SESSION_COOKIE, "", { maxAge: 0 });
}

export async function createOauthState(request, state, secret) {
  const token = await sign(state, secret);
  return serializeCookie(request, OAUTH_COOKIE, token, {
    maxAge: OAUTH_TTL,
    path: "/api/auth",
  });
}

export async function readOauthState(request, env) {
  if (!env.SESSION_SECRET) return null;
  return verify(readCookie(request, OAUTH_COOKIE), env.SESSION_SECRET);
}

export function clearOauthState(request) {
  return serializeCookie(request, OAUTH_COOKIE, "", {
    maxAge: 0,
    path: "/api/auth",
  });
}
