# Vinciconcorsi · Anteprima

Anteprima statica in italiano con homepage e tre percorsi dedicati a Carabinieri, Polizia di Stato e Guardia di Finanza. Nessun framework, nessuna dipendenza, nessuna build: solo HTML, CSS e JavaScript.

## Avvio

Dalla cartella del progetto:

```sh
python3 -m http.server 8000
```

Apri <http://localhost:8000/>. Le pagine dei percorsi sono:

- <http://localhost:8000/carabinieri/>
- <http://localhost:8000/polizia-di-stato/>
- <http://localhost:8000/guardia-di-finanza/>

Per fermare il server: `Ctrl+C`.

## Controlli

```sh
node --input-type=module --check < assets/JS/content.js
node --input-type=module --check < assets/JS/site.js
node --test tests/*.test.mjs
```

I test verificano la validazione del numero WhatsApp, la coerenza tra ogni pulsante WhatsApp (`data-wa`) e il relativo `href` statico, il `noindex` e l'assenza di prezzi o link vuoti. Controllano anche che ogni pagina abbia un solo `h1`, un `main`, lo skip link e nessun `id` duplicato. Se cambi i messaggi in `assets/JS/content.js`, gli href nelle pagine vanno rigenerati: il test segnala il disallineamento.

## Struttura

- `index.html` e le tre cartelle dei percorsi: contenuto completo già in HTML, con metadati `noindex`. Le pagine funzionano anche senza JavaScript e usano percorsi relativi, così il sito si apre anche dalla sottocartella GitHub Pages (`/vinciconcorsi/`).
- `assets/CSS/style.css`: direzione grafica, componenti, responsive, movimento.
- `assets/JS/content.js`: numero WhatsApp e messaggi delle azioni. Il testo pubblicato vive nelle pagine HTML.
- `assets/JS/site.js`: miglioramento progressivo — menu mobile accessibile, ingresso delle sezioni allo scorrimento, parallasse leggera sull'artwork, rigenerazione dei link WhatsApp dai contenuti.
- Pagine dei corpi: hero, materiali, gruppo, video/social e contatto finale. Il blocco canali riusa il componente della homepage; i contenuti specifici del corpo sono gli unici a variare.
- `assets/JS/whatsapp.mjs`: validazione del numero e codifica sicura del messaggio.
- `assets/fonts/`: Bricolage Grotesque, Instrument Sans e Instrument Serif (sole varianti latine, licenza SIL Open Font License), serviti localmente.
- `tests/`: test delle funzioni di contatto e dei contenuti pubblicati.

## Direzione grafica

- Avorio caldo `#f7f2e6`, antracite `#16181a`, arancio vermiglio `#d9451b` usato con parsimonia, verde riservato alle azioni WhatsApp `#16754a`.
- Bricolage Grotesque per titoli e interfaccia, Instrument Sans per il testo, Instrument Serif corsivo per poche parole editoriali.
- Apertura asimmetrica con la scultura CSS/SVG «Scala V»: cinque piattaforme sovrapposte, l'ultima vermiglia.
- Numerazione delle sezioni, filetti sottili, intestazioni editoriali, lista percorsi a righe invece di riquadri uguali, una sola sezione scura di forte impatto e una chiusura vermiglia.
- Movimento breve e intenzionale, annullato con `prefers-reduced-motion`; nessun carosello, nessun player finto, nessun cursore personalizzato.

## Regole editoriali dell'anteprima

- Tutte le pagine sono `noindex`; nessun analytics, pixel, checkout o misurazione.
- Nessun prezzo è pubblicato: prezzi e disponibilità si concordano su WhatsApp.
- Il numero di telefono non è mostrato come testo: ogni contatto passa dal pulsante WhatsApp.
- Un solo manuale è confermato (Manuale attitudinale Allievo Carabiniere). Per Polizia di Stato e Guardia di Finanza esistono solo richieste di informazioni sui materiali.
- Nessun video è incorporato: i canali social reali sono collegati, i contenuti riservati non sono pubblicati.
- I gruppi sono community di Vinciconcorsi, non canali ufficiali dei Corpi; l'ingresso è su richiesta e approvato dal preparatore.
- La copertina del manuale è dichiarata come proposta grafica, non come copertina definitiva.

## Prima della pubblicazione

Confermare i titoli dei manuali mancanti, i link ai video, i tempi di consegna e aggiornamento, i dati dell'attività e le informative, il dominio e l'hosting. Verificare con un messaggio di prova il numero WhatsApp e i profili social. Solo dopo queste verifiche si può togliere `noindex` e disattivare la modalità anteprima.
