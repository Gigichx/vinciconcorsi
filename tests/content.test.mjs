import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { brand, manuals, pathways, socials, waMessages } from "../assets/JS/content.js";
import { createWhatsAppUrl } from "../assets/JS/whatsapp.mjs";

const pages = [
  "index.html",
  "carabinieri/index.html",
  "polizia-di-stato/index.html",
  "guardia-di-finanza/index.html",
];

function readPage(page) {
  return readFileSync(new URL(`../${page}`, import.meta.url), "utf8");
}

test("il numero WhatsApp confermato è valido e produce un link wa.me", () => {
  assert.equal(brand.whatsappNumber, "+393277897381");
  assert.equal(
    createWhatsAppUrl(brand.whatsappNumber, "Ciao, vorrei informazioni."),
    "https://wa.me/393277897381?text=Ciao%2C%20vorrei%20informazioni.",
  );
});

test("un solo manuale reale, in PDF, senza prezzo pubblicato", () => {
  assert.equal(manuals.length, 1);
  assert.equal(manuals[0].bodyId, "carabinieri");
  assert.equal(manuals[0].format, "PDF");
  assert.equal(manuals[0].price, null);
  assert.equal(pathways.length, 3);
});

test("ogni pulsante WhatsApp nelle pagine ha un messaggio dedicato e un href coerente", () => {
  for (const page of pages) {
    const html = readPage(page);
    const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map((match) => match[0]);
    const withWhatsApp = anchors.filter((anchor) => anchor.includes("data-wa="));
    assert.ok(withWhatsApp.length > 0, `${page}: nessun pulsante WhatsApp`);

    for (const anchor of withWhatsApp) {
      const key = anchor.match(/data-wa="([^"]+)"/)[1];
      const href = anchor.match(/href="([^"]+)"/)[1];
      const expected = createWhatsAppUrl(brand.whatsappNumber, waMessages[key]);

      assert.ok(expected, `${page}: manca il messaggio per "${key}"`);
      assert.equal(
        href,
        expected.replaceAll("&", "&amp;"),
        `${page}: href statico non allineato a content.js per "${key}"`,
      );
    }
  }
});

test("le pagine sono noindex, senza link vuoti e senza prezzi", () => {
  for (const page of pages) {
    const html = readPage(page);
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/, page);
    assert.doesNotMatch(html, /href="#"/, `${page}: link vuoto`);
    assert.doesNotMatch(html, /__WA:/, `${page}: segnaposto non risolto`);
    assert.doesNotMatch(html, /€/, `${page}: prezzo pubblicato`);
  }
});

test("i social valorizzati sono URL https", () => {
  for (const social of socials) {
    assert.ok(social.url === null || social.url.startsWith("https://"), social.name);
  }
});
