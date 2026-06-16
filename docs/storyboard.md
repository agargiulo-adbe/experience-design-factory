# Storyboard — Acquisizione (deck golden-reference)

Persona-led keynote deck. The story **follows Giulia** (29, the new customer);
**Francesca** (52) is the *thread* toward the later phases. Each slide is a beat
that reads in projection AND supports a live telling. Reusable components live in
`packages/core/src/blocks/` (+ `immersive/`).

## Theme & facts (verified)
- **Theme/title:** "Una relazione che attraversa il tempo" (cover hero). (Not "ringiovanire".)
- **Hero product:** **Whitney Bag** (iconic, 10th anniversary 2025, born with the
  Renzo Piano Building Workshop for the Whitney Museum). Slot `whitney-post`.
- **Sources — never cross-attribute a number:**
  - Luxury spend, **2030 horizon**: "Millennials already ~½ of luxury spend today; by 2030,
    with Gen Z, **over three quarters**" → **Bain & Company · Altagamma, Luxury Goods Worldwide
    Market Study**. (Shown as the word "tre quarti", not "75%"; no stale "entro il 2025".)
  - "+306% LTV of emotionally connected customers" → **Motista, *Leveraging the
    Value of Emotional Connection for Retailers*, 2018** (NOT Harvard / Bain).
  - Show the source as readable micro-text under every statistic.

## Style conventions (copy)
Third person (Giulia/Francesca) · "Max Mara" always with the space · "Whitney Bag" always ·
Adobe product names (Real-Time CDP, GenStudio, Firefly) ONLY in context and inside the
"Scopri come" panels — never in narrative labels/titles · no all-caps shouting on CTAs ·
no jargon in the main narrative ("a scala", "Front/Back", "privacy-safe" → plain Italian).

## Slides (cover + 8 = 9)
| # | Slide | bg | Beat | Key components |
|---|-------|----|------|----------------|
| 0 | Cover | brand | Tagline HERO ("Una relazione che attraversa il tempo"); eyebrow GENERAZIONI; co-brand **signature** `Max Mara —•— Adobe` (filo) at the bottom | `CoverSlide` |
| 1 | Apertura | secondary | "FASE 1 · ACQUISIZIONE" + "01" + "Incontrare chi ancora non ci conosce" | `Slide` + atmosphere backdrop |
| 2 | Giulia (LEI) | primary | The human face — portrait + who she is | `MediaSlot` (persona-giulia) |
| 3 | Il problema → profili | primary | Data lake → live profiles (Giulia + Francesca); "il CRM si collega, non si sostituisce" | data-lake anim + `HowItWorks` "Dal data lake ai profili" |
| 4 | Front stage | primary | She meets the Whitney Bag in her IG feed | `InstagramPost` (whitney-post) |
| 5 | L'aha ("Dietro le quinte") | secondary | The touch isn't lost — platform recognises her in real time (labels: "Giulia tocca" / "La piattaforma risponde", no Front/Back) | pulse diagram |
| 6 | Parlarle la sua lingua | inverse | Content on her terms — GenStudio+Firefly; lookalikes in plain Italian (RT-CDP) | `HowItWorks` "Contenuti on-brand, sempre" |
| 7 | Nel frattempo (Francesca) | secondary | The thread: same care that wins Giulia kept Francesca for 20 years | split portrait (persona-francesca) |
| 8 | Payoff + filo | brand | **"tre quarti"** (words, dark on camel) + 2030 stat; closing "iniziare una relazione"; CTA "Segue · L'incontro" | display hero (`data-display`) |

## "How it works" layers (optional depth)
`HowItWorks` opens a right slide-over with plain-language tech detail; the deck
reads fine without opening it (self-sufficient on screen for the live telling).
- **Dal data lake ai profili** → Real-Time CDP in 3 plain sentences: unify existing
  data into live profiles · connects (doesn't replace) CRM/existing systems ·
  privacy-safe data collaboration / clean room to find new clients like Giulia.
- **Contenuti on-brand a scala** → GenStudio + Firefly content supply chain in 3
  plain sentences.

## Principles
- **Products discreet & in context** — light attributions while the platform acts,
  max 2–3 per slide. The full stack reveal belongs ONLY to "Il Motore Adobe".
- **Safe-area absolute** — every slide fits whole at 1920×1080, centred, no clipping.
  If it doesn't fit, SPLIT into two slides.
- **prefers-reduced-motion** respected everywhere (final static states).

## Layout contract & visual audit
Every slide must pass `pnpm --filter generazioni-maxmara audit:deck` (Playwright) at **three
viewports — 1920×1080, 1440×900, 1280×800** — **12 deterministic DOM checks (a–l)**: text-in-band,
chrome collision, margins/overflow, text-over-faces, text-on-text, clean open slide-over (panels
opened & re-measured), vertical rhythm ≥16px, WCAG-AA button contrast, space usage ≥45% — plus the
**structural invariants**: **(j) nothing clipped / all inside the viewport**, **(k) no hidden
scroll**, **(l) trigger not obstructed when a panel is open**. Failures save a per-viewport screenshot.
A **display hero** (giant metric numeral) is tagged `data-display` and excluded from the prose
band check (a) — it's a display element, not prose, like the cover tagline or "tre quarti".

Notes baked into the slides:
- Content is centred on the **viewport centre** with a symmetric chrome reserve, so the band
  (a) and the ≥45% usage (i) are mutually satisfiable.
- The base CSS reset is in `@layer base` — unlayered `* {margin:0}` / `a {color}` would beat
  Tailwind utilities and kill rhythm/contrast.
- Slide 3 is a **balanced split** (text in-band on the left; a persistent faint data-field +
  larger profiles + "Profili unificati" caption on the right — the viz uses the space).
- `HowItWorks` opens as a **centred, bounded dialog** (`w≤min(720px,60vw)`,
  `max-height: calc(100dvh - 2*--slide-safe-inset)`, content fits without scroll; full-viewport
  scrim; panel moved to `<body>`) — never a clippable full-height side panel. `tone="onDark"` on dark slides.
- Slide 1's atmosphere is full-bleed behind text → `data-scrim`; portraits + IG image carry
  `data-no-text` zones. Safe-area tokens in `global.css`.
