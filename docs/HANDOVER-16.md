# Handover — Parte 16 di 19
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

## 39. Il lavoro operativo d'account — registri, Radar, e il giro di ogni mattina

Nato il **12 ottobre 2026** e completato il **13**. Non è una experience: è lo strato con cui
si lavora sui conti cliente — mail, analisi, rinnovi, blocchi contrattuali — dentro `docs/`,
che fino al 12 ott serviva due mestieri senza distinguerli.

### 39.1 La falla da cui è partito tutto

Le cartelle cliente erano escluse da git con un **elenco a mano nel `.gitignore` di root, una
riga per cliente**. Ogni cliente nuovo nasceva **esposto** finché qualcuno non si ricordava
della sua riga — e il 12 ott una cartella arrivata quel giorno, con footprint e dashboard di
consumo del cliente, **non era ignorata** (verificato con `git check-ignore`). Il repo è
pubblico e `main` fa deploy automatico; nulla era mai stato committato (`git ls-files docs`),
ma bastava un `git add -A`.

Ora `docs/.gitignore` è **fail-closed**: ignora tutto e riammette per nome i soli documenti
della Factory, così ogni cliente futuro **nasce protetto per costruzione**. Le sedici righe
nel root sono state tolte. `pnpm audit:docs` (`scripts/docs-guard.ts`) verifica quattro cose,
tutte HARD, **in entrambe le direzioni** — anche la riammissione sbagliata, che è l'altro modo
di aprire la falla — ed è il **primo** passo in CI, non l'ultimo. ✅ La prova dal vivo è
arrivata da sé: una cartella `docs/Ferrero/` comparsa il 12 ott mentre si lavorava era **già
ignorata**, senza che nessuno aggiungesse niente.

### 39.2 Chi possiede che cosa: Radar e registri

Sotto `docs/Adobe/Radar/` vive il **Radar Opportunità**, alimentato a mano da PanoAI (mensile
e trimestrale). Si sovrapponeva ai registri su una materia sola, e la divisione è dichiarata
perché due copie a mano degli stessi numeri **divergono sempre** (lezione già pagata sul taglio
corto di Intesa):

| | Possiede |
| --- | --- |
| **Radar** | i **numeri** e la **struttura**: book di 25 account, ARR, ECC/IMS, team Adobe, prodotti con date di contratto, rinnovi, opportunità aperte, e il **Goal Sheet FY26** con i prodotti **eleggibili** per M1/M2 |
| **`ACCOUNT.md`** | la **storia**: dove siamo, chi ha la palla, i blocchi, i fatti detti in riunione, vincoli e vocabolario del cliente |

Il registro **non ricopia** ARR, date di rinnovo e identificativi: li citerebbe vecchi. File del
Radar: `Mappa_Account/Anagrafica_account.md` (il book), `Panorama_AAAAMMGG.md` (rinnovi,
opportunità, rischi), `Goal_Sheet_FY26.md`, `_PROMPT_PanoAI.md` (i prompt per rinfrescarlo),
`Registro_opportunita.md` (la colonna **«Decisione Antonio» non si tocca mai**),
`alias_cartelle.md` e `Sintesi_Task_storico/`.

**`Sintesi_Task` non si continua.** Era una scansione a mano dei task da email, ALTA/MEDIA/BASSA
per cliente: lo stesso mestiere del registro, e si era fermata dopo due giri nello stesso
giorno. I due file restano come storia.

### 39.3 I comandi, e il file si chiama ACCOUNT.md

