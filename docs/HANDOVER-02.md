# Handover — Parte 2 di 2
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 14. Ferrari — sezione `/scoping` (calcolatore di licensing)

`apps/ferrari-racing/src/pages/scoping.astro` (gated dalla solution `scoping`). Pagina customer-facing che modella **volumi e costo di licenza** di **RTCDP Collaboration** (Collaboration Credits) e **CJA** (Rows of Data) — due prodotti indipendenti, due metriche. È uno **strumento** (island interattiva full-bleed), NON una slide-keynote: **esente da `audit:deck`** (`/scoping/` non è nel ROUTE_SET di `scripts/deck-audit.ts`). Doc di riferimento del blocco: **`packages/core/src/blocks/scoping/README.md`** (architettura + come estendere).

> **AGGIORNAMENTO 15 lug 2026 — riscrittura del modello Collaboration.** Il motore RTCDP Collaboration ora **replica 1:1 il calcolatore ufficiale Adobe** «Real-Time CDP Collaboration Scoping Calculator» (workbook interno). Sotto il modello aggiornato; il change log dettagliato è in §18. **CJA è invariato** (non fa parte del workbook).
>
> **AGGIORNAMENTO 15 lug 2026 (pomeriggio) — modello v2 (SKU base + entitlement + istanze partner + refresh mode) e nuova sezione «Casi d'uso».** Il motore ora aggiunge, **sopra** la matematica dei crediti (invariata): SKU Base flat, entitlement per pacchetto (crediti inclusi nettati), **1 istanza Ferrari + N istanze partner**, e una **modalità di refresh legata alle campagne**. Aggiunta la nuova sezione deck **Casi d'uso**. Dettaglio in **§14.9**; change log in **§19**. **Stato: committato e pushato** (commit `a3fc86a`, 15 lug 2026).

### 14.1 Architettura (layer separati)
Tutto in `packages/core/src/blocks/scoping/` salvo i contenuti client:
- **`cost-model.ts`** — motore puro, deterministico, framework-free. **Replica 1:1** il workbook Adobe (`Sales Calculator` + sheet nascosta `Drop Downs, Burn, Assump`). Espone `BURN`/`ASSUMPTION_DEFAULTS` (costanti ufficiali), `audienceFunnel`, `collabParts`, `simpleScopingMatrix`, `recommendedCreditPack`, `ceilingTo`, `computeSnapshot`, `computeBreakdown`, `buildWarnings` + la parte CJA invariata.
- **`scenario.ts`** — `DEFAULT_ASSUMPTIONS` (= default del workbook), `DEFAULT_PRICES` (`pricePerCredit = 5`, prezzo di listino H13), preset id/label, serialize/deserialize **forward-compatible**.
- **`scenario-store.ts`** — persistenza localStorage (anon) + Supabase REST **con refresh automatico del token** (proattivo su scadenza, reattivo su 401 + retry singolo). Espone `remoteEnabled`, `clearSession`, `RemoteError`.
- **`ScopingCalculator.astro`** — shell UI + presenter (island TS vanilla).
- **`ScopingField.astro`** — sub-componente riga input; `data-when` supporta **modalità multiple** pipe-separate (es. `simple|detailed`).
- **`apps/ferrari-racing/src/data/scoping.ts`** — contenuti Ferrari: `FIELD_AUDIT`, `SEED_SCENARIOS`, `METRICS`, `ASSUMPTION_META`, `DISCLAIMER`.
- **Fonte di verità del modello Collaboration**: `docs/Ferrari/Real-Time CDP Collaboration Scoping Calculator.xlsx` (materiale Adobe interno, **git-ignorato** — repo pubblico). Il **PDF dossier** in `docs/Ferrari/` documenta il *vecchio* modello ed è **obsoleto**.
- **Test**: **53 Vitest** (41 cost-model + 5 scenario + 7 scenario-store), che **riconciliano cella-per-cella** al foglio (i 13 nuovi coprono party-cost/entitlement, refresh mode campaign-linked, istanze partner — vedi §14.9).

