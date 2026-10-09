# Handover — Parte 11 di 14
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

---

## 35. Intesa Sanpaolo Assicurazioni — l'incontro dell'8 ottobre (6-7 ott 2026)

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

Conclusione operativa del 6 ott: **il perimetro digitale esiste, è suo, e comincia dopo la
firma.** ⚠️ **Corretta il 7 ott**: non comincia *solo* dopo la firma — i canali che non passano
dalla banca sono anch'essi suoi da abilitare, e la verifica sta in **§35.9**. «L'acquisizione
passa dalla banca» resta vero *in larga parte*, non in assoluto.

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
- Obiettivi riferiti per via interna: far crescere i **clienti diretti** e la **raccolta danni**,
  perché il vita è trainato dal cross-selling bancario. ⚠️ **Verificato il 7 ott** (§35.9): la
  *direzione* regge su fonti pubbliche — è nel suo piano informatico — ma **il numero no**, e sul
  deck non ci va.

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

### 35.5 Il deck dell'8 ottobre — «Quando il cliente è vostro» (v6, 7 ott sera)

> ⚠️ **Superata dalla v8** (§35.11, 8 ott): quattordici slide, quattro casi d'uso ereditati
> dalla FSI Use Case Library, tre slide eliminate e due fatti rimessi a posto. Questa sezione
> resta perché descrive la grafica e le regole che la v8 eredita intatte.

`docs/Intesa Sanpaolo/output/20261008_Adobe_x_Intesa_Sanpaolo_Assicurazioni_Quando_il_cliente_e_vostro_v6.pptx`
(+ PDF e `speaker_notes_8ott_v6.md`), da `output/build/build_slide_8ott_v6.py`. Le versioni
precedenti restano accanto: v1 (quattro slide, §35.5-bis) e v3 (quella passata dal panel, §35.8).

**Il titolo è cambiato perché il perimetro è cambiato** (§35.9): «Dopo la firma» copriva metà di
quello che è suo. Sottotitolo: *«Il post-vendita — documenti, sinistri, assistenza — e i canali
che non passano dalla banca. Due perimetri, la stessa macchina.»* ⚠️ Il titolo **non è ancora
deciso**: sul tavolo restano «La macchina che serve il cliente», «Da qualunque porta entri» e
«Il perimetro che è vostro» (voce di backlog).

Quattordici slide: copertina · 01 l'ora che abbiamo · 02 che cosa avete già di Adobe · **stacco I**
· 03 il vostro bilancio · 04 la nostra lettura · **stacco II** · 05 l'aggancio · 06 i documenti ·
07 il percorso · **08 i contenuti** · 09 i dati · 10 il seguito (chiusura scura) · A appendice.

**Che cosa è cambiato dalla v3**, in quattro mosse chieste dall'owner il 7 ott:

1. **Le domande stampate in fondo alle slide sono sparite tutte.** Erano nove, e scritte suonavano
   come un questionario; adesso stanno nelle note del relatore, con scritto che si fanno a voce.
2. **Nessuna richiesta.** «Una richiesta sola» → «**Se vi sembra utile**: un pomeriggio su un
   processo, con i vostri numeri davanti». La terza colonna della slide 01 è diventata «che cosa
   lasciamo aperto», e il verbo «chiediamo» non compare più.
3. **Tipografia a due livelli e ritmo.** Corpo da 13-14 a **16pt**, titoli fino a 36, e una frase
   grande che si legge dal fondo della sala con il dettaglio sotto (la slide dei numeri si apre
   con «I premi salgono di nove punti. I contratti stanno fermi.»). Due **stacchi scuri a tutta
   pagina** più una chiusura scura rompono la fila di pagine chiare tutte uguali.
4. **Un tema nuovo: i contenuti** (slide 08, §35.10).

