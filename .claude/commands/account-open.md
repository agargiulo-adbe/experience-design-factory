---
description: "Apre un account: legge il Radar e Labrador, poi il registro, poi Outlook, Teams, le trascrizioni Plaud, WhatsApp e la cartella da dove era rimasto, e riferisce cosa è cambiato e chi ha la palla. NON scrive. Uso: /account-open [<Account>]"
argument-hint: "[<Account>]"
---

Apri il **account** di un cliente — o `Adobe`, per il lavoro non legato a un cliente — e di'
a che punto siamo. Le regole di contenuto, il template e i confini con dossier, panel e
memoria stanno in **`docs/CLAUDE.md`**: è già in contesto se la sessione è sotto `docs/`.

Argomento ricevuto: `$ARGUMENTS`

## Quale account
1. Se l'argomento nomina un account, è quello (confronta con le cartelle di `docs/`,
   tollerando abbreviazioni: «BG» → `Banca Generali`).
2. Altrimenti ricavalo dalla directory di lavoro, se è sotto `docs/<Account>/`.
3. Altrimenti elenca gli account con un registro e quelli senza, e chiedi quale. Non indovinare.

`docs/Adobe Material/`, `docs/Factory/`, `docs/Claude/` e `docs/superpowers/` **non sono
account**: sono depositi di materiale. Non hanno registro e non si aprono con questo comando.
`docs/Adobe/` invece è un account a tutti gli effetti.

## 1 — Leggi il Radar, poi il registro

**Prima il Radar** (`docs/Adobe/Radar/`), che possiede i numeri e la struttura:
- `Mappa_Account/Anagrafica_account.md` — la riga di questo account: ECC ID, IMS Org, ARR,
  team Adobe (AE, CSM, SC), prodotti con date di contratto, salute, adoption score;
- `Mappa_Account/Panorama_AAAAMMGG.md` (**il più recente**) — rinnovi, opportunità aperte,
  rischi di questo account;
- `Mappa_Account/Goal_Sheet_FY*.md` — se un rinnovo o un'opportunità è su un prodotto
  **eleggibile**, conta per il piano; se non lo è, è relazione e va detto così;
- `alias_cartelle.md` — con che nome questo account sta nel book (`Telecom Italia` è `TIM`).

Dì **quanto è vecchio** lo snapshot del Radar. Oltre un mese e mezzo, i numeri si citano
come datati: si rinfrescano coi prompt in `Mappa_Account/_PROMPT_PanoAI.md`.

**Poi** `docs/<Account>/ACCOUNT.md`, che possiede la storia. Se non esiste, salta a **Primo
registro**. Prendi la data del campo `aggiornato`.

> **La divisione del lavoro, e perché.** I numeri stanno nel Radar, la storia nel registro.
> Il registro **non ricopia** ARR, date di rinnovo, nomi del team e identificativi: li
> citerebbe vecchi, e due copie a mano degli stessi numeri divergono sempre. Se un numero
> del Radar è sbagliato si corregge **nel Radar**, non nel registro.

## 1bis — Labrador: i numeri freschi, con una chiamata

Lo snapshot del Radar si rinfresca a mano una volta al mese; Labrador (MCP `labrador`,
agenti interni Adobe su CRM, Panorama e SUM dashboard) risponde **oggi**, ma **un account
alla volta**: la vista sul book intero non la dà (provato il 25 nov 2026, tre domande e tre
rifiuti). Per questo sta qui, nell'apertura del singolo account, e non nel giro del mattino.
Vale solo per gli account **del book**; `Adobe` e gli account fuori dai 25 lo saltano.

1. **Prima la cache**: `docs/Adobe/Radar/Labrador/<account come nel book>_AAAAMMGG-brief.md`
   (o `-chat.md`). Se ha **7 giorni o meno**, si usa quella e non si chiama niente.
2. **Il Sub ID** sta in `Radar/Labrador/sub_id.md`. Se manca, la prima chiamata col solo nome
   restituisce una lista di omonimi: si sceglie quello giusto (geo, nome esatto), **si scrive
   in `sub_id.md`** e da lì in poi ogni domanda porta `<nome>, Sub ID <id>, EMEA`. L'ECC ID
   dell'anagrafica **non** è il Sub ID.
