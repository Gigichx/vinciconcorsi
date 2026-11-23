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
 * Recensioni: la fila si scorre a mano anche senza JavaScript (snap in CSS).
 * Con lo script i tasti, le linee di avanzamento e la tastiera spostano la
 * vista; con GSAP il movimento è interpolato, altrimenti vale lo scorrimento
 * fluido del browser. Nulla si muove da solo.
 */
function setupReviews() {
  const box = document.querySelector("[data-reviews]");
  if (!box) return;

  const viewport = box.querySelector("[data-reviews-viewport]");
  const track = box.querySelector("[data-reviews-track]");
  const prev = box.querySelector("[data-reviews-prev]");
  const next = box.querySelector("[data-reviews-next]");
  const dotsBox = box.querySelector("[data-reviews-dots]");
  const count = box.querySelector("[data-reviews-count]");
  if (!viewport || !track) return;

  const slides = [...track.children];
  if (slides.length < 2) return;

  const gsap = window.gsap;
  const dots = [];
  let index = 0;
  let tween = null;

  if (dotsBox) {
    slides.forEach((slide, i) => {
      const item = document.createElement("li");
      const dot = document.createElement("button");
      dot.type = "button";
      const label = slide.getAttribute("aria-label");
      dot.setAttribute(
        "aria-label",
        label ? `Vai a: ${label}` : `Vai alla diapositiva ${i + 1} di ${slides.length}`,
      );
      dot.addEventListener("click", () => goTo(i));
      item.append(dot);
      dotsBox.append(item);
      dots.push(dot);
    });
  }

  /**
   * Scarto che porta la diapositiva al centro della vista, entro i limiti dello
   * scorrimento. Usa la posizione di layout (offsetLeft) e non il rettangolo,
   * che la scala del fuoco sposterebbe.
   */
  function offsetOf(i) {
    const target =
      slides[i].offsetLeft + slides[i].offsetWidth / 2 - viewport.clientWidth / 2;
    const max = viewport.scrollWidth - viewport.clientWidth;
    return Math.max(0, Math.min(target, max));
  }

  /**
   * Fuoco del carosello, variante a profondità: la diapositiva al centro resta
   * piena, le laterali arretrano e si inclinano come in un cover-flow. Opacità,
   * scala, rotazione e profondità seguono lo scorrimento con continuità; la
   * sfocatura, più costosa da ridisegnare, si applica solo a scorrimento fermo.
   * Con una diapositiva per volta (sotto 861px) o con il movimento ridotto non
   * c'è nulla da arretrare.
   */
  let focusSlide = null;
  let filtered = false;
  let settleTimer = 0;

  function dimActive() {
    const stepped = slides[0].offsetWidth < viewport.clientWidth - 8;
    return stepped && !prefersReducedMotion();
  }

  function ratioOf(slide, center) {
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    return {
      ratio: Math.min(1, Math.abs(slideCenter - center) / slide.offsetWidth),
      dir: Math.sign(slideCenter - center),
    };
  }

  function applyFilter(slide, blur) {
    const filter = blur > 0 ? `blur(${blur.toFixed(2)}px)` : "none";
    if (gsap) gsap.set(slide, { filter });
    else slide.style.filter = filter;
    if (blur > 0) filtered = true;
  }

  function clearFilters() {
    if (!filtered) return;
    filtered = false;
    for (const slide of slides) applyFilter(slide, 0);
  }

  /** Posizione e trasformazioni continue: nessun filtro qui. */
  function paint() {
    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    const dim = dimActive();

    slides.forEach((slide) => {
      let ratio = 0;
      let dir = 0;
      if (dim && slide !== focusSlide) ({ ratio, dir } = ratioOf(slide, center));

      const opacity = 1 - 0.4 * ratio;
      const scale = 1 - 0.16 * ratio;
      const rotationY = -dir * 14 * ratio;
      const z = -160 * ratio;

      if (gsap) {
        gsap.set(slide, {
          opacity,
          scale,
          rotationY,
          z,
          transformOrigin: "50% 50%",
        });
      } else {
        slide.style.opacity = String(opacity);
        slide.style.transform = `translateZ(${z}px) rotateY(${rotationY}deg) scale(${scale})`;
      }
    });
  }

  /** Sfocatura delle sole laterali, calcolata quando la vista è ferma. */
  function settle() {
    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    const dim = dimActive();
    let any = false;

    for (const slide of slides) {
      let blur = 0;
      if (dim && slide !== focusSlide) {
        const { ratio } = ratioOf(slide, center);
        if (ratio > 0.02) blur = ratio * 1.4;
      }
      const filter = blur > 0 ? `blur(${blur.toFixed(2)}px)` : "none";
      if (gsap) gsap.set(slide, { filter });
      else slide.style.filter = filter;
      if (blur > 0) any = true;
    }

    filtered = any;
  }

  function scheduleSettle() {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settle, 160);
  }

  function setScroll(left, animated) {
    const reduce = prefersReducedMotion();
    if (!animated || reduce) {
      viewport.scrollLeft = left;
      settle();
      return;
    }
    if (!gsap) {
      viewport.scrollTo({ left, behavior: "smooth" });
      return;
    }

    if (tween) tween.kill();
    const state = { left: viewport.scrollLeft };
    // Lo snap resta spento durante l'interpolazione, altrimenti la vista salta.
    viewport.style.scrollSnapType = "none";
    tween = gsap.to(state, {
      left,
      duration: 0.85,
      ease: "power3.inOut",
      onUpdate: () => {
        viewport.scrollLeft = state.left;
      },
      onComplete: () => {
        viewport.style.scrollSnapType = "";
        settle();
      },
    });
  }

  function setActive(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((slide, n) => {
      slide.classList.toggle("is-active", n === index);
    });
    dots.forEach((dot, n) => {
      if (n === index) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    if (count) {
      const total = String(slides.length).padStart(2, "0");
      count.textContent = `${String(index + 1).padStart(2, "0")} / ${total}`;
    }
  }

  function goTo(i, animated = true) {
    setActive(i);
    clearFilters();
    paint();
    setScroll(offsetOf(index), animated);
  }

  // Il trascinamento a mano aggiorna le linee di avanzamento.
  let frame = 0;
  viewport.addEventListener(
    "scroll",
    () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const center = viewport.scrollLeft + viewport.clientWidth / 2;
        let closest = index;
        let best = Infinity;
        slides.forEach((slide, n) => {
          const distance = Math.abs(
            slide.offsetLeft + slide.offsetWidth / 2 - center,
          );
          if (distance < best) {
            best = distance;
            closest = n;
          }
        });
        if (closest !== index) setActive(closest);
        clearFilters();
        paint();
        scheduleSettle();
      });
    },
    { passive: true },
  );

  const step = (delta) => goTo(index + delta);

  if (prev) prev.addEventListener("click", () => step(-1));
  if (next) next.addEventListener("click", () => step(1));

  viewport.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    step(event.key === "ArrowRight" ? 1 : -1);
  });

  // Il clic su una laterale la porta al centro; i link dentro restano link.
  track.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    const slide = event.target.closest(".review");
    if (!slide || slide === slides[index]) return;
    goTo(slides.indexOf(slide));
  });

  // Con la tastiera la diapositiva in cui entra il focus torna piena.
  track.addEventListener("focusin", (event) => {
    focusSlide = event.target.closest(".review");
    paint();
    settle();
  });

  track.addEventListener("focusout", () => {
    focusSlide = null;
    paint();
    settle();
  });

  let resizeFrame = 0;
  window.addEventListener("resize", () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      setScroll(offsetOf(index), false);
      clearFilters();
      paint();
      settle();
    });
  });

  for (const button of [prev, next]) {
    if (button) button.hidden = false;
  }
  if (dotsBox) dotsBox.hidden = false;
  if (count) count.hidden = false;

  box.classList.add("is-focus");
  setActive(0);
  setScroll(offsetOf(0), false);
  paint();
  settle();

  // I font cambiano la larghezza dei testi: si ricentra quando sono pronti.
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      setScroll(offsetOf(index), false);
      paint();
      settle();
    });
  }
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
