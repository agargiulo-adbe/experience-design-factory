# Handover — Parte 1 di 3
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 1. Cos'è e stato generale

Monorepo di una **Experience Design Factory**: un motore condiviso (`packages/core`) su cui ogni
**Experience Design** cliente è una *skin* (design token + contenuti + asset + config). Sopra, una
**Super Admin Console** (`apps/console`) per gestire esperienze e utenti.

Esperienze (cliente) — **quattro**:
- **Generazioni — Max Mara** (`apps/generazioni-maxmara`, ora su `/generazioni-maxmara/`) · IT, quiet-luxury. Prima istanza. **Ora config-driven** (Admin Console + runtimes + `.cs-*`) come le altre (lug 2026).
- **Engagement Unlimited — UniCredit** (`apps/unicredit-engagement`) · IT · modello di contenuto più maturo (vedi §5).
- **Pole Position — Ferrari × Adobe** (`apps/ferrari-racing`) · EN/IT bilingue, motorsport. Include la sezione **/scoping** (calcolatore di licensing RTCDP Collaboration + CJA; **modello v3 §20** — solo standalone, **volumi senza prezzi** + costo per istanza editabile; niente più SKU base/entitlement) e la nuova sezione **Casi d'uso** (scenari E2E su tutto il perimetro prodotti). Commit `ff03a71`.
- **Connessioni Intelligenti — FS Group / Ferrovie** (`apps/trenitalia-connessioni`) · IT · 6 sezioni + Casi d'uso. **Oggetto del lavoro recente** (vedi §15).

App interne (non-cliente):
- **Experience Atelier** (`apps/atelier`, `/atelier/`) · **primo deck trilingue EN/IT/FR**; è il **piano di crescita enterprise della Factory stessa** presentato come Exp Design (8 sezioni / 30 slide). Live 2026-07-17, ritoccato 2026-07-20 (de-celebrazione + Gantt roadmap + KPI scorecard, §21.5b). Dettaglio completo in **§21**; estensione i18n core + fix gating in **§22**. Contesto sponsorship interno **implicito** (mai dichiarato nel deck).
- **Factory Hub** (`apps/factory-hub`, **root del deploy** `/experience-design-factory/`) · landing neutra che linka direttamente le esperienze + Showcase + Console; serve anche gli stub di redirect dei vecchi deep-link maxmara root-level. Vedi §15.
- **Experience Design Factory — Showcase** (`apps/factory-showcase`, `/showcase/`) · sito **vetrina** bilingue EN/IT. **Non è un deck**: scroll-site. **Ora data-driven** da `src/data/experiences.ts` (conteggi/KPI/card si aggiornano da soli). Dettaglio in §13.
- **Super Admin Console** (`apps/console`, `/console/`) — vedi §7. Le 4 esperienze sono registrate (Trenitalia inclusa).

Correlato: **skill di intake** `skills/experience-brief/` (Claude/ChatGPT/Copilot) che genera il brief per una nuova esperienza — vedi §13.4.

Solo capability Adobe pubbliche / materiale demo — **niente IP cliente riservata**, **niente imagery brand sbagliata** (Quality Bar in `CLAUDE.md`).

**Regola vincolante trasversale:** ogni slide-deck rispetta il **Type & legibility contract** in `CLAUDE.md` (type generoso, ink leggibile, composizione bilanciata, frecce avanti+indietro tra sezioni) — l'`audit:deck` NON garantisce la leggibilità, va verificata leggendo uno screenshot 1920. Vedi §8.

Stato build: `pnpm build` verde su tutto (core, console, hub, showcase, **5 app** esperienza incl. Atelier). `audit:deck` a **0 fallimenti hard** su tutti i deck (Atelier: solo soft `i` su slide volutamente ariose, whitelisted — §21). Deploy automatico su push a `main`.

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
pnpm --filter <app> assets:build           # fetch/grade asset Pexels → src/assets/generated/ (+ PEXELS_API_KEY in .env)
```
Nota: **factory-showcase non ha `audit:deck`** (non è un deck) né `assets:build` (asset statici in `public/`).

Deploy: **push su `main`** → GitHub Actions → Pages. Live es.
`https://agargiulo-adbe.github.io/experience-design-factory/unicredit-engagement/`.
Convenzione di lavoro (memoria `git-push-after-every-commit`): **commit + push dopo ogni commit**, per tenere locale e GitHub allineati (ogni push ridispiega).