### 14.2 Modello di calcolo — RTCDP Collaboration (fedele al workbook Adobe)
**Costanti ufficiali** (`cost-model.ts`): `BURN` = management **2** · activation ad-hoc **500** · always-on **100** · measurement **50** (credits per 1M); `ASSUMPTION_DEFAULTS` = match **30%** · reach **50%** · frequency **10×** · conversion **5%** · **$5/credit** (H13).
**Funnel** (rate clamp 0–1): `matched = avgAudienceSize × matchRate` → `impressions = matched × frequency × reach` (per campagna) · `conversions = matched × reach × conversion`.
**Tre modalità** (`collabMode`):
- **detailed** (default): `management = (onboardedIds ÷ 1M) × (365 ÷ refreshEveryXDays) × 2` · `activation ad-hoc = (matched × campaigns × audiences/campaign × 500) ÷ 1M` · `always-on = (matched ÷ 1M) × runs × 100` (runs 0 di default, `alwaysOnRunsPerYear`) · `measurement summary = (impressions ÷ 1M) × summaryReports × campaigns × 50` · `attribution = ((conversions + impressions) ÷ 1M) × campaigns × attrReports × 50`.
- **simple**: matrice campagne `1·3·6·12·24·36`, refresh fisso 365/6 (ogni 6 giorni), ogni voce **CEILING a 10** crediti.
- **direct**: `estimated = max(0, directCredits)`.
- **Nessun allotment annuo** (rimosso il vecchio Prime 2.500 / Ultimate 5.000): il deliverable è il **pacchetto crediti consigliato** `recommendedCreditPack` = totale arrotondato a scaglione **100/500/1.000/5.000** (riga 31 del foglio); `cost = pacchetto × pricePerCredit`.
**Riconciliazione**: detailed default → **1.517,04** crediti (C72: mgmt 1.216,67 + activation 150 + summary 75 + attribution 75,375); simple totali `[1450,1900,2580,3930,6630,9340]` (riga 30); pacchetti `[1500,2000,3000,4000,7000,9500]` (riga 31).

### 14.3 Modello di calcolo — CJA (invariato · prodotto indipendente)
`rows = Σ(web, app, social, crm, events)` · `ingestionLimit = rows × cjaIngestionMultiplier` (guardrail ufficiale ×3) · `cost = (rows ÷ 1M) × pricePerMillionRows`. Breakdown per-sorgente con **peso %**. **Non** fa parte del workbook Adobe.

### 14.4 Trasparenza & auditabilità
`computeBreakdown(assumptions, prices)` restituisce, per ogni riga: **formula simbolica + numeri sostituiti + input usati**, le sorgenti CJA con peso%, e i `warnings`. La UI espone 3 livelli: results bar (summary) → drawer "Mostra il calcolo" (breakdown con formule) → tooltip audit per campo. Ogni variabile ha un **dataType semantico** → badge colorato: `official` (verde) · `default-assumption` (grigio) · `customer-assumption` (blu) · `price`/quote-only (giallo). I burn-rate Adobe sono ora rappresentati come **costanti ufficiali** (`BURN`), non come input tunable. Badge resi con `rgba()` esplicito.

