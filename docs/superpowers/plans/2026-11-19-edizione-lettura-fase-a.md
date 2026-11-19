# Edizione da distribuire — fase A · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Una seconda build dello stesso deck Intesa, «da leggere», pensata per chi apre il link senza relatore: niente pagine di chi presenta, sotto-passi che si aprono da soli, Giulia sempre a colonne, primo livello dedicato al telefono, «Parliamone» al posto de «I prossimi passi». Nessuna misura: solo un contatore delle aperture per giorno, senza consenso perché non registra niente su chi apre (spec, «Revisione del 19 nov sera»).

**Architecture:** Un flag di build `PUBLIC_EDF_EDIZIONE=lettura` letto dal motore (`packages/core`). Lo stesso sorgente produce `dist/` (sala, invariata) e `dist-lettura/` (base `/experience-design-factory/intesa-storia/`). Un'integrazione Astro del motore toglie dalla build lettura le rotte di chi presenta; un attributo `data-edizione` su `<html>` guida il CSS e il Deck.

**Tech Stack:** Astro 6 statico, TypeScript strict, vitest (in `packages/core`), Playwright (screenshot e audit), GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-11-19-edizione-lettura-design.md` (fase A = versione «A · Da leggere»).

## Global Constraints

- La build **sala** resta identica: stesse rotte, stesso HTML a meno dell'attributo `data-edizione="sala"` su `<html>`.
- La build **lettura** non emette: `relatore`, `presentatore`, `admin`, `analytics`, `circolo`, `risultati-old`, `dieci-minuti`, `prossimi-passi`. La build **sala** non emette `parliamone` né `breve`.
- Lettura: **una sola richiesta** verso `*.supabase.co`, l'inserimento del contatore (Task 9), e nessun `DeckTelemetry` montato; il seme `?cfg=` di `BaseLayout.astro:202` è spento in lettura.
- Lettura esce **solo in italiano** (il selettore di lingua resta nascosto, `lang="it"`).
- Repo pubblico: i numeri WhatsApp e le email dei tre Adobe sono stati autorizzati dall'owner e stanno **solo** in `apps/intesa-esperienza-cliente/src/data/contatti.ts`. Nessun nome di persona del cliente in file tracciati.
- Copia: voce umana (`CLAUDE.md` «Copy voice»), voce dell'organizzazione, mai la seconda singolare; niente colori o spaziature fissi (token); il tipo non si rimpicciolisce per far entrare un testo.
- Ruolo dell'owner nelle schede contatto: **«Product Sales Specialist»** (senza «Data»). Gli altri due come in `adobe.astro:78-79`.
- WhatsApp **solo** per l'owner e per l'Account Executive; email per tutti e tre.
- Nessun impegno di tempi di risposta in nessun testo.
- `.github/workflows/deploy.yml` ha **modifiche locali di un altro workstream**: si committa solo il proprio blocco (vedi Task 7), mai `git add -A`.

## Review Focus

1. **Link profondo aperto dal telefono** (es. `/intesa-storia/momenti/` inoltrato via WhatsApp) — deve portare al primo livello, non a una slide rotta. → test in Task 5.
2. **«Apri comunque» sul telefono** — chi lo sceglie non deve tornare indietro a ogni pagina (la scelta vale per la sessione). → test in Task 5.
3. **Telefono in orizzontale / tablet** (844×390, 820×1180) — tablet entra nel deck; telefono orizzontale resta sul primo livello. → test in Task 5.
4. **Navigazione a ritroso con sotto-passi automatici** — tornando a una slide già vista i passi si riaprono, e la freccia indietro non resta «bloccata» a richiudere passo per passo. → test in Task 2.
5. **Rotte escluse raggiungibili per indirizzo** (`/intesa-storia/relatore/`) — 404 sul sito pubblicato, non una pagina vuota. → test in Task 3 e verifica in Task 8.

---

### Task 1: Il flag d'edizione nel motore

**Files:**
- Create: `packages/core/src/utils/edizione.ts`
- Test: `packages/core/src/utils/edizione.test.ts`
- Modify: `apps/intesa-esperienza-cliente/src/layouts/BaseLayout.astro` (attributo su `<html>`)

**Interfaces:**
- Produces: `type Edizione = 'sala' | 'lettura'`; `parseEdizione(raw: string | undefined): Edizione`; `EDIZIONE: Edizione` (costante letta da `import.meta.env.PUBLIC_EDF_EDIZIONE`); `inLettura(): boolean`.

- [ ] **Step 1: Test** — `parseEdizione(undefined) === 'sala'`, `parseEdizione('') === 'sala'`, `parseEdizione('lettura') === 'lettura'`, `parseEdizione('LETTURA ') === 'lettura'`, `parseEdizione('qualunque') === 'sala'` (fail-safe: un valore sbagliato non toglie mai le pagine di chi presenta alla sala… e non le rimette in lettura: vedi Task 3, che usa lo stesso parser).
- [ ] **Step 2:** `pnpm --filter @agargiulo-adbe/experience-core test -- edizione` → FAIL.
- [ ] **Step 3:** Implementa in `edizione.ts`.
- [ ] **Step 4:** Test → PASS.
- [ ] **Step 5:** In `BaseLayout.astro` metti `data-edizione={EDIZIONE}` sull'`<html>`; in lettura forza `lang="it"` e nascondi il selettore di lingua (lo stesso meccanismo con cui oggi si sceglie la lingua: se `inLettura()`, non renderizzarlo).
- [ ] **Step 6:** `pnpm --filter intesa-esperienza-cliente build` → ok; `grep -c 'data-edizione="sala"' apps/intesa-esperienza-cliente/dist/index.html` → 1.
- [ ] **Step 7: Commit** `feat(core): il flag d'edizione sala/lettura`.

