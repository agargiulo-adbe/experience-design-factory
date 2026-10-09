# Il guscio sensoriale di una experience

> Marchio, movimento, suono e scala. Sono le quattro cose che si vedono (e si
> sentono) **prima** di leggere una riga, e sono anche quelle che si dimenticano
> più spesso, perché nessun check le fa fallire. Questa pagina le rende
> ripetibili: cosa si costruisce, con quale comando, e qual è la trappola che
> ciascuna si porta dietro.
>
> Vale per ogni experience, presente e futura. Dove c'è un comando, il comando è
> la fonte: non si ridisegna a mano quello che uno script sa rendere.

---

## 1. Il marchio — favicon, icone, anteprima del link

**Ogni experience ha un marchio suo.** Non il logo del cliente (quello vive nel
co-brand e si usa solo se ufficiale), non una lettera: una **forma geometrica
presa dal disegno che regge il deck**. Su «Su scala umana» è la pila
dell'innesto — tre bande, quella del cliente piena e sotto. Su «Sei domande» è
la faccia del sei. A 16px una lettera sembra un carattere che non ha caricato;
una forma no.

**Come si fa**

1. Si scrive a mano `apps/<app>/public/favicon.svg`, 32×32, `rx="7"`, i colori
   presi dai token della skin (che vengono dal CSS di produzione del cliente —
   vedi `pnpm brand:tokens`).
2. `pnpm brand:icons <app> --title "…" --sub "…" [--font "…"]` rende il resto:
   `icon-192.png`, `apple-touch-icon.png` (fondo pieno: iOS non ha trasparenza)
   e `og.png` 1200×630. **La palette la legge dal favicon**, non da parametri:
   così le icone non possono divergere dal marchio.
3. Nel `<head>` del BaseLayout: `favicon.svg`, `icon-192`, `apple-touch-icon`,
   e i meta `og:title/description/image` + `twitter:card`.

**La trappola.** `noindex` riguarda i motori di ricerca. Chi riceve il link **in
chat** vede comunque il riquadro di anteprima: senza `og:image` è un rettangolo
vuoto, e il deck sembra rotto prima ancora di aprirsi. L'anteprima serve
soprattutto alle experience riservate, non di meno.

---

## 2. Il movimento — la clip in loop su copertina e chiusura

Copertina e chiusura sono le due slide dove non si parla. Lì una clip di sfondo
che respira vale più di un'immagine ferma; **in mezzo no**, perché ruba lo
sguardo al testo.

**Come si fa**

1. Si genera con lo script video dell'app (`scripts/gen-firefly-video.mts`,
   modello Firefly Video). Regole del prompt: **gesto quasi fermo**, camera
   bloccata, composizione asimmetrica, due terzi di fotogramma quasi vuoti dove
   andrà il testo. Nel negative prompt ci vanno `camera movement, pan, tilt,
   zoom, dolly, tracking shot`: se non glielo si vieta, il modello dà una
   carrellata.
2. Si ricuce: `pnpm loop:seamless <clip.mp4> --poster`. Lo script misura il
   giro (PSNR ultimo→primo fotogramma contro due fotogrammi adiacenti) e
   fallisce se salta.
3. **Se la clip DERIVA** — la luce cresce, la materia si sposta — testa e coda
   sono immagini diverse e nessuna dissolvenza le fa combaciare: si alza
   `--fade` e il giro resta sotto il riferimento. Lì serve
   **`--boomerang`**: andata e ritorno, il giro si chiude per costruzione.
   Costa il doppio della durata e inverte il moto a metà: su un gesto quasi
   fermo non si vede, su un movimento riconoscibile (qualcosa che cade, che
   scorre in una direzione sola) sì — e lì si rigenera la clip, non si bara.
4. Il `.mp4` va sul **GitHub Release `media`** (`gh release upload media …`), il
   poster `.jpg` in `public/media/`. I video non entrano nel repo.
5. In pagina: `LoopVideo` nello slot `backdrop`, con lo scrim di brand.
   `provenance.video.json` registra prompt, seed, rimontaggio e misure.

**La trappola.** Una clip generata è quasi sempre **più luminosa e più satura**
dell'immagine ferma che sostituisce: lo scrim che bastava prima non basta più.
Si guarda lo screenshot con il titolo sopra, non il CSS.

---

## 3. Il suono — il letto sonoro sotto il deck

**`@edf/core/blocks/DeckAudio.astro`.** Una riga nel BaseLayout e il deck ha un
letto sonoro che cambia livello con la slide.

**Come si fa**

