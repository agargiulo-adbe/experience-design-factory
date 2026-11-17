# Il wording di una experience: tredici regole ricavate da un deck che funziona

> Ricavate il 17 nov 2026 leggendo tutta la copia di `apps/intesa-esperienza-cliente`
> (il deck che l'owner indica come riferimento di voce) e la sua storia git, poi
> confrontandola con un deck nuovo dello stesso registro. Sono regole **nuove** o
> **affinamenti dichiarati** di quelle che già esistono: `umanizzazione.md` (i quattro
> giri), `ancore-non-prosa.md` (la forma della slide), CLAUDE.md «Copy voice».
> Si applicano nel **Giro 0** di `/umanizza`, e prima ancora quando si scrive la prima
> stesura.

## Che cosa ha detto la misura, prima delle regole

La differenza di qualità fra i due deck **non stava nella stilometria**: frase media
(8,0 contro 8,2 parole) e Gulpease (76,9 contro 76,3) erano quasi uguali. Stava in tre
punti, e nessun gate li vedeva:
- **la forma dei titoli**: il 47% erano «inventari» («Quattro momenti…», «…, in cinque
  passi»), contro il 18% nel deck di riferimento;
- **le domande alla sala**: in quello buono si rispondono senza ammettere una colpa;
- **il lessico interno**: 13 parole di gergo Adobe in pagina contro 2.

Quindi **`pnpm lenti` verde non vuol dire copia buona**. Le regole qui sotto guardano
proprio quello che `lenti` non misura.

## I titoli

**R1 · Il numero nel titolo è il fatto, non l'inventario.** Si evitano i titoli che
contano i riquadri della slide («Quattro X», «…, in cinque passi»): un numero nel
titolo deve essere un dato del mondo.
*Perché:* il conteggio descrive l'impaginazione, e chi guarda la slide lo vede da sé.
*Prima → dopo:* «Che cosa c'è dietro il marchio: quattro numeri, quattro quadranti» →
«Leader nei quattro Forrester Wave del 2026 che riguardano questo tavolo».
*Gate:* misurabile, come numerale con un nome all'inizio oppure coda «, in N …». Tetto:
un titolo così ogni quattro nel percorso proiettato.

**R2 · Il capitolo si nomina, la slide afferma, e i titoli dei capitoli hanno una
forma sola.** I titoli di capitolo sono etichette brevi per orientarsi: o tutti
domande (il Playbook a N domande) o tutti nomi. Mai mescolati, mai con i due punti.
Il fatto va nel titolo della slide.
*Prima → dopo:* «Integrazione: dove si collega Adobe e che cosa si misura» → «Dove ci
innestiamo»; «La proposta e come si parte» → «I prossimi passi».
*Gate:* su `chapters.ts`, il «?» c'è in tutti i titoli o in nessuno.

**R11 · Il titolo parte dal gesto, con un verbo concreto e senza parentesi.**
*Prima → dopo:* «Quando lascia l'email, le due sessioni anonime (raccolte col consenso
ai cookie) si uniscono al suo profilo» → «Lascia l'email: le visite delle sere prima
si agganciano al suo profilo».
*Gate:* la parentesi in un titolo si misura, il resto è giudizio.

**R13 · Il soggetto è il cliente o chi agisce su di lui; «noi» solo per ipotesi e
impegni.** Si usa molto l'impersonale e il «vostro». Niente titoli centrati su di noi
(«ci servono», «portiamo», «promettiamo»).
*Misura:* le forme in «noi» sono 1 ogni 1000 parole nel deck di riferimento, 6,5 in
quello confrontato.
*Prima → dopo:* «Tre cose che ci servono da voi» → «Per partire, tre risposte dal
vostro team».

## Le frasi che portano un rischio

**R3 · La domanda alla sala comincia con «Oggi» e offre due alternative concrete e
legittime.** Si chiede un fatto di processo che chi è in sala possiede. Mai una
domanda sì/no, mai una domanda che presuppone il difetto.
*Perché:* si risponde senza ammettere una colpa, e la risposta perimetra il lavoro.
*Prima → dopo:* «…si valuta quando si sceglie, o si applica dopo?» → «…o si applica
all'invio?», dove l'alternativa vaga è diventata un momento preciso. «Dove si fermano
i vostri test?» presuppone che si fermino.
*Gate:* parziale. Nel blocco della domanda per la sala si segnala l'assenza di «Oggi» o
di un'alternativa «, o …?». La presupposizione resta giudizio.

**R5 · Si scrivono due rami invece di presumere.** Dove non si sa come lavora il
cliente, si scrivono tutti e due.
*Esempio:* «Se avete già un punteggio sui non‑clienti, entra come attributo;
altrimenti valgono la priorità dell'offerta e le regole che fissate voi.»

