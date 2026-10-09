# Handover — Parte 3 di 14
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 11. Change log recente

### Change log — due giri di panel, e quello che hanno trovato dentro le correzioni appena fatte (2026-10-09, notte) → §13, §32

Lanciati i due giri delta che erano P0 e che si potevano lanciare: **vetrina** (giro delta, sei
personas cieche + fact-checker + arbitro, `docs/Factory/PANEL-VERDICT-2026-10-09-delta.md`) e
**Poste «Sei domande»** (giro 2, cinque personas,
`docs/Poste Italiane/PANEL-VERDICT-2026-10-09-round2.md`). Quindici agenti, zero errori.

**Poste, giro 2 — il verdetto migliore finora.** Credibilità **4,0** su cinque personas (tenuta),
**rilevanza +0,6** (3,0 → 3,6: le due personas del business, che al giro 1 davano 2, si sono
mosse), azionabilità +0,2, rischio fermo a 3,0, chiarezza −0,4. Il Responsabile Monitoraggio
Canali Digitali dà **rilevanza 5** e dice perché: `governare/slide-rilasci` è il caso d'uso che ha
portato lui, e si prova sulla suite di sviluppo senza chiedere niente a nessuno. Quello che la
costanza del rischio dice: il pilota in sola lettura adesso è scritto in due punti, ma il registro
delle azioni via MCP non c'è, e il deck lo ammette.

**Vetrina, giro delta — credibilità +0,3, rischio +0,8, e tre voti che scendono.** Il metodo della
serie Lighthouse è la cosa più citata del giro: tutte e sei le personas la indicano come la ragione
per cui credono al resto, «la pagina pubblica il proprio voto peggiore e ritira il proprio numero
migliore». Ma le stesse correzioni del 9 ottobre hanno aperto contraddizioni nuove, ed è la lezione
del giro: **una correzione può creare un'esposizione peggiore di quella che chiude.**

Applicati nove P0 nella stessa serata, in ordine di gravità:

- **Cinque experience erano indicizzabili, e nessuno se n'era accorto.** Il flag `noindex` esisteva
  in quattro `BaseLayout` ma partiva da **`false`**, e solo le pagine di dossier lo accendevano;
  l'Atelier e la **console di amministrazione** non avevano alcun meta robots. Misurato sul `dist`:
  36 pagine su 156 senza. La prova dall'esterno era nella serie Lighthouse appena pubblicata — SEO
  100 su Isybank, MIM, Eni e Atelier contro 60-63 sulle altre. Default a `true` nelle cinque
  BaseLayout, meta aggiunto in Atelier e console: **156 pagine su 156**, verificato ricontando il
  `dist`.
- **La serie Lighthouse aveva ricostruito l'indice dei conti riservati.** Elencava in chiaro nome e
  punteggio di cinque experience fuori vetrina — una regressione introdotta nella stessa giornata,
  su un rilievo che un giro precedente aveva già chiuso togliendo quei nomi da altre due sezioni.
  Le righe fuori vetrina restano nella serie, perché forchetta e conteggio devono restare veri, ma
  **senza nome**. In pagina resta vero il conto dei nominati: quattro, tre conti più l'Atelier.
- **La rivendicazione sul panel era smentita dal verdetto agli atti.** «Il panel ha alzato il voto
  sulla credibilità fra un giro e l'altro»: il verdetto del 3 ottobre registra −0,7. Sostituita con
  un fatto verificabile — «fra il primo giro e l'ultimo questa pagina ha ritirato tre propri numeri
  contro il proprio interesse».
- **Tre numeri della provenance erano sbagliati e scritti a mano.** Ora li conta
  `pnpm provenance:count` e la pagina li legge: **142 file, 123 record** (35 stock, 88 generati),
  **21 file senza registro**. «35 su 113» non corrispondeva né ai record né ai file; «sette clip»
  ne ignorava quattro (le tre di MIM e la copertina di Intesa non hanno un record video).
- **La base giuridica era quella sbagliata.** L'art. 13 della legge 132/2025 mette l'obbligo di
  informativa sui sistemi di IA in capo a chi esercita una **professione intellettuale** verso il
  destinatario della prestazione; la riconoscibilità generale dei contenuti sintetici sta
  nell'**AI Act, art. 50**. Un materiale di prevendita non è ovviamente né l'uno né l'altro, e la
  pagina adesso dice che quale dei due vincoli si applichi è la domanda da portare a Legal.
- **«In rollout dal 2 ottobre» prometteva più della fonte.** Le release notes Adobe, riverificate
  direttamente il 9 ott, dichiarano **Rollout Status: TBD** (rimandato dal 25 settembre) e GA non
  dichiarata. Corretto in dieci punti fra la vetrina e il deck di Poste: la data è annunciata, il
  rollout no. È la seconda metà della correzione del 6 ottobre, che aveva già sostituito una GA
  affermata con «rollout».
- Più: la licenza Microsoft 365 Copilot (l'agent si costruisce senza licenza; serve per **usarlo**,
  ed è per utente, non della tenant), e `blueprint#build`, che descriveva ancora l'audit come
  «lanciato prima di spedire» mentre dalla stessa giornata gira in CI.
- **I ritratti delle personas non erano mai stati committati** (`git log --all` su quei percorsi
  torna zero), ma la vetrina lo dichiarava come intenzione. Adesso è un controllo: `audit:leaks`
  fallisce se un `PANEL-PERSONAS.md`, un `PANEL-VERDICT-*.md` o un file sotto `panel/` entra fra i
  tracciati.

⚠️ **Due giri al massimo**: quello che è sopravvissuto non va a un terzo giro, resta un punto
aperto in §10. I più pesanti: l'**aritmetica dell'inventario** (tre insiemi diversi chiamati tutti
«undici», e due app Intesa che non esistono per nessun conteggio della pagina — va deciso se
entrano nel registry), i **21 file senza registro di licenza**, e sul deck di Poste la **numerazione
dei capitoli** (si chiama «Sei domande», la nav ne mostra sette, e «Evolvere» è 06 nel sommario e
07 in copertina) più i **nomi di tre prodotti reali** letti da una sandbox che la slide prima
dichiara non leggibile.