1. La traccia si prende da **Adobe Stock, collezione Audio**
   (`asset_search` con `contentType: "Audio"`, poi
   `asset_license_and_download_stock`). Niente API che *genera* musica: Firefly
   video esce muto. **Licenziare consuma una licenza dell'account**: si chiede
   prima, sempre, anche quando l'asset è free tier.
2. Si ricuce il giro come per il video, con ffmpeg:
   `acrossfade` di ~3 s fra la coda e la testa, poi AAC 96 kbps
   (un WAV da 26 MB diventa un m4a da 1,8 MB).
3. Sul Release `media`, come i video. `provenance.audio.json` registra fonte,
   id Stock, licenza, rimontaggio e livelli.
4. Nel BaseLayout: `<DeckAudio src={…} loud={0.42} soft={0.1} />`.
   Le slide dove il suono sale dichiarano `data-audio="loud"` — copertina e
   chiusura. Tutte le altre restano al velo senza dichiarare niente.
5. **Il comando vive nella barra del deck**, in coda a frecce, contatore e
   schermo intero: è lì che chi presenta cerca i comandi, e così eredita anche
   la sparizione automatica del chrome. Il blocco si monta nel BaseLayout, poi
   sposta il suo comando dentro `[data-deck-controls]` a runtime.
6. **Il cursore del livello è un GUADAGNO GENERALE**, non un volume assoluto:
   moltiplica i livelli per slide (0,2×–1,5×) invece di sostituirli, così la
   dinamica decisa in pagina sopravvive a qualunque posizione del cursore.
   Compare solo ad audio acceso — un cursore che non governa niente è peggio di
   un cursore assente — e la posizione si ricorda.

**Le regole di comportamento, e perché**

- **Parte spento, con il comando in vista.** Non è prudenza: il browser blocca
  l'audio finché non c'è un gesto, quindi «acceso di default» non esiste —
  esiste «acceso al primo clic», che per chi apre il link in ufficio è musica a
  sorpresa. La scelta si ricorda in `localStorage`.
- **Dissolvenze, mai salti.** Un volume che scatta si sente come un guasto.
- **Scheda dietro: si tace.**
- **Sopravvive al cambio di capitolo** (`transition:persist`): la navigazione è
  SPA, e senza quello la musica ripartirebbe da capo a ogni capitolo.

**Due trappole.**

*Il comando che sparisce.* Spostarlo dentro la barra del deck lo porta **fuori**
da ciò che `transition:persist` protegge: al primo cambio capitolo muore con la
pagina vecchia, e l'audio resta acceso senza più un modo per spegnerlo. Prima
dello swap (`astro:before-swap`) il comando torna dentro il nodo persistente, e
dopo si ri-aggancia alla barra nuova. Si verifica contando i nodi dopo **due**
navigazioni, non una.

*La dissolvenza che non parte.* `k` va clampato **anche in basso**: il
timestamp del primo `requestAnimationFrame` può precedere di qualche millisecondo
il `performance.now()` preso un attimo prima, e un `k` negativo produce un volume
negativo. Il setter lancia, l'eccezione esce dal ciclo e **l'audio non parte
mai**, in silenzio. Si verifica leggendo `el.volume` dopo il fade, non a orecchio.

---

## 4. La scala — il tipo cresce col muro

**Il difetto, misurato.** Ogni skin fissa
`html { font-size: clamp(1rem, 0.5vw + 0.875rem, 1.125rem) }`: il tetto è 18px e
si raggiunge già a 1600px di larghezza. Da lì in poi il tipo **non cresce più**.
Su un 3840×2160 il corpo resta a 18,4px, il blocco di contenuto copre il **34%
della larghezza e il 30% dell'altezza**: un francobollo in mezzo a una parete.
Allargare solo safe-area e comandi — che è quello che il motore faceva — non
sposta niente.

**Il rimedio, nel motore** (`DeckContainer.astro`, quindi gratis per ogni deck):
si scala la **radice**, non i singoli corpi, così tipo, interlinea e larghezze
massime (`max-w-*` è in rem) crescono insieme e la riga resta lunga più o meno
gli stessi caratteri.

| viewport | radice |
|---|---|
| ≥ 2000px | 20px |
| ≥ 2560px | 24px |
| ≥ 3200px | 28px |

Tre vincoli non negoziabili:

- **È opt-in per app**: `<DeckContainer wallScale>`. Non è prudenza generica —
  il tipo più grande cambia come il contenuto va a capo, e una composizione che
  sta in piedi a 1920 può collidere a 2560. Misurato: accesa su tutti i deck
  insieme, un'altra experience usciva con **dieci collisioni testo-su-testo** ai
  soli viewport da muro. Si accende **dopo** `audit:deck -- --tv` a 0 HARD.
