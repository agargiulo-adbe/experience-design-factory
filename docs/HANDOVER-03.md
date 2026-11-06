# Handover — Parte 3 di 21
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 11. Change log recente

### Change log — i tre livelli, i quattro giri di `/umanizza`, la fisarmonica nel motore e la referenza che mancava (2026-11-06) → §37.15 (Parte 16)

**Sette commit** (`04a718d` `06435dd` `1e36957` `d0f4a57` `062f210` `6a99e9c` `f466943`), quasi
tutti su `apps/trenitalia-prospettiva-sales`, due anche su `packages/core` e sul template.

**I tre livelli — idea, capability, prodotto.** Il rilievo del dry run del 5 novembre era «dove
sta Adobe? Non l'ho vista: siamo troppo sullo sfondo», e si misurava: **tutte e sei le istanze di
`CheServe` stavano in `slot="nota"` di un drill-down**, cioè i nomi dei prodotti vivevano nello
strato della profondità mentre quella stanza li vuole in quello che si proietta. `idee.ts` porta
ora `capability` e `gruppi`, che **referenziano** i gruppi di `SERVE`: gli stati dei prodotti
restano letti dal contratto e vivono in un posto solo. Nuovi `MappaIdee.astro` (la mappa intera),
`PezziPerStato.astro` e `Bussola.astro` (il «siamo qui» sul divisore dei quattro capitoli che
*sono* un'idea). Via lo stato «prezzo già fissato»: l'accordo si rinegozia.

**`/umanizza`, tutti e quattro i giri.** Giro 0 (`06435dd`): nove slide su 36 riscritte. Il
difetto più grave non era un titolo debole — `ricerca/slide-canale` diceva «oggi la risposta manda
altrove a comprare» e **la nostra misura, tre slide prima, dice il contrario** (su ChatGPT il link
è «prenota con Trenitalia»). Giri 1-3 (`1e36957`): i telai sono rimasti **18, identici uno per
uno**, quindi nessun marcatore è stato spostato invece che tolto; su `rete` i perni retorici sono
passati da 7 per 100 stringhe a **0**. ⚠️ Il Giro 3 ha riaperto **le due referenze che
`audit:fonti` non riesce ad aprire** (business.adobe.com blocca gli accessi automatici), quindi le
uniche mai verificate da un gate: Telmore regge e meglio di come lo dicevamo (classifica a mano
9%, del sistema 11%), ma **«con la stessa vetrina di prima» nella pagina non c'è** — era una
nostra deduzione dentro una referenza; e la cifra di Santander **diceva più della fonte**.

**Il motore — due drill-down sulla stessa slide non stanno più aperti insieme.** `HowItWorks`
prende **`gruppo`**: due blocchi con lo stesso nome si escludono a fisarmonica. Serviva perché una
slide può portare due viste **alternative** della stessa cosa, e aperte insieme sommano le
altezze: misurato **105 px oltre il fondo** a 1920×1080, più uno scroll nascosto (check `k`,
HARD). ⚠️ **Il gate non lo vedeva**: `exp` apre una disclosure per volta, quindi la slide passava
tutti e tre i viewport e si rompeva solo in mano a chi le apriva tutte e due. L'ha trovata una
persona, guardando.

**Il motore — lo zoom del deck.** `zoom` sul `DeckContainer`: due comandi − e +, `+`/`-`/`0` da
tastiera, sei gradini da 85% a 140%, la scelta ricordata in `localStorage['edf:zoom']`. Scala la
**radice** e non il browser, così la composizione resta quella verificata dall'audit (lo zoom del
browser cambia la larghezza del viewport e con lei la safe-area). ⚠️ La base della radice si
**legge a runtime**, non si assume: non è un valore solo (18px in proiezione, 20/24/28 sopra i
2000 con `wallScale`), e una base scritta a memoria cambiava la scala anche a zoom 100%. ⚠️
**Opt-in, acceso SOLO nel template**: lo ereditano le experience nuove, le attuali restano spente
— ogni gradino è una composizione diversa e andrebbe ripassata con `audit:deck`. Verificato
inerte dove è spento.

**I prodotti, a colpo d'occhio.** Ogni prodotto ha il suo colore stabile (`COLORE_PEZZO`), così la
ricorrenza si vede: Analytics e Target tornano nel viaggio e nelle agenzie. ⚠️ Il colore sta nel
**punto**, non nel nome — colorare i nomi entra in conflitto col colore che dice lo stato, chiede
due palette per chiaro e scuro, e a corpo piccolo porta metà dei nomi sotto AA. Via anche la
legenda «già vostro, nel contratto · si aggiunge, oggi non c'è» da tutte le slide: spiegava due
simboli che ora si spiegano da soli.

**Le note per chi presenta** (`/relatore/`, linkata dalla console del deck). Per un collega che
apre il deck un'ora prima di entrare in sala: una riga per slide, sempre nello stesso ordine —
*Dillo così · Il fatto · Se chiedono · Attenzione*, incolonnate e colorate per famiglia. **Si
genera dal registro delle slide**, quindi una slide senza nota compare in rosso invece di passare
inosservata. ⚠️ È pubblica come il deck: niente dati di contratto, niente nomi, niente misure
interne, e **nessuna indicazione su che cosa non si nomina in quella stanza** — quella parte resta
nel dossier riservato.

**I divisori che si aprono.** Il problema non erano i prompt: la famiglia `ink` rimappa la
luminanza fra `#141a25` e `#7c8aa3`, quindi il punto più chiaro restava un'ardesia media e
**nessuna immagine poteva uscire luminosa**, «at night» nel prompt o no. Tre slot nuovi (`alba`,
estremo chiaro `#cfd7e4`) per i tre capitoli che aprono una possibilità. ⚠️ Al primo giro erano
stati schiariti **sul posto**: ma `bg-journey` fa da fondo anche a sei slide di contenuto, e
**nove blocchi di testo sono scesi sotto AA**. Ora sono asset separati. ⚠️ `build-assets`
**riscrive `provenance.json` con i soli slot generati**: dopo un giro parziale va ricomposto a
mano.

**Il taglio da dieci minuti, allineato al 100%.** La mappa delle idee rientra nella slide dei
quattro punti come terzo strato dietro «Scopri come» (regola dei due registri: i prodotti sono
profondità); nel taglio invece **diventa una slide**, perché come drill-down non entrava e perché
quella è la versione che l'interlocutore gira al suo capo. Otto slide invece di sette, dichiarate
in `cut-routes.ts` col motivo. Trovata e rimossa a mano una **versione breve orfana**
(`RETE.dopoBreve`): non rendeva più da nessuna parte, ed è il modo esatto in cui i due percorsi
ricominciano a divergere — `audit:taglio` non la vede, perché guarda quello che è reso.

