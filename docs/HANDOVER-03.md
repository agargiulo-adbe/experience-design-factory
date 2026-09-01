# Handover — Parte 3 di 3
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 18. Ferrari /scoping — modello Adobe-fedele, CI verde & Save resiliente (15 lug 2026)

Tre interventi sequenziali (tutti su `main`, CI verde end-to-end). Riferimento sintetico in §14 (riscritta), memorie `ferrari-scoping-calculator` e `git-push-after-every-commit`.

### 18.1 Riscrittura del motore Collaboration = 1:1 col workbook Adobe (commit `4592c58`, merge `c1184f9`)
Richiesta: replicare in produzione la logica del file **`docs/Ferrari/Real-Time CDP Collaboration Scoping Calculator.xlsx`** (Adobe "Sales Calculator" di dvest@adobe.com; foglio visibile + sheet nascosta `Drop Downs, Burn, Assump`). Il workbook modella **solo** RTCDP Collaboration → **CJA invariato**.
- **Reverse-engineering**: estratte tutte le formule via unzip + parse XML (nessuna lib xlsx). Burn rate (mgmt 2 · activation ad-hoc 500 · always-on 100 · measurement 50 credits/1M), assunzioni (match 30% · reach 50% · freq 10× · conv 5%), prezzo listino $5 (H13), pack-tiering (riga 31), funnel matched→impressions/conversions.
- **Motore riscritto** (`cost-model.ts`): `ScopingAssumptions` Collaboration completamente sostituito (onboardedIds, avgAudienceSize, matchRate, frequencyMultiple, reachPct, conversionRate, measurementEnabled, refreshEveryXDays, adHocCampaignsPerYear, audiencesPerCampaign, measurementCampaignsPerYear, summaryReportsPerCampaign, attributionReportsPerCampaign, alwaysOnRunsPerYear, simpleCampaignsPerYear). Tre modalità **detailed/simple/direct**; **nessun allotment** → `recommendedCreditPack`. Dettaglio formule in §14.2.
- **Propagazione**: `scenario.ts` (default+prezzo $5), `data/scoping.ts` (FIELD_AUDIT/SEED_SCENARIOS/METRICS/ASSUMPTION_META riscritti; burn ora *ufficiali*), presenter (select mode + measurement boolean, results bar con pacchetto, gating `mode` pipe-separato), README del blocco.
- **30→28 test cost-model riscritti** per riconciliare cella-per-cella (1.517,04; matrice simple; pack tiers). Build + typecheck ferrari 0 errori. Verificato live: preset Conservative → **921 crediti / pacchetto 1.000 / €5.000** collab; CJA 508M righe / €1.016; totale €6.016.
- **`.gitignore`**: aggiunta `docs/Ferrari/` (workbook Adobe interno; repo **pubblico** → mai committare). Il **PDF dossier** in quella cartella documenta il vecchio modello ed è ora **obsoleto** (non rigenerato, per scelta).

### 18.2 Fix CI — `tsconfig.json` mancante (commit `6b58b80`, merge `2eb6be7`)
Sintomo: per ogni push comparivano **due workflow** — `Deploy to GitHub Pages` (verde) e `CI` (rosso). Root cause: `agos-trait-dunion` e `trenitalia-connessioni` erano state create **senza `tsconfig.json`** → `pnpm typecheck` (`astro check`) non ereditava `astro/tsconfigs/strict` → ~1.979 errori fittizi `ts(7026) JSX.IntrinsicElements`. Il Deploy non fa typecheck → restava verde (coppia ingannevole). Fix: aggiunto ad entrambe il `tsconfig.json` standard (`extends astro/tsconfigs/strict` + alias `@edf/core`). Ora **8/8 app** typecheck 0 errori; CI verde. **Regola** (vedi §14.8): ogni nuova app DEVE avere `tsconfig.json`.

