# Handover — Parte 24 di 24
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 42.17 Storia di Intesa · il 13-14 novembre, l'innesto a carte, la mappa delle capacità e il grafo delle identità

Scritta in una parte nuova perché la Parte 19, dove stanno §42.13–42.16, è a meno di 1 KB dal tetto.

**Stato del codice.** `29c0407` (14 nov, 00:39) porta l'innesto a carte fino al cambio di sottotitolo; `36e2755` (14 nov) porta tutto il resto, compresi i due componenti nuovi `FiguraCapacita.astro` e `MappaCapacita.astro`. Entrambi su `main` e pubblicati. `astro check` dava un errore di tipo su `<FiguraCapacita k={c.k}>`: `CAPACITA` è ora `as const`.

**Lo schema dell'innesto (`slide-innesto`, `pages/messa-a-terra.astro`, `styles/innesto.css`).**
- **Carte che si girano** in verticale, «a bascula» (`rotateX`). Davanti: icona «giro», titolo, pillole. Dietro: che cosa fa quel blocco e come si lega ad Adobe (campo `lega` in `OGGI`, `data/innesto.ts`). Sulle carte Adobe il retro porta anche il momento di Giulia e «Come funziona» (il pop-up).
- **Due forme di pillola:** chi riceve (`im-chi`: clienti / non‑clienti) e come parte (`im-come`: programmate, con il calendario, e su evento, con il fulmine). Real-Time Activation e Journey Optimizer portano entrambi «non‑clienti».
- **Un ciclo di 7 secondi** (`im-ciclo-*`) accende in sequenza le due Next Best Experience: quella del vostro motore verso le iniziative **programmate** (la pillola si accende quando l'impulso arriva: `allinea()` calcola `--rx`) e quella di Journey Optimizer verso i canali per i non‑clienti. Le etichette delle frecce dati restano **sempre visibili**: nella prima versione sparivano e in sala non si ricordavano.
- **Legenda delle frecce** dentro la cornice della banca. La legenda AEP apre i **Servizi comuni**; il chip «Come entrano i dati» elenca i quattro metodi verificati su Fluffy: Web/Mobile SDK via Edge Network, connettori Sources, API HTTP in streaming, caricamento batch («File a lotti» suonava male all'owner).
- **Copia.** Titolo «Riconoscere, ingaggiare e misurare anche chi non è ancora cliente». Sottotitolo, scelto dall'owner fra alternative scritte da zero: «Quello che avete resta: Adobe aggiunge i non‑clienti e porta la Next Best Experience alle vostre iniziative programmate.» Journey Optimizer, sul retro: orchestrazione di percorsi e campagne su ogni canale, in tempo reale, e AI Decisioning che sceglie l'offerta. Non più solo Decisioning: l'owner ha chiesto di non sminuirlo.
- `nomi()` centra le etichette NBE fra le linee della cornice e le manda a capo quando non c'è spazio; ResizeObserver e `fonts.ready`.

**«Real-Time CDP» → «Real-Time Activation»** in circa 35 punti. È una **scelta dell'owner**, per non sovrapporsi concettualmente a Salesforce Data Cloud. ⚠️ Verificato su Fluffy: **non è un nome ufficiale**. Il prodotto resta Adobe Real-Time CDP, e «Adobe Experience Platform Activation» è un'offerta diversa. Va detto a voce se qualcuno lo chiede.

**«sotto pseudonimo»** sostituito nei 7 punti in cui compariva, mai con «anonima».

**La mappa delle capacità.** `slide-capacita` ha il titolo «Che cosa fa ciascun componente nel percorso di Giulia» e quattro verbi: **Riconosce · Sceglie · Invia · Misura**, ognuno con la figura condivisa di `FiguraCapacita.astro`. `MappaCapacita.astro` ripete la mappa sulle slide di approfondimento con il verbo di quella slide acceso (Misura su attribuzione e `cja-banca`). Un click sulla mappa riporta a `slide-capacita`. A 820 px di altezza resta acceso solo il verbo attivo, perché il titolo deve stare nell'area sicura. Sul **ritorno** la mappa è tolta: lì le righe sono marcate Comprendere, Creare, Sceglie e Invia, e i due vocabolari mescolati confondevano (richiesta dell'owner).

**`slide-chiave` è ora un grafo delle identità con lo stitching.** È una scelta dell'owner: «Solo identity graph», non un modello di attribuzione.
- Cinque sotto-passi: ECID, email, telefono, NDG intorno a «?» che diventa «Giulia». Accanto, la linea del tempo degli eventi.
- Al passo dell'email l'evento 02 si **ricuce all'indietro**: «sconosciuta» diventa «Giulia · ricucita all'indietro».
- La barra dice «Cliente da oggi: la storia si legge in CJA». La nota dice: «Un PC condiviso in famiglia non fonde due persone: l'NDG è unico nel grafo, e ogni visita autenticata resta a chi l'ha fatta.»
- Verificato su Fluffy:
  - Lo stitching di CJA può essere per campo o per grafo, e il replay riattribuisce gli eventi anonimi precedenti.
  - Il lookback va da 1 giorno (replay giornaliero) a 7, 14 o 30 giorni (settimanale), secondo il pacchetto; il backfill è di 13 o 25 mesi.
  - Le Linking Rules del grafo: con un namespace unico, un dispositivo condiviso non fa collassare il grafo. Gli eventi anonimi vanno all'ultimo utente autenticato, quelli autenticati restano alla loro persona.

**Le altre slide.**
- **Attribuzione:** lead «Per il Controllo di Gestione: quanto ogni canale digitale porta in filiale, fino alla firma, e quanto vale il canale fisico.»
- **Ritorno:** titolo «Quello che si impara da Giulia migliora la relazione con il prossimo cliente», e «E Giulia» riscritto («Non riparte da zero…»). Via «Regole riviste a fine trimestre», perché nessuno sapeva dire perché proprio il trimestre.
- **Capacità:** «Email, sito, app, SMS, WhatsApp». WhatsApp è un canale nativo di AJO, GA da luglio 2025 (Fluffy).
- **Team (`adobe.astro`, `global.css`):** sette colonne uguali sopra i 901 px. Le foto sono equidistanti (245 px a 1920). I due ruoli PSS vanno a capo uguali («Product Sales Specialist» / «Data»·«Content»). A 1280 nomi e ruoli restano su due righe, come prima.
- **Le quattro referenze:** via il nome ripetuto in alto a destra; `MarchioRef.astro` non ha più il fallback di testo.

**Unipol, riscritta dal materiale in `docs/Unipol`** (deck del Summit 2026, git-ignorato). Accento «le campagne misurate fino in agenzia».
- Hero «5 → 1»: sito, app, strumento di vendita delle agenzie, CRM e polizze emesse, uniti per ECID e ID cliente.
- Riquadri: 2.035 agenzie nella stessa analisi del digitale; un tavolo dove marketing, vendite e IT analizzano insieme.
- Fascia: «Dai dati condivisi alle decisioni condivise».
- ⚠️ Le cifre del Summit (–90%, 2×, –20%) restano **fuori**, come deciso dal panel del 12 nov, finché l'account Unipol non conferma per iscritto che si possono citare.

**Gate al 14 nov:**
- `audit:deck` senza HARD su tutte le rotte a 1280, 1440 e 1920;
- a capo puliti e taglio «In dieci minuti» allineato;
- `audit:docs` OK.

**Panel non rilanciato:** lo stato del 14 cambia struttura e copia del capitolo 03. È il P0 nella Parte 2.

**La slide di attribuzione come pannello di CJA** (`8221d4d`, 14 nov). È un pannello di Customer Journey Analytics «Attribuzione · Mutuo prima casa», con il selettore **Ultimo clic | Algoritmico**. Primo ↓: la firma va quasi tutta alla filiale, il digitale pesa il 20%. Secondo ↓: stesso dato, il digitale pesa il 66%. Il selettore si gira anche a mano. La misura è quella delle altre slide del capitolo, come chiesto dall'owner: titolo, fila delle capacità, una riga, una figura, due passi. Via «Filiale non misurata»: dentro CJA la filiale c'è in tutti e due i modelli. Le quote stanno in `data/attribuzione.ts` e le legge anche il mock del momento 07. Cifre di esempio, dichiarate.

**Le cifre Unipol del Summit (–90%, 2×, –20%): verificate il 14 nov, restano fuori.**
- Stanno nella slide 20 del deck in `docs/Unipol`, che è la **prima bozza** del referente del cliente (24 mar 2026), non il deck proiettato. Quello è stato riversato nel template del Summit e non l'abbiamo.
- Nella trascrizione della sessione (CP16, Community Pavilion, 21 apr 2026) **nessuno le dice**: sul palco i risultati sono solo qualitativi.
- Nessuna registrazione pubblica e nessuna customer story pubblica. La customer story è appena partita con il marketing Adobe, e le cifre passerebbero da lì.
- Da chiedere all'AE: il deck proiettato, oppure il via libera scritto del cliente.
