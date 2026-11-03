# XD e i micro-diagrammi — due registri, e non si sostituiscono

> Vale per **ogni deck**, presente e futuro. Si legge prima di comporre, insieme a
> `ancore-non-prosa.md`: quello dice *quanto testo*, questo dice *in che registro*.

## La regola in una riga

**XD è quello che si proietta. I micro-diagrammi sono quello che si apre.**

Sono due strati diversi dello stesso deck, con due pubblici e due momenti. Scambiarli
non è un errore di gusto: produce una slide che non funziona nella stanza in cui va.

## Che cos'è XD

`packages/core/src/styles/xd.css` — la grammatica visiva del motore. Porta **impatto**:
la copertina a due colonne con l'agenda, il divisore di capitolo con la fotografia e il
pannello di colore, la slide di contenuto con occhiello / titolo / lead / chiusa,
l'architettura a strati, le cifre grandi, le referenze.

Il registro di XD è: **immagine, mockup, una cifra, poche parole.** Una slide XD si legge
da otto metri in tre secondi. Quello che non entra in tre secondi non è una slide XD.

XD ha **anche** delle figure — la famiglia `.xd-fig*`, «ancora · figura · verdetto». Sono
**grandi e poche**, una per slide, e servono il titolo. Non sono i micro-diagrammi.

## Che cosa sono i micro-diagrammi

`src/components/Figura.astro` di ciascuna app — il vocabolario che vive **dentro un
«Scopri come»**, nella forma `HowItWorks` → `Dettaglio` → `DettaglioVoce`. Il docblock
del componente lo dice da sé: *«il dettaglio si apre in sala per rispondere a una
domanda»*.

Il registro è: **piccoli e molti**, un meccanismo ciascuno, nessuna parola dentro l'SVG.
Sono **profondità**, e la profondità sta a richiesta.

## Perché la distinzione esiste: è il pubblico

Il caso che l'ha generata, Trenitalia, novembre 2026 — lo stesso contenuto, due stanze:

| | chi è in sala | che cosa vuole | registro |
|---|---|---|---|
| **Direzione** | un'ora, decide se aprire un tavolo | la visione, e che atterri | **XD** |
| **Chi possiede la piattaforma** | vuole sapere come si fa | il meccanismo, il dato, i prodotti | **micro-diagrammi** |

Portare i micro-diagrammi in sala alla Direzione significa rispondere alla domanda che non
ha fatto, e perdere l'ora. Portare solo XD a chi possiede la piattaforma significa non
rispondere affatto.

## Come si sbaglia (successo, e va evitato)

Il 3 novembre 2026 un giro di lavoro ha proposto di costruire le slide di caso d'uso per
la Direzione **sul vocabolario dei micro-diagrammi già scritto**, chiamandolo XD. Il
vocabolario era buono e già pagato — ventidue figure — ma era lo strato di profondità:
giusto per l'altro deck, sbagliato per quella stanza. L'errore non l'ha visto nessun
gate, perché nessun gate misura il registro.

Il segnale che ci si sta sbagliando è uno: **la slide ha più di un disegno piccolo.** Se
ne ha tre o quattro accostati, non è una slide da proiettare — è un drill-down aperto.

## Che cosa misura, e che cosa non misura, un gate

- `audit:ritmo` conta **se** c'è un elemento visivo (`svg`/`img`/`video` sopra i 40 px):
  il numero di cui fidarsi è «slide con un elemento visivo». **Non distingue i registri**:
  quattro micro-diagrammi contano come quattro elementi visivi, e la slide passa.
- `copy-audit` famiglia `P` conta la prosa fuori dalle disclosure. **Non vede** la prosa
  che arriva da `src/data/*.ts` per import.
- Il registro **resta un giudizio umano**, da fare guardando lo screenshot a 1920 e
  chiedendosi: *questa slide la capisce chi la guarda per tre secondi?*

## In pratica, quando si compone

1. **Si dichiara la stanza** prima della prima slide: direzione o chi costruisce.
2. **XD per il percorso che si proietta.** Una slide, un'idea, un'immagine o un mockup,
   una cifra, una chiusa.
3. **I micro-diagrammi dietro `HowItWorks`**, per le domande che arrivano.
4. **Un deck può avere tutti e due** — ed è il caso normale. Quello che non può avere è
   un drill-down spacciato per slide.
