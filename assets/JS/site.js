import { waMessages, whatsappNumber } from "./content.js";
import { createWhatsAppUrl } from "./whatsapp.mjs";

const root = document.documentElement;
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Gli href WhatsApp esistono già nell'HTML e funzionano senza JavaScript.
 * Qui vengono rigenerati dai contenuti, così numero e messaggi restano in un
 * unico posto.
 */
function hydrateWhatsAppLinks() {
  for (const link of document.querySelectorAll("[data-wa]")) {
    const message = waMessages[link.dataset.wa];
    if (!message) continue;
    const url = createWhatsAppUrl(whatsappNumber, message);
    if (url) link.href = url;
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

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !nav.classList.contains("is-open")) return;
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

/** Parallasse leggera sull'artwork dell'apertura, solo con puntatore preciso. */
function setupArtParallax() {
  const art = document.querySelector("[data-parallax]");
  if (!art || prefersReducedMotion()) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const clamp = (value) => Math.max(-1, Math.min(1, value));
  let frame = 0;
  let x = 0;
  let y = 0;

  window.addEventListener(
    "pointermove",
    (event) => {
      const rect = art.getBoundingClientRect();
      x = clamp((event.clientX - rect.left - rect.width / 2) / rect.width);
      y = clamp((event.clientY - rect.top - rect.height / 2) / rect.height);
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        art.style.setProperty("--px", `${(x * 9).toFixed(1)}px`);
        art.style.setProperty("--py", `${(y * 7).toFixed(1)}px`);
        frame = 0;
      });
    },
    { passive: true },
  );
}

// Solo con lo script in esecuzione il menu diventa a scomparsa: senza
// JavaScript la navigazione resta visibile e utilizzabile.
root.classList.add("enhanced");

hydrateWhatsAppLinks();
setupMenu();
setupReveal();
setupArtParallax();