**La referenza che mancava sul canale agenziale** (`f466943`). L'idea sulle agenzie era l'unica
delle quattro senza referenza, ed è quella su cui si fa la richiesta. Ora porta **Unipol**: la
scala dalle **loro pagine** col link («+2.000 agenzie sul territorio», «17,6 milioni di clienti»,
lette il 6 nov), il meccanismo dall'**intervento ad Adobe Summit 2026, sessione CP16**, citato
come intervento e **senza link** perché una sessione non è una pagina che si apre. Tre cose tenute
fuori, e il perché conta più di quello che c'è: le cifre del deck del Summit (2.100 agenzie, 16,8
milioni di clienti) **hanno un anno e sono superate dalle loro stesse pagine**; le metriche della
sessione (−20% troubleshooting, 2× root cause, −90% tempo di analisi) **misurano la velocità
dell'analisi, non il venduto per rete** e sotto una frase sulle agenzie sarebbero la prova
sbagliata; e la **quotazione in agenzia non si dice**, perché nei materiali il preventivo compare
solo sui flussi digitali del sito. Nessun ruolo e nessun nome: il repo è pubblico, e sul titolo di
chi ha parlato il registro d'account segnala un **conflitto fra la sua firma e il profilo
pubblico**, da chiarire prima di usarlo in un documento.

**Gate a fine giornata:** `copy-audit` **0 HARD e 0 SOFT** su 512 stringhe · `audit:wrap` **1**,
falso positivo («IT», codice di mercato in uno `<span>`) · `audit:deck` **0 HARD** su 129 misure
(soft 79, fisiologici su un deck ad ancore) · `audit:ink` **pulito** su 737 blocchi e 14
«Scopri come» aperti · `audit:taglio` **allineato** · `audit:fonti` nessun link rotto, **1 SOFT
dichiarato col motivo** (la homepage di Unipol è davvero il posto dove quelle cifre stanno) ·
`audit:og` PASS · `audit:docs` pulito · `pnpm build` verde su tutte le app · `astro check` 0.

### Change log — `/umanizza` passa a quattro giri: il Giro 0 decide che cosa dice la slide (2026-11-05)

**Un commit** (`de91557`), quattro file di metodo: il comando `.claude/commands/umanizza.md`,
`CLAUDE.md`, `skills/experience-design/SKILL.md` e
`skills/experience-design/references/umanizzazione.md`. Nessuna app toccata, nessun gate rilanciato
(sono documenti).

**Da dove viene.** La rielaborazione del testo della Prospettiva Sales (change log 2026-11-04,
§37.14) era un giro di natura diversa dai tre dell'umanizzazione: non toglieva marcatori, cambiava
**che cosa la slide dice** — gli slogan che nascondevano il dato che li reggeva, le frasi da
rileggere due volte, le cause che la slide non dimostrava. Quel giro adesso ha un nome e sta nel
comando: **Giro 0 — il messaggio**, e viene prima dei tre. Rifinire il ritmo di una frase che dice
la cosa sbagliata è lavoro buttato.

**La regola che cambia, ed è il motivo dell'allineamento.** Il vincolo di lunghezza **±10%** era
scritto in quattro punti come se valesse sempre: ora vale **dai Giri 1-3** e si misura sul testo
uscito dal Giro 0, dove invece **non c'è** — lì serve il testo giusto, non uno della stessa misura.
Se il testo nuovo non entra si taglia, si cambia composizione o si divide la slide, **mai si
rimpicciolisce il tipo** (contratto di leggibilità). Il Giro 0 **si committa a parte** dagli altri
tre, e ciò che cambia una tesi, una promessa o l'ask **non si applica da soli**: va a chi possiede
il contenuto, con la riscrittura pronta.

**I quattro punti allineati**, che prima dicevano «tre giri» e «±10%» senza eccezioni: la voce di
copia (riga 311) e la sezione «Umanizzare è un giro MISURATO» in `CLAUDE.md`; lo **Step 0-bis bis**
e la voce di copia nella skill `experience-design`; il titolo dei giri, la nuova sezione del Giro 0
e i vincoli di riscrittura in `references/umanizzazione.md`.

🔒 **L'esempio prima/dopo dentro il comando è inventato, per scelta.** Il sorgente ne portava uno
vero — nome del cliente, copia di tre slide e i numeri della misura — e il repo è pubblico: è stato
sostituito da un esempio costruito che porta gli stessi tre difetti (lo slogan che nasconde il dato,
la frase farraginosa con una causa non dimostrata, il confronto sepolto nel testo). Verificato riga
per riga: sulle **124 righe aggiunte** non c'è un nome di cliente, una riga di slide o un dato di
misura. La memoria `umanizzare-e-misurato` è stata riscritta sui quattro giri, e al suo interno è
stato corretto lo slug morto `intesa-mutuo` → `intesa-esperienza-cliente`.

⚠️ **I commit sono locali su indicazione dell'owner: niente push.** Dopo questo giro di handover
`main` è **avanti di due** su `origin/main`.

### Change log — Trenitalia Direzione Sales: tutto il deck passa al registro XD, e un giro di revisione prima della sessione (2026-11-04) → §37.13 (Parte 16)

**Tre commit** (`63ab31c`, `2a86721`, `05bf555`), tutti su `apps/trenitalia-prospettiva-sales`.
Il 3 novembre lo strato XD era entrato su **sei slide su trentaquattro** — copertina, apertura e
le quattro idee — e il resto era la pelle vecchia. Il 4 la domanda dell'owner è stata: «è tutto in
modalità visual XD?». La risposta misurata era **no**, e da lì è partita la conversione.

**Il quadro prima di toccare**, perché l'intervento è nato da una misura e non da un'impressione:
XD su **6/34** slide · `audit:ritmo` **4 slide su 41** con un elemento visivo · **cinque slide
oltre le 150 parole VISIBILI** (il testo dietro «Scopri come» non conta: quello è profondità, ed è
lì che deve stare), la peggiore a **207**.

**Le sette copertine di capitolo diventano divisori XD** — titolo grande, fotografia, pannello di
colore con il punto del capitolo e l'agenda generata dal registro delle slide. Ogni capitolo ha
ora **la sua** immagine: erano tutti e sette la stessa, e sette divisori identici non sono un
ritmo. ⚠️ XD compone il divisore per una dominante **chiara** e il titolo prende `--color-ink`:
qui sarebbe uscito ardesia su ardesia — invisibile, e nessun check di layout lo vede. La pelle lo
ribalta, ed è la regola degli inchiostri che si ribaltano con la superficie applicata a un
componente del motore.

