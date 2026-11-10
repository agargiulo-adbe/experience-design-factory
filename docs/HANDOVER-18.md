# Handover — Parte 18 di 21
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

<!-- sezione spostata dalla Parte 1 il 21 ott 2026: la Parte 1 aveva superato il contratto di dimensione -->

## 8. Deck visual contract & audit

Contratto e **12 check** (`a b c d e g h i j k m` + `exp`; **non** esistono `f` e `l` — la dicitura «12 check a–l» era sbagliata e fu corretta a 11 il 10 set; il dodicesimo, **`m`**, è stato **aggiunto il 12 set**, non recuperato) **+ il Type & legibility contract (vincolante)** in `CLAUDE.md`. `pnpm --filter <app> audit:deck` gira su **1920/1440/1280** e misura bounding box → pass/fail.

> **`m` — allineamento (HARD, dal 12 set):** i blocchi di primo livello con `text-align: left|start` devono condividere il bordo sinistro (±4px). Le composizioni **centrate** sono esenti; sono esclusi anche la decorazione fuori flusso (`position:absolute` — un backdrop finito dentro `.slide-inner` dava un falso positivo) e i blocchi senza testo. La trappola che l'ha generato: il reset di base cappa i `<p>` dentro una slide, si «libera» un blocco con `max-width:none` e quello **si allarga a tutta la safe-area** mentre i fratelli restano nella colonna (su isybank: fonti 197px fuori riga).

> ⚠️ **IL GATE HA MENTITO (scoperto 11 set).** `audit:deck --only a,b` finiva in un **secondo** filtro posizionale in `main()` che leggeva il valore del flag come il nome di rotta letterale `"a,b"`: **zero rotte auditate**, e «PASS — all decks clean» stampato lo stesso. Corretto (il valore dei flag non è più un filtro posizionale; zero rotte esce con **codice 2**). Due conseguenze pratiche: **`DECK_URL` è l'ORIGIN**, non il path dell'app (le rotte nel set sono già percorsi completi — con il path doppio ogni pagina è un 404); e **ogni «0 failures» dichiarato prima dell'11 set va considerato non verificato**. Se un PASS arriva sospettosamente in fretta, **contare le rotte stampate**.

> ⚠️ **LEZIONE CHIAVE (lug 2026):** `audit:deck` PASS **≠ leggibile**. L'audit misura solo testo **≥16px** (per band/coverage) e il contrasto — non la *generosità* del type né l'equilibrio della composizione. Su Trenitalia una remediation aveva rimpicciolito il body a 0.5–0.75rem *per far passare l'audit* → illeggibile in proiezione. Regola: dopo che l'audit è a 0, **leggi uno screenshot 1920 di ogni slide** e verifica type generoso (body ≥0.95rem) + composizione bilanciata. Dettaglio completo nel **Type & legibility contract** di `CLAUDE.md`.
>
> **L'audit va lanciato contro un PREVIEW statico** (il dev server con HMR blocca il `networkidle` di Playwright → timeout): `build` → `preview --port N` → `DECK_URL=http://localhost:N pnpm --filter <app> audit:deck`. Contrasto: il parser dell'audit **non legge `oklab()`/`color-mix()`** (li tratta come bianco → falso PASS su `h`) — usa `rgba()` esplicito per chrome/bottoni/card tintate.

**Stato attuale:** tutti e 4 i deck (maxmara, unicredit, ferrari, trenitalia) sono a **`audit:deck` 0 fallimenti** su 3 viewport (giri dedicati Ferrari 74→0 e Trenitalia 165→0, lug 2026). `scripts/deck-audit.ts` ha `ROUTE_SETS` per tutti e 4; maxmara usa le rotte `/generazioni-maxmara/…`.

**Aggiornamento 15 lug 2026:** aggiunta la route **`visibilita`** al `ROUTE_SET` unicredit di `deck-audit.ts` (prima non coperta). Poi **bonifica audit UniCredit** (§17.4): azzerati **tutti** i fallimenti HARD (`c` overflow/margini 22→0, `e` text-on-text 1→0, `j` clipping 7→0) su 14 slide/8 sezioni con fix meaning-preserving. Restano solo **soft** `a`/`i`/`g` (94/64/12, totale 200→170) su composizioni volutamente ariose/dense + il limite parser di `marco-moment`: **non** si forzano rimpicciolendo il type (contratto).

**Agg. 9 set 2026:** UniCredit **0 HARD** su home + 6 capitoli a 1920/1440/1280 (bonificati anche residui pre-esistenti su aem-agents/brand-visibility/brand-concierge/cases). Gotcha: l'audit legge `--slide-safe-inset` da `:root` (80px), **non** l'override `[data-deck]` per breakpoint → a 1280×800 il contenuto deve stare in **640px** utili.

**Agg. 1 ott 2026 — un connettore che unisce due box non può stare dentro uno dei due (Ferrari, check `c` HARD).** Sulla copertina di `protagonisti` i tre apex della racing line erano `flex: 1 1 0` e ciascuno si portava dentro il proprio connettore (`position:absolute; left:50%; width:100%`): il segmento arrivava fino al centro dell'apex successivo, quindi **usciva dal box del suo genitore** e l'audit misurava un overflow vero (`scrollWidth` 495 su `clientWidth` 330, a tutti e tre i viewport). Era lì dal commit `16c13d6` e non era mai stato notato: il deck veniva dato per «0 fallimenti» leggendo il totale invece delle colonne. La regola generale: **il blocco di riferimento di una decorazione che attraversa due elementi è la riga, non l'elemento** — `position: relative` sulla riga, `static` sui figli, offset per indice (tre apex di pari larghezza → centri a 1/6, 1/2, 5/6, quindi `left: 16.667%` e `left: 50%` con `width: 33.333%`). Geometria identica a prima, verificata a schermo. Ferrari torna a **0 HARD** (34 soft `a`/`i`, da 37 con 3 HARD). Corollario di metodo: quando si tocca un deck, **auditare la baseline prima della modifica** — senza, un HARD preesistente sembra una propria regressione e un totale invariato sembra un successo.

**Come leggerlo (importante):** il deck ha una **baseline di fallimenti pre-esistenti** (~176–200 su unicredit) che sono **check aspirazionali soft** — soprattutto `a` (banda di lettura 30–70%) e `i` (uso spazio ≥45%) su slide volutamente ariose o dense. **Non inseguire il numero assoluto.** Quello che conta sono i **check "hard"**: `b` (collisione con la chrome), `j` (clipping fuori viewport), `k` (scroll nascosto). Baseline hard: **`j:F`=7, b/k=0**.