### 14.5 UX
Preset chip (Conservativo/Base/Ambizioso/**Custom** = stato modificato); **select "Modalità di stima"** (Dettagliata/Rapida/Diretta) + **select "Casi d'uso measurement"** (Sì/No — boolean, gestito con special-case in `readInput`); results bar = **Credits stimati · Pacchetto consigliato · Costo** (rimossi billable/allotment); strip **warnings**; **breakdown drawer**; disclosure **"Assunzioni avanzate"** (frequency/reach/conversion, audiences/campaign, report, always-on); **visibilità condizionale** (`appliesWhen`, es. campi measurement solo se `measurementEnabled=true`; `mode` multi per campi simple∧detailed); dot **changed-vs-preset**; export **JSON/CSV**; **Confronta**. Tooltip audit **click-only**. Prezzi = *quote-only* ($5 di listino illustrativo).

### 14.6 Estendere (vedi README del blocco)
Nuova variabile: campo in `ScopingAssumptions` + default in `DEFAULT_ASSUMPTIONS` → usarla in `collabParts`/`cjaSourceRows` + `LineItem` in `computeBreakdown` → registrarla in `FIELD_AUDIT` (`dataType`, `category`, `mode` pipe-separato, `appliesWhen`/`advancedOnly`, `source/calc/assumption` bilingui) → test di riconciliazione. Burn-rate/assunzioni ufficiali = costanti in `BURN`/`ASSUMPTION_DEFAULTS` (non input). Select enum: `input:'select'` + `options`; i boolean (es. `measurementEnabled`) vanno special-cased in `readInput`. Nuova sorgente CJA: estendi `CjaSourceRows['id']` + `cjaSourceRows` + formula/substituted + `FIELD_AUDIT`.

### 14.7 Persistenza, resilienza & Admin
Supabase `scenarios` (`0004_scenarios.sql`, RLS **private/link/team**, `created_by default auth.uid()`); condivisione `?scenario=<uuid>`. **Auth resiliente** (fix 15 lug): lo store legge la sessione completa `edf:sb-session` (`access_token`/`refresh_token`/`expires_at`) e **rinnova il token** — proattivo se vicino a scadenza, reattivo su 401 con **retry singolo** (rispecchia `apps/console`); su refresh fallito **pulisce la sessione morta** e lancia `RemoteError(401)`. Il **Save fa SEMPRE fallback su localStorage** (lavoro mai perso) con messaggi accurati bilingui (sessione scaduta / cloud non disponibile / non configurato / anonimo); **Share** degrada allo stesso modo. `remoteEnabled()` evita una fetch a URL relativo verso l'origin quando il backend non è configurato. Admin: tab opt-in "Modello di licensing" (`showScopingTab`, default false) per baseline prezzi.

### 14.8 GOTCHA (dolori appresi)
- **CI typecheck — `tsconfig.json` obbligatorio per ogni app** (fix 15 lug): senza `tsconfig.json` `astro check` non eredita `astro/tsconfigs/strict` → ~2.000 errori fittizi `ts(7026) JSX.IntrinsicElements`, che facevano fallire il workflow **CI** (mentre **Deploy** restava verde → coppia verde/rosso ingannevole per ogni commit). Ogni nuova app DEVE avere `tsconfig.json` (`extends astro/tsconfigs/strict` + alias `@edf/core`). Aggiunto a `agos-trait-dunion` e `trenitalia-connessioni`.
- **Save "check your connection"** (fix 15 lug): causa = **token JWT scaduto non rinnovato** (lo store leggeva `access_token` grezzo). Il `catch` cieco mostrava l'errore generico **senza fallback** → scenario perso. Vedi 14.7.
- **Astro scoping degli stili**: il blocco `.scoping-*` è `<style is:global>` (selettori `.scoping-`-prefissati, solo su `/scoping/`), perché estraendo il markup in `ScopingField.astro` lo scoped non matchava più.
- La slide del calcolatore **non** usa `data-demo-flex` (riserva il 48% destro → fuori viewport); grid/flex children servono `min-width:0`; clic neutralizzati con `data-deck-nochrome`.
- Memoria `ferrari-scoping-calculator` (aggiornata alla riscrittura xlsx). Dump del workbook: unzip → parse `xl/worksheets/*.xml` (`<c>/<f>/<v>`) + `sharedStrings.xml` (nessuna libreria xlsx nel repo).

### 14.9 Modello v2 — SKU base, entitlement, istanze partner, refresh mode (15 lug 2026, commit `a3fc86a`)
Estensione che risponde a 6 dubbi del cliente sul configuratore. **La matematica dei crediti da funnel (`collabParts`, §14.2) è invariata** — i test di riconciliazione Adobe restano verdi; v2 aggiunge layer *sopra*.
- **SKU Base + entitlement per party** (fedele alla slide Adobe «RT-CDP Collaboration SKUs»): tipo `PartyPackage = standalone | rtcdp-prime | rtcdp-ultimate`; costanti `COLLAB_BASE_SKU` ($20k listino / $5k floor) e `PACKAGE_ENTITLEMENTS` (Ultimate: Base inclusa + 5.000 crediti · Prime: Base inclusa + 2.500 · standalone: Base a pagamento + 0). Helper **`partyCost(estimated, pkg, baseSkuPrice, pricePerCredit)`**: `chargeable = max(0, estimated − inclusi)` → pacchetto sul solo surplus; `baseFee = 0` se inclusa. I crediti inclusi si **nettano** (evoluzione del "no allotment" di §14.2, che valeva per il solo Credits SKU).
- **Istanze partner** (1 Ferrari + N partner): profilo **"partner-tipo"** (campi `partner*` in `ScopingAssumptions`: package, onboardedIds, avgAudienceSize, adHocCampaigns) via `partnerAssumptions(a)` (riusa i rate di Ferrari, varia i volumi) × `partnerInstances`. **CJA resta un'unica istanza Ferrari** (aggrega tutti). Totale Collaboration = Ferrari + N × partner-tipo (Base + crediti ciascuno).
- **Refresh mode** (`refreshMode: continuous | campaign-linked` + `refreshesPerCampaign`): `campaign-linked` → refresh/anno = campagne × refresh/campagna (es. 3 invece di 61 → crediti gestione ~20× più bassi). Risolve il dubbio "perché refresh always-on con 3 campagne/anno". `refreshesPerYear(a)` aggiornato; default `continuous` (base fixture → 365/6 invariato).
- **Default v2** (`DEFAULT_ASSUMPTIONS`): Ferrari = **RTCDP Ultimate** (i suoi ~1.517 crediti coperti dai 5.000 inclusi → Collaboration Ferrari **€0**); partner = **standalone** (Base $20k + pacchetto). Il costo incrementale è guidato dalle istanze partner. Preset: Conservativo (1 partner, refresh campaign-linked) · Base (3 partner) · Ambizioso (8 partner).
- **Chiarezza UI**: nuovo campo `hint` (in `FieldAudit`/`ScopingField.astro`, classe `.scoping-hint`) = caption **inline sempre visibile** sotto l'input (non più solo nel tooltip `i`), su Dimensione audience, Match rate, Campagne ad-hoc, Refresh mode, ecc. Nuova sezione form **"Perimetro & istanze"** in cima alla card Collaboration. Results bar Collaboration riorganizzata: *Istanza Ferrari · Istanze partner · Canoni SKU Base · Totale Collaboration* (nuovi output snapshot `collabFerrari*`, `collabPartner*`, `collabBaseFeeTotal`).
- **Nuova slide** `slide-model` in `/scoping/` («Come si compone il costo» — 4 driver + lettura Ferrari worked, dati `COST_DRIVERS`/`COST_MODEL_SUMMARY` in `data/scoping.ts`); metriche di licensing arricchite (funnel + tipi campagna).
- **Nuova sezione deck «Casi d'uso»** (`apps/ferrari-racing/src/pages/casi-duso.astro`, nav tra Il Loop e Scoping, **non gated**): cover + 4 scenari end-to-end sull'intero perimetro prodotti (RT-CDP Collaboration → GenStudio + Express → Attivazione → CJA) + slide mappa prodotti. Dati `USE_CASES` in `data/scoping.ts`. Cross-nav: loop → casi-duso → scoping. Registrata in `admin.astro` (PAGE_REGISTRY, scoping ora "09") e in `FerrariNav.astro`. **Aggiunta a `deck-audit.ts`** (route set ferrari) → `audit:deck` **0 su 3 viewport**; `scoping` resta **fuori** dal route set (slide-calculator = esenzione interattiva).
- **Verifica**: 53/53 test core verdi; build monorepo 0 errori; sweep `audit:deck` ferrari (8 sezioni + casi-duso) **PASS pulito**; screenshot 1920 letti (slide-model, calculator, use-case, mappa) → type generoso, composizione bilanciata. File toccati: `cost-model.ts` (+178) e `.test.ts` (+116), `scenario.ts`, `data/scoping.ts` (+299), `ScopingCalculator.astro`, `ScopingField.astro`, `scoping.astro`, `casi-duso.astro` (nuovo), `FerrariNav.astro`, `admin.astro`, `loop.astro`, `deck-audit.ts`. Memoria `ferrari-scoping-calculator` (da aggiornare a v2 dopo il commit).

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
- 4 pilastri: **Visibilità AI completa** (10 famiglie LLM, agentic traffic da log CDN) · **Intelligence guidata dalla SEO** (289M+ prompt reali dell'offerta Adobe+Semrush — ma **nel deck UniCredit il numero è stato ammorbidito a "milioni di prompt reali"**, §17.6, perché privo di fonte on-slide, query fan-out) · **Ottimizzazioni su ogni superficie** (edge CDN + at-source + off-site) · **Misurazione ad anello chiuso** (Adobe Analytics + CJA). KPI: brand mentions, citations, agentic traffic, referral traffic.
- **UniCredit `visibilita.astro`**: le due slide (`slide-llm-optimizer` + `slide-semrush`) **fuse** in un'unica `slide-brand-visibility` (layout split, gated `data-solution="brand-visibility"`). Edit puntuali: chip persona Marco → *Adobe Brand Visibility: UniCredit GEO*; CTA scenario → *Dalla storia alla tecnologia*; stat *referral traffic*/*bounce rate*; eyebrow+bullet "momento di Marco"; footer EDS (edge/BYO CDN/standard web); AEM Sites Optimizer (titolo non-overselling + SEO/contenuti/accessibilità/performance).
- **Admin**: `PAGE_REGISTRY` aggiornato (slide fusa) + nuova soluzione attivabile `brand-visibility` (pillar «AI Visibility»). `index.astro` journey sub-label aggiornato.
- **Agos `orizzonti.astro`**: rename «Adobe LLM Optimizer» → «Adobe Brand Visibility». Semrush resta citato *dentro* Brand Visibility (motore di intelligence), non come prodotto a sé. Ferrari/Trenitalia/Max Mara non citavano il prodotto.
- Commit `c306f4a`.

### 17.2 Passata de-AI (copy 100% human, IT+EN)
Riscrittura chirurgica del copy su **tutte e 5 le experience** (45 file, 348+/351−) per suonare umano: em-dash retorici → virgole/due-punti, frasi spezzate/tricolon → periodi naturali, `non solo X ma Y` e value-speak vuoto rimossi. **Invariati**: nomi prodotto/persona, numeri, fonti, claim, codice; lunghezze preservate (±10%) per non rompere l'audit. Ferrari: EN e IT resi entrambi idiomatici (i `<T>` mantengono sempre entrambe le lingue). Build completo OK; **nessuna nuova failure d'audit** (maxmara/ferrari/trenitalia/agos restano 0; unicredit invariato). Memoria: `copy-must-be-human`. Commit `e2b3d8c`.

### 17.3 Comando `/handover`
Nuovo slash command di progetto `.claude/commands/handover.md` (vedi §12): aggiorna questo handover, impone il contratto di dimensione file, splitta per sezione e verifica la leggibilità per una nuova sessione con una `Read` completa. **Questo file è stato splittato la prima volta proprio da questo comando** (>48KB). Commit `c489f9b`. Fix frontmatter + install user-level: vedi §17.5.

### 17.4 Bonifica audit UniCredit (hard → 0)
Passata dedicata sui check **HARD** dell'`audit:deck` unicredit (che aveva ~200 fallimenti, mai stato a 0): `c` (overflow orizzontale / box oltre la safe-inset) 22→0, `e` (text-on-text) 1→0, `j` (clipping fuori viewport) 7→0. 14 slide su 8 sezioni (acquisisci/analizza/b2b/coinvolgi/contenuti/coworker/motore-adobe/risultati), fix in worktree paralleli isolati. Pattern ricorrenti: frecce `absolute -right-2` che sporgono dalle card → tenute dentro (`right-1` + `overflow-hidden`); `min-w-0` su flex/grid children; riduzione gap/padding/densità per far rientrare le slide dense a 1440/1280; numerale display che va a capo. **Vincolo rispettato**: nessun body text < 0.95rem, nessuna slide splittata, nessun nome prodotto/numero/fonte rimosso. Restano **solo soft** `a`/`i`/`g` (totale 170), che il Type & legibility contract vieta di forzare. Metodo di lavoro riusabile: worktree isolati per app condivisa (evita race su `dist/`) + audit full con confronto per-check hard/soft.

### 17.5 Regole vincolanti codificate + /handover globale (commit `ab3fb8b`, `5ed9764`, `b900ca7`)
Le lezioni di questa sessione sono state **generalizzate in istruzioni vincolanti** per tutte le experience future:
- **`CLAUDE.md` → nuova sezione «Working rules — codified from production (BINDING, every experience present & future)»** (auto-caricata ogni sessione, quindi seguita da ogni Exp Design): (1) **Copy voice — 100% human, not AI** (tell da evitare, IT+EN, lunghezza ±10%; memoria `copy-must-be-human`); (2) **Audit discipline — hard vs soft** (HARD `b/c/d/e/f/h/j/k` → 0; SOFT `a/i/g` aspirazionali, **mai** forzati rimpicciolendo il type → cut/split; fix ricorrenti; il parser non conta i mock visivi come massa-testo = limite noto); (3) **Cross-experience propagation** (un cambio prodotto/naming o del motore condiviso si propaga a experience + admin `PAGE_REGISTRY`/`SOLUTIONS` + hub/showcase; verifica vs `docs/*.pptx`; memoria `brand-visibility-product`); (4) **Parallel work su app condivisa → worktree isolati** (build/preview concorrenti corrompono lo stesso `dist/`); (5) **Handover docs leggibili a inizio sessione** via `/handover`.
- **`skills/experience-design/SKILL.md`**: le stesse regole come **checklist attiva** — voce copy in *Content rules (substance)*, disciplina hard/soft + worktree in *Visual self-audit*, e 4 nuovi gate nella *New Client Checklist* (8 copy pass · 9 audit gate · 10 register everywhere · 11 /handover).
- **`/handover` reso robusto e globale** (commit `b900ca7`): risolto il bug del frontmatter (`argument-hint: [check]` era una **lista YAML** → il comando veniva scartato, «No commands match»; ora `argument-hint`/`description` sono stringhe quotate) e comando **installato anche a livello utente** in `~/.claude/commands/handover.md` → disponibile in **ogni sessione e ogni progetto** (oltre alla copia di progetto versionata; in questo repo vince quella di progetto). **Nota operativa**: gli slash command si caricano **all'avvio della sessione** → serve una **nuova sessione** perché `/handover` compaia.

### 17.6 UniCredit — passata copy morbido/credibilità (commit `aabd2d1`)
Round di feedback su Engagement Unlimited (7 richieste puntuali su screenshot). Principio: **più morbido e più credibile**, senza toccare struttura/personas/gating. **Solo gli 11 file `apps/unicredit-engagement/src/pages/*` committati** (i file Ferrari/`packages/core` in working tree erano di §19, lasciati fuori).
- **Cifre non verificabili → qualitativo**: rimosso **"14M clienti"** ovunque (scenario, conosci ×3, risultati footnote, motore-adobe) → *"milioni di clienti / i milioni di profili"*; ammorbidita l'affermazione assoluta *"il profilo completo… ancora non esiste"* → *"…spesso resta parziale"*. Rimosso **"289 milioni di prompt"** (visibilita, 2 occorrenze) → *"milioni di prompt reali"*. Conseguenza: **§5.2 (14M) e §17.1 (289M) aggiornati**.
- **Numeri di risultato inventati → direzione (↑/↓)**, mantenendo l'etichetta del KPI («applica i KPI, non i risultati specifici»): convertiti in **tutte** le sezioni (acquisisci −90%/3×/−40% + Experimentation +34%CTR; coinvolgi 5×/–68%/+41%; b2b 3.2×/+58%/–40%; coworker 3×/−72% + campaigns +34%CTR; analizza €2,3M/15–35%/3.4×; risultati proiezione UniCredit +€45M/–55%/–85% + card −68%/+40%/3× + Sofia +34%CTR/NPS78; visibilita EDS +40%). **Tenuti** perché credibili: benchmark di **banche reali citate** (US Bank 19× ecc. in risultati, con footnote), ricerche esterne **linkate** (Gartner −25%, Adobe Analytics +1200%/−33%), **target pubblici** UniCredit (RoTE >20%) e **meccaniche di scenario** (0,3s, 87/100 propensity, 200ms, "3 prodotti in 6 mesi"). Le card KPI ora mostrano una **freccia display (↓/↑)** + etichetta + sub qualitativo.
- **Next-Best-Action → Next-Best-Experience** in tutta l'experience (conosci ×2 + commento, coinvolgi, b2b, admin `PAGE_REGISTRY`). Scelta la forma **inglese** per coerenza col termine tecnico e col precedente "Next-Best-Action"; l'utente potrebbe preferire l'italianizzato *"Next-Best-Esperienza"* — **(da confermare)**.
- **Obiezione «abbiamo già Salesforce Data Cloud, ma solo per i clienti noti, non per l'acquisition»**: rafforzato il copy della slide di Marco (`slide-storia-conosci`) — RT-CDP parte dal **click anonimo**, ricompone l'identità in tempo reale ed è *"lo stesso motore che serve i clienti storici e che, in acquisition, intercetta chi la banca ancora non conosce"*; rinforzata la card "Acquisizione" della slide Collaboration (prospect net-new/sconosciuti). **Nessun competitor nominato** nel deck.
- **Fix doppio `""`** sul sample push-notification di Coinvolgi (le virgolette erano sia nel dato sia nel template che le riaggiungeva).
- **Bullet Visibilità bilanciati** (`slide-marco-moment`): i 3 bullet resi di lunghezza simile (uno era molto più lungo).
- **Verifica**: build OK; `audit:deck` contro **preview statico** → **0 fallimenti hard** su tutto il deck (restano i soft a/i/g pre-esistenti, non forzati); **screenshot 1920 letti** su tutte le slide toccate (frecce KPI leggibili/coerenti, copy obiezione senza overflow, bullet bilanciati).

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