### Change log — sei P0 chiusi, e tre gate che prima non c'erano (2026-10-09, sera) → §10 (Parte 2), `CLAUDE.md`

Giro sul backlog P0 (`worktree-p0-sweep-2026-10-09`, quattro commit). Il filo che tiene insieme
quasi tutto: **tre volte in un giorno materiale riservato era già pubblico, per tre vie diverse,
e nessuna delle tre era «un nome in un documento»**.

- **Due dossier interni erano leggibili senza password** (`720757d`). `trenitalia-connessioni/dossier/`
  (FSTechnology) ed `eni-orbita/dossier/` avevano il renderer **copiato dentro l'app** e il contenuto
  **scritto nel file `.astro`**: compilato nel bundle e pubblicato su GitHub Pages. Chi apriva l'URL
  leggeva tutto — nome e ruolo del referente, lettura competitiva su un fornitore concorrente, mappa
  degli stakeholder, minutaggio e piano B dell'incontro. Il badge «Riservato» è una scritta, `noindex`
  tiene fuori i motori di ricerca, non chi ha il link. Contenuto spostato su `restricted_docs`
  (migrazioni **0027** e **0028**, seed git-ignorati, applicate al DB remoto), pagine ridotte a
  wrapper sottili sul motore condiviso. **Gli URL non cambiano.** Il contenuto Eni è stato *rimappato*
  dai `const` del vecchio file, non riscritto a mano. **Verificato**: nessuna stringa riservata nei
  bundle; il gate nega senza token; `pnpm audit:dossier` a **0 rilievi su nove dossier**.
- **Il motore dei dossier non ha più due lingue fisse nel markup.** Le ricava dal contenuto — una
  mappa di lingue è un oggetto con chiavi di due lettere e valori stringa — quindi il dossier Eni
  resta **trilingue IT/EN/FR** invece di perdere il francese nella migrazione. Sotto i 480px il
  selettore passa nel pannello dell'indice: tre bersagli da 44px non stanno nella barra di un telefono
  da 320 (misurati 355px contro 320), e il badge «Riservato» non si baratta per un selettore.
- **Il ruolo al posto del nome, e un gate che lo impedisca** (`27d64a4`). 53 riferimenti a 23 persone
  — referenti di cliente, le cinque personas del panel Poste con i loro voti, cinque colleghi Adobe coi
  loro — sostituiti col ruolo in 13 file tracciati. Ma il ritrovamento vero era altrove:
  **`0008_restricted_docs.sql` è tracciato e portava dentro di sé l'intero seed del dossier UniCredit**,
  otto persone del cliente con nome, ruolo e **URL del profilo LinkedIn**. Schema e policy restano nella
  migrazione, il contenuto esce dal repo (README **0008b**). Nuovo gate **`pnpm audit:leaks`**: cerca le
  **forme** — profili LinkedIn, seed dentro migrazioni, pagine di dossier che non usano il motore
  condiviso, slug col nome di una persona — più i cognomi di `docs/.names-watchlist.txt`, git-ignorata,
  perché un elenco di cognomi in un repo pubblico sarebbe la fuga stessa. Due nomi restano, **dichiarati**
  col marcatore `leaks-audit: attribuzione pubblica`: sono citazioni pubbliche con la fonte accanto, e
  toglierle le renderebbe non verificabili. Gira in CI.
- **Tre affermazioni della vetrina non reggevano** (`25fdd3a`). (1) La serie **Lighthouse** non era
  riproducibile: rigirata, lo stesso URL oscillava fino a 35 punti. Ora `node scripts/lighthouse-median.mjs`
  fa tre giri per pagina sul sito pubblicato, tiene la **mediana** e scrive data, strumento, condizioni e
  **oscillazione per pagina** in `apps/factory-showcase/src/data/lighthouse.json`, che le due pagine ora
  **leggono** invece di ripetere a mano. Misurato il 9 ott: accessibilità **100 su undici experience**, 97
  sulla vetrina, 95 sull'hub; best practices 100 ovunque; performance **fra 73 e 86 — nessuna pagina sopra
  90**, e UniCredit è a **81**, non a 96. (2) I **denominatori della provenance** erano i record, non i
  file: le quattro experience su stock hanno 37 file e il registro ne copre 16. (3) **Nessuna copertina**
  dichiara l'assistenza AI sul testo, e l'Atelier non ha nota: la frase diceva il contrario e ci poggiava
  il paragrafo sulla legge 132/2025.
- **Il tile Isybank del wall** aveva la nota tagliata, il puntatore del mouse nel fotogramma e il progresso
  in hover. Era catturato a 1280×720, **più basso di qualunque risoluzione che l'audit verifica** — e
  infatti a 1920/1440/1280×800 la copertina è pulita. `scripts/wall-tile.mjs` cattura a 1920×1080 e riduce
  a 1280×720; con Playwright il puntatore non esiste.
- **I sei fallimenti HARD sono chiusi** (`116a516`). Max Mara: il riquadro del visual di
  `motore-adobe/slide-datalake` misurava **0×0** — `w-full` in una colonna di griglia `auto` il cui
  contenuto è tutto assoluto non ha larghezza intrinseca — e la nuvola di punti sbordava di 182px; la
  targhetta «AEM Sites» sporgeva di 4px dall'anello di `slide-assemble`; su `acquisizione/slide-datalake`
  l'apertura di «Scopri come» faceva crescere di 129px anche la colonna del visual, per via di `h-full`.
  UniCredit, `b2b/slide-adriana`: colonna sinistra 874px contro 464 disponibili, l'eccedenza oltre 400px
  non si taglia — la citazione è diventata **una slide sua**, e il tipo non si è toccato.
