# Handover — Parte 17 di 18
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 37. Trenitalia — «Dove può arrivare il viaggio» (Prospettiva per la Direzione Sales)

**Stato al 2026-10-12 (sera): draft, spenta sullo showcase, due giri di panel fatti e applicati.**
App: `apps/trenitalia-prospettiva-sales`. Tipo: **Prospettiva** (la domanda del cliente è «dove
potremmo arrivare?», e la stanza è precedente a qualunque discovery). È la **seconda** experience
sul Gruppo FS e non va confusa con «Connessioni Intelligenti» (§36, Parte 8), che è un Blueprint su
un altro interlocutore: le due conversazioni **devono raccontare la stessa storia**, e se non lo
fanno lo scoprono loro prima di noi.

### 37.1 Che cosa contiene

Sette capitoli: i **quattro temi dell'agenda** mandata alla segreteria, fra un'apertura e una rotta.
Il filo è quello deciso in riunione — **dove si perdono le vendite** — e non l'ordine dei nostri
prodotti. 27 slide, lette tutte a 1920. Il dossier gated che la precede è `dossier-sales` (§26.9,
Parte 7): 16 sezioni, 33 fonti, 0 rilievi su cinque viewport.

### 37.2 La skin è letta, non ricordata

`pnpm brand:tokens https://www.trenitalia.com`: **ardesia `#2f394e`** è il colore di sistema con
**285 occorrenze**, il **rosso `#d91835`** è il marchio con 34, e **Poppins** è il carattere vero del
cliente — che per una volta è **distribuibile**. Dominante scura. È la stessa famiglia a cui
«Connessioni Intelligenti» è stata riportata il 9 ott, quindi le due experience ora si somigliano
perché somigliano **al cliente**, non perché condividono un tema.

### 37.3 La misura sugli assistenti, e perché la tesi è cambiata

Il deck porta **una misura nostra**: otto domande di viaggio, nessuna di marca, poste l'11 ottobre.
Il primo giro interrogava **un** assistente e la slide concludeva «non vi citano». Il 12 ottobre la
misura è stata **rifatta su un secondo assistente**, dal browser, una conversazione nuova per
domanda — e la tesi è cambiata, non i numeri:

- un motore costruisce la risposta **sui rivenditori** — il sito del cliente è fra le fonti **2 volte
  su 8** — e **due volte su otto sbaglia di chi sono le Frecce**, elencandole come se fossero aziende
  diverse;
- l'altro va **sui siti ufficiali** (**7 su 8**, con il link «prenota con Trenitalia») e **non sbaglia
  mai**.

