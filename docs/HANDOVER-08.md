# Handover — Parte 8 di 15
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 29. Firefly asset + video pipeline (engine build-time riusabile) (agg. 2026-09-08)

Nata su MIM (§28.5) ma **riusabile da tutte le esperienze**. Tutto **build-time**, chiavi in `.env` dell'app (gitignored, mai in CI/repo).

- **`scripts/lib/firefly.ts`** — client isolato dependency-free (`fetch`): `getAccessToken()` (OAuth IMS `client_credentials`), `generateImage()` (Images v3, sync+poll), `generateVideo()` (job async, poll `statusUrl`, download MP4), `fireflyCredentialsFromEnv()` + `fireflyVideoCredentialsFromEnv()`. Endpoint/scope **env-overridable**: `FIREFLY_IMS_URL`, `FIREFLY_API_URL` (def. `https://firefly-api.adobe.io`), `FIREFLY_SCOPES` (def. `openid,AdobeID,firefly_api,ff_apis`), `FIREFLY_VIDEO_PATH` (def. `/v3/videos/generate`). Riusato tal quale dal futuro proxy runtime (Fase 2).
- **Immagini** — tipo slot **`firefly`** in `scripts/build-assets.ts` (accanto a `stock`=Pexels, `aigen`=FLUX locale, `code`); `packages/core/src/assets/types.ts` esteso (`AssetType`+`'firefly'`, campi `negativePrompt/contentClass/seed/fireflySize`, helper `fireflySizeFor()`). ⚠️ **Firefly Images v3 accetta solo size fisse** (16:9 → richiedi `2688×1536` poi crop a 2400; `2048×1152` dà 400 `Unsupported aspect ratio`). Provenienza in `provenance.json` con `model/seed/contentCredentials`. Comando `pnpm --filter <app> assets:build` (subset via `--manifest`/`--out`). **Funziona** (chiave immagini valida).
- **Video — FUNZIONA dal 8 set 2026**: il `404` a corpo vuoto NON era un entitlement mancante ma l'header **`x-model-version: video1_standard`** richiesto dalla Video API (fix `d50c527` in `firefly.ts`, `FIREFLY_VIDEO_MODEL` env). Con la credenziale Audio&Video già in `.env`: 202 → job ~3 min → MP4 1080p 24 fps 5 s. Tre clip MIM generati (§28.7). La nota storica che segue resta per contesto.
- **Video (storico)** — `scripts/build-video.ts` + script `video:build` (⚠️ il manifest MIM `apps/mim-alfabeti/video.manifest.ts` è stato **rimosso** col ritiro di `/trasformazione`, §28.6; l'engine resta riusabile creando un nuovo manifest): genera con `generateVideo()`, poi **ffmpeg scrub-encode** (`-g 1` keyframe densi + `+faststart`) + poster. ⚠️ **Generate Video API = ENTERPRISE-only, oggi NON accessibile**: l'«Audio & Video API - Firefly Services» self-serve include solo Reframe/Translate-LipSync/TTS/Avatar/Dynamic-Graphics-Render, **non il text-to-video**. Il generativo è **`generateVideoV3`** (via Adobe Sales, no self-serve). Diagnosi chiavi: `403003 "Api Key is invalid"` = credenziale non agganciata a un prodotto Firefly (risolto condividendo il progetto con la key immagini) → poi `/v3/videos/generate` dà **404 corpo-vuoto** = backend raggiunto ma modello non provisionato. **Accesso enterprise richiesto (P1 §10)**. Anche il connettore MCP «Adobe for creativity» **non** fa video generativo. Workaround usato = **Firefly web app** («Piano A»): genera il clip a mano → droppa l'MP4 → `video:build`/Release.
- **Riuso su Isybank (9 set)**: pipeline riusata tal quale — 17 immagini + 2 clip in ~10 min (§31.4). **Gotcha poster (fix `cea02f9`)**: `href(base, '/media/x.jpg')` aggiunge la slash finale → 404 su Pages; per i **file** in `public/media` costruire il path con `${base.replace(/\/?$/, '/')}media/x.jpg` (corretti Isybank e i 3 poster MIM). Regola: sulle slide con video lo still di fallback è il **poster del clip** (scuro), non un'immagine hero luminosa; Chromium di Playwright non decodifica H.264, quindi nello screenshot resta lo still. `.gitignore` copre ora `apps/*/public/media/*.mp4` e `.env_*`.
- **Delivery MP4** (pattern maxmara): clip su **GitHub Release tag `media`** (repo leggero; `gh release upload media <file> --clobber`), poster committato in `public/media/`. `.gitignore` blocca solo `docs/*.mp4` (gli MP4 in `public/` sarebbero committabili, ma preferiamo il Release).
- Fasi: **Fase 1 (imagery)** fatta · **Fase 3 (video/motion)** avviata su MIM · **Fase 2 (proxy runtime demo live)** da fare (P2 §10). Memoria **`firefly-asset-pipeline`**.
### 29.3 Regole BINDING nate fra l'11 e il 12 set — firma, loop, credito, design system

Quattro regole entrate **nel motore**, non nella documentazione: una experience nuova le eredita
senza wiring. Tutte scritte in `CLAUDE.md`, nella skill `experience-design` e nel blueprint.

**Firma co-brand «Adobe × Brand»** — `@edf/core/blocks/CoBrand.astro`. L'ordine è **scritto nel
markup e non ha una prop per invertirlo**. `variant="chrome"` sta su **ogni** slide (una riga nel
BaseLayout, fuori dal flusso → fuori dalle misure dell'audit); `variant="hero"` è il lockup grande e
centrato di **prima e ultima** slide. Dove c'è un `hero` la firma fissa **si spegne da sola**:
runtime in `DeckContainer`, nessun attributo da mettere a mano. Marchio cliente **solo da SVG
ufficiale**; senza, ripiego sul nome in carattere display — mai un logo ricostruito.
⚠️ **L'ultima slide diventa una slide-firma a sé**: la chiusura tipica è troppo densa per il lockup
grande, e per contratto si divide, non si comprime. Fallisce il check soft `i` (il lockup è un SVG,
il parser non lo conta come massa di testo): è voluto.
⚠️ **Inchiostro** — `--ink-X` sta su `--surface-X`, ma **quale delle due sia scura cambia**: nelle
experience a dominante scura (Agos, Eni, Isybank, Trenitalia) `--surface-inverse` è la superficie
**chiara**. Il lockup dentro la slide prende l'inchiostro dalla superficie **dichiarata dalla
slide**; la firma fissa, che sta fuori, usa **valori espliciti** pilotati da `data-on-dark`.
**Fuori regola**: Atelier (la Factory stessa) e Aperture (ricerca vendor-neutral) — non c'è una × da fare.

**Clip in loop senza stacco** — `LoopVideo.astro` + `pnpm loop:seamless`. Lo stacco sul giro di una
clip generata è un difetto del **contenuto**, non della riproduzione: la clip finisce su un
fotogramma che con il frame 0 non c'entra niente. Lo script dissolve la coda sulla testa (ffmpeg
xfade) e **misura**: PSNR ultimo→primo fotogramma contro due fotogrammi adiacenti, entro 6 dB =
pass; `--check` esce ≠0. Fatto su UniCredit (cover 21,5→41,1 dB; chiusura 18,7→34,8) e Isybank
(19,8→38,9; 13,6→37,1 — quest'ultima ha richiesto `--fade 2.0`, lo script lo segnala). Residuo noto
e accettato: il `loop` nativo costa **un tick di compositor (~17 ms, un fotogramma)** sul giro.

**Credito «creato con»** — `@edf/core/blocks/MadeWith.astro`, in basso a destra, speculare alla
firma; runtime in `DeckContainer`. Sono i prodotti Adobe usati per **creare** gli asset della slide,
**non** quelli che l'experience propone al cliente. **È un fatto**: si dichiara solo ciò che risulta
dai `provenance.json`. Isybank e MIM hanno tutti gli sfondi Firefly → una riga di `fallback` nel
BaseLayout; **UniCredit ha asset misti** (10 Firefly, 19 stock) → **nessun fallback**, marcate a mano
le 13 slide con asset `ff-*` o clip. Forma **senza verbo** (`▲ Adobe Firefly · sfondo`): «clip creato
con» non accorda, e un credito non è una frase. Le icone dei singoli prodotti **non si
ricostruiscono**: marchio corporate Adobe + nome per esteso.
**Un credito non va nella nav** — la nav è fatta di destinazioni; lì è vago e sparisce ai viewport
stretti. I due posti giusti: la nota di copertina (una volta, con le Content Credentials) e il
credito per slide.

**Il design system del cliente si legge** — `pnpm brand:tokens <url>`, **primo comando di ogni nuova
experience**. Scarica il CSS di produzione e conta: i colori più frequenti **sono** il design system,
qualunque cosa dica un brand book. Separa i default di framework (Bootstrap/Tailwind) invece di
nasconderli, mostra le custom property che il sito pubblica (quando ci sono **vincono su tutto**),
elenca i caratteri. Usa `fetch`, **non** un browser headless: diversi siti bancari bloccano
l'headless ma servono il CSS a una GET semplice. Su UniCredit stampa **petrolio #007A91 a 271
occorrenze contro rosso #E2001A a 13** — riproduce da solo una correzione che era costata una
sessione — e trova `unicredit-regular`, proprietario quindi non distribuibile. Porta **evidenza, non
decisioni**: il più frequente è il colore di **sistema** (link, stati, tab), non il marchio, e la
mappatura sui token semantici resta un giudizio di design.

### 29.4 Percorso verificato per le API immagine Adobe (Photoshop / Lightroom / Remove Background)

Le API **funzionano** dal progetto, ma non accettano file locali né URL qualsiasi. Percorso
verificato il 11 set: `asset_initialize_file_upload` → **PUT dei blocchi via curl dalla Bash** (il
documento MCP dice che l'assistente non può leggere file locali: **qui può**) →
`asset_finalize_file_upload` → `presignedAssetUrl` → strumento immagine → `curl -L` sull'`outputUrl`.
⚠️ **`raw.githubusercontent.com` non è in whitelist** (solo domini fidati), quindi un URL del repo
pubblico non basta. Le credenziali nel `.env` sono **tutte lo stesso client_id**: IMS autentica per
tutti e cinque i servizi. La **generazione** (text-to-image, generative fill) **non** è disponibile
via MCP — solo `image_generative_expand`; la generazione passa dalle API REST, che è come lavora la
pipeline. Limite ~20 file per batch.
**Scegliere le immagini che si vedono davvero**: su UniCredit 9 asset stock erano in uso ma 8 stanno
sotto scrim all'85-90% → l'unica che valeva era il ritratto persona. Registrare sempre il derivato in
`provenance.json` con `derivedFrom` + licenza dell'originale, e marcare la slide con `data-made-with`.

## 30. Aperture — Osservatorio email tracking (2026-09-08)

**App**: `apps/aperture-email` · live a `/experience-design-factory/aperture-email/` · **ricerca individuale**, non esperienza cliente. Scopo: deck pubblico da condividere con i clienti Adobe (FSI in primis) e su LinkedIn, che racconta come i brand si comportano su pixel di apertura, header di disiscrizione, centro preferenze e consenso, letti da una casella reale, nei mesi attorno alle Linee Guida del Garante (17 apr 2026, GU 29 apr, 6 mesi → 29 ott 2026) e alla raccomandazione CNIL (14 apr 2026).

**Dati**: pipeline Python fuori repo `~/Documents/progetti/garante_analysis/` (`analyze.py index|brandmap|enrich|analyze|publish`, `check_outputs.py`): mbox Takeout 8 GB → 27.273 msg → 11.339 email di brand / 554 mittenti (304 rivisti a mano = 96%). Finestra statistiche 2024-01 → 2026-09-07 (5.993 email, 104 brand ≥5). Numeri chiave nel deck: pixel 79,7% · one-click 79,8% · pref centre 26,2% · 1 sola email che dichiara il tracciamento (Juventus 3 ago 2026) · prima/dopo 17 apr: pixel 83%→84%, informative aggiornate 4→13, 30/43 brand invariati. Verdetti manuali in `garante_analysis/work/pattern_overrides.json`; fonti verbatim in `output/patterns_reference_IT.md` (anonimizzato, per conversazioni banking).

**Struttura** (admin `PAGE_REGISTRY`): index (cover · momento · percorso) · metodo (cover · dataset · pipeline · limiti) · numeri (cover · headline · paesi · settori · oneclick) · pattern (cover · p012 · p346 · p789 · quote) · prima-dopo (cover · confronto · brand · lettura) · banche (cover · tab1 · tab2 · tre) [gate `fsi`] · implicazioni (cover · decisioni · checklist · fonti · fonti-2 · invito) [gate `design`]. `SECTION_FLOW` nel BaseLayout gestisce prev/next saltando i capitoli spenti.

**Regole editoriali (vincolanti per gli aggiornamenti)**: (1) i documenti Garante/CNIL/EDPB si **citano** (titolo, data, numero, link) e **non si interpretano**; niente «compliant», «conforme», «Adobe si adatterà»; (2) nessun prodotto Adobe nominato (deck vendor-neutral; «lavoro in Adobe» solo come disclosure); (3) brand nominati per osservazioni verificabili; il credito al consumo italiano con tre piattaforme resta anonimo; (4) nessun dato personale del proprietario della casella (il checker `check_outputs.py` copre gli output della pipeline; per il deck verificare a mano).

**Skin**: `global.css` con classi `.ap-*` (panel/card/stat/row/table/badge/bar/quote) in rgba esplicito; `@media (max-width:1440px)` compatta le tabelle. Cover con griglia di pixel SVG (uno acceso in verde). Font Google: Space Grotesk 500–700 + Inter.

**QC**: build + `astro check` verdi; `audit:deck` 0 hard a 1920/1440/1280 (25 soft `a`/`i`: cover ariose, slide-tabella dense; non ridurre il type); screenshot 1920 letti (cover, momento, paesi, p012, quote, tab1, fonti, brand). Fix applicati: `<strong>` inline rimossi (falsi `e`), tabelle compattate ≤1440 (`k`), fonti splittate in 2 slide (`c`/`j`), `.ap-mark { align-self:center }`, `.ap-quote` larghezza.

**Prossimi passi**: aggiornamento dell'osservatorio dopo il **29 ott 2026** (rilanciare la pipeline sul nuovo Takeout e aggiornare numeri/prima-dopo); eventuale seed console (`experiences` registry) se serve l'Admin da Supabase; post LinkedIn IT/EN pronti in `garante_analysis/output/`.

---
## 31. «Il momento giusto» — Isybank (Intesa Sanpaolo) (2026-09-09)

**App**: `apps/isybank-momento` · live a `/experience-design-factory/isybank-momento/`. **Scopo**: incontro con **Antonio Valitutti** (AD Isybank, Direzione Isybank in Banca dei Territori) il **10 set 2026**. Memoria: `isybank-momento-valitutti`. Brief riservato **git-ignored** in `docs/Intesa Sanpaolo/` (`DOSSIER-Valitutti-Isybank-2026-09-10.md` + `data.xlsx` installato BdT + PDF LinkedIn): è l'**unico posto con dati contrattuali** (Analytics Ultimate ISP scade **30/09/2026**, Isybank ci sta sopra per fonte interna; AEM Sites/Assets/Forms ISP fino a fine 2028) — **mai nel build, mai in sala**.

### 31.1 Deck (IT only, 3 capitoli + cover) e dossier
`index` (cover «Il momento giusto», il vostro 2026 con 3 stat, percorso 3 card) · `domanda` (cover · «Avete molto in mano» 2 pannelli · 3 domande: primacy/tocco umano/misura) · `idee` (cover + **6 idee gated**: `onboarding` primi 90 giorni RTCDP+AJO · `gestore` che sa già Brand Concierge+AEP+AJO · `momento` (i 35 anni) Target+AJO decisioning · `premialita` isyToken AJO+RTCDP+CJA · `journey` CJA sopra il web analytics in uso · `contenuti` GenStudio+Firefly+AEM+Brand Visibility) · `rotta` (3 orizzonti O1 leggere/O2 rispondere/O3 scalare · 4 richieste senza firma · chiusura «Semplificare non è mai facile»). `admin` con 6 solutions su 3 pilastri (Relazione / Rilevanza / Misura & Contenuti). **`/dossier/`** war-room **gated come MIM** (contenuto in Supabase `restricted_docs` slug `isybank-valitutti`; login/RLS **o** secret-link `?t=<uuid>` via RPC `get_shared_doc`; **niente nel bundle**, verificato con grep su `dist`; PDF via print; renderer esteso timeline/stats/people/rows/ideas/table/say-dont/sources), noindex/orfana (15 sezioni: summary, mission, chi è + timeline, numeri, mappa persone, fatti con badge, Adobe nel perimetro *qualitativo*, 6 idee, matrice, proof point, say/don't, domande+caveat, run of show, 23 fonti). Design system **`.im-*`**: inchiostro `#101318` · blu `#1B99FB` · menta `#26E5AE` · arancio `#FF6200` (palette estratta dal logo isybank) · **Manrope + Inter**.

### 31.2 Fatti che guidano il pitch (verificati 9 set, 3 filoni deep-research)
~1,2 mln clienti (ISP 1H26), >3 mld giacenze, 75% under 35, 170k stipendi, C/I 28,6%, utile 2025 18,8 mln, **41 dipendenti** (IT/Filiale Digitale/back office dalla Capogruppo); Piano 2026-29: 2 mln clienti / 8 mld AF / 100 mln utile, Filiale Digitale 80% auto-risoluzione, «Agent-first», isywealth Europe. **Vincoli copy**: Garante Privacy 17,6 mln (12 mar 2026, migrazione Isybank) → mai «profilazione»; Valitutti scettico sull'AI nel proprio lavoro → mai AI-first; «non siamo challenger, siamo una human digital bank». **Chi decide sulle piattaforme**: Claudia Vassena (S&M Digital Retail BdT, consigliera Isybank, parla di GEO/GenAI) + Massimo Proverbio (C-DAITO); incumbent marketing retail ISP = SAS Marketing Automation (dato 2017). isybank.com gira su **AEM** (clientlib verificate) + Tealium. Frame vincente = «Isybank laboratorio del Gruppo»: pilota qui, scala su ISP.

### 31.3 Registrazioni & verifica
Registrata in `deploy.yml` (merge + verify), factory-hub, `scripts/deck-audit.ts` (ROUTE_SET 4 route + alias), root `dev:isybank` + `audit:deck:all`. **Seedata in console** (`0012_seed_isybank.sql`, applicata al DB remoto 9 set) + **dossier seedato out-of-band** (`docs/Intesa Sanpaolo/0012_seed_isybank_dossier.sql`, git-ignored; README tracciato `supabase/migrations/0012_isybank_dossier.README.md`; token letto con `select share_token from restricted_docs where slug='isybank-valitutti'`). **Regola resa BINDING dall'utente il 9 set: ogni dossier = pagina gated come MIM, mai inline** (memoria `dossier-as-internal-web-page`). `.gitignore`: `docs/Intesa Sanpaolo/`. `audit:deck` **0 HARD** a 1920/1440/1280 (16 soft `a`/`i`: cover ariose + slide dense a 1280, accettate senza restringere il type); screenshot letti a 1920 e 1280 (deck) + dossier a 1920; `noindex` confermato; grep dei pattern contrattuali sul `dist` = 0.

### 31.4 Pass «fonti + copy + Firefly» (2026-09-09, pomeriggio)
- **Fonti sempre citate**: ogni slide con un fatto ha la riga `Fonti:` linkata (cover Domanda → isybank.com 3 ago; Rotta cover → Piano di Impresa; **ogni idea** ha `fonti[]` nel data model; chiusura → link all'intervista). Verifica online delle fonti: 2 correzioni — l'**iF Design Award 2026** premia *l'intero ecosistema digitale* (UX Retail/Banking, Berlino 27 apr), NON «l'apertura del conto»; i nuovi clienti **480k→350k non stanno nella fonte citata** → sostituiti con i dati verificati «900 mila conti da nuovi clienti a fine 2025, +150 mila nel 1H26» (FY25 + 1H26). «Semplificare non è mai facile» = titolo verbatim dell'intervista isybank.com 11 giu 2026. Provvedimento Garante: pagina temporaneamente rimossa (opposizione pendente) → citato come «provv. 163 del 12 mar 2026», mai «sanzione» nel deck.
- **Copy**: home «Tre capitoli, da percorrere insieme» (era «un'ora scarsa»); slide Rotta «Cosa vi chiediamo» → **«Da costruire insieme · Come possiamo esservi utili da subito?»** con 4 domande aperte (primo journey / passaggio al gestore / dati già in uso / momento per rivedersi) + chiusa «nessuna firma, nessuna piattaforma nuova»; de-AI su cover e Domanda; «clienti più giovani del mercato» → «tre su quattro sotto i 35»; badge «in casa → estensione» → «estende l'esistente»; fix bug righe `.im-row` centrate (regola `.slide-inner.text-center p`).
- **Firefly**: `backdrops.manifest.ts` (17 slot, palette inchiostro/blu/menta/arancio, 3 famiglie ink/soft/warm, uno sfondo distinto per slide; ink-1 e warm-2 scartati perché troppo luminosi dietro il testo) → `src/assets/generated/bg/` (committati, 4 MB); `video.manifest.ts` → 2 clip 5 s 1080p (`momento-cover`, `momento-close`) sul **GitHub Release `media`**, poster in `public/media/`; **lo still di fallback delle slide video è il poster del clip** (scuro), non l'immagine hero. CSS: `.im-bg*` con layer `--bg-src` sotto scrim rgba (0.70→0.84 + vignetta centrale), `.im-video`, `.im-firefly` (credit esplicito su cover e chiusura + label nav «Visual · Adobe Firefly»). `.gitignore`: `.env_*` e `apps/*/public/media/*.mp4`.
- Verifica: build ok, `audit:deck` **0 HARD** / 23 soft (`a` sulle idee a 1440/1280 per la riga fonti in più e `i` sulle cover: accettate, type invariato), **tutte le 17 slide lette a 1920** (+ 2 a 1280). Nota: Chromium di Playwright non decodifica H.264 → nello screenshot resta lo still/poster; in Chrome il clip gira. Fix successivo `cea02f9`: i poster erano serviti con slash finale (404) → path senza `href()`, live verificato 200.

### 31.5 Deck PowerPoint per l'incontro (2026-09-09, sera) — fuori repo, in `docs/Intesa Sanpaolo/output/` (git-ignored)
Richiesta dell'utente: un PPTX **su template Adobe** per la riunione con Valitutti (vista outside-in su Isybank, domande aperte, posizionamento Adobe FSI dal `FSI CXO POV 2026.pptx`, referenze; **TSB e BBVA** le più interessanti per lui). Tre iterazioni, tutte riproducibili dagli script in `output/build/`:
- **v1 `isybank_valitutti_adobe_references.pptx`** (10 slide + 4 appendice, 4,95 MB): generata con **python-pptx** sul master «2_Adobe Template 2026» estratto dal POV svuotato (`adobe_template_2026_empty.pptx`, 4,9 MB). Corredo: `dossier_extract.md` (17 pagine trascritte — il PDF del dossier è una stampa web **senza layer testuale**; mappa pagine: da p.12 il contenuto slitta di una pagina), `dossier_insights.json`, `reference_matrix.json`, `source_registry.json` (D0, S1–S9, P1–P7), `claim_audit.md` (39 claim), `speaker_notes.md`, `qa_report.md`.
- **v2 `20260910_Adobe_x_Isybank_Momento_v2.pptx`**: l'utente ha portato una **sua bozza** (`20260910_Adobe_x_Isybank_Momento.pptx`, 76 MB: cover POV + slide 2 mia + 6 slide POV + template referenze + le mie in appendice) e chiesto modifiche puntuali. Applicate con `mod_deck.py`: cover con **clip Firefly** (5 s, ritagliato verticale, `add_movie` con poster) e titolo IT; slide 2 **senza alcun riferimento al dossier** (regola dell'utente: *Isybank non deve sapere che esiste un dossier* → leak-check automatico su slide/tabelle/note); POV tradotto (titoli) con box «PER ISYBANK»; **TSB e BBVA nel template POV** (4 card + pannello rosso «Il risultato»); slide referenze restanti; appendice ripulita.
- **v3 `20260910_Adobe_x_Isybank_Momento_v3.pptx`** (21 slide, 90 MB, PDF + PNG in `v3_render/`, `speaker_notes_v3.md`): feedback utente → cover con **immagine** Firefly (video «bassa risoluzione, poco valore»); slide 2 con numeri a 34 pt e **senza** «ogni idea deve togliere un passaggio…» né «da correggere insieme» (bocciati); **slide 6-7-8 rifatte da zero** in italiano nello scenario Isybank (assistente AI + isyPrime gratis u35 · persona illustrativa «Giulia» e accredito stipendio · promo del mese su isybank.com/AEM) con **12 immagini Firefly** (`gen_firefly2.mts`, 1792×2304) e «bubble» UI in stile Isybank; divisorio «Le principali referenze nel financial services in Europa» prima di TSB; loghi **U.S. Bancorp / J.P. Morgan** (Wikimedia, `output/logos/`). KPI dei pannelli rossi = quelli del POV (LLM Optimizer interno +200%, U.S. Bank +127%, J.P. Morgan AM -70%).
- **Decisioni/regole emerse**: BBVA = concorrente diretto in Italia (800k→1 mln clienti, ritmo 200-250k/anno) + cliente Adobe di Gruppo (AEM/Target/Analytics, 1.000+ test A/B) → taglio «disciplina dei dati», mai attribuire a BBVA Italia i risultati del Gruppo; **TSB solo con il set KPI della storia pubblica** (+300% prestiti mobile, 24→75% in app, 3.000 addebiti/settimana), mai la slide interna Retail Banking POV (7,5 mln / 2,5x / «125% reduction» refuso); Crédit Agricole Italia = concorrente, solo appendice; Banco Inter anonimo; POV usato **senza** la parte AI-first (Coworker/agenti). `business.adobe.com` **non raggiungibile dal sandbox** (timeout): numeri BBVA da ricontrollare sulla pagina.
- **Gotcha tecnici**: `s.shapes.title` restituisce un proxy nuovo a ogni accesso → confrontare `shape_id`, non `is`; `set_paras` copia il rPr del primo run → per run con dimensioni diverse usare `set_run_texts`; notes placeholder assente nel template → iniettare `<p:sp>` body; LibreOffice risolve Adobe Clean Black a intermittenza (font installato in `~/Library/Application Support/Adobe/.User Owned Fonts`); Firefly **429** oltre ~10 immagini consecutive → rigenerare singolarmente; `SendUserFile` limite 30 MB (i PPTX v2/v3 restano solo su disco).

---

---
## 36. Trenitalia «Connessioni Intelligenti» — la riscrittura del 9 ottobre 2026

Richiesta dell'owner, in sei punti: design system di trenitalia.com al 100%, ottimizzazione per
schermi da muro, sfondi su ogni slide con clip in loop su copertina e chiusura, largo uso di
elementi grafici, `/panel-review` con **Gianluca Palmieri** come stakeholder principale, e
umanizzazione completa della copy. Poi, a lavoro in corso: analizzare e correggere le incoerenze
fra slide. Commit da `cc5e222` ad `a81579e`. Deck a **72 slide** su 13 rotte.

### 36.1 Il design system, letto e non ricordato
`pnpm brand:tokens https://www.trenitalia.com` (831 KB di CSS, riletti il 9 ott). Il sito **nomina**
i propri colori, quindi non c'è nulla da interpretare: `.color-primary-blu` **#2f394e** (285
occorrenze, il colore di SISTEMA), hover `#606c87` (96) e `#444d60` (9), `.color-red` **#d91835**
(34, hover `.cta-primary-red` **#b51039**), `.color-primary-green` **#006666** (9), `.color-grey-600`
#6C6C6C; neutri #ffffff 240 · #f1f3f4 26 · #f8f9fa 17 · #4e5054 41 · #adb5bd 4; **Poppins** dichiarato
26 volte (più `fs-icon`, che è il loro font di icone).

**Due errori che la tabella corregge**, entrambi presenti fino al 9 ott: il rosso del deck era
**#E2001A** — che è il corporate del Gruppo FS, non quello del sito — e l'**ambra #F5A623 non esiste
in nessuna fonte FS**, era inventata. Il carattere era Space Grotesk; **Poppins è distribuibile**,
quindi per una volta non serve una sostituta.

**Due estensioni dichiarate**, perché il sito non ha un tema scuro e il deck è a dominante scura:
il fondo **#1b2230** è lo stesso #2f394e abbassato di luminosità (già usato dal dossier della stessa
app), e per il TESTO si usano le schiariture **#ff8d9d** (7,2:1) e **#4fbdb4** (7,0:1) — i pieni
danno 3,14:1 e 2,35:1, cioè **non sono inchiostri**. ⚠️ Scelta dell'owner, presa in chat: dominanza
scura costruita sul primary-blu del cliente, e per il ramo FS Park il **verde del sito** al posto
dell'ambra inventata, così entrambi i segnali vengono dal CSS letto.

Il segnale non è scritto nelle regole: passa da `--sig-rgb`, che il ramo ribalta. Rotaia = rosso
schiarito, asfalto = verde schiarito; i pieni stanno in `--accent-*` e servono solo da fondo.
⚠️ Un nodo che porta la «P» di FS Park o la «T» di Trenitalia **nomina una società**: il suo colore
non può dipendere dal ramo da cui si guarda — da qui `.fs-node--park` e `.fs-node--rail`, fissi.

### 36.2 Sfondi, clip e il difetto che li rendeva inutili
**20 immagini Firefly** (`backdrops.manifest.ts`) su tutte e 72 le slide, più due clip in loop su
copertina e sulle due chiusure. **Il primo giro è stato buttato**: chiedeva «linee di luce», «rete»,
«nodi» e metteva gli esadecimali nel prompt, ed è tornato neon ciano (i codici colore il modello li
ignora), arancio nonostante stesse nel negative, e la stessa prospettiva a punto di fuga in cinque
immagini su ventidue. Rifatto con `contentClass: 'photo'` — la leva singola che sposta di più —
parole di colore al posto dei codici, e tutto l'armamentario neon/sci-fi/data-viz/punto-di-fuga nel
negative. ⚠️ Nessun mezzo, mai: un treno generato arriva con una livrea che non è quella del cliente.

**Il difetto che contava di più**: gli sfondi c'erano già prima, ma a `opacity-12` sotto un velo al
90% — cioè annullati. Il componente `Sfondo.astro` porta l'immagine al 45-75% sotto uno scrim
**radiale** (denso al centro dove sta il testo, leggero ai bordi), con tre forze scelte dalla densità
di testo della slide. `SfondoLoop.astro` monta le clip dal Release `media`.

Le clip Firefly sono uscite **indaco saturo**: graduate verso l'ardesia con ffmpeg
(`hue=s=0.40,colorbalance=rm=0.06:bm=-0.08,eq=gamma=1.06:saturation=0.92`) e ricucite con
`loop:seamless` (PASS; la chiusura ha richiesto `--fade 1.2`).

### 36.3 Grafica: una libreria, non disegni per slide
`src/components/diagrammi/`: **DiagFlusso** (fonti → layer → percorso leggibile), **DiagSoglia**
(prima/dopo la soglia, con la freccia che torna a riattaccare il prima), **DiagStrati** (gli strati
della piattaforma, con quello che si propone in evidenza), **DiagFasi** (le fasi sull'asse del
tempo, ognuna una scheda), **DiagIncrocio** (due insiemi che condividono solo l'intersezione).
Tredici diagrammi collocati nelle slide dove il concetto era solo scritto. Ognuno ha la sua variante
per **fondo chiaro** in `global.css`.

### 36.4 Schermo da muro
`wallScale` acceso su tutte e 13 le pagine **dopo** un giro `--tv` a 0 HARD, come prescrive la
regola. Il check `i` (uso dello spazio) scende da 99 a 31, e **94 di quei 99 stavano a 2560 e 3840**:
senza wallScale, sopra i 1600px il tipo smetteva di crescere.

### 36.5 Il contorno che spariva — e un difetto del MOTORE
Su `/scenario/` la firma co-brand era **bianca su #f8f9fa**. Causa: `DARK_CLASSES` in
`packages/core/src/blocks/immersive/deck.ts` tiene per scura la classe `bg-[var(--surface-inverse)]`,
vero nelle experience a dominante **chiara** e falso in quelle a dominante **scura**, dove
`--surface-inverse` è il bianco. ⚠️ **Il difetto è del motore e tocca Agos, Eni, Isybank e questa**:
qui è stato aggirato marcando le slide chiare con `data-dark="false"` dal BaseLayout (l'uscita di
sicurezza prevista dal motore). **Voce di backlog P1**, non corretta nel core per non rimettere in
gioco nove deck con una riga.

### 36.6 Incoerenze fra slide, cercate e chiuse
Il grosso non si vede slide per slide: si vede solo confrontandole.
- **Nome di prodotto sbagliato**: la clean room era «Adobe Data Collaboration». Verificato su
  Experience League il 9 ott — il prodotto è **Adobe Real-Time CDP Collaboration** (docs aggiornate
  al 23 set 2026, Limited Availability, disponibile in EMEA); «data collaboration» è la categoria.
  20 occorrenze corrette, sigle RTCDP/RT-CDP ricondotte a «Real-Time CDP».
- **Lo stesso componente rendeva in due modi**: gli aggiustamenti dei diagrammi erano finiti in
  `<style is:global>` dentro le pagine di un ramo solo. Portati nei componenti.
- **Copertine di capitolo con cinque formati di occhiello**; due su dieci erano chiare **con
  inchiostro chiaro sopra** (titolo bianco su bianco). Tutte e dieci scure, formato unico.
- **«L'opportunità» aveva due trattamenti** (chiara nel tronco, scura in FS Park perché lì c'era un
  diagramma): aggiunta la variante chiara alla libreria.
- **Le «4 aree di valore» non erano le 4 direttrici** della slide precedente; **il ramo FS Park non
  nominava mai la foundation Salesforce di Gruppo**, a cui l'altro ramo dedica una slide intera e
  che comprende FS Park per nome. Due fotografie diverse della stessa azienda a due tavoli.
- **Un capitolo, due nomi** («La metà che manca» / «La metà invisibile»); la nav numerava anche il
  tronco, dando due «01» nello stesso documento; due levette della console (`mix-modeler`, `ajo`)
  non spegnevano più niente.

### 36.7 Panel review — due giri, 9 ottobre 2026
Personas: `docs/Ferrovie/PANEL-PERSONAS.md` (git-ignorato) — **Gianluca Palmieri** (il digitale di
Trenitalia, stakeholder principale e contatto Adobe esistente), **Giuseppe Raffaniello** (Customer
Operations: il percorso d'acquisto è suo dal set 2025), **Mario Alovisi** (Marketing e Revenue
Management), **Domenico Scida** (CTIDO di Gruppo da lug 2026), più due **seat** senza nome pubblico
(il Digital Business Partner Trasporto di FSTechnology e il presidio digitale di FS Park).
⚠️ Due ritratti sono di ruolo, non di persona: il verdetto lo dichiara.

| asse | giro 1 | giro 2 |
|---|---|---|
| credibilità dei fatti | 2,17 | **4,00** |
| rilevanza per me | 2,33 | **3,50** |
| chiarezza | 3,17 | **4,00** |
| rischio (5 = nessuno) | 2,00 | **3,50** |
| azionabilità | 2,33 | **3,67** |

Giro 1: 53 claim verificati (24 confermati, **20 refutati**), 38 P0, sei «accetto condizionato» su
sei. Giro 2: 61 claim (34 confermati, 12 refutati), 28 P0 di cui 23 sopravvissute o nuove.
Verdetti in `docs/Ferrovie/PANEL-VERDICT-2026-10-09-round{1,2}.md`, JSON grezzi in
`docs/Ferrovie/panel/2026-10-09-round{1,2}/` (tutto git-ignorato).

⚠️ **Il verdetto del giro 2 fotografa lo stato PRIMA delle correzioni del giro 2** (`a81579e`): è
la fine normale del ciclo a due giri, non un buco. Quello che quelle correzioni non hanno chiuso è
nel backlog come punto aperto per un umano, non per un terzo giro.

**Le correzioni che valgono il giro.** Fuori l'**incidente di sicurezza del cliente** usato due volte
come leva di vendita, con la data sbagliata e l'etichetta «illustrativo» su un fatto reale che li
riguarda — cinque personas su sei si fermavano lì. Fuori «**100% GDPR-compliant**» (nessun prodotto
rende conforme un'organizzazione) e «**da sei perimetri a uno solo**», che si smontava da solo contro
«non si sostituisce niente». Il **fornitore email** genericizzato, perché non ha conferma pubblica e
l'unica prova era una casella personale. **Davide** reso coerente (era abbonato *e* acquirente a ogni
viaggio). La **slide del POC** scritta per il ramo Trenitalia, dove non esisteva. I **«KPI target»**
(«meno blind spot») sostituiti da misure del cliente con baseline da rilevare. La **Fase 3** svuotata
di prodotti e cifre media. Il **varco** aggiunto fra le fonti di FS Park.

⚠️ **Il pacchetto di evidenza mentiva, e un giro è stato buttato per questo.** Lo script di cattura
aspettava 260 ms dopo il cambio slide contro ~1,2 s di dissolvenza: fotografava le slide a metà, e
nel giro 1 **tre personas hanno scritto «questa slide arriva vuota» su slide che si vedono
benissimo**. Il giro 2 è stato fermato e rilanciato su un pacchetto onesto. Lezione generale: un
pacchetto di evidenza che mente costa un giro intero di panel.

### 36.8 Verifica
`pnpm --filter trenitalia-connessioni audit:deck -- --tv` contro la preview statica: **13 rotte × 5
viewport (1280→3840), 373 controlli, 0 HARD**. Soft residui: `a` 199, `i` 33, `g` 12 — in gran parte
strutturali delle composizioni centrate con titolo in alto, e il contratto vieta di farli passare
rimpicciolendo il tipo. `astro check` 0 errori. Build dell'intero monorepo verde.

### 36.9 Il perimetro si stringe a due fonti — 9 ottobre, sera (`c4e14f0`)
La riunione del 9 ottobre ha **ridotto la proposta**, e il deck l'ha seguita. Le fonti sono due:
l'**Adobe Analytics di trenitalia.com** e il **CRM**, uniti da chi fa login. Le Frecce, la
piattaforma di invio, il checkout e FS Park diventano **orizzonte dichiarato invece di promessa** —
che è la forma onesta di dire «ci si arriva» senza venderlo adesso.

- **Il percorso di default è lineare**: copertina, scenario, quattro capitoli. Il ramo FS Park, il
  bivio e il capitolo sulla clean room **restano nel repo e raggiungibili**, ma fuori dal flusso.
- **`src/data/percorso.ts` è la fonte unica** da cui leggono barra di navigazione, card della home e
  frecce di ogni pagina: riaccendere un ramo è **una riga**, e non ci sono tre posti dove ricordarsi
  di farlo. È la stessa regola applicata a Intesa con `contenuti.ts` lo stesso giorno.
- **Nel merito**: l'accusa ai sistemi del Gruppo diventa **una domanda**, come chiesto in riunione;
  esce la slide del varco e il suo diagramma della soglia viene riusato per il prerequisito vero, il
  **login**; gli use case sono quelli nati al tavolo, con il **limite dell'attivazione dichiarato**.
  Tre slide nuove in Convergenza: dove finisce il dato del CRM, le tre domande con cosa si fa della
  risposta, e **CX Enterprise Coworker** sulla ricerca delle cause in linguaggio naturale.
- ⚠️ **Una cosa detta a voce in riunione era sbagliata ed è corretta qui**: lo **zero-copy**. Per CJA
  il dato **entra**; quello che si governa è *quanto*. Correggere nel deck una frase detta al tavolo
  è il modo meno costoso di non farsela contestare dopo.
- Verifica: build pulita, `astro check` a zero, **0 HARD su 222 slide-viewport** comprese le rotte
  fuori percorso, quattro slide lette a 1920.
- ⚠️ **Il panel di §36.7 copre il deck PRIMA di questa riscrittura** — ed era proprio sul perimetro
  che aveva chiesto i tagli più pesanti. È il **P0 nuovo** di §10, da chiudere prima del TTG
  (14-16 ott).

