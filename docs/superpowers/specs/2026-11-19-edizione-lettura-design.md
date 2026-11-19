# L'edizione da distribuire — design

> 19 nov 2026 · prima istanza: `apps/intesa-esperienza-cliente` · poi: ogni experience
> Il repo è pubblico: in questo file ci sono ruoli, non nomi di persone del cliente né di Adobe.

## Perché esiste

Dopo la riunione del 19 novembre il referente della banca ha chiesto «il documento, o
comunque quello che ci potete dare», per raccogliere domande da mandarci offline. Il deck
di oggi è fatto per essere **proiettato da chi presenta**. Mandato come link si rompe in tre
punti, tutti verificati con le schermate del 19 nov:

1. **Sul telefono non si legge.** Nelle slide dei momenti i mockup non compaiono (resta un
   campo verde vuoto), i titoli si troncano («Quattro domande a cu…»), le parole vanno a capo
   a metà («Custome r»), le copertine dei capitoli coprono il titolo con la sfumatura. Il
   motore ha una sola regola sotto i 640px, pensata per non rompere, non per leggere.
2. **Chi legge da solo trova slide vuote.** I sotto-passi si aprono a clic. Chi presenta li
   apre, chi riceve il link vede l'occhiello su un campo verde e pensa che la pagina sia vuota.
   Succede su qualunque schermo.
3. **Le pagine di chi presenta sono pubbliche.** `/relatore/`, `/presentatore/`, `/admin/`,
   `/analytics/` rispondono 200 a chiunque provi l'indirizzo (`noindex`, ma non protette).
   `/relatore/` contiene lo script e le riserve («se chiedono…»).

E manca la cosa che il link deve produrre: **un contatto**. Oggi il deck finisce su «I
prossimi passi», scritto per la sala.

## Chi lo legge, e che cosa deve succedere

Due lettori, decisi dall'owner:

- **L'executive** — al livello di chi decideva in sala, o sopra. Riceve il link da un suo
  collaboratore o, meglio, da un pari. Lo apre **dalla posta, sul telefono, per pochi
  secondi**. Deve capire subito il valore proposto alla banca (personalizzazione spinta) e
  **scrivere a una delle tre persone Adobe** (l'owner e due colleghi dell'account) per un
  approfondimento.
- **L'operativo** — ci passa del tempo, passo per passo, per capire che cosa si può fare in
  più. Poi scrive con domande e spunti, **su una sezione precisa**.

**Il successo si misura in contatti e contributi ricevuti, non in visite.**

Il secondo prodotto, deciso dall'owner, è il **riepilogo per la banca**: le domande e gli
spunti raccolti, ordinati per funzione, che il referente della banca (il nostro sponsor in
sala) può portare **da solo** ai suoi vertici come prova che dentro la banca c'è interesse,
dall'operativo al dirigente. Può diventare l'innesco di un progetto più grande.

## Obiettivi

1. Un'**edizione da distribuire** dello stesso deck: stessa grafica, stesse slide, stesso
   racconto. Si toglie solo ciò che serviva a chi presentava.
2. Un **primo livello per il telefono** che si legge in meno di un minuto e rimanda al
   computer per la storia completa.
3. Un capitolo **«Parliamone»** al posto de «I prossimi passi»: le tre persone, un modulo,
   WhatsApp.
4. **«Chiedici di questo»** su ogni sezione, che porta al modulo con la sezione già indicata.
5. **Misura con consenso**: informativa breve e chiara, nulla attivo prima del sì, revoca
   in un tocco.
6. Il **riepilogo per la banca**, curato e protetto.
7. Tutto costruito **nel motore** (`packages/core`), così che ogni Storia, Blueprint o
   Playbook possa avere la sua edizione da distribuire. Intesa è la prima istanza.

## Non obiettivi

- **Non è un sesto tipo** della tassonomia. La tassonomia dice *che cosa* riceve il cliente;
  questa è un'*edizione* di qualunque tipo.
- **Non si riscrive il deck** e non si semplifica la UI: è piaciuta (owner).
- **Non si rende responsive ogni slide** per il telefono. Il telefono ha il suo primo livello.
- **Non si cambia la modalità sala**: l'URL e il comportamento di oggi restano identici.

## Anti-obiettivi — fallisce anche se funziona, se…

