// Panel review — orchestration script for the Workflow tool.
// Invoke: Workflow({ scriptPath: "<skill dir>/references/workflow.js", args: ARGS })
//
// ARGS (all JSON values, not strings):
// {
//   artifact:  { title, kind, next_step, target_url? },      // kind: deck|site|app|pdf|doc|plan|pr
//   evidence_dir: "<abs path>",                                // README.md + content/ (+ shots/)
//   personas:  [{ id, name, portrait }],                        // 3–6; portrait = full public text
//   axes:      ["…", "…", "…", "…", "…"],                       // exactly five (references/scoring-axes.md)
//   language:  "it" | "en",
//   factcheck: { public_sources: ["…"], internal_sources: ["…"], internal_notes: "<path>" | null },
//   round:     1 | 2,
//   previous:  { verdict_dir: "<abs path>" } | null,            // round 2: dir holding persona-<id>.json, arbiter.json
//   date:      "YYYY-MM-DD"                                     // scripts cannot call Date
// }
// Returns { personas: [...], factcheck, arbiter, dropped: [...] } — write them to the verdict dir,
// then render references/verdict-template.md from them.
//
// This file is the executable source of truth for prompts and schemas; prompts/*.md and
// schemas/verdict.schema.json are the readable copies for the Agent-tool fallback.

export const meta = {
  name: 'panel-review',
  description: 'Stakeholder-panel review: blind personas + adversarial fact-checker in parallel, then an arbiter',
  phases: [
    { title: 'Panel', detail: 'one blind persona per stakeholder + one fact-checker, isolated, in parallel' },
    { title: 'Arbiter', detail: 'merge verdicts and fact-check into a P0/P1/P2 backlog' },
  ],
}

const a = args || {}
if (!a.artifact || !a.evidence_dir || !Array.isArray(a.personas) || !Array.isArray(a.axes)) {
  throw new Error('panel-review: args need artifact, evidence_dir, personas[], axes[]')
}
if (a.axes.length !== 5) throw new Error('panel-review: exactly five axes are required')
if (a.personas.length < 3) throw new Error('panel-review: at least three personas (degraded minimum)')
const lang = a.language === 'it' ? 'Italian' : 'English'
const fc = a.factcheck || {}
const round = a.round === 2 ? 2 : 1
const axesList = a.axes.map((x, i) => `${i + 1}. ${x}`).join(' · ')

