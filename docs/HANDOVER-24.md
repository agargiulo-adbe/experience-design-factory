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

## 42.19 Storia di Intesa · il 16 novembre, le due call interne: il «Come funziona» in overlay, la modalità presentatore e la versione breve

Tre commit su `main`, tutti pubblicati: `236ec7e` (call delle 12:20), `0ef369b` (le carte si girano anche nelle finestre basse) e `d3fa399` (call delle 16:00 e la rifinitura della sera). Le decisioni sono dell'owner, punto per punto, sulle trascrizioni lette riga per riga.

**Ipotesi di lavoro dichiarate in slide.** Il **codice pratica** nasce alla simulazione, quando Giulia lascia l'email, e si riconcilia con l'**NDG** che il core banking emette alla firma. È un'**assunzione** e la slide lo dice («Ipotesi di lavoro» nel grafo delle identità di `slide-chiave`). Il **look-alike** passa da Real-Time Activation, con un'icona propria (`Segno k="simili"`). La carta di CJA porta «clienti» e «non‑clienti». L'attribuzione diventa una capacità più larga della firma: «Quanto vale ogni canale, anche in filiale».

**Il flusso fra i punti di contatto (`slide-flusso`, `data/flusso.ts`).** È un Sankey canale di contatto → canale di interazione → esito, proposto dal referente analytics e ridisegnato nel linguaggio del deck. ⚠️ Le larghezze sono di esempio e la slide lo dice.

**Il «Come funziona» unico, in overlay.** La storia `scena="e2e"` (11 passi, `Meccanismo.astro` + `scripts/meccanismi.ts`, palco 1600×720) si apre dal bottone «▶ Come funziona · dall'annuncio alla firma» sul bordo della cornice di Experience Platform. Non ha più una slide propria, non ha didascalia in basso, e all'ultimo passo porta a «Quattro domande» (`#slide-cja-banca`). Dettagli:
- la colonna «Canali · quello che vede Giulia» è in blu notte, per staccarsi dal verde della banca;
- le colonne stanno dentro i margini del palco (colonna destra 1214→1576);
- le pillole in volo (`viaggia`) si leggono in tre tempi: 0,6 s ferme alla partenza, 1,3 s di volo, 1,4 s posate all'arrivo. Il `'>'` di chi chiama resta l'arrivo, così la destinazione reagisce mentre la pillola è ancora lì.

**Modalità presentatore (`components/ModoRelatore.astro`).** Il tasto G apre «Vai a…»: filtro, riserve nel percorso (sessionStorage `edf:riserve:<slug>`) e un Piano B sulla versione breve. Le slide `data-riserva` escono dal conteggio del motore finché non si accendono.

**Versione breve.** Si chiama «In breve» (`dieci-minuti.astro`, le griglie `slide-prima` e `slide-dopo`) e ha un bottone fisso a destra nella barra (`Navigation.astro`, solo da `lg` in su). Il titolo del giro viene da una fonte sola (`TITOLO_GIRO`), così `audit:taglio` resta ALLINEATO.

**Video e Coworker.** Il player di Dynamic Media sta nella pagina con `isLetterBoxed: true`, perché l'iframe `/play` ritagliava il video a schermo intero. Ci sono sette segnalibri, da «Coworker e le sue personalizzazioni» a «In Journey Optimizer». Il titolo del capitolo, dopo l'analisi del video (che va da un'analisi a un'azione), è «Dall'analisi all'azione, in una conversazione sola».

**Marchio Adobe.** Una classe sola, `.adb-tile`: tessera rossa `#EB1000` con la «A» bianca. Sta nella barra di ogni mockup dei sette momenti, nel riquadro «Prodotto Adobe», nelle schede brevi e nelle testate delle tre colonne del «Come funziona».

**Altro:**
- i flussi di Journey Optimizer dei momenti 05-06 si costruiscono passo per passo (`--i`, `--j` in `MockAdobe.astro`);
- la chat del momento 01 parte da sé quando entra la riga;
- il momento 07 diventa «Tre settimane dopo · Apre l'app della banca»;
- «Referenze» prende il posto del capitolo dei risultati;
- nei Prossimi passi entra «Che cosa approfondiamo, e in che ordine?», mentre «da voi» e «fasi» passano a riserva.

