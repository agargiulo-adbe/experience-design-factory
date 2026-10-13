# docs/ — guida per una sessione di lavoro operativo d'account

Questo file si carica da sé in ogni sessione aperta su `docs/` o su una qualunque
cartella al suo interno, perché Claude Code risale le cartelle padre. Se stai
leggendo qui, stai lavorando **su un account**, non sulla Factory.

> **Questo file è TRACCIATO e il repo è PUBBLICO.** Dentro ci vanno ruoli, non
> nomi di persone; nessun dato di cliente, nessun numero di contratto, nessun
> identificativo. Quelle cose stanno nei `ACCOUNT.md`, che sono ignorati da git.

## Le regole dei deck qui non valgono

Il `CLAUDE.md` di root è il regolamento delle **experience**: 725 righe su slide,
audit, co-brand, tipografia, contratto di leggibilità. Si carica anche qui, perché
è un file padre, ed è quasi tutto fuori tema: **in questo sottoalbero non si
applica**, salvo quando stai effettivamente producendo un artefatto della Factory
(una experience, un dossier gated, un `.pptx` sul template Adobe).

Quello che **resta valido sempre**, perché non riguarda i deck ma il mestiere, è
qui sotto in «Le regole che valgono». Il resto, ignoralo.

## Che cos'è un account, e quali cartelle lo sono

Un **account** è una cartella sotto `docs/` con un `ACCOUNT.md` dentro. Due tipi:

- **un cliente** — `docs/Banca Generali/`, `docs/Unipol/`, `docs/Enel/`…
- **`docs/Adobe/`** — il lavoro che **non è legato a un singolo cliente**: richieste
  di colleghi, materiale trasversale, analisi su più account, processi interni.

**La regola di smistamento:** se la cosa riguarda **un** cliente, va nella cartella di
quel cliente anche se è arrivata da un collega. In `docs/Adobe/` ci sta solo quello che
non ha un cliente, o che ne ha molti insieme.

**Non sono account** e non hanno registro: `docs/Adobe Material/` (deposito di deck e
materiale Adobe — attenzione a non confonderla con `docs/Adobe/`), `docs/Factory/`,
`docs/Claude/`, `docs/superpowers/`. `/account-open` non le apre e `/accounts` non le
elenca.

## I comandi

Dentro una sessione, tutti e tre si trovano con `/acc` + TAB:

| | Che cosa fa |
| --- | --- |
| `/account-open [<Account>]` | legge il Radar, poi il registro, poi le cinque fonti; **riferisce senza scrivere** |
| `/account-close [<Account>]` | deposita lo stato, diff prima di salvare |
| `/accounts [fermi]` | la vista d'insieme su tutti gli account |

Fuori da una sessione c'è la **stessa parola**, come funzione di shell — nessun nome in più
da ricordare, e costa zero token:

```zsh
# in ~/.zshrc
accounts() {
  ( cd "$HOME/Documents/progetti/Experience Design Factory" && pnpm --silent accounts "$@" )
}
```

Funziona da qualunque cartella, anche fuori dal repo (`pnpm accounts` da solo no: vuole
essere dentro). Due modi in più:
- **`accounts --fermi`** — solo ciò che chiede attenzione;
- **`accounts --cross`** — la **mappa del cross-sell**: per ogni account del book, quali
  prodotti **eleggibili per il piano** ha e quali no. ⚠️ È una **mappa, non un elenco di
  cose da fare**, e per questo non entra nella notifica: una casella vuota diventa
  un'opportunità **solo incrociata con un segnale** del cliente. Le fonti interne del
  ruolo sono esplicite — si parte dal segnale, non dallo SKU che manca, e proporre un
  upgrade senza un caso d'uso è un approccio debole.

**Che cosa guarda il giro di ogni mattina**, in scala di urgenza: un passo scaduto del
registro · un evento o un'iscrizione che chiude · una **trattativa aperta** che chiude
entro 21 giorni · una **salute in rosso** con la ragione dichiarata · un **rinnovo** entro
30 giorni (eleggibile, o su un account senza registro) · una **trattativa ferma** (data
passata) · un account fermo da oltre 21 giorni. Tutto raggruppato **per account**: tre
righe rosse dello stesso cliente sono una notizia sola.

E ogni mattina alle 07:30, lun-ven, lo stesso giro parte da sé via **launchd**, a costo
zero di token: scrive in `Radar/giri/` e **notifica solo se c'è qualcosa**. Si installa o
si riallinea con **`pnpm radar:install`**; si lancia a mano con `launchctl start
com.gargiulo.radar`. Tre cose da sapere, tutte verificate sul campo il 13 ott 2026:
- la copia che gira sta in **`~/.local/bin/radar-giro`**, non nel repo: da `~/Documents`
  launchd non riesce a **eseguire** uno script (pur riuscendo a leggerne i file);
