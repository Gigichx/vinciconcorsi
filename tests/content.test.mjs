import test from "node:test";
import assert from "node:assert/strict";
import { brand, catalog, socials, pathways } from "../assets/JS/content.js";

test("il numero WhatsApp resta nullo finché non è verificato", () => {
  assert.equal(brand.whatsappNumber, null);
});

test("i prezzi non sono mostrati e un solo manuale è confermato", () => {
  assert.ok(catalog.every((item) => item.price === null));
  const reali = catalog.filter((item) => !item.demonstrative);
  assert.deepEqual(reali.map((item) => item.bodyId), ["carabinieri"]);
  assert.equal(catalog.length, pathways.length);
});

test("i social valorizzati sono URL https", () => {
  for (const social of socials) assert.ok(social.url === null || social.url.startsWith("https://"));
});
