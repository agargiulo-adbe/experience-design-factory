# Handover — Parte 1 di 4
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 1. Cos'è e stato generale

Monorepo di una **Experience Design Factory**: un motore condiviso (`packages/core`) su cui ogni
**Experience Design** cliente è una *skin* (design token + contenuti + asset + config). Sopra, una
**Super Admin Console** (`apps/console`) per gestire esperienze e utenti.

Esperienze (cliente) — **sette**:
- **Generazioni — Max Mara** (`apps/generazioni-maxmara`, ora su `/generazioni-maxmara/`) · IT, quiet-luxury. Prima istanza. **Ora config-driven** (Admin Console + runtimes + `.cs-*`) come le altre (lug 2026).
- **Engagement Unlimited — UniCredit** (`apps/unicredit-engagement`) · IT · modello di contenuto più maturo (vedi §5).
- **Pole Position — Ferrari × Adobe** (`apps/ferrari-racing`) · EN/IT bilingue, motorsport. Include la sezione **/scoping** (calcolatore di licensing RTCDP Collaboration + CJA; **modello v3 §20** — solo standalone, **volumi senza prezzi** + costo per istanza editabile; niente più SKU base/entitlement) e la nuova sezione **Casi d'uso** (scenari E2E su tutto il perimetro prodotti). Commit `ff03a71`.
- **Connessioni Intelligenti — FS Group / Ferrovie** (`apps/trenitalia-connessioni`) · IT · **BIFORCATA il 31 ago 2026**: tronco (cover+scenario+bivio) + **due rami autoconsistenti** `/fs-park/*` e `/trenitalia/*` (5 capitoli speculari ciascuno, stesso viaggiatore Davide visto da due metà). Vedi **§26**; vincoli LOCKED in §15.4 (ancora validi).
- **Trait d'Union — Agos** (`apps/agos-trait-dunion`) · IT · credito al consumo (gruppo CA/BPM), 7 sezioni + home. Palette petrolio/acqua dal brand agos.it + Montserrat. Persona: **Elisa** (vedi §16).
- **Orbita — Eni** (`apps/eni-orbita`, **28 ago 2026**) · deck bilingue EN/IT (7 pagine) + **dossier war-room trilingue** `/dossier/` (noindex, fuori nav). Per il meeting col CIO Chessa del **10 set 2026**. Vedi **§24**.
- **«La voce del Ministero» (ex Alfabeti) — Ministero dell'Istruzione e del Merito (MIM)** (`apps/mim-alfabeti`, **2–4 set 2026**) · IT default + toggle EN, palette light istituzionale carta/blu + **Titillium Web**. Prima customer-facing (`acab255`, §28.1–3: 7 route, dossier `/dossier/?t=`). **Dal 4 set (`533ff5b`) RIDISEGNATO 100% sulla big idea B1** (comunicazione MIM al personale via AEP·RT-CDP·AJO·CJA) e **rinominato «La voce del Ministero»**, tarato sull'interlocutrice **DG Gianna Barbieri (DGSIS)** — rimosse le A-idee (IA/competenze/docs/Digital Academy). Backdrop e keyframe **generati con Adobe Firefly** (C2PA) + pagina **scroll-video** `/trasformazione/` (§28.5). Fonti cliccabili; `audit:deck`/UAT leggibilità ok. Registrata in console (`0010`). Vedi **§28**.

App interne (non-cliente):
- **Experience Atelier** (`apps/atelier`, `/atelier/`) · **primo deck trilingue EN/IT/FR**; è il **piano di crescita enterprise della Factory stessa** presentato come Exp Design (8 sezioni / 30 slide). Live 2026-07-17, ritoccato 2026-07-20 (de-celebrazione + Gantt roadmap + KPI scorecard, §21.5b). **Depubblicata dai listing pubblici il 2026-09-01** (`4cca945`: rimossa card showcase + tile hub; codice `apps/atelier` invariato e `/atelier/` ancora deployata/raggiungibile — vedi §21 e backlog §10). Dettaglio completo in **§21**; estensione i18n core + fix gating in **§22**. Contesto sponsorship interno **implicito** (mai dichiarato nel deck).
- **Factory Hub** (`apps/factory-hub`, **root del deploy** `/experience-design-factory/`) · landing neutra che linka direttamente le esperienze + Showcase + Console; serve anche gli stub di redirect dei vecchi deep-link maxmara root-level. Vedi §15.
- **Experience Design Factory — Showcase** (`apps/factory-showcase`, `/showcase/`) · sito **vetrina** bilingue EN/IT. **Non è un deck**: scroll-site. **Ora data-driven** da `src/data/experiences.ts` (conteggi/KPI/card si aggiornano da soli). **Dal 2026-09-01 mostra 5 card** (maxmara, unicredit, ferrari, trenitalia, agos — Atelier depubblicata; Orbita mai in vetrina). Dettaglio in §13.
- **Super Admin Console** (`apps/console`, `/console/`) — vedi §7. Le 4 esperienze sono registrate (Trenitalia inclusa).

