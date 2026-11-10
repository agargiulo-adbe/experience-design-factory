# Handover — Parte 21 di 22
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 39. Il lavoro operativo d'account — registri, Radar, e il giro di ogni mattina

Nato il **12 ottobre 2026** e completato il **13**. Non è una experience: è lo strato con cui
si lavora sui conti cliente — mail, analisi, rinnovi, blocchi contrattuali — dentro `docs/`,
che fino al 12 ott serviva due mestieri senza distinguerli.

### 39.1 La falla da cui è partito tutto

Le cartelle cliente erano escluse da git con un **elenco a mano nel `.gitignore` di root, una
riga per cliente**. Ogni cliente nuovo nasceva **esposto** finché qualcuno non si ricordava
della sua riga — e il 12 ott una cartella arrivata quel giorno, con footprint e dashboard di
consumo del cliente, **non era ignorata** (verificato con `git check-ignore`). Il repo è
pubblico e `main` fa deploy automatico; nulla era mai stato committato (`git ls-files docs`),
ma bastava un `git add -A`.

Ora `docs/.gitignore` è **fail-closed**: ignora tutto e riammette per nome i soli documenti
della Factory, così ogni cliente futuro **nasce protetto per costruzione**. Le sedici righe
nel root sono state tolte. `pnpm audit:docs` (`scripts/docs-guard.ts`) verifica quattro cose,
tutte HARD, **in entrambe le direzioni** — anche la riammissione sbagliata, che è l'altro modo
di aprire la falla — ed è il **primo** passo in CI, non l'ultimo. ✅ La prova dal vivo è
arrivata da sé: una cartella `docs/Ferrero/` comparsa il 12 ott mentre si lavorava era **già
ignorata**, senza che nessuno aggiungesse niente.

### 39.2 Chi possiede che cosa: Radar e registri

Sotto `docs/Adobe/Radar/` vive il **Radar Opportunità**, alimentato a mano da PanoAI (mensile
e trimestrale). Si sovrapponeva ai registri su una materia sola, e la divisione è dichiarata
perché due copie a mano degli stessi numeri **divergono sempre** (lezione già pagata sul taglio
corto di Intesa):

| | Possiede |
| --- | --- |
| **Radar** | i **numeri** e la **struttura**: book di 25 account, ARR, ECC/IMS, team Adobe, prodotti con date di contratto, rinnovi, opportunità aperte, e il **Goal Sheet FY26** con i prodotti **eleggibili** per M1/M2 |
| **`ACCOUNT.md`** | la **storia**: dove siamo, chi ha la palla, i blocchi, i fatti detti in riunione, vincoli e vocabolario del cliente |

Il registro **non ricopia** ARR, date di rinnovo e identificativi: li citerebbe vecchi. File del
Radar: `Mappa_Account/Anagrafica_account.md` (il book), `Panorama_AAAAMMGG.md` (rinnovi,
opportunità, rischi), `Goal_Sheet_FY26.md`, `_PROMPT_PanoAI.md` (i prompt per rinfrescarlo),
`Registro_opportunita.md` (la colonna **«Decisione Antonio» non si tocca mai**),
`alias_cartelle.md` e `Sintesi_Task_storico/`.

**`Sintesi_Task` non si continua.** Era una scansione a mano dei task da email, ALTA/MEDIA/BASSA
per cliente: lo stesso mestiere del registro, e si era fermata dopo due giri nello stesso
giorno. I due file restano come storia.

### 39.3 I comandi, e il file si chiama ACCOUNT.md

