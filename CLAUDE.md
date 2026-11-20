# CLAUDE.md — Vinciconcorsi

## Scopo e uso

Questo file è il riferimento operativo del progetto: leggilo prima di pianificare o modificare il sito, insieme a README e allo stato reale del repository. Le istruzioni esplicite del responsabile del progetto prevalgono sulle scelte provvisorie qui riportate. Aggiorna il documento quando una decisione viene confermata; non trasformare ipotesi in requisiti.

Repository: https://github.com/Gigichx/vinciconcorsi
Lingua del sito e delle comunicazioni: italiano.

## Stato al 16 novembre 2026

Il repository contiene un'anteprima statica completa, senza build: homepage e tre pagine dei percorsi. Stack in uso da rispettare: HTML, CSS e JavaScript modulare nativo, più due librerie copiate in `assets/vendor` (Lenis per lo scorrimento fluido, GSAP per l'ingresso delle sezioni). Non è configurato hosting né deploy; il dominio non è stato toccato.

Il 16 novembre 2026 il cliente ha confermato i dati elencati sotto e la nuova direzione grafica è stata implementata come proposta da mostrare, non come identità approvata.

## Dati confermati

### Marchio e attività

- Nome da mostrare: **Vinciconcorsi**, una parola sola. Il wordmark è tipografico e provvisorio; accanto c'è il segnaposto `assets/img/logo.svg`, da sostituire con il logo fornito dal cliente (quadrato, sfondo trasparente), usato in header e footer di tutte le pagine.
- Attività: preparazione personalizzata ai concorsi, con attenzione a test psico-attitudinali e colloquio con la commissione esaminatrice e il perito selettore.
- Corpi: Carabinieri, Polizia di Stato, Guardia di Finanza.
- Pubblico: chi affronta il primo concorso e chi ha già tentato e vuole riprovare.
- Il preparatore descrive il proprio approccio come «introspezione personalizzata». Si può citare come sua descrizione, senza presentarlo come metodo scientificamente validato né inventarne le fasi.

### Contatto

- WhatsApp Business, unico numero per informazioni, acquisti e richieste di ingresso ai gruppi: **+393277897381** (`+39 327 789 7381`).
- Risponde personalmente Salvatore. Orari indicati: tutti i giorni, 16:00–21:00. Tempo di risposta indicativo: entro qualche ora. Non promettere risposta immediata.
- Il numero è confermato dal cliente, ma non è stato verificato con un messaggio di prova: farlo prima del lancio.

### Social

- Instagram: https://www.instagram.com/vinciconcorsi/
- TikTok: https://www.tiktok.com/@vinciconcorsi
- Facebook: https://www.facebook.com/share/1DbkodjGTd/ (link di condivisione fornito dal cliente: non sostituirlo)
- I link condivisi dal cliente contengono parametri di tracciamento (`_r`, `_t`, `jplx`, `mibextid`): nel sito si usano gli URL puliti, che portano agli stessi profili.

### Manuali

- Formato PDF, scritti dal cliente o dal suo team; nessuna spedizione.
- Prezzi comunicati solo su WhatsApp, mai sul sito, nel codice pubblico o nei dati strutturati. Pagamento tramite bonifico; invio del PDF su WhatsApp.
- Anteprima disponibile: l'indice, su richiesta.
- Unico titolo confermato: **Manuale attitudinale Allievo Carabiniere**. Il cliente prevede 2–3 manuali, ma gli altri titoli non sono stati forniti: per Polizia di Stato e Guardia di Finanza mostrare solo richieste di informazioni sui materiali, senza inventare prodotti.
- Non promettere consegna entro un'ora né aggiornamenti gratuiti illimitati: i dettagli operativi sono da precisare.

### Gruppi

- Esistono gruppi dedicati ai tre corpi. Ingresso su richiesta, con approvazione del preparatore e accettazione delle regole.
- Usare «Richiedi accesso», mai «Entra subito».
- Sono community di Vinciconcorsi, non canali ufficiali dei Corpi.

### Video

- Esistono contenuti sui social, ma non sono ancora disponibili gli URL dei video da incorporare. Alcuni contenuti saranno pubblici, altri riservati.
- In anteprima: sezione video visibile e raggiungibile dall'alto, collegamenti ai canali reali, nessun player finto, nessuna area riservata.

## Informazioni ancora da confermare

