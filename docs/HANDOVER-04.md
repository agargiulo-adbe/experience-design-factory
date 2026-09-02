# Handover — Parte 4 di 4
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

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

---

## 27. UniCredit — Attribution al centro di «Analizza» + Dossier Attribution login-gated (2 set 2026)

Commit `9d308de` → `d2f67ba` → `45cfcdf` → `a19516f` → `f03c343` (tutti su `main`). **Fonti riservate**: meeting **Giancarlini** 24/07 (`docs/UniCredit/`, git-ignored) + deep-research 2/09; dossier MD completo `docs/UniCredit/DOSSIER-UNICREDIT-ADOBE.md`. Spec `docs/superpowers/specs/2026-09-02-unicredit-analizza-attribution-design.md`. Memoria `unicredit-attribution-adobe-day`.

### 27.1 Tesi (dal meeting Giancarlini)
- **Attribution ufficiale = last-touch**, di **Group Data Office** (sistema **COR**), blindata → CJA non la sostituisce, la **affianca** (vista complementare).
- **Gap**: il **lead-to-sale non è misurato** (peso di app/filiale/contact-center/agenti su una vendita attribuita a un solo canale).
- **Finestra**: la **riconciliazione** (dati Adobe → **Palantir Foundry**, chiude 2026, owner **Giancarlini**) abilita l'**attribution marketing multitouch MTA+MMM** di **Christoph Ramler** (pluriennale; scelta tech **aperta**: CJA / Marketing Campaign Analytics vs build custom). *«The time is now».* Leva commerciale: **cost-per-click → cost-per-sale**.

### 27.2 Deck «Analizza» — 2 slide nuove + riordino + bonifica audit
- `slide-lasttouch` («Il last-touch dice chi. Non dice come.»): report ufficiale (un canale, last-touch) **vs** vista complementare CJA (barre-peso app/contact center/filiale).
- `slide-costpersale` («Pagare il marketing sulle vendite, non sui click.»): **MTA vs MMM** complementari, causali con l'incrementalità, «diventa un contratto, non una disputa».
- Riordino sezione; card **Attribution** in testa al use-case bancario; ritocco lead della cover. Registrate nel `PAGE_REGISTRY` di `admin.astro`.
- **Audit**: sezione «Analizza» resa **HARD-clean** su 1920/1440/1280. Baseline pre-esistente = **38 failure con HARD** su cxa-brand/banking/llm-mix (verificato con `git stash`); bonificate riducendo copy/densità (tolto pannello CMO da cxa-brand, footnote da llm-mix, card compatte banking, ecc.), **mai il type sotto i minimi**. Residui = 35, tutti **soft** (`a`/`g`/`i`). Screenshot 1920 letti. **Taglio scelto dall'utente: «esplicito e pubblico»** (deck pubblico con la direzione UniCredit esplicita).

