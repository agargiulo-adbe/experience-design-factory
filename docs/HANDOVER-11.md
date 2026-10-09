# Handover — Parte 11 di 15
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 33. Intesa Sanpaolo — «Su scala umana» (4 ott 2026)

> ⚠️ **Nomi, intelligence competitiva e dati contrattuali non stanno qui.** Questo file è
> tracciato su un repository pubblico: le persone si citano per **ruolo**. Tutto il resto vive
> in `docs/Intesa Sanpaolo/` (git-ignorata) e nel dossier gated su Supabase.

### 33.1 Che cosa è successo

Il 22 ottobre 2026 c'è un incontro di circa un'ora con la **Direzione Sales & Marketing Digital
Retail della Divisione Banca dei Territori** e un **responsabile business development del digital
retail**. Nasce dal passaggio del 10 settembre con l'**AD di Isybank** (§31), che ha consigliato
quel contatto. Una call interna del 2 ottobre ha deciso formato e obiettivo; la trascrizione e la
mail di recap di maggio sono le due fonti primarie, entrambe fuori dal repo.

**L'obiettivo d'uscita non è vendere**: è il consenso a un percorso strutturato di valutazione,
con sponsorship, risorse e tempo del cliente. L'incontro è una **discovery**: la regola decisa in
call è farli parlare il più possibile.

### 33.2 Perché un dossier e non un'experience

La domanda posta era se servisse una fase di dossier **prima** di costruire un'experience. La
risposta, dalla trascrizione: per il 22 ottobre **un'experience non va fatta affatto**.

1. Il formato in sala è già deciso — **quattro slide, non una di più** — e un'experience è
   incompatibile con un'ora in cui l'obiettivo è ascoltare.
