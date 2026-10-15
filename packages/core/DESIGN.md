---
name: Experience Design Factory — Core
description: Il telaio su cui ogni Experience è una trama: ruoli semantici, non valori.
colors:
  surface-primary: "#F5F0E6"
  surface-secondary: "#E8DFD0"
  surface-inverse: "#1A1A1A"
  surface-emphasis: "#3E2C20"
  surface-card: "#FFFFFF"
  ink-primary: "#1A1A1A"
  ink-secondary: "#6B4F3A"
  ink-muted: "#C19A6B"
  ink-inverse: "#F5F0E6"
  accent-primary: "#C19A6B"
  accent-secondary: "#B8975A"
  line-subtle: "rgba(193, 154, 107, 0.2)"
  line-default: "rgba(193, 154, 107, 0.4)"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(2.75rem, 5vw + 1rem, 5rem)"
    fontWeight: 700
    lineHeight: 1.06
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.18
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Inter, Helvetica Neue, sans-serif"
    fontSize: "clamp(1.125rem, 1.5vw + 0.25rem, 1.375rem)"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Inter, Helvetica Neue, sans-serif"
    fontSize: "clamp(0.9375rem, 0.25vw + 0.875rem, 1.0625rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, Helvetica Neue, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.1em"
rounded:
  none: "0"
  sm: "0.25rem"
  md: "0.5rem"
  lg: "1rem"
  full: "9999px"
spacing:
  slide-safe-inset: "clamp(32px, 4.5vw, 88px)"
  deck-chrome-safe: "clamp(112px, 17vh, 156px)"
  doc-column: "44rem"
  doc-gutter: "clamp(1.1rem, 4vw, 2.5rem)"
  doc-bar: "3.75rem"
components:
  slide:
    backgroundColor: "{colors.surface-primary}"
    textColor: "{colors.ink-primary}"
    padding: "{spacing.slide-safe-inset}"
    rounded: "{rounded.none}"
  slide-inverse:
    backgroundColor: "{colors.surface-inverse}"
    textColor: "{colors.ink-inverse}"
  doc-section-heading:
    typography: "{typography.headline}"
    textColor: "{colors.ink-primary}"
  doc-stat:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink-primary}"
    rounded: "{rounded.md}"
    padding: "1rem 1.05rem 1.05rem"
  doc-callout:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.ink-secondary}"
    rounded: "{rounded.md}"
    padding: "0.9rem 1rem"
---

# Design System: Experience Design Factory — Core

## Overview

**Creative North Star: "Il Telaio"**

Il motore è l'ordito; ogni Experience è la trama. La struttura decide la tenuta, la geometria e il ritmo — dove sta il contenuto, quanto respira, come si comporta dal telefono al muro — mentre il colore, il carattere e la materia li porta per intero il cliente. Si cambia il filo, non il telaio. È il motivo per cui una correzione di craft fatta una volta arriva a Max Mara, a Ferrari e ad Agos nello stesso commit.

Da qui discende l'unica cosa che il core possiede davvero: un **sistema di ruoli**, non una tavolozza. Un blocco del motore non sa di che colore è una superficie: sa che quella è la superficie primaria, e che l'inchiostro che ci sta sopra è quello primario. Chi legge questo documento cercando l'identità visiva della Factory non la troverà, e non è una mancanza: l'identità arriva dai token della skin, e il valore del motore si misura da quanto completamente sparisce dietro di essa.

La disciplina che ne segue è severa in un punto solo e permissiva ovunque: **niente valori nei blocchi**. Niente esadecimali, niente spaziature arbitrarie, niente caratteri nominati. In cambio, un'app può ridipingere il motore per intero senza toccarne una riga — ed è esattamente quello che fanno nove experience con nove identità che non si somigliano.

**Key Characteristics:**
- Tre livelli di token: primitivo → **semantico** → componente. I blocchi consumano solo il livello di mezzo.
- Superfici piatte e linee da 1px: la profondità è tonale, mai proiettata.
- Due contratti di misura che reggono tutto: la safe‑area delle slide e la colonna di lettura dei documenti.
- Lo stesso contenuto si adatta da 320px a un muro da 3840 senza una variante scritta a mano.
- Nessuna immagine, nessuna icona e nessun marchio nel core: tutto ciò che è riconoscibile appartiene alla skin.

## Colors

