---
description: "Il registro operativo di un conto cliente: apre la sessione aggiornandosi dalla posta, o la chiude depositando lo stato. Uso: /conto [chiudi] [<Cliente>]"
argument-hint: "[chiudi] [<Cliente>]"
---

Mantieni il **registro operativo** (`CONTO.md`) di un conto cliente sotto `docs/<Cliente>/`.
Le regole di contenuto, il template e i confini con dossier/panel/memoria stanno in
**`docs/CLAUDE.md`**: leggilo prima di agire, è già in contesto se la sessione è aperta
sotto `docs/`.

Argomento ricevuto: `$ARGUMENTS`

## Quale cliente
1. Se l'argomento nomina un cliente, è quello (confronta con le cartelle di `docs/`,
   tollerando abbreviazioni: «BG» → `Banca Generali`).
2. Altrimenti ricavalo dalla directory di lavoro, se è sotto `docs/<Cliente>/`.
3. Altrimenti elenca le cartelle cliente che hanno un `CONTO.md`, più quelle che non ce
   l'hanno, e chiedi quale. Non indovinare.

---

# Modo APERTURA (default)

## 1 — Leggi
`docs/<Cliente>/CONTO.md`. Se non esiste, salta a **Primo registro**.
Prendi la data del campo `aggiornato`.

## 2 — Cerca cosa è cambiato
- **Posta**: i thread che riguardano il cliente **dalla data di `aggiornato`** a oggi.
  Cerca per nome del cliente e per le sue società collegate se il registro le nomina.
  Annota per ogni messaggio utile: data, mittente (ruolo), identificativo del thread.
- **Cartella**: file arrivati dopo quella data (`ls -lt`), in particolare footprint,
  allegati, trascrizioni, PDF di dashboard.
- **Niente altro.** Non aprire Fluffy né il web in apertura: qui serve sapere cosa si è
  mosso, non riverificare il mondo.

## 3 — Riferisci in chat, in poche righe
- cosa è cambiato dall'ultimo aggiornamento,
- cosa è bloccato e **da quanto**,
- chi ha la palla,
- il prossimo passo aperto, e se è scaduto dillo.

Se nella posta c'è qualcosa che **contraddice** un fatto del registro, dillo
esplicitamente come conflitto fra due fonti con le rispettive date. Non scegliere tu.

## 4 — Fermati
**Non scrivere niente.** Una mail è una fonte, non un verdetto: si deposita dopo la
conferma. Chiudi chiedendo che cosa si fa.

---

# Modo CHIUSURA (`/conto chiudi`)

## 1 — Decidi se si scrive
Si scrive **solo** se è cambiata una delle quattro cose: dove siamo · chi ha la palla ·
il prossimo passo · è entrato un fatto nuovo con una fonte.
Se nessuna è cambiata — una sessione di sola lettura o di sola spiegazione — **dillo e
non scrivere**. È il comportamento giusto, non una rinuncia.

## 2 — Prepara le modifiche
- riscrivi **Dove siamo** (due righe, non più), **Palla a**, **Prossimo passo**;
- **aggiungi** i fatti nuovi, ognuno con fonte e data. Un fatto che ne supera uno
  vecchio non lo cancella: marca il vecchio `superato il <data>` e metti accanto il
  nuovo;
- **aggiungi** una riga al log, in coda, con la data in chiaro e l'identificativo del
  thread se nasce da una mail. Il log è **append-only**: non riscriverlo e non
  riordinarlo, nemmeno per pulizia;
- aggiorna `aggiornato` alla data di oggi;
- se un caso è chiuso, la sezione resta con `Dove siamo — chiuso il <data>`.

## 3 — Mostra il diff e aspetta
Mostra le righe che cambiano **prima** di salvare. Poi scrivi.

## 4 — Controlla la dimensione
Se la sezione di un caso supera **~120 righe**, proponi di estrarla in
`docs/<Cliente>/CASO-<slug>.md` lasciando nel `CONTO.md` la riga di rimando. Proponi,
non farlo d'iniziativa.

---

# Primo registro di un cliente

1. Guarda cosa c'è: `ls` della cartella, i `.md` già presenti (`DOSSIER-`, `RESEARCH-`,
   `RIUNIONE-`, `PANEL-`), il footprint o il `data.xlsx` se c'è.
2. Cerca nella posta i thread di quel cliente degli ultimi mesi.
3. Controlla la memoria: spesso un cliente ha già un file di memoria con i vincoli.
4. Compila il template di `docs/CLAUDE.md`. **Ogni riga porta la sua fonte.** Quello che
   non si sa si scrive `da chiedere`: non si inventa e non si lascia vuoto.
5. Mostralo per intero e fallo approvare **prima** di salvarlo.

---

# Sempre, in entrambi i modi

- **Non inviare posta.** Solo bozze.
- **Non committare** niente da `docs/<Cliente>/`: è materiale riservato in un repo
  pubblico, ed è ignorato da git per questo. Se hai toccato file **fuori** da `docs/`,
  lo dici e lasci decidere.
- **Nomi di persone solo nel `CONTO.md`**, mai in un file tracciato.
- Chiudi stampando il percorso del file e, se hai scritto, le righe aggiunte.
