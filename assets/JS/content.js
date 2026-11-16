export const previewMode = true;

export const brand = {
  name: "Vinci Concorsi",
  previewNotice: "Anteprima di progetto · Contenuti e collegamenti in fase di definizione.",
  whatsappNumber: null,
};

// URL indicati dal cliente il 13/11/2026 (parametri di tracciamento rimossi). Non ancora verificati: controllare che si aprano sui profili giusti.
export const socials = [
  { name: "Instagram", url: "https://www.instagram.com/vinciconcorsi" },
  { name: "TikTok", url: "https://www.tiktok.com/@vinciconcorsi" },
  { name: "Facebook", url: "https://www.facebook.com/share/1A8JRnibJz/" },
];

export const pathways = [
  {
    id: "carabinieri",
    name: "Carabinieri",
    shortName: "Carabinieri",
    eyebrow: "01 / Percorso",
    description: "Materiali e informazioni per orientarti nella preparazione.",
    intro: "Uno spazio dedicato a chi si prepara per i concorsi dell’Arma. Percorsi, prove e materiali saranno definiti con le informazioni approvate.",
    accent: "olive",
  },
  {
    id: "polizia-di-stato",
    name: "Polizia di Stato",
    shortName: "Polizia di Stato",
    eyebrow: "02 / Percorso",
    description: "Scopri i materiali in preparazione per il tuo percorso.",
    intro: "Un punto di partenza per esplorare la preparazione ai concorsi della Polizia di Stato. Le prove effettivamente coperte sono in fase di conferma.",
    accent: "blue",
  },
  {
    id: "guardia-di-finanza",
    name: "Guardia di Finanza",
    shortName: "Guardia di Finanza",
    eyebrow: "03 / Percorso",
    description: "Un percorso da costruire attorno alle tue esigenze.",
    intro: "Materiali e informazioni dedicati alla preparazione per la Guardia di Finanza, in attesa di definire concorsi e prove disponibili.",
    accent: "rust",
  },
];

export const catalog = pathways.map((pathway, index) => ({
  id: `manuale-${pathway.id}`,
  bodyId: pathway.id,
  title: `Materiale dimostrativo · ${pathway.shortName}`,
  coverLabel: ["Studio e metodo", "Preparazione", "Percorso concorso"][index],
  edition: null,
  author: null,
  format: null,
  index: null,
  previewUrl: null,
  price: null,
  availability: null,
  updates: null,
  support: null,
  delivery: null,
  demonstrative: true,
}));

// Unico manuale definito dal cliente (13/11/2026). Prezzo noto ma da NON mostrare sul sito (solo su WhatsApp). Edizione, pagine, indice e durata degli aggiornamenti: da raccogliere.
Object.assign(catalog[0], {
  title: "Manuale attitudinale Allievo Carabiniere",
  format: "PDF",
  demonstrative: false,
});

export const videos = [
  { id: "presentazione", title: "Video di presentazione", available: false },
  { id: "lezioni", title: "Contenuti video", available: false },
];

export const community = pathways.map((pathway) => ({
  bodyId: pathway.id,
  name: `Gruppo di preparazione · ${pathway.shortName}`,
  affiliationNote: "Community di Vinci Concorsi, non canale ufficiale.",
}));

export const partners = { enabled: false, items: [] };
