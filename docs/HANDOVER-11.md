# Handover — Parte 11 di 11
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
generate da `output/build/build_vassena.py` **da zero** sul master Adobe 2026 svuotato — non
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
`build_vassena.py` costruisce il segnaposto a mano (e `insert_element_before` vuole i tagname come
stringa, non passati per `qn()`).

### 33.7 Che cosa resta aperto

Tutto in `§12` del dossier, con la domanda già scritta. In sintesi: il perimetro dell'incumbent
(l'unica fotografia pubblica è del **2017** e chi la raccontava non ricopre più quel ruolo), chi
ne fa il system integration, se esista una gara, lo stato di un contratto scaduto il 30 settembre,
e la conferma di tre nomi che in trascrizione ballano. **L'esito dell'incontro del 13 ottobre è un
buco dichiarato per scelta**: chi ha preparato il materiale è fuori sede dal 10 al 15.

**Scadenza vera: venerdì 9 ottobre** (revisione interna), non il 22.