- **…il telefono mostra una pagina rotta.** Peggio di niente: il link si cancella e si
  inoltra con un commento.
- **…si traccia qualcosa prima del consenso**, o l'informativa è lunga, vaga o nascosta.
  È una banca, e quella stanza ci ha già scottati una volta (gara 2021-22).
- **…la scelta del ruolo blocca l'ingresso.** Una domanda prima di aver visto qualcosa di
  valore fa uscire proprio l'executive.
- **…il riepilogo pubblica un dubbio interno senza filtro** o identifica chi l'ha scritto.
- **…il riepilogo fabbrica consenso.** Mostra quello che c'è, anche quando è poco.
- **…mette pressione con una data.** Il referente ha detto «in questo momento no»: una
  scadenza lo spinge proprio lì (owner).
- **…si vede la pagina del relatore.**

## Vincoli

- Repo **pubblico**: nessun nome di persona del cliente nei file tracciati; i nomi Adobe
  delle tre persone del capitolo «Parliamone» stanno nei dati dell'app solo se l'owner lo
  conferma (sono già nel deck? da verificare in `src/data/`), altrimenti si caricano da
  Supabase. I contributi e i nomi di chi scrive vivono **solo in Supabase**, mai nel repo.
- Le regole di `CLAUDE.md` e `.claude/rules/experience-decks.md` restano tutte: copia umana,
  niente colori o spaziature fissi, token, co-brand, `audit:deck`, `audit:wrap`,
  `audit:ritmo`, panel review prima della consegna.
- Hosting: GitHub Pages (statico) + Supabase (anon può **solo inserire**; legge solo
  `authenticated`), come `deck_events` (migrazione `0014`).
- L'informativa, prima di uscire, va fatta leggere a chi in Adobe si occupa di privacy:
  **non la diamo per approvata noi**.

## Le decisioni dell'owner (non si ridiscutono)

1. Edizione dedicata, rivolta al cliente, da distribuire: un **mini sito**, non più il deck
   presentato.
2. «I prossimi passi» diventa **contattaci**: modulo + WhatsApp verso il numero dell'owner.
3. Tracciamento solo con **informativa sintetica, chiara, trasparente**; l'utente può
   **negare qualunque tracciamento**.
4. **Ruolo facoltativo**, da una lista chiusa, che cambia ciò che si mostra.
5. Non stravolgere UX e UI; **primo livello da telefono che richiama al computer**.
6. **Riepilogo per la banca**, con la scelta di firmarsi o restare anonimi.
7. **Nessuna scadenza** per la raccolta.
8. Il riepilogo deve servire a mostrare **consenso e volontà di procedere** dentro la banca.

## Il disegno — le scelte prese qui (chiamata di chi scrive, correggibile)

### 1. Come esiste l'edizione

Una **modalità del motore**, non una copia dell'app: stessa sorgente, due build.
- La build sala resta all'URL di oggi.
- La build lettura esce a un **percorso suo** (es. `/intesa-esperienza-cliente/leggi/` o un
  alias dedicato — al builder), con un flag di build (`EDF_EDIZIONE=lettura`).
- In modalità lettura il motore **non emette** relatore, presentatore, admin, analytics,
  circolo, `risultati-old`, «In dieci minuti» (il taglio è per la sala). Verifica: ogni
  rotta esclusa dà 404 nella build lettura.
- ⚠️ La build **sala** continua a esporre `/relatore/`. Quel link non si manda più a nessuno;
  proteggerla è un lavoro separato (P1), non di questo design.

### 2. Il deck in modalità lettura (computer e tablet)

