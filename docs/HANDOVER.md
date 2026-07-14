# HANDOVER — Experience Design Factory

> Documento di passaggio di consegne. Stato al **2026-07-14**.
> Lingua: italiano per la narrativa, inglese per path/comandi/nomi prodotto.
> Companion di `CLAUDE.md` (guida agente, sempre valida) e delle memorie in
> `~/.claude/projects/.../memory/`. Se una cosa qui contraddice il codice, **vince il codice** —
> segnalalo e aggiorna questo file.
>
> **Nuova sessione CC:** l'indice/ordine di lettura è in `docs/README.md`. Leggere **tutti** i
> `.md` costa ~15k token (ok). **Non** aprire mai i `.pptx`/`.mp4` in `docs/` (binari giganti,
> git-ignored, non presenti in un clone pulito) — i fatti utili sono già distillati qui (§5.3).

---

## 1. Cos'è e stato generale

Monorepo di una **Experience Design Factory**: un motore condiviso (`packages/core`) su cui ogni
**Experience Design** cliente è una *skin* (design token + contenuti + asset + config). Sopra, una
**Super Admin Console** (`apps/console`) per gestire esperienze e utenti.

Esperienze (cliente) — **quattro**:
- **Generazioni — Max Mara** (`apps/generazioni-maxmara`, ora su `/generazioni-maxmara/`) · IT, quiet-luxury. Prima istanza. **Ora config-driven** (Admin Console + runtimes + `.cs-*`) come le altre (lug 2026).
- **Engagement Unlimited — UniCredit** (`apps/unicredit-engagement`) · IT · modello di contenuto più maturo (vedi §5).
- **Pole Position — Ferrari × Adobe** (`apps/ferrari-racing`) · EN/IT bilingue, motorsport. Include la sezione **/scoping** (calcolatore di licensing RTCDP Collaboration + CJA — vedi §14).
- **Connessioni Intelligenti — FS Group / Ferrovie** (`apps/trenitalia-connessioni`) · IT · 6 sezioni + Casi d'uso. **Oggetto del lavoro recente** (vedi §15).

App interne (non-cliente):
- **Factory Hub** (`apps/factory-hub`, **root del deploy** `/experience-design-factory/`) · landing neutra che linka direttamente le 4 esperienze + Showcase + Console; serve anche gli stub di redirect dei vecchi deep-link maxmara root-level. Vedi §15.
- **Experience Design Factory — Showcase** (`apps/factory-showcase`, `/showcase/`) · sito **vetrina** bilingue EN/IT. **Non è un deck**: scroll-site. **Ora data-driven** da `src/data/experiences.ts` (conteggi/KPI/card si aggiornano da soli). Dettaglio in §13.
- **Super Admin Console** (`apps/console`, `/console/`) — vedi §7. Le 4 esperienze sono registrate (Trenitalia inclusa).

Correlato: **skill di intake** `skills/experience-brief/` (Claude/ChatGPT/Copilot) che genera il brief per una nuova esperienza — vedi §13.4.

Solo capability Adobe pubbliche / materiale demo — **niente IP cliente riservata**, **niente imagery brand sbagliata** (Quality Bar in `CLAUDE.md`).

**Regola vincolante trasversale:** ogni slide-deck rispetta il **Type & legibility contract** in `CLAUDE.md` (type generoso, ink leggibile, composizione bilanciata, frecce avanti+indietro tra sezioni) — l'`audit:deck` NON garantisce la leggibilità, va verificata leggendo uno screenshot 1920. Vedi §8.

