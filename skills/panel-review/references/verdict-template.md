# Verdict layout

File: `<verdict path>/<YYYY-MM-DD>-round<N>.md` (adapter may redirect). First line is the
status line; then the sections, in this order, so two rounds are comparable at a glance.

```markdown
<status line: "Panel review — <artifact> — round N — <date>" | "⚠️ DEGRADED: reduced panel (<reason>)" | "⚠️ DERIVED PERSONAS">

## Scores (mean / min / max per axis; Δ vs round N-1 when it exists)
| Axis | Mean | Min | Max | Δ |

## Do not touch
- <ref> — <strength> (named by: A, B)

## Backlog
### P0 — blocks the next step
- <ref> — <finding> → <concrete change: copy / structure / data / source / design> (raised by: …)
### P1 — the room will raise it
### P2 — polish

## Disagreements kept
- <topic>: <persona A says …> vs <persona B says …> → trade-off: <…>

## Fact-check
| ref | claim | status (confirmed · refuted · unverifiable · internal-only) | source | correction |

## Questions the room will ask
- <question> — expected answer: <…> / gap

## Verdicts in three lines (per persona)
- **<persona>** (accept: yes / conditional / no): <lines>

## Open points after this round
- <what survived, who decides>
```

The chat gets the status line, the scores table, the P0 count and the three sharpest
objections with their fix. The file gets everything.
