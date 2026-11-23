# Vinciconcorsi · Anteprima

Anteprima statica in italiano con homepage e quattro percorsi dedicati a Carabinieri, Polizia di Stato, Guardia di Finanza e Polizia Penitenziaria. Nessun framework, nessuna dipendenza, nessuna build: solo HTML, CSS e JavaScript.

## Avvio

Dalla cartella del progetto:

```sh
python3 -m http.server 8000
```

Apri <http://localhost:8000/>. Le pagine dei percorsi sono:

- <http://localhost:8000/carabinieri/>
- <http://localhost:8000/polizia-di-stato/>
- <http://localhost:8000/guardia-di-finanza/>
- <http://localhost:8000/polizia-penitenziaria/>

Per fermare il server: `Ctrl+C`.

## Controlli

```sh
node --input-type=module --check < assets/JS/content.js
node --input-type=module --check < assets/JS/site.js
node --test tests/*.test.mjs
```

I test verificano la validazione del numero WhatsApp, la coerenza tra ogni pulsante WhatsApp (`data-wa`) e il relativo `href` statico, il `noindex` e l'assenza di prezzi o link vuoti. Controllano anche che ogni pagina abbia un solo `h1`, un `main`, lo skip link e nessun `id` duplicato. Se cambi i messaggi in `assets/JS/content.js`, gli href nelle pagine vanno rigenerati: il test segnala il disallineamento.

## Struttura

- `index.html` e le quattro cartelle dei percorsi: contenuto completo già in HTML, con metadati `noindex`. Le pagine funzionano anche senza JavaScript e usano percorsi relativi, così il sito si apre anche dalla sottocartella GitHub Pages (`/vinciconcorsi/`).
- `assets/CSS/style.css`: direzione grafica, componenti, responsive, movimento.
- `assets/JS/content.js`: numero WhatsApp, messaggi delle azioni e mappa del selettore (`routerKey`). Il testo pubblicato vive nelle pagine HTML.
- `assets/JS/site.js`: miglioramento progressivo — menu mobile accessibile, scorrimento fluido (Lenis), ingresso delle sezioni (GSAP, con fallback CSS), rigenerazione dei link WhatsApp dai contenuti.
- Pagine dei corpi: hero, materiali, gruppo, video/social e contatto finale. Il blocco canali riusa il componente della homepage; i contenuti specifici del corpo sono gli unici a variare.
- `assets/JS/whatsapp.mjs`: validazione del numero e codifica sicura del messaggio.
- `assets/img/logo.svg`: segnaposto del logo usato in header e footer; va sostituito con il file definitivo (quadrato, sfondo trasparente).
- `assets/fonts/`: Bricolage Grotesque, Instrument Sans e Instrument Serif (sole varianti latine, licenza SIL Open Font License), serviti localmente.
- `assets/vendor/`: Lenis 1.3.27 (MIT) e GSAP 3.15.1 (licenza Standard «No Charge»), copie locali senza CDN; versioni, fonti e licenze in `NOTICE.md`.
- `tests/`: test delle funzioni di contatto e dei contenuti pubblicati.

## Direzione grafica