Stato build: `pnpm build` verde su tutto (core, console, hub, showcase, **4 app** esperienza). `audit:deck` a **0 fallimenti** su tutti e 4 i deck. Deploy automatico su push a `main`.

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
pnpm --filter @agargiulo-adbe/experience-core test   # 30 test del cost-model/scenario scoping (Vitest)
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
| **Ferrari Racing** | Stabile + **sezione /scoping** (calcolatore licensing **evoluto**: funnel audience, 5 variabili decisionali, breakdown con formule, warnings, preset, export — vedi §14; 30 test). Product Mockup (Genstudio/Rtcdp/MockupSlide); CJAMockup/ExpressMockup pending. `audit:deck` 0 (74→0). | Bilingue EN default. `prevHref` su tutte le pagine. |
| **UniCredit Engagement** | Stabile; modello di contenuto più maturo (5 round feedback). Vedi §5. | `nextHref`+`prevHref` completi (gold standard). |
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
- Base clienti = **14M clienti retail** (non 7M). Cifre reali FY24 non più usate come "obiettivi": la home mostra **obiettivi di piano** UniCredit Unlimited (>€5,5B in tech/digitale/dati, €11B+ utile, >20% RoTE) — il €5,5B è il nesso logico con "tech & AI abilitatori". Fonte con **link** (press UniCredit Unlimited, feb 2026).
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

**Come leggerlo (importante):** il deck ha una **baseline di ~176 fallimenti pre-esistenti** che sono **check aspirazionali soft** — soprattutto `a` (banda di lettura 30–70%) e `i` (uso spazio ≥45%) su slide volutamente ariose o dense. **Non inseguire il numero assoluto.** Quello che conta sono i **check "hard"**: `b` (collisione con la chrome), `j` (clipping fuori viewport), `k` (scroll nascosto). Baseline hard: **`j:F`=7, b/k=0**.

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

## 10. Pending / TODO / rischi noti

1. **Supabase** — migrations applicate al DB remoto: `0001`–`0003` + `0004_scenarios.sql` (calcolatore Ferrari) + `0005_hub_registry.sql` (maxmara subpath + Trenitalia registrata). Se ricrei il progetto, riesegui in ordine (`supabase/README.md`). Memoria `super-admin-console`.
2. **Asset pipeline** — alcune esperienze necessitano un `pnpm --filter <app> assets:build` una-tantum con `PEXELS_API_KEY` + commit. Memoria `asset-pipeline-pending-generation`. **Attenzione ai duplicati di stock**: la foto persona Trenitalia era identica a quella UniCredit → rigenerata con query diversa (lug 2026); controlla i volti tra esperienze.
3. **deck-audit** — tutti e 4 i deck a **0** (non più baseline soft). NON reintrodurre micro-type per "far tornare i conti": il Type & legibility contract vince sempre.
4. **Max Mara `docs/AUDIT.md`** — refinement diagnosticati (copy datato 2025→2030, scala tipografica a token, doppio `<h1>`, ecc.) **non applicati**; attendono validazione copy.
5. **Ferrari** — CJAMockup / ExpressMockup pending (memoria `product-mockup-engine`). Prima di toccare i mockup leggi `mockup-navigation-patterns`.
6. **Cosmetico** — la `description` meta di `coworker.astro` cita ancora "CX Enterprise Coworker" (non visibile in slide; ok, ma allineabile a "Coworker").
7. **Non rilavorate col nuovo standard**: le altre esperienze non hanno il pass credibilità/fonti fatto su UniCredit.
8. **Showcase — sync copie skill**: `apps/factory-showcase/public/skill/*` sono **copie** di `skills/experience-brief/` (per download+copia on-site). La **source of truth è `skills/experience-brief/`**; se la modifichi, ri-copia i file e rigenera lo `.zip` (vedi §13.4).
9. **Showcase — a11y/Lighthouse pass** (consigliato, non fatto): verificare contrasto dei testi grigi su fondo chiaro, focus order, `prefers-reduced-motion` — per certificare lo standard che la pagina *dichiara*.
10. **Showcase — Firefly "in valutazione"**: la card roadmap Firefly è marcata *Under evaluation*, non un impegno. Non promettere date.

---

## 11. Change log recente (UniCredit, lug 2026)

