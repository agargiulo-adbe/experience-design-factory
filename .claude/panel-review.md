# Panel review — adattatore per la Experience Design Factory

La skill `panel-review` (canonica in `skills/panel-review/`, esposta globalmente da
`~/.claude/skills/panel-review`) è invariante. Questo file dice dove stanno le cose qui.

## Artefatti
- Ogni **experience** è un deck immersivo (`apps/<app>/`, `kind: deck`); showcase e hub sono siti (`kind: site`); i dossier interni (`/dossier/`) sono documenti (`kind: doc`).
- Evidenza: `pnpm --filter <app> build` → `pnpm --filter <app> preview --port <N>` → screenshot di ogni slide a 1920 (`apps/<app>/scripts/shots.mjs` dove esiste, altrimenti Playwright su `[data-slide]`) + testo esatto per slide dal DOM. Locator = `id` della slide (quello del `PAGE_REGISTRY` in `admin.astro`).
- Gate da rigirare dopo le correzioni, nell'ordine: `build` → `DECK_URL=http://localhost:<N> pnpm --filter <app> audit:deck` a **0 HARD** → rilettura a 1920 delle slide toccate. Poi il secondo giro del panel.

## Personas
- File: `docs/<Cliente>/PANEL-PERSONAS.md` — **git-ignorato** (ritratti di persone reali). Senza file non si derivano personas a tavolino: si costruiscono con `skills/experience-brief/SKILL.md` Part 8 da fonti pubbliche (LinkedIn, stampa, sito del cliente), poi si lancia il panel. Se davvero non c'è tempo, giro degradato dichiarato.
- Minimo: la persona in sala, il suo capo, l'owner dei dati/IT; poi business owner e team adiacente.

## Fact-check
- Fonti pubbliche che contano, in ordine: Experience League (`experienceleague.adobe.com`), `developer.adobe.com`, `news.adobe.com` e le release notes, `business.adobe.com`; le pubblicazioni del cliente (sito, comunicati, bilancio); stampa di settore solo per fatti del cliente.
- Cross-check interno: **Fluffy** (MCP `fluffyjaws`: documentazione, Jira, Slack, field readiness). Un fatto confermato solo lì è `internal-only` e **non può stare su una slide come se fosse pubblico**.
- Note riservate per il solo fact-checker: `docs/<Cliente>/RESEARCH-*.md`, `HISTORY-BRIEF-*.md`, `CONTEXT_*.md` (git-ignorati). Niente di lì torna nel deck.
- I nomi dei prodotti si verificano contro `docs/*.pptx` e la memoria `adobe-product-naming-2026`, non a memoria.

## Verdetto
- File: `docs/<Cliente>/PANEL-VERDICT-<YYYY-MM-DD>-round<N>.md` (git-ignorato, accanto alle personas) + i JSON grezzi nella stessa cartella (`panel/<data>-round<N>/`).
- Specchi **obbligatori**: la chat (status line, tabella voti, P0 e le tre obiezioni più dure), il **handover** (`docs/HANDOVER-*.md`, nella sezione dell'experience: data, giro, medie per asse, cosa è sopravvissuto), il **dossier interno** dell'experience (obiezioni, domande attese, cosa dire/non dire: il team Adobe si prepara da lì).
- Lingua del verdetto: quella del deck (IT di default; EN per Ferrari e per i deck bilingui si giudica in IT con citazioni EN dove serve).

## Assi
Default `deck`: credibilità dei fatti · rilevanza per me · chiarezza · rischio (5 = nessuno percepito) · azionabilità (cosa faccio lunedì). Gli altri kind usano i default della skill.

## Policy di applicazione
- Si applicano **P0 e P1 direttamente** (l'utente ha chiesto il deck, non un report), i P2 a costo zero; poi gate e secondo giro per la delta. **Due giri al massimo**: ciò che sopravvive va nel handover come punto aperto.
- Non si cambia senza un umano: nomi di persone e prodotti, numeri contrattuali, date di GA (si correggono solo con la fonte pubblica citata nel verdetto), tutto ciò che è «riservato» in `docs/<Cliente>/`.
- `/handover` segnala come **P0** ogni experience modificata senza un verdetto registrato per lo stato corrente.