- Avorio luminoso `#fffdf8`, blu navy `#0d2350`, rosso acceso `#e2231a` usato con parsimonia, verde riservato alle azioni WhatsApp `#0a7f45`.
- Bricolage Grotesque per titoli e interfaccia, Instrument Sans per il testo, Instrument Serif corsivo per poche parole editoriali.
- Apertura asimmetrica: a destra il video di presentazione in una cornice telefono (tasto play ed etichetta), sotto l'indice dei quattro percorsi numerati 01–04 con la V del marchio come firma (quattro colonne sopra i 1150 px, due sotto, una a 960 px).
- Navigazione senza numeri: le cifre restano solo nell'indice dei quattro percorsi e nelle voci della community; le voci della nav hanno filetto rosso sulla voce attiva; nel menu mobile ogni voce porta una freccia, la CTA WhatsApp è a tutta larghezza e sotto compaiono gli orari.
- Sezione Video: quattro schede verticali in fila, sotto le quali testo e canali si dividono la riga. Sotto i 960px le schede passano a due colonne e testo e canali tornano in colonna; il testo va su due colonne da 760 a 1150px. Le schede non superano la larghezza nativa del filmato più stretto, per non ingrandirlo.
- Sezione Recensioni, sotto i Video: una scheda per volta, centrata, con citazione a sinistra e firma a destra; le laterali arretrano come in un cover-flow (scala 0.84, inclinazione 14°, profondità −160 px, opacità 0.6) e ricevono una sfocatura di 1,4 px solo quando lo scorrimento si ferma, mentre opacità e scala restano continue durante il trascinamento. Frecce, linee di avanzamento e contatore; nessun avanzamento automatico, si cambia con le frecce, a mano o cliccando la scheda laterale. Da 861px la scheda si ferma a 940px e lascia 56px di accenno per lato a 961px; a 390px resta a tutta larghezza e nessuna scheda viene offuscata. Senza JavaScript la fila si scorre a mano con lo snap del CSS; con `prefers-reduced-motion` le schede restano tutte piene. La quarta diapositiva chiude il carosello con una scheda navy: frase breve, pulsante WhatsApp e una sola riga piccola sul giudizio della commissione, senza il verdetto in grande.
- Header a piena opacità: il contenuto che scorre sotto non si intravede.
- Intestazioni di sezione: etichetta, titolo e testo in colonna, mai affiancati; etichetta centrata sulla prima riga del titolo. Distanze prese dalla scala `--space-1`…`--space-7` in `style.css`, anche nelle griglie di sezione e nel footer; nessun testo sotto 0.74 rem.
- Numerazione delle sezioni, filetti sottili, intestazioni editoriali, lista percorsi a righe invece di riquadri uguali, una sola sezione scura di forte impatto e una chiusura blu con filetto tricolore sopra il footer.
- Titoli display in peso 800, spaziatura stretta.
- Conversione: barra WhatsApp fissa su mobile, selettore percorso/necessità in homepage, FAQ su prezzo e tempi, passi d'acquisto in tre tempi.
- Movimento breve e intenzionale, annullato con `prefers-reduced-motion`; l'unico carosello è quello delle recensioni, comandato da frecce e linee di avanzamento; nessun player finto, nessun cursore personalizzato.

## Regole editoriali dell'anteprima

- Tutte le pagine sono `noindex`; nessun analytics, pixel, checkout o misurazione.
- Nessun prezzo è pubblicato: prezzi e disponibilità si concordano su WhatsApp.
- Le recensioni riportano citazioni reali, con nome ed esito quando il candidato sceglie di renderli pubblici (per esempio «Mariateresa Rocchetto, idonea alla commissione»). Data di nascita e indirizzo PEC restano fuori dal sito. Ogni esito è accompagnato dalla nota che nessun risultato è garantito: niente percentuali, promesse o verdetti esibiti come garanzia.
- Il numero di telefono non è mostrato come testo: ogni contatto passa dal pulsante WhatsApp.
- Quattro manuali confermati, uno per corpo (Carabinieri, Polizia di Stato, Guardia di Finanza, Polizia Penitenziaria), con le copertine reali dell'edizione novembre 2026 in `assets/img/manuali/`. Prezzo e disponibilità restano su WhatsApp.
- Cinque video locali, senza embed di terzi: la presentazione in apertura e, nella sezione Video, «Test e colloquio», «I sei criteri del perito», «Preparazione e perito» e «Analisi individuale». I canali social reali sono collegati, i contenuti riservati non sono pubblicati.
- I gruppi sono quattro, uno per corpo; restano community di Vinciconcorsi, non canali ufficiali dei Corpi. L'ingresso è su richiesta e approvato dal preparatore.
- Le copertine dei manuali sono quelle fornite dal cliente per l'edizione novembre 2026, non proposte grafiche.

## Prima della pubblicazione

Confermare i link ai video, i tempi di consegna e aggiornamento, i dati dell'attività e le informative, il dominio e l'hosting. Verificare con un messaggio di prova il numero WhatsApp e i profili social. Solo dopo queste verifiche si può togliere `noindex` e disattivare la modalità anteprima.
