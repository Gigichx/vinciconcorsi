import { brand, catalog, community, pathways, previewMode, socials, videos } from "./content.js";
import { createWhatsAppUrl } from "./whatsapp.mjs";

const page = document.querySelector("[data-page]");
const currentPage = page?.dataset.page ?? "home";
const root = document.documentElement;
const bodyPathway = pathways.find((item) => item.id === currentPage);

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function whatsappUrl(message) {
  return createWhatsAppUrl(brand.whatsappNumber, message);
}

function requestMessage(kind, pathway, manual) {
  if (kind === "group") return `Ciao, vorrei richiedere l'accesso al gruppo di preparazione per ${pathway.name}.`;
  if (kind === "manual") {
    const title = manual && !manual.demonstrative ? manual.title : "[MANUALE]";
    return `Ciao, vorrei informazioni per acquistare ${title}.`;
  }
  if (kind === "general") return "Ciao, vorrei informazioni sulla preparazione per [CORPO].";
  return `Ciao, vorrei informazioni sulla preparazione per ${pathway.name}.`;
}

function contactAction({ kind = "info", pathway = pathways[0], manual = null, label, className = "" }) {
  const message = requestMessage(kind, pathway, manual);
  const purpose = kind === "group"
    ? `Richiesta di accesso al gruppo di preparazione per ${pathway.name}`
    : kind === "manual"
      ? `Informazioni per acquistare il manuale · ${pathway.name}`
      : kind === "general"
        ? "Informazioni sulla preparazione"
        : `Informazioni sulla preparazione per ${pathway.name}`;
  const href = whatsappUrl(message);
  if (href) {
    return `<a class="${className}" href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
  }
  return `<button class="${className}" type="button" data-contact data-purpose="${escapeHtml(purpose)}" data-message="${escapeHtml(message)}">${escapeHtml(label)}</button>`;
}

function renderHeader() {
  const links = currentPage === "home"
    ? [
      ["Percorsi", "#percorsi"],
      ["Manuali", "#manuali"],
      ["Video", "#video"],
      ["Contatti", "#contatti"],
    ]
    : [
      ["Percorsi", "/#percorsi"],
      ["Manuali", "/#manuali"],
      ["Video", "/#video"],
      ["Contatti", "/#contatti"],
    ];
  return `
    ${previewMode ? `<div class="preview-bar">${escapeHtml(brand.previewNotice)}</div>` : ""}
    <header class="site-header" id="top">
      <a class="wordmark" href="/" aria-label="${escapeHtml(brand.name)} — pagina iniziale">
        <span class="wordmark-mark" aria-hidden="true">V</span>
        <span>${escapeHtml(brand.name)}<small>Preparazione concorsi</small></span>
      </a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">
        <span class="menu-toggle-label">Menu</span><span class="menu-toggle-icon" aria-hidden="true"></span>
      </button>
      <nav class="primary-navigation" id="primary-navigation" aria-label="Navigazione principale">
        ${links.map(([label, href]) => `<a href="${href}">${label}</a>`).join("")}
        ${contactAction({ kind: bodyPathway ? "info" : "general", pathway: bodyPathway ?? pathways[0], label: "WhatsApp", className: "nav-contact" })}
      </nav>
    </header>`;
}

function renderVideoPlaceholder(label, index = "Video / 01", caption = "Spazio per il video di presentazione") {
  return `
    <div class="video-placeholder" role="group" aria-label="${escapeHtml(label)}">
      <div class="video-index">${escapeHtml(index)} <span>In preparazione</span></div>
      <div class="video-graphic" aria-hidden="true">
        <span class="video-rule"></span><span class="video-orbit"></span>
        <span class="video-graphic-word">VC</span>
        <span class="video-graphic-caption">Appunti<br>in movimento</span>
      </div>
      <div class="video-caption">
        <span class="eyebrow">${escapeHtml(label)}</span>
        <p>${escapeHtml(caption)}</p>
        <span class="pending-label">Video in preparazione</span>
      </div>
    </div>`;
}

function renderPathwayCard(pathway) {
  return `
    <a class="pathway-card accent-${pathway.accent}" href="/${pathway.id}/">
      <span class="card-index">${pathway.eyebrow}</span>
      <span class="pathway-card-title">${escapeHtml(pathway.name)}</span>
      <span class="pathway-card-description">${escapeHtml(pathway.description)}</span>
      <span class="text-link">Esplora il percorso <span aria-hidden="true">↗</span></span>
    </a>`;
}

function renderManualCard(manual) {
  const pathway = pathways.find((item) => item.id === manual.bodyId);
  const title = manual.title;
  return `
    <article class="manual-card">
      <div class="manual-cover accent-${pathway.accent}" aria-label="Copertina dimostrativa: ${escapeHtml(title)}">
        <span class="cover-topline">VINCI CONCORSI <span>· DEMO</span></span>
        <span class="cover-line" aria-hidden="true"></span>
        <span class="cover-title">${escapeHtml(manual.coverLabel)}</span>
        <span class="cover-subtitle">${escapeHtml(pathway.shortName)}</span>
        <span class="cover-footer">MATERIALE DIMOSTRATIVO</span>
      </div>
      <div class="manual-details">
        <span class="eyebrow">${escapeHtml(pathway.shortName)} · Manuale digitale</span>
        <h3>${escapeHtml(title)}</h3>
        <p class="manual-note">Titolo, contenuti e disponibilità da confermare.</p>
        <span class="digital-label">Manuale digitale · Nessuna spedizione</span>
        ${contactAction({ kind: "manual", pathway, manual, label: "Acquista su WhatsApp", className: "text-link button-link" })}
      </div>
    </article>`;
}

function renderCommunityCard(item) {
  const pathway = pathways.find((entry) => entry.id === item.bodyId);
  return `
    <article class="community-item accent-${pathway.accent}">
      <span class="eyebrow">Community · ${escapeHtml(pathway.shortName)}</span>
      <h3>${escapeHtml(item.name)}</h3>
      <p>${escapeHtml(item.affiliationNote)}</p>
      ${contactAction({ kind: "group", pathway, label: "Richiedi informazioni sul gruppo", className: "text-link button-link" })}
    </article>`;
}

function renderSocials() {
  return socials.map((social) => social.url
    ? `<a href="${escapeHtml(social.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(social.name)}</a>`
    : `<span class="inactive-social" aria-label="${escapeHtml(social.name)}: collegamento non ancora disponibile">${escapeHtml(social.name)} <small>in definizione</small></span>`).join("");
}