**La grammatica XD su tutte le slide di contenuto**: **106 classi** `.ex-*` → `.xd-*`. Non è un
rinomino estetico — porta le regole di leggibilità già pagate — e ha **scoperchiato due difetti
veri che la pelle vecchia nascondeva**: su una slide di **marchio** l'occhiello e la riga di fonte
davano **2,31:1** e **2,58:1**, rosa su rosso. Su una superficie dichiarata l'inchiostro va
esplicito.

**La mappa dei quattro punti** — la spina dorsale del deck — era quattro card di prosa: 207 parole,
la slide più pesante, e proprio quella su cui chi parla deve essere ascoltato. Ora è **un filo con
quattro fermate**, un'ancora ciascuna, e i paragrafi dietro «Scopri come» **in forma di figure**:
quattro paragrafi dentro un drill-down sono lo stesso muro, soltanto nascosto.

**Due blocchi tolti** perché ripetevano la slide che li ospitava e aperti facevano sforare la
safe-area a 1280×800: il drill-down dell'aritmetica (il suo primo fatto è già nel titolo, il
secondo nella slide dell'idea) e una chiusa sul referto. Fra una frase e il campione verificabile
vince il campione.

**`data-stretto` su sei slide**, non su tutte: applicare il respiro stretto ovunque faceva risalire
il check `g` da **9 a 27** rilievi — SOFT, ma è un peggioramento vero del ritmo pagato per un
problema che hanno sei slide su trentaquattro.

**Esito:** slide con un elemento visivo **da 4/41 a 16/41**; **nessuna** slide sopra le 150 parole
visibili.

⚠️ **LA CI È ANDATA ROSSA SUL PRIMO PUSH** (`2a86721` la chiude). Un campo nuovo, `bRiga`, era stato
aggiunto alle quattro voci dei dati ma **non all'interfaccia** — che è dichiarata su una riga sola,
e l'inserimento automatico è finito nei letterali. L'errore a monte è il controllo sbagliato: la
verifica era stata fatta con `npx tsc --noEmit`, **che sui file `.astro` non guarda niente**. Il
controllo di questo repo è `pnpm typecheck`, cioè `astro check`. È la seconda volta che la CI va
rossa su `main` per un gate non lanciato in locale (la prima è nel change log del 9 ottobre).

**Il giro di revisione del pomeriggio** (`05bf555`), chiesto dall'owner slide per slide:

- **Mai più «le sue parole».** Cinque punti attribuivano le frasi alla persona — «la parola che ha
  usato lui», «con le sue parole, non ancora esplorato», «Le sue parole al TTG», «i mercati che ha
  indicato», e il punto del capitolo 01 con «li avete detti, annunciati o decisi voi». In sala
  suona come un dito puntato. **Ora si cita la fonte e basta**: la citazione dall'intervista
  pubblica resta, la cornice che la indica no.
- **Due fatti che non reggevano.** «La leva lavora da anni» era **falso**: il prezzo dinamico sulle
  Frecce è partito il **1º gennaio 2026** — dieci mesi — e vale **solo sull'alta velocità**, mentre
  in quella stanza si vendono tre prodotti; la data la conoscono meglio di noi
  (Altroconsumo, gennaio 2026). E due **affermazioni di assenza sul cliente** — «non sapete chi
  vende che cosa», «chi compone un viaggio è indistinguibile» — che si verificano sulle sue pagine
  prima di scriverle: di che cosa vedano della rete non esiste fonte. Ora la slide dice quello che
  si osserva sul percorso pubblico, e la domanda la fa il capitolo che chiude.
- **La riga sui perimetri resta, la mappa delle direzioni no.** Il panel l'aveva chiesta da tre
  poltrone diverse — dichiarare noi che non tutto si decide lì vale molto — ma elencare quale
  direzione tiene che cosa, citando i documenti sindacali del 30 marzo, è spiegare a un direttore
  che cosa non è suo **con in mano le carte interne della sua azienda**, e invita un «chi ve l'ha
  detto?». È lo stesso errore già corretto su PICO il 15 ottobre. Resta la rassicurazione; i
  confini li traccia lui. Via anche la fonte, che serviva solo alla mappa.
