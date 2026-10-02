# Install the “Panel review” skill

A panel review is three roles, not one: stakeholders who read the artifact **blind**, a
fact-checker who re-verifies every claim at its source, and an arbiter who turns the
verdicts into a P0/P1/P2 backlog. The brain is the body of [`SKILL.md`](./SKILL.md); the
prompts for the three roles are in `references/prompts/`, and the output schemas in
`references/schemas/`.

> The source of truth is `SKILL.md`. When you “paste the instructions”, paste everything
> **after** the YAML front-matter.

---

## Claude Code — the route that has been run end to end

1. Copy the folder to your skills directory:
   `cp -r skills/panel-review ~/.claude/skills/` (or your project’s `.claude/skills/`).
2. Invoke it on the thing you are about to hand over: `/panel-review <target>`.
3. It spawns every persona and the fact-checker in parallel through the Workflow tool,
   then the arbiter, and renders the verdict with
   `node references/render-verdict.mjs result.json verdict.md`.

Optional, and worth it in a repository: an **adapter** at `.claude/panel-review.md`
(template in `references/adapter-template.md`) that says where personas live, how evidence
is captured, which sources the fact-checker must use, and where the verdict is filed.

## Any other assistant — the degraded round, declared

The orchestration needs an agent harness. Without one the panel shrinks, it does not vanish:
open **one fresh conversation per role** — at least three stakeholders (the person in the
room, their manager, the owner of the data or system) plus the fact-checker — paste the
matching prompt from `references/prompts/`, give each one only the artifact and the portrait,
and merge the results yourself with the arbiter prompt. Mark the verdict
`⚠️ DEGRADED: reduced panel (no agent harness)`.

A reviewer who can see the conversation that produced the artifact is not a reviewer:
whatever the tool, the isolation is the mechanism.

## What it is not

It does not replace a legal, security or accessibility review, and it does not talk to the
client. The personas are portraits built from **public** sources, held internally, and never
shown to anyone outside the team.