---
## 4. Stato per esperienza

| Esperienza | Stato | Note |
|---|---|---|
| **Trait d'Union (Agos)** | **Nuova** (14 lug 2026): 7 sezioni + home, live pitch per Agos (credito al consumo, gruppo CA/BPM). `audit:deck` 0 su 3 viewport; tutte le slide verificate a 1920. | Vedi §16. Palette petrolio/acqua dal brand agos.it + Montserrat. Persona: **Elisa** (prospect→cliente). |
| **Connessioni Intelligenti (Trenitalia/FS)** | **Attivamente rilavorata** (lug 2026): personas rinominate, foto persona rigenerata, **passata di leggibilità completa** (type generoso, ecosistema impilato). `audit:deck` 0. | Vedi §15. Ultimo focus di lavoro. Personas: **Davide** (pendolare) + **Elena** (business) — NON Marco/Sofia (=UniCredit). |
| **Ferrari Racing** | Stabile + **sezione /scoping** (licensing 1:1 col workbook Adobe; **modello v3 §20** — solo standalone, volumi senza prezzi + costo per istanza editabile; niente SKU base/entitlement) + **sezione «Casi d'uso»** (§19). Save resiliente. **47 test core**. Product Mockup (Genstudio/Rtcdp/MockupSlide); CJAMockup/ExpressMockup pending. `audit:deck` 0 (incl. casi-duso). | Bilingue EN default. `prevHref` su tutte le pagine. |
| **UniCredit Engagement** | Stabile; modello di contenuto più maturo (5 round feedback). **15 lug 2026**: LLMO+Semrush consolidati in **Adobe Brand Visibility** (§17); de-AI copy; **passata copy morbido/credibilità** (§17.6: cifre→qualitativo, KPI→direzione ↑/↓, Next-Best-Experience, obiezione acquisition, fix doppio-quote). Vedi §5. | `nextHref`+`prevHref` completi (gold standard). |
| **Generazioni Max Mara** | **Ora config-driven** (Admin Console + runtimes + `.cs-*` retinted, lug 2026). Spostata su `/generazioni-maxmara/`. `audit:deck` 0. | `docs/AUDIT.md` elenca refinement copy non ancora applicati. Pagine funnel volutamente non gated (narrativa continua). |
| **Factory Hub** (root) | **Nuovo** (lug 2026): landing della Factory a `/experience-design-factory/`. | Vedi §15. Stub redirect per i vecchi deep-link maxmara. |
| **Factory Showcase** | **Live + data-driven** (`src/data/experiences.ts`). Aggiungere un'esperienza lì propaga card/conteggi/KPI ovunque. | Vedi §13. |
| **Console (Super Admin)** | Codice pronto; 4 esperienze registrate (Trenitalia inclusa via `0005_hub_registry.sql`, applicata al DB remoto lug 2026). | Auth + registry. |

---
## 5. UniCredit Engagement — modello di contenuto (dettaglio)

`apps/unicredit-engagement`. **11 sezioni** (una pagina ciascuna) + home. Nav: HOME · SCENARIO · VISIBILITÀ · CONOSCI · ACQUISISCI · COINVOLGI · CONTENUTI · ANALIZZA · COWORKER · B2B · MOTORE · RISULTATI. Deck keynote, IT, proiettato 1920×1080 e auto-responsive.

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
- **Analizza** — la slide "LLM Insights + MCA" (id interno ancora `slide-llm-mix`).
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
- **i18n**: `<T en=… it=… />` rende entrambe, CSS su `html[data-lang]` mostra l'attiva. Ferrari default EN; Max Mara/UniCredit IT.

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
> voci P0/P1 nella task list di sessione (effimera). Aggiornato 2026-07-20.

**P0 — nessuna voce aperta.** (build verde, `audit:deck` 0 hard su tutti i deck, deploy ok.)

