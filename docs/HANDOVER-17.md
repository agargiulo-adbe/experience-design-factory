# Handover — Parte 17 di 18
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 37. Trenitalia — «Dove può arrivare il viaggio» (Prospettiva per la Direzione Sales)

**Stato al 2026-10-12: draft, spenta sullo showcase, mai passata da un panel.**
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

`audit:deck` **0 HARD su 5 viewport fino a 3840×2160** (`wallScale` acceso **dopo** il gate, non
prima), `audit:ink` pulito su 231→243 blocchi, `audit:wrap` pulito, `copy-audit` **0 HARD e 0 SOFT**
(rubrica de-AI e voce istituzionale comprese), `audit:fonti` 12 link 0 rotti, `typecheck` 0 errori.
⚠️ **Nessuno di questi prova che il cliente compri l'argomento**: il panel è il P0 di §10 (Parte 2).

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