3. **Una chiamata, scelta così**:
   - c'è un rinnovo entro **180 giorni** → `ask_renewal_brief` («Renewal brief for
     <nome>, Sub ID <id>, EMEA»);
   - altrimenti → `ask_labrador_chat` («<nome>, Sub ID <id>, EMEA: Adobe products used, with
     ARR and open opportunities»).
   Più entità del book nella stessa cartella: una chiamata per entità **con un rinnovo
   vicino**, al massimo tre. Il budget delle chiamate è **unico e condiviso** fra i cinque
   strumenti: niente chiamate in parallelo, e un `rate_limited` vuol dire aspettare
   `retry_after_seconds`, non che lo strumento è rotto.
4. **La risposta si salva grezza** in cache, con in testa domanda, strumento e data
   (formato in `Radar/Labrador/LEGGIMI.md`). È una fonte scaricata, come un allegato: la
   regola «l'apertura non scrive» riguarda il **registro**, che resta intatto.

**Che cosa se ne prende**: quattro cose che il Radar non ha —
- le **righe di entitlement in scadenza** con SKU, volume, prezzo unitario e Deal Registration;
- l'**utilizzo rispetto al commit** (dal SUM dashboard), con l'adoption score;
- le **trattative in CRM** con stage, data di chiusura e link Dynamics;
- i **casi di supporto aperti** per soluzione;
- più l'**ARR per prodotto**, che si confronta riga per riga col Radar.

**Che cosa non se ne prende**, misurato sul primo account provato il 25 nov 2026:
- **non vede gli sforamenti degli add-on**: l'entitlement c'era, lo sforamento oltre il
  doppio che stava nel Registro opportunità no. È lo stesso punto cieco di PanoAI;
- **non vede rischio né concorrente**: la salute era vuota, e il rinnovo che Panorama dava
  «At Risk» per un concorrente dichiarato nel brief era senza rischio;
- **il team non si legge da lì**: «Account Management» è la colonna del SAM, non l'AE, e
  almeno un ruolo era sbagliato. Il team resta quello del Radar e della posta;
- **l'AI Summary, la Recommended Strategy e le Product Innovations sono testo di un modello**:
  sul primo brief la sintesi deduceva un uso «oltre l'entitlement» su un prodotto che la
  tabella dello **stesso** brief mostrava coperto. Valgono come un riassunto automatico:
  spunto, mai fatto. Le innovazioni non vanno in un deck senza le release notes.

`ask_account_research` e `ask_sales_play_strategy` **non** si usano in apertura: la prima,
senza Sub ID, restituisce solo il profilo dal web (ZoomInfo e simili) con le sezioni interne
vuote; la seconda dà le play dell'ICP, generiche, che ignorano i segnali dell'account.
Servono, al più, nel **primo registro** (research, con il Sub ID) o per usare con l'AE il
nome della play che sta guardando.

## 2 — Cerca cosa è cambiato, in cinque fonti

Tutte **dalla data di `aggiornato`** a oggi, cercando per nome dell'account e per le società
collegate se il registro le nomina. Per ogni cosa utile annota **data, chi (ruolo), e
l'identificativo** che permette di ritrovarla.

1. **Posta — Outlook**, via il server MCP **`centralino-adobe`** (`adobe_mail_search`, poi
   `adobe_mail_get_thread` / `adobe_mail_read_attachment`), non il Centralino del Mac mini.
   È la fonte di lavoro principale. Dal 23 nov 2026 il connettore Microsoft 365 non si
   collega più al tenant Adobe: `centralino-adobe` legge la stessa casella dal server, via la
   sessione di Outlook web, **archivio online compreso e senza limite di anni**. Il periodo si
   passa con `since`/`until` (mai `received<=` dentro `query`: il server lo ignora); un
   dominio intero con `from_addr: "<dominio>"`. Se risponde «sessione scaduta», l'utente
   esegue `! centralino-adobe login`: la fonte va dichiarata cieca, non vuota.
2. **Teams**, via lo **stesso** server (`adobe_teams_search`, poi
   `adobe_teams_get_conversation` con il `chat=` del risultato). Molte decisioni operative vivono in chat e non arrivano mai in una mail:
   una quota, un «ok» a un prezzo, un cambio di proprietario.
