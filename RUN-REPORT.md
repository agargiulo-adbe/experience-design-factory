# Run Report — Experience Design Factory

## Status: Phase J — Visual feedback loop + check a–l (invarianti) + HowItWorks overlay centrato (in revisione) ⏳
**Started:** 2026-06-15 ~22:45 CEST
**Phase D completed:** 2026-06-16 ~00:30 CEST
**Phase E completed:** 2026-06-16 — tutte le 8 pagine immersive, GitHub allineato, build + typecheck verdi
**Phase F:** 2026-06-16 — SOLO Acquisizione trasformata in deck da proiezione; in attesa di revisione prima di propagare
**Phase G:** 2026-06-16 — pipeline asset programmatica (manifest → Pexels + sharp → MediaSlot); in attesa di revisione
**Phase H:** 2026-06-16 — Acquisizione rifinita come riferimento d'oro del deck (persona-led + area sicura); in attesa di revisione
**Phase I:** 2026-06-16 — cover cinematografica, layer "Come funziona", correzioni di sostanza (Whitney, fonti); in attesa di revisione
**Phase J:** 2026-06-16 — Claude Code "vede" il proprio output e si auto-corregge sui difetti di layout del deck a 1920×1080; in attesa di revisione

---

## Phase J (estensione 2) — invarianti strutturali (j–l) + HowItWorks overlay centrato

I check (a–i) erano ancora troppo deboli: 0 FAIL ma il pannello "Scopri come" da aperto
poteva uscire/clippare. Il check (f) verificava la FORMA del pannello, non il RISULTATO.

**Invarianti aggiunte** (`scripts/deck-audit.ts`), valgono per ogni elemento renderizzato
(slide E pannelli aperti):
- **(j)** niente clipping: ogni elemento significativo interamente dentro [0,0,1920,1080] (±1px).
- **(k)** niente scroll nascosto: nessun container con `scrollHeight > clientHeight` (in un
  keynote non si scrolla — se non entra è un difetto di design, non da nascondere in overflow).
- **(l)** trigger non ostruito: da pannello aperto, gli interattivi sono o sotto lo scrim del
  tutto o pienamente visibili, mai a metà.
Il check (f) sullo stato APERTO ora include j+k sul pannello e su tutto il suo testo.

**HowItWorks ridisegnato** (causa alla radice): il laterale a piena altezza con 3 paragrafi
densi era fragile (non entra in 1080px). Ora **overlay CENTRATO**: riquadro `w=min(720px,60vw)`,
`max-height: calc(100dvh - 2*--slide-safe-inset)`, scrim a tutto schermo, contenuto che **entra
senza scroll**; copy dei pannelli **accorciato** a forma essenziale (nomi Adobe in contesto),
leggibile da proiezione. Pannello+overlay spostati in `<body>` (vero fixed top-level).

**Verifica**: `audit:deck` → **0 FAIL, 8 slide, check a–l**, pannelli testati da aperti.
Conferma visiva a 1920×1080 in **NORMAL motion** (screenshot Playwright): pannelli (slide 3 e 6)
**interi, centrati, dentro viewport, niente scroll, niente testo tagliato**; payoff e data-lake
da chiuse ok. `pnpm build` + `pnpm typecheck` verdi.

---

## Phase J (estensione) — check più severi (a–i) + cause profonde

I 4 check iniziali erano troppo deboli: 0 FAIL ma slide visivamente rotte. Estesi a **9
check** (a–i) → tornano a fallire dove è rotto, poi loop di auto-correzione fino a 0 FAIL reali.

**Nuovi check** (`scripts/deck-audit.ts`): (e) collisione testo-su-testo; (f) **pannello
slide-over testato da APERTO** (lo script apre ogni HowItWorks e ri-misura: top-level fixed,
ancorato al bordo, scrim a tutto schermo, larghezza ≤min(440px,38vw)); (g) ritmo verticale
≥16px tra blocchi; (h) contrasto WCAG AA di bottoni/CTA (bg compositato); (i) uso dello spazio
≥45% altezza utile + centro di massa centrale.

**Cause profonde trovate e corrette** (non patch superficiali):
- **Layering CSS**: reset `* { margin:0 }` + `a { color }` erano UNLAYERED → battevano le
  utility Tailwind (`mb-*`, `text-*`) → niente ritmo verticale, CTA illeggibile (avorio su
  cammello). Spostato in `@layer base`. Questo da solo ha risolto difetto 4 e parte del 3.
