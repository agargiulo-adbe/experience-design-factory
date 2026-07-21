# Handover — Parte 3 di 3
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 21. Experience Atelier — deck trilingue del piano di crescita (17 lug 2026)

**Cos'è.** `apps/atelier` (`/experience-design-factory/atelier/`) — il **piano di crescita
enterprise della Factory stessa**, presentato come Exp Design immersivo. **Primo deck
trilingue EN/IT/FR** (default EN; il lettore primario è una dirigente Adobe con base in
Francia). Registrato in hub, showcase (`experiences.ts`) e Super Admin Console (migration
`0007_seed_atelier.sql`, status **`live`**). Estetica propria: **dark editorial**, carbone
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

### 21.1 Struttura — 8 sezioni / 30 slide (slug · slide ids)
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

### 21.5 Pending / note
- **Boardroom Quest** è **"in design"** nel deck (teaser concettuale, nessuna schermata
  finta): il gioco vero (motore PixiJS+inkjs, multiplayer) NON è costruito — è un
  workstream del piano. Materiale di ricerca del gioco: `~/Downloads/Boardroom Quest_….md`
  (non nel repo). Gate **brand/legal Adobe** prima di qualsiasi uso in workshop ufficiale.
- Il deck **presenta** il piano M1–M3; **non** implementa le sue feature (pilot, SSO,
  partner access, Quest) — quelle sono fuori scope di questo deliverable.

---

## 22. Modifiche core trasversali introdotte da Atelier (verificate su tutte le esperienze)

Due cambi in `packages/core` fatti per Atelier ma **propagati/verificati su tutte** (regola
di propagazione cross-experience in `CLAUDE.md`).

### 22.1 i18n trilingue (retrocompatibile) — `47bce98`, `2bbd988`, `c9fb186`
- **`blocks/i18n/T.astro`**: prop **`fr` opzionale** (lo span `data-lang-fr` si renderizza
  solo se passato); inoltre **inoltra attributi extra** (`data-reveal`, `aria-*`, `id`) al
  tag wrapper via `...rest` (prima li ingoiava → rompeva silenziosamente le reveal quando
  messe su `<T>`).
- **`blocks/i18n/LangToggle.astro`**: prop **`langs`** guidata (default `['en','it']`,
  tipata `Array<'en'|'it'|'fr'>`). Atelier passa `['en','it','fr']`.
- Le app bilingui esistenti sono **invariate** (nessuna passa `fr`/`langs`). Contratto
  consumer trilingue documentato nel docblock di `T`: un'app FR deve (a) whitelistare `'fr'`
  nell'anti-flash init del suo layout e (b) aggiungere le regole `html[data-lang="fr"]` di
  hide in `global.css` (il core non spedisce CSS di visibilità per `T`).

### 22.2 Fix gating dopo nav SPA — `e4e88ba` (atelier) + `56a7808` (le altre 5)
Il runtime inline di solution-gating in ogni `BaseLayout.astro` (nasconde slide gated,
riscrive `data-deck-next`/`data-deck-prev-href`) **girava solo al full load**: dopo nav
cross-sezione SPA (ClientRouter / `__edfNavigate`) le slide gated riapparivano e le
riscritture nav si perdevano. **Fix**: estratti `readActiveIds()` + `applyGating()`, chiamati
al load **e** su `astro:after-swap`, con guard `window.__edfSolGateBound` contro il
doppio-bind. Il redirect `pageSolutions` resta **solo** nel path di full load (mai dentro
after-swap, altrimenti forzerebbe un reload rompendo la SPA). Applicato a tutte e 6 le
esperienze (atelier, agos, ferrari, unicredit, maxmara, trenitalia); ri-applicazione
idempotente. Memoria `spa-gating-reapply`.

## 23. Redesign «eccellenza» E2E dei 6 deck (`/impeccable`) — 21 lug 2026, live in `main`
Ridisegno end-to-end del 100% dell'experience-design di **tutti e 6 i deck** a livello
gallery-grade. Metodo invariante: un **concept brand-native** centralizzato come
design-system `.xx-*` nel `global.css` di ogni app → ogni sezione ricostruita via **subagent**
(un file ciascuno, senza build/worktree per non corrompere il `dist` condiviso) → build →
QC screenshot a 1920 → fix → commit. **Copy/claim/numeri/fonti/personas preservati VERBATIM**:
cambiati solo markup, layout e visual, mai il testo (rubrica `copy-must-be-human` rispettata).

Concept per esperienza: **Agos** `.tdu-*` "two worlds, one current" (petrolio/acqua); **Atelier**
`.loom-*` telaio/trama-e-ordito (carbonio/champagne); **Ferrari** `.frl-*` racing line
(Rosso Corsa/carbonio/giallo); **UniCredit** `.uc-*` "il filo" d'oro (rosso #BE2027/blu-notte,
light-dominant); **Max Mara** `.mm-*` "il filo di seta" cammello quiet-luxury (light-dominant);
**FS/Connessioni** `.fs-*` "la linea" signal-line ambra su rete scura (dark-dominant).

I 6 branch feature mergiati in `main` con `--no-ff` (zero conflitti: ogni branch tocca solo la
sua app), build completo pulito (9 app), **deploy live 21 lug**. I 6 branch feature sono stati
**eliminati** (remoti + locali) dopo il merge. **`audit:deck` non rigirato** dopo il redesign
(ambiente sandbox) e QC 1920 fatto solo a campione → follow-up P1 nel backlog (§10).

### 23.1 Fix tecnico riutilizzabile — flip degli ink su slide inverse/brand
Il componente `Slide` (`@edf/core`) **NON espone `data-bg`**: applica lo sfondo come **classe
Tailwind** (`bg-[var(--surface-inverse)]`, `bg-[var(--accent-primary)]`). Quindi i selettori
di flip devono targettare la classe reale (`[data-slide].bg-\[var\(--surface-inverse\)\]`),
non un attributo. Due regole: (1) `bg="brand"` non è sempre scuro — per Max Mara cammello è un
mid-tone chiaro, tieni ink scuro; flippa solo `inverse`. (2) `bg="inverse"` non è sempre chiaro
— una cover con backdrop scuro resta scura: scopa il flip per `#id` alle slide che rendono
davvero chiare (es. FS `#slide-opportunity`), non a tutte le `inverse`. Verifica sempre le
slide inverse/brand con screenshot 1920. Memoria `deck-ink-flip-selector`.

### 23.2 Nota CI — `pnpm build` ≠ gate del CI (typecheck **e** lint)
`pnpm build` passa anche con errori TypeScript e con problemi di lint (astro build non fa il
type-check completo né linta); il CI usa `pnpm typecheck` (`astro check`) **e** `pnpm lint`
(eslint) e li blocca. Nel consolidamento del redesign sono emersi, con `build` verde, tre casi:
- **typecheck** — 2 errori TS dai subagent FS (param `any` in `fondazione.astro`; campo `badge`
  inesistente in `scenario.astro`) → `b0106bc`.
- **lint** — 1 *parsing error* in Agos `scenario.astro`: un commento `<!-- -->` **dentro** il
  `.map()` (espressione JSX) conta come secondo elemento root → "JSX expressions must have one
  parent element". I commenti HTML a livello template sono ok; dentro `{...}` no. → `0298ccc`.
**Regola: prima di pushare un redesign girare `pnpm typecheck` E `pnpm lint`, non solo
`pnpm build`.** Nota: build/deploy NON dipendono dal CI (workflow distinti) — le pagine possono
essere già live mentre il gate qualità è rosso.
