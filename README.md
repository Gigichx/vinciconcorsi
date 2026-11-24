# Vinciconcorsi · Anteprima

Anteprima in italiano con homepage e quattro percorsi dedicati a Carabinieri, Polizia di Stato, Guardia di Finanza e Polizia Penitenziaria. Il sito resta statico — HTML, CSS e JavaScript, nessun framework e nessuna build — con un'eccezione: le recensioni verificate con Google usano Cloudflare Pages Functions, un database D1 e un bucket R2.

## Avvio

### Solo sito statico

```sh
python3 -m http.server 8000
```

Apri <http://localhost:8000/>. Le pagine dei percorsi sono:

- <http://localhost:8000/carabinieri/>
- <http://localhost:8000/polizia-di-stato/>
- <http://localhost:8000/guardia-di-finanza/>
- <http://localhost:8000/polizia-penitenziaria/>

Così il form delle recensioni resta chiuso: le API non esistono e la pagina funziona comunque con le recensioni già nell'HTML.

### Sito completo, con login e recensioni

Serve Node e una volta sola `npm install`; poi:

```sh
cp .dev.vars.example .dev.vars   # inserisci le credenziali Google
npm run db:local                 # crea le tabelle D1 locali
npm run dev                      # http://localhost:8788
```

Il server è Wrangler: serve il sito con le Functions, il database e l'archivio foto locali. Le credenziali Google reali vanno in `.dev.vars`, che non si committa.

Per fermare il server: `Ctrl+C`.

## Controlli

```sh
node --input-type=module --check < assets/JS/content.js
node --input-type=module --check < assets/JS/site.js
node --test tests/*.test.mjs
```

I test verificano la validazione del numero WhatsApp, la coerenza tra ogni pulsante WhatsApp (`data-wa`) e il relativo `href` statico, il `noindex` e l'assenza di prezzi o link vuoti, oltre ai percorsi di ritorno del login (`safeNext`) e all'avvio OAuth senza Client Secret. Controllano anche che ogni pagina abbia un solo `h1`, un `main`, lo skip link e nessun `id` duplicato. Se cambi i messaggi in `assets/JS/content.js`, gli href nelle pagine vanno rigenerati: il test segnala il disallineamento.

## Struttura

- `index.html` e le quattro cartelle dei percorsi: contenuto completo già in HTML, con metadati `noindex`. Le pagine funzionano anche senza JavaScript e usano percorsi relativi, così il sito si apre anche dalla sottocartella GitHub Pages (`/vinciconcorsi/`).
- `assets/CSS/style.css`: direzione grafica, componenti, responsive, movimento.
- `assets/JS/content.js`: numero WhatsApp, messaggi delle azioni e mappa del selettore (`routerKey`). Il testo pubblicato vive nelle pagine HTML.
- `assets/JS/site.js`: miglioramento progressivo — menu mobile accessibile, scorrimento fluido (Lenis), ingresso delle sezioni (GSAP, con fallback CSS), rigenerazione dei link WhatsApp dai contenuti.
- `assets/JS/reviews.js`: carosello a schede verticali, lettura completa, accesso con Google, invio della recensione con foto e anteprima della scheda.
- Pagine dei corpi: hero, materiali, gruppo, video/social e contatto finale. Il blocco canali riusa il componente della homepage; i contenuti specifici del corpo sono gli unici a variare.
- `functions/`: Cloudflare Pages Functions. Google OAuth (`/api/auth/*`), recensioni pubbliche e invio (`/api/reviews`), foto (`/api/photos/:id`), moderazione (`/api/admin/reviews`).
- `schema.sql`: tabelle D1 delle recensioni e delle foto.
- `wrangler.toml`: binding D1 e R2 per lo sviluppo e il deploy.
- `recensioni-admin/index.html` + `assets/JS/admin.js`: pagina `noindex` per approvare, rifiutare o eliminare le recensioni.
- `privacy/index.html`: informativa sulle recensioni, collegata dal footer e dal form. Spiega che cosa viene pubblicato, dove restano i dati, come chiedere la rimozione e chi è il titolare; i dati legali sono segnaposto da completare prima del lancio.
- `assets/JS/whatsapp.mjs`: validazione del numero e codifica sicura del messaggio.
- `assets/img/logo.svg`: segnaposto del logo usato in header e footer; va sostituito con il file definitivo (quadrato, sfondo trasparente).
- `assets/fonts/`: Bricolage Grotesque, Instrument Sans e Instrument Serif (sole varianti latine, licenza SIL Open Font License), serviti localmente.
- `assets/vendor/`: Lenis 1.3.27 (MIT) e GSAP 3.15.1 (licenza Standard «No Charge»), copie locali senza CDN; versioni, fonti e licenze in `NOTICE.md`.
- `tests/`: test delle funzioni di contatto e dei contenuti pubblicati.

