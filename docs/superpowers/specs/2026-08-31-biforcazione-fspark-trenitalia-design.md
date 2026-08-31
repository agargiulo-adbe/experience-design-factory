# Biforcazione Connessioni Intelligenti — FS Park × Trenitalia

Data: 2026-08-31 · App: `apps/trenitalia-connessioni` · Stato: approvato (parte A a voce, parte B per delega "procedi e completa")

## Decisioni di fondo (dalle domande)

1. **Audience**: stakeholder separati — ogni ramo è un pitch autoconsistente (FS Park → FS Park; Trenitalia → Trenitalia/FS Technology). L'intro comune è la cornice di gruppo.
2. **Architettura**: una sola app, due sotto-alberi (`/fs-park/*`, `/trenitalia/*`). Un dist, un deploy, URL noto invariato.
3. **Tronco**: solo cover + scenario (neutralizzato) + nuova sezione `/bivio/`. Tutto il resto ri-narrato dentro i rami.
4. **Narrativa**: stesso viaggiatore — Davide, pendolare business Milano–Roma (LOCKED). FS Park lo vede dall'auto alla sbarra; Trenitalia dal binario in poi. Ogni ramo racconta la sua metà e il suo punto cieco. Elena resta di supporto dove già esiste.
5. **Visual**: stessa pelle, accent per ramo — FS Park = mondo-asfalto (ambra `#F5A623`, già nei token), Trenitalia = mondo-binario (rosso attuale). `data-branch` sul layout.
6. **Struttura rami**: scheletro speculare in 5 capitoli, profondità asimmetrica (FS Park affonda su identity reconciliation e POC — dalla trascrizione 14/07; Trenitalia su convergenza e complemento Oracle).

## Fonte nuova: trascrizione riunione 14/07/2026 (docs/Ferrovie)

Fatti utilizzabili nel ramo FS Park (etichetta fonte in slide: "dal confronto di lavoro, luglio 2026"):
- Ecosistema FS Park: sito istituzionale (tracciamenti limitati, possibile revisione), area riservata web (prevista entro dicembre), app iOS+Android (già tracciate), CRM Salesforce.
- Tema centrale: riconciliazione identità — anonimo↔autenticato, chiave comune App/Web/CRM, email (anche hashata) come identificativo candidato, Identity Graph / stitching / backfill.
- Use case priorità alta: customer journey end-to-end (anonimo→acquisto, cross-device), drop-off analysis nel funnel, conversion analysis cross-canale.
- Use case aggiuntivi: rinnovo/mancato rinnovo abbonamenti; acquisti ricorrenti→proposta abbonamento; segmentazione auto/moto/bici; sorgenti che convertono; correlazione transazioni↔assistenza/reclami CRM.
- Scenari intersocietari (evoluzione, non punto di partenza): cross-selling, ritardo treno→benefit/estensione sosta, analisi comportamentali condivise, churn/retention.
- Tecnica: source connector per storico, schema XDM, flusso AEP→CJA, tagging esistente in parte riutilizzabile.
- Adozione: percorso di accompagnamento/formazione; AI Assistant per interrogare i dati in linguaggio naturale.
- Demo o POC su dati realistici/simulati, prima che l'ecosistema sia tutto in produzione.