- **`audit:deck` gira in CI**, che è il motivo per cui quei sei erano rimasti aperti per settimane.
  `pnpm audit:deck:ci` unisce i `dist` nell'albero che il deploy pubblica, li serve da **un'origine sola**
  e audita ogni deck con **`--hard-only`**: esce ≠0 solo sui HARD, i soft restano stampati. ⚠️ Tre trappole,
  tutte costate un giro: il server statico deve mandare **`content-length`** (senza, `networkidle` non si
  assesta e ogni rotta va in timeout — 982ms contro 30s); gli audit vanno lanciati **in modo asincrono**,
  perché `execFileSync` blocca l'event loop del server che sta nello stesso processo; e un **`--app`
  sconosciuto ricadeva in silenzio su maxmara**, quindi i primi tre deck «verdi» erano lo stesso deck tre
  volte. Ora è un errore, `--app` accetta anche il nome della cartella, e il gate **conta le rotte
  auditate**: zero rotte non è un PASS. Stessa famiglia del baco di `--only` già documentato.
- **Un link di dossier revocato adesso lo dice** (`5640618`). La RPC `get_shared_doc` restituisce
  esattamente `null` quando il token non esiste, e `null` era anche il segnale interno «errore già
  mostrato»: chi apriva un link morto restava su «Verifica accesso…» per sempre. Un vicolo cieco, non un
  rifiuto.

### Change log — il guscio sensoriale: marchio, movimento, suono, scala (2026-10-09) → `CLAUDE.md`, `skills/experience-design/references/sensory-shell.md`, commit `f84c767`→`fc28457`

- **Quattro cose che si vedono prima che si legga una riga, e che nessun check faceva fallire** (`f84c767`), ora generalizzate in una regola BINDING e in un reference della skill: **marchio** (ogni experience ha il suo `public/favicon.svg` geometrico — mai una lettera, mai il logo del cliente — e `pnpm brand:icons` ne deriva `icon-192`, `apple-touch-icon` e `og.png`); **movimento** (la clip in loop sta su copertina e chiusura, dove non si parla; `--boomerang` quando la clip deriva e nessuna dissolvenza fa combaciare testa e coda); **suono**; **scala**.
- **Il suono entra nel motore** con `packages/core/src/blocks/DeckAudio.astro`. Nessuna API genera musica (Firefly video esce muto): la traccia è **Adobe Stock 511567171**, licenziata **dopo averlo chiesto** — licenziare consuma una licenza, quindi si chiede prima — ricucita con un acrossfade di 3s e portata da 26 MB di WAV a **1,8 MB di AAC**. Parte **spenta** col comando in vista: il browser pretende comunque un gesto, quindi «acceso di default» non esiste, esiste «acceso al primo clic», che per chi apre il link è musica a sorpresa. Sale su copertina e chiusura, velo altrove; verificato leggendo `el.volume` (0.42 / 0.10 / 0). ⚠️ Trappola: `k` della dissolvenza va clampato **anche in basso** — il primo rAF può precedere `performance.now()`, il volume negativo faceva lanciare il setter e l'audio non partiva mai, in silenzio.
- **La scala per la parete.** Il tetto `clamp(…, 1.125rem)` della radice è già raggiunto a 1600px: oltre, **il tipo non cresceva più** (misurato: a 3840 il corpo restava a 18,4px e il contenuto copriva il 34% della larghezza). `DeckContainer` scala la radice a 20/24/28px sopra 2000/2560/3200 e **parte sopra i 1920**, per non invalidare i viewport già verificati. È **opt-in per app** (`<DeckContainer wallScale>`): accesa su tutti i deck insieme, un'altra experience usciva con dieci collisioni testo-su-testo ai soli viewport da muro. Nuovo flag **`--tv`** su `audit:deck` (2560×1440 + 3840×2160).
- **Il comando audio va dove si cercano i comandi** (`f848e78`): nella barra centrale del deck, in coda a frecce, contatore e schermo intero, con la stessa forma degli altri — una pillola accanto a tre cerchi era un corpo estraneo. Nella barra il **marchio prende il posto del nome scritto**, così scheda del browser e barra dicono la stessa cosa, e il posto liberato porta «Adobe × Intesa Sanpaolo» da tablet in su invece che solo sopra i 1536px. Il selettore è un **guadagno generale** (0,2×–1,5×), non un volume assoluto: moltiplica i livelli per slide invece di sostituirli, così la dinamica decisa in pagina sopravvive a qualunque posizione del cursore. ⚠️ Trappola: spostare il comando dentro la barra lo porta **fuori** da ciò che `transition:persist` protegge, e al primo cambio capitolo moriva con la pagina vecchia — audio acceso e nessun modo per spegnerlo. Ora torna nel nodo persistente su `astro:before-swap`; verificato contando i nodi dopo **due** navigazioni.
- **Il cursore non anima più la larghezza** (`fc28457`), rilievo del hook di design e legittimo: animare `width` fa ricalcolare il layout a ogni fotogramma, e la barra sta sopra una slide proiettata. Da spento semplicemente non c'è; acceso entra con opacity e transform, composite-only.
- **La nota di fonte regge anche a dimensione muro** (`252a26a`): il flag `--tv` ha trovato **sei HARD** su `intesa-scala-umana`, tutti sulla stessa coppia di righe — fra prodotti e nota restavano 7px, sotto i 16 che `g` pretende, e `exp` li ri-misurava da aperto. Il margine è ora dichiarato **sulla coppia, in rem**, quindi cresce col tipo e non dipende da chi si ricorda la classe. 0 HARD a 1920/1440/1280 **e** a 2560/3840.
- **Verifica complessiva**: 16 app buildate, typecheck pulito, audit a 0 HARD su cinque viewport per intesa e poste, screenshot letti a 1920 e 2560, audio e link provati a runtime.

