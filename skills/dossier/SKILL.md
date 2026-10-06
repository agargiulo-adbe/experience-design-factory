---
name: dossier
description: >
  Use when someone asks for a dossier, a briefing, a war-room doc or an account/person
  prep for a specific meeting — "fammi un dossier su X", "preparami l'incontro con Y",
  "cosa sappiamo di questo cliente". Covers the research method, the structure, the gated
  web page it ships as, and the measurable quality bar it must pass.
---

# Dossier — il documento che qualcun altro legge sul telefono

Un dossier non è un riassunto: è il materiale con cui un collega entra in una stanza che
non ha preparato lui. Due vincoli nascono da lì, e decidono tutto il resto:

1. **Chi lo legge non eri tu alla ricerca.** Ogni affermazione deve portarsi dietro la
   fonte, e ogni buco deve essere dichiarato tale. Un'ipotesi scritta come se fosse un
   fatto è il modo in cui si perde una riunione.
2. **Lo si legge in piedi, su un telefono, venti minuti prima.** È il primo deliverable su
   cui i colleghi giudicano la qualità del lavoro: se la tabella dei numeri è illeggibile a
   390px, il contenuto non conta.

## 1 · Ricerca — l'ordine che ha funzionato

Si parte dalle fonti che il mercato non ha già masticato. In ordine di resa:

1. **Il bilancio della CONTROLLATA, non del gruppo.** È la miniera. I bilanci consolidati
   delle società italiane contengono un capitolo «Sistemi informativi» o equivalente,
   scritto dall'area del referente: ci stanno il piano IT pluriennale, i cantieri aperti
   con il loro nome interno, i fornitori, e gli indicatori operativi su cui quella persona
   viene misurata. Si scarica il PDF e si estrae il testo (`pdftotext -layout`) — non si
   chiede a un motore di ricerca di riassumerlo.
2. **Le superfici del cliente, lette direttamente.** L'HTML dei siti (quale CMS, quali
   librerie), il tag manager e i tag che carica (`utag.js` e i suoi `utag.N.js`), lo stack
   di login dell'area riservata, le schede degli store (download, valutazioni, e soprattutto
   il **testo delle recensioni negative**, che dice dove il servizio si rompe). È evidenza
   verificabile, non opinione — e nessun concorrente la porta in riunione.
