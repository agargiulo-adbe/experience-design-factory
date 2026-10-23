# Il blueprint che si costruisce — blocco animato del motore

> Design del 23 ott 2026. Due famiglie di artefatti nate dalla stessa diagnosi: smettere di
> spiegare con muri di testo. La prima — il **blueprint che si costruisce** — è il cuore di
> questa spec. La seconda — il **film ispirazionale** — è un'estensione piccola a una pipeline
> che esiste già, e sta nella sezione 8.
>
> Nessun nome di persona e nessun fatto riservato di cliente: `docs/superpowers/**` è tracciato
> e il repo è pubblico. Gli incontri si citano per data e per ruolo.

## 1 · Il problema, misurato

Il 22 ottobre 2026, in una videoconferenza con una banca, un deck da 26 slide passato per tre
giri di panel è stato consegnato a sei persone. L'esito commerciale è stato buono. Il processo no,
e il difetto è stato nominato dai colleghi presenti nello stesso debrief, registrato:

- «in video loro si fissano sul leggere le slide, non si trovano … bisogna dargli delle **ancore**
  pure proprio da slide»;
- «tu ti sei spiegato benissimo, **ma io non ho capito**»;
- «deve essere molto più semplice».

Due misure dalla registrazione, che dicono la stessa cosa in numeri:

- il capitolo costruito per far parlare il cliente (18 minuti in scaletta) ha prodotto **2 minuti
  e 6 secondi** di parlato cliente prima che si passasse al blocco successivo;
- alla domanda più concreta dell'ora, posta nel vocabolario operativo del cliente, la risposta si
  è aperta con **«è un livello di astrazione ancora più alto»**.

La lettura: quando la slide porta prosa, chi ascolta legge invece di ascoltare, e chi parla
compensa salendo di astrazione. Il rimedio non è meno contenuto: è **contenuto che si costruisce
mentre parli**, con etichette corte ancorate alla cosa che descrivono.

## 2 · Il principio: ancore, non prosa