- launchd parte con un `PATH` minimo dove non c'è **né `pnpm` né `node`**: lo script se lo
  mette da sé, perché un job che funziona a mano e muore sotto launchd è il peggiore dei
  due modi di rompersi;
- essendo due file, possono divergere: `pnpm accounts` lo rileva e lo dice.

## Il Radar e i registri: chi possiede che cosa

Sotto `docs/Adobe/Radar/` vive il **Radar Opportunità**, alimentato a mano da PanoAI
(mensile e trimestrale). Si sovrappone ai registri su una materia sola, e la divisione va
rispettata, se no nascono due copie degli stessi numeri — che divergono **sempre**.

| | Possiede | Esempi |
| --- | --- | --- |
| **Radar** | i **numeri** e la **struttura** | book dei 25 account, ARR, ECC ID e IMS Org, team Adobe, prodotti con date di contratto, rinnovi, opportunità aperte, salute, e i **prodotti eleggibili** per il piano (Goal Sheet) |
| **`ACCOUNT.md`** | la **storia** | dove siamo, chi ha la palla, i blocchi, i fatti detti in riunione, i vincoli e il vocabolario del cliente |

Quindi: **il registro non ricopia** ARR, date di rinnovo, identificativi e nomi del team.
Li citerebbe vecchi. Se un numero del Radar è sbagliato si corregge **nel Radar**.

I file del Radar:
- `Mappa_Account/Anagrafica_account.md` — il book, trimestrale
- `Mappa_Account/Panorama_AAAAMMGG.md` — rinnovi, opportunità, rischi; mensile
- `Mappa_Account/Goal_Sheet_FY*.md` — il piano: quali prodotti **contano** per M1/M2
- `Mappa_Account/_PROMPT_PanoAI.md` — i prompt per rinfrescarlo (~10 minuti)
- `Registro_opportunita.md` — backlog trasversale. **La colonna «Decisione Antonio» non si
  tocca mai**: è dove una persona scrive SÌ / NO / DOPO
- `alias_cartelle.md` — con che nome un account sta nel book (`Telecom Italia` è `TIM`)
- `giri/AAAAMMGG-HHMM.md` — l'esito del **giro automatico** di ogni mattina (lun-ven
  07:30, launchd). Si scrive sempre, anche quando non c'è niente: è il battito, e
  `pnpm accounts` avvisa se l'ultimo ha più di due giorni. Zero token: nessuna chiamata
  a un modello, solo lettura di file locali — per questo gira **anche in un mese in cui
  il budget di Claude è esaurito**, che è il guasto che ha ucciso il radar del 2 ott 2026
- `eventi.md` — eventi e occasioni di relazione, a mano. Il giro non legge il calendario
  (costerebbe token, e un invito non dice chi è iscritto a un evento): legge questo file e
  avvisa quando una data è entro 14 giorni o un'iscrizione chiude entro 3
- `Sintesi_Task_storico/` — **storia, non si continua.** Era una scansione a mano dei task
  da email, si è fermata dopo due giri: faceva lo stesso mestiere del `ACCOUNT.md`, e due
  posti per «cosa devo a questo cliente» divergono. Quel lavoro lo fa ora `/accounts`.

**Lo snapshot invecchia.** Oltre un mese e mezzo i numeri si citano come datati, mai come
correnti: `pnpm accounts` stampa l'età in testa.

## Che cos'è un `ACCOUNT.md`

Il registro operativo di un account: un file per cartella, `docs/<Account>/ACCOUNT.md`.
Non è un archivio e non è un dossier. Risponde a quattro domande e a nient'altro:
**dove siamo**, **chi ha la palla**, **qual è il prossimo passo**, **quali fatti
sappiamo e da quale fonte**.

Serve perché lo stato di un account oggi vive sparso in decine di thread di posta, e
ricostruirlo costa un'ora ogni volta che serve.

### La regola di quando si scrive

Si aggiorna il `ACCOUNT.md` **solo** se è cambiata una di queste quattro cose:

1. dove siamo,
2. chi ha la palla,
3. il prossimo passo,
4. è entrato un **fatto nuovo con una fonte**.

Una sessione in cui si è soltanto letto o spiegato **non scrive niente**. Questo
non è un dettaglio: un log che registra anche le sessioni di sola lettura diventa
illeggibile in tre mesi, e un registro che nessuno apre non serve a nulla.

