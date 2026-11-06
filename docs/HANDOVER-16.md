# Handover — Parte 16 di 21
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 37. Trenitalia — «Dove può arrivare il viaggio» (Prospettiva, Direzione Sales)

`apps/trenitalia-prospettiva-sales` · nata l'**11 ottobre 2026**, live il 12 · tipo **Prospettiva**
· IT · **27 slide su 8 rotte** · `defaultPublished: false` (fuori dalla vetrina pubblica).
È l'artefatto che il P1 del 9 ottobre chiedeva di costruire, e che quella voce dava ancora come
«da fare»: il dossier era pronto da giorni, l'experience no.

### 37.1 Da dove viene — la registrazione, non il riassunto

Il punto di partenza è la riunione interna di preparazione del **9 ottobre** (registrazione Plaud).
La trascrizione è stata letta **per intero**: il riassunto automatico, come al solito, sbagliava
nomi propri e appiattiva i disaccordi. Tre cose sono uscite solo dal parlato:

- un **disaccordo interno non risolto** sul posizionamento rispetto al referente tecnologico di
  Gruppo — registrato nel dossier **come disaccordo**, non ricomposto a tavolino;
- la richiesta esplicita di preparare **agenda e abstract** da mandare alla segreteria;
- l'ipotesi, poi verificata e **smentita**, che un certo prodotto fosse disponibile:
  **Conversation Insights non è uscito ed è di CJA**, non di Analytics (memoria
  `trenitalia-direzione-sales`).

Il dossier interno (`docs/Ferrovie/`, git-ignorata) è passato da 16 a **17 sezioni** con la bozza
di agenda titolo per titolo, e ha incassato nove fonti nuove. Dall'agenda interna sono nati i due
artefatti per il cliente: la **proposta di agenda** e un `.eml` apribile in Outlook
(`X-Unsent: 1`, oggetto ASCII, `multipart/alternative`) — perché la segreteria riceve una mail,
non un file Markdown.

### 37.2 I sette capitoli

