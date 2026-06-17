# Run Report — Experience Design Factory

## Status: Round formato+scene — TUTTE le 8 rotte keynote (nessuna in scroll) + scene interattive credibili (canale·momento·AI Adobe). Live, audit 0 FAIL — per revisione

---

## Round formato + scene credibili (PART A + PART B)

**Live:** https://agargiulo-adbe.github.io/experience-design-factory/ — tutte e 8 le rotte 200, **tutte keynote, nessuna in scroll**.

### PART A — unificazione formato: tutto keynote
Home, Il Motore, Persona (e Chiusura) erano ancora scroll-snap. Ora sono **deck keynote** come le 4 fasi:
| Rotta | Slide | Commit |
|---|---|---|
| Engine | handler deck `[data-thread]` + `[data-stack-assemble]` | `feat(core)` |
| **Home** | cover · **manifesto** (il filo Giulia→4 momenti→Francesca) · invito (+306% + CTA) | `feat(home)` |
| **Persona** | apertura · filo(thread) · Giulia(ritratto) · Francesca(atmosfera) · clienteling · payoff | `feat(persona)` |
| **Il Motore** | apertura · data-lake · **stack-assemble** (10 prodotti→core AEP) · stack fase-per-fase · pulse · payoff | `feat(motore)` |
| **Chiusura** | apertura · sintesi · tre numeri · la promessa · payoff (CTA) | `feat(chiusura)` |

Nodo della slide-manifesto sciolto: cover + manifesto = due slide dello stesso deck Home (si avanza con le frecce, niente scroll). Copy riusato; blocchi densi **ridistribuiti** per stare nel frame (prodotti inline, ring in vh-clamp) — **mai tagliato il contenuto**. `deck-audit` esteso a tutte e 8 le rotte → **0 FAIL** a 1920/1440/1280.

### PART B — scene interattive credibili e contestualizzate
La chat di Conversione (segnalata dal cliente: non credibile, canale/momento poco chiari, sembrava un umano) ora è esplicita:
- **Etichetta di contesto**: «App Max Mara · mentre Giulia esita sul carrello» + badge «Assistente AI, non un umano».
- **AI Adobe esplicita**: l'assistente non è «Concierge» generico ma «Assistente Max Mara» con badge AI sulle bolle; nel **"Scopri come"** è nominato **Brand Concierge / Product Advisor Agent su Agent Orchestrator**, AI conversazionale addestrata sul catalogo e sulla voce del brand — chiude il debito noto su questa scena.
- **Dialogo credibile**: breve, naturale, di servizio (storia del prodotto + opzione boutique Corso Venezia), non pubblicitario.
- Contesto anche su Engagement (eyebrow «SITO MAX MARA · HOMEPAGE, AL RITORNO DI GIULIA») e Loyalty (clienteling «Boutique Montenapoleone · ore 16:20»).

### Gate finale
- `audit:deck` → **0 FAIL su tutte e 8 le rotte keynote** a 1920/1440/1280, "Scopri come" da espanso. Le 4 fasi blindate non regredite.
- `pnpm build` (8 pagine) + `pnpm typecheck` (0 errori) verdi.
- Redeploy verde; **8 rotte live 200, tutte `data-deck`, nessun `data-step-container` (nessuna in scroll)**; AI labeling in prod.

### Stato dei debiti noti
1. **Francesca** — ✅ risolto (atmosferica non-volto + ricorrente).
2. **Statement backstage / natura AI** — ✅ **risolto per Conversione** (Brand Concierge / Agent Orchestrator nominati, AI esplicita). Resta da rifinire insieme il fraseggio degli statement di Engagement/Loyalty (sintesi dai claim).
3. **`conversione-pelle`** — texture di pelle, non la borsa letterale (caption porta la specificità) — da validare.

➡️ Factory Console NON toccata (capitolo separato).

---

## Round unificazione (6 step, un solo STOP) — sito coeso per il CMO

