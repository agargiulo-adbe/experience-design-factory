# Umanizzare la copia di una experience

> Quando: dopo che il contenuto è fermo e prima della consegna, su una experience
> intera. Non è una passata di stile: è un giro misurato, con un prima e un dopo.
> Metodo ricavato e verificato su `intesa-mutuo` il 30 ott 2026 (41 slide, 956
> stringhe, 12 pagine). I numeri citati qui sotto sono quelli veri di quel giro.

## Il principio: togliere un marcatore, non spostarlo

Un intervento che fa scendere un contatore non ha necessariamente migliorato il
testo. Il caso che ha generato la regola:

`copy-audit` segnalava **8 trattini-perno** (`D1`) su `intesa-mutuo`. La
correzione ovvia — sostituirli con i due punti — avrebbe portato `D1` a zero. Ma
misurando *prima* di toccare, il deck aveva già **49 stringhe con i due punti
usati come perno retorico**: sei volte tanto. I due punti erano già la cadenza
dominante, e «correggere» avrebbe spostato otto occorrenze dentro il tic
maggiore, peggiorando il testo con tutti i gate verdi.

Quindi: **prima di modificare, si misura anche quello che il gate non guarda**, e
alla fine si verifica che quel numero non sia salito. Esito reale del giro:
trattini 8 → 0, due punti 49 → 48.

La stessa trappola si ripresenta dentro un singolo intervento. Riscrivendo una
doppia relativa («Oggi chi riceve l'appuntamento **che** cosa vede, di una persona
**che** non è cliente?») la prima versione è uscita «**Che** cosa vede oggi chi
riceve l'appuntamento, di una persona **che** non è ancora cliente?»: due `che`
ancora, spostati. Per questo **il gate si rilancia finché non esce pulito**, non
una volta sola. Su `intesa-mutuo` sono servite tre passate: la seconda ha trovato
tre marcatori creati dalle correzioni della prima.

## I tre giri, in quest'ordine

L'ordine non è arbitrario: ogni giro raccoglie quello che il precedente ha
dislocato, e usa uno strumento che il precedente non aveva.

### Giro 1 — i segni

La rubrica che il gate conosce, riga per riga, in tutte le lingue.

```
pnpm --silent exec tsx scripts/copy-audit.ts --app <alias>      # finché non esce 0
DECK_URL=<origin> pnpm audit:wrap --app <alias>                 # gli a capo
pnpm --filter <alias> audit:deck                                # 0 HARD
```

Ogni rilievo esce **riscritto** oppure **dichiarato** (vedi Eccezioni). Prima di
cominciare si fissa la baseline dei punti ciechi; alla fine si riconfronta.

### Giro 2 — la misura

Quello che nessun check per stringa può vedere, perché è **distributivo**.

- **Stilometria per PAGINA, non per app.** Una media per app nasconde quale
  capitolo è pesante. Si misurano frase media, burstiness (deviazione standard
  della lunghezza di frase), Gulpease, type-token ratio.
  ⚠️ **Le frasi si contano DENTRO ogni stringa.** Unire le stringhe di una pagina
  con uno spazio salda i titoli — che non finiscono col punto — in una frase
  finta: su `intesa-mutuo` dava a una pagina frase media 50 parole e burstiness
  0,0, e falsava il Gulpease, che dipende dal numero di frasi. Il primo giro di
  misura è uscito con tutti i numeri sbagliati per questo.
- **Il telaio, non il segno.** La scoperta del giro 2 non è stata un marcatore:
  è stata una **forma di frase ripetuta**. 33 stringhe su 513 (6,4%) giravano
  sulla negazione — «non X: Y», «X, non Y». Lette una per una **la maggior parte
  era guadagnata**, perché l'argomento del deck *è* «quello che date per fatto non
  succede». Quindi non si tocca il totale: si toglie la **concentrazione**. Cinque
  telai identici dentro lo stesso componente, letti in fila, sono un tic; cinque
  distribuiti su sette capitoli sono la voce del documento.
- **Si guardano le pagine rese.** Gli screenshot a 1920 di `audit:deck` mostrano
  quello che il sorgente non dice. Su `intesa-mutuo` hanno trovato tre
  preposizioni appese che nessun gate segnalava, e da lì è nata la correzione del
  criterio di `audit:wrap` (vedi sotto).

### Giro 3 — l'orecchio avversario

Il giudizio che il gate dichiara di non dare. Si legge come il destinatario.

- **La metà nell'altra lingua**, che è dove si sente meno. Su `intesa-mutuo`
  quattro calchi: «the way the work gets asked for» (da «il modo in cui il lavoro
  si chiede»), «Forrester **points to** unifying», «The anonymous visits **of** the
  previous evenings», «segments that **follow**». Nessun conteggio li prende.
- **I fatti attribuiti a terzi.** Un link che risponde non conferma la frase. Si
  apre e si cerca il numero. Dove il sito blocca gli accessi automatici (Adobe
  business, Gartner, molti editori) si apre **una volta in un browser vero** e si
  tira una riga — oppure si dichiara non verificato, mai si assume.
- **Le fonti interne si dichiarano senza link**, dicendo che cosa sono: «caso
  cliente Adobe non pubblicato, si cita a voce» è corretto e si tiene.

## Gli interventi, per tipo

