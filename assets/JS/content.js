/**
 * Unico dato condiviso a runtime: il numero WhatsApp e i messaggi delle azioni.
 *
 * Il testo pubblicato vive nelle pagine HTML. `site.js` rigenera gli href da
 * questi messaggi; i test verificano che gli href statici restino identici.
 */

export const whatsappNumber = "+393277897381";

export const waMessages = {
  info: "Ciao Salvatore, vorrei informazioni sulla preparazione per i concorsi.",
  infoCarabinieri:
    "Ciao Salvatore, vorrei informazioni sulla preparazione per il concorso in Carabinieri.",
  infoPolizia:
    "Ciao Salvatore, vorrei informazioni sulla preparazione per il concorso in Polizia di Stato.",
  infoGdf:
    "Ciao Salvatore, vorrei informazioni sulla preparazione per il concorso in Guardia di Finanza.",
  infoPenitenziaria:
    "Ciao Salvatore, vorrei informazioni sulla preparazione per il concorso in Polizia Penitenziaria.",
  manualCarabinieri:
    "Ciao Salvatore, vorrei informazioni per acquistare il Manuale attitudinale Allievo Carabiniere.",
  indiceCarabinieri:
    "Ciao Salvatore, vorrei ricevere l'indice del Manuale attitudinale Allievo Carabiniere.",
  manualPolizia:
    "Ciao Salvatore, vorrei informazioni per acquistare il Manuale di preparazione Allievo Agente Polizia di Stato.",
  indicePolizia:
    "Ciao Salvatore, vorrei ricevere l'indice del Manuale di preparazione Allievo Agente Polizia di Stato.",
  manualGdf:
    "Ciao Salvatore, vorrei informazioni per acquistare il Manuale di preparazione Allievo Finanziere Guardia di Finanza.",
  indiceGdf:
    "Ciao Salvatore, vorrei ricevere l'indice del Manuale di preparazione Allievo Finanziere Guardia di Finanza.",
  manualPenitenziaria:
    "Ciao Salvatore, vorrei informazioni per acquistare il Manuale di preparazione Allievo Agente Polizia Penitenziaria.",
  indicePenitenziaria:
    "Ciao Salvatore, vorrei ricevere l'indice del Manuale di preparazione Allievo Agente Polizia Penitenziaria.",
  prezzoManuali:
    "Ciao Salvatore, vorrei conoscere il prezzo dei manuali di preparazione.",
  tempiManuali:
    "Ciao Salvatore, vorrei sapere i tempi di consegna dei manuali in PDF.",
  gruppoCarabinieri:
    "Ciao Salvatore, vorrei richiedere l'accesso al gruppo di preparazione per Carabinieri.",
  gruppoPolizia:
    "Ciao Salvatore, vorrei richiedere l'accesso al gruppo di preparazione per Polizia di Stato.",
  gruppoGdf:
    "Ciao Salvatore, vorrei richiedere l'accesso al gruppo di preparazione per Guardia di Finanza.",
  gruppoPenitenziaria:
    "Ciao Salvatore, vorrei richiedere l'accesso al gruppo di preparazione per Polizia Penitenziaria.",
};

/**
 * Il selettore della homepage traduce due scelte in una chiave di messaggio.
 * "Non ho ancora scelto" ricade sul messaggio generico.
 */
const routerByBody = {
  Carabinieri: {
    info: "infoCarabinieri",
    manuale: "manualCarabinieri",
    gruppo: "gruppoCarabinieri",
  },
  "Polizia di Stato": {
    info: "infoPolizia",
    manuale: "manualPolizia",
    gruppo: "gruppoPolizia",
  },
  "Guardia di Finanza": {
    info: "infoGdf",
    manuale: "manualGdf",
    gruppo: "gruppoGdf",
  },
  "Polizia Penitenziaria": {
    info: "infoPenitenziaria",
    manuale: "manualPenitenziaria",
    gruppo: "gruppoPenitenziaria",
  },
};

export function routerKey(corpo, bisogno) {
  return routerByBody[corpo]?.[bisogno] ?? "info";
}
