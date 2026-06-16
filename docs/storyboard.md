# Storyboard — Acquisizione (deck golden-reference)

Persona-led keynote deck. The story **follows Giulia** (29, the new customer);
**Francesca** (52) is the *thread* toward the later phases. Each slide is a beat
that reads in projection AND supports a live telling. Reusable components live in
`packages/core/src/blocks/` (+ `immersive/`).

## Theme & facts (verified)
- **Theme/title:** "Una relazione che attraversa il tempo" — sub: "Incontrare una
  nuova generazione, onorare chi sceglie Max Mara da sempre." (Not "ringiovanire".)
- **Hero product:** **Whitney Bag** (iconic, 10th anniversary 2025, born with the
  Renzo Piano Building Workshop for the Whitney Museum). Slot `whitney-post`.
- **Sources — never cross-attribute a number:**
  - "75% / three quarters of luxury spend from Millennials & Gen Z by 2025" →
    **Bain & Company / Altagamma**.
  - "+306% LTV of emotionally connected customers" → **Motista, *Leveraging the
    Value of Emotional Connection for Retailers*, 2018** (NOT Harvard / Bain).
  - Show the source as readable micro-text under every statistic.

## Slides (cover + 7)
| # | Slide | bg | Beat | Key components |
|---|-------|----|------|----------------|
| 0 | Cover | brand | Cinematic opener: sartorial *filo* draws itself, "Max Mara × Adobe" converge, tagline | `CoverSlide` |
| 1 | Apertura | secondary | "01 · Acquisizione" + theme + strategic lead (75% Gen Z, Bain/Altagamma) | `Slide` + atmosphere backdrop |
| 2 | Giulia, il volto | primary | The human face of the journey — portrait + who she is | `MediaSlot` (persona-giulia) |
| 3 | Il problema → profili | primary | Data lake → live profiles (Giulia + Francesca emerge); CMO reassurance "il CRM si collega, non si sostituisce" | data-lake anim + `HowItWorks` "Dal data lake ai profili" |
| 4 | Front stage | primary | She meets the Whitney Bag where she already lives (IG feed) | `InstagramPost` (whitney-post) |
| 5 | Front→back (l'aha) | secondary | The touch isn't lost — platform recognises her in real time | pulse diagram |
| 6 | Come (in contesto) | inverse | Speak her language at scale — GenStudio+Firefly; lookalikes privacy-safe (RT-CDP) | `HowItWorks` "Contenuti on-brand a scala" |
| 7 | Payoff + filo | brand | 75% (dark text on camel), closing "iniziare una relazione", CTA → Engagement | count-up |

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
Every slide must pass `pnpm --filter generazioni-maxmara audit:deck` (Playwright,
1920×1080) — **9 deterministic DOM checks (a–i)**: text-in-band, chrome collision,
margins/overflow, text-over-faces, **text-on-text (e)**, **clean open slide-over (f, panels
are opened and re-measured)**, **vertical rhythm ≥16px (g)**, **WCAG-AA button contrast (h)**,
**space usage ≥45% + centred mass (i)**. Failures save a screenshot to `audit/acquisizione/`.

Notes baked into the slides:
- Content is centred on the **viewport centre** with a symmetric chrome reserve, so the band
  (a) and the ≥45% usage (i) are mutually satisfiable.
- The base CSS reset is in `@layer base` — unlayered `* {margin:0}` / `a {color}` would beat
  Tailwind utilities and kill rhythm/contrast.
- Slide 3 is a **balanced split** (text in-band on the left; a persistent faint data-field +
  larger profiles + "Profili unificati" caption on the right — the viz uses the space).
- `HowItWorks` opens as a true top-level slide-over (panel + scrim moved to `<body>`);
  `tone="onDark"` on dark slides keeps the trigger AA.
- Slide 1's atmosphere is full-bleed behind text → `data-scrim`; portraits + IG image carry
  `data-no-text` zones. Safe-area tokens in `global.css`.
