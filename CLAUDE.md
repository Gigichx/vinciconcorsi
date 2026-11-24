# CLAUDE.md — Vinciconcorsi

## Scopo e uso

Questo file è il riferimento operativo del progetto: leggilo prima di pianificare o modificare il sito, insieme a README e allo stato reale del repository. Le istruzioni esplicite del responsabile del progetto prevalgono sulle scelte provvisorie qui riportate. Aggiorna il documento quando una decisione viene confermata; non trasformare ipotesi in requisiti.

Repository: https://github.com/Gigichx/vinciconcorsi
Lingua del sito e delle comunicazioni: italiano.

## Stato al 24 novembre 2026

Il repository contiene l'anteprima completa: homepage, quattro pagine dei percorsi e una pagina di moderazione. Il sito resta statico e senza build (HTML, CSS e JavaScript modulare nativo) con Lenis e GSAP copiati in `assets/vendor`. Alle recensioni verificate si aggiungono Cloudflare Pages Functions per Google OAuth, database D1 dei testi e bucket R2 delle foto; Wrangler è l'unica dipendenza di sviluppo. Hosting previsto: GitHub + Cloudflare Pages. Non è ancora stato pubblicato nulla e il dominio non è stato toccato.

Il 16 novembre 2026 il cliente ha confermato i dati elencati sotto e la nuova direzione grafica è stata implementata come proposta da mostrare, non come identità approvata.

## Dati confermati

### Marchio e attività

- Nome da mostrare: **Vinciconcorsi**, una parola sola. Il wordmark è tipografico e provvisorio; accanto c'è il segnaposto `assets/img/logo.svg`, da sostituire con il logo fornito dal cliente (quadrato, sfondo trasparente), usato in header e footer di tutte le pagine.
- Attività: preparazione personalizzata ai concorsi, con attenzione a test psico-attitudinali e colloquio con la commissione esaminatrice e il perito selettore.
- Corpi: Carabinieri, Polizia di Stato, Guardia di Finanza, Polizia Penitenziaria.
- Pubblico: chi affronta il primo concorso e chi ha già tentato e vuole riprovare.
- Il preparatore descrive il proprio approccio come «introspezione personalizzata». Si può citare come sua descrizione, senza presentarlo come metodo scientificamente validato né inventarne le fasi.

### Contatto

- WhatsApp Business, unico numero per informazioni, acquisti e richieste di ingresso ai gruppi: **+393277897381** (`+39 327 789 7381`).
- Risponde personalmente Salvatore. Giorni e orari non sono pubblicati sul sito (rimossi il 24/11/2026 su richiesta): non reintrodurli senza una conferma. Tempo di risposta indicativo: entro qualche ora. Non promettere risposta immediata.
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
- Quattro titoli confermati il 23/11/2026, uno per corpo: **Manuale attitudinale Allievo Carabiniere**, **Manuale di preparazione Allievo Finanziere Guardia di Finanza**, **Manuale di preparazione Allievo Agente Polizia di Stato**, **Manuale di preparazione Allievo Agente Polizia Penitenziaria**. Le copertine reali dell'edizione novembre 2026 sono in `assets/img/manuali/`; non sono più proposte grafiche.
- Non promettere consegna entro un'ora né aggiornamenti gratuiti illimitati: i dettagli operativi sono da precisare.

### Gruppi

- Esistono gruppi dedicati ai quattro corpi. Ingresso su richiesta, con approvazione del preparatore e accettazione delle regole.
- Usare «Richiedi accesso», mai «Entra subito».
- Sono community di Vinciconcorsi, non canali ufficiali dei Corpi.

### Video

- Cinque filmati locali in `assets/video/`: presentazione (37 s), Test e colloquio (1:01), I sei criteri del perito (0:46), Preparazione e perito (1:03, aggiunto il 23/11/2026), Analisi individuale (0:20, aggiunto il 23/11/2026). Alcuni contenuti restano riservati e non vengono pubblicati.
- In anteprima: sezione video visibile e raggiungibile dall'alto, collegamenti ai canali reali, nessun player finto, nessuna area riservata.

## Informazioni ancora da confermare

URL dei video e distinzione pubblico/riservato; tempi di consegna con bonifico e durata degli aggiornamenti; concorsi e prove effettivamente coperti; dati dell'attività, qualifiche pubblicabili e informative; hosting, dominio e responsabile degli aggiornamenti; significato di «ditte»/partner (modulo disattivato).

