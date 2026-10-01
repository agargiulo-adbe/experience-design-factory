# Persona research — from a name and a role to a portrait

The panel is only as sharp as its portraits. This is the procedure that turns the minimum
input into a blind persona, with every fact dated and sourced. It runs **before** the panel,
by the main agent (not by the personas: they only receive the finished portrait).

## Input
| You have | What happens |
|---|---|
| Name + role + organization (4–6 people) | Full research below; verdict unmarked. |
| Role + organization, no name | Research the seat (who holds it, what it is measured on); write the portrait as a seat; verdict marked `⚠️ DERIVED PERSONAS`. |
| Nothing but the artifact | Derive seats from the artifact's declared audience; `⚠️ DERIVED PERSONAS`. |
| A LinkedIn profile (URL, PDF or screenshot) supplied by the user | Primary source for career and headline; LinkedIn blocks automated fetches, so it counts only when the user provides it. |

## Sources, in order (stop when the portrait's slots are filled)
1. **What the user supplied**: LinkedIn exports or screenshots, org charts, past meeting notes, previous proposals. Lives under the repo's confidential path (adapter), never in the artifact.
2. **The organization's own pages**: leadership bios, press releases naming the person, annual report and industrial plan (what the seat is measured on), org announcements.
3. **Press, interviews, podcasts, conference programs and talks** (WebSearch: `"<name>" <organization>`; `"<name>" intervista|interview`; `"<name>" <conference>`). Prefer the person's own words: they give the lens and the vocabulary.
4. **The person's publications and posts** when public: what they repeat is what they care about.
5. **Regulatory and public record facts about the organization** that shape the seat (a regulator's decision, a reorganization, a merger), each with its date: they become the forbidden vocabulary and the risk lens.
6. **Internal sources** (CRM, the vendor's own meeting notes, Fluffy-type tools) ONLY for the slot «what they already saw from us and how it ended»: that fact is known to the client too, so the persona may hold it. Nothing else from internal sources enters a portrait.

## Writing rules
- Every fact carries a **date and a source** (inline, short: `(LinkedIn, 29 set 2026)`, `(comunicato, 12 mar 2025)`). A fact without a source does not go in.
- Fill the template slots (`personas-template.md`): career, seat, what makes them win, what irritates them, what they already saw from us, lens, what they decide. A slot that research cannot fill stays **empty and marked «non trovato»**: an invented irritation produces an invented objection.
- Professional facts only. No private life, no health, no family, no speculation about personality. Public roles and public words, nothing else.
- Keep the person's **own vocabulary** when you have it (a quote from an interview is worth a paragraph of inference).
- The portrait is **internal material**: it lives under the adapter's confidential path (git-ignored in a repo), never in the artifact, never in a public page.

## Done when
- 4–6 portraits, each ≥ 5 sourced facts, each with a lens and a «decides» line.
- The forbidden-vocabulary section lists the organization's public incidents with dates.
- Empty slots are visible, not papered over.
- The file name and location match the adapter; the verdict will cite it.