`/account-open` (legge Radar → registro → cinque fonti, **riferisce senza scrivere**),
`/account-close` (deposita, diff prima di salvare, propone righe in `Registro_opportunita.md` e
in `eventi.md`), `/accounts` (vista d'insieme). Tutti e tre si trovano con `/acc` + TAB. Fuori
da una sessione c'è la **stessa parola** come funzione di shell: `accounts`, che gira da
qualunque cartella e **a zero token** (lo snippet è in `docs/CLAUDE.md`, non solo in un
`~/.zshrc`).

Il 12 ott «conto» è diventato **«account» in tutto il sistema, file compreso**: i registri si
chiamano `ACCOUNT.md`. ⚠️ **Gotcha che è costato un ripristino:** la prima passata di rinominare
era senza confini di parola, e «contiene» è diventato «accountene», «racconto» → «racaccount»,
«il contorno» → «l'accountrno». Il danno ha toccato il `CLAUDE.md` di root e **venti file di
memoria** dove «conto» voleva dire altro. Niente era committato, quindi git ha restituito i
tracciati; memorie e file ignorati sono stati riparati token per token. Memoria
`rinominare-con-confini-di-parola`.

### 39.4 Le cinque fonti dell'apertura

Outlook e **Teams** (lo **stesso** connettore Microsoft 365: Centralino **non** indicizza né
Teams né la casella Adobe), le **trascrizioni** in `/Plaud` su Dropbox, **WhatsApp** via
Centralino, la cartella dell'account.

Due correzioni di fatto, verificate: **Teams non passa da Centralino**, e la prova è un
messaggio con una decisione commerciale che nessun registro aveva. E su WhatsApp la prima
conclusione era **sbagliata** — la misura giusta, l'inferenza no: il lavoro sta nell'account che
Centralino chiama `whatsapp-personale`, perché **quel numero è il numero di lavoro**, quello
della firma delle mail Adobe. `whatsapp-aziendale` è un archivio fermo al 2022. Memoria
`etichetta-non-e-contenuto`.

Le trascrizioni hanno due regole proprie: stanno **sotto** la corrispondenza nella gerarchia e
sbagliano i nomi propri; e una **menzione di passaggio non è un fatto** — in quella cartella ci
sono anche riunioni interne e colloqui, che non si aprono.

### 39.5 Il giro gratuito di ogni mattina (13 ott)

Il «Radar Opportunità» schedulato il **2 ott** (lun e gio alle 07:30, output su Dropbox) ha
prodotto **zero file** in dieci giorni. La causa, dichiarata dall'owner: **l'account Claude su
cui girava ha esaurito i token del mese** — non un guasto dello scheduler. La correzione ribalta
la priorità: ottimizzare i token non è un accessorio, è **il vincolo che decide se gira**. Quel
design leggeva cinque fonti per 25 account due volte a settimana: **300-500 chiamate a
settimana**, quasi tutte su account dove non si era mosso niente.

Il principio che lo sostituisce: **selezionare prima di leggere**. Tre strati, e solo il terzo
costa token: `pnpm accounts` (zero, legge file locali, vale il 60% — *su cosa guardare*); un
innesco per conteggi (non implementato: serve quando i registri saranno molti); `/account-open`
sui 2-3 account indicati.

Da oggi `pnpm accounts` gira da sé **lun-ven alle 07:30 via launchd** (`pnpm radar:install`
installa o riallinea; `scripts/radar-giro.sh` è la sorgente versionata): scrive **sempre** in
`docs/Adobe/Radar/giri/` — è il battito — e **notifica solo se c'è un rilievo**, massimo cinque
righe, con la cosa più urgente nel sottotitolo.

⚠️ **Il 13 ott il giro è stato riportato allo scopo**, che non era «igiene e rinnovi» ma
**creare occasioni di cross-sell, upsell e relazione**: il Radar aveva già i dati e il giro
leggeva solo i rinnovi. Ora la scala di urgenza è: passo scaduto del registro · evento o
iscrizione che chiude · **trattativa aperta** che chiude entro 21 gg · **salute in rosso**
con la ragione dichiarata · rinnovo entro 30 gg (eleggibile, o su account senza registro) ·
**trattativa ferma** (data passata) · account fermo da oltre 21 gg. Tutto **raggruppato per
account**: tre righe rosse dello stesso cliente sono una notizia sola, e otto righe di
salute su quindici affogavano il resto (da 15 rilievi a 11). Quello che ne è uscito: **12
trattative aperte con una data davanti, $1,7M** (Banca Generali chiude fra 8 giorni con
tre), **4 ferme** ($202K, più 6 oltre i 18 mesi che sono residui di dati), e **14 solution
in rosso o con una data vicina** — fra cui **Telecom Italia con tre solution in rosso e
nessun registro**.

⚠️ **E il 13 ott, più tardi, il giudizio è tornato dentro** — perché la correzione
dell'owner era secca: «il giudizio non è la componente che deve girare su Claude? Io ho
bisogno di giudizio e di consulenza». Aveva ragione: ottimizzare il costo aveva fatto
uscire dal sistema la cosa richiesta, e un consulente che conta e non giudica è un
cruscotto. Ora, **se ci sono rilievi**, il giro passa la propria uscita a `claude -p` e ne
ricava cinque righe — `OGGI` (su cosa lavorare e perché), `NON` (cosa sembra urgente e non
lo è), `CLIENTE` (un'occasione, **solo** dove il radar porta un segnale), `DENTRO` (uno
spunto per l'AE, un collega, il manager), `DOMANDA` — in
`giri/AAAAMMGG-HHMM-consulenza.md`, e **la notifica porta il giudizio invece dei
conteggi**.

Tre numeri misurati: **$0,14 per giro** girando **fuori dal repo** (18.538 token di
contesto) contro **$0,36** dentro (100.821, cioè 75 KB di regole sui deck che lì non
servono) — e il giudizio fuori è **migliore**; circa **$3 al mese**; **zero nei giorni
quieti**, perché senza rilievi il consulente non viene chiamato. E `claude -p` **gira sotto
launchd**, verificato con un job di prova prima di prometterlo. Il radar del 2 ott non è
morto perché Claude costa: è morto per **300-500 chiamate a settimana** su 25 account —
questo ne fa **una**, su un input già ridotto. ⚠️ **Ripiego**: se il consulente tace o
risponde fuori formato torna la notifica dei conteggi, provato con `claude` irraggiungibile;
un giudizio mancato non deve spegnere il segnale. Il primo giudizio vero ha scelto Enel AAM
($243K, Red in due liste indipendenti, 47 giorni) scartando le quattro trattative Ferrari
perché Forms non muove il piano — e ha trovato un buco del radar da sé: **non porta
l'attainment**, quindi la domanda sul gap di piano non può rispondersela.

**`accounts --cross` è la mappa del cross-sell** e sta **fuori dalla notifica di
proposito**: per ogni account del book, quali prodotti eleggibili ha e quali no (208
caselle vuote). Le fonti interne del ruolo dicono di partire **dal segnale del cliente, non
dallo SKU che manca**; presentare quelle caselle come cose da fare sarebbe l'approccio che
giudicano debole. È una mappa da incrociare con un segnale, e il segnale lo trova
`/account-open`.

⚠️ Tre difetti trovati **provando**, non rileggendo: `toISOString()` stampava ogni data con
**un giorno di anticipo** (mezzanotte locale → UTC), e su una data di chiusura un giorno è
la differenza fra arrivare e non arrivare; il parser di P2 leggeva **uno solo dei due
blocchi** che il file ha, e nove account risultavano «non ha niente» pur avendo milioni di
ARR; e il recupero contro il doppione usava `compgen`, un builtin di **bash** in uno script
**zsh**, quindi non proteggeva da niente.

Le quattro soglie originarie restano la base. Gli eventi stanno in
`docs/Adobe/Radar/eventi.md` perché il calendario costerebbe token e **un invito non dice chi è
iscritto a un evento**.

E il pezzo che mancava al tentativo del 2 ott: **il guardiano**. `accounts` avvisa se l'ultimo
giro ha più di due giorni. Quel sistema è morto e nessuno l'ha notato per dieci giorni, perché
l'unico modo di accorgersene era aprire una cartella vuota.

⚠️ **Quattro guasti, tutti invisibili da una shell interattiva** (memoria
`launchd-non-e-la-tua-shell`): in `ProgramArguments` ogni `<string>` è un argomento
**letterale** (`/bin/zsh -lc "$HOME/…"` arrivava con virgolette e variabile dentro → `can't open
input file`); **da `~/Documents` launchd non riesce a ESEGUIRE uno script**, pur riuscendo a
leggerne i file (verificato con un job di prova) — la copia che gira vive in `~/.local/bin`; nel
`PATH` di launchd **non c'è né `pnpm` né `node`** (il giro scriveva 77 byte con `env: node: No
such file or directory`); e **zsh sotto launchd non apre i file del repo** (`operation not
permitted`) mentre node sì, per cui il controllo della deriva fra sorgente e copia installata è
stato spostato in `accounts.ts`. Il criterio di successo è **zero byte di stderr**, non «ha
scritto qualcosa».

### 39.6 Che cosa ha già prodotto

La copertura è passata da **20 account del book su 25 senza registro ($35,5M di ARR)** a **17 su
25 ($28,3M)**, e soprattutto **nessun rinnovo eleggibile resta su un account senza registro**.
I tre registri aperti il 13 ott, scelti dal Radar e non a sentimento:

- **UniCredit** (`docs/UniCredit/ACCOUNT.md`) — Adobe Analytics **$1,48M** si rinnova il **13 dic
  2026** in salute **Yellow**, adoption 4,4, e **nessuna conversazione di rinnovo in posta**. AE
  dedicato nuovo dal 2 ott; la referente si era detta disponibile «dalla settimana del 12». Più
  due cose nascoste nei numeri: **Assets $106K ad adoption 0,0** scade il 4 dic, nove giorni
  prima, e **Target risulta azzerato il 30 set** (da capire se perso).
- **Ferrovie / FS Technology** (`docs/Ferrovie/ACCOUNT.md`) — **Target $409K** si rinnova il **30
  dic** con adoption **0,0**: pagato e non usato, ed è il rinnovo eleggibile più grosso fra gli
  account scoperti. Una ricerca in posta **non trova nulla**: l'assenza di conversazione è il
  fatto. Stesso schema su **AJO $75K, Yellow, adoption 0,0**.
- **Intesa Sanpaolo** (`docs/Intesa Sanpaolo/ACCOUNT.md`) — Analytics **$36K** al **31 dic**,
  l'unico prodotto eleggibile dell'account; il resto (Forms $516K, Sites $400K) è relazione, non
  attainment.

I 17 che restano hanno rinnovi su prodotti **non eleggibili** (`Assets`, `Sites`, `Paid
Support`, `LLM Optimizer`): si aprono quando serve, non prima.

### 39.7 L'AI Forum del 21 ottobre, verificato alla fonte

Dal thread Teams del 9 ott: **455 registrati** (150 clienti, 9 partner), $16,44M di pipeline
toccata, 76% dello stretch goal Italia di 600. **L'iscrizione non ha una scadenza dichiarata, e
questo è peggio di una scadenza**: «è possibile che corporate chiuda le registrazioni a breve».
⚠️ **All'8 ott risultava UN SOLO meeting confermato in tutto l'evento** (su Generali), con tre
executive Adobe presenti: un evento così non è affollato, è una porta aperta. Alla **cena
executive** (55 registrati) ci sono già Agos, Banca Generali, EssilorLuxottica, Ferrero, Credit
Agricole Italia, UniCredit, Unipol. Tutto in `docs/Adobe/Radar/eventi.md`, col percorso del
foglio della guest list — che **resta da incrociare coi referenti**, ed è l'azione con più resa
della settimana.

### 39.8 Il grafo dei contatti — si ricava dalla posta, non si compila (13 ott, commit `9e98de4`)

Il Radar dice **che cosa** sta succedendo su un account. Non dice **a chi scrivere**: porta il
team Adobe (AE, CSM, SC), non i contatti del cliente. La sezione «Chi è chi» dei registri c'era
ma era prosa senza date — ventitré righe su otto account — e da una prosa non si decide niente.

Adesso si **ricava da Outlook**, una passata **a settimana** per account (`1 + N` chiamate), e
ogni riga porta `funzione · nome · indirizzo · ultimo scambio <data> · tema · verdetto — motivo`.
Formato, regola e limiti stanno in `docs/CLAUDE.md` → «Il grafo dei contatti»; il passo che lo
rifà è in `/account-open` (2bis) e scatta solo se il grafo ha più di sette giorni.

⚠️ **Due limiti MISURATI il 13 ott hanno riscritto la regola che il disegno dava per buona.** La
spec diceva «scrivi tu» se il contatto ha scritto *a te* **o tu a lui**; la seconda metà non è
calcolabile:

- **il filtro `recipient:` non distingue il destinatario diretto da chi era in copia.** Tre
  contatti dello stesso cliente tornano con gli **stessi cinque messaggi** di un thread di gruppo
  il cui testo è indirizzato a un **quarto**. Con la regola scritta a tavolino, un invito o una
  cancellazione di calendario rende «tuoi» tutti i partecipanti;
- **la ricerca gira sulla propria casella**: chi parla solo con l'AE o col CSM è **invisibile**.
  Il grafo dice «chi conosci tu», non «chi c'è».

Quindi il verdetto poggia su un fatto che si misura — **ti ha scritto lui** ed entro ~120 giorni
→ «scrivi tu» — più un **giudizio dichiarato** sulla funzione: acquisti, cybersecurity e legale
restano «passa dall'AE» anche se hanno scritto ieri, e il giudizio **vince sul dato** quando i
due divergono. Il motivo si scrive sempre accanto al verdetto: «ultimo scambio a luglio, lo
conosci di rimbalzo» è l'informazione che fa decidere; «passa dall'AE» da solo è un oracolo.

**Il primo grafo, su Enel: sei contatti, tre «scrivi tu».** Il caso che vale la pena conoscere è
la persona più calda — Contract Management, ultimo scambio il 12 ott — che risulta **«passa
dall'AE»**: non ha mai scritto a noi, scrive all'AE e il thread arriva inoltrato. E un contatto
di cybersecurity che *ha* scritto, dentro i 120 giorni, resta «passa dall'AE» per funzione. Nel
giro sono emersi anche un **conflitto fra due fonti** sulla funzione di una persona (registro
contro firma della mail, riportato e non risolto) e la conferma che `docs/Adobe/` sta **fuori**
da questo controllo: non è un cliente.

**Lo strato gratuito lo legge a costo zero.** `pnpm accounts` stampa per ogni account `N contatti
(M tuoi)`, marca quelli in **formato vecchio** come «da rifare» e tiene **una** riga raggruppata
sugli account che hanno un segnale e **nessun contatto noto** — dove un'apertura non si può
costruire. Il parser legge **paragrafi**, non righe: tre formati convivono nei registri e un
bullet che va a capo teneva la data sulla riga di continuazione. I formati vecchi si **contano**
e si marcano, senza indovinare quale metà di «X — Y» sia il nome.

⚠️ Al 19 ott il grafo strutturato esiste su **un account su nove** (Enel). Ferrero e Banca
Generali sono in formato vecchio, e **cinque account con un segnale non hanno contatto noto**:
finché resta così, l'apertura pesca quasi sempre dallo stesso account. Memoria:
`grafo-contatti-dalla-posta`.

### 39.9 L'apertura e il giro di ritorno — a chi scrivere oggi, e la risposta (13 ott, commit `e699676`)

È il pezzo che risponde alla richiesta da cui è partito tutto: non «che cosa sta succedendo» ma
**avvia una conversazione con questo contatto per proporre questa cosa**. `pnpm accounts
--apertura` incrocia i segnali del Radar col grafo dei contatti e propone **una** conversazione,
con quattro campi **obbligatori** — se ne manca uno l'apertura **non esce**, perché una riga
senza destinatario fa perdere tempo invece di farne risparmiare:

| Campo | Che cos'è |
| --- | --- |
| **A CHI** | nome, funzione, «scrivi tu» o «passa dall'AE» **col motivo** |
| **PROPONI** | di che cosa si parla. Uno, non tre |
| **PERCHÉ ORA** | il segnale che la giustifica, con la fonte |
| **MUOVE** | M1, M2 o «relazione» · più `Q4?` e un id `A-AAAAMMGG-N` |

**I candidati** sono gli stessi segnali dei rilievi, nello stesso ordine di urgenza, **meno i
passi scaduti**: quelli sono compiti propri, non conversazioni da aprire con un cliente.

⚠️ **Tre difetti trovati provandolo, non rileggendolo**, e ognuno sarebbe passato per funzionante:

- **«PROPONI AAM» su un account che da AAM sta migrando.** Il segnale era il rischio sul rinnovo;
  stampato come proposta commerciale era **falso**. Ora il campo dice il *verso* del segnale
  («difendere il rinnovo di X», «far avanzare la trattativa su X», «capire il rischio su X») e il
  nome del prodotto resta separato come **chiave** del confronto;
- **salute rossa e rinnovo sullo stesso prodotto erano due aperture** invece di una, e il rischio
  su un rinnovo **eleggibile** veniva marcato «relazione». Fusi — ed è la fusione che dà al
  rischio la data e l'eleggibilità del rinnovo, quindi `MUOVE` e `Q4?` giusti;
- **due lanci nello stesso giorno producevano due aperture.** Ora il secondo rimostra quella
  pendente, **nello stesso formato a etichette**: la notifica della mattina ricava la sua riga da
  quelle etichette, e un giorno con l'apertura in attesa perdeva proprio la riga più utile.

**Il giro di ritorno è il pezzo che vale più di tutti**, perché è l'unico che migliora da sé.
`--apertura --deposita` scrive l'apertura come riga in `docs/Adobe/Radar/Registro_opportunita.md`
con la colonna **«Decisione Antonio» vuota** — quella colonna esiste dal 2 ott e nessuno l'aveva
mai scritta: è esattamente il posto previsto. La risposta si dà a mano o con **`pnpm accounts
--decidi <id> si|no|dopo`**:

- **NO** → quella combinazione (account + contatto + cosa) **non si ripropone più**;
- **DOPO** → torna fra **21 giorni**;
- **SÌ** → resta aperta, e l'**esito lo chiede `/account-close`** (passo **5bis** nuovo);
- **nessuna risposta** → non si ripropone domani, ma **torna dopo una settimana** con lo stesso
  id: una proposta non risposta è più spesso persa che rifiutata.

⚠️ **La colonna non si riscrive mai**, nemmeno per «aggiornarla»: `--decidi` su una riga già
decisa **rifiuta** e stampa cosa c'è scritto. La nota in testa al registro dichiara l'eccezione:
le righe `A-` le scrive il radar, tutte le altre restano a mano.

**Nel giro della mattina** l'apertura si deposita, finisce nel **corpo della notifica** —
«`<account>` · scrivi a `<nome>` — `<cosa>`» vale più di uno spunto interno — e viene **passata al
consulente perché la giudichi**. Provato via `launchctl` il 13 ott sera: il consulente **non è
stato d'accordo**, nel merito — il contatto scelto segue fatturazione e RTCDP, non la leva
commerciale dietro l'attrition, quindi prima si allinea l'AE, che ha già in mano la variante
contrattuale sui volumi — e in `DENTRO` ha **collegato la variante al rischio di rinnovo**, due
cose che stavano in due file diversi. È la tesi del disegno dimostrata dal vivo: selezione
deterministica a costo zero, giudizio dove serve.

⚠️ **Correzione di metodo che costa cara se non si sa.** Provando il consulente con `env -i` la
risposta è stata **«Not logged in · Please run /login»**, e la conclusione «sotto launchd il
giudizio non parte» era **sbagliata**: `env -i` toglie più di quanto launchd tolga (un
LaunchAgent gira nella sessione dell'utente). La prova è **`launchctl start`**, non una
simulazione dell'ambiente. Memorie: `apertura-e-giro-di-ritorno`,
`launchd-non-e-la-tua-shell` (aggiornata).

**Pulizia di riservatezza fatta nello stesso giro**, e vale la pena sapere perché: `pnpm
audit:docs` dichiara di guardare **i percorsi, non il contenuto**. Il controllo umano che delega
ha trovato, in file **tracciati** di un repo **pubblico**, un cliente con prodotto e importo di
rinnovo dentro un prompt, una data di chiusura col nome del cliente, e un **numero di cellulare**.
Tutto sostituito con segnaposto, nessuna informazione utile persa.

**Stato al 19 ott:** una apertura depositata (`A-20261013-1`, Enel) **in attesa di decisione**.
Finché non si risponde, le aperture si accumulano senza ripresentarsi — ed è il solo modo in cui
questo sistema può diventare rumore.

---