## Direzione grafica

- Avorio luminoso `#fffdf8`, blu navy `#0d2350`, rosso acceso `#e2231a` usato con parsimonia, verde riservato alle azioni WhatsApp `#0a7f45`.
- Bricolage Grotesque per titoli e interfaccia, Instrument Sans per il testo, Instrument Serif corsivo per poche parole editoriali.
- Apertura asimmetrica: a destra il video di presentazione in una cornice telefono (tasto play ed etichetta), sotto l'indice dei quattro percorsi numerati 01–04 con la V del marchio come firma (quattro colonne sopra i 1150 px, due sotto, una a 960 px).
- Navigazione senza numeri: le cifre restano solo nell'indice dei quattro percorsi e nelle voci della community; le voci della nav hanno filetto rosso sulla voce attiva; nel menu mobile ogni voce porta una freccia e la CTA WhatsApp è a tutta larghezza.
- Sezione Video: quattro schede verticali in fila, sotto le quali testo e canali si dividono la riga. Sotto i 960px le schede passano a due colonne e testo e canali tornano in colonna; il testo va su due colonne da 760 a 1150px. Le schede non superano la larghezza nativa del filmato più stretto, per non ingrandirlo.
- Sezione Recensioni, sotto i Video: schede verticali più basse del 9:16 (350×432 a 390 px, 352×438 a 1440×900), una attiva al centro e le laterali piene, rimpicciolite fino a 0.9 e con al massimo 0.5 px di sfocatura a vista ferma. La larghezza è una misura da testo (304–352 px) e non dipende più dall'altezza della finestra: l'altezza minima dà presenza, il contenuto decide il resto, così la citazione completa resta nella scheda. Niente rotazione o profondità 3D. Frecce ai lati senza cerchi, linee di avanzamento e contatore; le schede avanzano da sole ogni 6 secondi e si fermano con il puntatore o il focus dentro, con una finestra aperta, fuori dallo schermo, a scheda in secondo piano o con `prefers-reduced-motion`. Il testo delle recensioni firmate si legge per intero; quello inviato dal pubblico, più lungo, ha «Leggi tutto» per la finestra completa con le foto. Sotto 861 px la scheda è larga quanto la colonna di testo (niente `100vw`), così non esce dal bordo del telefono. Il carosello si accende subito sulle recensioni già nell'HTML e aggiunge quelle pubblicate senza spostare la scheda in lettura. Senza JavaScript la fila si scorre a mano con lo snap del CSS. L'ultima diapositiva chiude con la scheda navy: frase breve, pulsante WhatsApp, invito a scrivere una recensione e una riga piccola sul giudizio della commissione.
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
- Le recensioni inviate dal pubblico richiedono l'accesso con Google e restano in attesa finché non vengono approvate. Google verifica l'identità dell'account, non che la persona abbia seguito il percorso: la dicitura «Verificata con Google» non va letta come «cliente verificato». L'email non viene pubblicata né salvata nella banca dati; del profilo restano nome, identificativo Google e foto se allegata. Le foto sono ridimensionate nel browser e i dati EXIF non vengono inviati. L'accesso alla scrittura è in testa alla sezione, nella scheda di chiusura e sotto il carosello; il form mostra un'anteprima della scheda (testo, nome e percorso) prima dell'invio ed è più compatto su telefono.
- Il numero di telefono non è mostrato come testo: ogni contatto passa dal pulsante WhatsApp.
- Quattro manuali confermati, uno per corpo (Carabinieri, Polizia di Stato, Guardia di Finanza, Polizia Penitenziaria), con le copertine reali dell'edizione novembre 2026 in `assets/img/manuali/`. Prezzo e disponibilità restano su WhatsApp.
- Cinque video locali, senza embed di terzi: la presentazione in apertura e, nella sezione Video, «Test e colloquio», «I sei criteri del perito», «Preparazione e perito» e «Analisi individuale». I canali social reali sono collegati, i contenuti riservati non sono pubblicati.
- I gruppi sono quattro, uno per corpo; restano community di Vinciconcorsi, non canali ufficiali dei Corpi. L'ingresso è su richiesta e approvato dal preparatore.
- Le copertine dei manuali sono quelle fornite dal cliente per l'edizione novembre 2026, non proposte grafiche.

## Recensioni con Google: pubblicazione su GitHub e Cloudflare

Il sito va su Cloudflare Pages collegato al repository GitHub: i file statici restano quelli di oggi, mentre la cartella `functions/` diventa il backend delle recensioni. Non serve una build.

### 1. Google Cloud

