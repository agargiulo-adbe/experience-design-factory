#!/bin/zsh
# radar-install — installa (o reinstalla) il giro gratuito del Radar.
#
# PERCHÉ ESISTE: la copia eseguita da launchd NON può stare in ~/Documents — da lì
# launchd non riesce a eseguirla, pur riuscendo a leggere i file di quella cartella
# (verificato il 13 ott 2026 con un job di prova). Quindi lo script si copia in
# ~/.local/bin e il plist si scrive in ~/Library/LaunchAgents. Tenere questo
# installatore nel repo è ciò che rende il tutto riproducibile su un'altra macchina,
# invece di essere configurazione che vive solo su un disco.
set -eu
REPO="${0:A:h:h}"
SRC="$REPO/scripts/radar-giro.sh"
DEST="$HOME/.local/bin/radar-giro"
PLIST="$HOME/Library/LaunchAgents/com.gargiulo.radar.plist"

[ -r "$SRC" ] || { echo "sorgente non trovata: $SRC"; exit 1; }
mkdir -p "$HOME/.local/bin" "$HOME/Library/LaunchAgents" "$REPO/docs/Adobe/Radar/giri"
cp "$SRC" "$DEST"; chmod +x "$DEST"; xattr -c "$DEST" 2>/dev/null || true

cat > "$PLIST" <<PL
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>com.gargiulo.radar</string>
  <!-- Generato da scripts/radar-install.sh: non si modifica a mano.
       In ProgramArguments ogni <string> è un argomento LETTERALE: niente shell,
       niente \$HOME, niente virgolette (la prima versione le passava dentro
       l'argomento e il job moriva con «can't open input file»). -->
  <key>ProgramArguments</key><array><string>$DEST</string></array>
  <key>StartCalendarInterval</key><array>
    <dict><key>Weekday</key><integer>1</integer><key>Hour</key><integer>7</integer><key>Minute</key><integer>30</integer></dict>
    <dict><key>Weekday</key><integer>2</integer><key>Hour</key><integer>7</integer><key>Minute</key><integer>30</integer></dict>
    <dict><key>Weekday</key><integer>3</integer><key>Hour</key><integer>7</integer><key>Minute</key><integer>30</integer></dict>
    <dict><key>Weekday</key><integer>4</integer><key>Hour</key><integer>7</integer><key>Minute</key><integer>30</integer></dict>
    <dict><key>Weekday</key><integer>5</integer><key>Hour</key><integer>7</integer><key>Minute</key><integer>30</integer></dict>
  </array>
  <!-- RunAtLoad: il giro parte anche al login, per recuperare il caso in cui alle
       07:30 il Mac era SPENTO (se dormiva, launchd lo fa partire da sé al risveglio).
       Il doppione lo evita lo script, che esce subito se oggi il giro c'è già. -->
  <key>RunAtLoad</key><true/>
  <key>StandardOutPath</key><string>/tmp/radar-giro.out</string>
  <key>StandardErrorPath</key><string>/tmp/radar-giro.err</string>
</dict>
</plist>
PL

launchctl unload "$PLIST" 2>/dev/null || true
launchctl load "$PLIST"
echo "installato: $DEST"
echo "schedulato: lun-ven 07:30 (com.gargiulo.radar)"
echo "a mano:     launchctl start com.gargiulo.radar"
echo "stato:      launchctl list | grep com.gargiulo.radar"
