# Handover — Parte 3 di 23
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 11. Change log recente

- **2026-11-11** · backlog: esce il P0 «la stanza Intesa del 5 novembre non è registrata» — il 5 è stato annullato dal cliente e l'incontro fissato al 19 (registro d'account, 3 nov); i P0 su «Dove ci innestiamo» e sull'invito prendono la data del 19.

### 2026-11-11 (tarda mattina) · Storia di Intesa: dopo il panel, copia, agenda e Prossimi passi

Otto commit dopo il secondo giro di panel, tutti **pubblicati**: `f9ff00a`, `ea3c77f`, `1fc829d`, `bc2a978`, `2e3dd73` (più i docs `c483850`). In sintesi: la lettura «prima che lasci l'email» con i sei canali; «Accanto» e «nome» tolti come gergo; Real-Time CDP uniformato; il passaggio Analytics di nuovo fuori percorso (scelta dell'owner del 10, ribaltata per errore dal giro del panel); **Prossimi passi da quattro slide a due**; il feedback del team sull'innesto (sistemi della banca non più nominati) e su m-06; **titolo in due livelli e agenda a sei voci** con gli stessi nomi in barra, copertine e `<title>`; i P1 di fatto rimasti dal panel (dato Nomisma, Projects, 12 ore, consenso via email). Gate su `2e3dd73`: `audit:deck` 177 righe 0 HARD, `copy-audit` 0 HARD, `audit:ink` pulito, `audit:taglio` allineato, `audit:og` PASS, `astro check` 0. Dettaglio in §42.14 (Parte 19). ⚠️ Non coperto dal panel: P0 in testa alla Parte 2.

### 2026-11-11 · Storia di Intesa: due giri di panel, e le correzioni pubblicate

Panel a due giri sullo stato pubblicato (rilevanza 3,5 → 4,0, rischio 3,17 → 3,67); innesto «Accanto» senza sostituzione disegnata, chiusura come proposta, passaggio Web Analytics nel capitolo 04, tre slide nuove, taglio corto con l'innesto e sette misure, momenti leggibili sugli schermi bassi. `8d9b79b`…`6d1c288`, pubblicati. Dettaglio, gate e punti aperti in §42.14 (Parte 19).

### 2026-11-10 (sera) e 11-11 · Storia di Intesa: «Dove ci innestiamo» a sei slide, una scala tipografica sola, la rotta delle campagne

Sei commit dopo `a504124`, tutti **pubblicati** (deploy riuscito): `7a43b22`, `376d7a8`, `ee00a1a`, `fdd61f5`, `ae91ab3`, `685832b`. Dettaglio in §42.13 (Parte 19).

- **«Dove ci innestiamo» a sei slide** (`7a43b22`): tolte «unifica» e «motore», che ripetevano schema, pop-in e capability; tre componenti col «+» per i deep dive (Real-Time CDP a 5 passi); «Decisioning» → «AI Decisioning» ovunque; capability su riconosce/sceglie/agisce/misura; ritorno a mappa. **«Quattro domande a cui CJA risponde»** con un disegno per meccanismo (`376d7a8`).
- **Revisione dell'intero deck**: una sola superficie scura, un solo occhiello verde, corpi leggibili nei capitoli 05-07, Coworker a disegno, demo a griglia, cifre TSB in grande, blu di «Farsi trovare» a `#5b9bff` per il contrasto.
- **Sette misure di titolo diventano una** (`ee00a1a`): a 1920 i titoli andavano da 29 a 58 px; ora titolo ≈ 48 e sottotitolo ≈ 24 in `clamp`. A capo armoniosi (`text-wrap` pretty/balance) su tutte le slide.
- **La proposta esclusa non reggeva** (`fdd61f5`): AI Decisioning escludeva lo sconto under 36, ma **Giulia ha 34 anni e ne ha diritto** — al suo posto la polizza casa, «solo dopo la firma». Scenario con titolo sul dato Nomisma/MutuiSupermarket (mag 2026) e frase chiave evidenziata; momenti con mockup più larghi e copy da annuncio; attribuzione con «Solo canali digitali» / «Con Customer Journey Analytics» e legenda.
- **La rotta delle campagne** (`685832b`): verificato che le *orchestrated campaigns* di Journey Optimizer sono documentate da ago 2025, quindi AJO può prendere anche le campagne pianificate. Tre fasi a `data-substep` sotto lo schema — accanto, una famiglia alla volta, una sola piattaforma — e alla terza il riquadro «Campagne» si spegne. Lo strumento di oggi **non si nomina**; la consegna da strumenti terzi, non nativa, sta nelle note del relatore come domanda.
- **Un difetto che esisteva solo in locale** (`ae91ab3`): URL degli sfondi senza virgolette, dove il percorso della cartella ha spazi.
- **Gate**: `copy-audit` 0 HARD / 0 SOFT · `audit:deck` 0 HARD a 1920, 1440, 1280 e 2560 · `audit:ink` pulito. ⚠️ A 3840 sette slide dei momenti con rilievi preesistenti (`wallScale` spento); non rilanciati `audit:fonti` (timeout) e `audit:og`. ⚠️ **Panel ancora fermo al 30 ott.**

### 2026-11-10 (pomeriggio) · Prospettiva Sales: agenzie, misure, registrati e mappa dopo il dry run

Diciassette commit da `65745cf` a `3942b9a`. Dettaglio in §37.20 (Parte 19). ⚠️ Online indietro alle 14:27.

### 2026-11-10 (mattina) · Prospettiva Sales: pop-in dei prodotti, test sulle schede, versione senza rete

Dodici commit da `b23baee` in avanti. Dettaglio in §37.19 (Parte 19).

- **Pop-in a passi** su ogni prodotto che si aggiunge: dieci scene, prodotto × caso d'uso.
- **Agenzie:** il confronto con e senza scheda diventa un test in due ondate assegnate a sorte. Via il pannello degli esperimenti.
- **Figura a tre finestre** su `slide-momenti`; `slide-collab` spenta e assorbita dalla slide Costa.
- **Rifiniture chiuse:** link Firefly, vetrina con cover, letto sonoro. I lockup mancanti non esistono su Brand Center: restano in testo.
- **Versione senza rete:** `scripts/build-offline.sh`.
- **Perimetro visibile:** pillole per Analytics e Target da una definizione sola; l'app esce dalle fonti future del pop-in CJA.