**Live:** https://agargiulo-adbe.github.io/experience-design-factory/ — tutte e 8 le rotte 200, nessun 404.

| Step | Cosa | Commit |
|---|---|---|
| 1 | **Copertina UNICA** `CoverHero` (eyebrow · numerale · titolo display · lead · firma filo), riusata da Home + apertura di tutte e 4 le fasi; `CoverSlide` ora wrapper su `CoverHero` | `feat(core)` |
| 2 | **Nav coerente OVUNQUE** (deck inclusi; Acquisizione la aveva persa). FS del deck spostato nella barra inferiore → niente collisione (invariante b verde) | `feat(nav)` |
| 3 | **SLIDE-MANIFESTO** sulla Home dopo la cover: il filo Giulia → 4 momenti → Francesca, in una schermata | `feat(home)` |
| 4 | **Home senza pain interno**: via "Ringiovanire il target / ciclo di vita"; copy validato quiet-luxury | `fix(home)` |
| 5A | **Francesca atmosferica non-volto** ovunque (`francesca-atmosfera` satin): data-lake, slide 08, Persona | `feat(francesca)` |
| 5B | **Francesca ricorrente**: richiamo breve sul payoff di Engagement/Conversione/Loyalty → il finale pesa per DUE persone | `feat(francesca)` |
| 6 | **Immagini arricchite**: backdrop textile sulle aperture piatte (Chiusura, Il Motore) a costo zero | `feat(images)` |

**Componente nuovo:** `CoverHero.astro` (tipografia self-contained → funziona in `<Slide>` e `<Step>`).
**Asset nuovo:** `francesca-atmosfera` (satin caldo, **senza volto**, in palette) — scartate 2 candidate (foto whitney ripetitiva).

**Gate finale:**
- `audit:deck` → **0 FAIL** su acquisizione + engagement + conversione + loyalty a 1920/1440/1280, "Scopri come" da espanso. Nessuna regressione delle 4 fasi blindate (ogni step su componenti condivisi ri-auditato).
- `pnpm build` (8 pagine) + `pnpm typecheck` (0 errori) verdi · `assets:build` rilanciato · `provenance.json` aggiornato (Giulia/persona-francesca/whitney byte-identical).
- Redeploy verde; **tutte e 8 le rotte live 200**, `francesca-atmosfera` 200, pain copy assente, nav presente sui deck — **nessun 404**.

### Stato dei debiti noti
1. **Francesca** — ✅ **RISOLTO**: non più un volto (immagine atmosferica satin) + presenza ricorrente.
2. **Statement backstage** (le 2 righe sopra "Scopri come" di Eng/Conv/Loyalty) = sintesi/lift dai claim Adobe — ancora da validare insieme.
3. **`conversione-pelle`** = texture di pelle, non la borsa letterale (caption porta la specificità) — da validare.

> Postura di rifiuto immagini: per `francesca-atmosfera` scartata la foto-whitney ripetitiva → scelto un satin senza volto, in palette. Mai sostituita la faccia di Giulia dove è nominata. Nessun fallback "abbastanza buono".

➡️ Factory Console NON toccata (capitolo separato).

---

## Strada B — Loyalty → keynote slide-grade (ultima fase; stesso stampo)

**Loyalty live (deck):** https://agargiulo-adbe.github.io/experience-design-factory/loyalty/

**Unità & commit:**
| Unità | Cosa | Commit |
|---|---|---|
| Engine | handler deck per `[data-lifecycle]` + `[data-clienteling]`, no-op altrove | `feat(core)` |
| Asset | slot `loyalty-boutique` — ambiente elegante caldo (no volto) | `feat(assets)` |
| Pagina + audit | Loyalty = DeckContainer/Slide (6 slide); rotta audit aggiunta | `feat(loyalty)` |

