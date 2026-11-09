#!/usr/bin/env bash
# DOTTORE — l'ambiente sta in piedi?
#
# Perché esiste. Il 9 novembre, migrando su un altro Mac, due cose si sono
# rotte SENZA DIRLO: `posta.py` cercava un profilo Outlook che su questa
# macchina ha un altro nome, e `git push` falliva perché il credential
# helper invoca `gh`, che non era più installato. Nessuna delle due ha
# prodotto un allarme: la prima restituiva zero messaggi, la seconda si è
# vista solo provando a pubblicare. Il Radar, nel 2026, era già morto per
# dieci giorni senza che nessuno se ne accorgesse.
#
# La forma dell'errore è sempre la stessa: un pezzo smette di funzionare e
# il sistema continua a sembrare sano. Questo script guarda i pezzi che
# tacciono quando muoiono.
#
# Esce 1 se c'è almeno un ROSSO. Non ripara niente: dice e basta.
set -uo pipefail

ROSSI=0
GIALLI=0

ok()    { printf '  🟢  %-22s %s\n' "$1" "$2"; }
warn()  { printf '  🟡  %-22s %s\n' "$1" "$2"; GIALLI=$((GIALLI+1)); }
bad()   { printf '  🔴  %-22s %s\n' "$1" "$2"; ROSSI=$((ROSSI+1)); }

printf '\n  DOTTORE · %s\n\n' "$(date '+%Y-%m-%d %H:%M')"

# ── 1. I binari che gli script danno per scontati ──────────────────────────
printf '  Binari\n'
for b in node pnpm npx python3; do
  if command -v "$b" >/dev/null 2>&1; then ok "$b" "$(command -v "$b")"
  else bad "$b" 'MANCA — script che lo invocano falliranno'; fi
done
# `tsx` non è globale: vive nei node_modules del workspace. Cercarlo nel PATH
# dava un rosso falso — e un rosso falso costa quanto un verde falso.
if [ -x "$(git rev-parse --show-toplevel 2>/dev/null)/node_modules/.bin/tsx" ]; then
  ok 'tsx' 'node_modules/.bin/tsx'
else
  bad 'tsx' 'assente dal workspace — pnpm install'
fi
# `gh` non serve a compilare, ma il credential helper di git lo invoca: senza
# di lui il push muore con un messaggio che parla d'altro.
if command -v gh >/dev/null 2>&1; then ok 'gh' "$(command -v gh)"
else bad 'gh' 'MANCA — git push fallirà con «Authentication failed»'; fi

# ── 2. Git: si pubblica davvero? ───────────────────────────────────────────
printf '\n  Git\n'
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  RAMO=$(git rev-parse --abbrev-ref HEAD)
  AVANTI=$(git rev-list --count '@{u}..HEAD' 2>/dev/null || echo '?')
  SPORCHI=$(git status --porcelain | wc -l | tr -d ' ')
  [ "$AVANTI" = "0" ] && ok 'allineato a origin' "ramo $RAMO" \
                      || warn 'commit non pushati' "$AVANTI su $RAMO"
  [ "$SPORCHI" = "0" ] && ok 'working tree' 'pulito' \
                       || warn 'working tree' "$SPORCHI file non committati"
  # ⚠️ `ls-remote` NON è una prova: su un repo pubblico passa in anonimo, e
  # dava verde mentre il push falliva. La scrittura si prova con un push a
  # vuoto, con il prompt disattivato così fallisce invece di chiedere.
  # ⚠️ Il timeout non è un lusso: senza `gh`, il credential helper configurato
  # resta appeso invece di fallire, e il dottore non torna più. Un controllo di
  # salute che si pianta è il guasto che dovrebbe trovare.
  if GIT_TERMINAL_PROMPT=0 GIT_ASKPASS=/usr/bin/true \
     perl -e 'alarm 15; exec @ARGV' git push --dry-run --quiet origin HEAD >/dev/null 2>&1; then
    ok 'push' 'le credenziali di scrittura rispondono'
  elif git ls-remote --exit-code origin HEAD >/dev/null 2>&1; then
    bad 'push' 'origin si legge ma NON si scrive — credenziali assenti o scadute'
  else
    bad 'push' 'origin non raggiungibile'
  fi
else
  bad 'repository' 'non sei dentro un repo git'
fi