Non inventare prezzi, recensioni, risultati, qualifiche, numeri di studenti o percentuali di successo. Non garantire il superamento dei concorsi. Non usare stemmi, marchi di terzi o fotografie di persone in divisa. Non suggerire affiliazioni istituzionali.

## Architettura

Sei pagine statiche, contenuto completo già nell'HTML:

- `index.html` (homepage)
- `carabinieri/index.html`
- `polizia-di-stato/index.html`
- `guardia-di-finanza/index.html`
- `polizia-penitenziaria/index.html`
- `recensioni-admin/index.html` (moderazione, `noindex`, senza dati finché non si accede)
- `privacy/index.html` (informativa sulle recensioni, `noindex`: dati pubblicati, email, conservazione, rimozione e titolare; i dati legali sono segnaposto)

La pagina dei corpi usa un template coerente (hero, materiali, gruppo, video/social, contatto finale) con contenuti e segno grafico specifici. Non duplicare la homepage né ripetere blocchi di copy identici nelle quattro pagine: se un contenuto è comune, vive nella homepage o in un componente condiviso. Header, footer e fascia di contatto sono l'unica ripetizione ammessa, perché ogni pagina statica deve restare completa senza JavaScript.

- `assets/CSS/style.css`: tokens, componenti, layout responsive, movimento. Font locali in `assets/fonts/`.
- `assets/img/logo.svg`: segnaposto del logo, unico file da sostituire quando il cliente fornisce il marchio definitivo.
- `assets/JS/content.js`: **solo** numero WhatsApp, messaggi delle azioni e mappa `routerKey` del selettore. Il testo pubblicato vive nell'HTML.
- `assets/JS/site.js`: miglioramento progressivo. Aggiunge la classe `enhanced` per il menu mobile, gestisce il menu (Escape, chiusura al clic, ripristino del focus, chiusura al breakpoint desktop), segna con `aria-current` la sezione in lettura nella nav della homepage, avvia i video delle schede mettendo in pausa gli altri, carica il modulo delle recensioni, gestisce lo scorrimento fluido con Lenis, l'ingresso delle sezioni con GSAP (fallback CSS) e rigenera gli href WhatsApp da `content.js`.
- `assets/JS/reviews.js`: carosello a schede verticali (frecce ai lati, linee di avanzamento, contatore, tastiera, avanzamento automatico ogni 6 s che si mette in pausa con puntatore o focus dentro, finestre aperte, scheda in secondo piano o fuori vista), recensioni pubbliche da `/api/reviews`, finestra di lettura completa, accesso con Google, invio con testo, percorso, fino a tre foto ridimensionate nel browser e anteprima della scheda aggiornata mentre si scrive. Il carosello si accende subito sulle recensioni statiche; quelle pubblicate si aggiungono davanti mantenendo al centro la scheda in lettura.
- `functions/`: Pages Functions. `_lib/` contiene sessione firmata HMAC, verifica crittografica dell'ID token Google, validazione e query, e il controllo dei percorsi di ritorno (`safeNext`: solo percorsi interni risolti su una base interna, niente barre rovesciate); `api/auth/*` gestisce OAuth e sessione; `api/reviews` elenca e accetta invii; `api/photos/[id]` serve le immagini da R2 solo se approvate; `api/admin/reviews` è riservato alle email in `ADMIN_EMAILS`.
- `schema.sql`, `wrangler.toml`, `package.json`: schema D1, binding locali/remoti e comandi Wrangler. `.dev.vars.example` è il modello delle credenziali locali; `.dev.vars`, `node_modules` e `.wrangler` restano fuori dal repository.
- `assets/video/`: `presentazione.mp4` (37 s, 720×1280, in apertura), `test-e-colloquio.mp4` (1:01, 600×1066), `criteri-perito-selettore.mp4` (0:46, 478×850), `preparazione-perito-selettore.mp4` (1:03, 576×1024, 13 MB) e `analisi-individuale.mp4` (0:20, 576×1024, 4,4 MB) nella sezione Video; i poster 9:16 sono in `assets/img/video-*.jpg`. I primi due filmati sono tagliati prima delle code con la locandina e il numero di telefono; negli ultimi due il numero è ancora nella fascia in basso, da rimuovere o tagliare prima del lancio.
- `assets/vendor/`: Lenis 1.3.27 (MIT) e GSAP 3.15.1 (licenza Standard «No Charge»), copie locali senza CDN; versioni, fonti e licenze in `NOTICE.md` e `LICENSE-lenis.txt`.
- `assets/JS/whatsapp.mjs`: valida il numero e codifica il messaggio con `encodeURIComponent`.
- `tests/`: verificano numero e link WhatsApp, `noindex`, assenza di prezzi e link vuoti, un solo `h1` per pagina, `main`, skip link e assenza di `id` duplicati.