Dal più recente:
- `310e045` fix analytics naming + Coworker semplificato (verificato vs MEGA DECK): MCA↔Mix Modeler, DIA attuale, Customer&Group Journeys chiarito, Coworker senza moduli finti; Motore rigenerato (AEM Sites Optimizer, Brand Concierge, MCA, AI Platform) + fix clipping.
- `b8bd78c` Contenuti: AEM Sites nello stack + nuove slide **AI Agents in AEM** e **Firefly enterprise** (ricerca online); fix contrasto WCAG link su slide inverse.
- `aa26cd1` Round 2: numeri-obiettivo di piano; "6+ sistemi" → qualitativo; imperativi ammorbiditi; Social Ads + layout simmetrico; "why Adobe" su Acquisisci; **rinumerazione dinamica card**; chip allineati; **nav frecce bidirezionale**; Brand Concierge in Admin.
- `c6385e4` Conteggio capitoli dinamico + media reflow (niente overlap testo).
- `2da455b` Restructure personas (Marco B2C / Adriana B2B) + pass copy & credibilità (14M, reel ads, fonti datate+link, +34%/40% de-dup).

Metodo seguito ogni round: fonti reali via ricerca web / MEGA DECK; build + `audit:deck` con confronto baseline via stash; commit + push.

### Change log — Hub · Parity · Ferrari scoping · Trenitalia (13–14 lug 2026, dal più recente)
- **Ferrari /scoping — evoluzione motore (DoD-complete)** (14 lug 2026, vedi §14): il calcolatore diventa strumento trasparente/configurabile/auditabile. Nuovo motore con **funnel audience** (distinct→overlap→activated/measured) + 5 variabili decisionali (**overlap/match rate, refresh cadence, managed base, activation mode, measurement model**); **guardrail anti doppio-conteggio** on-demand vs recurring; `computeBreakdown()` con formula+numeri sostituiti per riga + sorgenti CJA con peso% + warnings. `FIELD_AUDIT` esteso (dataType semantico→badge, select+options, `appliesWhen` condizionale, `advancedOnly`, `impacts`). UI: preset chip, strip warnings, breakdown drawer per prodotto, disclosure "Assunzioni avanzate", dot changed-vs-preset, export JSON/CSV, tooltip audit **click-only**. Nuovo sub-componente `ScopingField.astro` (GOTCHA scoping stili → `<style is:global>`). **30 test Vitest** (da 12); README del blocco `packages/core/src/blocks/scoping/README.md`. Backward-compatible (scenari vecchi ereditano i default). Prima (fix separato): tooltip audit resi **click-only** invece che hover.
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

---

## 14. Ferrari — sezione `/scoping` (calcolatore di licensing)

`apps/ferrari-racing/src/pages/scoping.astro` (gated dalla solution `scoping`). Pagina customer-facing che modella **volumi e costo di licenza** di **RTCDP Collaboration** (Collaboration Credits) e **CJA** (Rows of Data) — due prodotti indipendenti, due metriche. È uno **strumento** (island interattiva full-bleed), NON una slide-keynote: **esente da `audit:deck`** (`/scoping/` non è nel ROUTE_SET di `scripts/deck-audit.ts`). Doc di riferimento del blocco: **`packages/core/src/blocks/scoping/README.md`** (architettura + come estendere).

### 14.1 Architettura (layer separati)
Tutto in `packages/core/src/blocks/scoping/` salvo i contenuti client:
- **`cost-model.ts`** — motore puro, deterministico, framework-free (30 test Vitest).
- **`scenario.ts`** — `DEFAULT_ASSUMPTIONS`, `DEFAULT_PRICES`, preset id/label, serialize/deserialize **forward-compatible** (payload vecchi ereditano i default dei campi nuovi → scenari salvati pre-evoluzione continuano a funzionare).
- **`scenario-store.ts`** — persistenza localStorage (anon) + Supabase REST.
- **`ScopingCalculator.astro`** — shell UI + presenter (island TS vanilla).
- **`ScopingField.astro`** — sub-componente: una riga di input (label + badge semantico + tooltip audit + number/select).
- **`apps/ferrari-racing/src/data/scoping.ts`** — **contenuti Ferrari**: `FIELD_AUDIT`, `SEED_SCENARIOS` (preset), `METRICS`, `DISCLAIMER`. È l'unico file che la maggior parte delle modifiche tocca.