**Metodo di verifica anti-regressione** (usato in tutti i round): confronta contro baseline via `git stash`:
```bash
# con le tue modifiche
pnpm --filter unicredit-engagement build && pnpm --filter unicredit-engagement audit:deck > /tmp/after.txt
git stash push -- apps/unicredit-engagement && pnpm --filter unicredit-engagement build
pnpm --filter unicredit-engagement audit:deck > /tmp/before.txt && git stash pop
# poi confronta i conteggi hard: grep -oE "b:F|j:F|k:F" /tmp/{before,after}.txt | sort | uniq -c
```
Regola pratica: **è accettabile aumentare `a`/`i` (soft) ma NON `b`/`j`/`k` (hard)**. Se aumentano gli hard, hai introdotto clipping/scroll/collisione → riduci densità/altezza.

---

## 40. Intesa Sanpaolo — «Dove ci innestiamo» (Blueprint, 5 novembre 2026)

`apps/intesa-innesto` · live su GitHub Pages, **fuori da hub e showcase**, `noindex`. Nata il
**23 ott 2026** da `pnpm new:experience` e scritta nei tre giorni successivi per l'incontro di
**mercoledì 5 novembre, 09:55–11:45, a Torino** (grattacielo Sanpaolo, sala 22 ovest). È la
seconda stanza di Intesa dopo quella del 22 ottobre, e ha un pubblico diverso: non più la
direzione Sales & Marketing Digital Retail, ma **chi costruisce i target e chi possiede il CRM**.

**23 slide su 7 rotte** più l'admin e il dossier gated. Design system **letto** dal CSS di
produzione del cliente (verde di sistema `#258900`, verde notte `#0d2901`, **Open Sans**, che è
il carattere vero): nessun valore a memoria.

### 40.1 Che cosa dice il deck

Sei capitoli, e il secondo è il motivo dell'incontro. Il filo è l'**innesto**: non sostituire
niente, aggiungere un anello dove oggi la decisione non c'è.

| | Capitolo | Che cosa fa |
|---|---|---|
| 01 | Quello che abbiamo capito di voi | tre mestieri e tre sistemi, con i due confini dove si perde qualcosa |
| 02 | L'architettura | **la figura a fasi**: il percorso che hanno, i due punti di attrito, i due innesti |
| 03 | Audience e target | il target si fa prima, la scelta può farsi dopo; e il caso del mutuo |
| 04 | Oltre l'analisi | tre cose che un rapporto non sa fare; e il passaggio, senza addolcirlo |
| 05 | Gli acceleratori | Decisioning e Coworker, con due riquadri per i video |
| 06 | La rotta | tre cose e una data, più la slide-firma |

### 40.2 L'architettura come figura a fasi, e che cosa è nostro

La slide `slide-architettura` è il cuore: un **SVG con uno strato HTML di ancore sopra**, che
nasce a fasi sotto le frecce del deck — prima quello che il cliente ha, poi dove si ferma, poi
il pezzo che si appoggia sopra. La geometria è **calcolata e non posata a occhio**: cinque nodi
identici di 248 unità, margine 24, intervallo 38, che fanno esattamente 1440.

⚠️ **La figura è una lettura NOSTRA e lo dichiara in pagina.** Ricostruita dal lavoro di
preparazione sul decisioning, non dalla voce del cliente. Due cose in particolare **non hanno
una fonte del cliente** e nel disegno sono scritte **come domande**:

- «con quanto ritardo torna indietro l'interazione?» — era «da 6 a 24 ore», che non ha fonte;
- «entro i vostri tetti di contatto» — era «cap settimanale», e settimanale era un'invenzione.

Il **cap settimanale** una fonte interna ce l'ha (la richiesta alla Business Unit del 26 ott,
in posta) ma non è la voce del cliente: resta domanda in slide. La regola che ne esce è in
memoria `un-numero-che-sembra-misurato`: **in un diagramma, o il numero ha una fonte o diventa
la domanda** — in sala c'è chi quel numero lo conosce.

### 40.3 Il fact check del 24-25 ottobre — quattro correzioni di merito

- **Le quattro cifre pubbliche erano giuste e la fonte sbagliata.** Il comunicato del piano
  d'impresa esiste, risponde, e **non le contiene**: stanno in una dichiarazione pubblica del
  Gruppo di febbraio 2026. La fonte vera dice anche tre cose diverse dalle nostre — «prodotti
  **per i privati**», «**applicativi** cloud a **fine 2025**» (non «infrastruttura»).
