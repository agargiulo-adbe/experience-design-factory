---
description: Compone o rivede un deck .pptx sul template Adobe, con il giro completo di qualità visiva. Uso /deck-pptx <percorso.pptx | builder.py> [--rivedi | --componi]
---

# /deck-pptx — il giro di qualità di un deck .pptx

Il contenuto di un deck lo decide chi lo scrive. **La forma la decide questo giro**, e
non è negoziabile: un deck Adobe che esce «muro di testo» è un difetto misurabile, non
una questione di gusto.

ARGOMENTO: $ARGUMENTS

## Che cosa fare, in ordine

### 1. Leggi le regole prima di toccare qualunque cosa
- `skills/experience-design/references/deliverable-format.md` — la forma dell'artefatto
  e, nella sezione 4bis, il motore di composizione e i trattamenti disponibili.
- Il paragrafo «In che forma si consegna» di `CLAUDE.md`.

### 2. Apri il catalogo dei layout — questo passo non si salta
```bash
ls docs/Factory/pptx-layouts/sheet-*.png     # i 166 layout approvati, da GUARDARE
```
**Cinquantotto dei 166 portano un'area immagine, una citazione a tutta pagina o una
struttura da caso studio.** Un deck che usa solo quelli a colonne diventa un documento
da leggere, non una slide da guardare. Scegli la famiglia di layout **per ogni slide**,
e scrivila in una mappa prima di comporre: slide → layout → trattamento → visuale.

### 3. Cerca che cosa è già disegnato, invece di ricomporlo
```bash
pnpm pptx:find "<tema>"                      # dentro 1863 slide delle librerie Adobe
pnpm pptx:take "<libreria.pptx>" <n>…        # estrae e RENDE le slide da ereditare
```
Le immagini si ereditano da lì con la provenienza accanto (file + numero di slide),
**mai** dal repertorio generico. E si guardano **a dimensione intera prima di posarle**,
con il ritaglio che avranno: da miniatura si prende per «cruscotto» una schermata di
Postman, e per materiale Adobe la schermata di un altro marchio.

### 4. Componi con il motore condiviso
`scripts/pptx/compose.py` porta i trattamenti: `citazione` · `meta_immagine` ·
`numeri` · `obiezioni` · `strati` · `linea_del_tempo` · `grafico_barre` · `flusso` ·
`colonne`. Il builder del deck resta **contenuto puro**.
Migliora il motore una volta, e ne beneficia ogni deck di ogni cliente.

### 5. Fai girare il gate, e leggilo tutto
```bash
pnpm audit:pptx "<deck.pptx>"
```
Tre famiglie di controlli, e la terza è quella che prima non esisteva:

| | che cosa misura |
|---|---|
| **marchio** | `T` filo rosso · `B` fondi · `F` carattere **dichiarato** · `U` carattere **reso** (sostituzioni: un'emoji esce a colori) · `R` rossi · `L` marchio |
| **geometria** | `C` fuori foglio · `E` riquadri sovrapposti · `P` segnaposto · `O` effetti |
| **qualità visiva** | `D` parole per slide · `Z` corpo del testo proiettato · `V` pagina usata e fasce vuote · `G` deserti senza elementi grafici |

**HARD a zero.** Quando `D` o `Z` falliscono la risposta è sempre la stessa, ed è
scritta nel contratto di leggibilità: **si taglia la copia o si cambia layout, mai si
rimpicciolisce il tipo.**

### 6. Guarda le pagine. Il gate misura, non guarda
Rendi tutte le pagine in provini a contatto e **leggile**:
```bash
soffice --headless --convert-to pdf --outdir <tmp> "<deck.pptx>"
pdftoppm -png -r 70 "<tmp>/<deck>.pdf" <tmp>/p
```
Poi monta 12 pagine per foglio e aprile. I difetti che il gate non vede — un'immagine
che parla d'altro, un ritaglio che taglia un grafico a metà, una pagina che non dice
niente — si trovano solo così.

### 7. Chiudi come si chiude un artefatto della Factory
- `pnpm audit:docs` PULITO se il deck vive sotto `docs/<Account>/`.
- Riga nel registro dell'account: che cosa è cambiato e perché.
- Se il deck va a un cliente o a un gruppo di colleghi, **panel review** prima della
  consegna (`skills/panel-review/`): il gate prova che si vede, non che convince.

## I limiti, dichiarati

- **La generazione di immagini non è disponibile** in questo ambiente: il connettore
  Adobe ha le capacità generative spente e l'altro strumento non restituisce i byte.
  Quindi gli elementi grafici si fanno in tre modi, tutti dentro le regole di marchio:
  **forme disegnate** (rettangoli, linee, cerchi: il diagramma a strati, il flusso),
  **grafici veri da dati** (`grafico_barre`), **immagini ereditate** dalle librerie.
- **Niente icone** finché non si trova il set ufficiale Adobe: non si ridisegnano e non
  si sostituiscono con glifi Unicode o emoji.
