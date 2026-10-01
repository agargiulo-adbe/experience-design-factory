# Scoring axes by artifact kind

Every persona returns **five scores 1–5, one line each**. The axis *set* depends on what is
being reviewed; the *shape* never changes. An adapter may replace a set; it may not reduce it
below five or drop the one-line justification.

| Kind | Axis 1 | Axis 2 | Axis 3 | Axis 4 | Axis 5 |
|---|---|---|---|---|---|
| `deck` (sales, pitch, keynote, workshop) | credibility of the facts | relevance for me | clarity | risk (5 = none perceived) | actionability (what I do on Monday) |
| `plan` (business plan, investment case, budget) | credibility of the assumptions | market and customer realism | financial coherence (numbers that add up across sections) | risk (5 = none perceived) | decision-readiness (can I fund / approve on this) |
| `site` / `app` (web app, site, prototype, product) | usefulness for my job | usability (can I do the task without help) | trust and safety (data, errors, permissions) | clarity of what it is and does | would I adopt it (5 = tomorrow) |
| `doc` (report, memo, proposal, policy, spec) | accuracy | completeness for my decision | clarity | relevance for me | decision-readiness |
| `pdf` | same as the underlying content: `deck`, `plan` or `doc` — classify by content, not by container |
| `pr` (pull request, patch) | correctness | safety (data, security, rollback) | maintainability | clarity of intent and tests | mergeability (5 = merge as is) |

Rules:
- **Classify by what the audience is asked to do, not by the container.** A site whose job is to
  persuade leadership is a `deck`; a PDF that is a budget is a `plan`; an app the persona must
  operate is `app`. Pick the set from the next step the artifact asks for.
- The persona scores from **its own seat**: the CFO's "relevance" is not the analyst's.
- A score of 3 with no objection attached is a non-answer; the prompt forbids it.
- Scores are compared **across rounds** by the same persona; the arbiter reports mean, min, max per axis and the delta from the previous round when one exists.