function renderFooter() {
  const homeUrl = currentPage === "home" ? "#top" : "/";
  return `
    <footer class="site-footer" id="contatti">
      <div class="footer-main">
        <div class="footer-brand">
          <a class="wordmark wordmark-light" href="/" aria-label="${escapeHtml(brand.name)} — pagina iniziale">
            <span class="wordmark-mark" aria-hidden="true">V</span>
            <span>${escapeHtml(brand.name)}<small>Preparazione concorsi</small></span>
          </a>
          <p>Materiali digitali e percorsi di preparazione da conoscere, scegliere e approfondire.</p>
        </div>
        <div class="footer-column"><span class="eyebrow">Esplora</span>
          <a href="${homeUrl}">Home</a><a href="/#percorsi">Percorsi</a><a href="/#manuali">Manuali</a><a href="/#video">Video</a>
        </div>
        <div class="footer-column"><span class="eyebrow">Seguici</span>${renderSocials()}</div>
        <div class="footer-column"><span class="eyebrow">Contatti</span>
          <span>Referente e recapiti<br><small>In definizione</small></span>
          <span>Dati dell’attività<br><small>Da completare</small></span>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ${escapeHtml(brand.name)} · Anteprima di progetto</span>
        <span>Iniziativa indipendente, non collegata a enti istituzionali.</span>
      </div>
    </footer>`;
}

