# Handover — Parte 18 di 19
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

**21 slide su 7 rotte** più l'admin e il dossier gated (il «23» scritto qui il 26 ott era un conteggio a mano sbagliato: le slide registrate nel `PAGE_REGISTRY` sono 21, e §40.7 lo diceva già — «18 slide su 21 con un elemento visivo»). Design system **letto** dal CSS di
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

### 40.9 Il giro del 27 ottobre — due correzioni d'ask prima della call interna

La mattina del **27 ott** c'era una riunione interna Adobe (10:00-11:00, Teams, quattro
persone: l'AE che la organizza, il lead della patch FSI, l'architetto che costruisce il
blueprint e chi ha scritto il deck) per condividere i contenuti del 5 novembre. Preparandola
sono uscite due cose di merito, e nessuna delle due era un difetto di resa.

**L'ask chiedeva a chi era in sala il nome di chi era in sala** (commit `44e6769`). Il
capitolo «La rotta» chiedeva **«Due nomi: dato e targeting»**. Ma il referente che ospita
l'incontro è **Head of Targeting Commerciale** e costruisce target e audience, e il suo capo
possiede CRM, sviluppo commerciale e Adobe Analytics: dei due nomi, uno è seduto davanti.
L'ask ora è **«Un nome: chi governa i dati»**, ed è l'unico che davvero manca — il grafo dei
contatti, il «chi è chi» del registro e la ricostruzione dell'architettura non nominano
nessun proprietario dell'ingestione. Nello stesso commit è sparito un array `PASSI` che **non
era reso da nessuna parte** e teneva una seconda copia della richiesta con la formulazione
vecchia: è la regola «l'ask sta in un posto solo», applicata a del codice morto.

**Il dual-run si dichiara, non si drammatizza** (commit `b8596ee`). In «Oltre l'analisi» il
drill-down diceva **«Il periodo in cui si paga due volte»**, mentre la figura che gli sta
sopra disegna due barre che si sovrappongono fra due tratteggi — una **finestra**, non una
penale: le parole erano più dure dell'immagine. Ora l'ancora è «La finestra di
sovrapposizione» e la riga dice che per il tempo del confronto i due ambienti convivono, che
è una fase da mettere in conto e che si pianifica insieme: **come si gestisce si dice a
voce**. Nella stessa riga è caduta la coda «conviene partire da un percorso solo, quello del
mutuo», che lì faceva sembrare il perimetro una **concessione strappata dal costo** invece di
un metodo, e bruciava due capitoli prima l'ask che «La rotta» porta per intero. Il titolo
della slide resta **«Non è un rifacimento. Non è nemmeno gratis.»**: lì l'onestà è il motivo
per cui la slide esiste.

⚠️ **Sul mutuo resta un'obiezione di merito, non risolta e non toccata.** In banca un use
case si sceglie da quanto patrimonio assorbe: il margine di intermediazione ne assorbe circa
10-12 ogni 100 prestati, il **margine da servizio** no, e il mutuo prima casa è l'use case che
portano tutti (memoria `use-case-banca-margine-servizio`). Dall'altra parte il mutuo
**attraversa tutti e tre gli strati** — digitale, filiale, contatto assistito — che è
esattamente ciò che serve per dimostrare la cucitura del dato. Il mutuo è in tre punti del
deck; cambiarlo è una decisione dell'owner, non una pulizia. La candidata ovvia sarebbe
l'**attivazione nei primi 90 giorni**, che è lato servizio ed è il caso d'uso dichiarato dal
cliente stesso — con l'avvertenza che lì quella fase vive su un'altra entità del gruppo, e il
5 si parla con la Divisione.

**Gate dei due commit**: `copy-audit` 0 HARD 0 SOFT su 420 stringhe · `audit:wrap` PULITO ·
`audit:ink` PULITO · `audit:deck` **0 HARD**, con i SOFT **identici al commit precedente**
(verificato con uno stash a confronto, non a occhio: 7 `a` e 32 `i` prima e dopo) · le due
slide rilette a 1920 con il «Scopri come» aperto.

### 40.10 Il dossier corretto il 27 ottobre — e il rilevatore che serviva

Lo stesso giro ha toccato il **dossier interno**, che non sta nel repo: il file di seed è
git-ignorato e il contenuto vive in `restricted_docs`. Tre cose.