- **«Adobe AI Decisioning» non è un prodotto.** La Product Description di Adobe Journey
  Optimizer (in vigore dall'8 set 2026) dice: *Decisioning* è un **add-on** di AJO, licenziato
  per 1.000 Engageable Profiles. Corretti slide, figura, segnaposto video e console. Memoria:
  `decisioning-e-un-add-on-ajo`.
- **Il recupero a ritroso di CJA non è «sei mesi».** A regime è una finestra di **1–30 giorni**
  secondo il pacchetto; i 13 o 25 mesi sono il **backfill iniziale**.
- **I due innesti poggiano su una base Experience Platform che oggi non c'è**, ed è dichiarato
  nella slide che già si chiama «Non è un rifacimento. Non è nemmeno gratis».

Più: Santander citato con i numeri del caso pubblicato invece che con una frase nostra;
«Marketing Cloud» disambiguato (è di Salesforce, e accanto ad «Adobe Analytics» si leggeva
Adobe); Coworker che dichiara il permesso **MCP Access** sulle report suite.

### 40.4 Il guscio sensoriale, acceso e misurato

Sette sfondi Firefly (sei copertine di capitolo più la slide-affermazione) e **due clip in
loop** su copertina e chiusura, sul disegno dell'innesto. Gli MP4 stanno sul Release `media`,
i poster in `public/media/`.

- Il **primo giro di sfondi aveva la luce al centro**, cioè dove va il titolo: prompt corretti
  con la luce in basso a destra e il vuoto dichiarato in alto.
- Clip ricucite con `pnpm loop:seamless`: la copertina passa a **38,6 dB** contro 40,8 di
  riferimento; la chiusura **derivava per costruzione** e ha chiuso il giro in `--boomerang`
  (47,6 contro 49,9).
- Il velo è **misurato, non stimato**: punto più chiaro sotto il titolo, **5,19:1 nel caso
  peggiore** sulle sei copertine (serve 3:1); sulla clip, movimento 1,05 e 0,75 su 255 (sotto
  0,1 non si vede) e contrasto 15,7:1.
- Il credito «Adobe Firefly · sfondo/clip» compare perché ora è un fatto verificabile in
  `provenance.json`.

### 40.5 Il marchio

Era il segnaposto del template — un bersaglio generico, con il commento «da sostituire» ancora
nel file. Ora è **l'innesto**: un percorso che corre e un tratto che vi scende dentro chiudendosi
in un nodo. Cambiato in **tutti e due i posti** (`public/favicon.svg` **e** l'SVG inline in
`Navigation.astro`: `brand:icons` non tocca il secondo). ⚠️ La gerarchia fra percorso e innesto
sta nel **peso del tratto**, non nell'opacità: a 16px l'opacità faceva sparire la linea.

### 40.6 Il dossier interno del 5 novembre

`apps/intesa-innesto/src/pages/dossier.astro` — guscio di trenta righe sopra il motore unico,
più `DocLayout` che mappa la pelle verde sul contratto `--dw-*`. **Quattordici sezioni**,
**bilingue IT/EN** (214 coppie di testo). Contenuto in `restricted_docs` sotto RLS; seed
git-ignorato `docs/Intesa Sanpaolo/0031_seed_intesa_innesto_dossier.sql`; README tracciato in
`supabase/migrations/0031_intesa_innesto_dossier.README.md`.

Gate: `audit:dossier` **PASS, cinque viewport, zero rilievi**. Verificato che senza token la
pagina mostra solo il gate, e che nel `dist/` non finiscono né nomi né cifre.

⚠️ **Applicando il seed si è scoperto che `0030_seed_intesa_innesto.sql` non era mai stata
applicata** al database remoto: stava nel repo dal 23 ott e il buco si è visto solo da una
violazione di chiave esterna. **Una migrazione committata non è una migrazione applicata**
(memoria `migrazione-committata-non-applicata`). Nello stesso giro è stata riscritta la
descrizione nella Console, che diceva ancora «scheletro generato, da scrivere con il brief».

### 40.7 Stato dei gate (26 ott 2026)

`copy-audit` **0 HARD, 0 SOFT** su 437 stringhe · `audit:wrap --tv` **PULITO** (famiglie `S` e
`F`, cinque viewport) · `audit:ink` **PULITO**, 246 blocchi con i nove «Scopri come» aperti ·
`audit:fonti` nessun link rotto · **`audit:deck` 0 HARD a 1920/1440/1280/2560/3840** ·
`audit:ritmo --sala` **PULITO**, **18 slide su 21 con un elemento visivo** · `audit:og` PASS ·
20 app compilano.

### 40.8 Che cosa manca

- **Il panel review non è mai stato lanciato** su questa experience: è il P0 nuovo di questo
  giro (Parte 2).
- La **referenza Unipol** è nominata in slide e va concordata con quell'account prima di
  promettere materiale condivisibile.
- Il **blueprint tecnico** chiesto alla Business Unit era atteso per il 29 ott: senza, il
  disegno che si porta in sala resta nostro e basta.

---

<!-- sezione nuova il 29 ott 2026: scritta qui perché la Parte 18 era quella con più spazio -->

## 41. Unipol — «Cinque domande» (Playbook, programma high‑touch su CX Enterprise Coworker)

`apps/unipol-cinque-domande` · `/experience-design-factory/unipol-cinque-domande/` · IT default + EN · **8 capitoli, 30 slide su 9 rotte** · nata il **28 ott 2026**, registrata e portata a termine il **29**.

### 41.1 Che cos'è, e per chi

Il destinatario non è chi compra: è **chi possiede lo strumento**. Due persone, due prodotti — Adobe Target da una parte, CJA e il monitoraggio dall'altra — dentro il programma ad alto contatto su CX Enterprise Coworker che **chiude a fine novembre 2026**. Il formato è il Playbook della Tassonomia: «Come lo uso da lunedì?».

**Cinque capitoli = le cinque domande che il cliente ha fatto davvero**, fra il 15 e il 28 ottobre, nelle sue parole. Non il nostro catalogo di skill. Ognuna risponde «oggi» accanto a «con Coworker», e **ogni voce porta il livello della sua fonte**: `Documentato` (pagina pubblica con link e data), `Non ancora per tutti` (accesso limitato o roadmap), `Dal campo` (altri clienti, anonimo), `Detto da noi` (solo nel registro). Mescolare roadmap e GA nello stesso registro visivo è il modo più rapido di perdere un lettore già scettico — e qui uno dei due interlocutori sta valutando un concorrente.

L'ottavo capitolo, **il registro**, è lo strato dinamico: una riga per voce con data, stato, **chi la chiude** (un ruolo) ed **entro quando**. I capitoli restano fermi e si riscrivono a due traguardi; il registro cresce a ogni sessione. Le voci marcate `Documentato` portano il link che quel livello promette.

### 41.2 Il design system, letto

`pnpm brand:tokens https://www.unipol.it` (28 ott, 366 KB di CSS di produzione) più il bundle critico e `fonts.css`. **Navy di sistema `#001c35`** (17 occorrenze, il più frequente → `--surface-inverse`), **Ink Blue di marchio `#0303f5`** (dichiarato dal sito come `--Unipol-Ink-Blue-500`, raro → `--surface-brand` e accento), azzurro `#e5f3ff`, avorio `#f9f9f7`, azzurro d'azione `#3d95ff`; verde e corallo solo come stato. **Manrope è il carattere VERO del cliente** (`Typeface-A` del suo design system, su Google Fonts) — nella skin UniCredit è una sostituta scelta da noi, qui no, e non va «corretto». L'inchiostro si ribalta **misurato**: il marchio su navy dà 1,93:1, quindi `--ink-accent` vale `#0303f5` sul chiaro e `#3d95ff` sullo scuro.

### 41.3 Il difetto che il repo pubblico rendeva grave

`src/data/domande.ts` **nominava due referenti reali del cliente**, in un file tracciato su un repo pubblico e in copia che va in slide. Corretto il 29 con i ruoli verificati su `docs/Unipol/ACCOUNT.md` (git‑ignorato): **Digital Intelligence** e **Insight & Analytics**. È la stessa regola della voce del deck — un capitolo intestato a una persona diventa suo e muore con lei — e ora sta scritta nel commento di testa del file, perché la prossima riga non la rompa. Memorie: `client-names-public-repo`, `deck-voice-institutional`.

### 41.4 Panel review — due giri il 29 ott 2026

Personas in `docs/Unipol/PANEL-PERSONAS.md`; verdetti in `docs/Unipol/PANEL-VERDICT-2026-10-29-round{1,2}.md` e JSON in `docs/Unipol/panel/` (tutto git‑ignorato).

| Asse | Giro 1 | Giro 2 | Δ |
|---|---|---|---|
| credibilità dei fatti | 3,0 | **4,0** | +1,0 |
| rilevanza per me | 3,7 | **4,3** | +0,7 |
| chiarezza | 3,0 | **4,0** | +1,0 |
| rischio (5 = nessuno) | 2,0 | **3,0** | +1,0 |
| azionabilità | 2,0 | **3,7** | +1,7 |

**Giro 1 — i due rilievi unanimi.** La **copertina portava ancora la copia del generatore** («il design system è un segnaposto finché non si legge quello vero di Unipol» — mentre era già stato letto): prima slide, ogni lettore, e il documento dichiara da solo di non essere finito. E **la slide che chiede qualcosa era vuota**: «Due casi d'uso e tre date» sopra tre etichette senza un caso e senza una data. Ora porta i due casi veri — chiudere un test su Target, **che il cliente ha scelto il 15 ottobre**, e il triage degli alert su CJA, che già fa — le tre date (5 nov, 12 nov, chiusura a fine novembre) e due numeri da prendere adesso.

Il fact‑checker ha verificato **38 affermazioni alla fonte**: dodici cadono. La correzione che vale di più va **nella direzione opposta alla cautela**: il **digest esiste ed è documentato** (Notification Skills, GA, giornaliero o settimanale) mentre il deck lo dava per non annunciato — una risposta presentata come non‑risposta, proprio dove il cliente aveva chiesto aiuto. Poi: il programma chiude a **fine novembre** e non a fine anno; la **quality gate skill è in sola lettura** e il deck le faceva applicare una modifica; il data dictionary non è una «strada chiusa», la stessa pagina dichiara il supporto per una release futura. Via anche un dato di adozione interno senza numero né base, ripetuto su due slide, e «uso senza tetto» su un'org che ha un caso di sovraconsumo aperto.

**Giro 2 — i fatti stavano sulla SECONDA pagina che la slide cita.** Il deck ne citava due e i conti li faceva solo sulla prima: il catalogo Target non è di dodici skill e basta, c'è anche la **famiglia Optimization** che vale su Target. E l'omissione costava più degli errori: **`experiment-knowledge-base` ingerisce un CSV del cliente** e restituisce ipotesi, esiti e apprendimenti dei test passati — è la risposta letterale alla domanda 2 («oggi la memoria storica siamo noi») e non c'era. Altre tre refutazioni verificate alla fonte: la conferma prima di agire è documentata su **tre** fronti; l'analisi di contenuto **esiste** come famiglia a disponibilità limitata; «tutte e cinque hanno una risposta documentata» era smentito dal capitolo successivo dello stesso deck.

**Un rilievo respinto con la fonte**: «il contesto vive in Notion» non era un'invenzione — `ACCOUNT.md` riporta che il data dictionary di Unipol sta su Notion, detto dal cliente. Il fact‑checker va letto, non creduto (memoria `user-claims-are-hypotheses`, che vale anche per gli agenti).

**Una cosa che NON è diventata un numero in slide.** A quale soglia di confidenza il verdetto dica «pronta» **non è pubblicato da nessuna parte** (verificato a mano sulla pagina: è dichiarato il metodo — significatività a due proporzioni sui conteggi grezzi — non la soglia). Quindi è una voce di registro con titolare e scadenza al **3 novembre**, prima della sessione del 5. Stessa sorte per l'unità di consumo e il tetto incluso.

### 41.5 Stato dei gate (29 ott 2026, preview statico)

`audit:deck` **0 HARD** su 9 rotte (residuo soft: `a`=18, `i`=50 — un deck ad ancore li sfora per costruzione) · `audit:ink` **PULITO** su 329 blocchi con i «Scopri come» aperti · `audit:wrap` **PULITO** · `copy-audit` **0 HARD e 0 SOFT** su 463 stringhe · `audit:fonti` 18 link, 7 distinti, **nessuno rotto** · `audit:og` PASS · `audit:docs` PULITO · typecheck 0 errori. Slide rilette a 1920.

### 41.6 Registrazioni e stato di pubblicazione

`scripts/lib/deck-routes.ts` (9 rotte + `CWD_ALIAS`), `dev:unipol` e `audit:deck:all` nel `package.json` di radice, `.github/workflows/deploy.yml` (copia del dist + verifica dell'index), la card sull'hub, la riga sullo showcase **`defaultPublished: false`**, il registry MCP rigenerato, il seed **`0032`** (`status: 'live'`, `show_in_showcase: false`).

### 41.7 Che cosa manca

- **Il confronto esplicito con lo strumento di personalizzazione già scelto in casa**: sopravvissuto a entrambi i giri come condizione di chi possiede Target. Non è una correzione di fatto, è una **decisione commerciale**: o si mette (tre righe, caso per caso, anche dove la risposta è «equivalenti»), o si dichiara a lui prima della stanza che non si mette.
- **La migrazione `0032` non è ancora applicata al DB remoto** (`supabase db query --linked`), e l'accensione sullo showcase resta una scelta umana.
- Le due voci di registro con scadenza **3 novembre** (soglia del verdetto, profilo per abilitare Target) vanno chiuse **prima** della sessione del 5, non dentro.

---

## 42. Intesa Sanpaolo — «Adobe × Intesa Sanpaolo» (Storia, 19 novembre 2026)

`apps/intesa-esperienza-cliente` · **nove capitoli, 41 slide su 10 rotte** più il taglio
«In dieci minuti» (6 slide) · **live** su `…/experience-design-factory/intesa-esperienza-cliente/`
dal 30 ott 2026 · tipo **Storia**, lingua IT (contratto bilingue `<T it en>` rispettato).

⚠️ **Non confonderla con §40.** Per lo stesso incontro del 5 novembre ci sono **due** artefatti:
questo (la Storia, che parla al business) e `apps/intesa-innesto` «Dove ci innestiamo» (il
Blueprint tecnico, §40). I dossier che preparano la stanza stanno nel Blueprint, e la console di
questa experience ci **rimanda** (§42.6).

### 42.1 Da dove viene: un documento che ingloba un deck

Nasce il 28-29 ott come Storia a 5 capitoli sul percorso di un mutuo. Il **30 ott ha inglobato il
`.pptx` da 78 slide** che il team stava preparando per il 5 novembre, su richiesta esplicita
dell'owner: *un solo artefatto invece di due*. La mappa delle 78 slide (classificazione per
funzione: ENTRA · FONDE · FUORI · DOSSIER) sta in `docs/Intesa Sanpaolo/MAPPA-DECK-78.md`,
git-ignorata. Il conto: **−8** agende ripetute, **−35** slide di magazzino di libreria mai montate
nel racconto, **−8** divisori e doppioni assorbiti. Il salto non era tradurre 78 slide in HTML:
era **togliere il 55% e tenere il filo**.

⚠️ **L'argomento più forte per il documento unico è una contraddizione trovata nel deck**: la
slide 15 diceva «Giulia è già cliente», l'experience dice «non ancora cliente» — che è la logica
prospect chiesta dal cliente stesso. Due artefatti divergono; uno no.

### 42.2 I nove capitoli

01 Adobe · 02 Scenario · 03 La persona · 04 I sette momenti · 05 Il circolo ·
06 Il lavoro a parole · 07 Referenze · 08 CX Analytics · 09 Prossimi passi.

- **01 Adobe** — il solo capitolo in cui il design system **non è di Intesa ma di Adobe**, perché
  parla di Adobe: sta dentro come *citazione dichiarata*, non ridisegnato in verde. Team di sette
  persone coi ritratti, «Chi è Adobe» a due mondi, i numeri FSI e i **quattro Forrester Wave**
  fusi in una slide, l'architettura CX Enterprise che apre sulla banda «Orchestrare l'esperienza
  del cliente». ⚠️ **Due dei quattro Wave sono confermati su Field Readiness, gli altri due no**:
  sono lasciati come il deck li scriveva, e il perché sta in un commento nel codice.
- **02 Scenario** — una sola slide di contenuto (era due, vedi §42.4).
- **03 La persona** — Giulia, **prospect e non cliente**, al centro del giro.
- **04 I sette momenti** — il cuore: sette slide con **le due viste sullo stesso minuto** (sopra
  Giulia, sotto chi prepara in Intesa) più **otto approfondimenti**: farsi trovare, content
  factory, e i cinque sull'ingaggio (il ciclo a quattro componenti, la misura unica con le
  quattro domande di CJA, il profilo, la regia, l'arbitro, i casi d'uso).