### 14.2 Modello di calcolo — RTCDP Collaboration
**Funnel audience** (rate clampati 0–1): `distinct → overlap = distinct × partnerOverlapRate → activated = overlap × activatedOverlapRate` (per run) `→ measured = overlap × measuredOverlapRate`. Base gestita selezionabile: `full | overlap | custom`.
Parti di credito (modalità *activity*; *direct* usa `directCredits` verbatim):
- `management = managedAudiences × (managedIDs ÷ 1M) × refresh/anno × creditPerMgmtPerMillionRefresh`
- `activation = activationRuns × (activated ÷ 1M) × creditPerActivationPerMillion`
- `measurement = records | reports | hybrid | none` (ciascuno su una base volumetrica diversa)
- `estimated = management + insights + activation + measurement` · `billable = max(0, estimated − allotment)` (Prime 2.500 / Ultimate 5.000) · `cost = billable × pricePerCredit`.
- **Guardrail anti doppio-conteggio**: `activationRuns` dipende da `activationMode` — on-demand / recurring **non** vengono sommate salvo modalità `mixed`; se entrambe >0 fuori da mixed, `buildWarnings` emette `activation-double-count`.

### 14.3 Modello di calcolo — CJA
`rows = Σ(web, app, social, crm, events)` · `ingestionLimit = rows × cjaIngestionMultiplier` (guardrail ufficiale ×3) · `cost = (rows ÷ 1M) × pricePerMillionRows`. Breakdown per-sorgente con **peso %**.

