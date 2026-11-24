import { routerKey, waMessages, whatsappNumber } from "./content.js?v=20261124-3";
import { createWhatsAppUrl } from "./whatsapp.mjs";
import { setupReviews } from "./reviews.js?v=20261124-9";

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

/**
 * Video di presentazione: il tasto sopra il poster avvia la riproduzione.
 * Senza JavaScript il video resta utilizzabile con i comandi nativi.
 */
function setupHeroVideo() {
  const video = document.querySelector("[data-hero-video]");
  const play = document.querySelector("[data-hero-play]");
  if (!video || !play) return;

  play.addEventListener("click", () => {
    play.hidden = true;
    video.play();
  });
}

/**
 * Segna nella navigazione la sezione che si sta leggendo. Solo homepage:
 * nelle pagine dei corpi le voci puntano alle sezioni della homepage.
 */
function setupNavCurrent() {
  const links = [...document.querySelectorAll('.site-nav-list a[href^="#"]')];
  if (!links.length || !("IntersectionObserver" in window)) return;

  const bySection = new Map();
  for (const link of links) {
    const section = document.querySelector(link.getAttribute("href"));
    if (section) bySection.set(section, link);
  }
  if (!bySection.size) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        for (const link of bySection.values()) link.removeAttribute("aria-current");
        bySection.get(entry.target).setAttribute("aria-current", "true");
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );

  for (const section of bySection.keys()) observer.observe(section);
}

/**
 * Video delle schede: il tasto sopra il poster avvia la riproduzione e mette in
 * pausa gli altri video della pagina. Senza JavaScript restano i comandi nativi.
 */
function setupVideoCards() {
  const buttons = [...document.querySelectorAll("[data-video-play]")];
  if (!buttons.length) return;

  const videos = [...document.querySelectorAll("video")];
  const pauseOthers = (current) => {
    for (const video of videos) {
      if (video !== current && !video.paused) video.pause();
    }
  };

  for (const button of buttons) {
    const card = button.closest(".video-card");
    const video = card && card.querySelector("video");
    if (!video) continue;

    button.addEventListener("click", () => {
      pauseOthers(video);
      video.play();
    });
    video.addEventListener("play", () => {
      pauseOthers(video);
      button.hidden = true;
    });
    video.addEventListener("pause", () => {
      button.hidden = false;
    });
    video.addEventListener("ended", () => {
      video.currentTime = 0;
      button.hidden = false;
    });
  }
}

/**
 * Scorrimento fluido con Lenis (MIT, copia locale in assets/vendor).
 * Lavora sullo scroll nativo, quindi ancore, sticky e tastiera restano validi.
 * Con prefers-reduced-motion, senza la libreria o senza JavaScript resta lo
 * scorrimento del browser.
 */
async function setupSmoothScroll() {
  if (prefersReducedMotion()) return;

  let Lenis;
  try {
    ({ default: Lenis } = await import("../vendor/lenis.mjs"));
  } catch {
    return;
  }

  const lenis = new Lenis({ autoRaf: true, duration: 1.05 });

  // Le ancore passano da Lenis, che rispetta lo scroll-padding-top del CSS
  // (lo scarto dell'header). Lo skip link resta al browser: deve spostare il focus.
  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.classList.contains("skip-link")) return;
    const hash = link.getAttribute("href");
    const target = hash && hash.length > 1 ? document.querySelector(hash) : null;
    if (!target) return;

    event.preventDefault();
    lenis.scrollTo(target, { duration: 1.05 });
    history.replaceState(null, "", hash);
  });
}

/**
 * Ingresso delle sezioni allo scorrimento: con GSAP disponibile l'animazione è
 * una sua timeline, altrimenti valgono le transizioni CSS. Disattivabile e non
 * bloccante.
 */
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

  const gsap = window.gsap;
  if (gsap) root.classList.add("gsap");

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const item = entry.target;
        observer.unobserve(item);
        if (!gsap) {
          item.classList.add("is-in");
          continue;
        }
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "expo.out",
          delay: Number(item.style.getPropertyValue("--i") || 0) * 0.07,
        });
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
setupHeroVideo();
setupVideoCards();
setupNavCurrent();
setupRouter();
setupReviews();
setupReveal();
setupSmoothScroll();