3. **Nessuna idea entra nel dossier senza verifica — è un passaggio obbligato, non un
   di più.** La sezione «le idee da portare» è l'unica che qualcuno userà per parlare: ogni
   prodotto nominato, ogni referenza citata, ogni numero attribuito a un cliente terzo si
   verifica **prima** di scriverlo, su tutto quello che c'è:
   - **Fluffy** — `field_readiness_sharepoint_search` (materiale di vendita, casi d'uso
     dichiarati, battlecard), `full_documentation_search` (wiki, Slack, SharePoint,
     Experience League insieme), `google_web_search` per il pubblico;
   - **le fonti Adobe pubbliche** — business.adobe.com, Experience League, le customer story;
   - **le fonti del cliente** — sito, bilancio, comunicati: quello che già fa da sé.
   Tre cose che questo passaggio ha intercettato su un dossier solo:
   **(a)** il prodotto giusto per «leggere i documenti» non era quello che avevo in mente —
   mancava proprio quello che serviva;
   **(b)** la firma elettronica andava **tolta**, perché il cliente è esso stesso
   Certification Authority accreditata: proporgliela sarebbe stata la frase che chiude la
   riunione. **Quello che il cliente già fa da sé non si propone;**
   **(c)** i numeri e i nomi di una referenza vanno presi dall'**artefatto approvato**
   (il deck presentato, l'abstract scritto dal cliente), non dalla nostra sintesi: fra le
   due versioni di un risultato ballavano 40 punti percentuali, e il nome del prodotto del
   cliente era storpiato.
4. **La stampa di settore verticale**, per i virgolettati. I quotidiani economici danno i
   numeri; le testate di settore danno le **parole del referente** a un convegno. Una frase
   sua vale dieci frasi nostre: è la porta d'ingresso dell'incontro.
5. **L'installato e i contratti**, dalle fonti interne. Vanno in **una sola sezione**,
   dichiarata come «mai in sala».

## 1-bis · La gerarchia delle fonti, e l'errore che costa di più

Per un fatto attribuito a un **cliente terzo** (una referenza, un numero, il nome di una
cosa che ha costruito lui) le fonti non valgono tutte uguale. Dalla più forte:

1. **Artefatti approvati dal cliente** — il deck che ha presentato, l'abstract che ha
   scritto lui, un comunicato. È la sua voce, già passata dal suo ufficio.
2. **La corrispondenza dell'account** — i `.eml`/`.msg` e i loro allegati nella cartella del
   cliente. Qui si trova chi ha scritto cosa e chi l'ha approvato.
3. **Registrazioni e trascrizioni** della sessione. Attenzione: le sbobinature **sbagliano i
   nomi propri** — in un caso reale il cognome del relatore era storpiato, e il nome del
   prodotto del cliente scritto «UNIKA» invece di «Unica». Non si cita mai un nome proprio
   da una trascrizione: si prende dall'artefatto approvato.
4. **Cataloghi e abstract pubblici**, spesso tagliati rispetto all'originale.
5. **Il web generico.**

**L'errore da non ripetere.** Un nome di indice attribuito a un cliente non si trovava in
quattro fonti di livello 3-5, e l'ho dichiarato **inventato da noi**, chiedendo di correggere
una slide fatta da un collega. Era vero il contrario: quel nome l'aveva scritto il cliente
stesso in una mail di febbraio, e stava nel deck presentato — due fonti di livello 1 e 2 che
in quel momento non erano nella cartella.

Due regole che ne escono:

- **Assenza di prova non è prova di assenza.** Da «non trovato in X, Y, Z» si conclude
  «non confermato nelle fonti che ho: chiedere al team», mai «falso». Le due frasi costano
  in modo molto diverso: la prima è gratis, la seconda fa buttare lavoro buono e mina la
  fiducia nel materiale di tutti.
- **Prima di dichiarare sbagliato il lavoro di un collega, ci si chiede quale fonte avesse
  lui** — e la si cerca. In pratica: `ls` della cartella del cliente **rifatto al momento**
  (il materiale arriva mentre si lavora), e non solo i documenti già puliti: anche `.eml`,
  `.msg`, `.pptx`.

**Altre regole di metodo, imparate sbagliando:**
- **Il ruolo si verifica, non si assume.** «CEO» detto in una call interna è risultato
  essere COO. Un titolo sbagliato brucia i primi trenta secondi.
- **Misurare prima di affermare.** Un'ipotesi che cade è un risultato, non un fallimento:
  va scritta la versione vera, non quella comoda.
- **Un buco dichiarato vale più di un'ipotesi travestita.** La §«buchi aperti» è una
  sezione obbligatoria, con la domanda già formulata e la cella vuota. Quando due fonti
  nostre si contraddicono, la contraddizione **si scrive**, con l'indicazione di quale vince.

## 2 · Struttura — quattordici blocchi, un ordine

Il motore (`@edf/core/blocks/doc/DossierPage.astro`) rende un JSON di sezioni. Blocchi
disponibili: `note` · `timeline` · `stats` · `people` · `items` · `rows` · `ideas` ·
`table` · `gloss` · `say`/`dont` · `sources` · `foot`. Testo: stringa o `{it,en}`. Enfasi ammessa
nei campi descrittivi: `<strong>`, `<em>`, `<code>`.

Scheletro che regge in quasi tutti i casi:

| § | Sezione | Blocco |
|---|---|---|
| 1 | In una pagina — compresa l'uscita che vale la riunione | `stats` + `items` |
| 2 | Chi c'è nella stanza (e chi non c'è, ma conta) | `people` |
| 3 | Il perimetro — che cosa possiede davvero, con l'evidenza | `rows` |
| 4 | I suoi numeri — quelli su cui viene misurato | `table` + `items` |
| 5 | Che cosa ha detto, con le sue parole | `items` |
| 6 | Il piano che sta scrivendo adesso | `items` |
| 7 | Installato e contratti — **solo qui, mai in sala** | `table` |
| 8 | Le idee da portare, in ordine | `ideas` |
| 9 | Le referenze, con le cautele | `rows` |
| 10 | Le domande da fare, scritte parola per parola | `items` |
| 11 | Run of show | `timeline` |
| 12 | Say / Don't | `say`/`dont` |
| 13 | Buchi aperti | `table` |
| 14 | Fonti | `sources` |