| | si riconosce da | si risolve |
|---|---|---|
| **trattino che fa la virgola** | l'incisa è un'apposizione | virgola |
| **trattino che introduce una negazione** | «X — non Y» | si riscrive in **positivo**: i due punti sposterebbero il segno, un punto creerebbe un frammento staccato |
| **incisa fra soggetto e verbo** | «Su Giulia, che adesso è cliente, il giro decide…» | diventa una frase breve davanti: «Giulia adesso è cliente. Il giro decide…» |
| **apre in subordinata** | «Quando il materiale arriva, questa slide esce…» | soggetto davanti; a volte la subordinata si comprime in preposizione («Quando quel posto non c'è» → «Senza quel posto») |
| **frase oltre le 28 parole** | `L1` | si taglia in due, **mai si accorcia il tipo** |
| **domanda in ordine invertito** | due `che` che collidono | ordine diretto |
| **elenco in prosa** | quattro verbi coordinati | due frasi al minimo; la risposta vera sono **ancore**, e lì l'intervento esce dalla copia ed entra nella composizione |
| **parola vuota** | dice una categoria, non una cosa | si sostituisce con **parole che il deck già usa** altrove, non con parole nostre: «Ingaggiare il cliente» → «Parlare a uno per uno» |

Vincoli che valgono su ogni riscrittura, e si **verificano prima di scrivere**:
lunghezza entro **±10%**; numeri, nomi di prodotto, fonti e citazioni intoccati;
plurale istituzionale; le due lingue ciascuna idiomatica. Una riscrittura può
toccare **una lingua sola**: su `adobe.astro` l'inglese sforava `L1` a 29 parole e
l'italiano no, perché più compatto. La coppia bilingue non deve essere simmetrica.

## Le eccezioni si dichiarano sulla riga

```astro
<T … it="Passi dai sei pilastri del Content Supply Chain Maturity Assessment…" />{/* copy-audit-ignore · L1 — riga di fonte: nome del framework, prodotto e data di verifica. Una fonte non si legge in sala, si apre dopo: accorciarla la rende inverificabile. */}
```

Il gate salta la riga che contiene `copy-audit-ignore`. **Il motivo va scritto
accanto**: un'eccezione senza motivo è un gate spento di nascosto. Due categorie
ricorrenti: le **righe di fonte** (nomi di prodotto, date, provenienza non si
accorciano) e i **paralleli voluti**, dove la forma breve uscirebbe dal contratto
di lunghezza.

## Che cosa i gate NON vedono — e i due buchi trovati

- **`audit:wrap` guardava il corpo del carattere, non le righe.** La motivazione
  scritta nel gate era «lì le righe sono poche e l'occhio le prende intere», ma la
  misura era `corpo >= base × 1.15`. Nella fessura cadeva il **lead di due righe a
  corpo base**, che si legge come un titolo. Corretto il 30 ott 2026: ora conta un
  blocco quando è testo grande **oppure** rende in ≤ `WRAP_RIGHE` righe (default 2).
  Raggio d'azione su un deck già pulito: 4 → 27 rilievi.
- **`audit:taglio` confronta stringhe intere.** Quattro frasi erano scritte a mano
  sia in `persona.astro` sia in `dieci-minuti.astro`, e il gate taceva perché il
  taglio corto aveva **inglobato** la frase del percorso lungo dentro una più
  lunga: non uguali, quindi non segnalate. Sono comunque due copie senza padrone.
  Da estendere a un confronto per **contenimento** sopra una soglia di lunghezza.
- **`P1` non conta la prosa che vive in `src/data/*.ts`** e arriva in pagina per
  import. E c'è un parente stretto che nessuno guarda: il **contenuto parcheggiato
  in una riga di fonte**. Su `intesa-mutuo` una `im-fonte-riga` di ~80 parole era
  per due terzi contenuto (prerequisiti + cautela sull'attribuzione) e per un
  terzo provenienza: prosa nascosta in un corpo che nessuno legge.

## Che cosa NON costruire

Due sonde provate e **scartate**, perché non distinguono il difetto dal corretto:

- **il tricolon.** Un regex su «A, B, e C» trova 15 ricorrenze su un deck pulito, e
  quasi tutte sono elenchi di tre cose vere («l'evento, l'eleggibilità che arriva
  dal core, e l'uplift misurato su un gruppo di controllo»). La terzina retorica e
  l'enumerazione hanno la stessa forma.
- **l'eco fra le due lingue.** Uno scheletro di punteggiatura identico fra `it` ed
  `en` è esattamente quello che produce una traduzione **fedele** di un elenco, non
  un calco. 22 coppie segnalate, nessuna difettosa.

Restano due **lenti** da puntare a mano durante un giro, mai due gate. Un check che
segnala il corretto viene spento al primo giro e si porta via la credibilità degli
altri.

## L'esito del giro di riferimento

`intesa-mutuo`, da `3f9f261` a `73a64cf`:

| | prima | dopo |
|---|---:|---:|
| `copy-audit` SOFT | 25 | **0** |
| `copy-audit` HARD | 0 | 0 |
| trattino-perno `D1` | 8 | **0** |
| due-punti-perno (sonda) | 49 | **48** |
| telaio negazione (sonda) | 19 | **17** |
| `audit:wrap`, criterio vecchio | 23 | **4** |
| `audit:wrap`, criterio nuovo | 27 | **12** (zero parole appese) |
| `audit:deck` HARD | 0 | **0** |
| Gulpease (tutto il deck) | 77,3 | 77,8 |
| burstiness σ | 6,2 | **5,9** |

L'unico indicatore peggiorato è la **burstiness**, e si capisce: spezzare le frasi
lunghe in due medie uniforma il ritmo. È il costo del giro 1, lo vede solo la
stilometria, e va saputo invece che scoperto.
