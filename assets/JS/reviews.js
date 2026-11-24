/**
 * Recensioni: carosello a schede verticali 9:16, lettura completa, invio con
 * Google e foto. Senza JavaScript restano le recensioni già nell'HTML e lo
 * scorrimento a mano; il form è un miglioramento progressivo.
 */

const API = {
  reviews: "api/reviews",
  session: "api/auth/session",
  login: "api/auth/google/start",
  logout: "api/auth/logout",
  photo: (id) => `api/photos/${encodeURIComponent(id)}`,
};

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MAX_BODY = 700;

export async function setupReviews() {
  const box = document.querySelector("[data-reviews]");
  if (!box) return;

  const viewport = box.querySelector("[data-reviews-viewport]");
  const track = box.querySelector("[data-reviews-track]");
  const prev = box.querySelector("[data-reviews-prev]");
  const next = box.querySelector("[data-reviews-next]");
  const dotsBox = box.querySelector("[data-reviews-dots]");
  const count = box.querySelector("[data-reviews-count]");
  if (!viewport || !track) return;

  const gsap = window.gsap;
  const dots = [];
  const feed = new Map();
  let slides = [...track.children];
  let index = 0;
  let tween = null;
  // Destinazione di uno scorrimento comandato: finché è impostata, il
  // contatore resta sulla scheda scelta invece di seguire le intermedie.
  let scrollingTo = null;
  let focusSlide = null;
  let filtered = false;
  let settleTimer = 0;

  // Cambio automatico: lento abbastanza da leggere una scheda intera. Si
  // ferma con il puntatore sopra, con il focus dentro, con una finestra
  // aperta o la scheda del browser in secondo piano.
  const AUTOPLAY_MS = 6000;
  let autoTimer = 0;
  let autoResumeAt = 0;
  let hovering = false;

  /* ---------- Carosello ---------- */

  function buildDots() {
    if (!dotsBox) return;
    dotsBox.replaceChildren();
    dots.length = 0;

    slides.forEach((slide, i) => {
      const item = document.createElement("li");
      const dot = document.createElement("button");
      dot.type = "button";
      const label = slide.getAttribute("aria-label");
      dot.setAttribute(
        "aria-label",
        label ? `Vai a: ${label}` : `Vai alla diapositiva ${i + 1} di ${slides.length}`,
      );
      dot.addEventListener("click", () => manualGoTo(i));
      item.append(dot);
      dotsBox.append(item);
      dots.push(dot);
    });
  }

  function offsetOf(i) {
    const target =
      slides[i].offsetLeft + slides[i].offsetWidth / 2 - viewport.clientWidth / 2;
    const max = viewport.scrollWidth - viewport.clientWidth;
    return Math.max(0, Math.min(target, max));
  }

  function dimActive() {
    const stepped = slides[0]?.offsetWidth < viewport.clientWidth - 8;
    return stepped && !prefersReducedMotion();
  }

  function distanceRatio(slide, center) {
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    return Math.min(1, Math.abs(slideCenter - center) / slide.offsetWidth);
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

  /**
   * Le laterali restano leggibili: solo più piccole. Rotazione e profondità
   * spostavano il loro bordo sopra il testo della scheda attiva, rendendolo
   * illeggibile (la profondità tira le schede verso il centro del binario).
   */
  function paint() {
    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    const dim = dimActive();

    slides.forEach((slide) => {
      const ratio =
        dim && slide !== focusSlide ? distanceRatio(slide, center) : 0;
      const scale = 1 - 0.1 * ratio;

      if (gsap) {
        gsap.set(slide, { scale, transformOrigin: "50% 50%" });
      } else {
        slide.style.transform = `scale(${scale})`;
      }
    });
  }

  function settle() {
    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    const dim = dimActive();
    let any = false;

    for (const slide of slides) {
      let blur = 0;
      if (dim && slide !== focusSlide) {
        const ratio = distanceRatio(slide, center);
        if (ratio > 0.02) blur = ratio * 0.5;
      }
      applyFilter(slide, blur);
      if (blur > 0) any = true;
    }

    filtered = any;
  }

  function scheduleSettle() {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settle, 160);
  }

  function setScroll(left, animated) {
    if (!animated || prefersReducedMotion()) {
      scrollingTo = null;
      viewport.scrollLeft = left;
      settle();
      return;
    }
    if (!gsap) {
      scrollingTo = left;
      viewport.scrollTo({ left, behavior: "smooth" });
      window.setTimeout(() => {
        scrollingTo = null;
      }, 900);
      return;
    }

    if (tween) tween.kill();
    scrollingTo = left;
    const state = { left: viewport.scrollLeft };
    viewport.style.scrollSnapType = "none";
    tween = gsap.to(state, {
      left,
      duration: 0.85,
      ease: "power3.inOut",
      onUpdate: () => {
        viewport.scrollLeft = state.left;
      },
      onComplete: () => {
        scrollingTo = null;
        viewport.style.scrollSnapType = "";
        settle();
      },
    });
  }

  function setActive(i) {
    if (!slides.length) return;
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

  /** Dopo un comando esplicito il cambio automatico tace più a lungo: si sta leggendo. */
  function manualGoTo(i) {
    holdAutoplay(AUTOPLAY_MS * 2);
    goTo(i);
  }

  /** La fila cambia da sola solo quando è davvero nella finestra. */
  function boxIsOnScreen() {
    const area = box.getBoundingClientRect();
    return area.bottom > 80 && area.top < window.innerHeight - 80;
  }

  function autoplayAllowed() {
    if (prefersReducedMotion() || document.hidden) return false;
    if (!boxIsOnScreen()) return false;
    if (hovering) return false;
    if (box.contains(document.activeElement)) return false;
    if (document.querySelector("dialog[open]")) return false;
    if (Date.now() < autoResumeAt) return false;
    return slides.length > 1;
  }

  /**
   * Il controllo gira a ogni giro anche mentre è in pausa: così il carosello
   * riparte da solo appena la condizione cade, senza dipendere da un evento
   * di uscita che può non arrivare (finestra non in primo piano, focus
   * spostato da script).
   */
  function scheduleAutoplay() {
    window.clearTimeout(autoTimer);
    autoTimer = window.setTimeout(autoplayTick, AUTOPLAY_MS);
  }

  function autoplayTick() {
    if (autoplayAllowed()) goTo(index + 1);
    scheduleAutoplay();
  }

  function holdAutoplay(ms) {
    autoResumeAt = Date.now() + ms;
    scheduleAutoplay();
  }

  /**
   * Ricostruisce linee e indice delle schede. Con `keepSlide` la scheda che si
   * stava leggendo resta al centro: le recensioni aggiunte davanti non
   * spostano la vista. L'allineamento avviene nello stesso frame della
   * modifica al DOM, così non si vede nessun salto.
   */
  function refresh(keepSlide = null) {
    slides = [...track.children];
    buildDots();
    const at = keepSlide ? slides.indexOf(keepSlide) : -1;
    index = at >= 0 ? at : 0;
    setActive(index);
    setScroll(offsetOf(index), false);
    paint();
    settle();
  }

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
        if (scrollingTo === null && closest !== index) setActive(closest);
        clearFilters();
        paint();
        scheduleSettle();
      });
    },
    { passive: true },
  );

  const step = (delta) => manualGoTo(index + delta);
  if (prev) prev.addEventListener("click", () => step(-1));
  if (next) next.addEventListener("click", () => step(1));

  viewport.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    step(event.key === "ArrowRight" ? 1 : -1);
  });

  track.addEventListener("click", (event) => {
    if (event.target.closest("a, button")) return;
    const slide = event.target.closest(".review");
    if (!slide || slide === slides[index]) return;
    manualGoTo(slides.indexOf(slide));
  });

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

  box.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "touch") return;
    hovering = true;
    scheduleAutoplay();
  });

  box.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "touch") return;
    hovering = false;
    scheduleAutoplay();
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

  for (const button of [prev, next]) if (button) button.hidden = false;
  if (dotsBox) dotsBox.hidden = false;
  if (count) count.hidden = false;
  box.classList.add("is-focus");

  /* ---------- Recensioni pubbliche ---------- */

  function cardFor(review) {
    feed.set(review.id, review);

    const item = document.createElement("li");
    item.className = "review review-user";
    item.dataset.reviewId = review.id;
    item.setAttribute("aria-roledescription", "diapositiva");
    item.setAttribute("aria-label", `Recensione di ${review.name}`);

    const card = document.createElement("figure");
    card.className = "review-card";

    if (review.photos?.length) {
      const photos = document.createElement("button");
      photos.type = "button";
      photos.className = "review-photos";
      photos.dataset.reviewOpen = "";
      photos.dataset.count = String(Math.min(review.photos.length, 3));
      photos.setAttribute("aria-label", `Apri le foto di ${review.name}`);

      review.photos.slice(0, MAX_PHOTOS).forEach((photo, i) => {
        const img = document.createElement("img");
        img.src = API.photo(photo.id);
        img.alt = `Foto ${i + 1} di ${review.name}`;
        img.loading = "lazy";
        img.decoding = "async";
        photos.append(img);
      });
      card.append(photos);
    }

    const mark = document.createElement("span");
    mark.className = "review-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = "“";

    const quote = document.createElement("blockquote");
    quote.className = "review-quote";
    const paragraph = document.createElement("p");
    paragraph.textContent = review.body;
    quote.append(paragraph);

    const meta = document.createElement("figcaption");
    meta.className = "review-meta";

    const name = document.createElement("span");
    name.className = "review-name";
    name.textContent = review.name;

    const badge = document.createElement("span");
    badge.className = "review-badge";
    badge.textContent = "Verificata con Google";

    const role = document.createElement("span");
    role.className = "review-role";
    role.textContent = review.percorso
      ? `${review.percorso} · Recensione Google`
      : "Recensione Google";

    const more = document.createElement("button");
    more.type = "button";
    more.className = "review-more";
    more.dataset.reviewOpen = "";
    more.textContent = "Leggi tutto";

    meta.append(name, badge, role, more);
    card.append(mark, quote, meta);
    item.append(card);
    return item;
  }

  async function loadFeed() {
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 2500);
    try {
      const response = await fetch(API.reviews, {
        headers: { accept: "application/json" },
        signal: controller.signal,
      });
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data.reviews) ? data.reviews : [];
    } catch {
      return [];
    } finally {
      window.clearTimeout(timer);
    }
  }

  /* ---------- Lettura completa ---------- */

  const readDialog = document.querySelector("[data-review-read]");
  const readName = readDialog?.querySelector("[data-read-name]");
  const readRole = readDialog?.querySelector("[data-read-role]");
  const readQuote = readDialog?.querySelector("[data-read-quote]");
  const readPhotos = readDialog?.querySelector("[data-read-photos]");

  function openReader(card) {
    if (!readDialog) return;
    const id = card.dataset.reviewId;
    const review = id ? feed.get(id) : null;

    const quote = review
      ? review.body
      : card.querySelector(".review-quote")?.textContent?.trim() || "";
    const name = review
      ? review.name
      : card.querySelector(".review-name")?.textContent?.trim() || "";
    const role = review
      ? review.percorso
        ? `${review.percorso} · Recensione verificata con Google`
        : "Recensione verificata con Google"
      : card.querySelector(".review-role")?.textContent?.trim() || "";

    if (readName) readName.textContent = name;
    if (readRole) readRole.textContent = role;
    if (readQuote) readQuote.textContent = quote;

    if (readPhotos) {
      readPhotos.replaceChildren();
      const photos = review?.photos || [];
      readPhotos.hidden = photos.length === 0;
      photos.slice(0, MAX_PHOTOS).forEach((photo, i) => {
        const img = document.createElement("img");
        img.src = API.photo(photo.id);
        img.alt = `Foto ${i + 1} di ${name}`;
        img.loading = "lazy";
        readPhotos.append(img);
      });
    }

    readDialog.showModal();
  }

  track.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-review-open]");
    if (!trigger) return;
    const card = trigger.closest(".review");
    if (card) openReader(card);
  });

  /* ---------- Invio di una recensione ---------- */

  const writeButtons = [...document.querySelectorAll("[data-review-write]")];
  const formDialog = document.querySelector("[data-review-form-dialog]");
  const gate = formDialog?.querySelector("[data-review-gate]");
  const form = formDialog?.querySelector("[data-review-form-el]");
  const success = formDialog?.querySelector("[data-review-success]");
  const loginLink = formDialog?.querySelector("[data-review-login]");
  const logoutButton = formDialog?.querySelector("[data-review-logout]");
  const status = formDialog?.querySelector("[data-review-status]");
  const userLabel = formDialog?.querySelector("[data-review-user]");
  const photoInput = formDialog?.querySelector("[data-review-photos]");
  const photoList = formDialog?.querySelector("[data-review-photo-list]");
  const bodyField = formDialog?.querySelector("[name=body]");
  const submit = form?.querySelector("[type=submit]");
  const pathField = form?.querySelector("[name=percorso]");
  const previewQuote = formDialog?.querySelector("[data-preview-quote]");
  const previewName = formDialog?.querySelector("[data-preview-name]");
  const previewRole = formDialog?.querySelector("[data-preview-role]");

  let session = null;
  let sessionLoaded = false;
  let photos = [];
  let sending = false;

  function showGate(message) {
    if (gate) gate.hidden = false;
    if (form) form.hidden = true;
    if (success) success.hidden = true;
    if (status) status.textContent = message || "";
  }

  function showForm(user) {
    session = user;
    if (gate) gate.hidden = true;
    if (form) form.hidden = false;
    if (success) success.hidden = true;
    if (userLabel) userLabel.textContent = user.name || "il tuo account Google";
    updatePreview();
  }

  /** Riepilogo dal vivo: testo, nome del titolare e percorso della recensione. */
  function updatePreview() {
    const text = bodyField ? bodyField.value.trim() : "";
    if (previewQuote) {
      previewQuote.textContent =
        text || "Il testo della recensione comparirà qui mentre scrivi.";
      previewQuote.classList.toggle("is-empty", !text);
    }
    if (previewName) previewName.textContent = session?.name || "Il tuo nome";
    if (previewRole) {
      const percorso = pathField?.value || "";
      previewRole.textContent = percorso
        ? `${percorso} · Recensione Google`
        : "Recensione Google";
    }
  }

  async function syncSession(force = false) {
    if (sessionLoaded && !force) {
      if (session) showForm(session);
      else showGate("");
      return;
    }
    sessionLoaded = true;
    try {
      const response = await fetch(API.session, {
        headers: { accept: "application/json" },
      });
      const data = response.ok ? await response.json() : { user: null };
      session = data.user || null;
    } catch {
      session = null;
    }
    if (session) showForm(session);
    else showGate("");
  }

  function openForm(message) {
    if (!formDialog) return;
    if (!formDialog.open) formDialog.showModal();
    syncSession(true).then(() => {
      if (message && status) status.textContent = message;
    });
  }

  const loginNext = `${window.location.pathname}?recensione=login#recensioni`;
  if (loginLink) loginLink.href = `${API.login}?next=${encodeURIComponent(loginNext)}`;
  for (const button of writeButtons) {
    button.addEventListener("click", () => openForm(""));
  }

  const params = new URLSearchParams(window.location.search);
  const outcome = params.get("recensione");
  if (outcome) {
    const messages = {
      annullato: "Accesso annullato: puoi riprovare quando vuoi.",
      errore: "Accesso non riuscito. Riprova tra poco.",
    };
    window.history.replaceState({}, "", window.location.pathname + window.location.hash);
    if (formDialog) {
      window.setTimeout(() => openForm(messages[outcome] || ""), 400);
    }
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      await fetch(API.logout, { method: "POST" }).catch(() => {});
      session = null;
      sessionLoaded = false;
      showGate("");
      syncSession();
    });
  }

  async function preparePhoto(file) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      throw new Error("type");
    }
    const bitmap = await createImageBitmap(file);
    const max = 1600;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!blob) throw new Error("resize");
    return new File([blob], "foto.jpg", { type: "image/jpeg" });
  }

  function renderPhotos() {
    if (!photoList) return;
    photoList.replaceChildren();
    photos.forEach((photo, i) => {
      const item = document.createElement("div");
      item.className = "review-photo-preview";
      const img = document.createElement("img");
      img.src = URL.createObjectURL(photo);
      img.alt = `Foto ${i + 1} da pubblicare`;
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Rimuovi la foto ${i + 1}`);
      remove.addEventListener("click", () => {
        URL.revokeObjectURL(img.src);
        photos.splice(i, 1);
        renderPhotos();
      });
      item.append(img, remove);
      photoList.append(item);
    });
  }

  if (photoInput) {
    photoInput.addEventListener("change", async () => {
      if (status) status.textContent = "";
      const chosen = [...photoInput.files];
      photoInput.value = "";

      for (const file of chosen) {
        if (photos.length >= MAX_PHOTOS) {
          if (status) status.textContent = `Puoi allegare al massimo ${MAX_PHOTOS} foto.`;
          break;
        }
        if (file.size > MAX_PHOTO_BYTES) {
          if (status) status.textContent = "Ogni foto deve pesare al massimo 5 MB.";
          continue;
        }
        try {
          photos.push(await preparePhoto(file));
        } catch {
          if (status) status.textContent = "Una foto non è leggibile: usa JPEG, PNG o WebP.";
        }
      }
      renderPhotos();
    });
  }

  if (bodyField) {
    bodyField.addEventListener("input", () => {
      const counter = formDialog?.querySelector("[data-review-counter]");
      if (counter) counter.textContent = `${bodyField.value.length} / ${MAX_BODY}`;
      updatePreview();
    });
  }

  if (pathField) pathField.addEventListener("change", updatePreview);

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (sending) return;

      const body = bodyField ? bodyField.value.trim() : "";
      if (body.length < 40) {
        if (status) status.textContent = "Racconta l'esperienza in almeno 40 caratteri.";
        return;
      }

      sending = true;
      if (submit) submit.disabled = true;
      if (status) status.textContent = "Invio in corso…";

      const data = new FormData();
      data.set("body", body);
      data.set("percorso", form.elements.percorso?.value || "");
      data.set("consent", form.elements.consent?.checked ? "true" : "false");
      photos.forEach((photo) => data.append("photos", photo, "foto.jpg"));

      try {
        const response = await fetch(API.reviews, { method: "POST", body: data });
        const payload = await response.json().catch(() => ({}));

        if (response.status === 201) {
          form.hidden = true;
          if (success) success.hidden = false;
          if (status) status.textContent = "";
          form.reset();
          photos = [];
          renderPhotos();
          updatePreview();
        } else if (response.status === 401) {
          session = null;
          sessionLoaded = false;
          showGate("La sessione è scaduta: accedi di nuovo con Google.");
        } else {
          if (status) {
            status.textContent =
              payload.message || "Invio non riuscito. Riprova tra poco.";
          }
        }
      } catch {
        if (status) status.textContent = "Connessione assente: riprova tra poco.";
      } finally {
        sending = false;
        if (submit) submit.disabled = false;
      }
    });
  }

  for (const dialog of [readDialog, formDialog]) {
    if (!dialog) continue;
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    for (const button of dialog.querySelectorAll("[data-modal-close]")) {
      button.addEventListener("click", () => dialog.close());
    }
    dialog.addEventListener("close", scheduleAutoplay);
  }

  /* ---------- Avvio ---------- */

  // Il carosello si accende subito sulle recensioni già nell'HTML: frecce,
  // linee di avanzamento e centratura non aspettano la risposta della rete.
  refresh();

  // Le recensioni pubblicate si aggiungono davanti quando arrivano; la scheda
  // in lettura resta la stessa e al centro.
  const approved = await loadFeed();
  if (approved.length) {
    const current = slides[index];
    const fragment = document.createDocumentFragment();
    for (const review of approved) fragment.append(cardFor(review));
    track.prepend(fragment);
    refresh(current);
  }

  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      setScroll(offsetOf(index), false);
      paint();
      settle();
    });
  }

  scheduleAutoplay();
}