**P1 — prossimo**
- **[P1] Accesso da VPN** — area: deploy/operativo · le esperienze deployate (GitHub Pages, repo pubblico) sono raggiungibili dalla rete ufficio Adobe ma **bloccate su VPN** (categoria proxy/**Zscaler** su `*.github.io`). **Ticket IT aperto (17 lug 2026), in attesa di riscontro** → follow-up sul ticket. Workaround demo = screen-share. Piano B (opt-in, non fatto) = redeploy su **Vercel** (`*.vercel.app`; richiede rework `base` path + env Supabase). NON è un bug del build.
- **[P1] Showcase — a11y/Lighthouse pass** — area: `apps/factory-showcase` · verificare contrasto testi grigi su fondo chiaro, focus order, `prefers-reduced-motion`, per **certificare lo standard che la pagina dichiara** (oggi non certificato).

**P2 — dopo / nice-to-have**
- **[P2] Max Mara `docs/AUDIT.md`** — refinement diagnosticati (copy datato 2025→2030, scala tipografica a token, doppio `<h1>`, ecc.) **non applicati**; bloccato su validazione copy.
- **[P2] Ferrari — CJAMockup / ExpressMockup** — mancano (memoria `product-mockup-engine`); prima di toccare i mockup leggi `mockup-navigation-patterns`.
- **[P2] Pass credibilità/fonti sulle altre esperienze** — solo UniCredit ha il pass credibilità/fonti; estendere a maxmara/ferrari/trenitalia/agos/atelier dove serve.
- **[P2] Asset — dedup volti tra esperienze** — al prossimo `assets:build` controllare che le foto persona non si ripetano tra app (la foto Trenitalia era identica a UniCredit → rigenerata, lug 2026). Memoria `asset-pipeline-pending-generation`.
- **[P2] Cosmetico** — la `description` meta di `coworker.astro` cita ancora "CX Enterprise Coworker" (non visibile in slide; allineabile a "Coworker").
- **[P2] Boardroom Quest (workstream futuro)** — nel deck Atelier è "in design" (teaser); il gioco vero (PixiJS+inkjs, multiplayer) non è costruito ed è fuori scope del deck. Gate brand/legal Adobe prima di qualsiasi workshop ufficiale. Vedi §21.5.
- **[P2] Atelier — trattamento grafico ulteriore** — area: `apps/atelier` · proposto (non fatto): rendere più diagrammatiche anche `slide-market`/`slide-precedent` (multiplication) e `slide-model` ("come uno diventa cinquanta"), oggi card di testo; valutare una micro-visualizzazione per la genesis-timeline (method). Nice-to-have coerente con la passata di sintesi grafica del 20 lug (agg. 2026-07-20).
- **[P2] Lint warnings Agos BaseLayout** — area: `apps/agos-trait-dunion/src/layouts/BaseLayout.astro` · warning non bloccanti emersi in CI (`var`→`let/const` righe ~45/48/50, `_` unused righe ~58/59). La CI passa comunque (sono warning, non errori); pulizia cosmetica (agg. 2026-07-20).

**Note / rischi non azionabili (contesto, non todo)**
- **CI vs Deploy (due workflow distinti)** — ogni push lancia **`CI`** (`.github/workflows/ci.yml`: install→typecheck→lint→build→`content-audit.ts`) **e** **`Deploy to GitHub Pages`** (`deploy.yml`). Sono indipendenti: il deploy può essere verde mentre CI è rossa (fu il caso fino a `5fc362e`). **CI ora verde.** `content-audit.ts` applica 4 regole statiche (stat su >2 pagine; stessa stat con label diverse; **frase ≥8 parole ripetuta 2× per pagina**; mashup bilingue en==it) su tutti gli `apps/*/dist` — tienile a mente quando duplichi copy tra data app-specifici e componenti core.
- **Supabase** — migrations applicate al DB remoto: `0001`–`0003` + `0004_scenarios.sql` + `0005_hub_registry.sql` + `0006_seed_agos.sql` + `0007_seed_atelier.sql` (Atelier `live`). Se ricrei il progetto, riesegui in ordine (`supabase/README.md`). Memoria `super-admin-console`.
- **deck-audit** — tutti i deck a **0 hard**. NON reintrodurre micro-type per "far tornare i conti": il Type & legibility contract vince sempre.
- **Showcase — sync copie skill**: `apps/factory-showcase/public/skill/*` sono **copie** di `skills/experience-brief/` (source of truth); se la modifichi, ri-copia i file e rigenera lo `.zip` (§13.4).
- **Showcase — Firefly "in valutazione"**: la card roadmap Firefly è *Under evaluation*, non un impegno. Non promettere date.
- **Ferrari /scoping** — v3 standalone-only/costo-per-istanza (`ff03a71`, §20) committato; memoria `ferrari-scoping-calculator` a v3. `docs/Ferrovie/`·`docs/Ferrari/`·`docs/Agos/` in `.gitignore` (repo pubblico).

---
## 11. Change log recente (UniCredit, lug 2026)

### Change log — Agos: deck «casi d'uso evolutivi AEP» (PPTX, fuori repo) (20 lug 2026)
- Prodotto **`docs/Agos/Agos_x_Adobe_Casi_uso_evolutivi_AEP.pptx`** — deck **24 slide IT su template Adobe** (rosso Adobe + accenti petrolio/acqua Agos), generato con **python-pptx** (PowerPoint nativo/editabile), NON un'app del monorepo. Contenuto: recap "cosa Adobe ha compreso" (profilo Agos con numeri di discovery ~9M/~5M/~3,7M/~80 use case, as-is Campaign v7 + Analytics + DWH Oracle/SAS-Matrix, contesto trasformazione set–ott 2027, **5 attriti**: dato di ritorno assente, dato rigido, offerte fuori, misura frammentata, canali non parlanti) + **9 casi d'uso evolutivi su AEP** (AJO/RTCDP/CJA: chiudere il loop caricata/liquidata, recupero abbandoni form TIG, transazione negata→journey, next-best-offer, inbound/outbound orchestrati, churn proattivo, agenti conversazionali, FAC su Snowflake, contenuti on-brand + link SMS) + roadmap Crawl/Walk/Run + next steps. Fonti: doc di discovery in `docs/Agos/` (sessioni, CVM, architettura) + librerie casi d'uso Adobe (Journey Optimizer / FSI / Retail Banking POV) in `docs/Agos/*.pptx`. **Non committato** (`docs/Agos/` in `.gitignore`); reso in PNG e verificato slide-per-slide (0 overflow). Non tocca app/build. Generatore usa-e-getta in `/tmp` (non nel repo). Distinto dal deck web `apps/agos-trait-dunion` (§16).

### Change log — Atelier redesign + fix CI (20 lug 2026, dal più recente)
- `5fc362e` **fix CI cronico** (non era in backlog: scoperto ora). Il workflow **`CI`** (separato da `Deploy to GitHub Pages`) falliva da CI #90 sullo step `npx tsx scripts/content-audit.ts`, **regola (c)** (nessuna frase ≥8 parole ripetuta 2× nella stessa pagina buildata). Root cause su Ferrari `/scoping/`: `METRICS[0].what.it` (`apps/ferrari-racing/src/data/scoping.ts`) e `badgeCollab.it` (`packages/core/.../ScopingCalculator.astro`) rendevano la **stessa prima frase IT verbatim**, mentre in EN divergevano (`what.en` "burned" vs `badge.en` "consumed"); `what.it` era anche **incoerente col proprio EN**. Fix alla sorgente: `what.it` "consumato" → **"bruciato"** (mirror di "burned") — rompe la ripetizione **e** corregge la deriva EN/IT; nessun tocco al core condiviso. Verificato: typecheck+lint+build+`content-audit PASS`; **run CI di `5fc362e` = success (verde)**. (c49e7db/f4caf92 restano rossi in storia perché pushati prima del fix.)
- `f4caf92`+`c49e7db` **Atelier — passata de-celebrazione + sintesi grafica** (dettaglio §21.5b). Copy de-celebrato trilingue (meaning-preserving, ±10%): tolti brag/staccato/tricolon/tetracolon ("Weeks per experience. Not quarters.", "Enterprise-grade… this deck is one of them", "deepest content model in the family", "this demo is real", "in Adobe hands", "Touching it beats both", "prove the craft"). **Nuova `slide-roadmap`** (Gantt: 5 workstream × 3 milestone + riga key-moments) + **`slide-kpi`** da 4 righe → **scorecard 2×2** con metric-pill. Registrata in `PAGE_REGISTRY` (plan ora 6 slide / deck 30). Audit **0 hard**; nuovi soft `a`/`i` su roadmap+kpi **whitelisted** (screenshot 1920 letti: type generoso, composizione bilanciata; parità altezza EN/IT/FR a 1280).

### Change log — Experience Atelier (17 lug 2026, dal più recente) → dettaglio in §21–§22
- `e296cb5` registry Atelier → `live` (seed migration `0007` allineata). URL deployati 200, hub linka atelier.
- `56a7808` **fix gating SPA propagato a tutte le 6 esperienze**: il runtime di solution-gating ora si ri-applica su `astro:after-swap`, non solo al full load (prima le slide gated riapparivano dopo nav cross-sezione SPA). Vedi §22 + memoria `spa-gating-reapply`.
- `e4e88ba` Atelier admin wrapper (PAGE_REGISTRY 27 slide, SOLUTIONS `asks`+`quest`); `d5bc6d0` pagine wave-2 (frontiers/plan/asks/closing); `c9fb186` **core `T` inoltra attributi extra (`data-reveal` ecc.)**; `1f9c018` pagine wave-1 (overture/method/capability/multiplication); `abbc71b` asset atmosferici; `13cb5e6` wiring monorepo; `d7854af` scaffold trilingue; `47bce98`+`2bbd988` **estensione i18n core `fr` opzionale** (retrocompatibile). Ricerca comparabili verificata: `79c5908` (`docs/superpowers/research/2026-07-17-atelier-comparables.md`). Spec+piano: `25ab7aa`/`6d3e8f7`/`717a453`.

### Change log — UniCredit (lug 2026, dal più recente)

Dal più recente:
- `aabd2d1` **Passata copy morbido/credibilità** (§17.6): cifre non verificabili → qualitativo (14M→"milioni", 289M→"milioni di prompt"); **numeri di risultato inventati → direzione ↑/↓** in tutte le sezioni (tenuti i benchmark di banche reali citate, le ricerche esterne linkate, i target pubblici e le meccaniche di scenario); **Next-Best-Action → Next-Best-Experience**; copy obiezione "acquisition vs clienti noti" sulla slide di Marco; fix doppio `""` in Coinvolgi. Build + `audit:deck` 0 hard + screenshot 1920 verificati.
- `310e045` fix analytics naming + Coworker semplificato (verificato vs MEGA DECK): MCA↔Mix Modeler, DIA attuale, Customer&Group Journeys chiarito, Coworker senza moduli finti; Motore rigenerato (AEM Sites Optimizer, Brand Concierge, MCA, AI Platform) + fix clipping.
- `b8bd78c` Contenuti: AEM Sites nello stack + nuove slide **AI Agents in AEM** e **Firefly enterprise** (ricerca online); fix contrasto WCAG link su slide inverse.
- `aa26cd1` Round 2: numeri-obiettivo di piano; "6+ sistemi" → qualitativo; imperativi ammorbiditi; Social Ads + layout simmetrico; "why Adobe" su Acquisisci; **rinumerazione dinamica card**; chip allineati; **nav frecce bidirezionale**; Brand Concierge in Admin.
- `c6385e4` Conteggio capitoli dinamico + media reflow (niente overlap testo).
- `2da455b` Restructure personas (Marco B2C / Adriana B2B) + pass copy & credibilità (14M, reel ads, fonti datate+link, +34%/40% de-dup).

Metodo seguito ogni round: fonti reali via ricerca web / MEGA DECK; build + `audit:deck` con confronto baseline via stash; commit + push.

### Change log — Hub · Parity · Ferrari scoping · Trenitalia (13–14 lug 2026, dal più recente)
- **Ferrari /scoping — evoluzione motore (DoD-complete)** (14 lug 2026, vedi §14). ⚠️ **SUPERATO il 15 lug** dalla riscrittura Adobe-fedele (§18): il modello funnel qui descritto (distinct→overlap→activated/measured, allotment, activation mode) **non è più quello in produzione**. Contenuto storico: il calcolatore diventa strumento trasparente/configurabile/auditabile. Nuovo motore con **funnel audience** (distinct→overlap→activated/measured) + 5 variabili decisionali (**overlap/match rate, refresh cadence, managed base, activation mode, measurement model**); **guardrail anti doppio-conteggio** on-demand vs recurring; `computeBreakdown()` con formula+numeri sostituiti per riga + sorgenti CJA con peso% + warnings. `FIELD_AUDIT` esteso (dataType semantico→badge, select+options, `appliesWhen` condizionale, `advancedOnly`, `impacts`). UI: preset chip, strip warnings, breakdown drawer per prodotto, disclosure "Assunzioni avanzate", dot changed-vs-preset, export JSON/CSV, tooltip audit **click-only**. Nuovo sub-componente `ScopingField.astro` (GOTCHA scoping stili → `<style is:global>`). **30 test Vitest** (da 12); README del blocco `packages/core/src/blocks/scoping/README.md`. Backward-compatible (scenari vecchi ereditano i default). Prima (fix separato): tooltip audit resi **click-only** invece che hover.
- **Trenitalia — 21+ correzioni messaging, struttura & slide nuove** (14 lug 2026, vedi §15.4): round di qualità post-screenshot: `slide-cja-vs-cdp` (convergenza, CJA≠CDP standalone) + `slide-fase1-cja` (roadmap, deep-dive Fase 1 CJA+AEP Governance) aggiunte; IBM/Accenture/Pico rimossi per nome; Oracle Responsys locked come "complementato, non sostituito"; AJO framing locked "sopra Oracle Responsys"; KPI numerici → tutti "stima illustrativa / da validare sul campo"; casi d'uso → "da validare sul campo"; GDPR rationale inline Data Collaboration; breach Trenitalia giu 2026 → driver AEP Governance; 611 email/anno → fonte citata (Google Takeout, 1 account, luglio 2026, solo illustrativa); use-case ristrutturati 4 colonne (Scenario/Segnale CJA/Azione/Impatto). Build 0 errori.
- **Type & legibility contract** codificato in `CLAUDE.md` (vincolante per tutte le esperienze future) + questo handover aggiornato. Regole: type minimo (body ≥0.95rem), ink leggibile, composizione bilanciata, split-non-shrink, verifica leggendo screenshot 1920, frecce bidirezionali. Vedi §8.
- **Trenitalia — redesign leggibilità completo** (vedi §15): personas Marco/Sofia → **Davide/Elena** (Marco/Sofia sono di UniCredit); foto persona rigenerata (era duplicata da UniCredit); doppia passata su ogni slide con type generoso; ecosistema **ripristinato impilato** (più leggibile del grid); use-case/roadmap ristrutturati; `audit:deck` **165→0**.
- **Showcase data-driven**: `src/data/experiences.ts` unica fonte → card/hero/prose/diagramma/blueprint derivati; griglia esperienze **simmetrica** (2×2 / 4-across); tag card = solo cliente. 4ª card (FS Group) aggiunta.
- **Ferrari /scoping** — calcolatore licensing (vedi §14): metriche spiegate, tooltip di audit per campo, formattazione migliaia, niente click che naviga (`data-deck-nochrome`), calcolatore rivisto.
- **Feature parity**: `prevHref` su tutte le pagine ferrari+maxmara (frecce indietro tra sezioni); gating salta sezioni anche all'indietro; **Max Mara resa config-driven** (Admin + runtimes + `.cs-*`).
- **Hub root restructure** (vedi §15): root = `apps/factory-hub`; **Max Mara → `/generazioni-maxmara/`** con stub di redirect; deploy.yml + console registry + `0005_hub_registry.sql` (applicata) aggiornati; Trenitalia resa visibile ovunque.

### Change log — Factory Showcase (lug 2026, dal più recente)
- Uniformità KPI (link "12 controlli" dentro l'etichetta) + review pagina (fix IT `personas`, entry-point skill unificati su `#skill`) + skill file storico allineato ad `a–l`.
- KPI "12" reso preciso/verificabile ("controlli di layout e accessibilità, per slide" → link a `blueprint#deck`); no overselling.
- **Mark distintivo** (chip gradiente + due piani core/skin) su favicon+nav+footer, al posto della "A" Adobe.
- **Skill above the fold** (CTA "Ottieni la skill" secondaria con dot verde → `#skill`); blueprint declassato a link testuale.
- **WOW pass**: screenshot reali delle 3 esperienze nelle card Proof (badge LIVE), **sezione Skill dedicata** (valore + install Claude/ChatGPT/Copilot + download .zip + copia istruzioni), roadmap **simmetrica** 3×2 con Firefly "in valutazione", hero animato + count-up + barra progresso; **reframe** tempo ("l'ora è del motore", tag actor sugli step del flusso) per valorizzare il lavoro dell'Adobian.
- Sezione **"Come nasce un'esperienza"** (flusso KB→ricerca→draft→brief→scaffold→crescita→verifica) + nota "Da segnalare" (tutto su @adobe.com/Google, nessuna licenza) + KB **solo locale**.
- Skill **`experience-brief`** creata (SKILL.md + INSTALL.md, Claude/ChatGPT/Copilot).
- Prima versione del sito + wiring nel workflow di deploy (`/showcase/`).

---
## 12. Puntatori

- `CLAUDE.md` — guida agente + Quality Bar + contratto deck + aesthetics per esperienza.
- `docs/new-client-in-30-min.md` — creare una nuova esperienza + gotchas (Tailwind v4 + monorepo, trailing slash, base URL, GSAP scroller, reduced-motion, chiavi TS con trattino, translucency in CSS raw).
- `docs/AUDIT.md` — diagnosi (Fase 1) di Max Mara Acquisizione.
- `docs/storyboard.md` — storyboard.
- `skills/experience-brief/` — skill di intake (SKILL.md + INSTALL.md); `skills/experience-design/SKILL.md` — skill di costruzione.
- `.claude/commands/handover.md` (di progetto, versionato) **+ `~/.claude/commands/handover.md` (user-level → tutte le sessioni/progetti)** — comando **`/handover`**: aggiorna questo doc in modalità dettagliata, impone il contratto di dimensione (≤1500 righe / ≤48KB / riga ≤1800 char), splitta per sezione in `HANDOVER-NN.md` con questo file come manifest, e **verifica con una Read completa** che una nuova sessione riesca a leggere tutto. `/handover check` = solo misura+verifica. Frontmatter con stringhe quotate (vedi §17.5). Spec: `docs/superpowers/specs/2026-07-15-handover-command-design.md`.
- Memorie (`~/.claude/projects/.../memory/`): `factory-showcase-site` (la vetrina + gotcha Astro), `unicredit-personas-credibility` (il riferimento più aggiornato per UniCredit), `deck-responsive-fullscreen`, `mockup-navigation-patterns`, `custom-slides-authoring`, `super-admin-console`, `ferrari-racing-experience`, `round-2-status`.

---

## 13. Factory Showcase — sito vetrina (iperdettaglio)

`apps/factory-showcase` · **live**: `https://agargiulo-adbe.github.io/experience-design-factory/showcase/`.
**Scopo**: presentare la Experience Design Factory a **leadership e colleghi Adobe** (valorizzare il lavoro di Antonio + visibilità internazionale). **Pubblico misto** (leadership strategica + practitioner/eng). `<meta robots="noindex">` (uso interno).

### 13.1 Formato & stack
- **Scroll-site, NON un deck** (nessun `DeckContainer`/`audit:deck`). Astro 6 statico, Tailwind v4, `trailingSlash:'always'`, `base = /experience-design-factory/showcase`.
- Riusa dal core **solo** `blocks/i18n/T.astro`, `LangToggle.astro`, `utils/url.ts` (`href`). Nessuna dipendenza da deck/admin/supabase.
- **Token contract proprio** in `src/styles/global.css` (mantiene i nomi semantici del core così `T`/`LangToggle` funzionano): accent = **Adobe red `#EB1000`**, gradiente firma `--grad-adobe` (rosso→magenta `#E1077B`→violet `#6236FF`); font Inter (display+body) + Source Serif 4 (accenti corsivi); mono di sistema.
- **Bilingue EN default + toggle IT** (via `T`/`LangToggle`, anti-flash init in `BaseLayout`). *Tutto* il testo è EN+IT reale.
- **2 pagine**: `src/pages/index.astro` (la narrativa) e `src/pages/blueprint.astro` (deep-dive tecnico). Componenti: `layouts/BaseLayout.astro`, `components/SiteNav.astro`, `components/SiteFooter.astro`.

### 13.2 Struttura `index` (ordine sezioni) + comportamenti
Hero → **what** → **why** → **proof** → **architecture** → **flow** → **skill** → **grow** (roadmap) → **author**. Nav sticky con anchor + **scrollspy** + **barra di progresso** (gradiente, in `SiteNav`). `blueprint.astro`: TOC sticky + 9 sezioni + elenco dei 12 check a–l.
- **Hero**: gradiente animato (`heroDrift`, reduced-motion off), 4 **KPI** con count-up (`[data-count]`), CTA **primaria "Guardalo dal vivo"** (`#proof`), **secondaria "Ottieni la skill"** (dot verde → `#skill`), link testuale al blueprint.
- **Proof**: 3 card con **screenshot reali** delle esperienze live (badge "LIVE" pulsante) + strip Console.
- **Motion**: reveal-on-scroll (`[data-reveal]` + IntersectionObserver in `BaseLayout`), count-up, progress bar, copy-to-clipboard — **tutti reduced-motion safe**.

### 13.3 Decisioni di contenuto (LOCKED — non regredire)
- **Autore = Antonio Gargiulo** (NON "Argiulo"), titolo **"Senior Product Sales Specialist · Adobe Italia"**. Contatto = **deep-link Teams** `https://teams.microsoft.com/l/chat/0/0?users=agargiulo@adobe.com` (CTA "Scrivimi su Teams"). Coerente con email `agargiulo@adobe.com`.
- **Reframe tempo (importante)**: il "~1h / < 1h" è **solo lo step di scaffold del motore**, non l'intera esperienza. Headline flusso **"Il pensiero è tuo. L'ora è del motore."**; ogni step del flusso ha un **tag actor** (Adobian ×4 · Il motore ×1 · KB Factory ×1) per **valorizzare il lavoro dell'Adobian** (ricerca/concezione) e l'ottimizzazione a valle. KPI hero = *"dal brief a una build funzionante"*. **Non trivializzare il lavoro umano.**
- **Nota KB = solo locale**: la KB vive **solo sul computer di Antonio**, **mai** su sistemi terzi/cloud/esterni (tutela dati Adobe). Tenere esplicito.
- **Nota "Da segnalare"**: copre **sia** i tool della catena **sia** ogni componente dell'architettura/runtime della Factory — tutti su account `@adobe.com` via login Google, **nessuna licenza aggiuntiva**, non bloccati da Adobe.
- **KPI "12"** = i 12 check del contratto deck (a–l); etichetta precisa *"controlli di layout e accessibilità, per slide"*, **linkata a `blueprint#deck`** (verificabile, no overselling).
- **Roadmap**: Firefly (imagery/video) è **"In valutazione"**; la skill di intake è **"Disponibile"**. Griglia **simmetrica 3×2**.
- **Mark distintivo**: chip gradiente + **due piani (core+skin)** — NON la "A" Adobe (leggeva come logo Adobe rotto). In `public/favicon.svg` + SVG inline in `SiteNav`/`SiteFooter` (id gradiente distinti: `edf-fav`/`edf-grad-nav`/`edf-grad-foot`).

### 13.4 La skill di intake (`experience-brief`)
- **Source of truth**: `skills/experience-brief/` → `SKILL.md` (frontmatter + istruzioni: intervista guidata che ricerca il brand e produce il **brief iperdettagliato**) + `INSTALL.md` (Claude / ChatGPT Custom GPT / Microsoft Copilot).
- **Copie servite** per il sito in `apps/factory-showcase/public/skill/`: `experience-brief-SKILL.md`, `experience-brief-INSTALL.md`, `experience-brief-skill.zip`. La sezione **Skill** offre **Download (.zip)**, **Copia istruzioni** (fetch della `SKILL.md` + strip frontmatter → clipboard) e **Vedi su GitHub**.
- ⚠️ **Sync manuale**: se cambi `skills/experience-brief/`, ri-copia in `public/skill/` e rigenera lo zip: `cp skills/experience-brief/*.md apps/factory-showcase/public/skill/` (rinominando con prefisso `experience-brief-`) e `(cd skills && zip -qr ../apps/factory-showcase/public/skill/experience-brief-skill.zip experience-brief)`.

### 13.5 Asset & gotcha
- **Screenshot proof** in `public/shots/{maxmara,unicredit,ferrari}.webp` (1200×750). Rigenerazione: playwright naviga gli URL **live** delle esperienze → sharp `resize(1200,750, fit:cover, top)` → webp q82. (Script usa-e-getta dalla root; `playwright` + `sharp` sono già devDep.)
- **Committare** `public/shots/*` e `public/skill/*` (serviti staticamente; NON gitignored). `dist/` è gitignored.
- **Gotcha Astro (CRITICO, riusabile)**: le classi passate al componente **`<T>`** (child) **NON ricevono gli stili *scoped*** della pagina (l'elemento reso da `T` non ha l'attributo di scope). Fix: usare **`:global(.classe)`** oppure **wrappare `<T>` in un elemento nativo** con la classe. Ha rotto titolo hero + molti paragrafi finché non corretto. Vale per qualunque componente che renda markup proprio.
