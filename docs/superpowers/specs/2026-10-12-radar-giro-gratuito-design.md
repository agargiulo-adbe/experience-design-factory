# Il giro gratuito del Radar — design

**Data:** 12 ott 2026 · **Stato:** **implementato e verificato il 13 ott 2026**

## Il problema

Un «Radar Opportunità» è stato progettato e schedulato il **2 ott 2026** (lunedì e giovedì
alle 07:30, output su Dropbox in `Plaud/Radar/`). Al 12 ott ha prodotto **zero file**:
`Plaud/Radar/` contiene solo `Registro_opportunita.md`, con la sola intestazione, ultima
modifica 2 ott 17:33.

**La causa, dichiarata dall'utente:** l'account Claude su cui girava ha **esaurito i token
del mese**. Non un guasto dello scheduler. Questa correzione è importante perché ribalta la
priorità: l'ottimizzazione dei token non è un accessorio del design, è **il vincolo che
decide se il sistema gira**.

`Sintesi_Task` si è fermata lo stesso giorno, dopo due giri: **stessa causa**, non un
secondo guasto indipendente.

Resta un terzo difetto, questo sì indipendente: il design diceva allo scheduler di leggere
la mappa account in `Plaud/Radar/Mappa_Account` su Dropbox. L'utente l'ha compilata il 4 ott
— completa, 25 account da PanoAI — ma in `docs/Claude/Radar/Mappa_Account`, sul disco. **Con
o senza token, non l'avrebbe trovata.** La parte umana era fatta; l'automazione guardava
altrove.

## Perché il design precedente non si rilancia così com'è

**Costo.** Legge cinque fonti (Outlook, Teams, Plaud, calendario, cartelle) per **tutti** i
25 account, **due volte a settimana**. A 6-10 chiamate per account sono **300-500 chiamate
a settimana**, la gran parte su account dove non si è mosso niente. È il modo più caro di
scoprire che non c'era niente da scoprire — ed è coerente con un budget esaurito.

**Doppione.** `/account-open` legge già quelle stesse cinque fonti, per un account, a
richiesta, e scrive in `docs/<Account>/ACCOUNT.md`. Il radar le rileggerebbe tutte e
scriverebbe altrove. È il doppione smontato il 12 ott con `Sintesi_Task`, e la conclusione
era che due posti per «cosa devo a questo cliente» divergono sempre.

**Premesse cadute.** Tre dei quattro compiti che quel design lasciava all'utente sono già
risolti: il **Goal Sheet** esiste e dà i pesi veri (M1 70% Gross New ARR $2.715.158, di cui
$1.113.215 nel solo Q4; M2 30% rinnovo al 90%; e l'elenco dei prodotti eleggibili — AEM,
Workfront, GenStudio, Firefly e Brand Visibility **non contano**); la **mappa account**
esiste (25 account + 57 righe di rinnovo + opportunità aperte); il **nome del manager** è
**Francesca Perucchetti** (il «Francesco Perfetti» cercato invano non esiste). Il quarto —
Dropbox e le policy — si risolve scrivendo in `docs/<Account>/`, fail-closed; va detto che i
dati cliente **sono già** in Dropbox perché è lì che Plaud sincronizza: fatto preesistente,
ma aggiungerci sintesi nuove allarga il perimetro invece di stringerlo.

## Il principio: selezionare prima di leggere

Tre strati, e **solo il terzo costa token**.

| Strato | Che cosa fa | Costo |
| --- | --- | --- |
| 1 · selezione | `pnpm accounts`: rinnovi entro 120 gg marcati per eleggibilità, passi scaduti, account fermi, copertura, età dello snapshot | **zero** — legge file locali, 1 secondo |
| 2 · innesco | *non implementato ora*: conteggi per account dall'ultima data del registro (una chiamata per fonte, non per account) | basso |
| 3 · lettura | `/account-open` sui 2-3 account che gli strati sopra indicano | alto, ma circoscritto |

Lo strato 1 è il 60% del valore — *su cosa guardare* — e **esiste già**.

## Le decisioni