- **Centratura**: `Slide` ora centra sul **centro del viewport** con riserva simmetrica della
  banda chrome → la fascia [30,70] (a) e il target ≥45% (i) diventano compatibili.
- **HowItWorks**: da aperto sposta pannello+overlay in `<body>` (esce dal contesto trasformato
  della slide → vero overlay fixed top-level con scrim). Risolve difetto 1.

**Correzioni per slide** (loop a–i): payoff (75% separato dalla riga; CTA dark/avorio AA;
respiro), "Parlarle la sua lingua" + apertura (ritmo verticale), data-lake (split bilanciato +
campo dati persistente + profili più grandi + caption — la viz usa lo spazio), trigger `tone`
AA, cover/apertura dimensionate per (i). Mockup IG verificato intero.

**Esito**: `audit:deck` → **PASS, 0 FAIL** su tutte le 8 slide con i 9 check, pannelli testati
da aperti; `pnpm build` + `pnpm typecheck` verdi. Conferma visiva (screenshot Playwright) di
payoff, data-lake, "Parlarle la sua lingua", e pannello HowItWorks aperto: corrispondono ai check.

---

## Phase J — Visual feedback loop + auto-correzione layout

### Stadio 1 — Gli "occhi" (Playwright, locale e gratuito)
- Installato **Playwright MCP** (`claude mcp add playwright …` → Connected) + binari
  Chromium (`npx playwright install chromium`). Nessun blocco di rete @adobe.com.
- `CLAUDE.md`: blocco **"Deck visual contract"** — API dei componenti deck, brief
  quiet-luxury, e la checklist dei 4 difetti.

### Stadio 2 — Check DOM deterministici + loop di auto-correzione
- **`scripts/deck-audit.ts`** (Playwright headless, 1920×1080, reduced-motion per layout
  stabile): naviga le 8 slide, misura i bounding box, stampa PASS/FAIL per slide+check,
  salva screenshot SOLO per le slide che falliscono (`audit/acquisizione/<id>.png`), exit≠0
  se almeno un FAIL. Script `audit:deck`. I 4 check: (a) testo nella fascia centrale
  [30%,70%]; (b) nessuna collisione col chrome; (c) margini ≥ `--slide-safe-inset` + niente
  overflow; (d) niente testo sui volti (`data-no-text`) + scrim obbligatorio sopra le immagini.
- **Loop eseguito**: 21 FAIL → 0 FAIL su tutte le 8 slide. Bug trovati e corretti nel sorgente:
  1. Padding area-sicura non applicato (Tailwind non genera `max(var(...))`) → spostato in
     inline style su `Slide`; contenuto **centrato verticalmente** (`justify-center`).
     Risolve "testo troppo in alto", "margini mancanti" e "testo coperto dai bottoni"
     (banda chrome riservata in basso).
  2. Slide 3 (data-lake) era stacked title+visual+lead → **convertita in split** (testo
     centrato nella fascia, viz nella colonna). 
  3. Slide 1: aggiunto `data-scrim` sull'atmosfera (testo-su-immagine richiede scrim).
  4. `MediaSlot.noText` (zone `data-no-text` su volti/soggetti) su ritratti + post IG.
  5. Fix del check (b): selezionavo anche il root `[data-deck-next]` (full viewport) → ora
     solo i `button[...]` del chrome.

### Token di area-sicura
`global.css`: `--slide-safe-inset` (gutter su tutti i lati) e `--deck-chrome-safe` (banda
bassa riservata al chrome), in px fissi così `deck-audit.ts` può leggerli.

### Verifica Phase J
- `pnpm build` (8 pagine) e `pnpm typecheck` **verdi**.
- `pnpm --filter generazioni-maxmara audit:deck` → **PASS, 0 FAIL** su tutte le 8 slide.
- Conferma visiva (screenshot Playwright) di cover, data-lake e payoff: layout pulito,
  testo nella fascia, margini, contrasto su cammello, volti protetti.
- **In attesa di revisione: NON propagato alle altre fasi.**

---

## Phase I — Acquisizione: sostanza + due pattern globali

### Correzioni di contenuto (verificate, con fonte)
- **Tema/titolo**: "Ringiovanire il target" → **"Una relazione che attraversa il tempo"**
  (sottotitolo "Incontrare una nuova generazione, onorare chi sceglie Max Mara da sempre").
  Più on-brand del gergo; il senso strategico (giovani + LTV) resta nel copy.