function renderHome() {
  document.title = "Vinci Concorsi — Il tuo prossimo passo verso la divisa";
  return `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <span class="eyebrow hero-eyebrow"><span class="eyebrow-line"></span> Il tuo quaderno di preparazione</span>
        <h1 id="hero-title">Il tuo prossimo passo <em>verso la divisa.</em></h1>
        <p class="hero-intro">Scopri i percorsi dedicati a Carabinieri, Polizia di Stato e Guardia di Finanza, esplora i manuali digitali e contatta Vinci Concorsi.</p>
        <div class="hero-actions">
          <a class="button button-dark" href="#percorsi">Scegli il tuo percorso <span aria-hidden="true">↘</span></a>
          <a class="text-link" href="#manuali">Esplora i manuali <span aria-hidden="true">↗</span></a>
        </div>
        <p class="hero-footnote"><span class="status-dot"></span> Anteprima · informazioni in aggiornamento</p>
      </div>
      <div class="hero-media">
        <span class="media-note">VIDEO / 00 <span>IN PREPARAZIONE</span></span>
        ${renderVideoPlaceholder(videos[0].title, "Video / 00")}
      </div>
      <div class="hero-bottomline"><span>Preparati con metodo</span><span>Tre ambiti · più percorsi</span></div>
    </section>

    <section class="section section-paper pathways-section" id="percorsi" aria-labelledby="pathways-title">
      <div class="section-heading">
        <div><span class="eyebrow">01 — Percorsi</span><h2 id="pathways-title">Da dove vuoi <em>iniziare?</em></h2></div>
        <p>Ogni concorso ha il suo percorso. Scegli un ambito per orientarti tra i contenuti in arrivo.</p>
      </div>
      <div class="pathway-grid">${pathways.map(renderPathwayCard).join("")}</div>
      <p class="section-note"><span class="note-mark">i</span> Concorsi e prove effettivamente coperti sono in fase di conferma.</p>
    </section>

    <section class="section section-cream manuals-section" id="manuali" aria-labelledby="manuals-title">
      <div class="section-heading section-heading-wide">
        <div><span class="eyebrow">02 — Materiali</span><h2 id="manuals-title">Strumenti per <em>fare strada.</em></h2></div>
        <p>Una prima idea della sezione manuali. I materiali qui mostrati sono dimostrativi e sostituibili.</p>
      </div>
      <div class="manual-list">${catalog.map(renderManualCard).join("")}</div>
      <div class="manuals-foot"><span>Materiali digitali</span><span>Nessuna spedizione</span><span>Prezzi e disponibilità da definire</span></div>
    </section>

    <section class="section how-section" aria-labelledby="how-title">
      <div class="how-intro"><span class="eyebrow">03 — Come funziona</span><h2 id="how-title">Semplice, chiaro, <em>insieme.</em></h2><p>Nessun carrello o pagamento integrato nel sito. I dettagli si concordano direttamente.</p></div>
      <ol class="steps-list">
        <li><span class="step-number">01</span><div><h3>Scegli il materiale</h3><p>Esplora il percorso e valuta i materiali disponibili.</p></div></li>
        <li><span class="step-number">02</span><div><h3>Scrivi su WhatsApp</h3><p>Chiedi informazioni sul manuale o sul percorso che ti interessa.</p></div></li>
        <li><span class="step-number">03</span><div><h3>Concorda i dettagli</h3><p>Modalità di acquisto e consegna digitale vengono definite direttamente.</p></div></li>
      </ol>
    </section>

    <section class="video-section section-dark" id="video" aria-labelledby="video-title">
      <div class="video-section-copy"><span class="eyebrow">04 — In evidenza</span><h2 id="video-title">Un volto, una voce.<br><em>Presto qui.</em></h2><p>Stiamo preparando uno spazio per raccontare Vinci Concorsi e il metodo di preparazione.</p><span class="pending-label pending-label-light">Video in preparazione</span></div>
      <div class="video-section-art">${renderVideoPlaceholder(videos[1].title, "Video / 01", "Spazio per contenuti video")}</div>
      <div class="video-section-index">CONTENUTI VIDEO · DESTINAZIONE DA DEFINIRE</div>
    </section>

    <section class="section method-section" aria-labelledby="method-title">
      <div class="method-number" aria-hidden="true">V<span>C</span></div>
      <div class="method-copy"><span class="eyebrow">05 — Il progetto</span><h2 id="method-title">Una preparazione più <em>consapevole.</em></h2><p>Qui troverai la presentazione del preparatore e del metodo. Stiamo raccogliendo informazioni verificate per raccontarli con chiarezza.</p><span class="pending-label">Presentazione in definizione</span></div>
    </section>

    <section class="section community-section section-paper" aria-labelledby="community-title">
      <div class="section-heading"><div><span class="eyebrow">06 — Community</span><h2 id="community-title">Prepararsi, <em>insieme.</em></h2></div><p>Richiedi informazioni sui gruppi di preparazione di Vinci Concorsi, distinti per ambito.</p></div>
      <div class="community-grid">${community.map(renderCommunityCard).join("")}</div>
    </section>

    <section class="section faq-section" aria-labelledby="faq-title">
      <div class="faq-intro"><span class="eyebrow">07 — Domande utili</span><h2 id="faq-title">Prima di <em>cominciare.</em></h2><p>Alcune informazioni sono già confermate, altre sono in fase di definizione.</p></div>
      <div class="faq-list">
        <details><summary>I manuali sono cartacei?</summary><p>No. I manuali presentati sono digitali, quindi non è prevista spedizione fisica.</p></details>
        <details><summary>Posso acquistare direttamente sul sito?</summary><p>No. Il sito non integra carrello né pagamento. Per acquistare puoi contattare Vinci Concorsi tramite WhatsApp; modalità di pagamento e consegna digitale sono da concordare.</p></details>
        <details><summary>Come posso chiedere informazioni o accedere a un gruppo?</summary><p>Usa un pulsante dedicato per vedere il messaggio previsto. In questa anteprima non viene inviato nulla; nella versione definitiva i pulsanti apriranno WhatsApp. I gruppi sono di Vinci Concorsi, non canali ufficiali; modalità di accesso da confermare.</p></details>
        <details><summary>Dove trovo i video?</summary><p>Nella sezione Video della homepage. I contenuti sono in preparazione; piattaforma e destinazione, pubblica o riservata, sono da definire.</p></details>
        <details><summary>Quali concorsi e prove sono coperti?</summary><p>L’elenco dei concorsi e delle prove è in fase di conferma.</p></details>
      </div>
    </section>

    <section class="contact-strip" aria-label="Contatti">
      <span class="eyebrow">Hai una domanda?</span><p>Parliamone con calma.</p>
      ${contactAction({ kind: "general", pathway: pathways[0], label: "Chiedi informazioni", className: "button button-light" })}
    </section>`;
}