### 27.3 Dossier Attribution `/dossier/` — login-gated, bilingue IT/EN, PDF
- Pagina **unica** (merge dossier+war-room): **orfana** (non in nav) + **`noindex`**.
- **Sicurezza (scelta dall'utente: «contenuti in Supabase con RLS»)**: il contenuto riservato (nomi, roster, strategia) **NON è nel bundle statico** → vive in **Supabase `restricted_docs`** (jsonb) protetto da **RLS** (read = super admin **OR** ruolo su `unicredit-engagement`; write = super admin), caricato via `fetch` con **Bearer token** dopo login. Sessione **condivisa same-origin** col Console (`localStorage['edf:sb-session']`). Migration **`0008_restricted_docs.sql`** (applicata al DB remoto 2 set via SQL editor). L'accesso si **«attiva» da `/console/users/`** assegnando il ruolo `unicredit-engagement` (o super admin).
- **Bilingue IT/EN** (toggle; contenuto renderizzato client-side dal JSON, ogni campo `{it,en}`) + **download PDF** (`window.print()` con print stylesheet: fondo bianco, ink scuro, niente chrome).
- Contenuto: **10 sezioni** (tesi · modello as-is · le 2 tracce · mappa org con link LinkedIn · big ideas · Adobe Day · CJA vs Foundry · dire/non-dire · evidenze · fonti).
- **Verifica**: build ok; **zero segreti nel bundle** (nomi + LinkedIn = 0 occorrenze nell'HTML statico); sintassi JS del gate ok; `noindex` presente. Il **render è poi stato provato live** via lo shared-link (§27.7); resta solo il QC dello specifico path login super-admin → **P2 §10**.

### 27.4 Gotcha tecnici
- **Stili `is:global` obbligatori**: il contenuto è **iniettato via JS** (`createElement`), quindi i nodi **non hanno `data-astro-cid`** → gli stili `<style>` **scoped** di Astro (compilati in `.ur-*[data-astro-cid]`) **non li colpiscono** → testo scuro su fondo scuro, invisibile. Fix: `<style is:global>` (classi prefissate `.ur-*`). Stessa famiglia di gotcha già vista sullo showcase (scoped-style su nodi non-Astro).
- **`noindex`** aggiunto come prop al `BaseLayout.astro` di UniCredit (prima non c'era; ora `{noindex && <meta name="robots" content="noindex, nofollow">}`).

### 27.5 Adobe Day (dal thread «[UniCredit] Adobe & ACN next steps», girato dall'owner)
Workshop UniCredit **co-Adobe + Accenture**, target **settimana del 14/09/2026**, **on-site** dal cliente, **dry-run 7/09**, mezza giornata; sponsor **Cristina D'Ambrosio** (Head of Retail Digital Channels) **+ IT**; agenda oggi **demo-led** → spingere l'attribution a filo conduttore. Roster completo (Adobe: Vegliante lead, Pellerei, Pagnanelli, Gordiani, Lapiccirella, Gargiulo; ACN: Negri, Magnani, Parri, +Cerutti) **nel dossier MD riservato**, non sulla pagina. Bloccato sul **MYP** del cliente. La casella `agargiulo@adobe.com` **non è collegata** a questa sessione (Gmail connesso = personale) → la ricerca posta l'ha fatta l'owner girando il thread.

### 27.6 Aperti
- **QC login super-admin specifico** (click PDF/LinkedIn) — il **render + i18n + contenuto** sono **già provati live** via lo shared-link (§27.7, stesso `render()`); resta solo lo specifico path login — **P2 §10**.
- **Loretta Del Monte** — omonimia da confermare (profilo LinkedIn Risk/P&L ≠ ruolo riconciliazione) — **P2 §10**.
- **Reference bancarie Adobe EMEA/Italia** — la deep-research non ne ha confermate di pubbliche → chiudere con Industry team.

### 27.7 Deck bilingue IT/EN + Dossier unlisted secret-link (agg. 2026-09-02, dal più recente)
**Deck UniCredit ora bilingue IT/EN** (Ferrari-parity, **IT default**; commit `0cd4848`). Retrofit di **tutte le 13 sezioni + `UniNavigation`** a `<T en it>` con **LangToggle** in nav (desktop + mobile). IT tenuto **verbatim**; EN idiomatico umano (rubrica `copy-must-be-human`), lunghezze ±10%; **nomi prodotto/persona (Marco/Sofia/Adriana)/numeri/fonti invariati** in entrambe le lingue.
- **Infra** (le stesse per qualunque retrofit bilingue): `<html data-lang="it">` + anti-flash init in `BaseLayout` (default IT, EN opt-in), regole display `html[data-lang]` in `global.css`, persistenza su `localStorage['edf:lang']` (chiave condivisa col dossier).
- **Gotcha `CoverHero`**: NON è `<T>`-aware (`title` via `set:html`, ma `eyebrow`/`lead` sono testo escaped). Cover rese bilingui con **due `<CoverHero>` in `<span data-lang-it|en class="contents">`** (l'i18n CSS nasconde l'inattivo; `.contents` non altera il layout) — oppure markup inline `<T>`. 5 cover erano rimaste IT-only dai subagent → uniformate.
- **Testo JS-injected**: la headline dinamica della home (`data-edf-chapters`, conteggio capitoli) va resa bilingue **nel suo script** (entrambi gli span `data-lang-en|it` nel DOM, riempiti con i number-word EN + IT), non con `<T>` (il `textContent` la clobbererebbe).
- **Audit bilingue**: `<T>` rende entrambe le lingue ma l'inattiva è `display:none` → l'audit misura solo l'attiva. Aggiunta opzione **`DECK_LANG=en|it`** a `scripts/deck-audit.ts` (setta `edf:lang` prima del load) per auditare la vista EN. Metodo: **baseline-compare** (stash→build→audit originale, poi diff HARD). Esito: **FINAL IT HARD == baseline** (0 nuovi hard; 158 tot vs 170), **EN HARD ⊆ baseline** (152 tot). I 5 tip marginali introdotti in EN/IT (`c` past-inset su home-journey/nba/costpersale/llm-mix; `b`+`c` su persona) risolti con spacing/`min-w-0`/`break-words`, **mai** type sotto i minimi. 6 slide EN lette a 1920. Spec `docs/superpowers/specs/2026-09-02-unicredit-bilingual-en-design.md`. Memoria `unicredit-bilingual`.

**Dossier `/dossier/` — unlisted secret-link (no login)** (commit `c17d37d`+`ccd0373`). Per condividere il dossier riservato coi colleghi **senza login** ma **senza renderlo pubblico** (scelta utente: "rischio minimo, attrito alto"). Migration **`0009_restricted_doc_share.sql`** (applicata al DB remoto via `supabase db query --linked`):
- colonna `restricted_docs.share_token uuid` (unique quando valorizzata) + RPC **`get_shared_doc(p_token uuid)` `SECURITY DEFINER`** (`grant execute to anon`) che ritorna **solo `content`** per il token esatto (`null` token non matcha mai). **RLS invariata** — la RPC è l'unico escape hatch stretto e auditabile.
- La pagina legge **`?t=<uuid>`**: presente → `POST /rest/v1/rpc/get_shared_doc` con l'anon key, **nessun login**; assente → gate login/RLS classico (§27.3). Resta **`noindex`** e il contenuto **non è nel bundle** → link-only, non indicizzabile.
- **EN di default** sul path token (`ccd0373`): colleghi internazionali; login/deck restano IT; override `?lang=en|it`.
- **Revoca/rotazione**: `update restricted_docs set share_token = gen_random_uuid()` (nuovo link, vecchio morto) o `= null` (disabilita) `where slug='unicredit-attribution'`. Il **token è un segreto** (mai in repo/handover): leggerlo con `supabase db query --linked "select share_token …"`.
- **Verificato E2E live**: render col token in browser pulito (nessuna sessione), gate login senza token, RPC → null su token errato, `noindex` presente. Caveat accettato dall'utente: chi ha il link può inoltrarlo (trust link-based); il doc si auto-dichiara «non far circolare fuori da Adobe».

---

## 28. Alfabeti — Ministero dell'Istruzione e del Merito (MIM) (2 set 2026)

**App**: `apps/mim-alfabeti` · base `/mim-alfabeti/` · commit `fadb1e3` (prodotta da una sessione precedente, non in questa). Deck immersivo per il **MIM**: la **comunicazione al personale** (AEP/AJO/CJA), le **competenze / IA sicura**, l'**accesso** come esperienza istituzionale. **IT default + toggle EN**; palette **light istituzionale** (carta/blu, display **Titillium Web**).
- **8 sezioni**: `index` + `accesso`, `competenze`, `domanda`, `persone`, `realta`, `rotta`, `voce` (+ `admin`).
- **Doppio uso client/interno**: la sezione **«realtà»** è **gated dalla soluzione `interno`** — spenta di default per la versione cliente, accesa per la lettura interna.
- **Registrazioni**: `deploy.yml` (merge+verify), `factory-hub`, `scripts/deck-audit.ts` (ROUTE_SET), root scripts. **NON** seedata nella console Supabase (**P2 §10**, come Eni).
- `audit:deck` **0 fallimenti hard**. **Dossier strategico bilingue** in `docs/` (git-ignored, non nel repo — cfr. dossier MIM già citato nella memoria `mim-adobe-prep`).