Titoli e dettagli degli altri manuali; URL dei video e distinzione pubblico/riservato; tempi di consegna con bonifico e durata degli aggiornamenti; concorsi e prove effettivamente coperti; dati dell'attività, qualifiche pubblicabili e informative; hosting, dominio e responsabile degli aggiornamenti; significato di «ditte»/partner (modulo disattivato).

Non inventare prezzi, recensioni, risultati, qualifiche, numeri di studenti o percentuali di successo. Non garantire il superamento dei concorsi. Non usare stemmi, marchi di terzi o fotografie di persone in divisa. Non suggerire affiliazioni istituzionali.

## Architettura

Quattro pagine statiche, contenuto completo già nell'HTML:

- `index.html` (homepage)
- `carabinieri/index.html`
- `polizia-di-stato/index.html`
- `guardia-di-finanza/index.html`

La pagina dei corpi usa un template coerente (hero, materiali, gruppo, video/social, contatto finale) con contenuti e segno grafico specifici. Non duplicare la homepage né ripetere blocchi di copy identici nelle tre pagine: se un contenuto è comune, vive nella homepage o in un componente condiviso. Header, footer e fascia di contatto sono l'unica ripetizione ammessa, perché ogni pagina statica deve restare completa senza JavaScript.

- `assets/CSS/style.css`: tokens, componenti, layout responsive, movimento. Font locali in `assets/fonts/`.
- `assets/img/logo.svg`: segnaposto del logo, unico file da sostituire quando il cliente fornisce il marchio definitivo.
- `assets/JS/content.js`: **solo** numero WhatsApp, messaggi delle azioni e mappa `routerKey` del selettore. Il testo pubblicato vive nell'HTML.
- `assets/JS/site.js`: miglioramento progressivo. Aggiunge la classe `enhanced` per il menu mobile, gestisce il menu (Escape, chiusura al clic, ripristino del focus, chiusura al breakpoint desktop), lo scorrimento fluido con Lenis, l'ingresso delle sezioni con GSAP (fallback CSS) e rigenera gli href WhatsApp da `content.js`.
- `assets/vendor/`: Lenis 1.3.27 (MIT) e GSAP 3.15.1 (licenza Standard «No Charge»), copie locali senza CDN; versioni, fonti e licenze in `NOTICE.md` e `LICENSE-lenis.txt`.
- `assets/JS/whatsapp.mjs`: valida il numero e codifica il messaggio con `encodeURIComponent`.
- `tests/`: verificano numero e link WhatsApp, `noindex`, assenza di prezzi e link vuoti, un solo `h1` per pagina, `main`, skip link e assenza di `id` duplicati.

Regole tecniche:

- Ogni azione WhatsApp usa `<a href="https://wa.me/393277897381?text=…">` con `data-wa="chiave"`. L'href statico garantisce il funzionamento senza JavaScript; `site.js` lo rigenera dal modulo dei contenuti. I test falliscono se non sono allineati.
- Percorsi relativi per asset e navigazione (`assets/...` dalla homepage, `../assets/...` dalle pagine interne): il sito deve funzionare sia dalla radice sia dalla sottocartella `/vinciconcorsi/` di GitHub Pages. Nessun `href`/`src` che inizi con `/` e nessun `url("/assets/...")` nel CSS.
- Il numero WhatsApp non compare come testo né come link `tel:`: resta solo negli href dei link `wa.me`. Il test controlla che non torni visibile.
- Il contenuto deve restare leggibile e navigabile senza JavaScript. Non introdurre testi vecchi nell'HTML.
- Niente framework, build, CMS, backend, autenticazione o dipendenze non necessarie: le sole eccezioni sono Lenis e GSAP in `assets/vendor`, copiati in locale e senza CDN.
- Non caricare nel repository il CSV o le risposte integrali del cliente: contengono dati privati.

## Direzione grafica adottata (18/11/2026)

Proposta per l'anteprima, da validare con il cliente.

