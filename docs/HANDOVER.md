# HANDOVER — Experience Design Factory

> Documento di passaggio di consegne. Stato al **2026-11-13**.
> Lingua: italiano per la narrativa, inglese per path/comandi/nomi prodotto.
> Companion di `CLAUDE.md` (guida agente, sempre valida) e delle memorie in
> `~/.claude/projects/.../memory/`. Se una cosa qui contraddice il codice, **vince il codice** —
> segnalalo e aggiorna questo file.
>
> **Nuova sessione CC:** l'indice/ordine di lettura è in `docs/README.md`. Leggere **tutti** i
> `.md` costa ~40k token su 23 parti (ok). **Non** aprire mai i `.pptx`/`.mp4` in `docs/` (binari giganti,
> git-ignored, non presenti in un clone pulito) — i fatti utili sono già distillati qui (§5.3).
>
> 🏦 **Il 13 novembre la Storia di Intesa passa un giorno di revisione con l'owner** (§42.16, Parte 19 · change log, Parte 3): deck in `--vu` per gli schermi 21:9 e `audit:deck --ultrawide`, nomi dei capitoli di prima, capitolo 01 e schema d'integrazione ridisegnati, verifiche su Fluffy. Tutto su `feat/intesa-check-referente` (`c7f12c4`), **non su `main`**, e il panel non copre lo stato nuovo: P0 in Parte 2.
>
> 🚄 **Il 12 novembre nasce «Ciascuno conta»** (`apps/trenitalia-ciascuno-conta`, §43, Parte 23 · change log, Parte 3): la versione interna del percorso dopo la Direzione Sales, pubblicata con strato riservato gated. La sera è riprogettata per il leadership team come **deck a due livelli**: pubblico leggibile dal cliente, strato interno da Supabase con il token del dossier. Resta il panel (P0).
>
> 🏦 **L'11 novembre la Storia di Intesa passa due giri di panel, poi una mattina di copia, agenda a sei voci e Prossimi passi in due slide (tutto pubblicato, fino a `2e3dd73`; ⚠️ i giri dopo il panel non sono coperti: P0)** (§42.14, Parte 19 · change log, Parte 3). Rilevanza da 3,5 a 4,0 e rischio da 3,17 a 3,67. L'innesto non disegna più una sostituzione, la chiusura è diventata una proposta e la Web Analytics è entrata nel capitolo 04. Ci sono tre slide nuove, e il taglio corto ora porta l'innesto. ⚠️ **Restano al cliente e all'AE, prima del 17**: la CDP attuale, il nome del motore, i mesi al primo invio, la forma della fase 0 e della licenza, l'uscita di Coworker e le slide davanti. Sono il P0 in testa alla Parte 2.
>
> 🏦 **La sera del 10 novembre la Storia di Intesa chiude «Dove ci innestiamo» a sei slide, trova una scala tipografica sola, e porta la rotta delle campagne** (§42.13, Parte 19 · change log, Parte 3). Sei commit, da `7a43b22` a `685832b`, **tutti pubblicati**. Tolte «unifica» e «motore»; «AI Decisioning» ovunque; «Quattro domande a cui CJA risponde» con un disegno per meccanismo. Sette misure di titolo diventano una (≈48 px a 1920). La proposta esclusa di AI Decisioning cambia ragione: lo sconto under 36 non reggeva, perché **Giulia ha 34 anni e ne ha diritto**. Sotto lo schema dell'innesto una **rotta in tre fasi** verso Journey Optimizer (le *orchestrated campaigns* sono documentate da ago 2025): alla terza il riquadro «Campagne» si spegne, e lo strumento di oggi non si nomina. ⚠️ **Il panel è fermo al 30 ottobre e il check col referente è l'11 nov alle 14:15**: è il P0 in testa alla Parte 2.
>
> 🏦 **Il 10 novembre la Storia di Intesa porta «CX Analytics» dentro «Dove ci innestiamo», a tre componenti, e lo Scenario su un dato vero** (§42.12, Parte 18). **Pubblicato** (`cb4bdea`), ma ⚠️ **panel fermo al 30 ott**: è il P0 Intesa in testa alla Parte 2, da chiudere prima del check col referente dell'11 nov alle 14:15. Stanza il 19.
>
> 🚄 **Il 10 novembre la Prospettiva Sales cambia dopo il dry run** (§37.18-20, Parte 19): agenzie come lettura di una campagna su tutti i canali, slide delle tre misure spenta, registrati riconosciuti con CJA, mappa in chiusura a righe. ⚠️ Panel fermo al 9 nov; online era indietro alle 14:27.
>
> 🚄 **La sera del 9 novembre la Prospettiva Sales passa da 38 a 25 slide, dopo due call di revisione** (change log, Parte 3): personalizzazione al posto dell'intermodale, agenzie come ipotesi, roadmap a cinque fasi, design unificato. ⚠️ **Niente è committato e il panel non lo copre, e la stanza è il 10 novembre alle 14:30**: i due P0 in testa alla Parte 2.
>
> 🚄 **Il 9 novembre la Prospettiva Sales cambia registro su tutto il deck, e prende una slide nuova —
> e niente di questo è committato** (change log 2026-11-09, Parte 3 · §37, Parte 16). ~40 stringhe
> riscritte con un movimento solo: l'affermazione sul cliente diventa domanda o constatazione.
> L'**ask** è il caso che conta — «Confermate la rotta, e portateci al tavolo.» diventa «Una conferma
> sulla rotta, e un posto al tavolo.» Entra **`slide-citta`**, la prima slide che parte da un lavoro
> loro: una proposta legata alla città di chi naviga, **con Adobe Target**, che **il team Trenitalia ha
> costruito e pubblicato in autonomia dopo la formazione** — con FS Technology e Adobe Ultimate Success
> in fonte, e **nessun risultato in slide, per scelta**. Nel motore della slide-idea la colonna destra
> passa a **`data-substep`**: si scopre a mano, chi parla decide quando si legge. ⚠️ **Il working tree
> ha 14 file modificati e la stanza è il 10 novembre**: quello che è in rete è ancora lo stato del 7,
> e il panel del 6 non copre né il registro nuovo né la slide nuova. Sono i **due P0 in testa alla
> Parte 2**.
>
> 🚄 **Il 6 novembre la Prospettiva Sales passa dal panel — due giri — e la sera l'ask cambia
> contro il verdetto** (change log 2026-11-06/07, Parte 3 · §37.16–37.17, Parte 16). Il panel
> era fermo al 12 ottobre con quattro riscritture da coprire: rischio 2,3 → **3,3**, rilevanza
> 2,8 → **3,7**, credibilità 3,2 → **3,7**. Entrano la slide che dice **dove ci innestiamo** —
> costruita sul comunicato del Gruppo, perché in 43 slide non compariva la piattaforma che hanno
> già scelto — e il **12.400** al posto dei 70.000 come cifra del capitolo sulle agenzie. ⚠️ **Due
> regressioni fatte dalle correzioni del primo giro**, una citazione fabbricata e un numero
> inventato: è la ragione per cui i giri sono due. Poi, la sera, **la mezza giornata sui dati
> esce dall'ask** per decisione dell'owner: era la voce che tutte e sei le personas avevano messo
> fra le «non toccare». Al suo posto tre cose che può dare solo lui. **Quelle due slide non le ha
> viste nessuna persona, e la stanza è il 10 novembre**: è il P0 in testa alla Parte 2.
>
> 🏦 **La notte fra il 6 e il 7 la Storia di Intesa fa i quattro giri di `/umanizza`** (change log
> 2026-11-06/07, Parte 3 · §42, Parte 18). Tre titoli che funzionavano per qualunque cliente,
> l'obiezione più dura della stanza promossa da riga di fonte a chiusa, i numeri dell'imbuto
> marcati «· illustrativo» perché si leggevano come numeri del cliente, e **un occhiello mai
> tradotto** che non vedeva nessun gate — si è visto guardando la slide nell'altra lingua. ⚠️ Il
> panel è del 30 ottobre e non copre niente di tutto questo.
>
> 🚄 **Il 6 novembre la Prospettiva Sales chiude il giro: i tre livelli, i quattro giri di
> `/umanizza`, e due regole nuove nel motore** (change log 2026-11-06, Parte 3 · §37.15, Parte 16).
> Sette commit. Entra il livello che mancava — **idea → capability → prodotto**, con lo stato di
> ogni prodotto letto dal contratto — perché i nomi Adobe stavano tutti dentro i drill-down, e il
> dry run l'aveva detto: «dove sta Adobe? Non l'ho vista». Girano **tutti e quattro** i giri di
> `/umanizza`: il Giro 3 ha riaperto **le due referenze che nessun gate riesce ad aprire** e ha
> trovato una deduzione nostra spacciata per fatto del cliente. Nel motore: **`gruppo` su
> `HowItWorks`** (due drill-down sulla stessa slide non stanno più aperti insieme — sfondavano di
> 105 px, e `exp` non lo vedeva perché ne apre uno per volta) e **lo zoom del deck**, opt-in e
> acceso **solo nel template**, quindi lo ereditano le experience nuove e non le attuali. Nuova
> pagina **`/relatore/`**, le note per chi presenta, linkata dalla console. ⚠️ **Il panel resta
> fermo al 12 ottobre e ora deve coprire QUATTRO riscritture, con la stanza il 10 novembre**: è il
> P0 in testa alla Parte 2, e a questo punto o si lancia o si mette agli atti.
> ⚠️ **Nuovo P1:** l'idea sul canale agenziale porta ora **Unipol** come referenza, ed è
> legittimo (hanno presentato pubblicamente due volte) — ma la loro customer story Adobe è in
> lavorazione e il thread va avvisato prima della sala.
>
> 🧭 **Il 5 novembre `/umanizza` passa a quattro giri** (change log 2026-11-05, Parte 3). Il giro
> di rielaborazione del testo fatto a mano il 4 novembre sulla Prospettiva Sales aveva una natura
> sua — non togliere marcatori, ma cambiare **che cosa la slide dice** — e adesso è il **Giro 0,
> il messaggio**, davanti ai tre esistenti. La conseguenza da sapere prima di riscrivere una
> copia: il vincolo **±10%** di lunghezza vale **dai Giri 1-3**, misurato sul testo uscito dal
> Giro 0, dove invece non c'è. Allineati i quattro punti che dicevano «tre giri» e «±10% sempre».
> 🔒 L'esempio nel comando è **inventato**: quello vero portava nome del cliente, copia di slide e
> dati della misura, e il repo è pubblico.
>
> 🚄 **Il 3 novembre la Prospettiva della Direzione Sales prende superficie — e un rilievo umano
> salva l'apertura concordata col cliente** (change log 2026-11-03, Parte 3 · §37, Parte 16). Cinque
> commit portano il deck **da 27 a 41 slide**: entra **lo strato XD** (copertina con l'agenda
> generata da `CHAPTERS`, quattro slide d'idea), rientrano **ventidue micro-figure** da un ramo
> fermo dal 27 ott, e l'**agenda di ogni capitolo** smette di essere scritta a mano. La regola che
> tiene insieme le due cose è nuova e BINDING: **XD e micro-diagrammi sono due registri** — l'XD è
> quello che si proietta, i micro-diagrammi quello che si apre dietro «Scopri come» — e **nessun
> gate lo misura**. ⚠️ Il difetto più grave della giornata l'ha trovato **una persona in revisione
> interna, non un check**: il capitolo 01 annunciava «Il 96% che resta» e la slide non c'era più,
> ma soprattutto **quella era l'apertura concordata col cliente nell'agenda mandata alla segreteria
> il 9 ottobre**. È tornata, con le due fonti tenute separate (il 96% è suo e verbatim; il 75%/4% è
> contesto e non gli si attribuisce). ⚠️ Tutti i gate sono verdi, ma il **panel resta fermo al 12
> ottobre**: ora deve coprire **tre** riscritture (P0 in testa alla Parte 2).
>
> 🟢 **La Factory è in rete, e per l'incontro Intesa ci sono DUE artefatti.** Il 30 ott il ramo è
> stato mergiato in `main` e il deploy è passato: **`apps/intesa-esperienza-cliente` «Adobe ×
> Intesa Sanpaolo»** (la **Storia**, nove capitoli e 41 slide — **§42, Parte 18**) e **Unipol
> «Cinque domande»** sono pubbliche. La Storia ha **inglobato il `.pptx` da 78 slide**
> dell'incontro: un artefatto invece di due, dopo che i due dicevano cose diverse su chi è Giulia.
> Lo slug è passato da `intesa-mutuo` a `intesa-esperienza-cliente` **prima** della
> pubblicazione (dodici stub di rimando coprono il vecchio indirizzo, che era già in rete).
> ✅ **Il panel è stato fatto sulla Storia** il 30 ott (due giri, sei stakeholder, tutti e cinque
> gli assi in salita, 16 P0 applicati — §42.8); le personas di quel tavolo sono scritte e servono
> anche al Blueprint, dove il panel **resta da fare**. ⚠️ **L'incontro è slittato al 19 novembre**
> e il 30 ott cinque colleghi hanno rivisto il documento: formato approvato, un dubbio dell'AE non
> ritirato, e quattro voci su cinque che chiedono gli approfondimenti fuori dalla storia (§42.9). ⚠️ Tre difetti sono stati trovati **mentre si pubblicava e non da un
> gate**: il `<title>` doppio che si vede solo incollando l'URL in chat, una prop usata e non
> dichiarata che teneva la **CI rossa**, e due slide che dichiaravano **Firefly sotto foto
> Pexels**. 🔒 Due pulizie di riservatezza: i sedici riferimenti per nome a un altro cliente
> Adobe sono usciti dai commenti del codice, e tre persone reali dal P0 di `HANDOVER-02.md`
> — ⚠️ resta il nome nel **messaggio di `f97ef53`** e nei diff storici (P1 nuovo: serve un
> force-push, decisione dell'owner).
>
> ⚠️ **La stanza Intesa è giovedì 19 novembre, 11:00–13:00** (Teams + sala VDC P20 sud, 27
> persone), spostata due volte dal cliente; l'**11 nov alle 14:15** c'è il check del documento
> **con il referente**, ed è lì che si concordano le slide da proiettare. La stanza del 22 si è tenuta ed è andata bene — il cliente ha proposto lui tre
> pilastri e ha detto che sta decidendo come procedere. Per il 5 è nata un'experience nuova,
> **`apps/intesa-innesto` «Dove ci innestiamo»** (23 slide, §40, Parte 18), con un **dossier
> interno bilingue** gated per i colleghi che ci vanno. ⚠️ **Il panel non è mai stato lanciato
> né su questa né su «Su scala umana»**: sono i due P0 in testa al backlog (Parte 2), e il
> secondo è il più vecchio. Il pubblico del 5 è un altro — chi costruisce i target e il suo
> capo, che possiede CRM e Adobe Analytics — quindi **le personas del panel vanno scritte**:
> quelle esistenti coprono la stanza del 22.
>
> 🧩 **Il 24 ottobre la regola «ancore, non prosa» si è chiusa dove era rimasta a metà**: il
> «Scopri come» si apre su **figure**, non su paragrafi (`Dettaglio` + `DettaglioVoce` nel
> motore, §40 e change log in Parte 3). Nello stesso giro sono nati **`pnpm deck:catalogo`** e
> **`pnpm audit:ritmo`**, dopo aver misurato che **26 slide su 213 di tutti i deck portano un
> elemento visivo** mentre il motore ha 30 blocchi e 11 scene mai aperti; e la famiglia **`S`**
> del ritmo, perché a 3840 il corpo più piccolo di una figura scendeva allo **0,97%
> dell'altezza** contro l'1,3% che ha a 1920 — su una parete, che si guarda da più lontano.
>
> 📨 **Il lavoro d'account arriva a dire «a chi scrivere», e il change log recupera il 15-16 ottobre**
> (**§39.8–39.9, Parte 16**). Il Radar diceva che cosa sta succedendo; ora `pnpm accounts --apertura`
> incrocia i segnali col **grafo dei contatti ricavato da Outlook** e propone **una** conversazione al
> giorno con quattro campi obbligatori — se ne manca uno non esce. Ogni apertura diventa una riga nel
> `Registro_opportunita.md` con la colonna **«Decisione Antonio» vuota** (esisteva dal 2 ott e nessuno
> l'aveva mai scritta), e `--decidi <id> si|no|dopo` chiude il cerchio: **NO** mai più, **DOPO** 21
> giorni, **SÌ** l'esito lo chiede `/account-close`. ⚠️ **Due limiti misurati hanno riscritto la regola
> del disegno**: il filtro `recipient:` non distingue il destinatario diretto da chi era in copia
> (quindi «gli hai scritto tu» **non è calcolabile**) e la ricerca gira sulla **propria** casella, per
> cui chi parla solo con l'AE è invisibile — da un grafo magro si conclude «chiedi all'AE», mai «non
> conosciamo nessuno». Provato via `launchctl`, il consulente **ha dissentito nel merito** sull'apertura
> scelta: è la tesi del disegno (selezione gratuita, giudizio dove serve) vista funzionare. ⚠️ Il grafo
> però esiste su **un account su nove** (P1 nuovo), e l'apertura del 13 ott **attende ancora una
> decisione**. Nello stesso giro è stato chiuso il **buco di otto commit del 15-16 ott** che il giro
> precedente aveva dichiarato: il dossier FSTechnology **non è più esposto** (da 533 righe a un wrapper
> gated di 43), il contratto del motore è diventato un gate (`core-contract-audit`), ogni link porta la
> sua **anteprima** (`pnpm og` + `audit:og`), e c'è un **dossier nuovo del MEF** già in rete che qui non
> ha ancora una sezione (P1 nuovo).
>
> 🧭 **12-13 ottobre: la Prospettiva passa dal panel, e nasce «In dieci minuti»** (**§37.7–37.10,
> Parte 16**). Due giri, sei personas cieche più fact-checker e arbitro: **credibilità dei fatti da
> 2,0 a 3,2 su 5**, il Direttore Sales da «accetto a condizione» a **«sì»**, **quindici fatti
> refutati**. I tre che contavano erano **invisibili a tutti i gate perché i link rispondevano**: una
> citazione d'apertura attribuita a lui che l'articolo ANSA **non contiene**, «da due operatori a
> quattro» (sono due), e i **70.000 punti vendita** che non sono le agenzie (sono 12.400). Da qui:
> ogni fonte punta alla pagina che **dice** quel fatto e ne porta il verbatim in `sources.ts`, e
> `audit:fonti` segnala i **link generici**. Nasce il taglio **«In dieci minuti»** (`/dieci-minuti/`),
> che dalla fonte unica **non può divergere** — lo verifica **`pnpm audit:taglio`**, che sulla stessa
> regola ha riallineato anche Intesa. Il 13, su richiesta del committente, la **linearità** è
> diventata misura (**famiglia `L` di `copy-audit`**, da 20 frasi contorte a 0, con la domanda chiave
> riscritta) — e si è scoperto che `copy-audit` **misurava 14 stringhe su 226** sulle experience in
> una lingua sola: ora ne conta 7.548 sul monorepo e ne emergono **480 HARD** mai visti (P1 nuovo).
>
> 🚄 **11-12 ottobre: una Prospettiva nuova, e due gate che non esistevano** (**§37, Parte 16**).
> `apps/trenitalia-prospettiva-sales` — «Dove può arrivare il viaggio», **27 slide su 8 rotte** per
> la **Direzione Sales** di Trenitalia: i quattro capitoli centrali sono i quattro temi dell'agenda
> mandata alla segreteria del cliente, nello stesso ordine. Il cuore è una **misura nostra**: otto
> domande senza nomi di marca a due assistenti, e `trenitalia.com` compare fra le fonti **2 volte su
> 8 nella risposta generata di Google** contro **7 su 8 in ChatGPT**. ⚠️ **Misurare due motori invece
> di uno ha cambiato la tesi del deck e salvato una slide**: da «gli assistenti vi ignorano» a
> «dipende da quale assistente», e l'errore sulle Frecce è risultato di Google, non di tutti. Gemini
> resta a **0 domande su 8** e Perplexity a 2 (§37.3) — il deck lo dichiara. Dai difetti di questo
> giro sono nati **due gate BINDING**: **`pnpm audit:ink`**, che misura il contrasto del **testo** sui
> pixel (è nato da una copertina ardesia su ardesia **illeggibile con `audit:deck` a 0 HARD**, e ha
> trovato **259 blocchi sotto AA su 12 experience** — P1 nuovo), e **`pnpm audit:fonti`**, per cui ogni
> fonte pubblica porta il link e il link risponde. ⚠️ **Due P0 nuovi**: l'experience è **pubblicata e
> non ha mai visto una panel review**, e **18 file di un altro workstream sono finiti su `main`** per un
> `git add -A` (§38) — la decisione su cosa farne è dell'owner. In parallelo, da un'altra sessione, il
> **lavoro operativo d'account** è diventato un mestiere a sé (`docs/CLAUDE.md`, `/account-open`,
> `/account-close`, `/accounts`) e il **`.gitignore` si è rovesciato**: `docs/.gitignore` è ora
> fail-closed, perché con l'elenco a mano **ogni cliente nuovo nasceva esposto**.

> ⏱️ **Che cosa è successo fra l'8 e il 9 ottobre, in una schermata.** La stanza di **Intesa
> Assicurazioni si è tenuta** l'8 alle 11 (il deck ci è andato alla **v8**, §35.11 · il verdetto del
> panel resta fermo alla **v3**, ed è ancora un P0 — ma adesso difende il deck che gira fra i colleghi
> del cliente, non più quella stanza). **Intesa «Su scala umana» è diventata una Prospettiva vera ed è
> andata PUBBLICA** su GitHub Pages (14 slide, marchio ufficiale del cliente, nove sfondi, le due idee
> riscritte con tre diagrammi): fuori da hub e showcase di proposito, `noindex`, **scelta dell'owner**
> — ma **il panel non è mai stato lanciato**, e con l'app pubblica quella non è più un'opzione (P0
> nuovo). Il **guscio sensoriale** — marchio, movimento, **suono**, scala — è entrato nel motore ed è
> BINDING: `DeckAudio` con traccia Adobe Stock licenziata che parte **spenta**, la radice che scala
> sopra i 2000px, il flag **`--tv`** sull'audit (2560 e 3840). La **CI è tornata verde** dopo due
> giorni di rosso, e **sette dossier su sette** non parlano più il nostro gergo — ripuliti **in
> Supabase**, perché lo stato vero sta nel database e i file di seed sono storia.
>
> 🚩 ✅ **CHIUSO il 15 ott 2026** (commit `b84f3a8`: da 533 righe a un wrapper gated di 43, verificato
> in produzione il 17). Si tiene perché la forma dell'errore si ripete — e su `eni-orbita` è ancora
> aperta. Era: **il P0 nuovo che vale la pena leggere per primo**: il dossier FSTechnology
> (`apps/trenitalia-connessioni/src/pages/dossier.astro`) ha il contenuto **scritto nel file `.astro`**
> e quindi pubblicato — chi apre quell'URL **legge tutto senza password**, nome del referente e lettura
> competitiva compresi. Il badge «Adobe internal · Riservato» è una scritta, non un lucchetto. Era
> registrato come P1 architetturale dal 6 ott; l'esposizione verificata lo rende P0. Il pattern giusto
> esiste già nella stessa app: `dossier-sales.astro`, fatto l'8 ott. ⚠️ **Stessa forma su
> `apps/eni-orbita`**: da riverificare prima di trattarla come pulizia.
>
> ✅ **Working tree pulito al 7 ott 2026.** Il 6 ottobre ha prodotto due cose. La prima: i dossier
> interni hanno **un solo motore** (`packages/core/.../DossierPage.astro`) al posto di sei copie
> divergenti, con un gate deterministico — `pnpm audit:dossier`, cinque viewport, **sei dossier a
> zero rilievi** — e una skill che ne tiene il metodo (`skills/dossier/`). Il gate ha trovato cose
> vecchie che nessuno vedeva, fra cui cinque righe **invisibili da settembre** in un dossier già
> consegnato. La seconda: **Intesa Sanpaolo Assicurazioni** (§35), dossier e deck per l'incontro di
> **giovedì 8 ottobre**, con il perimetro del cliente verificato sulle sue superfici invece che
> ipotizzato. Il 7 ott sera il deck è arrivato alla **v6, «Quando il cliente è vostro»**: il
> perimetro si è allargato ai **canali che non passano dalla banca** (§35.9, verificato sul suo
> bilancio), è entrato il capitolo sui **contenuti** (§35.10), e una tessera che attribuiva al
> cliente **Document Cloud** è stata corretta — nel gruppo c'è AEM Forms, che compone e non legge
> (§35.5-ter). ⚠️ Il panel copre la v3, non la v6.
>
> Quattro regole generalizzate il 6 ottobre, tutte da errori veri: un dossier si scrive per **chi non sa
> nulla della Factory**; le idee **si verificano prima di scriverle** e quello che il cliente fa già
> da sé non si propone; esiste una **gerarchia delle fonti** e «non trovato» non significa «falso»;
> una **dichiarazione ha una data di scadenza**. Le prime due sono anche in `CLAUDE.md`.
>
> **In serata**, senza toccare il codice: su **Unipol** il rinnovo di **Adobe Target** (31 dicembre
> 2026) è a rischio per un POC con un concorrente di personalizzazione, e l'argomento scelto è
> **Coworker su CJA e Target insieme** — con l'ask, portata alla call dell'8 ottobre, di estendere a
> Target l'high-touch già in corso su CJA (§11, voce della sera; memoria
> `unipol-target-retention-coworker`). Da lì anche un fatto operativo: il connettore **Microsoft 365
> è in sola lettura**, le bozze Outlook si creano via **AppleScript**.
>
> **Fra il 6 e il 7 ottobre, preparando l'incontro Poste.** Due dubbi sollevati in una call interna sono stati portati
> alla fonte: su Adobe Analytics i casi d'uso di Coworker erano uno solo **fino al 2 ottobre** (poi
> l'indice di Experience League ha aggiunto `aa` e `aa-root-cause-analysis`), e l'ipotesi che si
> passasse dall'Analytics Source Connector dentro AEP è **falsa**. Da lì un overclaim corretto in
> cinque punti del deck — su AA l'«apri in Analysis Workspace» **non è nativo** — con `CLAUDE.md` e la
> memoria riallineati su «rollout dal 2 ott, GA **TBD**». Il video demo del cliente **non si mostra
> intero** (è una sessione di preparazione su dati CJA): due clip tagliate, player offline, **nessun
> upload**. Il dossier Poste è passato da «War Room» a **«Dossier»** e ha una §13 nuova sul perché
> Coworker e non un server MCP collegato al proprio assistente. Tutto in **§32.10 (Parte 13)**.
>
> **7 ottobre, la giornata intera.** Mattina: cinque commit fra le 08:23 e le 11:42, tutti su Poste e tutti
> con lo stesso movimento: dire quello che è vero e citare dove sta scritto. Il **costo** detto come un
> fatto e il limite di reporting col numero pubblico; **«Evolvere» riprogettato** da elenco di funzioni
> a **proposta di avvio** (4 → 7 slide), con l'**istruttoria che torna a Poste** e le promesse su
> retention e residenza ritirate; lo **slug del dossier** che non nomina più il referente
> (`poste-sperandeo` → `poste-sei-domande`, **stesso `share_token`**: il link distribuito regge);
> e **«In azione»**, l'intermezzo con le due clip del cliente — nel flusso e nella nav senza numero,
> fuori dalla griglia 2×3 della home — le cui **clip restano fuori dal Release pubblico**, perché
> mostrano l'interfaccia di un prodotto in rollout. Deck a **39 slide su 8 rotte**, 0 HARD su 123
> controlli (**§32.11**). **Pomeriggio e sera**, sei commit con un filo solo: il deck smette di
> poggiare su quello che avevo supposto e poggia su due fonti vere. La **trascrizione della
> riunione** letta per intero declassa il **Comitato IA** da cancello a nota (mai nominato in 76
> minuti), fa salire la governance che il cliente ha chiesto davvero («si apre per gradi»), nomina
> **iTouch** nel piano e porta in «Governare» **il caso d'uso che ha portato lui** — la verifica di
> un rilascio contro i requisiti caricati una volta come skill. La **registrazione della demo**,
> guardata tutta, diventa **tre tratti** incorporati con una facciata a poster (player al clic,
> zero richieste a YouTube prima): il primo è quello che avevo tagliato a torto, e mostra le skill a
> livello utente e organizzazione, la memoria fra conversazioni **spenta di serie**, e il contesto
> di Poste costruito caricando un documento di guidelines. Rivedendolo sono emersi tre errori di
> copy miei, compreso il momento più forte del video: Coworker **dichiara il limite dei propri
> dati** e dice di non presentare quella risposta come un risultato. In più l'**anteprima rapida**
> (`O` da qualsiasi slide), che mostra tutto il deck con ricerca e salto, e `src/data/slides.ts`
> come mappa unica contro la deriva dei titoli. Deck a **43 slide**, 0 HARD su 129 controlli.
> Tutto in **§32.12 (Parte 13)**.
>
> 🚄 **Un tavolo nuovo: la Direzione Sales di Trenitalia** (§26.9, Parte 7). Dossier gated pronto —
> 16 sezioni, 33 fonti, 0 rilievi su cinque viewport — per un incontro di circa un'ora dopo il
> 20 ottobre; l'artefatto sarà una **Prospettiva**. La verifica ha corretto **cinque assunti
> interni**, e ognuno avrebbe fatto perdere la stanza: non riporta all'AD del Gruppo; «entrare nel
> mondo LeFrecce» non è un perimetro nuovo (`lefrecce.it/B2CWeb/` serve la stessa pagina di
> `trenitalia.com`, **identica byte per byte** e già strumentata Adobe — il pezzo scoperto è
> l'applicazione di acquisto); **non possiede il percorso di acquisto** (sta in un'altra direzione da
> settembre 2025); il nome che circolava come «prima linea delle vendite» è **il capo del digitale**;
> e il riferimento tecnologico di Gruppo è cambiato a luglio. ⚠️ È **sponsor pubblico di Salesforce**
> (Agentforce su vendite e assistenza, citazione sua): niente agenti AI per le vendite, niente
> piattaforma unica del dato. Le tre idee stanno fuori da lì — la piattaforma agenzie **PICO**
> (~70.000 punti vendita, in rifacimento adesso), **l'intermodale** (anche **Air-Rail con ITA
> Airways**) e **il contenuto su scala**. 📅 Il **TTG di Rimini è il 14-16 ottobre e lui ci sarà**: è
> dove un anno fa ha detto le cose su cui poggia metà del dossier, e lì si rinfrescano.
>
> 🚄 **La sera del 9 ottobre: Trenitalia riscritta, e due giri di panel.** Il deck «Connessioni
> Intelligenti» girava su una pelle **inventata** — rosso #E2001A (che è il corporate del Gruppo FS,
> non quello del sito), un'ambra #F5A623 che non esiste in nessuna fonte FS, Space Grotesk. Adesso
> ogni valore viene dal CSS di produzione di trenitalia.com: **ardesia #2f394e** (il colore di
> sistema, 285 occorrenze), **#d91835**, **#006666**, **Poppins** — che per una volta è
> distribuibile. Più: **20 sfondi Firefly su tutte e 72 le slide** (prima c'erano ma a `opacity-12`
> sotto un velo al 90%, cioè annullati), **due clip in loop** su copertina e chiusure, **tredici
> diagrammi** da una libreria di cinque componenti, `wallScale` ovunque, e una caccia alle
> **incoerenze fra slide** che ha trovato un **nome di prodotto sbagliato** (la clean room è
> *Adobe Real-Time CDP Collaboration*, non «Adobe Data Collaboration»), due copertine bianche su
> bianco e un ramo che non nominava la foundation Salesforce di Gruppo mentre l'altro le dedica una
> slide. **Panel review a due giri** con **il responsabile del digitale** come stakeholder principale: la
> credibilità dei fatti passa da **2,17 a 4,00**, il rischio da 2,00 a 3,50. Tutto in **§36 (Parte
> 8)**; ⚠️ un giro è stato buttato perché **il pacchetto di evidenza mentiva** (lo script fotografava
> le slide a metà dissolvenza), e dal panel è uscito anche un **difetto del motore** che tocca
> quattro experience a dominante scura (P1, §36.5).