### 2026-11-10 (notte) · Prospettiva Sales: panel, mockup, Brand Center, contenuto chiaro

Sei commit da `5e98621` a `264b4e0`, tutti su `apps/trenitalia-prospettiva-sales`. Dettaglio e verdetto in §37.18 (Parte 19).

- **Committato e in rete** il deck a 25 slide (`5e98621`), che era solo in locale.
- **Mockup delle quattro idee rifatti:** schermate protagoniste, prima/dopo con ↓ solo su personalizzazione e contenuto. Sulla ricerca nessun «dopo»: sarebbe una risposta inventata. La homepage del «prima» ricalca quella vera; tolte le note che ripetevano la barra.
- **Contenuto da mercato a pubblico,** con tre immagini Firefly diverse: il responsabile dei canali digitali ha detto che tradurre non è una priorità. «Materiale» è sparito: fra ferrovieri è il rotabile.
- **Brand Center letto** (`docs/Adobe Material/Adobe Brand Center/`): i loghi delle applicazioni Experience Cloud sono ritirati, più prodotti = lockup della Cloud + nomi in testo. La striscia ora apre con il lockup CX Enterprise ufficiale e ogni tessera porta un'ancora di massimo sei parole. Memoria `brand-center-loghi-prodotto`.
- **Contenuto chiaro:** copertine, capitoli, domanda e firma restano foto, clip e rosso; la striscia Adobe è l'unico blocco scuro. Blocco in fondo a `global.css`, escluso per id: i token in `:root` non cambiano.
- **Sequenza** dichiara che al punto 2 si aggiunge CJA, e ogni passo entra con ↓. «Già vostro» è diventato «già nel Gruppo» (il contratto è di FS Technology).
- **CI rossa da `5e98621`** per due errori di typecheck: corretta in `98740de`.
- ⚠️ Trappola del giro: `object-view-box` al posto di `transform: scale` sulle foto, perché lo scale è letto come scorrimento nascosto e testo su immagine (check `k` e `d`).

### 2026-11-10 · Intesa «Adobe × Intesa Sanpaolo»: CX Analytics dentro «Dove ci innestiamo»
**Pubblicato** in `cb4bdea` (CI e deploy verdi): chiuso il P0 del commit. Innesto a tre componenti, slide capacità, ritorno a mappa, Scenario sul dato Nomisma, momenti rifatti. Panel no; `audit:taglio`/`og`/`fonti` da rifare. §42.12 (Parte 18).

### 2026-11-09 (notte) · Intesa «Adobe × Intesa Sanpaolo»: revisione del team e agenda a sette voci
`1bfd653`, `0fcb92f`, `5cea9f3`. Capitolo «Come si mette a terra», approfondimenti fuori percorso, barra sull'agenda, CX Analytics dopo lo Scenario, `/relatore/`. Dettaglio in §42.11 (Parte 18). In rete senza panel.

### 2026-11-09 (sera) · Prospettiva Sales: le due call di revisione, e il deck cambia forma

Dopo la review interna e l'allineamento con il responsabile dei canali digitali il percorso passa **da 38 a 25 slide**. ⚠️ Niente è committato, e il panel non copre questo stato.

- **Struttura:** introduzione a una slide di problemi + domanda + mappa; agenda con le quattro idee in una voce sola; «Chi siamo» dopo la copertina; capitolo 07 «La Roadmap» a cinque fasi con la distinzione fra ciò che si avvia subito e ciò che dipende da altri sistemi.
- **Contenuto:** l'idea 2 diventa «Personalizzazione su larga scala» (intermodale come esempio, si propone solo ciò che si può comprare); agenzie dichiarate ipotesi da approfondire, nessun numero di agenzie, online fuori perimetro; niente traduzione come leva; «Come ottimizzare le vendite?» sostituisce «Dove si perdono le vendite?». Tolti WeChat, Santander, Busitalia (nessun collegamento trovato su Roma-Matera).
- **Disattivate con un flag:** `slide-innesto`, `slide-aritmetica`, `slide-passo`. Fuori percorso: `/appendice/`.
- **Regole di design nuove** (in fondo a `global.css`): il colore dice il tipo di slide, titolo a quota fissa, tre soli contenitori. Componenti nuovi `Fascia` (striscia Adobe), `Tempi`, `ProblemiAncore`. Sei foto Firefly per le copertine in `src/assets/generated/sole/`.
- **Agenzie, verificato su Fluffy:** resta solo CJA (Analytics non serve, Target identifica visitatori e non agenzie); legare online e banco richiede una chiave comune, per esempio un codice offerta.
- **Gancio animato:** la tessera «La concorrenza» si accende con ↓ e con → si allarga fino a diventare la slide della domanda.

### Change log — la Prospettiva Sales cambia registro su tutto il deck, e una slide nuova su quello che il cliente ha già fatto (2026-11-09) → §37 (Parte 16)

⚠️ **Questa giornata non è committata**: 14 file modificati nel working tree, e la stanza è **il 10 novembre**. Quello che oggi è in rete è ancora lo stato del 7 nov. — `apps/trenitalia-prospettiva-sales`, `docs/Claude/posta.py`

