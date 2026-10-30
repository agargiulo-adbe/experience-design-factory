---
description: Umanizza la copia di una experience in tre giri misurati — i segni, la misura, l'orecchio. Uso /umanizza <alias-app> [--giro 1|2|3]
---

# /umanizza — tre giri misurati sulla copia di una experience

**Non è una passata di stile.** È un giro con un prima e un dopo, e la regola che lo
tiene insieme è una sola: *un intervento che fa scendere un contatore può aver **spostato**
il marcatore invece di toglierlo.* Misurato su `intesa-esperienza-cliente` il 30 ott 2026: `copy-audit`
segnalava 8 trattini-perno; sostituirli con i due punti li avrebbe azzerati, ma il deck
aveva già **49 due-punti-perno**. Tutti i gate verdi, e il testo peggiore.

ARGOMENTO: $ARGUMENTS

Metodo completo, tipi di intervento con il prima/dopo vero, i buchi di gate noti e le due
sonde da NON costruire: `skills/experience-design/references/umanizzazione.md`. **Leggilo
prima di cominciare.**

## Prima di toccare una riga

1. **Verifica che il campo sia libero.** Se un'altra sessione sta lavorando sull'app, si
   aspetta: `git status --porcelain apps/<alias>` vuoto **e** nessuna modifica per dieci
   minuti. Un working tree sporco significa «a metà» anche dopo il silenzio.
2. **Fissa la baseline, e provala.**
   ```
   git rev-parse --short HEAD
   pnpm --silent exec tsx scripts/copy-audit.ts --app <alias>
   pnpm lenti --app <alias>
   ```
   Se vuoi il confronto con un commit precedente:
   `git archive <commit> apps/<alias>/src | tar -x -C /tmp/base` poi
   `pnpm lenti --app <alias> --root /tmp/base`.
   ⚠️ **Un giro che non misura niente non è un PASS**: guarda il conto delle stringhe.

## Giro 1 — i segni

Ogni rilievo di `copy-audit` esce **riscritto** oppure **dichiarato** con
`copy-audit-ignore` **e il motivo sulla riga**. Vincoli su ogni riscrittura, verificati
*prima* di scrivere: lunghezza entro **±10%**; numeri, nomi di prodotto, fonti e citazioni
intoccati; plurale istituzionale; le due lingue ciascuna idiomatica (una riscrittura può
toccare **una lingua sola**). Mai rimpicciolire il tipo, mai accorciare una fonte.

Poi, **in quest'ordine**, e si ripete finché non è pulito:
```
pnpm --silent exec tsx scripts/copy-audit.ts --app <alias>     # finché esce 0
DECK_URL=<origin> pnpm audit:wrap --app <alias>                # zero parole appese
pnpm --filter <alias> audit:deck                               # 0 HARD
```
`copy-audit` **si rilancia**: la seconda passata trova i marcatori creati dalla prima.
`audit:wrap` si lega **la coppia che serve**, non la frase — e legare sposta il punto di
rottura, quindi si rimisura ogni volta. Le code di frase (`F`) che restano sono la
conseguenza accettata dei legami.

## Giro 2 — la misura

```
pnpm lenti --app <alias>
```
- **La stilometria si legge per pagina**, e si cerca la colonna fuori scala rispetto alle
  sorelle, non una soglia assoluta.
- **I telai**: la concentrazione è il segnale, non il totale. Una forma di frase ricorre
  sempre in un documento con una tesi; il difetto è cinque identiche nello stesso
  componente, lette in fila.
- **Si guardano le pagine**: gli screenshot a 1920 in `apps/<alias>/audit/`. Qui si trova
  quello che nessun conteggio dà — e qui vanno decise le cose che richiedono di vedere la
  slide (contenuto parcheggiato in una riga di fonte, annotazioni duplicate, composizione).

## Giro 3 — l'orecchio avversario

- **L'altra lingua**, dove si sente meno: i calchi non li prende nessun conteggio.
- **I fatti attribuiti a terzi**: `pnpm audit:fonti --app <alias>` dice se il link
  risponde, **non** se dice quella cosa. Si apre e si cerca il numero. Se il sito blocca
  gli accessi automatici si apre una volta in un browser vero, oppure si dichiara **non
  verificato** — mai si assume.
- **Il tono**: la frase che non dice niente, il claim senza un numero dietro, il parallelo
  troppo pulito.

## Chiusura

```
DECK_URL=<origin> pnpm audit:taglio --app <alias>     # se l'app ha un taglio corto
pnpm --filter <alias> audit:deck                      # 0 HARD
```
Si committa **separando lo strumento condiviso dall'app**, e nel messaggio vanno: i numeri
prima/dopo, le eccezioni dichiarate col loro motivo, e **quello che hai trovato e non hai
risolto** perché spetta a chi possiede il contenuto.

Il `panel-review` resta un passo a sé: non va dentro il giro 3.