**Margini, la sonda che serve.** `audit:deck` non vede il testo che tocca il bordo della sua scatola. È servita una sonda di sessione: testo a meno di 3 px dal bordo, scatole che escono dalla madre, su tutte le slide con i passi aperti e passo per passo nel «Come funziona». Ha trovato la colonna canali fuori di 12 px, «profilo» sul bordo, le visite di Giulia 19 px oltre il fondo e il rango «1» sopra «appuntamento». ⚠️ **Trappola:** la slide attiva **non** porta `aria-hidden="false"`; senza, la sonda dà zero rilievi su una pagina che non ha guardato.

**Gate a fine giro:**
- typecheck: 0 errori;
- `audit:wrap`: PULITO;
- `audit:taglio`: ALLINEATO;
- `audit:deck`: invariato rispetto al pre-esistente (messa-a-terra 21, momenti 25, coworker 6; famiglie `a` e `i`).

⚠️ **Panel non rifatto su questo stato** (P0 nella Parte 2).

## 42.20 Storia di Intesa · il 17 novembre, i fili di Journey Optimizer, i bottoni sempre cliccabili, «In breve» spento

Quattro richieste dell'owner, in `/impeccable`, tutte pubblicate (`7440366`, `3a1d494`, `d90a27b`, `6020d8c`).

**I flussi di Journey Optimizer nei mockup dei momenti** (`components/MockAdobe.astro`, blocco in fondo a `styles/global.css`, `7440366`).
- I fili andavano da centro a centro dell'icona e ci passavano **sopra**; ora vanno da bordo a bordo (icona 2.5rem: `right: calc(50% + 1.25rem)`).
- Nel momento 05 i tre canali erano impilati sotto «Email», senza filo. Ora da «Ha ripreso?» parte un **tronco** verticale, ogni canale ha il suo ramo, e **il canale di mezzo sta sulla linea del flusso**: simmetria misurata a 1280, 1440, 1920 e 2560 (centri a ±74 px a 1440).
- Come si regge: con `:has(> .im-aj-rami)` le etichette del flusso principale pendono in `absolute` sotto l'icona, così il centro del nodo È il centro dell'icona e `align-items: center` allinea il flusso al centro dei rami (righe `1fr`). Il filo verso il tronco è il `::after` **dei rami**, che va a sinistra: un `::after` che esce a destra dal nodo faceva salire `audit:deck` momenti da 25 a 28 (check `c`, `scrollWidth`).
- La costruzione passo per passo continua: filo, tronco che si apre dal centro (`im-aj-tronco`), rami. «Attesa 12&nbsp;ore» legato.
- ⚠️ L'owner ha visto «lo stesso problema» sul flusso del momento 06 dopo la correzione: era la versione non ancora pubblicata. La regola vale per ogni `.im-aj-tela`.

**I bottoni sul bordo della mappa** (`slide-innesto`, `3a1d494`). Richiesta: «tutti i bottoni, Adobe Experience Platform e Come entrano i dati compresi, cliccabili in qualunque momento».
- Prima, aprendo i servizi comuni, «Come entrano i dati» e «Come funziona» andavano in `visibility: hidden`; aprendo «Come entrano i dati», «Come funziona» poteva sparire (`data-funziona-via`). Erano regole scritte apposta, ora tolte.
- Sul bordo i tre pezzi interi non stanno a nessuna finestra (a 1440: 1378 px su 1267). Quindi `bordo()` in `messa-a-terra.astro` **misura** e accorcia chi non è aperto, un passo alla volta: sottotitolo di «Come funziona» → icone di «Come entrano i dati» → intestazione «Servizi comuni» → «Come funziona» col solo ▶ (nome per screen reader). La fascia si ferma 14 px prima di «Come funziona» (`--svc-fine`). Si ricalcola al resize.
- Verifica: cliccati davvero a 1280×720, 1280×800, 1440, 1920 e 2560, in cinque stati. Le carte non ancora comparse e le pillole sul retro di una carta chiusa restano non cliccabili, ed è voluto.

