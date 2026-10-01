---
name: panel-review
description: Use when a deliverable with a real audience is about to be handed over, sent, published or merged — a deck, a web app or site, a PDF, a business plan, a proposal, a report, a PR — and the only checks so far are rendering, lint, audit or the author's own read. Also use when the user asks "what will the client say", "review this as the CFO would", "fact-check this before it goes out", or wants the room's objections before the meeting.
---

# Panel review
*Stakeholder-panel review with adversarial fact-checking and a critique-revise loop.*

## Overview
A render check, a lint pass or a self-read prove that an artifact **works**. They prove
nothing about whether its audience will **buy the argument** or whether every claim in it
survives a check at its source. This skill makes those two things impossible to skip: fresh,
isolated agents play the real stakeholders **blind**, one paranoid fact-checker re-verifies
every claim at the source, one arbiter turns the verdicts into a prioritized backlog, and the
loop runs at most twice. It composes known patterns: a jury of diverse evaluators (Verga et
al. 2024, PoLL), persona simulation (Park et al. 2023; Argyle et al. 2023), red teaming
(Perez et al. 2022) and tool-grounded critique (Gou et al. 2023, CRITIC), inside an
evaluator-optimizer loop (Madaan et al. 2023 Self-Refine; Anthropic, *Building effective
agents*). It works on **any artifact**: the roles are invariant, only evidence capture and
scoring axes change by kind.

**Core principle: never the context that built it.** The author's context is contaminated by
intent. Reviewers get the artifact and a portrait, nothing else.

## Inputs
`/panel-review <target> [--round 2] [--report-only] [--kind deck|site|app|pdf|doc|plan|pr] [--lang it|en]`
- `target`: URL, file, directory, PR number, or "current change".
- The repo may carry an **adapter** at `.claude/panel-review.md` (format: `references/adapter-template.md`): where personas, evidence tooling, fact-check sources and the verdict live. **If the adapter exists, follow it; if not, run generic.**

## Procedure
1. **Classify the artifact** (`--kind` or infer). Pick the five scoring axes for that kind from `references/scoring-axes.md` (the adapter may override).
2. **Build the evidence pack** per `references/evidence-capture.md`: one directory with `README.md` (what it is, audience, locator scheme), `content/` (exact text per unit: slide, page, section, screen, file) and `shots/` when the artifact is visual. Reviewers read **only** this pack and the live target. A pack without exact text produces verdicts about impressions, not claims.
3. **Personas.** If the adapter names a personas file and it exists, use it. Otherwise derive 4–6 portraits from the artifact's declared audience with `references/personas-template.md`, write them next to the verdict, and mark the run `⚠️ DERIVED PERSONAS` in the first line of the verdict. Portraits of real people come from public sources only. Personas are **blind**: no author notes, no internal facts, no build conversation. If a persona would need an internal fact to be convinced, the artifact has a gap, not the persona.
4. **Run the panel** with the Workflow tool: `Workflow({scriptPath: "<this skill dir>/references/workflow.js", args: {...}})` (args documented at the top of the script). It spawns every persona and the fact-checker in parallel, then the arbiter; every return is schema-validated (`references/schemas/`). Without the Workflow tool, spawn the same agents with the Agent tool using the prompts in `references/prompts/` and the same schemas; never fewer roles.
5. **Write the verdict.** Save the Workflow result (the task output file wraps it under `result`) as `result.json` in the verdict directory (plus one `persona-<id>.json` per persona and `arbiter.json`, which round two reads), then `node <skill dir>/references/render-verdict.mjs result.json <verdict>.md --title "…" --lang it|en [--status "⚠️ …"]` renders `references/verdict-template.md`: scores table, do-not-touch, backlog P0/P1/P2, disagreements, fact-check table, open questions. Where it lives: the adapter says; default `panel-review/<date>-round<N>.md` next to the artifact. The chat gets the first screen of it (scores, P0 count, the three sharpest objections).
6. **Apply, if the source is yours.** If the artifact's source is in the working tree and the user asked for the artifact (not for a report) and `--report-only` is absent: apply every P0 and P1, re-run the artifact's own gates (build, audit, tests), then **re-run the panel for the delta** with the same personas (`--round 2`, `previous` = round-1 verdict). Otherwise deliver the report with the concrete rewrite for each item.
7. **Stop at round two.** What survives round two goes into the verdict as an open point, not a third round.

## Degraded run, declared
Under real time pressure the panel shrinks, it does not vanish: one round, at least **three personas** (the person in the room, their manager, the owner of the data or system) plus the fact-checker, P0 only. The verdict's first line reads `⚠️ DEGRADED: reduced panel (<reason>)` and the missing personas are listed as an open point. A silent reduction, or zero panel, is the failure this skill exists to prevent.

## Red flags — you are about to skip this
"The audit is green, it's ready" · "I read every slide myself" · "No time, the meeting is tomorrow" · "The facts were verified when I researched them" · "I know what the client will say" · "It's only a PDF, nobody will check the numbers". Each of these is the documented baseline failure: under pressure the author verifies rendering and tone and never the audience or the sources. A panel of five personas plus a fact-checker runs in parallel and costs less than one wrong number in front of the CFO.

## Rationalizations
| Excuse | Reality |
|---|---|
| "I'll review it as the client myself" | Same context, same blind spots. Isolation is the mechanism, not a formality. |
| "One strong reviewer is enough" | A jury of diverse evaluators beats a single judge; the arbiter exists to merge, not to replace. |
| "The fact-checker can skip public claims" | Public claims are the ones the audience will google. Every claim, at its source. |
| "The personas can see my notes, it's faster" | Then they are no longer the audience. Blind or nothing. |
| "Round three will fix the rest" | Diminishing returns past two; what survives is an open point for a human. |

## Common mistakes (seen in the field)
- **Axes picked by container.** A showcase *site* that pitches leadership is scored as a `deck`; a PDF budget as a `plan`. Classify by the next step the artifact asks for.
- **Personas that read the repo.** Workflow agents have every tool; blindness is enforced by the prompt and checked afterwards — grep the agent transcripts for reads outside the evidence pack. Zero is the only acceptable count.
- **Impressions instead of claims.** Screenshots without the exact text produce "it feels vendor-y"; the pack must carry every sentence, number and link so the fact-checker can refute something.
- **Arbiter that averages.** Two personas wanting opposite things is a finding (disagreements), not a 3.

## Quick reference
| Need | Where |
|---|---|
| How to capture evidence for a PDF, app, plan, PR | `references/evidence-capture.md` |
| Axes per artifact kind | `references/scoring-axes.md` |
| Persona / fact-checker / arbiter prompts | `references/prompts/*.md` |
| Output schemas | `references/schemas/verdict.schema.json` |
| Orchestration script | `references/workflow.js` |
| Verdict renderer (JSON → Markdown) | `references/render-verdict.mjs` |
| Repo adapter format | `references/adapter-template.md` |
| Verdict layout | `references/verdict-template.md` |
| Writing portraits | `references/personas-template.md` |
