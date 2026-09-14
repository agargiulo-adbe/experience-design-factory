---
name: open-experience
description: >
  Find and open a Factory experience for a meeting — right cut, right language — via the
  atelier MCP tools list_experiences and open_experience.
---

# Open Experience — the right deck, in the room, in the right language

Before a call, the fastest way to hand someone a live deck (not a screenshot, not a PDF
export) is to look up which Factory experience already fits the client/sector at hand and
open it with the right language and the right cut already set.

## Choosing the experience
- Call `list_experiences` first. Each entry carries `slug`, `name`, `client`, `url`,
  `sections`, and a one-line `tag` describing its angle (sector, languages, maturity).
- Match on the **client name** when there is a dedicated experience for that account
  (e.g. a UniCredit meeting → `unicredit-engagement`).
- With no dedicated experience, match on **sector and shape**: pick the closest industry
  (banking → UniCredit/Agos/Isybank, motorsport/automotive → Ferrari Racing, transport →
  Connessioni Intelligenti) or, for an internal/Adobe-facing conversation, the Atelier
  itself. Read the `tag` — it tells you chapter count, languages, and what's distinctive
  (e.g. "live product mockups", "forked deck") so you're not guessing from the name alone.
- When two experiences plausibly fit, prefer the more mature one (more sections, more
  recently touched) unless the meeting specifically needs the other's narrower angle.

## When to use the sponsor cut
Some experiences (e.g. the Atelier) support a narrower, sponsor-facing cut via a
`?s=<ids>` solution filter — fewer sections/solutions switched on, built for a specific
decision-maker rather than the full tour. Use it when the meeting is with a single
sponsor/budget holder and the full deck would bury the ask; skip it for a broad discovery
or workshop audience that benefits from seeing the whole path.

## Passing the language
Call `open_experience` with the slug and the desired language; it returns the direct
`url` (with `?lang=<code>` appended when the experience offers that language) and the
experience `name`. Match the language to the audience in the room, not to the experience's
default — e.g. Ferrari defaults EN but offers IT, UniCredit defaults IT but offers EN,
Atelier offers EN/IT/FR. If the requested language isn't offered by that experience, say so
rather than opening it silently in the wrong one — the engine only honours `?lang=` for a
language the page actually offers.

## What to share
Share the **link** `open_experience` returns — it is a live, navigable deck the recipient
can click through, scroll on their own device, and revisit later. Never a screenshot or a
static export: a picture loses the interactivity, the responsive behaviour, and any
solution/language state encoded in the URL. If a sponsor cut or a specific language was
requested, make sure both are baked into the URL you hand over, not explained separately.
