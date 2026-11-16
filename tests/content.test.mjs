import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { waMessages, whatsappNumber } from "../assets/JS/content.js";
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
  assert.equal(whatsappNumber, "+393277897381");
  assert.equal(
    createWhatsAppUrl(whatsappNumber, "Ciao, vorrei informazioni."),
    "https://wa.me/393277897381?text=Ciao%2C%20vorrei%20informazioni.",
  );
});

test("ogni pulsante WhatsApp ha un messaggio dedicato e un href coerente", () => {
  for (const page of pages) {
    const html = readPage(page);
    const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map((match) => match[0]);
    const withWhatsApp = anchors.filter((anchor) => anchor.includes("data-wa="));
    assert.ok(withWhatsApp.length > 0, `${page}: nessun pulsante WhatsApp`);

    for (const anchor of withWhatsApp) {
      const key = anchor.match(/data-wa="([^"]+)"/)[1];
      const href = anchor.match(/href="([^"]+)"/)[1];
      const expected = createWhatsAppUrl(whatsappNumber, waMessages[key]);

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

test("le pagine funzionano da una sottocartella e non mostrano il numero", () => {
  for (const page of pages) {
    const html = readPage(page);
    for (const match of html.matchAll(/(?:href|src)="([^"]*)"/g)) {
      const url = match[1];
      if (url.startsWith("http") || url.startsWith("#") || url.startsWith("mailto:")) continue;
      assert.ok(!url.startsWith("/"), `${page}: percorso assoluto ${url}`);
    }
    assert.doesNotMatch(html, /href="tel:/, `${page}: numero telefonico cliccabile`);
    assert.doesNotMatch(html, /\+39 327 789/, `${page}: numero visibile in pagina`);
  }
});

test("ogni pagina ha un solo h1, un main, lo skip link e nessun id duplicato", () => {
  for (const page of pages) {
    const html = readPage(page);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);

    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${page}: h1 non unico`);
    assert.match(html, /<main id="main-content" tabindex="-1">/, page);
    assert.match(html, /class="skip-link" href="#main-content"/, page);
    assert.equal(new Set(ids).size, ids.length, `${page}: id duplicati`);
  }
});