| Elemento | Sala | Lettura |
|---|---|---|
| Copertina | «Incontro del 19 novembre», «Agenda dell'incontro» | Titolo e sottotitolo identici; niente data dell'incontro; **«Da dove volete partire»**: i percorsi (vedi §4), poi l'indice intero |
| Sotto-passi | a clic | **si aprono da soli** all'arrivo sulla slide, con la stessa sequenza animata; con `prefers-reduced-motion` già aperti |
| Giulia, momenti doppi | colonne sotto i 1040px, righe sopra | **colonne sempre**: si legge «lei fa → la banca risponde» sulla stessa riga (valutazione sotto) |
| Scheda «Prodotto Adobe» | nascosta sotto i 940px | **sempre presente in forma compatta** (una riga: nome + che cosa fa): senza relatore è l'unica frase che dice che cosa si sta guardando |
| Barra in alto | sei capitoli | sei capitoli, l'ultimo è **«Parliamone»**, più un'icona fissa «Scriveteci» |
| Fine di ogni capitolo e di ogni momento | — | **«Chiedeteci di questo»**: apre il modulo con la sezione già scritta |
| Pulsante presentazione / schermo intero | sì | schermo intero sì, modalità presentazione no |
| `audit:deck` | 3 viewport | stessi viewport **più 1366×768 e 1512×860** (portatili con il browser aperto: è lo schermo vero di chi riceve il link) |

**Giulia a colonne o a righe — la valutazione.** Le colonne non sono nate con l'ultimo
commit (`f2f38c9`): esistevano sotto i 940px, il commit ha portato la soglia a 1040 per un
difetto vero (testata sotto la barra a 1512×982). Per chi riceve il link sono quasi sempre
le colonne, perché un portatile o un monitor 1080p con il browser aperto stanno sotto i
1040px. Le colonne leggono meglio: causa ed effetto sulla stessa riga, mockup alla stessa
altezza, niente vuoto. Le righe, sopra i 1040, lasciano mezza fotografia vuota nella riga di
Giulia. L'unico costo delle colonne è la scheda «Prodotto Adobe», ed è per questo che in
lettura torna compatta. **In sala non si cambia niente.**

### 3. Il primo livello sul telefono

Sotto una soglia di larghezza (il builder la misura; indicativamente < 768px in verticale) il
link **non apre il deck**: apre una **pagina verticale che si scorre**, costruita con gli
stessi token, caratteri e fotografie.

Contenuto, in quest'ordine:
1. Co-brand, titolo della storia, una frase sul valore (dalla copia esistente, non nuova).
2. **Giulia in sette righe**: per ogni momento una riga di Giulia e una della banca, con la
   miniatura del mockup (immagine statica generata dalla slide, non il mockup vivo).
3. Le tre persone di «Parliamone» con i pulsanti **Scrivi**, **WhatsApp**, **Email**.
4. **«La storia completa si legge sul computer»** con due azioni: *mandatemela per email*
   (un `mailto:` a sé stessi con il link già dentro, nessun dato a noi) e *apri comunque*
   (entra nel deck, a rischio di chi sceglie).
5. Il piè con l'informativa.

Tempo di lettura dichiarato: meno di un minuto. Si misura (`audit:wrap`, schermate a
360×740, 390×844, 430×932, e il panel dal telefono).

### 4. Il ruolo, facoltativo

- Dove: in copertina, sotto «Da dove volete partire», come **scorciatoia**, mai come
  cancello. Senza scelta si entra dal percorso standard.
- La lista (proposta, da confermare): **Direzione · Marketing e comunicazione · Dati e
  analisi · Tecnologia · Canali digitali · Rete e filiali · Compliance e privacy · Altro**.
- Che cosa cambia: **il percorso, non il testo**. Ordine dei capitoli, capitolo d'ingresso,
  sezioni evidenziate. Nessuna copia scritta per ruolo (ogni variante andrebbe verificata e
  revisionata come un deck intero).
- Si ricorda nel browser della persona (`localStorage`) e si cambia in ogni momento.
- **Va nei dati solo con il consenso alla misura** (§6) o se la persona lo mette in un
  contributo (§5).

### 5. «Parliamone» e i contributi

**Il capitolo** sostituisce «I prossimi passi». Tre schede: foto, nome, ruolo in Adobe, una
riga su che cosa può approfondire, e i contatti. Sotto: il modulo.

**WhatsApp**: link `https://wa.me/<numero>?text=<testo>` verso il numero dell'owner, con il
testo già impostato («Buongiorno, ho una domanda sulla sezione “<sezione>” della storia
Adobe × <cliente>»). Nessun dato passa da noi.