**6 slide** (copy riusato): apertura (firma **filo**) · lifecycle (ring deck-animate, dot sulla
circonferenza + legenda) · frontstage (**clienteling card col ritratto `persona-giulia` RIUSATO come
avatar** — l'unico punto che nomina Giulia, rafforza il filo acquisizione→fedeltà) · impulse (pulse) ·
backstage (JO / RT-CDP / CJA nel **"Scopri come" inline**) · payoff (`data-display` +306% Motista + CTA).

**Punto 1 (avatar Giulia):** verificato a schermo ai 3 viewport — lo **studio-portrait regge bene come
avatar CRM** (foto profilo tonda, naturale nel card di riconoscimento). Nessun flag necessario.
**Immagini:** `loyalty-boutique` (interno caldo, no volto) sotto scrim dietro la card; sfondi = riuso textile.

**Punto 2 + bug visivi colti dallo screenshot (l'audit non li vede):**
- Testo dei meccanismi in contenitori **misurati ≥16px** (ring: tolte le label perimetrali che sforavano →
  legenda; clienteling: testi in `<p>`/`<li>` ≥16px). Niente falsi 0 su `i`.
- `data-clienteling` avatar: il `MediaSlot fill` **sforava sulla card** (il div avatar non era `relative`) →
  il ritratto copriva la lista; **risolto** con `relative`. Card compatta + `flex-shrink-0` (no clip a 1280).
- Dot del ring riposizionati **sulla circonferenza** (no overflow orizzontale). Regola d'oro: corretto il layout, mai tagliato il testo.

**Gate Loyalty (finale):**
- `audit:deck` → **0 FAIL su TUTTE e 4 le rotte** (acquisizione + engagement + conversione + loyalty) a
  1920×1080 / 1440×900 / 1280×800, "Scopri come" da **espanso inline**. Le 3 precedenti **non regredite**.
- `pnpm build` (8 pagine) + `pnpm typecheck` (0 errori) verdi · `assets:build` rilanciato · `provenance.json` aggiornato (Giulia/Francesca/whitney byte-identical).
- Redeploy verde; **Loyalty live no-404** (`data-deck`; `loyalty-boutique` + `persona-giulia` + 14 asset 200); **tutte e 4 le rotte 200**.
- Screenshot ai 3 viewport: apertura (filo) · lifecycle (ring) · frontstage (clienteling + avatar Giulia) · "Scopri come" espanso · payoff.

### Debito noto da validare insieme (post-meeting)
- **Statement backstage** (le 2 righe sopra "Scopri come") di Engagement/Conversione/Loyalty = sintesi/lift
  dai claim Adobe, non copy validato. Da rivedere tutto insieme.
- **`conversione-pelle`** è una *texture* di pelle, non la borsa letterale (caption porta la specificità).
- **Ritratto Francesca** (Acquisizione) tenuto come "cliente storica" (deroga età).

➡️ **STOP — è l'ultima fase. Facciamo il punto su tutto.** Le 4 fasi sono keynote slide-grade, con immagini reali, audit 0 FAIL, live.

---

## Strada B — Conversione → keynote slide-grade (stesso stampo di Engagement)

**Conversione live (deck):** https://agargiulo-adbe.github.io/experience-design-factory/conversione/

**Unità & commit:**
| Unità | Cosa | Commit |
|---|---|---|
| Engine | handler deck per `[data-converse]` (chat bubble), no-op altrove | `feat(core)` |
| Asset | slot `conversione-pelle` — texture pelle pregiata (no volto) | `feat(assets)` |
| Pagina + audit | Conversione = DeckContainer/Slide (6 slide); rotta audit aggiunta | `feat(conversione)` |

**6 slide** (copy riusato): apertura (firma **filo**) · converse (chat Giulia↔Concierge deck-animate) ·
frontstage (**foto reale** di pelle pregiata nel phone, card "Whitney Bag — pelle martellata") · impulse
(pulse) · backstage (4 Adobe — JO, Target, Commerce, Brand Concierge — nel **"Scopri come" inline**) ·
payoff (`data-display` 3× + CTA "Continua · Loyalty").

**Immagini — postura di rifiuto applicata:** per `conversione-pelle` **scartate 2 candidate** — (1) la
**stessa foto di whitney-post** (ripetitiva tra le fasi), (2) portachiavi su denim fuori registro.
Accettata una **texture di pelle calda e pregiata, senza volto, in palette**. ⚠ **Da validare:** è una
*texture* di pelle, non la borsa letterale (la caption del card porta la specificità Whitney). Sfondi = riuso textile.

**Fix audit-driven (regola d'oro: corretto il layout, mai tagliato il testo):** il testo delle chat-bubble
era in un `<div>` (non misurato dall'audit → `i` falsato a 0.15): spostato in `<p>` e bubble compattate
perché il titolo resti in banda; statement backstage più piene per `i≥0.45`.

**Gate Conversione:**
- `audit:deck` → **0 FAIL** su **acquisizione + engagement + conversione** a 1920/1440/1280, "Scopri come" da **espanso inline**. Rotte precedenti **non regredite**.
- `pnpm build` (8 pagine) + `pnpm typecheck` (0 errori) verdi · `assets:build` rilanciato · `provenance.json` aggiornato (Francesca/whitney byte-identical).
- Redeploy verde; **Conversione live no-404** (`data-deck`, `conversione-pelle` + 14 asset campionati 200); acquisizione+engagement 200.
- Screenshot ai 3 viewport: apertura (filo) · converse (chat) · frontstage (foto reale) · "Scopri come" espanso · payoff.

➡️ **STOP per revisione PRIMA di Loyalty.** Loyalty NON toccata: stesso stampo, con `loyalty-*` reale e
il riuso del ritratto `persona-giulia` come avatar nella clienteling card (verifica + flag-stop se non regge).

---

## Strada B — Engagement → keynote slide-grade (modello per Conversione/Loyalty)

**Engagement live (deck):** https://agargiulo-adbe.github.io/experience-design-factory/engagement/
**Francesca:** sbloccata — tenuta com'è in produzione (deroga esplicita "cliente storica", età
non vincolante). Nessun nuovo tentativo di query. Immagine byte-identical, deploy pulito.

**Unità & commit:**
| Unità | Cosa | Commit |
|---|---|---|
| Engine | handler deck per `[data-personalize]` (prepareSlide/playSlide), no-op su Acquisizione | `feat(core)` |
| Asset | slot `engagement-editoriale` — cappotto cammello still-life (niente volto) | `feat(assets)` |
| Pagina + audit | Engagement = DeckContainer/Slide (6 slide); deck-audit multi-rotta | `feat(engagement)` |

**Conversione (Step→deck):**
- 6 slide mappate dagli step: apertura (firma **filo** CoBrandSignature) · personalize (tile
  deck-animate) · frontstage (**mockup con FOTO REALE** del cappotto, non più icona) · impulse
  (pulse) · backstage (prodotti Adobe nel **"Scopri come" inline**, pattern Acquisizione) · payoff
  (`data-display` +15% + CTA "Continua · Conversione"). Copy riusato dagli step; nessun copy nuovo
  (lo statement backstage è lift dei claim esistenti). Regola d'oro rispettata: corretto il LAYOUT,
  mai tagliato il testo (tile compresse, card impulse `justify-between`, statement come-pattern).

**Immagini — postura di rifiuto applicata:** per `engagement-editoriale` ho **scartato 2 candidate
borderline** prima di accettare la terza: (1) modella street-night fuori registro + volto nuovo,
(2) tweed rosso fuori palette. Accettata: cappotto cammello in interno elegante, **senza volto**,
in palette, registro quiet-luxury. Sfondi atmosferici = riuso dei textile già generati (no nuovi slot).

**Audit a frame fisso:** `deck-audit.ts` ora gira su **più rotte** (acquisizione + engagement);
`audit:deck engagement` filtra una rotta. NN/NN automatico dal controller (6 slide → "0X / 06").

**Gate Strada B/Engagement:**
- `audit:deck` → **0 FAIL** su ENTRAMBE le rotte a 1920×1080 / 1440×900 / 1280×800, "Scopri come"
  testato da **espanso inline**. Acquisizione **non regredita** (verde dopo l'aggiunta del handler e dei token).
- `pnpm build` (8 pagine) + `pnpm typecheck` (0 errori) verdi · `assets:build` rilanciato · `provenance.json` aggiornato.
- Redeploy su Pages verde; **Engagement live no-404** (deck `data-deck`/`deck-progress`, asset incl. `engagement-editoriale` tutti 200); Acquisizione 200.
- Screenshot ai 3 viewport: apertura (filo), frontstage (foto reale del capo), "Scopri come" espanso inline, payoff. + screenshot prod.

➡️ **STOP per revisione.** Conversione e Loyalty NON toccate: ricalcheranno questo modello dopo conferma.

---

## Pre-meeting CMO — Blocco 3: asset finali di Acquisizione

### ✅ InstagramPost credibile e curato (commit `feat(deck)`)
Problema: la sorgente `whitney-post` (1920×2400, **4:5**) era forzata in una striscia 9/19 →
ritaglio sgradevole (testa/piedi tagliati) = il "povero/tagliato". Fix **component-only** (nessun
asset toccato): area immagine ora **4:5** → la sorgente si vede INTERA; chrome IG curato (pill,
avatar, handle + "Sponsorizzato", azioni, like, caption, commenti); phone width-driven (`max-w-280`)
→ altezza costante, **sta nella safe-area senza clipping**. `audit:deck` **0 FAIL** ai 3 viewport
(c/j/k verdi). L'immagine è una shot di prodotto **senza volto** (sorgente ritagliata al collo) →
nessun problema di identità/diritti, coerente col mondo Max Mara (la borsa è l'eroe).

### ✅ Ritratto Giulia — verificato OK ai 3 viewport
Grading editoriale (fondo navy), ben inquadrato nel card 4:5, volto protetto (`noText`), legge
~28–32 anni → **entro ±5 dai 29 dichiarati**. Nessun intervento necessario.

### 🚩 Ritratto Francesca — FLAGGATO, STOP sullo slot (NON un "abbastanza buono")
Grading e inquadratura sono a posto, **ma il soggetto legge ~65–70 anni contro i 52 dichiarati**
→ **fallisce il criterio #1 (age fidelity ±5 anni)** di ~15 anni. È esattamente il failure-mode che
abbiamo deciso di NON razionalizzare. Come da regola Blocco 3 ("immagine borderline → segnala e
FERMATI sullo slot"), **non l'ho sostituita con un'altra faccia non verificata né lasciata passare
come finale**: resta com'è ORA in produzione (invariata) in attesa di tua decisione.
Opzioni: (a) tenerla come "cliente storica" (accettazione esplicita della deroga), (b) ritentare
`assets:build` con query mirata ~50–55 anni — **con il caveat roulette** (la pipeline prende la
risoluzione più alta, non la più pertinente; 4 query precedenti hanno mancato), (c) altra strada
che preferisci. **Non procedo da solo su questo slot.**

### Gate Blocco 3
- `audit:deck` **0 FAIL** ai 3 viewport (frontstage/IG inclusa). `pnpm build` + `pnpm typecheck` verdi.
- **`assets:build` NON rilanciato**: nessuno slot toccato (il fix IG è solo di layout) → `provenance.json` invariato.
- Redeploy su Pages (ship del fix IG; Francesca invariata). Screenshot di conferma: IG 1920/1280, Giulia 1920/1280, Francesca 1920/1280.

---

## Pre-meeting CMO — Blocco 2: restyle LEGGERO di Engagement / Conversione / Loyalty ✅

Obiettivo: che le tre fasi NON stonino accanto ad Acquisizione. **Restano pagine scroll-snap
(Step), nessuna conversione slide-grade, nessuna nuova immagine Pexels, nessun --mode=step.**

**Unità & commit:**
| Unità | Cosa | Commit |
|---|---|---|
| CoBrandSignature condiviso | estratto da CoverSlide (firma filo Max Mara × Adobe); default = stato disegnato | `refactor(core)` |
| Engagement | token tipografici + filo apertura + de-gergo + backdrop bg-linen | `feat(engagement)` |
| Conversione | token + filo + de-gergo + backdrop bg-cashmere | `feat(conversione)` |
| Loyalty | token + filo + de-gergo + backdrop bg-wool | `feat(loyalty)` |

**Cosa è stato fatto, per fase:**
- **Token tipografici:** aggiunta la scala fluida EDF (`--text-display/heading/body/caption`) al
  `:root` dell'app (mancava: `var(--text-*)` risolveva vuoto → titoli a 18px). Sostituiti i
  font-size inline `clamp()` con i token. Additivo → **Acquisizione invariata (audit verde)**.
- **Firma filo:** `CoBrandSignature.astro` condiviso (NON copia-incolla) nell'apertura di ogni
  fase. Estrazione provata senza regressioni → **"audit:deck Acquisizione verde dopo l'estrazione"**.
- **De-gergo (solo sostituzione termini, nessun paragrafo riscritto):** `Front stage`→`In scena`,
  `Back stage`→`Dietro le quinte`, `Fase successiva: X`→`Continua: X`. Nessun "a scala"/"privacy-safe" presente.
- **Backdrop a costo zero:** `SlideBackdrop` con gli sfondi-texture GIÀ generati (linen/cashmere/wool)
  sotto scrim sulle aperture. Nessuna nuova immagine, nessun nuovo slot.

**Gate Blocco 2:** `pnpm typecheck` 0 errori · `pnpm build` 8 pagine verde · le tre pagine
caricano **200** in locale (no 404) · screenshot apertura a 1440 per le tre fasi (filo + backdrop +
titolo display) + verifica de-gergo ("In scena"/"Dietro le quinte"). Acquisizione **audit:deck verde**
dopo l'estrazione del componente condiviso.

> Rinviato esplicitamente a dopo il meeting: conversione slide-grade, `--mode=step`, sostituzione
> dei mockup CSS con immagini reali, nuovi slot editoriali, ritratto Giulia nel clienteling card.

---

## Pre-meeting CMO — Blocco 1: verifica stato reale di Acquisizione ✅ (PASS)

Strategia: **una fase perfetta (Acquisizione) + tre presentabili**. Profondità > ampiezza.
Stato dei sei interventi del giro precedente — tutti committati, funzionanti, online:

| Intervento | Commit | Stato |
|---|---|---|
| Filo cover (curva cucita + nodo) | `981d736` | ✅ committato, visibile |
| Sfondi Pexels textile + parallax | `8c9e721` | ✅ committato, visibile |
| Ritratto Francesca sobrio | `44d5c1b` | ✅ committato, visibile |
| "Scopri come" inline | `e90e325` | ✅ committato, espande inline |
| Testo Front/Back arricchito (verbatim) | `70d50a9` | ✅ committato, visibile |
| Deploy Pages pubblico | `3ded7a4`,`22a3786` | ✅ live, no 404 |

**Gate eseguiti:**
- `audit:deck` → **PASS** a 1920×1080 / 1440×900 / 1280×800 (a–k + exp), "Scopri come" testati da **espansi inline**.
- `pnpm typecheck` → 0 errori · `pnpm build` → 8 pagine, verde.
- **Live prod** https://agargiulo-adbe.github.io/experience-design-factory/acquisizione/ → pagina **200**, 22 asset campionati (css/js/webp/avif, incl. `persona-giulia`/`persona-francesca`/`bg-*`) tutti **200**, base corretta, **nessun 404**.
- Screenshot ai 3 viewport: cover (filo) ✓, slide Pexels+scrim (impulse, corpo arricchito leggibile) ✓, slide 08 Francesca (ritratto-profilo) ✓, "Scopri come" espanso inline (datalake, fit a 1280 senza clip) ✓.

➡️ Acquisizione è **verde e online**. Via libera ai blocchi 2 e 3.

---

## Phase M — Sei interventi su Acquisizione + deploy GitHub Pages pubblico (solo Acquisizione + componenti riusabili)

**URL pubblico live:** https://agargiulo-adbe.github.io/experience-design-factory/acquisizione/
**Dev locale:** http://localhost:4321/experience-design-factory/acquisizione/

## Phase M — Sei interventi su Acquisizione + deploy GitHub Pages pubblico (solo Acquisizione + componenti riusabili)

**URL pubblico live:** https://agargiulo-adbe.github.io/experience-design-factory/acquisizione/
**Dev locale:** http://localhost:4321/experience-design-factory/acquisizione/

1. **Filo sartoriale sulla cover** — il connettore retta+punto tra `Max Mara` e `Adobe` è ora
   un *filo* che si cuce (stroke-dashoffset, stessa grammatica di `[data-cover]` in `animations.ts`)
   e finisce nel nodo. Reduced-motion = stato finale disegnato. Connettore Front/Back invariato.
2. **Sfondi atmosferici Pexels + parallax leggero** — nuovo `SlideBackdrop.astro` (engine) nel
   `backdrop` slot di Slide (fuori da `.slide-inner` → non misurato dall'audit), SEMPRE sotto uno
   scrim che garantisce WCAG AA. Slot `bg-cashmere`/`bg-linen`/`bg-wool` (pipeline Pexels+sharp).
   Su cover/impulse/come/payoff; le slide con ritratto/immagine dominante restano pulite. Parallax
   impercettibile (over-scale 1.06, nessun bordo) in `prepareSlide/playSlide`; reduced-motion = statico.
3. **Ritratto Francesca coerente con Giulia** — slot `persona-francesca` ri-queryato a profilo studio
   sobrio (neutro, elegante, non evocativo); ri-gradato e propagato (cerchio data-lake + slide-08).
4. **"Scopri come" → espansione INLINE** — `HowItWorks` riscritto: si apre IN PLACE spingendo il
   contenuto sotto (GSAP height ~450ms), niente overlay/scrim/fixed; reduced-motion = toggle istantaneo.
   Rimosso tutto il codice overlay centrato. `deck-audit` ora ESPANDE ogni trigger e ri-misura la slide
   nello stato espanso (b,c,d,e,g,h,j,k; a/i non si applicano a una disclosure).
5. **Corpo "Quel tocco non si perde" arricchito** — sostituito verbatim col testo fornito (le label
   "Giulia tocca / scopre la Whitney Bag" e "La piattaforma risponde / la riconosce e adatta tutto" restano).
6. **Deploy GitHub Pages pubblico** — repo reso **PUBLIC**; Pages source = GitHub Actions; workflow
   sistemato (rimossa versione pnpm duplicata; Node 22 per `node:sqlite`). Deploy verde, sito live,
   pagina + asset (css/js/webp/avif) tutti **200**, base `/experience-design-factory` corretta, nessun 404.

### Verifica Phase M ✅
- `audit:deck` — **0 FAIL** a 1920×1080, 1440×900, 1280×800, con "Scopri come" testato **da espanso inline**.
- `pnpm build` (8 pagine) + `pnpm typecheck` (0 errori) verdi; `assets:build` ri-eseguito (provenance.json aggiornato).
- Screenshot verificati: filo cover, slide Pexels+scrim (impulse/come), ritratto Francesca, "Scopri come" espanso, ai viewport.
- Deploy live verificato via HTTP: `/acquisizione/` 200, asset `_astro/*` 200.
- Nessuna propagazione alle altre fasi/pagine.

---

## Phase L — Audit (docs/AUDIT.md) + applicazione COPY validato (solo Acquisizione + componenti)

### Fase 1 — Audit reale (sola lettura) → `docs/AUDIT.md`
Diagnosi di codice + FE ai 3 viewport, con FILE:riga e severità (A salute codice, B front-end,
C a11y, D perf, E copy). Reperti chiave: dato "entro il 2025" stale; cover col co-brand
ridondante; Francesca assente dal racconto; tipografia "a occhio"; l'audit girava solo a
1920×1080. Più correzioni critiche alle ipotesi (es. il "leak" di HowItWorks **non** era un leak).

### Fase 3 — Copy validato applicato (stringhe esatte fornite)
- **Audit a 3 viewport**: `deck-audit.ts` ora cicla 1920×1080, 1440×900, 1280×800; i hero
  `[data-display]` (numerali/metriche) sono esclusi dal check di banda (a) — come i numeri brevi.
- **Cover ristrutturata** ("tagline eroe, co-brand firma"): eyebrow `GENERAZIONI`, tagline
  display centrale, firma `Max Mara —•— Adobe` col filo in basso. Via la ridondanza.
- **Slide 1**: "Incontrare chi ancora non ci conosce" (rimossa la duplicazione dell'h1 della
  cover e il dato 2025 stale).
- **Slide 2 (Giulia)**: eyebrow `LEI` + corpo nuovo. **Slide 3 (data-lake)**: eyebrow maiuscolo,
  "incontrare", "sistemi di oggi"; pannello con 3 paragrafi validati.
- **Slide 4**: rimosse le etichette gergali `FRONT`/`BACK`. **Slide 5**: titolo senza "a scala";
  blocchi validati; pannello "Contenuti on-brand, sempre".
- **NUOVA slide Francesca** ("Nel frattempo") tra "Parlarle la sua lingua" e il payoff → il deck
  passa da 8 a **9 slide** (il conteggio/indicatore deriva dal DOM: nessun array hardcoded da
  aggiornare in deck.ts/deck-audit.ts).
- **Payoff**: "tre quarti" a parole, orizzonte **2030**, fonte "Bain & Company · Altagamma,
  Luxury Goods Worldwide Market Study", bottone "Segue · L'incontro" (via l'all-caps gridato).
- **Fix di contenimento** (per passare ai 3 viewport senza tagliare il testo validato):
  phone IG con `max-h` legato al viewport.

### Verifica Phase L
- `pnpm --filter generazioni-maxmara audit:deck` → **0 FAIL su 9 slide × 3 viewport** (a–l, pannelli aperti).
- `pnpm build` + `pnpm typecheck` verdi. Conferma visiva (Playwright) di cover, Francesca, payoff
  e dei due pannelli ai viewport estremi.
- Convenzioni di stile: terza persona, "Max Mara" con spazio, "Whitney Bag", nomi prodotto Adobe
  solo in contesto/pannelli, fonti uniformi. (Residuo "Monogram" su persona.astro: fuori scope, a propagazione.)
- **NON propagato alle altre fasi.**
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
- [x] Abilitare hosting GitHub Pages (repo PUBLIC, Actions source) → live: https://agargiulo-adbe.github.io/experience-design-factory/acquisizione/
- [ ] Factory Console (apps/console) — local SPA editor + Node backend
- [ ] Self-host fonts (currently Google Fonts CDN)
- [ ] Firefly/placeholder imagery for media slots (currently empty placeholders)
- [ ] EN locale content
- [ ] Publish @agargiulo-adbe/experience-core to GitHub Packages
- [ ] Template repository setup
