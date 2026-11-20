#!/bin/zsh
# contributi-install — installa l'avviso dei contributi (versione B delle edizioni
# da distribuire). Stesso schema di radar-install: la copia eseguita sta in
# ~/.local/bin (da ~/Documents launchd non esegue), il plist in ~/Library/LaunchAgents.
#
# La prima volta genera la chiave d'avviso in ~/.config/edf/avviso-contributi.env
# (chmod 600) e stampa l'SQL che ne registra lo sha256: va eseguito UNA volta sul
# database (npx supabase@latest db query --linked -f <file>). La chiave legge solo
# conteggi; non è la service_role e non apre nessun contenuto.
set -eu
REPO="${0:A:h:h}"
SRC="$REPO/scripts/contributi-avviso.sh"
DEST="$HOME/.local/bin/contributi-avviso"
PLIST="$HOME/Library/LaunchAgents/com.gargiulo.contributi.plist"
CONF="$HOME/.config/edf/avviso-contributi.env"
ENVAPP="$REPO/apps/intesa-esperienza-cliente/.env"

mkdir -p "$HOME/.local/bin" "$HOME/Library/LaunchAgents" "$HOME/.config/edf"
if [ ! -r "$CONF" ]; then
  URL=$(grep '^PUBLIC_SUPABASE_URL=' "$ENVAPP" | cut -d= -f2- | tr -d '"')
  ANON=$(grep '^PUBLIC_SUPABASE_ANON_KEY=' "$ENVAPP" | cut -d= -f2- | tr -d '"')
  CHIAVE=$(openssl rand -hex 32)
  umask 077
  printf 'SUPABASE_URL=%s\nSUPABASE_ANON=%s\nCHIAVE=%s\n' "$URL" "$ANON" "$CHIAVE" > "$CONF"
  HASH=$(printf '%s' "$CHIAVE" | shasum -a 256 | cut -d' ' -f1)
  SQL="$HOME/.config/edf/avviso-contributi.sql"
  printf "insert into public.chiavi_avviso (chiave_sha256, nota) values ('%s', 'Mac dell''owner, launchd') on conflict do nothing;\n" "$HASH" > "$SQL"
  echo "chiave nuova in $CONF"
  echo "DA FARE UNA VOLTA: npx supabase@latest db query --linked -f $SQL"
fi
cp "$SRC" "$DEST"; chmod +x "$DEST"; xattr -c "$DEST" 2>/dev/null || true

cat > "$PLIST" <<PL
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.gargiulo.contributi</string>
  <!-- Generato da scripts/contributi-install.sh: non si modifica a mano. -->
  <key>ProgramArguments</key><array><string>$DEST</string></array>
  <key>StartInterval</key><integer>600</integer>
  <key>RunAtLoad</key><true/>
  <key>StandardOutPath</key><string>/tmp/contributi-avviso.out</string>
  <key>StandardErrorPath</key><string>/tmp/contributi-avviso.err</string>
</dict>
</plist>
PL
launchctl unload "$PLIST" 2>/dev/null || true
launchctl load "$PLIST"
echo "installato: $DEST · ogni 10 minuti (com.gargiulo.contributi)"
