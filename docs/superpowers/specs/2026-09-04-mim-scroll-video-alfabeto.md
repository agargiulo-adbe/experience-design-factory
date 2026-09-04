# MIM · "Alfabeto → Competenza" — pagina scroll con video Firefly scrubbato (design)

**Data:** 2026-09-04 · **App:** `apps/mim-alfabeti` · **Stato:** design approvato, in build. Estende [[firefly-asset-pipeline]] alla **Fase 3 (video/motion)**. Riferimento concettuale: doc `docs/Eni/FIREFLY-DECK-EXPLORATION.md` (L2/L3).

## Obiettivo

Un momento **scroll-storytelling** in stile "build timeline" (video scrubbato 0→100% sullo scroll, sticky, progress bar) come nel workflow Figma+Claude+Higgsfield/Seedance — ma con **Adobe Firefly Video Model** al posto di Seedance (in-ecosistema, C2PA, commercialmente sicuro). Metafora approvata: **alfabeto → competenza** (astratto), con le 4 tappe della trasformazione come milestone testuali.

## Decisioni approvate

- **Formato:** pagina **scroll** dedicata `/trasformazione/` (NON una slide del deck). MIM è un deck a slide fisse; lo scroll-scrub è un paradigma scroll → pagina separata, linkata da una **CTA nel deck** (slide "La rotta"), non dal rail di nav (rispetta il *nav single-line contract*).
- **Video:** **un solo clip continuo** Firefly scrubbato (i clip Firefly sono corti ~5s; su 400vh "dura" a sufficienza e resta coerente — evita l'inconsistenza dei clip multipli).
- **Contenuto — 4 tappe:** (1) lettere sparse → *Oggi: strumenti frammentati*; (2) parole che si formano → *Un linguaggio comune (competenze digitali)*; (3) struttura coerente → *Un'esperienza governata al centro (AEP · AJO · CJA)*; (4) composizione compiuta → *IA sicura, in classe*. Copy in voce umana, nomi prodotto verificati.

## Architettura

### Unità 1 — `scripts/lib/firefly.ts` (+ `generateVideo`)
Aggiungere `generateVideo(creds, opts, token?)`: job **async** (POST `/v3/videos/generate-async` → poll `statusUrl` → download MP4). Endpoint env-overridable (`FIREFLY_API_URL`). v1 = **text-to-video** (nessun upload immagine → più semplice per lo spike; il prompt controlla palette navy+lettere). Struttura pronta ad accettare in futuro un'immagine di condizionamento (image-to-video dal hero `bg-navy`). Ritorna `{ buffer, model, contentCredentials }`.

### Unità 2 — `scripts/build-video.ts` + `apps/mim-alfabeti/video.manifest.ts`
Script che legge un manifest video (slot con `prompt`, `aspect`, `seconds`, `seed`), genera via Firefly, poi **ffmpeg scrub-encode** (keyframe densi `-g 1` + `+faststart`) e scrive in `apps/mim-alfabeti/public/media/<id>.mp4` (+ poster JPG del primo/ultimo frame per il fallback). Provenienza (`prompt`/`model`/`c2pa`) in `public/media/provenance.video.json`. Comando `pnpm --filter mim-alfabeti video:build`. Chiavi build-time in `.env` (mai in CI/chat).
- **Delivery:** clip corto committato in `public/media/` (gitignore blocca solo `docs/*.mp4`); se dovesse superare ~8MB → GitHub Release tag `media` come maxmara.

### Unità 3 — `apps/mim-alfabeti/src/pages/trasformazione.astro` (scroll)
- `BaseLayout` senza `DeckContainer`. Wrapper alto ~**400vh**; dentro uno **stage** `position:sticky; top:0; height:100vh` con `<video muted playsinline preload=auto>` full-bleed + scrim + progress bar + 4 didascalie posizionate.
- Intro breve sopra lo stage e outro/CTA sotto (torna al deck).

### Unità 4 — `apps/mim-alfabeti/src/scripts/scroll-scrub.ts` (controller)
- `progress = clamp((scrollY - wrapperTop)/(wrapperH - vh), 0, 1)`; in `requestAnimationFrame`: `video.currentTime = progress * duration` (seek solo se `readyState>=2`). Milestone a soglie 0/.33/.66/1 (fade+translate). Aggiorna la progress bar (`scaleX`).
- Robustezza SPA (`astro:page-load`), cleanup listener, `IntersectionObserver` per attivare solo quando in vista.
- **`prefers-reduced-motion`**: niente scrub → mostra il **poster** statico e rivela tutte le didascalie in sequenza normale.

## Quality bar (ereditata)

WCAG 2.2 AA (didascalie su scrim, contrasto reale rgba) · **nessun testo dentro il video** · Lighthouse ≥95 (video preload gestito, nessun CLS) · responsive mobile→desktop→TV · `prefers-reduced-motion` rispettato · copy 100% umano.

## Verifica

1. **Spike video**: `video:build` → guardo il clip (se lo scope *video* non è sulla chiave, l'errore lo dice → fallback).
2. ffmpeg scrub-encode → **scrub testato a 1920** (Playwright: setto scrollY a 0/33/66/100% e leggo i frame) + verifica milestone.
3. Fallback `prefers-reduced-motion`. Sanity perf/CLS.

## Scope (YAGNI) & rischi

- **v1:** 1 clip text-to-video, scrubbato, 4 didascalie, 1 pagina, CTA dal deck.
- **Dopo:** image-to-video dal hero per continuità; clip più lunghi/stitch; transizioni L3 tra sezioni del deck; propagazione ad altre experience.
- **Rischi:** (a) scope video non abilitato → spike lo rivela, fallback = sequenza-immagini o generazione altrove; (b) scrub a scatti → keyframe densi, in extremis canvas frame-sequence; (c) durata breve → design a un-clip la aggira; (d) peso MP4 → Release tag `media`.