Il **redundancy principle** (Mayer, teoria cognitiva dell'apprendimento multimediale) dice che
si impara meglio da *grafica + voce* che da *grafica + voce + testo a schermo*: due fonti verbali
simultanee costringono al confronto e una si perde. L'effetto riportato sul transfer è intorno
a **0,69**.

La condizione al contorno è la parte progettualmente utile, e corregge il «via tutto il testo»:
**etichette brevi dentro il diagramma, collocate accanto all'elemento che descrivono, migliorano**
la comprensione, perché guidano l'attenzione invece di competere con la voce.

Quindi la regola di questo blocco, e il suo unico vincolo non negoziabile:

> **Sullo schermo vanno ancore, non frasi.** Un'ancora nomina un elemento. La spiegazione vive
> nella voce di chi presenta e, se serve per iscritto, nel drill-down (`HowItWorks`) o nelle note.

Onestà sulla fonte: il principio è stato raffinato e in parte contestato in letteratura (una
rassegna del 2026 lo discute esplicitamente). Si usa come **criterio di progetto**, non come
numero da citare in slide a un cliente.

## 3 · Che cosa esiste già (e non si riscrive)

Il meccanismo delle fasi è **già nel motore e collaudato**, in `packages/core/src/blocks/immersive/`:

- `RtcdpMockup.astro` (707 righe) e `GenstudioMockup.astro` (953 righe) fanno avanzare fasi
  **dentro una singola slide** con le frecce del deck;
- la tecnica è il monkey-patch dell'**istanza** `window.__edfDeck` in `astro:page-load`
  `{ once: true }`, con guardia `deck.slides[deck.index] === slide`, documentata nella memoria
  `mockup-navigation-patterns`;
- le fasi stanno in `position: absolute; inset: 0` dentro un contenitore `position: relative`,
  così il layout non balla al cambio fase;
- il reset avviene sull'evento `playSlide` che il deck emette sulla slide attiva;
- la slide radice usa `height: 100dvh` perché `deck.ts` impone `position:absolute` solo **dopo**
  il primo paint.

GSAP **3.15** è già dipendenza di `packages/core` e di ogni app, caricato con import dinamico e
con `prefers-reduced-motion` già gestito in `animations.ts:7-18`.

Da aprile 2025 GSAP è interamente gratuito anche per uso commerciale, **inclusi `DrawSVG` e
`MorphSVG`**, che prima erano a pagamento. Sono i due attrezzi esatti di un blueprint che nasce:
il tracciato che si disegna e la forma che si trasforma.

**Quello che manca** non è il meccanismo. È che oggi le fasi sono scritte a mano per due casi
specifici, **scattano** invece di costruirsi, e nessuna è guidata dal contesto del cliente.

## 4 · Il contratto dati

Il blueprint si **dichiara come dati**, mai come markup. Un'experience mette il suo in
`src/data/<nome>.ts` e il blocco lo rende. Il contratto vive in `packages/core/src/data/`.

```ts
type Ancora = { it: string; en?: string };          // ≤ 6 parole: è un nome, non una frase

type Nodo = {
  id: string;
  ancora: Ancora;                                    // l'etichetta, accanto al nodo
  gruppo?: string;                                   // per raggruppare visivamente
  nostro?: boolean;                                  // true = strato Adobe; default: del cliente
  immagine?: string;                                 // opzionale, uno slot del manifest asset
};

type Legame = { da: string; a: string; tratteggiato?: boolean };

type Fase = {
  id: string;
  entrano: string[];                                 // nodi/legami che compaiono in questa fase
  accesi?: string[];                                 // nodi messi in evidenza
  spenti?: string[];                                 // nodi attenuati (mai rimossi)
  titolo: Ancora;                                    // il titolo della fase: ≤ 8 parole
  titoloBreve?: Ancora;                              // versione per il taglio «in dieci minuti»
  esempio?: Ancora;                                  // il caso nel vocabolario del cliente
};

type Blueprint = {
  id: string;
  nodi: Nodo[];
  legami: Legame[];
  fasi: Fase[];                                      // da 3 a 6: oltre, è un capitolo, non una slide
};
```

Quattro scelte, con il loro perché:

- **`ancora` con un tetto di lunghezza, verificato dal gate.** È il principio della sezione 2 reso
  meccanico. Senza tetto, la prima scadenza riempie i nodi di prosa e il blocco diventa il muro di
  testo che doveva sostituire.
- **`titoloBreve` accanto a `titolo`, non un secondo oggetto.** La regola «un taglio corto è la
  stessa fonte, più corta» vale anche qui: il taglio da dieci minuti usa **fisicamente lo stesso
  blueprint**, con meno fasi e titoli più corti. Due copie a mano divergerebbero, come è già
  successo altrove.
- **`spenti`, mai «rimossi».** Un nodo del cliente non sparisce quando entra il nostro strato: si
  attenua. È una scelta di contenuto travestita da dato, ed è il punto: la forma deve dire «si
  appoggia sopra», non «sostituisce».
- **`nostro?: boolean` con default «del cliente».** Così l'impostazione di partenza di ogni
  blueprint è il patrimonio del cliente, e il nostro strato è l'eccezione dichiarata.

## 5 · La meccanica delle fasi

Il nuovo blocco è `packages/core/src/blocks/immersive/Blueprint.astro`. Riusa il pattern dei
mockup senza inventare nulla, con **una differenza sostanziale**: le fasi sono **cumulative**.

- **Non si fa `hidden` sulle fasi.** Si rende l'intero grafo una volta, in SVG, con ogni nodo e
  ogni legame a `opacity: 0`. Ogni fase è una **timeline GSAP** che porta allo stato di quella
  fase: i nodi che entrano salgono in opacità con una traslazione corta, i legami si disegnano con
  `DrawSVG`, gli `accesi` prendono l'accento, gli `spenti` scendono a un'opacità attenuata
  (mai sotto il minimo di leggibilità: è testo, e lo misura `audit:ink`).
- **Avanti e indietro sono simmetrici.** `deck.next` avanza la fase se ce ne sono altre, altrimenti
  chiama l'originale; `deck.prev` fa l'inverso. La timeline va riprodotta al contrario, non
  ricostruita, se no tornare indietro costa un lampeggio.
- **`playSlide` riporta alla fase 0** e azzera le timeline, come già fanno i mockup.
- **Un indicatore di fase** (`2/4`) sta nel contorno della slide, non nel contenuto. Serve a chi
  guarda (c'è ancora qualcosa) e a chi presenta (so dove sono). Essendo chrome, resta fuori dal
  conteggio slide e dalle misure dell'audit, come la firma co-brand.
- **Il grafo è SVG, il testo è HTML.** Le ancore non vanno dentro l'SVG come `<text>`: vanno in
  un layer HTML posizionato sopra, così restano DOM — e quindi misurabili da `copy-audit`,
  `audit:wrap` e `audit:ink`, traducibili da `<T>`, e selezionabili da chi legge.

**Perché live e non un .mp4.** Il difetto diagnosticato il 22 ottobre è stato non potersi fermare
e scendere quando è arrivata una domanda concreta. Un build live **si ferma sulla fase tre** e chi
presenta dice «ecco, qui dentro». Un video non si ferma, e in più porta la copia fuori dai gate,
perché diventa pixel invece di DOM. Il video renderizzato resta fuori perimetro (sezione 11).

## 6 · `prefers-reduced-motion`

La preferenza toglie il **movimento**, non l'**informazione**. Quindi: con la preferenza attiva
ogni fase rende **istantaneamente il proprio stato finale**, e le frecce continuano ad avanzare
di fase esattamente come prima. Nessun comando da accendere, perché non c'è nulla da recuperare:
il contenuto è identico, cambia solo la transizione.

Questo è diverso da `LoopVideo`, dove la preferenza nascondeva un contenuto (la clip) e serviva
un comando per riaverlo. Qui nascondere sarebbe sbagliato in modo opposto: lasciare chi ha la
preferenza attiva sulla sola fase 1 gli toglierebbe l'argomento.

Si verifica **nelle condizioni di chi guarda**: Playwright con `reducedMotion: 'reduce'`, non il
browser di prova.

## 7 · I gate — cosa si rompe, e l'estensione obbligatoria

Questa è la parte che non si può rimandare, e nasce da una lezione già pagata: **un gate che non
misura non è un PASS**.

**`audit:deck` deve diventare consapevole delle fasi.** Oggi misura la slide nello stato in cui
la trova, cioè **la fase 1**. Una sbordatura che nasce alla fase 3 passerebbe invisibile, e
sarebbe un HARD spedito in produzione. L'estensione a `scripts/deck-audit.ts`:

- rilevare le slide con `[data-blueprint]` e leggerne il numero di fasi da un attributo;
- per ogni fase, pilotare l'avanzamento **con la stessa via che usa il deck** (non toccando il DOM
  a mano, se no si misura uno stato che nessuno vedrà), attendere la fine della timeline, e
  rieseguire i check `c` (sbordature), `e` (testo su testo), `j` (ritagli), `k` (scroll nascosto),
  `m` (allineamento a bandiera);
- fallire nominando **slide e fase** (`architettura · fase 3/4`), se no il rilievo non si trova.

È lo stesso principio del check `exp`, che già ri-misura le disclosure da aperte.

**`audit:ink` per fase.** Le ancore stanno sopra un grafo che cambia colore e opacità fase per
fase: un'ancora leggibile alla fase 1 può finire su un nodo acceso alla fase 3. Va misurata dove
sta, con i pixel, in ogni fase. I nodi `spenti` sono il punto di rottura più probabile: attenuare
è una scelta grafica che diventa un difetto di contrasto.

**`copy-audit` già le vede.** Dal 13 ott 2026 il gate legge anche i campi dei dati, non solo gli
attributi di `<T>`: le ancore in `src/data/` sono misurate senza lavoro aggiuntivo. Va aggiunta
**una famiglia nuova**, perché il tetto della sezione 4 va controllato e non ricordato:

- `B1` — ancora oltre 6 parole: è una frase, non un nome;
- `B2` — titolo di fase oltre 8 parole;
- `B3` — blueprint con più di 6 fasi: è un capitolo, non una slide.

Senza `B1`, il tetto è una buona intenzione in un commento.

**`audit:wrap`.** I titoli di fase sono testo grande: valgono le preposizioni appese, e si legano
con lo spazio unificatore, mai riscrivendo né rimpicciolendo.

**Modifica al motore, quindi delta misurato.** Vale `core-change-measure-the-delta`: la sonda che
confronta il verdetto vecchio e nuovo su ogni slide di ogni app, prima di dichiarare chiuso.

## 8 · Famiglia 2 — il film ispirazionale, ancorato a un keyframe

Artefatto diverso, mestiere diverso: 3-5 secondi su copertina e chiusura che fanno **vedere dove
si può arrivare**. Non spiega niente, e non deve.

La pipeline esiste quasi tutta: `scripts/build-video.ts` genera, `scripts/seamless-loop.ts` ricuce
il giro, `LoopVideo.astro` lo monta nello slot `backdrop`. Manca un pezzo, e il gancio è già
previsto nel codice — `scripts/lib/firefly.ts:225` dice *«structured to later accept an
image-conditioning ref (image-to-video) without changing callers»*.

Dalle fonti interne Adobe (canale di engineering Firefly, **5 giu 2026 — datato quattro mesi, da
riverificare prima di implementare**):

- esistono endpoint V2/V3 per **text-to-video, image-to-video e video-to-video extend**;
- l'I2V passa da `POST /v2/storage/image` (byte grezzi → id di storage) e poi
  `POST /v2/videos/generate`;
- la richiesta è **size-driven**: `sizes[]` con `width`, `height`, `numFrames`. **Non esiste** un
  campo `aspectRatio`;
- `duration` accetta **3 o 5 secondi** e **solo con `model_version="video1_foundry"`**;
- nel prodotto esistono **Keyframe Image Upload con primo e ultimo fotogramma**, più Shot Size,
  Camera Angle e Motion presets.

Il lavoro, in tre righe:

1. `video.manifest.ts` guadagna `primoFotogramma` e `ultimoFotogramma`, che puntano a un fermo
   **reso dal deck stesso** nella palette del cliente. Così la clip è on-brand **per costruzione**,
   non per fortuna del prompt.
2. `generateVideo` accetta il riferimento immagine, carica il keyframe e passa l'id.
3. Il manifest **dichiara il modello**, e lo script **fallisce a voce alta** se `duration` è
   impostato su un modello che lo ignora. Un parametro ignorato in silenzio è un difetto che si
   scopre guardando la clip e chiedendosi perché dura altro.

`provenance.video.json` registra la sorgente del keyframe oltre al prompt. `MadeWith` dichiara
`▲ Adobe Firefly · clip` sulla slide — e solo lì, perché il credito è un fatto.

## 9 · Che cosa resta umano

Il blocco rende un ragionamento; non lo trova.

- **Quali tre-cinque fasi raccontano l'argomento.** È il lavoro, e nessun componente lo fa. Una
  fase in più non è un dettaglio: è una tappa del pensiero.
- **L'esempio nel contesto del cliente** — il loro prodotto, il loro canale, le loro parole. Viene
  dalla ricerca su di loro, non da un modello riempito.
- **L'analogia**, se serve. Una buona analogia vale tre fasi; una sbagliata le brucia tutte.
- **Verificare l'architettura con chi la possiede, prima di animarla.** Animare un'architettura
  sbagliata la rende solo più memorabile. Questo precede il build, non lo segue.
- **Leggere uno screenshot a 1920 di ogni fase.** Il gate misura le scatole; la leggibilità la
  si guarda.

## 10 · Ordine di consegna

1. **Un build a mano, dentro un'app, per una sola slide di architettura** (tre fasi: lo stack del
   cliente intero → dove si ferma → lo strato che si appoggia sopra). Nessuna modifica al motore,
   nessun rischio per le altre experience. Serve da caso reale.