> 🔤 **La sera tardi del 9 ottobre, tre cose piccole e una che cambia una proposta.** È nato un gate
> nuovo, **`pnpm audit:wrap`**: misura le righe *realmente rese* e segnala la **parola di servizio
> appesa** a fine riga — «…alla scala della Banca dei Territori. In / cinque pagine.» — che
> `text-wrap: balance` non risolve e che `audit:deck` non vede, perché le scatole sono a posto ed è il
> testo a rompersi nel punto sbagliato. Guarda solo dove il difetto si nota: titoli, occhielli, lead. Si
> corregge con uno spazio unificatore, **mai rimpicciolendo il tipo**. Insieme sono uscite le **rotte dei
> deck in un posto solo** (`scripts/lib/deck-routes.ts`), perché il gate nuovo avrebbe dovuto tenerne una
> copia. Tutto committato in `0d15ba5`, con la regola BINDING in `CLAUDE.md` e il passo 9b nella skill;
> ⚠️ **le legature sono state applicate a una sola experience** (P1 nuovo, §10). Sul fronte Poste, la
> prima delle due domande lasciate aperte dal referente — **il modello di costo dopo i crediti di prova**
> — ha una risposta portata alla fonte interna, e cambia la forma della proposta: il percorso è **prova →
> ponte a durata fissa senza metering → crediti dimensionati sull'uso → licenza enterprise sopra una
> soglia di ARR**, partendo piccoli. Senza dati d'uso non si dimensiona un acquisto di crediti, ed è a
> questo che servono i due mesi di affiancamento già chiesti. Resta aperto il **consumo per prompt**
> (P1 nuovo). Cifre, SKU e stato della trattativa **non stanno nel repo**: `docs/Poste Italiane/` è
> git-ignorata. Qui resta solo la regola riusabile: **una concessione su un prodotto va coperta da un
> upsell sullo stesso prodotto**.