### 18.3 Fix Save "check your connection" — persistenza resiliente (commit `77e6b3f`, merge `c4ed338`)
Root cause: lo store leggeva `edf:sb-session.access_token` grezzo e **non lo rinnovava mai** → JWT Supabase scaduto (utente loggato in Console tempo prima) → insert **401** → `catch` cieco con messaggio generico **e nessun fallback** → scenario perso. Backend (tabella/RLS 0004) ed env deployato **corretti** (build ha l'URL `spwoeihrrr…`).
- **`scenario-store.ts`**: legge la sessione completa (access/refresh/expires_at); **refresh del token** proattivo (vicino a scadenza) + reattivo su 401 con **retry singolo** (rispecchia `apps/console`); su refresh fallito pulisce la sessione morta. Nuovo `RemoteError` (status HTTP reale), `remoteEnabled()` (niente fetch a URL relativo senza backend), `clearSession()`.
- **`ScopingCalculator.astro`**: Save **sempre** con fallback localStorage (lavoro mai perso) + messaggi bilingui accurati (sessione scaduta / cloud non disponibile / non configurato / anonimo); Share degrada allo stesso modo.
- **+7 test store** (`scenario-store.test.ts`, `fetch`/`localStorage` mockati): save fresco, refresh proattivo, retry reattivo su 401, refresh fallito→clear+401, non-configurato, sessione solo-refresh. Totale blocco scoping = **40 test**.
- **Altre funzioni verificate corrette** e non impattate: Confronta, Esporta JSON/CSV, Reset, preset, load `?scenario=`.

---
## 19. Ferrari /scoping v2 + sezione «Casi d'uso» (15 lug 2026 pomeriggio) — commit `a3fc86a`

Sessione successiva a §18. Su richiesta cliente (6 dubbi sul configuratore + "aggiungi casi d'uso con tutti i prodotti a perimetro"). **Committato e pushato** (`a3fc86a`, deploy live). Dettaglio tecnico in **§14.9**.
- **Chiarezza campi** (dubbi 1–3): hint inline su Dimensione audience × Match rate (= audience matchata), Campagne ad-hoc (one-off vs always-on); non più sepolti nel tooltip.
- **Refresh mode** (dubbio 4): modalità `campaign-linked` (refresh legato alle campagne) oltre a `continuous`.
- **Istanze partner** (dubbio 5): 1 Ferrari + N partner-tipo (profilo leggero × N); CJA singola.
- **SKU Base + entitlement** (dubbio 6): selettore pacchetto per party (standalone/Prime/Ultimate), Base flat $20k, crediti inclusi nettati. Ferrari Ultimate → Collaboration €0; costo guidato dai partner.
- **Slide nuova** `slide-model` («Come si compone il costo») + metriche arricchite.
- **Sezione nuova «Casi d'uso»** (`casi-duso.astro`): 4 scenari E2E su tutto il perimetro (Collaboration → GenStudio + Express → Attivazione → CJA) + mappa prodotti; nav+admin+cross-nav+deck-audit aggiornati.
- **TDD sul motore**: 13 nuovi test (party-cost, entitlement, refresh mode, istanze) → **53/53 core verdi**; build monorepo 0 errori; `audit:deck` ferrari (incl. casi-duso) **0 fallimenti**; screenshot 1920 letti.
- **Metodo**: brainstorming (4 decisioni confermate dall'utente: partner-tipo×N · selettore pacchetto per party · refresh legato alle campagne · sezione dedicata in nav) → TDD → build/audit finale.
- **Fatto**: commit `a3fc86a` (`feat(scoping): base SKU + entitlement, partner instances, campaign-linked refresh + Use Cases section`) + push su `main`; il commit ignora anche `docs/Ferrovie/` (materiale FS riservato, repo pubblico). Memoria `ferrari-scoping-calculator` aggiornata a v2.

---
## 20. Ferrari /scoping v3 — standalone-only, costo per istanza editabile, niente prezzi (15 lug 2026, commit `ff03a71`)

Su richiesta cliente, **rimossa ogni economia Adobe** dal modello (era diventato troppo "prezzato"). **Committato e pushato** (`ff03a71`). Sostituisce la parte commerciale di §14.9/§19; la matematica dei crediti (funnel/`collabParts`) e le istanze partner **restano**.
- **Niente riferimenti economici**: rimossi SKU Base ($20k/$5k), `pricePerCredit` ($5), `pricePerMillionRows`, entitlement (crediti inclusi Prime 2.500 / Ultimate 5.000), netting. Rimossi tipo `PartyPackage`, costanti `COLLAB_BASE_SKU`/`PACKAGE_ENTITLEMENTS`, funzione `partyCost`, campi `ferrariPackage`/`partnerPackage`/`*BaseSkuPrice`.
- **Solo scenario standalone**: nessun selettore pacchetto, nessuna ipotesi RT-CDP.
- **Costo = ipotesi editabile per istanza** (`UnitPrices` ridefinita): `ferrariInstanceCost` (default 100.000, editabile) + `partnerInstances × partnerInstanceCost` (default 0, editabile). `totalCost = Ferrari + N × partner`. **Niente costo CJA**.
- **Volumi come metrica (senza €)**: Collaboration Credits stimati + pacchetto consigliato, CJA Rows of Data + ingestion 3× — mostrati come quantità, nessun prezzo.
- **UI**: results bar = *Collaboration (volumi) · CJA (volumi) · Costo (tua ipotesi: istanza Ferrari + istanze partner)*; sezione form «Perimetro & istanze» = costo istanza Ferrari + n. istanze + costo per istanza partner (volumi partner in advanced). `slide-model` → «Perimetro e costo / Quattro voci, un perimetro» (4 card ridisegnate: istanze · crediti-volume · CJA · costo-lo-imposti-tu). METRICS/ASSUMPTION_META/DISCLAIMER/USE_CASES de-monetizzati. Admin baseline tab → costo istanza Ferrari/partner.
- **Motore**: `computeSnapshot`/`computeBreakdown` riscritti (volumi + costo per istanza). `partyCost`/entitlement eliminati. Test: rimossi i test party-cost/entitlement, aggiornati snapshot → **47 test core verdi** (35 cost-model + 5 scenario + 7 store).
- **Bug rapida↔dettagliata**: verificato che lo switch modalità **ri-gate il form e ricalcola** (es. Est. credits 343→720 passando a Rapida) — funziona; il rework del form ha risolto il sintomo riportato.
- **Verifica**: build monorepo 0 errori, core typecheck 0, `audit:deck` ferrari (8 sez + casi-duso) **0 fallimenti** a 1920/1440/1280, screenshot 1920 letti (calculator detailed+simple, slide-model). Memoria `ferrari-scoping-calculator` aggiornata a v3.
- **Contesto commerciale (perché standalone + partner a €0)** — non nel deck, guida le scelte del modello: l'intento è **1 istanza Ferrari + ~40 istanze partner/sponsor**, offrendo ai partner **licenze Starter a costo 0** (da cui il default `partnerInstanceCost = 0` e il costo Ferrari editabile). Audience **~5M outside-in, NON confermata dal cliente**. Validazione GTM pianificata con **Lory Mishra** (Principal PMM, Media & Advertising Solutions, Adobe — collega interna che approva/nega): validare il caso d'uso, ottenere le licenze Starter partner a costo 0, definire onboarding + enablement leggero per i partner; presentazione al cliente solo dopo le verifiche con lei. **NON reintrodurre prezzi di listino nel modello** (scelta esplicita del cliente/interna, §20).

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

---

## 24. Orbita — Eni (28 ago 2026)

**App**: `apps/eni-orbita` · live a `/experience-design-factory/eni-orbita/` · commit `31c8e13` → `0c42beb` → `48e3e63`. **Scopo**: meeting col **CIO Chessa il 10 set 2026** (rinnovo Eni SpA al 30/09). Brief verificato in `docs/Eni/BRIEF-MEETING-CHESSA-2026-09-10.md` — **confidenziale, git-ignored, MAI committare** (con `31c8e13` sono entrate in `.gitignore` anche `docs/Eni/`, `docs/Credit Agricole/`, `docs/UniCredit/`, `docs/Adobe Material/`). Memorie: `eni-orbita-prep`, `firefly-deck-motion-exploration`.

### 24.1 Deck (7 pagine, bilingue EN/IT)
`index` (Orbita) · `domanda` · `piattaforma` · `traiettorie` (6 traiettorie, **gated**) · `mappa` (gruppo) · `persone` · `rotta` (tre orizzonti). Design system **`.eo-*`**: giallo Eni / fumo / azzurro orbita; **Archivo + Inter**. Admin con PAGE_REGISTRY + **6 solutions su 3 pilastri**; gating su slide traiettorie e nav. Con `48e3e63` tutte le pagine deck sono passate a `<T en it>` (EN idiomatico, non calco; lunghezze nel contratto audit) + **LangToggle EN/IT in nav**.

### 24.2 Dossier war-room `/dossier/` (trilingue EN/IT/FR, noindex, fuori nav)
Executive summary · profilo CIO con video · fatti verificati · say/don't-say · **mappa persone** · obiezioni · run of show · biblioteca fonti. **Nessun dato contrattuale nel build.** Con `0c42beb` chiuso il buco della mappa persone: **Elvira Fabrizio = Head of Digital & IT Enilive** (verificata LinkedIn + bio The Innovation Group; 25+ anni ICT nel gruppo, board EGEM dal 2020 → tocca anche l'orbita trading). **Resta aperta l'intro da chiedere a Chessa** (P1 §10). Gotcha i18n: il **FR è confinato al dossier** — guard anti-flash + `astro:after-swap` degradano `fr→it` sulle pagine deck **senza sovrascrivere la preferenza salvata**.

### 24.3 Registrazioni & verifica
Registrata in: `deploy.yml` (merge + verify), factory-hub, showcase `experiences.ts`, `scripts/deck-audit.ts` (ROUTE_SET `eni-orbita`, 7 route). **NON seedata nella console Supabase** (manca `0008_seed_eni.sql` → P2 §10). `audit:deck` **0 hard** a 1920/1440/1280 (soft residue su cover ariose); verifica visiva screenshot in entrambe le lingue. Nota pro-futuro (NON implementato): esplorazione motion/Firefly per i deck in `docs/Eni/FIREFLY-DECK-EXPLORATION.md` (5 livelli L1–L5).

---

## 25. Core: responsive envelope, nav single-line & sweep visivo (21–22 lug 2026)

Tre interventi trasversali post-redesign, tutti a livello Factory (ereditati da ogni esperienza presente e futura).

### 25.1 Responsive envelope (`f09fca1`, core `DeckContainer`)
- **Tier cramped-laptop** (min-width 641, height 521–799px — browser in finestra o pannello 1366×768): reserve chrome alleggerita + l'overflow residuo **scrolla** invece di clippare (bug segnalato: timeline `/method/` Atelier tagliata sotto la piega). Il laptop è superficie di **preview**, mai target di proiezione.
- **Giant-TV/4K** alzato a **≥2560px** (frame più generoso, controlli più grandi, lettura a 4–8 m); controlli bottom con `env(safe-area-inset)` (home-indicator phone); floor tap-target per coarse pointer. Tutte le app deck: `viewport-fit=cover` nel meta viewport.
- **Regola in-code (vincolante)**: i **3 viewport di proiezione** certificati dall'audit (1280×800, 1440×900, 1920×1080) sono **deliberatamente intoccati** — li possiedono i `:root` per-app — così un miglioramento laptop/mobile/TV non può mai regredire il proiettore. Verifica: **audit parity identica before/after sui 6 deck** (atelier 39 · maxmara 35 · unicredit 173 · trenitalia 75 · ferrari 37 · agos 43 — totali incl. soft), typecheck 0, screenshot letti a 1366×768/1920/390×844/2560×1440.

### 25.2 Nav single-line su ogni esperienza (`7bd7511` + `d042105`)
Le pill di sezione andavano a capo ("01 The"/"method"). Fix su **tutte** le nav (6 deck + showcase + core Navigation Max Mara): pill `whitespace-nowrap`, rail `flex-nowrap + min-w-0 + overflow-x-auto` (scrollbar nascosta, scroll orizzontale grazioso), item `flex-shrink-0`. Con `d042105` anche il **right-cluster**: nowrap + `flex-shrink-0` su cluster e logo, label decorative "Live Pitch"/co-brand **nascoste sotto 2xl (1536px)**. Contratto in memoria `nav-single-line-contract` (verificare TUTTA la barra, non solo il rail). La nav Trenitalia è poi diventata **a 3 stati** con la biforcazione (§26).

### 25.3 Sweep visivo esaustivo (`d042105`, 22 lug)
**536 screenshot** — ogni slide dei 6 deck a 1920 e 1366 — letti uno a uno; ha trovato 3 bug di leggibilità che l'audit DOM non vede: card Max Mara loyalty "Dietro le quinte" **invisibile** (avorio su card chiara: `.mm-panel` batteva l'utility `bg-inverse` → surface scura forzata inline); pannelli Ferrari activate slavati su slide inverse (dato sfondo carbon + glow Rosso Corsa a `.act-frame`/`.act-results`); rail UniCredit a 12 voci con l'attivo fuori dal bordo destro sui laptop (ora auto-centra l'attivo). → Questo sweep + la parity di §25.1 **chiudono la voce P1** «rigirare audit + QC 1920 sui 6 deck» del 21 lug.