**Il modulo** (sempre lo stesso, aperto da «Parliamone», dall'icona «Scriveteci» o da
«Chiedeteci di questo»):
- sezione (precompilata, modificabile);
- testo (obbligatorio);
- ruolo (facoltativo, la lista di §4);
- nome e contatto (facoltativi) — **senza contatto non possiamo rispondere**, e lo si dice;
- **due consensi separati, entrambi spenti di default**:
  1. «Potete includere questo contributo, **senza il mio nome**, nel riepilogo per la banca»;
  2. «Potete mostrare **il mio nome** accanto al contributo nel riepilogo».
  (Il 2 ha senso solo con il 1.)
- dopo l'invio: una conferma che dice che cosa succede adesso («lo leggiamo entro…» —
  impegno da confermare con l'owner).

**Dove vanno**: tabella Supabase `contributi` (anon **inserisce soltanto**):
`id, progetto, edizione, sezione, testo, ruolo?, nome?, contatto?, ok_riepilogo bool,
ok_nome bool, stato ('nuovo'|'approvato'|'escluso'), risposta?, ts`.
Vincoli di lunghezza e un limite anti-abuso lato database (come `deck_events`).

**L'avviso**: a ogni contributo l'owner riceve una notifica entro pochi minuti
(mail o push; il meccanismo è del builder — Database Webhook di Supabase, Edge Function, o
il giro del Radar).

### 6. Misura con consenso

**Regola**: senza un sì esplicito **non parte nessuna chiamata** di misura. Il sito non usa
cookie; l'unico dato che si salva nel browser prima del consenso è la scelta stessa.

**L'avviso**, una fascia in basso alla prima apertura, al massimo tre righe:

> Vorremmo sapere quali parti di questa storia vi sono utili, per preparare le risposte su
> quelle. Se accettate, registriamo quali pagine aprite e per quanto tempo, ed eventualmente
> il ruolo che avete scelto: niente nome, niente indirizzo IP, niente cookie.
> [Accetto] [No, grazie] · Informativa completa

**L'informativa completa** (una pagina, cinque paragrafi brevi): che cosa si registra · perché
· chi lo vede (il team Adobe dell'account, nessun altro) · per quanto (proposta: 12 mesi, da
confermare con la privacy Adobe) · come si revoca (link fisso nel piè, un tocco).

**Che cosa si registra con il consenso**: gli eventi di `deck_events` (slide, tempo, taglio,
lingua, sessione casuale) **più** `edizione`, `ruolo` se scelto, `codice_link` se presente
(§7), `versione` (commit della build), e tre eventi: video avviato, «Chiedeteci di questo»
aperto, modulo inviato. Le sessioni sotto i 10 secondi visibili e senza un cambio di slide
si scartano in lettura (i filtri antiphishing delle banche aprono i link da soli).

`DeckTelemetry` oggi è **attiva salvo rifiuto**: in modalità lettura diventa **spenta salvo
consenso**. L'Atelier resta com'è.

### 7. Il codice del link (facoltativo)

`?r=<codice>` breve e non parlante, uno per destinatario a cui lo mandiamo noi; serve a
capire **se il link circola** (stesso codice, più sessioni e dispositivi). Il legame
codice → persona vive solo nel registro d'account (git-ignorato), mai nel repo né in
Supabase. Si registra solo con il consenso.

### 8. Il riepilogo per la banca

- **Una pagina protetta** (stesso meccanismo dei dossier: gated su Supabase, `?t=<token>`),
  stampabile in PDF pulito. Il token si dà al referente della banca.
- **Contenuto**: per ogni funzione, i contributi approvati con la nostra risposta; in testa
  **l'ampiezza** (quante funzioni, quanti livelli hanno partecipato). Organizzato per **aree
  evolutive**, non come voto a favore o contro.
- **La voce è quella della banca**; Adobe compare con discrezione, come chi ha reso
  possibile la raccolta. Il referente lo deve poter presentare come suo.
- **Curatela**: noi approviamo e rispondiamo (`stato`, `risposta` in Supabase); il
  referente **lo vede e lo approva** prima di portarlo in alto.
- **Soglie**: una funzione con meno di 3 contributi non si mostra da sola (finisce in
  «Altre funzioni»); il riepilogo resta in bozza finché non hanno scritto almeno **3
  funzioni**. Nessuna pagina «zero contributi».
- **Nessuna scadenza**. Quando arrivano contributi nuovi approvati, il referente riceve da
  noi un aggiornamento — mai a cadenza fissa.
