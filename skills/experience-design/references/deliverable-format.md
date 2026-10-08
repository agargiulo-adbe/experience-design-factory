# Quale artefatto: l'experience HTML o il .pptx sul template Adobe

> Deciso l'8 ottobre 2026 dopo aver misurato il deck Intesa Assicurazioni e aver
> verificato le regole di marchio alla fonte interna. **Vincolante.**
> La Tassonomia (`experienceTypes.ts`) dice *che cosa* si consegna — Prospettiva,
> Storia, Blueprint, Playbook. Questo documento dice **in che forma**.

## 1. La decisione, in una domanda

**Di chi è il design system di questo documento?**

- **Del cliente** → **experience HTML**. La skin è il suo (`pnpm brand:tokens`),
  e l'artefatto esiste per farlo sentire a casa sua.
- **Di Adobe** → **.pptx sul template di Brand Center**. Il documento parla con
  la voce di Adobe, e il suo design system è quello di Adobe.

Non esiste la terza via, ed è l'errore da cui nasce questa regola: il deck dell'8
ottobre era un artefatto **di marchio Adobe** (red thread, logo, Adobe Clean) con
dentro un colore d'accento *di un cliente* — per giunta quello sbagliato, il
petrolio `#007A91` di UniCredit su una stanza di Intesa. Sul template Adobe il
colore del cliente **non è il colore strutturante**: le slide di contenuto hanno
fondo nero o bianco e i grafici stanno in grigio con pochi accenti.

## 2. Tabella di instradamento

| La situazione | Forma | Perché |
|---|---|---|
| Storia, Playbook, Blueprint, Prospettiva per un cliente | **experience HTML** | skin del cliente, software dal vivo, mockup, moto, gating, admin |
| Il contenuto è un POV / pitch / use case Adobe | **.pptx** | è materiale Adobe, vive nella governance di marchio Adobe |
| Il cliente deve **rimontarlo, modificarlo, smembrarlo** | **.pptx** | è l'unico formato che si inoltra e si edita senza di noi |
| Serve ereditare slide dalle librerie Adobe | **.pptx** | le slide ereditate portano il loro template |
| Serve un grafico vero da dati, un diagramma su misura, un'interfaccia | **HTML** | in .pptx si disegnano solo rettangoli, linee e cerchi |
| Serve moto, clip, interazione, anteprima dal vivo | **HTML** | il .pptx non le ha |
| Accompagna una riunione e poi gira fra i colleghi del cliente | **entrambi**: experience + PDF/PPTX | la pagina per la stanza, il file per il giro dopo |
| Dossier interno | né l'uno né l'altro: `DossierPage.astro` | regola già esistente |

**Un artefatto, un design system.** Se servono tutt'e due le forme, sono due
artefatti distinti con due pelli distinte, non un ibrido.

## 3. Le regole del .pptx — verificate, non ricordate

Fonte 1, **il template stesso**: `docs/Intesa Sanpaolo/output/build/adobe_template_2026_empty.pptx`,
166 layout approvati, il cui master porta `«Thread» 0,14 × 7,50 in #EB1000`.
Fonte 2, la guida del template (Inside Adobe › Brand Center › Presentation
Template), riletta sulle fonti interne l'8 ottobre 2026.

1. **Si compone, non si disegna.** Si sceglie un layout fra i 166 e lo si riempie.
   «Do not create slides from scratch» è regola di Brand. Il builder dell'8 ottobre
   usava **un** layout (`Title Only`) e ridisegnava tutto a mano: è la causa prima
   dei 27 corpi tipografici e dei fondi che coprivano il thread.
   Catalogo visivo: `docs/Factory/pptx-layouts/` (`pnpm pptx:layouts`).
2. **Adobe Red è `#EB1000`**, e si LEGGE dal master del template. `#FA0F00` è il
   rosso del logo corporate, non quello delle slide.
3. **Il red thread non si copre, non si sposta, non si ricolora, non si rompe.**
   Un rettangolo a tutta pagina sopra la slide copre anche il marchio in basso: è
   il difetto `T` del gate.
4. **Fondi delle slide di contenuto: nero o bianco.** Il rosso sta su copertina e
   chiusura. Niente fondi di colore del cliente.
