---
description: "Apre un conto: legge il registro, rilegge la posta da dove era rimasto, e riferisce cosa è cambiato e chi ha la palla. NON scrive. Uso: /account-open [<Conto>]"
argument-hint: "[<Conto>]"
---

Apri il **conto** di un cliente — o `Adobe`, per il lavoro non legato a un cliente — e di'
a che punto siamo. Le regole di contenuto, il template e i confini con dossier, panel e
memoria stanno in **`docs/CLAUDE.md`**: è già in contesto se la sessione è sotto `docs/`.

Argomento ricevuto: `$ARGUMENTS`

## Quale conto
1. Se l'argomento nomina un conto, è quello (confronta con le cartelle di `docs/`,
   tollerando abbreviazioni: «BG» → `Banca Generali`).
2. Altrimenti ricavalo dalla directory di lavoro, se è sotto `docs/<Conto>/`.
3. Altrimenti elenca i conti con un registro e quelli senza, e chiedi quale. Non indovinare.

`docs/Adobe Material/`, `docs/Factory/`, `docs/Claude/` e `docs/superpowers/` **non sono
conti**: sono depositi di materiale. Non hanno registro e non si aprono con questo comando.
`docs/Adobe/` invece è un conto a tutti gli effetti.

## 1 — Leggi
`docs/<Conto>/CONTO.md`. Se non esiste, salta a **Primo registro**.
Prendi la data del campo `aggiornato`.

## 2 — Cerca cosa è cambiato
- **Posta**: i thread che riguardano il conto **dalla data di `aggiornato`** a oggi. Cerca
  per nome e per le società collegate se il registro le nomina. Annota per ogni messaggio
  utile: data, mittente (ruolo), identificativo del thread.
- **Cartella**: file arrivati dopo quella data (`ls -lt`), in particolare footprint,
  allegati, trascrizioni, PDF di dashboard.
- **Niente altro.** Non aprire Fluffy né il web: qui serve sapere cosa si è mosso, non
  riverificare il mondo.

## 3 — Riferisci in chat, in poche righe
- cosa è cambiato dall'ultimo aggiornamento,
- cosa è bloccato e **da quanto**,
- chi ha la palla,
- il prossimo passo aperto, e se è scaduto dillo.

Se la posta **contraddice** un fatto del registro, dillo come conflitto fra due fonti con
le rispettive date. Non scegliere tu.

Se il registro porta in testa un'avvertenza — per esempio «non ancora riconciliato con la
posta» — quella viene prima di tutto il resto.

## 4 — Fermati
**Non scrivere niente.** Una mail è una fonte, non un verdetto: si deposita dopo la
conferma. Chiudi chiedendo che cosa si fa. Per scrivere c'è **`/account-close`**.

---

# Primo registro di un conto

1. Guarda cosa c'è: `ls` della cartella, i `.md` già presenti (`DOSSIER-`, `RESEARCH-`,
   `RIUNIONE-`, `PANEL-`), il footprint o il `data.xlsx` se c'è.
2. Cerca nella posta i thread di quel conto degli ultimi mesi.
3. Controlla la memoria: spesso un cliente ha già un file di memoria con i vincoli.
4. Compila il template di `docs/CLAUDE.md`. **Ogni riga porta la sua fonte.** Quello che
   non si sa si scrive `da chiedere`: non si inventa e non si lascia vuoto.
5. Mostralo per intero e fallo approvare **prima** di salvarlo.

---

# Sempre

- **Non inviare posta.** Solo bozze.
- **Non committare** niente da `docs/<Conto>/`: è materiale riservato in un repo pubblico,
  ed è ignorato da git per questo.
- **Nomi di persone solo nel `CONTO.md`**, mai in un file tracciato.