| Decisione | Alternative scartate | Perché |
| --- | --- | --- |
| **Cron di sistema (launchd)**, solo strato 1 | agente in cloud schedulato; nessuno scheduler; cron + un giro caro a settimana | un job che non consuma budget di modello gira **anche in un mese esaurito**: è resistente al guasto che è accaduto. L'agente in cloud ha due incognite non verificate (accesso alle fonti da là, consumo per giro) |
| **Notifica macOS + file sempre** | solo file; notifica cliccabile; indicatore nel prompt | il file è il battito e la storia; la notifica interrompe **solo** quando c'è qualcosa, ed è l'unico modo perché resti credibile. Il clic sulla notifica resta non verificato (`terminal-notifier` non è installato) |
| **Lo strato 3 resta a mano** | un giro caro schedulato | il budget si spende dove si è deciso che valga, non alle 07:30 di un martedì, e non compete col lavoro interattivo per lo stesso tetto |
| **Eventi in `eventi.md`** | export .ics letto dal cron; niente eventi; righe proposte da `/account-close` | un posto solo, zero token, nessuna dipendenza. L'.ics ha due incognite (esiste su questa macchina? e un invito non dice chi è iscritto all'evento: la guest list dell'AI Forum stava in Teams) |

## A · Il giro gratuito

`~/Library/LaunchAgents/com.gargiulo.radar.plist`, **lunedì-venerdì alle 07:30**, esegue
**un solo argomento**: il percorso assoluto di `~/.local/bin/radar-giro`. Niente shell,
niente `$HOME`, niente virgolette — la prima versione passava `/bin/zsh -lc "$HOME/…"` e il
job moriva, perché in `ProgramArguments` ogni `<string>` è un argomento letterale (vedi
«Che cosa è servito davvero»).

Si installa con **`pnpm radar:install`**, che copia la sorgente versionata
`scripts/radar-giro.sh` in `~/.local/bin/radar-giro` e genera il plist. Tenere
l'installatore nel repo è ciò che rende la cosa riproducibile su un'altra macchina.

**Scrive sempre** `docs/Adobe/Radar/giri/AAAAMMGG-0730.md`, anche quando non trova niente:
quel file è il battito, e serve al guardiano (D).

**Notifica solo se** c'è almeno un rilievo, via `osascript -e 'display notification …'`
(verificato funzionante il 12 ott). **Massimo cinque righe**: una notifica lunga non si
legge.

## B · Che cosa è un rilievo

Quattro soglie, e nessuna in più:

1. **Scaduto** — un passo di un registro con `entro <data>` già passata.
2. **Rinnovo vicino** — entro **30 giorni** e (su prodotto **eleggibile** secondo il Goal
   Sheet) **oppure** su un account **senza registro**. Una riga **per account**, non per
   riga di rinnovo: RBOB sommato, data prima, «€» se almeno uno conta per il piano.
3. **Fermo** — registro più vecchio di **21 giorni** con almeno un caso aperto.
4. **Evento** — da `eventi.md`: data entro 14 giorni, o scadenza d'iscrizione entro 3.

Ogni soglia in più diluisce la notifica, e una notifica diluita viene ignorata.

## C · `eventi.md`

`docs/Adobe/Radar/eventi.md`, una tabella: `data | evento | account coinvolti | scadenza
iscrizione | note`. Lo riempie l'utente quando vede l'annuncio in posta (dieci secondi). Il
cron lo legge, fa scadere le date e avvisa.

**Il rischio è dichiarato:** è un gesto manuale, e i gesti manuali decadono — è la stessa
ragione per cui `Sintesi_Task` è morta. Mitigazione in «lavoro successivo».

## D · Il guardiano del guasto

`pnpm accounts` stampa in testa un avviso se l'ultimo file in `giri/` ha **più di due
giorni**: `⚠️ l'ultimo giro automatico è di N giorni fa — il cron potrebbe essere fermo`.

Serve perché il guasto si veda dal gesto che si fa comunque. Il 2 ottobre il sistema è morto
e nessuno l'ha notato per dieci giorni, perché l'unico modo di accorgersene era guardare una
cartella vuota.

## E · Quello che il cron NON fa

- **Non legge posta, Teams, Plaud, WhatsApp.** Zero chiamate a modello: è la sua ragione
  d'essere.
- **Non scrive nei registri degli account** e **non scrive in `Registro_opportunita.md`**:
  non ha giudizio, e una riga in quel registro è una conversazione commerciale.