Correlato: **skill di intake** `skills/experience-brief/` (Claude/ChatGPT/Copilot) che genera il brief per una nuova esperienza — vedi §13.4.

Solo capability Adobe pubbliche / materiale demo — **niente IP cliente riservata**, **niente imagery brand sbagliata** (Quality Bar in `CLAUDE.md`).

**Regola vincolante trasversale:** ogni slide-deck rispetta il **Type & legibility contract** in `CLAUDE.md` (type generoso, ink leggibile, composizione bilanciata, frecce avanti+indietro tra sezioni) — l'`audit:deck` NON garantisce la leggibilità, va verificata leggendo uno screenshot 1920. Vedi §8.

Stato build: `pnpm build` verde su tutto (core, console, hub, showcase, **8 app** esperienza incl. Atelier, Eni e Alfabeti — 11 pacchetti totali), `pnpm typecheck` verde. **CI `pnpm lint` di nuovo verde dal 1 set 2026** (`6c37210`): le 156 errors erano tutte `no-unused-expressions` nei due bundle minificati `modern-screenshot.umd.js` sotto `skills/impeccable/scripts/**` (tooling Claude Code vendored, non codice di progetto) → ignorati in `eslint.config.js`; restano solo warning non bloccanti; gli script `scripts/*.ts` restano lintati. `audit:deck` a **0 fallimenti hard** su tutti i deck (parity verificata sui 6 deck il 21–22 lug §25; Eni 0 hard alla creazione §24; Trenitalia rigirato full il 31 ago §26). Deploy automatico su push a `main`.

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
pnpm --filter mim-alfabeti video:build      # clip Firefly Video → public/media/ (ffmpeg scrub-encode) — ⚠️ Generate Video API è enterprise, oggi 403/404 (§29)
```
Nota: **factory-showcase non ha `audit:deck`** (non è un deck) né `assets:build` (asset statici in `public/`).

Deploy: **push su `main`** → GitHub Actions → Pages. Live es.
`https://agargiulo-adbe.github.io/experience-design-factory/unicredit-engagement/`.
Convenzione di lavoro (memoria `git-push-after-every-commit`): **commit + push dopo ogni commit**, per tenere locale e GitHub allineati (ogni push ridispiega).

---
## 4. Stato per esperienza