- Fondo avorio luminoso `#fffdf8`, superfici azzurro tenue `#eef3fb`, testi blu navy `#0d2350` / `#3b4a63`.
- Rosso acceso `#e2231a` (testo piccolo: `#b3140f`) usato con intenzione: numeri di sezione, segni, dettagli. Verde `#0a7f45` riservato alle azioni WhatsApp. Header e chiusura usano il navy `#0d2350`; la copertina del manuale resta rossa.
- Filetto tricolore unico sopra il footer; nessun altro segno della bandiera.
- Tipografia: Bricolage Grotesque per titoli e interfaccia, Instrument Sans per il testo, Instrument Serif corsivo per poche parole editoriali all'interno dei titoli.
- Composizioni asimmetriche ma leggibili, intestazioni con numero di sezione e filetto, liste invece di griglie di riquadri identici, alternanza chiaro/scuro: una sola sezione scura di forte impatto (Il metodo), una chiusura blu.
- Titoli display in peso 800, spaziatura stretta: più vicini al materiale promozionale approvato dal cliente.
- Apertura: a destra il video di presentazione dentro una cornice telefono verticale (9:16), con tasto play sovrapposto ed etichetta «Guarda la presentazione». Il video è locale (`assets/video/presentazione.mp4`, 37 s, 720×1280, 4,6 MB) con poster `assets/img/video-presentazione.jpg` (9:16, ritagliato sopra la fascia col numero); nessun embed di terzi. Senza JavaScript restano i comandi nativi del player.
- Sotto l'apertura, l'indice dei tre percorsi numerati 01–03 (Carabinieri, Polizia di Stato, Guardia di Finanza) con la V del marchio come firma: su desktop tre colonne, su mobile tre righe.
- Nessun poligono, nessuna parallasse: l'unico movimento è l'ingresso della pagina, sospeso con `prefers-reduced-motion`.
- Segni originali per i tre percorsi (V, cerchi aperti, gradini), nessuno stemma.
- Movimento: ingresso della pagina misurato, comparsa delle sezioni allo scorrimento, microinterazioni su righe e pulsanti. Nessun carosello automatico, nessun cursore personalizzato, nessuna animazione continua necessaria alla comprensione.
- Mobile: il messaggio e le azioni dell'apertura compaiono prima del poster del video; le anteprime vanno verificate a 360–390 px, oltre che a 1440 px.

## Modalità anteprima

- La modalità anteprima è dichiarata da una barra discreta e statica in cima a ogni pagina (nessuna variabile runtime).
- Il numero di telefono non è pubblicato come testo: l'unico contatto visibile è il pulsante WhatsApp.
- Barra WhatsApp fissa in basso su mobile (max 960 px), con padding del body per non coprire il footer.
- Selettore WhatsApp in homepage: due scelte (percorso e necessità) generano il messaggio; resta `hidden` senza JavaScript.
- FAQ con le obiezioni d'acquisto (prezzo, tempi, idoneità) e passi d'acquisto in tre tempi nella sezione manuali.
- Tutte le pagine sono `noindex, nofollow`. `robots.txt` non è una protezione della riservatezza.
- Nessun analytics, pixel, checkout o pagamento integrato. Nessuna pubblicazione in produzione, nessuna modifica al dominio.
- Nessun prezzo nel sito; nessun video o player finto; nessun link vuoto o `href="#"`.
- La copertina del manuale è dichiarata come proposta grafica; i contenuti mancanti sono omessi o indicati come in preparazione.
- Non promettere risposte immediate, consegne entro un'ora, tutoraggio o aggiornamenti gratuiti senza conferma.

## Accessibilità e prestazioni