Il motore non ha colori: ha **ruoli**, e ogni ruolo ha un valore di riserva che esiste soltanto perché il telaio regga anche senza trama. I valori qui sotto sono quelli della prima skin — Max Mara — rimasti come default storico: ogni altra experience li sovrascrive al livello semantico nel proprio `global.css`.

### Primary
- **Cammello** (`#C19A6B`): l'accento del sistema — bordi attivi, voci di navigazione correnti, numeri in evidenza, sottolineature al passaggio. È anche il colore da cui discendono le linee (`line-subtle`, `line-default` sono cammello a bassa opacità).
- **Oro Pallido** (`#B8975A`): accento secondario e anello di fuoco; un gradino più caldo e meno saturo del primario, pensato per non competere con esso.

### Neutral
- **Avorio** (`#F5F0E6`): la superficie primaria, e insieme l'inchiostro che sta sulle superfici scure. Un neutro caldo, mai bianco puro.
- **Sabbia** (`#E8DFD0`): la superficie secondaria, per distinguere una fascia dalla successiva senza una linea.
- **Nero Morbido** (`#1A1A1A`): l'inchiostro primario e la superficie invertita. Non è `#000`: il nero pieno su schermo grande è una lama.
- **Marrone Caldo** (`#6B4F3A`): l'inchiostro secondario, per il testo che accompagna senza competere.
- **Testa di Moro** (`#3E2C20`): la superficie d'enfasi, l'unico fondo che non è né chiaro né nero.
- **Bianco** (`#FFFFFF`): riservato alle card che portano la propria superficie dentro una fascia colorata.

### Named Rules

**La Regola del Livello Semantico.** Un blocco del core nomina **ruoli, mai valori**. Si consuma `--surface-*`, `--ink-*`, `--accent-*`, `--line-*`, `--font-*`; non si scrive mai un esadecimale, e non si risale mai a un primitivo (`--primitive-color-*`). È la regola che rende possibile ridipingere una skin per intero, ed è la prima da citare quando si rivede una modifica al core.

**La Regola della Coppia.** `--ink-X` è l'inchiostro che sta su `--surface-X`, e la coppia vale ovunque. Quale delle due sia scura invece **cambia con la skin**: nelle experience a dominante scura `--surface-inverse` è la superficie *chiara*. Perciò non si deduce mai la luminanza dal nome del token: si misurano i pixel.

**La Regola del Debito Dichiarato.** I valori primitivi di questo documento sono un'eredità, non una tavolozza: appartengono alla prima skin e sono rimasti come riserva. Nessun blocco può riferirvisi. Chi tocca il core li tratta come un fallback che non deve mai vedersi in produzione.

### Le tre eccezioni, e il debito aperto

La regola ha **tre eccezioni vere**, misurate e marcate nel codice — non scappatoie:

- **Il valore di riserva.** `var(--ruolo, valore)` *è* il contratto: il blocco nomina il ruolo e porta un fallback perché il motore regga anche senza skin.
- **Il chrome.** La firma co‑brand, il credito «creato con» e l'avanzamento del deck vivono **fuori** dalla slide e non ne ereditano la superficie: il chiaro/scuro lo pilota `data-on-dark` con valori espliciti. In `rgba()` e non in `color-mix()`, perché il parser di contrasto legge `oklab()` come bianco e darebbe un verde falso.
- **I mockup e la stampa.** Un mockup riproduce l'interfaccia di un altro prodotto, e quei colori sono di quel prodotto; `@media print` fissa i suoi, perché su carta bianca i ruoli non servono.

E un **debito aperto, contato**: due componenti precedono il livello semantico e consumano ancora i grigi primitivi di un sistema più vecchio — **52 occorrenze nel calcolatore di scoping, 5 in AdobeStackReveal**. Non si chiudono alla cieca: tradurre un grigio nel suo ruolo è una scelta che si fa guardando il componente rendere. `pnpm audit:contratto` li conta, li dichiara e **fallisce solo se il debito cresce**.

## Typography

**Display Font:** Cormorant Garamond (con Georgia, serif)
**Body Font:** Inter (con Helvetica Neue, sans-serif)

**Character:** Anche i caratteri sono di riserva, non d'identità: la coppia serif‑editoriale più grottesca‑neutra è quella della prima skin, e ogni experience la sostituisce con la propria. Quello che il motore possiede davvero è la **scala**: fluida, costruita su `clamp()`, pensata perché lo stesso testo regga a 320px e su una parete.