**Un disallineamento IT/EN, e uno solo.** In «Da dire, da non dire» tre voci avevano
l'inglese **ruotato di uno** (l'inglese del concorrente sotto l'italiano della «vista unica
del cliente», e così a scalare). Per trovarlo è servito un rilevatore di **scambio**, non di
traduzione: il primo tentativo — confronto di cifre, marcatori e nomi propri fra `it` e `en` —
dava **122 falsi positivi** del tipo Torino/Turin. Quello che funziona costruisce una firma
per stringa (cifre, nomi propri, prefissi di cinque caratteri delle parole lunghe) e, dentro
ogni elenco, verifica che l'inglese che somiglia di più all'italiano della voce *i* sia
proprio quello della voce *i*. Passato su tutte le coppie delle quattordici sezioni: **un solo
punto rotto**, corretto, zero residui al secondo giro.

**Due correzioni di contenuto decise dall'owner**, entrambe verificate prima di applicarle:
l'**assessment architetturale esce dalla sessione** del 5 (era fra le domande da fare e negli
ultimi quindici minuti della scaletta, mentre le fonti dello stesso dossier lo registrano come
«il disegno del dopo» e lo assegnano al giro di inizio anno con la sponsor: due sezioni su
quattro si contraddicevano, ed è stato corretto nel verso in cui puntavano le altre due); e la
scaletta chiede **un nome, non due**, come il deck.

⚠️ **Un file di seed corretto non è un dossier corretto.** Il contenuto vive nel database:
senza `supabase db query --linked -f …` la pagina in rete resta quella vecchia. Applicato e
riletto dal database. Il seed è idempotente e il `share_token` **non cambia** (`gen_random_uuid()`
solo dove è nullo), quindi il link già distribuito regge.

---

## 41. Unipol — «Cinque domande» (Playbook, 28 ottobre 2026)

`apps/unipol-cinque-domande` · **bilingue IT/EN** (IT di default) · **30 slide su 9 rotte**
(home + otto capitoli) · ⚠️ **al 28 ott sera l'intera experience è NON COMMITTATA**: sta solo
sul disco, insieme a quindici file tracciati modificati (vedi §10, Parte 2).

Nasce il **28 ott 2026** da `pnpm new:experience`, con il design system riscritto lo stesso
giorno sui valori veri. È il **secondo Playbook** della Factory dopo Poste, e la forma è la
stessa per costruzione: *N domande = N capitoli*, ognuna risposta «oggi» e «con X». Il
contesto d'account è il programma high-touch su **CX Enterprise Coworker**, esteso da CJA
anche ad **Adobe Target** l'8 ott, con il rinnovo Target al 31 dicembre 2026 (memoria
`unipol-target-retention-coworker`).

### 41.1 I capitoli

Otto, di cui **i cinque centrali sono le cinque domande** poste dal cliente nella call del
**28 ottobre**:

| | Capitolo | Che cosa fa |
|---|---|---|
| 01 | Il punto di partenza | da dove si parte: programma, baseline, le cinque domande |
| 02 | Chiudere un test | la prima domanda — «oggi» contro «con Coworker» |
| 03 | La memoria dei test | che cosa resta di un test quando è finito |
| 04 | Dove è forte | dove lo strumento regge e dove no |
| 05 | Alert e tabelle | gli alert che non si leggono, e il digest |
| 06 | Il contesto | che cosa sa di voi quando risponde |
| 07 | Cosa vi portate a casa | l'ask del Playbook |
| 08 | **Il registro** | lo strato dinamico (vedi §41.3) |

Ogni voce porta il **livello della fonte**, che è la cosa che distingue questo deck da una
lista di promesse: `doc` **documentato** (col link a Experience League), `la` **non ancora per
tutti**, `campo` **dal campo** (altri clienti, anonimizzati), `noi` **detto da noi**.
⚠️ `CLAUDE.md` ne elenca **tre** e il codice ne dichiara **quattro** (`LIVELLI_REG` in
`src/data/registro.ts`): uno dei due va allineato, e il codice è quello che si rende.

### 41.2 Il design system, letto e misurato

`pnpm brand:tokens https://www.unipol.it` il 28 ott — due fogli, **366 KB di CSS di
produzione** — più il bundle critico e il foglio dei caratteri del design system, letti a mano.

- **`#001c35`**, 17 occorrenze, il più frequente: è il **colore di sistema**, il navy di testo
  e fondi pieni → `--surface-inverse`.
