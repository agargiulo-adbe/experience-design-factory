# AUDIT — Experience Design Factory (Fase 1, sola lettura)

Data: 2026-06-16 · Metodo: lettura del codice + ispezione FE reale via Playwright headless
a **1920×1080, 1440×900, 1280×800** (deck Acquisizione), + `audit:deck` (12 check a–l).
Scope diagnosi: tutta la repo. Scope applicazione (Fase 3): **solo Acquisizione + componenti riusabili**.

> Nota critica: dove un sospetto si è rivelato infondato leggendo il codice vero, lo segnalo
> (es. il presunto "leak" di listener in HowItWorks **non** è un leak). Voglio darti la realtà,
> non confermare ipotesi.

## Sintesi (più critico → meno)

| # | Reperto | Sev. | Ambito | File:riga |
|---|---------|------|--------|-----------|
| 1 | "Entro il 2025" è **passato** (siamo nel 2026): payoff e apertura datati | critico | COPY | acquisizione.astro:49, :217 |
| 2 | A **1440×900** slide-impulse fallisce (a): il lead esce dalla fascia centrale | importante | STRUTTURA | acquisizione.astro:178 |
| 3 | A **1280×800** slide-frontstage fallisce (c): il phone IG sfora il margine basso (~4px) | importante | STRUTTURA | InstagramPost.astro (root) + acquisizione.astro:138-140 |
| 4 | Due `<h1>` identici sulla stessa pagina (cover + apertura) — a11y + ridondanza | importante | STRUTTURA/COPY | CoverSlide.astro:40 + acquisizione.astro:44 |
| 5 | Co-brand ridondante: "Max Mara × Adobe" nell'eyebrow **e** nel lock-up wordmark | importante | COPY | CoverSlide.astro:20 (+29), :32, :37 |
| 6 | Francesca sparisce dal racconto dopo lo slide data-lake: il filo Giulia↔Francesca non regge | importante | COPY | acquisizione.astro:116 (unica presenza), poi assente |
| 7 | Tipografia "a occhio": 19+ `style="font-size: clamp(...)"` inline, nessuna scala-token | importante | STRUTTURA | acquisizione.astro:43,44,63,76,79,133,147,178,189,213,216,219,223 |
| 8 | Audit gira solo a 1920×1080 (l'invariante di contenimento non è testata ai viewport reali) | importante | STRUTTURA | scripts/deck-audit.ts:25 |
| 9 | Gergo nel racconto principale ("a scala", "privacy-safe", "Front/Back") | minore | COPY | acquisizione.astro:153,172,190,198 |
| 10 | 9 "experience block" + PageLayout + Footer **orfani** (0 import) — doc≠realtà | minore | CODICE | packages/core/src/blocks/*.astro, layouts/ |
| 11 | Schemi Zod (`schema/index.ts`) e registry mai usati per validare nulla | minore | CODICE | packages/core/src/schema/index.ts |
| 12 | "Monogram" residuo (incoerente con Whitney Bag) — su **persona** (fuori scope) | minore | COPY | persona.astro:99 |
| 13 | `Math.random()` nel frontmatter (dots) → scatter diverso ad ogni build | minore | CODICE | acquisizione.astro:24 |
| 14 | HowItWorks: listener keydown rimane appeso SOLO se apri il pannello e navighi via senza chiudere | minore | CODICE | HowItWorks.astro:114,123 |
| 15 | Font: Google Fonts via `<link>` (render-blocking), nessun preload/self-host | minore | PERF | BaseLayout.astro:21-23 |

---

## A) SALUTE DEL CODICE

### A1. Duplicazione tra le 8 pagine (reale, ma vive nelle 7 pagine NON-deck)
Le 7 pagine scroll (index, engagement, conversione, loyalty, motore-adobe, persona, chiusura)
condividono blocchi copia-incollati. **Acquisizione (deck) NON li condivide** (usa
DeckContainer/Slide), quindi estrarli ora gioverebbe alla *propagazione*, non a questo giro.
Conteggi (severità *importante* in ottica propagazione, *minore* per questo giro):
- `navItems` (array nav) — **7 pagine** (es. index.astro:11-19). Acquisizione: assente (il deck non ha nav).
- boilerplate `base`/`currentPath` — **7 pagine** (es. index.astro:8-9); Acquisizione ha una variante (acquisizione.astro:12, senza `.replace`).
- blocco "Scorri" (scroll-hint SVG + `@keyframes bounce-subtle`) — **7 pagine** (markup + `<style>` duplicato). Acquisizione: non lo usa.
- pattern Front/Back con `data-pulse-line` — **6 pagine** (es. acquisizione.astro:151-176, engagement, conversione, loyalty, motore, index).
- payoff con count-up — **7 pagine** (es. acquisizione.astro:212-238).
- griglia prodotti Adobe — **4 pagine** (engagement/conversione/loyalty + il vecchio pattern).
- `<script> initAllAnimations + astro:after-swap` — **7 pagine** identico.

**Giudizio:** la candidata #1 a diventare componente è il pattern **Front/Back pulse** e il
**payoff/metric**; ma conviene farlo **insieme alla propagazione** (un componente che serve 1
sola pagina ora, lasciando 5 duplicati altrove, è lavoro a metà). Per Acquisizione *adesso* il
refactor a più alto valore è la **scala tipografica** (vedi A5/B2), non l'estrazione di blocchi.

### A2. Tipizzazione
- I componenti core hanno `Props` espliciti e tipizzati; **nessun `any`, nessun `@ts-ignore`**. Buono.
- **Schemi Zod orfani**: `packages/core/src/schema/index.ts` definisce `HeroPropsSchema`,
  `PersonaCardPropsSchema`, ecc. ma **nessuna pagina/loader li usa** per validare. Sono
  documentazione non collegata. Anche `registry/adobe-products.ts` è un const TS mai validato.
  *Severità minore* (non rompe nulla; è debito "documentazione vs realtà").

### A3. Codice morto / igiene
- **Zero** `console.log`, **zero** TODO/FIXME, **zero** codice commentato, nessun import inutilizzato evidente. Buono.
- **Orfani** (0 import da qualunque pagina): `Hero, NarrativeSection, JourneyPhase, PersonaCard,
  ProductGateway, AdobeStackReveal, MetricCallout, FrontBackStageSplit, Timeline` (i "9 experience
  block"), `layouts/PageLayout.astro`, `layouts/Footer.astro`. `Navigation.astro` è usato da 7 pagine.
  *Mismatch doc≠realtà*: SKILL.md/CLAUDE.md descrivono i "9 block" come la libreria, ma il deck li ha
  soppiantati. *Severità minore*; **fuori scope Acquisizione** (sono core).

### A4. Animazioni / lifecycle
- **Deck** (`deck.ts`): `astro:after-swap`→boot, `astro:before-swap`→teardown; `Deck.destroy()`
  rimuove tutti i listener (keydown/resize/mousemove/click/touch). Pulito.
- **Scroll pages**: ogni pagina ri-registra `astro:after-swap`→`initAllAnimations`; ScrollTrigger usa
  `once:true`; con View Transitions il body è nuovo, quindi niente accumulo reale. OK.
- **HowItWorks** (correzione critica all'ipotesi): `onKey` è la **stessa closure** per `add` (open,
  HowItWorks.astro:114) e `remove` (close, :123) → **bilanciato, NON è un leak per ogni apri/chiudi**.
  L'unico caso reale: apri il pannello e **navighi via senza chiudere** (es. back del browser) → un
  listener capture resta appeso. *Severità minore*, edge case.

### A5. Token vs valori hardcoded
- Buono: i colori passano quasi sempre da `var(--token)` (es. `text-[var(--ink-primary)]`).
- **Problema reale**: la **dimensione del testo** è gestita con `style="font-size: clamp(...)"` inline,
  valori "magici" tutti diversi (acquisizione.astro: :43 `clamp(2.5rem,4vw,4rem)`, :44
  `clamp(2.5rem,5.2vw,4.75rem)`, :63 `clamp(2.5rem,5vw,4.5rem)`, :76 `clamp(2rem,3.4vw,3.25rem)`,
  :147 `clamp(2.25rem,4.4vw,4rem)`, :213 `clamp(6rem,15vw,14rem)`, …). Non c'è una **scala
  sistematica** → titoli a misure leggermente diverse slide per slide (vedi B2). Esistono già
  `.slide-title/.slide-lead/.slide-eyebrow` (in DeckContainer global) ma vengono **scavalcati** dagli
  inline. *Severità importante (per Acquisizione, applicabile ora)*.
- Minori: `text-white/..` usato su slide brand/dark dove esiste `--ink-inverse`; `tracking-[..]`,
  `text-[0.65rem]` ripetuti senza token.

---

## B) FRONT-END (ispezione reale ai 3 viewport)

### B1. I 12 check (a–l) ai viewport reali — **il contenimento regge, due check height-relativi no**
- **Contenimento (j niente clipping, k niente scroll, f pannelli)**: **PASSA a 1920×1080, 1440×900,
  1280×800** su tutte le slide e tutti i pannelli aperti (misurato: clip 0, scroll 0, pannelli dentro
  viewport senza scroll). Il design safe-area + overlay centrato è **viewport-robusto**. ✅
- **MA il set completo a–l NON è 0-FAIL fuori da 1920×1080**:
  - **1440×900 → slide-impulse, check (a)**: il lead "Nell'istante in cui tocca…" ha centro a y≈639,
    fuori dalla fascia [270,630] (a 900px è più stretta). Lo slide impulse è denso (titolo + 2 card +
    lead): a 900px non sta nella fascia. (acquisizione.astro:178)
  - **1280×800 → slide-frontstage, check (c)**: il phone IG (`.ig-phone`, `h-full max-h-[76vh]
    aspect-[9/19]`) arriva a bottom≈740 con limite 736 → **sfora di ~4px** il margine inferiore.
    Il phone è dimensionato dalla **larghezza** (aspect), non rispetta `h-full` con `items-center`,
    quindi a 800px d'altezza eccede. (InstagramPost.astro root + acquisizione.astro:138-140)
- **Conclusione**: l'audit gira **solo a 1920×1080** (scripts/deck-audit.ts:25) → non si accorge di
  questi due casi. Vanno (a) testati a 1440×900 e 1280×800 in CI, (b) risolti.

### B2. Gerarchia tipografica
Non sistematica (vedi A5). Esempi di incoerenza tra titoli "pari livello": apertura h1 `…,5.2vw,4.75rem`
(:44), giulia h2 `…,5vw,4.5rem` (:63), frontstage h2 `…,5vw,4.5rem` (:133), impulse h2 `…,4.4vw,4rem`
(:147), data-lake h2 `…,3.4vw,3.25rem` (:76). Quattro misure diverse per lo stesso ruolo. *importante.*

### B3. Coerenza visiva
Ritmo/margini ora coerenti (frutto dei giri precedenti): centratura sul centro viewport, banda chrome
riservata, gap ≥16px. Il punto debole è solo la **scala dei titoli** (B2) e i due casi height (B1).

---

## C) ACCESSIBILITÀ
- **Due `<h1>` identici** sulla stessa pagina: CoverSlide (`{tagline}`, CoverSlide.astro:40) e apertura
  (acquisizione.astro:44), entrambi "Una relazione che attraversa il tempo". Viola 1.3.1 (gerarchia) +
  è ridondante (vedi #4/#5). Le altre 7 pagine hanno 1 `<h1>` + `<h2>` corretti. *importante.*
- Buono: `alt` dal manifest (MediaSlot.astro:40); SVG decorativi `aria-hidden`; controlli deck con
  `aria-label` (DeckContainer.astro:26,39,45) + focus-visible; dialog `role="dialog" aria-modal
  aria-label` (HowItWorks); slide inattive `inert`+`aria-hidden` (deck.ts:145-146); nav `aria-current`.
- Minore: il dialog usa `aria-label={title}` invece di `aria-labelledby` puntato all'`<h3>` del titolo
  (entrambi validi; labelledby è più robusto). Il "01" è `aria-hidden` (corretto, decorativo).

## D) PERFORMANCE
- **Immagini**: MediaSlot → `<Picture>` AVIF/WebP con `widths=[480..2400]`; `loading="eager"` su atmosfera
  e ritratto Giulia (above-the-fold, ok), lazy sul resto. *Da rivedere*: `sizes` di default è `100vw`
  (MediaSlot) ma i ritratti/phone non sono 100vw → il browser può scaricare una variante più grande del
  necessario. Nessun `fetchpriority`. Sorgenti generati ~2400px committati (ok, build senza chiave).
- **Font**: BaseLayout.astro:21-23 carica Google Fonts via `<link rel=stylesheet>` (render-blocking),
  `display=swap` presente (bene), ma **nessun preload** del woff2 né self-host → FOUT + dipendenza CDN.
- **JS**: GSAP lazy-import nelle animazioni; deck controller leggero. Ok.
- Minore: `Math.random()` nel frontmatter (acquisizione.astro:24) → i dots cambiano ad ogni build
  (non riproducibile, solo cosmetico).

## E) COPY & CONTENUTO (valutazione, non riscrittura)

### E1. COVER — co-brand ridondante + rischio "terzo brand"
- Eyebrow default: `"Max Mara × Adobe · Experience Design"` (CoverSlide.astro:20, reso :29).
- Lock-up wordmark: `Max Mara` (:32) — filo — `Adobe` (:37). → **"Max Mara × Adobe" detto due volte**,
  a due gerarchie diverse. Ridondante.
- Tagline h1 `"Una relazione che attraversa il tempo"` (:40) sotto il lock-up: visivamente sta su una
  riga separata (non *sulla stessa* dei due nomi), quindi il rischio "terzo brand" è **moderato**, non
  acuto — ma l'eyebrow che ripete i due nomi accentua l'effetto "lista di brand". *importante (copy).*

### E2. GERGO (con posizione: racconto principale vs pannello "Scopri come")
Nel **racconto principale** (da italianizzare): `"Front"`/`"Back"` (acquisizione.astro:153,172),
`"a scala"` (:190, e titolo pannello :203), `"privacy-safe"` (:198), `"audience simili"` (:198),
`"FASE SUCCESSIVA: ENGAGEMENT"` (:232, anche *all-caps* gridato). Nei **pannelli** (più tollerabile,
è il livello "dettaglio"): `"privacy-safe"`, `"clean room"` (:87), `"content supply chain"` (:206).
I **nomi prodotto Adobe** (Real-Time CDP :85,:198; GenStudio/Firefly :195,:204-205) sono in contesto: OK.

### E3. DATO TEMPORALE — **stale** (critico)
- acquisizione.astro:49 (apertura): *"Entro il 2025 tre quarti della spesa nel lusso verrà da Millennial e Gen Z…"*
- acquisizione.astro:214/217 (payoff): count-up **`75%`** + *"Entro il 2025 il lusso sarà guidato da Millennial e Gen Z."* — Fonte: Bain & Company / Altagamma (:220).
- Anche chiusura.astro usa lo stesso 75% (fuori scope). Oggi è 2026 → l'orizzonte "2025" è passato e il
  payoff perde forza. **Va aggiornato all'orizzonte 2030** (vedi proposta).

### E4. COERENZA
- "Max Mara" con spazio: coerente ovunque. ✅
- "Whitney Bag": coerente in Acquisizione (:135,:139,:155). **"Monogram" residuo** solo su persona.astro:99
  (incoerenza narrativa: stesso prodotto d'ingresso di Giulia con due nomi). *Fuori scope Acquisizione.*
- Fonti: formato sostanzialmente uniforme ("Fonte: …"); `&amp;` vs `&` è solo escaping HTML, **reso
  identico** → non è un problema reale.
- Voce: terza persona ("lei/Giulia") coerente, nessun "tu". ✅
- **Filo Giulia↔Francesca**: Francesca compare SOLO come cerchio nel data-lake (:116) e poi **sparisce**;
  slide 4–7 sono tutte Giulia. Il "ponte tra generazioni" promesso non è percepibile in Acquisizione. *importante (copy).*

---

# PROPOSTA DI INTERVENTO

Legenda rischio: 🟢 basso · 🟡 medio · 🔴 alto. Per il COPY propongo testo nuovo da **validare con te**.

## STRUTTURA / CODICE (applicabile a Acquisizione + componenti, questo giro)

**S1 — Estendi `audit:deck` a 3 viewport (1920/1440/1280)** 🟢
*Cosa*: parametrizzare `VIEWPORT` (env o loop) e far girare a–l ai tre formati; il gate diventa
0-FAIL su tutti. *Perché*: oggi il contenimento è testato solo a 1920; B1 mostra 2 falle reali fuori.
*Rischio*: basso. **Prerequisito** per validare S2/S3.

**S2 — slide-impulse robusto in altezza** 🟡
*Cosa*: ridurre la densità (card più compatte / lead più corto / titolo–lead più vicini) così il lead
resta nella fascia anche a 900px. *Perché*: (a) fallisce a 1440×900. *Rischio*: medio (tocca il layout
della slide; verificabile con S1). Causa, non sintomo: lo slide ha 4 blocchi testuali in colonna.

**S3 — InstagramPost: cap d'altezza che rispetti il margine** 🟡
*Cosa*: vincolare il phone con un `max-height` legato all'area sicura (non solo `76vh`/`aspect`), così
non sfora il bottom a 800px. *Perché*: (c) fallisce a 1280×800. *Rischio*: medio (componente riusabile;
ma usato solo in Acquisizione ora). Causa: l'aspect guida la dimensione ignorando l'altezza disponibile.

**S4 — Scala tipografica a token** 🟡
*Cosa*: definire poche classi/var di scala-proiezione (es. `--ds-title`, `--ds-h2`, `--ds-lead`,
`--ds-eyebrow`, `--ds-metric`) e sostituire i `style="font-size: clamp(...)"` inline di Acquisizione +
allineare `.slide-title/.slide-lead`. *Perché*: A5/B2 (gerarchia "a occhio", 4 misure per lo stesso
ruolo). *Rischio*: medio (ritocca quasi ogni titolo; ogni slide va riverificata con S1). **Alto valore.**

**S5 — Un solo `<h1>` per pagina** 🟢
*Cosa*: l'h1 resta sulla **cover** (la tagline-tema); l'apertura (acquisizione.astro:44) diventa `<h2>`
(o si toglie la duplicazione del testo). *Perché*: C (due h1 identici) + E1 (ridondanza). *Rischio*: basso.

**S6 — `sizes` corretti su MediaSlot ritratti/phone** 🟢
*Cosa*: passare un `sizes` realistico (es. `(min-width:768px) 40vw, 90vw`) dove l'immagine non è full-bleed.
*Perché*: D (download oversize). *Rischio*: basso.

**Rimando consigliato (NON ora):** estrazione dei blocchi duplicati (Front/Back, payoff, scroll-hint,
navItems, script anim) → **farlo con la propagazione**, non a metà (A1). Rimozione/triage dei 9 block
orfani + PageLayout/Footer → decisione separata (sono core, doc da allineare). `Math.random()` build-time
→ opzionale (seed). Font self-host/preload → step perf dedicato.

## COPY / CONTENUTO (proposte da validare insieme — NON le applico senza ok)

**C1 — Payoff/apertura: orizzonte 2030 + aggancio al presente** (sostituisce "entro il 2025")
- Payoff (acquisizione.astro:214-220): mantenere il numero grande ma **aggiornarlo**. Due opzioni:
  - *Opzione A (orizzonte futuro)*: metric **`+¾`** o **`75%`** con sotto-riga
    *"Entro il 2030 oltre tre quarti della spesa nel lusso sarà di Millennial e Gen Z."* —
    Fonte: *"Bain & Company × Altagamma, Luxury Study"*.
  - *Opzione B (aggancio al presente, più forte)*: metric **`46%`** con
    *"Già oggi i Millennial valgono quasi metà della spesa nel lusso — e la Gen Z cresce più in fretta di tutti."*
    Fonte: *Bain–Altagamma*. (Aggancia al 2026, evita date passate.)
- Apertura (acquisizione.astro:49): *"Tre quarti del lusso, entro il 2030, sarà guidato da Millennial e
  Gen Z. Conquistarli oggi non è una campagna: è costruire il brand di domani."*
- *Mia raccomandazione*: **Opzione B per il payoff** (più credibile e ancorata al presente) + apertura 2030.
  *Rischio*: 🟢 (solo testo). Da confermare i numeri esatti con la fonte che preferisci.

**C2 — Cover: togliere la ridondanza co-brand** (CoverSlide.astro:20 / acquisizione.astro)
- Tenere il lock-up `Max Mara — Adobe` (i due nomi col filo) e cambiare l'**eyebrow** in qualcosa che
  NON ripeta i brand: es. **"Experience Design"** oppure **"Acquisizione · Capitolo 1"**.
- *Alternativa*: tenere l'eyebrow "Max Mara × Adobe · Experience Design" e ridurre il lock-up a un solo
  segno (il filo) — ma perderebbe il gesto del co-brand. *Raccomando la prima.* *Rischio*: 🟢.

**C3 — Filo Francesca**: dare a Francesca un richiamo dopo il data-lake, senza appesantire.
- Es. nello slide impulse o payoff, una riga che la nomina come "il dopo": payoff (acquisizione.astro:224)
  *"Giulia è entrata nel mondo Max Mara. Un giorno sarà come Francesca: una relazione che dura."*
  Oppure un micro-riferimento nello slide 2/3. *Da decidere insieme dove.* *Rischio*: 🟡 (tocca il racconto).

**C4 — Italianizzare il gergo del racconto principale** (i nomi Adobe restano):
- `Front`/`Back` (153/172) → **"Ciò che vede Giulia"** / **"Ciò che fa la piattaforma"** (già usati altrove;
  uniformare).
- `a scala` (190) → **"su larga scala"** o **"alla velocità dei social"**.
- `privacy-safe` (198) → **"nel rispetto della privacy"**.
- `audience simili` (198) → **"trova nuove clienti simili alle migliori"**.
- `FASE SUCCESSIVA: ENGAGEMENT` (232) → **"Prossima fase: Engagement"** (via all-caps gridato).
- Nei pannelli "Scopri come": `clean room` e `content supply chain` → tenere ma con glossa breve
  (es. *"in ambienti protetti (clean room)"*, *"la filiera dei contenuti"*). *Rischio*: 🟢.

**Fuori scope ma da segnalarti**: "Monogram" su persona.astro:99 va reso "Whitney Bag" quando propaghiamo
(coerenza del prodotto d'ingresso di Giulia).

---

## Cosa NON applicherò senza tuo ok
- Qualsiasi COPY (C1–C4): te lo validiamo voce per voce.
- L'estensione dell'audit ai 3 viewport e i fix S2/S3/S4/S5/S6: aspetto la tua approvazione per voce.
- Niente di tutto questo tocca le altre 7 fasi (propagazione separata).

**Fermo qui in attesa della tua approvazione della diagnosi.**