| Esperienza | Stato | Note |
|---|---|---|
| **«La voce del Ministero» (MIM)** | **Redesign 100% B1** (4 set, `533ff5b`): deck rifocalizzato sulla comunicazione MIM al personale (AEP·RT-CDP·AJO·CJA), rinominato, tarato su **DG Barbieri (DGSIS)**; rimosse le A-idee. **Imagery Firefly** (backdrop A+C + keyframe, C2PA) + pagina **scroll-video** `/trasformazione/`. Prima: customer re-arch + dossier `/dossier/?t=` (2–3 set). UAT leggibilità (programmatica) ok. | Vedi §28. Base `/mim-alfabeti/`. **Seedata in console** (`0010`). Seed dossier riservato git-ignored. **Video flythrough = P1 (AI-slop, da rifare)**; Firefly Video API enterprise in attesa. |
| **Orbita (Eni)** | **Nuova** (28 ago 2026): deck bilingue EN/IT 7 pagine + dossier war-room trilingue `/dossier/`. `audit:deck` 0 hard. **Meeting CIO Chessa 10 set 2026.** | Vedi §24. Design `.eo-*` giallo Eni/fumo/azzurro; Archivo+Inter. **Seedata in console** (`0010`, 2 set). |
| **Trait d'Union (Agos)** | **Nuova** (14 lug 2026); **refresh 2026-09-03**: intro **slide competitori** (Findomestic/Compass, fonti), **Orizzonte 5 "L'era agentica"** (Firefly/GenStudio/Agent Orchestrator), fix allineamenti (`text-left` su elenchi centrati) + 2 overflow HARD, «Next best offer»→**Next Best Experience**, roadmap Scalare a **fine 2027**, immagine Elisa italiana. `audit:deck` 0 hard. | Vedi §16. Palette petrolio/acqua dal brand agos.it + Montserrat. Persona: **Elisa** (prospect→cliente). |
| **Connessioni Intelligenti (Trenitalia/FS)** | **BIFORCATA** (31 ago 2026, §26); **rivista 1 set** (§26.7: copy/obiezione CDP/connettori verificati/2 closer visual). Tronco+`/bivio/` + rami autoconsistenti `/fs-park/*` (ambra, dal confronto 14/07) e `/trenitalia/*` (rosso, contenuti ereditati); vecchie route = redirect. `audit:deck` **0 hard** su 13 route × 3 viewport. | Vincoli LOCKED §15.4 sempre validi. Persona: **solo Davide** (Elena rimossa 1 set, era orfana) — NON Marco/Sofia (=UniCredit). |
| **Ferrari Racing** | Stabile + **sezione /scoping** (licensing 1:1 col workbook Adobe; **modello v3 §20** — solo standalone, volumi senza prezzi + costo per istanza editabile; niente SKU base/entitlement) + **sezione «Casi d'uso»** (§19). Save resiliente. **47 test core**. Product Mockup (Genstudio/Rtcdp/MockupSlide); CJAMockup/ExpressMockup pending. `audit:deck` 0 (incl. casi-duso). | Bilingue EN default. `prevHref` su tutte le pagine. |
| **UniCredit Engagement** | Stabile; modello di contenuto più maturo (5 round feedback). **15 lug 2026**: Adobe Brand Visibility + passata copy morbido/credibilità (§17.6). **2 set 2026**: **attribution al centro di «Analizza»** (+2 slide, riordino, sezione HARD-clean) + **Dossier Attribution** `/dossier/` login-gated (Supabase RLS, PDF) **+ unlisted secret-link** (`?t=<uuid>`, no login, revocabile, EN di default) + **deck ora bilingue IT/EN** (toggle, IT default, Ferrari-parity). Vedi **§27**. | `nextHref`+`prevHref` completi (gold standard). Deck bilingue `<T en it>`. |
| **Generazioni Max Mara** | **Ora config-driven** (Admin Console + runtimes + `.cs-*` retinted, lug 2026). Spostata su `/generazioni-maxmara/`. `audit:deck` 0. | `docs/AUDIT.md` elenca refinement copy non ancora applicati. Pagine funnel volutamente non gated (narrativa continua). |
| **Factory Hub** (root) | **Nuovo** (lug 2026): landing della Factory a `/experience-design-factory/`. | Vedi §15. Stub redirect per i vecchi deep-link maxmara. |
| **Factory Showcase** | **Live + data-driven** (`src/data/experiences.ts`). Aggiungere un'esperienza lì propaga card/conteggi/KPI ovunque. | Vedi §13. |
| **Console (Super Admin)** | Codice pronto; registry `experiences` popolato (Trenitalia via `0005`, Agos `0006`, Atelier `0007`, **mim-alfabeti + eni-orbita `0010`** 2 set) → tutte le card visibili. | Auth + registry. |

---
## 5. UniCredit Engagement — modello di contenuto (dettaglio)

`apps/unicredit-engagement`. **11 sezioni** (una pagina ciascuna) + home. Nav: HOME · SCENARIO · VISIBILITÀ · CONOSCI · ACQUISISCI · COINVOLGI · CONTENUTI · ANALIZZA · COWORKER · B2B · MOTORE · RISULTATI. Deck keynote, **bilingue IT/EN** (toggle in nav, IT default — dal 2 set 2026, §27.7), proiettato 1920×1080 e auto-responsive.

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

