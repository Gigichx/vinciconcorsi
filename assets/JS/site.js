import { brand, waMessages } from "./content.js";
import { createWhatsAppUrl } from "./whatsapp.mjs";

const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

/**
 * I collegamenti WhatsApp esistono già nell'HTML (funzionano senza JavaScript).
 * Qui vengono rigenerati dal modulo dei contenuti, così numero e messaggi
 * restano in un unico posto.
 */
function hydrateWhatsAppLinks() {
  for (const link of document.querySelectorAll("[data-wa]")) {
    const message = waMessages[link.dataset.wa];
    if (!message) continue;
    const url = createWhatsAppUrl(brand.whatsappNumber, message);
    if (!url) continue;
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
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
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 960) setOpen(false);
  });

  setOpen(false);
}

/** Ingresso delle sezioni allo scorrimento, disattivabile e non bloccante. */
function setupReveal() {
  const items = [...document.querySelectorAll(".reveal")];
  if (!items.length) return;

  items.forEach((item) => {
    const siblings = [...(item.parentElement?.children ?? [])].filter((node) =>
      node.classList?.contains("reveal"),
    );
    const position = siblings.indexOf(item);
    item.style.setProperty("--i", String(Math.min(position < 0 ? 0 : position, 4)));
  });

  if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-in"));
    return;
  }

  root.classList.add("motion-on");

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

  // Rete di sicurezza: nulla deve restare nascosto se l'osservatore non scatta.
  window.setTimeout(() => {
    items.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight * 1.5) {
        item.classList.add("is-in");
      }
    });
  }, 1600);
}

/** Parallasse leggera sull'artwork dell'apertura, solo con puntatore preciso. */
function setupArtParallax() {
  const art = document.querySelector("[data-parallax]");
  if (!art) return;
  if (reduceMotion.matches || !window.matchMedia("(pointer: fine)").matches) return;

  let frame = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener(
    "pointermove",
    (event) => {
      const rect = art.getBoundingClientRect();
      const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
      const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
      targetX = Math.max(-1, Math.min(1, x));
      targetY = Math.max(-1, Math.min(1, y));
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        art.style.setProperty("--px", `${(targetX * 9).toFixed(1)}px`);
        art.style.setProperty("--py", `${(targetY * 7).toFixed(1)}px`);
        frame = 0;
      });
    },
    { passive: true },
  );
}

// Abilita il menu a scomparsa solo quando lo script è realmente in esecuzione:
// senza JavaScript la navigazione resta visibile e utilizzabile.
root.classList.add("enhanced");

hydrateWhatsAppLinks();
setupMenu();
setupReveal();
setupArtParallax();
