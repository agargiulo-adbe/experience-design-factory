# Repo adapter — `.claude/panel-review.md`

The skill is invariant; the repo says where things are. Copy this file to
`.claude/panel-review.md` at the repo root and fill it in. Keep it short: facts the skill
cannot infer, nothing it already knows.

```markdown
# Panel review — adapter for <repo>

## Artifacts
<what gets reviewed here, how to recognise one, default `kind`>
<how to build/serve it for evidence capture — exact commands, ports>
<existing gates to re-run after applying fixes — exact commands, what "green" means>

## Personas
<path pattern of the personas file, e.g. `docs/<Client>/PANEL-PERSONAS.md`; whether it is git-ignored>
<where portraits come from in this repo (an intake skill, a brief) — so they are researched, not derived>

## Fact-check
<public sources that count for this domain, in order>
<internal cross-check tools (MCP, wikis) and the rule: a fact confirmed only internally cannot stand as public>
<what is treated as confidential and must never reach the artifact>

## Verdict
<where it lives: file path pattern, plus any mandatory mirrors (handover doc, dossier, ticket)>
<language of the verdict>

## Axes
<optional override of the five axes per kind, or "defaults">

## Apply policy
<"apply P0/P1 by default" or "report only"; who approves; what never changes without a human (prices, legal claims, names)>
```
