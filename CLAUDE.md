# Experience Design Factory — Agent Guide

> **Docs / handover:** new sessions — read `docs/README.md` first (index + reading order +
> which docs to skip). Then `docs/HANDOVER.md` for the detailed dated state (per-experience
> status, UniCredit content model & verified product naming, deck runtime features, audit
> method, pending items, change log). Never `Read` the `docs/*.pptx`/`*.mp4` (huge, git-ignored).

## Lavoro operativo d'account — un'altra guida
Se la sessione è aperta su `docs/` o su `docs/<Cliente>/` e il lavoro è **operativo**
(una mail, un'analisi, un rinnovo, un blocco contrattuale), la guida è **`docs/CLAUDE.md`**
e **le regole di questo file non si applicano**: lì il registro è `docs/<Account>/ACCOUNT.md`,
i comandi sono `/account-open`, `/account-close` e `/accounts`. Le cartelle cliente sono **ignorate da git** e il repo è
**pubblico**: nulla di quel materiale finisce in un file tracciato (gate `pnpm audit:docs`).

## Project Overview
Monorepo for the **Experience Design Factory**: a reusable engine where each client
**Experience Design** is a *skin* (design tokens + content + assets + config) over the
shared core. On top sits a **Super Admin Console** to manage experiences and the users
who can configure them.

Experiences today (tipo tra parentesi, vedi Tassonomia):
- **Generazioni** — Max Mara [Storia] (IT, quiet‑luxury). First instance.
- **Engagement Unlimited** — UniCredit [Storia] (IT/EN, 7 capitoli: Scenario · Il Sito · Contenuti · Analizza · Coworker · Risultati · **Chiusura**; la chiusura è un capitolo a sé, così si può spegnere Risultati e tenerla).
- **Pole Position** — Ferrari Racing × Adobe [Blueprint] (EN/IT bilingual, motorsport, 7 sections).
- **Connessioni Intelligenti** — FS Group [Blueprint] (IT, 6 sezioni + casi d'uso).
- **Trait d'Union** — Agos [Blueprint] (IT, credito al consumo, 7 sezioni; palette petrolio/acqua dal brand agos.it).
- **Dove può arrivare il viaggio** — Trenitalia [Prospettiva] (IT, `apps/trenitalia-prospettiva-sales`,
  11 ott 2026): per la **Direzione Sales**, un'ora, filo «dove si perdono le vendite» — prima del
  sito (visibilità nelle risposte generate, con una **misura nostra** dell'11 ott), dentro l'offerta
  (intermodale), a valle (contenuto), nel canale suo (70.000 punti vendita). Sette capitoli: i
  quattro temi dell'agenda mandata alla segreteria, fra apertura e rotta. Design system **letto** da
  trenitalia.com (ardesia `#2f394e` di sistema, rosso `#d91835` di marchio, **Poppins** vero del
  cliente), dominante scura. Spenta sullo showcase. Dossier gated a parte: `dossier-sales.astro`.
- **Sei domande** — Poste Italiane [Playbook] (IT default + EN, `apps/poste-sei-domande`, 29 set 2026): deck tecnico‑operativo per il Responsabile Monitoraggio Canali Digitali (Admin di Adobe Analytics). **Sei capitoli = sei domande** che il team riceve, ognuna risposta «oggi in Workspace» e «con CX Enterprise Coworker» (su Adobe Analytics in rollout dal 2/10/2026, GA dichiarata TBD). Niente CJA, niente Web SDK, Target solo come evolutiva «di interesse, non tua» (parole del referente tecnico). Design system letto da poste.it (blu `#0047bb`, giallo `#eedc00`, Inter). Dossier gated `/dossier/?t=`; pubblicata su showcase.

- **Cinque domande** — Unipol [Playbook] (IT default + EN, `apps/unipol-cinque-domande`, 28 ott 2026): per chi possiede Adobe Target e CJA dentro il programma high-touch su CX Enterprise Coworker. **Cinque capitoli = le cinque domande fatte dal cliente** nella call del 28 ottobre, ognuna risposta «oggi» e «con Coworker», e ogni voce marcata per livello di fonte: **documentato** (link a Experience League), **non ancora per tutti**, **dal campo** (altri clienti, anonimizzati). Copre Coworker su CJA, su Target e nell'uso congiunto. Un ottavo capitolo, **il registro**, è lo strato dinamico: una riga per voce con data e stato, che cresce a ogni sessione del programma — i capitoli restano fermi e si riscrivono a due traguardi. Design system letto da unipol.it (navy di sistema `#001c35`, Ink Blue di marchio `#0303f5`, avorio `#f9f9f7`, **Manrope** = Typeface A reale; Apex New non è distribuibile).

- **Sopra quello che avete** — BPER Banca [Blueprint] (IT, `apps/bper-sopra-quello-che-avete`,
  12 nov 2026): per il responsabile delle fabbriche digitali e il suo team, un'ora in sede a
  Milano, dentro una gara aperta per sostituire Salesforce. Sette capitoli = **le sette slide
  che il referente CRM ha già concordato**, non lo scheletro del tipo: Adobe non è un CRM ·
  dove ci innestiamo · che cosa prende il posto di che cosa · il dato resta dov'è · chi l'ha
  già fatto · come ci si arriva · che cosa si paga. Il capitolo centrale è **la loro
  architettura**, colorata per verso (resta / esce / entra). Design system **letto** da
  bper.it (petrolio `#005157`, che qui è insieme colore di sistema **e** marchio; verde vivo
  `#00b97f`, arancio `#ea862c` solo per ciò che cambia), marchio **SVG ufficiale**, Archivo
  Narrow + Nunito Sans come sostitute di Giorgio Sans e Proxima Nova Soft. ⚠️ Tre punti del
  brief sono in slide come **domande dichiarate** e non come promesse, perché la verifica alla
  fonte li ha smentiti o lasciati aperti (vedi «Lo strato XD»). Spenta sullo showcase.

- **Ciascuno conta** — Trenitalia [Interno] (IT, `apps/trenitalia-ciascuno-conta`, 12 nov 2026):
  la versione interna Adobe del percorso proposto alla Direzione Sales dopo la Prospettiva —
  una prova sui dati (POC Sales Velocity), poi una giornata di lavoro, poi la rotta. **Stessa
  pelle della Prospettiva** (global.css copiato, non importato). Il deck è scritto perché il
  cliente possa leggerlo senza danno ed è la base della versione customer-facing; lo strato
  solo nostro (persone, strategia, GNARR, costi, compliance) sta in `/dossier/`, gated, seed
  git-ignorato in `docs/Ferrovie/`. ⚠️ Gli id `#slide-domanda`, `#slide-idea`,
  `#slide-problemi` hanno regole proprie nella pelle copiata: non riusarli. Spenta sullo showcase.

Plus **`apps/aperture-email`** (`/aperture-email/`) — **Aperture**, deck bilingue IT/EN di **ricerca individuale** (osservatorio sul tracciamento nelle email dei brand; fonti citate senza interpretazione, vendor‑neutral, hub‑only: non va in showcase/atelier). Plus **`apps/factory-showcase`** (`/showcase/`) — an internal bilingual **scroll‑site** (NOT a deck) that presents the Factory itself to Adobe leadership/colleagues, the shareable **intake skill** `skills/experience-brief/`, and the **`panel-review` skill** `skills/panel-review/` (global via `~/.claude/skills/panel-review`; repo adapter `.claude/panel-review.md`): blind stakeholder personas + fact-checker + arbiter on any deliverable before handover. Full detail in `docs/HANDOVER.md` §13.

Only public Adobe capabilities / demo material — **no reserved client IP**, and **no
wrong‑brand imagery** (see Quality Bar).

## Tassonomia dei deliverable (decisa il 1 ott 2026, BINDING)
Il cliente legge in copertina **che cosa riceve**, nominato per la domanda a cui risponde.
Fonte di verità: `packages/core/src/data/experienceTypes.ts` (label IT/EN, riga di copertina,
domanda, pubblico, passo successivo, scheletro dei capitoli); `type` in `experiences.ts`,
nelle card di hub e showcase, nella console (`0016`) e nel registry MCP.
- **Prospettiva** — «Dove potremmo arrivare?» · C‑level, prima della discovery · il vostro anno visto da fuori → la domanda → le idee → la rotta · chiede un tavolo di lavoro. (Eni, Isybank, MIM)
- **Storia** — «Come funzionerebbe per un nostro cliente?» · business e marketing, dopo un workshop · scenario → persona → momenti con la piattaforma dal vivo → il motore → risultati · chiede di vederla sui vostri dati. (UniCredit, Max Mara)
- **Blueprint** — «Come si collega a quello che abbiamo?» · CDO/CIO con il business owner, dopo la discovery · scenario → fondamenta → use case → convergenza → valore → rotta · chiede di perimetrare una fase. (Agos, FS, Ferrari)
- **Playbook** — «Come lo uso da lunedì?» · chi possiede lo strumento, prima del go‑live · punto di partenza → N domande = N capitoli, «oggi» vs «con X» → cosa vi portate a casa · chiede di accenderlo. (Poste)
- **Interno** — showcase, Atelier, Aperture: non rivolti al cliente.
Regole: niente «demo» nei nomi (il software dal vivo è una proprietà di Storia e Playbook); la
copertina rende `EXPERIENCE_TYPES[TYPE].coverLine`, mai una stringa a mano; un ibrido si
registra sotto il tipo **dove il cliente decide** (Ferrari apre da Prospettiva, decide da
Blueprint). «Experience» resta il nome del formato, non del contenuto. Il router di intake
(`skills/experience-design/references/intake-router.md`, Step 0 della skill `/experience-design`)
sceglie il tipo da cinque domande; `pnpm new:experience` genera la skin dal suo scheletro.

## In che forma si consegna — experience HTML o .pptx (8 ott 2026, BINDING)
La Tassonomia dice **che cosa** si consegna; questa regola dice **in che forma**, e si
decide con una domanda sola: **di chi è il design system di questo documento?**
- **Del cliente** → **experience HTML**. La skin è la sua (`pnpm brand:tokens`).
- **Di Adobe** → **.pptx sul template di Brand Center**. Il design system è quello di Adobe.

**Un artefatto, un design system.** L'ibrido è l'errore da cui nasce la regola: il deck
dell'8 ottobre era un artefatto di marchio Adobe (red thread, logo, Adobe Clean) con dentro
un accento *di cliente* — per giunta il petrolio `#007A91` di UniCredit in una stanza di
Intesa. Sul template Adobe il colore del cliente **non struttura** la slide: i fondi di
contenuto sono neri o bianchi e i grafici stanno in grigio con pochi accenti.

Sul .pptx valgono dieci regole **lette dal template e dalla sua guida**, non a memoria
(dettaglio e fonti in `skills/experience-design/references/deliverable-format.md`):
**si compone, non si disegna** — il template porta **166 layout approvati** e «do not create
slides from scratch»; **Adobe Red è `#EB1000`** (si legge dal master; `#FA0F00` è il rosso
del logo corporate, non quello delle slide); il **red thread** non si copre, sposta,
ricolora, rompe; fondi di contenuto **nero o bianco**; **solo Adobe Clean** (se manca, non
si cambia il carattere: si lasciano i riferimenti del template); titoli in sentence case e
testo a bandiera sinistra; icone solo nere o bianche dal set Adobe; grafici in prevalenza
grigi; loghi di prodotto ufficiali col nome accanto in testo editabile; **una scala
tipografica di 5-7 corpi** — un corpo a mezzo punto è il segno del testo rimpicciolito
finché entrava, e allora si taglia la copia o si cambia layout.

**Il motore sta in `scripts/pptx/compose.py`**, è di tutti i deck e di tutti i clienti, e
porta i *trattamenti*: oltre a `colonne`, `cover`, `divisore` e `flusso`, ci sono `citazione`
(una frase grande quanto la pagina), `meta_immagine` (mezza o un terzo d'immagine), `numeri`
(le cifre a 34pt), `obiezioni` (i virgolettati del cliente), `strati` (un'architettura con
l'innesto acceso), `linea_del_tempo` e `grafico_barre`. Il builder di un deck importa il
motore e resta **contenuto puro**. Si migliora il motore una volta, e ne beneficia ogni deck.

**Prima di comporre si APRE il catalogo** (`pnpm pptx:layouts` → `docs/Factory/pptx-layouts/`)
e si sceglie la famiglia di layout per ogni slide. **58 dei 166** portano un'area immagine, una
citazione a tutta pagina o una struttura da caso studio: un deck che esce «muro di testo» quasi
sempre ha usato solo quelli a colonne — è successo il 16 ott 2026, sette layout su 166. Però
**l'immagine non è un fine**: se il contenuto non entra, è sbagliato il layout, non la copia da
tagliare. Le immagini si ereditano dalle librerie Adobe con la provenienza accanto, mai dal
repertorio generico, e **si guardano a dimensione intera prima di posarle**.

`audit:pptx` ha **tre gruppi** di controlli, e il terzo è nato il 16 ott 2026 perché mancava:
marchio (`T B F R L`), geometria (`C E P O`), e **qualità visiva** — `D` parole per slide (SOFT
>130, HARD >190), `Z` corpo proiettato (HARD per un paragrafo lungo sotto i 12pt), `V` quanta
pagina è coperta e le fasce vuote oltre il 34%, `G` i deserti di sei slide senza un elemento
grafico. Senza di loro un deck con **mediana 134 parole per slide e 46 pagine su 49 senza un
disegno** passava con zero rilievi. Il giro completo sta in **`/deck-pptx`**.

`audit:pptx` misura le scatole, non il testo reso: dal 16 ott 2026 rende il PDF e verifica che
nessuna parola di corpo entri nella **fascia del piè di pagina**, dove vivono marchio e
copyright. Quando fallisce si taglia la copia o si cambia layout, **mai si rimpicciolisce il
tipo**.

Ereditare da una libreria Adobe: `pptx:find` → `pptx:take` → modifica → **rendi e guarda**.
Traduzione, scambio d'immagine, ricolorazione ed eliminazione funzionano; **alla cieca no**
(una ricolorazione automatica appiattisce le illustrazioni isometriche). La provenienza
— file + numero di slide — si cita nel builder e nel handover.

## Commands
- `pnpm --filter unicredit-engagement audit:deck` — deterministic deck layout audit (3 viewports). `--only <rotta[,rotta]>` limita il giro a una pagina (secondi invece di minuti) mentre la si sistema. **`--tv`** aggiunge 2560×1440 e 3840×2160: si lancia quando si tocca la composizione e prima di una proiezione su parete.
- `pnpm new:experience --slug <kebab> --name "…" --client "…" --type <prospettiva|storia|blueprint|playbook> [--accent #hex] [--lang it|bilingual] [--dry-run]` — genera una skin **che compila e passa l'audit** dal template `templates/experience/` (capitoli dallo scheletro del tipo) e la registra in deploy, hub, showcase, root scripts, `deck-audit.ts`, migrazione seed. Stampa la checklist di ciò che resta umano. **Secondo comando di ogni nuova experience**, dopo `brand:tokens`.
- `pnpm brand:tokens <url>` — legge il design system pubblico di un cliente dal suo CSS di produzione (colori per frequenza, custom property, caratteri). **Primo comando di ogni nuova experience.**
- `pnpm loop:seamless <clip.mp4> --poster` — ricuce una clip perché il loop non faccia stacco (+ `--check` per verificarne una esistente; **`--boomerang`** quando la clip *deriva* e nessuna dissolvenza fa combaciare testa e coda: andata e ritorno, il giro si chiude per costruzione).
- `pnpm brand:icons <app> --title "…" --sub "…"` — dal `favicon.svg` disegnato a mano rende `icon-192.png` e `apple-touch-icon.png`; la palette la legge dal marchio, così le icone non divergono da lui.
- `pnpm og [--app <alias>] [--list]` — **l'anteprima del link** di ogni artefatto (`og.png` 1200×630): firma Adobe × Cliente, sigla del tipo (Pr · S · B · Pb · I · D), titolo, badge sui riservati. I meta li emette il motore (`SocialMeta.astro`). Gate: **`pnpm audit:og`** dopo `pnpm build`.
- `pnpm pptx:layouts` — catalogo dei **166 layout approvati** del template Adobe (JSON + PNG da guardare) · `pnpm pptx:find "<testo>"` — cerca nelle **1863 slide** delle librerie Adobe indicizzate · `pnpm pptx:take "<libreria.pptx>" <n>…` — estrae quelle slide in un file nuovo **e le rende** · `pnpm pptx:index` — (ri)costruisce l'indice. Output in `docs/Factory/` (git-ignorato).
- `pnpm audit:pptx <deck.pptx> [--render]` — gate deterministico dei deck consegnati come **file**: red thread non coperto/ricolorato, Adobe Red letto dal master, solo Adobe Clean, fondi nero/bianco, segnaposto rimasti, fuori foglio, scala tipografica. **0 HARD**, poi si guardano le pagine.
- `pnpm deck:catalogo` — **il catalogo dei blocchi e delle scene del motore** (30 blocchi, 11 scene
  di meccanismo), letto dal sorgente. **Si apre PRIMA di comporre un capitolo**, come
  `pnpm pptx:layouts` per i .pptx: comporre a memoria produce tre strutture ripetute, ed è già
  successo il 24 ott 2026. Output in `docs/Factory/deck-catalogo/` (git-ignorato).
- `pnpm audit:ritmo` / `DECK_URL=<origin> pnpm audit:ritmo --app <alias>` — il **ritmo** di un deck
  HTML, cioè i tre check che i `.pptx` avevano e l'HTML no: **`R`** due slide di contenuto
  consecutive dello stesso tipo, **`G`** quattro slide di fila senza un elemento visivo,
  **`V`** quanta pagina è coperta da testo **e figure**. Tutto SOFT: insegna a comporre.
- `pnpm lenti --app <alias> [--en] [--root <albero>]` — **le misure che nessun gate dà**, per
  umanizzare: stilometria **per pagina** (frase media, burstiness, Gulpease, type-token),
  i **perni** (due punti usati come snodo retorico), i **telai** di frase e dove si
  concentrano, le aperture ripetute. **Non è un gate**: stampa numeri da confrontare prima
  e dopo un giro. `--root` punta a un albero estratto con `git archive` per la baseline vera.
- `pnpm audit:wrap` / `DECK_URL=http://localhost:N npx tsx scripts/wrap-audit.ts --app <app> [--tv] [--tutto]` — gli **a capo** del deck: segnala le preposizioni e gli articoli appesi a fine riga nel testo grande (titoli, occhielli, lead), misurati sulle righe davvero rese. Si lancia dopo ogni modifica di copia, **prima** di `audit:deck`.
- `pnpm audit:taglio` / `DECK_URL=http://localhost:N npx tsx scripts/cut-audit.ts --app <app>` — il taglio **«In dieci minuti»** resta allineato al percorso intero: HARD su copia a mano, numeri che solo il taglio afferma, fonti che solo il taglio porta. Si dichiara l'app in `scripts/lib/cut-routes.ts`. Si lancia **prima** di `audit:deck`.
- `pnpm audit:dossier` / `DOSSIER_URLS="<url>?t=<token>" npx tsx scripts/dossier-audit.ts` — gate deterministico dei **dossier interni** su 5 viewport (320→1280): barra fissa ≤12% del viewport, zero scorrimento orizzontale, corpo ≥16px e celle ≥14px, celle di tabella etichettate quando si impilano, bersagli ≥44px, indice completo, 60–95 caratteri per riga, stampa pulita. Deve uscire a **0 rilievi**.
- `pnpm --filter <app> assets:build` — fetch/grade **Pexels** assets → `src/assets/generated/` + `provenance.json`. Reads `PEXELS_API_KEY` from the app's `.env` (gitignored). Re‑fetches ALL slots; to regenerate a subset use `--manifest <tmp>` with only those slots.

## Deployment
- Public repo `agargiulo-adbe/experience-design-factory`; GitHub Pages source = **GitHub Actions** (`.github/workflows/deploy.yml`, Node 22).
- Build merges every app's `dist` into one artifact: root = **factory-hub** (the Factory landing/hub); `/generazioni-maxmara/`, `/unicredit-engagement/`, `/ferrari-racing/`, `/trenitalia-connessioni/`, `/agos-trait-dunion/`, `/poste-sei-domande/`, `/unipol-cinque-domande/`, `/console/`, `/showcase/`. Each app: Astro `base = /experience-design-factory[/<app>]`, `trailingSlash: 'always'`. Max Mara moved from root to `/generazioni-maxmara/`; the hub ships redirect stubs for the old root-level maxmara deep links (`/acquisizione/`, `/engagement/`, `/conversione/`, `/loyalty/`, `/motore-adobe/`, `/persona/`, `/chiusura/`, `/maxmara-adobe/`).
- Live e.g. `https://agargiulo-adbe.github.io/experience-design-factory/ferrari-racing/`.
- Push to `main` auto‑deploys. The **deploy job retries** on transient GitHub Pages `syncing_files` failures (backend can be flaky) and skips stale commits.
- Build env: `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` from **GitHub Actions secrets** (never in repo).

## Code Conventions
- TypeScript, strict. Astro for pages/layouts; islands only where interactive.
- Tailwind + CSS custom properties from tokens — **NO hardcoded color/spacing**.
- Each experience defines the token contract in its `global.css`: surfaces (`--surface-primary|secondary|inverse|brand`), ink, `--accent-primary|secondary`, `--font-display|body`, `--line-subtle`, `--slide-safe-inset`, `--deck-chrome-safe`. Keep the primary/secondary=light, inverse=dark, brand semantic so shared blocks work.
- Real copy — no lorem ipsum. Commit often (conventional commits). **NEVER commit secrets** (`.env`, tokens, service_role).

## File Ownership (for parallel work)
- `packages/core/**` — shared engine (changes propagate to all experiences: verify each).
- `apps/generazioni-maxmara/**` · `apps/unicredit-engagement/**` · `apps/ferrari-racing/**` — per experience.
- `apps/console/**` — Super Admin. `supabase/**` — backend. `**/*.test.ts`, `e2e/**` — QA.

## Working rules — codified from production (BINDING, every experience present & future)

### Copy voice — 100% human, not AI (IT + EN)
Copy must read like a sharp human wrote it, never "AI‑generated". Kill the tells:
- em‑dash used as a rhetorical crutch (`X — non solo Y`, "era lì — per design");
- staccato fragments / tricolons ("Ogni giorno. Ogni query.", "In real time.");
- symmetrical `non solo X, ma Y` / "not just X — but Y";
- empty value‑speak & superlatives ("crea valore", "un'unica visione", "the speed decides who stays");
- buzzword stacking, over‑parallel bullets, AI connectors ("Inoltre", "In a world where", "It's not just about…").
Rewrite into natural, concrete sentences with varied rhythm. **Never touch** product/persona names, numbers, sources, claims; **keep each string within ±10% of its length** so the deck audit (height/legibility) doesn't break.
That length bound applies **from Giro 1** of `/umanizza` onward, measured against the text that came
out of **Giro 0** — where it does **not** apply: there a title that fails to inform, or a sentence
nobody gets on first hearing, is rewritten at whatever length it takes, because what's needed is the
right text, not one of the same size. If the new text doesn't fit: cut copy, change the composition
or split the slide — **never shrink the type**. Bilingual (Ferrari): EN and IT each idiomatic, never a literal echo; `<T en it>` ALWAYS keeps BOTH languages. Memory: `copy-must-be-human`.

### Quello che dice l'utente è un'ipotesi, non un oracolo (BINDING, sempre)
Un'affermazione — del committente, di un collega, di un verbale, di un riassunto
automatico — è il **punto di partenza di una ricerca**, mai un fatto da trascrivere.
Prima si verifica, poi si risponde con l'esito, anche quando l'esito contraddice chi
l'ha detto. Vale per nomi di prodotto, perimetri di persone, numeri, competitor,
posizionamenti: tutto.
- **Tre fonti, in quest'ordine:** interne Adobe (Fluffy — `field_readiness_sharepoint_search`,
  `full_documentation_search`; Slack; wiki), pubbliche ufficiali (pagina prodotto,
  Experience League, newsroom del cliente), e il materiale del cliente stesso.
  Una sola non basta quando la frase finisce davanti a un cliente.
- **Si risponde con il verdetto, non con l'eco.** «Hai ragione, e il numero è questo»,
  oppure «no, e la fonte dice un'altra cosa». L'accondiscendenza su un fatto sbagliato
  è un danno differito: esce in riunione, davanti al cliente, e non si recupera.
- **Le cose da sapere prima si dicono prima.** Un vincolo dichiarato da noi vale molto
  più dello stesso vincolo scoperto dal loro IT un mese dopo.
- **Un riassunto automatico non è una fonte.** Gli AI summary delle registrazioni
  sbagliano i nomi propri con regolarità («Easybank» per Isybank, «Vazzana» per Vassena):
  si risale sempre al parlato prima di scrivere un nome in un documento.
- **Dove c'è conflitto fra due fonti, si riporta il conflitto** e si chiede, invece di
  sceglierne una in silenzio. Chi legge deve poter vedere che c'era un bivio.
- **Assenza di prova non è prova di assenza:** da «non trovato» si conclude «non
  confermato, da chiedere», mai «falso» (vedi `fonti-cliente-gerarchia`).
- **E vale al contrario, che è il caso più caro: un'affermazione di ASSENZA su un cliente
  («questo in casa non ce l'hanno») si verifica sulle SUE pagine, prima di scriverla.** Su
  BPER il deck affermava in tre punti che mancava l'arbitro fra le proposte: il comunicato
  del gruppo del 23 nov 2022 dice che il loro motore «consente di calcolare dinamicamente la
  miglior proposta commerciale per ogni singolo cliente (Next Best Action)». La fonte che
  smentisce è la più forte che esista — la loro — e in sala la trova chiunque. Quando una
  capacità sembra mancare, la frase giusta non è «non ce l'avete»: è l'osservazione più
  precisa («presente, non configurato così») seguita dalla domanda. Costa una ricerca e
  salva la riunione. Memoria: `assenza-sul-cliente-si-verifica`.
Memoria: `user-claims-are-hypotheses`.

### Panel review — gli occhi del cliente (BINDING, prima di ogni handover)
`audit:deck` verde e screenshot letti provano che il deck **si vede**, non che il cliente
**compri l'argomento**. Prima della consegna si lancia la skill **`panel-review`** (canonica in
`skills/panel-review/`, installata anche globalmente; adattatore di questo repo in
**`.claude/panel-review.md`**): sub‑agent freschi e isolati, uno per stakeholder reale (personas
**cieche**, ritratti pubblici in `docs/<Cliente>/PANEL-PERSONAS.md`), un **critico paranoico** che
riverifica ogni claim alla fonte (pubblica + Fluffy), un **arbitro** con backlog P0/P1/P2 e lista
«non toccare»; orchestrati dal Workflow `skills/panel-review/references/workflow.js` con output a
schema. Si applicano P0 e P1, si riverifica (build, audit 0 HARD, screenshot) e si rilancia per la
delta; **due giri al massimo**. Verdetto in chat, nel handover e nel **dossier interno**.
`/handover` segnala come P0 un'experience modificata senza verdetto registrato. Memoria:
`panel-review-mode`.

### Cross‑experience propagation
A product/naming change (e.g. LLMO + Semrush → **Adobe Brand Visibility**) or a shared‑engine improvement (`packages/core`, Admin engine) propagates **everywhere**: update every experience that references it **and** each `admin.astro` (PAGE_REGISTRY / SOLUTIONS) **and** hub/showcase if they list products, then verify each (build + `audit:deck`). Verify names against the authoritative source (`docs/*.pptx`), not from memory; keep co‑brand discreet ("Adobe + Semrush"). Memory: `brand-visibility-product`.

### Parallel work on a shared app → isolated worktrees
Independent tasks on the **same** app (different files but one shared `dist/`) must NOT run concurrent build/preview — they race and corrupt `dist/`. Use **subagents in isolated git worktrees** (`isolation: "worktree"`), one per section/area, each building + auditing in its own worktree; then bring the changed files into the main tree and run **one final build + audit** to confirm. Separate experiences (distinct `dist/`) can use plain parallel subagents.

### Handover docs stay readable at session start
Keep the docs a new session reads at startup **readable in a single `Read`**. Use **`/handover`** (`.claude/commands/handover.md`): it updates the handover in detail, enforces the size contract (≤1500 lines / ≤48KB / ≤1800‑char lines), splits by section with `HANDOVER.md` as a manifest/router, and verifies readability with a full `Read`. `/handover check` = verify only.

## Error Recovery
If you encounter errors, diagnose, fix, and continue. Do not stop.

## Fonti su un cliente terzo e dossier interni
- **Fatti attribuiti a un cliente terzo** (referenze, numeri, nomi di cose che ha costruito lui): valgono le fonti nell'ordine — artefatti approvati dal cliente (deck presentato, abstract scritto da lui) → corrispondenza dell'account (`.eml`/`.msg` e allegati nella sua cartella) → trascrizioni (**sbagliano i nomi propri**) → cataloghi pubblici → web. **Assenza di prova non è prova di assenza:** da «non trovato» si conclude «non confermato, chiedere al team», mai «falso» — e prima di dichiarare sbagliato il lavoro di un collega si cerca la fonte che aveva lui, rifacendo l'`ls` della cartella del cliente (il materiale arriva mentre si lavora). Memoria: `fonti-cliente-gerarchia`.
- **Le dichiarazioni invecchiano.** Un'idea o una leva costruita su una frase del referente a un convegno, o su un piano citato in un bilancio, poggia su materiale vecchio di mesi: va trattata come **spunto da verificare**, mai come assunto — con la data della fonte in chiaro nel dossier e, nelle slide, come **domanda** anziché affermazione. «Voi avete questo problema» basato su una frase di sedici mesi fa è il modo più rapido di perdere una riunione; «è ancora aperto?» non costa nulla e, se il tema è chiuso, conferma comunque il perimetro.
- **Dossier interni — per chi sono scritti:** un collega Adobe che **non sa nulla della Factory**, del formato o di queste regole. Apre un link, legge sul telefono, e giudica solo chiarezza, efficacia in riunione e quanto il documento dimostra di conoscere quel cliente e Adobe. Quindi: **nessun rimando a numero di sezione** («§7», «vedi §09», «idea I1», «P0») — le sezioni si richiamano per nome; titoli in italiano piano («L'ora, minuto per minuto», non «Run of show»); l'avvertenza in testa insegna a usare il documento invece di elencare regole nostre; ogni sigla si scioglie la prima volta, indicatori di mestiere del cliente compresi.
- **Dossier interni** (skill `skills/dossier/`): nessuna idea entra nella sezione «le idee da portare» senza verifica preventiva su **Fluffy** (`field_readiness_sharepoint_search`, `full_documentation_search`), sulle fonti Adobe pubbliche e su quelle del cliente — nome corrente del prodotto, casi d'uso dichiarati, e soprattutto **quello che il cliente già fa da sé, che non si propone**. Stessa regola per le referenze: si citano con le parole del cliente, mai con le nostre. Un dossier **non** porta il co-brand (il perché, in tre righe, sta nella skill §5).

## Le regole delle experience — caricate solo quando servono
Le regole su deck, audit, co-brand, tipografia, motore, Admin Console e qualità delle experience stanno in **`.claude/rules/experience-decks.md`**, che si carica da solo quando si lavora su file in `apps/`, `packages/`, `templates/`, `scripts/`, `skills/`, `supabase/` o `e2e/`. Restano **BINDING**: se un lavoro su una experience parte senza toccare quei file, quel file si apre a mano prima di scrivere.
