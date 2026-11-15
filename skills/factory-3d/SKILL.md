---
name: factory-3d
description: Use when an experience of the Factory needs a 3D asset — a background loop in the client's exact palette, or an object/architecture that builds itself step by step — and before opening Blender, composing a scene over MCP, or touching scripts/3d/. Not for flat diagrams: those stay SVG.
---

# factory-3d — Blender dentro la Factory

Blender produce due cose che Firefly e l'SVG non danno: **un loop che si chiude per
costruzione nei colori esatti del cliente**, e **un oggetto che si costruisce in fasi
con la profondità di due strati**. Tutto il resto lo fanno meglio gli strumenti che
abbiamo già.

## Quando NO

- **Un diagramma con testo** (architetture, flussi, tabelle): resta SVG/HTML. Il motore
  ha già l'innesto a carte, il blueprint che si costruisce con GSAP, 30 blocchi e 11
  scene (`pnpm deck:catalogo`). Un render congela il testo: non si traduce, non passa
  `audit:wrap`, non si corregge in sala.
- **Il prodotto o il luogo di un cliente** (un'auto, una filiale riconoscibile, un logo
  in 3D): è immagine di marchio altrui.
- **Un deck sul template Adobe** (.pptx): lì il design system è di Adobe e il credito
  «creato con Blender» stona. Se serve 3D su un artefatto Adobe, prima si chiede se c'è
  accesso a Substance 3D.
- **A meno di una settimana da una stanza** su una slide che ha già passato il panel:
  si prototipa a parte, non si sostituisce.

## Le due regole di ogni scena

1. **Niente testo nel render.** Le etichette stanno in HTML sopra il video, con
   `<T it en>`, posizionate in percentuale sul palco 16:9.
2. **Un loop si chiude per costruzione.** Ogni moto è funzione di θ = 2π·f/N e si rendono
   i fotogrammi 0…N-1. Il rumore si campiona lungo un cerchio. `loop:seamless` deve
   uscire PASS senza ricucire nulla: se ricuce, la scena è sbagliata.

## Il giro

```
pnpm render:3d --app <cartella-app> --scena fondo|innesto [--anteprima] [--secondi 8]
```

1. **Esplora** (facoltativo) con Blender MCP: si compone parlando, si guarda lo
   screenshot. Metodo da `upstream/skills/references/reference-image-match.md` e
   `visual-match-checklist.md`.
2. **Congela** la scena come funzione in `scripts/3d/render.py`. Una scena che esiste
   solo in un `.blend` non si rifà quando cambia la palette.
3. **Rendi in anteprima** (960×540, 8 campioni, ~20 s) e **guarda i fotogrammi**: almeno
   uno per fase, affiancati con `ffmpeg … tile=2x2`. Le tre trappole già prese:
   - in Blender 5.3 `transform_apply(scale=True)` cuoce anche la posizione → si scala
     la mesh (`o.data.transform(Matrix.Diagonal(...))`);
   - in assonometria uno strato esattamente sotto un altro sparisce: da 32° di alzata
     servono ~6 unità di scarto, quindi lo strato sotto va anche **davanti**;
   - `view_transform = Standard`: con AgX/Filmic il colore non è più quello del token.
4. **Rendi pieno** (1920×1080, 48 campioni; ~1,5 min per 11 s su Apple Silicon).
5. **Gate**: `loop:seamless --check` (lo lancia il wrapper sui loop) · il velo sotto il
   testo nel caso peggiore, non in media (memoria `velo-si-misura`) · la prova del
   meccanismo in pagina con `prefers-reduced-motion` attivo.
6. **Entra nell'app solo dopo che qualcuno l'ha guardato**: si copia da
   `docs/Factory/3d/<app>/<scena>/` in `src/assets/generated/` (o sul Release `media` se
   pesa) con la riga di `provenance.json`.

## Una scena a fasi dentro il deck

`render:3d` scrive `capitoli.json` (fase → fotogramma da/a). Ogni sotto-passo del deck
riproduce **solo** il tratto della sua fase e si ferma: il video non corre da solo, segue
chi parla. Indietro = salto allo stato finale della fase prima. Con la riduzione del
movimento si salta direttamente allo stato. Il poster di una scena a fasi è l'**ultimo**
fotogramma (lo stato completo), quello di un loop il primo.

Prova funzionante: `docs/Factory/3d/intesa-esperienza-cliente/innesto/anteprima.html`
(git-ignorata). Serve un server con le richieste Range (`vite preview`), altrimenti il
salto fra fasi non funziona: `python -m http.server` non le supporta. Su GitHub Pages ci sono.

## Blender MCP — sicurezza

Server `mcp-for-blender` (ahujasid), versione **bloccata**, telemetria spenta:

```
claude mcp add blender -s user -e DISABLE_TELEMETRY=true -e BLENDER_MCP_DISABLE_TELEMETRY=true \
  -- uvx --from mcp-for-blender==2.3.0 mcp-for-blender
```

- L'add-on porta una **raccolta di «trajectory»** (prompt, codice, screenshot della scena)
  verso un Supabase dell'autore. È **spenta di default** (`telemetry_consent=False`,
  verificato nel codice il 15 nov 2026) e va tenuta così: i prompt su un cliente sono
  materiale del cliente.
- **Nessuna chiave** per Hyper3D, Hunyuan3D, Sketchfab, Meshy, Tripo, World Labs: mandano
  prompt e immagini fuori.
- `execute_blender_code` esegue Python arbitrario: solo su `.blend` nostri, mai su file
  scaricati.
- Prima di aggiornare la versione si rilegge il diff di `addon.py` e di `telemetry.py`.

## Le skill a monte

`upstream/` contiene **dieci delle 94** skill di
[arjun988/blender-skills](https://github.com/arjun988/blender-skills) (MIT, commit in
`upstream/COMMIT`), più i riferimenti comuni. Le altre sono generi di videogioco ed export
verso motori di gioco. Si leggono **a richiesta**, non si installano: 94 descrizioni in
più nell'elenco delle skill farebbero concorrenza a quelle della Factory.

| Serve per | File |
| --- | --- |
| inquadratura, ottiche, movimenti di camera | `upstream/skills/camera-cinematography/SKILL.md` |
| luce | `upstream/skills/lighting/SKILL.md` |
| materiali, revisione dello shading | `upstream/skills/materials/SKILL.md`, `lookdev/SKILL.md` |
| assonometrie e diorami | `upstream/skills/isometric-style/SKILL.md` |
| riduzione, astrazione | `upstream/skills/minimalist-style/SKILL.md` |
| spazi architettonici | `upstream/skills/archviz/SKILL.md` |
| resa e compositing | `upstream/skills/rendering/SKILL.md`, `compositing/SKILL.md` |
| controllo prima di consegnare | `upstream/skills/qa-review/SKILL.md` |
| replicare un riferimento | `upstream/skills/references/reference-image-match.md` |

⚠️ Le skill a monte parlano di budget di poligoni, LOD ed export per Unity/Unreal: per noi
non contano. Conta il metodo (brief prima di eseguire, screenshot dopo ogni fase, checklist
prima di consegnare).
