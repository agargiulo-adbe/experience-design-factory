# Handover — Parte 1 di 6
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 1. Cos'è e stato generale

Monorepo di una **Experience Design Factory**: un motore condiviso (`packages/core`) su cui ogni
**Experience Design** cliente è una *skin* (design token + contenuti + asset + config). Sopra, una
**Super Admin Console** (`apps/console`) per gestire esperienze e utenti.

Esperienze (cliente) — **otto**:
- **Generazioni — Max Mara** (`apps/generazioni-maxmara`, ora su `/generazioni-maxmara/`) · IT, quiet-luxury. Prima istanza. **Ora config-driven** (Admin Console + runtimes + `.cs-*`) come le altre (lug 2026).
- **Engagement Unlimited — UniCredit** (`apps/unicredit-engagement`) · **bilingue IT/EN** · modello di contenuto più maturo (vedi §5). **Dal 7 set 2026 riconfigurato come «workshop cut»**: customer story a **6 capitoli** che apre il workshop Adobe × Accenture × UniCredit, single-persona **Marco**, + 3 backdrop **Firefly** (§5.6). **9 set 2026 (sera)**: home cover con **clip Firefly Video** in loop, cover di tutti i capitoli **uniformi** (`UcCover`), **storia di Marco a 6 slide-momento** (backdrop Firefly + mock UI), **Analizza ricucita** sull'attribution, engine-map a tessere, **slide di chiusura** con clip (§5.5/§5.7).
- **Pole Position — Ferrari × Adobe** (`apps/ferrari-racing`) · EN/IT bilingue, motorsport. Include la sezione **/scoping** (calcolatore di licensing RTCDP Collaboration + CJA; **modello v3 §20** — solo standalone, **volumi senza prezzi** + costo per istanza editabile; niente più SKU base/entitlement) e la nuova sezione **Casi d'uso** (scenari E2E su tutto il perimetro prodotti). Commit `ff03a71`.
- **Connessioni Intelligenti — FS Group / Ferrovie** (`apps/trenitalia-connessioni`) · IT · **BIFORCATA il 31 ago 2026**: tronco (cover+scenario+bivio) + **due rami autoconsistenti** `/fs-park/*` e `/trenitalia/*` (5 capitoli speculari ciascuno, stesso viaggiatore Davide visto da due metà). Vedi **§26**; vincoli LOCKED in §15.4 (ancora validi). **Dall'8 set 2026** ospita anche la **pagina `/dossier/`** (noindex, fuori nav): war-room interna per l'**Adobe Day con FSTechnology** (referente Maurizio Giampaolo, DBP Trasporto) — vedi **§26.8** e backlog §10.
- **Trait d'Union — Agos** (`apps/agos-trait-dunion`) · IT · credito al consumo (gruppo CA/BPM), 7 sezioni + home. Palette petrolio/acqua dal brand agos.it + Montserrat. Persona: **Elisa** (vedi §16).
- **Orbita — Eni** (`apps/eni-orbita`, **28 ago 2026**) · deck bilingue EN/IT (7 pagine) + **dossier war-room trilingue** `/dossier/` (noindex, fuori nav). Per il meeting col CIO Chessa del **10 set 2026**. Vedi **§24**.
- **«La voce del Ministero» (ex Alfabeti) — Ministero dell'Istruzione e del Merito (MIM)** (`apps/mim-alfabeti`, **2–4 set 2026**) · IT default + toggle EN, palette light istituzionale carta/blu + **Titillium Web**. Prima customer-facing (`acab255`, §28.1–3: 7 route, dossier `/dossier/?t=`). **Dal 4 set (`533ff5b`) RIDISEGNATO 100% sulla big idea B1** (comunicazione MIM al personale via AEP·RT-CDP·AJO·CJA) e **rinominato «La voce del Ministero»**, tarato sull'interlocutrice **DG Gianna Barbieri (DGSIS)** — rimosse le A-idee (IA/competenze/docs/Digital Academy). Backdrop **generati con Adobe Firefly** (C2PA). **Dal 7 set (`3fd2d9a`→`af499f7`) ARRICCHITO** (§28.6): nuova sezione **`/storia`** (persona docente **Giulia**, dati verificati) → **8 sezioni** pubbliche; imagery **non-letterform** (23 backdrop distinti per-slide via `--bg-src`); **ogni fonte con link diretto**; journey difendibile su privacy; motion; **pagina `/trasformazione` rimossa**. `audit:deck` 0 hard + **UAT visiva completa**. **Dal 9 set (§28.7) evoluzione UI/UX post-critique: 18 slide, Giulia prima della proposta, grafico «La scala», notte di luglio a 3 battute, journey builder interattivo, 3 clip Firefly Video, identità blu Italia, modalità leggibilità, vista `/presenter/` con note e timer.** Registrata in console (`0010`). Vedi **§28**.
- **«Il momento giusto» — Isybank (Intesa Sanpaolo)** (`apps/isybank-momento`, **9 set 2026**) · deck IT (3 capitoli, 6 idee gated) + **dossier war-room gated** `/dossier/?t=` (contenuto su Supabase, pattern MIM) per l'incontro con l'AD **Valitutti del 10 set 2026**. **Regola BINDING (9 set): ogni dossier = pagina gated come MIM, mai inline.** Dati contrattuali solo in `docs/Intesa Sanpaolo/` (git-ignored). Vedi **§31** (HANDOVER-06).

