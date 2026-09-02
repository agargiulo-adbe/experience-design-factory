# Design — UniCredit «Analizza»: centralità all'attribution

> **Data:** 2 settembre 2026 · **App:** `apps/unicredit-engagement` · **Sezione:** `analizza` (06)
> **Origine:** meeting Giancarlini (24/07, `docs/UniCredit/`) + deep-research 2/09 + dossier `docs/UniCredit/DOSSIER-UNICREDIT-ADOBE.md`.
> **Scopo:** dare centralità al tema attribution (last-touch cieco → vista complementare → cost-per-sale → MTA+MMM) e servire da base per l'Adobe Day/workshop del 14/09.

## Decisioni approvate
- **Ambizione:** media — **+2 slide dedicate**, **riordino**, ritocco copy leggero (no ristrutturazione, no tagli).
- **Taglio:** esplicito sul percorso UniCredit (concetti + direzione), **pubblico** (rischio IP accettato dall'owner). **Confine:** niente nomi di persone, niente sigle di sistemi interni (COR, GDO, Foundry, Bit Bang). Si parla di canali (app, filiale, contact center, agenti), del modello ufficiale last-touch «di governance che resta», di vista complementare, riconciliazione, cost-per-sale, MTA/MMM.
- **Narrativa:** Approccio B — attribution come spina che apre (tesi) e chiude (meccanismo → payoff MCA).

## Nuovo ordine slide (10)
1. `slide-cover` — Cover (ritocco eyebrow/lead → filo attribution)
2. `slide-cxa-brand` — Annuncio Adobe CX Analytics (invariato)
3. **`slide-lasttouch` 🆕** — Last-touch cieco → vista complementare CJA (tesi attribution)
4. `slide-agent` — Data Insights Agent (invariato)
5. `slide-everywhere` — Analytics Everywhere / MCP (invariato)
6. `slide-llm` — LLM Insights (invariato)
7. `slide-banking` — Banking use cases + funnel (ritocco: card Attribution in testa) — rampa al meccanismo
8. **`slide-costpersale` 🆕** — Cost-per-click → cost-per-sale + MTA/MMM (meccanismo)
9. `slide-llm-mix` — LLM Insights + Marketing Campaign Analytics (invariato)
10. `slide-campaign` — Marketing Campaign Analytics (closer + CTA a /coworker, invariato)

*(Nota: banking resta nella posizione originale, appena prima di cost-per-sale, per evitare di spostare un blocco grande e per fare da rampa d'uso ai casi → meccanismo.)*

## Slide 🆕 A — `slide-lasttouch`
- **bg:** `secondary` · **align:** `center` (o split se serve respiro).
- **eyebrow:** `ATTRIBUTION · LA VISTA CHE MANCA`
- **title:** «Il last-touch dice chi.<br/>Non dice come.»
- **lead:** Il report vendite ufficiale attribuisce ogni vendita a un solo canale — l'ultimo che l'ha registrata. È il modello di governance, e resta. Ma non racconta il percorso che ha portato lì.
- **corpo — 2 pannelli affiancati:**
  - `uc-panel--rosso` «Report ufficiale»: *1 prestito → Filiale* (last-touch, un solo canale).
  - `uc-panel--oro` «Vista complementare · CJA»: barre-peso illustrative — App 45% · Contact center 30% · Filiale 25% — «lo stesso venduto, con il peso reale di ogni canale, senza toccare il modello ufficiale».
- **chiusura (rilevanza UniCredit):** capire quanto app, filiale, contact center e agenti pesano su una vendita attribuita a uno solo — per orchestrare i lead e dare ai team target quantitativi, non solo qualitativi.
- **note fonte:** riga piccola «pesi illustrativi · vista complementare, non sostitutiva del modello ufficiale».
- `data-solution="cja"`.

## Slide 🆕 B — `slide-costpersale`
- **bg:** `primary` · **align:** `center`.
- **eyebrow:** `ATTRIBUTION · DAL CLICK ALLA VENDITA`
- **title:** «Pagare il marketing sulle vendite, non sui click.»
- **lead:** Riconciliare la navigazione con il venduto significa remunerare le agenzie sul risultato reale. Ma il cost-per-sale regge solo su un'attribution solida e condivisa.
- **corpo — 2 colonne MTA vs MMM (complementari):**
  - `uc-panel--oro` **MTA** — person-level · decisioni di canale settimanali.
  - `uc-panel--rosso` **MMM** — aggregato · budget strategico trimestrale · resiliente a privacy e cookie (nessun tracciamento individuale).
  - riga unificante: «Complementari, non alternativi. Causali con l'incrementalità. Marketing Campaign Analytics li unifica.»
- **avvertenza (dalla ricerca §9.4):** «Senza una base di attribution condivisa, il cost-per-sale diventa una disputa. Con CJA + Marketing Campaign Analytics, diventa un contratto.»
- `data-solution="mix-modeler"` (o `cja` — valutare: la slide parla di entrambi; usare `cja` come gate primario coerente con la sezione).

## Ritocchi copy (≤ ±10% lunghezza, copy 100% umano)
- **Cover:** lead orientata al filo attribution (dall'insight all'attribuzione azionabile).
- **`slide-banking`:** portare la card `Attribution` (Full-funnel attribution causale) come **prima** delle tre; eventuale micro-ritocco al titolo.

## Vincoli tecnici / verifica
- Registrare `slide-lasttouch` e `slide-costpersale` nel `PAGE_REGISTRY` di `apps/unicredit-engagement/src/pages/admin.astro` (sezione «Analizza (06)») nell'ordine nuovo.
- Riusare i componenti/classi esistenti (`Slide`, `uc-panel`, `uc-tag`, `slide-eyebrow`, `slide-title`, `uc-stat-*`) — codice coerente con le slide vicine.
- **Verifica obbligatoria (in ordine):** `pnpm --filter unicredit-engagement build` → `preview` → `DECK_URL=… audit:deck` = **0 failure** su 1920/1440/1280; poi **screenshot 1920 e lettura** di `slide-lasttouch`, `slide-costpersale`, `slide-banking`, `slide-cover`.
- Naming prodotto: **Marketing Campaign Analytics** (non «Mix Modeler»), coerente con memoria `adobe-product-naming-2026`.

## Fuori scope (YAGNI)
- Nessun taglio/fusione di slide esistenti; nessuna modifica ad altre sezioni; nessun nuovo componente core.