### Hierarchy
- **Display** (700, `clamp(2.75rem, 5vw + 1rem, 5rem)`, 1.06): la copertina e i numeri‑monumento. Un elemento per schermata, mai due.
- **Headline** (700, `clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)`, 1.18): i titoli di slide e di sezione. Nei documenti arriva a 2.45rem sul desktop, perché una testata che smette di crescere a 1.9rem appiattisce tutta la pagina sotto di sé.
- **Title** (700, `clamp(1.125rem, 1.5vw + 0.25rem, 1.375rem)`, 1.25): i titoli di card e di colonna.
- **Body** (400, `clamp(0.9375rem, 0.25vw + 0.875rem, 1.0625rem)`, 1.6): il testo corrente. Misura di riga **65–75 caratteri**: la colonna dei documenti è tarata su 44rem proprio per questo.
- **Label** (700, `0.75rem`, `0.1em`, maiuscoletto): occhielli, etichette di stato, numeri di sezione.

### Named Rules

**La Regola della Leggibilità.** Il tipo **non si rimpicciolisce** per far passare un gate. Se il contenuto non entra nell'altezza, si taglia la copia o si divide la slide — in quest'ordine. Corpo minimo a proiezione 0.95rem, interlinea minima 1.5.

**La Regola dei Quattro Gradini.** Fra corpo e titolo devono esserci passaggi riconoscibili a colpo d'occhio: corpo → lead → numero → titolo. Quando due livelli finiscono a meno di due punti l'uno dall'altro la pagina sembra piatta anche se ogni valore, preso da solo, è corretto.

## Layout

Il motore governa lo spazio con **due contratti di misura**, uno per formato.

**Le slide** vivono dentro il viewport meno i gutter: `--slide-safe-inset` (da 16px sul telefono a 160px sul muro) e `--deck-chrome-safe`, che riserva simmetricamente lo spazio dei comandi del deck. Il contenuto è centrato sul centro del viewport, vincolato in altezza e **non si taglia mai** alle dimensioni di proiezione; sui telefoni le slide dense possono scorrere. `DeckContainer` sovrascrive questi token per punto di rottura, ambito a `[data-deck]`, così l'adattamento da telefono a parete non richiede una riga per app. Sopra i 2000px la radice stessa scala a 20/24/28px, perché oltre quella soglia il `clamp` del corpo era già saturo e il tipo smetteva di crescere.

**I documenti** vivono dentro una colonna di lettura: `--dw-col` a 44rem — che a 16px fa circa 74 caratteri — con un gutter fluido e una barra fissa alta 3.75rem. Il blocco colonna + indice è centrato; l'indice laterale appare solo sopra i 1100px, dove esiste davvero lo spazio per una seconda colonna. Il ritmo verticale è deliberatamente asimmetrico: lo stacco sopra una testata cresce con la larghezza (da 66px a 96px) contro i 14px sotto, perché un titolo appartiene a ciò che introduce, non a ciò che chiude.

### Named Rules

**La Regola della Safe‑Area.** Nessuna scatola supera `--slide-safe-inset`, nessun elemento esce dal viewport, nessun contenitore scorre di nascosto alle dimensioni di proiezione. Le tre cose si verificano misurando i rettangoli, non guardando.

**La Regola del Bordo Condiviso.** Due blocchi di testo allineati a sinistra partono dalla stessa ascissa. Una composizione centrata è legittima; due colonne a bandiera che cominciano in punti diversi sono una riga storta, e si vedono subito.

## Elevation & Depth

Il sistema è **piatto per contratto**, e non per pigrizia. La profondità si ottiene con strati tonali — `surface-primary` sotto, `surface-secondary` accanto, `surface-card` sopra — e con linee da 1px in `line-subtle`. Nel motore non esiste un vocabolario di ombre, e non deve esistere: **un'ombra ha un colore, e un colore è identità** — che il core non possiede. Una skin che voglia il rilievo lo aggiunge sui propri componenti.

Le uniche eccezioni sono funzionali, non decorative: gli scrim sotto il testo sovrapposto a un'immagine, che servono al contrasto e sono misurati in rapporto; e l'anello di fuoco, che è uno stato, non una profondità.

### Named Rules

**La Regola della Linea Sola.** Una superficie si separa dalla successiva con **un** mezzo: un cambio di tono oppure una linea da 1px, mai entrambi e mai una barra colorata spessa. Un bordo colorato sopra 1px è un costume.