**La grafica, tutta disegnata da primitive** — niente PNG, niente glifi al posto di icone, tutto
modificabile da chi riceve il file: il **grafico a pendenza** premi/contratti (indice 2024 = 100,
perché premi e contratti non si misurano nella stessa unità: due assi sarebbero l'errore classico),
lo **schema di aggancio** a due bande con la freccia che sale e quella sbarrata, la **catena del
documento** in quattro passi col rosso dove si rompe, **sei scatole separate → un ambiente solo**
sul percorso, il **ventaglio** un brief → cinque uscite sui contenuti, e le tre **tessere** con i
segni di documento, contenuto e misura. La coppia di colori del grafico è passata dal validatore
della skill `dataviz`: il petrolio del deck bocciava il controllo di croma (su fondo chiaro legge
grigio), quindi per le sole tracce si usa un gradino più saturo (`#0093AF`).

**Quattro immagini, generate con Firefly** (`output/build/gen_firefly_8ott.mts`, provenance in
`output/firefly/provenance.8ott.json`): copertina, due stacchi e la chiusura. ⚠️ **Il primo giro è
stato buttato**: tre immagini su quattro erano il tunnel di velocità al neon — il cliché, e tutte
uguali fra loro. Rigenerate con una direzione più severa (un gesto solo, composizione asimmetrica,
luce fotografica, niente radial burst né perspective tunnel nel negativo), poi graduate tutte allo
stesso modo con una **rampa scura a sinistra cotta nell'immagine**, così il testo bianco ha
contrasto vero senza bordi netti. Nessuna persona, nessun edificio, nessun marchio.
⚠️ Trappola: `fill.transparency` **non esiste in python-pptx** — il velo sopra le immagini resta
opaco e le immagini spariscono. L'alpha va scritta nell'XML (`velo_scuro()` nel build).

**Tolto «Adobe Confidential» dal piè di pagina**, che il master metteva su ogni slide — anche sulla
v1. Su un deck che resta in mano al cliente era un difetto vero: `togli_confidential()` nel build
riscrive la nota di copyright nei master e nei layout.

### 35.5-ter Il prodotto attribuito al cliente che il cliente non ha (7 ott)

Vale oltre questa stanza. La slide «che cosa avete già di Adobe» aveva una tessera che diceva
**«I documenti — leggere quello che arriva, generare quello che parte. Il motore c'è già, nel
gruppo»**. È falso, e lo si è scoperto solo perché l'owner ha chiesto *«siamo certi che hanno già
Document Cloud?»*.

Verificato su tre fonti indipendenti il 7 ott:
- **l'estrazione contrattuale** (`data.xlsx`, riletta riga per riga, non ripresa dal dossier): le
  sole soluzioni presenti sono **Sites, Assets, Forms, Analytics**. Document Cloud / Acrobat
  Services non compare su nessuna delle tre entità;
- **Fluffy / Field Readiness**: zero occorrenze di Intesa o Sanpaolo; `tenant_or_program_search`
  su «Intesa Sanpaolo» torna vuoto;
- **Fluffy / Slack**: *«Enterprise PDF Services … requires an ETLA for Enterprise PDF Services …
  If the organization does not have that ETLA entitlement, Enterprise PDF Services is not
  available»*, e *«PDF Services API … is generally sold as a standalone SKU»*.

Quindi: nel gruppo c'è **AEM Forms** (90 milioni di rendition l'anno, sull'entità della banca), che
**compone e rende** moduli e documenti in uscita; **non legge** i documenti in ingresso. PDF
Extract e Document Generation sono Acrobat Services, famiglia diversa e SKU a sé, assente.
La tessera ora dice «**SOLO NEL GRUPPO · AEM Forms**», e la riga di chiusura separa le due cose:
«leggere i documenti in ingresso» torna fra le **cose che oggi non ci sono**, insieme al percorso
in un ambiente solo.

**La lezione, scritta pro futuro:** l'errore non era nel capitolo sui documenti — quello proponeva
già l'estrazione come cosa nuova e ammetteva di non avere una referenza assicurativa. Era nella
**slide di sintesi**, dove tre prodotti erano stati compressi in una parola («i documenti»).
**La sintesi è dove si rompono i fatti**, ed è l'ultimo posto dove si pensa di controllarli.

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

**Il titolo del deck non è deciso.** Oggi è «Quando il cliente è vostro»; sul tavolo restano
«La macchina che serve il cliente» (la più vicina alla sua lingua: lui possiede operations e
sistemi), «Da qualunque porta entri» (mette davanti i canali) e «Il perimetro che è vostro» (il
più piatto e sicuro). Scelto il titolo cambiano copertina, nome del file e questa sezione.

Domande che non si chiudono da fonti pubbliche e vanno fatte in sala: **quanti moduli ha in
media una polizza** dell'offerta modulare, se la **lettura automatica dei documenti in ingresso**
sia già coperta dentro il cantiere dichiarato, **quanto del percorso autenticato** sia della
compagnia e quanto dei canali della banca, e — tema nuovo — **di chi è la fabbrica dei contenuti**
nel gruppo (§35.10).

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

### 35.9 Il perimetro si allarga: i canali che non passano dalla banca (7 ott)

Arriva per via interna che il COO ha un obiettivo anche sull'**acquisizione**, per la piccola
quota di clienti che non vengono dalla banca. Verificato il 7 ott, con due esiti distinti.

**Confermato che quei canali sono nel suo perimetro ed è lui che li abilita**, e lo dicono due
righe del **suo stesso capitolo** del bilancio 2025 (Sistemi informativi, scritto dalla sua area):
fra i cinque principi del Piano Strategico dell'Informatica 2026-2029 c'è «**sviluppo di
piattaforme digitali per canali esteri ed extra-captive**»; e «per i canali extra-captive di ISPA
e FV … è stato implementato il nuovo sistema vita **MyInsurance HUB**, che ha consentito
l'abilitazione alla vendita dei prodotti vita su tali canali».

**Confermato che sono piccoli, con parole loro**: la compagnia si avvale «primariamente» delle
reti bancarie, di Intesa Sanpaolo Insurance Agency e «**marginalmente**, di intermediari extra
captive».

⚠️ **Non confermato il numero, e non va inventato.** Nessuna fonte pubblica dà la quota dei
clienti diretti. Nel bilancio c'è un **7,5% di «vendita diretta»** che è il **mercato italiano
danni**, non loro: attribuirlo alla compagnia è esattamente l'errore che il fact-checker ha già
contestato due volte. E non è documentato pubblicamente un obiettivo personale del COO su quel
fronte: è documentato che il suo piano informatico ha quella riga.

Conseguenza sul deck: titolo e sottotitolo cambiati (§35.5), e una terza lettura sulla slide
«la nostra lettura» — «**i canali nuovi sono vostri da abilitare**» — che poggia solo sulle due
righe verificate, senza percentuali.

### 35.10 Il tema nuovo: la fabbrica dei contenuti (7 ott)

Chiesto dall'owner: portare la **Content Supply Chain** anche senza sapere se sia nel perimetro
del COO, perché è un tema che il gruppo ha comunque davanti. Slide 08, costruita su fatti pubblici
del **Piano d'Impresa 2026-2029** (2 feb 2026): premi danni a **2,3 miliardi da 1,6** (+9%
composto), circa **360 specialisti di prodotti danni** nella Banca dei Territori (≈150 in più
rispetto al 2025), offerta di **assicurazione danni non-motor sul digitale** via Isybank e
Fideuram Direct, più i canali esteri ed extra-captive del suo piano informatico. Più prodotti,
più reti, più materiali.

