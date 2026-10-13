# Handover — Parte 16 di 17
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
