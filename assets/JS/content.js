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
