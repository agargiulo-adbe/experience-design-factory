# Handover — Parte 18 di 18
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