Regole tecniche:

- Ogni azione WhatsApp usa `<a href="https://wa.me/393277897381?text=…">` con `data-wa="chiave"`. L'href statico garantisce il funzionamento senza JavaScript; `site.js` lo rigenera dal modulo dei contenuti. I test falliscono se non sono allineati.
- Percorsi relativi per asset e navigazione (`assets/...` dalla homepage, `../assets/...` dalle pagine interne): il sito deve funzionare sia dalla radice sia dalla sottocartella `/vinciconcorsi/` di GitHub Pages. Nessun `href`/`src` che inizi con `/` e nessun `url("/assets/...")` nel CSS.
- CSS e JavaScript si caricano con un parametro di versione: `assets/CSS/style.css?v=20261123-8` e `assets/JS/site.js?v=20261123-8` (`../assets/...?v=20261123-8` dalle pagine interne). GitHub Pages serve gli asset con dieci minuti di cache e senza il parametro un telefono può continuare a usare il CSS o il JavaScript vecchio. **A ogni modifica di `assets/CSS/style.css` o `assets/JS/site.js` alzare la versione in tutte e quattro le pagine HTML**, con lo stesso valore ovunque: la data del giorno in forma `?v=AAAAMMGG` (a più modifiche nello stesso giorno, `?v=AAAAMMGG-2`, `-3`…). `content.js` e `whatsapp.mjs` sono importati da `site.js` con un URL proprio: se cambiano, aggiungere lo stesso `?v=` ai loro import in `site.js`.
- Il numero WhatsApp non compare come testo né come link `tel:`: resta solo negli href dei link `wa.me`. Il test controlla che non torni visibile.
- Il contenuto deve restare leggibile e navigabile senza JavaScript. Non introdurre testi vecchi nell'HTML.
- Niente framework, build, CMS o dipendenze non necessarie. L'unico backend è quello delle recensioni (`functions/`, Cloudflare Pages Functions con D1 e R2, Google OAuth); le sole librerie restano Lenis e GSAP in `assets/vendor`, copiati in locale e senza CDN.
- Le recensioni inviate dal pubblico non sono mai fidate: nome e identità vengono dalla sessione Google verificata sul server, il testo è trattato come testo (mai HTML), le foto sono validate dai byte iniziali e restano in attesa di approvazione. Le mutazioni richiedono stessa origine e cookie `HttpOnly`; l'email non viene salvata né pubblicata.
- Non caricare nel repository il CSV o le risposte integrali del cliente: contengono dati privati.

## Direzione grafica adottata (18/11/2026)

Proposta per l'anteprima, da validare con il cliente.