- **Un giro di registro su tutto il deck, ~40 stringhe.** Il movimento è uno solo e si riconosce voce per voce: l'affermazione sul cliente diventa domanda o constatazione, e il dito puntato sparisce. L'**ask** è il caso che conta — «Confermate la rotta, e portateci al tavolo.» diventa «Una conferma sulla rotta, e un posto al tavolo.», e la chiusa «Non chiediamo di cambiare chi vi accompagna. Chiediamo di essere nella stanza quando il piano si scrive.» diventa «Chi vi accompagna oggi resta. Ci piacerebbe partecipare quando il piano si scrive.» (`ASK_A_VOCE` in `relatore.ts` allineato, perché l'ask sta in un posto solo). Poi: «la vendita è persa prima che una vostra pagina si apra» → «può sfuggire prima del vostro sito»; «a mano non si tiene il passo» → «a mano è difficile stare al passo»; l'etichetta dei punti da «tavolo condiviso» / «il vostro tavolo» a «decisione condivisa» / «decisione vostra»; «Siete in due» → «Oggi gli operatori sono due»; «Un canale che non vi racconta» (WeChat) → «I dati restano dentro WeChat»; «Quello che avete appena firmato» → «L'accordo con Costa Crociere». Due correzioni non sono di tono ma di **attribuzione**: il 96% passa da «parole sue dell'ottobre 2025» a «parole del Direttore Sales, ottobre 2025» (in un deck che gira, «sue» non ha antecedente), e le due referenze dichiarano «Settore diverso» invece di «Altro perimetro».
- **Slide nuova, `slide-citta`, nel capitolo 04** — «Una proposta legata alla città di chi naviga: l'avete già provata». È la prima slide del deck che parte da **un lavoro loro**: offerta mostrata a chi entra da una città, riconosciuta dall'indirizzo IP, **con Adobe Target**, in homepage su campione limitato; pubblico, proposta e gruppo di controllo già impostati e riusabili su altre città; e il punto vero — **dopo la formazione il team Trenitalia l'ha costruita e pubblicata in autonomia**. In fonte: realizzata da FS Technology con il partner di progetto e il supporto di Adobe Ultimate Success; la schermata è un esempio nostro. ⚠️ **Nessun risultato in slide, per scelta**: restano perimetro e che cosa dimostra, perché in sala c'è chi quel lavoro l'ha seguito e i numeri li racconta lui se vuole — e la nota per chi presenta lo dice (`attenzione`). Nuova variante `citta` in `MockIdea.astro`.
- **`SlideIdea.astro`: la colonna destra si scopre a mano.** I quattro blocchi passano da `data-reveal` automatico a **`data-substep`** — ↓ ne fa entrare uno, ↑ lo ritira, → passa alla slide dopo: chi parla decide quando si legge, invece di avere tutto addosso all'ingresso. Con «Riduci movimento» sono tutti visibili, ed è lo stato che i gate misurano.
- **`docs/Claude/posta.py`: il profilo Outlook non è più scritto a mano.** Era fisso su `Main Profile`; su un'installazione nuova si chiama `Main Identity`, e lo script falliva **senza dire perché** — visto il 9 nov migrando su un altro Mac. Ora il profilo si cerca (`glob("*/HxStore.hxd")`) e fra più candidati vince il più grande, che è quello con dentro la posta; se non trova nulla restituisce il percorso storico, così il messaggio d'errore a valle resta quello di sempre.
- ⚠️ **Gate 3.4**: il panel è del **6 novembre**, due giri, e non copre **né** il registro nuovo **né** la slide nuova. Vedi il P0 in testa alla Parte 2.

### Change log — il motore .pptx prende i trattamenti, i comandi d'account diventano espliciti (2026-11-07) → §39 (Parte 21)

- `5b19769` **`scripts/pptx/compose.py` cresce di 104 righe: trattamenti e geometria.** È il motore
  dei deck consegnati come **file**, ed è di tutti i clienti — i builder lo importano e restano
  contenuto puro, quindi un miglioramento qui vale per ogni deck futuro (regola «un artefatto, un
  design system» in `CLAUDE.md`). Insieme: rifiniture di `scripts/account-tidy.py` e di
  `docs/Claude/email.py` (il generatore delle bozze Outlook, corpo 11pt e interlinea 1,15), e
  **`/account-open` e `/account-close` più espliciti** (+88 righe fra i due comandi).
  ⚠️ **Nessuna experience toccata**: nessun gate di deck si apre, e il gate panel 3.4 non lo guarda.
- `3bc2104` **`account-tidy.py`: un accordo quadro è un contratto, non un'analisi.** Due regole di
  smistamento sbagliavano su file veri. «framework agreement», «accordo quadro», «amendment»,
  «addendum» e «annex» non portano `signed` nel nome e finivano in `03-analisi`: una fonte di
  primo livello classificata come materiale di lavoro. E `data.xlsx` — il nome che i gestionali
  danno agli export scaricati a mano — non veniva agganciato da `_data`, che cerca il suffisso:
  serve il nome per intero. Entrambe trovate smistando materiale d'account, non leggendo il codice.
- ✅ **Il working tree è pulito, e due voci di backlog si chiudono con lui.** Il `[P1]` «sedici file
  modificati e non committati» (agg. 5 nov) e il `[P2]` «working tree non pulito» (agg. 19 ott)
  descrivevano lo stesso lavoro in sospeso di più workstream: le nove modifiche su
  `intesa-esperienza-cliente` sono entrate la notte fra il 6 e il 7, il resto con `5b19769`.
  Verificato file per file con `git diff --quiet HEAD`. Erano il rischio da cui sono nati i 18
  file di TIM finiti su `main` per un `git add -A` (§38): chiuso finché resta pulito.


### Change log — Intesa, la Storia: i quattro giri di `/umanizza`, e un occhiello mai tradotto (2026-11-06/07) → §42 (Parte 18)

**Quattro commit** (`7ea2762` `a144a21` `1eca541` `e15d136`) su `apps/intesa-esperienza-cliente`,
da un'altra sessione. Il giro completo su **53 slide**, lette a stato pienamente rivelato — nel
deck i substep si aprono con ↓ e non con →, e la prima cattura le mostrava a metà.

**Prima dei giri, la base.** Il lavoro di copertina del 5 novembre era nel working tree e mai
committato: committato da solo, perché la base di un giro va committata prima dei giri. Nello
stesso tree c'erano otto file di un **Giro 1 interrotto** che portava `copy-audit` da 4 SOFT a 0
**imbottendo le frasi**, e faceva scendere il Gulpease su cinque pagine su cinque toccate.
Riportati a HEAD su decisione dell'autore: è il caso da manuale di un contatore che scende
mentre il testo peggiora.

**Giro 0 — il messaggio.** Tre titoli che funzionavano per qualunque cliente, riscritti: «Dalla
prima scintilla creativa alla distribuzione su ogni canale» → «Adobe ha due metà. Oggi parliamo
di quella che arriva al cliente»; e il titolo che *contava* i riquadri invece di dire che cosa
dicono → «Leader nei quattro Forrester Wave del 2026 che riguardano questo tavolo». Una
**ricostruzione che sembrava un dato vero**: i quattro numeri grandi dell'imbuto, in un deck per
una banca, si leggono come i suoi — «ordini di grandezza illustrativi» stava solo nella riga di
fonte a 12px, e ora le didascalie dicono «· illustrativo». E **la domanda più dura della stanza**
(«perché non costruirlo in casa?») era in fondo a una riga di fonte: adesso è una chiusa che si
legge. ⚠️ Affiancata e non impilata — in colonna il titolo finiva sopra la safe-area a 1440 e
1280 (check `c`, HARD).

**Giri 1-3.** `copy-audit` 4 → **0 SOFT** su 1.178 stringhe; il trattino-perno chiuso con la
**virgola** e non con i due punti, perché il deck ha già sedici perni e la cadenza è quella —
misurati prima di toccare, riverificati dopo: **16 → 16, telai 42 → 42, tolti e non spostati**.
Gli a capo: 18 rilievi e 8 parole appese → **zero in tre passate** (18 → 13 → 11), perché legare
sposta il punto di rottura. La misura ha trovato una pagina fuori scala — `analytics`, Gulpease
67,7 IT / 66,4 EN — e l'ha **lasciata stare**: è la slide tecnica di migrazione, la densità è
appropriata. Lì però lo sguardo ha preso quello che nessun gate vede: fra `</span>` e `<a>` c'era
un a capo, e in resa usciva «Workspace ( quick start)». E su `circolo/slide-due-ritorni` una
**banda vuota di 549px** misurata e non stimata, riequilibrata per id a 171px.

**L'orecchio, ed è dove il giro si è ripagato.** I fatti di terzi non sono stati pingati: aperti
e cercati. Tutti confermati alla fonte — i quattro Forrester Wave col trimestre esatto, e le due
referenze bancarie con i loro numeri. Otto interventi sull'inglese invisibili a ogni conteggio.
E **un occhiello che non era mai stato tradotto**: `risultati/slide-italia` lo teneva in un `<p>`
invece che in un `<T>`, e in inglese la pagina usciva con una riga in italiano in mezzo a tutto
il resto. **Unico caso in tutto il deck, e non lo vedeva nessun gate** — né `copy-audit`, né
`audit:deck`, né le lenti: per loro è testo in pagina e basta. Si vede guardando la slide
nell'altra lingua, che è il mestiere del Giro 3.

⚠️ **Il panel è del 30 ottobre e non copre niente di tutto questo**: è il P0 in testa alla
Parte 2, con l'incontro il 19 novembre e il check col referente l'11.

### Change log — la Prospettiva Sales passa dal panel, e la sera l'ask cambia contro il verdetto (2026-11-06/07) → §37.16–37.17 (Parte 16)

**Sei commit** (`7abb952` `80bfcbe` `791fb1d` `1b9d25b` `26b8a44` `fc53d8b`).

**Il panel, due giri, nessun agente perso.** Il verdetto precedente era del **12 ottobre** e da
allora il deck era stato riscritto quattro volte. Rischio 2,3 → **3,3** (il salto più grosso),
rilevanza 2,8 → **3,7**, credibilità 3,2 → **3,7**, azionabilità 3,2 → **3,8**, chiarezza ferma a
4,0. Sei «accetto a condizione» su sei in tutti e due i giri — e al 12 ottobre il Direttore Sales
era un **sì**: le quattro riscritture gli avevano fatto perdere quel sì.

**I quattro rilievi che nessun gate poteva vedere.** In 43 slide non compariva **la piattaforma
che il Gruppo ha già scelto** per il dato di cliente, e l'interlocutore ne è sponsor pubblico:
cinque personas su sei, tre dichiaravano che senza quella slide il file non lo inoltrano — nasce
`domanda/slide-innesto`, costruita sul **loro** comunicato del 5 marzo, che porta anche «acquisto
biglietti tramite agente AI» fra i traguardi 2026 e **sostituisce una riunione come fonte** del
capitolo 03. Il numero grande del capitolo sulle agenzie **non erano le agenzie** (i 70.000 sono
punti vendita sul Regionale, da un comunicato del 2014): ora è **12.400**, loro, dell'ottobre
2025. La richiesta si fermava un passo prima di diventare una data → nasce `rotta/slide-esito`.
E quattro capitoli su sette stanno nel perimetro di altre direzioni: due parole sotto ogni
fermata della mappa e una riga su ogni divisore — ⚠️ **senza riaprire la mappa delle direzioni
tolta il 4 novembre**, che era l'errore opposto.

⚠️ **E DUE REGRESSIONI, FATTE DALLE CORREZIONI DEL PRIMO GIRO.** Vanno agli atti perché sono la
classe di errore che il panel esiste per trovare, e questa volta l'ha introdotta la correzione —
il secondo giro si è ripagato da solo: **una citazione fabbricata** («il mercato che resta» fra
virgolette e attribuito a lui; il verbatim è un altro, e al primo giro la riga **non aveva
virgolette ed era giusta») e **un numero inventato al posto di un limite inventato** («12 lingue
in GA più 5 in beta» dove la fonte dice solo «supports 12 languages»).

**La sera: l'ask cambia, contro il verdetto.** La mezza giornata sui dati della rete agenzie era
l'unica voce che tutte e sei le personas avevano messo fra le «non toccare», ed era l'unica cosa
che il Direttore Sales poteva concedere da solo. Esce per **decisione dell'owner**, con la ragione
agli atti: quella sessione è già intrinseca al lavoro che corre con il presidio digitale e con la
società tecnologica del Gruppo. Al suo posto **tre cose che può dare solo lui** — il riscontro
sulle priorità, gli spunti che non abbiamo raccolto, un posto al tavolo quando si pianifica
l'offerta integrata — e `slide-esito` cambia soggetto: **che cosa va previsto perché una rotta
diventi un piano**. Dieci righe cadevano con la mezza giornata e sono state riallineate.

**Quattro giri di `/umanizza` sulle due slide nuove**, e due cose che solo i giri hanno preso:
dopo il Giro 0 le due slide avevano la **stessa forma** ed erano consecutive — le tre voci
dell'esito non sono parallele ma una **progressione**, e diventano un filo a tre fermate, che
porta anche la figura che mancava al capitolo; e «quello che si aggiunge è **poco**» era un
giudizio che la slide non dimostra, diventato «sono due voci».

⚠️ **Trappola di metodo, e vale per ogni app**: lo spazio unificatore scritto come **carattere**
dentro un heredoc viene appiattito a spazio normale, e il legame non si forma. Non si vede in
nessuna diff — lo prende solo `audit:wrap`. Si scrive come codice. Stessa famiglia: nel markup di
un `.astro` la sequenza `\u00a0` **non è un escape** e finisce in pagina come testo, e lì l'ha
preso `audit:taglio` leggendola come un numero orfano.

**Gate finali**: `copy-audit` 0 HARD e **0 SOFT** su 554 stringhe · `audit:deck` **0 HARD** ·
`audit:ink` PULITO su 806 blocchi · `audit:taglio` ALLINEATO · `audit:wrap` 17 contro 18 di
baseline · `astro check` 0 errori.

### Change log — i tre livelli, i quattro giri di `/umanizza`, la fisarmonica nel motore e la referenza che mancava (2026-11-06) → §37.15 (Parte 16)

**Sette commit** (`04a718d` `06435dd` `1e36957` `d0f4a57` `062f210` `6a99e9c` `f466943`), quasi
tutti su `apps/trenitalia-prospettiva-sales`, due anche su `packages/core` e sul template.

**I tre livelli — idea, capability, prodotto.** Il rilievo del dry run del 5 novembre era «dove
sta Adobe? Non l'ho vista: siamo troppo sullo sfondo», e si misurava: **tutte e sei le istanze di
`CheServe` stavano in `slot="nota"` di un drill-down**, cioè i nomi dei prodotti vivevano nello
strato della profondità mentre quella stanza li vuole in quello che si proietta. `idee.ts` porta
ora `capability` e `gruppi`, che **referenziano** i gruppi di `SERVE`: gli stati dei prodotti
restano letti dal contratto e vivono in un posto solo. Nuovi `MappaIdee.astro` (la mappa intera),
`PezziPerStato.astro` e `Bussola.astro` (il «siamo qui» sul divisore dei quattro capitoli che
*sono* un'idea). Via lo stato «prezzo già fissato»: l'accordo si rinegozia.

**`/umanizza`, tutti e quattro i giri.** Giro 0 (`06435dd`): nove slide su 36 riscritte. Il
difetto più grave non era un titolo debole — `ricerca/slide-canale` diceva «oggi la risposta manda
altrove a comprare» e **la nostra misura, tre slide prima, dice il contrario** (su ChatGPT il link
è «prenota con Trenitalia»). Giri 1-3 (`1e36957`): i telai sono rimasti **18, identici uno per
uno**, quindi nessun marcatore è stato spostato invece che tolto; su `rete` i perni retorici sono
passati da 7 per 100 stringhe a **0**. ⚠️ Il Giro 3 ha riaperto **le due referenze che
`audit:fonti` non riesce ad aprire** (business.adobe.com blocca gli accessi automatici), quindi le
uniche mai verificate da un gate: Telmore regge e meglio di come lo dicevamo (classifica a mano
9%, del sistema 11%), ma **«con la stessa vetrina di prima» nella pagina non c'è** — era una
nostra deduzione dentro una referenza; e la cifra di Santander **diceva più della fonte**.

**Il motore — due drill-down sulla stessa slide non stanno più aperti insieme.** `HowItWorks`
prende **`gruppo`**: due blocchi con lo stesso nome si escludono a fisarmonica. Serviva perché una
slide può portare due viste **alternative** della stessa cosa, e aperte insieme sommano le
altezze: misurato **105 px oltre il fondo** a 1920×1080, più uno scroll nascosto (check `k`,
HARD). ⚠️ **Il gate non lo vedeva**: `exp` apre una disclosure per volta, quindi la slide passava
tutti e tre i viewport e si rompeva solo in mano a chi le apriva tutte e due. L'ha trovata una
persona, guardando.

**Il motore — lo zoom del deck.** `zoom` sul `DeckContainer`: due comandi − e +, `+`/`-`/`0` da
tastiera, sei gradini da 85% a 140%, la scelta ricordata in `localStorage['edf:zoom']`. Scala la
**radice** e non il browser, così la composizione resta quella verificata dall'audit (lo zoom del
browser cambia la larghezza del viewport e con lei la safe-area). ⚠️ La base della radice si
**legge a runtime**, non si assume: non è un valore solo (18px in proiezione, 20/24/28 sopra i
2000 con `wallScale`), e una base scritta a memoria cambiava la scala anche a zoom 100%. ⚠️
**Opt-in, acceso SOLO nel template**: lo ereditano le experience nuove, le attuali restano spente
— ogni gradino è una composizione diversa e andrebbe ripassata con `audit:deck`. Verificato
inerte dove è spento.

**I prodotti, a colpo d'occhio.** Ogni prodotto ha il suo colore stabile (`COLORE_PEZZO`), così la
ricorrenza si vede: Analytics e Target tornano nel viaggio e nelle agenzie. ⚠️ Il colore sta nel
**punto**, non nel nome — colorare i nomi entra in conflitto col colore che dice lo stato, chiede
due palette per chiaro e scuro, e a corpo piccolo porta metà dei nomi sotto AA. Via anche la
legenda «già vostro, nel contratto · si aggiunge, oggi non c'è» da tutte le slide: spiegava due
simboli che ora si spiegano da soli.

**Le note per chi presenta** (`/relatore/`, linkata dalla console del deck). Per un collega che
apre il deck un'ora prima di entrare in sala: una riga per slide, sempre nello stesso ordine —
*Dillo così · Il fatto · Se chiedono · Attenzione*, incolonnate e colorate per famiglia. **Si
genera dal registro delle slide**, quindi una slide senza nota compare in rosso invece di passare
inosservata. ⚠️ È pubblica come il deck: niente dati di contratto, niente nomi, niente misure
interne, e **nessuna indicazione su che cosa non si nomina in quella stanza** — quella parte resta
nel dossier riservato.

**I divisori che si aprono.** Il problema non erano i prompt: la famiglia `ink` rimappa la
luminanza fra `#141a25` e `#7c8aa3`, quindi il punto più chiaro restava un'ardesia media e
**nessuna immagine poteva uscire luminosa**, «at night» nel prompt o no. Tre slot nuovi (`alba`,
estremo chiaro `#cfd7e4`) per i tre capitoli che aprono una possibilità. ⚠️ Al primo giro erano
stati schiariti **sul posto**: ma `bg-journey` fa da fondo anche a sei slide di contenuto, e
**nove blocchi di testo sono scesi sotto AA**. Ora sono asset separati. ⚠️ `build-assets`
**riscrive `provenance.json` con i soli slot generati**: dopo un giro parziale va ricomposto a
mano.

**Il taglio da dieci minuti, allineato al 100%.** La mappa delle idee rientra nella slide dei
quattro punti come terzo strato dietro «Scopri come» (regola dei due registri: i prodotti sono
profondità); nel taglio invece **diventa una slide**, perché come drill-down non entrava e perché
quella è la versione che l'interlocutore gira al suo capo. Otto slide invece di sette, dichiarate
in `cut-routes.ts` col motivo. Trovata e rimossa a mano una **versione breve orfana**
(`RETE.dopoBreve`): non rendeva più da nessuna parte, ed è il modo esatto in cui i due percorsi
ricominciano a divergere — `audit:taglio` non la vede, perché guarda quello che è reso.

**La referenza che mancava sul canale agenziale** (`f466943`). L'idea sulle agenzie era l'unica
delle quattro senza referenza, ed è quella su cui si fa la richiesta. Ora porta **Unipol**: la
scala dalle **loro pagine** col link («+2.000 agenzie sul territorio», «17,6 milioni di clienti»,
lette il 6 nov), il meccanismo dall'**intervento ad Adobe Summit 2026, sessione CP16**, citato
come intervento e **senza link** perché una sessione non è una pagina che si apre. Tre cose tenute
fuori, e il perché conta più di quello che c'è: le cifre del deck del Summit (2.100 agenzie, 16,8
milioni di clienti) **hanno un anno e sono superate dalle loro stesse pagine**; le metriche della
sessione (−20% troubleshooting, 2× root cause, −90% tempo di analisi) **misurano la velocità
dell'analisi, non il venduto per rete** e sotto una frase sulle agenzie sarebbero la prova
sbagliata; e la **quotazione in agenzia non si dice**, perché nei materiali il preventivo compare
solo sui flussi digitali del sito. Nessun ruolo e nessun nome: il repo è pubblico, e sul titolo di
chi ha parlato il registro d'account segnala un **conflitto fra la sua firma e il profilo
pubblico**, da chiarire prima di usarlo in un documento.

