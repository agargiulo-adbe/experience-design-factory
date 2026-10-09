# HANDOVER — Experience Design Factory

> Documento di passaggio di consegne. Stato al **2026-10-09**.
> Lingua: italiano per la narrativa, inglese per path/comandi/nomi prodotto.
> Companion di `CLAUDE.md` (guida agente, sempre valida) e delle memorie in
> `~/.claude/projects/.../memory/`. Se una cosa qui contraddice il codice, **vince il codice** —
> segnalalo e aggiorna questo file.
>
> **Nuova sessione CC:** l'indice/ordine di lettura è in `docs/README.md`. Leggere **tutti** i
> `.md` costa ~20k token (ok). **Non** aprire mai i `.pptx`/`.mp4` in `docs/` (binari giganti,
> git-ignored, non presenti in un clone pulito) — i fatti utili sono già distillati qui (§5.3).
>
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
> 🚩 **Il P0 nuovo che vale la pena leggere per primo**: il dossier FSTechnology
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
> Il **backlog P0 di §10 (Parte 2)** resta la prima cosa da leggere: **quattro P0 nuovi o riscritti il
> 9 ott** stanno in testa (il dossier FSTechnology esposto · il panel mancante su un'app ormai pubblica
> · il giro delta su Intesa Assicurazioni a stanza avvenuta), e subito sotto c'è quello che non si
> chiude da solo — i nomi di referenti cliente dentro file tracciati su un repository pubblico,
> inventario rifatto il 7 ott. ⚠️ **Nota di dimensione**: le Parti **1 e 7** sono a filo del tetto
> (48,6 e 48,7 KB su 49,1): la prossima sezione che cresce lì dentro fa scattare un ribilanciamento.

---

<!-- HANDOVER-SPLIT -->

Handover splittato per dimensione (contratto `/handover`: ≤1500 righe, ≤48 KB, ≤1800 char per riga).
**Leggi le parti in ordine.** Se devi decidere cosa fare, la Parte 2 basta: è il backlog P0/P1.

- [Parte 1 — §1–8: stato generale, architettura, comandi, tipo per esperienza, UniCredit content model, Admin Console, audit](./HANDOVER-01.md) — come è fatta la Factory e come si lavora.
- [Parte 2 — §9 Deploy & segreti · §10 backlog **P0 e P1**](./HANDOVER-02.md) — **leggila per prima**: cosa resta da fare adesso.
- [Parte 3 — §11 change log datato (recente)](./HANDOVER-03.md) — dal **9 ott 2026** all'indietro, fino al 2 ott: il guscio sensoriale, la CI verde e i dossier ripuliti, Intesa pubblica, il tavolo della Direzione Sales di Trenitalia.
- [Parte 4 — §11 change log datato (seguito)](./HANDOVER-04.md) — dal 2 ott 2026 all'8 set.
- [Parte 5 — §12 puntatori · §13 **Factory Showcase** · §14 Ferrari /scoping](./HANDOVER-05.md) — la vetrina in iperdettaglio, fino a §13.12 (la verifica generale del 3 ott).
- [Parte 6 — §15 hub e parity · §16 Agos · §17 Brand Visibility e de-AI · §18–20 Ferrari /scoping · §22 **core trasversali**](./HANDOVER-06.md) — §22 contiene la regola sugli stili scoped contro il DOM a runtime.
- [Parte 7 — §26 FS Park × Trenitalia (+ **§26.9 la Direzione Sales**) · §27 UniCredit attribution e dossier · §28 MIM](./HANDOVER-07.md) — ⚠️ §26.8 è il dossier **esposto senza gate** (primo P0); §26.9 è il tavolo nuovo e il modo giusto di farlo.
- [Parte 8 — §29 pipeline Firefly · §30 Aperture · §31 Isybank](./HANDOVER-08.md).
- [Parte 9 — §21 Experience Atelier · §23 redesign E2E · §24 Eni · §25 core responsive e nav](./HANDOVER-09.md).
- [Parte 10 — §10.b backlog **P2 e note non azionabili**](./HANDOVER-10.md) — la coda della §10, spezzata ai sotto-livelli perché da sola superava i 48 KB.
- [Parte 11 — §33 **Intesa «Su scala umana»** · §34 **il motore unico dei dossier** · §35 **Intesa Assicurazioni**](./HANDOVER-11.md) — le due stanze Intesa (22 ott e 8 ott), il motore che regge tutti i dossier, il panel a due giri, e il deck dell’8 ottobre fino alla **v8**: il perimetro allargato ai canali extra-captive e i quattro casi d’uso ereditati dalla libreria FSI (§35.11).
- [Parte 12 — §32 **Poste «Sei domande»**, §32.1–32.9](./HANDOVER-12.md) — uscita dalla Parte 8 per dimensione, e spezzata a sotto-livello il 7 ott sera perché §32 da sola superava i 48 KB: qui vincoli, struttura, skin, i tre giri di panel e le otto domande portate alla fonte.
- [Parte 13 — §32 **Poste**, seguito: §32.10–32.12](./HANDOVER-13.md) — le sei giornate che hanno riscritto il deck: la verifica alla fonte del 6–7 ott (rollout ≠ GA, l'«apri in Workspace» ridimensionato), **§32.11 la mattina dell'incontro**, e **§32.12 il pomeriggio e la sera** (la riunione nel deck, l'anteprima rapida, il video intero in tre tratti).
- [Parte 14 — §11 change log datato (coda)](./HANDOVER-14.md) — dal **7 set 2026** all'indietro, fino a luglio. Creata il 7 ott: il change log da solo superava due parti; ribilanciata il 9 ott, quando la Parte 3 ha toccato il tetto.
