import test from "node:test";
import assert from "node:assert/strict";
import { createWhatsAppUrl } from "../assets/JS/whatsapp.mjs";

test("builds a wa.me link with a validated international number and encoded message", () => {
  const url = createWhatsAppUrl("+393331234567", "Ciao, vorrei informazioni per acquistare [MANUALE].");
  assert.equal(
    url,
    "https://wa.me/393331234567?text=Ciao%2C%20vorrei%20informazioni%20per%20acquistare%20%5BMANUALE%5D.",
  );
});

test("does not create a contact link for missing or invalid numbers", () => {
  assert.equal(createWhatsAppUrl(null, "Ciao"), null);
  assert.equal(createWhatsAppUrl("12345", "Ciao"), null);
  assert.equal(createWhatsAppUrl("+0123456789", "Ciao"), null);
});