Apertura · La domanda · **La ricerca** · Il viaggio · Il contenuto · La rete · La rotta.
I quattro centrali sono **i quattro temi dell'agenda mandata al cliente**, nello stesso ordine:
così chi ha letto la mail ritrova il documento che si aspetta. Il filo è «dove si perdono le
vendite»: prima del sito (la visibilità nelle risposte generate), dentro l'offerta
(l'intermodale), a valle (il contenuto), nel canale suo (~70.000 punti vendita).

### 37.3 La misura — il capitolo che ha cambiato la tesi due volte

Il capitolo «La ricerca» non porta una teoria ma **una misura nostra**, rifatta davanti alla
stessa domanda: *quando qualcuno chiede a un assistente come si va da A a B, Trenitalia viene
nominata? E trenitalia.com compare fra le fonti?* Otto domande, una per conversazione nuova,
**nessun nome di marca dentro la domanda**.

| Misura | Google (risposta generata) | ChatGPT |
|---|---|---|
| Trenitalia nominata | 6 / 8 | 7 / 8 |
| `trenitalia.com` fra le fonti | **2 / 8** | **7 / 8** |
| Attribuzione sbagliata | 2 / 8 | 0 / 8 |

⚠️ **La misura ha corretto il deck due volte, e la seconda ha salvato una slide dall'accusa
sbagliata.** Con un motore solo la tesi era «gli assistenti vi ignorano»; con due è diventata
**«dipende da quale assistente»**, che è più debole da dire e molto più difendibile in sala —
e l'errore sulle Frecce, che stava per diventare un'accusa generica, si è rivelato **di Google**,
non di tutti. È il caso da ricordare quando viene la tentazione di misurare una fonte sola.

**Quello che non si è potuto completare** (12 ott): **Gemini 0 domande su 8** e **Perplexity 2 su
8**. Perplexity esaurisce le ricerche gratuite dopo tre domande; su Gemini la sessione aziendale
esiste sul profilo del browser, ma davanti alla chat c'è un dialogo di accettazione dei termini
che **non è un'azione da prendere per conto dell'owner**. Le due risposte di Perplexity — prodotto
nominato («Frecciarossa e Italo»), **operatore no**, fonti di blog di viaggio — puntano verso il
comportamento di Google; restano nel documento di misura e **fuori dal deck**, perché due risposte
non fanno una colonna. Il deck dichiara il proprio perimetro in chiaro, nel blocco di metodo.

Il blocco di metodo è un `HowItWorks` sulla copertina del capitolo: chi presenta non è obbligato
ad aprirlo, chi legge il deck da solo trova lì come è stata fatta la misura. Dice anche quale
assistente e **con quali domande**: una misura senza il suo metodo è un'opinione con dei numeri
davanti.

### 37.4 Pelle, asset, guscio sensoriale

Design system **letto** da trenitalia.com e condiviso con `trenitalia-connessioni`: ardesia di
sistema `#2f394e`, rosso di marchio `#d91835`, **Poppins** (per una volta il carattere vero del
cliente è distribuibile). Dominante **scura**, quindi `--surface-inverse` è la superficie
**chiara**: è la trappola che ha prodotto quasi tutti i difetti di questo giro.

- **8 sfondi Firefly** (`backdrops.manifest.ts`), due famiglie — `ink` per le slide scure, `soft`
  per le chiare — con **grade duotone** per slot. Il duotone non è un vezzo: chiesta la palette a
  parole il modello restituisce comunque neon ciano e arancio, cioè i colori di un'altra azienda.
  Il duotone rimappa la luminanza fra due colori del marchio, e l'immagine esce ardesia qualunque
  cosa abbia generato il modello.
- **2 clip in loop** (copertina e chiusura), camera bloccata con `pan, tilt, zoom, dolly` nel
  negativo, ricucite con `loop:seamless`. Gli `.mp4` stanno sul Release `media`, non nel repo.
- Niente treni, niente mezzi riconoscibili, niente persone: un treno generato somiglia sempre al
  treno di qualcuno, ed è la wrong-brand imagery che la Quality Bar vieta.

### 37.5 Due gate nuovi, nati dai difetti di questa experience

- **`pnpm audit:ink`** (`scripts/ink-audit.ts`) — il contrasto del **testo**, misurato sui pixel.
  È nato perché una copertina di capitolo era **ardesia su ardesia, illeggibile, con `audit:deck`
  a 0 HARD**: il check `h` guarda i bottoni, il testo delle slide non lo guardava nessuno. Non
  legge il CSS: ritaglia il rettangolo di ogni blocco dallo screenshot, prende il colore modale
  come fondo e il pixel più lontano come inchiostro, così scrim e backdrop sono già dentro la
  misura. ⚠️ Girato su tutto il monorepo ha trovato **259 blocchi sotto AA su 12 experience**
  (maxmara 77, ferrari 52, trenitalia-connessioni 52, unicredit 44; quattro pulite) — riportati,
  **non corretti**: fuori dal perimetro di questo lavoro, e sono un P1 a sé.
- **`pnpm audit:fonti`** (`scripts/source-audit.ts`) — ogni fonte pubblica porta il link, e il
  link risponde. HARD sui link che non rispondono, SOFT sulle righe di fonte senza link (che sono
  legittime quando rimandano a una misura nostra o a un documento interno). ⚠️ **403 non vuol dire
  rotto**: Gartner e parecchi editori rispondono 401/403/429 a qualunque accesso automatico, e
  `helpx.adobe.com` dà 403 a HEAD e 200 alla GET sullo stesso URL. Il gate ritenta con GET, aspetta
  e ritenta una seconda volta sui timeout, e mette i bloccati in una lista «da aprire a mano»:
  un gate che grida al lupo viene ignorato, ed è il contrario del suo scopo.

Entrambi sono **BINDING in `CLAUDE.md`**, insieme alla regola che `copy-audit` **si lancia**, non
si ricorda.

### 37.6 Lo stato dei gate al 12 ottobre

`audit:deck` **0 HARD** a 1920/1440/1280 (34 slide su 9 rotte dopo il panel; il residuo è tutto
soft: `a` 27, `i` 15, `g` 8, su slide volutamente ariose) · `exp:ok` su ogni slide, quindi i blocchi
che si aprono reggono anche da aperti · `audit:ink` **pulito su 322 blocchi** · `audit:wrap`
**pulito** · **`audit:taglio` ALLINEATO** · `audit:fonti` **34 link, nessuno rotto e nessuno
generico** (le tre righe senza link sono la nostra misura, che non è pubblica) · `copy-audit`
**0 HARD / 0 SOFT** dopo tre giri di umanizzazione.

### 37.7 Il panel del 12 ottobre — due giri, e quindici fatti refutati

Sei personas cieche (il Direttore Sales, il Direttore Generale, marketing, Customer Operations, il
presidio digitale, il Digital Business Partner di FSTechnology), un fact-checker e un arbitro, due
volte. Personas in `docs/Ferrovie/PANEL-PERSONAS-SALES.md`, verdetti in
`docs/Ferrovie/PANEL-VERDICT-2026-10-12-round{1,2}.md`, JSON grezzi in `docs/Ferrovie/panel/`
(tutto git-ignorato).

| Asse | giro 1 | giro 2 |
|---|---|---|
| credibilità dei fatti | 2,0 | **3,2** |
| rilevanza per me | 4,0 | 4,0 |
| chiarezza | 3,8 | 3,8 |
| rischio (5 = nessuno) | 2,3 | 2,8 |
| azionabilità | 2,8 | 3,2 |

Primo giro: **sei «accetto a condizione» su sei**. Secondo: il Direttore Sales passa a **«sì»**,
cinque restano condizionati. **Quindici fatti refutati**, e i tre che contavano erano invisibili a
tutti i gate perché i link rispondevano:

- la slide d'apertura attribuiva a lui, **fra virgolette**, una frase che l'articolo ANSA citato
  non contiene: il 75%/4% è un dato di contesto che circola al TTG, il 96% è suo ma detto altrove;
- **«da due operatori a quattro»** è falso: sull'alta velocità sono due, SNCF è il terzo e debutta
  non prima della fine del 2027, Arenaways è sulla rete tradizionale (e la fonte è del 2024);
- i **70.000 punti vendita non sono le agenzie**: sono i punti fuori dalle biglietterie che vendono
  il Regionale, da un dato del **2014**. Il canale della Direzione Sales sono **12.400 agenzie**,
  contate da lui al TTG dell'ottobre 2025.

E la **domanda centrale** del deck («quando il prezzo non è più la leva») era smentita dalla slide
precedente: dal 1º gennaio 2026 il prezzo lavora più di prima, solo che è una leva del marketing.
Riscritta due volte, fino alla formulazione che il marketing stesso ha dettato.

⚠️ **La lezione che vale oltre questo deck**: `audit:fonti` verifica che il link **risponda**, non
che dica quella frase. Da lì due cose nuove — il SOFT sui **link generici** (tre slide citavano due
homepage per sei fatti) e il campo `cosaDice` in `src/data/sources.ts`, che tiene scritto che cosa
ogni pagina conferma **verbatim**. Memoria: `link-risponde-non-conferma`.

### 37.8 «In dieci minuti», il taglio che non può divergere

`/dieci-minuti/` — 7 slide (copertina, la sua frase, il contesto, la domanda, i quattro punti, il
passo, la firma) con **l'ask dentro**: un'ora concessa diventa venti minuti più spesso di quanto si
ammetta, ed è anche la versione che l'interlocutore gira al suo capo. Non è una copia: copia e fonti
stanno in `src/data/contenuti.ts` e `src/data/sources.ts`, e dove il taglio ha bisogno di meno
parole la versione breve è un **campo accanto** a quella lunga (`bBreve`, `leadBreve`). Lo verifica
**`pnpm audit:taglio`** (registro in `scripts/lib/cut-routes.ts`): HARD su copia a mano, numeri che
solo il taglio afferma, fonti che solo il taglio porta. Sulla stessa regola è stata riallineata
anche `intesa-scala-umana`, dove il gate ha trovato subito una frase riscritta a mano. La funzione è
generale: `skills/experience-design/references/taglio-dieci-minuti.md`, `CLAUDE.md` e la checklist
di `pnpm new:experience`.

### 37.9 Che cosa manca (le voci sono nel backlog §10, Parte 2)

**Il dossier porta ancora nove dei fatti corretti** — elenco con le fonti in
`docs/Ferrovie/CORREZIONI-DA-RIPORTARE-NEL-DOSSIER-2026-10-12.md`: è il documento da cui il team si
prepara, quindi è lì che un fatto sbagliato rientra a voce. **Cover dello showcase** assente
(`shots/trenitalia-prospettiva-sales.webp`) e la `desc` del record è ancora quella dello scaffold.
**Letto sonoro** non montato: licenziare una traccia Adobe Stock consuma una licenza, quindi si
chiede prima. La misura resta a **due motori su quattro**. E restano quattro cose che il panel ha
chiesto e che **vogliono una persona, non un altro giro**: nessun ordine di grandezza del valore per
i quattro punti, nessun indicatore del mestiere del cliente (riempimento, ricavo per posto-km, mix
diretto/intermediato), il parco applicativo mai descritto, e una riga su che cosa **non**
duplichiamo rispetto ai cantieri aperti con gli altri fornitori.

### 37.10 Il 13 ottobre: la linearità, e una CI rossa che aveva ragione

**La domanda chiave era contorta, e il committente l'ha vista prima del gate.** Diceva: «Il prezzo
lavora già al massimo, e verso l'alto il listino è fermo. Dove si perdono le vendite che il prezzo
non recupera?» — tre subordinate prima della domanda, che arrivava in terza riga dietro una doppia
relativa. **La premessa stava occupando il posto della domanda**: è scesa nell'occhiello, e il
titolo è rimasto solo — «Allora dove si perdono le vendite?». Quella slide falliva il check `i`
(troppo vuota): ora passa tutti e dodici.

Poi la stessa verifica su tutto il deck, **misurata e non a occhio**: lunghezza della frase, catena
di subordinate, doppia relativa, principale che arriva dopo la rincorsa. **Venti frasi sopra soglia
→ zero.** Il metodo è diventato la famiglia **`L`** di `copy-audit` (§11, voce del 13 ott), perché
una regola che vive in una sessione non è una regola.

⚠️ **E lungo la strada è emerso che il gate era cieco su questo deck**: `copy-audit` leggeva solo
gli attributi `it=`/`en=` di `<T>`, e qui la copia è in una lingua sola — **14 stringhe misurate su
226**, con PASS stampato. Ora ne misura 226, e l'intestazione dice sempre quante ne ha viste.

⚠️ **La CI è andata rossa al primo push su `main` perché `typecheck` non era stato lanciato**, e
aveva ragione tre volte: un `const COVER` con l'URL della clip **ombreggiava l'import** omonimo (la
copertina del taglio rendeva una riga vuota e la firma mezza frase), e dietro due import inutilizzati
c'erano la testa della mappa e la riga della firma **tornate scritte a mano** nel percorso lungo.
Da lì il gate `c1` di `audit:taglio` guarda anche le pagine del percorso intero, non solo il taglio.

**Stato al 13 ottobre:** live su GitHub Pages, nove rotte a 200, `/dieci-minuti/` compresa.
`typecheck` 0 · `copy-audit` 0 HARD / 0 SOFT su 226 stringhe · `audit:wrap` pulito · `audit:taglio`
**ALLINEATO** · `audit:deck` **0 HARD** a 1920/1440/1280 · `audit:ink` pulito su 325 blocchi ·
`audit:fonti` 34 link, nessuno rotto e nessuno generico.

---

### 37.11 Il 16-17 ottobre: il TTG, i canali che il cliente ha già, e quattro fatti dati per buoni

**La review interna del 16 ottobre ha spostato l'asse del deck.** Dalla registrazione è uscito che
due delle cose che stavamo per *proporre* il cliente le ha **già**: vende dentro un mini-program
cinese dal 2025, e in Italia ha un assistente su messaggistica che propone soluzioni e porta al
carrello — in Europa non lo fa nessun altro operatore ferroviario. E il canale agentico non è una
nostra idea: è **uno dei pilastri che ha dichiarato di avere in lavorazione**. Il capitolo è stato
riscritto di conseguenza: non «ecco un'opportunità», ma «ecco dove siete già, e qual è il passo».

**Il TTG è entrato dove apparteneva**, non in una slide-notizia: la parola dell'anno dichiarata dal
Direttore Sales apre il capitolo uno; il protocollo con la compagnia di crociere (15 ott, e **dal
2027 collega i due sistemi di prenotazione**) diventa il caso da cui parte il capitolo sulla data
collaboration; gli annunci sull'offerta su gomma sono stati **assorbiti in una card esistente**,
perché la griglia è a tre e a quattro si rompe. Nel contesto è entrata anche la **proposta della
Commissione europea del 13 maggio 2026** — chi ha metà del mercato domestico dovrà vendere sulla
propria piattaforma anche i treni degli altri — marcata per quello che è: una proposta, non una norma.

**Quattro cose che la riunione dava per buone, e che la verifica ha smentito.** È il valore di
questa passata, ed è il motivo per cui la regola «un'affermazione è un'ipotesi» esiste:

1. **I rivenditori come minaccia.** L'argomento era «ci disintermediano, riprendiamoci il volume».
   Non regge, e il cliente avrebbe avuto in mano i numeri per dirlo in sala: pubblica una pagina
   «diventa agenzia partner» con sei sistemi di vendita, una tabella di remunerazione aggiornata ad
   aprile 2026 e **provvigioni fino al 6%** — quei terzi li corteggia. La stessa valutazione
   d'impatto europea scrive che la grande maggioranza di ricerche e vendite online **resta sui
   canali propri degli operatori**. Riscritto come **argomento di margine**: comparire tramite un
   rivenditore in una risposta generata significa pagare in commissione una vendita che poteva
   arrivare diretta. Nessuna percentuale in slide, nessuna accusa.
2. **La referenza citata a voce non esiste.** Quattro verifiche indipendenti, e fra i clienti
   pubblici del prodotto di data collaboration non c'è né un vettore né una ferrovia né una
   crociera. Prima era stato messo il caso più vicino preso da un altro settore; poi è arrivata la
   **decisione d'account: nel deck non va nessuna referenza di un altro cliente**. Il motivo è
   buono anche fuori da qui — **un caso di un altro settore apre la domanda «e nel nostro?» invece
   di chiuderla**. La slide dice che è un'ipotesi da provare insieme, e si ferma lì.
3. **Il prodotto agentico dato per «ormai in general availability».** È **annunciato e basta**: una
   sola frase pubblica in un comunicato di aprile, nessuna documentazione su Experience League.
   Esito in slide: **nome e concetto sì, stato di disponibilità no**. Lo stato si dice a voce,
   perché il deck gira per i corridoi del cliente senza chi l'ha presentato, e una riga sullo stato
   di un prodotto invecchia da sola.
4. **L'accordo con la compagnia aerea dato per in scadenza.** Il memorandum di marzo **non scade**:
   a scadere il 1° luglio 2026 è un accordo di vendita con **un'altra** compagnia, i cui passeggeri
   vengono riprotetti proprio sui voli della prima. ⚠️ Verificando è però uscito il fatto che
   contava: **a maggio lo stesso vettore ha firmato la stessa intesa con l'operatore ferroviario
   concorrente**, biglietto unico in vendita da luglio su agenzie, GDS e sito proprio. La card lo
   dice: l'asset intermodale c'è, **non è esclusivo**, ed è il motivo per cui va governato.

**Due note di metodo.** La fonte di quell'ultimo fatto è una testata di settore e non il comunicato
del vettore, perché quel sito risponde **403 a qualunque accesso automatico**: è la classe «da
aprire a mano» che `audit:fonti` tiene separata dagli errori. E lo stesso gate ha imparato il
**terzo falso allarme** (`NGHTTP2_INTERNAL_ERROR` e parenti: connessione chiusa male, non link
rotto), che ora finisce fra i bloccati invece che fra gli irraggiungibili.

**Stato dei gate al 17 ottobre**, dopo nove commit (`3bcf049`→`f9d882e`): `audit:deck` **0 HARD** a
1920/1440/1280 (soft 34 `a`, 8 `g`, 15 `i`, invariati) · `copy-audit` **0 HARD e 0 SOFT** ·
`audit:wrap` pulito · `audit:fonti` nessun link rotto, 44 link su 29 distinti · `audit:ink` pulito
su 349 blocchi · `audit:taglio` **ALLINEATO** · le slide toccate lette a 1920.

⚠️ **Il verdetto del panel resta quello del 12 ottobre** e da allora il deck è cambiato molto: un
capitolo riscritto, quattro card nuove, due canali del cliente nominati per la prima volta, un
prodotto nominato e un argomento ribaltato. Gate `/handover` 3.4: voce nel backlog.

---

### 37.12 Il 20 ottobre — ogni idea dice con che cosa si fa, e la trascrizione corregge il deck

Due giri nello stesso giorno: il primo applica il feedback raccolto **dopo** la presentazione (`8ee387a`), il secondo nasce dal riascolto integrale della call (`4269b4a`).

**L'apertura citava il 2025.** La seconda slide del primo capitolo stava ancora sul TTG dell'ottobre 2025 — il 96% del territorio, il 75% sul 4% — mentre le due dopo erano già sul TTG di quest'anno. Aprire un documento del 2026 con la dichiarazione dell'anno prima si fa rispondere «quello lo dicevamo allora». Ora porta le sue parole del **15 ottobre 2026**, verificate sull'articolo: la parola dell'anno e, soprattutto, dove dice di investire — i **canali digitali diretti**, che è poi il motivo per cui questo deck esiste.

**«Che cosa serve, concretamente» su ogni idea.** Sei blocchi, **lo stesso titolo ovunque** perché si impari una volta sola dove guardare, dentro il drill-down così la slide regge anche chiusa (componente `CheServe.astro`). La legenda ha **tre stati e non due**: l'accordo quadro, arrivato quella mattina, ha una sezione che fissa il prezzo di prodotti **non ancora acquistati** — dire «si aggiunge» di qualcosa che ha già il suo prezzo nel loro contratto sarebbe falso in difetto. Letto sul contratto e non a memoria: Firefly arriva con le postazioni Creative Cloud che hanno già, Workfront ha il prezzo bloccato.

**La data collaboration ha una slide sua.** Stava in una riga di fonte, in fondo, dopo i link: «non è chiaro dove si innesta» era un rilievo giusto. Ora dice le due cose che uno si chiede — dove sta nel percorso e dove nei sistemi. **Il lavoro agentico** entra nel capitolo del contenuto con Firefly e Workfront oltre ai tre prodotti; il paragrafo lì dentro era **bianco su fondo chiaro** perché il corpo del drill-down non dichiarava un inchiostro suo ed ereditava quello del motore: nessun check lo vedeva. **Il canale delle agenzie** era l'unico capitolo senza i prodotti dietro, e diceva che cosa si misura senza dire che cosa se ne ricava; «che cosa converte» ora nomina digitale **e cartaceo**, perché in agenzia si stampa ancora, e molto.

Due slide nuove (`slide-serve`, `slide-collab`), registrate nell'admin: con il blocco aperto le due slide d'origine uscivano dalla safe-area, e **il contratto dice di dividere, non di rimpicciolire il tipo**.

**Il riascolto: 476 segmenti, non il riassunto** (`4269b4a`), che su un punto era vago — e quel punto era un errore di fatto.

- **Su WhatsApp non si compra.** Il deck scriveva «dentro WhatsApp l'assistente porta al carrello». In riunione la parola «vendono» è stata usata e **corretta a voce da chi l'aveva detta**: «non vendono, è un canale di assistenza — ti dà le combinazioni e poi ti rimanda il link sull'app e sul sito», provato a mano. Era un conflitto fra due fonti nostre: la pagina CartaFRECCIA Oro lascia intendere che da lì si acquisti, la prova diretta dice di no. **Vince la prova diretta**, e la fonte ora porta il conflitto scritto perché nessuno lo rifaccia.
- **LLM Apps è pull, non push.** È il viaggiatore a richiamare l'app nella conversazione: non è pubblicità dentro ChatGPT, ed era la domanda rimasta aperta più a lungo in riunione. La slide ora lo dice.
- **Il DAM non è del marketing di Trenitalia**: l'istanza che esiste è di un'altra società del gruppo. «Già vostro» diventa «c'è già nel gruppo, da estendere», che è anche il razionale concordato in call — estendere una cosa che l'azienda ha già è un passo corto.
- **Di Firefly hanno la versione base**, quella delle postazioni Creative Cloud, e la riga nomina entrambi come chiesto in riunione. Verificato sull'accordo quadro, a chiusura della domanda rimasta in sospeso: i **modelli personalizzati non ci sono**, né fra i prodotti licenziati né fra quelli a prezzo bloccato.

**La rotta resta com'è**, in attesa della riunione della settimana successiva: è l'unico capitolo che nessuno ha rivisto dopo la presentazione (voce P1 nel backlog).

**Gate**: `audit:deck` **0 HARD su 9 rotte** a tre viewport, con ogni disclosure ri-misurata **da aperta** · `audit:ink` PULITO su 347 blocchi · `audit:wrap` PULITO · `audit:taglio` ALLINEATO · `copy-audit` 0 HARD e 0 SOFT su 273 stringhe · `audit:fonti` nessun link rotto · `audit:og` PASS · typecheck 0 errori. Niente estremi di contratto nei file tracciati: il repo è pubblico.

⚠️ **Il verdetto del panel resta quello del 12 ottobre**: fra il 16-17 e il 20 ott il deck è stato riscritto due volte, e il giro 3 (voce P0, §10 Parte 2) ora deve coprirle entrambe.

---

### 37.13 Il 3-4 novembre: lo strato XD su tutto il deck, e il giro prima della sessione

Due giornate, otto commit, e un deck che cambia registro. Il dettaglio dei singoli interventi sta
nel change log (§11, Parte 3, voci **2026-11-03** e **2026-11-04**); qui resta **lo stato**.

**La regola che le ha generate entrambe.** XD e i micro-diagrammi sono **due registri** e non si
sostituiscono: l'XD è quello che si **proietta** (immagine, mockup, una cifra, poche parole), i
micro-diagrammi sono quello che si **apre**, dietro «Scopri come». La regola è BINDING per ogni
deck e vive in `skills/experience-design/references/xd.md` + `CLAUDE.md`. ⚠️ **Nessun gate la
misura**: `audit:ritmo` conta *se* c'è un elemento visivo, non in che registro è.

**Com'è fatto adesso il percorso (34 slide su 8 rotte, più il taglio):**
- **Copertina**: clip in loop + **agenda della sessione generata da `CHAPTERS`** — non può
  divergere da ciò che si proietta. Occhiello «Agenda».
- **Sette divisori di capitolo** in forma XD: titolo grande, fotografia (una per capitolo),
  pannello di colore con il punto e l'agenda del capitolo, generata dal **registro delle slide**.
- **Quattro slide d'idea**, una per capitolo del percorso d'acquisto: mockup grande con la pelle
  vera di Trenitalia, una cifra, una referenza, una chiusa. Forma e contenuto in un posto solo
  (`components/SlideIdea.astro` + `data/idee.ts`).
- **Due figure nuove in apertura**: la banda **4% / 96%** e la **cronologia** delle sei date;
  sulla slide dell'internazionalizzazione il **ventaglio dei mercati**.
- **La mappa dei quattro punti** è un filo con quattro fermate, con i paragrafi dietro
  «Scopri come» in forma di `Dettaglio` + figure.
- **Lo strato di profondità** sono le ventidue micro-figure di `components/Figura.astro`,
  recuperate dal ramo `feat/trenitalia-sales-ancore` (fermo dal 27 ott) e **mai pubblicate prima**:
  vivono tutte dentro i blocchi «Scopri come».

**Il registro delle slide è uscito da `admin.astro`** e vive in `src/data/slides.ts`: ogni voce
porta l'etichetta per la console **e** l'ancora per la stanza. La console accende e spegne da lì,
e le copertine di capitolo rendono le stesse voci — l'indice non può più mentire. Il difetto che
ha generato il cambio: la copertina del capitolo 01 annunciava «Il 96% che resta» mentre la slide
che segue, riscritta il 20 ottobre, parlava d'altro; tre capitoli su sette non annunciavano nulla.
**Nessun gate confronta un indice con il suo contenuto**: l'ha trovato una persona.

**Le referenze di clienti terzi** sono due, in `data/sources.ts`, entrambe **aperte e lette il 3
novembre** con i numeri verbatim: **Telmore** (telco, Danimarca) e **Santander Brasil** (banca,
dieci mercati). Non sono del travel, ed è una scelta dichiarata: contano i casi che possiamo
provare. ⚠️ Tre storie del travel — una compagnia di crociere italiana e due compagnie aeree —
sono rimaste fuori perché **la loro pagina non risponde dal nostro percorso di rete** (errore
HTTP/2 da due client diversi; gli slug tentati danno 404). Se servono, servono gli URL esatti.

**Il 96% è tornato**, ed è l'apertura **concordata con il cliente**: l'agenda mandata alla
segreteria il 9 ottobre dice, parola per parola, «Apertura con una sua frase: il 75% degli
stranieri si ferma nel 4% del territorio, il 96% è il mercato che resta». Il 20 ottobre la slide
era stata tolta per una ragione in sé giusta (un dato del TTG 2025 in un documento del 2026), ma
**nessuno aveva confrontato il deck con l'agenda mandata**. Ora c'è, con la data in chiaro e le
due fonti tenute separate: il 96% è suo verbatim (L'Agenzia di Viaggi, 13 ott 2025), il 75%/4% è
un dato di contesto del TTG (Travel Quotidiano, 15 ott 2025) e **non** va attribuito a lui.

**Le otto domande della misura si vedono.** Il deck le contava senza mostrarle mai, e due slide
più avanti citava una risposta — Torino-Bologna — che chi guarda non poteva ricollegare al
campione. Ora l'occhiello dice «domanda 8 delle otto», l'elenco completo si apre su quella slide e
il **referto per intero** (quattro misure × due assistenti) sulla slide dei numeri.

**La voce del deck, dopo il giro del 4 novembre.** Mai «le sue parole»: si cita la fonte e basta.
Mai affermazioni di **assenza** sul cliente («non sapete chi vende che cosa»): si dice quello che
si osserva sul percorso pubblico, e il resto è una domanda. E la riga sui perimetri tiene la
rassicurazione **senza** la mappa delle direzioni, che veniva dai documenti sindacali del 30 marzo:
spiegare a un direttore che cosa non è suo, con in mano le carte interne della sua azienda, invita
un «chi ve l'ha detto?».

**Un fatto corretto che vale fuori da questo deck:** il **prezzo dinamico sulle Frecce è partito
il 1º gennaio 2026** e vale **solo sull'alta velocità** (Altroconsumo, gennaio 2026). «La leva
lavora da anni» era falso, e in quella stanza la data la conoscono meglio di noi.

**I numeri del registro visivo**, prima e dopo: slide con un elemento visivo **da 4/41 a 16/41**;
nessuna slide sopra le **150 parole visibili** (erano cinque, la peggiore a 207).

**Gate al 4 novembre:** `audit:deck` **0 HARD** su 9 rotte × 3 viewport — residuo tutto SOFT
(`a` 17 · `g` 12 · `i` 40, il profilo di un deck ad ancore) · `audit:ink` **PULITO** su 567
blocchi, 13 «Scopri come» aperti e misurati · `copy-audit` **0 HARD** su 401 stringhe ·
`audit:taglio` **ALLINEATO** · `audit:fonti` nessun link rotto · `typecheck` pulito.

**Le due stanze.** L'incontro con la Direzione Sales è **martedì 10 novembre, 12:15–13:15, in
sede a Roma** (verificato in calendario il 3 nov; l'invito risulta ancora *tentative*): in sala il
Direttore Sales, un secondo responsabile Trenitalia e quattro persone Adobe. ⚠️ Una **sessione di
revisione interna con il referente** è stata dichiarata dall'owner per il **5 novembre** e **non è
stata trovata in calendario** *(da verificare)*.

⚠️ **Il verdetto del panel resta quello del 12 ottobre** (§37.7) e da allora il deck è stato
riscritto tre volte — 16-17 ott, 20 ott, 3-4 nov. È la voce **P0** in §10.

⚠️ **Due revisioni interne non ancora chiuse.** La collega che ha mandato il vocale del 3 novembre
dice di avere già condiviso **commenti su un altro deck che valgono anche per questo**, e di
essersi fermata **al primo dei quattro capitoli**: restano tre capitoli da rivedere insieme. Voce
**P1** in §10.

**Nota operativa — come si è letto quel vocale**, perché la strada è riusabile: Centralino **non
indicizza** una conversazione fatta di soli messaggi vocali (l'indice è costruito sul testo), lo
store locale di WhatsApp è **bloccato da TCC** dopo l'aggiornamento a Darwin 27.2.0 (`Operation
not permitted` anche sui media), e l'upload su storage esterno è stato **negato**, giustamente,
trattandosi del messaggio privato di una collega. La trascrizione è stata fatta **in locale** con
`whisper.cpp` (modello `medium`, `brew install whisper.cpp` + modello da Hugging Face) su un `.opus`
esportato a mano: l'audio non è mai uscito dalla macchina. ⚠️ La trascrizione **sbaglia i nomi
propri**, come sempre.

### 37.15 Il 6 novembre: i tre livelli, i quattro giri, e la referenza che mancava

Giornata lunga, **sette commit**, e tre cose che vale la pena sapere prima di rimettere mano a
questo deck.

**Dove sta Adobe — i tre livelli.** Il rilievo del dry run si misurava: tutte e sei le istanze di
`CheServe` stavano in `slot="nota"` di un drill-down. Ora ogni idea porta **capability** (che cosa
bisogna saper fare, in termini di business) e **prodotti con lo stato**, e `idee.ts` *referenzia* i
gruppi di `SERVE` invece di ricopiarli: il contratto resta letto in un posto solo. La mappa intera
(`MappaIdee.astro`) si proietta in chiusura e si apre a richiesta sulla slide dei quattro punti; la
**bussola** (`Bussola.astro`) dice «siamo qui» sul divisore dei quattro capitoli che *sono*
un'idea. Ogni prodotto ha un colore stabile (`COLORE_PEZZO`) **nel punto e non nel nome**, perché
il colore del nome collide con quello dello stato e a corpo piccolo scende sotto AA.

**`/umanizza`, i quattro giri.** Giro 0: nove slide riscritte, e il difetto peggiore era una slide
che **contraddiceva la nostra stessa misura** tre slide prima. Giri 1-3: telai fermi a 18, perni
su `rete` da 7 a 0, e il Giro 3 ha riaperto **le due referenze che nessun gate riesce ad aprire** —
trovando una deduzione nostra spacciata per fatto di Telmore e una cifra di Santander che diceva
più della fonte. Registro completo in `docs/Ferrovie/UMANIZZA-giro0-prospettiva-sales-2026-11-06.md`
(git-ignorato).

**La referenza sul canale agenziale.** Era l'unica delle quattro idee senza, ed è quella su cui si
fa la richiesta. Ora c'è **Unipol**, con la regola delle due fonti separate: la **scala** dalle
loro pagine col link, il **meccanismo** dall'intervento ad Adobe Summit 2026 (sessione CP16),
citato senza link. ⚠️ **Nessuna metrica è attribuita a loro**: quelle della sessione misurano la
velocità dell'analisi, non il venduto per rete. ⚠️ Le cifre del deck del Summit sono **superate
dalle loro stesse pagine**. ⚠️ Non si dice «quotazioni»: nei materiali il preventivo sta solo sui
flussi digitali del sito. ⚠️ **Resta da coordinare con il thread del case study Unipol**, che è in
lavorazione e deve ancora chiedere il materiale al cliente (voce nel backlog, Parte 2).

**Tre trappole che questo giro ha trovato, e che valgono per ogni deck.**
1. **Due drill-down aperti insieme sfondano la slide, e `exp` non lo vede** — ne apre uno per
   volta. Risolto nel motore con `gruppo` su `HowItWorks` (fisarmonica), non con le spaziature.
2. **`build-assets` riscrive `provenance.json` con i soli slot generati**: dopo un giro parziale
   va ricomposto a mano, se no le voci degli altri asset spariscono.
3. **Schiarire un asset condiviso rompe il contrasto altrove**: `bg-journey` fa da fondo anche a
   sei slide di contenuto, e il primo tentativo ha portato nove blocchi sotto AA. Gli sfondi
   chiari sono asset **separati**, usati solo sui divisori.

**Le note per chi presenta** vivono in `/relatore/` e sono linkate dalla console. Si generano dal
registro delle slide: una slide senza nota compare in rosso. ⚠️ **Sono pubbliche come il deck** —
niente dati di contratto, niente nomi, e **nessuna indicazione su che cosa non si nomina in quella
stanza**: quella parte resta nel dossier riservato, e chi presenta la legge da lì.


## 38. TIM — «Una campagna, molti formati» (stato di fatto, 12 ott 2026)

`apps/tim-contenuti-su-scala` · tipo **Prospettiva** · 4 capitoli · accento `#004691` ·
`defaultPublished: false`. **Non è lavoro di questa sessione**: è un workstream parallelo che
lavora sul ramo `feat/tim-content-at-scale`. Qui si registra solo quello che è verificabile nel
repo, perché il suo stato ha smesso di essere privato di quel ramo.

⚠️ **Come ci è finita su `main`.** L'11 ottobre un `git add -A` lanciato mentre il working tree era
su quel ramo ha incluso **18 file di TIM** in un commit di Trenitalia, che è stato pushato e
**deployato**: l'app risponde **200** su GitHub Pages ed è registrata in `deploy.yml`, nello hub,
nello showcase (spenta) e in `deck-routes.ts`. L'errore è stato dichiarato subito e il working tree
è stato restituito a quel ramo senza toccare i loro file. **La decisione su che cosa farne è
dell'owner** e sta nel backlog: togliere i file da `main`, togliere solo la card dello hub, o
lasciarli. Finché restano, valgono per quell'app le stesse regole delle altre — panel review
compresa, che non è mai stata lanciata.

**La regola che resta, ed è la parte utile dell'incidente:** in questo repo **non si usa
`git add -A`**, e si verifica il ramo prima di ogni commit. I file si elencano uno per uno. Dove
due lavori insistono sullo stesso tree, il commit si fa da un **worktree separato** sul ramo
giusto — è così che sono stati fatti i commit del 12 ottobre, senza sfiorare il lavoro altrui.

---

---

### 37.17 La sera del 6 novembre: l'ask cambia, contro il verdetto del panel

**La mezza giornata sui dati della rete agenzie esce dalla richiesta.** È una decisione
dell'owner **contro** il verdetto appena incassato: quella voce era l'unica che tutte e sei le
personas avevano messo fra le «non toccare», ed era l'unica cosa che il Direttore Sales poteva
concedere da solo. La ragione sta agli atti perché fra un mese serve: quella sessione è già
intrinseca al lavoro che corre con il presidio digitale e con la società tecnologica del
Gruppo, quindi a lui non chiede niente che non stia già succedendo.

Al suo posto **tre cose che può dare solo lui** — `rotta/slide-passo`, «Confermate la rotta, e
portateci al tavolo»: il riscontro sulle priorità, gli spunti che non abbiamo raccolto, e un
posto al tavolo quando si pianifica l'offerta integrata. La chiusa porta il confine («non
chiediamo di cambiare chi vi accompagna»): **in slide un nome di terzi non ci va.**

`rotta/slide-esito` cambia soggetto insieme all'ask: da «che cosa esce dalla sessione» a **che
cosa va previsto perché una rotta diventi un piano** — la base che c'è già, le due voci da
prevedere, l'indicatore su cui si vede l'effetto. Niente listino: le capacità, non i prodotti
in corpo grande. **Dieci righe cadevano con la mezza giornata** e sono state riallineate (due
divisori, la chiusa delle domande, la mappa del taglio corto, il capitolo 04, quattro note per
chi presenta, tre etichette di registro).

**Quattro giri di `/umanizza`**, registro in cartella d'account. Due cose che solo i giri hanno
preso, e sono tutte e due di quelle che nessun conteggio dà:
- dopo il Giro 0 le due slide avevano la **stessa forma** ed erano consecutive. Le tre voci
  dell'esito non sono parallele, sono una **progressione**: diventano un filo a tre fermate,
  che porta anche la figura che mancava al capitolo (`audit:ritmo` segnalava quattro slide di
  fila senza un elemento visivo). ⚠️ `--cols` va dichiarato, o con tre fermate si ammassano;
- «quello che si aggiunge è **poco**» era un giudizio che la slide non dimostra, e in sala si
  contesta in un secondo. Adesso dice «sono due voci».

⚠️ **Trappola di metodo, e vale per ogni app**: lo spazio unificatore scritto come carattere
dentro un heredoc viene **appiattito a spazio normale**, e il legame non si forma. Non si vede
in nessuna diff — lo prende solo `audit:wrap`. Si scrive come codice.

**Gate**: `copy-audit` 0 HARD e **0 SOFT** su 554 stringhe · `audit:deck` **0 HARD** ·
`audit:ink` PULITO · `audit:taglio` ALLINEATO · `audit:wrap` 17 contro 18 di baseline, con
`rotta` pulita · `astro check` 0 errori. Gulpease della pagina `rotta` 67,8 → 68,7, e resta la
più bassa del deck.

**Aperto**: il taglio corto è a **9 slide** contro un massimo dichiarato di 8 (SOFT `c4`). Le
due in più sono volute — la richiesta e che cosa va previsto, in un file che si legge senza
nessuno accanto: si decide se alzare il massimo o tagliare altrove.

---

### 37.16 Il panel del 6 novembre — due giri, e due regressioni fatte dalle correzioni

**Il P0 che stava agli atti dal 4 novembre è chiuso.** Il verdetto precedente era del
**12 ottobre** e da allora il deck era stato riscritto quattro volte: di quello che va in sala
il 10 novembre il panel non aveva mai visto niente. Sei personas cieche
(`PANEL-PERSONAS-SALES.md`), fact-checker e arbitro, **due giri**, nessun agente perso.
Verdetti e grezzi in `docs/Ferrovie/PANEL-VERDICT-2026-11-06-round{1,2}.md` e
`docs/Ferrovie/panel/2026-11-06-round{1,2}/` (git-ignorati). Commit `7abb952` → `791fb1d`.

| asse | giro 1 | giro 2 | Δ |
|---|---|---|---|
| credibilità dei fatti | 3,2 | **3,7** | +0,50 |
| rilevanza per me | 2,8 | **3,7** | +0,84 |
| chiarezza | 4,0 | **4,0** | — |
| rischio *(5 = nessuno percepito)* | 2,3 | **3,3** | +1,00 |
| azionabilità | 3,2 | **3,8** | +0,66 |

Sei «accetto a condizione» su sei in tutti e due i giri — e al 12 ottobre la Direzione Sales
era un «sì», quindi la riscrittura di quattro settimane **era costata il sì**. Al secondo giro
la richiesta la accettano tutti e sei; quello che non accettano è che il documento giri.

**I quattro rilievi che nessun gate poteva vedere.**
- **In 43 slide non compariva la piattaforma che il Gruppo ha già scelto** per il dato di
  cliente, e il nostro interlocutore ne è sponsor pubblico. Cinque personas su sei, tre
  dichiarano che senza quella slide il file non lo inoltrano. Nasce `domanda/slide-innesto`:
  che cosa resta dov'è, che cosa si affianca, dove passa la cucitura — citando il **loro**
  comunicato del 5 marzo 2026, senza giudicare quella scelta. Lo stesso comunicato porta
  «acquisto biglietti tramite agente AI» fra i traguardi dichiarati per il 2026, e **sostituisce
  una riunione come fonte** della riga del capitolo 03: «ce l'avete detto voi» non si mostra.
- **Il numero grande del capitolo sulle agenzie non erano le agenzie.** Sei personas su sei, e
  sopravviveva dal 12 ottobre: i «oltre 70.000» sono i punti vendita sul Regionale fuori dalle
  biglietterie, da un comunicato del 2014. Ora la cifra è **12.400**, è loro, è dell'ottobre
  2025; i 70.000 restano in nota dove si possono spiegare.
- **La richiesta si fermava un passo prima di diventare una data.** La formula dell'ask è fra
  le cose da **non toccare** per tutte e sei; nasce `rotta/slide-esito` subito dopo: che cosa
  vi lasciamo, chi serve nella stanza, il numero che guarderemmo.
- **Quattro capitoli su sette stanno nel perimetro di altre direzioni**, e la cautela stava in
  un posto solo. Ora due parole sotto ogni fermata della mappa e una riga su ogni divisore.
  ⚠️ **Non torna la mappa delle direzioni tolta il 4 novembre**: si dichiara come stiamo noi al
  tavolo, non che cosa è di chi. Elencare a un direttore ciò che non è suo, con in mano le
  carte della sua azienda, è l'errore che quella rimozione aveva chiuso.

**⚠️ E DUE REGRESSIONI, NATE DALLE CORREZIONI DEL PRIMO GIRO.** Vanno agli atti perché sono la
stessa classe di errore che il panel esiste per trovare, e questa volta l'ha introdotta la
correzione — il secondo giro serve a questo, e qui si è ripagato da solo:
- **una citazione fabbricata**: per datare il 96% la riga è diventata «il resto: *"il mercato
  che resta"*, sue parole dell'ottobre 2025». Quella stringa non esiste in nessuna fonte — il
  verbatim è «quel 96% del territorio italiano non ancora esplorato» — e al primo giro la riga
  **non aveva virgolette ed era giusta**;
- **un numero inventato al posto di un limite inventato**: «12 lingue in disponibilità generale
  più 5 in beta», dove le note di rilascio dicono solo «supports 12 languages». Il limite
  originale («lavora in inglese») era falso **a nostro danno**; la correzione ha sbagliato
  nell'altra direzione. In slide va il numero che la formula porta, con la data della voce.

**Difetto di motore trovato dal gate**, e vale per ogni app: nel markup di un `.astro` la
sequenza `\u00a0` **non è un escape** — finisce in pagina come testo. L'ha preso `audit:taglio`,
che l'ha letto come «00», cioè un numero che il taglio afferma e il percorso intero no.

**Gate finali**: `copy-audit` 0 HARD e **0 SOFT** su 544 stringhe · `audit:deck` **0 HARD**
(76 soft, `a`/`g`/`i`, come alla baseline) · `audit:ink` **PULITO** su 806 blocchi e 14
drill-down · `audit:taglio` **ALLINEATO** · nessun link rotto · `astro check` 0 errori.

**⚠️ Quattro punti aperti, e due vogliono una persona.**
1. **Una voce della griglia è marcata «già vostro» su cinque slide**, e il fact-checker non la
   trova nell'installato verificato, mentre il commento nel codice dichiara il contrario.
   **Due fonti interne in conflitto**, e si riporta il conflitto: lo scioglie chi tiene il conto.
   È l'affermazione a più alto rischio del documento, perché dice al cliente che cosa ha già
   comprato. In più il link sotto quella voce documenta **un prodotto diverso** da quello che la
   riga nomina. Quale voce, e con quali fonti, sta nel verdetto in cartella d'account.
2. **La pastiglia dice «già vostro · nel contratto»**, e l'intestazione di quelle righe non è
   la società che siede in sala ma un'altra del Gruppo: detta così attribuisce a un tavolo un
   contratto che sta altrove. Il cambio è di tre parole sull'etichetta dello stato; la
   formulazione esatta sta nel verdetto, in cartella d'account.
3. **`PezziPerStato` ha le cautele e non le mostra**: `descrizioni` non è passato da nessuna
   pagina, quindi «c'è già nel gruppo, da estendere» non si legge e resta «già vostro».
4. **L'estratto chiesto non contiene il numero promesso**: `slide-passo` chiede il venduto per
   agenzia, `slide-esito` promette anche il peso dell'intermediato sul diretto, che esce da un
   altro sistema. E le 6.000 agenzie estere passano dai sistemi di distribuzione: il venduto per
   singola agenzia lì non è dato loro.

---

### 37.14 La notte del 4-5 novembre: rielaborazione del testo, e il panel che non si è potuto fare

**Stato: pronto per la sala, con quattro decisioni aperte.** Giro integrale sulla copia:
tutte le **468 stringhe rese** su 41 slide e 9 rotte riesaminate, estratte dal DOM con i
drill-down aperti (non dal sorgente). Modificate 34 stringhe più tre legature; il registro
completo, con il motivo di ciò che è rimasto, sta nel documento di lavoro in cartella
d'account.

**Il capitolo degli assistenti ora dice quello che la misura dimostra.** Il titolo è il
confronto fra i due motori e le due cifre stanno affiancate con lo stesso peso: con una sola
in evidenza la slide sembrava dire «gli assistenti non vi citano», cioè il contrario del
risultato. Fuori due affermazioni che la misura non sostiene (il legame con la lingua, e il
prodotto che «torna vostro»); dentro la superficie davvero misurata e la dichiarazione che la
schermata del mock è un esempio. Via la promessa di rifare la misura «davanti a voi».

**Tono.** Tolte le ultime due affermazioni di assenza sul cliente, due righe che riducevano
il ruolo dell'interlocutore, un frammento a effetto e una costruzione simmetrica.

**Misure.** Gulpease 76,1 → **76,7** · perni retorici 7 → **4** ogni 100 stringhe · telai 30
(7,6%) → **18** (4,5%). Il capitolo peggiore passa da 50 perni/100 e Gulpease 68,5 a **0** e
**76,4**. Nessun marcatore **spostato**: scendono entrambe le famiglie.

**Gate finali**: `copy-audit` 405 stringhe 0 HARD e 1 SOFT (la sola riga protetta
dall'owner) · `audit:wrap` 46 = baseline · `audit:taglio` ALLINEATO · `audit:deck` **0 HARD**
· `audit:ink` PULITO su 573 blocchi e 13 drill-down · `audit:fonti` 0 link rotti ·
`audit:ritmo` 73 = baseline · `astro check` 0 errori.

**Difetti chiusi.** La riga di fonte non si sovrappone più alla firma co-brand a blocco
aperto: il contorno arretra su `html[data-hiw-open]`, che è la leva prescritta — il check `b`
quella collisione non la vede, e andava misurata a mano. Lo stato di disponibilità di un
prodotto esce dalla slide, per coerenza con la decisione già presa sull'altro.

⚠️ **Trappola annotata.** Stringere gli spazi su `html[data-hiw-open]` per recuperare un
pixel ha prodotto **36 HARD**: `0.6rem` sta sotto i 16px che il check `g` pretende fra due
blocchi impilati. Si taglia la copia, non lo spazio.

⚠️ **IL PANEL NON È STATO ESEGUITO, e resta P0.** Lanciato con i ritratti giusti
(`PANEL-PERSONAS-SALES.md`, sei personas, non quello dell'altra experience FS), pacchetto di
evidenza completo, sei personas più il fact-checker: **tutti e sette gli agenti sono falliti
sul limite di spesa dell'account**, zero verdetti. Al suo posto è stato fatto il **solo
fact-check, a mano, sulle stringhe modificate**, che ha trovato un rilievo reale e l'ha
corretto. Il panel va rifatto quando il limite si libera. ⚠️ I ritratti descrivono ancora il
deck come «27 slide» e il filo vecchio: vanno aggiornati prima del prossimo giro.

**Non verificato, e dichiarato**: le due referenze di altri clienti Adobe (le pagine non si
aprono nemmeno da browser vero) e l'itinerario del mock via Ferrandina (nessuna fonte).

---