**Gate a fine giornata:** `copy-audit` **0 HARD e 0 SOFT** su 512 stringhe · `audit:wrap` **1**,
falso positivo («IT», codice di mercato in uno `<span>`) · `audit:deck` **0 HARD** su 129 misure
(soft 79, fisiologici su un deck ad ancore) · `audit:ink` **pulito** su 737 blocchi e 14
«Scopri come» aperti · `audit:taglio` **allineato** · `audit:fonti` nessun link rotto, **1 SOFT
dichiarato col motivo** (la homepage di Unipol è davvero il posto dove quelle cifre stanno) ·
`audit:og` PASS · `audit:docs` pulito · `pnpm build` verde su tutte le app · `astro check` 0.

### Change log — `/umanizza` passa a quattro giri: il Giro 0 decide che cosa dice la slide (2026-11-05)

**Un commit** (`de91557`), quattro file di metodo: il comando `.claude/commands/umanizza.md`,
`CLAUDE.md`, `skills/experience-design/SKILL.md` e
`skills/experience-design/references/umanizzazione.md`. Nessuna app toccata, nessun gate rilanciato
(sono documenti).

**Da dove viene.** La rielaborazione del testo della Prospettiva Sales (change log 2026-11-04,
§37.14) era un giro di natura diversa dai tre dell'umanizzazione: non toglieva marcatori, cambiava
**che cosa la slide dice** — gli slogan che nascondevano il dato che li reggeva, le frasi da
rileggere due volte, le cause che la slide non dimostrava. Quel giro adesso ha un nome e sta nel
comando: **Giro 0 — il messaggio**, e viene prima dei tre. Rifinire il ritmo di una frase che dice
la cosa sbagliata è lavoro buttato.