**R6 · L'ipotesi si presenta come lavoro da fare insieme, non come compito per il
cliente.** *Prima → dopo:* «…è una nostra ipotesi: correggetela voi.» → «L'architettura
attuale è una nostra ipotesi, da correggere con voi.»
*Gate:* sonda sull'imperativo plurale rivolto alla correzione («-tela voi»).

**R8 · Il controllo umano si dice con il processo del cliente, breve e assoluto.**
*Prima → dopo:* «Si chiede una cosa a parole e si ottiene fatta: esecuzione autonoma…»
→ «Si descrive l'obiettivo in una frase e il sistema costruisce il piano. Niente parte
senza approvazione.» «Le persone approvano» è generico: «l'approvazione resta al
team», «chi approva oggi la rivede».
*Gate:* sonda su «le persone (approvano|validano)».

**R9 · Un limite dice dove resta la cosa e da quando vale.**
*Esempio:* «Activity Map non è supportato, e oggi non è in roadmap.» Oppure «…si
decide in fase 0». Una negazione nuda («X non fa Y») lascia il cliente senza la
mossa successiva: «Le attività di Automated Personalization si creano ancora in
Target».
*Gate:* resta giudizio. Una negazione di capacità senza «oggi», «resta» o «in fase» è
un rilievo da leggere.

**R12 · Il punto del capitolo non afferma più di quanto la slide dimostra.**
È un affinamento di `punto-del-capitolo`. Se il capitolo marca qualcosa come «da
provare», il punto non lo può dare per fatto.
*Prima → dopo:* «Quello che Analytics trova diventa un test, e il risultato torna
nella stessa conversazione» (mentre la slide dice che il quinto passo è da provare) →
«Dal calo trovato in Analytics al test in Target: quattro passi documentati, il
quinto si prova.»
*Gate:* se il capitolo contiene «non documentato», «da provare» o «annunciato», il
punto deve contenere una cautela.

## Il confine e chi fa che cosa

**R4 · Il confine di proprietà sta in una riga per pezzo.** Accanto a ogni capacità
Adobe si scrive che cosa resta del cliente: «X vostro; Y Adobe», oppure «come oggi».
*Esempio:* «Simulatore vostro; i dati li raccoglie il Web SDK». Oppure: «Secondo il
vostro iter, come oggi».
*Gate:* di schema. Il campo `vostro` (o `messa`) diventa obbligatorio nei dati, come
il messaggio.

**R7 · Ogni cosa aperta porta chi la porta e quando.** Una richiesta o una decisione
aperta ha la sua funzione responsabile e la sua fase. Se non si sanno, «da chiedere»
va nel dossier interno, **non** nella slide che va al cliente: lì si scrive il momento
in cui la cosa si decide («Oggi, in sala») oppure la funzione che la possiede («con chi
amministra Analytics»). «Chi la porta: da chiedere», proiettato, dice soltanto che non
lo sappiamo (17 nov 2026).
*Esempio:* «Le cinque cose da portare alla prima sessione, e chi le porta». Ogni voce
porta la funzione e la fase, per esempio «Controllo di Gestione · fase 0».
*Gate:* di schema, con i campi `chi` e `quando` obbligatori.

## Il lessico

**R10 · In pagina non vanno il gergo interno né gli identificativi tecnici.** È un
affinamento di D4 («parola vuota»). Le parole di processo Adobe (PM, POD come sigla
non spiegata, SAL, pipeline, rollout, coorti, sponsorship, slot, «agentizzare») e gli
identificativi macchina (skill `aa-root-cause-analysis`) non entrano nelle slide. Prima
si scrive la funzione, poi il nome del prodotto. I nomi tecnici vanno dentro
`HowItWorks`, per chi li cerca.
*Prima → dopo:* «Controlli di compliance mentre si produce; un processo che si può
agentizzare» → «Ogni annuncio nasce già controllato sulle regole di marchio e di
canale». E ancora: «Il rollout va a coorti» → «Si accende per gruppi di clienti»;
«Le richieste entrano in pipeline» → «Le richieste arrivano al prodotto».
*Gate:* misurabile, come famiglia SOFT (elenco di parole più la regex
`\b[a-z]+(-[a-z]+)+\b` fuori dagli `HowItWorks`). Misura: 2 nel deck di riferimento, 13
in quello confrontato.

## Come si usano

- **In prima stesura**, si leggono i titoli di tutto il deck in fila con questo
  foglio accanto. R1, R2, R13 e R10 si vedono in un minuto.
- **Nel Giro 0** di `/umanizza`, ogni regola è una domanda della checklist per slide.
- **I gate** segnati come misurabili (R1, R2, R3 parziale, R10, R12) sono **candidati**
  per `copy-audit`, come famiglie SOFT, e non sono ancora costruiti. Finché non ci sono,
  la regola si applica a mano e il report del giro la cita per nome.