### 5.4 Struttura sezione **Contenuti** (7 slide, ordine)
`cover → problem → AI Agents in AEM → GenStudio → Brand Concierge → stack ("Crea, approva, distribuisci": GenStudio/Firefly/AEM Assets/**AEM Sites**) → **Adobe Firefly enterprise**` (chiude con il CTA → Analizza).
Gating: slide Firefly `data-solution="firefly"`; slide AEM Agents `data-solution="aem-sites,aem-assets"`; slide Brand Concierge `data-solution="brand-concierge"`.

### 5.5 Note per-sezione utili
- **Motore** (`motore-adobe.astro`) è **height-sensitive**: aggiungere chip/pill fa clippare il titolo centrato a 1280. Tieni **≤4 chip per layer** nello stack e la nuvola di pill **curata (~16)**.
- **Analizza** — la slide "LLM Insights + MCA" (id interno ancora `slide-llm-mix`). **Dal 2 set (§27)** l'attribution è il filo della sezione: +2 slide `slide-lasttouch` (last-touch cieco → vista complementare CJA) e `slide-costpersale` (cost-per-sale + MTA/MMM), registrate nel `PAGE_REGISTRY`; sezione ora **HARD-clean** su 1920/1440/1280 (bonificate anche cxa-brand/agent/banking/llm-mix — copy/densità, mai type sotto i minimi).
- **Risultati** — cifre presentate come proiezioni illustrative con label onesta.

---
## 6. Feature runtime del deck (tutte in UniCredit; molte in core)

- **Solution gating** (Admin): stato in `localStorage['edf-solutions-<slug>']` (array id attivi) + `?s=id1,id2`. In pagina: `data-solution` su slide/chip gated, `data-nav-solution` su nav/card, `pageSolutions` per pagina. Il runtime in `BaseLayout.astro` nasconde gli inattivi, toglie `data-slide` (così il deck non li conta), nasconde le nav e **riscrive `data-deck-next`/`data-deck-prev-href`** per saltare le sezioni spente.
- **Conteggio capitoli dinamico** (home): il titolo "Undici capitoli…" e le card della roadmap si **rinumerano** in base alle sezioni attive (script inline in `index.astro`, `data-edf-chapters` sul `<h2>`, `data-edf-journey-card`/`data-edf-cardnum` sulle card). Verificato: `?s=rtcdp` → "Sei capitoli", card `00–05` senza buchi.
- **Navigazione frecce bidirezionale tra sezioni** (core): `DeckContainer` prop `prevHref` (oltre a `nextHref`); `deck.ts` `exitBackward()` + flag `sessionStorage['edf:deck-enter-last']` fa aprire la sezione precedente sull'**ultima** slide. Gating-aware (riscrittura di `data-deck-prev-href`). SPA nav preserva il fullscreen.
- **Media reflow** (`BaseLayout.astro`, Case 2): quando si attaca media a una slide **senza** `data-demo-flex`, il contenuto **rifluisce a sinistra** e il media va a destra (niente più overlay sopra il testo). Ripristina il layout centrato alla disattivazione.
- **Media demo slot** (`MediaDemoSlot` in `data-demo-flex`): config in `localStorage['edf:media-slots:<slug>']`, condivisa via Supabase `media_configs` (`?cfg=<uuid>`).
- **Custom slides** (Admin): slide autoriali (testo/immagine/video) coerenti col deck; `localStorage['edf:custom-slides:<slug>']` + `window.__edfInjectCustomSlides` prima che il deck conti le slide; sanitizzate; stile `.cs-*` in `global.css`.
- **Responsive + fullscreen** (core, tutte le esperienze): override token safe-area scoped a `[data-deck]` per breakpoint (phone ≤640 con scroll denso, tablet, phone-landscape, **giant TV ≥2200**). Fullscreen su `document.documentElement`, persistente cross-sezione via SPA nav (`window.__edfNavigate`).
- **i18n**: `<T en=… it=… />` rende entrambe, CSS su `html[data-lang]` mostra l'attiva. Ferrari default EN; **UniCredit bilingue IT default + toggle EN** (dal 2 set, §27.7); Max Mara IT.

---
## 7. Admin Console