> 🎬 **La notte fra il 9 e il 10 ottobre, un difetto che nessuna misura vedeva.** La copertina dei
> deck era **ferma per chiunque abbia «Riduci movimento» attivo** — su macOS moltissimi, spesso per
> la nausea da parallasse e non per togliere una clip ambient. `LoopVideo` faceva un `display: none`
> secco sotto `prefers-reduced-motion`: tecnicamente corretto, in pratica una copertina statica senza
> che nessuno potesse sapere che ci fosse un video. Ora la preferenza vale (**niente autoplay**) ma
> non decide al posto di chi guarda: un **comando nella barra del deck** accende il movimento, la
> scelta si ricorda, e **ogni deck con una clip lo eredita dal motore**. ⚠️ La lezione è più grande
> del difetto ed è BINDING in `CLAUDE.md`: **si misura nelle condizioni di chi guarda, non in quelle
> del browser di prova** — sono serviti tre giri perché Playwright parte senza le preferenze
> dell'utente, e ogni volta il movimento «c'era». Quando qualcuno dice «non lo vedo» e lo strumento
> dice il contrario, la differenza sta nelle condizioni di misura. 🚄 **Trenitalia, la stessa notte**:
> la riunione del 9 ha **ridotto il perimetro a due fonti** — l'Analytics di trenitalia.com e il CRM,
> uniti da chi fa login — e tutto il resto (Frecce, piattaforma di invio, checkout, FS Park) diventa
> orizzonte dichiarato invece di promessa; percorso lineare, ramo FS Park fuori dal flusso ma
> raggiungibile da una riga in `src/data/percorso.ts`, e lo **zero-copy detto a voce in riunione
> corretto nel deck** (per CJA il dato entra: si governa *quanto*). ⚠️ **Il panel a due giri copre il
> deck di prima**: P0 nuovo, da chiudere prima del TTG del 14-16 ott (§36.9, Parte 8).