**Divieti di stile** (oltre ai 13 vincoli LOCKED di HANDOVER-02 §15.4, tutti ancora validi):
- MAI giudizi sull'autonomia/maturità del team FS Park (il punto 7 della trascrizione si traduce SOLO in valore positivo: "lettura del dato come servizio, accompagnamento").
- MAI decisioni interne o nomi vendor (#1, #2). "Entro dicembre" per l'area riservata: usare "in arrivo" senza date.
- Breach angle (#9) SOLO nel ramo Trenitalia (slide-governance lì); la governance FS Park è positiva (policy, etichette d'uso, consenso).

## Information architecture

```
/                          Cover tronco (ritocco: prefigurazione bivio)
/scenario/                 Tronco neutralizzato (senza email-gap)
/bivio/                    NUOVA — 2 slide
/fs-park/partenza|fondamenta|convergenza|meta-invisibile|percorso/
/trenitalia/partenza|fondamenta|convergenza|meta-invisibile|percorso/
```

Slug identici nei due rami (mirror leggibile nell'URL). "fondamenta" rispetta il vincolo #11.
Vecchie pagine → stub redirect (pattern `_redirect.astro` del factory-hub, preserva `location.search`):
`/fondazione/→/trenitalia/fondamenta/` · `/convergenza/→/trenitalia/convergenza/` · `/connessioni/→/trenitalia/meta-invisibile/` · `/roadmap/→/trenitalia/percorso/` · `/casi-duso/→/trenitalia/percorso/`.

Catena nextHref/prevHref: `/`→scenario→bivio; bivio next→`/fs-park/partenza/` (strategia "partire da FS Park"); dentro ogni ramo lineare; prima pagina ramo prev→`/bivio/`; ultima pagina ramo next→`/bivio/` (mai traboccare nell'altro ramo).

## Tronco — modifiche

**index.astro**: journey-index riscritto sulla nuova IA (01 Scenario · 02 Bivio · poi due porte-ramo FS Park / Trenitalia con i 5 capitoli in anteprima). La linea D/E in cover diventa la prefigurazione: viaggio intero di Davide con cesura visiva auto→sbarra→binario.

**scenario.astro** (chirurgia):
- RIMOSSA `slide-email-gap` (trasloca nel ramo Trenitalia, footnote Takeout incluso — #10 viaggia con la slide).
- `slide-marco` (Davide): il viaggio INTERO in una riga orizzontale con cesura al centro (auto·parcheggio ‖ treno·arrivo).
- `slide-touchpoints`: i 4 touchpoint LOCKED (#13) raggruppati per proprietà — FS Park (app/web FS Park) vs Trenitalia (trenitalia.com, Frecce booking, App Trenitalia) + chiusa: "nessuna delle due società vede il viaggio intero".
- `slide-opportunity`: chiude sul teaser del bivio. `nextHref → /bivio/`.

**bivio.astro** (nuova sezione deck, 2 slide):
1. `slide-spezzata` — "Un viaggio, due sguardi": la linea di Davide si spezza al centro; sinistra mondo-asfalto (ambra), destra mondo-binario (rosso). Copy: ognuna delle due società vede metà del percorso; la stessa piattaforma serve entrambe le metà.
2. `slide-porte` — due grandi card interattive: **FS Park** ("Parti da qui se il tuo mondo è la sosta") / **Trenitalia** ("Parti da qui se il tuo mondo è il viaggio"), ognuna con i 5 capitoli in anteprima. Click → cap.1 del ramo.

## Navigation (contratto single-line — memoria `nav-single-line-contract`)

`TreniNavigation` a tre stati via prop `branch?: 'fs-park' | 'trenitalia' | null`:
- **Tronco** (null): brand "Connessioni Intelligenti · FS × Adobe"; rail `01 Scenario · 02 Bivio` + due voci-porta accentate `FS Park` (ambra) / `Trenitalia` (rosso).
- **Ramo**: brand "Connessioni Intelligenti · FS Park" (o · Trenitalia); chip "⇤ Bivio"; rail `01 Partenza · 02 Fondamenta · 03 Convergenza · 04 Metà invisibile · 05 Percorso`. NIENTE voci dell'altro ramo.
- Sempre UNA barra, nowrap, overflow-x-auto sul rail. Verificare l'intera barra a 1280.

## Visual per ramo

`BaseLayout` accetta `branch` → `data-branch` su `<html>` (o body). In `global.css`:
- `[data-branch="fs-park"]`: `--accent-primary: #F5A623` (ambra, già token), accent hover `#FFC94D`; testo su bottoni/chip ambra = `--color-carbonio` (contrasto AA reale, rgba/hex espliciti — il parser audit non legge oklab). Texture `.fsp-stalli` (griglia stalli parcheggio) e `.fsp-carreggiata` (strisce segnaletica) nei backdrop cover; backdrop foto `bg-parcheggio` (già in assets).
- `[data-branch="trenitalia"]`: default attuali (rosso, `fs-line-h`, `fs-grid`, `bg-binari`/`bg-stazione`).
- Il tronco resta neutro (rosso FS di gruppo).

## Ramo FS Park — slide per slide (27 slide, in gran parte nuove)

### /fs-park/partenza/ (5)
1. `slide-cover` — "La metà su asfalto" · eyebrow "Ramo FS Park · Il punto di partenza". Inverse, texture stalli + bg-parcheggio. Lead: dall'auto alla sbarra, FS Park vede tutto; dopo, il cliente esce di scena.
2. `slide-davide` — Davide arriva in auto alle 6:40, sosta lunga, app FS Park. La sua riga di viaggio: metà sinistra piena (auto→sbarra), metà destra tratteggiata "fuori campo".
3. `slide-ecosistema` — L'ecosistema FS Park oggi, righe full-width impilate (regola cliente): sito istituzionale (tracciamenti limitati) · area riservata web (in arrivo) · app iOS/Android (già tracciate) · CRM Salesforce (la fonte customer-centric). Fonte: "dal confronto di lavoro, luglio 2026".
4. `slide-identita` — Quattro fonti, quattro versioni dello stesso cliente: l'anonimo sul sito, l'utente in app, il record CRM, il ticket assistenza. Oggi nessuna si parla.
5. `slide-opportunity` — L'opportunità: leggere il percorso intero, dal primo accesso anonimo all'acquisto — e a quello dopo.

### /fs-park/fondamenta/ (5) — qui le fondamenta = identità
1. `slide-cover` — "Le fondamenta: una sola identità".
2. `slide-anonimo` — Il confine anonimo/autenticato: al login il cliente "si accende"; il valore sta nel ricostruire anche il prima.
3. `slide-chiave` — La chiave di riconciliazione: email (anche hashata) come identificativo candidato; Identity Graph, stitching, backfill — righe full-width, ciascuna spiegata in una frase concreta. Chiusa onesta: "aspetti tecnici da approfondire insieme".
4. `slide-xdm` — Da fonti a schema: XDM come lingua comune, source connector per lo storico, tagging esistente in parte riutilizzabile. Nota: quantità di dati da migrare da valutare.
5. `slide-choice` — "Non rifare. Riconciliare." (mirror del claim Trenitalia): il sito può evolvere, l'app è già tracciata — la piattaforma riconcilia ciò che c'è, non impone di ripartire.

### /fs-park/convergenza/ (6) — gating `cja`
1. `slide-cover` — CJA: tutte le fonti, un'unica lettura.
2. `slide-convergenza` — sito + area riservata + app + CRM → una vista sola (versione FS Park della convergenza).
3. `slide-cja-vs-cdp` — CJA è / non è (vincolo #5 vive in ENTRAMBI i rami; adattare esempi al mondo sosta).
4. `slide-usecases-core` — I 3 use case prioritari: journey end-to-end anonimo→acquisto · drop-off nel funnel · conversion cross-canale. Tutti etichettati "da validare sul campo" (#7).
5. `slide-demo-poc` — Demo/POC su dati realistici o simulati: mostrare la riconciliazione sito+app+CRM+assistenza PRIMA che l'ecosistema sia tutto in produzione. Visual: funnel di Davide che prenota la sosta (mock CJA Workspace, testo ≥0.95rem nel mock leggibile).
6. `slide-adozione` — La lettura del dato come servizio: affiancamento, formazione, AI Assistant per domande in linguaggio naturale. SOLO frame positivo.

### /fs-park/meta-invisibile/ (6) — gating `data-collab`
1. `slide-cover` — "Alla sbarra, Davide scompare".
2. `slide-punto-cieco` — Cosa FS Park non vede: il treno, il motivo della sosta, il ritorno, il valore del cliente oltre il parcheggio.
3. `slide-why-collab` — Perché una clean room: FS Park e Trenitalia sono entità legali distinte anche dentro il Gruppo; il GDPR richiede Data Collaboration anche intra-gruppo (#8, ri-narrato POV FS Park).
4. `slide-usecases-gruppo` — Scenari intersocietari visti da FS Park: ritardo treno→estensione/benefit sosta · cross-selling sosta+viaggio · churn e retention letti insieme. Tutti "da esplorare · da validare sul campo".
5. `slide-governance` — AEP Data Governance: etichette d'uso, policy enforcement, consenso — la condizione tecnica per parlarsi tra società. SENZA breach angle (resta nel ramo Trenitalia).
6. `slide-strategia` — Partire da FS Park, estendere al Gruppo: il caso concreto oggi, l'orizzonte domani. Nessuna decisione interna, nessun vendor (#1, #2).

### /fs-park/percorso/ (6)
1. `slide-cover` — "Il percorso".
2. `slide-poc` — Il primo passo: POC su dati realistici/simulati. Cosa dimostra (riconciliazione, journey, drop-off) e cosa NON richiede (ecosistema completo in produzione).
3. `slide-esplorare` — Sul radar (righe full-width, tutte "da validare sul campo"): rinnovi e mancati rinnovi · ricorrenze→proposta abbonamento · segmentazione auto/moto/bici · sorgenti che convertono · transazioni↔assistenza/reclami.
4. `slide-adozione` — Accompagnamento e formazione dentro il percorso: affiancamento alla lettura, autonomia progressiva.
5. `slide-orizzonte` — Verso il Gruppo: quando la metà su asfalto incontra la metà su rotaia (richiamo visivo alla linea del bivio; orizzonte, non dipendenza).
6. `slide-sintesi` — Sintesi + invito.

## Ramo Trenitalia — slide per slide (30 slide, in gran parte adattate dalle pagine esistenti)

### /trenitalia/partenza/ (5)
1. `slide-cover` — "La metà su rotaia" · eyebrow "Ramo Trenitalia · Il punto di partenza". Inverse, mondo-binario.
2. `slide-davide` — da `scenario/slide-marco`: Davide dal binario in poi; metà sinistra (auto→sbarra) tratteggiata "fuori campo".
3. `slide-email-gap` — TRASLOCATA dal tronco, contenuto invariato: Oracle Responsys come motore B2C che CJA complementa (#3), 611 email/anno + footnote Takeout (#10).
4. `slide-punto-cieco` — NUOVA: Davide "appare" in stazione. Cosa Trenitalia non vede: come arriva, dove sosta, quanto prima. Perché conta: l'esperienza è porta-a-porta, non binario-a-binario.
5. `slide-opportunity` — da `scenario/slide-opportunity`, riletta POV Trenitalia.

### /trenitalia/fondamenta/ (4) — da fondazione.astro quasi intera
1. `slide-cover` — "Le fondamenta" (ritono ramo).
2. `slide-ecosystem` — ecosistema a strati, righe full-width impilate (LOCKED cliente).
3. `slide-salesforce` — Salesforce Foundation Q1 2026 (fonte fsnews.it).
4. `slide-choice` — "Non sostituire. Connettere." (#3).

### /trenitalia/convergenza/ (6) — da convergenza.astro intera, gating `cja`
cover · convergenza (tutte le fonti, un'unica vista) · cja-vs-cdp (#5) · demo-cja Davide · content-analytics (AEM) · fasi (approccio graduale).

### /trenitalia/meta-invisibile/ (7) — da connessioni.astro intera, gating `data-collab`
1. `slide-cover` — riframe: "La metà che manca" (non più "FS Park × Trenitalia" generico: qui è Trenitalia che guarda oltre la stazione).
2. `slide-gap` — il gap attuale (adattato POV).
3. `slide-why-collab` — clean room GDPR intra-gruppo (#8, rationale inline INVARIATA).
4. `slide-usecases` — i 3 use case (POV Trenitalia: ritardo→sosta estesa, cross-sell, journey completo), "da validare sul campo".
5. `slide-data-collab` — clean room, come funziona.
6. `slide-governance` — Data Governance & Security CON breach angle (#9 invariato: driver di credibilità, nessun numero).
7. `slide-value` — il valore end-to-end.

### /trenitalia/percorso/ (9) — da roadmap.astro + coda casi-duso
1. `slide-cover` — "Il percorso".
2. `slide-3fasi` — le 3 fasi evolutive (#12: nessuna data, disclaimer FS Technology invariato).
3. `slide-fase1-cja` — Fase 1: CJA + Governance.
4. `slide-rtcdp-ajo` — Fase 2: RTCDP + AJO ("AJO orchestra SOPRA Oracle Responsys — non lo sostituisce. Responsys rimane il motore di esecuzione email", #4 verbatim).
5. `slide-mix-modeler` — Fase 3: Mix Modeler.
6. `slide-mix-usecase` — Fase 3: use case FS.
7. `slide-genstudio` — Fase 3: GenStudio + Target + Experience Accelerator.
8. `slide-esplorare` — NUOVA, condensa i 4 "Da esplorare" di casi-duso in righe full-width (Retention & Loyalty · Loyalty & Acquisition · Acquisition & Ecosystem · Intelligence & Optimization), tutte "da validare sul campo" (#7).
9. `slide-sintesi` — sintesi + invito (da casi-duso/slide-sintesi): chiusa con l'orizzonte FS Park come metà mancante — menzione, non dipendenza.

## Admin, gating, audit

- **admin.astro**: PAGE_REGISTRY in tre gruppi — Tronco (scenario, bivio) · Ramo FS Park (5 pagine) · Ramo Trenitalia (5 pagine); slug = path relativo (es. `fs-park/partenza`). Verificare che AdminConsole costruisca href corretti con slug contenenti `/`. SOLUTIONS invariati nei 5 id; aggiornare `appearsIn` con le nuove sezioni di entrambi i rami.
- **Gating** (`data-solution`/`data-nav-solution`/`pageSolutions`): convergenza=`cja` e meta-invisibile=`data-collab` in ENTRAMBI i rami; trenitalia/percorso=`rtcdp,ajo,mix-modeler`. Il runtime riscrive next/prev per saltare sezioni spente (già in core; verificare su astro:after-swap — memoria `spa-gating-reapply`).
- **scripts/deck-audit.ts** (repo root): lista `trenitalia:` → 13 route (home, scenario, bivio, 5 fs-park, 5 trenitalia). Le vecchie 5 route diventano stub redirect e ESCONO dalla lista.
- Verifica BINDING: build → preview → `DECK_URL=... audit:deck` 0 HARD a 1920/1440/1280 + screenshot 1920 di ogni slide nuova/cambiata LETTO (type contract ≥0.95rem body, ink leggibile, riempimento 55–70%).

## Copy

Voce umana (memoria `copy-must-be-human`), IT. Niente em-dash retorici, niente tricolon, niente "non solo X ma Y". KPI sempre "stima illustrativa" o "da validare sul campo" (#6, #7). Nomi prodotto verbatim: Customer Journey Analytics, Adobe Experience Platform, Real-Time CDP, Adobe Journey Optimizer, Adobe Mix Modeler, Data Collaboration, AI Assistant.

## Piano di implementazione

- **P1 (main tree, sequenziale)**: global.css (accent ramo + texture) · BaseLayout prop branch · TreniNavigation 3 stati · bivio.astro · chirurgia index+scenario · 5 stub redirect · admin.astro · deck-audit.ts routes. Commit.
- **P2 (2 subagent, worktree isolati, in parallelo)**: ramo FS Park (5 pagine) · ramo Trenitalia (5 pagine). Ogni subagent: build + audit nel proprio worktree (porte diverse), copia file nel main tree alla fine NO — riporta i path; l'integrazione la fa il main.
- **P3 (main tree)**: integrazione file, build finale, audit 0 HARD, screenshot 1920 letti, fix, commit + push, aggiornamento memoria.