2. **Estrazione in `packages/core`**: `Blueprint.astro` + il contratto dati della sezione 4,
   con il caso del punto 1 come primo cliente del componente.
3. **`audit:deck` consapevole delle fasi, `audit:ink` per fase, famiglia `B` in `copy-audit`.**
   Questi **atterrano con il punto 2**, non dopo: un blocco animato senza gate per fase è un
   generatore di HARD invisibili.
4. **Delta sul motore** su tutte le app, poi si dichiara chiuso.
5. **Famiglia 2**: I2V con keyframe (sezione 8), dopo aver riverificato le fonti interne.

L'ordine non è negoziabile fra 2 e 3. Fra 1 e 2 c'è un'attesa voluta: si estrae un'astrazione
quando si ha un caso, non prima.

## 11 · Fuori perimetro, e perché

- **Explainer renderizzato in .mp4 (Motion Canvas).** Motion Canvas è MIT e nato per explainer di
  diagrammi, e sarebbe lo strumento giusto **se** servisse un file. Oggi non serve, e un video non
  si ferma per rispondere a una domanda: rinuncia proprio alla cosa per cui il blocco esiste. In
  più porta la copia fuori dai gate. Congelato, non scartato.
- **Remotion.** Richiede licenza aziendale sopra un team piccolo: è un problema di procurement,
  non una scelta tecnica. Escluso.