- Fondo avorio luminoso `#fffdf8`, superfici azzurro tenue `#eef3fb`, testi blu navy `#0d2350` / `#3b4a63`.
- Rosso acceso `#e2231a` (testo piccolo: `#b3140f`) usato con intenzione: numeri di sezione, segni, dettagli. Verde `#0a7f45` riservato alle azioni WhatsApp. Header e chiusura usano il navy `#0d2350`; la copertina del manuale resta rossa.
- Filetto tricolore unico sopra il footer; nessun altro segno della bandiera.
- Tipografia: Bricolage Grotesque per titoli e interfaccia, Instrument Sans per il testo, Instrument Serif corsivo per poche parole editoriali all'interno dei titoli.
- Composizioni asimmetriche ma leggibili, intestazioni con etichetta di sezione in maiuscoletto e filetto, liste invece di griglie di riquadri identici, alternanza chiaro/scuro: una sola sezione scura di forte impatto (Il metodo), una chiusura blu.
- Titoli display in peso 800, spaziatura stretta: più vicini al materiale promozionale approvato dal cliente.
- Apertura: a destra il video di presentazione dentro una cornice telefono verticale (9:16), con tasto play sovrapposto ed etichetta «Guarda la presentazione». Il video è locale (`assets/video/presentazione.mp4`, 37 s, 720×1280, 4,6 MB) con poster `assets/img/video-presentazione.jpg` (9:16, ritagliato sopra la fascia col numero); nessun embed di terzi. Senza JavaScript restano i comandi nativi del player.
- Sotto l'apertura, l'indice dei quattro percorsi numerati 01–04 (Carabinieri, Polizia di Stato, Guardia di Finanza, Polizia Penitenziaria) con la V del marchio come firma: su desktop quattro colonne, due sotto i 1150 px, una a 960 px.
- Nessun poligono, nessuna parallasse: l'unico movimento è l'ingresso della pagina, sospeso con `prefers-reduced-motion`.
- Segni originali per i quattro percorsi (V, cerchi aperti, gradini, sbarre), nessuno stemma.
- Movimento: ingresso della pagina misurato, comparsa delle sezioni allo scorrimento, microinterazioni su righe e pulsanti. L'unico movimento continuo è il cambio automatico delle recensioni, che si ferma appena il visitatore legge o interagisce; nessun cursore personalizzato.
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
- Le copertine dei manuali sono quelle reali fornite dal cliente (edizione novembre 2026); nessun titolo è indicato come in preparazione.
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

- 20/11/2026 · Navigazione senza numeri: le cifre restano solo nell'indice dei tre percorsi (01–03) e nelle voci della community, tolte da nav, menu, righe dei canali social e intestazioni delle sezioni (anche le lettere nelle pagine dei corpi); le voci della nav hanno 0.86 rem e filetto rosso sulla voce in lettura (`aria-current`), il menu mobile ha parole in Bricolage a 1.12 rem con freccia, CTA WhatsApp a tutta larghezza e gli orari «Tutti i giorni 16:00–21:00» sotto. Nella sezione Video sono entrati i due filmati del cliente, tagliati prima delle code con locandina, divisa e numero di telefono: «Test e colloquio» (1:01) e «I sei criteri del perito» (0:46), in due schede verticali sopra il testo e i canali social. Restano senza sottotitoli: da valutare una trascrizione prima del lancio.

- 20/11/2026 · Spazi e testi piccoli: introdotta in `:root` una scala unica di distanze (`--space-1` 6 px, `--space-2` 12, `--space-3` 18, `--space-4` 24, `--space-5` 36, `--space-6` 48, `--space-7` 48–72 fluidi) usata per margini, gap e padding; nessuna distanza improvvisata. Nessun testo scende sotto 0.74 rem (11,8 px): le micro-etichette che stavano tra 0.56 e 0.7 rem sono state portate tutte a 0.74 rem, i titoli non sono stati toccati.

- 20/11/2026 · Sezione Video: il testo non sta più da solo accanto alle schede. Testo e canali formano una colonna (`.video-side`) che chiude alla stessa altezza delle schede; sotto i 1150px la colonna scende sotto le schede, le due schede si dividono la riga e il testo va a due colonne (`columns: 2`, `break-inside: avoid-column`). Niente più colonna da 279px con 38 caratteri per riga.

- 20/11/2026 · Intestazioni di sezione: nessun paragrafo affiancato al titolo. Etichetta, titolo e testo stanno in colonna (`--space-3` tra titolo e testo) e l'etichetta si centra sulla prima riga del titolo con un calcolo che segue `--title-size`; l'intestazione usa `--space-5` tra le colonne e `--space-7` sotto. La stessa scala è applicata alle griglie di sezione (hero, metodo, manuale, materiali, domande, contatti, corpo, video) e al footer, con `--space-6` come distanza tra i blocchi.

- 20/11/2026 · Sezione Video della homepage: via il testo accanto al titolo e la colonna vuota sotto i canali. Ora è intestazione (etichetta + titolo) → due schede video a sinistra, con a destra una colonna sola che contiene il testo e l'elenco dei canali (nome a sinistra, invito a destra). Testo e canali stanno insieme apposta: le tre righe dei canali riempiono l'altezza delle schede, quindi non resta spazio bianco sotto il paragrafo. Sotto i 1150px la colonna va sotto le schede e il testo passa a due colonne, così la riga resta leggibile senza lasciare vuoti ai lati. Spazi della sezione sulla scala: `--space-3` tra le schede e tra nome e invito, `--space-2` sotto il poster, `--space-4` di respiro nelle righe, `--space-6` tra blocchi, `--space-7` sotto l'intestazione.

