# Handover — Parte 2 di 2
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

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

---
## 17. Adobe Brand Visibility, de-AI copy & comando /handover (15 lug 2026)

### 17.1 Adobe Brand Visibility (consolidamento prodotto)
LLM Optimizer + Semrush **non sono più due prodotti**: sono confluiti in **Adobe Brand Visibility** (piattaforma end-to-end Adobe + Semrush per la AI/GEO visibility). Fonte: `docs/Adobe Brand Visibility Pitch Deck - Long Version.pptx`. Memoria: `brand-visibility-product`.
- 4 pilastri: **Visibilità AI completa** (10 famiglie LLM, agentic traffic da log CDN) · **Intelligence guidata dalla SEO** (289M+ prompt reali, query fan-out) · **Ottimizzazioni su ogni superficie** (edge CDN + at-source + off-site) · **Misurazione ad anello chiuso** (Adobe Analytics + CJA). KPI: brand mentions, citations, agentic traffic, referral traffic.
- **UniCredit `visibilita.astro`**: le due slide (`slide-llm-optimizer` + `slide-semrush`) **fuse** in un'unica `slide-brand-visibility` (layout split, gated `data-solution="brand-visibility"`). Edit puntuali: chip persona Marco → *Adobe Brand Visibility: UniCredit GEO*; CTA scenario → *Dalla storia alla tecnologia*; stat *referral traffic*/*bounce rate*; eyebrow+bullet "momento di Marco"; footer EDS (edge/BYO CDN/standard web); AEM Sites Optimizer (titolo non-overselling + SEO/contenuti/accessibilità/performance).
- **Admin**: `PAGE_REGISTRY` aggiornato (slide fusa) + nuova soluzione attivabile `brand-visibility` (pillar «AI Visibility»). `index.astro` journey sub-label aggiornato.
- **Agos `orizzonti.astro`**: rename «Adobe LLM Optimizer» → «Adobe Brand Visibility». Semrush resta citato *dentro* Brand Visibility (motore di intelligence), non come prodotto a sé. Ferrari/Trenitalia/Max Mara non citavano il prodotto.
- Commit `c306f4a`.

### 17.2 Passata de-AI (copy 100% human, IT+EN)
Riscrittura chirurgica del copy su **tutte e 5 le experience** (45 file, 348+/351−) per suonare umano: em-dash retorici → virgole/due-punti, frasi spezzate/tricolon → periodi naturali, `non solo X ma Y` e value-speak vuoto rimossi. **Invariati**: nomi prodotto/persona, numeri, fonti, claim, codice; lunghezze preservate (±10%) per non rompere l'audit. Ferrari: EN e IT resi entrambi idiomatici (i `<T>` mantengono sempre entrambe le lingue). Build completo OK; **nessuna nuova failure d'audit** (maxmara/ferrari/trenitalia/agos restano 0; unicredit invariato). Memoria: `copy-must-be-human`. Commit `e2b3d8c`.

### 17.3 Comando `/handover`
Nuovo slash command di progetto `.claude/commands/handover.md` (vedi §12): aggiorna questo handover, impone il contratto di dimensione file, splitta per sezione e verifica la leggibilità per una nuova sessione con una `Read` completa. **Questo file è stato splittato la prima volta proprio da questo comando** (>48KB). Commit `c489f9b`.
