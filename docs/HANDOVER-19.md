# Handover — Parte 19 di 23
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## §43 · BPER «Sopra quello che avete» — il Blueprint del 12 novembre, e lo strato XD

**31 ott 2026.** `apps/bper-sopra-quello-che-avete` · tipo **Blueprint** · IT · spenta
sullo showcase. Nasce in una giornata, dall'apertura dell'account allo stato attuale.

### §43.1 · Perché i capitoli non sono quelli del tipo
Lo scheletro «blueprint» propone scenario · fondamenta · use case · convergenza · valore ·
rotta. Qui i capitoli di contenuto sono **le slide che il referente CRM ha già concordato** il 26
ottobre e che porta al suo capo il 6 novembre. Cambiarne il taglio vorrebbe dire presentarsi
con un documento diverso da quello annunciato, a un incontro dove la presentazione passa da
lui cinque giorni prima. L'ultimo capitolo è l'ask.

⚠️ **Da otto capitoli a sette, dopo il secondo giro.** «Adobe, e perché non è un CRM» era
stato svuotato al primo giro — chi governa le fabbriche digitali di una banca ha poca
pazienza per le slide che spiegano chi è il fornitore — ed è rimasto per un giro come
copertina sola: una voce su otto nell'indice e nella barra, che faceva sembrare il documento
più lungo di quanto fosse. La tesi che doveva portare sta in copertina e nella mappa, che è
dove si dimostra invece di essere annunciata. Rimosso anche da `deck-routes.ts` e dal
`PAGE_REGISTRY` della console.

### §43.2 · Lo strato XD, e perché sta nel motore
La forma di `intesa-esperienza-cliente` — copertina a due colonne con l'agenda cliccabile,
divisore di capitolo, slide con occhiello/titolo/lead/chiusa, architettura a strati, cifre,
passi, referenze — era prigioniera di quell'app come `.im-*`. Ora è
**`packages/core/src/styles/xd.css`**, con un nome: **XD**. Porta geometria e le regole di
leggibilità già pagate; **non** porta colori di marchio, che restano nei token dell'app. Il
contratto è la famiglia `--xd-*`. **Intesa non è stata migrata di proposito**: va in sala il
5 novembre. I tre difetti che XD ha già insegnato a evitare stanno nel CLAUDE.md di root,
sezione «Lo strato XD».

### §43.3 · Il design system, e il caso in cui sistema e marchio coincidono
Letto da `pnpm brand:tokens https://www.bper.it`: petrolio `#005157` a 300 occorrenze. Di
norma il più frequente è il colore di sistema e il marchio è raro; qui **coincidono**, e non
è stato dedotto — `#005157` è insieme `--lwc-colorTextDefault` del loro design system e il
`fill` del logotipo ufficiale che la banca distribuisce. Le superfici scure sono le custom
property che il sito espone (`#002023`, `#003134`, `#004146`). Caratteri: Archivo Narrow e
Nunito Sans, sostitute dichiarate di Giorgio Sans e Proxima Nova Soft. L'arancio `#ea862c`
ha **un mestiere solo**: marcare ciò che cambia nell'architettura.

⚠️ **Evidenza letta dalle loro superfici, per la riunione:** il sito pubblico serve il design
system di Salesforce Lightning (558 `lwc`, 85 `aura`) e carica **due soli script di terze
parti**; nessuno strumento di analisi Adobe. Sta nel dossier, non in slide.

### §43.4 · Il panel, e le quattro affermazioni che non reggevano
Giro 1 il 31 ott: cinque personas cieche (responsabile fabbriche digitali, responsabile CRM,
architetto dei dati, chi fa campagne, integratore della gara) più il controllo dei fatti.
**Media 3,4/5**, rischio percepito 2,2, tutti «conditional». Verdetto e grezzi in
`docs/BPER/PANEL-VERDICT-2026-10-31-round1.md` e `docs/BPER/panel/2026-10-31-round1/`.
Quattro errori di merito corretti, tutti trovati dal panel e nessuno dai gate: **«la misura
senza spostare il dato» era falsa** (i dati usati in Customer Journey Analytics sono ingeriti
in Experience Platform: il capitolo ha ora due colonne, entra / resta); **«l'arbitro vive
dentro la licenza della regia» era falsa** (Decisioning è una voce di listino a sé, quindi i
moduli che entrano sono **quattro**); **tre driver di prezzo su quattro erano sbagliati**; e
**due affermazioni sul sistema del concorrente** non reggevano. Più un errore in negativo: la
slide delle referenze regalava **TSB**, storia pubblicata da Adobe sugli stessi moduli, e ora
è in pagina. Tagli chiesti all'unanimità: la slide di posizionamento (5 su 5) e la tassonomia
delle tre forme di referenza (4 su 5). Aggiunta per il buco trovato dal business: **che cosa
cambia in una settimana di lavoro**.

### §43.4-bis · Il secondo giro, e i cinque errori che nessun gate vede
Giro 2 il 31 ott, stesse personas, pacchetto di evidenza rigenerato: **media 3,6**, rischio
percepito **2,2 → 3,0**, rilevanza **3,4 → 3,8**, azionabilità **3,6 → 3,8**, e chiarezza
**4,0 → 3,6** — l'unico asse sceso, per una ragione aritmetica: *lo stesso fatto contato in
quattro modi diversi*, e il conteggio sbagliato su una slide proiettata. Verdetto in
`docs/BPER/PANEL-VERDICT-2026-10-31-round2.md`, grezzi in `docs/BPER/panel/2026-10-31-round2/`.
Due giri sono il massimo: non ci sarà un terzo panel, e il backlog è stato applicato lo
stesso giorno. Quello che ha cambiato il documento:
1. **Il cliente l'arbitro ce l'ha già.** Il comunicato BPER del 23 novembre 2022 scrive che
   il loro motore di Marketing Automation «consente di calcolare dinamicamente la miglior
   proposta commerciale per ogni singolo cliente (Next Best Action)». Il deck lo negava in
   tre punti. È la lezione più cara del giro: *l'affermazione di assenza su un cliente si
   verifica sulle sue pagine, non sulla nostra impressione* — e la sua fonte è la più forte
   che esista. Ora la riga dice «presente, non configurato come arbitro fra canali», e il
   capitolo chiude su una domanda.
