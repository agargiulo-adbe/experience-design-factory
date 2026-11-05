---
description: Rende chiara e umana la copia di una experience in quattro giri — il messaggio, i segni, la misura, l'orecchio. Uso /umanizza <alias-app> [--giro 0|1|2|3]
---

# /umanizza — quattro giri sulla copia di una experience

**Prima si decide che cosa dice la slide, poi come suona.** Il Giro 0 cambia titoli e frasi
che non si capiscono. I Giri 1-3 rifiniscono il testo che ne esce, e **non sono una passata
di stile**: hanno un prima e un dopo, e la regola che li tiene insieme è una sola: *un intervento che fa scendere un contatore può aver **spostato**
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

## Giro 0 — il messaggio

Senza `--giro` si parte da qui. **Per questo giro non vale il ±10%**: serve il testo giusto,
non uno della stessa lunghezza. Si legge **slide per slide**, percorso intero e taglio corto
compresi, e per ogni slide si risponde a queste domande prima di riscrivere:

1. **Qual è il fatto?** Si cerca il numero o l'osservazione che regge la slide. Se c'è, sta
   nel titolo.
2. **Il titolo informa?** Va riscritto se:
   - funzionerebbe anche per un altro cliente;
   - è una formula a contrasto («X, non Y»);
   - da solo non dice che cosa è stato misurato, che cosa succede o che cosa si chiede.
3. **La frase si capisce al primo ascolto?** Una frase, un soggetto, un'idea. Se serve
   rileggerla, si riscrive. Le immagini si traducono nel fatto che significano.
4. **La slide dimostra ciò che afferma?** Una causa non provata dai dati della slide non si
   afferma: si porta la prova, o si dice meno.
5. **Si vede prima la prova?** Di norma prima il dato, poi la conclusione. Due dati a
   confronto stanno affiancati e con lo stesso peso.
6. **Un esempio sembra una prova?** Ciò che è ricostruito si etichetta. Ciò che è reale porta
   fonte e data.
7. **La nota fa solo la nota?** Una riga di fonte dice da dove viene il dato. Un'affermazione
   che conta non si nasconde lì.

**Esempio inventato, con gli stessi difetti incontrati su un deck reale:**

| Prima | Difetto | Dopo |
|---|---|---|
| «Il cliente al centro, non il canale» | Slogan: vale per chiunque e nasconde il dato | «Il sito risolve 2 richieste su 10. L'app, 6.» |
| «Dove il dato giusto arriva al momento giusto, la relazione cresce e il valore torna a voi.» | Farraginosa, con una causa non dimostrata e un'immagine da decifrare | «Quando l'operatore vede lo storico, può chiudere la richiesta al primo contatto.» |
| «2 su 10 […] Sull'app, con le stesse domande, sono 6.» | Il confronto è sepolto nel testo | «6 su 10 app · 2 su 10 sito», poi «Richieste risolte senza operatore, sulle stesse domande.» |

**Forma o sostanza.** Si applica direttamente ciò che cambia la forma e usa fatti già presenti
e verificati. **Non si applica da solo** ciò che cambia una tesi, una promessa, l'ask o una
frase protetta: va in una lista per chi possiede il contenuto, con la riscrittura pronta.

**Vincoli:**
- nessun numero, fatto, fonte o nome di prodotto nuovo: un dato promosso a titolo si riscontra
  prima alla fonte;
- citazioni verbatim e testi marcati da non toccare restano come sono;
- valgono ancore ≤6 parole, lead di ~15 parole, plurale istituzionale, tono verso chi è in sala
  e percorso intero e taglio sulla stessa fonte;
- nessun titolo tutto uguale: non ogni slide ha un numero, e un titolo-dato ripetuto dieci volte
  è un altro tic. Il criterio è che informi;
- il nome del deck e le citazioni di copertina non sono titoli di slide: si valutano a parte;
- se il testo nuovo non entra si taglia, si cambia composizione o si divide la slide. **Mai si
  rimpicciolisce il tipo.**

**Registro, in un file git-ignorato sotto `docs/<Cliente>/`:** per ogni slide, prima, dopo e
motivo in una riga; le slide lasciate intatte con il motivo; la lista delle decisioni aperte.
Il testo cambiato non si dichiara migliorato sul conteggio: **si guardano le slide a 1920.**

## Giro 1 — i segni

Ogni rilievo di `copy-audit` esce **riscritto** oppure **dichiarato** con
`copy-audit-ignore` **e il motivo sulla riga**. Vincoli su ogni riscrittura, verificati
*prima* di scrivere: lunghezza entro **±10%** rispetto al testo uscito dal Giro 0; numeri, nomi di prodotto, fonti e citazioni
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
Si committa **il Giro 0 a parte dai Giri 1-3, e lo strumento condiviso a parte dall'app**.
Nel messaggio vanno: i numeri
prima/dopo, le eccezioni dichiarate col loro motivo, e **quello che hai trovato e non hai
risolto** perché spetta a chi possiede il contenuto.

Il `panel-review` resta un passo a sé: non va dentro il giro 3.