---

## 26. Biforcazione Connessioni Intelligenti — FS Park × Trenitalia (31 ago 2026)

Commit `0ec1259` (spec) → `954dde1` (fondamenta) → `5aaa5b0` (rami). Spec slide-per-slide: `docs/superpowers/specs/2026-08-31-biforcazione-fspark-trenitalia-design.md`. Memoria `trenitalia-connessioni` aggiornata. **I 13 vincoli LOCKED di §15.4 restano tutti validi** (contenuti migrati, mai regrediti).

### 26.1 Decisioni di design (dalle domande all'owner)
Audience = **stakeholder separati** (ogni ramo è un pitch a sé; l'intro è cornice di gruppo) · una sola app, **due sotto-alberi** · tronco = solo cover+scenario+bivio · dispositivo narrativo = **stesso viaggiatore, due metà** (Davide: FS Park lo vede dall'auto alla sbarra, Trenitalia dal binario in poi; ogni ramo racconta la sua metà + il suo punto cieco) · stessa pelle con **accent per ramo** (FS Park ambra "mondo-asfalto", Trenitalia rosso "mondo-binario") · **scheletro speculare a 5 capitoli con profondità asimmetrica** (slug identici nei due rami: `partenza · fondamenta · convergenza · meta-invisibile · percorso`).