function renderBodyPage(pathway) {
  document.title = `${pathway.name} — Vinci Concorsi`;
  const manual = catalog.filter((entry) => entry.bodyId === pathway.id);
  const communityItem = community.find((entry) => entry.bodyId === pathway.id);
  return `
    <section class="body-hero accent-${pathway.accent}" aria-labelledby="body-title">
      <div class="body-hero-copy">
        <a class="back-link" href="/#percorsi">← Tutti i percorsi</a>
        <span class="eyebrow">${pathway.eyebrow} · Percorso di preparazione</span>
        <h1 id="body-title">${escapeHtml(pathway.name)}<em>Il tuo prossimo passo inizia qui.</em></h1>
        <p>${escapeHtml(pathway.intro)}</p>
        <div class="hero-actions">
          ${contactAction({ kind: "info", pathway, label: "Chiedi informazioni", className: "button button-dark" })}
          <a class="text-link" href="#materiali">Scopri i materiali <span aria-hidden="true">↘</span></a>
        </div>
      </div>
      <div class="body-hero-art" aria-hidden="true"><span class="body-art-index">V / C</span><span class="body-art-line"></span><span class="body-art-name">${escapeHtml(pathway.shortName)}</span><span class="body-art-sub">PERCORSO · IN DEFINIZIONE</span></div>
    </section>
    <section class="section section-paper body-status" aria-labelledby="coverage-title">
      <div><span class="eyebrow">Ambito di preparazione</span><h2 id="coverage-title">Informazioni <em>in arrivo.</em></h2></div>
      <div class="coverage-note"><span class="note-mark">i</span><p>Concorsi, prove e relative disponibilità devono ancora essere confermati. I contenuti verranno aggiornati non appena saranno definiti.</p></div>
    </section>
    <section class="section section-cream body-materials" id="materiali" aria-labelledby="materials-title">
      <div class="section-heading"><div><span class="eyebrow">Materiali · ${escapeHtml(pathway.shortName)}</span><h2 id="materials-title">Il materiale <em>giusto per te.</em></h2></div><p>Questa anteprima mostra la struttura della sezione. Titoli e dettagli dei prodotti sono da confermare.</p></div>
      <div class="manual-list">${manual.map(renderManualCard).join("")}</div>
      <a class="text-link back-to-home" href="/#manuali">Tutti i materiali <span aria-hidden="true">↗</span></a>
    </section>
    <section class="section body-video-section" aria-labelledby="body-video-title">
      <div class="body-video-copy"><span class="eyebrow">Contenuti video</span><h2 id="body-video-title">Da guardare, <em>quando pronti.</em></h2><p>Eventuali video dedicati a questo percorso saranno aggiunti qui. Disponibilità e destinazione sono da definire.</p></div>
      ${renderVideoPlaceholder(`Video · ${pathway.shortName}`, "Video / —", "Spazio per contenuti video")}
    </section>
    <section class="section section-dark body-community" aria-labelledby="body-community-title">
      <div class="body-community-copy"><span class="eyebrow">Community · ${escapeHtml(pathway.shortName)}</span><h2 id="body-community-title">Fai una domanda.<br><em>Trova il tuo gruppo.</em></h2><p>${escapeHtml(communityItem.affiliationNote)} Puoi richiedere informazioni sull’accesso.</p></div>
      <div class="body-actions">
        ${contactAction({ kind: "group", pathway, label: "Chiedi informazioni sul gruppo", className: "button button-light" })}
        ${contactAction({ kind: "info", pathway, label: "Informazioni sul percorso", className: "text-link light-link" })}
      </div>
    </section>`;
}