## Protocollo di apertura

All'inizio di una sessione su una cartella di account, **senza che te lo si chieda**:

1. leggi `ACCOUNT.md` (se non c'è, vai a «Il primo `ACCOUNT.md` di un account»);
2. prendi la data di `aggiornato`;
3. cerca **da quella data** in cinque fonti (dettaglio in `/account-open`): **Outlook** e
   **Teams** — entrambi dal connettore Microsoft 365, non da Centralino — le
   **trascrizioni** nella cartella `/Plaud` su Dropbox, **WhatsApp** via Centralino
   (nell'account `whatsapp-personale`, perché quel numero è il numero di lavoro; si cerca
   per **nome di persona**, non di cliente), e la **cartella dell'account**;
4. riferisci **in chat**, in poche righe: cosa è cambiato, cosa è bloccato, chi ha
   la palla, qual è il prossimo passo aperto;
5. **non scrivere ancora niente.** Una mail è una fonte, non un verdetto: l'aggiornamento
   si deposita dopo la conferma di chi lavora, non appena lo si legge.

## Protocollo di chiusura

Prima di concludere una sessione in cui è cambiata una delle quattro cose:

1. riscrivi **Dove siamo**, **Palla a**, **Prossimo passo**;
2. **aggiungi** i fatti nuovi, ognuno con fonte e data;
3. **aggiungi** una riga al log — il log è *append-only*: non si riscrive e non si
   riordina mai, nemmeno per pulizia. Ogni riga porta l'**identificativo** di dove
   sta la cosa: `thread <id>` per una mail, `Teams <data, chi>` per una chat,
   `WhatsApp <data, chi>`, `/Plaud/<file>.txt` per una trascrizione. Senza, ritrovarla
   costa cinque minuti;
4. aggiorna la data di `aggiornato`;
5. **mostra il diff prima di salvare.**

Il comando `/account-open` esegue l'apertura, `/account-close` la chiusura. Non aspettare
il comando: i due protocolli valgono comunque.

## Le regole che valgono

Ereditate dal repo perché sono regole di mestiere, non di grafica. Qui diventano
operative:

- **Un'affermazione è un'ipotesi, non un oracolo.** Vale per il committente, un
  collega, un verbale, un riassunto automatico. Un fatto entra nel `ACCOUNT.md`
  **solo con fonte e data**. Da «non trovato» si conclude «non confermato, da
  chiedere», mai «falso».
- **Gerarchia delle fonti**, in quest'ordine: artefatti approvati dal cliente →
  corrispondenza dell'account (**Outlook**; **Teams**, dove vivono molte decisioni
  operative che non arrivano mai in una mail; e **WhatsApp**, dove vivono le cose
  dette in fretta) → **trascrizioni** (cartella `/Plaud`
  su Dropbox) → cataloghi pubblici → web. Le **trascrizioni sbagliano i nomi
  propri** con regolarità: prima di scrivere un nome si risale al parlato o alla
  firma di una mail. E una trascrizione conta per un account solo se **quell'account è
  l'oggetto** della riunione: la ricerca per contenuto trova il nome di un cliente
  anche dentro riunioni che parlano d'altro, e quella è una traccia, non un fatto.
  Quella cartella contiene anche riunioni interne e colloqui: non si aprono.
- **Le dichiarazioni invecchiano.** Ogni fatto porta la sua data. Un fatto su cui
  si sta per costruire qualcosa, se ha più di qualche mese, si marca `da
  riverificare` invece di ripeterlo come corrente.
- **Un fatto superato non si cancella**: si marca `superato il <data>` e accanto si
  mette il nuovo con la sua fonte. Serve a sapere che su quel punto si era detto
  altro — e a chi lo sta ancora usando in riunione.
- **La sintesi è dove si rompono i fatti.** L'installato e i numeri di consumo si
  rileggono dal footprint riga per riga; il `ACCOUNT.md` non è la fonte di sé stesso.
- **Le cose da sapere prima si dicono prima.** Un vincolo dichiarato da noi vale
  molto più dello stesso vincolo scoperto dall'IT del cliente un mese dopo.
- **Dove due fonti sono in conflitto, si riporta il conflitto** e si chiede, invece
  di scegliere in silenzio.

## Riservatezza — la regola secca

Le cartelle di account sotto `docs/` sono **ignorate da git** (`docs/.gitignore` è
fail-closed: ignora tutto e riammette i soli documenti della Factory). Quindi:

- dentro un `ACCOUNT.md` si scrivono **nomi di persone, ruoli, identificativi,
  numeri di contratto e di consumo**: è il suo scopo;
