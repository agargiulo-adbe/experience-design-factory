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

## 5 — Se è emerso un segnale, proponilo al Radar

Il prompt del Radar lo dice da sé: PanoAI **non** copre l'utilizzo rispetto
all'entitlement, e «quei segnali il radar li prende da email, Plaud e ticket» — che è
esattamente ciò che l'apertura ha appena letto. Quindi quando una sessione fa emergere un
segnale nuovo — uno sforamento, un bisogno dichiarato, un prodotto nominato dal cliente,
un rinnovo a rischio per una ragione che Panorama non sa — **proponi una riga** in
`docs/Adobe/Radar/Registro_opportunita.md`:

`| ID | Primo segnale | Account | Opportunità | Prodotto | Stato | Ultimo aggiornamento | Fonte | Decisione Antonio |`

Tre regole, e la prima è assoluta:
- **la colonna «Decisione Antonio» non si tocca mai.** È il posto dove una persona scrive
  SÌ / NO / DOPO, e il Radar è progettato per rispettarla. Su una riga nuova si lascia
  **vuota**; su una riga esistente non si riscrive, nemmeno per «aggiornarla»;
- in `Fonte` va **dove sta la prova**: `thread <id>`, `Teams/WhatsApp <data, chi>`,
  `/Plaud/<file>.txt`. Un segnale senza fonte non si scrive;
- **proponi, non scrivere d'iniziativa**: mostra la riga e aspetta. Una riga in quel
  registro diventa una conversazione commerciale, e non la si apre per conto di qualcuno.

Se il prodotto **non è eleggibile** per il piano (Goal Sheet), scrivilo nella riga: è
un'occasione di relazione o uno spunto per un collega, non attainment. Confonderli porta a
lavorare su cose che non contano.

## 6 — Chiudi
Stampa il percorso del file e le righe aggiunte. Se hai toccato file **fuori** da `docs/`,
dillo e lascia decidere: da qui non si committa.
