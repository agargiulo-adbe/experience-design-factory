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

# L'APERTURA: una conversazione da avviare, scelta in modo deterministico e **depositata**
# come riga nel Registro opportunità, perché la decisione (SÌ/NO/DOPO) abbia dove andare.
# Costa zero token come il resto di questo strato: è selezione, non giudizio.
# `--deposita` ne scrive una sola al giorno: al secondo lancio rimostra quella di oggi.
APERTURA="$("$PNPM" --silent accounts --apertura --deposita 2>/dev/null)"
if printf '%s' "$APERTURA" | grep -q "^APERTURA "; then
  { echo "# Apertura · $(date '+%d %b %Y, %H:%M')"; echo; printf '%s\n' "$APERTURA"; } > "$GIRI/${OGGI}-apertura.md"
  { echo; echo "## Apertura di oggi"; echo; printf '%s\n' "$APERTURA"; } >> "$GIRI/$OGGI.md"
fi
# La riga da notifica: «<account> · scrivi a <nome> — <cosa>». Senza A CHI (apertura già
# proposta oggi, o nessuna) resta vuota e la notifica ripiega su DENTRO.
CHI="$(printf '%s\n' "$APERTURA" | awk -F'   +' '/^A CHI /{print $2; exit}' | awk -F' · ' '{print $1}')"
PROP="$(printf '%s\n' "$APERTURA" | awk -F'   +' '/^PROPONI /{print $2; exit}')"
ACC="$(printf '%s' "$PROP" | awk -F'  ·  ' '{print $2}')"
PROP="$(printf '%s' "$PROP" | awk -F'  ·  ' '{print $1}')"
APERTURA_L=""
[ -n "$CHI" ] && APERTURA_L="${ACC:+$ACC · }scrivi a $CHI — $PROP"

[ -z "${RILIEVI// /}" ] && exit 0   # mattina quieta: file scritto, nessuna interruzione, ZERO costo

# ─────────────────────────────────────────────────────────────────────────────
# IL CONSULENTE. Qui, e solo qui, si spendono token — e si spendono perché il
# giudizio è la parte che serve: un sistema che conta e non giudica è un cruscotto.
#
# Costa poco per costruzione: l'input è già ridotto a una decina di righe dallo
# strato gratuito, e si gira FUORI dal repo perché lì il contesto di progetto
# (75 KB di regole sui deck) non serve a niente. Misurato il 13 ott 2026:
# dentro il repo 100.821 token di contesto e $0,36; fuori 18.538 e **$0,14**,
# con un giudizio migliore. ~$3 al mese, e **zero nei giorni quieti**.
#
# Il radar del 2 ott non è morto perché Claude costa: è morto per 300-500
# CHIAMATE a settimana su 25 account. Questo ne fa una.
PROMPT="Sei il consulente interno di un Product Specialist di Adobe Italia. Il suo piano FY26: 70% su nuovo ARR dei prodotti eleggibili, 30% sul tasso di rinnovo. Nel radar qui sotto «€» marca i prodotti che contano per il piano e «·» quelli che sono relazione e non attainment. L'\''account resta dell'\''Account Executive: lui porta la crescita del suo prodotto dentro l'\''account, e ogni mossa verso il cliente passa dall'\''AE.

Dal radar di stamattina scrivi ESATTAMENTE sei righe, una per etichetta, e nient'\''altro: nessun preambolo, nessun markdown, nessun elenco.

TITOLO: la stessa cosa di OGGI in **meno di 90 caratteri**, come la diresti a voce entrando in ufficio. Serve alla notifica, che taglia: «<account> <prodotto>: rosso in due liste, 47 giorni» va bene, una frase con una subordinata no.
OGGI: la cosa su cui lavorare oggi e perché, in una frase. Scegli per rischio × valore × quanto conta per il piano, non per quanto fa rumore.
NON: una cosa che sembra urgente e non lo è, e perché.
CLIENTE: un'\''occasione di relazione o di cross-sell verso un cliente, ma SOLO se nel radar c'\''è un segnale che la giustifica (una trattativa, un rinnovo, una salute in rosso, un evento). Se quel segnale non c'\''è, scrivi «nessuna occasione con un segnale oggi» e fermati: proporre un prodotto che manca senza un caso d'\''uso è un approccio debole.
DENTRO: uno spunto da portare internamente, all'\''AE o a un altro specialist o al manager o al product marketing, con il motivo.
DOMANDA: una domanda che vale la pena farsi e a cui il radar non può rispondere.