`@edf/core/blocks/admin/AdminConsole.astro` è **un solo engine**; ogni `src/pages/admin.astro` è un wrapper sottile che passa `projectSlug`, `projectName`, `pages` (PAGE_REGISTRY), `solutionGroups` (da `SOLUTIONS`), `deckHref`, env Supabase. Tre tab: **Sezioni** (accendi/spegni solution), **Media demo per slide** (+ link condivisibile), **Slide personalizzate**.
In UniCredit `admin.astro`: `PAGE_REGISTRY` elenca tutte le slide (aggiornato con AI Agents in AEM + Firefly in Contenuti); `SOLUTIONS` include ora **Brand Concierge**, **MCA** (id `mix-modeler`), Firefly/AEM Sites con `appearsIn: Contenuti`.
**Migliora l'engine una volta → tutte le esperienze lo ereditano** (verifica ognuna).

---
## 8. Deck visual contract & audit

Contratto e 12 check (a–l) **+ il Type & legibility contract (vincolante)** in `CLAUDE.md`. `pnpm --filter <app> audit:deck` gira su **1920/1440/1280** e misura bounding box → pass/fail.

> ⚠️ **LEZIONE CHIAVE (lug 2026):** `audit:deck` PASS **≠ leggibile**. L'audit misura solo testo **≥16px** (per band/coverage) e il contrasto — non la *generosità* del type né l'equilibrio della composizione. Su Trenitalia una remediation aveva rimpicciolito il body a 0.5–0.75rem *per far passare l'audit* → illeggibile in proiezione. Regola: dopo che l'audit è a 0, **leggi uno screenshot 1920 di ogni slide** e verifica type generoso (body ≥0.95rem) + composizione bilanciata. Dettaglio completo nel **Type & legibility contract** di `CLAUDE.md`.
>
> **L'audit va lanciato contro un PREVIEW statico** (il dev server con HMR blocca il `networkidle` di Playwright → timeout): `build` → `preview --port N` → `DECK_URL=http://localhost:N pnpm --filter <app> audit:deck`. Contrasto: il parser dell'audit **non legge `oklab()`/`color-mix()`** (li tratta come bianco → falso PASS su `h`) — usa `rgba()` esplicito per chrome/bottoni/card tintate.

**Stato attuale:** tutti e 4 i deck (maxmara, unicredit, ferrari, trenitalia) sono a **`audit:deck` 0 fallimenti** su 3 viewport (giri dedicati Ferrari 74→0 e Trenitalia 165→0, lug 2026). `scripts/deck-audit.ts` ha `ROUTE_SETS` per tutti e 4; maxmara usa le rotte `/generazioni-maxmara/…`.

**Aggiornamento 15 lug 2026:** aggiunta la route **`visibilita`** al `ROUTE_SET` unicredit di `deck-audit.ts` (prima non coperta). Poi **bonifica audit UniCredit** (§17.4): azzerati **tutti** i fallimenti HARD (`c` overflow/margini 22→0, `e` text-on-text 1→0, `j` clipping 7→0) su 14 slide/8 sezioni con fix meaning-preserving. Restano solo **soft** `a`/`i`/`g` (94/64/12, totale 200→170) su composizioni volutamente ariose/dense + il limite parser di `marco-moment`: **non** si forzano rimpicciolendo il type (contratto).

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
## 9. Deploy & segreti

- Repo pubblico `agargiulo-adbe/experience-design-factory`; Pages source = **GitHub Actions**.
- Build unisce i `dist`: **root = factory-hub** (landing); `/generazioni-maxmara/`, `/unicredit-engagement/`, `/ferrari-racing/`, `/trenitalia-connessioni/`, `/console/`, `/showcase/`. Ogni app: `base = /experience-design-factory[/<app>]`, `trailingSlash: 'always'`. Max Mara è passata da root a `/generazioni-maxmara/`; l'hub serve gli **stub di redirect** per i vecchi deep-link maxmara root-level (preservano `location.search`).
- Il job di deploy **ritenta** sui fallimenti transitori `syncing_files` di Pages e salta i commit stale.
- Env di build: `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` da **GitHub Actions secrets** (mai in repo). **Mai committare** `.env`/token/service_role.
- SQL remoto: `supabase db query --linked` (serve `supabase link` + login account agargiulo-adbe).

---
## 10. Pending / TODO / rischi noti (backlog prioritario)

