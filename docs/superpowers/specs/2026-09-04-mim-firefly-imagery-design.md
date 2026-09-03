# MIM · Firefly bespoke imagery — Fase 1 (design)

**Data:** 2026-09-04 · **Esperienza pilota:** `apps/mim-alfabeti` ("Alfabeti", Adobe × Ministero dell'Istruzione e del Merito) · **Stato:** design approvato, implementazione in corso.

## Obiettivo

Usare **Adobe Firefly API Services** per elevare in modo netto la qualità visiva (UI/UX) delle Experience Design, partendo dal MIM. Oggi i backdrop sono stock Pexels ri-tinto (generico, slegato dal concept). Firefly ci dà imagery **bespoke, on-brand, commercialmente sicura e firmata C2PA/Content Credentials**, che risolve anche la hard-rule "no wrong-brand imagery".

Piano complessivo a 3 fasi (concordato):
1. **Fase 1 — imagery bespoke build-time** ← *questo spec*.
2. **Fase 2 — demo generativa live (runtime via proxy Supabase)**.
3. **Fase 3 — video/motion generativo (text-to-video)**.

Si parte dalla Fase 1 perché è il ROI più alto a rischio minimo **e** costruisce l'infrastruttura (client OAuth + generate) riusata *identica* dalle fasi 2 e 3. Non è codice usa-e-getta.

## Concept visivo (approvato): Mix A+C bilanciato

Due registri paritari, palette **blu Italia (`--color-blu` #0B4DA2) + carta calda (`--color-carta` #F6F1E7)**, sobrio/istituzionale, Titillium Web come riferimento tonale:
- **Registro A — alfabeto astratto-tipografico**: segni, lettere, tratti d'inchiostro, grana della carta, astratti in campi luminosi. On-theme col nome "Alfabeti", 100% sicuro (nessun volto/soggetto da sbagliare).
- **Registro C — archivio luminoso**: la materia della PA (carta, pieghe, luce, documento) elevata a estetica raffinata e architettonica. Lega col racconto C2PA/provenienza.
- Ibridi A+C dove utile (lettere che emergono da strati di carta).

Il grade di brand della pipeline (`duotone`/`editorial`) resta come **fascia di sicurezza**: blocca comunque la palette a prescindere dall'output Firefly.

## Metodo: spike-first (approvato)

Prima di consolidare tutto:
1. Innesto il tipo slot `firefly` + il client OAuth.
2. Genero un **set piccolo rappresentativo** (registri A, C, ibrido) con 2-3 candidati per slot (variando `seed`).
3. Si guardano a **1920 (screenshot reale)**, come da contratto di legibilità del progetto.
4. Si scelgono i vincitori → consolido prompt e **rimappo l'intero set di backdrop** in chiave narrativa (non like-for-like), eventualmente espandendo per-pagina.

## Architettura — innesto nella pipeline esistente

Nessun sistema nuovo. Si estende `scripts/build-assets.ts`, che già smista `stock`/`aigen`/`code`.

### Unità 1 — `packages/core/src/assets/types.ts`
- Aggiungere `'firefly'` a `AssetType`.
- Campi opzionali a `AssetSlot` (retrocompatibili): `negativePrompt?: string`, `contentClass?: 'photo' | 'art'`, `seed?: number`, `fireflySize?: { width: number; height: number }`.
- `prompt` (già esistente, usato da `aigen`) è riusato da `firefly`.

### Unità 2 — `scripts/lib/firefly.ts` (modulo nuovo, isolato e testabile)
Interfaccia piccola:
- `getAccessToken()` — OAuth server-to-server IMS `client_credentials` da `FIREFLY_CLIENT_ID`/`FIREFLY_CLIENT_SECRET`.
- `generateImage(opts)` — Firefly **Images API v3** (`POST /v3/images/generate`), gestione sync + fallback polling se risponde con job async.
- `downloadOutput(url)` — scarica l'output presigned → `Buffer`.
- Restituisce anche i metadati per la provenienza (model, seed, eventuale manifest C2PA).

**Endpoint/scope configurabili via env** (default sensati, override senza toccare il codice — de-risca eventuali differenze dell'account enterprise):
- `FIREFLY_IMS_URL` (default `https://ims-na1.adobelogin.com/ims/token/v3`)
- `FIREFLY_API_URL` (default `https://firefly-api.adobe.io`)
- `FIREFLY_SCOPES` (default `openid,AdobeID,firefly_api,ff_apis`)

Questo modulo è la **fondamenta comune**: il proxy runtime della Fase 2 importa lo stesso client.

### Unità 3 — `scripts/build-assets.ts`
- `fromFirefly(slot)`: chiama il client, ritorna `{ buffer, prov }` come `fromPexels`/`fromMflux`.
- `processSlot`: dispatch `slot.type === 'firefly' ? fromFirefly(slot) : slot.type === 'aigen' ? fromMflux(slot) : fromPexels(slot)`.
- `main()`: check chiavi Firefly speculare a quello Pexels (avvisa se ci sono slot `firefly` senza chiavi).
- Il resto invariato: `applyGrade` → crop all'aspect → `.webp` 2400px → `provenance.json`.
- **Nota dimensioni**: Firefly v3 accetta un set di size; si richiede una size supportata vicina all'aspect (default 16:9 → `fireflySize` override per-slot), poi `sharp` fa crop esatto a 2400px. Se una size viene rifiutata, l'errore è esplicito e si corregge via `fireflySize`.
- Estendere l'interfaccia `Provenance` con `model?` e `contentCredentials?` (C2PA).

### Unità 4 — `apps/mim-alfabeti/assets.manifest.ts`
Riscrivere gli slot in chiave **semantica/narrativa** (concept A+C). Set spike ridotto prima, set completo dopo la validazione. Ogni slot `type: 'firefly'` con `prompt`, `negativePrompt`, `contentClass`, `grade`, `seed`.

### Unità 5 — `apps/mim-alfabeti/.env.example`
Documentare `FIREFLY_CLIENT_ID` / `FIREFLY_CLIENT_SECRET` (+ eventuali override). Le chiavi reali vanno in `.env` (gitignored), come `PEXELS_API_KEY`. **Mai in chat, mai committate.**

### Unità 6 — Credito C2PA nell'esperienza (leva UX)
Riga discreta e coerente col co-brand: **"Immagini generate con Adobe Firefly · Content Credentials"**. Per un committente pubblico la provenienza verificabile è racconto, non solo compliance. Collocazione: footer del `BaseLayout` o slide `dossier`.

## Confini della Fase 1 (YAGNI)

**Dentro:** build-time; tipo slot `firefly`; client OAuth riusabile; spike su MIM; consolidamento slot MIM; credito C2PA.

**Fuori (fasi successive):** proxy runtime Supabase (Fase 2); video/motion (Fase 3); propagazione alle altre 6 experience (solo dopo che il pattern è validato su MIM — poi si propaga come da regola di cross-experience propagation).

## Segreti & esecuzione

Come Pexels: chiavi in `apps/mim-alfabeti/.env` (gitignored), generazione **in locale**, output `.webp` committati. Nessun segreto in CI per ora. Comando: `pnpm --filter mim-alfabeti assets:build` (spike: `--manifest <tmp>` con solo gli slot dello spike).

## Verifica

1. `pnpm --filter @edf/core typecheck` + `pnpm --filter mim-alfabeti build` (senza chiavi: gli slot firefly restano placeholder, il build passa).
2. Dopo aver messo le chiavi: `assets:build` genera → **screenshot 1920 di ogni slide toccata e lettura reale** (contratto di legibilità), poi `audit:deck` non pertinente qui (mim-alfabeti non è un deck aud-itato, ma le regole visive valgono).

## Rischi & mitigazioni

- **API surface enterprise diversa dai default** → endpoint/scope via env; lo spike la conferma al primo colpo (hit reale).
- **Size v3 rifiutata** → `fireflySize` per-slot override + `sharp` crop finale.
- **Direzione visiva non convince** → spike-first con 2-3 candidati/slot prima di scalare.
- **Palette off** → grade di brand come rete di sicurezza.
