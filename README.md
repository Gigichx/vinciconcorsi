# Vinci Concorsi · Anteprima

Anteprima navigabile in italiano, con homepage e percorsi dedicati a Carabinieri, Polizia di Stato e Guardia di Finanza. Il sito è statico e non richiede framework, dipendenze o build.

## Avvio e verifica

Con Python 3 dalla cartella del progetto:

```sh
python3 -m http.server 8000
```

Apri <http://localhost:8000/>. Le pagine dei percorsi sono:

- <http://localhost:8000/carabinieri/>
- <http://localhost:8000/polizia-di-stato/>
- <http://localhost:8000/guardia-di-finanza/>

Per fermare il server: `Ctrl+C`. Per un controllo rapido dei file JavaScript moderni:

```sh
node --input-type=module --check < assets/JS/content.js
node --input-type=module --check < assets/JS/site.js
node --test tests/*.test.mjs
```

## Struttura

- `index.html` e le tre cartelle dei percorsi: pagine HTML con metadati noindex.
- `assets/JS/content.js`: modalità anteprima, marchio, recapito WhatsApp, social, percorsi, catalogo dimostrativo, video, community e modulo partner disattivato.
- `assets/JS/site.js`: template condivisi, navigazione, CTA e finestra WhatsApp accessibile.
- `assets/JS/whatsapp.mjs`: validazione del numero e generazione sicura del collegamento.
- `assets/CSS/style.css`: stile responsive e artwork tipografico originale per copertine e spazi video.

## Prima della pubblicazione

Aggiornare solo con informazioni approvate: numero WhatsApp in formato internazionale, URL social, concorsi e prove coperti, titoli e dettagli dei manuali, disponibilità e consegna, video, gruppi, presentazione del preparatore e dati dell’attività. Il catalogo supporta più prodotti per corpo. Verificare autorizzazioni e requisiti di lancio prima di disattivare la modalità anteprima; tutte le pagine attuali sono `noindex`. Nessun pagamento, analytics, pixel, contatto o profilo social fittizio è attivo.

La scelta di una realizzazione statica senza dipendenze è limitata a questa anteprima, così da poterla avviare subito e aggiornare i contenuti da un unico modulo. Non sono stati configurati hosting o deploy.
