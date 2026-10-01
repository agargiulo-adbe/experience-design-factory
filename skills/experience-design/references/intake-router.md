# Intake router — from the client's question to the right deliverable

The first thing `/experience-design` does is decide **which of the four deliverables** the
situation calls for. Not a form: five questions, asked once (AskUserQuestion, two calls at
most), with defaults inferred from what is already known (brand site, public research, the
brief if one exists). The answer is a type from `packages/core/src/data/experienceTypes.ts`;
everything downstream (brief, scaffold, chapters, panel personas) follows from it.

## The five questions
1. **Who is in the room, and who receives it afterwards?** (C-level · function head with the
   business · CDO/CIO and architecture · the owner of a tool/admin · internal Adobe)
2. **Where are we in the cycle?** (before any discovery · after a workshop or co-design ·
   after discovery, scoping a phase · before go-live of something already bought)
3. **What must happen at the end of the meeting?** (open a working table · see it on our data ·
   scope a phase · switch it on · an internal decision)
4. **Does the client need to see software running?** (no, the story is enough · yes, live demos
   per chapter · yes, the real tool with their own questions)
5. **Is there reserved material, and are official brand assets available?** (drives the
   dossier, the `noindex` default, the co-brand slot and the showcase toggle)

## Decision table
| Signals (room · moment · ask · software) | Type | Why |
|---|---|---|
| C-level · before discovery · open a table · story is enough | **prospettiva** | «Dove potremmo arrivare?» — your year seen from outside, open questions, ideas, a route |
| business/marketing (+ partner) · after a workshop · see it on our data · live demos per chapter | **storia** | «Come funzionerebbe per un nostro cliente?» — one named persona, chapters = moments, the engine behind |
| CDO/CIO + business owner · after discovery · scope a phase · demos optional | **blueprint** | «Come si collega a quello che abbiamo?» — foundations, use cases, convergence, value, route |
| tool owner/admin · before go-live · switch it on · the real tool with their questions | **playbook** | «Come lo uso da lunedì?» — N questions = N chapters, today vs with X, what you take home |
| Adobe team/leadership · any · internal decision | **interno** | not client-facing; showcase, Atelier, research |

Ties: the **ask at the end** wins over the audience (a CIO who must scope a phase gets a
blueprint, not a prospettiva). A hybrid is allowed — Ferrari opens like a prospettiva and
runs like a blueprint — but it is **registered under the type where the decision happens**.

## What the type decides downstream
- **Cover line**: `EXPERIENCE_TYPES[type].coverLine` (IT/EN), rendered from the map, never typed by hand.
- **Chapters**: `EXPERIENCE_TYPES[type].skeleton` seeds `pnpm new:experience` and the PAGE_REGISTRY.
- **Panel personas** (`panel-review`): prospettiva → the C-level in the room + their chief of staff/CFO + the CDO; storia → marketing owner + partner lead + the data owner; blueprint → CDO/CIO + architect + business owner; playbook → the tool owner + their manager + one business user who asks the questions.
- **Next step** printed on the last slide before the signature: `EXPERIENCE_TYPES[type].nextStep`.
- **Registry**: `type` in `experiences.ts`, hub card, console (`0016`), MCP registry.

## What stays human (print it at the end of intake)
- 4–6 names with role and organization for the personas (and any LinkedIn export/screenshot) → `docs/<Client>/`.
- The client's site URL for `pnpm brand:tokens` and the official brand SVG (or accept the wordmark fallback).
- Reserved material to keep out of the build (meeting notes, contracts, plans) → `docs/<Client>/` (git-ignored).
- Whether the experience may be published on the showcase, and under which consent for the brand.
