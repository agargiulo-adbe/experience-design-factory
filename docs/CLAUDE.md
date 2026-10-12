# docs/ — guida per una sessione di lavoro operativo d'account

Questo file si carica da sé in ogni sessione aperta su `docs/` o su una qualunque
cartella al suo interno, perché Claude Code risale le cartelle padre. Se stai
leggendo qui, stai lavorando **su un conto cliente**, non sulla Factory.

> **Questo file è TRACCIATO e il repo è PUBBLICO.** Dentro ci vanno ruoli, non
> nomi di persone; nessun dato di cliente, nessun numero di contratto, nessun
> identificativo. Quelle cose stanno nei `CONTO.md`, che sono ignorati da git.

## Le regole dei deck qui non valgono

Il `CLAUDE.md` di root è il regolamento delle **experience**: 725 righe su slide,
audit, co-brand, tipografia, contratto di leggibilità. Si carica anche qui, perché
è un file padre, ed è quasi tutto fuori tema: **in questo sottoalbero non si
applica**, salvo quando stai effettivamente producendo un artefatto della Factory
(una experience, un dossier gated, un `.pptx` sul template Adobe).

Quello che **resta valido sempre**, perché non riguarda i deck ma il mestiere, è
qui sotto in «Le regole che valgono». Il resto, ignoralo.

## Che cos'è un `CONTO.md`

Il registro operativo di un cliente: un file per cartella, `docs/<Cliente>/CONTO.md`.
Non è un archivio e non è un dossier. Risponde a quattro domande e a nient'altro:
**dove siamo**, **chi ha la palla**, **qual è il prossimo passo**, **quali fatti
sappiamo e da quale fonte**.

Serve perché lo stato di un conto oggi vive sparso in decine di thread di posta, e
ricostruirlo costa un'ora ogni volta che serve.

### La regola di quando si scrive

Si aggiorna il `CONTO.md` **solo** se è cambiata una di queste quattro cose:

1. dove siamo,
2. chi ha la palla,
3. il prossimo passo,
4. è entrato un **fatto nuovo con una fonte**.

Una sessione in cui si è soltanto letto o spiegato **non scrive niente**. Questo
non è un dettaglio: un log che registra anche le sessioni di sola lettura diventa
illeggibile in tre mesi, e un registro che nessuno apre non serve a nulla.

## Protocollo di apertura

All'inizio di una sessione su una cartella cliente, **senza che te lo si chieda**:

1. leggi `CONTO.md` (se non c'è, vai a «Il primo `CONTO.md` di un cliente»);
2. prendi la data di `aggiornato`;
3. cerca nella posta i thread di quel cliente **da quella data**, e guarda la
   cartella per materiale arrivato dopo (footprint, allegati, trascrizioni);
4. riferisci **in chat**, in poche righe: cosa è cambiato, cosa è bloccato, chi ha
   la palla, qual è il prossimo passo aperto;
5. **non scrivere ancora niente.** Una mail è una fonte, non un verdetto: l'aggiornamento
   si deposita dopo la conferma di chi lavora, non appena lo si legge.

## Protocollo di chiusura

Prima di concludere una sessione in cui è cambiata una delle quattro cose:

1. riscrivi **Dove siamo**, **Palla a**, **Prossimo passo**;
2. **aggiungi** i fatti nuovi, ognuno con fonte e data;
3. **aggiungi** una riga al log — il log è *append-only*: non si riscrive e non si
   riordina mai, nemmeno per pulizia;
4. aggiorna la data di `aggiornato`;
5. **mostra il diff prima di salvare.**

Il comando `/conto` esegue l'apertura, `/conto chiudi` la chiusura. Non aspettare
il comando: i due protocolli valgono comunque.

## Le regole che valgono

Ereditate dal repo perché sono regole di mestiere, non di grafica. Qui diventano
operative:

- **Un'affermazione è un'ipotesi, non un oracolo.** Vale per il committente, un
  collega, un verbale, un riassunto automatico. Un fatto entra nel `CONTO.md`
  **solo con fonte e data**. Da «non trovato» si conclude «non confermato, da
  chiedere», mai «falso».
- **Gerarchia delle fonti**, in quest'ordine: artefatti approvati dal cliente →
  corrispondenza dell'account → trascrizioni → cataloghi pubblici → web. Le
  **trascrizioni sbagliano i nomi propri** con regolarità: prima di scrivere un
  nome si risale al parlato o alla firma di una mail.
- **Le dichiarazioni invecchiano.** Ogni fatto porta la sua data. Un fatto su cui
  si sta per costruire qualcosa, se ha più di qualche mese, si marca `da
  riverificare` invece di ripeterlo come corrente.
- **Un fatto superato non si cancella**: si marca `superato il <data>` e accanto si
  mette il nuovo con la sua fonte. Serve a sapere che su quel punto si era detto
  altro — e a chi lo sta ancora usando in riunione.
- **La sintesi è dove si rompono i fatti.** L'installato e i numeri di consumo si
  rileggono dal footprint riga per riga; il `CONTO.md` non è la fonte di sé stesso.
- **Le cose da sapere prima si dicono prima.** Un vincolo dichiarato da noi vale
  molto più dello stesso vincolo scoperto dall'IT del cliente un mese dopo.
- **Dove due fonti sono in conflitto, si riporta il conflitto** e si chiede, invece
  di scegliere in silenzio.

## Riservatezza — la regola secca

Le cartelle cliente sotto `docs/` sono **ignorate da git** (`docs/.gitignore` è
fail-closed: ignora tutto e riammette i soli documenti della Factory). Quindi:

- dentro un `CONTO.md` si scrivono **nomi di persone, ruoli, identificativi,
  numeri di contratto e di consumo**: è il suo scopo;
- **niente di tutto questo si copia in un file tracciato** — non negli `HANDOVER`,
  non nel `README`, non in una spec, non in questo file. Un `CONTO.md` non si cita
  per estratto in un documento tracciato: si cita per rimando;
- non si aggiunge **mai** una riga `!` a `docs/.gitignore` per un documento di
  cliente. Il gate `pnpm audit:docs` controlla entrambe le direzioni;
- non si committa nulla da `docs/<Cliente>/`, nemmeno un markdown che «è solo una
  nota».

## Il confine con quello che esiste già

Quattro cose si somigliano e non vanno confuse, se no nascono doppioni che
divergono:

| Dove | Che cos'è | Quando |
| --- | --- | --- |
| `docs/<Cliente>/CONTO.md` | lo **stato operativo** vivo del conto | sempre, è la base |
| skill `dossier` | la preparazione di **un incontro**, come pagina gated | quando c'è una data in calendario |
| `PANEL-*.md` | la revisione di **un deliverable** prima della consegna | prima di un handover |
| memoria (`MEMORY.md`) | i **fatti durevoli trasversali** — la regola, non il caso | quando impari una regola |
| `docs/HANDOVER*.md` | lo stato **ingegneristico della Factory** | mai per un caso d'account |

Il dossier **si alimenta** dal `CONTO.md`, non lo sostituisce e non lo duplica.
Quando da un conto nasce un contenuto, il verso è uno solo:
`CONTO.md` → `EXPERIENCE-BRIEF.md` → skill `/experience-design`.

## Il primo `CONTO.md` di un cliente

Non si creano in blocco: nasce alla prima sessione su quel cliente. Si costruisce
da ciò che c'è — materiale nella cartella, thread di posta, memoria — **si dichiara
la fonte di ogni riga**, e si fa approvare prima di salvarlo. Quello che non si sa
si scrive `da chiedere`, non si inventa e non si lascia vuoto.

## Il template

```markdown
# <Cliente> — conto
<identificativi: ECC ID, ragione sociale se serve> · aggiornato <gg mmm aaaa>

## Installato
<prodotti> · fonte: <footprint/file, data>

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
<aaaa-mm-gg>  <cosa è stato fatto> · thread <id>
```

Note sul template:

- **Un file per cliente, i casi come sezioni.** Un caso esce in un file suo
  (`CASO-<slug>.md`) soltanto quando la sua sezione supera ~120 righe, e nel
  `CONTO.md` resta la riga di rimando. Prima è cerimonia che si paga subito e
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
