# Writing panel personas (blind portraits)

Personas drive the review: a weak portrait gives a generic verdict. Each portrait is **public
knowledge only** (LinkedIn, press, the company's own pages, the person's talks); when the
reviewed artifact is for named people, research them; when it is for roles, write the role as a
person with a seat, a scorecard and a history.

One file, one `##` per persona, 4–6 personas: the person in the room, then the people the
artifact gets forwarded to (their manager, the owner of the data or the system, the business
owner, the adjacent team or the regulator's voice when relevant).

```
# Panel personas — <artifact> (public portraits only)
Sources: <where the facts come from, with date>. No internal facts.

## <Name or seat> — <role>, <organization>
- Career in two lines (dates, previous roles, education if it shapes the lens).
- Seat: what they own, what they are measured on, who they report to.
- What makes them win: the outcome or KPI that gets them promoted.
- What irritates them: words, promises, past proposals, vendor habits.
- What they already saw from us and how it ended.
- Lens: financial · operational · growth · risk · technical (pick one or two).
- Decides: budget / how we work / nothing but influences <who>.
```

Rules:
- Facts come from the research procedure in `persona-research.md`; each carries its date and source inline.
- Facts with dates; no judgement of the person, no speculation about private life.
- Forbidden vocabulary for this audience (a regulator's decision, a past incident, a word the
  sponsor dislikes) goes in a final `## Vocabulary` section, stated as fact + date.
- Portraits of real people are **internal material**: keep them out of the artifact and out of
  anything public (in a git repo: under an ignored path, and say so in the adapter).
- A derived persona (no research possible) is still a full portrait; the verdict is marked
  `⚠️ DERIVED PERSONAS` so nobody mistakes it for the researched version.