**La regola che cambia, ed è il motivo dell'allineamento.** Il vincolo di lunghezza **±10%** era
scritto in quattro punti come se valesse sempre: ora vale **dai Giri 1-3** e si misura sul testo
uscito dal Giro 0, dove invece **non c'è** — lì serve il testo giusto, non uno della stessa misura.
Se il testo nuovo non entra si taglia, si cambia composizione o si divide la slide, **mai si
rimpicciolisce il tipo** (contratto di leggibilità). Il Giro 0 **si committa a parte** dagli altri
tre, e ciò che cambia una tesi, una promessa o l'ask **non si applica da soli**: va a chi possiede
il contenuto, con la riscrittura pronta.

**I quattro punti allineati**, che prima dicevano «tre giri» e «±10%» senza eccezioni: la voce di
copia (riga 311) e la sezione «Umanizzare è un giro MISURATO» in `CLAUDE.md`; lo **Step 0-bis bis**
e la voce di copia nella skill `experience-design`; il titolo dei giri, la nuova sezione del Giro 0
e i vincoli di riscrittura in `references/umanizzazione.md`.

🔒 **L'esempio prima/dopo dentro il comando è inventato, per scelta.** Il sorgente ne portava uno
vero — nome del cliente, copia di tre slide e i numeri della misura — e il repo è pubblico: è stato
sostituito da un esempio costruito che porta gli stessi tre difetti (lo slogan che nasconde il dato,
la frase farraginosa con una causa non dimostrata, il confronto sepolto nel testo). Verificato riga
per riga: sulle **124 righe aggiunte** non c'è un nome di cliente, una riga di slide o un dato di
misura. La memoria `umanizzare-e-misurato` è stata riscritta sui quattro giri, e al suo interno è
stato corretto lo slug morto `intesa-mutuo` → `intesa-esperienza-cliente`.

