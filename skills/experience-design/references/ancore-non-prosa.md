# Ancore, non prosa — come si scrive una slide che non si legge al posto tuo

> Riferimento della skill `/experience-design`. Si legge **prima** di scrivere la prima
> slide di contenuto, non dopo. La regola breve sta in `CLAUDE.md` → «Ancore, non prosa».

## Il difetto, con la data

22 ottobre 2026, videoconferenza con una banca. Deck da 26 slide, tre giri di panel, zero
HARD agli audit. In sala il capitolo costruito per far parlare il cliente ha prodotto **2
minuti di parlato cliente su 18 previsti**, e alla domanda più concreta dell'ora la risposta
si è aperta con «è un livello di astrazione ancora più alto».

Nel debrief, registrato, due colleghi presenti:

- «in video loro si fissano sul leggere le slide, non si trovano … bisogna dargli delle
  **ancore** pure proprio da slide»;
- «tu ti sei spiegato benissimo, **ma io non ho capito**».

Le due frasi insieme sono la diagnosi esatta: non è un problema di esposizione, è che la
pagina chiedeva di essere letta mentre qualcuno parlava.

## L'evidenza, e la correzione che porta

Il **redundancy principle** (Richard Mayer, teoria cognitiva dell'apprendimento multimediale)
dice che si impara meglio da *grafica + voce* che da *grafica + voce + testo a schermo*: due
fonti verbali simultanee costringono al confronto e una si perde.

La condizione al contorno è la parte progettualmente utile, e corregge il «via tutto il
testo»: **etichette brevi, collocate accanto all'elemento che descrivono, migliorano** la
comprensione, perché guidano l'attenzione invece di competere con la voce.

Onestà sulla fonte: il principio è stato raffinato e in parte contestato in letteratura (una
rassegna del 2026 lo discute esplicitamente). Si usa come **criterio di progetto**, non come
numero da citare in slide a un cliente.

## La forma

Su ogni slide di contenuto, in quest'ordine:

| | Che cos'è | Tetto |
|---|---|---|
| **Occhiello** | dove siamo nel percorso | 3-4 parole |
| **Titolo** | **il punto della slide**, non l'etichetta del capitolo | ~10 parole |
| **Lead** | la conseguenza, una riga | ~15 parole |
| **Ancore** | un nome per concetto, attaccato a qualcosa di visibile | **6 parole** |
| **`HowItWorks`** | tutta la prosa: fatti, numeri con fonte, vincoli | nessun tetto |
| **Fonte** | il link che risponde | una riga |

**L'ancora è un nome, non una frase.** «Cucire la stessa persona» è un'ancora. «Sei mesi di
navigazione anonima e un indirizzo email che arriva dopo diventano una storia sola» è prosa,
e va dietro la disclosure.

## Il drill-down è una FIGURA, non un paragrafo

La regola sopra, applicata a metà, produce un difetto che sembra una soluzione: la pagina
resta pulita e il «Scopri come» diventa **quattro paragrafi dietro un bottone**. È lo stesso
muro di testo, soltanto nascosto — e nascosto nel posto peggiore, perché in sala quel blocco
si apre **per rispondere a una domanda**, quando il cliente guarda e aspetta. Nessuno legge
quattro paragrafi in quel momento.

La forma giusta: **`Dettaglio` + `DettaglioVoce`** (`@edf/core/blocks/`). Ogni voce è

| | Che cos'è | Tetto |
|---|---|---|
| **figura** | un micro-diagramma che porta UN meccanismo e si muove una volta | nessuna parola dentro |
| **ancora** | il nome del meccanismo | 6 parole |
| **riga** | il fatto, quello che deve sopravvivere all'inoltro del deck | 20 parole |

più una **nota** facoltativa per la provenienza o una cautela. Se la riga non sta in venti
parole non è una riga: è un paragrafo, e la voce porta due cose — si divide in due.

Dove sta che cosa, e perché:
- **i disegni nell'app** (`src/components/Figura.astro`): la geometria è di quel cliente;
- **il tratto e il movimento nel motore** (dentro `Dettaglio.astro`): spessore, regola
  dell'accento, curve. Lasciati all'app, due deck disegnano con due mani diverse — la stessa
  ragione per cui il co-brand non ha una prop per invertirsi;
- **niente parole dentro l'SVG.** L'ancora sotto nomina la figura, e un testo dentro un
  disegno non cresce con la radice: sulla parete sparisce (famiglia `S` di `audit:ritmo`).

Il movimento non ha JavaScript. Il motore marca `[data-hiw][data-hiw-on]` all'apertura, le
animazioni si agganciano a quell'attributo — il giro riparte ogni volta che si apre — e lo
stato **base** è quello finale e informativo: con «Riduci movimento» non parte niente e la
figura si legge comunque. Chi ha bisogno di un gancio imperativo ascolta `hiw:toggle`.

### Tre trappole, tutte misurate il 24 ott 2026

- **Il corpo del dettaglio va in `rem`, non in `vw`.** La regola del `clamp(rem, vw, tetto)`
  vale per il testo **dentro un SVG**, che non segue la radice; questo è testo normale, e
  sulla parete lo fa crescere `wallScale` con tutto il resto. Legato al viewport cresceva il
  **doppio** della colonna che lo contiene (la colonna è in rem): a 3840 la riga andava a capo
  ogni quattro parole e `audit:wrap` tirava su **ventidue** preposizioni appese. Rimesso in
  rem: una, e preesistente.
- **Su schermo basso si restringe il DISEGNO, mai il tipo.** A 1280×800 il blocco aperto
  spingeva il titolo sopra la safe-area — il check `c` dentro `exp`, che è HARD. La figura è
  ridondante con l'ancora che la nomina; il testo no. `@media (max-height: 900px)` nel motore.
- **Una voce sola non è una colonna.** A tutta larghezza il disegno prende mezza pagina e
  sembra un'illustrazione; ristretto come se fosse in griglia diventa un francobollo
  illeggibile, che è peggio di nessuna figura. Il motore la mette **in riga** accanto al testo,
  con una larghezza sua.

### Il gate ora guarda anche lì

`audit:ink` **apre ogni «Scopri come» prima di misurare**. A blocco chiuso quel testo non lo
guardava nessuno — ed è la trappola nota: `.hiw-body` del motore non dichiara un colore, su
slide chiara resterebbe bianco su bianco. Su Intesa i blocchi misurati sono passati da 194 a
**241**, nove dettagli aperti.

## Perché la prosa non si butta

Il deck viene **inoltrato**: la regola «il deck parla all'organizzazione» impone che regga
senza chi l'ha presentato. Quindi la prosa resta nel documento, **a richiesta**, dentro
`@edf/core/blocks/HowItWorks.astro`. Chi è in sala non la legge perché è chiusa; chi riceve
il link la apre.

⚠️ `.hiw-body` del motore **non dichiara un colore**: su una slide chiara resterebbe bianco su
bianco, e a blocco chiuso nessun gate lo vede. Il template lo dichiara in `.ex-dett`; una
pelle che non parte dal template deve farlo da sé. Memoria: `drill-down-eredita-inchiostro`.

## Dove si spiega un meccanismo, si disegna

Tre card di testo che descrivono un'architettura **sono** un muro di testo, anche se stanno
in una griglia ordinata. La forma giusta è un **diagramma**: scatole e collegamenti in SVG,
con le ancore in un layer HTML sopra — così la copia resta DOM e `copy-audit`, `audit:wrap`
e `audit:ink` continuano a misurarla.

E se il meccanismo ha una sequenza, il diagramma **nasce a fasi** sotto le frecce del deck:
prima quello che il cliente ha già, intero; poi il punto dove si ferma; poi il pezzo che si
appoggia sopra. Così «non vi tocchiamo niente» si **vede** invece di essere affermato, e chi
presenta può fermarsi sulla fase giusta per rispondere a una domanda — che è esattamente
quello che il 22 ottobre non è stato possibile fare.

Il meccanismo delle fasi esiste già nel motore (`RtcdpMockup.astro`, `GenstudioMockup.astro`:
monkey-patch dell'istanza `window.__edfDeck`, reset su `playSlide`); il blocco generico è
progettato in `docs/superpowers/specs/2026-10-23-blueprint-animato-design.md`. Un caso
concreto, intanto, si fa a mano in un giorno: `apps/intesa-innesto/src/pages/fondamenta.astro`.

## Due trappole tecniche, entrambe silenziose

- **Una custom property inesistente fallisce in silenzio.** `var(--color-grigio-300)` dove il
  token si chiama `--color-grey-300` non è un errore: la proprietà torna al valore iniziale, e
  su `stroke` vuol dire `none`. Il diagramma sparisce e nessun gate se ne accorge. Si
  verifica misurando il `getComputedStyle`, non rileggendo il CSS.
- **`transform` in linea sovrascrive il centraggio.** Un'ancora centrata con
  `transform: translate(-50%,-50%)` si scentra appena il runtime delle fasi scrive
  `transform: translateY(...)`. Si usa la proprietà **`translate`** per il centraggio: si
  compone con `transform` invece di essere sostituita.

## La copertina di capitolo porta il motivo del suo capitolo

Una copertina di capitolo è il posto dove quasi tutti i deck mettono niente, e
`audit:ritmo` lo misura come **deserto grafico**. La risposta ovvia è uno sfondo
generato, ma un deck cliente vuole asset **commercialmente sicuri** e quella
pipeline può essere ferma su una chiave.

La risposta migliore è disegnare: la copertina porta **la figura del proprio
capitolo, ridotta a geometria**, grande, a lato del testo e a opacità bassa.
È nostra, è on-brand per costruzione, e a differenza di uno sfondo atmosferico
**dice qualcosa** — chi guarda vede in anticipo la forma dell'argomento.

Tre regole, tutte imparate sbagliando:
- il motivo va nello **slot `backdrop`**, non nel flusso: `<Motivo slot="backdrop" />`.
  Nel flusso copre il testo, e `audit:ink` lo vede come inchiostro su inchiostro;
- il blocco di testo di una cover centrata arriva al **65% della larghezza**: il
  motivo comincia dopo, se no passa dietro al titolo;
- l'opacità si verifica con `audit:ink`, non a occhio.

Esempio: `apps/intesa-innesto/src/components/Motivo.astro`.

## Come si verifica

1. **`pnpm --silent exec tsx scripts/copy-audit.ts --app <alias>`** — famiglia `P`: blocchi di
   prosa fuori da una disclosure, per slide. SOFT oggi, HARD quando i deck vecchi saranno
   passati. Non conta la prosa che arriva da `src/data/*.ts`.
2. **Screenshot a 1920 di ogni slide, letti con gli occhi.** È l'unica verifica che coglie «è
   ordinato ma è un muro».
3. **Il check `i` di `audit:deck` non è il giudice qui.** Misura la massa di **testo**, ed è
   tarato su deck di prosa: un deck ad ancore lo fallisce per costruzione. Su Intesa è passato
   da 7 a 44 rilievi *mentre* le slide miglioravano. Un `i` che sale mentre il testo scende
   non è un peggioramento, è il gate che guarda la cosa sbagliata — e non si compensa
   gonfiando le slide.

## Si legge da fondo sala, e non è un'opinione

Il contratto di leggibilità è tarato su **1920×1080**, dove il corpo minimo è ~17px su 1080,
cioè l'**1,3% dell'altezza**. `wallScale` alza la radice a 28px sopra i 3200, e sembra
sufficiente: non lo è. Misurato il 24 ott 2026 su una figura reale, a **3840×2160** il corpo
più piccolo scendeva a 21px, lo **0,97%** — su una parete, che si guarda da *più lontano*,
quel rapporto era *sceso*.

La causa: il testo dentro una figura seguiva solo la radice, e la radice non raddoppia quando
raddoppia lo schermo.

- **Il testo di una figura si lega al viewport**: `clamp(<minimo in rem>, <x>vw, <tetto>)`.
  Il minimo in `rem` tiene il contratto a 1920; la componente in `vw` fa crescere il corpo
  con la parete; il tetto evita che a 5120 diventi un cartellone.
- **`wallScale` si accende DOPO `audit:deck -- --tv` a 0 HARD**, mai prima: su un'altra
  experience, accesa a tappeto, uscivano dieci collisioni testo-su-testo ai soli viewport da muro.
- **Il gate è `pnpm audit:ritmo --app <alias> --sala`**, famiglia `S`: gira a 3840×2160 e
  misura il corpo più piccolo di ogni slide in percentuale dell'altezza. Sotto l'**1,1%** è un
  rilievo. Dopo la correzione, lo stesso deck misura 1,25%.

## Il controllo che vale più di tutti

Guarda la slide e chiediti: **se chi presenta sta zitto, questa pagina si legge in dieci
secondi?** Se la risposta è no, non è una slide: è un documento proiettato.
