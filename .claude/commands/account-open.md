---
description: "Apre un conto: legge il registro, poi Outlook, Teams, le trascrizioni Plaud, WhatsApp e la cartella da dove era rimasto, e riferisce cosa è cambiato e chi ha la palla. NON scrive. Uso: /account-open [<Conto>]"
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

## 2 — Cerca cosa è cambiato, in cinque fonti

Tutte **dalla data di `aggiornato`** a oggi, cercando per nome del conto e per le società
collegate se il registro le nomina. Per ogni cosa utile annota **data, chi (ruolo), e
l'identificativo** che permette di ritrovarla.

1. **Posta — Outlook**, via il connettore Microsoft 365 (`outlook_email_search`). È la
   fonte di lavoro principale: la casella Adobe sta qui, non in Centralino.
2. **Teams**, via lo **stesso** connettore Microsoft 365 (`chat_message_search`), non
   Centralino. Molte decisioni operative vivono in chat e non arrivano mai in una mail:
   una quota, un «ok» a un prezzo, un cambio di proprietario.
3. **Trascrizioni delle riunioni — la cartella `/Plaud` su Dropbox** (`Dropbox search`,
   che cerca anche **nel contenuto**, non solo nei nomi dei file). I file sono `.txt`
   nominati per data e tema. Se una riunione recente non c'è ancora — la sincronizzazione
   ha latenza — si guarda il Plaud MCP (`list_files` con `date_from`).
4. **WhatsApp**, via Centralino (`mail_search` con `accounts`). Vedi sotto: l'account che
   porta il lavoro e il modo di cercarlo non sono quelli che il nome suggerisce.
5. **Cartella del conto**: file arrivati dopo quella data (`ls -lt`), in particolare
   footprint, allegati, trascrizioni, PDF di dashboard.

**Niente altro.** Non aprire Fluffy né il web: qui serve sapere cosa si è mosso, non
riverificare il mondo.

### Due regole sulle trascrizioni, che non sono una fonte come le altre
- **Valgono meno della corrispondenza.** Nella gerarchia stanno sotto: artefatti approvati
  dal cliente → corrispondenza → **trascrizioni** → cataloghi → web. Sbagliano i **nomi
  propri** con regolarità: un nome che compare solo lì non si scrive nel registro senza
  risalire a una firma di mail o al parlato.
- **Una menzione di passaggio non è un fatto.** La ricerca per contenuto trova il nome di un
  cliente anche dentro riunioni che parlano d'altro. Una trascrizione conta per un conto solo
  se **quel conto è l'oggetto** della riunione; altrimenti è una traccia da verificare, e si
  riferisce come tale. E una trascrizione che non riguarda il conto **non si apre**: in quella
  cartella ci sono anche riunioni interne e colloqui, che non c'entrano niente con un conto
  cliente.

### WhatsApp — quale account, e come si legge
Il lavoro su WhatsApp sta nell'account che Centralino chiama **`whatsapp-personale`**,
perché quel numero — `393489696067` — è il **numero di lavoro**, quello della firma delle
mail Adobe. L'etichetta è di Centralino, non del contenuto: lì ci sono i messaggi dei
colleghi e dei referenti cliente, correnti (verificato il 12 ott 2026).

- `whatsapp-aziendale` è un **archivio storico**: l'indice si ferma al 2022. Si guarda
  quando si ricostruisce una storia vecchia, non per sapere cosa si è mosso ieri.
- `whatsapp-app-business` è **un'altra attività**: fuori dal giro di un conto.

Due differenze pratiche rispetto alla posta:
- **Si cerca per NOME DI PERSONA**, non solo per nome del conto. WhatsApp è
  persona-a-persona: il referente o il collega è l'indice, il cliente spesso non viene
  nominato affatto.
- Quell'account **mescola lavoro e vita privata**. Nel registro entra solo ciò che riguarda
  il conto; il resto non si cita, non si riassume e non si commenta.
- Un messaggio WhatsApp **non ha un identificativo di thread**: nel log si scrive
  `WhatsApp <data, chi>`.

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
2. Cerca negli ultimi mesi: posta, Teams, trascrizioni `/Plaud`, WhatsApp.
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