### Change log — la CI torna verde, e i dossier smettono di parlare il nostro gergo (2026-10-09) → §34.5, commit `1bf33c1`, `f2305e4`

- **Otto errori ts(18047) tenevano rossa la CI dal 7 ottobre** (`1bf33c1`), in `SdOverview` di Poste. La guardia `if (!root) return` c'era: quello che mancava è il **restringimento del `const` dentro le closure** `open()`/`close()` dichiarate più sotto, che `astro check` vede ancora come `HTMLElement | null`. Un tipo esplicito dopo la guardia chiude il buco senza controlli morti a runtime.
- **Cinque dossier su sette parlavano ancora il nostro gergo.** La regola di §34.5 dice che li apre un collega Adobe che non sa nulla della Factory: titoli in italiano piano, nessun rimando a numero di sezione, ogni sigla sciolta. Ripuliti **in Supabase** — e qui sta il fatto riusabile: **lo stato vero sta nel database, non nei file di seed**, che sono storia. Via «War Room» (Intesa e Isybank), «Run of show», «Say / Don't», «Executive summary», «Mission brief», «caveat», «de-rischiare», «buy-in», «incumbent» e **tutti i rimandi `§`**, che adesso richiamano le sezioni per nome. **Sette su sette puliti**, verificato con una query sola. ⚠️ Due termini erano sfuggiti al primo giro perché differivano per maiuscola o per apostrofo tipografico: serviva `regexp_replace` con flag `gi`, non `replace`. **Chiude il P1 sui cinque dossier col gergo.**
- **`isybank-valitutti` portava il cognome di un referente dentro l'HTML di una pagina pubblica** — il gate protegge il contenuto, non il markup. Rinominato in **`isybank-momento` mantenendo lo stesso `share_token`**, come già fatto per Poste il 7 ott: i link distribuiti continuano a valere. **Chiude il P1 sullo slug.**
- **Un indice non è prosa duplicata** (`f2305e4`): la regola (c) del content-audit — nessuna frase di otto parole o più ripetuta nella stessa pagina — leggeva l'**anteprima rapida di Poste** come duplicazione, perché quell'indice elenca tutte le domande su ogni pagina ed è il suo mestiere. Venti rilievi, tutti lo stesso falso positivo, e la CI rossa. **Si toglie la navigazione, non si allenta la regola**: `<nav>` e i sottoalberi marcati `data-audit-skip` escono dal testo prima del confronto. ⚠️ Lo strip è uno **scanner che conta i tag**, non una regex: il primo tentativo con `[\s\S]*?</div>` non cambiava niente, perché il non-greedy si ferma al primo div chiuso e un indice ha div annidati. ⚠️ E **un PASS subito dopo aver cambiato il gate va provato**: verificato che lo strip tolga il 36% della pagina campione, che l'indice sparisca, che il contenuto resti e che una frase duplicata iniettata apposta sia **ancora** vista due volte.

### Change log — Intesa «Su scala umana»: la Prospettiva va pubblica, e il gate sulla copia (2026-10-08/09) → §33 (Parte 11), commit `86dd2b8`→`e9bc27a`

- **`apps/intesa-scala-umana` diventa una Prospettiva vera** (`86dd2b8`): 14 slide su quattro capitoli, il capitolo di apertura costruito su **fonti pubbliche datate del cliente**, cinque sfondi e una clip Firefly con provenance. ⚠️ **Con questo merge l'app va PUBBLICA su GitHub Pages**: resta fuori da hub e showcase di proposito (§33.3) — raggiungibile da chi ha l'URL, non pubblicizzata, `noindex` — e il contenuto è stato costruito perché reggesse quell'esposizione (nessun competitor nominato, nessuna cifra contrattuale, nessuna traccia del dossier interno). **Scelta dell'owner, presa l'8 ottobre.**
- **`scripts/copy-audit.ts` — la rubrica de-AI e la voce al plurale istituzionale diventano un gate misurabile** (`pnpm audit:copy`). Erano BINDING da mesi in `CLAUDE.md`, cioè affidate alla memoria di chi scriveva.
- **La clip di firma, ricucita e misurata** (`a86d38b`): 5s Firefly sulla slide-firma, stessa famiglia materica degli sfondi fermi, moto lento di proposito — una firma che si agita ruba l'attenzione proprio dove si chiede una data. `loop:seamless` porta il giro da **14,8 dB** (stacco visibile) a **30,9 dB**, sopra il riferimento di 29,8 fra due fotogrammi adiacenti. Convenzione rispettata: la clip ricucita sta sul Release `media`, nel repo entrano solo poster e `provenance.video.json`; aggiunta a `.gitignore` la cartella di lavoro `apps/*/media/`.
- **`preloadImage` era passato al BaseLayout senza essere dichiarato** (`4bc60ff`): cinque pagine, cinque errori ts(2322). **Il `build` non se ne accorge perché Astro non fa typecheck in build** — li ha colti `astro check` in CI, dopo il push su main. Il controllo da girare prima di pubblicare è **`pnpm typecheck`, non il solo build**.
- **Marchio ufficiale, allineamento centrale, sfondo su ogni slide** (`0f6f585`), cinque cambi su richiesta dell'owner dopo aver guardato il deck dal vivo. Il **logotipo Intesa Sanpaolo** è scaricato dal dominio corporate del cliente, portato a `currentColor` e iniettato inline nel lockup co-brand — nessun tracciato toccato, solo il fill, se no il marchio non si ribalta con la superficie; via il ripiego a wordmark. L'**allineamento centrale non è gusto, è lo standard di casa**, verificato contando: Poste 43 su 43, Eni 23 su 23, Agos 38 su 39 — questa app era l'unica tutta a sinistra. **Nove sfondi Firefly nuovi, cinque chiari e quattro scuri**: la dominante del cliente è chiara e un deck tutto notte tradirebbe la skin.
- **Le due idee raccontate per esteso, e tre diagrammi che le spiegano** (`e9bc27a`): il capitolo «Le idee» diceva le due idee in una riga ciascuna dentro la pila; ora **la pila è l'indice** — ogni strato Adobe porta alla sua pagina — e ogni idea ha la sua slide, costruita attorno a un disegno invece che a un elenco. Nella filiera la **governance è disegnata come binario sotto tutte e tre le tappe**, perché nel prodotto è un pilastro trasversale e non una quarta tappa. Il dettaglio tecnico sta dentro «Come funziona, in concreto», e lì dentro sta anche **il vincolo**: il connettore da solo non è la strada di lungo periodo. **Dirlo noi costa meno che farlo scoprire all'IT fra un mese.**

