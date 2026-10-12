---
description: "Chiude un conto: deposita lo stato nel registro — dove siamo, chi ha la palla, i fatti nuovi con la fonte — mostrando il diff prima di scrivere. Uso: /account-close [<Conto>]"
argument-hint: "[<Conto>]"
---

Deposita nel registro quello che è emerso. Le regole di contenuto e il template stanno in
**`docs/CLAUDE.md`**, già in contesto se la sessione è sotto `docs/`.

Argomento ricevuto: `$ARGUMENTS`

## Quale conto
Come per `/account-open`: dall'argomento, altrimenti dalla directory di lavoro, altrimenti
si chiede. Se il registro non esiste ancora, questo non è il comando giusto: lo crea
`/account-open`.

## 1 — Decidi se si scrive
Si scrive **solo** se è cambiata una di queste quattro cose:

1. dove siamo,
2. chi ha la palla,
3. il prossimo passo,
4. è entrato un **fatto nuovo con una fonte**.

Se nessuna è cambiata — una sessione di sola lettura o di sola spiegazione — **dillo e non
scrivere**. È il comportamento giusto, non una rinuncia: un log che registra anche le
sessioni in cui non è successo niente diventa illeggibile in tre mesi.

## 2 — Prepara le modifiche
- riscrivi **Dove siamo** (due righe, non più), **Palla a**, **Prossimo passo**;
- **aggiungi** i fatti nuovi, ognuno con fonte e data. Un fatto che ne supera uno vecchio
  non lo cancella: marca il vecchio `superato il <data>` e metti accanto il nuovo;
- **aggiungi** una riga al log, in coda, con la data in chiaro e l'identificativo del
  thread se nasce da una mail. Il log è **append-only**: non riscriverlo e non riordinarlo,
  nemmeno per pulizia;
- aggiorna `aggiornato` alla data di oggi;
- se un caso è chiuso, la sezione resta con `Dove siamo — chiuso il <data>`;
- se una domanda è stata risolta, togli la riga da **Da chiedere** e spostala nei fatti,
  con la fonte che l'ha risolta.

## 3 — Mostra il diff e aspetta
Mostra le righe che cambiano **prima** di salvare. Poi scrivi.

## 4 — Controlla la dimensione
Se la sezione di un caso supera **~120 righe**, proponi di estrarla in
`docs/<Conto>/CASO-<slug>.md` lasciando nel `CONTO.md` la riga di rimando. **Proponi**, non
farlo d'iniziativa.

## 5 — Chiudi
Stampa il percorso del file e le righe aggiunte. Se hai toccato file **fuori** da `docs/`,
dillo e lascia decidere: da qui non si committa.