- **Non dà punteggi.** Ordina per data e per eleggibilità al piano, che sono fatti.

## F · Come si verifica

```bash
# il job è caricato e parte
launchctl list | grep com.gargiulo.radar
launchctl start com.gargiulo.radar     # giro a mano, subito

# il file del giro esiste e ha l'ora giusta
ls -lt docs/Adobe/Radar/giri/ | head -3

# la notifica compare SOLO con rilievi: provato nei due stati il 13 ott
#   (a) con rilievi    → notifica, file da ~4,7 KB
#   (b) senza rilievi  → `accounts --rilievi` esce VUOTO, nessuna notifica, file scritto

# lo stderr del job deve essere a ZERO byte: è lì che si vedono i guasti di launchd
wc -c /tmp/radar-giro.err

# la deriva fra sorgente e copia installata
pnpm accounts | head -6    # avvisa se ~/.local/bin/radar-giro è vecchio

# il guardiano falla quando deve
touch -t 202610010730 docs/Adobe/Radar/giri/20261001-0730.md
pnpm accounts | head -3    # deve avvisare che il cron è fermo
```

Il gate `pnpm audit:docs` deve restare pulito: `giri/` ed `eventi.md` stanno sotto
`docs/Adobe/`, già coperta dalla regola fail-closed.

## Che cosa è servito davvero per farlo girare (13 ott)

Il job funzionava a mano e moriva sotto launchd — tre volte, per tre cause diverse. Ognuna
è il genere di guasto che non si vede se si prova solo dal proprio terminale, ed è
esattamente il controllo che il 2 ottobre non era stato fatto.

1. **`ProgramArguments` non è una shell.** Ogni `<string>` è un argomento **letterale**:
   `"$HOME/…/script.sh"` arrivava con le virgolette e la variabile dentro. Esito:
   `can't open input file`. Correzione: niente shell e niente `$HOME`, solo il percorso
   assoluto dello script, generato dall'installatore.
2. **Da `~/Documents` launchd non riesce a ESEGUIRE lo script**, pur riuscendo a leggere i
   file di quella cartella. Verificato con un job di prova: `[ -r …/package.json ]` passa,
   l'esecuzione dello script no. Correzione: la copia che gira vive in `~/.local/bin`,
   installata da `pnpm radar:install`.
3. **Nel `PATH` di launchd non c'è né `pnpm` né `node`.** Il giro scriveva un file di 77
   byte con `env: node: No such file or directory`. Correzione: lo script esporta il `PATH`
   da sé, con i percorsi verificati.

Più una quarta, trovata dopo: il controllo della deriva, scritto in shell, falliva con
`operation not permitted` perché **zsh lanciato da launchd non riesce ad aprire i file del
repo**, mentre `node` sì. Il confronto è stato spostato in `accounts.ts`, che quei file li
legge già — e così la deriva si vede anche quando si digita `accounts`, non solo nel cron.

**Un difetto di contenuto, non di infrastruttura.** La prima versione dei rilievi metteva
in testa alla notifica due righe Acea su `Assets` e `Sites`, prodotti che **non contano per
il piano**: la diluizione che la spec voleva evitare. I rinnovi ora si raggruppano **per
account** — una riga, il RBOB sommato, la data prima, e il simbolo «€» se almeno uno conta.

## Lavoro successivo, fuori da questa spec

- **Lo strato 2 (innesco per conteggi).** Serve quando gli account con registro saranno
  molti: oggi sono cinque e lo strato 1 basta.
- **`eventi.md` alimentato da `/account-close`.** Quando in una sessione emerge un evento con
  una data, la chiusura lo propone insieme al resto. Non sostituisce il file: aggiunge una
  seconda strada perché il gesto manuale non sia l'unica.
- **Il clic sulla notifica.** Chiede `terminal-notifier`, che non è installato. Da valutare
  solo se la notifica senza clic risulta scomoda all'uso.
- **La copertura.** Il numero più azionabile che lo strato 1 già stampa: 20 account del book
  su 25 senza registro, $35,5M di ARR, con nove rinnovi entro 120 giorni su account senza
  cartella. Non è lavoro di questa spec, ma è il lavoro che questa spec rende visibile ogni
  mattina.