### 26.2 Information architecture
```
/            cover (ritoccata: prefigurazione bivio; journey a 4 card)
/scenario/   NEUTRALIZZATO: email-gap RIMOSSA (→ ramo Trenitalia), touchpoint con
             chip proprietà (Trenitalia ×4 · FS Technology · FS Park), chiusa → /bivio/
/bivio/      NUOVA (2 slide): linea di Davide spezzata al centro + due porte-card
/fs-park/{partenza,fondamenta,convergenza,meta-invisibile,percorso}/
/trenitalia/{stessi 5 slug}/
vecchie route → stub redirect (_redirect.astro): fondazione→trenitalia/fondamenta,
convergenza→trenitalia/convergenza, connessioni→trenitalia/meta-invisibile,
roadmap|casi-duso→trenitalia/percorso (deep link preservati, query inclusa)
```
Catene frecce: tronco → bivio → fs-park (default, strategia "partire da FS Park" dal confronto 14/07); dentro ogni ramo lineare; prima/ultima pagina di ramo ↔ `/bivio/` (mai traboccare nell'altro ramo).

### 26.3 Ramo FS Park (27 slide, in gran parte nuove — fonte: trascrizione riunione 14/07 in docs/Ferrovie, git-ignored)
F1 Partenza (cover "La metà su asfalto" · Davide fino alla sbarra · ecosistema a righe impilate: sito con tracking limitato / area riservata in arrivo SENZA date / app già tracciate / CRM Salesforce, fonte "dal confronto di lavoro, luglio 2026" · identità frammentata · opportunità) · F2 Fondamenta = **identity reconciliation** (anonimo/autenticato · chiave: email hashata, Identity Graph, stitching, backfill, chiusa "da approfondire insieme" · XDM + source connector + riuso tagging · "Non rifare. Riconciliare.") · F3 Convergenza (gated `cja`: convergenza · CJA≠CDP · 3 use case prioritari: journey e2e, drop-off, conversion — "da validare sul campo" · demo/POC su dati simulati · adozione come servizio + AI Assistant) · F4 Metà invisibile (gated `data-collab`: punto cieco · clean room GDPR POV sosta · scenari intersocietari: ritardo→estensione sosta, cross-sell, churn condiviso · governance SENZA breach angle · "partire da FS Park, estendere al Gruppo") · F5 Percorso (POC · radar: rinnovi, ricorrenze→abbonamento, segmentazione auto/moto/bici, sorgenti, transazioni↔reclami · accompagnamento · orizzonte · sintesi). **Divieti specifici**: mai giudizi sull'autonomia del team FS Park (solo frame positivo); breach angle SOLO nel ramo Trenitalia; mai `bg="brand"` nel ramo (ambra come sfondo rompe il contrasto).

### 26.4 Ramo Trenitalia (30 slide, ereditate dalle vecchie sezioni + 3 nuove)
T1 Partenza (cover "La metà su rotaia" · Davide dal binario, metà sinistra tratteggiata "fuori campo" · **email-gap trasloccata INVARIATA** dal tronco con footnote Takeout · punto-cieco NUOVA · opportunità) · T2 Fondamenta (= fondazione.astro: ecosistema impilato, Salesforce, "Non sostituire. Connettere.") · T3 Convergenza (= convergenza.astro intera) · T4 Metà invisibile (= connessioni.astro: **GDPR e breach angle INVARIATI**) · T5 Percorso (= roadmap.astro con framing AJO verbatim + NUOVA slide-esplorare che condensa i 4 "Da esplorare" di casi-duso in righe full-width + sintesi con FS Park come **orizzonte, non prerequisito**).

### 26.5 Runtime branch-aware (BaseLayout) — 3 bug latenti fixati
1. **Slug composti**: `getCurrentPageSlug()`/`currentSlug()` ora tornano `fs-park/partenza` (prefisso ramo) — senza, i due rami collidevano su media-slot (`slotKey = slug:slideId`), custom slides e gating. AdminConsole regge slug con `/` (slotKey e attribute selector quotati).
2. **Gating a 3 catene** con path assoluti (la `base` è passata allo script): tronco `[home, scenario, bivio, fs-park/partenza]`; ramo `[bivio, 5 capitoli, bivio]` con gate `convergenza→cja`, `meta-invisibile→data-collab`, `percorso→rtcdp+ajo+mix-modeler` SOLO trenitalia (fs-park/percorso non gated). Sostituisce lo swap dell'ultimo segmento (rompeva sui path annidati).
3. **Redirect `pageSolutions`** riscritto sugli stessi path assoluti.
Prop `branch` → `data-branch` su `<html>`: `[data-branch="fs-park"]` override `--accent-primary`→ambra + texture `.fsp-stalli`/`.fsp-carreggiata`; porte del bivio `.fs-porta*`. **TreniNavigation a 3 stati**: tronco (rail Scenario·Bivio + porte ambra/rossa), ramo (chip "⇤ Bivio" + 5 capitoli, MAI l'altro ramo in barra). Admin: PAGE_REGISTRY a 3 gruppi (Tronco / F1–F5 / T1–T5), `appearsIn` aggiornati.

### 26.6 Verifica & gotcha
`scripts/deck-audit.ts` → **13 route** trenitalia; **0 failure HARD × 3 viewport** (~97 soft residui `a`/`i` motivati + 2 `g` pre-esistenti su home/fs-context e data-collab; storico era 165). `astro check` 0 errori. Screenshot 1920 letti di ogni slide nuova/cambiata (i 2 rami li hanno letti i subagent nei worktree; tronco+bivio letti nel main). **Gotcha preso**: in quest'app `bg="inverse"` è **CHIARO** — una slide scura richiede `SlideBackdrop` con scrim carbonio (bug su `slide-porte`: titolo bianco su fondo chiaro, fixato). Metodo: P1 fondamenta in main tree → **2 subagent in worktree isolati** (uno per ramo, porte preview diverse, audit ridotto alle proprie route) → integrazione + audit full nel main. I fix del tronco a 1280 (touchpoints `c`/`j`) sono stati risolti compattando spazi e note card, MAI riducendo il type.

### 26.7 Revisioni post-biforcazione (1 set 2026) — copy, obiezioni, connettori verificati, closer
Quattro round di feedback owner su screenshot (commit `4c0493e` → `d4a90d7` → `754de62` → `56a391f` → `d99254c`, tutti su `main`). Nuova memoria **`adobe-product-naming-2026`** (naming Adobe verificati via deep-research su fonti ufficiali).
- **Round 1 copy/UI (`4c0493e`)**: disclaimer cover "non commissionato da FS" → **"Un esercizio di visione firmato Adobe"** (rivendica la paternità Adobe invece di scusarsi); il racconto **NON è un "tronco comune"** ma **due racconti distinti e autoconsistenti che convergono sulla piattaforma** (riformulati cover/bivio/sintesi — FS non ha chiesto un racconto comune, è Adobe a proporne due convergenti); "piattaforma agentica Q1 2026" **attribuita** (FS Technology × Salesforce mar 2026 + link fsnews); "confronto di lavoro" → **"tavolo di lavoro FS Park × Adobe"** (parti esplicite); "dashboard" femminile; tolto il framing "buttare via" (spaventa il cliente); numeri inventati attenuati (+22%/€8-15 → esiti qualitativi "da misurare"); nodi `.fs-node` resi **opachi** (la linea non trapassa il glifo); griglia 6 touchpoint ad altezza uniforme.
- **Round 2 revisione iper-approfondita (`d4a90d7`, 3 revisori paralleli in sola lettura: copy/de-AI · narrativa+naming · a11y/token)**: **Elena RIMOSSA** ovunque — era **persona orfana** (in cover ma mai usata nella storia biforcata, tutta su Davide); cover ora solo Davide con linea che sfuma ambra→rosso. Errore grammaticale "Nessuno sistema"→**"Nessun sistema"**. De-AI: sciolti i tricolon/slogan più marcati ("Un viaggio. Due sguardi. Un'intelligenza." · "Ogni viaggio. Ogni parcheggio. Una relazione." · "Zero disruption" · "Privacy-first. Revenue-positive." · "day one/big bang"→italiano) e ridotta a 1 (sul bivio) la formula ripetuta ×4 "orizzonte, non un prerequisito". Tono ROI del ramo Trenitalia allineato al registro prudente di FS Park ("ROI MISURABILE"→"IMPATTO DA VALIDARE", revenue→ricavo/valore); **tolta l'accusa a Oracle Responsys** ("disiscrizioni alte" — mai sminuire il sistema del cliente). A11y: nav sub-label `/40`→`/70` e 0.6→0.72rem; badge owner 0.62rem(11px)→0.72rem; `color-mix()` su testo custom-slide → `rgba()` (contrasto misurabile dall'audit).
- **Round 3 obiezioni + connettori (`754de62`)**: **obiezione "abbiamo già Salesforce Data Cloud CDP, non serve CJA"** gestita esplicitamente nelle due slide di disambiguazione **CJA≠CDP** (la CDP attiva i profili, CJA legge il viaggio — complementari). **Linea che passava sopra cerchi/emoji risolta alla radice**: `.fs-line-h { z-index:-1 }` → la linea (position:absolute) sta **dietro** i nodi statici opachi, visibile solo negli spazi; verificato che resta visibile su linee orizzontali (cover, bivio, strip) e verticali (ecosistema). **Connettori AEP VERIFICATI su fonti Adobe** (non più supposti — vedi Fatti verificati sotto): corretti i claim "connettore nativo da Data Cloud" e "Responsys connettore AEP nativo (in ingestione)"; "connettore nativo" tenuto **solo per Salesforce CRM**. Tolto "fino a 611 email/anno a un singolo cliente" dalla card sistema in Fondamenta (non aveva senso lì; il 611 resta sulla slide email-gap con contesto Takeout/illustrativo) e rimosso "rollout graduale per superfici" (gergo) dalla card Coworker. **Due slide di chiusura "solo visual"** aggiunte a fine di **entrambi** i rami (closer atmosferico + lockup co-brand collegato dalla linea: ambra FS Park / rosso Trenitalia; `data-display`, airy → nuovi soft `a`/`i` intenzionali). Registrate in admin PAGE_REGISTRY (`slide-chiusura`).
- **Round 4 closer copy (`56a391f`→`d99254c`)**: il closer FS Park "Un cliente intero, a partire da casa" (goffo + ripeteva il titolo della sintesi precedente) → **"Ogni sosta, un cliente riconosciuto."** (lega il mondo sosta al payoff della riconciliazione identità). Trenitalia resta "Il viaggio, finalmente per intero." (coppia asimmetrica: cliente riconosciuto vs viaggio leggibile).
- **Naming prodotti aggiornati nel ramo Trenitalia**: **Adobe Mix Modeler → Adobe Marketing Campaign Analytics (ex Mix Modeler)** (id soluzione interno resta `mix-modeler` per non rompere gating/localStorage) — allineato a §5.3; slide adozione distingue **AI Assistant** (risponde) da **Adobe CX Enterprise Coworker** (esegue, GA giu 2026).
- **Fatti verificati (fonti Adobe ufficiali, 1 set 2026)** — memoria `adobe-product-naming-2026`:
  - **Salesforce Data Cloud → AEP**: **nessun connettore source nativo documentato**. AEP ha source nativi per Salesforce **CRM** e **Service Cloud**, non per Data Cloud → nel deck ora "i dati di Data Cloud confluiscono in AEP" (via MuleSoft/storage), non "connettore nativo".
  - **Oracle Responsys**: in AEP è una **destination** (ci si mandano le audience), **non** un source nativo; l'ingestione da Responsys è via **SFTP**. Il framing "AJO/RTCDP attiva SOPRA Responsys" (destination) resta corretto; erano sbagliati solo i claim di *ingestione* nativa.
  - **Clean room**: il deck usa "Adobe Data Collaboration"; le fonti Adobe 2025 puntano a **"Adobe Real-Time CDP Collaboration"** — claim rimasto *abstain* in ricerca (rate limit) → **NON rinominato**, da confermare sulla pagina live (P2 §10).
  - **CX Enterprise Coworker**: annuncio Adobe Summit 20/04/2026, **GA 10/06/2026**; è l'evoluzione agent-first di AI Assistant (esegue flussi su RTCDP/CJA/AJO, humans-in-the-loop). AI Assistant oggi risponde solo in inglese.

Verifica di tutti i round: `pnpm --filter trenitalia-connessioni build` verde; `audit:deck` **0 fallimenti HARD × 3 viewport** (soft `a`/`i` = baseline + le 2 nuove slide airy; un overflow transitorio su `slide-adozione` dopo l'aggiunta del pannello Coworker è stato corretto compattando i margini, MAI il type); screenshot 1920 letti di ogni slide toccata (linea, closer, obiezione CDP, connettori). Deck ora a **15 route** in `deck-audit.ts`? — no: le 2 slide di chiusura sono **slide interne** ai `percorso` esistenti (non nuove route), quindi le route restano 13.
