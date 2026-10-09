# Handover — Parte 13 di 15
> Torna all’indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 32. «Sei domande» — Poste Italiane *(seguito della [Parte 12](./HANDOVER-12.md))*

<!-- sezione spezzata a sotto-livello: §32.1–32.9 stanno nella Parte 12 -->

Le sei giornate che hanno riscritto il deck dopo il terzo giro di panel: la verifica alla
fonte del claim portante, la mattina dell’incontro, e il pomeriggio in cui il deck ha
smesso di poggiare su quello che avevo supposto.

### 32.10 Il claim portante riverificato alla fonte, il video e il dossier rinominato (2026-10-06/07) — `2e307ea`

**Da dove nasce.** Una call interna del 6 ott (prep dell'incontro del 7) ha sollevato due dubbi: che su Adobe Analytics Coworker avesse **un solo caso d'uso documentato** (la validazione AA↔CJA) e che l'integrazione passasse dall'**Analytics Source Connector** dentro AEP. Entrambi portati alla fonte, pubblica e interna.

**Il dubbio sul caso d'uso unico era vero fino al 2 ottobre, non dopo.** Lo Slack interno del 22 lug associava ad AA la sola «AA-to-CJA migration validation and data reconciliation», e la pagina della skill di validazione è del 9 set. Ma l'indice `chat/use-cases/overview` di Experience League è stato aggiornato **il 2 ottobre**, lo stesso giorno del rollout, e oggi elenca per Adobe Analytics le skill `aa` su *Pull reports & metrics*, *Comparative analysis*, *Campaign performance*, *Funnel analysis*, *Forecasting* ed *Executive summaries*, più **`aa-root-cause-analysis`**; c'è anche la pagina dedicata `data-insights/analytics-chat` (agg. 2 ott): «Coworker Chat accesses Adobe Analytics report suites». Chi ha guardato prima del 2 ott ha visto un solo use case **e aveva ragione allora**.

**L'ipotesi del connector è smentita.** La release note dice «accesses data from **your Adobe Analytics report suites**», e lo Slack interno del 22 lug è esplicito: «The expected path is to use the Adobe Analytics MCP server. **No movement of Adobe Analytics data into Adobe Experience Platform was indicated**». Portarla in sala avrebbe fatto apparire un progetto AEP che non serve, davanti a chi CJA l'ha chiuso nel 2024.

**Rollout ≠ GA, ed è scritto nella release note.** Due colonne distinte: «Rollout starts: **October 2, 2026**» · «General Availability: **TBD** (originally planned for September 25, 2026)». Il deck lo diceva già giusto; **`CLAUDE.md` e la memoria di progetto no** (davano la GA per fatta il 2/10): allineati.

**I numeri del server MCP, ricontati.** Il tool reference (agg. 18 mag 2026) ha 4 + 7 + 2 + 3 + 3 + 4 = **23** strumenti, e i quattro che scrivono sono `upsertSegment`, `upsertCalculatedMetric`, `createDateRange`, `upsertProject`. Confermato il permesso: «a product profile containing the **MCP Access** permission item» + «MCP servers enforce the same permissions as the UI». I numeri del deck erano esatti.

**L'overclaim corretto, in cinque punti.** «Ogni analisi si apre in Analysis Workspace» non regge su Adobe Analytics: lo Slack interno descrive una skill custom nata per «close the parity gap where CJA Coworker artifacts already had an analyze-in-workspace button but **AA data did not**», il wiki BACOM tiene «full AA tool parity + open in Workspace» come richiesta **senza data**, e perfino «Open in CJA» è «limited in how exact it will create related tables». Ciò che è documentato è `upsertProject` col `workspaceLink`. Corretto in `accendere`, `rispondere`, `capire`, `evolvere` e nella **copertina**, più l'etichetta della fonte che diceva «casi d'uso (oggi documentati su CJA)» — vera a settembre, falsa dal 2 ott. Verifica: build ok, audit **102 rotte, 0 HARD**, soft invariato (30 `a`, 18 `i`) **rimisurato sulla baseline** rimettendo i file originali: nessuna regressione.

**Il video demo: letto, tagliato, tenuto in locale.** `docs/Poste Italiane/Video Demo Poste Italiane.mov` (6'39", 3280×1954, **senza traccia audio**) non è una demo registrata ma una **sessione di lavoro per preparare la demo**, su dati dimostrativi **CJA** nella org `demosystem4`: a 3:40 Coworker vende CJA («è proprio la vista unica sul cliente che CJA rende possibile»), a 4:50 c'è il bottone «Analyze in CJA» e la frase «**Per la demo** consiglio di non presentare questa domanda come insight», a 5:12 «Loaded Generate Executive Summary **from CJA** skill». **Intero non si mostra.** Estratte due clip verificate fotogramma per fotogramma: `coworker-poste-01-riepilogo.mp4` (5:31→5:52: gli otto KPI, «cosa è cambiato», le raccomandazioni) e `coworker-poste-02-documento.mp4` (6:04→6:38: il PDF brandizzato, con l'autocorrezione delle etichette del grafico), 1920×1144, 2,0 e 3,0 MB. **Gotcha ffmpeg riusabile**: `-ss` *prima* di `-i` aggancia il keyframe precedente, e il primo taglio conteneva esattamente la riga su CJA che doveva escludere — il seek accurato vuole `-ss` **dopo** `-i`. Niente caricato da nessuna parte: `player.html` + `serve.command` nella cartella git-ignorata, con la dichiarazione obbligatoria (sandbox Adobe, dati CJA, rollout non GA) **sopra** il player, così non si proietta dimenticandola.

**Il dossier: rinominato e corretto** (migrazione `0020`, applicata e verificata sul link condiviso). «War Room — …» → «**Dossier — Poste Italiane · Giuseppe Sperandeo**». La §01 dava per **GA il 29 settembre** e prometteva un «Open in Analysis Workspace» nativo: riscritta. Aggiunta la **§13 «Perché Coworker e non il server MCP collegato al nostro assistente?»**, sette voci ricavate dalla call Luxottica × Adobe del 6 ott (PM Adobe: Brett, piattaforma analytics; Ankita Datta, soluzioni AI): le tre ragioni vere — controllo, permessi ereditati, skill che restano dell'organizzazione — e ciò che **non c'è ancora**: business context **in alpha** previsto a novembre, memoria **spenta** e attesa in quindici giorni, crawling abilitato per cliente da Adobe, connettori verso i sistemi del cliente che significano «scrivetevi il vostro server MCP». Più il taglio su cosa **non** portare a Poste (CJA, il problema multi-marchio, la «democratizzazione dell'analytics») e la regola di **non nominare il cliente** in sala. ⚠️ «War Room» resta nei dossier Eni e Trenitalia.

**Da chiarire col PMM.** La pagina pubblica dice di collegare il server `cja-mcp`; la documentazione Analytics e i tool interni parlano di un `aa-mcp` distinto (`aa-mcp__runReport`). Se l'Admin chiede «quale server collego», oggi la risposta pubblica è ambigua.

### 32.11 L'ultima passata prima della sala (2026-10-07, mattina) — `a386afe`→`80f4053`

Cinque commit fra le 08:23 e le 11:42 del giorno dell'incontro, tutti su contenuto e tutti con lo stesso movimento: **dire quello che è vero e citare dove sta scritto**, togliendo i numeri che invecchiano e le promesse che il prodotto non mantiene.

**Il costo detto come un fatto, il limite col numero vero** (`a386afe`). Copertina e «Cosa vi portate a casa»: i crediti di prova diventano una frase piana — vederlo all'opera non costa nulla — senza numeri di settimana, perché quella del 7 ott è una prima sessione di introduzione e non una trattativa. Il «monte richieste di reporting» era vago: il numero è pubblico nella Product Description — **Analytics Select, 500.000 richieste di report al mese per IMS org** — e le domande via MCP contano lì dentro insieme a Workspace e alle API; fonte citata sulla slide. Tolta la nota sulla verifica interna per il settore finanziario: dei tempi resta solo ciò che è vero, cioè che il calendario parte dall'attivazione lato Adobe e dalla conferma scritta. Sostituito il criterio del 2024 «analizzare i dati di altri reparti» — che chiedeva «quali reparti?» a un pubblico che presidia i canali digitali — con l'altro criterio approvato, la **facilità d'uso**. «Oggi in inglese» riverificato e tenuto: Coworker supporta ufficialmente il solo inglese, le altre nove lingue sono annunciate e nel deck restano **senza data**.

**«Evolvere» non è più un elenco di funzioni future: è una proposta di avvio** (`71bfcb3`), da quattro slide a sette, con un'altra domanda in testa — non «quali funzioni arrivano» ma «come si comincia».
- **«Si parte piccolo, su una suite di prova»**: quattro passi senza numeri di settimana (si accende · si misura il prima · si prova sulle vostre domande · si decide). Il calendario lo detta l'istruttoria di Poste, non un piano nostro.
- **«Chi coinvolgere»**: cinque ruoli nell'ordine in cui entrano — il team di monitoraggio, l'Admin di Analytics, chi fa campagne digitali, Comitato IA + DPO + sicurezza, Adobe.
- **«Da parte nostra»**: il programma di affiancamento (high touch) su Coworker, oggi attivo su CJA, chiesto per Poste **su Adobe Analytics** — si apre su richiesta, la richiesta la facciamo noi, la conferma arriva per iscritto. Sul costo niente «illimitato»: Coworker è licenziato in **crediti di IA** (Product Description in vigore dal 30 lug 2026) e il modello commerciale è una conversazione a parte.
- **«Gli altri MCP di Coworker»** dichiara il perimetro possibile con le disponibilità verificate: **AEM supportato, Workfront in preview, Target, AJO, Real-Time CDP ed Experience Platform in beta**, più i server MCP del cliente verso sistemi non Adobe. E dice che AEM Forms e Adobe Commerce il Gruppo **li ha già, ma in altre divisioni**: non è una decisione di questo team. Footprint letto da `20260929_Poste_Italiane_Adobe_Footprint_data.xlsx` — l'ECCID 1445148 ha esattamente AEM Forms, Analytics Select, Commerce.

**E «Proteggere» smette di promettere quello che Adobe non pubblica** (stesso commit). «Settimana zero: Comitato IA e DPO» → «**L'istruttoria la aprite voi**»: tempi, forma e interlocutori li decide Poste, noi rispondiamo per iscritto alle domande tecniche con la fonte accanto. «Tre pezzi, tutti Adobe, nessuna copia dei dati grezzi» → «Tre pezzi, e che cosa tocca ciascuno», con retention e residenza **inventate** rimosse e una riga «quello che questa slide non dice» che rimanda ai termini Adobe sulle funzionalità di IA generativa e alla documentazione contrattuale. La freccia dei permessi era **sbagliata**: non «permessi dell'utente» ma **«permessi Analytics + MCP Access»** (Experience League, agg. 18 set 2026). Via «ventitré strumenti, quattro scritture» qui e in `accendere` — il numero invecchia a ogni release — restano i tipi di scrittura che Adobe elenca (segmenti, metriche calcolate, intervalli di date, progetti Workspace).

**Lo slug del dossier nominava il referente, su una pagina pubblica** (`1a1aba9`). `/dossier/` è pubblica: il gate protegge il contenuto, non l'HTML. E dentro quell'HTML viaggiava `DOC_SLUG = "poste-sperandeo"`, cioè il cognome della persona del cliente, leggibile da chiunque facesse una GET senza token — **verificato sul deployato**, non solo in locale. La riga Supabase è stata rinominata in **`poste-sei-domande` mantenendo lo stesso `share_token`**: il link già distribuito continua a funzionare. ⚠️ Stesso difetto su isybank (`isybank-valitutti`), segnalato e non toccato. Memoria `client-names-public-repo`.

**«In azione»: le due clip del cliente diventano un intermezzo del deck** (`70ac729`), fra Proteggere ed Evolvere. Era una slide creata dalla Console con un embed YouTube che non partiva; ora è una sezione vera, nel design system dell'experience. **Non è una settima domanda** — il deck si chiama «Sei domande»: `interlude: true` in `chapters.ts` la mette nel flusso e nella nav **senza numero** e la tiene **fuori dalla griglia del percorso in home**, che resta 6 card su 2 righe da 3 come vuole la regola della roadmap (`QUESTIONS` filtra gli intermezzi; nav e home leggono la stessa fonte, nessun capitolo rinumerato). Cinque slide: cover (due clip, un minuto in tutto) · **«Prima di guardarle»**, le tre avvertenze dette *prima* del play e non dopo (è l'organizzazione dimostrativa Adobe · gira su dati dimostrativi **CJA**, quindi si trasferisce la forma della conversazione e non la lettura delle vostre suite · su Analytics è in rollout con la GA non dichiarata) · clip 1, 21 s, una domanda e un riepilogo, con «che cosa guardare» accanto · clip 2, 34 s, il documento per il management e l'autocorrezione delle etichette sovrapposte · «Cosa resta».

**Dettagli tecnici dell'intermezzo.** `.sd-clip*` e `.sd-split--media` nel design system dell'app, proporzione 1920×1144 come i file; le clip **non sono generate**, quindi `data-made-with="Firefly"` sta solo sulle due slide con sfondo generato e `provenance.video.json` le registra come `screen-recording` con la nota esplicita «NON generata con Firefly»; rotta aggiunta a `deck-audit.ts`, slide registrate nel `PAGE_REGISTRY`. Audit: **0 HARD su 123 controlli** (1920/1440/1280); i **9 soft nuovi** stanno tutti sulle due slide con la clip — il parser non conta un video come massa di testo, quindi `a` su una slide che a occhio è bilanciata, il limite noto già scritto in `CLAUDE.md`. Le altre sette rotte sono invariate, rilievo per rilievo.

**Le clip restano fuori dal Release pubblico** (`80f4053`), e la decisione nasce da **cosa mostrano**: non dati di Poste, ma l'interfaccia di Coworker su Adobe Analytics, che è in rollout e senza GA dichiarata. Su un URL pubblico sarebbero scaricabili e indicizzabili, e ritirarle dopo non le fa sparire dalle cache. Quindi la sorgente video passa dal Release a **`public/media/`, che per gli mp4 è git-ignorato**: le clip si riproducono da una copia locale del sito, non dal deployato. I **poster restano tracciati**, così le due slide reggono comunque — poster, titolo, «che cosa guardare» — anche per chi apre il link pubblico. E lo dice la slide, invece di lasciare un play che non fa niente: «organizzazione dimostrativa Adobe · dati di sandbox · la clip si riproduce dalla copia locale, non è pubblicata», con la stessa nota in copertina di capitolo e in `provenance.video.json`, dove è registrato il percorso delle sorgenti. Riproduzione verificata su preview locale (play ok, 1920×1144).

⚠️ **Due conseguenze da tenere a mente.** La prima: il deck pubblicato ha ora **otto rotte** (home + sei domande + intermezzo) e due slide che su URL pubblico mostrano **solo il poster**. È una scelta dichiarata in pagina, non un difetto da «sistemare» caricando i file da qualche parte. La seconda: il verdetto del panel resta quello del **2 ottobre** e ora è ancora più lontano dallo stato corrente — «Evolvere» è un capitolo diverso, «Proteggere» ha tre affermazioni riscritte e c'è una sezione nuova. Vedi il P0 di §10.

### 32.12 Il pomeriggio e la sera del 7 ottobre: la riunione, l'anteprima, il video intero (2026-10-07) — `408c28b`→`8eada70`

Sei commit dopo la sala. Il filo è uno solo: **il deck smette di poggiare su quello che
avevo supposto e poggia su due fonti vere** — la trascrizione della riunione e la
registrazione della demo, guardate entrambe per intero.

**Il deck riallineato alla riunione** (`408c28b`). Trascrizione Plaud letta tutta (429
interventi, 76 minuti). Quattro modifiche sostanziali, ognuna con la sua evidenza.
- **Il Comitato IA scende da cancello a nota.** In 76 minuti: zero occorrenze di
  «comitato», «DPO», «garante», «GDPR», «legal»; le due di «privacy» sono una battuta sui
  dati finti della demo. Il deck era costruito su una porta che il cliente non ha mai
  nominato, e che rallentava uno che vuole partire prima di Natale. Resta come nota sul
  perimetro in «Proteggere» — il Manifesto e il Comitato esistono davvero e il deck
  circolerà fra chi in sala non c'era — ma non è più il punto da cui parte il calendario.
- **Sale la governance che ha chiesto lui.** La sua preoccupazione è «apri tutto»: che una
  risposta giusta venga letta male da chi non ha la sensibilità di quel dato. La quarta
  regola di «Proteggere» diventa **«Si apre per gradi, non "apri tutto"»**: poche persone
  nominate, le domande ricorrenti fissate in skill scritte da chi il mestiere lo conosce,
  e allargare resta una loro decisione.
- **Il piano è quello concordato.** «Evolvere» dice **iTouch** per nome: circa due mesi,
  **non è una licenza**, serve a usarlo sul serio senza consumare i crediti di prova — e
  quindi a **misurare il consumo** prima di impegnarsi. L'attivazione è quella vera
  (richiesta della IMS org da parte nostra, prima coorte, giorni; poi accessi self-service
  in Admin Console e crediti già lì). Il quarto numero su cui si decide non è più generico:
  è quanto ha consumato.
- **Entra il caso d'uso che ha portato lui**: nuova slide in «Governare», `slide-rilasci`,
  «Questo rilascio traccia quello che avevamo chiesto?». Oggi è un controllo a mano,
  requisito per requisito; con i requisiti caricati **una volta** come skill, Coworker dice
  che cosa manca, che cosa non corrisponde, che cosa arriva vuoto — e il controllo lo esegue
  chi è arrivato da poco. È la cosa più forte che ha detto, ed era assente.

**La numerazione, e il copy delle clip riscritto guardando il video** (`3d5a860`).
L'intermezzo prende il **06** ed «Evolvere» passa al **07**. Due conteggi, ciascuno vero
nel suo posto: la **nav** conta il deck (01→07), la **griglia della home** conta solo le
domande (01→06), così «Sei capitoli, sei domande» resta una frase vera e la roadmap resta
6 card su 2 righe da 3 (`QUESTIONS` in `chapters.ts` filtra `interlude: true`). Il copy
delle clip l'avevo scritto dalle didascalie del player locale, non guardando il video:
guardato, «è la skill *il riepilogo del lunedì*» era **sbagliato** (il confronto è
**mensile**, luglio su giugno) e la correzione automatica delle etichette **non era
verificabile** in 34 secondi, quindi tolta. ⚠️ **La lingua**: «oggi in inglese» era vero in
agosto ma non è ciò che il video mostra — prompt in italiano e risposta in italiano — e il
deck ora dice entrambe le cose senza datare l'italiano.

**Anteprima rapida: tutto il deck in una pagina** (`a3db2da`). Otto rotte e 42 slide, e da
dentro non si vedono: chi riceve il link atterra sulla prima slide. `SdOverview.astro` apre
un indice su superficie scura col **titolo vero** di ogni slide raggruppato per capitolo e,
sotto il nome del capitolo, **la domanda a cui risponde**; niente miniature, perché a 120px
una slide di testo non dice nulla. **La ricerca è il punto**: al primo giro «costo» dava
zero risultati — i titoli non contengono la parola, e chi non conosce il deck cerca per
argomento — quindi ogni slide porta le sue parole chiave nella mappa. Tastiera `O` / frecce
/ Invio / Esc, deck in pausa mentre è aperto; il salto fra rotte passa da `sessionStorage` e
dalla navigazione SPA, quindi **non perde lo schermo intero**.
**Zero wiring**: il pulsante nasce fuori e si innesta da sé in `[data-deck-controls]`, come
gli altri runtime del progetto. E **una duplicazione in meno**: la mappa delle slide viveva
solo nel `PAGE_REGISTRY` della Console e aveva già divergito (tre titoli fermi a una
versione precedente) — ora sta in **`src/data/slides.ts`**, letta da entrambi, con
`pnpm --filter poste-sei-domande check:slides` che confronta gli id con i `<Slide id>` reali
e fallisce se qualcuno entra o esce senza passare di lì.

**Il video innestato nel deck** (`d7638f0`, poi rifatto in `8eada70`). La registrazione sta
su **YouTube come video non in elenco** (`XE5yH5qXbtc`), caricata dall'account: il deck non
incorpora mp4 e mostra **tratti dello stesso video** con una **facciata a poster**, così il
player di terzi nasce **al clic** su `youtube-nocookie.com`. Verificato: **0 richieste a
YouTube prima del clic**. Un HARD chiuso in corsa: il pulsante-facciata
falliva il check `h` su tutti e tre i viewport, perché l'etichetta per screen reader
ereditava l'inchiostro scuro della slide chiara finendo su fondo nero — risolto con `color`
e `background-color` espliciti.

**Poi il taglio in due si è rivelato sbagliato, e sono tre** (`8eada70`). Avevo escluso
0:00–2:05 scrivendo che «il contesto sta già in Accendere»: lì ci sono **tre righe** sulle
skill, e in due punti il deck promette un meccanismo («i requisiti si caricano una volta
come skill» in Governare, «i colori vengono dalle regole caricate prima» nella parte sul
documento) di cui avevo tagliato l'**unica prova filmata**. Ora i tratti sono tre:

| slide | tratto | che cosa mostra |
|---|---|---|
| `slide-clip-contesto` — «Prima di rispondere, che cosa sa di voi» | 0:00 → 2:05 | l'interruttore **Utente / Organizzazione** sulle skill (290 installate · 210 di prodotto · **78 dell'organizzazione** · 2 personali); la **memoria fra conversazioni spenta di serie**, con il prodotto che rimanda ad Adobe per accenderla; la scheda di marchio con **un solo documento** caricato e i controlli che ne risultano; le regole con il loro identificativo a punti (`brand_voice.lexicon.use-specific-action-led-ctas`), la frase **italiana** da cui sono state estratte e il rimando alla pagina del PDF |
| `slide-clip-riepilogo` — «Quattro domande, in italiano» | 2:05 → 5:00 | trend giornaliero e dieci anomalie · sezioni · App contro Web · **e la quarta domanda, sulla distribuzione oraria, dove Coworker si ferma** |
| `slide-clip-documento` — «Una richiesta, un documento finito» | 5:00 → 6:39 | il riepilogo a schermo, poi il PDF di tre pagine |

Rivedendo i tratti 2 e 3 sono emersi **tre errori di copy**, tutti miei:
- le domande sono **quattro**, non tre: mancava quella sulla distribuzione oraria;
- su quella quarta Coworker **dichiara il limite dei propri dati** — «con questi dati non si
  può individuare una vera ora di picco. È un limite della demo da dichiarare, non un
  risultato sull'uso dei clienti» — ed è il momento più forte del video per una stanza
  diffidente. Non c'era;
- il **controllo che il prodotto fa sul proprio documento** (rilettura delle tre pagine,
  etichette del grafico corrette) era stato tolto il giorno prima come non verificabile:
  sta scritto a schermo a **6:05**, e torna.

⚠️ **Nota di onestà tenuta nel deck.** La scheda di marchio (Experience Context) è una
configurazione **a sé**, fuori dall'attivazione di Coworker su Analytics: la slide lo dice
in una riga e non promette disponibilità. Lato interno risulta che la voce di menu è oggi
aperta alle **organizzazioni clienti Experience Manager con accesso a Coworker** — se il
perimetro Experience Manager di Poste soddisfi quella condizione **non è verificato**, ed è
una voce del backlog, non una cosa da dire in sala.

**Poster rifatti dai tratti giusti.** Quello della Parte 2 veniva dal **riepilogo mensile**,
che è contenuto della Parte 3; a quello della Parte 3 è stata **tagliata la barra del
browser**, che mostrava il percorso locale di un collega e la cartella di un altro cliente.
Tutti e tre 1920×1144, in `provenance.video.json` come `screen-recording` col fotogramma di
origine e la nota «NON generata con Firefly».

**Verifica.** `audit:deck` **129 controlli, 0 HARD**, 66 soft (il residuo `a`/`i` delle
slide con media: il parser non conta un video come massa di testo). `check:slides` PASS su
**8 rotte**; il deck è a **43 slide** (4+5+5+5+6+5+6+7). I tre player provati dal vivo con
`window.__edfDeck`: `start`/`end` = 0–125, 125–300, 300–399.

⚠️ **Un difetto che l'audit non vede, e lo screenshot sì.** A 1280×800 l'ultima riga della
nota finiva **sotto la firma co-brand**, con `b:ok`: il check `b` misura la collisione con
`[data-deck-controls]`, non con la firma in basso a sinistra né col credito «creato con» a
destra, che sono `fixed` e volutamente fuori dalle misure. Regola generalizzata nella
memoria `audit-deck-false-pass`: ogni blocco aggiunto **sotto** il contenuto principale va
misurato contro il `top` minimo degli elementi `fixed` nella metà bassa del viewport — o
più semplicemente si legge **anche** lo screenshot a 1280.

**Dossier aggiornato e applicato** (migrazione `0026`, non tracciata, rigenerata da
`poste-dossier.json`): 15 sezioni, la sezione dei fatti verificati passa a **15 voci** con i
due livelli delle skill, la memoria spenta di serie ed Experience Context (con l'adozione
interna citata e il vincolo Experience Manager); una **domanda aperta** in più nella sezione
delle domande; e **corretta la riga sulla lingua** — «solo inglese» è del 31 agosto, e il 6
ottobre l'italiano funziona in domanda e in risposta sull'organizzazione dimostrativa.