- **05 Il circolo** — che cosa torna indietro, e su chi lavora.
- **06 Il lavoro a parole** — CX Enterprise Coworker, con uno slot video da riempire dalla console.
- **07 Referenze** · **08 CX Analytics** (segnaposto dichiarato) · **09 Prossimi passi**.

### 42.3 Gli approfondimenti sull'ingaggio, e le fonti

Verificati su **Field Readiness il 30 ott 2026** e sulla documentazione pubblica. Quello che è
entrato, e il **limite dichiarato accanto al pregio**:

- **Il profilo (RT‑CDP)**: schema dati comune → stitching → grafo che si aggiorna → consenso. Più
  la scelta di disegno **portare il dato in piattaforma / lasciarlo nel warehouse e interrogarlo**
  (Federated Audience Composition). ⚠️ Un'audience federata è una **composizione statica**,
  aggiornata a ogni esecuzione pianificata, e **non si usa nella qualificazione a evento**: il
  deck lo dice. Venderla come «tempo reale» si rompe al secondo incontro col loro IT.
- **La regia (AJO)**: i **tre modi di eseguire** la stessa decisione — al bordo in sessione, dentro
  il percorso, **chiamata dai vostri sistemi** via API. Il terzo è la risposta a «e quello che
  abbiamo già?»: l'orchestrazione può restare dov'è, cambia solo chi decide.