// ---------- schemas (mirror of schemas/verdict.schema.json) ----------
const REF_WHY = { type: 'object', required: ['ref', 'why'], properties: { ref: { type: 'string' }, why: { type: 'string' } } }
const PERSONA_SCHEMA = {
  type: 'object',
  required: ['persona_id', 'scores', 'convinces', 'objections', 'questions', 'cut', 'add', 'domain_errors', 'copy_tells', 'verdict'],
  properties: {
    persona_id: { type: 'string' },
    scores: { type: 'array', minItems: 5, maxItems: 5, items: { type: 'object', required: ['axis', 'score', 'why'],
      properties: { axis: { type: 'string' }, score: { type: 'integer', minimum: 1, maximum: 5 }, why: { type: 'string' } } } },
    convinces: { type: 'array', items: REF_WHY },
    objections: { type: 'array', minItems: 3, items: { type: 'object', required: ['ref', 'objection', 'fix'],
      properties: { ref: { type: 'string' }, objection: { type: 'string' }, fix: { type: 'string' }, survived_from_round_1: { type: 'boolean' } } } },
    questions: { type: 'array', items: { type: 'object', required: ['question'],
      properties: { question: { type: 'string' }, expected_answer: { type: 'string' }, gap: { type: 'string' } } } },
    cut: { type: 'array', items: REF_WHY },
    add: { type: 'array', items: { type: 'object', required: ['what', 'why'], properties: { what: { type: 'string' }, why: { type: 'string' }, where: { type: 'string' } } } },
    domain_errors: { type: 'array', items: { type: 'object', required: ['ref', 'error', 'correct'], properties: { ref: { type: 'string' }, error: { type: 'string' }, correct: { type: 'string' } } } },
    copy_tells: { type: 'array', items: { type: 'object', required: ['ref', 'quote', 'rewrite'], properties: { ref: { type: 'string' }, quote: { type: 'string' }, rewrite: { type: 'string' } } } },
    verdict: { type: 'object', required: ['accept', 'lines'], properties: { accept: { type: 'string', enum: ['yes', 'conditional', 'no'] }, conditions: { type: 'array', items: { type: 'string' } }, lines: { type: 'string' } } },
  },
}
const FACTCHECK_SCHEMA = {
  type: 'object',
  required: ['claims', 'internal_inconsistencies', 'summary'],
  properties: {
    claims: { type: 'array', items: { type: 'object', required: ['ref', 'claim', 'status', 'source', 'evidence'],
      properties: { ref: { type: 'string' }, claim: { type: 'string' }, status: { type: 'string', enum: ['confirmed', 'refuted', 'unverifiable', 'internal-only'] },
        source: { type: 'string' }, evidence: { type: 'string' }, correction: { type: 'string' }, overstated: { type: 'boolean' } } } },
    internal_inconsistencies: { type: 'array', items: { type: 'object', required: ['refs', 'issue'], properties: { refs: { type: 'array', items: { type: 'string' } }, issue: { type: 'string' } } } },
    summary: { type: 'string' },
  },
}
const ARBITER_SCHEMA = {
  type: 'object',
  required: ['scores_summary', 'do_not_touch', 'backlog', 'disagreements', 'questions', 'verdict'],
  properties: {
    scores_summary: { type: 'array', items: { type: 'object', required: ['axis', 'mean', 'min', 'max'],
      properties: { axis: { type: 'string' }, mean: { type: 'number' }, min: { type: 'integer' }, max: { type: 'integer' }, delta: { type: 'number' } } } },
    do_not_touch: { type: 'array', items: { type: 'object', required: ['ref', 'strength', 'named_by'],
      properties: { ref: { type: 'string' }, strength: { type: 'string' }, named_by: { type: 'array', items: { type: 'string' } } } } },
    backlog: { type: 'array', items: { type: 'object', required: ['priority', 'ref', 'finding', 'change', 'kind', 'raised_by'],
      properties: { priority: { type: 'string', enum: ['P0', 'P1', 'P2'] }, ref: { type: 'string' }, finding: { type: 'string' }, change: { type: 'string' },
        kind: { type: 'string', enum: ['copy', 'structure', 'data', 'source', 'design', 'code'] }, raised_by: { type: 'array', items: { type: 'string' } },
        status_vs_round_1: { type: 'string', enum: ['new', 'survived', 'closed', 'regressed'] } } } },
    discarded: { type: 'array', items: { type: 'object', required: ['finding', 'why'], properties: { finding: { type: 'string' }, why: { type: 'string' } } } },
    disagreements: { type: 'array', items: { type: 'object', required: ['topic', 'positions', 'tradeoff'],
      properties: { topic: { type: 'string' }, positions: { type: 'array', items: { type: 'object', required: ['persona', 'position'], properties: { persona: { type: 'string' }, position: { type: 'string' } } } }, tradeoff: { type: 'string' } } } },
    questions: { type: 'array', items: { type: 'object', required: ['question'], properties: { question: { type: 'string' }, expected_answer: { type: 'string' }, gap: { type: 'string' } } } },
    verdict: { type: 'string' },
  },
}

// ---------- prompts (mirror of prompts/*.md) ----------
const live = a.artifact.target_url ? `The live version is at ${a.artifact.target_url}; open it if the pack is not enough.` : ''

function personaPrompt(p) {
  const prev = round === 2 && a.previous
    ? `This is round two. Your previous verdict is at \`${a.previous.verdict_dir}/persona-${p.id}.json\`: re-score the same axes, mark each objection with survived_from_round_1 (true if it is still open), and say which were answered.`
    : ''
  return `You are ${p.name}. This is who you are, from public record — stay in this seat for the whole task, with its knowledge, its scorecard and its irritations:

${p.portrait}

You have received a ${a.artifact.kind} titled «${a.artifact.title}». Whoever sent it wants this from you next: ${a.artifact.next_step}. You know only what a person in your seat knows: nothing about how it was made, no internal facts of the sender. If convincing you would require a fact you do not have, say that the artifact has a gap.

Read all of it, in order, from \`${a.evidence_dir}\` (\`README.md\` first: it explains the locator scheme; \`content/\` has the exact text per unit; \`shots/\` the images when present). ${live}
You are blind by design: read NOTHING outside that directory and the live URL — no repository files, no notes, no memory, no web search about the sender. If you did, your verdict is contaminated and must say so in its first line.
${prev}

Return, in ${lang}, exactly this (the schema enforces it; set persona_id = "${p.id}"):
1. Five scores 1–5, one per axis, each with ONE line of justification from your seat: ${axesList}. A 3 without an attached objection is not allowed.
2. What convinces you, with the locator.
3. What you would say out loud against it, in the room: 5–8 objections, each with the locator and the change that would make you drop it.
4. The questions you would ask, each with the answer you expect or the gap you see.
5. What you would cut (2–3) and what you would add (2–3).
6. Errors in your own domain: the wrong term, the missing KPI, the risk nobody named.
7. Copy that sounds like a vendor or like a machine, quoted, with how a colleague would say it.
8. Your verdict in three lines: do you accept the next step, under which conditions.

Be specific and local: every item carries a locator. No praise without a locator either. Your final text is data for an arbiter, not a message to a person.`
}