`/account-open` (legge Radar → registro → cinque fonti, **riferisce senza scrivere**),
`/account-close` (deposita, diff prima di salvare, propone righe in `Registro_opportunita.md` e
in `eventi.md`), `/accounts` (vista d'insieme). Tutti e tre si trovano con `/acc` + TAB. Fuori
da una sessione c'è la **stessa parola** come funzione di shell: `accounts`, che gira da
qualunque cartella e **a zero token** (lo snippet è in `docs/CLAUDE.md`, non solo in un
`~/.zshrc`).

Il 12 ott «conto» è diventato **«account» in tutto il sistema, file compreso**: i registri si
chiamano `ACCOUNT.md`. ⚠️ **Gotcha che è costato un ripristino:** la prima passata di rinominare
era senza confini di parola, e «contiene» è diventato «accountene», «racconto» → «racaccount»,
«il contorno» → «l'accountrno». Il danno ha toccato il `CLAUDE.md` di root e **venti file di
memoria** dove «conto» voleva dire altro. Niente era committato, quindi git ha restituito i
tracciati; memorie e file ignorati sono stati riparati token per token. Memoria
`rinominare-con-confini-di-parola`.

### 39.4 Le cinque fonti dell'apertura

Outlook e **Teams** (lo **stesso** connettore Microsoft 365: Centralino **non** indicizza né
Teams né la casella Adobe), le **trascrizioni** in `/Plaud` su Dropbox, **WhatsApp** via
Centralino, la cartella dell'account.

Due correzioni di fatto, verificate: **Teams non passa da Centralino**, e la prova è un
messaggio con una decisione commerciale che nessun registro aveva. E su WhatsApp la prima
conclusione era **sbagliata** — la misura giusta, l'inferenza no: il lavoro sta nell'account che
Centralino chiama `whatsapp-personale`, perché **quel numero è il numero di lavoro**, quello
della firma delle mail Adobe. `whatsapp-aziendale` è un archivio fermo al 2022. Memoria
`etichetta-non-e-contenuto`.

Le trascrizioni hanno due regole proprie: stanno **sotto** la corrispondenza nella gerarchia e
sbagliano i nomi propri; e una **menzione di passaggio non è un fatto** — in quella cartella ci
sono anche riunioni interne e colloqui, che non si aprono.

### 39.5 Il giro gratuito di ogni mattina (13 ott)

Il «Radar Opportunità» schedulato il **2 ott** (lun e gio alle 07:30, output su Dropbox) ha
prodotto **zero file** in dieci giorni. La causa, dichiarata dall'owner: **l'account Claude su
cui girava ha esaurito i token del mese** — non un guasto dello scheduler. La correzione ribalta
la priorità: ottimizzare i token non è un accessorio, è **il vincolo che decide se gira**. Quel
design leggeva cinque fonti per 25 account due volte a settimana: **300-500 chiamate a
settimana**, quasi tutte su account dove non si era mosso niente.

Il principio che lo sostituisce: **selezionare prima di leggere**. Tre strati, e solo il terzo
costa token: `pnpm accounts` (zero, legge file locali, vale il 60% — *su cosa guardare*); un
innesco per conteggi (non implementato: serve quando i registri saranno molti); `/account-open`
sui 2-3 account indicati.

Da oggi `pnpm accounts` gira da sé **lun-ven alle 07:30 via launchd** (`pnpm radar:install`
installa o riallinea; `scripts/radar-giro.sh` è la sorgente versionata): scrive **sempre** in
`docs/Adobe/Radar/giri/` — è il battito — e **notifica solo se c'è un rilievo**, massimo cinque
righe, con la cosa più urgente nel sottotitolo.

⚠️ **Il 13 ott il giro è stato riportato allo scopo**, che non era «igiene e rinnovi» ma
**creare occasioni di cross-sell, upsell e relazione**: il Radar aveva già i dati e il giro
leggeva solo i rinnovi. Ora la scala di urgenza è: passo scaduto del registro · evento o
iscrizione che chiude · **trattativa aperta** che chiude entro 21 gg · **salute in rosso**
con la ragione dichiarata · rinnovo entro 30 gg (eleggibile, o su account senza registro) ·
**trattativa ferma** (data passata) · account fermo da oltre 21 gg. Tutto **raggruppato per
account**: tre righe rosse dello stesso cliente sono una notizia sola, e otto righe di
salute su quindici affogavano il resto (da 15 rilievi a 11). Quello che ne è uscito: **12
trattative aperte con una data davanti, $1,7M** (Banca Generali chiude fra 8 giorni con
tre), **4 ferme** ($202K, più 6 oltre i 18 mesi che sono residui di dati), e **14 solution
in rosso o con una data vicina** — fra cui **Telecom Italia con tre solution in rosso e
nessun registro**.

⚠️ **E il 13 ott, più tardi, il giudizio è tornato dentro** — perché la correzione
dell'owner era secca: «il giudizio non è la componente che deve girare su Claude? Io ho
bisogno di giudizio e di consulenza». Aveva ragione: ottimizzare il costo aveva fatto
uscire dal sistema la cosa richiesta, e un consulente che conta e non giudica è un
cruscotto. Ora, **se ci sono rilievi**, il giro passa la propria uscita a `claude -p` e ne
ricava cinque righe — `OGGI` (su cosa lavorare e perché), `NON` (cosa sembra urgente e non
lo è), `CLIENTE` (un'occasione, **solo** dove il radar porta un segnale), `DENTRO` (uno
spunto per l'AE, un collega, il manager), `DOMANDA` — in
`giri/AAAAMMGG-HHMM-consulenza.md`, e **la notifica porta il giudizio invece dei
conteggi**.

Tre numeri misurati: **$0,14 per giro** girando **fuori dal repo** (18.538 token di
contesto) contro **$0,36** dentro (100.821, cioè 75 KB di regole sui deck che lì non
servono) — e il giudizio fuori è **migliore**; circa **$3 al mese**; **zero nei giorni
quieti**, perché senza rilievi il consulente non viene chiamato. E `claude -p` **gira sotto
launchd**, verificato con un job di prova prima di prometterlo. Il radar del 2 ott non è
morto perché Claude costa: è morto per **300-500 chiamate a settimana** su 25 account —
questo ne fa **una**, su un input già ridotto. ⚠️ **Ripiego**: se il consulente tace o
risponde fuori formato torna la notifica dei conteggi, provato con `claude` irraggiungibile;
un giudizio mancato non deve spegnere il segnale. Il primo giudizio vero ha scelto Enel AAM
($243K, Red in due liste indipendenti, 47 giorni) scartando le quattro trattative Ferrari
perché Forms non muove il piano — e ha trovato un buco del radar da sé: **non porta
l'attainment**, quindi la domanda sul gap di piano non può rispondersela.

**`accounts --cross` è la mappa del cross-sell** e sta **fuori dalla notifica di
proposito**: per ogni account del book, quali prodotti eleggibili ha e quali no (208
caselle vuote). Le fonti interne del ruolo dicono di partire **dal segnale del cliente, non
dallo SKU che manca**; presentare quelle caselle come cose da fare sarebbe l'approccio che
giudicano debole. È una mappa da incrociare con un segnale, e il segnale lo trova
`/account-open`.

⚠️ Tre difetti trovati **provando**, non rileggendo: `toISOString()` stampava ogni data con
**un giorno di anticipo** (mezzanotte locale → UTC), e su una data di chiusura un giorno è
la differenza fra arrivare e non arrivare; il parser di P2 leggeva **uno solo dei due
blocchi** che il file ha, e nove account risultavano «non ha niente» pur avendo milioni di
ARR; e il recupero contro il doppione usava `compgen`, un builtin di **bash** in uno script
**zsh**, quindi non proteggeva da niente.

Le quattro soglie originarie restano la base. Gli eventi stanno in
`docs/Adobe/Radar/eventi.md` perché il calendario costerebbe token e **un invito non dice chi è
iscritto a un evento**.

E il pezzo che mancava al tentativo del 2 ott: **il guardiano**. `accounts` avvisa se l'ultimo
giro ha più di due giorni. Quel sistema è morto e nessuno l'ha notato per dieci giorni, perché
l'unico modo di accorgersene era aprire una cartella vuota.

⚠️ **Quattro guasti, tutti invisibili da una shell interattiva** (memoria
`launchd-non-e-la-tua-shell`): in `ProgramArguments` ogni `<string>` è un argomento
**letterale** (`/bin/zsh -lc "$HOME/…"` arrivava con virgolette e variabile dentro → `can't open
input file`); **da `~/Documents` launchd non riesce a ESEGUIRE uno script**, pur riuscendo a
leggerne i file (verificato con un job di prova) — la copia che gira vive in `~/.local/bin`; nel
`PATH` di launchd **non c'è né `pnpm` né `node`** (il giro scriveva 77 byte con `env: node: No
such file or directory`); e **zsh sotto launchd non apre i file del repo** (`operation not
permitted`) mentre node sì, per cui il controllo della deriva fra sorgente e copia installata è
stato spostato in `accounts.ts`. Il criterio di successo è **zero byte di stderr**, non «ha
scritto qualcosa».

### 39.6 Che cosa ha già prodotto

La copertura è passata da **20 account del book su 25 senza registro ($35,5M di ARR)** a **17 su
25 ($28,3M)**, e soprattutto **nessun rinnovo eleggibile resta su un account senza registro**.
I tre registri aperti il 13 ott, scelti dal Radar e non a sentimento:

- **UniCredit** (`docs/UniCredit/ACCOUNT.md`) — Adobe Analytics **$1,48M** si rinnova il **13 dic
  2026** in salute **Yellow**, adoption 4,4, e **nessuna conversazione di rinnovo in posta**. AE
  dedicato nuovo dal 2 ott; la referente si era detta disponibile «dalla settimana del 12». Più
  due cose nascoste nei numeri: **Assets $106K ad adoption 0,0** scade il 4 dic, nove giorni
  prima, e **Target risulta azzerato il 30 set** (da capire se perso).
- **Ferrovie / FS Technology** (`docs/Ferrovie/ACCOUNT.md`) — **Target $409K** si rinnova il **30
  dic** con adoption **0,0**: pagato e non usato, ed è il rinnovo eleggibile più grosso fra gli
  account scoperti. Una ricerca in posta **non trova nulla**: l'assenza di conversazione è il
  fatto. Stesso schema su **AJO $75K, Yellow, adoption 0,0**.
- **Intesa Sanpaolo** (`docs/Intesa Sanpaolo/ACCOUNT.md`) — Analytics **$36K** al **31 dic**,
  l'unico prodotto eleggibile dell'account; il resto (Forms $516K, Sites $400K) è relazione, non
  attainment.

I 17 che restano hanno rinnovi su prodotti **non eleggibili** (`Assets`, `Sites`, `Paid
Support`, `LLM Optimizer`): si aprono quando serve, non prima.

### 39.7 L'AI Forum del 21 ottobre, verificato alla fonte

Dal thread Teams del 9 ott: **455 registrati** (150 clienti, 9 partner), $16,44M di pipeline
toccata, 76% dello stretch goal Italia di 600. **L'iscrizione non ha una scadenza dichiarata, e
questo è peggio di una scadenza**: «è possibile che corporate chiuda le registrazioni a breve».
⚠️ **All'8 ott risultava UN SOLO meeting confermato in tutto l'evento** (su Generali), con tre
executive Adobe presenti: un evento così non è affollato, è una porta aperta. Alla **cena
executive** (55 registrati) ci sono già Agos, Banca Generali, EssilorLuxottica, Ferrero, Credit
Agricole Italia, UniCredit, Unipol. Tutto in `docs/Adobe/Radar/eventi.md`, col percorso del
foglio della guest list — che **resta da incrociare coi referenti**, ed è l'azione con più resa
della settimana.

### 39.8 Il grafo dei contatti — si ricava dalla posta, non si compila (13 ott, commit `9e98de4`)

Il Radar dice **che cosa** sta succedendo su un account. Non dice **a chi scrivere**: porta il
team Adobe (AE, CSM, SC), non i contatti del cliente. La sezione «Chi è chi» dei registri c'era
ma era prosa senza date — ventitré righe su otto account — e da una prosa non si decide niente.

Adesso si **ricava da Outlook**, una passata **a settimana** per account (`1 + N` chiamate), e
ogni riga porta `funzione · nome · indirizzo · ultimo scambio <data> · tema · verdetto — motivo`.
Formato, regola e limiti stanno in `docs/CLAUDE.md` → «Il grafo dei contatti»; il passo che lo
rifà è in `/account-open` (2bis) e scatta solo se il grafo ha più di sette giorni.

⚠️ **Due limiti MISURATI il 13 ott hanno riscritto la regola che il disegno dava per buona.** La
spec diceva «scrivi tu» se il contatto ha scritto *a te* **o tu a lui**; la seconda metà non è
calcolabile:

- **il filtro `recipient:` non distingue il destinatario diretto da chi era in copia.** Tre
  contatti dello stesso cliente tornano con gli **stessi cinque messaggi** di un thread di gruppo
  il cui testo è indirizzato a un **quarto**. Con la regola scritta a tavolino, un invito o una
  cancellazione di calendario rende «tuoi» tutti i partecipanti;
- **la ricerca gira sulla propria casella**: chi parla solo con l'AE o col CSM è **invisibile**.
  Il grafo dice «chi conosci tu», non «chi c'è».

Quindi il verdetto poggia su un fatto che si misura — **ti ha scritto lui** ed entro ~120 giorni
→ «scrivi tu» — più un **giudizio dichiarato** sulla funzione: acquisti, cybersecurity e legale
restano «passa dall'AE» anche se hanno scritto ieri, e il giudizio **vince sul dato** quando i
due divergono. Il motivo si scrive sempre accanto al verdetto: «ultimo scambio a luglio, lo
conosci di rimbalzo» è l'informazione che fa decidere; «passa dall'AE» da solo è un oracolo.

**Il primo grafo, su Enel: sei contatti, tre «scrivi tu».** Il caso che vale la pena conoscere è
la persona più calda — Contract Management, ultimo scambio il 12 ott — che risulta **«passa
dall'AE»**: non ha mai scritto a noi, scrive all'AE e il thread arriva inoltrato. E un contatto
di cybersecurity che *ha* scritto, dentro i 120 giorni, resta «passa dall'AE» per funzione. Nel
giro sono emersi anche un **conflitto fra due fonti** sulla funzione di una persona (registro
contro firma della mail, riportato e non risolto) e la conferma che `docs/Adobe/` sta **fuori**
da questo controllo: non è un cliente.

**Lo strato gratuito lo legge a costo zero.** `pnpm accounts` stampa per ogni account `N contatti
(M tuoi)`, marca quelli in **formato vecchio** come «da rifare» e tiene **una** riga raggruppata
sugli account che hanno un segnale e **nessun contatto noto** — dove un'apertura non si può
costruire. Il parser legge **paragrafi**, non righe: tre formati convivono nei registri e un
bullet che va a capo teneva la data sulla riga di continuazione. I formati vecchi si **contano**
e si marcano, senza indovinare quale metà di «X — Y» sia il nome.

⚠️ Al 19 ott il grafo strutturato esiste su **un account su nove** (Enel). Ferrero e Banca
Generali sono in formato vecchio, e **cinque account con un segnale non hanno contatto noto**:
finché resta così, l'apertura pesca quasi sempre dallo stesso account. Memoria:
`grafo-contatti-dalla-posta`.

### 39.9 L'apertura e il giro di ritorno — a chi scrivere oggi, e la risposta (13 ott, commit `e699676`)

È il pezzo che risponde alla richiesta da cui è partito tutto: non «che cosa sta succedendo» ma
**avvia una conversazione con questo contatto per proporre questa cosa**. `pnpm accounts
--apertura` incrocia i segnali del Radar col grafo dei contatti e propone **una** conversazione,
con quattro campi **obbligatori** — se ne manca uno l'apertura **non esce**, perché una riga
senza destinatario fa perdere tempo invece di farne risparmiare:

| Campo | Che cos'è |
| --- | --- |
| **A CHI** | nome, funzione, «scrivi tu» o «passa dall'AE» **col motivo** |
| **PROPONI** | di che cosa si parla. Uno, non tre |
| **PERCHÉ ORA** | il segnale che la giustifica, con la fonte |
| **MUOVE** | M1, M2 o «relazione» · più `Q4?` e un id `A-AAAAMMGG-N` |

**I candidati** sono gli stessi segnali dei rilievi, nello stesso ordine di urgenza, **meno i
passi scaduti**: quelli sono compiti propri, non conversazioni da aprire con un cliente.

⚠️ **Tre difetti trovati provandolo, non rileggendolo**, e ognuno sarebbe passato per funzionante:

- **«PROPONI AAM» su un account che da AAM sta migrando.** Il segnale era il rischio sul rinnovo;
  stampato come proposta commerciale era **falso**. Ora il campo dice il *verso* del segnale
  («difendere il rinnovo di X», «far avanzare la trattativa su X», «capire il rischio su X») e il
  nome del prodotto resta separato come **chiave** del confronto;
- **salute rossa e rinnovo sullo stesso prodotto erano due aperture** invece di una, e il rischio
  su un rinnovo **eleggibile** veniva marcato «relazione». Fusi — ed è la fusione che dà al
  rischio la data e l'eleggibilità del rinnovo, quindi `MUOVE` e `Q4?` giusti;
- **due lanci nello stesso giorno producevano due aperture.** Ora il secondo rimostra quella
  pendente, **nello stesso formato a etichette**: la notifica della mattina ricava la sua riga da
  quelle etichette, e un giorno con l'apertura in attesa perdeva proprio la riga più utile.

**Il giro di ritorno è il pezzo che vale più di tutti**, perché è l'unico che migliora da sé.
`--apertura --deposita` scrive l'apertura come riga in `docs/Adobe/Radar/Registro_opportunita.md`
con la colonna **«Decisione Antonio» vuota** — quella colonna esiste dal 2 ott e nessuno l'aveva
mai scritta: è esattamente il posto previsto. La risposta si dà a mano o con **`pnpm accounts
--decidi <id> si|no|dopo`**:

- **NO** → quella combinazione (account + contatto + cosa) **non si ripropone più**;
- **DOPO** → torna fra **21 giorni**;
- **SÌ** → resta aperta, e l'**esito lo chiede `/account-close`** (passo **5bis** nuovo);
- **nessuna risposta** → non si ripropone domani, ma **torna dopo una settimana** con lo stesso
  id: una proposta non risposta è più spesso persa che rifiutata.

⚠️ **La colonna non si riscrive mai**, nemmeno per «aggiornarla»: `--decidi` su una riga già
decisa **rifiuta** e stampa cosa c'è scritto. La nota in testa al registro dichiara l'eccezione:
le righe `A-` le scrive il radar, tutte le altre restano a mano.

**Nel giro della mattina** l'apertura si deposita, finisce nel **corpo della notifica** —
«`<account>` · scrivi a `<nome>` — `<cosa>`» vale più di uno spunto interno — e viene **passata al
consulente perché la giudichi**. Provato via `launchctl` il 13 ott sera: il consulente **non è
stato d'accordo**, nel merito — il contatto scelto segue fatturazione e RTCDP, non la leva
commerciale dietro l'attrition, quindi prima si allinea l'AE, che ha già in mano la variante
contrattuale sui volumi — e in `DENTRO` ha **collegato la variante al rischio di rinnovo**, due
cose che stavano in due file diversi. È la tesi del disegno dimostrata dal vivo: selezione
deterministica a costo zero, giudizio dove serve.

⚠️ **Correzione di metodo che costa cara se non si sa.** Provando il consulente con `env -i` la
risposta è stata **«Not logged in · Please run /login»**, e la conclusione «sotto launchd il
giudizio non parte» era **sbagliata**: `env -i` toglie più di quanto launchd tolga (un
LaunchAgent gira nella sessione dell'utente). La prova è **`launchctl start`**, non una
simulazione dell'ambiente. Memorie: `apertura-e-giro-di-ritorno`,
`launchd-non-e-la-tua-shell` (aggiornata).

**Pulizia di riservatezza fatta nello stesso giro**, e vale la pena sapere perché: `pnpm
audit:docs` dichiara di guardare **i percorsi, non il contenuto**. Il controllo umano che delega
ha trovato, in file **tracciati** di un repo **pubblico**, un cliente con prodotto e importo di
rinnovo dentro un prompt, una data di chiusura col nome del cliente, e un **numero di cellulare**.
Tutto sostituito con segnaposto, nessuna informazione utile persa.

**Stato al 19 ott:** una apertura depositata (`A-20261013-1`, Enel) **in attesa di decisione**.
Finché non si risponde, le aperture si accumulano senza ripresentarsi — ed è il solo modo in cui
questo sistema può diventare rumore.