- **L'arbitro (Decisioning)**: catalogo → eleggibilità → vincoli → classifica → ripiego, e **il
  confine citato**: il motore non è il sistema di record dell'eleggibilità creditizia, dei saldi e
  delle approvazioni.
- **CJA**: **quattro domande**, una per area operativa (quale canale porta clienti nuovi · quanto
  il digitale porta in filiale · dove si perde il cross‑sell · chi sta per andarsene), con chi la
  fa e che cosa la rende rispondibile.

⚠️ **Il materiale di Field Readiness nomina banche clienti**: lo **schema** si riusa, i nomi no —
nessuno compare in slide, ed è scritto nei commenti perché non si perda.

### 42.4 La revisione critica del 30 ott, e che cosa ha tolto

Dieci punti dell'owner, con la consegna «non essere accondiscendente». Gli esiti che hanno
cambiato il deck:

- **Le due slide di Scenario sono diventate una.** Erano due metà dello stesso problema (il dato
  esiste / l'arbitro no), e la seconda il deck la riprende dove c'è anche la risposta.
- **I tre blocchi di CJA erano sbagliati**: due reparti e una lista di cose da concordare, messa
  alla pari come se CJA servisse a produrre questioni aperte. Sostituiti dalle quattro domande.
- **I quattro casi d'uso erano giusti e piccoli**: raccontavano continuità operativa, a cui un
  cliente che ha già pezzi di un altro stack risponde «anche noi facciamo così». Rifatti: ognuno
  dice che cosa **serve** e che cosa resta fuori portata **quando i pezzi stanno in sistemi
  diversi**. ⚠️ Nessun fornitore è nominato.
- **Il cerchio grande del capitolo 05 è uscito**: ripeteva il capitolo 03 a tre slide di distanza.
- **Il flusso finisce dove deve**: referenze → CX Analytics → prossimi passi → firma. `risultati`
  puntava a `/` e saltava due capitoli.
- **«Che cosa misureremmo» era nel capitolo sbagliato** (le referenze, dove rompeva l'argomento):
  è andata in «Prossimi passi» con l'ask, che resta **in un posto solo** (`src/data/referenze.ts`,
  gate `audit:taglio`).

### 42.5 La mappa e la ripresa — e la tecnica che le prove correggono a metà

Due slide gemelle (30 ott): **`slide-tre`** chiude il capitolo 01, **`slide-ripresa`** apre
«Prossimi passi». Tre blocchi grandi, una fotografia per blocco col numero in overlay, l'ancora,
una riga. Le tre cose vivono in **`src/data/tre.ts`**: `riga` per l'annuncio, `poi` per la
ripresa — due campi accanto, mai due oggetti.

⚠️ **Perché non sono la stessa slide due volte.** «Dì quello che dirai, dillo, ripeti quello che
hai detto» è **folklore del 1908** (un consiglio su come si fa una predica), non di Aristotele.
Delle tre parti regge **la prima**: l'anticipazione in apertura è l'*advance organizer*, effetto
**0,21 subito e 0,38 dopo tre settimane**. La terza è la famiglia con **meno** prove (Dunlosky
2013: riassunto e rilettura a bassa utilità). Quindi la seconda slide **non ripete**: tiene la
geometria — è lì che chi guarda riaggancia — e cambia il testo. Niente `data-substep` sulla
mappa: si guarda tutta insieme. Il ragionamento sta nel commento di `src/data/tre.ts`.

### 42.6 Lo slug, i rimandi, e la console

Lo slug era `intesa-mutuo`; con nove capitoli «mutuo» nell'URL riduceva l'incontro a un prodotto.
Rinominato **`intesa-esperienza-cliente`** il 30 ott, **prima** della pubblicazione. Il giro
completo: cartella, `base` di Astro, nome del pacchetto, `SITE.slug`, rotte di `audit:deck` e
`audit:taglio`, deploy, hub, showcase, **registry MCP rigenerato** (non scritto a mano), lockfile,
migrazioni `0033` (nasce col nome giusto) e **`0034`** (rinomina la riga se la `0033` era già
applicata; **non cancella**, perché `experiences` è referenziata da tre tabelle).

⚠️ **Il vecchio indirizzo era già pubblicato**: ci sono **dodici stub** in `factory-hub`
(`src/pages/intesa-mutuo/[...rotta].astro`, generati da `getStaticPaths`) perché GitHub Pages serve
file statici e non conosce le riscritture. La query string segue (`?c=`, `?s=`, `?cfg=`), portano
l'anteprima, e la verifica della struttura dell'artefatto nel workflow li controlla.

La **console** (`/admin/`) rimanda ai **due dossier** che preparano la stanza, che vivono in altre
app (link cross-app, come Trenitalia Sales): «Chi c'è in sala il 5 novembre, e come si convince»
(→ `intesa-innesto/dossier`) e «L'incontro del 22 ottobre, che lo precede» (→
`intesa-scala-umana/dossier`). ⚠️ L'etichetta dice **che cosa c'è dentro**, non il nome
dell'experience che lo ospita: in una console altrui «Dove ci innestiamo» non dice niente.