### Change log — Trenitalia: il dossier per il tavolo della Direzione Sales (2026-10-08/09) → §26.9 (Parte 7), commit `44c5abb`

- **Seconda pagina di dossier nell'app** (`44c5abb`): `dossier.astro` prepara il tavolo con la società ICT del Gruppo, **`dossier-sales.astro`** quello con la **Direzione Sales di Trenitalia** (incontro ≈1h, data da fissare dopo il 20 ottobre). Stanze diverse, interlocutori diversi, vincoli diversi — stessa experience nel registry, contenuto separato. Wrapper sottile sul motore condiviso; contenuto in Supabase dietro RLS, **niente nel bundle statico, verificato**.
- **La palette è letta, non ricordata.** `brand:tokens` su `trenitalia.com` (831 KB di CSS) dice che il colore di **sistema** è l'ardesia **#2f394e** (285 occorrenze), che il rosso del sito è **#d91835** (34) e **non** il rosso corporate #E2001A che usa il deck, e che il carattere è **Poppins** (26), distribuibile. Il rosso pieno su fondo scuro dà **3,1:1** e non basta per il testo: per l'inchiostro si usa la sua schiaritura **#ff8d9d** (7,2:1), misurata.
- **Tre assunti interni corretti dalla verifica**, ciascuno dei quali avrebbe fatto perdere la stanza. **(a)** Il Direttore Sales **non riporta all'Amministratore Delegato del Gruppo FS**: il vertice di Trenitalia è una funzione distinta, con un Direttore Generale in carica dal 23 luglio 2026 — ex Direttore Alta Velocità ed ex amministratore delegato di **Iryo**, lo sfidante ad alta velocità spagnolo. **(b)** «Entrare nel mondo LeFrecce» **non descrive un perimetro nuovo**: misurato leggendo le superfici, `lefrecce.it/B2CWeb/` serve **la stessa pagina di trenitalia.com, identica byte per byte** (stesso md5, stessa property Adobe Launch, stesso Google Tag Manager); il pezzo **non** strumentato è l'applicazione di acquisto `Channels.Website.WEB`, che nell'HTML servito porta solo GTM. **La vetrina si misura, la cassa no.** **(c)** Il Direttore Sales **non possiede il percorso di acquisto**: dal settembre 2025 vendita diretta, assistenza e post-vendita stanno nella **Direzione Customer Operations**, e il revenue management (quindi il pricing dinamico partito il 1° gennaio 2026) sta nel marketing.
- **Due correzioni in più il 9 ottobre**, dalla posta e dalla verifica pubblica. La persona che internamente circolava come «prima linea delle vendite» risulta a capo di **«Digital, Business Innovation & Communication»** (2021) e prima di e-commerce e canali digitali (2016): **non è un venditore, è il presidio digitale**, e questo chiude il buco «chi possiede il digitale in Trenitalia» ⚠️ con il riscontro fermo al 2021, da far confermare. E **il nome su cui si chiedeva «l'abbiamo mai incontrato?» non è più il tecnologo di Gruppo**: è **Presidente di FSTechnology** (verificato sulla pagina di governance), mentre il ruolo di Chief Technology, Innovation & Digital Officer è passato ad altri nel riassetto di fine luglio 2026. *(Nomi e grafie stanno nel dossier gated, non qui: vale il P0 sui file tracciati.)*
- **Il muro competitivo, da non prendere in faccia.** Il Direttore Sales è **sponsor pubblico di Salesforce**: Trenitalia sta mettendo **Agentforce** su vendite e assistenza e la citazione a favore è sua. Un'idea che somigli ad «agenti AI per le vendite», o a una piattaforma unica del dato cliente, gli chiede di rimangiarsi una scelta firmata. Le tre idee portate stanno tutte fuori da quel perimetro: **la piattaforma agenzie PICO** (~70.000 punti vendita, **in rifacimento adesso** dentro il Piano Strategico 2026 di FSTechnology — l'unico cantiere che è interamente suo), **l'intermodale** (Busitalia al 100% per 1.700+ destinazioni, prodotti **Air-Rail con ITA Airways** dal 2023 e un laboratorio congiunto sull'AI da marzo 2026) e **il contenuto su scala**, l'unico terreno senza concorrenti in quella stanza.
- **Una finestra operativa**: il **TTG Travel Experience di Rimini è il 14-16 ottobre** e lui ci sarà. È la fiera dove nell'ottobre 2025 ha fatto le dichiarazioni su cui poggia metà del dossier: **le fonti più citate hanno un anno e lì si rinfrescano**, prima dell'incontro. ⚠️ La bozza interna è attesa il **16**, cioè mentre lui è ancora a Rimini.
- **Misure**: `dossier-audit` **0 rilievi su 5 viewport**, 16 sezioni rese e nessuna vuota, PDF di 30 pagine. Memoria `trenitalia-direzione-sales`.

### Change log — Intesa Assicurazioni: la v8, i casi d'uso presi dalla libreria FSI (2026-10-08) → §35.11 (Parte 11)

Nessun commit: il deck vive in `docs/Intesa Sanpaolo/`, git-ignorata. Tracciato qui.