- **La scala parte sopra i 1920.** 1920, 1440 e 1280 sono i viewport su cui
  l'audit misura e su cui ogni deck è già stato verificato a mano: toccarli
  vorrebbe dire rifare quella verifica su tutte le experience.
- `html:has([data-deck])` tiene la regola dentro le pagine che hanno davvero un
  deck: un dossier o una pagina di testo non si scala.

**Il display cresce di più del corpo.** Su una copertina la proporzione giusta a
1920 resta timida a 3840: si alzano i tetti delle `clamp()` di titolo, occhiello
di capitolo, lead e metriche, **solo sopra i 2000px**.

**Il gate.** `pnpm --filter <app> audit:deck -- --tv` aggiunge 2560×1440 e
3840×2160 ai tre viewport di proiezione. Non è nel giro di default perché
raddoppia i tempi: si lancia **quando si tocca la composizione e prima di una
proiezione su parete**. Attenzione a `g` (ritmo verticale): un `gap` in rem che
vale 7px a 18px di radice ne vale 9 a 24 — e i vuoti fra blocchi devono restare
≥16px *a ogni* scala.

---

## 5. Quello che l'audit non vede — e che si trova solo guardando

Tre collisioni reali, tutte trovate leggendo uno screenshot a 1280×800:

1. **La barra di navigazione dell'app.** Il check `b` guarda i comandi del deck,
   non la nav.
2. **La firma co-brand e il credito «creato con»**, che sono chrome d'angolo.
3. **Il comando dell'audio**, per la stessa ragione.

**La regola che ne esce:** mentre si legge un blocco aperto, il contorno
arretra. `HowItWorks` marca `html[data-hiw-open]`; ogni skin decide nel suo
`global.css` che cosa sparisce (nav, co-brand, credito, audio) e torna alla
chiusura. È meglio che tagliare contenuto, ed è una regola sola invece di dieci
aggiustamenti di spaziatura.

---

## 6. La griglia prima dell'elenco

Un elenco di blocchi brevi dentro una slide centrata **si disallinea da solo**:
il reset `[data-slide] .slide-inner.text-center p { margin-inline: auto }` centra
ogni paragrafo con un `max-width`, e la voce corta parte da un'ascissa diversa
dalle altre. Il check `m` non lo coglie, perché guarda solo i figli diretti del
wrapper.

Due conseguenze pratiche:

- **Quattro voci stanno meglio in griglia 2×2** a blocchi di pari dimensione
  (`auto-rows-fr` + `h-full`) che in colonna: pesano uguale, e il bordo di
  lettura è uno solo.
- Ogni blocco a bandiera dentro un componente si difende da sé:
  `margin-inline: 0` con specificità sufficiente a battere il reset
  (`[data-slide] .componente p`, non `.componente p`).

---

## 7. Il diagramma, non la lista

Tre forme che hanno retto alla prova, con il criterio per sceglierle:

| forma | quando | che cosa dice |
|---|---|---|
| **tappe + binario** | un processo con una regola trasversale | che la regola **non è una tappa**: sta sotto tutte |
| **anello** | un ciclo che si chiude | che quello che si misura **rientra** |
| **percorso + due letture** | lo stesso dato letto in due modi | il confronto, senza numeri inventati |

Regole comuni: il diagramma **porta le etichette** (non è decorazione accanto al
testo); le proporzioni schematiche si dichiarano tali in didascalia; e un dato
del cliente non si inventa mai per riempire un grafico.

---

## Checklist — guscio sensoriale

- [ ] `favicon.svg` disegnato a mano, geometrico, nei colori della skin
- [ ] `pnpm brand:icons <app>` eseguito; `<head>` con icone + og + twitter:card
- [ ] clip di copertina e chiusura generate, ricucite (`--boomerang` se deriva),
      caricate sul Release, con poster e `provenance.video.json`
- [ ] scrim ricalibrato sulla clip (si guarda lo screenshot col titolo sopra)
- [ ] traccia audio licenziata **dopo averlo chiesto**, ricucita, sul Release,
      con `provenance.audio.json`; `data-audio="loud"` su copertina e chiusura
- [ ] audio verificato leggendo `el.volume` ai tre stati (loud / soft / off) e
      ai tre livelli del cursore; comando ancora presente e agganciato dopo due
      cambi di capitolo
- [ ] **audio spento e schede chiuse a fine lavoro**: una prova lasciata aperta
      suona nelle cuffie di chi ti sta leggendo
- [ ] `audit:deck -- --tv` a 0 HARD **prima** di accendere `wallScale`, e
      screenshot letti a 2560
- [ ] nessuna collisione con nav, co-brand, credito e comando audio **con i
      blocchi aperti**, a 1280×800