### 42.7 Stato dei gate (30 ott 2026, sera, preview statico — dopo il panel)

`audit:deck` **0 HARD** su 11 rotte (141 soft, tutti `a`/`i`) · `audit:ink` **PULITO** su 969
blocchi · `copy-audit` **0 HARD** su 1171 stringhe (4 soft) · `audit:taglio` **allineato** ·
`audit:fonti` nessun link rotto (9 su business.adobe.com «da aprire a mano»: aperti, 200) ·
`typecheck` 0 errori. `audit:wrap`: 15 residui soft, quasi tutti famiglia `F` (code di frase
in titoli a due frasi dentro un attributo `<T it=…>`, dove l'`inline-block` per frase non si
applica): dichiarati, non legati con spazi unificatori — vedi memoria `coda-di-frase-orfana`.

### 42.8 Il panel review del 30 ott 2026 — due giri, sei stakeholder, e che cosa ha cambiato

Ritratti nuovi per la stanza del 5 novembre in `docs/Intesa Sanpaolo/PANEL-PERSONAS-5-NOVEMBRE.md`
(git-ignorato): chi costruisce i target, il suo capo (CRM, Adobe Analytics), il marketing
digitale, **un seggio derivato** per Group Technology, i Canali, il consulente Deloitte. Verdetti
in `PANEL-VERDICT-2026-10-30-round1.md` e `-round2.md`, grezzi in `panel/2026-10-30-round{1,2}/`.

| asse | giro 1 | giro 2 |
|---|---|---|
| credibilità dei fatti | 3,0 | **4,0** |
| rilevanza per me | 3,3 | **4,0** |
| chiarezza | 3,7 | **4,0** |
| rischio (5 = nessuno) | 2,5 | **3,2** |
| azionabilità | 2,8 | **4,0** |

Giro 1: sei «sì condizionato», **16 P0 · 12 P1 · 6 P2**, fact-check 60 affermazioni (34 confermate,
6 refutate). Giro 2: un «sì» (Canali) e cinque «condizionato», fact-check 59 (49 confermate, 3
refutate, tutte corrette dopo). **Quello che ha cambiato il deck**, in ordine di peso:

- **`scenario/slide-motore`, nuova, nel filo davanti**: «resta il vostro motore di targeting — che
  cosa entra, che cosa esce», con il perimetro del pilota (prospect senza scheda, canali digitali).
  Il filo diceva «l'arbitro no», «nessuno ha costruito un'audience»: davanti a chi i target li
  costruisce suonava «il vostro lavoro non serve». È la riga che il Targeting «porta al capo così».
