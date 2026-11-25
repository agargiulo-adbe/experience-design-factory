#!/usr/bin/env bash
# Prepara una copia dell'edizione di Intesa da caricare su Awesome (Adobe),
# per le reti che bloccano *.github.io a livello DNS (Deloitte, 25 nov 2026).
#
#   bash scripts/awesome-pack.sh [sottodominio]             # versione A, senza modulo
#   bash scripts/awesome-pack.sh --insieme [sottodominio]   # versione B, con il modulo
#
# --insieme (25 nov 2026, decisione dell'owner): il modulo «Fateci una domanda»
# scrive su Supabase come la B su GitHub, e il contatore conta (progetto
# intesa-storia-insieme). Il rischio di policy su Supabase è noto e accettato.
#
# Che cosa esce, e perché:
# - la versione A (lettura, senza modulo): nessuna chiamata a Supabase, perché
#   Supabase non risulta approvato per dati di clienti (Fluffy, 25 nov 2026);
#   senza chiavi spariscono anche il contatore e la frase che lo annuncia;
# - percorsi alla RADICE del dominio (base '/'), come serve Awesome;
# - lo zip in docs/Factory/awesome/ (git-ignorato), pronto per awesome.adobe.io/go
#   oppure per un'app Awesome con zona Public (internet) · entapp.adproto.com
#   e accesso a password. Awesome si raggiunge solo da rete Adobe o VPN.
set -euo pipefail
cd "$(dirname "$0")/.."

INSIEME=0
if [ "${1:-}" = "--insieme" ]; then INSIEME=1; shift; fi
SUB="${1:-intesa-storia}"
APP=apps/intesa-esperienza-cliente
OUT=dist-awesome
DEST=docs/Factory/awesome
ZIP="$DEST/$SUB.zip"

# Le variabili già presenti vincono sul .env dell'app (regola di Vite): vuote,
# spengono Supabase in questa build e solo in questa.
if [ "$INSIEME" = 1 ]; then
  # Le chiavi arrivano dal .env dell'app, come per la B su GitHub.
  PUBLIC_EDF_EDIZIONE=lettura PUBLIC_EDF_VERSIONE=insieme \
  EDF_SITE="https://$SUB.entapp.adproto.com" EDF_BASE=/ EDF_OUT="./$OUT" \
    pnpm --filter intesa-esperienza-cliente exec astro build >/dev/null
else
  PUBLIC_EDF_EDIZIONE=lettura PUBLIC_EDF_VERSIONE= \
  PUBLIC_SUPABASE_URL= PUBLIC_SUPABASE_ANON_KEY= \
  EDF_SITE="https://$SUB.entapp.adproto.com" EDF_BASE=/ EDF_OUT="./$OUT" \
    pnpm --filter intesa-esperienza-cliente exec astro build >/dev/null
fi

D="$APP/$OUT"
# Controlli che devono passare prima di caricare qualcosa.
if [ "$INSIEME" = 1 ]; then
  grep -rq "data-edf-mc-form" "$D" || { echo "✗ il modulo non è nella build"; exit 1; }
  grep -rq "supabase.co" "$D" || { echo "✗ il modulo non ha le chiavi di Supabase"; exit 1; }
elif grep -rlq "supabase.co" "$D"; then echo "✗ la build chiama ancora Supabase"; exit 1; fi
if grep -rl "experience-design-factory/" "$D" --include=*.html | head -1 | grep -q .; then
  echo "✗ percorsi rimasti sul vecchio base:"; grep -rlo "experience-design-factory/[a-z-]*" "$D" --include=*.html | head; exit 1
fi
[ -f "$D/index.html" ] || { echo "✗ manca index.html"; exit 1; }

# Awesome inietta i suoi analytics in ogni pagina, accesi di default (pagine viste,
# visitatori). La pagina non dichiara misure, e la regola è che la telemetria non
# si accende su un link cliente senza dirlo: si spengono le pagine viste
# automatiche con la config documentata, prima dello script iniettato.
SPEGNI='<script>window.adtechAnalyticsConfig={autoPageviews:false};</script>'
find "$D" -name '*.html' -print0 | xargs -0 perl -0pi -e "s|<head>|<head>$SPEGNI|i unless /adtechAnalyticsConfig/"
[ "$(grep -rL adtechAnalyticsConfig "$D" --include='*.html' | wc -l | tr -d ' ')" = 0 ] || { echo "✗ config analytics mancante in qualche pagina"; exit 1; }

mkdir -p "$DEST"; rm -f "$ZIP"
(cd "$D" && zip -qr "$OLDPWD/$ZIP" .)
echo "✓ $ZIP  ($(du -h "$ZIP" | cut -f1), $(find "$D" -name '*.html' | wc -l | tr -d ' ') pagine)"
echo "  anteprima locale: npx serve $D"