**`HowItWorks` nel motore** (`packages/core/src/blocks/HowItWorks.astro`, `d90a27b`). Il bottone era un `inline-flex`: andando a capo il testo prendeva tutta la riga e la freccia restava sola sul bordo destro («Come possono evolvere le iniziative» a 1280). Ora è testo che scorre, con l'ultima parola legata alla freccia, e un articolo o una preposizione di tre lettere al massimo viaggia con lei. **Delta misurato**: 81 bottoni di otto experience, vecchio contro nuovo, a tre finestre; unica differenza il link di Intesa a 1280 (freccia da +138 a +9 px).
- Una sonda di code staccate su tutto il deck Intesa ha trovato altri sei casi, tutti voluti: il › della barra «Simula la rata», l'icona «rispondi» dell'email, le frecce di collegamento delle carte.

**«In breve» spento** (`6020d8c`, owner: «depubblica il bottone In breve; lo rivediamo dopo»). `IN_BREVE = false` in `Navigation.astro`. La pagina `/dieci-minuti/` resta, dal link diretto e dal Piano B della modalità presentatore.

**Gate**: typecheck 0 errori; `audit:wrap` PULITO; `audit:taglio` ALLINEATO; `audit:deck` messa-a-terra 21 e momenti 25, come prima; approfondimenti 52, tutti `a` e `i`, senza un conteggio di partenza con cui confrontarlo.

⚠️ **Panel non rifatto su questo stato** (P0 nella Parte 2).

## 42.21 Storia di Intesa · il 17 novembre pomeriggio, il Sankey trascinabile, l'attribuzione per il Controllo di Gestione, i Prossimi passi dai temi di oggi

Dopo la call interna delle 10 (trascrizione Plaud letta riga per riga, orari Plaud in UTC: 09:13 UTC = 10:13) e una serie di richieste dell'owner in `/impeccable`. Tutto su `main` e pubblicato: due branch locali (`locale/sankey-prodotto`, `locale/attribuzione`) uniti senza conflitti in `c8c886e` e `833247a`, poi cancellati; ultimo `3fea4ff`.

**Il Sankey dei punti di contatto** (`slide-flusso`, `messa-a-terra.astro` + `styles/innesto.css`; `18d401e`, `e742782`, `9e3ee51`, `4cbfa73`).
- Si ridisegna **trascinando una dimensione** («Prodotto») sulla colonna di mezzo, come in CJA. La dimostrazione automatica dura 2400 ms in cinque battute (presa, sosta, volo, sosta sulla colonna, rilascio); la zona si accende dopo 1600 ms, poi `vai('prodotto', true, 1600)`.
- Il ridisegno era troppo rapido per la sala: ora `vai(nuova, anima, dur=1300)` mette `data-cambia`, aspetta 350 ms e anima; le etichette centrali spariscono durante il cambio, così non restano sopra i rettangoli sbagliati.
- La fascia sotto il grafico (`.im-flu-banda`, sostituisce `.im-flu-note`) porta didascalia del passo e bottoni delle dimensioni; i passi 2 e 3 sono esclusivi (`:has(p2):not(:has(p3))`), perché una regola del giro prima (`e742782`) (`visibility:visible` su ogni nota) li faceva sovrapporre. Corpo alzato a `clamp(1.1rem, 1.12vu, 2.4rem)`, fondo verde tenue.
- **Sotto i 780 px di altezza** (1280×720) la banda finiva sotto i comandi del deck (109 px di scorrimento, preesistente): gradino dedicato, e le etichette di mezzo passano accanto alle barre (`--yc`), invece di schiacciarsi. Specificità su `#slide-flusso`.