# ── 3. I server MCP configurati partono? ───────────────────────────────────
# Si leggono da ~/.claude.json e si prova ad avviarli: un server che non
# parte non compare fra i tool, e la sessione non te lo dice — sembra solo
# che quella capacità non esista.
printf '\n  Server MCP (user scope)\n'
if [ -f "$HOME/.claude.json" ]; then
  while IFS=$'\t' read -r nome cmd; do
    [ -z "$nome" ] && continue
    if [ -z "$cmd" ] || command -v "$cmd" >/dev/null 2>&1 || [ -x "$cmd" ]; then
      ok "$nome" "${cmd:-(comando non dichiarato)}"
    else
      bad "$nome" "comando assente: $cmd"
    fi
  done < <(python3 - "$HOME/.claude.json" <<'PY'
import json, sys
try:
    d = json.load(open(sys.argv[1]))
except Exception:
    sys.exit(0)
for nome, cfg in (d.get('mcpServers') or {}).items():
    print(f"{nome}\t{cfg.get('command', '')}")
PY
  )
else
  warn 'configurazione' '~/.claude.json non trovato'
fi

# ── 4. Il Radar gira ancora? ───────────────────────────────────────────────
# Caricato NON basta: la volta che è morto, launchd lo dava per vivo. Quello
# che conta è se esiste un giro recente.
printf '\n  Radar\n'
if launchctl list 2>/dev/null | grep -q 'com.gargiulo.radar'; then
  ok 'launchd' 'com.gargiulo.radar caricato'
else
  bad 'launchd' 'com.gargiulo.radar NON caricato — pnpm radar:install'
fi
GIRI="$(git rev-parse --show-toplevel 2>/dev/null)/docs/Adobe/Radar/giri"
if [ -d "$GIRI" ]; then
  ULTIMO=$(ls -t "$GIRI" 2>/dev/null | head -1)
  if [ -n "$ULTIMO" ]; then
    ETA=$(( ( $(date +%s) - $(stat -f %m "$GIRI/$ULTIMO") ) / 86400 ))
    [ "$ETA" -le 2 ] && ok 'ultimo giro' "$ULTIMO ($ETA giorni fa)" \
                     || bad 'ultimo giro' "$ULTIMO — $ETA giorni fa: il Radar è fermo"
  else
    bad 'ultimo giro' 'nessun giro in docs/Adobe/Radar/giri'
  fi
else
  warn 'giri' 'cartella non trovata (normale in un clone pulito: è git-ignorata)'
fi

# ── 5. La posta ────────────────────────────────────────────────────────────
# Il nome del profilo cambia fra installazioni: si cerca, non si assume.
printf '\n  Posta\n'
PROFILI="$HOME/Library/Group Containers/UBF8T346G9.Office/Outlook/Outlook 15 Profiles"
# ⚠️ Tre esiti, non due. «Non trovato» e «non ho il permesso di guardare» sono
# cose diverse: la seconda è TCC (Accesso completo al disco) e dipende da CHI
# lancia lo script, non dalla macchina. Confonderle dà un allarme ogni volta
# che il dottore gira da un processo senza quel permesso.
if [ ! -d "$PROFILI" ]; then
  bad 'profilo Outlook' 'cartella dei profili assente — Outlook non è configurato'
elif ! ls "$PROFILI" >/dev/null 2>&1; then
  warn 'profilo Outlook' 'non leggibile da qui: serve Accesso completo al disco per questo processo'
else
  STORE=$(find "$PROFILI" -maxdepth 2 -name HxStore.hxd 2>/dev/null | head -1)
  if [ -n "$STORE" ]; then
    ok 'profilo Outlook' "$(basename "$(dirname "$STORE")")"
  else
    bad 'profilo Outlook' 'HxStore.hxd non trovato — posta.py restituirà zero messaggi'
  fi
fi

# ── Esito ──────────────────────────────────────────────────────────────────
printf '\n'
if [ "$ROSSI" -gt 0 ]; then
  printf '  %s rossi, %s gialli. I rossi si chiudono prima di fidarsi di quello che il sistema dice.\n\n' "$ROSSI" "$GIALLI"
  exit 1
fi
printf '  Nessun rosso%s. L'"'"'ambiente regge.\n\n' "$([ "$GIALLI" -gt 0 ] && echo ", $GIALLI gialli")"
