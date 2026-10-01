#!/usr/bin/env node
// Render the Workflow result of panel-review into the verdict Markdown (references/verdict-template.md).
// Usage: node render-verdict.mjs <result.json> <out.md> [--title "…"] [--status "⚠️ DERIVED PERSONAS"] [--lang it|en]
// result.json = what workflow.js returned: { round, date, personas[], factcheck, arbiter, dropped[] }
import fs from 'node:fs'

const [,, inPath, outPath, ...rest] = process.argv
if (!inPath || !outPath) { console.error('usage: render-verdict.mjs <result.json> <out.md> [--title t] [--status s] [--lang it|en]'); process.exit(2) }
const opt = {}
for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace(/^--/, '')] = rest[i + 1]
const raw = JSON.parse(fs.readFileSync(inPath, 'utf8'))
const r = raw.result && raw.result.arbiter ? raw.result : raw   // accept the task output file ({result:{…}}) or the bare result
const it = (opt.lang || 'it') === 'it'
const t = it
  ? { title: 'Panel review', round: 'giro', scores: 'Voti (media / min / max per asse; Δ vs giro precedente)', dnt: 'Non toccare', backlog: 'Backlog', p0: 'P0 — blocca il passo successivo', p1: 'P1 — la sala lo solleverà', p2: 'P2 — rifinitura', dis: 'Disaccordi mantenuti', fc: 'Fact-check', q: 'Domande che la sala farà', v: 'Verdetti in tre righe', open: 'Punti aperti dopo questo giro', by: 'sollevato da', named: 'citato da', dropped: 'ruoli senza risultato', none: 'nessuno', expected: 'risposta attesa', gap: 'lacuna', tradeoff: 'trade-off', discarded: 'Scartati dall\'arbitro' }
  : { title: 'Panel review', round: 'round', scores: 'Scores (mean / min / max per axis; Δ vs previous round)', dnt: 'Do not touch', backlog: 'Backlog', p0: 'P0 — blocks the next step', p1: 'P1 — the room will raise it', p2: 'P2 — polish', dis: 'Disagreements kept', fc: 'Fact-check', q: 'Questions the room will ask', v: 'Verdicts in three lines', open: 'Open points after this round', by: 'raised by', named: 'named by', dropped: 'roles with no result', none: 'none', expected: 'expected answer', gap: 'gap', tradeoff: 'trade-off', discarded: 'Discarded by the arbiter' }

const a = r.arbiter || {}
const lines = []
const status = [opt.status, r.dropped?.length ? `⚠️ ${t.dropped}: ${r.dropped.join(', ')}` : null].filter(Boolean).join(' · ')
lines.push(`${t.title} — ${opt.title || ''} — ${t.round} ${r.round} — ${r.date}${status ? ' — ' + status : ''}`)
lines.push('', `## ${t.scores}`, '| Axis | Mean | Min | Max | Δ |', '|---|---|---|---|---|')
for (const s of a.scores_summary || []) lines.push(`| ${s.axis} | ${Number(s.mean).toFixed(1)} | ${s.min} | ${s.max} | ${s.delta == null ? '' : (s.delta > 0 ? '+' : '') + Number(s.delta).toFixed(1)} |`)
lines.push('', `## ${t.dnt}`)
for (const d of a.do_not_touch || []) lines.push(`- \`${d.ref}\` — ${d.strength} (${t.named}: ${(d.named_by || []).join(', ')})`)
if (!(a.do_not_touch || []).length) lines.push(`- ${t.none}`)
lines.push('', `## ${t.backlog}`)
for (const [p, h] of [['P0', t.p0], ['P1', t.p1], ['P2', t.p2]]) {
  lines.push(`### ${h}`)
  const items = (a.backlog || []).filter(b => b.priority === p)
  if (!items.length) lines.push(`- ${t.none}`)
  for (const b of items) lines.push(`- \`${b.ref}\` — ${b.finding} → **${b.kind}**: ${b.change} (${t.by}: ${(b.raised_by || []).join(', ')}${b.status_vs_round_1 ? '; ' + b.status_vs_round_1 : ''})`)
}
if ((a.discarded || []).length) { lines.push('', `### ${t.discarded}`); for (const d of a.discarded) lines.push(`- ${d.finding} — ${d.why}`) }
lines.push('', `## ${t.dis}`)
for (const d of a.disagreements || []) lines.push(`- **${d.topic}**: ${(d.positions || []).map(p => `${p.persona}: ${p.position}`).join(' · ')} → ${t.tradeoff}: ${d.tradeoff}`)
if (!(a.disagreements || []).length) lines.push(`- ${t.none}`)
lines.push('', `## ${t.fc}`, '| ref | claim | status | source | correction |', '|---|---|---|---|---|')
for (const c of (r.factcheck?.claims || [])) lines.push(`| \`${c.ref}\` | ${esc(c.claim)} | ${c.status}${c.overstated ? ' (overstated)' : ''} | ${esc(c.source)} | ${esc(c.correction || '')} |`)
for (const i of (r.factcheck?.internal_inconsistencies || [])) lines.push(`| ${i.refs.map(x => '`' + x + '`').join(' / ')} | ${esc(i.issue)} | inconsistency | — | — |`)
if (r.factcheck?.summary) lines.push('', r.factcheck.summary)
lines.push('', `## ${t.q}`)
for (const q of a.questions || []) lines.push(`- ${q.question}${q.expected_answer ? ` — ${t.expected}: ${q.expected_answer}` : ''}${q.gap ? ` — ${t.gap}: ${q.gap}` : ''}`)
lines.push('', `## ${t.v}`)
for (const p of r.personas || []) lines.push(`- **${p.persona_id}** (accept: ${p.verdict?.accept}): ${p.verdict?.lines}${p.verdict?.conditions?.length ? ' — ' + p.verdict.conditions.join('; ') : ''}`)
lines.push('', `## ${t.open}`)
lines.push(a.verdict || '')
fs.writeFileSync(outPath, lines.join('\n') + '\n')
console.log(`verdict → ${outPath} (${(a.backlog || []).filter(b => b.priority === 'P0').length} P0, ${(a.backlog || []).filter(b => b.priority === 'P1').length} P1, ${(a.backlog || []).filter(b => b.priority === 'P2').length} P2)`)
function esc(s) { return String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ') }