- 20/11/2026 · Cache degli asset: `style.css` e `site.js` sono richiesti con `?v=20261120` nelle quattro pagine, così un telefono non può restare su CSS o JavaScript vecchi serviti dalla cache di GitHub Pages; la versione va alzata a ogni modifica degli asset. Nello stesso intervento l'header non ha più `overflow-x: clip` (su Safari iOS ritagliava la tendina del menu) e il pannello del menu occupa esattamente la larghezza della pagina, senza i 20 px di sconfinamento orizzontale che aveva a menu aperto.

- 23/11/2026 · Header opaco: fondo navy pieno (`var(--ink)`) al posto del 96% con `backdrop-filter`, così il contenuto che scorre sotto non si intravede e non restano aloni sotto la testata. Nav a cinque voci (aggiunta Recensioni) e menu mobile verificati a 360, 390 e 1440 px: nessun overflow orizzontale, pannello opaco a tutta larghezza, CTA WhatsApp sotto le voci.

- 23/11/2026 · Schede video: sotto i 1150 px non superano i 478 px, la larghezza nativa del filmato più stretto (`criteri-perito-selettore.mp4`, 478×850), così nessun video viene ingrandito oltre i suoi pixel. Misure: 423 px a 961, 452 a 1024, 478 a 1100 (16 px liberi a destra) e 478 a 1150 (61 px liberi a destra); sopra i 974 px di riga resta quindi un margine a destra, sotto resta zero.

- 23/11/2026 · Recensioni: nuova sezione in homepage sotto i Video (`id="recensioni"`, in nav e nel footer). Carosello a una scheda per volta, senza avanzamento automatico: frecce, linee di avanzamento, contatore e tastiera, così nulla si muove mentre si legge. Da 861 px la scheda si ferma a 940 px (`min(calc(100% - 160px), 940px)`) e sta al centro, con un accenno delle altre due ai lati (poi offuscato: vedi la voce sul carosello centrato). Citazione a sinistra (538 px di colonna, 4 righe e 36 px sotto a 1440 invece degli 88 di prima) e firma in basso a destra. Con GSAP il movimento è interpolato (`power3.inOut`); senza GSAP o senza JavaScript restano lo scorrimento nativo e lo snap CSS, con frecce e linee nascoste finché lo script non le abilita. Contenuti iniziali: la recensione scritta di Vincenzo Paonessa, un estratto di messaggio ricevuto in chat e il giudizio «IDONEO/A» (poi sostituito dalla chiusura navy; per nomi ed esiti reali vale la decisione del 23/11/2026). Date di nascita e indirizzi PEC delle comunicazioni allegate restano fuori dal sito.

- 23/11/2026 · Terza diapositiva delle Recensioni: non è più una scheda-esito con «IDONEO/A» in grande. È la chiusura del carosello, su fondo navy: frase breve («Il colloquio si prepara prima di entrarci.»), pulsante WhatsApp con il messaggio generico `info` e una sola riga piccola sul giudizio della commissione («Il giudizio spetta alla commissione; il modo di arrivarci si prepara.»), che afferma la preparazione senza promettere esiti. Classi `.review-close`, `.review-close-line`, `.review-close-note`; la diapositiva resta in colonna anche da 861 px, senza la griglia citazione/firma, e le vecchie regole `.review-verdict*` sono state rimosse. Le etichette delle linee di avanzamento leggono l'`aria-label` della diapositiva (la terza si chiama «Chiusura»).

- 23/11/2026 · Carosello centrato: la diapositiva attiva sta al centro della vista, non più incollata al bordo sinistro, e le due laterali restano visibili ai lati offuscate (opacità 0.6, scala 0.97 e 1 px di sfocatura, continui anche durante il trascinamento). Lo script calcola il fuoco a ogni scorrimento con GSAP (`gsap.set`) e, senza GSAP, con gli stili in linea; il centraggio usa `offsetLeft` di layout, perché la scala sposterebbe i rettangoli. Cliccare una laterale la porta al centro (i link dentro restano link), il focus da tastiera riporta piena la diapositiva che lo riceve e con `prefers-reduced-motion` nessuna scheda viene offuscata. Spazi ai due lati del binario come pseudo-elementi `::before`/`::after` solo da 861 px; misure: 705 px di scheda e 56 px di accenno per lato a 961, 940 e 146 a 1440, a tutta larghezza a 390. La chiusura navy centra il suo blocco in verticale (24–58 px sopra e sotto secondo la larghezza) e la frase grande occupa due righe. Versione asset `?v=20261123-5`.

