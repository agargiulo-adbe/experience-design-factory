# HANDOVER — Experience Design Factory

> Documento di passaggio di consegne. Stato al **2026-10-29**.
> Lingua: italiano per la narrativa, inglese per path/comandi/nomi prodotto.
> Companion di `CLAUDE.md` (guida agente, sempre valida) e delle memorie in
> `~/.claude/projects/.../memory/`. Se una cosa qui contraddice il codice, **vince il codice** —
> segnalalo e aggiorna questo file.
>
> **Nuova sessione CC:** l'indice/ordine di lettura è in `docs/README.md`. Leggere **tutti** i
> `.md` costa ~36k token su 19 parti (ok). **Non** aprire mai i `.pptx`/`.mp4` in `docs/` (binari giganti,
> git-ignored, non presenti in un clone pulito) — i fatti utili sono già distillati qui (§5.3).
>
> 🆕 **27-28 ottobre: un Playbook nuovo non committato, e un capitolo di casi d'uso su Trenitalia.**
> **Unipol «Cinque domande»** (`apps/unipol-cinque-domande`, **§41, Parte 18**) è il secondo Playbook
> della Factory dopo Poste: 30 slide su 9 rotte, bilingue, otto capitoli di cui i **cinque centrali
> sono le cinque domande poste dal cliente** nella call del 28, e un ottavo — **il registro** — che è
> lo strato dinamico, impagina da sé tre voci per slide e cresce a ogni sessione del programma. Il
> design system è letto da unipol.it e il ribaltamento dell'inchiostro è **misurato**: il marchio
> `#0303f5` sul navy di sistema dà **1,93:1**, cioè illeggibile, quindi `--ink-accent` ha due valori.
> **Manrope qui è il carattere VERO del cliente** (lo dichiara il suo design system), mentre nella
> skin UniCredit lo stesso carattere è una sostituta scelta da noi: non è un copia-incolla.
> ⚠️ **Niente di tutto questo è committato**: l'app, la migrazione `0032` e quindici file tracciati
> stanno solo sul disco, e per giunta su un ramo che parla d'altro — è il P0 in testa al backlog, ed
> è la stessa forma dell'errore che ha prodotto il P0 di TIM. ⚠️ **Nessuna panel review.**
>
> 🚄 **Trenitalia «Connessioni Intelligenti» ha un capitolo nuovo** — «Che cosa ci faccio», cinque
> casi d'uso chiesti il 27 ott dal Direttore dei canali digitali (**§36.10, Parte 8**, sette commit).
> I **due perimetri stanno in una figura sola** — quello ristretto il 9 ott e quello allargato il 27 —
> dove la figura non cambia e cambia quante fonti sono accese; i casi fuori perimetro si **smorzano,
> non si spengono**. Tre lezioni che valgono oltre questo deck: i sotto-passi **non si attivavano
> affatto** perché l'app non marcava mai `html.js` e una protezione copiata da un'altra app teneva
> tutto visibile (si vedeva **solo misurando**); `CoverHero` **monta la firma di Max Mara se non la si
> spegne**, e la copertina nuova diceva «Max Mara × Adobe»; e una collisione con la nav dell'app che
> **`audit:deck` non può vedere** (il check `b` guarda i comandi del deck) l'ha trovata `audit:ink`.
> ⚠️ Il panel del 9 ott copre ora un deck di **due riscritture fa**.
>
> ✏️ **Il 27 ottobre «Dove ci innestiamo» ha corretto due ask** (**§40.9–40.10, Parte 18**): «due
> nomi: dato e targeting» chiedeva a chi era in sala il nome di chi era in sala — il referente è Head
> of Targeting Commerciale — ed è diventata **«un nome: chi governa i dati»**; e «il periodo in cui si
> paga due volte» è diventato **«la finestra di sovrapposizione»**, perché le parole erano più dure
> del disegno che le stava sopra. Nel dossier, un disallineamento IT/EN trovato con un rilevatore di
> **scambio** e non di traduzione (il confronto ingenuo dava **122 falsi positivi** del tipo
> Torino/Turin) — e un seed corretto **non è** un dossier corretto: il contenuto vive nel database.
>
> ⚠️ **La stanza più vicina è Intesa, e non è più quella del 22: è mercoledì 5 novembre, a Torino,
> 09:55–11:45.** La stanza del 22 si è tenuta ed è andata bene — il cliente ha proposto lui tre
> pilastri e ha detto che sta decidendo come procedere. Per il 5 è nata un'experience nuova,
> **`apps/intesa-innesto` «Dove ci innestiamo»** (21 slide, §40, Parte 18), con un **dossier
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
> slide. **Panel review a due giri** con **Gianluca Palmieri** come stakeholder principale: la
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

