#!/bin/zsh
# radar-giro — il giro gratuito di ogni mattina. ZERO token: nessuna chiamata a un
# modello, solo lettura di file locali. Per questo continua a funzionare anche in un
# mese in cui il budget di Claude è esaurito, che è il guasto che il 2 ott 2026 ha
# ucciso il «Radar Opportunità» precedente.
#
# Lo lancia launchd (~/Library/LaunchAgents/com.gargiulo.radar.plist) lun-ven alle 07:30.
# La logica sta QUI e non nel plist: così è versionata, leggibile e correggibile.
#
#   1. scrive SEMPRE il file del giro, anche quando non trova niente → è il battito,
#      e `pnpm accounts` avvisa se diventa vecchio;
#   2. notifica SOLO se `--rilievi` produce qualcosa. Output vuoto = silenzio.
set -u
# Niente dipendenza dal PATH: launchd parte con un ambiente minimo, e un job che
# funziona a mano e muore sotto launchd è il peggiore dei due mondi. Percorso
# assoluto verificato, con ripiego su PATH per chi lo lancia da una shell normale.
# launchd parte con PATH=/usr/bin:/bin:/usr/sbin:/sbin — dove NON c'è né pnpm né
# **node**. Il giro del 13 ott moriva qui, con «env: node: No such file or directory»,
# scrivendo un file di 77 byte invece di 4700: funzionava a mano e moriva sotto
# launchd, che è il peggiore dei due modi di rompersi.
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

PNPM="/opt/homebrew/bin/pnpm"
[ -x "$PNPM" ] || PNPM="$(command -v pnpm 2>/dev/null)" || true
[ -x "$PNPM" ] || { osascript -e 'display notification "pnpm non trovato" with title "Radar · guasto"'; exit 1; }

REPO="$HOME/Documents/progetti/Experience Design Factory"
GIRI="$REPO/docs/Adobe/Radar/giri"
OGGI="$(date +%Y%m%d-%H%M)"

# RECUPERO. launchd con StartCalendarInterval fa partire il giro al risveglio se
# alle 07:30 il Mac dormiva, ma NON lo recupera se era spento. Il plist ha quindi
# anche RunAtLoad, così il giro parte al login — e questo controllo evita il
# doppione: se oggi è già stato fatto, non si rifà e non si notifica due volte.
# `RADAR_FORZA=1` lo salta, per provarlo a mano.
# ⚠️ `compgen -G` qui NON va: è un builtin di bash e questo script gira in zsh —
# la condizione cadeva sempre e il recupero non proteggeva da niente. L'ha trovato
# la prova, non la rilettura. `find` non dipende dalla shell.
GIRI_OGGI="$HOME/Documents/progetti/Experience Design Factory/docs/Adobe/Radar/giri"
GIA_FATTO="$(find "$GIRI_OGGI" -maxdepth 1 -name "$(date +%Y%m%d)-*.md" 2>/dev/null | head -1)"
if [ -z "${RADAR_FORZA:-}" ] && [ -n "$GIA_FATTO" ]; then
  exit 0
fi

cd "$REPO" || { osascript -e 'display notification "repo non trovato" with title "Radar · guasto"'; exit 1; }
mkdir -p "$GIRI"

{ echo "# Radar · giro del $(date '+%d %b %Y, %H:%M')"; echo; "$PNPM" --silent accounts; } > "$GIRI/$OGGI.md" 2>&1
RILIEVI="$("$PNPM" --silent accounts --rilievi 2>/dev/null)"

[ -z "${RILIEVI// /}" ] && exit 0   # mattina quieta: file scritto, nessuna interruzione

# Una notifica macOS collassa le righe multiple: non si impagina, si impila il
# significato. Quindi la cosa più urgente va nel SOTTOTITOLO, che si legge per primo,
# e le altre nel corpo unite da «·». Oltre i ~150 caratteri il sistema taglia: meglio
# tagliare noi, dicendo quante cose restano.
N=$(printf '%s\n' "$RILIEVI" | grep -c .)
PRIMA="$(printf '%s\n' "$RILIEVI" | head -1)"
# il separatore NON può essere «·»: le righe di rilievo lo usano già dentro, e
# unirle con lo stesso carattere rende illeggibile dove finisce una e comincia l'altra
ALTRE="$(printf '%s\n' "$RILIEVI" | tail -n +2 | head -3 | awk '{printf "%s%s", (NR>1 ? " | " : ""), $0}')"
[ "$N" -gt 4 ] && ALTRE="$ALTRE · e altre $((N - 4))"
[ ${#ALTRE} -gt 150 ] && ALTRE="${ALTRE:0:147}…"
TITOLO="Radar · $N cos$([ "$N" -eq 1 ] && echo a || echo e)"
q() { printf '%s' "${1//\"/\\\"}"; }
osascript -e "display notification \"$(q "$ALTRE")\" with title \"$(q "$TITOLO")\" subtitle \"$(q "$PRIMA")\""
