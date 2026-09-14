# Handover — Parte 9 di 9
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 21. Experience Atelier — deck trilingue del piano di crescita (17 lug 2026)

**Cos'è.** `apps/atelier` (`/experience-design-factory/atelier/`) — il **piano di crescita
enterprise della Factory stessa**, presentato come Exp Design immersivo. **Primo deck
trilingue EN/IT/FR** (default EN; il lettore primario è una dirigente Adobe con base in
Francia). **Depubblicata dai listing pubblici il 2026-09-01** (`4cca945`): **non più** in hub
né showcase (`experiences.ts`); resta nel Super Admin Console (migration `0007_seed_atelier.sql`,
status **`live`** — non toccata) e la route `/atelier/` è ancora buildata/raggiungibile (solo
unlinked; vedi backlog §10 per l'eventuale rimozione dal deploy). Estetica propria: **dark editorial**, carbone
caldo + champagne, **Fraunces + Inter** (coppia non usata da nessun'altra esperienza).

**Contesto (IMPLICITO, mai nel deck).** L'intento reale è un **pitch di sponsorship**
instradato a una specifica dirigente per un obiettivo di **AI-enablement della workforce
Adobe**. Nel deck questo NON è mai dichiarato: si legge come un piano di crescita neutro.
Vincolo di confidenzialità (repo + URL **pubblici**): **nessun nome di persona/org interna**,
**nessun listino interno**, **nessuna cifra € sulla pagina asks** (solo barre di
"envelope" relative 100/55/35/15; le cifre stanno in un annex privato). Memoria
`experience-atelier-deck`. Spec/piano: `docs/superpowers/specs/2026-07-17-experience-atelier-growth-plan-design.md`
e `docs/superpowers/plans/2026-07-17-experience-atelier-growth-plan.md`.

**Rebranding.** "Experience Atelier" è un nome **solo di presentazione** per QUESTO deck.
Repo, slug delle app, `@edf/core`, URL, chiavi localStorage restano "experience-design-factory".

### 21.1 Struttura — storica (17 lug → 8 set). ⚠️ **La struttura corrente è in §21.8** (Overture + 7 capitoli, 36 slide, `gap`/`moves` al posto di `multiplication`/`frontiers`)
1. **Overture** (`/`): `slide-cover` (wall di apertura non testuale) · `slide-wall` (6 card **live**, link ai 5 deck cliente + hub) · `slide-thesis`.
2. **The method** (`/method/`): cover · `slide-genesis` (timeline con **mesi reali dai first-commit git**: Max Mara 15 giu, UniCredit 1 lug, Ferrari 6 lug, FS 13 lug, Agos 14 lug 2026) · `slide-method` (4 step) · `slide-compliance` (tabella claim→prova).
3. **The capability** (`/capability/`): cover · `slide-anatomy` (diagramma CSS engine/skin/foundation) · **`slide-toggle-demo`** (demo interattiva self-contained di solution-gating, opera con tastiera SENZA far avanzare il deck; degrada a mock statico senza JS) · `slide-console`.
4. **The multiplication** (`/multiplication/`): cover · `slide-market` · `slide-precedent` · `slide-model`. **Tutte le cifre dal fact sheet** (§21.3).
5. **New frontiers** (`/frontiers/`): cover · `slide-live-products` · **`slide-quest`** (spotlight Boardroom Quest, teaser pixel-art in CSS, `data-solution="quest"`) · `slide-quest-plan` (`data-solution="quest"`, con gate brand/legal).
6. **The plan** (`/plan/`): cover · **`slide-roadmap`** (Gantt di sintesi: 5 workstream × 3 milestone, celle champagne, cella vuota dove l'Ecosistema parte a M2, riga "key moments" con gate brand/legal + Hackathon + Summit) · `slide-m1`/`slide-m2`/`slide-m3` (milestone a mid-set 2026 / mid-gen 2027 / mid-apr 2027 con **Adobe Summit 2027, Las Vegas 22–25 mar** dentro M3) · **`slide-kpi`** (scorecard 2×2: card numerate + metric-pill a wrap, non più 4 righe di testo).
7. **What it takes** (`/asks/`): **sezione gated** (`pageSolutions={['asks']}`) · cover · `slide-resources` (barre relative, **zero €**) · `slide-moments` · `slide-sponsor`.
8. **Closing** (`/closing/`): `slide-thesis` · `slide-next` (backdrop `bg-stage`: silhouette ballerina sotto spot come immagine di chiusura; `noText="54,38,30,44"`). `nextHref` fa loop → Overture.

Catena nav: ogni pagina ha `prevHref`+`nextHref`; admin `PAGE_REGISTRY` registra tutte le
28 slide non-index (index escluso, come per agos).

### 21.2 Gating come controllo d'audience
Due solution id — **`asks`** (intera sezione sponsorship) e **`quest`** (le 2 slide
Boardroom Quest in frontiers). Servono a **condividere il deck con o senza la richiesta di
sponsorship**. Con `asks` off: visita diretta a `/asks/` redirige, e la freccia da `/plan/`
salta ad `/closing/` (in entrambe le direzioni). Con `quest` off: frontiers mostra 2 slide.
Verificato end-to-end (T16).

### 21.3 Disciplina dei fatti (fact sheet)
`docs/superpowers/research/2026-07-17-atelier-comparables.md` (24 claim verificati in modo
adversarial, lista refuted). Regole vincolanti applicate nel copy:
- **Cifre vendor con attribuzione esplicita** ("Consensus dichiara…", "studio Forrester
  commissionato da Reprise", "Moderna riferisce / dato del vendor"): Consensus $110M da
  Sumeru (2023), acquisizioni Peel+Saleo (2026), cicli −29–68%; Reprise Forrester TEI +60%
  pipeline (feb 2022); Moderna 750 GPT / 40% WAU (OpenAI, apr 2024); SAP serious game
  (S/4HANA board game 2020, BTP Diamond Game) **senza numeri di outcome**.
- **VIETATI** (lista refuted): "Consensus 15 of 30", qualsiasi deal Consensus/**SPI**
  (inesistente), numeri Walnut/Demostack/Klarna/Accenture/Microsoft-copilot, percentuali
  Learning-Pyramid. **Nessun benchmark BDR/SDR esterno** è sopravvissuto alla verifica →
  la storia KPI è **auto-misurata** (ci misuriamo noi), non presa in prestito.

### 21.4 Verifica (T16) — esito
`pnpm build` (tutte le app) verde; `pnpm --filter atelier typecheck` 0 errori. `audit:deck`
full 8 rotte × 3 viewport: **0 fallimenti hard**; gli unici soft `i` (space-usage) sono
sulle slide volutamente ariose e **whitelisted**: home cover+thesis, capability cover, asks
sponsor, closing thesis+next (NON si risolvono restringendo il type — Type & legibility
contract). Visual sweep letto a 1920 (EN + FR/IT sulle slide più dense): type generoso,
composizione bilanciata, nessun overflow, reveal visibile. Nav/gating/i18n verificati via
Playwright. URL deployati (`/`, `/method/`, `/plan/`, `/asks/`) → 200; hub linka atelier.

### 21.5b Pass de-celebrazione + sintesi grafica (20 lug 2026, commit `c49e7db`)
Su richiesta owner ("mai autocelebrativo" + "slide chiare/sintetiche, elementi grafici e
piani in formato Gantt"). **Copy de-celebrato** (EN/IT/FR, meaning-preserving, ±10%): tolti
lo staccato-brag "Weeks per experience. Not quarters." (genesis), "Enterprise-grade… this
deck is one of them" (overture cover), "deepest content model in the family" (UniCredit),
"this demo is real" (toggle), "in Adobe hands" (market), il tricolon "Touching it beats
both" (live-products) e il tetracolon "prove the craft" (closing). I fatti/URL portano la
prova; niente più editorializzazioni. **Sintesi grafica del piano:** nuova `slide-roadmap`
(Gantt 5×3, vedi §21.1) + `slide-kpi` da 4 righe → **scorecard 2×2** con metric-pill. Le
stat del metodo ("5 / 3 lingue / 12 check") restano: evidenza fattuale, non vanto.
**Audit** ancora 0 hard; nuovi soft accettati/whitelisted: `slide-roadmap` (`i` a
1440/1280 = left-weight del layout editoriale + `a` a 1280 = titolo alto perché riempie
l'89% dell'altezza) e `slide-kpi` (`a` a 1440/1280 = titolo ~27–29%, appena sopra banda).
Parità altezza EN/IT/FR a 1280 verificata (nessuno scroll; FR +1px vs EN).

### 21.6 Pass «critica iper-critica» (8 set 2026, merge `3e74503` + `fd62926`)
Critique impeccable a 3 agenti (design/detector/contenuto): score **23/40**, 3 P0 (date scadute, `slide-resources` rotta a 1280, nessuna decisione formulata), 6 P1. Snapshot in `.impeccable/critique/` (non tracciata). Fix eseguiti in **5 worktree** per area di file + 1 merge finale:
- **Calendario ridatato** (era mid-Sep/Jan/Apr): **M1 · metà dic 2026** Foundations · **M2 · Adobe Summit, Las Vegas, 22–25 mar 2027** Scale and open (Hackathon feb 2027) · **M3 · fine giu 2027** Enterprise and lighthouse (primo cliente EMEA co-costruito con partner). Cover plan «Plan as of September 2026». **Decisione richiesta entro il 30 set 2026** (assunzione del pass: da confermare). Summit 2027 verificato su web (Venetian, 22–25 mar).
- **Fatti aggiornati**: 7 experience / 7 organizzazioni (cover, muro, genesis 7 righe con date git 15 giu→2 set, anatomy 7 skin, closing). **Muro = 8 tile con screenshot reali** (`src/assets/wall/*.webp`, 1280×720 dai dist del `daad4cc`, `<Picture>` webp-only).
- **Decisione esplicita** (`asks/slide-sponsor` → «What we ask you to decide»: pilot 5–10 venditori/12 settimane · sponsor a livello leadership 30'/mese con autorità su coorte e accessi partner · envelope M1 «as sized in Annex A»). Annex A nominato (su richiesta al project lead). **Zero cifre €** (vincolo invariato). `slide-moments` **rimossa** (ridondante ×4).
- **Plan**: `slide-roadmap` = **Gantt vero** (CSS grid, asse ott 2026→giu 2027, barre per workstream, marker Decision/M1/M2/M3, riga Quest `data-solution="quest"`, layout verticale ≤768). **KPI con numeri** M1/M2/M3 + owner: split in `slide-kpi` + **`slide-kpi-2`** (registry aggiornato).
- **Sponsor cut**: nuovo solution id **`detail`** (cover di sezione, thesis, compliance, console, market, precedent, m1–m3, closing thesis). Link **`?s=asks`** = 14 slide; `?s=asks,quest,detail` = deck pieno. **`?s=` ora pinnato in `sessionStorage`** (`edf-solutions-atelier:link`) → il cut sopravvive alla nav tra sezioni senza toccare il localStorage dell'Admin. Bottoni «Copy full link / Copy sponsor link» in `closing/slide-next`.
- **Layout system**: `.atl-frame` / `.atl-cover-num` / `.atl-cover-kicker` / `.atl-lede` / `.atl-label` in `global.css`; cover identiche 01–07; eyebrow unico (override `[data-deck] .slide-eyebrow` contro la regola core 1.05–1.3rem); pull-quote solo su toggle-demo e model; side-stripe rimosso da quest-plan; type ≥0.95rem body / ≥0.8rem label ovunque (roadmap era 12,96 px).
- **Core (propagato, Ferrari ricostruita e smoke-testata)**: `LangToggle` setta `html lang` + `aria-pressed` e **ripristina la lingua su `astro:after-swap`** (prima si perdeva a ogni nav SPA); `DeckContainer` aria-label prev/next/fs localizzate EN/IT/FR via `data-lang`, `.deck-progress` nowrap (phone: 1 riga), `cursor:none` solo con `hover:hover`, chrome fisso alla prima visita (`edf:deck-seen:<app>`), prop `hint` opzionale.
- **Nav**: `<select>` di sezione sotto `md` (gating-aware, `option.hidden`), focus ring non più tagliato, IT «Apertura», FR «Le socle»/IT «La capacità».
- **Copy/FR**: de-AI (tricoloni, meta-commenti) + franglais tolto; IT senza seller/intake/wizard. Naming 2026 (GenStudio for Performance Marketing, Real-Time CDP Collaboration, CJA).
- **Verifica**: build tutte le app; `audit:deck` **0 HARD** 8 route × 3 viewport (29 soft `a`/`i` accettati); 31 slide lette a 1920 + 1280 FR + 390; lint 0 errori. Prossimo: `/impeccable critique apps/atelier` per il trend.

### 21.7 Pass «stato del codice + catena creativa Adobe» (14 set 2026)
Richiesta: far evolvere il deck con le capability Firefly/Adobe e riallinearlo allo stato reale del codice. Il deck era fermo all'8 set (7 experience; «media generativi all'orizzonte» quando Firefly era già in produzione su 3 deck).
- **Fatti riallineati**: **8 experience / 8 organizzazioni** (Isybank 9 set) su cover, muro, tesi («otto in tre mesi»), genesis (8 righe, 4+4), anatomia (8 skin), recap, description del layout, label admin. **Muro = 8 tile cliente in 2×4** con screenshot **ricatturati dai dist di tutte le app** (UniCredit col lockup nuovo); la piattaforma è un link sotto il titolo, non più una tile. Riga MIM **senza** la rivendicazione Content Credentials (i file spediti non portano il manifest, §10 P1); UniCredit a 7 capitoli col design system letto dal CSS di produzione. Console = **4 controlli** (capitoli e slide on/off). Anatomia: motore con firma co-brand + credito; fondazioni a **3 pannelli** (console · token letti dal sito · catena di build con provenienza). Frontiers: oggi = mockup + Firefly in build; M2 = **generazione in sala** (proxy runtime, Fase 2 §29); M3 = motion generato + presenter per ogni experience. Voce M2 del piano riscritta di conseguenza; intake del modello cita la lettura del design system.
- **Nuova slide `capability/slide-adobe-stack` «Made with Adobe»** (non gated): Firefly Image (**55 sfondi su 4 deck**: MIM 23 · Isybank 17 · UniCredit 10 · Atelier 5 — +2 il 14 set: `bg-gap`, `bg-moves`), Firefly Video (**8 clip**: MIM 3 · UniCredit 2 · Isybank 2 · Atelier 1), Photoshop API (1 scontorno), credito per slide + nota onesta sul manifest C2PA perso in conversione. Conteggi letti dai `provenance.json` il 14 set: **riverificare prima di toccarli**. Registrata nel `PAGE_REGISTRY`.
- **L'Atelier mangia la sua cucina**: i 3 sfondi usati (`bg-atelier`, `bg-loom`, `bg-stage`) rigenerati con **Firefly** su carbone+champagne (`assets.manifest.ts`, slot `firefly`, `contentClass: art`; i 2 slot stock inutilizzati eliminati); **clip Firefly Video** in copertina (`video.manifest.ts`, ricucita 16,9→37,5 dB con riferimento 40, `atelier-cover.loop.mp4` sul Release `media`, poster in `public/media`), via `LoopVideo` + scrim `.loom-scrim`. `MadeWith` montato nel BaseLayout **senza fallback** (quasi tutte le slide disegnano il telaio in CSS): dichiarano `data-made-with` solo le 4 slide con asset Firefly. La slide-next di chiusura non ha più la ballerina (niente `noText`). Chiavi Firefly copiate nel `.env` locale dell'app (gitignored). CoBrand resta fuori regola (§29.3).
- **Verifica**: build; `pnpm typecheck` 0 errori; `pnpm lint` 0 errori; `content-audit` PASS; `audit:deck` EN **8 rotte × 3 viewport, 0 HARD** (37 soft `a`/`i`: +8 rispetto all'8 set per le slide più dense — anatomy, console, adobe-stack, genesis — accettati per contratto, niente type ridotto) + FR sulle 5 rotte toccate; 14 slide lette a 1920 in EN e 8 in FR.

### 21.8 Redesign sulle tre mosse (14 set 2026) — branch `feat/atelier-tre-mosse`, 23 commit `21c5002`→`26026b8`
Cambia la **tesi**, non le slide: da «una fabbrica di pitch da scalare a cinquanta venditori» a «ogni opportunità ha la sua esperienza: viva fra i meeting, misurata, fatta con i prodotti che vende». Spec: `docs/superpowers/specs/2026-09-14-atelier-redesign-tre-mosse-design.md`; piano e ledger delle decisioni in `.superpowers/sdd/2026-09-14-atelier-redesign-tre-mosse/`. Base di fatti: `docs/superpowers/research/2026-09-14-atelier-ambition-critique.md` (la lista refuted del 17 lug resta vincolante, §21.3). Due capitoli cambiano nome **e** contenuto; il motore, il sistema visivo `.atl-*` e il trilingue EN/IT/FR restano.

**Struttura — Overture + 7 capitoli, 36 slide** (slug · slide id · gating; `detail` = fuori dal taglio sponsor):
1. **Overture** (`/`) — `slide-cover` · `slide-wall` · `slide-thesis` (`detail`, **riscritta**).
2. **The method** (`/method/`) — `slide-cover` (`detail`) · `slide-genesis` · `slide-method` · `slide-compliance` (`detail`; una riga nuova sull'**AI Act art. 50 in vigore dal 2 ago 2026**, con lo stato onesto: oggi credito + provenance, record esportabile a M1).
3. **The capability** (`/capability/`) — `slide-cover` (`detail`) · `slide-anatomy` (fondazioni: il primo pannello è diventato «Callable from Claude and Copilot», vero solo grazie alla prova (b)) · `slide-adobe-stack` · `slide-toggle-demo` · `slide-console` (`detail`) · **`slide-proof-telemetry`** (nuova) · **`slide-proof-mcp`** (nuova).
4. **The gap** (`/gap/`, sostituisce *The multiplication*) — `slide-cover` (`detail`) · `slide-buyers` (67% / 60‑40 / 18% / 69%, fonte **con data** su ogni pannello) · `slide-market` (`detail`) · `slide-adobe` · `slide-precedent` (`detail`).
5. **The three moves** (`/moves/`, sostituisce *New frontiers*) — `slide-cover` (`detail`) · `slide-move-1` «Alive between meetings» · `slide-move-2` «An experience per opportunity in 24 hours» · `slide-move-3` «Provenance as compliance» · **`slide-simulation`** (`simulation`).
6. **The plan** (`/plan/`) — `slide-cover` (`detail`) · `slide-roadmap` (Gantt riscritto, **sei corsie**) · `slide-m1`/`slide-m2`/`slide-m3` (`detail`) · `slide-kpi` · `slide-kpi-2`.
7. **What it takes** (`/asks/`, `pageSolutions={['asks']}`) — `slide-cover` (`detail`) · `slide-resources` · `slide-sponsor`.
8. **Closing** (`/closing/`) — `slide-thesis` (`detail`) · `slide-next`.

**Gating.** Tre solution id: **`asks`** (la sezione sponsorship), **`detail`** (15 slide: 6 cover di sezione, tesi di apertura, compliance, console, market, precedent, m1–m3, tesi di chiusura), **`simulation`** (la slide + la sua corsia nel Gantt). Il **taglio sponsor `?s=asks` sono 20 slide** (36 − 15 `detail` − 1 `simulation`): la spec diceva «≈16», era una stima sbagliata e la lista di gating è quella giusta — la `description` della Console dice «~20-slide sponsor cut». Deck pieno = `?s=asks,simulation,detail`. Le vecchie rotte **`/multiplication/`** e **`/frontiers/`** restano come **stub di redirect** (meta refresh + link, nessun `DeckContainer`: non entrano nel conteggio slide) perché i link già girati non muoiano.

**Calendario (otto mesi, non nove).** **Decisione entro il 31 ottobre 2026** · **M1 «Foundations» fine gennaio 2027** (pilota di 12 settimane da inizio novembre) · **M2 «Scale and open» all'Adobe Summit, Las Vegas, 22–25 marzo 2027** · **M3 «Enterprise and lighthouse» fine giugno 2027**. La data del Summit viene da un aggregatore: **va confermata su summit.adobe.com prima di presentare** — se cambia, cambiano Gantt, M2, KPI e le label dell'admin (§10 P1).

**KPI — quattro famiglie con owner** (`slide-kpi` + `slide-kpi-2`): **Buying surface** (pipeline influenzata *misurata*, esperienze riaperte dal cliente dopo il meeting, domande gestite dall'agente) · **Speed** (brief → esperienza: <1 settimana → <2 giorni → <24 h) · **Trust** (incidenti art. 50 = 0; file spediti con provenance e C2PA 50% → 100%; accessi e audit) · **People & ecosystem** (abilitati 5–10 → 25–40 → 100+, esperienze co-firmate, cliente faro EMEA).

**Prova (a) — la telemetria del deck.** Non una promessa: i numeri sulla slide sono quelli del deck che la sala sta guardando.
- DB: migrazione **`supabase/migrations/0014_deck_events.sql`** — tabella `deck_events` (INSERT per `anon`), view `deck_slide_stats`, RPC **`atelier_slide_stats`** in SELECT ad `anon` **solo per `project = 'atelier'`**. **Applicata al DB remoto.**
- Core: **`packages/core/src/blocks/immersive/telemetry.ts`** (+ `telemetry.test.ts`) e **`DeckTelemetry.astro`**, montato una volta nel BaseLayout dell'Atelier. Ascolta `deck:change`, manda `{project, route, slide_id, slide_index, cut, lang, session_id, dwell_ms}` con `sendBeacon`. `session_id` casuale per scheda in `sessionStorage`: **nessun dato personale, nessun cookie**. Si spegne con `?telemetry=0` o `edf:telemetry=off` in localStorage; `?telemetry=mock` rende dati di esempio (la slide si può auditare e provare senza rete).
- Slide `capability/slide-proof-telemetry`, **fail-closed**: senza rete o senza righe mostra «—», mai un numero inventato.
- **Verificata end-to-end il 14 set**: dopo i tre giri di `audit:deck` la RPC restituisce **103 righe**, con `gap` (15) e `moves` (15) presenti in EN, FR e IT.

**Prova (b) — il motore chiamabile da dentro Claude.** Pacchetto **`packages/mcp-atelier`** (stdio, `@modelcontextprotocol/sdk`), tre tool: `list_experiences` (dal registro generato con **`pnpm mcp:registry`**, `scripts/gen-experiences-registry.ts`), `open_experience({slug, cut?, lang?})`, `brand_tokens({url})` che riusa **`scripts/lib/brand-tokens.ts`** (estratto dallo script CLI, con test sotto `pnpm test:scripts`). Il core impara **`?lang=`** nell'init anti-flash del `LangToggle` (retrocompatibile: legge il parametro e basta, vale per tutte le app). Due nuove Agent Skill, **`skills/brand-tokens`** e **`skills/open-experience`**, accanto a `experience-brief`. Installazione nel README del pacchetto. La slide `capability/slide-proof-mcp` mostra la **trascrizione vera** catturata una volta e versionata in `apps/atelier/src/data/mcp-transcript.ts` — resta in inglese in tutte le lingue perché è una prova, non copy. **Limite v0 documentato nel README:** `open_experience` apre la **home**; per un capitolo si appende il suo slug all'URL. Riprovato il 14 set: `claude -p "…the URL of Pole Position in French"` → `https://agargiulo-adbe.github.io/experience-design-factory/ferrari-racing/?lang=fr`.

**Propagazione fuori dall'Atelier.** «Experience Cloud» → **«Adobe CX Enterprise»** in Agos (`orizzonti.astro`, per esteso «l'Adobe CX Enterprise Coworker»), nel registry della Console e in UniCredit (`acquisisci`, meta di `risultati`). Le **citazioni datate restano com'erano**: rinominare una fonte con un nome di prodotto che non ha mai portato falsifica la citazione (Forrester TEI 2023 ×2 e la nota a piè di pagina `unicredit/risultati.astro:197` «Adobe Experience Cloud banking sector benchmark» — backlog §10 P2: verificarne la data di pubblicazione e aggiungerla).

**Esito dei gate (14 set, tutti dalla radice).** `pnpm build` verde su **15 progetti** · `pnpm typecheck` **0 errori** · `pnpm lint` **0 errori** (1804 warning preesistenti) · `npx tsx scripts/content-audit.ts` **PASS** · test **57** (`@edf/core`) + **5** (`pnpm test:scripts`) + **5** (`mcp-atelier`), tutti verdi. **`audit:deck` su preview statica (`DECK_URL=http://localhost:4399`, l'ORIGIN, mai il path), 8 rotte × 3 viewport, in tre lingue: `HARD = 0` ovunque.** Soft accettati per contratto (non si risolvono restringendo il tipo): **EN 50** (46 `a`, 4 `i`), **FR 56** (52 `a`, 4 `i`), **IT 52** (48 `a`, 4 `i`); `asks` è PASS pulito in EN e IT. I quattro `i` sono gli stessi in tutte e tre le lingue: `moves/slide-move-3`, `moves/slide-simulation` e `closing/slide-next` (a due viewport) — slide volutamente ariose. **Lette a 1920**: tutte e **36** le slide in EN e le **14** nuove o riscritte in FR e in IT (tipo generoso, mock UI leggibili, nessuno sbordo).

**Cosa resta fuori (spec §7).** L'agente rivolto al buyer davvero montato sulle esperienze (è M2 del piano), le MCP Apps, la pipeline che **preserva** il manifest C2PA e il record art. 50 (M1: qui c'è la tesi, non l'implementazione), il tab Telemetria nella Console, la simulazione giocabile, la pubblicazione nell'Agent Skills Catalog, e la ridatazione degli altri deck.

**Minori rimandati** (dal ledger SDD; quelli ancora aperti sono in backlog §10 P2): l'occhiello della tesi «From one person to the whole sales force» è fuori tema rispetto all'h2 nuovo · rifiniture FR (**les éditeurs** nell'occhiello della cover di `gap` contro «la catégorie» della slide; nbsp e apostrofi francesi). **Chiusi nell'onda finale del 14 set**: il `cut` si ricava ora dal `sessionStorage` quando la nav SPA ha perso il `?s=` (`DeckTelemetry.astro`, `searchForCut()`) · le etichette di stato della slide telemetria sono trilingui · IT/FR dicono «progetto pilota» · i conteggi Firefly sono **55 sfondi** (Atelier 5) · `pnpm test` e `pnpm test:scripts` girano in CI.

**Rischio accettato (v0).** La chiave `anon` sta nell'HTML: chiunque la legga può inserire righe in `deck_events` entro i `with check` della policy — anche con `project='atelier'`, cioè proprio sui numeri della slide di prova. Contro la **lettura** anonima l'unica difesa è la RLS, perché i default privileges del progetto sono larghi (§Task 1). Accettato per la v0: si rivede con l'auth enterprise a M3.

**Limite di verifica.** `audit:deck` non passa query string, quindi la slide telemetria è auditata solo nello stato vuoto: lo stato **popolato** è verificato a screenshot con `?telemetry=mock`, non dal gate.

### 21.5 Pending / note
- ~~**Boardroom Quest**~~ — **superata dal 14 set**: il gioco è diventato **«La simulazione»**
  (`moves/slide-simulation`, gated `simulation`, §21.8), niente più teaser pixel-art. Resta
  vero il resto: il gioco **non è costruito**, è un workstream del piano (corsia Simulation nel
  Gantt), e serve il gate **brand/legal Adobe** prima di qualsiasi uso in workshop ufficiale.
- Il deck **presenta** il piano M1–M3; **non** implementa le sue feature (pilot, SSO,
  partner access, simulazione) — quelle sono fuori scope di questo deliverable.