**L'onestà è scritta sulla slide**, ed è la riga che la rende portabile: «*non sappiamo se questo
pezzo sia vostro o di un'altra struttura del gruppo. Lo portiamo perché il piano lo rende
inevitabile per qualcuno*». Se risponde «non è mia», si chiede di chi è e si chiude lì.
Prodotto, se lo chiede: **Adobe GenStudio** sopra Experience Manager, che hanno già sui siti
(naming verificato sul deck ufficiale FSI CXO POV 2026 e sulla memoria `adobe-product-naming-2026`).

### 35.11 La v8 — i casi d'uso ereditati dalla libreria, e tre fatti rimessi a posto (8 ott)

`…_Quando_il_cliente_e_vostro_v8.pptx` (+ PDF, `speaker_notes_8ott_v8.md`, render in
`output/render_v8/`), da `output/build/build_slide_8ott_v8.py`. **Quattordici slide**, tutte
vettoriali: 6 MB contro i 26 della v7.

**Che cos'era la v7.** Montata a mano in PowerPoint sopra la v6, con tre slide incollate da deck
Adobe: «Adobe is your AI toolkit» dal **FSI CXO POV 2026** e due casi d'uso in inglese dalla
**FSI Use Case Library**. Diciassette slide e 26 MB, con i template altrui dentro.