- **niente di tutto questo si copia in un file tracciato** — non negli `HANDOVER`,
  non nel `README`, non in una spec, non in questo file. Un `ACCOUNT.md` non si cita
  per estratto in un documento tracciato: si cita per rimando;
- non si aggiunge **mai** una riga `!` a `docs/.gitignore` per un documento di
  cliente. Il gate `pnpm audit:docs` controlla entrambe le direzioni;
- non si committa nulla da `docs/<Account>/`, nemmeno un markdown che «è solo una
  nota»;
- e vale anche al contrario: l'account WhatsApp che porta il lavoro **mescola lavoro
  e vita privata**. Nel registro entra solo ciò che riguarda l'account; il resto non
  si cita, non si riassume e non si commenta.

## Il confine con quello che esiste già

Quattro cose si somigliano e non vanno confuse, se no nascono doppioni che
divergono:

| Dove | Che cos'è | Quando |
| --- | --- | --- |
| `docs/<Account>/ACCOUNT.md` | lo **stato operativo** vivo dell'account | sempre, è la base |
| skill `dossier` | la preparazione di **un incontro**, come pagina gated | quando c'è una data in calendario |
| `PANEL-*.md` | la revisione di **un deliverable** prima della consegna | prima di un handover |
| memoria (`MEMORY.md`) | i **fatti durevoli trasversali** — la regola, non il caso | quando impari una regola |
| `docs/HANDOVER*.md` | lo stato **ingegneristico della Factory** | mai per un caso d'account |

Il dossier **si alimenta** dal `ACCOUNT.md`, non lo sostituisce e non lo duplica.
Quando da un account nasce un contenuto, il verso è uno solo:
`ACCOUNT.md` → `EXPERIENCE-BRIEF.md` → skill `/experience-design`.

## Il primo `ACCOUNT.md` di un account

Non si creano in blocco: nasce alla prima sessione su quell'account. Si costruisce
da ciò che c'è — materiale nella cartella, thread di posta, memoria — **si dichiara
la fonte di ogni riga**, e si fa approvare prima di salvarlo. Quello che non si sa
si scrive `da chiedere`, non si inventa e non si lascia vuoto.

## Il template

```markdown
# <Account> — account
<identificativi: ECC ID, ragione sociale se serve> · aggiornato <gg mmm aaaa>

## Installato
Numeri e struttura → Radar: `Adobe/Radar/Mappa_Account/Anagrafica_account.md`
<solo ciò che il Radar non sa, con la sua fonte e data>

## Chi è chi
<ruolo, lato cliente o Adobe> · ultimo scambio <data>

## Vincoli e vocabolario
<ciò che cambia come si parla a questo cliente: divieti, sensibilità,
parole che usano loro e che vanno usate. «da chiedere» se non si sa.>

## Caso · <nome del caso>
Dove siamo — <due righe, non più>
Palla a — <ruolo> · dal <data>
Prossimo passo — <azione> · entro <data>

Fatti verificati
- <fatto> · <fonte>, <data>
- <fatto superato> · superato il <data> → <fatto nuovo> · <fonte>, <data>

Log (append-only)
<aaaa-mm-gg>  <cosa è stato fatto> · thread <id> | Teams/WhatsApp <data, chi> | /Plaud/<file>.txt
```

Note sul template:

- **Un file per cliente, i casi come sezioni.** Un caso esce in un file suo
  (`CASO-<slug>.md`) soltanto quando la sua sezione supera ~120 righe, e nel
  `ACCOUNT.md` resta la riga di rimando. Prima è cerimonia che si paga subito e
  serve dopo. È la stessa logica con cui `HANDOVER.md` si è spezzato: quando ha
  toccato il tetto, non prima.
- **Ogni riga di log nata da una mail porta l'identificativo del thread**, non solo
  la data. Senza, ritrovarla costa cinque minuti; con, dieci secondi.
- **Le date in chiaro, mai relative.** «il mese scorso» non si legge a febbraio.
- Un caso chiuso non si cancella: la sezione resta con `Dove siamo — chiuso il <data>`.

## Cosa non fare, qui

- **Non inviare posta**: si preparano bozze, l'invio è un gesto umano.
- **Non toccare `apps/`, `packages/`, `supabase/`** da una sessione d'account: se
  il lavoro è diventato un'experience, è un altro mestiere e ha il suo guardiano.
- **Non committare** da una cartella cliente (vedi «Riservatezza»).
- **Non riempire il log** con righe di cortesia: vale la regola delle quattro cose.