- **Prodotto-eroe = Whitney Bag** (NON Monogram) ovunque. Manifest: slot rinominato
  `monogram-post` → `whitney-post`, query "structured leather handbag camel minimal",
  grade editorial. Caption IG: "Whitney Bag. Dieci anni, senza tempo." Orfano rimosso.
- **Fonti corrette**: 75%/Gen Z → **Bain & Company / Altagamma**; +306% LTV connessione
  emotiva → **Motista, *Leveraging the Value of Emotional Connection for Retailers*, 2018**
  (corretto su Home/Persona/Loyalty, NON Harvard). Micro-fonte leggibile sotto ogni dato.

### Nuovo componente — `CoverSlide.astro` (slide 0)
Apertura cinematografica quiet-luxury: fondo cammello, **filo sartoriale** che si disegna
(stroke-dashoffset ~1.5s) e collega i wordmark **Max Mara** (primario) e **Adobe** (discreto)
che convergono; tagline + eyebrow co-brand. Animazione su `[data-cover]` in `animations.ts`
(prepareSlide/playSlide), reduced-motion safe, parte all'attivazione.

### Nuovo pattern — `HowItWorks.astro` (layer "Come funziona")
Affordance discreto "Scopri come →" che apre un **pannello slide-over da destra** con la
tecnologia in **linguaggio piano** (prodotti Adobe in contesto). Apertura ~350ms, chiusura
con Esc / × / click-fuori, **focus-trap**. Non cambia slide; mentre è aperto setta
`data-deck-lock` sul deck → il controller sospende la navigazione e nasconde il chrome.
È **opzionale**: il deck si capisce anche senza aprirlo. Due layer su Acquisizione:
(a) "Dal data lake ai profili" (Real-Time CDP, integrazione coi sistemi esistenti, clean
room privacy-safe); (b) "Contenuti on-brand a scala" (GenStudio + Firefly, content supply chain).

### Stack esteso in contesto (discreto)
Clean room / Data Collaboration e messaggio "il CRM non si sostituisce, si collega"
(potenziamento, non rip-and-replace per il CMO) — come attribuzioni leggere e nei layer
HowItWorks, mai come lista. La vetrina completa resta su "Il Motore Adobe".

### Verifica Phase I
- `pnpm build` (8 pagine) e `pnpm typecheck` **verdi**; `pnpm assets:build` rigenera 4 slot
  (incl. `whitney-post`) + provenance, committati.
- Struttura build: **8 slide** (cover + 7), 1 `data-cover`, **2 pannelli HowItWorks**
  (`role=dialog`) + 2 trigger, 5 `<picture>` reali, **0 ref "Monogram"**, fonti corrette,
  caption Whitney, tutto il copy presente.
- **Limite onesto:** la verifica *visiva/interattiva* a 1920×1080 fullscreen (cover animata,
  apri/chiudi pannello fluido, reduced-motion, nessun clipping) non è automatizzabile qui —
  validati struttura, build, typecheck e la logica di lock/focus-trap. **In attesa di revisione.**

---

## Phase H — Acquisizione golden-reference (deck persona-led)

Rifinitura SOLO di Acquisizione come **riferimento d'oro** del deck. Il racconto ora
**segue Giulia** (29, la nuova cliente); Francesca (52) è il filo verso le fasi successive.

### Regole incardinate nei componenti riusabili
- **Area sicura assoluta** (in `Slide.astro`): contenuto centrato verticalmente entro il
  viewport meno ~8% margini, height-constrained (`max-h-full` + `min-h-0`), **MAI clipping**.
  Se non ci sta → **splittare in due slide**, non comprimere. Slot `backdrop` per i layer
  full-bleed (atmosfera + scrim).
- **Nav del sito rimossa** in presentazione: solo chrome minimo del deck.
- **Spina narrativa persona-led**: si segue Giulia; Francesca compare come filo (nei profili).
- **Prodotti discreti in contesto** (attribuzioni leggere mentre la piattaforma agisce),
  **mai lista-catalogo**. La rivelazione completa dello stack resta su "Il Motore Adobe".
- **Ritratti persona uniformi**: `persona-francesca` grade `editorial` (a colori, come Giulia).

### Nuovo componente engine
- **`InstagramPost.astro`** — post IG credibile dentro il phone (header + "· Sponsorizzato",
  immagine via `MediaSlot(monogram-post)`, azioni, "Mi piace: 2.418", caption, "84 commenti"),
  dimensionato per stare intero nell'area sicura. Sostituisce il vecchio mockup.