### Task 2: I sotto-passi si aprono da soli in lettura

**Files:**
- Modify: `packages/core/src/blocks/immersive/deck.ts` (`prepare`, il punto in cui la slide diventa attiva, `prev`)
- Create: `packages/core/src/blocks/immersive/autoreveal.ts`
- Test: `packages/core/src/blocks/immersive/autoreveal.test.ts`

**Interfaces:**
- Produces: `pianoRivelazione(n: number, ridotto: boolean, passoMs = 450): number[]` — i ritardi in ms a cui aprire ciascuno degli `n` sotto-passi (`ridotto` → tutti `0`).
- Consumes: `inLettura()` (Task 1), letto dal DOM come `document.documentElement.dataset.edizione === 'lettura'` (il Deck gira nel browser).

- [ ] **Step 1: Test** — `pianoRivelazione(0,false)` → `[]`; `pianoRivelazione(3,false)` → `[450,900,1350]`; `pianoRivelazione(3,true)` → `[0,0,0]`; `pianoRivelazione(2,false,300)` → `[300,600]`.
- [ ] **Step 2:** test → FAIL. **Step 3:** implementa. **Step 4:** test → PASS.
- [ ] **Step 5:** Nel Deck, quando una slide diventa attiva e l'edizione è `lettura`, apri i sotto-passi secondo `pianoRivelazione` (timer annullati se la slide cambia prima). In lettura `prev()` va **alla slide precedente** senza richiudere i passi, e la freccia avanti non consuma sotto-passi (sono già aperti o si stanno aprendo: `revealSubstep` resta per la sala). Con `prefers-reduced-motion` tutto aperto subito.
- [ ] **Step 6: Verifica (Review Focus 4)** — script Playwright in `scripts/edizione-check.ts` (creato qui, esteso nei task successivi), funzione `checkAutoreveal(url)`: su `momenti/#slide-m-03` dopo 3 s tutti i `[data-substep]` hanno `data-substep-active`; `ArrowLeft` → indice scende di 1; `ArrowRight` → indice torna, passi di nuovo tutti aperti entro 3 s. Lanciato contro una preview della build lettura (Task 3) e contro la sala: in sala dopo 3 s **nessun** passo aperto.
- [ ] **Step 7: Commit** `feat(core): in lettura i sotto-passi si aprono da soli`.

### Task 3: Due build, e le rotte di chi presenta fuori dalla lettura

**Files:**
- Create: `packages/core/src/integrations/edizione.ts`
- Test: `packages/core/src/integrations/edizione.test.ts`
- Modify: `apps/intesa-esperienza-cliente/astro.config.mjs`, `apps/intesa-esperienza-cliente/package.json`

**Interfaces:**
- Produces: `rotteDaTogliere(edizione: Edizione, cfg: { soloSala: string[]; soloLettura: string[] }): string[]`; `edizioneIntegration(cfg): AstroIntegration` che in `astro:build:done` rimuove le cartelle `dir/<rotta>/` restituite da `rotteDaTogliere`.
- Consumes: `parseEdizione` (Task 1).

