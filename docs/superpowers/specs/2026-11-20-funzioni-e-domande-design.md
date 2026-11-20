# Le card per funzione e le due domande del 19 novembre — design

> 20 nov 2026 · istanza: `apps/intesa-esperienza-cliente`, edizione da distribuire (A e B) ·
> prende il posto della sezione «Il ruolo, facoltativo» (§4) della spec
> `2026-11-19-edizione-lettura-design.md`. Repo pubblico: ruoli, non nomi; nessuna frase della
> riunione riportata alla lettera.

## Perché

I percorsi per ruolo riordinavano i capitoli: costosi da verificare, e il deck non ha abbastanza
materiale diverso per otto funzioni. Una **card per funzione** è un indice filtrato: una riga e
tre o quattro slide che esistono già, con il loro titolo. Nessun capitolo si sposta, nessuna
frase nuova da verificare oltre la riga della card.

Nella riunione del 19 novembre il cliente ha chiesto due approfondimenti che il deck non copre in
una slide sola: **come si governa il consenso di chi non è ancora cliente** (dove sta, chi ne è il
riferimento, come si uniscono fonti diverse) e **come si misura il contributo dei canali,
compresi quelli che non si tracciano per persona**. Diventano due slide, con un occhiello comune
che dice da dove vengono.

## Le card

- **Sette funzioni** (le chiavi di `utils/contributi.ts`, senza «Altro»), ognuna con una riga e
  al massimo quattro tappe. Due card non condividono più di una tappa.
- **Dove si aprono:** dalla copertina della lettura (una riga sotto «Apri la storia») e da un
  pulsante «Per funzione» nella barra dei comandi del deck, su ogni pagina. Mai un cancello.
- **Per non perdersi:** ogni tappa porta `?f=<funzione>`. Su una pagina aperta così il pulsante
  della barra mostra il nome della funzione e apre la sua card con la tappa corrente segnata: da
  lì si va alla successiva. Nessuna memoria nel browser, nessuna chiamata di rete.
- **Versione B:** ogni card chiude con «Chiedeteci da qui», che apre il modulo con la funzione già
  scelta. È il ponte verso la soglia delle tre funzioni del riepilogo.
- **Telefono:** niente card; la pagina breve resta com'è.
- Nel motore: `blocks/immersive/CardFunzioni.astro`; i dati nell'app: `src/data/funzioni.ts`.
  `check:edizione` verifica che ogni tappa esista e che il titolo scritto nella card sia quello
  della slide.

## Le due slide (in `approfondimenti`, in tutte le edizioni)

Occhiello comune: **Ci avete chiesto il 19 novembre**.

1. **Il consenso di chi non è ancora cliente** — tre modi di organizzarlo (il registro della
   banca comanda e la piattaforma applica · la piattaforma raccoglie e la banca riceve una copia
   con l'export dei dataset · il dato resta nel data warehouse della banca, con Federated Audience
   Composition, componente aggiuntivo) e **che cosa ferma un invio**: sempre (opt-out rispettato da
   Journey Optimizer, regole nell'audience, etichette d'uso verso terzi) e, **con Privacy &
   Security Shield**, le consent policy applicate da sole a ogni audience e canale. Questo
   corregge, dichiarandolo, una semplificazione fatta in sala.
2. **Dalla persona al budget** — Customer Journey Analytics misura per persona e confronta modelli
   di attribuzione; Marketing Campaign Analytics unisce marketing mix modeling e attribuzione
   multi-touch, misura l'effetto incrementale anche dei canali offline e confronta piani di
   budget. Che cosa entra: uscite e volumi dei canali, costi, conversioni; ritorno e piani si
   calcolano sui costi. È un'applicazione a sé su Experience Platform.

Fonti (Experience League, verificate il 20 nov 2026): consent policies e loro disponibilità con
Shield; opt-out in Journey Optimizer; consenso nelle definizioni di audience; export dei dataset;
Federated Audience Composition (prerequisiti); Marketing Campaign Analytics (overview, modelli,
glossario).

## Fuori da queste slide, di proposito

- **La compliance come motore** (come si imposta, come reagisce): non è chiaro se il cliente
  intenda il consenso o l'approvazione dei contenuti. Si chiede, non si sceglie.
- **Le referenze sulla politica di contatto:** il cliente ne ha una propria e matura. Prima si
  trovano referenze vere, poi se ne parla.
- **Se un modello di MCA giri senza dati di costo:** da confermare con uno specialist prima di
  scriverlo.

## Verifica

Build sala, A e B; `check:edizione` (nuovo controllo `funzioni`); `audit:deck --portatili`,
`audit:wrap`, `audit:fonti` sulle pagine toccate; schermate; `copy-audit` sui file toccati.