⚠️ **I commit sono locali su indicazione dell'owner: niente push.** Dopo questo giro di handover
`main` è **avanti di due** su `origin/main`.

### Change log — Trenitalia Direzione Sales: tutto il deck passa al registro XD, e un giro di revisione prima della sessione (2026-11-04) → §37.13 (Parte 16)

**Tre commit** (`63ab31c`, `2a86721`, `05bf555`), tutti su `apps/trenitalia-prospettiva-sales`.
Il 3 novembre lo strato XD era entrato su **sei slide su trentaquattro** — copertina, apertura e
le quattro idee — e il resto era la pelle vecchia. Il 4 la domanda dell'owner è stata: «è tutto in
modalità visual XD?». La risposta misurata era **no**, e da lì è partita la conversione.

**Il quadro prima di toccare**, perché l'intervento è nato da una misura e non da un'impressione:
XD su **6/34** slide · `audit:ritmo` **4 slide su 41** con un elemento visivo · **cinque slide
oltre le 150 parole VISIBILI** (il testo dietro «Scopri come» non conta: quello è profondità, ed è
lì che deve stare), la peggiore a **207**.

**Le sette copertine di capitolo diventano divisori XD** — titolo grande, fotografia, pannello di
colore con il punto del capitolo e l'agenda generata dal registro delle slide. Ogni capitolo ha
ora **la sua** immagine: erano tutti e sette la stessa, e sette divisori identici non sono un
ritmo. ⚠️ XD compone il divisore per una dominante **chiara** e il titolo prende `--color-ink`:
qui sarebbe uscito ardesia su ardesia — invisibile, e nessun check di layout lo vede. La pelle lo
ribalta, ed è la regola degli inchiostri che si ribaltano con la superficie applicata a un
componente del motore.

