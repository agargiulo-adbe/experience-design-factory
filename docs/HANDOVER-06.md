# Handover — Parte 6 di 9
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

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

### 22.3 Fix freccia indietro non esce dal deck verso l'hub — `9c3bd24` (7 set 2026)
Bug: con `localStorage['edf-solutions-*']` valorizzato (tipico dopo l'Admin), la **freccia
indietro** sulla prima sezione portava alla root dell'**hub** `/experience-design-factory/`.
Root cause nel runtime di gating: sulla prima/ultima sezione, senza sezione prev/next
abilitata, il target era `homeFrom(curPrev|curNext)`; ma per la prima/ultima sezione quel
valore è **già** la home dell'app, e `homeFrom` (rimuove l'ultimo segmento di path) ne toglieva
uno di troppo → un livello sopra (l'hub). **Fix**: `homeFrom()` deriva ora la home dal **path
corrente** (`location.pathname` senza lo slug di sezione), che contiene sempre lo slug → mai
overshoot. Propagato alle **7** experience con questo pattern (unicredit/agos/atelier/eni/
maxmara/ferrari/mim); **trenitalia era già corretto** (fallback `b = BASE`). Verificato live.

### 22.4 Due regole BINDING nuove in `CLAUDE.md` — `e45d5e5` (7 set 2026)
Codificate nella sezione «Working rules» di `CLAUDE.md` (ogni experience presente+futura):
- **Home roadmap = blocchi della stessa grandezza in griglia bilanciata**: le card capitolo
  della home devono essere equal-size (largh.+altezza) — 6 capitoli → **2 righe da 3** — via
  `auto-rows-fr` sulla griglia + `h-full` sulle card, senza colonne che lascino l'ultima riga
  sbilenca (NO `md:grid-cols-4` per 6). Esenti i paradigmi non-card: stepper numerato maxmara,
  timeline a nodi trenitalia, pillars mim. Applicato a unicredit/eni/agos/ferrari.
- **`<title>` senza self-duplication**: `BaseLayout` fa `{title} | <SiteName>` e la home passa
  `title`=nome sito → "SiteName | SiteName" (inquina il link-preview, che legge `<title>` in
  assenza di tag OG). Guard: `title === SiteName ? title : \`${title} | SiteName\``, su tutte le
  layout + showcase. Correggeva unicredit/maxmara/agos/trenitalia/eni.
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