function renderDialog() {
  return `
    <dialog class="contact-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description">
      <div class="dialog-topline"><span class="eyebrow">Contatto · Vinci Concorsi</span><button type="button" class="dialog-close" data-dialog-close aria-label="Chiudi finestra">×</button></div>
      <h2 id="dialog-title">Un contatto, senza sorprese.</h2>
      <p id="dialog-description" class="dialog-purpose"></p>
      <div class="message-preview"><span class="eyebrow">Messaggio previsto</span><p></p></div>
      <p class="dialog-note">Nella versione definitiva questo pulsante aprirà WhatsApp.</p>
      <button type="button" class="button button-dark dialog-confirm" data-dialog-close>Ho capito</button>
    </dialog>`;
}

function mount() {
  if (!page) return;
  page.innerHTML = currentPage === "home" ? renderHome() : bodyPathway ? renderBodyPage(bodyPathway) : renderHome();
  const skipLink = document.querySelector(".skip-link");
  if (skipLink) skipLink.insertAdjacentHTML("afterend", renderHeader());
  else document.body.insertAdjacentHTML("afterbegin", renderHeader());
  document.body.insertAdjacentHTML("beforeend", renderFooter());
  document.body.insertAdjacentHTML("beforeend", renderDialog());
  setupMenu();
  setupDialog();
}

function setupMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-navigation");
  if (!toggle || !nav) return;
  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

function setupDialog() {
  const dialog = document.querySelector(".contact-dialog");
  if (!dialog) return;
  let trigger = null;
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-contact]");
    if (!button) return;
    trigger = button;
    dialog.querySelector(".dialog-purpose").textContent = button.dataset.purpose;
    dialog.querySelector(".message-preview p").textContent = button.dataset.message;
    dialog.showModal();
    dialog.querySelector("[data-dialog-close]").focus();
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
    if (event.target.closest("[data-dialog-close]")) dialog.close();
  });
  dialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      dialog.close();
    }
  });
  dialog.addEventListener("close", () => {
    if (trigger?.isConnected) trigger.focus();
  });
}

mount();