- Le **risposte** si verificano come ogni affermazione davanti a un cliente (Fluffy + fonti
  pubbliche): in riunione il 19 qualche promessa è andata oltre.

### 9. Il cruscotto per noi

Una vista autenticata (console o pagina gated) per account: aperture per giorno, codici,
ruoli, capitoli più letti, contributi per stato. In più, `/accounts` mostra i contributi
nuovi fra i rilievi del mattino. Il formato è del builder.

## Che cosa resta al builder

- Il nome e il percorso della build lettura; come il flag passa al motore.
- La soglia esatta del primo livello telefono e come si generano le miniature dei mockup.
- Il meccanismo di notifica.
- Lo schema SQL preciso, le policy, i limiti anti-abuso.
- Il cruscotto.
- Come «Chiedeteci di questo» si posa nelle slide senza rompere `audit:deck` (probabile:
  nel chrome del deck, non dentro la slide).

## Come si verifica

1. Build sala **identica** a prima (diff del `dist` sulle rotte esistenti, o schermate a
   confronto).
2. Build lettura: rotte escluse in 404; `audit:deck` (viewport ampliati), `audit:wrap`,
   `audit:ritmo`, 0 HARD.
3. Telefono: schermate a 360/390/430 di larghezza del primo livello; nessun overflow
   orizzontale; corpo ≥ 16px.
4. Consenso: con «No, grazie» **zero richieste** verso Supabase (verificato sul pannello di
   rete); con «Accetto» gli eventi arrivano; revoca → si fermano.
5. Modulo: inserimento anonimo ok, lettura anonima negata, notifica arrivata.
6. Riepilogo: senza token niente; sotto soglia in bozza; stampa PDF pulita.
7. **Panel review** sull'edizione lettura, con le personas della banca, **dal telefono e
   dal portatile**.

## Scelte prese dopo la verifica del builder (chiamata di chi scrive)

- **Chi legge i dati.** `authenticated` oggi è chiunque abbia un login alla console, su tutte
  le experience: troppo largo per nomi e contatti di dipendenti di una banca, e in contrasto
  con l'informativa («il team Adobe dell'account»). `contributi` e gli eventi dell'edizione
  si leggono solo da chi è in una tabella `progetto_membri (progetto, user_id)`, via RLS.
- **Lingua.** L'edizione Intesa esce **solo in italiano**: la stanza era italiana e ogni
  testo nuovo (informativa, modulo, telefono, riepilogo) passerebbe due volte dalla
  revisione. Il motore resta bilingue: un'altra experience potrà uscire in due lingue.
- **Ruolo = funzione.** Nel riepilogo «funzione» è il campo `ruolo`. Un contributo senza
  ruolo finisce in «Funzione non indicata» e **non conta** per la soglia delle 3 funzioni.