> ⚠️ **Nota di dimensione, 11 nov.** Il giro ha **scorporato la Parte 22**: i 49 P2 e le note non azionabili escono dalla Parte 10, che passa da **0,4 a 25,0 KB** di margine — la catena del backlog **2 → 10** torna percorribile per mesi, e con tre P1 vecchi scesi dalla 2 (Eni, registri Intesa, Ferrari) anche la **Parte 2 torna a 2,8 KB**. Sul change log è bastata la catena **3 → 4 → 14**, due voci in tutto: Unipol (29 ott) dalla 3 alla 4, il gate sugli a capo (9 ott) dalla 4 alla 14. Nessuna parte fuori contratto.
>
> ⚠️ **Due nodi restano aperti, e nessuno dei due blocca oggi.** (a) La **coda del change log**: la Parte 20 è a **0,6 KB** e la catena **17 → 20** non ha un terzo anello, quindi la prossima catena profonda chiederà una **Parte 23**. (b) **Questo manifest**: cresce di un paragrafo per giornata di lavoro ed era a **1,0 KB** dal tetto. Qui sono uscite le **cinque note di dimensione superate** e il riassunto del backlog **fermo al 26 ottobre**, i cui conteggi erano già contraddetti dalla Parte 2: **6,3 KB**. Resta da decidere se la pila dei rilievi da ottobre debba vivere qui **o solo nel change log**, che li contiene già tutti — è la scelta che decide se questo file regge un altro mese.
>
> Le parti a filo: la **7** (0,1 KB, da anni non toccata), la **3** (0,8), la **16** (1,0), la **18** (1,7), la **2** (2,8). Le più vuote: la **21** (26,1), la **10** (25,0), la **13** (23,9), la **19** (23,2) e la **22** (20,9).
>