App interne (non-cliente):
- **Aperture — Osservatorio email** (`apps/aperture-email`, `/aperture-email/`, **8 set 2026**) · deck **bilingue IT/EN** di **ricerca individuale** (non cliente): tracciamento/consenso nelle email dei brand letto da una casella reale (27.273 msg, 11.339 email di brand, 554 mittenti), 7 pagine / 31 slide, metodologia + fonti (Garante 17 apr 2026, CNIL 14 apr 2026, EDPB 2/2023, Google sender guidelines, RFC 8058, Litmus). Capitoli 05 (FSI) e 06 (implicazioni) gatati da console (`fsi`, `design`). **Registrata solo in hub + deploy + audit** (NON in showcase/atelier: non è un'esperienza cliente e falserebbe i KPI). Pipeline dati esterna al repo: `~/Documents/progetti/garante_analysis/`. Vedi **§30**.
- **Experience Atelier** (`apps/atelier`, `/atelier/`) · **primo deck trilingue EN/IT/FR**; è il **piano di crescita enterprise della Factory stessa** presentato come Exp Design (8 sezioni / 30 slide). Live 2026-07-17, ritoccato 2026-07-20 (§21.5b) e **rifatto l'8 set 2026 dopo una critique iper-critica (§21.6: piano ridatato M1 dic 2026/M2 Summit mar 2027/M3 giu 2027, 7 experience, muro a screenshot, decisione esplicita, Gantt+KPI numerici, sponsor cut `?s=asks`)**. **Depubblicata dai listing pubblici il 2026-09-01** (`4cca945`: rimossa card showcase + tile hub; codice `apps/atelier` invariato e `/atelier/` ancora deployata/raggiungibile — vedi §21 e backlog §10). Dettaglio completo in **§21**; estensione i18n core + fix gating in **§22**. Contesto sponsorship interno **implicito** (mai dichiarato nel deck).
- **Factory Hub** (`apps/factory-hub`, **root del deploy** `/experience-design-factory/`) · landing neutra che linka direttamente le esperienze + Showcase + Console; serve anche gli stub di redirect dei vecchi deep-link maxmara root-level. Vedi §15.
- **Experience Design Factory — Showcase** (`apps/factory-showcase`, `/showcase/`) · sito **vetrina** bilingue EN/IT. **Non è un deck**: scroll-site. **Ora data-driven** da `src/data/experiences.ts` (conteggi/KPI/card si aggiornano da soli). **Dal 2026-09-01 mostra 5 card** (maxmara, unicredit, ferrari, trenitalia, agos — Atelier depubblicata; Orbita mai in vetrina). Dettaglio in §13.
- **Super Admin Console** (`apps/console`, `/console/`) — vedi §7. Le 4 esperienze sono registrate (Trenitalia inclusa).

Correlato: **skill di intake** `skills/experience-brief/` (Claude/ChatGPT/Copilot) che genera il brief per una nuova esperienza — vedi §13.4.

Solo capability Adobe pubbliche / materiale demo — **niente IP cliente riservata**, **niente imagery brand sbagliata** (Quality Bar in `CLAUDE.md`).

**Regola vincolante trasversale:** ogni slide-deck rispetta il **Type & legibility contract** in `CLAUDE.md` (type generoso, ink leggibile, composizione bilanciata, frecce avanti+indietro tra sezioni) — l'`audit:deck` NON garantisce la leggibilità, va verificata leggendo uno screenshot 1920. Vedi §8.

Stato build: `pnpm build` verde su tutto (core, console, hub, showcase, **9 app** deck incl. Atelier, Eni, Alfabeti e **Aperture** — 12 pacchetti totali), `pnpm typecheck` verde (**CI verde su `c269c29`**, 8 set: fixato un errore TS latente in `unicredit-engagement/index.astro` che teneva rossa la CI dal workshop cut). **CI `pnpm lint` di nuovo verde dal 1 set 2026** (`6c37210`): le 156 errors erano tutte `no-unused-expressions` nei due bundle minificati `modern-screenshot.umd.js` sotto `skills/impeccable/scripts/**` (tooling Claude Code vendored, non codice di progetto) → ignorati in `eslint.config.js`; restano solo warning non bloccanti; gli script `scripts/*.ts` restano lintati. `audit:deck` a **0 fallimenti hard** su tutti i deck (parity verificata sui 6 deck il 21–22 lug §25; Eni 0 hard alla creazione §24; Trenitalia rigirato full il 31 ago §26). Deploy automatico su push a `main`.

**Redesign «eccellenza» E2E (21 lug 2026, live in `main`):** tutti e **6 i deck** (5 cliente + Atelier) hanno un design-system brand-native `.xx-*` nel loro `global.css` e sono stati ricostruiti sezione-per-sezione con **copy/claim/numeri/fonti/personas verbatim**. Dettaglio, concept per esperienza e fix tecnici in **§23**.

---
## 2. Architettura

- `packages/core` (`@edf/core`, alias in-app `@edf/core/...`) — motore condiviso:
  - `blocks/immersive/` — **deck keynote**: `DeckContainer.astro`, `Slide.astro`, `deck.ts` (controller), `SlideBackdrop`, `MediaSlot`, `MediaDemoSlot`, `animations.ts`.
  - `blocks/CoverHero.astro` — grammatica cover condivisa.
  - `blocks/admin/AdminConsole.astro` — **engine Admin condiviso** (config-driven; migliora una volta → propaga a tutte).
  - `blocks/i18n/` — `T.astro` (rende EN+IT, CSS mostra la lingua attiva) + `LangToggle.astro`.
- `apps/<exp>/` — ogni esperienza: pagine Astro statiche, `src/layouts/BaseLayout.astro`, `src/styles/global.css` (token contract), `assets.index.ts`/`assets.manifest.ts`, `src/pages/admin.astro` (wrapper sottile sull'engine).
- `apps/console` — Super Admin (Supabase Auth, users, registry esperienze).
- `apps/factory-showcase` — **scroll-site vetrina** (NON deck). Riusa dal core SOLO `blocks/i18n/T.astro` + `LangToggle.astro` + `utils/url.ts` (`href`); ha un proprio `global.css` con token Adobe. 2 pagine: `index.astro` + `blueprint.astro`. Dettaglio in §13.
- `supabase/` — `migrations/` (schema+seed), `functions/invite-user/` (Edge Function), `README.md` (setup una-tantum).
- `skills/` — `experience-design/SKILL.md` (come si **costruisce** un'esperienza) + `experience-brief/` (skill di **intake** condivisibile → brief; vedi §13.4).
- `.github/workflows/deploy.yml` — build+merge dist di ogni app in un unico artifact → GitHub Pages (Node 22). Merge: **root=factory-hub** + `/generazioni-maxmara/` + `/unicredit-engagement/` + `/ferrari-racing/` + `/trenitalia-connessioni/` + `/console/` + `/showcase/`; lo step "Verify" controlla gli index + uno stub di redirect.

**Sorgenti autorevoli** (in `docs/`, non committate se pesanti): i `.pptx` Adobe (es. `Summit 2026 Analytics Track MEGA DECK.pptx`) sono la **fonte di verità** per nomi/prodotti. Per leggerli: `unzip -q "<file>.pptx" 'ppt/slides/*.xml'` e strip dei tag `<a:t>` (vedi §5.4 per un esempio già usato).

---
## 3. Comandi

```bash
pnpm dev                                   # dev server default
pnpm build                                 # build TUTTE le app (verifica ognuna)
pnpm lint · pnpm typecheck
pnpm --filter <app> dev|build|preview      # per app: generazioni-maxmara | unicredit-engagement | ferrari-racing | trenitalia-connessioni | console | factory-showcase | factory-hub
pnpm dev:showcase                          # alias per il solo showcase (root package.json)
pnpm --filter <app> audit:deck             # gate DOM su 3 viewport (1920/1440/1280) — lanciare contro un PREVIEW statico (vedi §8)
pnpm --filter @agargiulo-adbe/experience-core test   # 47 test del blocco scoping (cost-model/scenario/scenario-store, Vitest)
pnpm --filter <app> assets:build           # immagini → src/assets/generated/: tipo slot stock=Pexels · firefly=Adobe Firefly (FIREFLY_CLIENT_ID/SECRET in .env) · aigen=FLUX locale (§29)
pnpm --filter mim-alfabeti video:build      # clip Firefly Video → public/media/ (ffmpeg scrub-encode) — FUNZIONA dal 8 set (header x-model-version; serve un video.manifest.ts) (§29)
```
Nota: **factory-showcase non ha `audit:deck`** (non è un deck) né `assets:build` (asset statici in `public/`).

Deploy: **push su `main`** → GitHub Actions → Pages. Live es.
`https://agargiulo-adbe.github.io/experience-design-factory/unicredit-engagement/`.
Convenzione di lavoro (memoria `git-push-after-every-commit`): **commit + push dopo ogni commit**, per tenere locale e GitHub allineati (ogni push ridispiega).

---
## 4. Stato per esperienza

| Esperienza | Stato | Note |
|---|---|---|
| **«La voce del Ministero» (MIM)** | **Evoluto 9 set** (§28.7: **18 slide**, Giulia prima della proposta, grafico «La scala», notte a 3 battute, journey builder, 3 clip Firefly Video, identità blu Italia, leggibilità «Aa», `/presenter/` con note/timer/cut 15'; 0 HARD, zero scroll a 1366). Prima: **arricchito 7 set** (`3fd2d9a`→`af499f7`, §28.6): **8 sezioni** con nuova **`/storia`** (persona **Giulia** docente, journey RT-CDP+AJO difendibile su privacy); imagery **non-letterform** (23 backdrop per-slide via `--bg-src`); **fonti con link diretti**; motion; `/trasformazione` **rimossa**. Prima: redesign 100% B1 (4 set) + customer re-arch/dossier (2–3 set). `audit:deck` 0 hard + **UAT visiva completa**. | Vedi §28. Base `/mim-alfabeti/`. **Seedata in console** (`0010`). Seed dossier riservato git-ignored. |
| **Orbita (Eni)** | **Nuova** (28 ago 2026): deck bilingue EN/IT 7 pagine + dossier war-room trilingue `/dossier/`. `audit:deck` 0 hard. **Meeting CIO Chessa 10 set 2026.** | Vedi §24. Design `.eo-*` giallo Eni/fumo/azzurro; Archivo+Inter. **Seedata in console** (`0010`, 2 set). |
| **Trait d'Union (Agos)** | **Nuova** (14 lug 2026); **refresh 2026-09-03**: intro **slide competitori** (Findomestic/Compass, fonti), **Orizzonte 5 "L'era agentica"** (Firefly/GenStudio/Agent Orchestrator), fix allineamenti (`text-left` su elenchi centrati) + 2 overflow HARD, «Next best offer»→**Next Best Experience**, roadmap Scalare a **fine 2027**, immagine Elisa italiana. `audit:deck` 0 hard. | Vedi §16. Palette petrolio/acqua dal brand agos.it + Montserrat. Persona: **Elisa** (prospect→cliente). |
| **Connessioni Intelligenti (Trenitalia/FS)** | **BIFORCATA** (31 ago 2026, §26); **rivista 1 set** (§26.7: copy/obiezione CDP/connettori verificati/2 closer visual). Tronco+`/bivio/` + rami autoconsistenti `/fs-park/*` (ambra, dal confronto 14/07) e `/trenitalia/*` (rosso, contenuti ereditati); vecchie route = redirect. `audit:deck` **0 hard** su 13 route × 3 viewport. | Vincoli LOCKED §15.4 sempre validi. Persona: **solo Davide** (Elena rimossa 1 set, era orfana) — NON Marco/Sofia (=UniCredit). |
| **Ferrari Racing** | Stabile + **sezione /scoping** (licensing 1:1 col workbook Adobe; **modello v3 §20** — solo standalone, volumi senza prezzi + costo per istanza editabile; niente SKU base/entitlement) + **sezione «Casi d'uso»** (§19). Save resiliente. **47 test core**. Product Mockup (Genstudio/Rtcdp/MockupSlide); CJAMockup/ExpressMockup pending. `audit:deck` 0 (incl. casi-duso). | Bilingue EN default. `prevHref` su tutte le pagine. |
| **UniCredit Engagement** | **«Workshop cut» 7 set** (§5.6) + **passata completa 9 set sera** (§5.7): 6 capitoli in flow (Scenario 11 slide con **storia di Marco a 6 momenti** · Il Sito 7 · Contenuti 4 · Analizza 9 «Chi ha portato Marco al mutuo?» · Coworker 6 · Risultati 6 con **chiusura**), single-persona **Marco**, cover uniformi `UcCover`, **clip Firefly Video** in home e chiusura (Release `media`), 10 backdrop Firefly. Sezioni funnel fuori-flow ma su disco. `audit:deck` **0 HARD** su home+6 sezioni × 3 viewport (9 set). **Live/deploiato** (`a305c43`). | `nextHref`+`prevHref` completi. Deck bilingue `<T en it>`. Firefly: `ff-engine-map`/`ff-il-sito`/`ff-contenuti`/`ff-scenario-cover`/`ff-story-01…05`/`ff-story-genstudio` + video `uc-cover`/`uc-close`. |
| **Generazioni Max Mara** | **Ora config-driven** (Admin Console + runtimes + `.cs-*` retinted, lug 2026). Spostata su `/generazioni-maxmara/`. `audit:deck` 0. | `docs/AUDIT.md` elenca refinement copy non ancora applicati. Pagine funnel volutamente non gated (narrativa continua). |
| **Factory Hub** (root) | **Nuovo** (lug 2026): landing della Factory a `/experience-design-factory/`. | Vedi §15. Stub redirect per i vecchi deep-link maxmara. |
| **Factory Showcase** | **Live + data-driven** (`src/data/experiences.ts`). Aggiungere un'esperienza lì propaga card/conteggi/KPI ovunque. | Vedi §13. |
| **«Il momento giusto» (Isybank)** | **Nuova 9 set** (§31): deck IT 3 capitoli + 6 idee gated + `/dossier/?t=` gated (Supabase); `.im-*` blu/menta/arancio; **pom. 9 set: fonti verificate su ogni slide, richieste → 4 domande aperte, 17 sfondi + 2 clip Firefly (§31.4)**; `audit:deck` 0 HARD (23 soft accettate); 17 slide lette a 1920. | Base `/isybank-momento/`. **Seedata in console** (`0012`) + dossier gated (secret-link) seedato out-of-band. Brief riservato git-ignored. |
| **Console (Super Admin)** | Codice pronto; registry `experiences` popolato (Trenitalia via `0005`, Agos `0006`, Atelier `0007`, **mim-alfabeti + eni-orbita `0010`** 2 set) → tutte le card visibili. | Auth + registry. |

---
## 5. UniCredit Engagement — modello di contenuto (dettaglio)

`apps/unicredit-engagement`. Le **11 sezioni** storiche (una pagina ciascuna) + home esistono ancora **su disco**, ma **dal 7 set 2026 il deck di default è il «workshop cut» a 6 capitoli** (§5.6): quanto sotto (personas, naming, convenzioni copy) resta la fonte di verità del modello di contenuto; §5.6 spiega cosa è in flow oggi. Deck keynote, **bilingue IT/EN** (toggle in nav, IT default — dal 2 set 2026, §27.7), proiettato 1920×1080 e auto-responsive.

### 5.1 Personas (LOCKED — non regredire)
- **Marco Ferretti** → **B2C**, *mutuo prima casa*. 38 anni, cliente storico UniCredit (12 anni), Brescia, famiglia. Scoperta via ricerca AI (ChatGPT). **Mai** PMI/commerciale/€800K/imprenditore.
- **Sofia Ricci** → **B2C** digital-native. 27, UX Designer freelance, Milano. Scoperta via **reel ads** Instagram; apre primo conto da mobile. Prodotti: conto + carta + **piano di risparmio** (NON mutuo prima casa — quello è di Marco).
- **Adriana Conti** → **unica** persona **B2B**, CFO PMI manifatturiera. Introdotta **solo** in `b2b.astro`, che è **auto-consistente** (nessuna dipendenza da Marco/Sofia).

### 5.2 Convenzioni copy / credibilità (LOCKED)
- Base clienti: **nessuna cifra precisa nel deck** (passata 15 lug, §17.6) — *"milioni di clienti / i milioni di profili"* invece di "14M" (numero non verificabile senza fonte → tono più morbido, es. *"il profilo… spesso resta parziale"* invece di *"…ancora non esiste"*). Restano gli **obiettivi di piano** UniCredit Unlimited nella home (>€5,5B in tech/digitale/dati, €11B+ utile, >20% RoTE — target pubblici con **link**, press UniCredit Unlimited feb 2026; il €5,5B è il nesso con "tech & AI abilitatori").
- Sempre "**reel ads**", mai "reel".
- Fonti con **data + link** dove flaggato; **rimosse** citazioni inventate (niente "UCX Programme", niente "Banca d'Italia" su slide non pertinenti, niente "6+ sistemi separati"). Numeri modellati etichettati onestamente come *"proiezione/scenario illustrativo"*.
- Niente specifici roboanti/non verificabili (no "approvato in 3 giorni", no "8 minuti" di durata, no ripetizioni di +34%/40%). Imperativi rivolti allo spettatore ammorbiditi (es. "Segui la loro storia" → dichiarativo); i **verbi-sezione** (Conosci/Acquisisci/…) e i CTA a bottone restano.

### 5.3 Naming prodotti Adobe — **verificato vs `docs/Summit 2026 Analytics Track MEGA DECK.pptx`**
- Umbrella analytics = **Adobe CX Analytics**. Pilastri: CJA, Adobe Analytics, **Marketing Campaign Analytics (MCA)**, Content Analytics, CJA B2B, LLM Insights.
  - **MCA (non "Mix Modeler")** è l'annuncio di punta Summit 2026 (causal AI, full-funnel, agentic). Il toggle admin è stato **rinominato MCA mantenendo l'id `mix-modeler`** (per non rompere gating/config salvate).
  - **Data Insights Agent (DIA)** è **attuale e potenziato** (Root Cause Analysis, Proactive Insights, Business Semantics). Non è superato.
  - "**Customer & Group Journeys**" è un pilastro reale (whole-person + buying-group).
- Fondazione = **AEP + Adobe AI Platform** (agents/skill/tools/MCP).
- **Brand Concierge** = **AI conversazionale rivolta al cliente** (su AEP Agent Orchestrator, grounded su dati first-party, multimodale, multi-agente). **NON** un "guardiano di brand compliance". È un toggle in Admin (gata la sua slide in Contenuti).
- **Coworker**: citarlo semplicemente come "**Coworker**" (nome reale esteso: Adobe CX Enterprise Coworker). **Niente** moduli inventati "Chat/Campaigns/Projects" né "SCHEMA ILLUSTRATIVO".
- **AEM Agents** (Contenuti): Content Advisor, Site Optimization (Sites Optimizer), Governance, Brand Experience — AEM CS + Edge Delivery.
- **Firefly enterprise** (Contenuti): Firefly **Services (API)**, **Custom Models**, **Foundry** (modelli proprietari deeply-tuned, multimodali).

### 5.4 Struttura sezione **Contenuti** (4 slide, dal 9 set 2026)
`cover → problem → GenStudio → Brand Concierge`. La slide **AI Agents in AEM** vive ora in **Il Sito** (dopo Edge Delivery, `data-solution="aem-sites,aem-assets"`); Firefly-as-product fuori dal 7 set. Gating: slide Brand Concierge `data-solution="brand-concierge"`. Nessuna citazione di Sofia (single-persona Marco).

### 5.5 Note per-sezione utili
- **Motore** (`motore-adobe.astro`) è **height-sensitive**: aggiungere chip/pill fa clippare il titolo centrato a 1280. Tieni **≤4 chip per layer** nello stack e la nuvola di pill **curata (~16)**.
- **Analizza** — **dal 9 set 2026 un solo racconto** «Chi ha portato Marco al mutuo?» (9 slide): `cover → slide-journey (CJA, 8 touchpoint) → slide-lasttouch → slide-agent (DIA) → slide-llm (LLM Insights, fusa con la vecchia llm-mix) → slide-costpersale → slide-campaign (MCA) → slide-cxa-brand («Tutto questo è Adobe CX Analytics») → slide-everywhere (MCP/Copilot + CTA Coworker)`. Rimosse `slide-banking` e `slide-llm-mix`. Sezione **HARD-clean** su 1920/1440/1280. MediaDemoSlot: `analizza-cxa-demo` (journey) e `analizza-dia-demo` (agent).
- **Risultati** — cifre presentate come proiezioni illustrative con label onesta.

### 5.6 «Workshop cut» (7 set 2026, `ddb3650` + fix `9c3bd24`/`e45d5e5`) — STATO ATTUALE del deck
Il deck è stato riconfigurato come la **«Customer story» che apre il workshop Adobe × Accenture × UniCredit** (draft `docs/UniCredit/20260907_Unicredit_Workshop_DRAFT.pptx`, slide 3 = "Antonio super web presentation"). Deve **innescare** i 6 motori demo-ati dopo ("the engine behind the story"): CMS (AEM Sites+EDS+AEM Agents) · Content optimization (Brand Visibility+Sites Optimizer) · Brand Concierge · GenStudio · CJA+agents · CX Enterprise Coworker.
- **Nav + `SECTION_FLOW` ridotti a 6**: Scenario → Il Sito (`visibilita`) → Contenuti → Analizza → Coworker → Risultati. Le sezioni funnel (`conosci`/`acquisisci`/`coinvolgi`/`b2b`/`motore-adobe`) **restano come file** ma sono **fuori** da flow/nav/`PAGE_REGISTRY`/counter home (riattivabili). `SECTION_FLOW` in `BaseLayout.astro` = i 6, tutti `gate:null`.
- **Scelte utente**: single protagonist **Marco** (Sofia rimossa da scenario/home/risultati/coworker; personas §5.1 restano definite); **MCA (Marketing Campaign Analytics) tenuto** in Analizza; **B2B fuori**; Firefly-as-product e stack Firefly **tolti** da Contenuti (Firefly torna solo come *tool*, sotto).
- Nuova slide **`slide-engine-map`** in Scenario = mappa dei 6 motori con puntatore al capitolo di demo. Handoff cross-sezione e naming allineati **verbatim** al deck; numerazione cover coerente **00–05**. `PAGE_REGISTRY` (admin) sfrondato ai 6.
- **Backdrop Adobe Firefly** on-brand (art, C2PA): `ff-engine-map` (engine-map), `ff-il-sito` (cover visibilita), `ff-contenuti` (slide genstudio) — generati via pipeline repo `scripts/lib/firefly.ts` con **`FIREFLY_CLIENT_ID/SECRET` in `apps/unicredit-engagement/.env`** (gitignored, copiate da `mim-alfabeti`). Gotcha: l'MCP Adobe **non genera** immagini; ogni `assets:build --manifest <subset>` **riscrive `provenance.json`** coi soli slot processati → fare merge (`git show HEAD:…provenance.json` + jq). Memoria `unicredit-workshop-cut`.
- Verifica: `audit:deck` **0 nuovi HARD** (residui c/j a 1280/1440 su aem-agents/brand-concierge pre-esistenti; puliti a 1920). Merge #1, deploiato, nav live = 6 capitoli.

### 5.7 Deck 9 set sera — 6 momenti, cover uniformi, video, chiusura (`4d179ee`)
- **Scenario = 11 slide**: cover (UcCover + backdrop Firefly `ff-scenario-cover`, skyline Porta Nuova) → trend → gap (4 card **uguali**, `auto-rows-fr`+`h-full`) → persona → **`slide-story-01…06`** (Il Sito · Contenuti·GenStudio · Contenuti·Brand Concierge · Analizza · Coworker · Risultati; backdrop Firefly `ff-story-*` senza volti + mock UI `.uc-mock*`; dati `marcoMoments[]`) → engine-map (6 card **uniformi**: «Per Marco» + «Dentro UniCredit» su tutte, link al cap. 01). **Slide «promessa» rimossa** (ridondante dopo la mappa).
- **`UcCover.astro`** (+ `src/data/chapters.ts`): copertina unica dei 6 capitoli — rail 00–05, eyebrow, titolo, lead, chip «In questo capitolo»; stili `.uc-cover-*`. Sostituisce `CoverHero` ovunque.
- **Video Firefly** (`video.manifest.ts`, `pnpm --filter unicredit-engagement video:build`): `uc-cover` (home, filo oro + nodo rosso su blu notte) e `uc-close` (chiusura, 6 nodi). MP4 sul Release **`media`** (git-ignored), poster in `public/media/`. Pattern `.uc-video-poster` + `<video class="uc-video">` + `.uc-video-scrim` (CSS in `global.css`, reduced-motion nasconde il clip).
- **Risultati**: nuova **`slide-close`** (un cliente, sei motori, una piattaforma + ordine demo + credit Firefly); «Marco non è un personaggio» spostata qui. Coworker cover = ponte da Analizza.
- Copy: «UniCredit lo vede intero» → «vede tutto il percorso» (utente: «intero suona di un cliente fatto a fette»).
- Gotcha audit: l'audit legge `--slide-safe-inset` da `:root` (80px) → a 1280×800 il contenuto deve stare in 640px.

---