2. **Il conteggio ha una fonte unica** (`CONTEGGIO` in `src/data/condivisi.ts`): i blocchi e
   i moduli sono due unità diverse, ed è mescolarle che produceva quattro numeri.
3. **La federazione ha tre tempi** e non uno: l'evento in tempo reale, la composizione
   federata *programmata* («a static composition, updated when the federated audience
   composition is executed», e non vale per le qualificazioni di audience), la decisione in
   sessione che legge il profilo già in piattaforma.
4. **Il ripiego non è il timeout** — scatta quando nessuna proposta è eleggibile — e
   **l'eleggibilità filtra, non pesa**: in banca l'ammissibilità di un'offerta è un filtro a
   monte, e descriverla come peso è un comportamento che il cliente non può autorizzare.
5. **Il «perché no» non è un registro automatico**: lo ricostruisce il Decisioning Explainer
   di Coworker, dal 16 settembre 2026, con licenza sua.
Più i numeri della referenza riscritti sulla fonte (il «sei volte» misura i clienti messi in
contatto, non quelli raggiunti; i 3.000 sono l'1% dei 300.000 a rischio) e **tre slide nuove**
che rispondono a tre buchi strutturali: come si misura il beneficio, che cosa manca per una
stima in giornate, come si esce (esternalizzazione e reversibilità).

### §43.4-ter · Che cosa è stato chiuso il 1 novembre
Il backlog del secondo giro lasciava sei punti aperti dichiarati. Cinque sono chiusi:
- **La scheda di connettività esiste**: `docs/BPER/SCHEDA-CONNETTIVITA.md` (git-ignorata), una
  pagina per l'architetto dei dati del cliente. Dentro c'è il conflitto fra le tre pagine
  ufficiali su Oracle dichiarato per intero — la pagina dei prerequisiti elenca **sette**
  magazzini e Oracle non c'è; la pagina delle connessioni lo copre dalla 11g in su «purché
  raggiungibile da una rete esterna»; la tabella della connettività privata elenca cinque
  database e Oracle non c'è — più le sette domande per loro e le quattro cose che portiamo noi.
- **Residenza, cifratura, chiavi e titolare** sono una slide nuova (`dato · slide-governo`), e
  la riga che conta è quella che non ci conviene: **una regione italiana non esiste**, in Europa
  continentale c'è l'Olanda. Il dato è cifrato in transito e a riposo con chiavi di sistema; le
  chiavi del cliente sono un componente a sé e la scelta non è reversibile.
- **I quattro numeri di perimetro** (identità attive, eventi all'anno, rinfresco degli
  attributi, volumi di invio) sono nella richiesta, accanto all'agenda delle quattro ore.
- **Chi perde copertura quando l'arbitro decide** è una condizione di chiusura della fase 03:
  gli obiettivi di chi perde si rivedono nella stessa sede che governa i pesi.
- **Il ritmo**: `audit:ritmo` segnalava due deserti di quattro schermate senza un elemento
  visivo. Tre figure in più — il rientro dei dati, la misura del beneficio, la lettura del
  profilo nel taglio — e `G1` è a zero: **15 slide su 33 portano un disegno** (la media del
  monorepo misurata il 24 ott era il 12%).
  ⚠️ Lezione di composizione: **una figura dentro una colonna disallinea le altre** (la riga
  della griglia si allunga sulla voce più alta). Va sotto la lista, allineata a sinistra.
Resta aperto quello che dipende da altri: le **due date** della mezza giornata, la **risposta
dell'assistenza** sulla connessione privata a Oracle con gli indirizzi di egress, la **chiamata
fra pari** con la referenza, e le **giornate per fase**, che il documento promette scritte
entro una settimana dalla mezza giornata.

### §43.5 · Stato dei gate
Al 1 novembre: `copy-audit` 0 HARD e 0 SOFT su **627 stringhe** · `audit:deck` **0 HARD** ai
tre viewport su 9 rotte (SOFT `i` 79, `a` 44: un deck ad ancore li fallisce per costruzione) ·
`audit:ink` pulito su **440 blocchi**, con i «Scopri come» aperti · `audit:fonti` nessun link
rotto (i due di business.adobe.com rispondono solo a un browser vero: aperti a mano) ·
`audit:taglio` allineato · `audit:ritmo` **G1 a zero**, 15 slide su 33 con un elemento visivo ·
`content-audit`, `audit:og`, `audit:docs` e `typecheck` verdi · `audit:dossier` **0 rilievi su
5 viewport**. `audit:wrap` resta a **24**: i residui sono tutti gruppi di tre o quattro parole
a fine frase, e legarli oltre questo punto crea catene — ed è la catena che ha già prodotto uno
sbordamento HARD su questo deck. `pnpm lenti`: frase media 9 parole, Gulpease 74, e delle
diciassette negazioni in coda ne è stata tolta **una**, l'unica che non si guadagnava il posto.

### §43.6 · Che cosa manca, in ordine
- **P0 di consegna:** si manda e si proietta il **taglio**, con il percorso intero come
  allegato. Sette schermate e non sei: la settima è quella che parla a chi fa campagne, e al
  secondo giro era rimasta nell'allegato — il referente aveva chiesto «sei o sette».
- **La scheda di connettività, una pagina, prima del 12**: connettore e versione minima,
  porta, autenticazione, indirizzi da mettere in lista bianca, chi tiene il certificato, e lo
  stato di fatto sulla connessione privata. Il deck dichiara che la portiamo scritta: è
  l'unico impegno del documento che oggi non ha ancora un file dietro.
- **Due date per la mezza giornata**, da prendere sul calendario prima del 12: la slide dice
  che le proponiamo noi entro due settimane dal 12.
- **La stima in giornate**: la slide dice quali quattro numeri la stringono e che arriva
  scritta entro una settimana dalla mezza giornata. È una scadenza nostra.
- **La chiamata fra pari con TSB**: richiesta da aprire al programma referenze. La slide dice
  che la chiediamo, non che è confermata.
- **Tre domande senza risposta nostra:** se la loro piattaforma di profilazione sia un
  magazzino interrogabile; se l'incentivo sulla migrazione valga per questo cliente da solo
  (la risposta ricevuta argomenta sull'altra banca); se esistano contratti Adobe in essere.
- **Nessuna immagine**: i divisori usano la variante a due campi, e `show_in_showcase`
  resta `false`.

---

---

## 37.18 Prospettiva Sales · Panel review del 9 novembre (giro delta) e stato al 10

> Sta qui e non nella Parte 16 per dimensione. Il resto di §37 è nella Parte 16.

**Panel review — 2026-11-09, giro delta, sei personas più fact-checker e arbitro.** Credibilità 3,5 (−0,17) · rilevanza 3,33 (−0,34) · chiarezza 4 (=) · rischio 2,83 (−0,5) · azionabilità 2,33 (−1,5). Verdetto: può andare in sala dopo i 14 P0, quasi tutti di una riga. Verdetto completo e JSON in `docs/Ferrovie/` (git-ignorata), `PANEL-VERDICT-2026-11-09-round1.md`. ⚠️ Il pacchetto è stato catturato con «Riduci movimento», altrimenti i sotto-passi risultano vuoti: `scripts/panel-evidence.mjs` non lo fa ancora.

**Applicati:** la frase finale, la contraddizione fra «subito» e marzo 2027, «già nel Gruppo», l'anno di AEM, «una sola filiera», la Germania tolta dai concorrenti, CJA tolta dall'incrocio con Costa (fra le sorgenti documentate di Collaboration non compare), i limiti della misura, il numero da guardare sulla mappa, la riga sul confine con la piattaforma del Gruppo.

**Decisioni dell'owner, il 10 nov:** nessuna riga sul passo successivo; resta il nome «Real-Time Collaboration» benché il fact-check lo dia per errore; lo sponsor si dice a voce.

**I consensi, per chi ne parlerà.** Il responsabile dei canali digitali ha detto di faticare a *spostare* i consensi fra due piattaforme web. CJA con Privacy & Security Shield non lo risolve: legge e filtra (GA 21 set 2026), non sposta né riconcilia; serve un dataset Profile popolato con `consentPoliciesIDMap`, e con il solo CJA è da confermare. Il filtro esclude chi non ha tutte le policy e non si recupera. Il codice al banco è di campagna, non di persona, e una locandina si misura solo con un codice per scheda.

## 37.19 Prospettiva Sales · il giro del 10 novembre (dopo il panel)

Dodici commit su `apps/trenitalia-prospettiva-sales`, da `b23baee` in avanti, uno anche sulla vetrina. ⚠️ **Nessuna persona del panel ha visto questo stato** (vedi backlog, Parte 2).

**I pop-in dei prodotti.** Ogni tessera «si aggiunge» della striscia `Fascia` è un bottone che apre un `<dialog>` a passi (`components/ProdottoPop.astro`, testi in `data/pop.ts`, stile in `styles/pop.css`). La chiave è **prodotto × caso d'uso** (campo `pop` in `SERVE`): dieci scene, otto prodotti. Si avanza con frecce, spazio o telecomando; all'ultimo passo si richiude. Il dialog sta dentro la slide perché fuori da quella attiva erediterebbe `visibility: hidden`, e porta `data-audit-skip` perché la stessa striscia compare su due slide di una pagina. La scena CJA sul percorso d'acquisto mostra lo strato sopra le fonti e chiude l'obiezione sulla doppia misura in tre tappe (legge, riceve, sostituisce). La nota dice che finché convivono si licenziano entrambi: lo scrive la documentazione Adobe.

**Schede e locandine in agenzia: la storia è un test deciso prima.** Il confronto fra agenzie con la scheda e senza non prova niente, perché chi riceve più carta vende già di più. Ora la scheda parte in due ondate assegnate a sorte fra agenzie simili, si misura la scheda ricevuta e si controlla il diretto nella stessa zona. Il pannello degli esperimenti di CJA **non si usa**: senza assegnazione casuale la sua pagina dice «does not have a causal interpretation», e non accetta dati di sintesi. Per questa sola domanda CJA non serve, e in sala si dice. Rapporto completo nella cartella d'account (git-ignorata). ⚠️ Nessun operatore di agenzia ha letto il disegno; non è stato trovato nessun test pubblicato sulla carta in agenzia.

**Altro.** Figura a tre finestre su `slide-momenti` (stessa homepage, tre persone, una per ogni ↓). `slide-collab` spenta con `MOSTRA_COLLAB`: il meccanismo sta nel pop-in, e sulla slide Costa entrano tessera e riga su titolarità e contratto. Mockup LLM Apps con `@Trenitalia`, perché un'app si richiama per nome o la propone l'assistente. Pillole della mappa a larghezza uguale con `nomeBreve` («GenStudio»), una funzione sola per striscia e mappa. Letto sonoro con la traccia gratuita già licenziata per Intesa, quindi nessuna licenza consumata. Immagini della Puglia rigenerate con elementi riconoscibili del luogo: restano generate, non fotografie.

**Versione senza rete.** `scripts/build-offline.sh <cartella>` (`PUBLIC_OFFLINE=1`) porta caratteri, clip e audio accanto al deck; si apre da «Apri il deck.command». Uscita git-ignorata perché contiene i nomi del team. Va rilanciata dopo ogni modifica. Da sapere: gli scostamenti della console stanno nel browser per indirizzo, quindi non passano da online a locale.

**Perimetro Analytics e Target, verificato il 10 nov e portato nel deck** (`13a86b2`; estratto d'uso e tag caricati dal vivo, numeri nella cartella d'account). Analytics: trenitalia.com e Le Frecce confermati dal vivo su due report suite distinte; l'app risulta dalle chiamate mobile nella suite delle Frecce, deduzione solida ma l'estratto non la nomina. Target: parte sulle pagine di trenitalia.com e non su lefrecce.it. «Solo home page» è smentito dai tag; «tutta la parte prima del login» viene dall'owner e da fuori non si può verificare. Una definizione sola in `contenuti.ts` (`PERIMETRO`, `PERIMETRO_CORTO`) per striscia e mappa; nel pop-in CJA l'app non è più una fonte futura. ⚠️ Domanda che resta aperta: Target lavora prima del login, quindi la seconda finestra di `slide-momenti` («Chi è registrato») presuppone di riconoscere il cliente su quelle pagine, o di estendere Target: va detto se chiedono.

**Fatti da non riusare.** Il «converte molto di più» e il 50-60% sul traffico AI valgono per il retail: sui viaggi USA a maggio 2026 la conversione è ancora il 28% sotto il traffico non AI (Adobe, 17 giugno 2026). Il deck `trenitalia-connessioni` dice ancora il contrario.

⚠️ **Trappola del giro.** Un commit è partito con un audit HARD perché stava nello stesso comando (`e3a44b4`, corretto da `6846357`): il commit si condiziona al conteggio degli HARD. E `build-offline.sh` cancellava l'uscita prima di ricostruirla, e una rete caduta a metà l'ha lasciata vuota: ora costruisce a parte e sostituisce solo se è completa.

## 37.20 Prospettiva Sales · il giro dopo il dry run (10 novembre, 10:30-14:15)

Diciassette commit da `65745cf` a `3942b9a`, tutti su `apps/trenitalia-prospettiva-sales`. ⚠️ **Nessuna persona del panel li ha visti.** Fonti: chat Teams del dry run (commenti di due colleghi), chat con l'AE, scelte dell'owner in sessione.

**Agenzie (idea 4), riscritte.** Il test delle schede in due ondate esce: era macchinoso, e per quella domanda CJA non serviva. Ora è «Quanto vende davvero una campagna, dal sito fino all'agenzia»: campagne, sito, app e venduto per agenzia nella stessa analisi, sul modello presentato da Unipol al Summit 2026. Senza un identificativo al banco il confronto resta per agenzia e zona. In Unipol Dynatrace misura la performance di sistema (ECID): non si cita come tracciamento dello strumento degli agenti. La striscia porta solo CJA.

**Capitolo 03.** La slide delle tre misure (`slide-leva`, che aveva assorbito il referto) è spenta con `MOSTRA_LEVA`: scelta dell'owner. La misura resta nel riquadro della slide Matera («7 e 2 su 8») e nelle note. Campione: «Abbiamo posto queste domande unbranded…». LLM Apps: «Un'app Trenitalia dentro gli assistenti AI», annunciata e non disponibile nella nota.

**Personalizzazione.** Chi è registrato si riconosce con CJA che unisce i due Analytics (trenitalia.com e Le Frecce); il CRM è un arricchimento (livello CartaFreccia). Da confermare: identificativo di login nei dati Analytics, e passaggio del pubblico da CJA a Target via Experience Platform. Mockup a comparsa anche su `slide-prima` e `slide-unposto`.

**Prodotti e collaborazione.** Experience Manager Assets ha il filetto tratteggiato «Fondazione FS» (nel Gruppo, non in Trenitalia: confermato dall'AE). Creative Cloud: in uso in Trenitalia, crediti Firefly inclusi. Real-Time Collaboration: «si confronta, poi si attiva» (Discover, Activate, Measure; segnata Limited Availability nella documentazione).

**Roadmap e mappa.** La Roadmap a barre è stata provata e scartata dall'owner: torna il binario. Cambia invece la mappa in chiusura (`MappaIdee forma="righe"`): una riga per idea, senza binario né numeri. «Il numero» si nasconde sotto i 960 px di altezza. Testo: «piattaforma cliente annunciata a marzo». La linea della cronologia ora arriva all'ultima tappa (il gap fra colonne non era contato).

**Immagini e testi.** Famiglia e coppia della Puglia rigenerate in quadrato: le figure erano allungate dalla generazione, non dal CSS. «Workfront: Richieste e approvazioni», «GenStudio for PeM», link Workfront alla pagina business.

⚠️ **Online indietro.** Alle 14:27 il deploy di `3942b9a` era in corso da venti minuti e quello di `e1bed67` annullato: online era a `115b8e8`. La versione senza rete (`localhost:4827`) e `localhost:4471` erano identiche all'ultimo commit. Il deploy di un commit successivo (`7a43b22`) ha portato online anche queste modifiche: alle 14:35 testo e asset `_astro` delle 11 pagine coincidevano fra online e `localhost:4827`. Da confermare restano l'identificativo di login nei dati Analytics e il passaggio CJA→Target.

---

<!-- §42 vive nella Parte 18; questa sotto-sezione è nata qui l'11 nov 2026 perché la Parte 18
     era a 1,9 KB dal tetto. Stesso schema di 37.18-37.20, che stanno qui e non nella Parte 16 -->

## 42.13 Storia di Intesa · la sera del 10 novembre e la rotta delle campagne (11 novembre)

**Sei commit dopo l'handover del 10** (`a504124`), dalle 22:30 del 10 alle 00:09 dell'11, **tutti pubblicati** (deploy riuscito): `7a43b22`, `376d7a8`, `ee00a1a`, `fdd61f5`, `ae91ab3`, `685832b`. Il panel resta fermo al **30 ottobre** — non copre né questo giro né i due precedenti, e il check col referente è l'**11 nov alle 14:15**.

### «Dove ci innestiamo» a sei slide, e la revisione dell'intero deck (`7a43b22`, `376d7a8`)

- **Tolte «unifica» e «motore»**: ripetevano schema, pop-in e capability (canali in un percorso solo, motore di targeting). Il capitolo resta a **sei slide**.
- **Schema a tre componenti con il «+»** che apre i deep dive; **Real-Time CDP ha il suo pop-in a 5 passi**. L'architettura dice chi fa cosa: lo strumento di campagna di oggi tiene campagne pianificate e invii massivi, Journey Optimizer · AI Decisioning i percorsi a evento.
- **«Decisioning» → «AI Decisioning» ovunque.** Slide delle capability su quattro verbi: **riconosce · sceglie · agisce · misura**.
- **«Quattro domande a cui CJA risponde»** (`376d7a8`): due figure quasi identiche (due linee che salgono) diventano **un disegno per meccanismo** — tappe in fila, telefono → filiale, barre che calano col punto di rottura, lente → pubblico — con la domanda della banca sopra e la risposta sotto, domande allineate fra le card.
- **Attribuzione** con il linguaggio dello strumento («attribuzione delle firme»); lo «Scopri come» è diventato due ancore in slide e una domanda nelle note del relatore. **Slide di ritorno a mappa** in chiusura di capitolo.
- **Revisione dell'intero deck**: **una sola superficie scura** (Crédit Agricole e Santander era l'unica chiara), **un solo occhiello verde** (il rosso Adobe resta nella firma), corpi leggibili nei capitoli 05-07, card di Coworker a disegno e ancora, demo a griglia su tutta la larghezza, **cifre TSB in grande**, blu di «Farsi trovare» portato a **`#5b9bff`** per il contrasto, note accorciate. Lo Scenario non mescola più il nostro schema con i dati della ricerca.
- **Scenario**: titolo **«Quasi una famiglia su due vuole simulare la rata prima di lasciare il nome»** (fonte Nomisma/MutuiSupermarket, maggio 2026).

### La sera del 10 (`ee00a1a`, `fdd61f5`, `ae91ab3`)

- **Una scala tipografica sola** (`ee00a1a`). Misurati a 1920, i titoli delle slide di contenuto andavano da **29 a 58 px** — sette misure diverse — e i sottotitoli da 19 a 25. Ora titolo ≈ **48 px** e sottotitolo ≈ **24 px** ovunque, in `clamp` sul viewport; un gradino sotto dove il titolo divide la slide con un disegno grande (il giro di Giulia, il banner, i momenti) e su `approfondimenti`, che a 1280 sbordava. Copertine invariate.
- **Scenario.** La frase chiave entra **dopo** il dato, con evidenziatore e tre pulsazioni che si fermano; con «Riduci movimento» la frase si mostra già evidenziata (niente pulsazioni, niente attesa) — la regola del guscio sensoriale applicata anche qui.
- **Momenti.** Riga di apertura (quando · dove) più grande, i mockup riempiono la colonna di destra, e gli annunci portano **copy da annuncio vero** con un verbo d'azione, non testo segnaposto. Il richiamo resta su email, sito e social.
- **Copertine.** Movimento lento sulle immagini (scala 1 → 1,06 in 14 s, **una volta**, non in loop); ritratto di Giulia intero sugli schermi 21:9.
- **AI Decisioning: la proposta esclusa cambia ragione.** Era lo sconto under 36, escluso «per esposizione»; non reggeva, perché **Giulia ha 34 anni e ne ha diritto** — un cliente che guarda la slide se ne accorge. Adesso la proposta esclusa è la **polizza casa**, «solo dopo la firma».
- **Innesto, nelle note del relatore.** «Campagne» è lo strumento di oggi, e Journey Optimizer può prendere **anche le campagne pianificate** nella fase che sceglieranno (*orchestrated campaigns*, documentate da ago 2025). ⚠️ La consegna **da strumenti terzi non è nativa**: va detta come domanda, non promessa.
- **Attribuzione.** Etichette «Solo canali digitali» / «Con Customer Journey Analytics», legenda delle barre, allineamenti.
- **A capo armoniosi** (`text-wrap: pretty`/`balance`) su tutto il testo delle slide; copertina con colonne che crescono con lo schermo.
- **Un difetto che esisteva solo in locale** (`ae91ab3`): gli URL degli sfondi dei momenti **senza virgolette**. Online funzionava; in locale no, perché il percorso della cartella di lavoro contiene **spazi**. La regola era già applicata alle altre pagine — è la terza volta che questo difetto nasce dove non è stata ripetuta.

### La rotta delle campagne (`685832b`, 11 nov 00:09)

**Perché c'è.** Verificato su Fluffy e Experience League: le *orchestrated campaigns* di Journey Optimizer sono **documentate da agosto 2025**, quindi «Campagne» nello schema è lo strumento di **oggi** e AJO può prendere **anche le campagne pianificate**, non solo i percorsi a evento. **Direzione strategica dell'owner**: mettere sul tavolo l'**evoluzione completa** dallo strumento di campagna di oggi verso Journey Optimizer, **per fasi** — una proposta di direzione, i tempi li decide la banca.

Sotto lo schema dell'innesto entra una **rotta in tre fasi**, una per `data-substep` — si scopre a mano, chi parla decide quando si legge:

1. **Accanto** — percorsi a evento su Journey Optimizer, campagne come oggi
2. **Una famiglia alla volta** — le campagne pianificate passano su Journey Optimizer
3. **Una sola piattaforma** — percorsi e campagne nello stesso posto

Alla terza fase il riquadro **«Campagne» dello schema si spegne** (opacità 0,55, contorno tratteggiato) e mostra un'etichetta **«→ Journey Optimizer»**: la direzione si vede invece di essere raccontata. Bilingue via `<T>`, note del relatore aggiornate, e sugli schermi bassi (`max-height: 920px`) le descrizioni delle fasi si nascondono per non comprimere lo schema.

⚠️ **Lo strumento di oggi non si nomina**, né in slide né in `/relatore/` — e la ragione sta nel codice, in un commento: **il deck gira fra i colleghi del cliente**. È la stessa decisione di §42.12, applicata una seconda volta senza che nessun gate la imponga.

⚠️ **La consegna da strumenti terzi non è nativa** (i Custom Channels di Journey Optimizer sono in **Limited Availability da luglio 2026**): sta **nelle note del relatore come domanda**, non in slide come promessa.

⚠️ **Il CSS della rotta è cresciuto a strati, ed è stato committato così**: due blocchi `@media (max-height: 920px)` separati e un blocco di correzione che ridichiara `.im-rotta::before`, `.im-rotta li` e il `display` del badge «→ Journey Optimizer». Funziona a schermo, ma **quale regola vinca sul badge** non è stato verificato *(da verificare)*: P1 di pulizia.

### Gate e stato

- **Sul committato**: `copy-audit` 0 HARD / 0 SOFT · `astro check` 0 · `audit:deck` **0 HARD a 1920, 1440, 1280 e 2560** · `audit:ink` pulito · `audit:taglio` allineato (`7a43b22`, `ee00a1a`). Su `685832b`: `copy-audit` 0 HARD, `audit:deck` 0 HARD a 1920/1440/1280.
- ⚠️ **A 3840×2160 sette slide dei momenti hanno rilievi preesistenti** (l'etichetta «Giulia · Non ancora cliente»): `wallScale` non è acceso su questo deck, ed è la regola — si accende dopo `audit:deck -- --tv` a 0 HARD, non prima. P2.
- ⚠️ **Non rilanciati**: `audit:fonti` (timeout di rete) e `audit:og`. P1.
- **Aperti**: panel sullo stato pubblicato (P0) · i due audit · registro d'account, Goldmine, fonti pubbliche dei casi FSI (P1, dal 10) · momenti a 3840 e la congiunzione appesa su `approfondimenti/slide-integrazioni` a 1280 (P2).

## 42.14 Storia di Intesa · il panel dell'11 novembre, due giri, e che cosa è rimasto aperto

**Due giri di panel review** sullo stato pubblicato, sei seggi: il Targeting che ha convocato, il suo responsabile CRM, il marketing digitale, Group Technology (seggio **derivato**, senza persona confermata), i Canali, il consulente della banca. Più il fact-checker. Personas cieche, verificato sui transcript: **zero letture fuori dal pacchetto**. Verdetti e JSON in `docs/<Cliente>/` (git-ignorata), `PANEL-VERDICT-2026-11-11-round1.md` e `-round2.md`.

| Asse | 30 ott (g2) | 11 nov g1 | 11 nov g2 |
|---|---|---|---|
| credibilità dei fatti | 4,0 | 4,0 | 4,0 |
| rilevanza | 4,0 | 3,5 | 4,0 |
| chiarezza | 4,0 | 3,67 | 4,0 |
| rischio (5 = nessuno) | 3,2 | 3,17 | 3,67 |
| azionabilità | 4,0 | 3,67 | 4,0 |

Sei «condizionato» su sei in entrambi i giri. Il **primo giro** ha trovato che i giri del 6-10 novembre avevano fatto scendere tre assi: la **rotta delle campagne** (`685832b`) disegnava una sostituzione sotto un titolo che diceva «aggiunge», e la chiusura affermava un'assenza sulla banca («manca chi decide») che la sua Divisione smentisce in pubblico. Più cinque fatti smentiti alla fonte: GenStudio non controlla le informative, Journey Optimizer non ha un canale social, Data Feeds ≠ Full Table Export, l'arbitro non chiama il core in sincrono, il 5 dicembre è sabato.

**Decisioni dell'owner (11 nov):** in slide si proietta solo la tappa «Accanto», e le altre due posizioni vanno nel dettaglio come opzioni della banca · la chiusura diventa una proposta · il motore a monte è «da confermare» col referente · si applicano tutti i P0 e i P1.

**Come è stato applicato.** Tre agenti in worktree isolati, divisi per proprietà dei file (approfondimenti · innesto/struttura/taglio · racconto/chiusura), con le **frasi canoniche scritte una volta** in un brief comune (confine sul motore, precedenza, regola di contatto, eleggibilità, canali, glossario dei sistemi). Merge senza conflitti, raccordi a mano (`b727554`), poi i P0 del secondo giro (`6d1c288`). Che cosa è cambiato, in sintesi:
- **Innesto**: «Il vostro motore resta a monte», Campagne «come oggi», una sola tappa in vista e «Le altre posizioni» a richiesta. Il badge «→ Journey Optimizer» e il CSS cresciuto a strati sono stati tolti, e la rotta ora vive in `styles/innesto.css`.
- **Il passaggio Analytics → Customer Journey Analytics entra nel capitolo 04** (era fra gli approfondimenti), come chiedeva l'invito. `adobe/slide-fsi` esce dalle frecce: è la pagina `adobe-in-cifre`, raggiunta dalla riga di fonte.
- **Tre slide nuove**: `approfondimenti/slide-integrazioni-dati` e `-crm` (dieci collegamenti più il riquadro DORA non entravano a 1280: si è divisa la slide, il tipo non è stato toccato) e `prossimi-passi/slide-soglia` (soglia, ripresa, unità del controllo, vincolo per la Rete, ask).
- **Il taglio «In dieci minuti»**: c'è la slide «Accanto», compaiono tutte e sette le misure e il seguito in una riga; resta a sei slide.
- **La firma di Giulia è mercoledì 9 dicembre**, perché l'8 è l'Immacolata.
- **Sugli schermi alti fino a 940px** (1440×900, 1280×800) la vista «In Intesa Sanpaolo» dei momenti cadeva sulla foto chiara, e il titolo bianco non si leggeva. `audit:ink` misura **solo a 1920** e non lo vedeva: la foto in quella disposizione ora è abbassata. ⚠️ È un buco del gate, non di questo deck.
- La pagina `/relatore/` costruisce il link `?c=` delle **slide davanti proposte** (`DAVANTI` in `relatore.ts`). È una proposta e non spegne nulla di default.

**Gate su `6d1c288`**: `audit:deck` 183 righe **0 HARD** (solo SOFT `a`/`i`/`g`) · `copy-audit` 0 HARD, 1 SOFT (una frase canonica di 29 parole) · `audit:ink` pulito · `audit:taglio` allineato · `audit:fonti` nessun link rotto, nove link business.adobe.com «da aprire a mano» · `astro check` 0 · `audit:wrap`: resta la copertina del taglio, che va a capo sulla virgola, cioè sul confine giusto.

**Che cosa è sopravvissuto al secondo giro** (punti aperti, niente terzo giro):
- **La CDP attuale**: il deck la nomina e non le dà un ruolo accanto a Real-Time CDP. È l'obiezione che il panel giudica più pericolosa, e la risposta è del cliente.
- **I mesi al primo invio** (Solutions Consultant) e la **forma della fase 0 e della licenza** (costo, nome Adobe, integratore, durata minima): decisioni dell'AE, da chiudere prima del 17.
- **Il motore a monte**: il nome è «da confermare» col referente.
- **Coworker**: la regola di uscita (fuori dall'agenda se l'attivazione non è confermata entro il 17) è da decidere.
- **La slide del team**: sette nomi, contro i cinque dell'invito.
- I 17 P1 e 6 P2 del secondo giro stanno nel verdetto.
- Le domande per il check col referente (11 nov, 14:15) sono state preparate in chat dai due verdetti.

### La mattina dell'11: copia, sintesi e il feedback del team (dopo il panel)

Giro di copia e grafica chiesto dall'owner, più i commenti di un collega del team Adobe sul thread interno. **Non coperto dal panel**: niente terzo giro, per regola.
- **Scenario**: «La nostra lettura» diventa una fascia a tutta larghezza con i sei canali dei momenti, divisi dal momento del nome (assistenti AI, annunci, sito → email, filiale, app).
- **Innesto**: titolo dal feedback del team, «Adobe si aggiunge con tempo reale, decisione e analisi multicanale» (fonte unica `TITOLO` in `data/innesto.ts`, uguale nel taglio corto). **I sistemi della banca non si nominano più, nemmeno SAS «da confermare»**: si scrive «motore di targeting», come per lo strumento di campagna. Real-Time CDP «il profilo di clienti e prospect, anche prima del nome», perché tiene anche i clienti (rilievo giusto del collega); Journey Optimizer e CJA con la copia del team, semplificata.
- **«Le altre posizioni» → «Come possono evolvere le campagne»**: tre tappe in fila (si parte da qui · se lo decidete voi), la frequenza come nota di fase 0.
- **Il passaggio Analytics → CJA torna fuori percorso**: la scelta dell'owner del 10 nov era stata ribaltata dal giro del panel senza dirlo. Resta raggiungibile da `slide-cja-banca`.
- **Prossimi passi da quattro slide dense a due**: la proposta (ask, quattro misure; le altre tre e la soglia a richiesta) e come si parte (tre tappe con chi guida e quando; che cosa si fa a richiesta). Le cinque cose da portare sono in `approfondimenti/slide-serve`, dati in `data/serve.ts`. `slide-soglia` non esiste più.
- **Slide di ritorno** di nuovo più ricca: torna la riga di AI Decisioning (le regole riviste a fine trimestre) e «Giulia, ora cliente» che passa al motore della banca.
- **Pop-in Real-Time CDP** riscritto in parole piane, e le etichette dei passi ora si leggono: erano grigio chiaro su bianco, e `audit:ink` non apre i pop-in. **Momenti**: a 1440×900 e 1280×800 il testo cadeva sulla foto chiara, e la foto ora è abbassata. m-05 e m-06 riscritti, con le parole del collega su m-06. «Capitolo 03.1.1» corretto.
- **Gate**: `audit:deck` 177 righe, 0 HARD · `copy-audit` 0 HARD · `audit:ink` pulito · `audit:taglio` allineato · `audit:fonti` nessun link rotto · `astro check` 0.

### L'ultimo giro della mattina dell'11 (`ea3c77f`, `1fc829d`)

- **«Nome» → «email»**: «prima del nome» era una metafora, ma Giulia lascia l'email con il consenso. Il lessico ora è **anonima · email · profilo**, ovunque (scenario, innesto, pop-in, momenti, misure, chiusura), IT ed EN. «Contatto» scartato: in banca vuol dire anche «contattare».
- **«Accanto» era gergo nostro**: la posizione da cui si parte si chiama «Percorsi nuovi su Journey Optimizer · le campagne restano come oggi», anche nel taglio corto e nel piano di evoluzione.
- **Real-Time CDP** passa al verde pieno come Journey Optimizer e CJA. Il colore dice «questo lo porta Adobe»; il bordo bianco resta solo sul motore della banca.
- `customer journey analytics` legato con spazi unificatori nei titoli: andava a capo dentro il nome.
- **Gate su `1fc829d`**: `audit:deck` 177 righe 0 HARD · `copy-audit` 0 HARD · `audit:ink` pulito · `audit:taglio` allineato · `audit:og` PASS (16/16 pagine, `adobe-in-cifre` compresa) · `audit:fonti` nessun link rotto · `astro check` 0. Due rilievi di `audit:wrap` lasciati: nel dettaglio delle fasi, la frase va a capo dopo una virgola.

### Titolo, agenda e barra allineati ai contenuti (11 nov, fine mattina)

Analisi chiesta dall'owner: lo stesso capitolo aveva fino a tre nomi diversi (agenda, barra, copertina e `<title>`). «02 L'offerta» era un'ancora che nella barra non si accendeva mai; il caso di Giulia, metà del deck, stava sotto «Dal dato alla decisione»; la riga sotto la 04 citava una slide uscita dal percorso; il taglio corto aveva un altro titolo. **Decisioni dell'owner**, che sostituiscono l'agenda del team del 9 nov:
- **Titolo in due livelli**, uguale nei due percorsi (`TITOLO_INCONTRO` in `data/agenda.ts`): «Acquisire chi non è ancora vostro cliente» + «dal primo segnale alla firma».
- **Sei voci, nomi dal contenuto**, gli stessi in agenda, barra (`VOCI_NAV`), copertine e `<title>` (`CHAPTERS`): 01 Adobe e l'offerta · 02 Giulia: un mutuo, sette momenti · 03 Dove ci innestiamo (*e come si misura, con Customer Journey Analytics*) · 04 CX Enterprise Coworker · 05 Tre banche che lo fanno già · 06 La proposta e come si parte. La copertina di Giulia non ha più numero (`Divisore` accetta `num` vuoto), così non si leggono due «Capitolo 02» di fila.
- Il fondo delle voci d'agenda copre la scia della clip, che prima si vedeva attraverso.
- **Gate**: `audit:deck` 177 righe 0 HARD · `copy-audit` 0 HARD · `audit:ink` pulito · `audit:taglio` allineato · `audit:og` PASS · `astro check` 0.

### I P1 di fatto rimasti dal secondo giro (`2e3dd73`)

- **Dato Nomisma**: il 45% riguarda gli intervistati, non le famiglie, e non dice «online» → «Quasi una persona su due vuole poter simulare la rata del mutuo».
- **Coworker**: «Agentico» non è un modulo pubblico → «Projects · in arrivo, non ancora disponibile»; l'attivazione «passa dal team Adobe e va confermata», senza legarla al settore (la distinzione per settore regge solo su fonte interna); la frase-formula sul piano riscritta.
- **Coerenze**: la demo Coworker usa le 12 ore di m-05 (non 48); il consenso di m-03 è «via email», coerente con m-04; spesa per canale e 91% di TSB detti in un modo solo; tolto il tetto di contatti «filiale compresa» (non documentato) e la formula «Ogni giro migliora il prossimo».
- **Restano aperti** (fatti del cliente o decisioni): Adobe Analytics «che avete» solo da fonte interna; eventi del sito via SDK e via connettore; incrementalità degli annunci di ripresa; sub-fornitori DORA e regione dei log di Brand Visibility; peso di Crédit Agricole contro TSB; una riga per la Rete in Coworker.

## 42.15 Storia di Intesa · il check col referente, la revisione del capitolo 03 e il panel del 12 novembre

Branch **`feat/intesa-check-calabrese`** (worktree separato, `main` intatto per scelta dell'owner): `7eb8b71`, `81d745a`, `5d84aa0`, `5d6980a`. **Non è su `main`**: il sito pubblico mostra ancora lo stato dell'11.

### Che cosa è entrato
- **Il check col referente dell'11 nov** (registro d'account, riservato). Il suo ufficio lavora sui clienti già acquisiti; il racconto va tenuto completo e in equilibrio fra chi acquisisce e chi gestisce; la cosa che vale di più per loro e per il Controllo di Gestione è una chiave che ricostruisce la storia del cliente fra canali digitali e fisici. **Vocabolario della banca su tutto il deck**: non clienti (non prospect), pseudonimo (non cookie), data lake, iniziative commerciali. Le citazioni delle referenze di altre banche restano con le loro parole.
- **Capitolo 03** rinominato «Dove si collega Adobe e che cosa si misura» (barra: «Integrazione»): cornice sul perimetro esistente e cornice Experience Platform sui tre componenti, con il numero del momento di Giulia su ciascuno; slide nuova **`slide-chiave`** (pseudonimo → email → NDG, la storia che non si perde alla firma, Edge/file/connettori, fonti: stitching di CJA e Identity Service); copia rivista riga per riga su una revisione del team (slogan, metafore come «arbitro», rassicurazione ripetuta). Il titolo dell'innesto proposto con l'elenco dei tre componenti usciva dall'area sicura a 1440 e 1280: ora è «Adobe aggiunge tre componenti ai sistemi attuali».
- **I sette momenti**: un campo `messa` per momento (che cosa è prodotto Adobe, che cosa entra via API, che cosa resta del front-end della banca), reso sotto la tessera del prodotto; momento 02 con i controlli di compliance in produzione (Content checks e Activate di GenStudio, verificati su Experience League).
- **Coworker**: tolta la distinzione Chat/Projects; video della demo in pagina da un link pubblico AEM in una costante (`VIDEO_DEMO`). ⚠️ È un **segnaposto con un altro marchio**: non si proietta.
- **Team** a sei: il product marketing non è in sala il 19.

### Il panel del 12 novembre (due giri)
Stesse sei personas dell'11, fact-checker, arbitro; pacchetto d'evidenza rigenerato dal branch con i pop-up estratti dal DOM. Verdetti `docs/<Cliente>/PANEL-VERDICT-2026-11-12-round1.md` e `-round2.md` (git-ignorati).

| Asse | 11 nov g2 | 12 nov g1 | 12 nov g2 |
|---|---|---|---|
| credibilità dei fatti | 4,0 | 4,0 | 4,0 |
| rilevanza | 4,0 | 3,5 | 3,67 |
| chiarezza | 4,0 | 3,0 | 3,0 |
| rischio (5 = nessuno) | 3,67 | 3,0 | 3,0 |
| azionabilità | 4,0 | 3,33 | 3,67 |

Sei «condizionato» su sei in entrambi i giri. **I voti sono scesi rispetto all'11**: il capitolo 03 è più denso (circa 870 parole fra schermata e pop-up) e il panel ha letto i prossimi passi senza mesi né regola d'uscita. Applicati: «Tre banche» era falso (i casi sono quattro, uno è Unipol) → «Tre banche e Unipol»; cifre Unipol del Summit tolte (nessun link pubblico); l'assenza di score sui non clienti diventa domanda ovunque; il trimestre si conta dal primo invio; costo «attribuito» e controllo che giudica; NDG; base giuridica col DPO; DORA con criticità ed esternalizzazione in capo alla banca; tempi del Decisioning attribuiti alla funzione precedente. La rotta `analytics/` è un rimando: tolta da `deck-routes` (finiva nel pacchetto come doppione).

**Non applicati, di proposito**: passaggio Analytics → CJA nel percorso principale (l'11 l'owner l'aveva rimesso negli approfondimenti); togliere IVR e ATM dalla chiave (li ha nominati il referente); pop-up fuori dall'innesto e Coworker in backup (scelte dell'owner); mesi, licenza, chi paga la fase 0 (servono AE e Solutions Consulting, non si inventano). Sono nel backlog (Parte 2).

### Gate e stato
`audit:deck` 0 HARD su 180 slide × viewport (202 con la rotta di rimando), `copy-audit` 0 HARD su 1.720 stringhe, `audit:wrap` pulito, `audit:taglio` allineato, `audit:ink` pulito. Slide toccate guardate a 1920 e a 1280. Il **dossier** di `intesa-innesto` (seed `0031`, riservato) è riscritto per il 19 — stanza a 27, check dell'11, obiezioni con la risposta, buchi aperti — ma **non è applicato su Supabase**.