5. **Solo Adobe Clean** — Display Black titoli · Bold enfasi · Regular corpo. Se
   non è installato, **non si cambia il carattere**: si lasciano intatti i
   riferimenti del template (e si sa che il proprio render è un'approssimazione).
6. **Titoli in sentence case, testo a bandiera sinistra.**
7. **Icone solo nere o bianche, e solo dal set Adobe.** Non si ridisegnano.
8. **Grafici e diagrammi in prevalenza grigi**, con pochi accenti sul dato che
   conta. Un grafico a due serie rossa+ciano è fuori norma.
9. **Loghi di prodotto ufficiali**, col nome scritto accanto in **testo
   editabile**; mai un lockup con il testo incorporato, mai un logo ridisegnato.
10. **Una scala tipografica, non una scaletta.** 5-7 corpi su un deck. Un corpo a
    mezzo punto (10,5 · 13,5 · 15,5) è il segno del testo rimpicciolito finché
    entrava: si taglia la copia o si cambia layout, non si rimpicciolisce.

## 4. La catena, in ordine

```bash
pnpm pptx:layouts                      # il catalogo dei 166 layout — GUARDALO
pnpm pptx:find "claims"                # cerca nelle 1863 slide delle librerie Adobe
pnpm pptx:take "<libreria.pptx>" 151   # estrae e RENDE le slide da ereditare
#   … si compone riempiendo i layout del template …
pnpm audit:pptx <deck.pptx> --render   # 0 HARD, poi si GUARDANO le pagine
```

**Il gate misura, non guarda.** `audit:pptx` a zero HARD non è «va bene»: è il
permesso di aprire i PNG e leggerli, esattamente come per `audit:deck`.

## 5. Ereditare una slide da una libreria Adobe

`pnpm pptx:find` → `pnpm pptx:take` → si modifica con `python-pptx` → si rende →
**si guarda**. Che cosa funziona e che cosa no, misurato:

- **Funziona**: traduzione run-per-run con formattazione preservata; sostituzione
  del blob di un'immagine; ricolorazione; eliminazione di blocchi fuori perimetro;
  lettura ricorsiva dentro i gruppi.
- **Non funziona alla cieca**: una ricolorazione automatica appiattisce le
  illustrazioni isometriche in macchie di colore, e uno scambio d'immagine
  atterra sull'icona sbagliata. L'API non sa che ruolo ha ogni forma: **lo sa
  solo chi guarda il render**. Dopo ogni modifica si rende e si guarda.
- **Si cita la provenienza** (file + numero di slide) nel builder e nel handover.
  Una slide ereditata non si spaccia per propria.

## 6. Che cosa resta vietato in tutt'e due le forme

- Ridisegnare a mano un marchio — Adobe o cliente. Senza l'SVG ufficiale si usa
  il ripiego a wordmark (regola co-brand già in `CLAUDE.md`).
- Dichiarare «creato con Adobe Firefly» un asset che viene da stock.
- Mettere il colore di un cliente su un artefatto di marchio Adobe, e viceversa.
- Far passare un deck senza gate: HTML → `audit:deck`; file → `audit:pptx`.

## 7. Fonti

- Template e suoi 166 layout: `adobe_template_2026_empty.pptx` (master → `Thread`, `#EB1000`).
- Regole di marchio per le presentazioni: Inside Adobe › Brand Center ›
  Presentation Template & Company Overview — e la sua guida rapida, che elenca
  anche cover slide library, slide layout library, product logo library, icon
  library. I loghi di prodotto stanno sulla **slide 61** del template ufficiale.
- Carattere Adobe Clean: Inside Adobe › Brand Center › font; anche in Marketing
  Hub › Collections (collezione «Adobe Clean font»).
- Flusso sostenuto per gli assistenti: partire dal template di Brand Center e
  **riempire i layout approvati**, non generare slide da zero. Esiste una skill
  `adobe-powerpoint` pubblicata fra le skill di Claude, e Brand ne stava
  preparando una ufficiale: prima di adottarne una non ufficiale, il consiglio
  interno è parlare col team presentation design/keynotes.
- Express **Generate Presentation** è GA da dicembre 2025 ma **non ha API
  pubblica**: non è automatizzabile da qui.