**L'attribuzione chiude sul risultato** (`slide-attribuzione`, `833247a`). Sottotitolo per il Controllo di Gestione («quanto pesa il digitale sulle vendite che si firmano in filiale. Esempio: il mutuo.»). Al posto della nota, un esito in due cifre: **20%** con l'ultimo clic, che dà la firma alla filiale, poi **66%** con il modello algoritmico sugli stessi dati; chiusa «due terzi delle firme, non un quinto… la filiale non perde niente». Nota del relatore con il ponte dal Sankey. Il selettore del modello funziona anche online: in call il problema era il tasto → che salta la slide (↓/spazio apre il passo).

**I Prossimi passi ripartono dai temi di oggi** (`prossimi-passi.astro` + blocco `.im-ins-*` in `global.css`; `121f986`, `3fea4ff`). Titolo **«Da dove vi piacerebbe ripartire?»**, sottotitolo aperto al confronto (owner: «meno direttivo»). Cinque temi colorati con la tassonomia del cerchio di Giulia (`--blk-*`: trovare, contenuto, engagement, piattaforma tratteggiata), ognuno con prodotto e link alla slide dove se n'è parlato; un tocco li numera in ordine di priorità (`aria-pressed`). Il tema di analisi si chiama **Customer Journey Analytics** (in sala è il nome sentito), con «CX Analytics» come etichetta del gruppo. Sotto, «Alcuni modi per approfondirli»: sei formati senza riquadri. Sotto i 780 px spariscono prodotti e descrizioni.

**I loghi sulle Referenze** (`121f986`, decisione dell'owner). `MarchioRef.astro` usa l'SVG ufficiale se c'è in `src/assets/loghi/`: TSB, Santander (versione positiva di santander.co.uk, perché quella del gruppo è bianca), Crédit Agricole, Unipol. Unipol esiste solo in negativo e si posa su una piastra del suo navy `#001c35`, mai ricolorato. Fonti in `loghi/LEGGIMI.md`; il permesso d'uso si verifica con l'account team, e l'esito non va nel repo.

**Gate** sul `main` unito: `astro check` 0 errori; `audit:deck` messa-a-terra 21, risultati 15, prossimi-passi 7, tutti `a`/`i`; `audit:wrap` PULITO; `audit:taglio` ALLINEATO; `audit:docs` PULITO; fotogrammi a 1440×900 e 1280×720.

⚠️ **Resta**: la slide di attribuzione scorre di 128 px a 1280×720 (preesistente, il pannello a sinistra); panel non rifatto su questo stato (P0 nella Parte 2).

## 44. InSalute Servizi «Dalla parte dell'assicurato» (Prospettiva, 24 novembre) · e il motore che replica un deck HTML in PowerPoint

Nata il **17 nov 2026** dal dossier gated su InSalute Servizi (§11, voce del 15 nov), per il primo incontro con il gestore delle prestazioni sanitarie della Divisione Insurance di Intesa Sanpaolo: **martedì 24 nov**, un'ora. Check interno **lunedì 23**. Il team Adobe ha chiesto la PPT **prima di venerdì 20**, per lavorarci sopra in condiviso. ⚠️ **Niente è committato** al momento di questa voce.

**Che cos'è.** `apps/insalute-assicurato`, tipo **Prospettiva**, IT. La pelle è quella di `intesa-esperienza-cliente` (template, tipo e movimento li ha chiesti l'owner): il `src` è copiato dal suo HEAD e poi sfrondato (via le pagine, i componenti dei meccanismi, `innesto.css`, `pop.css`, i dati e tutte le immagini generate). Ricolorata sul **marchio InSalute**: blu `#4c6aac` letto dalla pagina resa, perché il CSS di produzione è il Bootstrap di default di Liferay e `brand:tokens` non lo vede; Open Sans; logo PNG ufficiale usato come maschera su `currentColor` (`CoBrand.astro`, `.ins-marchio`). Stili propri in `src/styles/insalute.css`, importato in testa a `global.css`.