- 23/11/2026 · Quattro corpi e quattro manuali: aggiunta la pagina `polizia-penitenziaria/` con lo stesso schema delle altre (hero, materiali, gruppo, video/social, contatto), il quarto percorso in indice, percorsi, selettore, community, footer e FAQ. La sezione Manuali diventa una griglia di quattro copertine reali (`assets/img/manuali/*.webp`), ognuna con il proprio messaggio WhatsApp; ogni pagina corpo mostra la copertina del proprio manuale. Messaggi e test aggiornati (`manualPolizia`, `manualGdf`, `manualPenitenziaria`, `indice*`, `infoPenitenziaria`, `gruppoPenitenziaria`, `prezzoManuali`, `tempiManuali`).

- 23/11/2026 · Nuovi video: «Preparazione e perito» (1:03) e «Analisi individuale» (0:20) entrano nella sezione Video, che passa a quattro schede in fila con testo e canali sotto; poster locali ricavati dal primo fotogramma. I filmati mostrano ancora il numero di telefono nella fascia in basso: da tagliare o sostituire prima del lancio.

- 23/11/2026 · Recensioni: pubblicata la recensione reale di Mariateresa Rocchetto (concorso Carabinieri, CAR26) con l'esito «idonea alla commissione» e il ringraziamento a Oriano. Il cliente ha chiesto di mostrare i risultati reali, cambiando la regola precedente che non pubblicava i nomi accanto agli esiti: restano fuori data di nascita e PEC, e ogni esito convive con la nota «Nessun risultato è garantito» e con «un esito positivo non è una promessa per nessuno». Nessun esito inventato.

- 23/11/2026 · Carosello a profondità: le laterali non sono più solo offuscate. Opacità 0.6, scala 0.84, inclinazione 14° e profondità −160 px seguono lo scorrimento con continuità (GSAP `set`, fallback a stili in linea); la sfocatura di 1,4 px si applica solo a vista ferma, con un ritardo di 160 ms, e viene azzerata appena riparte lo scorrimento. Restano il clic sulla laterale per centrarla, il focus da tastiera e lo spegnimento con `prefers-reduced-motion`. Verificato a 961 e 1440 px: durante lo scorrimento `filter: none` su tutte le schede; a fermo 1,4 px sulle laterali, 0 sulla attiva. Versione asset `?v=20261123-8`.

