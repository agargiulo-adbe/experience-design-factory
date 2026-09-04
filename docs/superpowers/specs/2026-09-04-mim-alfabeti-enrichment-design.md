# MIM «Alfabeti» — arricchimento contenuti, persona docente, fix imagery & motion

**Date:** 2026-09-04 · **App:** `apps/mim-alfabeti` (`/mim-alfabeti/`) · **Status:** approved, in build

## Goal
Arricchire l'experience design «La voce del Ministero» rendendo i casi d'uso più
ispirazionali e documentati, aggiungendo una **persona narrativa** (docente
precaria) con dati reali «com'è oggi / come evolverebbe», sostituendo l'imagery
«alfabeti» AI-slop con un concept non-letterform, e applicando transizioni +
micro-movimento di qualità. Solo materiale pubblico, nessuna IP riservata.

## Decisioni (approvate dall'utente)
1. **Persona** = una **docente** (percorso immissione in ruolo / supplenze).
2. **Collocazione** = **entrambi**: nuova sezione dedicata **+** tocchi diffusi nei casi d'uso.
   - La nuova sezione `La storia di Giulia` va **dopo «I processi» (`/competenze`) e prima di «Governance» (`/accesso`)**.
3. **Imagery** = **sostituire con concept non-letterform** (niente glifi generati).
4. **Video trasformazione** (`alfabeto-competenza.mp4`, derivato dalle lettere) = **disabilitare**, lo scroll-scrub gira sui nuovi keyframe.

## Contesto ricerca
Copy/numeri della persona e dei casi d'uso vengono da un `/deep-research`
dedicato (personale scolastico IT: volumi docenti/precari/ATA/dirigenti,
immissioni in ruolo, supplenze, mobilità; esperienza vissuta della docente
precaria; canali e lacune di comunicazione del MIM). Numeri usati SOLO se
verificati e citabili; ±10% lunghezza stringhe per non rompere l'audit.

## 1. Nuova sezione `/storia` — «La storia di Giulia»
Nuova pagina deck (Astro) coerente col sistema `.alf-*`, 3 slide:
- **`slide-ritratto`** — Giulia oggi: docente precaria, GPS classe di concorso,
  supplenze annuali, attesa immissione. Dato reale citato (scala precariato).
- **`slide-notte`** — «La notte delle immissioni», com'è oggi: sito USR a
  mezzanotte, gruppi Facebook/Telegram, notizia frammentata, ansia da scadenza,
  rischio sede. La frammentazione resa umana.
- **`slide-evolve`** — Come cambia: **card UI HTML/CSS** (NON immagine) di un
  profilo governato RT-CDP + timeline journey AJO (avviso personalizzato →
  promemoria scadenza → conferma sede) con stati misurati *recapitato / aperto /
  azione*. Zero slop, àncora al prodotto.

Integrazioni: `AlfabetiNavigation` (nuova voce), `admin.astro` PAGE_REGISTRY,
catena `nextHref`/`prevHref` (competenze→storia→accesso), `SECTION_FLOW` gating
in `BaseLayout`. Bilingue `<T en it>` ovunque.

## 2. Tocchi diffusi (casi d'uso documentati)
- `domanda` / `competenze`: un **dato reale citato** per processo (supplenze,
  immissioni, mobilità), con `.alf-src`.
- `persone` / `slide-segments`: le 3 audience (Docenti/Dirigenti/ATA) da generiche
  a **credibili con numeri di scala** — risponde a «personas con dati da fonti affidabili».
- `competenze` / `slide-example`: worked journey legato a Giulia (continuità).

## 3. Fix imagery (non-letterform) — Firefly + C2PA
Prompt riscritti + rigenerati (chiavi in `.env`):
- **4 keyframe** (`keyframes.manifest.ts`): arco di **luce** — punti sparsi nel
  buio → convergenza → griglia luminosa ordinata → architettura di luce composta.
- **`bg-navy`**: profondità istituzionale astratta (fili/punti di luce + carta
  d'archivio nel buio), niente lettere.
- **`bg-carta` / `bg-carta-soft`**: carta goffrata, righe di registro, tratti
  d'inchiostro; negativi anti-glifo.
- **Video**: sorgente `<video>` rimossa dal path preferito su `/trasformazione`;
  lo scrub usa i keyframe rigenerati (Ken Burns + push-in + parallax già presenti).

## 4. Transizioni + micro-movimento (transform/opacity only, reduced-motion safe)
- **Backdrop parallax**: agganciare `data-parallax` ai `.alf-bg*` (già gestito da
  `playSlide` in `packages/core/.../animations.ts`) → deriva atmosferica lenta.
- **Reveal/stagger** più ricchi su card/righe (`data-stagger`), durate/easing rifiniti.
- **Transizione inter-slide/section**: view-transition più incisiva ma sobria
  (fade+scale/clip) al posto del fade 180ms piatto, con fallback reduced-motion.
- **`slide-evolve`**: riuso handler `clienteling` (scan → attributi) per popolare
  la card profilo di Giulia.

## Vincoli / quality bar
- Type & legibility contract (body ≥ 0.95rem, ink leggibili, no opacity-dimming).
- `audit:deck` 0 HARD failure a 1920/1440/1280 (build→preview→audit).
- **Screenshot 1920 letto a occhio** su ogni slide toccata + la nuova sezione.
- Copy 100% umano (rubrica `copy-must-be-human`), bilingue idiomatico.
- Nessun volto generato (coerente con l'art direction «no faces»); Giulia resa via
  contesto + card profilo, non un ritratto AI.

## Verifica finale
1. `pnpm --filter mim-alfabeti build` → `preview` → `audit:deck` (0 HARD).
2. Screenshot 1920 di: `/storia` (3 slide), slide arricchite, `/trasformazione` (nuovi frame).
3. `pnpm --filter mim-alfabeti typecheck`.
