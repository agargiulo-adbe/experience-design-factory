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
- Al passo dell'email l'evento 02 si **ricuce all'indietro**: «sconosciuta» diventa «Giulia *Stitching*» con sotto «la visita di prima passa al suo profilo» (dal 15 nov; prima era «Giulia · ricucita all'indietro», bocciato dall'owner).
- La barra dice «Cliente da oggi: la storia si legge in CJA». La nota dice: «Un PC condiviso in famiglia non fonde due persone: l'NDG è unico nel grafo, e ogni visita autenticata resta associata a chi l'ha fatta.» Dal 15 nov è un riquadro (filo bianco a sinistra, corpo ~1 vu, peso 600): prima era quasi invisibile.
- Verificato su Fluffy:
  - Lo stitching di CJA può essere per campo o per grafo, e il replay riattribuisce gli eventi anonimi precedenti.
  - Il lookback va da 1 giorno (replay giornaliero) a 7, 14 o 30 giorni (settimanale), secondo il pacchetto; il backfill è di 13 o 25 mesi.
  - Le Linking Rules del grafo: con un namespace unico, un dispositivo condiviso non fa collassare il grafo. Gli eventi anonimi vanno all'ultimo utente autenticato, quelli autenticati restano alla loro persona.

**Le altre slide.**
- **Attribuzione:** lead «Per il Controllo di Gestione: quanto ogni canale digitale porta in filiale, fino alla firma e quanto pesa il canale fisico.» (parole dell'owner, 15 nov; prima «…, e quanto vale…»).
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

**La rifinitura del 15 nov, per la sala ibrida** (`497bdc2`, `6a2fab0`, `a5676b1`, tutti su `main`, CI e deploy verdi). La stanza del 19 è un grande schermo in sala più chi è collegato da Teams: quello che a 1440 si legge, a distanza no.
- **Il giro di Giulia** (`CircoloJourney.astro`, `global.css`): i sette cerchi e i loro numeri crescono con `--vu` (`.im-cer--ampio`), invece di fermarsi al minimo del `clamp`. Un tentativo con ETI 42 mandava a capo «AI Decisioning» ed è stato tolto. I nomi di prodotto dopo il primo sono `inline-block`, così «AI Decisioning» non si spezza; il primo resta testo semplice, perché due blocchi impilati facevano scattare il check `g` sull'ultrawide.
- **L'innesto** (`innesto.css`): le quattro etichette delle cornici («Come entrano i dati», «Servizi comuni», le due legende) passano da 14 a ~20 px a 1920, le pillole delle carte da 14 a ~18. Sopra i 1530 px la pillola della persona sta sulla prima riga e le due campagne sulla seconda. ⚠️ **Tutto dentro `@media (min-height: 941px)`**: a 1440×900 anche un pixel in più portava il titolo fuori dall'area sicura (79 px). Sotto quell'altezza non cambia niente.
- **L'attribuzione:** «Dalla filiale entrano appuntamenti, richieste firmate, tempo alla delibera» non sta più in una colonna a parte, dove non si capiva quando leggerla: è sotto la riga Filiale del pannello e compare con le barre. A 1280 il selettore resta accanto al titolo del pannello (era il titolo a 73 px), e «dati di esempio» non va a capo a metà.
- **`slide-chiave`:** a `max-height: 920px` nota e barra si compattano, perché il riquadro nuovo portava il titolo a 77 px a 1280 e 1440.

**Gate al 15 nov:** `audit:deck` senza HARD su Giulia, innesto, attribuzione, chiave e «In dieci minuti», anche `--ultrawide`; `astro check`, a capo, taglio e `content-audit` puliti. **Panel non rilanciato:** sono modifiche di forma e di copia corta sopra lo stato del 14, che il panel già non copriva; il P0 resta uno.

## 42.18 Storia di Intesa · il 15-16 novembre, i «Come funziona» animati: prima in 3D, poi in 2D, dietro un interruttore

**Il vincolo dell'owner, da rispettare in ogni giro:** la variante sta **sempre** dietro `?pop3d=1` e il deck principale **non si tocca**. Verificato in pagina, pop-in per pop-in: senza parametro, didascalie e scene sono quelle di prima, e `audit:deck` su `messa-a-terra` dà le stesse 22 segnalazioni (famiglia `a`, posizione dei titoli) che dava **prima** di questi commit — non sono nostre, ma restano da guardare prima del 19.

**L'interruttore** (`layouts/BaseLayout.astro`, come `domande`): `?pop3d=1` → meccanismi 2D · `?pop3d=video` → clip Blender · `?pop3d=0` → scene HTML. Resta in localStorage (`edf:pop3d:<slug>`); dalla console `__imPop3d(true | 'video' | false)`, che vince sul parametro dell'indirizzo.

**Il 3D (15-16 nov, `b9b2d29`, `1e2d79b`, `8bf79fc`, `4b57f03`).** `pnpm render:3d` rende scene Blender senza interfaccia nei colori dell'app (`scripts/3d/`, skill `factory-3d`): `rta`, `decisioning`, `cja` a passi, con le etichette in HTML ancorate alle coordinate che Blender calcola, più `genstudio` (palette dello showcase). Le clip stanno in `public/media/3d/` con `provenance.3d.json`. Report di ricerca sui canali che spiegano bene: `docs/Factory/reports/Spiegare concetti complessi in video.md` (git-ignorato).

**Perché poi il 2D (16 nov, `8c42831`).** Il confronto sullo stesso passo ha dato ragione al 2D per i meccanismi: il testo sta dentro gli oggetti (in 3D le etichette sospese si scontravano e restavano piccole), niente prospettiva, e gli oggetti sono **quelli del deck** — la finestra del sito del momento 03, la scheda Adobe col quadratino arancio, i sistemi di oggi a contorno. ⚠️ Il 3D aveva la grammatica dei colori **rovesciata**: verde = Adobe, mentre qui il verde è Intesa e Adobe è l'arancio `#fa9600`. Vestire il 3D con texture non risolve: in assonometria il testo arriva inclinato. Verdetto e grammatica in `skills/factory-3d/SKILL.md` e nella memoria `meccanismo-in-2d`.

**Come è fatto.** `components/Meccanismo.astro` (le tre scene su un palco 1600×720 che scala intero) + `scripts/meccanismi.ts` (una timeline GSAP per scena, un'etichetta per passo, caricato solo a interruttore acceso). Il gesto ricorrente è il **volo**: una pillola con un nome parte dalla fonte e si posa nel posto che la aspetta, misurato sul layout vero. I testi della sola variante stanno in `data/pop.ts` sotto **`v2d`** (`cosa`, `passi`; `null` = come il main). Tre trappole silenziose: `dialog.pp p` batte una classe sola (le regole sono `.mc .mc-x`); `scale(k) translate(-50%,-50%)` in quest'ordine; un passo comincia a `T.duration()`, non a `'>'`, e il tratto in corsa si uccide prima di un «Indietro».

**Panel, due giri** (sei personas del 19 nov, verdetti `docs/Intesa Sanpaolo/PANEL-VERDICT-2026-11-16-round1.md` e `-round2.md`, `⚠️ DERIVED PERSONAS` per il seggio Group Technology). Medie per asse, giro 1 → giro 2: credibilità **2,7 → 3,8** · rilevanza 3,0 → 3,3 · chiarezza 3,7 → 3,8 · rischio **2,2 → 3,0** · azionabilità **2,3 → 3,3**. Tutte e sei preferiscono la variante allo schema; «non toccare»: il profilo «senza nome» che diventa Giulia, e le esclusioni barrate col motivo.
- Applicato (`dfded25`, `288bfa4`): CJA **legge** i dati, non li raccoglie; score ed eleggibilità sul non cliente «solo se esistono», con il sistema dell'eleggibilità da confermare (due nostre fonti sono in conflitto: core banking o motore); la proposta scelta resta in lista; il CRM «integrazione da definire in fase 0»; «Capacità di Adobe Real-Time CDP» nel sottotitolo di RTA; consenso ai cookie al passo 1; ritorno «entro un giorno» (l'edge non copre oltre); chiave comune come scelta di fase 0; origine su ogni pillola di CJA; media a pagamento nel percorso; nessun canale evidenziato nell'attribuzione; indirizzo della pagina mutui corretto (`/mutui` dava 404).
- **Non applicato, decisioni dell'owner** (P1 nella Parte 2): le note tecniche e i link tolti il 13 nov; Adobe Analytics nella colonna di CJA; il nome «Real-Time Activation»; quale versione circola dopo il 19.
- ⚠️ **Il main ha ancora due frasi smentite** («CJA raccoglie…», «il lead arriva nel CRM di filiale»): P0 nella Parte 2.
- ⚠️ Il pacchetto d'evidenza ha catturato in `content/` le didascalie **del main** (lo script leggeva il primo `.pp-d.pp-on`); gli screenshot erano giusti. Da correggere nello script prima di un altro giro.

**GenStudio in 2D**, fuori dal deck: `docs/Factory/3d/factory-showcase/genstudio-2d.html` (git-ignorato), sette passi sul flusso di Experience League, con Activate che consegna al canale **spento**.
