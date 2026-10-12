# Il taglio «In dieci minuti»

*La seconda forma di ogni experience: lo stesso documento, per chi non ha l'ora — e che per
costruzione non può divergere da quello intero.*

## Perché esiste
Un'ora concessa diventa venti minuti più spesso di quanto si ammetta: il capo entra, il
consiglio slitta, l'interlocutore deve uscire. Chi presenta, in quel momento, salta slide a
caso — e il percorso che resta non è il racconto che era stato costruito, è quello che è
sopravvissuto. Il taglio «In dieci minuti» è la risposta decisa **prima**: cinque o sei slide
che tengono in piedi l'argomento da sole, con l'ask dentro.

E ha un secondo mestiere, meno ovvio e più utile: **è la versione che si manda prima della
riunione**, e quella che l'interlocutore gira al suo capo. Il percorso intero si presenta; il
taglio si legge.

## La regola che lo governa: è la stessa fonte, più corta
Non è una copia del percorso lungo, e non è un documento suo. Finché i due percorsi tengono
**due copie a mano** degli stessi blocchi, divergono — non è una possibilità, è una certezza, e
diverge sempre il taglio corto, perché le correzioni arrivano sul lungo.

Il caso che ha generato la regola: su Intesa «Su scala umana», nello stesso giro in cui nei
commenti del file c'era scritto «se divergono comanda il lungo», il titolo di uno strato e una
riga che diceva il falso su Analytics erano stati corretti **solo** nel percorso intero. È
uscito guardando uno screenshot, per caso. Una regola affidata alla memoria di chi modifica non
è una regola: è una speranza.

Quindi, in ordine:

1. **I blocchi condivisi vivono in `src/data/<nome>.ts`**, definiti una volta, bilingui. Mai
   dentro una pagina, se quella pagina non è l'unica a usarli.
2. **Le fonti vivono in `src/data/sources.ts`**, una voce per fonte: url, etichetta, data. Le
   slide la citano per chiave. Così la correzione di un link arriva ai due percorsi insieme.
3. **Dove il taglio ha bisogno di meno parole, la versione corta è un campo ACCANTO a quella
   lunga** (`bBreve`, `sBreve`), mai un'altra voce: titoli, numeri, ordine ed etichette
   restano **fisicamente lo stesso oggetto**. Si può accorciare una descrizione; non si può
   cambiare, per distrazione, che cosa dice la slide.
4. **Una funzione sola serve le due forme** (`strati('lungo' | 'breve')`), e le differenze che
   dipendono dal percorso — per esempio i link alle slide di dettaglio, che nel taglio non
   esistono — le decide lei, non la pagina.
5. **L'ask sta in un posto solo.** Due versioni della richiesta sono il modo più rapido di
   sembrare confusi davanti a un cliente.
6. **Un taglio corto è una versione breve, non una versione spenta**: stesse clip in loop,
   stessa firma co-brand, stesso guscio sensoriale. Se il taglio sembra la fotocopia del deck,
   chi lo riceve pensa che sia un ripiego.

## Che cosa entra nei dieci minuti
Cinque slide, sei al massimo. L'ossatura che regge per ogni tipo di deliverable:

| # | Slide | Che cosa fa |
|---|---|---|
| 1 | Copertina | la stessa del percorso intero, con la riga che dice che è il taglio |
| 2 | Il loro anno / il loro numero | si apre con una cosa **loro**, non con noi |
| 3 | La domanda | la stessa domanda del deck lungo, parola per parola |
| 4 | Dove ci mettiamo | i temi ridotti all'essenziale, senza il capitolo di dettaglio |
| 5 | L'ask | identico a quello lungo: stessa frase, stesso perimetro |
| 6 | Firma | lockup, una riga, la via per entrare nel percorso intero |

Quello che **non** entra: le domande aperte (vivono in sala, a voce), le referenze per esteso,
il metodo di una misura (resta il risultato e la riga che dice come è stata fatta), i capitoli
che esistono per rispondere a una possibile obiezione.

## Convenzioni
- **Rotta:** `/dieci-minuti/`. (Intesa «Su scala umana» usa `/exec/`: è nata prima della
  convenzione e il suo indirizzo è già stato condiviso. Un link pubblicato non si cambia per
  gusto.)
- **Titolo della pagina:** «In dieci minuti» (EN: «In ten minutes»).
- **Voce di navigazione:** a destra, dopo i capitoli, così si vede che è un'altra forma dello
  stesso documento e non il capitolo successivo.
- **Registro dell'admin:** il taglio è una pagina come le altre, con le sue slide nel
  `PAGE_REGISTRY` — altrimenti il tab «Capitoli e slide» non lo governa.
- **`deck-audit`:** la rotta va in `ROUTE_SETS` (`scripts/lib/deck-routes.ts`), se no il taglio
  non viene mai misurato e sfonda la safe-area senza che nessuno lo sappia.

## Il gate: `pnpm audit:taglio`
L'allineamento continuo non è una buona intenzione, è un comando:

```
DECK_URL=http://localhost:<N> pnpm audit:taglio --app <alias>
```

Si dichiara l'app in `scripts/lib/cut-routes.ts` (rotta del taglio, file della fonte unica,
numero massimo di slide, e le deroghe sui numeri). Che cosa misura, sul **preview statico**:

- **HARD `c1` copia a mano** — un testo lungo che sta nella fonte unica **ed è riscritto** nel
  markup della pagina del taglio; oppure lo stesso testo scritto a mano in due pagine e in
  nessuna fonte. Lì nasce la divergenza, prima che si veda.
- **HARD `c2` numero orfano** — un numero che il taglio afferma e il percorso intero non
  contiene. O il lungo ha perso un fatto, o il corto se n'è inventato uno.
- **HARD `c3` fonte orfana** — un link che porta solo il taglio. Un taglio non ha fonti sue.
- **SOFT `c4` lunghezza** — più slide del massimo dichiarato: non è più un taglio.

Il gate verifica che i due percorsi non dicano cose **diverse**, non che dicano le cose
**giuste**: quali tre temi entrano nei dieci minuti resta una decisione umana, e si prende una
volta, prima della riunione.

## Ordine dei gate quando esiste un taglio
`build` → `audit:copy` → `audit:wrap` → **`audit:taglio`** → `audit:deck` (0 HARD) →
`audit:ink` → `audit:fonti` → rilettura degli screenshot. `audit:taglio` sta **prima** di
`audit:deck` per un motivo pratico: se il taglio va riallineato, il testo cambia, e misurare le
scatole di un testo che cambierà è lavoro buttato.