- **Dalla v7 (montata a mano, 17 slide, 26 MB) alla v8** (`build_slide_8ott_v8.py`, 14 slide, 6 MB, tutto vettoriale). Le tre slide incollate da deck Adobe — «Adobe is your AI toolkit» e due casi d'uso in inglese — sono **ridisegnate nel linguaggio del deck**, non lasciate nel loro template.
- **Due fatti verificati erano tornati falsi** ribattendo il testo a mano sulla slide dell'inventario: Experience Manager dato come «lo stesso strumento che fa i moduli» e il motore di lettura dato per presente nel gruppo — cioè l'errore di §35.5-ter, ricomparso il giorno dopo essere stato corretto. **La correzione di un fatto sopravvive solo se vive nel builder.**
- **Quattro casi d'uso ereditati dalla FSI Use Case Library** (167 slide lette, cinque scelte: 151 FNOL · 98+150 journey breaks · 77 call center context · 119 contenuto GenAI · 137 cross-sell dei moduli), ognuno ricontestualizzato con il suo divieto: niente firma elettronica, niente offerte a chi chiama per un sinistro, niente «campagne».
- **Tre slide eliminate** su richiesta dell'owner (l'aggancio, le domande del compliance, «sapere da dove veniva»), con le due righe che non si potevano perdere spostate dove il problema nasce. **L'appendice sul modulo diventa un caso d'uso nel corpo**, con la scala sconti di XME Protezione verificata sulla pagina pubblica (30% dal settimo modulo).
- **Il bilancio smette di ripetergli i suoi numeri**: una banda dice come li leggiamo e perché la slide esiste. **La terza lettura** passa da «i canali nuovi sono vostri da abilitare» a «il canale senza filiali», con la definizione di extra-captive nel corpo.
- ⚠️ **Un mio errore corretto in giornata**: MyInsurance HUB tolto dalla slide sostenendo che il bilancio lo citasse come cantiere. Il verbatim di §35.9 dice «è stato implementato». Nota del relatore corretta. Avevo rifatto una ricerca pubblica invece di rileggere la sezione che il fatto l'aveva già verificato.
- **Il titolo è deciso**: «La Macchina che serve il Cliente» (chiude la voce di backlog aperta il 7 ott).

### Change log — Poste: la riunione nel deck, l'anteprima rapida, il video intero in tre tratti (2026-10-07, pomeriggio e sera) → §32.12 (Parte 13), commit `408c28b`→`8eada70`