## Shapes

Il linguaggio di forma è contenuto e ripetitivo per scelta: raggi di `0`, `0.25rem`, `0.5rem`, `1rem` e `9999px`, e in pratica il sistema vive su due di questi. Le **slide non hanno raggio** — un rettangolo a tutto schermo non è una card — mentre card, statistiche e riquadri dei documenti usano `0.5rem`, abbastanza per ammorbidire e non abbastanza da farsi notare. Il raggio pieno è riservato ai comandi tondi del deck e alle pillole. I bordi sono sempre da 1px, sempre in un token di linea, mai colorati per decorazione.

## Components

I componenti del motore sono **sobri e misurati**: contenitori corretti, mai protagonisti. Tutta la personalità arriva dai token della skin.

### Slide
- **Forma:** rettangolo a tutto schermo, nessun raggio.
- **Superfici:** `primary`, `secondary`, `inverse`, `brand` — dichiarate dalla slide, non dedotte.
- **Composizione:** contenuto centrato sul centro del viewport, dentro la safe‑area, vincolato in altezza.
- **Allineamenti:** `center`, `left`, `split`. Se il contenuto non entra a 1920×1080, si divide: non si comprime.

### Documento gated (DossierPage)
- **Struttura:** barra fissa (3.75rem) con badge di riservatezza, indice e stampa; colonna di lettura da 44rem; indice laterale appiccicoso sopra 1100px.
- **Blocchi:** quattordici tipi dichiarati per contratto — note, cronologia, statistiche, persone, voci, righe, idee, tabella, glossario, da‑dire/da‑non‑dire, fonti.
- **Statistiche:** griglia che non scende sotto 13.5rem per colonna; due colonne sul desktop, una sul telefono. A quattro colonne il testo andava a capo ogni due parole.
- **Enfasi:** solo `<strong>`, `<em>` e `<code>` attraversano il filtro; tutto il resto è escapato. Un tag fuori contratto non dà errore: stampa sé stesso.

### Comandi del deck
- **Forma:** tondi, perché portano una sola icona; a pillola quando portano una parola.
- **Bersaglio:** mai sotto 44×44, anche quando il segno visibile è più piccolo.
- **Contrasto:** misurato in `rgba()` esplicito, perché il parser dell'audit legge `oklab()` e `color-mix()` come bianco e darebbe un verde falso.

### Superfici del browser
Selezione, barra di scorrimento, anello di fuoco, cifre tabulari e stacco della sottolineatura sono tematizzati dai token. Sono le parti che non abbiamo disegnato ma che il lettore vede comunque, e arrivano col default del browser se nessuno le reclama.

## Do's and Don'ts

### Do:
- **Do** consumare il livello semantico: `--surface-*`, `--ink-*`, `--accent-*`, `--line-*`, `--font-*`.
- **Do** dichiarare sulla slide la superficie che usa, e marcarla a mano quando il backdrop la rende scura pur dichiarandola chiara.
- **Do** misurare il contrasto sui **pixel renderizzati**: gradienti, scrim e trasparenze stanno già dentro quella misura, e il CSS no.
- **Do** tenere la riga di testo fra 65 e 75 caratteri, e lo stacco sopra una testata maggiore di quello sotto.
- **Do** migliorare il motore una volta sola: la correzione arriva a tutte le experience nello stesso commit.
- **Do** verificare il delta quando si tocca il core — quali app usano davvero quel blocco, e che cosa cambia in ciascuna.

### Don't:
- **Don't** scrivere un esadecimale, una spaziatura arbitraria o un nome di carattere dentro un blocco del core.
- **Don't** risalire a un token primitivo: sono l'eredità della prima skin e non devono vedersi in produzione.
- **Don't** copiare un renderer dentro un'app. È così che sono nate sei copie divergenti del dossier, e una di quelle copie ha servito contenuto riservato in chiaro su una pagina pubblica.
- **Don't** rimpicciolire il tipo per far passare un gate.
- **Don't** aggiungere un vocabolario di ombre al motore: la profondità è tonale, e il rilievo appartiene alla skin.
- **Don't** dedurre la luminanza dal nome del token: in metà delle experience `--surface-inverse` è la superficie chiara.
- **Don't** mettere un'immagine, un'icona disegnata o un marchio nel core: tutto ciò che è riconoscibile appartiene alla skin.