> Il **backlog P0 di §10 (Parte 2)** resta la prima cosa da leggere: al 29 ott sono **18 P0 e 32 P1**
> (più **29 P1 di fondo** nella Parte 10 e **49 P2** nella **Parte 19**, nuova). ⚠️ **Il P0 più urgente ha una data: Intesa «Su scala
> umana» va in sala giovedì 22 ottobre e il panel non è mai stato lanciato.** ⚠️ Il P0 sulla panel review della Prospettiva, dato per
> chiuso dai due giri del 12 ott, **è tornato P0**: fra il 13 e il 17 quel deck è cambiato molto (TTG,
> canali, quattro fatti smentiti) e il verdetto non copre più ciò che si consegna. In testa sta
> il P0 dei **18 file di TIM finiti su `main`**; il dossier FSTechnology **non è più fra i P0** — è
> stato riportato sul motore il 15 ott (resta un P2 sulla storia di git). Restano il panel mancante su
> un'app ormai pubblica, il giro delta su Intesa Assicurazioni a stanza avvenuta, e quello che non si
> chiude da solo, i nomi di referenti cliente dentro file tracciati su un repository pubblico. ⚠️ **Dal 12 ott i dieci P1 fermi da settembre** (VPN, Isybank, Eni, MIM, Atelier, il buco
> di media query a 1280×800, le due decisioni di riservatezza) **sono scesi nella Parte 10**: non sono
> chiusi, ma nessuno di loro decide che cosa si fa questa settimana.
>
> ⚠️ **Nota di dimensione** (rimisurata il **29 ott**): il giro del 27-28 ott ha portato una
> **sezione nuova** (§41, il Playbook Unipol), due sotto-sezioni (§40.9–40.10 e §36.10) e **tre
> voci** di change log. §41 e §40.9–40.10 sono andate nella **Parte 18**, che era la più vuota;
> §36.10 nella **Parte 8**. Il change log ha richiesto la solita catena **3 → 4 → 14 → 17**
> (una voce, una, due). ⚠️ **E per la prima volta ha ceduto il backlog di fondo**: la Parte 2 ha
> ceduto sei P1 alla Parte 10, e la Parte 10 è arrivata a **168 byte dal tetto** — quindi i P2 e
> le note non azionabili sono scesi nella **Parte 19, creata in coda** (§10.c). Le parti più
> piene sono ora la **7** (47,7 KB), la **2** (47,5), la **16** (46,4) e la **4** (45,8) su 48;
> le più vuote la **10** (18,0), la **13** (24,0), la **12** (24,8) e la **18** (25,4). ⚠️ Il
> change log occupa da solo **quattro** parti (3, 4, 14, 17) e il backlog ora **tre** (2, 10,
> 19): è il costo fisso di tenerli integrali, ed è una scelta — si paga un ribilanciamento ogni
> due o tre giornate di lavoro. Le **parti nuove si creano in coda** alla numerazione.

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

Handover splittato per dimensione (contratto `/handover`: ≤1500 righe, ≤48 KB, ≤1800 char per riga). **19 parti.**
**Leggi le parti in ordine.** Se devi decidere cosa fare, la Parte 2 basta: è il backlog P0/P1.