- **Il deck riallineato alla riunione del mattino** (`408c28b`), sulla trascrizione letta per intero (429 interventi, 76 minuti). Il **Comitato IA scende da cancello a nota**: in 76 minuti zero occorrenze di «comitato», «DPO», «garante», «GDPR», «legal», e il deck era costruito su una porta che il cliente non ha mai nominato. Sale invece la governance che ha chiesto lui: la quarta regola di «Proteggere» diventa **«Si apre per gradi, non "apri tutto"»**. «Evolvere» dice **iTouch** per nome (circa due mesi, **non è una licenza**, serve a misurare il consumo prima di impegnarsi) e l'attivazione è quella vera. Nuova slide in «Governare» con **il caso d'uso che ha portato lui**: la verifica di un rilascio contro i requisiti caricati una volta come skill. 0 HARD su 126 controlli.
- **«In azione» prende il 06, «Evolvere» il 07** (`3d5a860`), con due conteggi ciascuno vero nel suo posto: la nav conta il deck (01→07), la griglia della home solo le domande (01→06), così «Sei capitoli, sei domande» resta vera e la roadmap resta 6 card su 2 righe da 3. Nello stesso commit il **copy delle clip riscritto guardando il video** invece che le didascalie del player: «il riepilogo del lunedì» era sbagliato (il confronto è **mensile**), la correzione automatica delle etichette non era verificabile in 34 secondi ed è stata tolta, e «oggi in inglese» è stato riformulato — il prompt della demo è in italiano e la risposta pure.
- **Anteprima rapida: tutto il deck in una pagina, con ricerca e salto** (`a3db2da`). Otto rotte e 42 slide non si vedono da dentro: `SdOverview.astro` apre un indice col titolo vero di ogni slide, raggruppato per capitolo e con la domanda a cui il capitolo risponde. Ogni slide porta **parole chiave** nella mappa, perché al primo giro «costo» dava zero risultati. **Zero wiring**: il pulsante si innesta da sé in `[data-deck-controls]`. E **una duplicazione in meno**: la mappa delle slide esce dal `PAGE_REGISTRY` della Console — dove aveva già divergito su tre titoli — e diventa `src/data/slides.ts`, con `check:slides` che la confronta con i `<Slide id>` reali.
- **Il video innestato nel deck** (`d7638f0`): registrazione su **YouTube non in elenco**, facciata a poster e player che nasce **al clic** su `youtube-nocookie.com` — **0 richieste a YouTube prima del clic**. Un HARD di contrasto sul pulsante-facciata trovato e chiuso.
- **Poi i tratti diventano tre** (`8eada70`), perché il taglio in due era sbagliato: avevo escluso 0:00–2:05 scrivendo che «il contesto sta già in Accendere», dove ci sono tre righe sulle skill — e intanto il deck prometteva in due punti un meccanismo di cui avevo tagliato l'unica prova filmata. La **Parte 1** mostra l'interruttore Utente / Organizzazione sulle skill, la **memoria fra conversazioni spenta di serie**, e il contesto di marchio costruito caricando un documento, con le regole che portano un identificativo, la frase italiana da cui sono nate e il rimando alla pagina del PDF. Rivedendo i tratti 2 e 3 sono emersi tre errori di copy: le domande sono **quattro**, su quella quarta **Coworker dichiara il limite dei propri dati** («non un risultato sull'uso dei clienti» — il momento più forte del video, assente), e il controllo che il prodotto fa sul proprio documento, tolto il giorno prima come non verificabile, **sta scritto a schermo a 6:05**. Poster rifatti dai tratti giusti; a quello del documento è stata tagliata la barra del browser, che mostrava il percorso locale di un collega e la cartella di un altro cliente.
- **Verifica**: `audit:deck` **129 controlli, 0 HARD**, 66 soft; `check:slides` PASS su 8 rotte; deck a **43 slide**. ⚠️ **Un difetto che l'audit non vede**: a 1280×800 una nota finiva sotto la firma co-brand con `b:ok`, perché il check `b` misura solo `[data-deck-controls]` — memoria `audit-deck-false-pass` aggiornata.
- **Dossier** (migrazione `0026`, non tracciata): fatti verificati da 12 a **15 voci** — i due livelli delle skill, la memoria spenta di serie, Experience Context col vincolo «organizzazioni clienti Experience Manager» — più una domanda aperta, e **corretta la riga sulla lingua**.

### Change log — Intesa Assicurazioni: il perimetro si allarga, e un prodotto attribuito per sbaglio (2026-10-07, sera) → §35.5, §35.5-ter, §35.9, §35.10

Nessun commit: il deck vive in `docs/Intesa Sanpaolo/`, git-ignorata. Tracciato qui.

- **Il deck passa da v3 a v6 e cambia titolo.** «Dopo la firma» copriva metà del suo perimetro:
  arriva per via interna che ha un obiettivo anche sui clienti che non vengono dalla banca, e la
  verifica (§35.9) lo conferma **con due righe del suo stesso bilancio** — il principio sui
  «canali esteri ed extra-captive» nel Piano Strategico dell'Informatica 2026-2029 e
  **MyInsurance HUB**, che la sua area ha già implementato per abilitarli. ⚠️ Il **numero** no:
  nessuna fonte pubblica dà la quota dei clienti diretti, e il 7,5% di «vendita diretta» che sta
  nel bilancio è il **mercato italiano**, non loro.
- **Via tutte le domande stampate in fondo alle slide** (erano nove), via la parola «richiesta»
  (la chiusura è «se vi sembra utile»), corpo da 13-14 a **16pt** con una frase grande e il
  dettaglio sotto, due **stacchi scuri** più una chiusura scura per il ritmo.
- **Un tema nuovo, i contenuti** (§35.10), con la riga che dichiara di non sapere se sia il suo
  perimetro — ed è quella che lo rende portabile.
- **Grafica disegnata da primitive su sei slide** (grafico a pendenza indicizzato, schema di
  aggancio, catena del documento, sparso→unito, ventaglio, tessere) e **quattro immagini Firefly**
  con provenance. ⚠️ Il primo giro di immagini è stato **buttato**: era il tunnel di velocità al
  neon, tre volte uguale. ⚠️ `fill.transparency` **non esiste in python-pptx**: il velo resta
  opaco e le immagini spariscono, l'alpha va scritta nell'XML.
- **Attribuito al cliente un prodotto che non ha** (§35.5-ter), trovato solo perché l'owner ha
  chiesto «siamo certi?». La slide di sintesi diceva che «il motore che legge i documenti c'è
  già nel gruppo»: nel gruppo c'è **AEM Forms**, che compone e rende, **non legge**; PDF Extract
  e Document Generation sono Acrobat Services, SKU a sé, assente da tutte e tre le entità.
  Verificato su `data.xlsx` riletto riga per riga, su Field Readiness (zero occorrenze) e su
  Slack interno. **La sintesi è dove si rompono i fatti.**
- **Panel review:** i due giri del 6 ott (§35.8) coprono la **v3**. La v6 ha titolo, perimetro,
  struttura e un capitolo diversi → il verdetto **non copre lo stato corrente** (voce P0).

### Change log — Poste: l'ultima passata prima della sala (2026-10-07, mattina) → §32.11, commit `a386afe`→`80f4053`

- **Il costo detto come un fatto, e il limite di reporting col numero vero** (`a386afe`): i crediti di prova diventano una frase piana sulla copertina e in «Cosa vi portate a casa», senza numeri di settimana — è una prima sessione di introduzione, non una trattativa; il «monte richieste di reporting» ha il numero pubblico della Product Description (**Analytics Select, 500.000 richieste di report al mese per IMS org**, e le domande via MCP contano lì dentro). Via la nota sulla verifica interna per il settore finanziario, e via il criterio del 2024 sui «dati di altri reparti», che chiedeva «quali reparti?» a chi presidia i canali digitali: al suo posto l'altro criterio approvato, la facilità d'uso.
- **«Evolvere» riprogettato come proposta di avvio** (`71bfcb3`), da 4 a 7 slide: non «quali funzioni arrivano» ma **come si comincia** — quattro passi senza numeri di settimana, «chi coinvolgere» (cinque ruoli nell'ordine in cui entrano), il programma di affiancamento su Coworker chiesto per Poste **su Adobe Analytics**, e il perimetro verificato degli altri server MCP (AEM supportato · Workfront in preview · Target, AJO, Real-Time CDP ed Experience Platform in beta · più i server del cliente verso sistemi non Adobe).
- **E l'istruttoria torna a Poste**: «Settimana zero: Comitato IA e DPO» → «**L'istruttoria la aprite voi**»; via retention e residenza inventate, con una riga «quello che questa slide non dice» che rimanda ai termini Adobe; corretta la freccia dei permessi (**«Analytics + MCP Access»**, non «permessi dell'utente»); via «ventitré strumenti, quattro scritture», perché il numero invecchia a ogni release.
- **Lo slug del dossier non nomina più il referente** (`1a1aba9`): `/dossier/` è pubblica — il gate protegge il contenuto, non l'HTML — e dentro quell'HTML viaggiava `DOC_SLUG = "poste-sperandeo"`, leggibile con una GET senza token (verificato sul deployato). Rinominata la riga Supabase in **`poste-sei-domande` tenendo lo stesso `share_token`**: il link già distribuito continua a funzionare. ⚠️ Resta aperto su isybank (`isybank-valitutti`).
- **«In azione»: le due clip del cliente diventano un intermezzo del deck** (`70ac729`), fra Proteggere ed Evolvere, al posto di una slide creata dalla Console con un embed YouTube che non partiva. Cinque slide, `interlude: true` in `chapters.ts` → sta nel flusso e nella nav **senza numero** e fuori dalla griglia del percorso in home, che resta 6 card su 2 righe da 3. **0 HARD su 123 controlli**; i 9 soft nuovi stanno tutti sulle due slide con la clip — il parser non conta un video come massa di testo, limite già noto.
- **Le clip restano fuori dal Release pubblico** (`80f4053`): mostrano l'interfaccia di Coworker su Adobe Analytics, in rollout e senza GA dichiarata, e su un URL pubblico sarebbero scaricabili e indicizzabili (ritirarle dopo non le fa sparire dalle cache). Sorgente in `public/media/`, dove gli mp4 sono git-ignorati; **poster tracciati**, così le due slide reggono comunque, e la slide lo **dichiara** invece di offrire un play che non parte.

### Change log — Poste: il claim portante alla fonte, il video in locale, il dossier rinominato (2026-10-06/07) → §32.10, commit `2e307ea`

- **Due dubbi interni, entrambi verificati alla fonte.** «Su Analytics c'è un solo caso d'uso» era vero fino al 2 ott (poi l'indice di Experience League ha aggiunto le skill `aa` e `aa-root-cause-analysis`); «passa dall'Analytics Source Connector dentro AEP» è falso — release note e Slack interno dicono server MCP Analytics, nessun dato spostato in AEP.
- **Corretto un overclaim in cinque punti del deck** (`accendere`, `rispondere`, `capire`, `evolvere`, copertina) più l'etichetta di una fonte: su Adobe Analytics l'«apri in Analysis Workspace» non è nativo, è `upsertProject` col `workspaceLink`. Audit: 102 rotte, 0 HARD, soft invariato sulla baseline.
- **`CLAUDE.md` e la memoria di progetto allineati**: davano per GA il 2/10 ciò che la release note dichiara in rollout con **GA TBD**.
- **Il video demo non si mostra intero**: è una sessione di preparazione su dati CJA, con dentro il consiglio di Coworker su cosa non presentare. Due clip tagliate e verificate, player offline nella cartella git-ignorata, **nessun upload**.
- **Dossier Poste rinominato** da «War Room» a «Dossier», §01 corretta e **§13 nuova** («perché Coworker e non il server MCP»), dalla call Luxottica × Adobe del 6 ott: migrazione `0020` applicata e verificata sul link condiviso.

### Change log — Unipol: il rinnovo di Target a rischio e la leva Coworker (2026-10-06, sera) → memoria `unipol-target-retention-coworker`

- **Nessun commit di codice.** La sessione è stata lavoro di account: entra nel change log perché sposta una priorità e lascia due fatti riutilizzabili. I nomi delle persone restano fuori da qui per la regola del P0 di §10 (file tracciati, repository pubblico): valgono i ruoli.
- **Il rinnovo di Adobe Target su Unipol scade il 31 dicembre 2026 ed è a rischio.** Dopo anni di uso esclusivo, il cliente sta valutando un POC con un concorrente di personalizzazione. Il driver dichiarato **non** è l'arricchimento dati di cui si parlava: è che percepiscono l'interfaccia del concorrente come più orientata al business, e che dopo il Summit sono convinti che Target sia un prodotto deprioritizzato nella narrativa Adobe. Due obiezioni diverse, e la seconda non si smonta dal campo.
- **L'argomento scelto, e perché regge.** L'obiezione è sull'interfaccia: con Coworker il business user smette di imparare una UI e chiede, quindi il confronto schermo-contro-schermo si dissolve. Ma il punto vero è **Coworker su CJA e Target insieme** — capire cosa è successo nel journey e agire sull'esperienza nella stessa conversazione, sui dati del cliente. Un concorrente di sola personalizzazione non può pareggiarlo per struttura: non possiede il livello analytics del cliente. È anche la risposta più onesta al «Target non ha futuro», perché la direzione agentica si vede adesso e non al prossimo Summit.
- **Il cross-selling è l'altra metà.** L'high-touch su Coworker per CJA è partito col cliente il 1 ott e ha una call di stato settimanale: estenderlo a Target farebbe **un solo programma su due prodotti**, che difende il rinnovo di dicembre e insieme approfondisce l'adozione CJA. È l'ask portata alla call dell'8 ottobre con il PM del programma di retention Target.
- **Ruoli verificati, e un'assunzione corretta.** I tre interlocutori lato cliente sono stati verificati sui profili pubblici archiviati in `docs/Unipol/` (git-ignorata): **Adobe Target è del Lead Digital Intelligence (CDP & CRO Specialist)**, non del contatto quotidiano su CJA come si era scritto in prima battuta — ed è la stessa persona che sta valutando il concorrente. Sopra di loro c'è il Head of Digital Experience, che siede nella discussione sul rinnovo. Lato Adobe il programma di retention Target è passato di mano a fine settembre: chi lo teneva si è spostato su AJO.
- **Il connettore Microsoft 365 è in SOLA LETTURA.** Ha `Mail.Read` ma non `Mail.ReadWrite` (e nemmeno `People.Read`): legge e cerca la posta di `agargiulo@adobe.com`, **non** crea bozze — `outlook_create_draft` risponde 403 e servirebbe il consenso di un amministratore. Per produrre una mail modificabile: **AppleScript su `Microsoft Outlook`** (`make new outgoing message` + `make new to/cc recipient`, poi `open`; **senza `save`**, che su Mac vuole un percorso file e fallisce con −1701). Fallback per la formattazione: `textutil -convert rtf -format html` e il risultato negli appunti con `osascript -e 'set the clipboard to (read … as «class RTF »)'`. Un file `.eml` **non** serve: il nuovo Outlook per Mac lo apre in sola lettura, con il solo bottone «Import».