- **Interfacce di prodotto generate.** Un modello video a cui si chiede un'interfaccia produce
  un'interfaccia inventata con numeri inventati: è un record fabbricato presentato come genuino,
  che la Quality Bar vieta, e davanti a chi usa quel prodotto si smaschera in pochi secondi. Dove
  serve mostrare un'interfaccia si usa il **mock reso dal motore con dati dichiarati illustrativi**
  (il precedente è la chat `.sd-chat` dell'experience Poste) oppure materiale di prodotto
  approvato.
- **Transizioni generative fra capitoli.** Sta in un'altra esplorazione (`FIREFLY-DECK-EXPLORATION.md`,
  livello L3) ed è estetica di deck, non spiegazione. Non si mescola con questo blocco.

## 12 · Rischi

- **Il blocco diventa decorazione.** Il presidio è la regola di ammissione: una fase entra se
  **cambia la conclusione** di chi guarda. Se togliendola l'argomento regge uguale, non era una
  fase.
- **Le ancore si allungano alla prima scadenza.** Presidio: famiglia `B` di `copy-audit`, HARD
  su `B1`.
- **La fase 3 sborda e nessuno la misura.** Presidio: punto 3 dell'ordine di consegna, che
  atterra insieme al componente.
- **Sei fasi diventano dieci.** Presidio: `B3`. Oltre sei non è una slide.
- **Si anima un'architettura non verificata.** Presidio: sezione 9, la verifica precede il build.