HTML semantico e gerarchia dei titoli; link per navigare, pulsanti per agire; focus visibile e navigazione da tastiera; menu mobile con `aria-expanded`, Escape e ripristino del focus; `aria-current` sulla voce di percorso nel footer; contrasti del testo verificati ≥ 4.5:1 (sulla fascia vermiglia il testo resta quasi pieno, non affidato all'opacità); nessun overflow orizzontale; `prefers-reduced-motion` rispettato; contenuti visibili senza JavaScript; immagini e SVG con dimensioni definite; font con fallback locali e `font-display: swap`.

## Comandi e verifiche

```sh
python3 -m http.server 8000
node --input-type=module --check < assets/JS/content.js
node --input-type=module --check < assets/JS/site.js
node --test tests/*.test.mjs
```

Prima di consegnare: controllare le quattro pagine, le ancore, il menu mobile, le FAQ, i link WhatsApp e social, l'assenza di sovrapposizioni o testi tagliati a 390 px e 1440 px, il focus da tastiera e il movimento ridotto. Dichiarare i controlli non eseguiti.

## Workflow

1. Leggi questo file e controlla lo stato del repository.
2. Procedi autonomamente sulle scelte reversibili; chiedi solo per informazioni realmente bloccanti.
3. Preserva le modifiche esistenti e non eliminare lavoro altrui.
4. Per sviluppo sostanziale usa un branch dedicato, senza toccare il branch principale.
5. Implementa, poi esegui verifiche proporzionate.
6. Aggiorna README e questo file quando cambia una decisione strutturale.
7. Riporta risultato, limiti e verifiche realmente eseguite.

Non inviare messaggi al cliente, pubblicare in produzione, cambiare dominio o aggiungere servizi a pagamento senza istruzione esplicita. Non dichiarare accessi, commit, deploy o test mai eseguiti.

## Passaggio alla versione definitiva

Incorporare i dati approvati; validare catalogo, contatti, gruppi, video e social; verificare diritti degli asset; completare dati dell'attività e informative; rimuovere i segnaposto; verificare accessibilità, mobile e prestazioni; attivare l'indicizzazione solo su autorizzazione esplicita.

## Decisioni registrate

- 16/11/2026 · Stack: anteprima statica senza build, contenuto in HTML e JavaScript di miglioramento progressivo; nessun framework.
- 16/11/2026 · Direzione grafica: avorio, antracite, vermiglio, verde solo WhatsApp; Bricolage Grotesque + Instrument Sans + Instrument Serif; artwork «Scala V»; sezione scura unica.
- 16/11/2026 · Perimetro prodotto: un manuale reale (Carabinieri), richieste di informazioni per gli altri due corpi; nessun prezzo pubblicato.
- 16/11/2026 · Contatto: numero WhatsApp confermato dal cliente, usato in tutti i link con messaggi distinti per informazioni, manuale e gruppo.
- 18/11/2026 · Grafica e conversione: palette blu/rosso acceso con avorio luminoso, titoli peso 800, filetto tricolore, barra WhatsApp mobile, selettore a due scelte, FAQ d'acquisto e passi d'acquisto. Contrasti ricalcolati ≥ 4.5:1.
- 16/11/2026 · Pubblicazione di prova su GitHub Pages in sottocartella: percorsi relativi per asset e navigazione, numero di telefono non più visibile come testo (resta nei link WhatsApp).
- 16/11/2026 · Revisione del redesign: `content.js` ridotto a numero e messaggi WhatsApp, rimosso il blocco «Per chi è pensato» duplicato nelle tre pagine dei corpi, canali unificati nel componente della homepage, contrasto della fascia di contatto portato sopra 4.5:1, `aria-current` nel footer e test strutturali sulle pagine.

- 18/11/2026 · Hero: la scultura «Scala V» è sostituita dall'indice cliccabile dei tre percorsi con la V del marchio come firma; rimossi poligoni, gruppi di stile `.plate*`/`.art-*` e parallasse. L'indice passa poi sotto l'apertura per lasciare la colonna destra al poster del video di presentazione, ancora segnaposto.
- 18/11/2026 · Materiale del cliente: le locandine con persone in divisa e stemmi dei Corpi non vanno online, restano riferimento interno. Nome e qualifica della psicologa e i punti delle locandine entrano solo dopo conferma esplicita del cliente.
- 20/11/2026 · Video di presentazione ricevuto dal cliente e pubblicato in locale nella cornice del telefono, poster ricavato dal primo fotogramma. Il file originale (15 MB, 1080×1920) è stato ricompreso a 4,8 MB in 720×1280 H.264 (durata e 9:16 invariati, nessun artefatto visibile) e il poster è stato ritagliato sopra la fascia col numero di telefono. La stessa fascia (icona WhatsApp, numero e «Preparazione ai test e al colloquio») è stata rimossa dal filmato nei due segmenti in cui compare (circa 9–15 s e 21–28 s) ricostruendo il tavolo dallo stesso ciak: non resta né il numero né un rettangolo visibile. Resta da decidere dove collocare gli altri due video (criteri del perito selettore, preparazione a test e colloquio).

- 20/11/2026 · Scorrimento e animazioni: aggiunte Lenis 1.3.27 (MIT) e GSAP 3.15.1 (Standard «No Charge», uso commerciale incluso) copiate in `assets/vendor`, senza build né CDN. Lenis lavora sullo scroll nativo e si spegne con `prefers-reduced-motion`; le ancore passano da lui con lo scarto dell'header, lo skip link resta al browser per spostare il focus. Con GSAP l'ingresso delle sezioni è una sua timeline, con fallback alle transizioni CSS se la libreria manca.

Da registrare quando confermate: identità visiva approvata, catalogo completo, gestione video, hosting e processo di deploy, perimetro del lancio, dati legali.