⚠️ Da qui la regola che vale oltre questo deck: **l'errore ha un proprietario**. Dire «gli assistenti
sbagliano» sarebbe stato falso, e su una slide che accusa qualcuno di sbagliare un fatto, sbagliare
un fatto è fatale. Gli altri due motori chiedono un accesso e sono **rimasti fuori**: sta scritto in
slide, invece di far finta che il campione fosse completo. Il metodo si apre **sul posto**
(«Come l'abbiamo misurato», un blocco che si espande sulla copertina del capitolo) con i limiti
dentro: la prima domanda che arriva su un dato è «da dove viene?», e una slide che manda a cercare
la risposta in un allegato l'ha già persa. Documento di misura: `docs/Ferrovie/MISURA-…-2026-10-11.md`
(git-ignorata). ⚠️ **La misura invecchia in fretta**: se l'incontro slitta di settimane va rifatta,
non ricitata.

### 37.4 Grafica: otto sfondi, due clip, e un'animazione tolta apposta

Otto sfondi Firefly, uno per famiglia di slide, con il credito «creato con» su ciascuna. Il filo
visivo è una **linea di luce con delle fermate**, lo stesso del marchio e della home. **Nessun treno**:
un treno generato somiglia sempre al treno di qualcuno, ed è la wrong-brand imagery che la Quality
Bar vieta. Il **duotone non è un vezzo** — chiesta la palette a parole, il modello ha restituito neon
ciano, magenta e arancio, belli e di un'altra azienda; il grade rimappa la luminanza fra due colori
del marchio, così l'immagine esce ardesia qualunque cosa abbia generato il modello. Due clip su
copertina e chiusura (giro ricucito con `loop:seamless`, da 25,9 a 46,5 dB contro un riferimento di
52), sulla Release `media` perché gli mp4 sono git-ignorati.

⚠️ **Il conteggio animato sui numeri è stato montato e poi tolto, ed è una decisione**: mentre
contava, la slide diceva «0 su 8 risposte nominano Trenitalia» — l'esatto contrario del fatto che
afferma — e il 70.000 passava da «0.000». Su un capitolo che porta una misura, due secondi di numero
falso costano più di quanto renda l'effetto. Resta il movimento che **non afferma niente**:
rivelazione, scaglionamento, parallasse, clip.

### 37.5 Quello che ha prodotto per tutti

Tre correzioni risalite alla fonte perché toccano **ogni experience futura**: `new-experience`
patchava `deck-audit.ts` mentre le rotte stanno in `lib/deck-routes.ts` da un refactor, e ora accetta
`--chapters`; `wrap-audit` spezzava le righe su `\s`, che in JavaScript comprende lo **spazio
unificatore**, quindi segnalava ancora la coppia appena legata — cioè rifiutava il rimedio che lui
stesso prescrive; e nel **template** il chrome del deck e la nav legavano l'inchiostro a
`--ink-primary` pur avendo uno sfondo esplicito, che in una skin a dominante scura diventa bianco su
bianco. Da qui sono nati anche **`audit:ink`** e **`audit:fonti`** (§11, voci del 12 ott).

### 37.6 Gate

`audit:deck` **0 HARD** a 1920/1440/1280 (34 slide su 9 rotte; il residuo è tutto soft: `a` 27,
`i` 16, `g` 8 — bande di lettura e uso dello spazio su slide volutamente ariose), `audit:ink`
pulito su 312 blocchi, `audit:wrap` pulito, `copy-audit` **0 HARD e 0 SOFT**, `audit:taglio`
**ALLINEATO**, `audit:fonti` 28 link, **nessuno rotto e nessuno generico** (le tre righe senza
link sono la nostra misura, che non è pubblica). ⚠️ **Nessuno di questi prova che il cliente
compri l'argomento**: per quello serve il panel, §37.7.

### 37.7 Il panel del 12 ottobre — due giri, e che cosa ha trovato

Sei personas cieche (lui, il Direttore Generale, marketing, Customer Operations, il presidio
digitale, il Digital Business Partner di FSTechnology) più il fact-checker e l'arbitro.
Verdetti e JSON grezzi in `docs/Ferrovie/PANEL-VERDICT-2026-10-12-round{1,2}.md` e
`docs/Ferrovie/panel/` (git-ignorati). Personas: `docs/Ferrovie/PANEL-PERSONAS-SALES.md`.

| Asse | giro 1 | giro 2 |
|---|---|---|
| credibilità dei fatti | 2,0 | 3,2 |
| rilevanza per me | 4,0 | 4,0 |
| chiarezza | 3,8 | 3,8 |
| rischio (5 = nessuno) | 2,3 | 2,8 |
| azionabilità | 2,8 | 3,2 |

Il secondo giro ha prodotto 24 P0: **otto erano già chiusi nell'albero di lavoro** (le personas
leggono uno snapshot), gli altri sono stati applicati la notte del 13 — fonti che non dicevano
quella frase (il via libera a SNCF è del 7 marzo, Il Foglio è del 4), PICO con la sua fonte,
i 70.000 detti come li dice il comunicato, l'ask in un posto solo e un terzo giro di
umanizzazione sulle dodici formule a specchio. Coda del verdetto round 2 per il dettaglio.

Al primo giro **sei «accetto a condizione» su sei**; al secondo il Direttore Sales passa a
**«sì»** e restano cinque condizionati. **Quindici fatti refutati**, e i tre che contano di più
erano invisibili ai gate perché i link rispondevano: la slide d'apertura attribuiva a lui, fra
virgolette, una frase che l'articolo ANSA citato **non contiene**; «da due operatori a quattro»
è falso (sono due, SNCF è il terzo e debutta non prima di fine 2027); i **70.000 punti vendita
non sono le agenzie** ma la rete di terzi che vende il Regionale, con un numero del 2014 — il
canale suo sono **12.400 agenzie**, contate da lui. Dettaglio e correzioni in
`docs/Ferrovie/CORREZIONI-DA-RIPORTARE-NEL-DOSSIER-2026-10-12.md`: **le stesse righe stanno
ancora nel dossier**, che è quello che il team legge per prepararsi.

⚠️ **La lezione che vale oltre questo deck**: `audit:fonti` verifica che il link **risponda**,
non che dica quella frase. Da qui due cose nuove — il SOFT sui **link generici** (tre slide
citavano due homepage per sei fatti) e il campo `cosaDice` in `src/data/sources.ts`, che tiene
scritto che cosa ogni pagina conferma **verbatim**.