### Beat sheet (7 slide)
1. Apertura (01 + "Ringiovanire il target" + atmosfera duotone con scrim) · 2. Giulia, il volto
(ritratto) · 3. Il problema → profili (data-lake → Giulia + Francesca) · 4. Front stage: la
scoperta (InstagramPost) · 5. Front→back: l'aha (impulso arioso) · 6. Come — prodotti in
contesto (GenStudio/Firefly, Real-Time CDP; 2 righe narrative, non lista) · 7. Payoff + filo
(75% count-up, testo scuro su cammello, chiusura relazione, CTA → Engagement).

### Asset reali
La `PEXELS_API_KEY` è stata fornita ed eseguito `pnpm assets:build`: i 4 sorgenti
(`acquisizione-atmosfera` duotone, `monogram-post`/`persona-giulia`/`persona-francesca`
editorial) sono stati generati e **committati** con `provenance.json`. Il sito ora builda
con immagini reali; gli slot eventualmente vuoti userebbero comunque i placeholder.

### Verifica Phase H
- `pnpm build` (8 pagine) e `pnpm typecheck` **verdi**.
- Struttura build: 7 slide, 7 `slide-inner` (area sicura), 5 `<picture>` reali, InstagramPost
  con testi esatti, tutto il copy del beat sheet presente.
- **Limite onesto:** la verifica *visiva* a 1920×1080/fullscreen (sta-intera, niente clipping,
  respiro, transizioni live) non è automatizzabile qui — verificate struttura, area-sicura,
  build e typecheck. **In attesa della tua revisione prima di propagare.**

---

## Phase G — Pipeline asset programmatica

Obiettivo: riempire TUTTE le immagini da un manifest, con **un comando**, senza
selezione manuale. Gratuita, IP-safe (Pexels License), riusabile per la Factory.

### Pezzi
- **`packages/core/src/assets/types.ts`** — `AssetSlot` tipizzato (`stock|aigen|code`,
  aspect, width, grade, alt) + helper geometria/orientamento (condivisi da manifest,
  componente e script).
- **`apps/generazioni-maxmara/assets.manifest.ts`** — slot per-cliente. Scaffold
  Acquisizione: `acquisizione-atmosfera` (16:9), `monogram-post` (4:5), `persona-giulia`,
  `persona-francesca` (4:5), `acquisizione-datalake` (`code`, visual in codice).
  Estendibile per fase (esempi commentati engagement/loyalty).