- [ ] **Step 1: Test** — con `soloSala=['relatore','prossimi-passi']`, `soloLettura=['parliamone','breve']`: `rotteDaTogliere('sala',cfg)` → `['parliamone','breve']`; `rotteDaTogliere('lettura',cfg)` → `['relatore','prossimi-passi']`; una rotta vuota o con `/` o `..` → `throw` (l'integrazione cancella cartelle: niente percorsi fuori da `dist`).
- [ ] **Step 2–4:** FAIL → implementa → PASS.
- [ ] **Step 5:** `astro.config.mjs`: se lettura, `base: '/experience-design-factory/intesa-storia'`, `outDir: './dist-lettura'`; aggiungi l'integrazione con `soloSala: ['relatore','presentatore','admin','analytics','circolo','risultati-old','dieci-minuti','prossimi-passi']`, `soloLettura: ['parliamone','breve']`. `package.json`: `"build:lettura": "PUBLIC_EDF_EDIZIONE=lettura astro build"`, `"preview:lettura": "PUBLIC_EDF_EDIZIONE=lettura astro preview"`. Aggiungi `dist-lettura` a `.gitignore` dell'app se c'è, altrimenti a quello di root accanto a `dist`.
- [ ] **Step 6: Verifica (Review Focus 5)** — `pnpm --filter intesa-esperienza-cliente build && pnpm --filter intesa-esperienza-cliente build:lettura`; `ls dist-lettura` non contiene nessuna delle otto rotte; `ls dist` le contiene tutte e **non** contiene `parliamone`/`breve`; `diff -rq` fra il `dist` di prima del piano (salvato a inizio Task 1 in scratchpad) e il nuovo `dist`: differenze solo nell'attributo `data-edizione` e negli hash degli asset.
- [ ] **Step 7: Commit** `feat(core): build d'edizione, la lettura non emette le pagine di chi presenta`.

### Task 4: Capitoli, copertina e «Parliamone»

**Files:**
- Modify: `apps/intesa-esperienza-cliente/src/data/chapters.ts`, `src/pages/index.astro`, `src/components/Navigation.astro`
- Create: `apps/intesa-esperienza-cliente/src/data/contatti.ts`, `src/pages/parliamone.astro`, `packages/core/src/utils/contatti.ts`, `packages/core/src/utils/contatti.test.ts`

**Interfaces:**
- Produces: `capitoli(ed: Edizione): Chapter[]` e `vociNav(ed: Edizione)` (in lettura l'ultima voce è `{ n:'06', it:'Parliamone', slug:'parliamone' }` al posto di `prossimi-passi`; `CHAPTERS`/`VOCI_NAV` restano esportati = versione sala); `linkWhatsApp(numero: string, testo: string): string`; `interface Contatto { nome: string; ruolo: string; email: string; whatsapp?: string; foto: ImageMetadata }`; `CONTATTI: Contatto[]`.

- [ ] **Step 1: Test** `linkWhatsApp('+39 348 9696067','Buongiorno, ho una domanda')` → `'https://wa.me/393489696067?text=Buongiorno%2C%20ho%20una%20domanda'`; numero con lettere → `throw`.
- [ ] **Step 2–4:** FAIL → implementa in `packages/core/src/utils/contatti.ts` → PASS.
- [ ] **Step 5:** `contatti.ts` dell'app, in quest'ordine: Alex Gordiani · Head of FSI · agordiani@adobe.com · (nessun WhatsApp); Francesca Ellena · Account Executive FSI · fellena@adobe.com · +39 349 9385457; Antonio Gargiulo · Product Sales Specialist · agargiulo@adobe.com · +39 348 9696067. Foto: le stesse di `adobe.astro:58-60`.
- [ ] **Step 6:** Sostituisci gli usi di `CHAPTERS`/`VOCI_NAV` in nav, `prevSlug/nextSlug` e copertina con `capitoli(EDIZIONE)`/`vociNav(EDIZIONE)`.
- [ ] **Step 7: Copertina in lettura** — tolto l'occhiello «Incontro del 19 novembre 2026»; l'intestazione dell'indice diventa **«Da dove volete partire»**; l'indice è quello dei capitoli lettura (tutte voci cliccabili). Titolo, sottotitolo, riga del tipo, clip: invariati. In sala nulla cambia.
- [ ] **Step 8: `parliamone.astro`** — una copertina di capitolo («Capitolo 06 · Parliamone», stessa composizione di `prossimi-passi` slide 1) e una slide con: titolo **«Ne parliamo con chi lavora su questo»**, lead **«Una domanda su un momento di Giulia, su un prodotto, su come si innesta nei vostri sistemi: scriveteci, anche solo una riga.»**, tre schede (foto, nome, ruolo, «Scrivi una email» `mailto:` con oggetto `Adobe × Intesa Sanpaolo · una domanda`, e dove c'è «WhatsApp» con `linkWhatsApp(numero, 'Buongiorno, ho letto la storia Adobe × Intesa Sanpaolo e ho una domanda.')`). Lockup co-brand `hero` sull'ultima slide del percorso (regola del motore: la prima e l'ultima). Componi con i blocchi esistenti (`pnpm deck:catalogo` prima di scrivere).
- [ ] **Step 9: Verifica** — build lettura; `checkParliamone(url)` in `scripts/edizione-check.ts`: 3 `mailto:` corretti, 2 link `wa.me` e solo per i due numeri; nessun `wa.me` nella build sala. `audit:wrap` su `parliamone`: PULITO.
- [ ] **Step 10: Commit** `feat(intesa-esperienza-cliente): in lettura la copertina senza agenda e Parliamone al posto dei prossimi passi`.

### Task 5: Il primo livello sul telefono

**Files:**
- Create: `packages/core/src/blocks/immersive/RinvioTelefono.astro`, `packages/core/src/utils/telefono.ts`, `packages/core/src/utils/telefono.test.ts`, `apps/intesa-esperienza-cliente/src/pages/breve.astro`
- Modify: `apps/intesa-esperienza-cliente/src/layouts/BaseLayout.astro` (monta `RinvioTelefono` solo in lettura e mai sulla pagina `breve`)

**Interfaces:**
- Produces: `deveRinviare(p: { larghezza: number; altezza: number; coarse: boolean; apriComunque: boolean }): boolean` — `true` se `!apriComunque && coarse && Math.min(larghezza, altezza) < 600`. `RinvioTelefono.astro` (props `destinazione: string`) esegue in `<head>`, prima del rendering, `location.replace(destinazione)` se `deveRinviare`; legge `sessionStorage['edf:apri-comunque']` in `try/catch`.
- Consumes: `CONTATTI`, `linkWhatsApp` (Task 4); `MOMENTI` (`src/data/momenti.ts`: per ogni momento `n`, `short`, `cliente`, `interno`); miniature `public/miniature/momenti--slide-m-0N.jpg`.

- [ ] **Step 1: Test** — 390×844 coarse → true; 844×390 coarse → true (Review Focus 3); 820×1180 coarse → false; 1512×860 non coarse → false; 390×844 coarse con `apriComunque` → false (Review Focus 2).
- [ ] **Step 2–4:** FAIL → implementa → PASS.
- [ ] **Step 5: Le miniature** — apri le sette `momenti--slide-m-0N.jpg` a piena dimensione: se mostrano la slide con i passi chiusi (campo verde vuoto), rigenerale con i passi aperti (stesso script che le ha prodotte, cercalo con `grep -rn "miniature" apps/intesa-esperienza-cliente/src/pages/presentatore.astro scripts/`; se non c'è uno script, cattura con Playwright dalla build lettura a 1512×860 dopo l'apertura automatica) in `public/miniature/lettura/`.
- [ ] **Step 6: `breve.astro`** — pagina che si scorre, **non** un `DeckContainer`; stessi token, caratteri, fondo. In ordine: co-brand; titolo e sottotitolo della storia (da `TITOLO_INCONTRO`); per ciascuno dei sette momenti una scheda con numero, miniatura, la riga di Giulia e la riga della banca (dai campi esistenti, nessuna copia nuova); le tre schede di `CONTATTI` (email + WhatsApp dove c'è); un blocco **«La storia completa si legge meglio su un computer»** con due azioni: **«Mandatemela per email»** (`mailto:?subject=Adobe%20×%20Intesa%20Sanpaolo&body=<URL della copertina lettura>`) e **«Apri comunque qui»** (scrive `edf:apri-comunque=1` in `sessionStorage` e va alla copertina). Corpo ≥ 16px, bersagli ≥ 44px.
- [ ] **Step 7: Verifica (Review Focus 1–3)** — `checkTelefono(url)` in `scripts/edizione-check.ts`, contesto `isMobile:true, hasTouch:true`: aprendo `/intesa-storia/momenti/` a 390×844 l'URL finale è `/intesa-storia/breve/`; a 844×390 idem; a 820×1180 resta su `momenti`; dopo «Apri comunque qui» la copertina e poi `momenti/` non rinviano; su 360×740, 390×844, 430×932 `scrollWidth === innerWidth` e nessun testo di corpo < 16px. Screenshot a piena pagina delle tre larghezze, **guardati**.
- [ ] **Step 8: Commit** `feat: il primo livello sul telefono dell'edizione da leggere`.

### Task 6: Giulia sempre a colonne, con il prodotto in una riga

**Files:**
- Modify: `apps/intesa-esperienza-cliente/src/styles/global.css` (blocchi `@media (max-height: 1040px)` e `(max-height: 940px)` vicino alle righe 1915–1995)

**Interfaces:** nessuna nuova; selettore `:root[data-edizione="lettura"]` (Task 1).

- [ ] **Step 1:** Estrai le regole del layout a colonne in un blocco che si applica quando `(max-height: 1040px)` **oppure** `:root[data-edizione="lettura"]` (stesse dichiarazioni, non duplicate a mano: un selettore `:root[data-edizione="lettura"] .im-due, ...` dentro e fuori dalla media query, o `@container`/`:is()` se più pulito). La sala resta identica.
- [ ] **Step 2:** In lettura la scheda `.im-due-pro.im-due-tess` non sparisce sotto i 940px: diventa **una riga** (logo + nome + la frase che già contiene), stesso corpo del testo, niente rimpicciolimento.
- [ ] **Step 3: Verifica** — build lettura e sala; screenshot del momento 03 e del 04 a 1366×768, 1512×860, 1920×960, 1920×1200 in entrambe le edizioni, passi aperti: in lettura sempre colonne e scheda presente; in sala identico a prima (confronto con gli screenshot `g-*.png` del 19 nov). `audit:deck --only momenti` sulla build lettura con i viewport di Task 7: nessun rilievo nuovo rispetto alla baseline sala (19).
- [ ] **Step 4: Commit** `feat(intesa-esperienza-cliente): in lettura Giulia sempre a colonne, il prodotto resta in una riga`.

### Task 7: Pubblicazione e audit dell'edizione

**Files:**
- Modify: `scripts/lib/deck-routes.ts` (nuova chiave `intesa-storia`), `scripts/deck-audit.ts` (viewport 1366×768 e 1512×860 con `--portatili`), `.github/workflows/deploy.yml`, `scripts/edizione-check.ts`

**Interfaces:** `ROUTE_SETS['intesa-storia']` = le rotte lettura (home, adobe, scenario, persona, momenti, messa-a-terra, approfondimenti, coworker, risultati, parliamone).

- [ ] **Step 1:** `deck-routes.ts`: aggiungi `intesa-storia` con base `/experience-design-factory/intesa-storia/`. `deck-audit.ts`: flag `--portatili` che aggiunge 1366×768 e 1512×860.
- [ ] **Step 2:** `deploy.yml`: dopo la copia di `intesa-esperienza-cliente`, `pnpm --filter intesa-esperienza-cliente build:lettura` (nel passo build) e `mkdir -p pages/intesa-storia && cp -r apps/intesa-esperienza-cliente/dist-lettura/. pages/intesa-storia/`; aggiungi `pages/intesa-storia/index.html` alla lista di verifica. ⚠️ Il file ha modifiche locali di un altro workstream: prima del commit `git diff .github/workflows/deploy.yml` — se contiene righe non tue, **fermati e chiedi all'owner** come committare.
- [ ] **Step 3: `edizione-check.ts` completo** — `checkReteZero(url)`: visita tutte le rotte lettura su desktop e telefono registrando le richieste; verso `supabase.co` **solo** il `POST /rest/v1/aperture` della copertina o di `breve` (nessuno sulle altre pagine, nessuno con GPC attivo), nessuna verso domini diversi da `agargiulo-adbe.github.io`, `github.com`/`objects.githubusercontent.com` (clip) e font già in uso. Script in `package.json` root: `"check:edizione": "tsx scripts/edizione-check.ts"`.
- [ ] **Step 4: Giro dei gate sulla build lettura in preview** — `audit:wrap`, `audit:deck --portatili`, `audit:ritmo --app intesa-storia`, `check:edizione`: 0 HARD, nessun rilievo nuovo rispetto alla sala; poi gli stessi su sala per confermare la baseline invariata.
- [ ] **Step 5: Commit** `chore(deploy): pubblica l'edizione da leggere di Intesa su /intesa-storia/`, push, attendi il deploy, poi `curl -s -o /dev/null -w "%{http_code}" https://agargiulo-adbe.github.io/experience-design-factory/intesa-storia/relatore/` → `404`; `/intesa-storia/` → `200`.

### Task 8: Panel review e consegna all'Account Executive

**Files:**
- Modify: `docs/HANDOVER-25.md` (via `/handover`)

- [ ] **Step 1:** `/panel-review apps/intesa-esperienza-cliente` sulla **build lettura**, con le personas della banca, evidenza catturata **dal telefono (390×844) e dal portatile (1512×860)** con i passi aperti (memoria `deck-due-assi-sottopassi`). Applica P0 e P1, rilancia al massimo una volta.
- [ ] **Step 2:** Link per l'Account Executive (versione A da validare): `https://agargiulo-adbe.github.io/experience-design-factory/intesa-storia/`. Non si manda a nessuno della banca: la scelta A/B passa prima da lei.
- [ ] **Step 3:** `/handover` con la voce «Panel review» e lo stato della fase A; la fase B resta nel backlog come P1 (modulo, riepilogo, misura con consenso, parere privacy).

### Task 9: Il contatore delle aperture

**Files:**
- Create: `supabase/migrations/0040_aperture.sql`, `packages/core/src/blocks/immersive/ContaAperture.astro`, `packages/core/src/utils/aperture.ts`, `packages/core/src/utils/aperture.test.ts`
- Modify: `apps/intesa-esperienza-cliente/src/pages/index.astro`, `src/pages/breve.astro`, il piè della copertina e di `breve` (la frase)

**Interfaces:**
- Produces: tabella `public.aperture (id bigint identity, progetto text, pagina text check in ('copertina','breve'), giorno date default current_date)` — RLS: `anon` solo `insert` con `progetto` 1–40 caratteri; `select` solo `authenticated`; **nessuna colonna per IP, ora, user agent**. `rigaApertura(progetto: string, pagina: 'copertina'|'breve', gpc: boolean): { progetto: string; pagina: string } | null` (`null` se `gpc`). `ContaAperture.astro` (props `progetto`, `pagina`): un `fetch` `POST` con `keepalive`, header `Prefer: return=minimal`, nessun `localStorage`/`sessionStorage`/cookie, errori ignorati; montato solo se `inLettura()` e se `PUBLIC_SUPABASE_URL` è definito.

- [ ] **Step 1: Test** — `rigaApertura('intesa-storia','breve',false)` → `{progetto:'intesa-storia',pagina:'breve'}`; con `gpc=true` → `null`; pagina fuori elenco → `throw`.
- [ ] **Step 2–4:** FAIL → implementa → PASS.
- [ ] **Step 5:** Migrazione `0040_aperture.sql` sul modello di `0014_deck_events.sql` (stesso stile di commento in testa, policy nominate `aperture_anon_insert` / `aperture_auth_select`). ⚠️ Committata non vuol dire applicata: l'owner la lancia (`supabase db query --linked -f supabase/migrations/0040_aperture.sql` o SQL editor) e si verifica con un `insert` anonimo da `curl` che risponde 201 e un `select` anonimo che risponde `[]`.
- [ ] **Step 6:** Frase nel piè della copertina e di `breve`: **«Contiamo quante volte questa pagina viene aperta, giorno per giorno. Nessun dato su chi la apre.»**
- [ ] **Step 7: Verifica** — `checkReteZero` (Task 7) con e senza `globalPrivacyControl` (iniettato con `addInitScript`); il body del POST contiene solo `progetto` e `pagina`.
- [ ] **Step 8: Commit** `feat: il contatore delle aperture dell'edizione da leggere, senza dati su chi apre`.