> Ordinato per priorità (P0 blocca/adesso · P1 prossimo · P2 dopo/nice-to-have). Questa è la
> fonte di verità **persistente** delle cose da fare; `/handover` la mantiene e ne proietta le
> voci P0/P1 nella task list di sessione (effimera). Aggiornato 2026-09-04.

**P1 — prossimo**
- **[P1] MIM — rifare il video flythrough (troppo «AI slop»)** — area: `apps/mim-alfabeti` `/trasformazione/` (clip Firefly su GitHub Release tag `media`, `alfabeto-competenza.mp4`) · l'utente l'ha giudicato quasi AI-slop → **da rigenerare** (prompt/modello migliori, o via Generate Video API enterprise quando arriva, o clip più curato via Firefly web app «Piano A»). La pipeline scrub+swap è pronta: basta sostituire l'MP4 sul Release. Vedi §28.5/§29 (agg. 2026-09-04).
- **[P1] Firefly Generate Video API — entitlement enterprise** — **azione UMANA (Adobe Sales)** · l'«Audio & Video API» self-serve **non** include il text-to-video; il Generate Video (`generateVideoV3`) è enterprise. Diagnosi: credenziale ora valida (403003 risolto condividendo il progetto) ma `/v3/videos/generate` dà **404 corpo-vuoto** = modello non provisionato. **Accesso RICHIESTO dall'utente il 4 set**, in attesa. Appena arriva → `video:build` genera in automatico (codice pronto, §29) (agg. 2026-09-04).
- **[P1] Eni Orbita — prova finale pre-meeting Chessa (10 set 2026)** — area: `apps/eni-orbita` · **QC tecnico FATTO 1 set** (build verde; `audit:deck` 0 hard su 3 viewport — 23 soft `a`/`i` su cover ariose, type generoso confermato a 1920). **Restano azioni UMANE**: run-through live del deck+dossier prima del meeting; **intro a Elvira Fabrizio da chiedere a Chessa** (§24.2); review dossier confidenziale `docs/Eni/` (git-ignored, non apribile). Brief in `docs/Eni/BRIEF-MEETING-CHESSA-2026-09-10.md` (NON committare) (agg. 2026-09-01).
- **[P1] Accesso da VPN** — **azione UMANA** · le esperienze deployate (GitHub Pages, repo pubblico) sono raggiungibili dalla rete ufficio Adobe ma **bloccate su VPN** (categoria proxy/**Zscaler** su `*.github.io`). Ticket ServiceNow **INC3719631** (creato ~17 lug 2026, stato **In Progress**, assignment group **SD-Global**, assigned to **GOC ITP Integration**, priorità 3-Moderate, EMEA). **Follow-up postato il 2 set 2026** (commento customer-visible) chiedendo allowlist/sblocco per `https://agargiulo-adbe.github.io/experience-design-factory/` e `*.github.io`; **in attesa di riscontro IT**. Workaround demo = screen-share. Piano B (opt-in, non fatto) = redeploy su **Vercel** (agg. 2026-09-02).

**P1 — decisione/azione riservatezza**
- **[P1] Dossier UniCredit — seed riservato nel repo PUBBLICO** — area: `supabase/migrations/0008_restricted_docs.sql` · il seed committato contiene il contenuto confidenziale (mappa org con nomi + link LinkedIn, «dire/non-dire», dettagli Adobe Day) nel repo **pubblico**. Il dossier MIM è stato tenuto privato apposta (§28.2, git-ignored); UniCredit **no** → possibile esposizione pre-esistente. **Decisione utente**: applicare lo stesso trattamento (spostare il seed in `docs/UniCredit/…sql` git-ignored + nota tracciata; il contenuto resta comunque nella **git history** → valutare se basta o serve riscrivere la storia). Chiesto all'utente il 2026-09-03, in attesa (agg. 2026-09-03).

**P2 — dopo / nice-to-have**
- **[P2] MIM — UAT leggibilità VISIVA a vista** — area: `apps/mim-alfabeti` · il redesign B1 (4 set) è stato UAT-ato **solo per misura programmatica** (font/colori/overflow via Playwright) perché in quella sessione il budget-immagini bloccava la lettura degli screenshot. Rifare la UAT **leggendo gli screenshot 1920** (contratto: type generoso + composizione, testo su backdrop scrimati) in una sessione con immagini disponibili (agg. 2026-09-04).
- **[P2] Firefly imagery — propagare il pattern alle altre experience** — area: `scripts/build-assets.ts` (tipo slot `firefly`) + `packages/core/src/assets/types.ts` · il pattern imagery bespoke (concept + prompt, palette bloccata via prompt/grade) è validato solo su MIM; estendere alle altre experience (ognuna con la propria palette → nuovi prompt/manifest). Vedi §29 (agg. 2026-09-04).
- **[P2] Firefly — Fase 2 (demo generativa live runtime)** — non iniziata: proxy Supabase Edge Function che riusa `scripts/lib/firefly.ts` per generare dal vivo in demo. Vedi §29 (agg. 2026-09-04).
- **[P2] Dossier UniCredit — QC flusso login super-admin specifico** — area: `apps/unicredit-engagement/src/pages/dossier.astro` · il **render + i18n + contenuto sono già provati live** via lo **shared-link** (`?t=`, stesso `render()`); resta da esercitare in browser lo **specifico path login** (super admin `agargiulo@adobe.com`) + click **PDF** (`window.print`) e **LinkedIn**. Basso rischio (stesso codice di render). Vedi §27 (agg. 2026-09-02).
- **[P2] Loretta Del Monte — conferma identità/ruolo** — area: dossier UniCredit §27 · il profilo LinkedIn passato dall'owner (*Risk and full P&L analysis and support*, Bologna) **non combacia** col ruolo "costruzione mondo riconciliazione con Big Bang" emerso nel meeting → **possibile omonimia**, da confermare prima di usarla in contatti (agg. 2026-09-02).
- **[P2] Atelier — decidere se togliere `/atelier/` dal deploy build** — area: `.github/workflows/deploy.yml` (+ eventuale rimozione `apps/atelier` dal merge) · dopo la depubblicazione dai listing (1 set, `4cca945`) l'URL `/atelier/` **resta comunque raggiungibile** (l'app è ancora buildata/mergiata). Se «depubblicare» deve significare 404, escludere l'app dal build; oggi è solo **unlinked**. Decisione dell'utente (agg. 2026-09-01).
- **[P2] Trenitalia — verifica funzionale Admin sui rami** — area: `apps/trenitalia-connessioni` · dopo la biforcazione gli slug pagina sono composti (`fs-park/partenza`…): verificati per ispezione (slotKey/attributi AdminConsole ok) ma **non testati in browser** media-slot/custom-slides su una pagina di ramo (da verificare) (agg. 2026-09-01).
- **[P2] Nome ufficiale clean room Adobe (da verificare)** — area: `apps/trenitalia-connessioni` (+ eventuale propagazione) · il deck usa "Adobe Data Collaboration"; le fonti Adobe 2025 puntano a **"Adobe Real-Time CDP Collaboration"** — verifica in ricerca rimasta *abstain* (rate limit) → confermare sulla pagina live prima di rinominare. Memoria `adobe-product-naming-2026` (agg. 2026-09-01).
- **[P2] Max Mara `docs/AUDIT.md`** — refinement diagnosticati (copy datato 2025→2030, scala tipografica a token, doppio `<h1>`, ecc.) **non applicati**; bloccato su validazione copy.
- **[P2] Ferrari — CJAMockup / ExpressMockup** — mancano (memoria `product-mockup-engine`); prima di toccare i mockup leggi `mockup-navigation-patterns`.
- **[P2] Pass credibilità/fonti sulle altre esperienze** — solo UniCredit ha il pass credibilità/fonti; estendere a maxmara/ferrari/trenitalia/agos/atelier dove serve.
- **[P2] Asset — dedup volti tra esperienze** — al prossimo `assets:build` controllare che le foto persona non si ripetano tra app (la foto Trenitalia era identica a UniCredit → rigenerata, lug 2026). Memoria `asset-pipeline-pending-generation`.
- **[P2] Cosmetico** — la `description` meta di `coworker.astro` cita ancora "CX Enterprise Coworker" (non visibile in slide; allineabile a "Coworker").
- **[P2] Boardroom Quest (workstream futuro)** — nel deck Atelier è "in design" (teaser); il gioco vero (PixiJS+inkjs, multiplayer) non è costruito ed è fuori scope del deck. Gate brand/legal Adobe prima di qualsiasi workshop ufficiale. Vedi §21.5.
- **[P2] Atelier — trattamento grafico ulteriore** — area: `apps/atelier` · proposto (non fatto): rendere più diagrammatiche anche `slide-market`/`slide-precedent` (multiplication) e `slide-model` ("come uno diventa cinquanta"), oggi card di testo; valutare una micro-visualizzazione per la genesis-timeline (method). Nice-to-have coerente con la passata di sintesi grafica del 20 lug (agg. 2026-07-20).
- **[P2] Lint warnings Agos BaseLayout** — area: `apps/agos-trait-dunion/src/layouts/BaseLayout.astro` · warning non bloccanti emersi in CI (`var`→`let/const` righe ~45/48/50, `_` unused righe ~58/59). La CI passa comunque (sono warning, non errori); pulizia cosmetica (agg. 2026-07-20).

**Note / rischi non azionabili (contesto, non todo)**
- **CI vs Deploy (due workflow distinti)** — ogni push lancia **`CI`** (`.github/workflows/ci.yml`: install→typecheck→lint→build→`content-audit.ts`) **e** **`Deploy to GitHub Pages`** (`deploy.yml`). Sono indipendenti: il deploy può essere verde mentre CI è rossa (fu il caso fino a `5fc362e`; ricapitato dopo il redesign — §23.2 — e dal 28 ago su lint tooling, **risanato il 1 set con `6c37210`**, vedi change log §11). ⚠️ **`pnpm build` NON è il gate del CI**: `astro build` non fa il type-check completo e non linta → un redesign può avere `build` verde ma `typecheck`/`lint` rossi. **Prima di pushare, girare `pnpm typecheck` E `pnpm lint`, non solo `pnpm build`** (§23.2). `content-audit.ts` applica 4 regole statiche (stat su >2 pagine; stessa stat con label diverse; **frase ≥8 parole ripetuta 2× per pagina**; mashup bilingue en==it) su tutti gli `apps/*/dist` — tienile a mente quando duplichi copy tra data app-specifici e componenti core.
- **Supabase** — migrations applicate al DB remoto: `0001`–`0003` + `0004_scenarios.sql` + `0005_hub_registry.sql` + `0006_seed_agos.sql` + `0007_seed_atelier.sql` (Atelier `live`) + **`0008_restricted_docs.sql`** (tabella `restricted_docs` + RLS + seed Dossier Attribution UniCredit; §27) + **`0009_restricted_doc_share.sql`** (colonna `share_token` + RPC `get_shared_doc` SECURITY DEFINER; §27.7) + **`0010_seed_mim.sql`** (registry `experiences`: mim-alfabeti + eni-orbita; 2 set; §28.3). **Fuori dai `migrations/` tracciati** (repo pubblico) il seed del **dossier MIM** — `docs/Ministero dell'Istruzione/0011_seed_mim_dossier.sql` (git-ignored, applicato out-of-band; nota tracciata `supabase/migrations/0011_mim_dossier.README.md`; §28.2). ⚠️ **Il dossier UniCredit (`0008`) ha invece il contenuto committato nel repo pubblico — possibile esposizione pre-esistente da valutare.** Se ricrei il progetto, riesegui in ordine (`supabase/README.md`). Memoria `super-admin-console`.
- **deck-audit** — tutti i deck a **0 hard**. NON reintrodurre micro-type per "far tornare i conti": il Type & legibility contract vince sempre.
- **Showcase — sync copie skill**: `apps/factory-showcase/public/skill/*` sono **copie** di `skills/experience-brief/` (source of truth); se la modifichi, ri-copia i file e rigenera lo `.zip` (§13.4).
- **Showcase — Firefly "in valutazione"**: la card roadmap Firefly è *Under evaluation*, non un impegno. Non promettere date.
- **Ferrari /scoping** — v3 standalone-only/costo-per-istanza (`ff03a71`, §20) committato; memoria `ferrari-scoping-calculator` a v3. `docs/Ferrovie/`·`docs/Ferrari/`·`docs/Agos/` in `.gitignore` (repo pubblico).

---
