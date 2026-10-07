# Handover — Parte 11 di 13
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


---

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

---

## 35. Intesa Sanpaolo Assicurazioni — «Dopo la firma» (6 ott 2026)

> ⚠️ Stesse regole della §33: su questo file tracciato le persone si citano per **ruolo**. Nomi,
> installato e intelligence stanno in `docs/Intesa Sanpaolo/` (git-ignorata) e nel dossier gated.

### 35.1 La stanza, e perché è un'altra

Giovedì **8 ottobre 2026, ore 11:00**, un'ora di persona con il **Chief Operating Officer di Intesa
Sanpaolo Assicurazioni** (la capogruppo assicurativa, ex Intesa Sanpaolo Vita). In sala due colleghi
Adobe e, possibile, un **Information Technology Manager** che è il suo riporto: se c'è, è lui il
verificatore tecnico.

È una stanza **diversa** da quella della §33 (Banca dei Territori, 22 ott): perimetro diverso,
vincoli diversi. Per questo l'entità è separata — `apps/intesa-dopo-la-firma/`, migrazione
`0021` — così un vincolo di una stanza non cola nell'altra.

### 35.2 Il perimetro, verificato sulle superfici del cliente

La domanda rimasta aperta nella riunione interna del mattino era quanto dell'esperienza del cliente
finale sia della compagnia e quanto della banca. Verificata leggendo direttamente i siti, le app e i
portali:

- **due siti istituzionali su Adobe Experience Manager** (librerie e DAM sotto `isp_assicurazioni` e
  `isp_protezione`) — **AEM sta sul PUBBLICO**, prima del login;
- **Adobe Analytics in produzione su due report suite**, distribuito via **Tealium**: misura le
  pagine pubbliche, **non** l'area clienti, l'app, il percorso del sinistro, i ticket;
- **app propria con oltre un milione di download**, distinta da quelle bancarie;
- **area clienti su Liferay + CA SiteMinder**: il post-login **non è AEM**, è un'altra macchina e
  un'altra generazione;
- **digitalizzazione della «Customer Journey Sinistri Danni»** già dichiarata a bilancio, con tre
  cantieri nominati: *Video Perizia*, *Hardbooking*, **New Document Management**.

Conclusione operativa: **il perimetro digitale esiste, è suo, e comincia dopo la firma.**
L'acquisizione passa dalla banca — da lì non si entra.

### 35.3 Che cosa lo muove

Ruolo dichiarato dalla stampa di settore: *life underwriting & claims* e *information technology
insurance in generale*; ai convegni è accreditato come «responsabile area operations e sistemi
informativi». Viene dalla consulenza di processo e ha fatto il COO di una compagnia prima di
arrivare qui: ragiona per processi e per numeri.

- **La sua metrica è l'expense ratio** (33,9% al 31 dic 2025, in calo da 34,5%): l'unica voce del
  conto che dipende da come è organizzata l'azienda. Sta già tagliando: non gli si dice che ha un
  problema di costi, gli si chiede dove il prossimo mezzo punto è più difficile.
- **Otto milioni e mezzo di contratti, e il numero non cresce** (vita −0,9%, danni +0,6%, premi a
  doppia cifra): la crescita viene dal valore per contratto. Tutto si gioca sulla base installata.
- **Sta scrivendo il Piano Strategico dell'Informatica 2026-2029** — è scritto nel bilancio della
  sua area, con cinque principi già fissati. È la finestra, e non se ne apre un'altra presto.
- Obiettivi riferiti per via interna (fuori dal deck, dentro il dossier): far crescere i **clienti
  diretti** e la **raccolta danni**, perché il vita è trainato dal cross-selling bancario.

### 35.4 Il dossier

`apps/intesa-dopo-la-firma/dossier/` — **quattordici sezioni**, reso dal motore §34, contenuto in
Supabase (`restricted_docs`, slug `intesa-dopo-la-firma`), seed git-ignorato in
`docs/Intesa Sanpaolo/0021_…`, README tracciato accanto alla migrazione. Markdown master accanto al
seed.

