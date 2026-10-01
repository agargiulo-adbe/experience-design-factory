# Evidence capture — building the pack reviewers read

Reviewers see **only** the evidence pack and, when it exists, the live target. The pack is a
directory (default: `<scratchpad>/panel-review/<slug>/evidence/`) with:

```
README.md     what the artifact is, who it is for, what "next step" it asks for, the LOCATOR scheme
content/      exact text per unit, one file per unit, named by locator (01-cover.md, p07.md, screen-checkout.md, src-auth.ts.diff)
shots/        one image per unit when the artifact is visual (same names as content/)
```

The **locator** is how every finding is anchored (`ref` in the schemas): slide id, page number,
section heading, route or screen name, `file:line`. State the scheme in README.md so every
reviewer uses the same one and the arbiter can merge.

**Exact text is mandatory.** Screenshots alone produce verdicts about impressions. The
fact-checker needs the literal sentence, number and link to check.

## By artifact kind

**Deck on a URL (immersive deck, slide site).** Build the static preview, then screenshot every
slide at projection size (1920×1080) with Playwright and dump each slide's text from the DOM
(`[data-slide]` or the equivalent). Locator = slide id. Include the nav order so the persona
reads in sequence.

**Web app / site / prototype.** Walk the main routes or flows the audience will use (home,
the task they came for, the error and empty states). For each screen: screenshot at the
audience's viewport (desktop 1440 for an internal tool, 390 for a consumer app) + page text
(`innerText`, forms with their labels, visible validation). Locator = route or screen name.
State in README which flows were walked; unvisited areas are an open point, not covered.

**PDF.** Read it page by page (the Read tool takes `pages`, max 20 per call). Write one
`content/pNN.md` per page with the text, tables flattened as rows, and every number and URL
kept verbatim. If `pdftoppm` is available, render pages to `shots/pNN.png`. Locator = page.
Classify the content (deck, plan, doc) and pick the axes accordingly.

**Office files (.pptx, .docx, .xlsx).** Convert to text with what is installed (`markitdown`,
`pandoc`, `python-pptx`, `libreoffice --headless --convert-to pdf` then the PDF path); fallback:
`unzip -p` the XML and strip tags. Locator = slide / heading / sheet!range. Keep formulas'
results, not formulas.

**Markdown / plain text (business plan, proposal, memo, spec).** Split on top-level headings;
one file per section. Locator = heading. Extract every number, date, named source and claim
into `content/_claims.md` as a list, so the fact-checker starts from an inventory.

**Pull request / patch.** `gh pr diff <n>` (or `git diff <base>...HEAD`), split per file into
`content/<path>.diff`, plus the PR description and the tests touched. Locator = `file:line`.
Personas here are **reviewer seats** (maintainer, on-call/ops, security, the API's consumer,
the product owner), still blind to the author's reasoning.

**Email / landing page / single page.** Rendered screenshot at the audience viewport + text
+ every link with its destination. Locator = block (header, hero, CTA, footer).

## Target you cannot capture
If a target cannot be rendered or read (login wall, missing tool, binary format), say so in
the verdict's first lines and review what *was* captured. Never let the pack silently cover
less than the artifact.