- 24/11/2026 · Recensioni verticali: le schede passano da orizzontali a 9:16 (`aspect-ratio: 9 / 16`, larghezza `--review-w` legata all'altezza della finestra). Le laterali non sono più quasi trasparenti: opacità 0.88, scala 0.92, inclinazione 8°, profondità −90 px e al massimo 0.5 px di sfocatura a vista ferma. Il testo in eccesso si legge con «Leggi tutto», che apre una finestra con il testo completo e le foto; a 390 px le schede misurano 350×622 e a 1440 px 380×676, senza overflow.

- 24/11/2026 · Recensioni verificate con Google: chi ha fatto il percorso può inviarne una dopo l'accesso con Google OAuth diretto, allegando fino a tre foto JPEG/PNG/WebP da 5 MB ciascuna, ridimensionate nel browser a 1600 px e ricodificate in JPEG (i dati EXIF non partono). La recensione resta `pending` finché un'amministratrice o un amministratore, indicato in `ADMIN_EMAILS`, non la approva da `recensioni-admin/`; una sola recensione in attesa per account e massimo tre al giorno. Google verifica l'account, non il rapporto con il percorso: la dicitura è «Verificata con Google», non «cliente verificato». L'email non viene salvata.

- 24/11/2026 · Hosting GitHub + Cloudflare Pages: il sito statico resta nel repository; le Functions in `functions/` aggiungono OAuth, D1 e R2 senza build. `noindex` resta su tutte le pagine, inclusa la moderazione. La pagina `privacy/`, collegata dal footer e dal form, spiega dati pubblicati, email non salvata, conservazione, rimozione e diritti; denominazione e sede del titolare, partita IVA o codice fiscale, email o PEC e tempi di risposta restano da confermare e vanno inseriti prima di raccogliere recensioni reali.

- 24/11/2026 · Cache: CSS e JavaScript passano a `?v=20261124-2` in tutte le pagine, e `reviews.js` è importato con la stessa versione.

- 24/11/2026 · Ritorno dal login e avvio OAuth: `safeNext` accetta solo percorsi interni risolti su una base interna, quindi barre rovesciate e caratteri di controllo ricadono sul percorso di riserva; il ritorno ricontrolla il percorso anche se il cookie è firmato. `/api/auth/google/start` risponde 500 senza `GOOGLE_CLIENT_SECRET`, così nessuno parte verso Google per un accesso che non potrebbe completarsi.

- 24/11/2026 · Schede recensioni più corte e leggibili: la scheda resta 9:16 ma la larghezza scende a `clamp(15rem, (100svh − 21rem) × 0.5625, 21rem)` — circa 317×564 a 1440×900 invece di 380×676 — così l'altezza non invade la vista e il testo non si perde sotto la scheda vicina: le laterali ora hanno opacità piena e solo la scala (fino a 0.9) più 0.5 px di sfocatura a vista ferma; rotazione e profondità 3D sono state rimosse perché la prospettiva del binario tirava le laterali verso il centro e il loro bordo copriva il testo dell'attiva. Le etichette delle diapositive non contengono più «di 4» ma il nome della recensione, quindi `refresh()` non deve riscriverle quando arrivano quelle pubblicate e allinea in modo sincrono, senza il doppio passaggio in `requestAnimationFrame`. La privacy è linkata anche nel riquadro prima dell'accesso con Google, che ora spiega i tre passaggi (accesso, scrittura con foto, approvazione); il form mostra i limiti di testo e foto e il pulsante «Scrivi una recensione» è primario.

- 24/11/2026 · Recensioni più leggibili e invio più diretto: la scheda non è più 9:16 né legata all'altezza della finestra. Larghezza `clamp(19rem, 26vw, 22rem)` (304–352 px) e altezza minima `clamp(21rem, 52svh, 27rem)`, con il contenuto libero di crescere: le citazioni firmate non hanno `line-clamp` e si leggono per intero (via i «Leggi tutto» ridondanti), mentre quelle inviate dal pubblico restano a 10 righe con la finestra completa. Misure verificate: 350×432 a 390 px, 304×438 a 961, 352×438 a 1440; nessuna sovrapposizione (39–42 px tra le schede) e nessun overflow orizzontale. Sotto 861 px la scheda usa `flex: 0 0 100%` invece di `calc(100vw - 2 × gutter)`: il doppio margine e il `100vw` la facevano allargare oltre il bordo del telefono. Frecce ai lati senza cerchi: 38×46 px (30×44 su telefono), solo il segno su fondo carta, 10 px fuori dalla scheda attiva; `.reviews` è una griglia e le frecce occupano la stessa cella della fila, così si centrano sulla scheda e non sui comandi. Cambio automatico ogni 6 s, sospeso con puntatore o focus dentro, finestre aperte, fuori dallo schermo, scheda in secondo piano o `prefers-reduced-motion`; un comando manuale lo sospende per 12 s. Il controllo gira a ogni giro anche in pausa, così la ripresa non dipende da un evento di uscita che può non arrivare; durante uno scorrimento comandato (`scrollingTo`) il contatore resta sulla scheda di destinazione invece di attraversare le intermedie. Verificato in una finestra visibile: una variazione ogni 6,002 s; pause di 16–21 s con puntatore sopra, focus dentro, finestra aperta, carosello fuori schermo e scheda in secondo piano, con ripresa entro 6 s in tutti i casi. Invio più visibile: CTA in testa alla sezione, invito nella scheda di chiusura e form con anteprima della scheda (testo, nome, percorso) aggiornata mentre si scrive; su telefono dialogo più stretto, testo da 108 px e passaggi compatti. Giorni e orari «Tutti i giorni 16:00–21:00» rimossi dal menu mobile e dal contatto di tutte le pagine. Versioni asset: `site.js`/`reviews.js` `?v=20261124-9`, `style.css` `?v=20261124-6`.

Da registrare quando confermate: identità visiva approvata, gestione video, dominio e processo di deploy, perimetro del lancio, dati legali.