1. Crea un progetto su <https://console.cloud.google.com/> e configura la schermata di consenso OAuth (tipo External; in prova aggiungi il tuo indirizzo tra gli utenti di test).
2. In **Credenziali → Crea credenziali → ID client OAuth**, scegli **Applicazione web**.
3. Aggiungi come URI di reindirizzamento autorizzati:
   - `https://<progetto>.pages.dev/api/auth/google/callback`
   - `http://localhost:8788/api/auth/google/callback` (per lo sviluppo)
4. Conserva Client ID e Client Secret: il secret va solo nelle variabili di Cloudflare, mai nel repository.

### 2. Cloudflare

1. Crea il database e il bucket (una volta):

   ```sh
   npx wrangler login
   npx wrangler d1 create vinciconcorsi-reviews
   npx wrangler r2 bucket create vinciconcorsi-reviews
   ```

2. Copia il `database_id` restituito in `wrangler.toml` al posto degli zeri.
3. Applica lo schema al database remoto: `npm run db:remote`.
4. In **Workers & Pages → Create → Pages → Connect to Git**, scegli il repository e il branch da pubblicare. Come build command lascia vuoto e come output directory indica `/`.
5. Nelle impostazioni del progetto Pages, in **Functions → Bindings**, collega il database D1 come `DB` e il bucket R2 come `FILES` (se non arrivano già da `wrangler.toml`).
6. In **Settings → Variables and Secrets** aggiungi:
   - `GOOGLE_CLIENT_ID` (variabile)
   - `GOOGLE_CLIENT_SECRET` (segreto)
   - `SESSION_SECRET` (segreto; genera con `openssl rand -hex 32`)
   - `APP_ORIGIN` (l'origine esatta del sito, per esempio `https://vinciconcorsi.pages.dev`, senza barra finale)
   - `ADMIN_EMAILS` (le email Google che possono approvare, separate da virgola)
7. Fai un nuovo deploy. Il branch di produzione e i branch di anteprima hanno URL diversi: aggiungi entrambi gli URL tra i redirect Google e imposta `APP_ORIGIN` sull'origine che stai usando.

Il form e la pagina di moderazione funzionano solo sull'hosting Cloudflare: su GitHub Pages restano le recensioni già nell'HTML e il pulsante di invio non trova le API.

### Moderazione

Apri `https://<progetto>.pages.dev/recensioni-admin/`, accedi con un'email presente in `ADMIN_EMAILS` e approva o rifiuta. Una recensione approvata compare nella homepage al caricamento successivo; una rifiutata o eliminata non è più visibile. La pagina è `noindex` ma raggiungibile da chi conosce l'indirizzo: i dati restano protetti dall'API, che risponde solo agli amministratori autenticati.

### Checklist operativa (da fare)

1. **Google Cloud** — crea un ID client OAuth di tipo «Applicazione web» e aggiungi i redirect autorizzati:
   - `https://<progetto>.pages.dev/api/auth/google/callback`
   - `http://localhost:8788/api/auth/google/callback`

   Conserva Client ID e Client Secret: il secret va solo nelle variabili di Cloudflare.

2. **Cloudflare** — da terminale, nella cartella del progetto:

   ```sh
   npx wrangler login
   npx wrangler d1 create vinciconcorsi-reviews
   npx wrangler r2 bucket create vinciconcorsi-reviews
   ```

   Copia il `database_id` restituito in `wrangler.toml` al posto degli zeri, poi applica lo schema al database remoto:

   ```sh
   npm run db:remote
   ```

3. **Workers & Pages → Create → Pages → Connect to Git** — repository `Gigichx/vinciconcorsi`, build command vuoto, output directory `/`. Collega i binding `DB` (D1) e `FILES` (R2).

4. **Variabili del progetto Pages**:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET` (segreto)
   - `SESSION_SECRET` (segreto, genera con `openssl rand -hex 32`)
   - `APP_ORIGIN` (l'origine esatta del sito, per esempio `https://vinciconcorsi.pages.dev`, senza barra finale)
   - `ADMIN_EMAILS` (le email Google che moderano, separate da virgola)

5. **Redeploy**, poi apri `/recensioni-admin/` con l'account in `ADMIN_EMAILS` e prova invio con Google, moderazione e rimozione. Completa i dati legali del titolare in `privacy/`.

## Prima della pubblicazione

Confermare i link ai video, i tempi di consegna e aggiornamento, i dati dell'attività e le informative, il dominio e l'hosting. Verificare con un messaggio di prova il numero WhatsApp e i profili social. Solo dopo queste verifiche si può togliere `noindex` e disattivare la modalità anteprima.

La pagina `privacy/` descrive dati pubblicati, conservazione e rimozione, ma i dati legali del titolare (denominazione, sede, partita IVA o codice fiscale, email o PEC) sono ancora segnaposto: vanno inseriti prima di raccogliere recensioni reali. Il consenso è già raccolto nel form, ma non sostituisce l'informativa completa.