- [Parte 1 — §1–7: stato generale, architettura, comandi, tipo per esperienza, UniCredit content model, Admin Console](./HANDOVER-01.md) — come è fatta la Factory e come si lavora.
- [Parte 2 — §9 Deploy & segreti · §10 backlog **P0 e P1**](./HANDOVER-02.md) — **leggila per prima**: cosa resta da fare adesso. I P1 di fondo stanno nella Parte 10, i P2 nella Parte 19.
- [Parte 3 — §11 change log datato (recente)](./HANDOVER-03.md) — dal **28 ott 2026** (i casi d'uso di Trenitalia e i sotto-passi che non si attivavano · il Playbook Unipol non committato) e dal **27 ott** (le due correzioni d'ask su «Dove ci innestiamo» e il dossier che si contraddiceva), poi dal **26 ott** (il dossier del 5 novembre e il motore che non traduceva · i quattro fatti corretti alla fonte · le ancore che diventano figure · il catalogo del motore e le slide da fondo sala), dal **20 ott** (la console porta al dossier · Intesa e Prospettiva dopo le revisioni · la posta come bozza formattata, 19 ott), dal **16-17 ott** (il TTG nel deck della Direzione Sales e quattro fatti della riunione smentiti dalla verifica), dal **15-16 ott** (il dossier FSTechnology che smette di essere esposto, il contratto del motore come gate, l'anteprima dei link, il dossier MEF), dalla **sera del 13 ott** (il grafo dei contatti, l'apertura e il giro di ritorno), dal **12-13 ott** (il panel a due giri sulla Prospettiva, il taglio «In dieci minuti» e il gate `audit:taglio`, la linearità misurata) e dall'**11-12 ott** (la Prospettiva per la Direzione Sales, `audit:ink` e `audit:fonti`, i file di TIM finiti su `main`, il lavoro d'account). La coda prosegue nella Parte 4.
- [Parte 4 — §11 change log datato (seguito)](./HANDOVER-04.md) — dalla **notte del 9 ott 2026** (la copertina ferma per chi ha «Riduci movimento», il perimetro di Trenitalia che si stringe) al **6-7 ott** (Poste, il claim portante alla fonte). Ribilanciata il 29 ott.
- [Parte 5 — §12 puntatori · §13 **Factory Showcase** · §14 Ferrari /scoping](./HANDOVER-05.md) — la vetrina in iperdettaglio, fino a §13.12 (la verifica generale del 3 ott).
- [Parte 6 — §15 hub e parity · §16 Agos · §17 Brand Visibility e de-AI · §18–20 Ferrari /scoping · §22 **core trasversali**](./HANDOVER-06.md) — §22 contiene la regola sugli stili scoped contro il DOM a runtime e, da §22.y, **la clip nascosta da `prefers-reduced-motion`** con la regola sul misurare nelle condizioni di chi guarda.
- [Parte 7 — §26 FS Park × Trenitalia (+ **§26.9 la Direzione Sales**) · §27 UniCredit attribution e dossier · §28 MIM](./HANDOVER-07.md) — ⚠️ §26.8 è il dossier che **era esposto senza gate** — chiuso il 15 ott, resta come storia della forma dell'errore; §26.9 è il tavolo nuovo. ⚠️ Per lo stato CORRENTE del deck Trenitalia la fonte non è qui ma **§36 (Parte 8)**.
- [Parte 8 — §29 pipeline Firefly · §30 Aperture · §31 Isybank · **§36 Trenitalia riscritta (9 ott)**](./HANDOVER-08.md) — §36 è lo stato corrente di «Connessioni Intelligenti»: design system letto, sfondi e clip, diagrammi, schermo da muro, incoerenze fra slide, il panel a due giri, in **§36.9 il perimetro ridotto a due fonti** la sera del 9, e dal 28 ott **§36.10, il capitolo dei casi d'uso** — i due perimetri in una figura sola, i mockup a due lati, le quattro scene del motore e i tre difetti che solo una misura vedeva.
- [Parte 9 — §21 Experience Atelier · §23 redesign E2E · §24 Eni · §25 core responsive e nav](./HANDOVER-09.md).
- [Parte 10 — §10.b backlog: **i P1 di fondo**](./HANDOVER-10.md) — la coda della §10. I P1 di fondo sono scesi qui il 12 ott, poi il 17, il 19 e il **29 ott** (sei in un colpo); i **P2 e le note non azionabili** sono scesi nella **Parte 19** il 29 ott, quando questa parte è arrivata a 168 byte dal tetto.
- [Parte 11 — §33 **Intesa «Su scala umana»** · §34 **il motore unico dei dossier**](./HANDOVER-11.md) — la stanza del 22 ott e il motore che regge tutti i dossier. **§35 (l'altra Intesa) è la Parte 15**, in fondo. §33.8 e §33.9 sono le due giornate del 9 ott: quello che hanno detto le registrazioni, il giro di critica, e il taglio da dieci minuti che non può più divergere dal percorso intero. Dal **21 ott** anche **§33.10**: la revisione del 20 ott, l'ordine degli obiettivi e l'affondo sul decisioning.
- [Parte 12 — §32 **Poste «Sei domande»**, §32.1–32.9](./HANDOVER-12.md) — uscita dalla Parte 8 per dimensione, e spezzata a sotto-livello il 7 ott sera perché §32 da sola superava i 48 KB: qui vincoli, struttura, skin, i tre giri di panel e le otto domande portate alla fonte.
- [Parte 13 — §32 **Poste**, seguito: §32.10–32.12](./HANDOVER-13.md) — le sei giornate che hanno riscritto il deck: la verifica alla fonte del 6–7 ott (rollout ≠ GA, l'«apri in Workspace» ridimensionato), **§32.11 la mattina dell'incontro**, e **§32.12 il pomeriggio e la sera** (la riunione nel deck, l'anteprima rapida, il video intero in tre tratti).
- [Parte 14 — §11 change log datato (coda)](./HANDOVER-14.md) — dalla **sera del 6 ott 2026** (Unipol, il rinnovo di Target a rischio) all'indietro fino all'**11-12 set**. Creata il 7 ott; ribilanciata **sette** volte, l'ultima il 29 ott.
- [Parte 15 — §35 **Intesa Assicurazioni**](./HANDOVER-15.md) — la stanza dell'8 ottobre e il deck fino alla **v8**: il perimetro allargato ai canali extra-captive e i quattro casi d'uso ereditati dalla libreria FSI (§35.11). Uscita dalla Parte 11 il 9 ott sera, quando §33.9 l'ha portata oltre il contratto di dimensione.
- [Parte 16 — §37 **Trenitalia «Dove può arrivare il viaggio»** · §38 **TIM, stato di fatto** · §39 **il lavoro operativo d'account** (fino a **§39.9: il grafo dei contatti, l'apertura e il giro di ritorno**)](./HANDOVER-16.md) — ⚠️ **§37.7 è il panel a due giri** e **§37.10 il giro di linearità del 13 ott**. La Prospettiva per la Direzione Sales: da dove viene (la registrazione letta per intero, non il riassunto), i sette capitoli, **la misura su due assistenti che ha cambiato la tesi due volte**, gli sfondi in duotone, i due gate nuovi e che cosa manca. §38 registra come 18 file di un altro workstream sono finiti su `main`, e la regola che ne resta. Dal **21 ott** anche **§37.12**: il giro del 20 ott e la trascrizione che corregge il deck.
- [Parte 17 — §11 change log datato (coda: settembre e luglio 2026)](./HANDOVER-17.md) — dal **10 set 2026** all'indietro, fino a luglio. Le voci più vecchie, scese qui dalla Parte 14 il 12 e 13 ott e di nuovo il 29.
- [Parte 18 — §8 **Deck visual contract & audit** · §40 **Intesa «Dove ci innestiamo»** · §41 **Unipol «Cinque domande»**](./HANDOVER-18.md) — §8 è scesa dalla Parte 1 il 21 ott; **§40 è l'experience del 5 novembre** (i sei capitoli, la figura a fasi dell'architettura, il fact check, il guscio sensoriale, il dossier bilingue, e in **§40.9–40.10 il giro del 27 ott**); **§41 è il Playbook Unipol del 28 ott**, non ancora committato.
- [Parte 19 — §10.c backlog: **i P2 e le note non azionabili**](./HANDOVER-19.md) — nata il **29 ott 2026**, quando la Parte 10 è arrivata a 168 byte dal tetto. Qui non c'è niente che decida la settimana: è la coda lunga, tenuta integrale di proposito.
