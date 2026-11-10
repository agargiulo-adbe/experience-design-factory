# Handover — Parte 19 di 21
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

Dieci commit su `apps/trenitalia-prospettiva-sales`, da `b23baee` a `34dbb4b`, due anche sulla vetrina. ⚠️ **Nessuna persona del panel ha visto questo stato** (vedi backlog, Parte 2).

**I pop-in dei prodotti.** Ogni tessera «si aggiunge» della striscia `Fascia` è un bottone che apre un `<dialog>` a passi (`components/ProdottoPop.astro`, testi in `data/pop.ts`, stile in `styles/pop.css`). La chiave è **prodotto × caso d'uso** (campo `pop` in `SERVE`): dieci scene, otto prodotti. Si avanza con frecce, spazio o telecomando; all'ultimo passo si richiude. Il dialog sta dentro la slide perché fuori da quella attiva erediterebbe `visibility: hidden`, e porta `data-audit-skip` perché la stessa striscia compare su due slide di una pagina. La scena CJA sul percorso d'acquisto mostra lo strato sopra le fonti e chiude l'obiezione sulla doppia misura in tre tappe (legge, riceve, sostituisce). La nota dice che finché convivono si licenziano entrambi: lo scrive la documentazione Adobe.

**Schede e locandine in agenzia: la storia è un test deciso prima.** Il confronto fra agenzie con la scheda e senza non prova niente, perché chi riceve più carta vende già di più. Ora la scheda parte in due ondate assegnate a sorte fra agenzie simili, si misura la scheda ricevuta e si controlla il diretto nella stessa zona. Il pannello degli esperimenti di CJA **non si usa**: senza assegnazione casuale la sua pagina dice «does not have a causal interpretation», e non accetta dati di sintesi. Per questa sola domanda CJA non serve, e in sala si dice. Rapporto completo nella cartella d'account (git-ignorata). ⚠️ Nessun operatore di agenzia ha letto il disegno; non è stato trovato nessun test pubblicato sulla carta in agenzia.

**Altro.** Figura a tre finestre su `slide-momenti` (stessa homepage, tre persone, una per ogni ↓). `slide-collab` spenta con `MOSTRA_COLLAB`: il meccanismo sta nel pop-in, e sulla slide Costa entrano tessera e riga su titolarità e contratto. Mockup LLM Apps con `@Trenitalia`, perché un'app si richiama per nome o la propone l'assistente. Pillole della mappa a larghezza uguale con `nomeBreve` («GenStudio»), una funzione sola per striscia e mappa. Letto sonoro con la traccia gratuita già licenziata per Intesa, quindi nessuna licenza consumata. Immagini della Puglia rigenerate con elementi riconoscibili del luogo: restano generate, non fotografie.

**Versione senza rete.** `scripts/build-offline.sh <cartella>` (`PUBLIC_OFFLINE=1`) porta caratteri, clip e audio accanto al deck; si apre da «Apri il deck.command». Uscita git-ignorata perché contiene i nomi del team. Va rilanciata dopo ogni modifica. Da sapere: gli scostamenti della console stanno nel browser per indirizzo, quindi non passano da online a locale.

**Perimetro Analytics e Target, verificato il 10 nov** (estratto d'uso e tag caricati dal vivo; numeri nella cartella d'account). Analytics: trenitalia.com e Le Frecce confermati dal vivo su due report suite distinte; l'app risulta dalle chiamate mobile nella suite delle Frecce, deduzione solida ma l'estratto non la nomina. Target: confermato su trenitalia.com e assente da lefrecce.it. **«Solo home page» non è verificato**: la libreria parte su tutte le pagine interne provate, e dove stanno le attività si vede solo nell'elenco attività di Target. Il pop-in CJA dice ancora «App · Domani», ed è sbagliato: vedi backlog.

**Fatti da non riusare.** Il «converte molto di più» e il 50-60% sul traffico AI valgono per il retail: sui viaggi USA a maggio 2026 la conversione è ancora il 28% sotto il traffico non AI (Adobe, 17 giugno 2026). Il deck `trenitalia-connessioni` dice ancora il contrario.

⚠️ **Trappola del giro.** Un commit è partito con un audit HARD perché stava nello stesso comando (`e3a44b4`, corretto da `6846357`): il commit si condiziona al conteggio degli HARD. E `build-offline.sh` cancella l'uscita prima di ricostruirla: se una rete cade a metà, la copia locale resta monca, quindi si verifica dopo.

