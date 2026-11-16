/**
 * Dati condivisi dell'anteprima Vinciconcorsi.
 *
 * Questo modulo è la fonte unica per contatti, messaggi WhatsApp, percorsi e
 * catalogo. Le pagine HTML contengono il testo già pubblicato: se cambi un
 * messaggio qui, `site.js` aggiorna i collegamenti a runtime e i test
 * verificano che gli href statici restino allineati.
 */

export const previewMode = true;

export const brand = {
  name: "Vinciconcorsi",
  wordmark: "vinciconcorsi",
  tagline: "Preparazione concorsi",
  contactName: "Salvatore",
  whatsappNumber: "+393277897381",
  whatsappDisplay: "+39 327 789 7381",
  hours: "Tutti i giorni, 16:00–21:00",
  responseTime: "In genere entro qualche ora",
  previewNotice: "Anteprima di progetto · Contenuti e collegamenti in fase di definizione.",
};

export const socials = [
  {
    id: "tiktok",
    name: "TikTok",
    url: "https://www.tiktok.com/@vinciconcorsi",
    label: "Esplora i contenuti su TikTok",
  },
  {
    id: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com/vinciconcorsi/",
    label: "Guarda i contenuti su Instagram",
  },
  {
    id: "facebook",
    name: "Facebook",
    url: "https://www.facebook.com/share/1A8JRnibJz/",
    label: "Segui la pagina su Facebook",
  },
];

export const pathways = [
  {
    id: "carabinieri",
    index: "01",
    name: "Carabinieri",
    url: "/carabinieri/",
    description:
      "Il percorso con il manuale attitudinale già disponibile. Informazioni su test, colloquio e materiali.",
    intro:
      "Preparazione personalizzata ai test psico-attitudinali e al colloquio con la commissione esaminatrice, per chi affronta il concorso in Carabinieri.",
    sign: "v",
  },
  {
    id: "polizia-di-stato",
    index: "02",
    name: "Polizia di Stato",
    url: "/polizia-di-stato/",
    description:
      "Preparazione ai test psico-attitudinali e al colloquio. Materiali in preparazione, informazioni su richiesta.",
    intro:
      "Preparazione personalizzata ai test psico-attitudinali e al colloquio, per chi affronta il concorso in Polizia di Stato.",
    sign: "orbits",
  },
  {
    id: "guardia-di-finanza",
    index: "03",
    name: "Guardia di Finanza",
    url: "/guardia-di-finanza/",
    description:
      "Un percorso da costruire sul tuo profilo. Materiali in preparazione, informazioni su richiesta.",
    intro:
      "Preparazione personalizzata ai test psico-attitudinali e al colloquio, per chi affronta il concorso in Guardia di Finanza.",
    sign: "steps",
  },
];

/**
 * Unico manuale confermato dal cliente (13/11/2026).
 * Il prezzo esiste ma non va pubblicato: si comunica solo su WhatsApp.
 */
export const manuals = [
  {
    id: "manuale-attitudinale-allievo-carabiniere",
    bodyId: "carabinieri",
    title: "Manuale attitudinale Allievo Carabiniere",
    format: "PDF",
    delivery: "Invio su WhatsApp",
    price: null,
    demonstratesCover: true,
  },
];

/** Corpi per cui i materiali non sono ancora definiti: solo richiesta informazioni. */
export const pendingMaterials = [
  { bodyId: "polizia-di-stato" },
  { bodyId: "guardia-di-finanza" },
];

export const community = {
  accessNote:
    "L'ingresso è su richiesta e viene approvato dal preparatore. Prima di entrare si accettano le regole del gruppo.",
  affiliationNote: "Community di Vinciconcorsi, non canale ufficiale del Corpo.",
  groups: pathways.map((pathway) => ({
    bodyId: pathway.id,
    name: `Gruppo ${pathway.name}`,
  })),
};

export const videos = {
  note: "I contenuti pubblicati vivono sui canali social. In questa anteprima non è incorporato alcun player e i materiali riservati non sono pubblicati.",
  channels: socials.map((social) => social.id),
};

/**
 * Messaggi WhatsApp: uno scopo per ogni azione.
 * Il testo viene codificato da `createWhatsAppUrl`, mai concatenato a mano.
 */
export const waMessages = {
  info: "Ciao Salvatore, vorrei informazioni sulla preparazione per i concorsi.",
  infoCarabinieri:
    "Ciao Salvatore, vorrei informazioni sulla preparazione per il concorso in Carabinieri.",
  infoPolizia:
    "Ciao Salvatore, vorrei informazioni sulla preparazione per il concorso in Polizia di Stato.",
  infoGdf:
    "Ciao Salvatore, vorrei informazioni sulla preparazione per il concorso in Guardia di Finanza.",
  manualCarabinieri:
    "Ciao Salvatore, vorrei informazioni per acquistare il Manuale attitudinale Allievo Carabiniere.",
  indiceCarabinieri:
    "Ciao Salvatore, vorrei ricevere l'indice del Manuale attitudinale Allievo Carabiniere.",
  materialiPolizia:
    "Ciao Salvatore, vorrei informazioni sui materiali per il concorso in Polizia di Stato.",
  materialiGdf:
    "Ciao Salvatore, vorrei informazioni sui materiali per il concorso in Guardia di Finanza.",
  gruppoCarabinieri:
    "Ciao Salvatore, vorrei richiedere l'accesso al gruppo di preparazione per Carabinieri.",
  gruppoPolizia:
    "Ciao Salvatore, vorrei richiedere l'accesso al gruppo di preparazione per Polizia di Stato.",
  gruppoGdf:
    "Ciao Salvatore, vorrei richiedere l'accesso al gruppo di preparazione per Guardia di Finanza.",
};
