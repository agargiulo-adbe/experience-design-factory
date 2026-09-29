# «Sei domande» — Adobe × Poste Italiane · design spec (2026-09-29)

**Cliente / interlocutore.** Poste Italiane · Giuseppe Sperandeo, Responsabile Monitoraggio
Canali Digitali, Admin di Adobe Analytics. Pubblico: solo lui. Taglio tecnico‑operativo che
fa vedere il valore *interno* (tempo, autonomia dall'IT, governance) senza cambiare stack.

**Assunzioni (decise da Antonio il 29/09).** Rinnovo Analytics dato per fatto. AEM Forms e
Commerce fuori (altre divisioni). Niente CJA (costo di re‑implementazione FE). Stack:
AppMeasurement + Adobe Launch. «Coworker» = **Adobe CX Enterprise Coworker**. Demo su sandbox
Adobe. Adobe Target = evolutiva di interesse ma non di sua responsabilità (Gangemi).

**App.** `apps/poste-sei-domande` · base `/experience-design-factory/poste-sei-domande/` ·
bilingue **IT default + EN** (`<T en it>`), light‑dominant (poste.it è chiaro), dark per le
cover. Design system letto dal CSS di produzione di poste.it (`pnpm brand:tokens`): blu di
sistema `#0047bb`, blu `#4270e4`, link `#337ab7`, azzurro `#f2f8ff`, giallo di marchio
`#eedc00`, inchiostro `#1a1c1e`, grigi `#c6c6c9/#dddddd/#e2e2e6/#333333`; **Inter** (già in
uso sul sito, distribuibile). Classi `.sd-*`. Firma Adobe × Poste Italiane sul motore
(`CoBrand`, ripiego wordmark: nessun SVG ufficiale trovato su poste.it/posteitaliane.it).

**Struttura — sei capitoli, ognuno è una domanda di Giuseppe.** Ogni capitolo: cover con la
domanda → «Oggi» (come si fa in Workspace) → «Con Coworker» (mock chat) → seconda domanda /
approfondimento → «Cosa ti porti a casa» (valore + una riga di cautela).
- `index` 00 — cover (hero lockup) · «Il vostro tracciamento» (SuperApp, 18,2 mln utenti, una
  report suite = 99% delle chiamate, 9/10 mobile, +50% in tre anni) · i pain (2024: time to
  insight, indipendenza; 2026: governance IT‑heavy, dashboard, insight) · percorso 2×3.
- `accendere` 01 «Come lo accendo, e per chi?» — cos'è Coworker (Chat GA 10/06/2026; AA in
  Chat GA 29/09/2026) · 4 passi (MCP Access in Admin Console → IMS org → coworker.experience.adobe.com
  → prima domanda) · chi lo usa (permessi ereditati da Workspace; 19 tool in lettura, 4 in
  scrittura con approvazione) · takeaway.
- `rispondere` 02 «Cos'è successo ieri sulla SuperApp?» — oggi (5 passi in Workspace) · mock
  Coworker (report + trend) · il riepilogo settimanale per il business · takeaway.
- `capire` 03 «Perché le Operazioni Veloci sono calate lunedì?» — oggi (breakdown manuale) ·
  root‑cause skill (GA 02/10/2026) · web vs app · takeaway.
- `governare` 04 «Quali segmenti e suite non usa più nessuno?» — oggi (16 report suite, 6 quasi
  vuote) · uso componenti / simili / duplicati · «costruiscimi il Workspace del lunedì»
  (progetto creato con approvazione, apri in Workspace) · takeaway.
- `proteggere` 05 «Dove finiscono i dati?» — architettura (Coworker ↔ MCP Analytics ↔ report
  suite: nessun dato spostato, aggregati, permessi Workspace, approval gate, audit trail) ·
  cosa NON fa · regole d'uso proposte · takeaway. Contesto: Manifesto IA Poste, Comitato IA,
  sensibilità post‑Garante (aprile 2026) — mai la parola «profilazione», mai «sanzione».
- `evolvere` 06 «E domani?» — quattro evolutive (Workspace generato/«open in Workspace»;
  Claude + MCP Analytics per gli analisti; Target in Coworker, «di interesse, non tua
  responsabilità»; Content Analytics/Web SDK fuori perimetro oggi) · pilota 4 settimane ·
  chiusura · **slide‑firma**.

**Fatti e fonti.** Solo fonti pubbliche sulle slide (release notes Adobe Analytics set 2026,
developer.adobe.com/analytics-mcp, Adobe News GA Coworker 10/06/2026, Experience League
Coworker, Poste Italiane comunicati). Numeri del tracciamento = dati del cliente (nessun
commit, nessun euro). Dati delle demo = **illustrativi**, etichettati. Nessuna citazione del
deck interno «Today and Tomorrow» né delle percezioni.

**Demo.** Mock CSS della chat Coworker (`.sd-chat`) con prompt in IT, risposta con tabella e
barre; demo live su org demo Adobe (Adobe Demo System Shared org / Demo EMEA) da verificare
per la presenza di una report suite Analytics.

**Dossier.** `/dossier/` gated (pattern Isybank: `restricted_docs`, slug `poste-sperandeo`,
secret‑link `?t=`), noindex, fuori nav; seed SQL git‑ignored in `docs/Poste Italiane/`.

**Wiring.** deploy.yml (merge + verify) · factory‑hub tile · showcase `experiences.ts`
(`defaultPublished: true`, richiesta esplicita) + shot · `scripts/deck-audit.ts` ROUTE_SET +
alias · root scripts · migrazione `0015_seed_poste.sql` (experiences + show_in_showcase) ·
CLAUDE.md · handover · memoria.

**Gate.** build + typecheck verdi · `audit:deck` 0 HARD a 1920/1440/1280 · screenshot 1920
letti (IT ed EN) · deploy verificato live.
