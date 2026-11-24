const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function json(data, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json; charset=utf-8");
  if (!headers.has("cache-control")) headers.set("cache-control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function fail(status, error, message) {
  return json({ error, message }, { status });
}

export function b64urlEncode(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function b64urlDecode(value) {
  const normalized = String(value).replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + ((4 - (normalized.length % 4)) % 4),
    "=",
  );
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function encodeJson(value) {
  return b64urlEncode(encoder.encode(JSON.stringify(value)));
}

export function decodeJson(value) {
  return JSON.parse(decoder.decode(b64urlDecode(value)));
}

export function readCookie(request, name) {
  const header = request.headers.get("cookie") || "";
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return "";
}

export function serializeCookie(request, name, value, options = {}) {
  const { maxAge, path = "/", sameSite = "Lax" } = options;
  const bits = [`${name}=${value}`, `Path=${path}`, `SameSite=${sameSite}`, "HttpOnly"];
  if (typeof maxAge === "number") bits.push(`Max-Age=${maxAge}`);
  if (new URL(request.url).protocol === "https:") bits.push("Secure");
  return bits.join("; ");
}

export function originOf(request) {
  return new URL(request.url).origin;
}

export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  return Boolean(origin) && origin === originOf(request);
}

export function randomToken(bytes = 24) {
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);
  return b64urlEncode(buffer);
}

const INTERNAL_BASE = "https://sito.interno";

/**
 * Accetta solo percorsi interni: niente redirect verso altri domini.
 *
 * Il controllo non si ferma alla prima barra: i browser leggono la barra
 * rovesciata come una barra, quindi `/\evil.example` verrebbe risolto su
 * https://evil.example. Qualunque barra rovesciata o carattere di controllo
 * fa scattare il percorso di riserva; alla fine l'URL viene risolto su una
 * base interna e vale solo se l'origine resta quella.
 */
export function safeNext(value) {
  const fallback = "/?recensione=login#recensioni";
  if (!value) return fallback;

  const text = String(value).trim();
  if (!text.startsWith("/") || /[\u0000-\u0020\u007f\\]/.test(text)) {
    return fallback;
  }

  let target;
  try {
    target = new URL(text, INTERNAL_BASE);
  } catch {
    return fallback;
  }

  if (target.origin !== INTERNAL_BASE) return fallback;

  return `${target.pathname}${target.search}${target.hash}`;
}