- **`momenti/slide-ingaggio-mappa`, nuova**: avete / si aggiunge / resta vostro, e **sei frecce
  con un nome** (sito e app → piattaforma via SDK, *da disegnare per prima* su AEM on‑premise;
  CRM → profilo e misura, il ritorno che chiude l'imbuto). Era «una marketecture».
- **Capitolo 08 scritto** (`slide-passaggio`, `slide-attribuzione`) dalle pagine pubbliche su
  CJA: che cosa si riusa, che cosa cambia nome, che cosa si aggiunge — come **ipotesi
  sull'installato, da correggere in sala**. Era il segnaposto, sul tema della convocazione.
- **Quattro errori di fatto che un lettore coglie a mente**: rata 742 → **863 €** (180.000/25
  anni/3,10%), «mutuo erogato in tre settimane» → **richiesta firmata il 5 dicembre** (cronologia
  12 nov → 5 dic che torna), Crédit Agricole «non pubblicata» → **pagina pubblica col link** e
  il «prima» (150+ percorsi, sei mesi), TSB «unica referenza con Offer Decisioning» → U.S. Bank
  lo nomina. E lo **score 0,78 su una prospect** è sparito: regola di sessione, score in batch
  quando è riconosciuta.
- **La colonna «oggi» è una domanda**, non un fatto (`referenze.ts`); due misure in più (target,
  filiale) nel percorso intero (`estesa`), quattro nel taglio; le condizioni del trimestre sotto
  l'ask. **Tetto di contatto → politica di contatto**, due contatori come dice la documentazione.
- **Fonti pubbliche al posto di sette «Field Readiness»**, i quattro Forrester Wave con nome
  esatto e link (e la riga sulle sessioni anonime è **testuale** sulla pagina Adobe: il
  fact‑check del giro 1 la dava per non verificata, era vera), Coworker «si attiva su richiesta»
  senza promettere la conferma, Projects «annunciato», storyboard della demo sul mutuo con il
  passo **Target**.
- **I mock dei momenti mostravano tre righe su tutto** (`nth-child(n+4)`): sparivano proprio
  «appuntamenti in filiale» e «richieste firmate». Ora l'imbuto ha cinque gradini, le candidate
  sono quattro ovunque, le otto domande stanno su due colonne. L'imbuto vive in
  **`src/data/imbuto.ts`**, fonte unica di Scenario e mock (erano due copie con numeri diversi).
- Registro admin riallineato al vivo (`slide-fsi`, `slide-motore`, `slide-ingaggio-mappa`,
  `slide-passaggio`, `slide-attribuzione`, `slide-fasi`, `slide-serve` a cinque voci con chi le porta).

**Due strumenti corretti, per tutti i deck**: `scripts/deck-pdf.ts` e `scripts/panel-evidence.mjs`
**non aprivano i sotto-passi** — il PDF usciva con 103 blocchi invisibili e le personas leggevano
slide mutile. Ora `revealSubstep()` finché risponde, conteggio nel log; l'evidenza porta anche il
testo dei «Scopri come» e aspetta 2,2 s (a 1,4 s le card a scaglioni erano a metà dissolvenza).
Memoria `deck-due-assi-sottopassi`.

### 42.9 La revisione del team (30 ott) e la data che si sposta

**L'incontro è slittato al 19 novembre, 11:00–13:00** (era il 5, poi il 10): il cliente l'ha
spostato «causa MPS». L'**11 novembre alle 14:15** c'è un check del documento **con il referente**,
35 minuti: è lì che si concordano le slide da proiettare. La stanza è cresciuta a **27 persone**.
Sedici giorni in più: il tempo non è più il vincolo, lo è la lunghezza del documento.

Il 30 ottobre il documento unico è stato visto da **cinque colleghi**. Il formato ha retto —
«unico formato di delivery, qualità ottima», «è slide-like ma aggiunge qualcosa e differenzia»,
«più fluido senza salti» — con **un dubbio non ritirato** dall'AE: «ho paura che si perda il
referente con tutto experience; se si salta da ppt a experience teniamo di più l'attenzione».
Quel dubbio si scioglie all'11, mostrandolo al referente, non discutendolo fra noi.

**Quattro voci su cinque hanno chiesto la stessa cosa** — ed è la stessa che il panel aveva messo
come condizione da tre seggi: il capitolo 04 **dalla nona slide in poi** (i nove approfondimenti)
esce dalla storia e va in un capitolo a sé, alleggerito; due propongono di assorbirci anche il
capitolo 05. Il panel chiedeva di tenere **una** slide di confine davanti (`scenario/slide-motore`)
e la mappa come prima cosa del tavolo tecnico: le due cose si compongono, e questa è la modifica
strutturale che il documento aspetta.

**Le cinque frasi «tipiche AI»** segnalate con l'alternativa (e confermate dalla patch FSI) sono
**le stesse** che `copy-audit` e il panel avevano marcato P2 e che il giro di correzioni aveva
lasciato: sono la prova che un segno spostato non è un segno tolto (memoria `umanizzare-e-misurato`).
Le alternative proposte dicono un fatto dove c'era un'antitesi, e si applicano tutte.

⚠️ **Coworker: la procedura che il deck presupponeva non esiste.** Verificato il 3 nov sulla
documentazione pubblica: non c'è un form self-service — dove il cliente è eleggibile l'applicazione
compare da sé nel selettore, altrimenti la richiesta passa dal team Adobe per licenze ed entitlement
e poi dall'Admin Console. La capability su Adobe Analytics **esce progressivamente, organizzazione
per organizzazione**. La trial dà fino a **10.000 crediti AI una tantum per IMS Org** (non per
applicazione), 25 crediti per input, tariffa dichiarata introduttiva. La riga in slide va
riscritta su questo, e la verifica sull'istanza del cliente va fatta prima dell'11.

### 42.10 Che cosa resta aperto (dal giro 2 del panel e dalla revisione del team)

- **Le dieci slide davanti**: il formato concordato è 10 + backup, il percorso ne ha 47 senza un
  segno di quali — e **nessuno dei cinque revisori ha nominato quel numero**. Si marcano col gating
  capitoli/slide della console e si conferma la lista con il referente **al check dell'11 nov**. Proposta del panel: `scenario/slide-segnale`, `slide-motore`,
  `persona/slide-giro-di-giulia`, `momenti/slide-m-03`, `m-04`, `m-05`, `m-07`,
  `analytics/slide-passaggio`, `prossimi-passi/slide-da-voi`, `slide-serve`.
- **Il taglio «in dieci minuti»** porta quattro misure su sei e non dice che il motore resta: va
  aggiunta una slide «entra / esce» dalla stessa fonte (`sBreve`). È la versione che gira al capo.
- **Coworker**: senza conferma scritta dell'opt‑in entro il **2 nov**, capitolo 06 in backup.
- **Il perimetro dell'arbitro detto in tre modi** (posizione nel CRM / lead / prospect): un criterio
  solo — «chi non ha una scheda cliente; un lead non la fa uscire, la firma sì» — da confermare.
- **`adobe/slide-fsi`**: cinque personas su sei la tagliano ancora (brochure da vendor in una sala
  convocata sulla Web Analytics). **`adobe/slide-team`**: sette nomi, cinque sull'invito — si
  riconcilia o esce. **Residenza del dato** (regione, hyperscaler, log CDN, buste paga caricate da
  link): mini‑tabella «esce / resta» per il tavolo tecnico. **Consenso nel mock di m‑03**: due
  caselle, non una. **Filiale Digitale** come canale che richiama un prospect, mai nominata.
- **`provenance.json` ha 2 record per 28 immagini** (ereditato); **`show_in_showcase` resta `false`**.

---

---

### 42.11 Il giro del 9 novembre: la revisione del team, l'agenda concordata, e che cosa è venuto da Trenitalia

Pubblicato il 9 nov 2026 (`1bfd653`, `0fcb92f`, `5cea9f3`). Percorso a **41 slide**, più 5 in `/approfondimenti/` fuori percorso e 6 in «In dieci minuti».

- **Struttura.** Le slide tecniche sono uscite dai sette momenti (ora copertina + 7) e stanno in `messa-a-terra`, che assorbe il circolo in una slide; `/circolo/` rimanda. Dati, profilo, regia, arbitro e casi d'uso sono in `/approfondimenti/`, a un clic dai quattro componenti. Il motore di targeting è uscito dallo Scenario ed è la terza slide di `messa-a-terra`: schema + `HowItWorks`. ⚠️ Il panel del 30 ott lo aveva messo prima di Giulia per chi costruisce i target: va detto a voce in apertura.
- **Agenda e barra.** Sette voci concordate col team (`data/agenda.ts`, `VOCI_NAV` in `data/chapters.ts`). `CHAPTERS` resta l'ordine delle pagine, con **CX Analytics subito dopo lo Scenario**; i numeri seguono le voci, quindi più pagine portano lo stesso numero (03: scenario e analytics · 04: persona, momenti, messa a terra). Lettura di «4 e 5 nel punto 4» **da confermare col committente**.
- **Spenti con un flag, non cancellati** (`data/momenti.ts`): `DOMANDE_IN_SLIDE` e `CORPO_IN_SLIDE`. Il corpo dei momenti è la traccia di `/relatore/`.
- **Da Trenitalia:** `/relatore/` generata dal registro (`data/slides.ts`, `data/relatore.ts`, pubblica: niente nomi né dati riservati), prodotto in tessera nei momenti, roadmap a binario su `slide-fasi`, affermazioni sul loro stato attuale riscritte come domande, sotto-passi circa dimezzati. **Non preso:** XD (886 usi di `.im-*`, dopo il 19), «tre soli contenitori», `DeckAudio` (licenza), `wallScale`. Titolo a quota fissa solo sopra i 1000px di altezza.
- **Gate finali** (preview statico): `audit:deck` 156 combinazioni, 0 HARD · `audit:ink` pulito · `copy-audit` 0 HARD/0 SOFT · `audit:taglio` allineato · `audit:fonti` nessun link rotto · `audit:og` PASS · `audit:ritmo --sala` 83 SOFT.
- **Trappole.** Una larghezza in percentuale dentro una colonna `auto` fa collassare il cerchio: si usa `vh` e `display: contents`. Un figlio assoluto che sporge gonfia `scrollWidth` (`c`, HARD): il riquadro del cerchio è più largo che alto. Il check `b` non vede una frase sotto i comandi del deck. Gli screenshot in `audit/<rotta>/` si aggiornano solo per le slide che falliscono: uno vecchio può sembrare un difetto. Prima di fidarsi di `DECK_URL` si controlla su quale porta è partito il preview.
- **Aperti:** panel delta · dieci slide da proiettare · screenshot reali dal Solutions Consultant · parere dell'AE sul formato e revisione completa del responsabile FSI · «Progetto · entro novembre» sulla prima tappa, da rivedere ora che l'incontro è il 19 · «prospetto» in banca richiama il prospetto informativo.

### 42.12 Il giro del 10 novembre: «Dove ci innestiamo» a tre componenti, e lo Scenario su un dato vero

**Pubblicato il 10 nov 2026** (`cb4bdea` su `main`, CI e deploy riusciti, pagine a 200): il deck in rete coincide con questo giro. Il panel del 30 ott non copre né il giro del 9 né questo.

- **Struttura.** Il capitolo «CX Analytics» confluisce in **«Dove ci innestiamo»** (`messa-a-terra`): copertina → innesto → **capacità** → unifica → quattro risposte → attribuzione → motore → ritorno. `analytics.astro` è un rimando; la mappa sta in `/approfondimenti/`.
- **Innesto a tre componenti.** Titolo «SAS e le campagne restano dove sono, e Adobe aggiunge tre componenti». Sullo schema Data warehouse → SAS → Campagne e invii → Canali entrano **Real-Time CDP sui prospect** («Chi non è ancora cliente, dal primo clic al consenso», contorno non pieno: il perimetro va chiarito), **Journey Optimizer · Decisioning** e **Customer Journey Analytics**, che aprono un pop-in a passi (`InnestoPop`, `data/pop.ts`, `styles/pop.css`).
- **`slide-capacita` «Che cosa porta ciascun componente»** (nuova): flusso riconosce (Real-Time CDP) → sceglie (Decisioning) → agisce (Journey Optimizer) → misura (CJA), un disegno per meccanismo, tre capability ciascuno, una riga «Per Giulia», link a Experience League.
- **`slide-ritorno` ridisegnata** come mappa «si impara da Giulia → torna per il prossimo»: 01 domande non citate → piano dei contenuti · 02 variante → brief Milano e Bologna · 04 proposta accettata → classifica · 05 punto di fermata → un passo in meno. Titolo «Quello che si impara da Giulia rende più facile il prossimo cliente», fascia «E Giulia, da cliente».
- **Il messaggio verso l'installato CRM/campagne del cliente** (ricerca su Fluffy; dettaglio solo nel registro d'account riservato): campagne e invii restano; Journey Optimizer parte dagli eventi in tempo reale e l'invio può restare sul loro strumento; CJA legge Analytics **senza toccare l'implementazione** e si affianca a SAS e BI. Il fornitore non è nominato né in slide né in `/relatore/`, che è pubblica. Le **note del relatore** portano tre obiezioni generiche: due strumenti di campagna, sostituzione del BI, CDP già in casa.
- **Divisori** senza la colonna «Il punto». **Sei copertine Firefly** con credito; immagini Firefly `post-torino`, `var-under36`, `var-famiglia` per i mock social e GenStudio; `provenance.json` aggiornato.
- **Scenario.** L'imbuto inventato esce. Dato **Nomisma per MutuiSupermarket.it, Borsino Mutui maggio 2026**: titolo «Quasi una famiglia su due vuole simulare la rata prima di lasciare il nome», **45%** in grande, 65% (si informa online) di contesto. Limite: il campione non è dichiarato dalla fonte.
- **Persona.** Esito in basso a sinistra, sotto la premessa (a destra si sovrapponeva alla legenda sotto i 1920): «Ha firmato. La banca sa da dove è arrivata, dove si è fermata e quanto è costato acquisirla.»
- **Momenti.** 01 mock Brand Visibility con «3 su 8» · 02 GenStudio in tre formati · 04 Decisioning a fasi; lo sconto under 36 è escluso **per esposizione** («già vista 3 volte»), non per età (Giulia ha 34 anni), corretto anche nel pop-in · 05 richiamo su email, sito e social, «solo con consenso» ed «esclusi i già clienti» · 06 canvas verso il CRM di filiale · 07 pannello CJA, attribuzione algoritmica. «Potenziali clienti» al posto di «le prospect».
- **Gate dopo l'ultima modifica** (preview statico): `copy-audit` 0 HARD / 0 SOFT · `astro check` 0 · `audit:deck` 0 HARD sulle rotte toccate · `audit:ink` pulito. ⚠️ **Non rifatti** sullo stato pubblicato: `audit:taglio`, `audit:og`, `audit:fonti` (in timeout di rete) — da riverificare i **quattro link nuovi** a Experience League di `slide-capacita`.
- **Aperti:** panel sullo stato pubblicato prima del check dell'11 nov alle 14:15 · i tre audit qui sopra · correzioni al registro d'account sull'installato · benchmark dal connettore «Adobe Goldmine» · fonti pubbliche per i casi FSI (NatWest, TSB, Crédit Agricole, Sabadell) · una congiunzione appesa a 1280 su `approfondimenti/slide-integrazioni`.