3. **Trascrizioni delle riunioni — la cartella `/Plaud` su Dropbox**, e si cerca **nel
   contenuto**: `Dropbox search` con `query` = nome dell'account, `path` = `/Plaud` e
   `last_modified_after` = la data di `aggiornato`. I file sono `.txt` nominati per data e tema.
   ⚠️ **Il Plaud MCP non la sostituisce.** `list_files` elenca per **titolo**, e il titolo di
   una riunione lo scrive un riassunto automatico: nomina il cliente quando gli pare, e ne
   storpia il nome («Easybank» per Isybank). Misurato su Intesa il 23 ott 2026 — la ricerca
   per contenuto ha restituito **due file che l'elenco per titolo non dava**, e uno era la
   call con Accenture del 16 ott che il registro segnava come esito mancante. L'MCP serve a
   due cose: le riunioni **non ancora sincronizzate** (la cartella ha latenza, `list_files`
   con `date_from`) e la **nota** di una registrazione già trovata (`get_note`, molto più
   corta del `.txt` intero).
   **Nell'esito si dichiara quale delle due ricerche si è fatta:** un giro con il solo elenco
   per titolo non è un giro completo su questa fonte.
4. **WhatsApp**, via Centralino (`mail_search` con `accounts`). Vedi sotto: l'account che
   porta il lavoro e il modo di cercarlo non sono quelli che il nome suggerisce. **Non è
   opzionale e non è l'ultima per importanza**: è la fonte dove arrivano le cose dette in
   fretta, spesso le più recenti che hai su un referente. Se Centralino non risponde — gira
   via SSH su un'altra macchina — la si dichiara **cieca** nell'esito del passo 3, in
   chiaro, e **il giro non si dichiara completo**. Soprattutto: non si scrive che un
   contatto «non ha risposto» con WhatsApp non letto.
5. **Cartella dell'account**: file arrivati dopo quella data (`ls -lt`), in particolare
   footprint, allegati, trascrizioni, PDF di dashboard.

**Niente altro.** Non aprire Fluffy né il web: qui serve sapere cosa si è mosso, non
riverificare il mondo.

### I documenti contrattuali si leggono una volta, e il filtro per data non li vede mai
Il passo 5 cerca **che cosa si è mosso**, quindi filtra per data. Un Sales Order firmato
mesi prima dell'ultimo aggiornamento non si è mosso: non compare, e **non comparirà mai**.
Così un documento resta in cartella senza essere stato aperto, mentre le sue clausole
vengono discusse a memoria o per parafrasi.

Misurato su un account il 3 nov 2026, ed è costato una raccomandazione sbagliata: il
Partner Sales Order era in cartella da settembre, mai letto. Dentro c'erano la quantità
scopata, il prezzo unitario, un License Term **unico su due anni** (non due annuali),
l'**assenza** di un Overusage Rate sulla riga in discussione, un Initial Implementation
Period azzerato a **0 giorni**, una promozione **non rinnovabile e già scaduta** che il
registro portava come domanda aperta, e una rampa di migrazione **non rinnovabile** che
nessuno aveva in programma. Nel frattempo il fabbisogno era stato dimensionato sul run
rate, e il numero che stava per andare al cliente era fuori di un ordine di grandezza.

Quindi, **una volta per account e fuori dal filtro di data**:
- `find . -type f \( -iname "*.pdf" -o -iname "*.xlsx" -o -iname "*.docx" \)` sulla
  cartella, e si guardano i **nomi**: Sales Order, contratti firmati, footprint, ordini,
  allegati di rinnovo. Un PDF che finisce in `- signed.pdf` è una fonte di primo livello,
  non un allegato.
- Un `.pdf` contrattuale si **estrae e si legge** (`pdftotext -layout`), tutto: la Pricing
  Detail, **le note numerate** e i Terms and Conditions. Il valore che decide una
  conversazione sta quasi sempre in una nota, e una riga **senza** nota di overusage dice
  quanto una riga che ce l'ha.
- **Si legge chi è la controparte**, non solo chi è il cliente: su un *Partner* Sales Order
  l'obbligo di pagare è del partner, e «Customer» nelle note significa due cose diverse a
  seconda del comma.