Novità rispetto ai dossier precedenti: **glossario degli indicatori** (expense ratio, loss ratio,
combined ratio, contratti, solvency — con *che cos'è*, *che cosa dice davvero* e **«in sala»**),
tabelle con il **dato prima del commento** (`order`), e **zero gergo interno** dopo la riscrittura
del 6 ott (diciannove rimandi a numero di sezione rimossi).

Tre idee, tutte **marcate come spunti** con la data della fonte: i **documenti** (PDF Extract API,
Document Generation, AEM Forms — che è contrattualizzato dalla banca, **non** dalla compagnia), il
**percorso** (Customer Journey Analytics), il **modulo giusto nel momento giusto** sull'offerta
modulare. **Niente firma elettronica**: il gruppo è **Certification Authority accreditata AgID** ed
emette i propri certificati — proporla sarebbe la frase che chiude la riunione.

### 35.5 Le undici slide dell'8 ottobre (v3, 6 ott sera)

`docs/Intesa Sanpaolo/output/20261008_Adobe_x_Intesa_Sanpaolo_Assicurazioni_Dopo_la_firma_v3.pptx`
(+ PDF e `speaker_notes_8ott_v3.md`), generate da `output/build/build_slide_8ott_v3.py`. La v1 a
quattro slide resta accanto, non toccata.

**Perché è cambiata.** Le quattro slide reggevano i tre temi ma non dicevano chi siamo né perché
portiamo proprio quelli. Richiesta della sera del 6 ott: introdurre Adobe, dichiarare il perché, e
mettere davanti **l'analisi da fuori** — informazioni pubbliche raccolte, la nostra comprensione,
e da lì gli ambiti. Poi il **panel review** (§35.8) ha rifatto metà del resto.

Copertina + nove + **una di appendice**:

1. **Un'ora sul post-vendita** — l'intento, e che cosa resta fuori (acquisizione, core).
2. **Adobe, per la parte che vi riguarda** — il documento, il contenuto, la misura. Niente
   fatturato: tutte e cinque le personas lo davano da tagliare.
3. **Quello che abbiamo letto** — bilancio 2025, semestre 2026, piano e cantieri, con le **fonti
   pubbliche stampate in chiaro**. È la slide che il panel ha messo in «non toccare».
4. **Tre cose che ne abbiamo capito** — chiuse dalla loro frase sull'architettura aperta.
5. **Dove ci agganciamo, e che cosa non tocchiamo** — cosa resta master, nessuna scrittura verso
   polizza e sinistri, come si rilascia. Ha preso il posto di «Dove ci innestiamo», che quattro
   stakeholder su cinque davano da togliere.
6. **I documenti che non si chiedono due volte** — parte dai loro cantieri, non dal nostro tema.
7. **Perché hanno chiamato** — con i ventiquattro mesi nel corpo, non in nota.
8. **I dati, prima che ce lo chiediate** — categorie particolari, che cosa si fissa per iscritto,
   chi deve dire sì. Non c'era, ed è la ragione per cui il rischio stava a 2/5.
9. **Novanta minuti su un processo** — la richiesta, che nella v1 viveva solo nelle note.
10. *(appendice)* **Il prodotto giusto nel momento giusto** — fuori dal flusso: contraddiceva la
    slide 1 e «proposte accettate senza intervento umano» apriva adeguatezza e governo del prodotto.

**Ogni slide chiude su una domanda.** Ogni numero stampato è verificato alla **fonte primaria**,
non al dossier: il bilancio consolidato 2025 scaricato e letto, il comunicato semestrale del
**29 luglio 2026** (non 10 agosto: quello è il rilancio d'agenzia), i ricavi Adobe FY2025 dal
comunicato del 10 dicembre 2025, l'HTML dei siti e dell'area clienti riletto il 6 ottobre.

**Tolto «Adobe Confidential» dal piè di pagina**, che il master metteva su ogni slide — anche sulla
v1. Su un deck che resta in mano al cliente era un difetto vero: `togli_confidential()` nel build
riscrive la nota di copyright nei master e nei layout.

### 35.5-bis Le quattro slide originali (v1, 6 ott mattina)

`…_Dopo_la_firma.pptx`, da `build_slide_8ott.py`. Copertina + 4, come
deciso nella riunione interna del pomeriggio del 6 ott: **slide «da tenere in tasca»**, una per
tema, non un deck da scorrere.

1. **Dove ci innestiamo** — i documenti, il percorso, i momenti.
2. **I documenti che non si chiedono due volte.**
3. **Perché hanno chiamato** — con la referenza italiana.
4. **Il modulo giusto nel momento giusto.**

**Ogni slide chiude su una domanda, non su un'affermazione**: le leve nascono da dichiarazioni di
giugno 2025 e da un piano citato in un bilancio di fine 2025, quindi sono spunti da verificare
(§34.5, regola 4). Le note del relatore portano la regia e i divieti. Verificato convertendo in PDF
e leggendo le slide: corretto un difetto vero, la domanda di chiusura finiva **sopra il logo Adobe**.

### 35.6 La referenza, e la lezione che ne è uscita

La referenza italiana è una compagnia concorrente che ha presentato ad Adobe Summit 2026 un modello
omnicanale su Customer Journey Analytics. Due cose la rendono la più utile che abbiamo: ha lanciato
**due anni prima la stessa idea della polizza unica** del nostro interlocutore, e ha messo in un solo
ambiente nove fonti — performance, ticketing, CRM, voce del cliente — **senza sostituire un solo
strumento**, che è esattamente la posizione che serve a noi. Risultati dichiarati sul palco: −20% sul
tempo di troubleshooting, 2× sull'identificazione della causa, −90% sul tempo per produrre
un'analisi integrata. Tempi, senza sconti: ~18 mesi di implementazione più 6 di analisi.

**La lezione sta in §34.6**: il nome dell'indice composito che la nostra slide di referenza usa era
stato dichiarato «inventato da noi» e non lo era — l'aveva scritto il cliente nell'abstract della
sessione. Resta una discordanza fra due nostre fonti sul risultato dell'analisi (−50% dalla sintesi
della trascrizione, −90% dal deck presentato): **in sala valgono i numeri del deck**, che è
l'artefatto approvato. È scritta nel dossier, non nascosta.

### 35.7 Che cosa resta aperto

Domande che non si chiudono da fonti pubbliche e vanno fatte in sala: **quanti moduli ha in
media una polizza** dell'offerta modulare, se la **lettura automatica dei documenti in ingresso**
sia già coperta dentro il cantiere dichiarato, e **quanto del percorso autenticato** sia della
compagnia e quanto dei canali della banca.

**Le referenze vanno con il nome** — deciso dall'account la sera del 6 ottobre, contro la cautela
iniziale del dossier: sulla slide del percorso c'è **Unipol**, su quella dei documenti
**HUK-COBURG**. Il motivo è il rilievo più citato dei due giri di panel: una referenza che il
cliente non può chiamare non è una referenza, e su un deck che gira verso il vertice vale meno di
niente. La cautela sopravvive su **come** si cita, non **se**: Unipol è un concorrente diretto,
quindi è la prova che in Italia si fa, mai un modello da copiare — sta nella nota del relatore.

Da chiudere **prima dell'8**, con l'account team: **chi implementa in Italia e con quale partner**,
più una compagnia assicurativa europea citabile oltre a HUK-COBURG; un **ordine di grandezza delle
giornate-uomo** della prima messa in opera.

### 35.8 Panel review — due giri, 6 ottobre

Cinque personas cieche (il COO in sala, il suo capo, il suo riporto IT, il vertice danni e salute,
l'architettura di gruppo) costruite da sole fonti pubbliche datate in `PANEL-PERSONAS.md`
(git-ignorato), più un fact-checker che riverifica ogni claim alla fonte. Verdetti in
`PANEL-VERDICT-2026-10-06-round1.md` e `…-round2.md`, JSON in `panel/`.

| Asse | Giro 1 | Giro 2 |
|---|---|---|
| Credibilità dei fatti | 3,4 | **4,0** |
| Rilevanza | 3,2 | **3,8** |
| Chiarezza | 4,0 | 4,0 |
| Rischio | **2,0** | **3,6** |
| Azionabilità | 3,2 | **3,8** |

Tutte e cinque accettano i novanta minuti in entrambi i giri; nel giro 1 nessuna accettava il
deck (12 P0). Il salto sul rischio è la slide sui dati, che non esisteva.

**Quello che ha trovato, e che l'audit non avrebbe mai trovato.** Un numero falso («i premi
crescono a doppia cifra»: sono +9,4% e +8,5%) proprio sulla slide costruita per dimostrare di aver
letto il loro bilancio. Una frase sbagliata sul loro conto economico («l'expense ratio è l'unica
voce che dipende da come è organizzata l'azienda») corretta da tutti e cinque. Un'affermazione
**falsa sui loro sistemi** — «dietro il login la raccolta va costruita» — smentita leggendo l'HTML
dell'area clienti, che carica già lo stesso Tealium e la stessa report suite con `user_id` e stato
di login. Una data sbagliata nella riga delle fonti (il comunicato semestrale è del 29 luglio, non
del 10 agosto). E la contraddizione più grossa: il deck citava i loro cantieri a pagina quattro e
tre slide dopo proponeva i documenti come terreno vergine.

**L'arbitro del giro 2 è andato in timeout**; personas e fact-checker avevano già consegnato, e la
sintesi del round 2 è scritta a mano sui loro output — sta scritto nel verdetto.

**Lezione pro futuro.** Il fact-checker ha corretto anche i *nostri* materiali: l'indice composito
di Unipol si chiama **Digital Experience Index**, non «Application Health Index» — nome che nei
materiali del cliente non esiste. Corretti il dossier, il seed `0021` e
`docs/Unipol/_build_unipol_cja_referenza_slide.py`.