> 🛰️ **Il 13 ottobre: il radar che gira da sé, e i primi registri dove servivano.** Il «Radar
> Opportunità» schedulato il 2 ott aveva prodotto **zero file in dieci giorni**, e la causa non era
> lo scheduler: **l'account Claude su cui girava aveva esaurito i token del mese**. Quel design
> leggeva cinque fonti per 25 account due volte a settimana — 300-500 chiamate a settimana, quasi
> tutte su account dove non si era mosso niente. Il principio che lo sostituisce è **selezionare
> prima di leggere**: lo strato gratuito (`pnpm accounts`) vale il 60% — *su cosa guardare* — e
> costa zero. Ora parte da sé **lun-ven alle 07:30 via launchd**: scrive sempre in `Radar/giri/`,
> **notifica solo se c'è un rilievo**, e `accounts` **avvisa se l'ultimo giro ha più di due giorni**
> — il pezzo che mancava, perché quel sistema è morto senza che nessuno lo notasse. Lo strato caro
> resta a mano, così il budget non compete col lavoro interattivo. ⚠️ Quattro guasti di launchd,
> tutti invisibili da una shell interattiva (memoria `launchd-non-e-la-tua-shell`). Dall'altra
> parte, il lavoro che il radar ha reso visibile: la copertura passa da **20 account del book su 25
> senza registro** a **17**, e **nessun rinnovo eleggibile resta scoperto** — aperti **UniCredit**
> (Analytics **$1,48M** al 13 dic, salute **Yellow**, e nessuna conversazione di rinnovo in posta),
> **Ferrovie** (Target **$409K** al 30 dic con **adoption 0,0**, e in posta **nessuna**
> conversazione: l'assenza è il fatto) e **Intesa Sanpaolo**. Sull'**AI Forum del 21 ott**:
> l'iscrizione non ha scadenza dichiarata ma «corporate può chiudere a breve», e all'8 ott
> risultava **un solo meeting confermato in tutto l'evento**. Tutto in **§39 (Parte 16)**.

---

<!-- HANDOVER-SPLIT -->

Handover splittato per dimensione (contratto `/handover`: ≤1500 righe, ≤48 KB, ≤1800 char per riga). **22 parti.**
**Leggi le parti in ordine.** Se devi decidere cosa fare, la Parte 2 basta: è il backlog P0/P1.

- [Parte 1 — §1–7: stato generale, architettura, comandi, tipo per esperienza, UniCredit content model, Admin Console · §9 **Deploy & segreti**](./HANDOVER-01.md) — come è fatta la Factory e come si lavora. §9 è scesa qui dalla Parte 2 il **6 nov**, per far posto al backlog.
- [Parte 2 — §10 backlog **P0 e P1**](./HANDOVER-02.md) — **leggila per prima**: cosa resta da fare adesso. **20 P0 e 38 P1** al 13 nov. In testa «Ciascuno conta» (Trenitalia, ricostruzione del deck interno in corso), poi la Storia di Intesa: check col referente fatto l'11, panel a due giri il 12, branch su `main` dal 13 nov, e prima del 19 le risposte dell'AE, la clip vera di Coworker. Poi Trenitalia Prospettiva (stanza tenuta il 10) e BPER (stanza 12 nov). Tre P1 vecchi sono scesi nella Parte 10 l'11 nov. 2,8 KB di margine.
- [Parte 3 — §11 change log datato (recente)](./HANDOVER-03.md) — dal **13 nov 2026** (la Storia di Intesa in `main`; «Ciascuno conta» per la leadership), dal **12 nov 2026** (la Storia di Intesa sul branch, col panel; nasce «Ciascuno conta», la sera riscritto per la leadership), dall'**11 nov 2026** (la Storia di Intesa: una scala tipografica sola, la rotta delle campagne) e dal **10 nov** (Intesa: CX Analytics nell'innesto; Prospettiva Sales: dry run, agenzie, misure, registrati e mappa), poi il **9 nov** (la Prospettiva Sales cambia registro su tutto il deck, la slide `slide-citta`, il profilo Outlook di `posta.py`), poi il **7 nov** (il motore `.pptx` che prende i trattamenti; il panel della Prospettiva Sales e l'ask che cambia; i quattro giri sulla Storia di Intesa), poi il **6 nov** (i tre livelli, i quattro giri di `/umanizza`, la fisarmonica e lo zoom nel motore, la referenza Unipol), poi il **5 nov** (`/umanizza` a quattro giri, e il ±10% che vale dal Giro 1), poi il **4 nov** (tutto il deck della Prospettiva Sales passa al registro XD, e il giro di revisione sulla voce). Ribilanciata l'**11 nov** (la voce Unipol del 29 ott nella Parte 4) e il **13 nov** (il **3 nov**, lo strato XD della Prospettiva Sales, nella Parte 4).
- [Parte 4 — §11 change log datato (seguito)](./HANDOVER-04.md) — dal **3 nov 2026** (Prospettiva Sales: lo strato XD, sceso qui il 13 nov), poi il **29 ott** (Unipol «Cinque domande», scesa qui l'11 nov) all'indietro, fino al **9 ott**. Ribilanciata l'**11 nov**: ha accolto una voce dalla Parte 3 e ne ha ceduta una alla 14.
- [Parte 5 — §12 puntatori · §13 **Factory Showcase** · §14 Ferrari /scoping](./HANDOVER-05.md) — la vetrina in iperdettaglio, fino a §13.12 (la verifica generale del 3 ott).
- [Parte 6 — §15 hub e parity · §16 Agos · §17 Brand Visibility e de-AI · §18–20 Ferrari /scoping · §22 **core trasversali**](./HANDOVER-06.md) — §22 contiene la regola sugli stili scoped contro il DOM a runtime e, da §22.y, **la clip nascosta da `prefers-reduced-motion`** con la regola sul misurare nelle condizioni di chi guarda.
- [Parte 7 — §26 FS Park × Trenitalia (+ **§26.9 la Direzione Sales**) · §27 UniCredit attribution e dossier · §28 MIM](./HANDOVER-07.md) — ⚠️ §26.8 è il dossier che **era esposto senza gate** — chiuso il 15 ott, resta come storia della forma dell'errore; §26.9 è il tavolo nuovo. ⚠️ Per lo stato CORRENTE del deck Trenitalia la fonte non è qui ma **§36 (Parte 8)**.
- [Parte 8 — §29 pipeline Firefly · §30 Aperture · §31 Isybank · **§36 Trenitalia riscritta (9 ott)**](./HANDOVER-08.md) — §36 è lo stato corrente di «Connessioni Intelligenti»: design system letto, sfondi e clip, diagrammi, schermo da muro, incoerenze fra slide, il panel a due giri e, in **§36.9, il perimetro ridotto a due fonti** la sera del 9 (posteriore al panel).
- [Parte 9 — §21 Experience Atelier · §23 redesign E2E · §24 Eni · §25 core responsive e nav](./HANDOVER-09.md).
- [Parte 10 — §10.b backlog: **i trenta P1 di fondo**](./HANDOVER-10.md) — la coda della §10: quello che non decide la settimana ma non è chiuso. **Alleggerita l'11 nov**: i 49 P2 e le note non azionabili sono usciti nella Parte 22, e la parte passa da 0,4 a **25,0 KB** di margine.
- [Parte 11 — §33 **Intesa «Su scala umana»** · §34 **il motore unico dei dossier**](./HANDOVER-11.md) — la stanza del 22 ott e il motore che regge tutti i dossier. **§35 (l'altra Intesa) è la Parte 15**, in fondo. §33.8 e §33.9 sono le due giornate del 9 ott: quello che hanno detto le registrazioni, il giro di critica, e il taglio da dieci minuti che non può più divergere dal percorso intero. Dal **21 ott** anche **§33.10**: la revisione del 20 ott, l'ordine degli obiettivi e l'affondo sul decisioning.
- [Parte 12 — §32 **Poste «Sei domande»**, §32.1–32.9](./HANDOVER-12.md) — uscita dalla Parte 8 per dimensione, e spezzata a sotto-livello il 7 ott sera perché §32 da sola superava i 48 KB: qui vincoli, struttura, skin, i tre giri di panel e le otto domande portate alla fonte.
- [Parte 13 — §32 **Poste**, seguito: §32.10–32.12](./HANDOVER-13.md) — le sei giornate che hanno riscritto il deck: la verifica alla fonte del 6–7 ott (rollout ≠ GA, l'«apri in Workspace» ridimensionato), **§32.11 la mattina dell'incontro**, e **§32.12 il pomeriggio e la sera** (la riunione nel deck, l'anteprima rapida, il video intero in tre tratti).
- [Parte 14 — §11 change log datato (coda)](./HANDOVER-14.md) — dal **9 ott 2026** all'indietro, fino al **3 ott**. Creata il 7 ott; l'**11 nov** ha accolto dalla Parte 4 la voce sul gate degli a capo.
- [Parte 15 — §35 **Intesa Assicurazioni**](./HANDOVER-15.md) — la stanza dell'8 ottobre e il deck fino alla **v8**: il perimetro allargato ai canali extra-captive e i quattro casi d'uso ereditati dalla libreria FSI (§35.11). Uscita dalla Parte 11 il 9 ott sera, quando §33.9 l'ha portata oltre il contratto di dimensione.
- [Parte 16 — §37 **Trenitalia «Dove può arrivare il viaggio»** · §38 **TIM, stato di fatto**](./HANDOVER-16.md) — la Prospettiva per la Direzione Sales: da dove viene (la registrazione letta per intero, non il riassunto), i sette capitoli, **la misura su due assistenti che ha cambiato la tesi due volte**, i due gate nati qui, **§37.7 il panel a due giri del 12 ott** **§37.13 lo stato al 4 novembre**, **§37.15 la giornata del 6**, **§37.16 il panel a due giri** e **§37.17 l'ask che cambia la sera** — il deck intero nel registro XD, il 96% rimesso perché era l'apertura concordata col cliente, e la voce ripulita dal dito puntato; §37.15 porta i tre livelli, i quattro giri di `/umanizza`, la referenza Unipol sul canale agenziale e **tre trappole che valgono per ogni deck**. §38 registra come 18 file di un altro workstream sono finiti su `main`. ⚠️ **§39 è uscita nella Parte 21** il 4 nov, per dimensione.
- [Parte 17 — §11 change log datato (coda: settembre e luglio 2026)](./HANDOVER-17.md) — dal **3 ott 2026** all'indietro, fino all'**8 set**. Le voci più vecchie, scese qui dalla Parte 14 il 12 e il 13 ott e di nuovo il **6**, il **7** e il **9 nov**, per fare posto in cima.
- [Parte 18 — §8 **Deck visual contract & audit** · §40 **Intesa «Dove ci innestiamo»** · §41 **Unipol «Cinque domande»** · §42 **Intesa «Adobe × Intesa Sanpaolo»** (fino a §42.12; **§42.13 sta nella Parte 19**)](./HANDOVER-18.md) — §8 è scesa dalla Parte 1 il 21 ott; **§40 è l'experience del 5 novembre**, scritta qui il 26 perché era la parte con più spazio: i sei capitoli, la figura a fasi dell'architettura (e che cosa in quella figura è una lettura nostra), il fact check che ha corretto quattro cose di merito, il guscio sensoriale misurato, e il **dossier interno bilingue**. **§41 è l'experience Unipol**, scritta qui il 29 ott: le cinque domande che il cliente ha fatto davvero, i tre livelli di fonte, il registro che cresce, il design system letto da unipol.it e **i due giri di panel con tutti e cinque gli assi in salita** (§41.4). **§42 è la Storia dell'incontro Intesa** (19 nov), scritta qui il 30 e aggiornata il 3: i nove capitoli, gli approfondimenti su profilo/regia/arbitro con il limite dichiarato accanto al pregio, la revisione critica che ha tolto più di quanto abbia aggiunto, e **§42.5 la mappa e la ripresa** (la formula «dì quello che dirai, dillo, ripeti» corretta a metà dalle prove); **§42.8** il panel a due giri, **§42.9** la revisione del team e la data che slitta, **§42.10** i punti aperti, **§42.11** il giro del 9 nov, **§42.12** quello del 10 (pubblicato). ⚠️ **§43 (BPER) è uscita da qui il 3 nov**: è la Parte 19.
- [Parte 19 — §43 **BPER «Sopra quello che avete»** (Blueprint, 12 novembre) · **§37.18-20 Prospettiva Sales**, panel e giri del 10 nov · **§42.13–42.15 Storia di Intesa**, la sera del 10, la rotta delle campagne, il panel dell'11 e quello del 12 sul branch](./HANDOVER-19.md) — nata il 3 nov per far uscire §43 dalla Parte 18; da allora è il posto dove finiscono le sotto-sezioni nuove di §37 e §42, perché le loro parti d'origine sono al limite. 4,9 KB di margine dal 12 nov.
- [Parte 20 — §11 change log datato (coda: settembre e luglio 2026)](./HANDOVER-20.md) — creata il **3 nov** per liberare la catena 3 → 4 → 14 → 17: le voci più vecchie, dal **7 set 2026** all'indietro fino a fine luglio. Ribilanciata il **9 nov**. ⚠️ Ora a 647 byte dal tetto: al prossimo giro sul change log serve una parte nuova.
- [Parte 21 — §39 **il lavoro operativo d'account**](./HANDOVER-21.md) — scorporata dalla Parte 16 il **4 nov**, che con §37.13 aveva superato il contratto di dimensione: registri, Radar, i comandi `/account-open` e `/account-close`, le cinque fonti dell'apertura, il giro gratuito di ogni mattina, **§39.8 il grafo dei contatti** e **§39.9 l'apertura e il giro di ritorno**.
- [Parte 22 — §10.c backlog: **i 50 P2 e le note non azionabili**](./HANDOVER-22.md) — scorporata dalla Parte 10 l'**11 nov**, che era a 0,4 KB dal tetto e non aveva un terzo anello nella catena del backlog. Qui non si decide niente: è la coda di ciò che non decide nessuna settimana. 20,9 KB di margine.
- [Parte 23 — §11 change log datato (coda più vecchia)](./HANDOVER-23.md) — creata l'**11 nov** perché la Parte 20 era oltre il tetto e la catena 3 → 4 → 14 → 17 → 20 non aveva un altro anello: qui finiscono le voci più vecchie del change log. In coda, dal **12 nov**, **§43 «Ciascuno conta»** (Trenitalia, versione interna).
