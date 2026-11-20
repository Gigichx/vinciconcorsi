# Librerie di terze parti

Copie locali, senza build né CDN: per aggiornare una libreria si sostituisce il
file e si aggiorna questa scheda.

## Lenis 1.3.27

- File: `lenis.mjs` (modulo ES, caricato da `assets/JS/site.js`)
- Sorgente: <https://github.com/darkroomengineering/lenis> (pacchetto npm `lenis`)
- Licenza: MIT — testo completo in `LICENSE-lenis.txt`
- Uso: scorrimento fluido sopra lo scroll nativo. Rispetta `prefers-reduced-motion`
  (lo smorzamento si spegne da solo) e lascia funzionanti ancore, `position: sticky`
  e navigazione da tastiera. Limiti noti: non smussa lo scroll sopra gli iframe,
  è limitato a 60 fps su Safari e non supporta `scroll-snap`.

## GSAP 3.15.1

- File: `gsap.min.js` (solo core, nessun plugin; caricato con `defer` dalla sola homepage, dove ci sono le sezioni da rivelare. Se in futuro servisse nelle pagine dei corpi basta aggiungere lo stesso tag: `site.js` lo usa se lo trova, altrimenti restano le transizioni CSS.)
- Sorgente: <https://gsap.com> (pacchetto npm `gsap`)
- Licenza: Standard «No Charge» GSAP License — <https://gsap.com/standard-license>
- Uso: ingresso delle sezioni allo scorrimento. Dal 30 aprile 2025 l'uso
  commerciale è incluso senza costi, plugin compresi. Non è una licenza MIT:
  i diritti restano di Webflow, i termini possono cambiare, e restano vietati
  costruire con GSAP un prodotto di animazione visuale concorrente con Webflow,
  fare reverse engineering per realizzarlo e rimuovere note proprietarie.
  Rileggere la pagina della licenza prima di un uso diverso da un sito.
