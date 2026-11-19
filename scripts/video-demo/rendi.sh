#!/usr/bin/env bash
# Dalla ripresa al video: timeline → cartelli → mp4 → foglio di controllo.
# Uso: bash scripts/video-demo/rendi.sh <spec.json> <out_dir> [nome]
# Esce: <out_dir>/<nome>.mp4 e <out_dir>/foglio.jpg (sei fotogrammi da GUARDARE prima di consegnare).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
SPEC="$1"; OUT="$(mkdir -p "$2" && cd "$2" && pwd)"; NAME="${3:-demo}"
python3 -I "$HERE/monta.py" "$SPEC" "$OUT"
( cd "$HERE/../.." && node "$HERE/render.mjs" "$SPEC" "$OUT" )
N=$(python3 -c "import json;print(json.load(open('$OUT/meta.json'))['bands'])")
D=$(python3 -c "import json;print(round(json.load(open('$OUT/meta.json'))['total'],2))")
cd "$OUT"
# shellcheck disable=SC2046
ffmpeg -v error -y -f concat -safe 0 -i frames.txt $(cat inputs.txt) \
  -f lavfi -i anullsrc=r=48000:cl=stereo -filter_complex "$(cat fc.txt)" \
  -map "[v]" -map $((N+1)):a -t "$D" -c:v libx264 -crf 21 -preset veryfast \
  -c:a aac -movflags +faststart "$NAME.mp4"
ffmpeg -v error -y -ss 4 -i "$NAME.mp4" -vf "fps=6/$D,scale=800:-1,tile=2x3" -frames:v 1 foglio.jpg
ffprobe -v error -show_entries format=duration,size -of compact "$NAME.mp4"
echo "foglio di controllo: $OUT/foglio.jpg"
