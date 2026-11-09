#!/usr/bin/env bash
# Hook Stop: ricorda il lavoro non committato sulle experience.
#
# Perché. Il lavoro resta nel tree più spesso di quanto sembri — il 7 novembre
# il backlog portava ancora due voci su «sedici file modificati e non
# committati», e il 9 la Prospettiva Sales è arrivata a poche ore dalla stanza
# con una giornata intera fuori da git e il link pubblico fermo a due giorni
# prima. Non è pigrizia: è che a fine sessione il tree non lo guarda nessuno.
#
# Avvisa e basta: non blocca, non committa, non decide. Esce sempre 0 — un
# hook che fa fallire la fine di una sessione è peggio del difetto che segnala.
set -uo pipefail

cd "${CLAUDE_PROJECT_DIR:-.}" 2>/dev/null || exit 0
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || exit 0

# Le app toccate, dedotte dai percorsi: `apps/<slug>/...` → `<slug>`.
APPS=$(git status --porcelain -- apps/ 2>/dev/null \
  | sed -n 's|^...apps/\([^/]*\)/.*|\1|p' | sort -u)
[ -z "$APPS" ] && exit 0

N=$(printf '%s\n' "$APPS" | wc -l | tr -d ' ')
ELENCO=$(printf '%s\n' "$APPS" | paste -sd ', ' -)

printf 'Lavoro non committato su %s experience: %s.\n' "$N" "$ELENCO"
printf 'Finché resta qui non è in rete: il link pubblico serve il build precedente.\n'
printf 'Se una di queste ha una stanza vicina: /preflight-sala <slug>.\n'
exit 0