- **Percorsi per ruolo.** La mappa (capitolo d'ingresso, ordine, sezioni evidenziate) la
  propone chi scrive come tabella di dati, e l'owner la corregge prima della build. Finché non
  è approvata, il ruolo si raccoglie ma **non cambia il percorso**.
- **Approvazione del riepilogo.** Il referente lo approva **a voce o per mail**: la pagina
  gated resta in sola lettura, il token non scrive niente.
- **Nessuna chiamata di rete prima del consenso**, nemmeno per i contatti: nomi, ruoli e
  link di contatto sono **statici** nella build (vedi la domanda sul numero).

## Fasi proposte (da confermare con l'owner)

1. **Subito** — Intesa, edizione lettura senza misura: copertina, sotto-passi automatici,
   colonne, rotte del relatore escluse, primo livello telefono, «Parliamone» con WhatsApp ed
   email. Costruita **nel motore** ma accesa solo su Intesa.
2. **Poi** — il modulo e i contributi (Supabase, RLS per progetto, notifica).
3. **Dopo il parere privacy** — avviso, informativa, misura con consenso, codici link.
4. **Con i primi contributi** — il riepilogo per la banca e il cruscotto.
5. **Dopo Intesa** — l'edizione diventa una voce di `pnpm new:experience` e del template.

## Le risposte dell'owner (19 nov 2026)

1. **Due versioni**, validate prima con l'Account Executive e poi, se serve, scelte dal
   referente della banca. Le due versioni sono **la stessa build con due interruttori**, non
   due deck:
   - **A · «Da leggere»** — edizione lettura + primo livello telefono + «Parliamone» con
     email e WhatsApp. **Nessuna misura, nessun avviso, nessun modulo**: zero chiamate di
     rete verso di noi. Non serve informativa.
   - **B · «Da costruire insieme»** — A + modulo e «Chiedeteci di questo» + riepilogo per la
     banca + misura con consenso.
   Lasciare la scelta al referente è coerente con il resto: il riepilogo è suo, e anche il
   livello di coinvolgimento lo decide lui. Costo: due percorsi da verificare, non due deck.
2. **L'informativa deve essere minima**, perché una complessa diventa l'argomento per farci
   togliere tutto. Quindi: in **B** l'avviso resta di tre righe e l'informativa di cinque
   paragrafi brevi; la misura registra **solo** quello che serve a capire che cosa interessa
   (pagine, tempo, ruolo scelto). **Il codice del link (§7) esce dal perimetro**: è la voce
   più difficile da spiegare e quella che somiglia di più a un tracciamento individuale. Il
   parere della privacy Adobe resta da chiedere prima di B (chi: da individuare).
3. **«Parliamone»**: le tre persone con nome, foto e ruolo come nel capitolo «Adobe, chi
   siamo» (`adobe.astro`), tranne l'owner, che compare come **Product Sales Specialist** e
   basta. Email di tutti e tre (verificate dalla posta). **WhatsApp solo per l'owner e per
   l'Account Executive**. Numeri ed email sono statici nella build: l'owner ha accettato che
   siano pubblici. I numeri stanno nei dati dell'app, non in questo documento.
4. **Nessun impegno di risposta** nella conferma del modulo.

## Revisione del 19 nov sera — prevale su §5, §6, §7 e §8 dove li contraddice

Fatto: in Adobe non c'è nessuno che possa approvare un'informativa (owner). Quindi **non si
raccoglie niente che ne chieda una**.

- **Misura (§6) eliminata.** Niente avviso, niente consenso, niente `DeckTelemetry`, niente
  eventi per slide. Resta **un contatore delle aperture**: all'apertura della copertina o
  della pagina breve, un solo inserimento in Supabase con **giorno** (data, senza ora) e
  **pagina** (`copertina` | `breve`) — che dice anche telefono o computer senza leggere niente
  del dispositivo. Nessun cookie, nessuna memoria nel browser, nessun identificativo, IP non
  salvato. Se `navigator.globalPrivacyControl` è vero, non si conta. Nel piè di pagina una
  frase: «Contiamo quante volte questa pagina viene aperta, giorno per giorno. Nessun dato su
  chi la apre.» Il clic sul link **non** si conta con un indirizzo intermedio: un dominio
  estraneo in una mail a una banca la fa sembrare phishing, e i filtri la cliccherebbero.
- **Codice del link (§7) eliminato.**
- **Modulo (§5) anonimo per costruzione**: sezione, testo, **funzione** (facoltativa),
  **livello** (facoltativo: operativo · responsabile · dirigente). Niente nome, niente
  contatto, niente consensi da spuntare: chi vuole una risposta personale usa email o
  WhatsApp, che sono accanto al modulo. La tabella `contributi` perde `nome`, `contatto`,
  `ok_nome`; `ok_riepilogo` resta come unica casella («potete usarlo nel riepilogo per la
  banca»), spenta di default.
- **Riepilogo (§8), la firma è per funzione e livello**, mai per persona:
  - accanto a un contributo compare **solo la funzione**, e solo se quella funzione ha
    almeno 3 contributi approvati, altrimenti «Altre funzioni»;
  - il **livello non compare mai accanto a una frase**, solo nei conteggi in testa («24
    contributi da 6 funzioni: 14 operativi, 7 responsabili, 3 dirigenti»); un livello sotto
    3 si fonde con il vicino;
  - chi si identifica nel testo viene riformulato da noi in curatela, idea intatta.
- Il contatore entra nella **fase A**; modulo e riepilogo restano la **versione B**.

L'ordine delle fasi diventa: **A** (subito, nel motore, accesa su Intesa) → **B** (modulo,
riepilogo, misura) → estensione a `pnpm new:experience`.