- **Il dato prima del commento.** Dove una sezione ha una tabella *e* un elenco, si
  dichiara `"order": ["note","table","items"]`: una tabella di numeri letta dopo tre
  capoversi non è più una tabella, è una nota.
- **Un indicatore si spiega dove sta il numero.** Se il dossier porta KPI di mestiere
  (expense ratio, combined ratio, cost/income), il blocco `gloss` apre una voce per
  ciascuno con tre cose: che cos'è, che cosa dice davvero, e **come si usa in sala**. Chi
  entra senza l'esperto deve poter spiegare l'indicatore, non solo citarlo. Niente tooltip:
  su telefono l'hover non esiste e un overlay copre quello che si sta leggendo.
- **Voce istituzionale**, mai la seconda persona singolare (vale la regola dei deck).
- Chi va in sala senza l'esperto di soluzioni ha bisogno di **domande già scritte** e di un
  say/don't stretto: il dossier diventa più prescrittivo, non più lungo.

## 3 · Come si pubblica

Il contenuto è riservato: **non sta mai nel bundle statico**.

1. `apps/<slug>/src/pages/dossier.astro` = **wrapper sottile** (≈30 righe): importa
   `DossierPage` dal core, passa `docSlug`, `base`, le chiavi Supabase, e mappa la palette
   dell'app sul contratto `--dw-*`. **Non si copia il renderer dentro l'app**: è così che
   sono nate sei copie divergenti, una delle quali aveva rinominato i token a mano.
2. Riga `experiences` per la FK: migrazione **tracciata** `supabase/migrations/00NN_seed_<slug>.sql`.
3. Contenuto: seed **git-ignorato** in `docs/<Cliente>/00NN_seed_<slug>_dossier.sql`
   (`insert … on conflict do update` + `share_token = gen_random_uuid()`), più un README
   tracciato che dica dove sta.
4. Applica e leggi il token:
   `supabase db query --linked -f …` → `select share_token from restricted_docs where slug='…'`
   → link `…/<slug>/dossier/?t=<token>`.
5. Markdown master in `docs/<Cliente>/` (git-ignorato): è la base da cui si rigenera il seed.

**Mappare la palette** (nel wrapper, su `:root`): `--dw-bg --dw-tint --dw-surface
--dw-surface-2 --dw-line --dw-ink --dw-ink-soft --dw-ink-faint --dw-ink-strong --dw-accent
--dw-fill --dw-on-fill --dw-warn --dw-on-warn --dw-alt --dw-font-display --dw-font-body`.
Un accento **non è un inchiostro**: il colore di sistema del cliente su fondo scuro spesso
sta sotto 4,5:1 e per il testo serve la sua schiaritura. Si verifica il contrasto, non si
spera.

## 4 · La barra di qualità — misurata, non sperata

`pnpm audit:dossier` (o `DOSSIER_URLS="url1,url2" npx tsx scripts/dossier-audit.ts`) gira su
**320, 375, 390, 768, 1280** e deve uscire a **zero rilievi**:

| | Controllo | Soglia |
|---|---|---|
| a | barra fissa | ≤ 12% del viewport |
| b | scorrimento orizzontale | nessuno; una tabella larga scorre **dentro** il suo contenitore |
| c | tipo | corpo ≥ 16px · celle ≥ 14px · note ≥ 14px (le etichette di colonna ≥ 11px) |
| d | tabelle impilate | **ogni cella porta la sua intestazione** |
| e | bersagli tattili | ≥ 44×44 |
| f | indice | completo quando le sezioni sono più di sei |
| g | misura di lettura | 60–95 caratteri per riga sul desktop |
| h | stampa | niente comandi, carta bianca, URL delle fonti stampati |
| i | JavaScript | zero errori |
| k | contenuto | **nessun blocco reso vuoto**: una forma non supportata viene scartata in silenzio e la riga sparisce senza errore — in un dossier è il difetto peggiore, perché ciò che manca non si vede mancare |
| j | contenuto | nessun elemento sfora la **propria colonna** (il viewport non basta: un dominio lungo in una cella stretta esce dal riquadro senza allargare la pagina) |

**Gli errori che l'audit è nato per impedire** (tutti visti sul campo):
- l'avvertenza dentro la barra fissa: **330px, il 49% di un iPhone SE**, che ti segue per
  venti schermate;