⚠️ **Due fatti verificati si erano persi nella riscrittura a mano**, tutti e due sulla slide
dell'inventario: «Experience Manager … **è lo stesso strumento che fa i moduli e le lettere al
cliente**» (falso: i moduli sono AEM Forms, SKU diverso sull'entità della banca) e «I documenti …
**il motore c'è già, nel gruppo**» (falso per la lettura — esattamente l'errore che §35.5-ter
aveva corretto il giorno prima, tornato ribattendo il testo a mano). La regola che ne esce vale
oltre questa stanza: **la correzione di un fatto sopravvive solo se vive nel builder**. Una
slide ritoccata a mano non porta con sé la verifica che l'ha prodotta.

**I quattro casi d'uso sono EREDITATI, non inventati.** Lette tutte e 167 le slide della FSI Use
Case Library e scelte cinque, ricontestualizzate sul loro perimetro:

| Slide v8 | Fonte nella libreria | Che cosa è stato tolto, e perché |
|---|---|---|
| 06 · Dalla denuncia alla liquidazione | 151, *Streamline claims submission (FNOL)* | la **firma elettronica**: il gruppo è CA accreditata AgID ed emette i propri certificati |
| 07 · Perché hanno chiamato | 98 *Identify breaks in the journey* + 150 *Detect points of failure* | — (ci confluiscono la figura «sei sistemi → un ambiente solo» e la referenza, dalla ex slide 07) |
| 08 · Chi risponde non riparte da zero | 77, *Call center context* | **tutte le offerte allo sportello**: a chi chiama per un sinistro non si vende |
| 09 · Gli stessi materiali | 119, *Scale GTM with GenAI-driven content creation* | «campagne» e «marketing»: qui sono materiali e informative per le reti |
| 10 · Il modulo giusto | 137, *Cross-Sell Voluntary Benefits* | «proposte accettate senza intervento umano»: apre adeguatezza e POG |

Le due slide inglesi incollate nella v7 sono quindi **ridisegnate nel linguaggio del deck**, non
lasciate nel loro template: stessa grammatica delle altre (occhiello-indice, catena di tappe,
blocchi etichettati), stessi token, tutto modificabile da chi riceve il file.