- Nel registro, la sezione **Installato** dichiara **quali documenti contrattuali esistono
  in cartella e quando ognuno è stato letto l'ultima volta**. Un documento senza data di
  lettura è un buco visibile; senza quella riga è un buco invisibile.
- Se Installato cita una clausola, un importo o una data **senza** rimandare al documento da
  cui viene, vale come «da riverificare»: è lì che la parafrasi diverge dal testo.

Vale per ogni apertura, anche quando il registro sembra completo: la gerarchia delle fonti
mette gli artefatti contrattuali **sopra** la corrispondenza, e una fonte di primo livello
non letta non è un dettaglio di metodo.

### Tre regole sulle trascrizioni, che non sono una fonte come le altre
- **Valgono meno della corrispondenza.** Nella gerarchia stanno sotto: artefatti approvati
  dal cliente → corrispondenza → **trascrizioni** → cataloghi → web. Sbagliano i **nomi
  propri** con regolarità: un nome che compare solo lì non si scrive nel registro senza
  risalire a una firma di mail o al parlato.
- **Una menzione di passaggio non è un fatto.** La ricerca per contenuto trova il nome di un
  cliente anche dentro riunioni che parlano d'altro. Una trascrizione conta per un account solo
  se **quell'account è l'oggetto** della riunione; altrimenti è una traccia da verificare, e si
  riferisce come tale. E una trascrizione che non riguarda l'account **non si apre**: in quella
  cartella ci sono anche riunioni interne e colloqui, che non c'entrano niente con un account
  cliente.
- **Gli orari si riportano nel fuso di chi lavora, sempre.** Plaud espone gli orari di
  registrazione in **UTC**; il Mac è su `Europe/Rome`, quindi d'estate sono **due ore meno**
  del vero (l'ora solare ne toglie una). Una riunione che l'MCP chiama «10:05» è la call
  delle **12:05**, e dire l'ora sbagliata a chi c'era dentro fa dubitare di tutto il resto —
  o, peggio, fa scartare la registrazione giusta. La conversione si fa **prima** di nominare
  un orario in chat o in un registro: `TZ=Europe/Rome date -r <epoch>` lo risolve, e `date`
  da solo dice in che fuso siamo. Vale per ogni fonte che porta un orario, non solo Plaud.

### WhatsApp — quale account, e come si legge
Il lavoro su WhatsApp sta nell'account che Centralino chiama **`whatsapp-personale`**,
perché quel numero è il **numero di lavoro**, quello della firma delle mail Adobe (il
numero non si scrive qui: questo file è tracciato in un repo pubblico). L'etichetta è di Centralino, non del contenuto: lì ci sono i messaggi dei
colleghi e dei referenti cliente, correnti (verificato il 12 ott 2026).

- `whatsapp-aziendale` è un **archivio storico**: l'indice si ferma al 2022. Si guarda
  quando si ricostruisce una storia vecchia, non per sapere cosa si è mosso ieri.
- `whatsapp-app-business` è **un'altra attività**: fuori dal giro di un account.

Due differenze pratiche rispetto alla posta:
- **Si cerca per NOME DI PERSONA**, non solo per nome dell'account. WhatsApp è
  persona-a-persona: il referente o il collega è l'indice, il cliente spesso non viene
  nominato affatto.
- Quell'account **mescola lavoro e vita privata**. Nel registro entra solo ciò che riguarda
  l'account; il resto non si cita, non si riassume e non si commenta.
- Un messaggio WhatsApp **non ha un identificativo di thread**: nel log si scrive
  `WhatsApp <data, chi>`.

## 2bis — Il grafo dei contatti, se è vecchio di più di una settimana

Guarda la riga `Dominio: … · grafo aggiornato <data>` nella sezione «Chi è chi» del registro.

- **Entro sette giorni** → non rifarlo, usa quello che c'è.
- **Più vecchio, assente, o senza `Dominio:`** → rifallo adesso. Le due ricerche, la regola
  del destinatario e **i due limiti misurati** stanno in `docs/CLAUDE.md`, sezione «Il grafo
  dei contatti»: leggila prima, perché una delle due ricerche non misura quello che sembra.
- **Senza `Dominio:`** → ricavalo dagli indirizzi che tornano cercando il nome dell'account,
  e **proponilo**: non indovinarlo da come si chiama l'azienda — la ragione sociale e il
  dominio di posta coincidono molto meno spesso di quanto sembri.

Costo: **1 + N chiamate** per account, N = i contatti trovati. A cadenza settimanale è poco;
al giorno sarebbe spreco, perché il grafo cambia lentamente.

Il grafo **si propone, non si scrive**: vale la regola del passo 4. Le righe nuove e quelle
cambiate si mostrano come diff, e il verdetto di ogni riga porta il suo motivo.

## 3 — Riferisci in chat, in poche righe
- **il quadro dal Radar**: ARR, prossimo rinnovo con la data, se conta per il piano,
  opportunità aperte, salute — e l'età dello snapshot;
- **Labrador, con la data della risposta**: solo ciò che è **nuovo** rispetto al Radar
  (utilizzo sotto o sopra il commit, trattative in CRM che il Radar non ha, casi aperti,
  righe in scadenza) e gli **scarti**. Uno scarto fra Labrador e Radar è un conflitto fra
  due fonti con due date: si riporta, e se il numero di Labrador è il più recente si
  **propone** di correggere il Radar, non lo si corregge da qui;
- cosa è cambiato dall'ultimo aggiornamento,
- cosa è bloccato e **da quanto**,
- chi ha la palla,
- il prossimo passo aperto, e se è scaduto dillo,
- **a chi si può parlare**: quanti contatti ha il grafo, quanti sono «scrivi tu», e se non
  ce n'è nessuno dillo come un buco da chiedere all'AE, non come un'assenza di opportunità.

Se la posta **contraddice** un fatto del registro, dillo come conflitto fra due fonti con
le rispettive date. Non scegliere tu.

Se il registro porta in testa un'avvertenza — per esempio «non ancora riconciliato con la
posta» — quella viene prima di tutto il resto.

## 4 — Fermati
**Non scrivere niente.** Una mail è una fonte, non un verdetto: si deposita dopo la
conferma. Chiudi chiedendo che cosa si fa. Per scrivere c'è **`/account-close`**.

---

# Primo registro di un account

1. Guarda cosa c'è: `ls` della cartella, i `.md` già presenti (`DOSSIER-`, `RESEARCH-`,
   `RIUNIONE-`, `PANEL-`), il footprint o il `data.xlsx` se c'è.