2. Il deficit è **di conoscenza, non di materiale**: quattro buchi dichiarati in call (il
   perimetro dell'incumbent del marketing retail, chi ne fa il system integration, se esista una
   gara, il sentiment verso il CRM dell'altra divisione). Costruire sopra quattro buchi produce
   un artefatto bello e vuoto.
3. Fra il 2 e il 22 arrivano **tre fonti di informazione** (un partner il 6, un system integrator
   il 13, forse il referente IT). Un dossier le assorbe in modo incrementale; un deck va rifatto.

L'experience, semmai, è l'**esito** dell'incontro — non il materiale che ci si porta.

### 33.3 L'app minima, e perché NON è generata da `pnpm new:experience`

`apps/intesa-scala-umana/` ha **una sola pagina**: il dossier (orfana, gated, `noindex`). Niente
deck, niente tailwind, niente `@edf/core` — cinque file in tutto.

Il generatore non è stato usato di proposito: registra anche una **card sulla hub pubblica** e
pubblica il deck segnaposto su `/<slug>/`. Una pagina semivuota col nome del cliente sopra,
raggiungibile da chiunque indovini l'URL tre settimane prima di un incontro, non serve a niente e
può solo fare danno. Quindi **non** sono registrati: card hub, voce showcase, `ROUTE_SETS` di
`deck-audit.ts`, `dev:<slug>` in root. Si registrano quando l'experience esisterà.

Conseguenza da ricordare: **`deploy.yml` verifica `…/intesa-scala-umana/dossier/index.html`**, non
un `index.html` alla radice — alla radice non c'è nulla, e il 404 è voluto.

La riga `experiences` esiste comunque (`0020_seed_intesa_scala_umana.sql`, tracciata) perché serve
alla FK di `restricted_docs`: `status='draft'`, `show_in_showcase=false`, **`type` non impostato**
(la colonna arriva con 0016, che potrebbe non essere applicata, e il tipo è una decisione che
segue l'incontro, non da indovinare prima).

### 33.4 Il design system, letto e non ricordato

`pnpm brand:tokens https://www.intesasanpaolo.com` (4 fogli, 805 KB, 4 ott 2026):

- **verde `#258900` · 181 occorrenze** → è il **colore di sistema**. Non è una banca blu.
- verde notte `#0d2901` (46) · verde `#2b8804` (37) · **arancio `#fa9600` (35)** come accento.
- **Open Sans**, dichiarato 59 volte: per una volta **nessuna sostituta**, è distribuibile.
  `ispfont` è il loro font di icone, non di testo.
- I valori Bootstrap 3 trovati nel foglio (`#337ab7`, `#a94442`, `#3c763d`, `#8a6d3b`) sono
  default di framework: **scartati**.

I token stanno in `src/layouts/DocLayout.astro` con il contrasto calcolato accanto a ciascuno.
Nota riusabile: **`#258900` su `#0d2901` dà 3,5:1** — non basta per il testo. L'accento di testo è
la sua schiaritura `#4fc21f` (6,8:1); `#258900` resta per i pieni. È la regola «un accento non è
un inchiostro» (§22) applicata a una palette nuova.

### 33.5 Il dossier

Pagina copiata da `apps/isybank-momento/src/pages/dossier.astro` con `DOC_SLUG` nuovo; i token
`--color-*` di Isybank rinominati in `--doc-*` neutri, così la pagina non si porta dietro la
palette di un altro cliente. **Tredici sezioni**, fra cui: chi c'è nella stanza · la mappa del
potere **marcata come ipotesi** (è una ricostruzione fatta a voce, «io l'ho capita così») ·
l'installato e i contratti (solo lì) · il campo competitivo · le domande da fare in sala in ordine
· say/don't · run of show · **i buchi aperti con la domanda già formulata e la cella da riempire**.

Contenuto e seed: `docs/Intesa Sanpaolo/` (git-ignorata), generatore accanto al seed. Istruzioni
di applicazione in `supabase/migrations/0020_intesa_scala_umana_dossier.README.md` (tracciato).
Applicato al DB remoto il 4 ott; il link firmato sta fuori dal repo.

**Tre difetti trovati guardando lo screenshot, non il codice** — vale la pena ricordarli:

1. il guscio minimo non aveva `[hidden] { display: none !important; }`, e il `display:flex` di
   `.dw-state` batteva l'attributo: **il gate restava a schermo sopra il contenuto**. Negli altri
   deck la regola arriva dal `global.css`, qui non c'era;
2. `&amp;` scritto a mano nel contenuto veniva **ri-escapato** da `richText()` e usciva letterale;
3. il chip «competitivo» era verde come quello neutro — non segnalava nulla — e il chip
   «attenzione» era **bianco su arancio: 2,2:1**. Ora inchiostro scuro sull'arancio (7,1:1) e un
   rosso di allerta per il competitivo (5,3:1).

Leak check sul `dist`: **zero** su sedici termini (nomi, competitor, cifre, «dossier»).

### 33.6 Le quattro slide

`docs/Intesa Sanpaolo/output/20261022_Adobe_x_Intesa_Su_scala_umana.pptx` (+ PDF e PNG),
generate da `output/build/build_slide_22ott.py` **da zero** sul master Adobe 2026 svuotato — non
adattando un deck esistente. Copertina + 4, come deciso in call.

1. **Da dove partiamo** — le quattro direttrici dichiarate dal cliente a maggio e le tre priorità
   di business, rese come «quello che ci avete detto», e la domanda che apre.
2. **Dove ci innestiamo** — il contenuto come primo tempo, il viaggio intero e l'attribuzione come
   secondo. **Nessun competitor nominato, mai, nemmeno nelle note.**
3. **Una banca che l'ha fatto** — Santander Brasil, numeri pubblicati da Adobe.
4. **Come andiamo avanti** — tre passi e la richiesta: un referente, due casi, una data.

**L'angolo, e perché.** In call c'erano tre posizioni non conciliate: andare contro il CRM
dell'altra divisione, attaccare l'incumbent del marketing retail, o completare l'architettura.
La ricerca ha sciolto il nodo: il CRM in questione sta nella **Divisione Corporate & Investment
Banking dal 2008** e la fonte (del vendor stesso) **non cita mai la Banca dei Territori né il
retail**. Attaccarlo davanti a chi è in sala significa attaccare un sistema che non è nel suo
perimetro. Quindi: **l'architettura che completa**, ingresso dal contenuto — che è il mestiere di
chi riceve, e la cosa di cui parla in pubblico — competitor solo nel dossier.

Trappola di `python-pptx` su questo template: il **master delle note è stato svuotato** insieme al
resto, non ha segnaposti, quindi `notes_text_frame` torna `None` e le note si perdono in silenzio.
`build_slide_22ott.py` costruisce il segnaposto a mano (e `insert_element_before` vuole i tagname come
stringa, non passati per `qn()`).

### 33.7 Che cosa resta aperto

Tutto in `§12` del dossier, con la domanda già scritta. In sintesi: il perimetro dell'incumbent
(l'unica fotografia pubblica è del **2017** e chi la raccontava non ricopre più quel ruolo), chi
ne fa il system integration, se esista una gara, e lo stato di un contratto scaduto il 30 settembre.
**L'esito dell'incontro del 13 ottobre è un buco dichiarato per scelta**: chi ha preparato il
materiale è fuori sede dal 10 al 15.

**Chiuso la sera del 4 ott: la mappa del potere.** I nomi che in trascrizione ballavano sono stati
verificati su LinkedIn, e la §04 del dossier è passata da ipotesi a mappa con fonte, distinguendo
le schede complete da quelle laterali (abbreviate e autodichiarate). Tre correzioni che contano:

- **chi fa il targeting commerciale** e **il suo capo** — che guida *servizio sviluppo commerciale
  e CRM* nella Direzione Customer Experience e CRM della Divisione — sono due persone distinte, ed
  erano la stessa casella confusa in call;
- **la persona del recap di maggio non è «il referente IT»**: è **Head of Group Channels**, cioè un
  livello sopra il responsabile canali della Divisione. Era una caratterizzazione sbagliata, ora
  corretta in tre punti del dossier;
- è comparso un **Head of Advanced Analytics della Divisione**: è il nome che va nella stanza se la
  conversazione va sul viaggio intero, e prima non c'era.

E un fatto da usare il 6 ottobre: **due delle persone che contano su questo conto vengono dal
partner con cui si pranza quel giorno** — una ne è stata Partner della CRM Service Line fino al
2007, l'altra vi ha fatto digital marketing per i financial services. Conviene chiedere a loro
invece di indovinare.

**Scadenza vera: venerdì 9 ottobre** (revisione interna), non il 22.



### 33.9 La sera del 9 ottobre — il giro di critica e la copia che non può più divergere
Due commit dopo §33.8, entrambi di verifica e non di contenuto nuovo (`97e9f7b`, `f61eccd`).

**Il giro di critica** (`97e9f7b`). Via «primo/secondo tempo», che dichiarava una sequenza che
nessuno ha deciso: ogni slide di dettaglio porta ora nell'occhiello **lo strato da cui pende**, così
si vede dove si innesta senza chiederlo. La base della pila smette di dire il falso — **Analytics è
già in cloud**, dentro la banca restano solo Experience Manager e Forms. «Vedere il cliente intero,
non il canale» → «**Una persona sola, non cinque conteggi**». **Workfront** entra dove ha una
ragione (richieste, scadenze e passaggi fra agenzie, nella riga di governance della filiera);
**Semrush** torna con il suo numero (~300 mln di prompt reali: ChatGPT, Google AI Mode, Copilot,
Perplexity); **CX Enterprise Coworker** entra sulle quattro domande con la rivendicazione stretta —
la fondazione smette di passare da una scrivania sola. L'ask diventa **una proposta a due**: loro un
referente, due casi e una data; noi le persone, la piattaforma e la risposta scritta. Il marchio
diventa **una scala su una base**, letta dal titolo e resa in geometria (mai una lettera, mai il
logo del cliente), con icone e anteprima del link rigenerate da `pnpm brand:icons`.

**Il taglio da dieci minuti non può più divergere dal percorso intero** (`f61eccd`). Teneva una
copia a mano degli stessi tre blocchi, con scritto nei commenti «se divergono comanda il lungo» —
ed è **esattamente lì** che si erano persi il titolo di uno strato e la correzione su Analytics. I
blocchi condivisi stanno ora in `src/data/contenuti.ts`, definiti una volta e bilingui; la versione
corta è un **campo accanto** a quella lunga, così si può accorciare una descrizione ma non cambiare
che cosa dice la slide. L'ask sta in un posto solo (prima erano tre formulazioni diverse), e il
taglio exec guadagna il bilinguismo che nella copia a mano aveva perso. ⚠️ Stessa sera: il marchio
**dentro la pagina** è un SVG inline che `brand:icons` non tocca — era rimasto alla vecchia pila a
tre barre mentre il favicon era già la scala. Le tre regole che ne escono sono in `CLAUDE.md`.

Verifica dichiarata nei commit: `audit:deck --tv` su 5 viewport **0 HARD** (115 misure nell'ultimo
giro), allineamento lungo/exec verificato **sul dist** confrontando i testi resi, screenshot a 1920
letti. ⚠️ Il **P0 del panel resta aperto e pesa di più**: il deck è cambiato in profondità il 9 ott
e nessun giro di panel l'ha mai visto.

---

### 33.8 Il giro del 9 ottobre — quello che hanno detto le registrazioni

> ⚠️ Persone per **ruolo**: questo file è tracciato su un repository pubblico.

**La fonte.** Le trascrizioni della settimana (registrazioni, non sessioni di lavoro)
hanno cambiato il contenuto. Il 7 ottobre il **system integrator partner** ha portato
**due bisogni del gruppo, espressamente non collegati**: *AI decisioning* per la «next
best experience», che stanno valutando adesso e di cui **non sapevano che Adobe si
occupasse**, e una *Content Factory* in ottica riduzione costi — circa **2,5 milioni**
di spesa agenzie sulla sola banca centrale, tutto esternalizzato, con l'idea di un
centro di eccellenza di gruppo e una persona già individuata per guidarlo. A spingere è stata la **struttura internazionale del partner**, su Santander. La frase
da cui nasce il riposizionamento è loro: «noi vi conosciamo solo come commodity».
L'**altra big four** non è su questo canale: è il partner su *insurance*.

**Tre verifiche che hanno corretto il dossier.**
1. **Forms mancava davvero.** Footprint: SAS, Adobe Analytics (la Divisione ne è il
   principale utilizzatore del gruppo), **AEM Sites e Forms, entrambi on-premise**.
   Forms è il motore dei moduli, cioè dove il funnel commerciale si rompe.
2. **Il CRM concorrente non è «solo nell'altra divisione».** Il Sales Cloud sì, ma il
   **Marketing Cloud è in uso nella Divisione**. Non è la stessa cosa.
3. **Il responsabile dei canali non è un contatto nostro:** è un invito da fare tramite
   il partner, e aveva già declinato. Scritto così nel dossier.

**Dossier** (applicato a Supabase, JSON validato): via la cronaca sui nomi storpiati;
dentro Forms, la correzione sul CRM, i due bisogni, il posizionamento del decisioning,
e in «non dire» la cautela sulla **banca spagnola citata come caso d'uso** — nella
stessa settimana è emerso che sta dismettendo Adobe, quindi il meccanismo si racconta
**senza intestarlo**. Santander resta la referenza buona.

**Experience, le modifiche di contenuto.**
- Le **tre date diventano tre obiettivi** (clienti netti, 100% cloud, i miliardi alle
  piccole imprese): sono le ancore del discorso. Aggiornate tutte le occorrenze a
  valle, taglio corto compreso.
- La slide «l'architettura ha una data» diceva tre cose insieme: riscritta su una sola.
- L'attrito «il collo di bottiglia è il canale» **era un nostro punto di vista non
  dichiarato**: ora poggia su due numeri pubblicati da loro ed è marcato come lettura.
- La **quarta domanda** (consenso e preferenze) suonava difensiva: sostituita con il
  filo che si perde fra primo contatto e firma, che è il problema che hanno dichiarato.
- Via «primo/secondo tempo» e via i prodotti dalla sintesi: al loro posto, cosa cambia.
- **Brand Visibility** racconta tutto lo spettro (Adobe + Semrush, i prompt reali, le
  quattro piattaforme), non solo l'ex-LLMO.
- Il viaggio non è più solo attribution: la vista omnicanale è la **fondazione**, e i
  casi che abilita stanno su una slide loro. **MMM e budget mix** nominati una volta
  sola e **come domanda**: Marketing Campaign Analytics risponde a «dove investire»,
  che non è il perimetro della persona in sala (verificato sulla knowledge base).
- **Slide nuova, l'arbitro** (`IsuArbiter`): le sorgenti restano dove sono, tre
  meccanismi decidono (i nomi sono quelli della pagina prodotto: AI ranking, eligibility
  constraints, frequency capping), al cliente arriva una cosa sola. Il vincolo
  architetturale è **in chiaro**, non dietro un clic.

**Verifica:** `audit:deck --tv` 6 rotte **0 HARD** sui cinque viewport; screenshot
letti; build di tutte le app; typecheck pulito. Il capitolo idee è passato da 6 a 8
slide: tagliata la copia e poi **diviso**, mai rimpicciolito il tipo.

**Resta aperto.** La fattibilità del decisioning su una base dati di terzi («Zero
Copy» è de relato e **non verificato**): prima cosa per il tavolo tecnico col partner.
L'architettura reale della referenza, per reggere il «come». E un **conflitto di date**
registrato nel dossier: un verbale del 9 ott dice 23, il resto dice 22 — confermato 22.

## 34. Il motore unico dei dossier (6 ott 2026)

### 34.1 Perché esiste

Sei app avevano **sei copie divergenti** dello stesso renderer di dossier, fra 345 e 583 righe
l'una. Migliorare la lettura su telefono in una non la migliorava nelle altre; una copia aveva già
rinominato i token a mano (in Poste `--color-menta` era il giallo e `--color-arancio` il blu); e due
difetti vecchi stavano lì senza che nessuno li vedesse. Vale la regola del motore condiviso: si
migliora una volta, lo prendono tutti.

`packages/core/src/blocks/doc/DossierPage.astro` è adesso **il** renderer. Ogni app ha un **wrapper
di ~30 righe**: importa il componente, passa `docSlug`, `base` e le chiavi Supabase, e mappa la
propria palette sul contratto `--dw-*`. Retrofit fatto su tutte e sei — isybank, mim, poste,
unicredit, intesa ×2 — e **ciascuna verificata con il contenuto reale** letto dal database, non con
una fixture.

**Non migrate, di proposito:** `eni-orbita` e `trenitalia` usano il vecchio schema con il contenuto
**dentro il bundle statico** (pattern superato). Convertirle significa prima spostare materiale
riservato su Supabase: lavoro a sé, voce P1 nel backlog.

### 34.2 Il contratto dei token

Il motore **non dichiara** `--dw-*`: li **consuma** con un valore di riserva
(`--_bg: var(--dw-bg, #10131a)`). Così l'app che li definisce vince sempre, senza gare di
specificità né dipendenze dall'ordine dei fogli. Il contratto: `--dw-bg --dw-tint --dw-surface
--dw-surface-2 --dw-line --dw-ink --dw-ink-soft --dw-ink-faint --dw-ink-strong --dw-accent
--dw-fill --dw-on-fill --dw-warn --dw-on-warn --dw-alt --dw-font-display --dw-font-body`
(+ misure `--dw-col --dw-gut --dw-bar-h`).

### 34.3 Il contratto del contenuto

Blocchi di sezione: `n h note` · `timeline[{anno,t}]` · `stats[{v,l,s}]` ·
`people[{name,role,note,li}]` · `items[string|{badge,t}]` · `rows[{k,sub,v}]` ·
`ideas[{tag,nome,parte,cosa,adobe}]` · `table{head,rows,pcol}` · **`gloss[{t,k,d,use}]`** ·
`say[]`/`dont[]` · `sources[{tipo,url,label}]` · `foot`. Testo: stringa o `{it,en}`.

Due cose nuove: **`order`** (elenco facoltativo dei blocchi, per anteporre il dato al commento —
una tabella di numeri letta dopo tre capoversi non è più una tabella) e **`gloss`**, che spiega un
indicatore dove sta il numero, con disclosure native: su telefono il tooltip non esiste, non c'è
hover, e un overlay copre quello che si sta leggendo.

Enfasi ammessa nei campi **descrittivi** (`<strong>`, `<em>`, `<code>`); i campi **identificativi**
(nomi, celle di tabella, etichette delle fonti) restano testo puro.

### 34.4 `pnpm audit:dossier` — il gate

`scripts/dossier-audit.ts`, su **cinque viewport** (320 · 375 · 390 · 768 · 1280). Deve uscire a
**zero rilievi**; esce 2 se non audita nulla (la trappola già vista su `audit:deck`).

| | Controllo | Soglia |
|---|---|---|
| a | barra fissa | ≤ 12% del viewport |
| b | scorrimento orizzontale della pagina | nessuno; una tabella larga scorre **dentro** il suo contenitore |
| c | tipo | corpo ≥16px · celle ≥14px · note ≥14px (etichette di colonna ≥11px) |
| d | tabelle impilate | ogni cella porta la **sua** intestazione |
| e | bersagli tattili | ≥ 44×44 |
| f | indice | completo oltre le sei sezioni |
| g | misura di lettura | 60–95 caratteri per riga |
| h | stampa | niente comandi, carta bianca, URL delle fonti |
| i | JavaScript | zero errori |
| j | contenuto | nessun elemento sfora la **propria colonna** |
| k | contenuto | **nessun blocco reso vuoto** |

**I difetti che il gate è nato per impedire**, tutti visti sul campo: l'avvertenza dentro la barra
fissa (**330px, il 49% di un iPhone SE**, che segue il lettore per venti schermate); la tabella che
su telefono nasconde l'intestazione e lascia quattro numeri senza nome; celle a 11px; un figlio di
griglia senza `min-width: 0` che fa scorrere di lato **l'intera pagina**; lo skip link a
`left:-9999px` che allarga l'area di scorrimento; e la **gerarchia piatta** — il corpo a 16px è
giusto, ma se il titolo di sezione sta a 20px tutto sembra piccolo: la scala si apre sui titoli e
sui numeri, non gonfiando il corpo.

I check **`j`** e **`k`** sono nati da difetti che il controllo grezzo non vedeva, e hanno trovato
subito cose vecchie: un dominio che sforava la sua colonna di 82px da 768px in su, e il **«Run of
show» del dossier Poste** — cinque righe **invisibili da settembre** perché scritte con i campi
`{label, sub, body}` mentre il contratto dice `{k, sub, v}`. Convertito in `timeline`; **nessun
alias aggiunto al motore**, perché un contratto con le scorciatoie non è più un contratto.

### 34.5 La skill `dossier`

`skills/dossier/SKILL.md` (symlink in `.claude/skills/dossier`) tiene il metodo: per chi è scritto,
la ricerca, la gerarchia delle fonti, la struttura delle sezioni, la pubblicazione, la barra di
qualità, i marchi, le cose da non fare, la verifica. Le quattro regole aggiunte il 6 ott, tutte da
errori veri di quella giornata:

1. **Per chi è scritto.** Un collega Adobe che **non sa nulla della Factory**, del formato o delle
   regole: apre un link, legge sul telefono e giudica chiarezza, efficacia in riunione e quanto il
   documento dimostra di conoscere quel cliente e Adobe. Quindi **nessun rimando a numero di
   sezione** («§7», «idea I1», «P0»), titoli in italiano piano, avvertenza che insegna a usare il
   documento, ogni sigla sciolta la prima volta, e **nessun presupposto di presenza** («la domanda
   rimasta aperta in call» non dice niente a chi a quella call non c'era).
2. **Le idee si verificano prima di scriverle**, su Fluffy e sulle fonti pubbliche e del cliente. E
   **quello che il cliente fa già da sé non si propone**.
3. **La gerarchia delle fonti** per un fatto attribuito a un cliente terzo (§34.6).
4. **Una dichiarazione ha una data di scadenza**: un'idea che nasce da una frase di mesi prima è uno
   **spunto da verificare**, non un assunto — nel dossier con la data in chiaro, nelle slide come
   domanda invece che come affermazione.

Le regole 1 e 2 stanno anche in `CLAUDE.md`. **Un dossier non porta il co-brand** (skill §6):
il lockup dichiara un artefatto fatto *con* il cliente, un dossier è fatto *su* di lui e porta
scritto che il cliente non deve sapere che esiste; e se esce, con quel lockup sembra congiunto.
Sui deck la regola resta binding.

### 34.6 La gerarchia delle fonti, e l'errore da non ripetere

Un nome di indice attribuito a un cliente terzo non si trovava in **quattro** fonti (una nostra
trascrizione ripulita, il catalogo abbreviato della sessione, le fonti interne, il web) e **è stato
dichiarato inventato**, chiedendo di correggere la slide di un collega. Era vero il contrario: quel
nome l'aveva scritto **il cliente stesso** in una mail di febbraio che proponeva il testo
dell'abstract, e stava nel deck presentato. Le due fonti sono arrivate nella cartella **dopo** la
ricerca.

Gerarchia, dalla più forte: **(1)** artefatti approvati dal cliente (deck presentato, abstract
scritto da lui) · **(2)** corrispondenza dell'account (`.eml`/`.msg` e allegati nella sua cartella)
· **(3)** trascrizioni — **sbagliano i nomi propri**, quindi da lì non si cita mai un nome ·
**(4)** cataloghi pubblici, spesso tagliati · **(5)** web generico.

Due regole: **«non trovato» non si traduce in «falso»** (si conclude «non confermato, chiedere al
team»), e **prima di dichiarare sbagliato il lavoro di un collega si cerca la fonte che aveva lui**,
rifacendo l'`ls` della cartella del cliente — il materiale arriva mentre si lavora. Memoria:
`fonti-cliente-gerarchia`.