**Tre slide eliminate, su richiesta dell'owner.**
- «**Niente di quello che avete viene toccato**» (l'aggancio): lo schema diceva tutto e niente. La
  sostanza — si legge attraverso le interfacce che ci sono, i vostri sistemi restano master — sta
  ora in una riga sullo **stacco della seconda parte** e nelle note, detta a voce.
- «**Le domande che vi farebbe il vostro compliance**»: non è un tema da primo incontro. La riga
  che però non si poteva perdere — dentro un sinistro ci sono referti, e che cosa si legge si mette
  per iscritto prima — è passata **sulla slide dei documenti**, dove il problema nasce.
- «**Sapere da dove veniva chi vi chiama**»: stesso tema del caso d'uso delle chiamate, confluita lì.

**L'appendice sul modulo è diventata un caso d'uso nel corpo** (slide 10), ed è l'unico argomento
di ricavo in un deck altrimenti tutto di costo. **XME Protezione verificato sulla pagina pubblica
di prodotto** l'8 ott: più di venti moduli in tre aree (Salute 10, Casa 7, Famiglia 3) e scala
sconti **5 / 8 / 12 / 17 / 23 / 30%**, il 30% dal settimo modulo in su. Da lì la quarta tappa della
catena, che è la lettura che probabilmente nessuno gli ha fatto: «**il gradino dello sconto — a sei
moduli, il settimo vale il 30%**». ⚠️ Durata della polizza, rinnovo automatico e disdetta del
singolo modulo dopo sei mesi **non stanno su quella pagina**: non sono stampati, e la prima tappa
dice «la scadenza», generica apposta.

**Il bilancio non ripete più i suoi numeri.** Sotto il grafico una banda sola dice come li
leggiamo e perché la slide esiste: la crescita del 2026 esce dai contratti che ci sono già, e su
una base ferma il margine si fa sul costo di servirla — l'expense ratio, la riga su cui è
misurato. È il ponte fra la prima e la seconda parte.

**La terza lettura rifatta.** «I canali nuovi sono vostri da abilitare» era un titolo che non
significa niente: adesso è «**il canale senza filiali**», e il corpo dice che cosa sono i canali
extra-captive (distribuire fuori dalla rete del gruppo) e perché contano (lì non c'è un gestore
che spiega — spiegano i documenti e gli schermi).

⚠️ **MyInsurance HUB, un mio errore dell'8 ott mattina.** L'ho tolto dalla slide scrivendo che il
bilancio lo cita «come cantiere, non come risultato» e istruendo a chiederne lo stato. È falso:
§35.9 porta il verbatim del bilancio 2025, «**è stato implementato** il nuovo sistema vita
MyInsurance HUB, che ha consentito l'abilitazione alla vendita dei prodotti vita su tali canali».
Nota corretta nel builder l'8 ott. **La lezione**: ho rifatto una ricerca pubblica invece di
rileggere la sezione che quel fatto l'aveva già verificato alla fonte primaria. L'handover è la
fonte verificata — ri-verificare da zero senza leggerlo costa un fatto.

**Il vocabolario dei canali, chiarito** (domanda dell'owner, 8 ott). Sono **tre assi diversi** e
confonderli si sente in sala: *captive / extra-captive* dice **di chi è la rete** (entrambi
intermediati: una polizza venduta da una banca terza è extra-captive e diretta zero);
*intermediato / diretto* dice **se c'è un intermediario** (il preventivatore auto sul loro sito è
diretto, non extra-captive); e il **rapporto diretto con l'assicurato** nel post-vendita è un'altra
cosa ancora — ce l'hanno già su otto milioni e mezzo di contratti, chiunque abbia venduto la
polizza, ed è il perimetro di questo incontro. ⚠️ «Aumentare i clienti diretti» è **acquisizione**,
fuori perimetro per scelta: la formulazione sicura è «quanta parte di quel rapporto si chiude senza
che qualcuno debba intervenire» (operazioni in autonomia, pratiche chiuse al primo contatto).

**Il file montato a mano, analizzato.** L'owner continua a lavorare nel `…_v7.pptx` dentro
PowerPoint, fondendoci il contenuto della v8: al 8 ott quel file ha 14 slide e **tre difetti
misurati** che la v8 non ha. (a) **La numerazione degli occhielli è rotta in tre punti**: la slide
dei pilastri Adobe non ha numero, fra `04` e `06` manca il `05` (era l'aggancio), e il **`10` compare
due volte** (su «Il modulo» e sulla chiusura). (b) **La chiusura è l'unica pagina di contenuto su
fondo scuro**: nel deck il fondo scuro con immagine significa «si respira, non si legge» —
copertina e due stacchi, che portano solo occhiello, titolo e una riga — mentre quella porta tre
colonne con filetti ed etichette. (c) **Usa una terza griglia**: occhiello a y 1,90, titolo a 2,58
a 40pt, corpo a 4,72, cioè né quella delle pagine di contenuto (0,62 / 1,18 a 36pt / ~2,4) né
quella degli stacchi (2,55 / 3,26 a 44pt / 5,06); con la fascia 0→1,9 completamente vuota, velo al
**62%** contro il 32% degli stacchi, e un inchiostro (`#7FD4E4`) che vive solo lì. Il contrasto
invece **non** è un problema: misurato, 14-20:1 di mediana come le altre pagine scure.

**Il titolo è deciso** (chiude la voce di backlog di §35.7): la copertina dice «**La Macchina che
serve il Cliente**», con sottotitolo «Il post-vendita — documenti, sinistri, assistenza».

⚠️ **La v8 non è passata dal panel.** I due giri del 6 ott coprono la v3.