Se in coda al radar trovi «Apertura di oggi», è la conversazione che lo strato deterministico ha scelto incrociando i segnali col grafo dei contatti. Giudicala: se è quella giusta, in CLIENTE dilla con le tue parole e aggiungi l'\''aggancio che la rende sensata; se NON è quella giusta — il contatto è sbagliato per quel tema, o c'\''è un segnale migliore nella lista — dillo in CLIENTE con il motivo. È il punto in cui il tuo giudizio vale più della selezione.

Non inventare numeri, nomi o date: usa solo quelli che leggi. Se un dato manca, dillo."

CONS="$GIRI/${OGGI}-consulenza.md"
GIUDIZIO=""
if command -v claude > /dev/null 2>&1; then
  GIUDIZIO="$(cd /tmp && claude -p --model sonnet "$PROMPT

$(cat "$GIRI/$OGGI.md")" 2>/dev/null)"
fi

if printf '%s' "$GIUDIZIO" | grep -q "^OGGI:"; then
  { echo "# Consulenza · $(date '+%d %b %Y, %H:%M')"; echo; printf '%s\n' "$GIUDIZIO"; } > "$CONS"
  # La notifica porta il GIUDIZIO, non i conteggi: «Radar · 11 cose» non dice niente,
  # «rinnovo da 1,48M senza owner» dice tutto.
  # il sottotitolo è TITOLO, che nasce corto: con OGGI la notifica tagliava a metà
  # frase e il punto si perdeva. Se TITOLO manca, si ripiega su OGGI.
  OGGI_L="$(printf '%s' "$GIUDIZIO" | grep -m1 "^TITOLO:" | sed 's/^TITOLO: *//')"
  [ -z "$OGGI_L" ] && OGGI_L="$(printf '%s' "$GIUDIZIO" | grep -m1 "^OGGI:" | sed 's/^OGGI: *//')"
  # Nel corpo va l'APERTURA quando c'è: «scrivi a <nome> per <cosa>» è la cosa che questo
  # sistema esiste per dire, e vale più di uno spunto interno. Senza apertura, DENTRO.
  ALTRE="$APERTURA_L"
  [ -z "$ALTRE" ] && ALTRE="$(printf '%s' "$GIUDIZIO" | grep -m1 "^DENTRO:" | sed 's/^DENTRO: *//')"
  [ ${#ALTRE} -gt 140 ] && ALTRE="${ALTRE:0:137}…"
  q() { printf '%s' "${1//\"/\\\"}"; }
  osascript -e "display notification \"$(q "$ALTRE")\" with title \"Radar · $(date '+%-d %b')\" subtitle \"$(q "${OGGI_L:0:110}")\""
  exit 0
fi

# RIPIEGO. Se il consulente non risponde o risponde fuori formato, il radar non tace:
# torna la notifica dei conteggi. Un giudizio mancato non deve spegnere il segnale.

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
# anche senza consulente l'apertura si vede: è la riga più azionabile delle due
[ -n "$APERTURA_L" ] && ALTRE="$APERTURA_L"
[ ${#ALTRE} -gt 150 ] && ALTRE="${ALTRE:0:147}…"
TITOLO="Radar · $N cos$([ "$N" -eq 1 ] && echo a || echo e)"
q() { printf '%s' "${1//\"/\\\"}"; }
osascript -e "display notification \"$(q "$ALTRE")\" with title \"$(q "$TITOLO")\" subtitle \"$(q "$PRIMA")\""