function factCheckerPrompt() {
  const pub = (fc.public_sources || []).join('; ') || 'the publisher\'s own official pages, primary documents, reputable press'
  const internal = (fc.internal_sources || []).length
    ? `Internal cross-check: ${fc.internal_sources.join('; ')}. A fact confirmed ONLY by an internal source cannot stand in the artifact as if it were public: mark it \`internal-only\`.`
    : ''
  const notes = fc.internal_notes
    ? `Author's notes and confidential context, for your eyes only: \`${fc.internal_notes}\`. Nothing from there may be quoted back into the artifact.`
    : ''
  return `You are the fact-checker for a ${a.artifact.kind} titled «${a.artifact.title}». Your job is to assume every claim is wrong until a source says otherwise. You are the second line: the author already believes these facts were verified. Authors are wrong about one in ten; find it.

Evidence: \`${a.evidence_dir}\` (\`README.md\` for the locator scheme, \`content/\` for the exact text; if \`content/_claims.md\` exists, start from it and then re-read every unit for claims it missed). ${live}

Inventory, then verify, EVERY: product or feature claim · date and version · number, percentage, price, count · named source or quote · link (open it: does it resolve, does it say that) · legal, regulatory or compliance statement · name of a person, product, organization.

Sources that count, in this order: ${pub}. ${internal}
${notes}

For each claim return: locator (ref), the claim verbatim, status (confirmed · refuted · unverifiable · internal-only), the source URL or document that decides it, the evidence in one line, and the correction when it is not confirmed; set overstated=true for claims that are true but phrased so the audience will read more into them. Also list internal_inconsistencies: numbers that disagree between two units of the same artifact.

Return in ${lang}. Your final text is data for an arbiter, not a message to a person.`
}

function arbiterPrompt(verdicts, factcheck) {
  const prev = round === 2 && a.previous
    ? `Round-1 arbiter output is at \`${a.previous.verdict_dir}/arbiter.json\`. Read it; set status_vs_round_1 on every backlog item (closed / survived / new / regressed) and delta on every axis.`
    : ''
  return `You are the arbiter of a stakeholder-panel review of a ${a.artifact.kind} titled «${a.artifact.title}». You did not build it and you did not review it. You receive the personas' verdicts and the fact-check, and you turn them into a backlog someone can act on in the next hour.

Axes: ${axesList}
Persona verdicts (JSON): ${JSON.stringify(verdicts)}
Fact-check (JSON): ${JSON.stringify(factcheck)}
${prev}

Produce:
1. scores_summary per axis: mean, min, max (and delta when round 1 exists).
2. do_not_touch: strengths named by more than one persona, with locator.
3. backlog: each item = priority + ref + finding + the concrete change + kind (copy, structure, data, source, design, code) + raised_by. Priority rule: P0 blocks the next step, or is a refuted fact, or a broken link; P1 will be raised out loud in the room; P2 polish. Merge duplicates across personas. Put false positives in discarded with one line of why.
4. disagreements: where personas want opposite things, both positions and the trade-off. Do not average them away.
5. questions the room will ask, deduplicated, each with the expected answer or the gap.
6. verdict in five lines: can the artifact go out, after which P0s, and the one objection most likely to sink it.

Return in ${lang}. Be concrete: every backlog item must be executable without re-reading the verdicts.`
}

// ---------- run ----------
phase('Panel')
log(`panel-review round ${round}: ${a.personas.length} personas + fact-checker on «${a.artifact.title}»`)
const panel = await parallel([
  ...a.personas.map(p => () => agent(personaPrompt(p), { label: `persona:${p.id}`, phase: 'Panel', schema: PERSONA_SCHEMA })),
  () => agent(factCheckerPrompt(), { label: 'fact-checker', phase: 'Panel', schema: FACTCHECK_SCHEMA, effort: 'high' }),
])
const personaResults = panel.slice(0, a.personas.length)
const factcheck = panel[a.personas.length]
const dropped = a.personas.filter((p, i) => !personaResults[i]).map(p => p.id)
if (!factcheck) dropped.push('fact-checker')
if (dropped.length) log(`⚠️ dropped (no result): ${dropped.join(', ')}`)
const verdicts = personaResults.filter(Boolean)
if (verdicts.length < 3) throw new Error(`panel-review: only ${verdicts.length} persona verdicts returned; below the degraded minimum`)

phase('Arbiter')
const arbiter = await agent(arbiterPrompt(verdicts, factcheck || { claims: [], internal_inconsistencies: [], summary: 'fact-checker returned nothing' }),
  { label: 'arbiter', phase: 'Arbiter', schema: ARBITER_SCHEMA, effort: 'high' })

return { round, date: a.date, personas: verdicts, factcheck, arbiter, dropped }