**La grammatica XD su tutte le slide di contenuto**: **106 classi** `.ex-*` → `.xd-*`. Non è un
rinomino estetico — porta le regole di leggibilità già pagate — e ha **scoperchiato due difetti
veri che la pelle vecchia nascondeva**: su una slide di **marchio** l'occhiello e la riga di fonte
davano **2,31:1** e **2,58:1**, rosa su rosso. Su una superficie dichiarata l'inchiostro va
esplicito.

**La mappa dei quattro punti** — la spina dorsale del deck — era quattro card di prosa: 207 parole,
la slide più pesante, e proprio quella su cui chi parla deve essere ascoltato. Ora è **un filo con
quattro fermate**, un'ancora ciascuna, e i paragrafi dietro «Scopri come» **in forma di figure**:
quattro paragrafi dentro un drill-down sono lo stesso muro, soltanto nascosto.

**Due blocchi tolti** perché ripetevano la slide che li ospitava e aperti facevano sforare la
safe-area a 1280×800: il drill-down dell'aritmetica (il suo primo fatto è già nel titolo, il
secondo nella slide dell'idea) e una chiusa sul referto. Fra una frase e il campione verificabile
vince il campione.

**`data-stretto` su sei slide**, non su tutte: applicare il respiro stretto ovunque faceva risalire
il check `g` da **9 a 27** rilievi — SOFT, ma è un peggioramento vero del ritmo pagato per un
problema che hanno sei slide su trentaquattro.

**Esito:** slide con un elemento visivo **da 4/41 a 16/41**; **nessuna** slide sopra le 150 parole
visibili.

⚠️ **LA CI È ANDATA ROSSA SUL PRIMO PUSH** (`2a86721` la chiude). Un campo nuovo, `bRiga`, era stato
aggiunto alle quattro voci dei dati ma **non all'interfaccia** — che è dichiarata su una riga sola,
e l'inserimento automatico è finito nei letterali. L'errore a monte è il controllo sbagliato: la
verifica era stata fatta con `npx tsc --noEmit`, **che sui file `.astro` non guarda niente**. Il
controllo di questo repo è `pnpm typecheck`, cioè `astro check`. È la seconda volta che la CI va
rossa su `main` per un gate non lanciato in locale (la prima è nel change log del 9 ottobre).

**Il giro di revisione del pomeriggio** (`05bf555`), chiesto dall'owner slide per slide:

- **Mai più «le sue parole».** Cinque punti attribuivano le frasi alla persona — «la parola che ha
  usato lui», «con le sue parole, non ancora esplorato», «Le sue parole al TTG», «i mercati che ha
  indicato», e il punto del capitolo 01 con «li avete detti, annunciati o decisi voi». In sala
  suona come un dito puntato. **Ora si cita la fonte e basta**: la citazione dall'intervista
  pubblica resta, la cornice che la indica no.
- **Due fatti che non reggevano.** «La leva lavora da anni» era **falso**: il prezzo dinamico sulle
  Frecce è partito il **1º gennaio 2026** — dieci mesi — e vale **solo sull'alta velocità**, mentre
  in quella stanza si vendono tre prodotti; la data la conoscono meglio di noi
  (Altroconsumo, gennaio 2026). E due **affermazioni di assenza sul cliente** — «non sapete chi
  vende che cosa», «chi compone un viaggio è indistinguibile» — che si verificano sulle sue pagine
  prima di scriverle: di che cosa vedano della rete non esiste fonte. Ora la slide dice quello che
  si osserva sul percorso pubblico, e la domanda la fa il capitolo che chiude.
- **La riga sui perimetri resta, la mappa delle direzioni no.** Il panel l'aveva chiesta da tre
  poltrone diverse — dichiarare noi che non tutto si decide lì vale molto — ma elencare quale
  direzione tiene che cosa, citando i documenti sindacali del 30 marzo, è spiegare a un direttore
  che cosa non è suo **con in mano le carte interne della sua azienda**, e invita un «chi ve l'ha
  detto?». È lo stesso errore già corretto su PICO il 15 ottobre. Resta la rassicurazione; i
  confini li traccia lui. Via anche la fonte, che serviva solo alla mappa.
