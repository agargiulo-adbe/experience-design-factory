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

## Il controllo che vale più di tutti

Guarda la slide e chiediti: **se chi presenta sta zitto, questa pagina si legge in dieci
secondi?** Se la risposta è no, non è una slide: è un documento proiettato.
