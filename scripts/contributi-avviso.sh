#!/bin/zsh
# contributi-avviso — notifica sul Mac quando arriva un contributo nuovo dal
# modulo anonimo di un'edizione da distribuire (versione B, migrazione 0041).
#
# Legge SOLO i conteggi (RPC `contributi_avviso`) con una chiave dedicata che
# sta in ~/.config/edf/avviso-contributi.env (chmod 600, fuori dal repo); nel
# database c'è solo il suo sha256. Il testo dei contributi non passa di qui: si
# legge nella console, pagina «Contributi».
# Gira da launchd ogni 10 minuti (installato da scripts/contributi-install.sh);
# a mano: ~/.local/bin/contributi-avviso. Zero token: nessuna chiamata a un modello.
set -u
CONF="$HOME/.config/edf/avviso-contributi.env"
STATO="$HOME/.config/edf/avviso-contributi.stato"
[ -r "$CONF" ] || { echo "manca $CONF: lancia pnpm contributi:install"; exit 1; }
source "$CONF"   # SUPABASE_URL, SUPABASE_ANON, CHIAVE
R=$(/usr/bin/curl -sf -m 20 -X POST "$SUPABASE_URL/rest/v1/rpc/contributi_avviso" \
  -H "apikey: $SUPABASE_ANON" -H "Authorization: Bearer $SUPABASE_ANON" -H "Content-Type: application/json" \
  -d "{\"p_chiave\":\"$CHIAVE\"}") || { echo "rete o Supabase non raggiungibili"; exit 0; }
[ "$R" = "null" ] && { /usr/bin/osascript -e 'display notification "La chiave d’avviso non è registrata nel database" with title "Contributi · guasto"'; exit 1; }
# Una riga per progetto: «progetto nuovi ultimo». Si avvisa solo se `ultimo`
# è cambiato rispetto all'ultimo giro: un contributo nuovo, non uno vecchio non curato.
RIGHE=$(print -r -- "$R" | /usr/bin/python3 -c 'import json,sys
for x in json.load(sys.stdin) or []: print(x["progetto"], x["nuovi"], x["ultimo"])')
PRIMA=$(cat "$STATO" 2>/dev/null || true)
print -r -- "$RIGHE" > "$STATO"
print -r -- "$RIGHE" | while read -r prog n ultimo; do
  [ -z "${prog:-}" ] && continue
  prima=$(print -r -- "$PRIMA" | awk -v p="$prog" '$1 == p { print $3 }')
  [ "$ultimo" = "$prima" ] && continue   # niente di arrivato dall'ultimo giro (al più, curato)
  /usr/bin/osascript -e "display notification \"$n da leggere nella console, pagina Contributi\" with title \"Contributi · $prog\""
  echo "$(date '+%F %T') avviso: $prog $n nuovi (ultimo $ultimo)"
done
exit 0
