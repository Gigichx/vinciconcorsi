const sessionUrl = "../api/auth/session";
const loginUrl = "../api/auth/google/start";
const logoutUrl = "../api/auth/logout";
const listUrl = (status) =>
  `../api/admin/reviews?status=${encodeURIComponent(status)}`;
const reviewUrl = (id) => `../api/admin/reviews/${encodeURIComponent(id)}`;
const photoUrl = (id) => `../api/photos/${encodeURIComponent(id)}`;

const userLabel = document.querySelector("[data-admin-user]");
const loginLink = document.querySelector("[data-admin-login]");
const logoutButton = document.querySelector("[data-admin-logout]");
const gate = document.querySelector("[data-admin-gate]");
const denied = document.querySelector("[data-admin-denied]");
const app = document.querySelector("[data-admin-app]");
const list = document.querySelector("[data-admin-list]");
const status = document.querySelector("[data-admin-status]");
const refresh = document.querySelector("[data-admin-refresh]");
const tabs = [...document.querySelectorAll("[data-admin-tab]")];

let current = "pending";
let busy = false;

function setHidden(element, hidden) {
  if (element) element.hidden = hidden;
}

function show(message) {
  if (status) status.textContent = message || "";
}

function formatDate(value) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function card(review) {
  const item = document.createElement("li");
  item.className = "admin-card";

  const head = document.createElement("div");
  head.className = "admin-card-head";

  const name = document.createElement("span");
  name.className = "admin-card-name";
  name.textContent = review.name;

  const meta = document.createElement("span");
  meta.className = "admin-card-meta";
  meta.textContent = [review.percorso, formatDate(review.createdAt)]
    .filter(Boolean)
    .join(" · ");

  head.append(name, meta);

  const body = document.createElement("p");
  body.className = "admin-card-body";
  body.textContent = review.body;

  item.append(head, body);

  if (review.photos?.length) {
    const photos = document.createElement("div");
    photos.className = "admin-photos";
    review.photos.forEach((photo, i) => {
      const link = document.createElement("a");
      link.href = photoUrl(photo.id);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      const img = document.createElement("img");
      img.src = photoUrl(photo.id);
      img.alt = `Foto ${i + 1} di ${review.name}`;
      img.loading = "lazy";
      link.append(img);
      photos.append(link);
    });
    item.append(photos);
  }

  const actions = document.createElement("div");
  actions.className = "admin-actions";

  if (review.status !== "approved") {
    actions.append(
      action("Approva", "btn btn-primary btn-sm", async () => {
        await update(review.id, "approved");
      }),
    );
  }

  if (review.status !== "rejected") {
    actions.append(
      action("Rifiuta", "btn btn-outline btn-sm", async () => {
        await update(review.id, "rejected");
      }),
    );
  }

  actions.append(
    action("Elimina", "btn btn-outline btn-sm", async () => {
      if (!window.confirm("Eliminare la recensione e le sue foto?")) return;
      await remove(review.id);
    }),
  );

  item.append(actions);
  return item;
}

function action(label, className, handler) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", handler);
  return button;
}

async function update(id, next) {
  if (busy) return;
  busy = true;
  show("Aggiornamento…");
  try {
    const response = await fetch(reviewUrl(id), {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!response.ok) throw new Error("patch");
    show(next === "approved" ? "Recensione pubblicata." : "Recensione rifiutata.");
    await load();
  } catch {
    show("Non riesco ad aggiornare la recensione. Riprova.");
  } finally {
    busy = false;
  }
}

async function remove(id) {
  if (busy) return;
  busy = true;
  show("Eliminazione…");
  try {
    const response = await fetch(reviewUrl(id), { method: "DELETE" });
    if (!response.ok) throw new Error("delete");
    show("Recensione eliminata.");
    await load();
  } catch {
    show("Non riesco a eliminare la recensione. Riprova.");
  } finally {
    busy = false;
  }
}

async function load() {
  if (!list) return;
  show("Caricamento…");
  try {
    const response = await fetch(listUrl(current), {
      headers: { accept: "application/json" },
    });
    if (!response.ok) throw new Error("list");
    const data = await response.json();
    const reviews = Array.isArray(data.reviews) ? data.reviews : [];

    list.replaceChildren();
    if (!reviews.length) {
      const empty = document.createElement("li");
      empty.className = "admin-empty";
      empty.textContent =
        current === "pending"
          ? "Nessuna recensione in attesa."
          : "Nessuna recensione pubblicata.";
      list.append(empty);
    } else {
      for (const review of reviews) list.append(card(review));
    }
    show("");
  } catch {
    show("Non riesco a caricare le recensioni.");
  }
}

function selectTab(next) {
  current = next;
  for (const tab of tabs) {
    const active = tab.dataset.adminTab === next;
    tab.setAttribute("aria-pressed", String(active));
    tab.classList.toggle("btn-outline", !active);
  }
  load();
}

for (const tab of tabs) {
  tab.addEventListener("click", () => selectTab(tab.dataset.adminTab));
}

if (refresh) refresh.addEventListener("click", () => load());

if (logoutButton) {
  logoutButton.addEventListener("click", async () => {
    await fetch(logoutUrl, { method: "POST" }).catch(() => {});
    window.location.reload();
  });
}

async function start() {
  let user = null;
  try {
    const response = await fetch(sessionUrl, {
      headers: { accept: "application/json" },
    });
    const data = response.ok ? await response.json() : { user: null };
    user = data.user || null;
  } catch {
    user = null;
  }

  if (!user) {
    setHidden(gate, false);
    setHidden(app, true);
    setHidden(denied, true);
    setHidden(logoutButton, true);
    if (userLabel) userLabel.textContent = "Accesso richiesto.";
    if (loginLink) {
      loginLink.href = `${loginUrl}?next=${encodeURIComponent(window.location.pathname)}`;
    }
    return;
  }

  if (!user.isAdmin) {
    setHidden(gate, true);
    setHidden(app, true);
    setHidden(denied, false);
    setHidden(logoutButton, false);
    if (userLabel) userLabel.textContent = `Accesso come ${user.name}.`;
    return;
  }

  setHidden(gate, true);
  setHidden(denied, true);
  setHidden(app, false);
  setHidden(logoutButton, false);
  if (userLabel) userLabel.textContent = `Moderazione come ${user.name}.`;
  load();
}

start();
