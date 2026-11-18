import { routerKey, waMessages, whatsappNumber } from "./content.js";
import { createWhatsAppUrl } from "./whatsapp.mjs";

const root = document.documentElement;
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Gli href WhatsApp esistono già nell'HTML e funzionano senza JavaScript.
 * Qui vengono rigenerati dai contenuti, così numero e messaggi restano in un
 * unico posto.
 */
function setWhatsAppLink(link, key) {
  const message = waMessages[key];
  if (!message) return;
  const url = createWhatsAppUrl(whatsappNumber, message);
  if (url) link.href = url;
}

function hydrateWhatsAppLinks() {
  for (const link of document.querySelectorAll("[data-wa]")) {
    setWhatsAppLink(link, link.dataset.wa);
  }
}

/** Menu mobile: apre, chiude con Escape o al clic su una voce, ripristina il focus. */
function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  };
  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";

  toggle.addEventListener("click", () => setOpen(!isOpen()));

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !isOpen()) return;
    setOpen(false);
    toggle.focus();
  });

  // Stesso breakpoint del CSS: tornando al layout desktop il pannello si chiude.
  window
    .matchMedia("(min-width: 961px)")
    .addEventListener("change", (event) => {
      if (event.matches) setOpen(false);
    });
}

/** Ingresso delle sezioni allo scorrimento, disattivabile e non bloccante. */
function setupReveal() {
  const items = [...document.querySelectorAll(".reveal")];
  if (!items.length) return;

  if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-in"));
    return;
  }

  for (const item of items) {
    const siblings = [...item.parentElement.children].filter((node) =>
      node.classList.contains("reveal"),
    );
    item.style.setProperty("--i", String(Math.min(siblings.indexOf(item), 4)));
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
  );

  items.forEach((item) => observer.observe(item));
  // Solo dopo aver osservato tutto: se qualcosa fallisce, il contenuto resta visibile.
  root.classList.add("motion-on");
}

/**
 * Selettore della homepage: due scelte e il link WhatsApp cambia messaggio.
 * Senza JavaScript il blocco resta nascosto e valgono i pulsanti statici.
 */
function setupRouter() {
  const router = document.querySelector("[data-router]");
  if (!router) return;

  const corpo = router.querySelector('[data-router="corpo"]');
  const bisogno = router.querySelector('[data-router="bisogno"]');
  const cta = router.querySelector("[data-router-cta]");
  if (!corpo || !bisogno || !cta) return;

  const update = () => {
    setWhatsAppLink(cta, routerKey(corpo.value, bisogno.value));
  };

  corpo.addEventListener("change", update);
  bisogno.addEventListener("change", update);
  update();
  router.hidden = false;
}

// Solo con lo script in esecuzione il menu diventa a scomparsa: senza
// JavaScript la navigazione resta visibile e utilizzabile.
root.classList.add("enhanced");

hydrateWhatsAppLinks();
setupMenu();
setupRouter();
setupReveal();
