import test from "node:test";
import assert from "node:assert/strict";
import { safeNext } from "../functions/_lib/util.js";
import { onRequestGet as startOauth } from "../functions/api/auth/google/start.js";

const FALLBACK = "/?recensione=login#recensioni";

function decodeStateCookie(cookie) {
  const token = cookie.split(";")[0].split("=")[1];
  const body = token.split(".")[0].replace(/-/g, "+").replace(/_/g, "/");
  const padded = body.padEnd(body.length + ((4 - (body.length % 4)) % 4), "=");
  return JSON.parse(atob(padded));
}

test("safeNext accetta i percorsi interni e ricade su quello di riserva", () => {
  assert.equal(safeNext("/"), "/");
  assert.equal(safeNext("/carabinieri/"), "/carabinieri/");
  assert.equal(safeNext(FALLBACK), FALLBACK);

  for (const bad of [
    undefined,
    "",
    "recensioni",
    "https://evil.example/",
    "//evil.example/",
    "/\\evil.example/",
    "/\\\\evil.example",
    "/\t/evil.example",
    "/\n/evil.example",
  ]) {
    assert.equal(safeNext(bad), FALLBACK, `accettato per errore: ${String(bad)}`);
  }
});

test("l'avvio OAuth si ferma subito quando manca il Client Secret", async () => {
  const response = await startOauth({
    request: new Request("http://127.0.0.1:8788/api/auth/google/start?next=%2Frecensioni"),
    env: { GOOGLE_CLIENT_ID: "client-id", SESSION_SECRET: "secret" },
  });

  assert.equal(response.status, 500);
  assert.equal((await response.json()).error, "config");
  assert.equal(response.headers.get("set-cookie"), null);
});

test("un next con barra rovesciata non arriva al redirect", async () => {
  const response = await startOauth({
    request: new Request(
      "http://127.0.0.1:8788/api/auth/google/start?next=%2F%5Cevil.example%2F",
    ),
    env: {
      GOOGLE_CLIENT_ID: "client-id",
      GOOGLE_CLIENT_SECRET: "client-secret",
      SESSION_SECRET: "secret",
    },
  });

  assert.equal(response.status, 302);
  assert.match(response.headers.get("location"), /^https:\/\/accounts\.google\.com\//);
  assert.equal(decodeStateCookie(response.headers.get("set-cookie")).next, FALLBACK);
});