- **`scripts/build-assets.ts`** (Node+TS via `tsx`, **riusabile tra clienti**):
  `stock` → Pexels (orientamento coerente con l'aspect, risoluzione più alta, download);
  `aigen` → FLUX locale via `mflux` (salta con warning se assente); `code` → no-op.
  Color-grade **alla palette del brand** con `sharp`: `editorial` (desat leggera +
  bilanciamento caldo verso cammello + contrasto S-soft), `duotone` (luminanza
  testa-di-moro → avorio), `none`. Crop all'aspect, **sorgente webp ~2400px** in
  `src/assets/generated/<id>.webp`, **`provenance.json`** (fonte, autore/URL, licenza,
  query/prompt). Idempotente.
- **`assets.index.ts`** — loader `id → ImageMetadata` via `import.meta.glob`, con
  **fallback a placeholder** se il file non esiste (`mediaProps(id)`).
- **`MediaSlot.astro`** (engine) — `<Picture>` AVIF/WebP responsive, lazy, `alt` dal
  manifest, OPPURE placeholder duotone nella palette. Usato per phone (post Monogram),
  atmosfera hero, ritratti persona (Acquisizione + pagina Persona).

### Sicurezza & deploy
- Chiave `PEXELS_API_KEY` **solo a build-time locale**: letta da `.env` (gitignored,
  con `.env.example`), mai esposta al sito statico né alla CI. La generazione è uno
  **step locale deliberato**; gli output webp sono **versionati** così il sito builda
  senza chiave. Deploy/CI invariati, nessun segreto aggiunto.
- Comando: `pnpm assets:build` (root → app → `tsx scripts/build-assets.ts`).

### Verifica Phase G
- `pnpm build` (8 pagine) e `pnpm typecheck` **verdi** (con `generated/` vuota → placeholder).
- Guard senza chiave: messaggio chiaro + exit 1 (testato).
- Pipeline `sharp` testata su immagine sintetica: grade `editorial`/`duotone`/`none` +
  crop 2400 → webp validi (fix: `duotone` usa `modulate({saturation:0})` per mantenere
  3 canali, `grayscale()` collassa a 1 e `linear` non espande le bande).
- Path "riempito": inserito un webp sintetico → Astro emette `<picture>` AVIF+WebP
  responsive; poi rimosso (niente immagini finte committate).
- **Limite onesto:** non ho una `PEXELS_API_KEY`, quindi non ho potuto eseguire il
  fetch reale né committare i sorgenti generati. La pipeline è pronta: con una chiave
  valida, `pnpm assets:build` riempie gli slot `stock` e produce sorgenti tonalmente
  coesi; gli slot non riempiti mostrano placeholder. **Da eseguire localmente con la
  chiave, poi committare `src/assets/generated/*.webp` + `provenance.json`.**

---

## Phase F — Deck da presentazione (keynote), solo Acquisizione

Cambio di paradigma: non un sito da scrollare ma un **deck da proiettare in sala
riunioni**. Aggiornati i componenti riusabili in `packages/core/src/blocks/immersive/`
così il pattern potrà propagarsi; **StepContainer/Step restano intatti** per le altre
7 pagine finché non si propaga.

### Nuovi componenti riusabili
- **`DeckContainer.astro`** — wrapper keynote (`fixed inset-0`, niente scroll). Chrome
  minimo auto-nascondente: indicatore `01 / 06`, prev/next, fullscreen. Tipografia da
  proiezione come classi globali (`.slide-title`, `.slide-lead`, `.slide-eyebrow`,
  `.slide-num`) con clamp dimensionati per lettura a 4–8 m.
- **`Slide.astro`** — singola slide a schermo pieno, area di sicurezza ~8% (`px-[8vw] py-[8vh]`).
- **`deck.ts`** — controller presentatore: frecce ←/→/↑/↓, barra spaziatrice,
  PageUp/PageDown, Home/End, **click metà destra/sinistra**, **swipe touch**,
  **fullscreen** (tasto `F` + bottone). Transizione **orizzontale ~500ms ease-in-out**,
  **cross-fade** con `prefers-reduced-motion`. Indicatore di avanzamento + controlli
  auto-nascondenti (idle 2.6s → cursore nascosto). Dall'ultima slide, `→` passa alla
  **fase successiva (Engagement)** con dissolvenza. Re-init/teardown su View Transitions.
- **`animations.ts`** — aggiunti `prepareSlide()` (stato pre-animazione) e `playSlide()`:
  le animazioni partono **quando la slide diventa attiva** (non allo scroll) e fanno
  **replay** alla rivisitazione. Coprono reveal/stagger/count-up/pulse + data-lake con
  **convergenza reale** (dot con `data-dx/dy` che convergono al centro). Le metafore
  delle altre pagine avranno il loro handler deck al momento della propagazione.

### Acquisizione ridisegnata per la proiezione
Tipografia grande (titolo `clamp(3rem,6vw,6rem)`, lead `clamp(1.5rem,2.4vw,2.25rem)`,
niente testo < ~1.15rem), alto contrasto, visual che **riempiono il frame 16:9**, una
idea per slide. Fix per-slide: (1) via "Scorri", "01" forte, titolo enorme, una riga;
(2) data-lake molto più grande con convergenza cinematografica; (3) phone mockup grande
e realistico (post stile social riconoscibile); (4) impulso grande/centrale, card
ingrandite; (5) 5 prodotti con nomi grandi e descrizioni di 4–6 parole, reveal uno alla
volta; (6) payoff con **testo scuro su cammello** (contrasto risolto), count-up 75%,
→ fase successiva. **Nav del sito rimossa** in presentazione (chrome minimo).

### Verifica Phase F
- `pnpm build` (8 pagine) e `pnpm typecheck` **verdi**.
- Struttura del build verificata: 6 slide, `data-deck`, `data-deck-next` → engagement,
  chrome progress, tipografia `.slide-*`, selettori animazione presenti; controller deck nel bundle.
- **Limite onesto:** la verifica *dal vivo* in browser (transizioni, tasti, fullscreen,
  impatto/leggibilità a 1920×1080 e a distanza) non è automatizzabile in questo ambiente
  (nessun browser headless installato). Verificati struttura, build, typecheck e la logica
  del controller per revisione. **In attesa della tua revisione prima di propagare.**

---

---

## Design Decisions

### Color Palette (Generazioni / Max Mara)
| Token | Hex | Role |
|-------|-----|------|
| cammello | `#C19A6B` | Brand signature, primary accent |
| marrone-caldo | `#6B4F3A` | Deep warm brown, headings |
| testa-di-moro | `#3E2C20` | Darkest, high-contrast text |
| avorio | `#F5F0E6` | Primary background |
| sabbia | `#E8DFD0` | Secondary background, cards |
| nero | `#1A1A1A` | Body text, UI elements |
| oro | `#B8975A` | Rare accent (CTAs, highlights) |

### Typography
- **Display:** Cormorant Garamond (Google Fonts, OFL license) — high-fashion serif with Italian elegance
- **Body/UI:** Inter (Google Fonts, OFL license) — clean grotesque, excellent readability
- Scale: fluid clamp-based (display 3rem→5rem, h1 2rem→3.5rem, body 1rem→1.125rem)

### Signature Elements
1. **Front/Back-Stage Split** — the "aha": synchronized view of customer experience ↔ Adobe platform powering it, present on every journey phase page
2. **Generazioni motif** — thread connecting young customer (Giulia, 29) to heritage client (Francesca, 52), visual through timeline and dual persona cards
3. **Progressive Adobe reveal** — Adobe enters discreetly on phase pages as back-stage chips, fully revealed on "Il Motore Adobe" page with 6-phase stack reveal

### Architecture
- **Astro 6** static site with View Transitions for page-to-page immersion
- **Tailwind CSS v4** via @tailwindcss/vite plugin (not the deprecated @astrojs/tailwind)
- CSS custom properties from design tokens → Tailwind arbitrary values
- 9 typed experience blocks in packages/core, config-driven assembly
- GitHub Pages deploy via Actions (GITHUB_TOKEN only, no external secrets)
- `trailingSlash: 'always'` for consistent URL handling with base path

---

## Checkpoints

### Checkpoint A — Foundations ✅
- [x] Monorepo scaffolded (pnpm workspaces)
- [x] Design tokens defined (3 levels: primitive → semantic → component)
- [x] Core schemas + registries (zod schemas, Adobe Product Registry with 15 products)
- [x] CI workflow ready (.github/workflows/deploy.yml)
- [x] First build passes

### Checkpoint B — Build ✅
- [x] All 9 blocks built (Hero, NarrativeSection, FrontBackStageSplit, JourneyPhase, PersonaCard, ProductGateway, AdobeStackReveal, MetricCallout, Timeline)
- [x] All 8 pages assembled with real IT content (Home, Acquisizione, Engagement, Conversione, Loyalty, Il Motore Adobe, Persona, Chiusura/CTA)
- [x] Site navigable with Navigation + Footer
- [x] Build passes (8 pages in ~800ms), deploy-ready

### Checkpoint C — Hardening ✅
- [x] Build clean (no warnings)
- [x] Base URL slash bug fixed (favicon + hero CTA)
- [x] Responsive layouts (mobile-first, min 360px)
- [x] `prefers-reduced-motion` respected (all animations opt-out)
- [x] a11y: focus-visible, ARIA labels, semantic HTML, sr-only utility

### Checkpoint D — Docs & Productization ✅
- [x] Design spec written (docs/superpowers/specs/)
- [x] SKILL.md created (skills/experience-design/)
- [x] New client runbook (docs/new-client-in-30-min.md)
- [x] site.config.ts with full page/block definitions
- [x] RUN-REPORT complete

---

## Errors & Recovery

### Tailwind v4 / Astro 6 Integration
**Issue:** Initial scaffold used `@astrojs/tailwind` (v3 pattern). Tailwind v4 requires `@tailwindcss/vite` as a Vite plugin instead.
**Fix:** Replaced `@astrojs/tailwind` with `@tailwindcss/vite`, moved from `integrations` to `vite.plugins`, added `@import "tailwindcss"` and `@theme {}` block in global.css.

### @astrojs/check version
**Issue:** Agent scaffolded `@astrojs/check@^0.10.0` which doesn't exist (latest is 0.9.9).
**Fix:** Corrected to `^0.9.9`.

### Base URL trailing slash
**Issue:** `import.meta.env.BASE_URL` returns `/experience-design-factory` (no trailing slash). Concatenation like `${base}favicon.svg` produced `/experience-design-factoryfavicon.svg`.
**Fix:** Added `.replace(/\/?$/, '/')` where BASE_URL is used in concatenation. Added `trailingSlash: 'always'` to Astro config.

### Tailwind v4 monorepo @source (post-review fix)
**Issue:** Tailwind v4 does not auto-scan pnpm-symlinked packages. Components in `packages/core/src/` used Tailwind utility classes (`hidden`, `md:flex`, `sticky`, `max-w-7xl`, etc.) but those classes were never generated in the CSS output. Result: no layout/spacing, navigation menu appeared twice (desktop `<ul>` not hidden on mobile).
**Root cause:** Tailwind v4's content detection follows filesystem paths, not symlinks. The `@agargiulo-adbe/experience-core` workspace package is symlinked in `node_modules/` but its actual source lives in `../../packages/core/src/`, outside Tailwind's default scan scope.
**Fix:** Added `@source` directives in `global.css` immediately after `@import "tailwindcss"`:
```css
@source "../../../../packages/core/src/**/*.{astro,ts,tsx,js,jsx,mjs}";
@source "../**/*.{astro,ts,tsx,js,jsx,mjs}";
```
**Verified:** CSS output now contains `.hidden`, `.flex`, `.sticky`, `md:flex`, `max-w-*`, etc. Nav renders once (desktop hidden on mobile, mobile hidden by default).

### Internal links 404 with trailingSlash: 'always' (post-review fix)
**Issue:** `trailingSlash: 'always'` in `astro.config.mjs` means Astro serves pages only at paths with trailing slash (e.g. `/experience-design-factory/acquisizione/`). But Navigation and hero CTA links were built without trailing slashes (e.g. `/experience-design-factory/acquisizione`), causing 404s in the dev server.
**Root cause:** Manual string concatenation `${base}${href}` without normalizing slashes or ensuring trailing slash.
**Fix:** Created centralized `packages/core/src/utils/url.ts` with `href(base, path)` helper that joins segments, deduplicates slashes, and always appends a trailing slash. Updated Navigation.astro and index.astro hero CTA to use it. All 8 pages now return HTTP 200.

### Grigio var name inconsistency
**Issue:** `@theme` block defined `--color-grigio-100` (with hyphen) but `:root` and blocks used `--color-grigio100` (no hyphen). Footer and AdobeStackReveal referenced non-existent vars.
**Fix:** Standardized all references to use hyphens (`grigio-100`, `grigio-200`, etc.) across global.css, tokens.ts, css-generator.ts, Footer.astro, AdobeStackReveal.astro.

### typecheck rosso — chiavi con trattino non quotate (pre-esistente)
**Issue:** `tokens.ts` definiva `grigio-100: '#…'` come chiavi oggetto bare. Un trattino non è un identificatore valido: `tsc` falliva con cascata di errori. Il build Vite/esbuild lo tollerava, quindi era passato inosservato.
**Fix:** Quotate le chiavi (`'grigio-100': …`). L'accesso resta via bracket, nessun cambio a runtime.

### typecheck rosso — `Locale` esportato due volte (pre-esistente)
**Issue:** `src/index.ts` fa `export *` sia da `schema` (zod `z.infer`) sia da `i18n`, entrambi esportano `Locale` (`'it' | 'en'`) → TS2308 ambiguità.
**Fix:** Aggiunto un re-export esplicito `export type { Locale } from './schema/index.js';` dopo i wildcard: l'export nominato esplicito risolve l'ambiguità. Il sito non era impattato (importa i sottopath, non il barrel), ma `pnpm typecheck` ora è verde.

---

## Cambio di direzione: Experience Design immersivo

### Acquisizione — step-by-step (reference page)
Trasformata da brochure densa a flusso immersivo con scroll-snap:
- 6 step a schermo pieno (`min-h-[100dvh]`, `scroll-snap-type: y mandatory`)
- **Step 1:** Apertura fase — titolo + frase, scroll hint
- **Step 2:** Data lake → profili (animazione GSAP: punti sparsi che convergono in profili)
- **Step 3:** Front stage — ciò che vede la cliente (mockup phone)
- **Step 4:** Impulso front→back — l'aha (SVG pulse line animated)
- **Step 5:** Back stage — 5 prodotti Adobe rivelati uno alla volta (stagger)
- **Step 6:** Payoff — metrica count-up (75%) + CTA fase successiva

### Componenti riusabili creati
- `packages/core/src/blocks/immersive/StepContainer.astro` — scroll-snap wrapper
- `packages/core/src/blocks/immersive/Step.astro` — singolo step full-screen
- `packages/core/src/blocks/immersive/animations.ts` — sistema animazioni GSAP
  - `initReveal()` — fade-up al scroll
  - `initCountUp()` — numeri animati
  - `initStagger()` — elementi che entrano uno alla volta
  - `initPulse()` — impulso SVG front→back
  - `initDataLake()` — data dots → profili unificati
  - Tutto con `prefers-reduced-motion` rispettato (stati finali statici)

### Pattern immersivo propagato a TUTTE le pagine ✅
Dopo l'approvazione di Acquisizione (pagina-riferimento), il modello step-by-step
è stato esteso a Home, Engagement, Conversione, Loyalty, Il Motore Adobe, Persona,
Chiusura. Ogni pagina segue la sequenza-tipo (apertura → animazione di valore →
front stage → impulso front→back → back stage coi prodotti Adobe uno alla volta →
payoff con count-up + CTA). Poco testo per step, animazioni che spiegano il valore,
`prefers-reduced-motion` rispettato, multipagina + View Transitions, link via `href(base, path)`.

**Nuove primitive in `animations.ts`** (oltre a reveal/countUp/stagger/pulse/dataLake):
- `initPersonalize` — `data-personalize`: contenuti generici che si risolvono nel match personalizzato (Engagement)
- `initConverse` — `data-converse`: bolle chat una alla volta, scoperta conversazionale / Brand Concierge (Conversione)
- `initLifecycle` — `data-lifecycle`: la relazione come ciclo ricorrente, anello con nodi che si accendono (Loyalty)
- `initClienteling` — `data-clienteling`: riconoscimento, profilo che si popola sotto una scansione (Loyalty/Persona)
- `initThread` — `data-thread`: il "filo" Generazioni tra due clienti (Home/Persona)
- `initStackAssemble` — `data-stack-assemble`: lo stack Adobe che converge sul cuore AEP — **la rivelazione completa** su "Il Motore Adobe"

Metafora per pagina: Home → thread + dataLake + pulse · Engagement → personalize ·
Conversione → converse · Loyalty → lifecycle + clienteling · Il Motore Adobe →
stackAssemble (culmine) + dettaglio fase-per-fase · Persona → thread + clienteling ·
Chiusura → sintesi 4 fasi + trio metriche count-up + CTA finale.

### GitHub allineato ✅
Repo creato e pushato: `agargiulo-adbe/experience-design-factory` (private).
Regola operativa: `git push` dopo ogni commit. Hosting Pages da abilitare in uno step dedicato.

### Verifica ✅
- `pnpm build` — 8 pagine buildate, nessun errore.
- `pnpm typecheck` — **0 errori, 0 warning** (sistemati 2 bug pre-esistenti, sotto).
- Conteggio step per pagina verificato (Home/Acq/Eng/Conv/Loyalty/Motore/Persona = 6, Chiusura = 5).
- Tutti i selettori di animazione presenti nel bundle; link interni con trailing slash validi.
- Nota: la verifica pixel-perfect in browser reale (overlap, 360px, motion live) non è automatizzabile in questo ambiente — verificata la struttura, i contratti di animazione e il reduced-motion nel sorgente.

---

## What to Review

1. `pnpm dev` → `/experience-design-factory/acquisizione/` — verificare il flusso step-by-step
2. Scroll-snap: uno step per schermata, avanzamento fluido
3. Animazioni: data lake → profili, impulso front→back, prodotti stagger, count-up 75%
4. Responsive a 360px (step si adattano)
5. `prefers-reduced-motion`: stati finali statici, no movimento
6. Le altre pagine restano come prima (non toccate)

## TODO (future phases)
- [x] Create GitHub repo + push to remote (`agargiulo-adbe/experience-design-factory`)
- [x] Propagare il modello immersivo a tutte le 8 pagine
- [ ] Abilitare hosting GitHub Pages (step dedicato)
- [ ] Factory Console (apps/console) — local SPA editor + Node backend
- [ ] Self-host fonts (currently Google Fonts CDN)
- [ ] Firefly/placeholder imagery for media slots (currently empty placeholders)
- [ ] EN locale content
- [ ] Publish @agargiulo-adbe/experience-core to GitHub Packages
- [ ] Template repository setup