- **Due elementi grafici nuovi.** Le sei date erano in prosa nel lead: ora sono una **cronologia**,
  nella stessa grammatica della mappa dei quattro punti, e si vede che cadono tutte nei prossimi
  diciotto mesi («adesso» è l'unica tappa accesa). La slide dell'internazionalizzazione aveva solo
  testo accanto a una slide con una figura: ora porta il **ventaglio dei mercati** nominati al TTG,
  da un'origine sola.
- **Copertina**: via la riga sui trenta minuti e la nota sulla misura (si dice dopo); «L'ora, come
  la spendiamo» diventa **«Agenda»**. Il ponte sull'internazionalizzazione è riscritto e la frase
  bocciata dall'owner sparisce anche dalla slide dell'idea.
- **Le ancore dei drill-down smettono di ripetere il titolo della card** che le ospita: su otto
  voci, aperto, il blocco diceva due volte la stessa riga e sembrava ridondante.

**Gate a fine giornata:** `audit:deck` **0 HARD** su 9 rotte × 3 viewport (residuo SOFT `a` 17 ·
`g` 12 · `i` 40, il profilo di un deck ad ancore) · `audit:ink` **PULITO** su 567 blocchi, 13
«Scopri come» aperti e misurati · `copy-audit` **0 HARD** su 401 stringhe · `audit:taglio`
ALLINEATO · `audit:fonti` nessun link rotto · `typecheck` 0 errori, 0 warning · build di tutte le
app verde. CI e Deploy verdi, nove rotte su nove a 200.

⚠️ **Il verdetto del panel resta quello del 12 ottobre** e da allora il deck è stato riscritto tre
volte: resta la voce **P0** in §10.

### Change log — Trenitalia Direzione Sales: lo strato XD, le figure recuperate, l'indice che non mente e il 96% che torna (2026-11-03) → §37 (Parte 16)

**Cinque commit fra le 13:04 e le 17:57, tutti su `apps/trenitalia-prospettiva-sales`** tranne il
primo, che è una regola. La giornata ha un filo solo: **il deck aveva profondità e non aveva
superficie**, e metterle insieme ha richiesto prima di separarle a parole.

**La regola: XD e micro-diagrammi sono due registri, e non si sostituiscono** (`fe52899`, BINDING
in `CLAUDE.md` e in `skills/experience-design/references/xd.md`). L'XD è **quello che si
proietta** — immagine, mockup, una cifra, poche parole; i micro-diagrammi sono **quello che si
apre**, piccoli e molti, dietro «Scopri come». Scambiarli non è un errore di gusto: produce una
slide che non funziona nella stanza in cui va. ⚠️ **Nessun gate lo misura**, per questo la regola
sta scritta e non in un check.

**Lo strato XD entra nell'app** (`2a78984`): `@import` del motore più il contratto `--xd-*` coi
valori di Trenitalia e gli alias che XD si aspetta — senza i quali il titolo del divisore eredita
il bianco della dominante e **sparisce sul chiaro**. Due slide diventano una: **la copertina porta
anche l'agenda**, generata da `CHAPTERS`, quindi non può divergere da ciò che si proietta; il velo
è stato ricalibrato (movimento misurato **0,29 su 255**) perché sotto la clip ora c'è un indice di
link e il check `h` li misura come CTA. Nascono **quattro slide d'idea**, una per capitolo, con
forma e contenuto in un posto solo (`SlideIdea.astro` + `data/idee.ts`). Il **ponte
sull'internazionalizzazione** è riscritto perché regga davanti a due letture opposte presenti nella
stessa sala — la parola è del Direttore Sales, ma in azienda c'è chi la legge come traslazione
dell'esistente: l'argomento diventa «quello che costruite per l'Italia è la stessa cosa che vi
porta fuori». Referenze **Telmore** e **Santander Brasil**, verbatim in `sources.ts`; tre storie
del travel **scartate perché la loro pagina non risponde** dal nostro percorso di rete.

**Le ancore e le figure, recuperate da un ramo mai pubblicato** (`c8dee1c`). Il ramo
`feat/trenitalia-sales-ancore` era fermo dal 27 ottobre; riletto con la regola dei due registri in
mano, **non era un'alternativa allo strato XD ma il suo strato di profondità**: ventidue
micro-figure dentro i blocchi «Scopri come» più il giro di ancore che toglie prosa. La misura lo
conferma: `audit:ritmo` passa da **4 slide su 40 con un elemento visivo a 14 su 40**.

**L'indice non può più mentire** (`6eecdf6`, da una revisione interna del 3 nov). Il rilievo: la
copertina del capitolo 01 annunciava «Il 96% che resta» e la slide dopo parlava d'altro. Guardando
il resto, il difetto era più largo: **tre capitoli su sette non annunciavano niente**, e dove
c'era, l'agenda contava tre voci su cinque o sei slide. ⚠️ **Nessun gate confronta un indice con il
suo contenuto: l'ha trovato una persona.** Il registro delle slide esce da `admin.astro` e va in
`src/data/slides.ts`, da cui l'admin accende/spegne **e** la copertina di capitolo rende le stesse
voci. Nello stesso commit **le otto domande si vedono**: il deck le contava senza mostrarle mai e
due slide dopo citava una risposta che chi guarda non poteva ricollegare al campione; elenco e
referto sono divisi, e **la divisione è una misura** — insieme non entrano in nessuna disclosure, e
tre posizioni sono state provate, due scartate dal check `exp` (HARD).

**Torna il 96%, che era l'apertura concordata col cliente** (`be607a0`). Verificando il rilievo,
la cosa è risultata più grave di un indice sbagliato: **l'agenda mandata alla segreteria il 9
ottobre dice, parola per parola, che si apre con il 96%**. Il 20 ott la slide era stata tolta per
una ragione giusta (aprire un documento del 2026 con la dichiarazione dell'anno prima invita a
sentirsi dire «quello lo dicevate allora»), ma **nessuno ha confrontato il deck con l'agenda che
gli avevamo mandato**. Torna nel registro XD, con la vecchiaia del dato gestita come prescrive la
regola: data in chiaro nell'occhiello e nella fonte, e subito dopo le sue parole del 2026. ⚠️ **Due
fonti che non si mescolano**: il 96% è suo e verbatim (L'Agenzia di Viaggi, 13 ott 2025); il
75%/4% è dato di contesto che circola attorno al suo intervento (Travel Quotidiano, 15 ott 2025) e
**non gli si attribuisce**. Non entra nel taglio «In dieci minuti», che resta a sette slide.

**Gate a fine giornata:** `audit:deck` **0 HARD** su 9 rotte × 3 viewport · `audit:ink` **PULITO**
su 521 blocchi · `copy-audit` **0 HARD** su 394 stringhe · `audit:fonti` nessun link rotto ·
`audit:taglio` ALLINEATO · `audit:ritmo` **15 slide su 41** con un elemento visivo.