2. Cerca negli ultimi mesi: posta, Teams, trascrizioni `/Plaud`, WhatsApp.
   Se l'account è nel book, il passo 1bis vale anche qui; in più, **una** chiamata
   `ask_account_research` col Sub ID dà profilo, footprint e pipeline in un colpo. Il
   profilo dal web che porta con sé sta in fondo alla gerarchia delle fonti: nessuna riga
   del registro nasce da lì.
3. Controlla la memoria: spesso un cliente ha già un file di memoria con i vincoli.
4. Compila il template di `docs/CLAUDE.md`. **Ogni riga porta la sua fonte.** Quello che
   non si sa si scrive `da chiedere`: non si inventa e non si lascia vuoto.
5. Mostralo per intero e fallo approvare **prima** di salvarlo.

---

# Sempre

- **Non inviare posta.** Solo bozze.
- **Non committare** niente da `docs/<Account>/`: è materiale riservato in un repo pubblico,
  ed è ignorato da git per questo.
- **Nomi di persone solo nel `ACCOUNT.md`**, mai in un file tracciato.
- **Se il prossimo passo chiede di far vedere il prodotto** («mandagli un video di Coworker»,
  «fagli vedere come risponde su Target»), il video si gira da qui, senza Claude in Chrome:
  Playwright MCP apre un Chromium suo, la persona fa il login una volta, Claude scrive i
  prompt e cattura i fotogrammi, `scripts/video-demo/rendi.sh` monta. Metodo, regole del
  montaggio e trappole in `skills/experience-design/references/video-demo-dal-vivo.md`:
  si legge **prima** di aprire il browser. Si gira sempre nell'**org demo**, e i fotogrammi
  si guardano prima di montare, perché l'org è condivisa e può mostrare altri clienti.