## 13 · Fonti

- Debrief interno del 22 ott 2026 (registrazione dell'incontro, dal minuto 47) — le tre
  citazioni della sezione 1.
- Redundancy principle: Mayer, teoria cognitiva dell'apprendimento multimediale; rassegna critica
  2026, <https://www.tandfonline.com/doi/full/10.1080/01443410.2026.2678483>.
- GSAP gratuito da apr 2025, plugin inclusi:
  <https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/> ·
  <https://gsap.com/community/standard-license/>.
- Motion Canvas / Remotion, licenze e destinazione d'uso:
  <https://www.pkgpulse.com/guides/remotion-vs-motion-canvas-programmatic-video-2026>.
- Firefly API, riferimento pubblico:
  <https://developer.adobe.com/firefly-services/docs/firefly-api/api/>. Video da immagini (403
  all'accesso automatico, da aprire a mano):
  <https://helpx.adobe.com/firefly/web/work-with-audio-and-video/work-with-video/generate-videos-using-images.html>.
- Forma dell'API I2V, `sizes[]`/`numFrames`, `duration` 3|5 con `video1_foundry`: canale di
  engineering Firefly, 5 giu 2026 (interno). **Datato: riverificare prima di implementare.**
- Pattern delle fasi: memoria `mockup-navigation-patterns`;
  `packages/core/src/blocks/immersive/RtcdpMockup.astro`, `GenstudioMockup.astro`.