### 14.4 Trasparenza & auditabilità
`computeBreakdown(assumptions, prices)` restituisce, per ogni riga: **formula simbolica + numeri sostituiti + input usati**, le sorgenti CJA con peso%, e i `warnings`. La UI espone 3 livelli: results bar (summary) → drawer "Show calculation" (breakdown con formule) → tooltip audit per campo. Ogni variabile ha un **dataType semantico** → badge colorato: `official` (verde) · `default-assumption` (grigio) · `customer-assumption` (blu) · `price`/quote-only (giallo). Badge resi con `rgba()` esplicito (il parser di contrasto dell'audit non legge `oklab()`/`color-mix()`).

### 14.5 UX
Preset chip (Conservativo/Base/Ambizioso/**Custom** = stato modificato) → applicano gli scenari seed; strip **warnings** guardrail; **breakdown drawer** per prodotto; disclosure **"Assunzioni avanzate"** (burn-rate & rate secondari); **visibilità condizionale** dei campi (`appliesWhen`, es. *report/anno* solo se measurement report-based; *volume custom* solo se base gestita = custom; campi *direct* vs *activity*); **dot "changed vs preset"**; export **JSON/CSV**. Tooltip audit **si aprono al click** (non hover, così non coprono il campo), chiudibili con click-fuori/Esc. Prezzi/burn-rate = *quote-only* (input utente, illustrativi): il costo è null finché non prezzati.

### 14.6 Estendere (vedi README del blocco)
Aggiungere una variabile: campo in `ScopingAssumptions` + default in `DEFAULT_ASSUMPTIONS` → usarla in `collabParts`/`cjaSourceRows` + `LineItem` in `computeBreakdown` → registrarla in `FIELD_AUDIT` (`dataType`, `category`, `appliesWhen`/`advancedOnly`, `source/calc/assumption` bilingui) → test. Select enum: `input:'select'` + `options` (ogni `<select>` è trattato come controllo stringa). Nuova sorgente CJA: estendi `CjaSourceRows['id']` + `cjaSourceRows` + `CJA_SOURCE_FORMULA`/`cjaSourceSubstituted` + `FIELD_AUDIT`. Nuovo warning: push in `buildWarnings`. Localizzazione: tutte le stringhe sono `{en,it}`.

### 14.7 Persistenza & Admin
Supabase `scenarios` (`0004_scenarios.sql`, RLS **private/link/team**, `created_by default auth.uid()`); auth = token `edf:sb-session` come `media_configs`. Condivisione `?scenario=<uuid>`. Admin: tab opt-in "Modello di licensing" in `AdminConsole.astro` (`showScopingTab`, default false) per baseline prezzi (applicata in `applyScenario` come fallback null).

### 14.8 GOTCHA (dolori appresi)
- **Astro scoping degli stili**: estraendo il markup dei campi in `ScopingField.astro`, il `<style>` scoped di `ScopingCalculator.astro` **non** matchava più i suoi elementi (tooltip/badge/input renderizzati non stilizzati / tooltip inline sopra il campo). Fix: il blocco `.scoping-*` è ora **`<style is:global>`** (selettori tutti `.scoping-`-prefissati, caricati solo su `/scoping/` → nessun leak).
- La slide del calcolatore **non** deve usare `data-demo-flex` (riserva il 48% destro a un pannello media → spinge fuori viewport); grid/flex children servono `min-width:0`; clic dentro il calcolatore neutralizzati con `data-deck-nochrome`.
- Memoria `ferrari-scoping-calculator`. Spec/plan iniziali: `docs/superpowers/{specs,plans}/2026-07-13-ferrari-licensing-scoping-calculator*`.

---

## 15. Root hub, feature parity & Connessioni Intelligenti (13–14 lug 2026)

### 15.1 Factory Hub (root)
`apps/factory-hub` è la **landing** a `/experience-design-factory/` (prima la root era Max Mara → link "generico"). App Astro minimale, **senza tailwind né `@edf/core`**, stile scoped scuro-neutro (NON un brand cliente). Contiene: 4 card esperienza brand-accented con link diretti + Showcase + Console. Serve anche gli **stub di redirect** (`src/pages/<slug>.astro` via `_redirect.astro`) per i vecchi deep-link maxmara root-level (`/acquisizione/`, `/engagement/`, `/conversione/`, `/loyalty/`, `/motore-adobe/`, `/persona/`, `/chiusura/`, `/maxmara-adobe/`) → redirect a `/generazioni-maxmara/<path>/` preservando `location.search`. Max Mara ha cambiato `base` in `astro.config.mjs`. Deploy.yml: root ← factory-hub, maxmara → sottodir.

### 15.2 Feature parity (uniforme su tutti i deck)
- **Frecce bidirezionali tra sezioni**: ogni pagina-deck ha `nextHref` **e** `prevHref`; il runtime di gating riscrive **sia** `data-deck-next` **sia** `data-deck-prev-href` (`nextEnabledAfter()` / `prevEnabledBefore()`) per saltare le sezioni disattivate. Regola nel Type & legibility contract (`CLAUDE.md`).
- **Max Mara resa config-driven** (predava il sistema): `admin.astro` (PAGE_REGISTRY dai veri slide id, 12 SOLUTIONS dai prodotti presenti), runtimes ferrari-style (media slot + gating + custom slides), `.cs-*` retinted quiet-luxury. Pagine funnel volutamente **non** gated (narrativa persona continua).

### 15.3 Connessioni Intelligenti — stato & lock
`apps/trenitalia-connessioni` · IT · cliente **FS Group / Ferrovie** (Trenitalia + FS Park + FS Technology). Nav: SCENARIO · FOUNDATION · CJA (convergenza) · CONNESSIONI (data-collab) · ROADMAP · CASI D'USO.
- **Personas (LOCKED)**: **Davide** (pendolare business Milano–Roma) + **Elena** (business/frequent traveler). **MAI Marco/Sofia** (=UniCredit) né Giulia/Francesca (=Max Mara) né Adriana (=UniCredit B2B). Foto persona rigenerata e **distinta** da UniCredit (era duplicata).
- **Leggibilità (LOCKED)**: type generoso per proiezione (vedi §8 / Type contract). L'ecosistema Foundation va tenuto **impilato full-width** (righe categoria), non a grid — richiesta esplicita cliente. `audit:deck` a **0**.
- **Sezione governance dedicata** (`slide-governance` in connessioni): scudo privacy & security per tutte le app AEP (non solo Data Collaboration).
- **Casi d'uso**: framing unificato "scenari di ispirazione ancorati al mondo FS" — NON "3 provati + 8 da esplorare". Structure 4-col: Scenario · Segnale CJA · Azione · Impatto Atteso — uniforme su core cases E "Da esplorare". Tutti etichettati "da validare sul campo".
- Memorie: `trenitalia-connessioni`, `hub-root-and-parity`.

### 15.4 Connessioni Intelligenti — mappa slide & vincoli contenuto (LOCKED)

**Struttura slide corrente** (da `admin.astro`):

| Sezione | Slide id | Label |
|---|---|---|
| scenario | `slide-cover` | Cover — Il viaggio del cliente oggi |
| scenario | `slide-marco` | Davide — profilo persona |
| scenario | `slide-touchpoints` | I touchpoint isolati |
| scenario | `slide-email-gap` | Oracle Responsys — gap comunicativo |
| scenario | `slide-opportunity` | L'opportunità integrata |
| fondazione | `slide-cover` | Cover — La foundation |
| fondazione | `slide-ecosystem` | Ecosistema a strati |
| fondazione | `slide-salesforce` | Salesforce Foundation Q1 2026 |
| fondazione | `slide-choice` | Non sostituire. Connettere. |
| convergenza | `slide-cover` | Cover — CJA il layer di convergenza |
| convergenza | `slide-convergenza` | Tutte le fonti. Un'unica vista. |
| convergenza | `slide-cja-vs-cdp` | CJA è / non è — disambiguazione (**nuova**, lug 2026) |
| convergenza | `slide-demo-cja` | Demo CJA Workspace — Davide |
| convergenza | `slide-content-analytics` | Content Analytics su AEM |
| convergenza | `slide-fasi` | Le 3 fasi — approccio graduale |
| connessioni | `slide-cover` | Cover — FS Park × Trenitalia |
| connessioni | `slide-gap` | Il gap attuale |
| connessioni | `slide-why-collab` | Perché serve Data Collaboration |
| connessioni | `slide-usecases` | I 3 use case ad impatto |
| connessioni | `slide-data-collab` | Data Collaboration — clean room |
| connessioni | `slide-governance` | AEP — Data Governance & Security |
| connessioni | `slide-value` | Il valore end-to-end |
| roadmap | `slide-cover` | Cover — Roadmap |
| roadmap | `slide-3fasi` | Le 3 fasi evolutive |
| roadmap | `slide-fase1-cja` | Fase 1 deep-dive — CJA + Governance (**nuova**, lug 2026) |
| roadmap | `slide-rtcdp-ajo` | Fase 2 deep-dive — Real-Time CDP + AJO |
| roadmap | `slide-mix-modeler` | Fase 3 — Adobe Mix Modeler |
| roadmap | `slide-mix-usecase` | Fase 3 — Mix Modeler use case FS |
| roadmap | `slide-genstudio` | Fase 3 — GenStudio + Target + Exp. Accelerator |
| casi-duso | `slide-cover` | Cover — recap e da esplorare |
| casi-duso | `slide-recap` | I 3 casi core, in sintesi |
| casi-duso | `slide-explore-retention` | Da esplorare · Retention & Loyalty |
| casi-duso | `slide-explore-loyalty` | Da esplorare · Loyalty & Acquisition |
| casi-duso | `slide-explore-growth` | Da esplorare · Acquisition & Ecosystem |
| casi-duso | `slide-explore-intelligence` | Da esplorare · Intelligence & Optimization |
| casi-duso | `slide-sintesi` | Sintesi + invito |

**Vincoli contenuto (LOCKED — non regredire in nessuna sessione):**

1. **Nessun nome di integratore/consulente** — non nominare mai IBM, Accenture o Pico. Usare "system integrator" se necessario; non attribuire decisioni architetturali interne al cliente.
2. **Nessuna "lottizzazione"** — non riportare mai le decisioni di assegnazione interna tra vendor/team FS. Nell'Experience riportare **solo i benefici e il valore** di un'integrazione con CJA.
3. **Oracle Responsys = CRM B2C che CJA complementa, NON sostituisce.** Trenitalia gestisce l'intera base clienti con Oracle CDP + Eloqua; CJA (e qualsiasi altro componente Adobe) va valorizzato **in combinata** con Oracle, non in sostituzione né in opposizione.
4. **AJO framing locked**: "AJO orchestra SOPRA Oracle Responsys — non lo sostituisce. Responsys rimane il motore di esecuzione email". Usare questo framing esatto in roadmap e in qualsiasi slide che menzioni AJO.
5. **CJA ≠ CDP** (slide `slide-cja-vs-cdp` in convergenza): CJA è un **layer di analytics e convergenza**, non un CDP. La disambiguazione ha una slide dedicata; non rimuoverla.
6. **KPI numerici** — ogni metrica numerica deve recare l'etichetta **"stima illustrativa"** o **"KPI da validare sul campo"**. Nessuna promessa precisa senza una fonte verificabile.
7. **Casi d'uso** — tutti i casi (core 3 + da esplorare 8) sono etichettati **"da validare sul campo"**, mai "dimostrati". La sintesi dice "3 casi core da validare · 8 da esplorare insieme".
8. **GDPR Data Collaboration** — FS Park e Trenitalia sono **entità legali distinte** anche all'interno del Gruppo FS. Il GDPR richiede una clean room (Data Collaboration) anche per condivisione audience intra-gruppo. Questa rationale è inline in `slide-why-collab` e non va mai rimossa.
9. **AEP Governance / breach angle** — il cyberattacco a Trenitalia (giugno 2026, sky.it/cronaca/2026/06/26) è il driver di credibilità per la sezione Data Governance in `slide-governance`. Non rimuoverlo, ma non collegarlo a numeri o danni specifici (dati non pubblici).
10. **Email 611/anno** — fonte: analisi campione email Trenitalia tramite Google Takeout personale (luglio 2026, 1 account cliente). **Solo illustrativa**, non pubblicare come dato ufficiale. Il footnote nella slide va tenuto.
11. **"Le fondamenta"** (NON "La foundation") — titolo della sezione fondazione in italiano corretto. Tenere coerente in header, nav, CTA, meta title.
12. **Nessuna timeline sulle fasi** — le date/mesi per le fasi roadmap erano state rimosse. Le fasi sono etichettate "Fase 1/2/3" senza suffissi temporali. Il disclaimer "Scenario evolutivo a titolo illustrativo — fasi e tempistiche da definire con FS Technology" va mantenuto.
13. **Touchpoint scenario** — 4 touchpoint puliti (trenitalia.com, Frecce booking, App Trenitalia, FS Park app/web). Nessun riferimento a loyalty program esterno, AI-powered, o sistemi di terze parti non Adobe nel touchpoint layer.

**Fonti verificate citate nell'experience:**
- Salesforce Foundation FS Technology: `fsnews.it` — FS Technology + Salesforce Foundation Digitale (mar 2026).
- Oracle Responsys / email count: campione email personale (Google Takeout, luglio 2026, 1 account, solo illustrativo).
- AEM su trenitalia.com: osservazione pubblica.
- Breach Trenitalia: `sky.it/cronaca/2026/06/26` (giugno 2026).

**Solution gating corrente**: `convergenza → cja` · `connessioni → data-collab` · `roadmap → rtcdp + ajo + mix-modeler`.

---

## 16. Trait d'Union — Agos (14 lug 2026)

**App**: `apps/agos-trait-dunion` · live a `/experience-design-factory/agos-trait-dunion/` · slug admin `agos-trait-dunion`.

**Contesto commerciale (da discovery, luglio 2026 — fonti interne al team Adobe, non nel deck):**
- Agos usa **Adobe Campaign v7 on-prem + Adobe Analytics** da anni (impianto Deloitte); contratti fino a mar 2027.
- Programma di trasformazione interno: CRM→Salesforce, data lake→Snowflake, telefonia→AWS, go-live set–ott 2027. L'IT prevede **solo lift & shift** del campaign management; il Marketing vuole "preparare il terreno". Decisione aperta **Campaign v8 vs AJO**.
- Pain point chiave dalle sessioni: overlap open market/customer base non misurabile (attribuzione binaria Internet/"Mailing"), dato di conversione (caricata/liquidata) fuori piattaforma, log tecnico server-side = fonte di verità (100% richieste), DPO ultra-restrittivo, DMP dismessa, Target abbandonato anni fa per discrepanza col log, customer match Google = uplift zero (cultura evidence-based).
- **Riservatezza**: il deck è pubblico → niente nomi di persone Agos, niente citazioni attribuite, niente numeri contrattuali; nomi interni di programma non citati (si dice "la trasformazione"). Dati pubblici citati con fonte (CS FY2024, ACT 2028, Osservatorio Assofin–CRIF–Prometeia).

**Narrativa (7 sezioni)**: scenario (il paradosso dei due mondi: digitale vs filiale/customer base, persona Elisa) → fondamenta (stack attuale + trasformazione + "Non sostituire. Connettere.") → evoluzione (5 use case attuali → evoluti: form abbandonato→AJO journeys, use case→Orchestrated Campaigns+NBO, dato di ritorno→wave in piattaforma, A/B→Target experimentation, DEM→GenStudio con brand score compliance) → trait-dunion (CJA: fonti, è/non è, demo fallout Elisa con MediaDemoSlot `cja-fallout-demo`, overlap risolto, data governance DPO) → orizzonti (playbook FSI: offerta pre-qualificata +120% illustrativo, life events+NBO+payment denial, RT-CDP Collaboration coi partner, prospect anonimi+LLM Optimizer, panorama 12 use case) → valore (metodo evidence-based: ipotesi/controllo/log come giudice; KPI dichiarati illustrativi) → roadmap (2026 Preparare · 2027 Migrare evolvendo · 2028 Scalare, sequenziata con la trasformazione; 3 next step).

**Design**: palette **petrolio/acqua reale del brand agos.it** (verificata dal CSS live: #05636B, #008590, #06ABB8, #10CAD8) + arancio #F57C00; **Montserrat** display + Inter. Logo/favicon = due cerchi (acqua+arancio) uniti da un tratto — il trait d'union. Dark-dominant (lavagna #121E21).

**Solution gating**: `evoluzione → ajo+target+genstudio` · `trait-dunion → cja` · `orizzonti → rtcdp+data-collab`. 6 soluzioni in 4 pillar (analytics/activation/content/growth). `nextHref`+`prevHref` su tutte le pagine.

**Audit**: registrato in `scripts/deck-audit.ts` (route set `agos`); 0 failure sui 3 viewport. Lezioni: (1) i titoli con blocchi contenuto alti cadono sopra la banda 30% → compattare sotto il titolo, non sopra; (2) `mb-3` (13.5px) tra h2 e lead viola il check g (≥16px) → usare `mb-4`; (3) per gli "inventory" 4 voci, griglia 2×2 con categoria in-card batte le righe impilate quando il titolo cade alto.

**Registrazioni**: deploy.yml (merge + verifica), factory-hub card, showcase `experiences.ts` (+`shots/agos.webp`), migrazione `0006_seed_agos.sql` (**da applicare al DB remoto**: `supabase db query --linked`).

**Pending**: media demo per `trait-dunion:slide-demo-cja` da configurare in admin (video CJA fallout); eventuale bilingue se servisse per il gruppo CA; applicare 0006 al DB remoto.