**Quattro capitoli, 17 slide** (`src/data/chapters.ts`, `slides.ts`):
1. **Adobe, chi siamo** — i **tre** Adobe in sala (scelta dell'owner: non la patch intera), i Forrester Wave, le quattro funzioni di CX Enterprise. Il capitolo ripete quello del deck Intesa.
2. **Chi l'ha già fatto** — **Inail** (200+ moduli WCAG 2.1 AA, **98%** di recapito su oltre 135.000 comunicazioni, prima PA italiana su AEM Forms; il 99% di un deck interno perde contro la pagina pubblica) e **CSS**, assicuratore malattia svizzero (da una giornata a un'ora per una newsletter, +570% di polizze online). CSS è **del 2020**, e la slide lo dichiara: una storia europea recente di assicurazione salute su AEP o AJO non risulta pubblicata. Il «riprendere da dove ci si era fermati» di CSS riguarda la **sottoscrizione**, non i rimborsi. Fonti aperte con Playwright il 17 nov (`src/data/referenze.ts`).
3. **Tre idee da discutere** — il rimborso visto da chi lo chiede, che cosa rispondono di loro gli assistenti AI (Brand Visibility: solo i cinque motori coperti), moduli e comunicazioni già approvati. Ognuna chiude con **una domanda**, e porta un confine dichiarato: **niente dati sanitari in AEP** in Europa.
4. **Partiamo da voi** — sei domande di discovery, tre passi possibili a scelta loro, la firma.

Fuori per decisione dell'owner: un tema infrastrutturale che resta fuori perimetro (non si cita), e **nessun paragone con altri assicuratori**. Una referenza assicurativa italiana era stata proposta e poi tolta dopo l'avviso sul paragone.

**Il motore di replica** (nuovo, riusabile su ogni deck della Factory). `deck:pptx` produce solo immagini; qui serviva un file che il team modificasse.
- `pnpm deck:replica --app <alias> --out <dir>` (`scripts/deck-replica.ts`, con `DECK_URL` = origin della preview) — Playwright a 1920×1080 ×2, reducedMotion, `__edfDeck.goTo(k)` su ogni slide. Legge **box** (fondo pieno o bordi, punti del `clip-path`), **testo** a runs (corpo, peso, colore, spaziatura, link, maiuscole), gli **a capo misurati per carattere** con Range, la centratura dei contenitori grid/flex, le immagini, e i **gruppi d'animazione** da `[data-reveal]` e dai figli di `[data-stagger]`. Lo sfondo esce **svuotato** (testo trasparente, box e immagini nascosti), le note arrivano da `src/data/relatore.ts`.
- `pnpm deck:replica:pptx <dir> <out.pptx>` (`scripts/pptx/replica.py`, `uv run --with python-pptx`) — 1 px = 6350 EMU, corpo a 0,5 pt per px, interlinea esatta, forme senza l'ombra del tema, link solo esterni col colore del testo (`hlinkClr`), comparse in dissolvenza **in automatico** (non a clic), transizione di slide, note del relatore.
- Esito su InSalute: 17 slide, **210 caselle di testo native**, animazioni sulle slide di contenuto, note su tutte; guardato reso da PowerPoint stesso (export PDF via AppleScript). Il file sta in `docs/Intesa Sanpaolo/InSalute/` (git-ignorato).
- Limiti: Open Sans arriva come **font cloud** di Office (senza, gli a capo cambiano); sfumature e filetti restano nello sfondo come immagine; una rigenerazione sovrascrive le modifiche fatte in PowerPoint.
- Nota: questo deck sta sulla pelle **del cliente**, quindi il `.pptx` è una replica dell'HTML e **non** il template di Brand Center (scelta dell'owner, coerente con «un artefatto, un design system»).

**Gate** (17 nov): `copy-audit` 0/0, `audit:wrap` PULITO, `audit:deck` **0 HARD** (44 SOFT di posizione/copertura su copertina, divisori e firma, ariosi per scelta), `audit:ink` PULITO, `audit:fonti` 0 HARD (i link business.adobe.com si aprono a mano; Inail e CSS aperti), `audit:docs` PULITO.

⚠️ **Resta**: panel mai lanciato; commit; seed `0039` non applicato; `.pptx` da depositare nella cartella Teams; riga in CLAUDE.md «Experiences today» (la scrive l'owner). Backlog nella Parte 2.
