#!/usr/bin/env bash
# La versione del deck per quando in sala non c'è rete.
#
# Uso: bash apps/trenitalia-prospettiva-sales/scripts/build-offline.sh <cartella-di-uscita>
# Va costruita con la rete, una volta: scarica Poppins e la traccia audio accanto al
# deck. L'uscita sta fuori da git: nel deck ci sono i nomi del team.
# Si apre da un piccolo server locale perché i percorsi sono assoluti (base di Pages)
# e i moduli JS non girano da file://.
set -euo pipefail
OUT="${1:?Serve la cartella di uscita}"
APP="$(cd "$(dirname "$0")/.." && pwd)"
BASE="experience-design-factory/trenitalia-prospettiva-sales"
mkdir -p "$OUT"
OUT_ABS="$(cd "$OUT" && pwd)"
# Si costruisce a parte e si sostituisce solo alla fine: se la rete cade a metà,
# la copia buona già in cartella resta intatta. Il giorno dell'incontro conta.
SITO="$OUT_ABS/.sito-nuovo"
DEST="$SITO/$BASE"
rm -rf "$SITO"; mkdir -p "$DEST"

cd "$APP"
PUBLIC_OFFLINE=1 npx astro build --outDir "$DEST" >/dev/null

# Le sorgenti pesanti non servono: restano solo le clip ricucite.
rm -f "$DEST/media/close-loop.mp4" "$DEST/media/cover-loop.mp4" "$DEST/media/close-loop.loop.mp4" "$DEST/media/cover-loop.loop.mp4"

curl -fsSL -o "$DEST/media/isu-ambient.loop.m4a" \
  https://github.com/agargiulo-adbe/experience-design-factory/releases/download/media/isu-ambient.loop.m4a

# Poppins, gli stessi pesi del deck, dentro la cartella
mkdir -p "$DEST/fonts"
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36'
curl -fsSL -A "$UA" 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap' -o "$DEST/fonts/poppins.css"
grep -oE 'https://fonts.gstatic.com/[^)]+' "$DEST/fonts/poppins.css" | sort -u | while read -r u; do
  f="$(basename "$u")"; curl -fsSL -o "$DEST/fonts/$f" "$u"
done
sed -i '' -E 's#https://fonts.gstatic.com/[^)]*/([^/)]+)#\1#g' "$DEST/fonts/poppins.css"

cat > "$SITO/index.html" <<H
<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/$BASE/"><title>Trenitalia</title>
H

# Tutto riuscito: ora si può sostituire.
test -s "$DEST/index.html" && test -s "$DEST/fonts/poppins.css" && test -s "$DEST/media/isu-ambient.loop.m4a"
rm -rf "$OUT_ABS/sito"; mv "$SITO" "$OUT_ABS/sito"

cat > "$OUT/Apri il deck.command" <<'C'
#!/bin/bash
# Doppio clic: apre il deck senza rete. Per fermarlo, si chiude questa finestra.
cd "$(dirname "$0")/sito"
PORTA=4827
( sleep 1; open "http://localhost:$PORTA/" ) &
exec python3 -m http.server "$PORTA" --bind 127.0.0.1
C
chmod +x "$OUT/Apri il deck.command"
du -sh "$OUT"