- **`#0303f5`** è il **marchio**: il sito lo dichiara come `--Unipol-Ink-Blue-500` con una
  scala completa 50→900, ed è raro (5 occorrenze) e inconfondibile → `--surface-brand` e
  accento. È di nuovo la regola «il più frequente è il sistema, il marchio è raro».
- `#e5f3ff` (`--Unipol-Azure-Blue-50`) → secondary · avorio **`#f9f9f7`** → primary ·
  `#3d95ff` l'azzurro d'azione · verde `#9edc89` e corallo `#f59670` **solo come stato**.
- **L'inchiostro si ribalta, e il numero lo prova**: il marchio `#0303f5` su `#001c35` dà
  **1,93:1** — illeggibile; su `#f9f9f7` dà **8,46:1**. Quindi `--ink-accent` ha due valori, e
  sulle superfici scure è `#3d95ff` (**5,75:1** sul navy). Per il testo si usa sempre
  `--ink-accent`, mai `--color-accent`.
- **I caratteri sono quelli veri, non un ripiego.** Il design system dichiara
  `--Family-Typeface-A: Manrope` (30 usi nel bundle critico) e `--Family-Typeface-B: Apex New`
  (7 usi). **Manrope è su Google Fonts**, quindi è distribuibile ed è il carattere del
  cliente; Apex New è Monotype proprietario e il ruolo display lo copre Manrope ai pesi alti.
  ⚠️ Nota per chi legge dopo: Manrope compare anche nella skin **UniCredit**, ma **lì è una
  sostituta scelta da noi** e qui è il carattere vero del cliente. Non è un copia-incolla e
  non va «corretto».

### 41.3 Il registro — lo strato che cresce

L'ottavo capitolo non è una slide di chiusura: è **il documento vivo del programma**. Una riga
per voce con data, tema, esito, stato e livello della fonte; la pagina **impagina da sé** tre
voci per slide (`REGISTRO.slice(i, i+3)`), quindi le slide crescono col contenuto senza che
nessuno tocchi il markup. Al 28 ott sono **11 voci** → quattro pagine più la copertina, cioè
le cinque slide del capitolo.

L'idea è dichiarata: **i capitoli restano fermi e si riscrivono a due traguardi**, il registro
si aggiorna a ogni sessione. È la risposta alla deriva tipica di un Playbook, che invecchia il
giorno dopo la sessione.

### 41.4 Dove è registrata

`deploy.yml` (copia + verifica della struttura dell'artefatto), card nello hub, voce nello
showcase con **`defaultPublished: false`**, `dev:unipol-cinque-domande` e `audit:deck:all` in
`package.json`, `ROUTE_SETS` + `CWD_ALIAS` in `scripts/lib/deck-routes.ts`, e la migrazione
**`0032_seed_unipol_cinque_domande.sql`** che la registra nella Console come **draft** e
**fuori** dallo showcase.

### 41.5 Che cosa manca

- ⚠️ **Non è committata.** L'app, la migrazione e i quindici file tracciati modificati esistono
  solo sul disco: un `git stash` distratto o una macchina che si rompe li porta via. È il P0 in
  testa al backlog.
- ⚠️ **La migrazione `0032` non risulta applicata** al database remoto *(da verificare)*. Vale
  la regola imparata su `0030`: **una migrazione committata non è una migrazione applicata**.
- ⚠️ **La vetrina e la Console la descrivono come uno scaffold** — «5 capitoli · IT/EN ·
  scaffold», «copy e design system arrivano ancora dal brief», `sections: 5` — mentre i
  capitoli sono otto, il copy è scritto e il design system è letto dal sito del cliente. Lo
  stesso vale per `intesa-innesto`, dove il 26 ott era stata corretta **solo** la riga della
  Console (commit `6599e74`) e non quella dello showcase.
- **Nessuna panel review** (gate `/handover` 3.4). `docs/Unipol/PANEL-PERSONAS.md` **esiste**,
  ma è stato scritto per un altro tavolo: va verificato che copra il pubblico di questo
  Playbook — chi possiede Target e CJA — prima di usarlo.
- **Nessun dossier interno** e nessuna sezione «guscio sensoriale»: niente clip, niente letto
  sonoro, `og.png` e favicon generati.
- **Lo stato dei gate non è registrato qui**: non ci sono numeri di `audit:deck`, `audit:ink`,
  `copy-audit` o `audit:wrap` per questa experience *(da verificare lanciandoli)*. Finché non
  ci sono, questa sezione descrive che cosa c'è, non che cosa regge.