- la tabella che su telefono nasconde l'intestazione: restano quattro numeri senza nome;
- celle a 11px perché «tanto è una tabella»;
- un figlio di griglia senza `min-width: 0`: una data o un codice sfondano la traccia e la
  **pagina intera** scorre di lato;
- `position:absolute; left:-9999px` per lo skip link: allarga l'area di scorrimento. Si usa
  il ritaglio a 1px;
- **i nomi dei campi inventati**: scrivere `{label, body}` dove il contratto dice
  `{k, v}` non dà errore, dà una riga vuota. È successo in un dossier già consegnato: un
  run of show intero, cinque righe, invisibile. Si corregge il contenuto, non si aggiungono
  alias nel motore — e il check `k` lo trova al giro dopo;
- la **gerarchia piatta**: il corpo a 16px è giusto, ma se su telefono il titolo di sezione
  sta a 20px e i numeri a 20, tutto sembra piccolo. La scala si apre sui titoli e sui
  numeri, non gonfiando il corpo — che allungherebbe soltanto la pagina.

Dopo l'audit si **guarda** comunque uno screenshot a 390 e uno a 1280: l'audit dice che si
può leggere, non che è bello.

## 5 · Marchi: perché un dossier non porta il co-brand

Prima o poi qualcuno chiede di mettere in testa il lockup «Adobe × Cliente», o di dare un
logo a ciascun formato. Per il dossier la risposta è **no**, per tre ragioni in ordine di
peso:

1. **Significato.** Il co-brand dichiara un artefatto fatto **con** o **per** quel cliente.
   Un dossier è fatto **su** di loro, e porta scritto che il cliente non deve sapere che
   esiste. Il loro marchio in testa afferma una paternità congiunta che non c'è.
2. **Rischio.** Dentro ci sono dati contrattuali, intelligence competitiva, a volte la
   lettura del carattere di una persona. La pagina è gated, ma il link gira in chat e il PDF
   finisce sui portatili. Con il lockup in testa, un documento che esce **sembra un
   documento ufficiale congiunto**: trasforma una fuga interna in qualcosa di molto peggio.
   Il segnale che deve dominare in testa è l'opposto — «Adobe internal · Riservato».
3. **Asset.** La regola del co-brand vuole l'**SVG ufficiale** che il cliente distribuisce;
   quasi nessun cliente lo distribuisce (su nove experience, una sola ha l'SVG vero: le
   altre ripiegano sul nome in carattere display). Il ripiego sarebbe un wordmark — che il
   titolo del dossier già è.

**E un logo per formato?** Non paga: è un sistema da disegnare e mantenere per ogni formato,
e non aggiunge informazione. Il formato è già scritto nel titolo («Dossier — …»), la
riservatezza nel badge, la paternità in «Adobe internal». Se si vuole che i formati si
riconoscano come una famiglia, la leva è il **sistema di token condiviso** — che il motore
unico già è — non un marchio.

Le experience e i deck restano un altro discorso: lì il co-brand è **binding** (vedi
CLAUDE.md → Firma co-brand), perché quello è materiale che il cliente vede.

## 6 · Che cosa NON fare

- **Niente immagini generate.** Un dossier è già lungo venti schermate e si apre in
  mobilità: un'immagine decorativa aggiunge peso e scroll, non informazione, e ai colleghi
  che valutano il lavoro legge come riempitivo. Il budget di qualità va nella tipografia,
  nell'indice e nelle tabelle.
- **Niente anteprima social / OG image**: il link gira in chat, e un'anteprima con il nome
  del cliente è esattamente la fuga che il gate serve a impedire.
- **Niente copia del renderer** dentro l'app (vedi §3.1).
- **Niente dati contrattuali fuori dalla loro sezione**, e mai a voce in riunione.
- **Il cliente non deve sapere che il dossier esiste.**

## 7 · Verifica prima di consegnare

```
pnpm --filter <app> build
grep -ril "<cognome>\|<cifra contrattuale>" apps/<app>/dist/    # deve dare 0
# senza token → gate; con ?t=<token> → contenuto
DOSSIER_URLS="<url>?t=<token>" npx tsx scripts/dossier-audit.ts  # 0 rilievi
git status                                                      # seed e master git-ignorati
```

Se il dossier prepara un incontro con un cliente reale, prima della consegna vale anche
la skill **`panel-review`**: l'audit prova che si legge, non che l'argomento regge.