- **Due elementi grafici nuovi.** Le sei date erano in prosa nel lead: ora sono una **cronologia**,
  nella stessa grammatica della mappa dei quattro punti, e si vede che cadono tutte nei prossimi
  diciotto mesi («adesso» è l'unica tappa accesa). La slide dell'internazionalizzazione aveva solo
  testo accanto a una slide con una figura: ora porta il **ventaglio dei mercati** nominati al TTG,
  da un'origine sola.
- **Copertina**: via la riga sui trenta minuti e la nota sulla misura (si dice dopo); «L'ora, come
  la spendiamo» diventa **«Agenda»**. Il ponte sull'internazionalizzazione è riscritto e la frase
  bocciata dall'owner sparisce anche dalla slide dell'idea.
- **Le ancore dei drill-down smettono di ripetere il titolo della card** che le ospita: su otto
  voci, aperto, il blocco diceva due volte la stessa riga e sembrava ridondante.

**Gate a fine giornata:** `audit:deck` **0 HARD** su 9 rotte × 3 viewport (residuo SOFT `a` 17 ·
`g` 12 · `i` 40, il profilo di un deck ad ancore) · `audit:ink` **PULITO** su 567 blocchi, 13
«Scopri come» aperti e misurati · `copy-audit` **0 HARD** su 401 stringhe · `audit:taglio`
ALLINEATO · `audit:fonti` nessun link rotto · `typecheck` 0 errori, 0 warning · build di tutte le
app verde. CI e Deploy verdi, nove rotte su nove a 200.

⚠️ **Il verdetto del panel resta quello del 12 ottobre** e da allora il deck è stato riscritto tre
volte: resta la voce **P0** in §10.

### Change log — Trenitalia Direzione Sales: lo strato XD, le figure recuperate, l'indice che non mente e il 96% che torna (2026-11-03) → §37 (Parte 16)

**Cinque commit fra le 13:04 e le 17:57, tutti su `apps/trenitalia-prospettiva-sales`** tranne il
primo, che è una regola. La giornata ha un filo solo: **il deck aveva profondità e non aveva
superficie**, e metterle insieme ha richiesto prima di separarle a parole.

**La regola: XD e micro-diagrammi sono due registri, e non si sostituiscono** (`fe52899`, BINDING
in `CLAUDE.md` e in `skills/experience-design/references/xd.md`). L'XD è **quello che si
proietta** — immagine, mockup, una cifra, poche parole; i micro-diagrammi sono **quello che si
apre**, piccoli e molti, dietro «Scopri come». Scambiarli non è un errore di gusto: produce una
slide che non funziona nella stanza in cui va. ⚠️ **Nessun gate lo misura**, per questo la regola
sta scritta e non in un check.

**Lo strato XD entra nell'app** (`2a78984`): `@import` del motore più il contratto `--xd-*` coi
valori di Trenitalia e gli alias che XD si aspetta — senza i quali il titolo del divisore eredita
il bianco della dominante e **sparisce sul chiaro**. Due slide diventano una: **la copertina porta
anche l'agenda**, generata da `CHAPTERS`, quindi non può divergere da ciò che si proietta; il velo
è stato ricalibrato (movimento misurato **0,29 su 255**) perché sotto la clip ora c'è un indice di
link e il check `h` li misura come CTA. Nascono **quattro slide d'idea**, una per capitolo, con
forma e contenuto in un posto solo (`SlideIdea.astro` + `data/idee.ts`). Il **ponte
sull'internazionalizzazione** è riscritto perché regga davanti a due letture opposte presenti nella
stessa sala — la parola è del Direttore Sales, ma in azienda c'è chi la legge come traslazione
dell'esistente: l'argomento diventa «quello che costruite per l'Italia è la stessa cosa che vi
porta fuori». Referenze **Telmore** e **Santander Brasil**, verbatim in `sources.ts`; tre storie
del travel **scartate perché la loro pagina non risponde** dal nostro percorso di rete.

**Le ancore e le figure, recuperate da un ramo mai pubblicato** (`c8dee1c`). Il ramo
`feat/trenitalia-sales-ancore` era fermo dal 27 ottobre; riletto con la regola dei due registri in
mano, **non era un'alternativa allo strato XD ma il suo strato di profondità**: ventidue
micro-figure dentro i blocchi «Scopri come» più il giro di ancore che toglie prosa. La misura lo
conferma: `audit:ritmo` passa da **4 slide su 40 con un elemento visivo a 14 su 40**.

**L'indice non può più mentire** (`6eecdf6`, da una revisione interna del 3 nov). Il rilievo: la
copertina del capitolo 01 annunciava «Il 96% che resta» e la slide dopo parlava d'altro. Guardando
il resto, il difetto era più largo: **tre capitoli su sette non annunciavano niente**, e dove
c'era, l'agenda contava tre voci su cinque o sei slide. ⚠️ **Nessun gate confronta un indice con il
suo contenuto: l'ha trovato una persona.** Il registro delle slide esce da `admin.astro` e va in
`src/data/slides.ts`, da cui l'admin accende/spegne **e** la copertina di capitolo rende le stesse
voci. Nello stesso commit **le otto domande si vedono**: il deck le contava senza mostrarle mai e
due slide dopo citava una risposta che chi guarda non poteva ricollegare al campione; elenco e
referto sono divisi, e **la divisione è una misura** — insieme non entrano in nessuna disclosure, e
tre posizioni sono state provate, due scartate dal check `exp` (HARD).

**Torna il 96%, che era l'apertura concordata col cliente** (`be607a0`). Verificando il rilievo,
la cosa è risultata più grave di un indice sbagliato: **l'agenda mandata alla segreteria il 9
ottobre dice, parola per parola, che si apre con il 96%**. Il 20 ott la slide era stata tolta per
una ragione giusta (aprire un documento del 2026 con la dichiarazione dell'anno prima invita a
sentirsi dire «quello lo dicevate allora»), ma **nessuno ha confrontato il deck con l'agenda che
gli avevamo mandato**. Torna nel registro XD, con la vecchiaia del dato gestita come prescrive la
regola: data in chiaro nell'occhiello e nella fonte, e subito dopo le sue parole del 2026. ⚠️ **Due
fonti che non si mescolano**: il 96% è suo e verbatim (L'Agenzia di Viaggi, 13 ott 2025); il
75%/4% è dato di contesto che circola attorno al suo intervento (Travel Quotidiano, 15 ott 2025) e
**non gli si attribuisce**. Non entra nel taglio «In dieci minuti», che resta a sette slide.

**Gate a fine giornata:** `audit:deck` **0 HARD** su 9 rotte × 3 viewport · `audit:ink` **PULITO**
su 521 blocchi · `copy-audit` **0 HARD** su 394 stringhe · `audit:fonti` nessun link rotto ·
`audit:taglio` ALLINEATO · `audit:ritmo` **15 slide su 41** con un elemento visivo.

### Change log — Intesa: il deck del 5 novembre entra nella Storia, lo slug dice l'incontro, e la Factory va in rete (2026-10-30) → §42 (Parte 18)

**Ventiquattro commit fra le 22:35 del 29 e le 08:32 del 30.** L'experience nata il 28 ott come
Storia a cinque capitoli ha **inglobato il `.pptx` da 78 slide** del 5 novembre: un artefatto
invece di due, su richiesta dell'owner. Nove capitoli, 41 slide. Il conto del taglio — −8 agende
ripetute, −35 slide di magazzino, −8 doppioni — e la mappa per funzione stanno in §42.1.
⚠️ L'argomento che ha deciso la fusione è una **contraddizione fra i due artefatti**: il deck
diceva «Giulia è già cliente», l'experience «non ancora» — che è la logica prospect chiesta dal
cliente.

**Gli approfondimenti che mancavano.** Dei quattro componenti dell'ingaggio solo CJA aveva un
affondo: ora ci sono anche **il profilo** (stitching, grafo, consenso, e la scelta fra portare il
dato in piattaforma o interrogarlo nel warehouse), **la regia** (i tre modi di eseguire una
decisione, compreso quello che lascia l'orchestrazione nei sistemi del cliente) e **l'arbitro**
(cinque passaggi, e il confine: non è il sistema di record dell'eleggibilità creditizia).
Verificati su Field Readiness; ⚠️ quel materiale **nomina banche clienti** e lo schema si riusa
mentre i nomi no.

**La revisione critica a dieci punti** ha tolto più di quanto abbia aggiunto: le due slide di
Scenario sono diventate **una**, il cerchio grande del capitolo 05 è **uscito** perché ripeteva il
03, i tre blocchi di CJA erano **due reparti e una lista di cose da concordare** (sostituiti da
quattro domande, una per area operativa), e i quattro casi d'uso sono stati **rifatti**: erano
continuità operativa, a cui si risponde «anche noi facciamo così»; ora dicono che cosa resta fuori
portata quando profilo, decisione e misura stanno in sistemi diversi. Il flusso finisce dove deve
— referenze → CX Analytics → prossimi passi → firma — e `risultati` non punta più a `/`
saltando due capitoli.

**La mappa e la ripresa, e una tecnica corretta a metà dalle prove** (§42.5). Due slide gemelle:
una annuncia le tre cose, l'altra le riprende alla fine. ⚠️ «Dì quello che dirai, dillo, ripeti»
è **folklore del 1908**, non di Aristotele: regge **l'anticipazione** (advance organizer, 0,21
subito e 0,38 dopo tre settimane), mentre **ri-presentare lo stesso materiale è la famiglia con
meno prove** (Dunlosky 2013). Quindi la seconda **non ripete**: tiene la geometria e cambia il
testo, da `src/data/tre.ts`.

**Lo slug dice l'incontro, non il prodotto.** `intesa-mutuo` → **`intesa-esperienza-cliente`**,
rinominato **prima** della pubblicazione perché dopo un link girato si rompe. Giro completo
(cartella, base, pacchetto, rotte dei gate, deploy, hub, showcase, registry MCP rigenerato,
lockfile, migrazioni `0033` e `0034`), più **dodici stub di rimando** nell'hub: il vecchio
indirizzo era già pubblicato e senza di loro darebbe 404.

**La Factory è andata in rete.** Il ramo è stato mergiato in `main` con fast-forward e il deploy è
**success**: le 11 rotte rispondono, i rimandi anche. Con lo stesso giro si chiude il P0 «il ramo
porta due experience e non è su `main`»: anche **Unipol «Cinque domande»** è ora pubblicata.

**Tre difetti trovati mentre si pubblicava, non da un gate.**
- Il **`<title>` si duplicava** su ogni pagina (`Adobe × Intesa Sanpaolo · Adobe × Intesa
  Sanpaolo`): il layout appendeva sempre la firma co-brand, e il documento aveva preso per nome
  la firma. La guardia esistente non poteva vederlo perché il doppione era **dentro** `SITE_NAME`.
  Non si vede dalla pagina: si vede incollando l'URL in chat. Regola estesa in `CLAUDE.md`.
- **`MockAdobe` usava la prop `compatto` senza dichiararla**: tre errori di `astro check` e **CI
  rossa**, mentre la pagina rendeva benissimo.
- Due slide dichiaravano **`data-made-with="Adobe Firefly"` sotto fotografie Pexels**: una
  dichiarazione falsa, tolta. Nel deck quel credito lo portano le sole clip.

**Riservatezza, due voci.** I **sedici riferimenti per nome a un altro cliente Adobe** usato come
riferimento di qualità sono usciti dai commenti del codice (il repo è pubblico): resta il
ragionamento, sparisce il nome. E un P0 dell'handover nominava **tre persone reali** — due
referenti del cliente e un collega — in `docs/HANDOVER-02.md`, che è **tracciato**: ora porta i
ruoli. ⚠️ Non l'ha trovato un gate: `audit:docs` guarda i **percorsi**, non il contenuto.
⚠️ **Resta aperto** il nome nel **messaggio del commit `f97ef53`** e nei diff storici: riscrivere
la history richiede un force-push ed è una decisione dell'owner (P1 nuovo).

**La console porta ai dossier.** Chi apre «Apri console» trovava il deck e non il documento che
gli dice chi ha davanti. I due dossier esistono già e sono di questo cliente: non ne è stato
creato uno nuovo, perché due documenti che preparano la stessa stanza divergono.

**Supabase, applicato.** Le migrazioni `0033` e `0034` erano ferme: la riga `experiences` **non
esisteva**, ed è per questo che la Console non mostrava la card. Applicate il 30 ott. ⚠️ La CLI
non partiva: il binario aveva la **firma non valida** e macOS lo uccideva con SIGKILL — non era
il sandbox (`brew reinstall supabase`, 2.107 → 2.122).


### Change log — Unipol «Cinque domande»: registrata, ripulita dai nomi, e due giri di panel (2026-10-29) → §41 (Parte 18)

**L'experience c'era dalla notte prima e non era registrata da nessuna parte**: nessuna rotta
per l'audit, nessuna card su hub e showcase, nessuna riga nel deploy. Un deck che la CI non
pubblica e che nessun gate misura, di fatto, non esiste. Ora ci sono tutte e sei le
registrazioni, più il seed `0032` che smette di descriversi come uno scheletro da scrivere;
sullo showcase nasce **spenta**, perché nasce da materiale di preparazione riservato.

**Dentro c'era un difetto più serio**: `src/data/domande.ts` nominava **due referenti reali del
cliente**, in un file tracciato su un repo pubblico e in copia che va in slide. Ora portano il
ruolo, verificato sul registro d'account. La regola sta scritta nel commento di testa del file,
non affidata alla memoria di chi modifica.

**Due giri di panel, tutti e cinque gli assi in salita** (dettaglio e tabella in §41.4): il
primo ha trovato la **copertina con la copia del generatore** e **la slide dell'ask vuota**,
cioè i due punti che un gate non guarda mai; il secondo ha trovato che il deck citava due
pagine di Experience League e **faceva i conti solo sulla prima**. Il fact‑check ha corretto
dodici fatti nel primo giro e cinque nel secondo, e ha aggiunto quello che mancava — una skill
documentata che **ingerisce il foglio dei test passati**, cioè la risposta letterale alla
seconda domanda del cliente.

**Due cose non sono diventate testo in slide, e la ragione conta.** La soglia di confidenza del
verdetto non è pubblicata da nessuna parte: è una voce di registro con titolare e scadenza, non
un numero inventato. E un rilievo del fact‑checker è stato **respinto con la fonte** — «il
contesto vive in Notion» è detto dal cliente nel registro d'account. Anche un agente è
un'ipotesi, non un oracolo.

Gate: `audit:deck` 0 HARD su 9 rotte · `audit:ink` PULITO su 329 blocchi · `audit:wrap` PULITO ·
`copy-audit` 0 HARD e 0 SOFT su 463 stringhe · `audit:fonti` nessun link rotto · `audit:og` PASS ·
typecheck 0. In più `pnpm lint` torna a **0 errori**: due `prefer-const` preesistenti in
`scripts/accounts.ts` e `scripts/og-images.ts`.

⚠️ Tutto su `publish/intesa-esperienza-cliente`, che il deploy non pubblica: va su `main` quando si decide.

### Change log — il dossier del 5 novembre, bilingue, e il motore che non traduceva (2026-10-26) → §40 (Parte 18)

**Il dossier interno dell'incontro del 5 novembre.** Quattordici sezioni sopra il motore unico;
il guscio nel repo (trenta righe), il contenuto in `restricted_docs` sotto RLS e il seed
git-ignorato. Ricerca su registro d'account, posta fino a quella mattina, calendario, Radar e
ritratti pubblici. **Due cose sono uscite dalla posta e non dal deck**: la richiesta alla
Business Unit del 26 ott — che porta l'architettura del cliente ricostruita riga per riga e il
caso d'uso in due fasi, con **Isybank nella prima** — e un **secondo tavolo aperto dal
procurement** del Wealth Management il 23. Applicando il seed si è scoperto che la migrazione
`0030` non era **mai stata applicata** al database remoto: stava nel repo dal 23 ott e il buco
si è visto solo da una violazione di chiave esterna (memoria `migrazione-committata-non-applicata`).

**Tre regole nuove per i dossier, da altrettanti difetti del primo giro** (`skills/dossier/`
§0-bis, memoria `dossier-deduce-non-trascrive`). Il documento portava **41 virgolettati**,
quattro citazioni di registrazioni e due minutaggi. **Un dossier deduce, non trascrive**: un
virgolettato trasforma una lettura in una prova, e un riferimento a una registrazione dichiara
come abbiamo raccolto il fatto invece di che cosa sappiamo. Di conseguenza **mai minutaggi** —
esistono solo se esiste una registrazione. E **nel blocco `people` solo le persone del
cliente**: il team Adobe non è informazione per il lettore, perché il lettore *è* quel team; le
decisioni sul nostro lato stanno fra i buchi aperti. Il controllo entra nella checklist di
consegna: due `grep` che devono dare zero.

**Il bilingue del motore era vero a metà** (memoria `campo-fuori-dal-traduttore`). Il dossier
chiedeva la versione inglese, e si è scoperto che `L()` traduceva ogni blocco **tranne
`table`** — intestazioni e celle restavano italiane — e che **otto campi** stavano fuori: la
cifra di una statistica, l'anno di una riga di cronologia, il nome di una persona, il badge di
una voce, l'etichetta e la riga Adobe di un'idea, il tipo e il testo di una fonte. ⚠️ **Il
difetto è silenzioso per costruzione**: un campo fuori da `L()` che riceve una coppia `{it,en}`
stampa **`[object Object]`**, che è testo valido — nessun blocco è vuoto, nessun check scatta.
`audit:dossier` dava **PASS a cinque viewport** con `[object Object]` grande come un titolo in
cima alla prima sezione. Si è visto solo aprendo la pagina in inglese. Corrette anche le
**etichette del guscio**, che erano in italiano fisso (da dire, da non dire, indice, i messaggi
del gate, gli `aria-label`), con la trappola che `.dw-lbl` sta sia nel bottone dell'indice sia
in quello del PDF: tradurli insieme faceva comparire due «Contents» affiancati.

### Change log — «Dove ci innestiamo»: il deck del 5 novembre, e quattro fatti corretti alla fonte (2026-10-23 → 2026-10-26) → §40 (Parte 18)

**Un'experience nuova in tre giorni.** `apps/intesa-innesto`, Blueprint per la Divisione Banca
dei Territori: **23 slide su 7 rotte**, design system letto dal CSS di produzione del cliente
(verde `#258900`, Open Sans). Il cuore è la slide dell'architettura — un SVG con uno strato
HTML di ancore sopra, che **nasce a fasi** sotto le frecce del deck: prima quello che hanno,
poi dove si ferma, poi il pezzo che si appoggia sopra. Geometria **calcolata e non posata a
occhio**: cinque nodi identici di 248 unità che fanno esattamente 1440.

**Il fact check del 24-25 ha corretto quattro cose di merito** (§40.3). Le quattro cifre
pubbliche erano **giuste e la fonte sbagliata**: il comunicato del piano d'impresa esiste e non
le contiene — stanno in una dichiarazione del Gruppo di febbraio 2026, che per giunta dice
«prodotti **per i privati**» e «**applicativi** cloud a **fine 2025**», non «infrastruttura».
**«Adobe AI Decisioning» non è un prodotto**: la Product Description di AJO dice che
*Decisioning* è un **add-on**, e il nome era sbagliato in slide, in figura, nel segnaposto
video e nella console (memoria `decisioning-e-un-add-on-ajo`). Il recupero a ritroso di CJA
**non è «sei mesi»**: a regime è 1–30 giorni, i 13 o 25 mesi sono il backfill iniziale. E i due
innesti **poggiano su una base Experience Platform che oggi non c'è**, dichiarata nella slide
che già si chiama «Non è un rifacimento. Non è nemmeno gratis».

⚠️ **Due numeri della figura non avevano fonte** e sono diventati domande (memoria
`un-numero-che-sembra-misurato`): «da 6 a 24 ore» e «cap settimanale». Che il ritardo ci sia
l'ha detto il cliente, quanto sia era nostro; che un tetto ci sia è mestiere, che fosse
settimanale un'invenzione. **In un diagramma un intervallo numerico si legge come misurato**
qualunque cosa dica la didascalia — e il 5 novembre in sala c'è chi quel numero lo conosce.

**Il guscio sensoriale acceso e misurato** (§40.4): sette sfondi Firefly e due clip in loop. Il
primo giro di sfondi aveva **la luce al centro**, cioè dove va il titolo. Le clip sono ricucite
(la chiusura derivava e ha chiuso il giro in `--boomerang`), e il velo è misurato sul punto più
chiaro sotto il titolo: **5,19:1 nel caso peggiore** contro i 3:1 richiesti. **Il marchio** era
ancora il segnaposto del template, con il commento «da sostituire» nel file: ora è l'innesto, e
la gerarchia sta nel **peso del tratto** perché a 16px l'opacità faceva sparire la linea.

### Change log — ancore, non prosa: la regola entra nel template, nei gate e in tutti i deck (2026-10-24) → §40 (Parte 18)

**Il drill-down si apre su figure, non su paragrafi.** La regola «ancore, non prosa» era
risolta a metà: la pagina restava pulita e il «Scopri come» diventava quattro paragrafi dietro
un bottone — lo stesso muro di testo, nascosto nel posto peggiore, perché quel blocco in sala si
apre **per rispondere a una domanda**. Nascono `Dettaglio` e `DettaglioVoce` nel motore: per
ogni voce un micro-diagramma che si muove, l'ancora che lo nomina, una riga col fatto. La copia
arriva **per slot e non per prop**, se no `copy-audit` non la vede (378 → 426 stringhe
misurate). Memoria: `drill-down-e-una-figura`.

Tre trappole, tutte misurate: **il corpo va in `rem`, non in `vw`** — il `clamp(rem, vw, tetto)`
vale per il testo *dentro* un SVG, e legato al viewport cresceva il doppio della colonna, con
`audit:wrap` che a 3840 tirava su **22 preposizioni appese**; su schermo basso si restringe **il
disegno, mai il tipo**; e una voce sola va **in riga**, perché a tutta larghezza è
un'illustrazione e ristretta è un francobollo.

**`audit:ink` ora apre ogni «Scopri come» prima di misurare**: a blocco chiuso quel testo non lo
guardava nessun gate, ed è la trappola nota (`.hiw-body` non dichiara un colore). Su Intesa i
blocchi misurati passano da 194 a **241**. Passato anche sugli altri tre deck col drill-down:
`intesa-scala-umana` e `trenitalia-prospettiva-sales` puliti, ⚠️ **`generazioni-maxmara` ha 73
blocchi sotto AA** — cammello su avorio usato come inchiostro, preesistente (P1 nuovo).

**Il template genera la forma giusta dal primo giorno** — un `Dettaglio` a tre figure e un
vocabolario di partenza con cinque meccanismi — e **finalmente dichiara l'anteprima del link**:
scriveva i meta a mano senza `og:image`, così ogni experience generata nasceva col riquadro
grigio. Da 167 a **175 pagine su 175** (memoria `og-meta-scritti-a-mano`). ⚠️ La lezione:
**quando una regola gradua a componente del motore, il template si aggiorna nello stesso giro**,
se no la regola vale per il passato e non per il futuro.

**La coda di frase orfana — famiglia `F` di `audit:wrap`.** `text-wrap: balance` bilancia le
righe e non sa niente delle frasi: un titolo di due frasi si spezza dentro la prima e lascia
una parola più il punto a capo da sole. Sei casi trovati. ⚠️ **Il rimedio non è lo spazio
unificatore**: legare la frase intera la rende inseparabile e sborda (check `c`, HARD). È
`.ex-frase { display: inline-block }`, con due trappole — `vertical-align: top`, e `display:
block` sugli `<span>` di lingua dentro `<T>`, che restano inline e si sovrappongono di quindici
pixel, che è esattamente ciò che il check `e` guarda. Memoria: `coda-di-frase-orfana`.

### Change log — il catalogo del motore, il ritmo, e le slide che si leggono da fondo sala (2026-10-24) → §40 (Parte 18)

**`pnpm deck:catalogo` e `pnpm audit:ritmo`.** Misurato su nove deck: **26 slide su 213 (il
12%) portano un elemento visivo**, e sei deck su nove usano una struttura sola — mentre il
motore ha **30 blocchi e 11 scene di meccanismo** mai aperti. Il repo aveva già imparato questa
lezione **per i `.pptx`** (il catalogo dei 166 layout, i check `D`/`V`/`G`) e per l'HTML non
esisteva né il catalogo né i check. `audit:ritmo` misura `R` due slide consecutive dello stesso
tipo, `G` quattro di fila senza elemento visivo, `V` la pagina coperta. Memoria:
`catalogo-prima-di-comporre`.

**Due difetti del motore trovati usando le scene**, corretti per tutti: `personalize` attenuava
le opzioni scartate a `opacity: 0.2` — testo a **1,5:1 su bianco** — e ora marca `data-scartato`
lasciando il contrasto alla pelle; e una fase non ancora entrata va a `visibility: hidden`, se
no i gate misurano testo invisibile e i lettori di schermo lo leggono.

**Le slide si leggono da fondo sala, e ora si misura** (famiglia `S` di `audit:ritmo`, con
`--sala` a 3840×2160). Il contratto di leggibilità è tarato su 1920, dove il corpo minimo è
l'**1,3% dell'altezza**; `wallScale` alza la radice sopra i 3200 e **non basta**: misurato, a
3840 il corpo più piccolo di una figura scendeva allo **0,97%** — su una parete, che si guarda
da più lontano, il rapporto *scendeva*. Il testo dentro una figura si lega al viewport con
`clamp(rem, vw, tetto)`, mai alla sola radice.

### Change log — la console porta al dossier, l'Intesa trova la sua cifra e un affondo, la Prospettiva dice con che cosa si fa (2026-10-20) → §33.10 (Parte 11), §37.12 (Parte 16), commit `836255f` `171eb5d` `6299f6d` `8ee387a` `4269b4a` `40d50ba`

- **La console porta al dossier** (`836255f`): una prop sola nel motore condiviso — `dossiers` — e **sette console** la passano. Il blocco sta **nel corpo e non nell'intestazione**: lì, a 1280, due dossier e un nome lungo mandavano a capo marchio e badge (misurato su Connessioni Intelligenti). I dossier restano gated: il link non apre niente, porta al login. Il caso cross-app è **Trenitalia Prospettiva Sales**, il cui dossier è nato dentro l'app `trenitalia-connessioni` l'8 ott, prima che l'experience esistesse: il link si costruisce dalla **radice del sito**, non dal base dell'app. Il template delle nuove experience porta il campo già pronto, commentato. Verificato: typecheck 0 errori su 19 app, build intera, ogni rotta linkata esiste nel dist, `audit:og` PASS, e le console senza dossier non rendono nulla.
- **Intesa — la cifra fa il lavoro che faceva la frase, e ogni fonte si apre** (`171eb5d`): la slide dei tre obiettivi era un muro di tre periodi in grassetto più una nota di trentaquattro parole che spiegava i corpi del carattere — vera nel posto sbagliato, e **falsa al primo riflow**, perché su telefono i due corpi quasi coincidono. La distinzione fra la loro parola e la nostra lettura diventa un'etichetta attaccata alla riga che qualifica, sopra un filetto alla stessa quota nelle tre colonne (**subgrid**: `margin-top: auto` allineava il fondo e bastava una riga in meno per sfalsarlo di 26px a 1280). La cifra sostituisce la frase: da ~170 a ~60 parole, bilingue perché «2,5 mln» in inglese è «2.5m». **Le fonti**: i tre obiettivi citavano due documenti non apribili e i 20 miliardi erano affermati senza alcun documento; il comunicato della Divisione Banca dei Territori è stato trovato e verificato (importo, settori, data) e porta le «circa 800.000 piccole e piccolissime aziende clienti della Divisione» al posto di un vago «centinaia di migliaia». Nasce `IsuFonte`: etichetta, una citazione per riga, e **la citazione è il link**; la classe `ex-src` non è cosmetica, senza di essa `audit:fonti` non vedeva nessuna riga di fonte su questa app. Gate: `audit:deck` 0 HARD · `audit:ink` PULITO · `audit:fonti` nessun link rotto · `audit:wrap` PULITO · `audit:taglio` ALLINEATO · `copy-audit` 0 HARD su 372 stringhe.
- **Intesa — tre righe che passavano i gate e non dicevano niente** (`6299f6d`): i gate cercano **segni** (frasi lunghe, subordinate, em-dash), non il vuoto e non il falso, e tutte e tre uscivano con 0 HARD. Un piano cloud non tocca i contenuti ma **i sistemi che li gestiscono** — «quello che gestisce» era stato amputato per far scendere il conteggio parole, cioè tagliato per lunghezza e non per dire meglio; ora la riga nomina i sistemi e porta una **scadenza**. «Si parla a chi non vi conosce ancora» aveva perso il soggetto: adesso sono clienti, e sono i loro. «Tutti e tre passano da quello che il cliente legge» era **falso sul secondo** (il 100% in cloud è un obiettivo di infrastruttura): un tricolon forzato che in sala il CDO smonta in due secondi, e da lì non crede più nemmeno agli altri due. Gate: 75 slide auditate, 0 HARD, soft invariati; `copy-audit` SOFT 32→31.
- **Intesa — le dieci richieste della revisione del 20 ott, e un affondo che prima non c'era** (`40d50ba`): dal parlato della revisione con l'AE e il lead della patch, **non dal riassunto automatico**, che diceva «incontro del 21 ottobre» e sbagliava — il calendario dice **22 ott 16:00 su Teams**, invito del cliente, e il «domani» ripetuto in call è l'evento del 21 sovrapposto parlando. **L'ordine degli obiettivi cambia**: il cloud scende in terza perché è il più lontano dalla conversazione, i 20 miliardi salgono in seconda. **La sintesi che ripeteva** sparisce dal taglio corto; resta la domanda, che è la riga che fa parlare. **Il nesso**, chiesto tre volte in call: una riga sulle copertine invece di un'agenda standard, e una domanda sotto le tre carte — una slide che ELENCA gli obiettivi di chi ascolta è una lezione, la stessa che CHIEDE è un'apertura. **L'affondo sul decisioning**: quattro slide, rotta a sé fuori dai capitoli, a un clic dalla slide che lo riguarda (la posizione — uno strato in più, e la colonna che conta dice che cosa NON si tocca; che cosa legge e che cosa decide; i due punti da verificare su un'architettura vera; come si prova senza spostare niente), e chiude sulla domanda competitiva che il registro segna come aperta. **Fuori deliberatamente**: la leva commerciale discussa in call, non confermata per iscritto — un documento che il cliente può girare non è il posto dove scriverla. **La filiera** porta i due capi, dal brief alla pubblicazione, fuori dal binario delle tre tappe. `IsuFonte` impara le **fonti non pubbliche**: si citano dicendo che cosa sono, senza link. Gate: 88 slide-viewport, 0 HARD (soft a 38→36, i 19→14) · `audit:ink` PULITO su 316 blocchi · `copy-audit` 0 HARD su 450 stringhe, SOFT 32→21.
- **Un attrezzo nuovo, di tutti i deck**: `pnpm deck:pdf --app <alias>` (`40d50ba`, `scripts/deck-pdf.ts`) **non stampa la pagina, la fotografa** slide per slide e impagina gli scatti — un deck `fixed inset-0` mandato in stampa dà una pagina sola e il resto sparito. Nasce da un bisogno misurato: in quella stessa revisione la condivisione schermo si è inchiodata **due volte**.
- **Trenitalia Prospettiva — ogni idea dice con che cosa si fa, e quasi sempre è roba che hanno già** (`8ee387a`): il feedback dopo la presentazione, punto per punto. **L'apertura citava il 2025** mentre le due slide dopo erano già sul TTG 2026 — aprire un documento del 2026 con la dichiarazione dell'anno prima si fa rispondere «quello lo dicevamo allora»; ora porta le sue parole del **15 ottobre 2026**, verificate sull'articolo, e dove dice di investire: i canali digitali diretti. **«Che cosa serve, concretamente» su ogni idea**, sei blocchi con lo stesso titolo ovunque, dentro il drill-down perché la slide regga anche chiusa; la legenda ha **tre stati e non due**, perché l'accordo quadro arrivato quella mattina fissa il prezzo di prodotti non ancora acquistati — dire «si aggiunge» di qualcosa che ha già il suo prezzo nel contratto sarebbe falso in difetto (letto sul contratto: Firefly arriva con le postazioni Creative Cloud, Workfront ha il prezzo bloccato). **La data collaboration ha una slide sua** invece di una riga di fonte in fondo. Nel capitolo del contenuto entrano **Firefly e Workfront**, e il paragrafo del drill-down era **bianco su fondo chiaro** perché il corpo non dichiarava un inchiostro suo: nessun check lo vedeva. **Il canale delle agenzie** era l'unico senza i prodotti dietro. Due slide nuove registrate nell'admin, perché con il blocco aperto le due d'origine uscivano dalla safe-area e **il contratto dice di dividere, non di rimpicciolire il tipo**. Gate: `audit:deck` 0 HARD su 9 rotte a tre viewport con ogni disclosure ri-misurata da aperta · `ink` PULITO su 347 blocchi · `copy-audit` 0 HARD e 0 SOFT su 273 stringhe.
- **Trenitalia Prospettiva — la trascrizione dice che su WhatsApp non si compra, e il deck lo diceva** (`4269b4a`): riascoltata la call per intero, **476 segmenti**, non il riassunto automatico, che su questo punto era vago. Il deck scriveva «dentro WhatsApp l'assistente porta al carrello»: in riunione la parola «vendono» è stata **corretta a voce da chi l'aveva detta** — è un canale di assistenza che rimanda il link su app e sito, provato a mano. Era un conflitto fra due fonti nostre (la pagina CartaFRECCIA Oro lascia intendere l'acquisto, la prova diretta dice di no): **vince la prova diretta**, e la fonte ora porta il conflitto scritto perché nessuno lo rifaccia. **LLM Apps è pull, non push** — è il viaggiatore a richiamare l'app nella conversazione, non pubblicità dentro ChatGPT: era la domanda rimasta aperta più a lungo. **Il DAM non è del marketing di Trenitalia** ma di un'altra società del gruppo: «già vostro» diventa «c'è già nel gruppo, da estendere». **Di Firefly hanno la versione base**, quella delle postazioni Creative Cloud; verificato sull'accordo quadro che i modelli personalizzati non ci sono, né licenziati né a prezzo bloccato.

