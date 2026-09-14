---
name: brand-tokens
description: >
  Read a client's public design system from its production CSS before designing anything
  for them; use the atelier MCP tool brand_tokens or pnpm brand:tokens.
---

# Brand Tokens — read the design system, don't recall it

An Experience Design is a skin over the shared Factory engine. If the skin isn't the
client's real design system, nothing else in the experience matters. The wrong way to get
there is going from memory — it has already cost real mistakes: "UniCredit is red" (the
system colour is petrolio `#007A91`; red `#E2001A` is only the logo mark), "Agos is blue
and red" (it is petrolio and acqua). Colours you remember from a brand deck or a logo are
not the design system; the production CSS is.

## When to use it
**First step of every new experience**, before choosing a single token or writing a line
of copy. Also re-run it whenever a client's site has visibly redesigned, or when a claim
about their palette/type is being made from memory rather than from a fetch.

## How to run it
- From the atelier MCP server: call `brand_tokens` with the client's live site URL.
- From the CLI: `pnpm brand:tokens <url>`.
Both fetch the site's production CSS directly (`fetch`, no headless browser — some banking
sites block headless but serve CSS to a plain GET) and return colours by frequency, any
custom properties the site exposes, and the declared font stack.

## How to read the evidence
- **The most frequent colour is the SYSTEM colour** — links, active states, tabs, focus
  rings — not the brand mark. The brand mark is often rare and instantly recognisable, and
  that rarity is exactly what makes it easy to mistake for "the" colour.
- Custom properties (`--brand-*`, `--color-*` etc.), if the site exposes any, **win over
  everything else** — they are the client's own token names.
- Framework defaults (Bootstrap/Tailwind blues and greys) are noise: separate them from the
  client's actual palette before counting.
- Declared fonts are a starting point, not a final answer — most proprietary client faces
  are not redistributable (e.g. UniCredit's `unicredit-regular/medium/bold`). Pick the
  closest freely-licensed substitute and record *why* it was chosen in the experience's
  `global.css`, so nobody swaps it later out of taste.

## What NOT to do
- Do not decide tokens from a brand book, a press kit, or memory of "how the brand looks."
  A brand book states intent; the production CSS states what is actually shipped.
- Do not assume the most prominent/loud colour is the system colour — check frequency, not
  visual weight.
- Do not skip this step because the brand "seems obvious." Both documented mistakes above
  happened on well-known, apparently obvious brands.

## Expected output
A short table of evidence, plus a proposed mapping — evidence, not a finished decision:
1. **Colours** — value, frequency count, and a first guess at role (system / brand /
   neutral).
2. **Fonts** — declared family names and where they appear (body vs. headings).
3. **Custom properties**, if any, verbatim.
4. **A proposed token mapping** onto the Factory contract — `--surface-primary/secondary/
   inverse/brand`, `--ink-*`, `--accent-primary/secondary` — keeping primary/secondary light
   and inverse dark so shared blocks (deck, admin, co-brand signature) keep working. This
   mapping is a design decision made by looking at *where* each colour is used on the real
   site, not an automatic output of the script.
5. The experience's `global.css` should be able to cite this run as its source for every
   token value that isn't a framework default.