**Che cosa resta aperto dopo due giri** (il contratto dice due, non tre): nessun ordine di
grandezza del valore per i quattro punti — e non si inventa, si chiede; nessun indicatore del
loro mestiere (riempimento, ricavo per posto-km, mix diretto/intermediato); il parco applicativo
del cliente non è mai descritto; manca una riga su che cosa **non** duplichiamo rispetto ai
cantieri aperti con gli altri fornitori. Tutti e quattro chiedono numeri o scelte che il team
d'account deve portare: sono punti per una persona, non per un altro giro di panel.

### 37.8 «In dieci minuti», il taglio che non può divergere

`/dieci-minuti/` — 7 slide (copertina, la sua frase, il contesto, la domanda, i quattro punti,
il passo, la firma) con **l'ask dentro**, perché un'ora concessa diventa venti minuti più spesso
di quanto si ammetta, ed è anche la versione che lui gira al suo capo. Non è una copia: copia e
fonti stanno in `src/data/contenuti.ts` e `src/data/sources.ts`, e dove il taglio ha bisogno di
meno parole la versione breve è un **campo accanto** a quella lunga (`bBreve`, `leadBreve`).
Lo verifica `pnpm audit:taglio` (§11): HARD su copia a mano, numeri che solo il taglio afferma,
fonti che solo il taglio porta. È la prima applicazione della funzione, ora generale
(`skills/experience-design/references/taglio-dieci-minuti.md`).

---

## 38. TIM — «Una campagna, molti formati»

**Stato al 2026-10-12: in lavorazione sulla branch `feat/tim-content-at-scale`, non committata.**
App: `apps/tim-contenuti-su-scala`. Tipo: **Prospettiva**, prima della discovery; l'ask è **aprire un
tavolo di lavoro**, non vendere. Seed Supabase `0028_seed_tim_contenuti_su_scala.sql`.

### 38.1 Perimetro, dal `PRODUCT.md`

Il pubblico è la **guida marketing e campagne** del cliente; il primo interlocutore è lo sponsor
social/dati, e **chi possiede il budget non è confermato**. L'experience segue **un brief di campagna**
dentro un ciclo governato di produzione del contenuto: un'idea condivisa diventa varianti approvate
per canale, e l'evidenza di performance informa l'iterazione successiva. ⚠️ Il ciclo è **una proposta
da provare con il cliente, non un'affermazione sul suo processo attuale**.

Vincoli dichiarati nel `PRODUCT.md`, da rispettare in ogni riga di copy:
- ATL e BTL sono nel perimetro; **GenStudio for Performance Marketing è documentato per il digitale
  a pagamento, email e display**, e il trattamento dei master broadcast **va stabilito con il cliente**
  — non si deduce un'esclusione di prodotto dal fatto che una guida non la documenti;
- **non** si affermano colli di bottiglia attuali, risparmi, incrementi di performance, adozione di AI
  nella produzione delle campagne, né la completezza del laboratorio dati del cliente, senza conferma;
- il perimetro sono le **campagne proprie** del cliente, non un servizio per i suoi clienti business;
- la pubblicazione sullo showcase è autorizzata, quindi **tutto deve reggere l'esposizione pubblica**.

### 38.2 La skin

Design system letto da `gruppotim.it`: `#004691` è il più frequente (113 occorrenze), poi `#122ac2`
(51) e `#081677` (48); `#eb0028` compare 13 volte. ⚠️ Il `PRODUCT.md` le marca come **osservazioni,
non una mappatura semantica completa**: superfici primarie chiare, inverse scura.

### 38.3 Il panel, e perché non basta

Un giro il 12 ott (`docs/TIM/PANEL-VERDICT-2026-10-12-round1.md`): medie **4,0 · 4,2 · 4,0 · 3,6 ·
3,2**, tutte le sedute con verdetto **condizionale**. ⚠️ Il verdetto porta **due marchi**:
`⚠️ DERIVED PERSONAS` — le cinque sedute erano **di ruolo**, non profili del cliente verificati — e una
nota di **ricostruzione parziale dal checkpoint di sessione**, perché il risultato strutturato e le
risposte individuali **non sono stati salvati**, quindi min, max e punteggi per seggio non sono
recuperabili. Esiste una cartella `panel/2026-10-12-round2/` con la sola `evidence/` e **nessun
verdetto**. Sette P1 restano da applicare, fra cui **verificare separatamente l'autorizzazione al
lockup Adobe × TIM**. Dettaglio e azioni in §10.a (Parte 16).

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
righe, con la cosa più urgente nel sottotitolo. Quattro soglie e nessuna in più: passo scaduto ·
rinnovo entro 30 gg (eleggibile per il piano, o su account senza registro) · account fermo da
oltre 21 gg · evento entro 14 gg o iscrizione entro 3. Gli eventi stanno in
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

