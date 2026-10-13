# docs/ — start here (reading guide for a new Claude Code session)

This index tells a fresh CC session **what to read, in what order, and what to avoid**, so
you get up to speed without wasting context. Everything tracked here is small Markdown —
reading **every** doc below is ~15k tokens total, safely within limits. Read on demand;
you don't need all of it for most tasks.

## Due mestieri, due guide
`docs/` ospita **due cose diverse**, e la guida giusta dipende da che cosa stai facendo:
- **lavoro sulla Factory** (experience, deck, motore) → continua a leggere questo file;
- **lavoro operativo d'account** (una mail, un'analisi, un rinnovo, un blocco contrattuale
  su un cliente) → la guida è **`docs/CLAUDE.md`**, che si carica da sé, più il registro
  `docs/<Account>/ACCOUNT.md` e i comandi `/account-open`, `/account-close` e `/accounts`. Lì le regole dei deck **non
  si applicano**, e c'è scritto perché. Spec: `docs/superpowers/specs/2026-10-12-account-operativo-design.md`.

⚠️ Le cartelle cliente sotto `docs/` sono **ignorate da git** (`docs/.gitignore` è
fail-closed: ignora tutto e riammette i soli documenti della Factory). Il repo è
**pubblico**: niente di quelle cartelle si copia in un file tracciato. Gate: `pnpm audit:docs`.

## What loads automatically (don't re-read)
- **`/CLAUDE.md`** (~4k tok) — agent guide, Quality Bar, deck contract, **Type & legibility contract (BINDING for every deck slide)**, aesthetics. Auto-loaded every session.
- **memory `MEMORY.md`** (~3k tok) — index of auto-memories, **81 al 13 ott 2026** (nuove: `link-risponde-non-conferma`, e `taglio-corto-stessa-fonte` riscritta con il gate `audit:taglio`). I singoli file si caricano a richiamo, non tutti insieme.

## Read order (on demand, via the Read tool)
1. **`docs/HANDOVER.md`** — **read this first.** Dated current state (**2026-10-13**). **Splittato per dimensione** (contratto ≤48KB/≤1500 righe/≤1800 char per riga, via il comando `/handover`): `HANDOVER.md` è un **manifest** che instrada a **17 parti**, da leggere in ordine (≈32k tok totali; ognuna sta in una singola `Read`). La mappa sezione→parte sta nel manifest e non si duplica qui; quattro cose vale la pena sapere prima di aprirlo:
   - **Se devi decidere cosa fare, la Parte 2 basta**: contiene il **backlog P0 e P1 caldi**. Al 13 ott conta **14 P0 e 33 P1** (Parte 2), più **10 P1 di fondo e 44 P2** nella Parte 10. ⚠️ **La panel review sulla Prospettiva Trenitalia è stata fatta** il 12 ott, due giri, ed è chiusa (§37.7): resta un P1 — rileggere con gli occhi del panel le slide che il 13 ott sono cambiate. Il P0 più vecchio e più pesante resta quello dei **18 file di un altro workstream finiti su `main`**, e il P1 nuovo del 13 sono i **480 rilievi di copia** che `copy-audit` non vedeva finché leggeva solo gli attributi bilingui.
   - **Il motore dei dossier interni sta nella Parte 11 (§34)**, non fra i core trasversali: ha regole di contenuto e di ricerca proprie, e una skill (`skills/dossier/`) con il suo gate `pnpm audit:dossier`. ⚠️ Due app **non** lo usano ancora (`eni-orbita`, e il dossier FSTechnology di `trenitalia-connessioni`): hanno il contenuto nel bundle statico, ed è il P0 qui sopra.
   - **Le parti sono ribilanciate quando una tocca il tetto**, quindi *la numerazione delle sezioni non segue sempre quella delle parti*: §15 è passata alla Parte 6, §23–25 alla Parte 9, §10.b alla Parte 10, e **§32 (Poste) è spezzata a sotto-livello su due parti** — 12 (§32.1–32.9) e **13** (§32.10–32.12); **§35 (Intesa Assicurazioni) è uscita dalla Parte 11 ed è la Parte 15**. Il change log §11 sta su **quattro** parti: 3 (recente, dal **12-13 ott** al 9 ott) → 4 (seguito) → **14** (coda, 14→1 set) → **17** (settembre e luglio); l'ultimo ribilanciamento è del **13 ott**, di nuovo a catena 3 → 4 → 14 → 17. **Le Parti 16 e 17 sono nuove del 12 ott**: la 16 tiene §37 (la Prospettiva per la Direzione Sales di Trenitalia, con il panel in §37.7 e il giro di linearità in §37.10) e §38 (TIM). ⚠️ Le parti a filo del tetto sono la **7** (47.8 KB), la **1** (47.5) e la **2** (45.8) su 49,1; quelle con più spazio la **17** (9.8), la **16** (15.2), la **11** (23.5) e la **13** (24.0). Il manifest è sempre aggiornato; fidati di quello, non della memoria.
   - ⚠️ **Le experience Trenitalia sono due, e non vanno confuse**: «Connessioni Intelligenti» (`trenitalia-connessioni`, Blueprint, il tavolo FSTechnology) e **«Dove può arrivare il viaggio»** (`trenitalia-prospettiva-sales`, Prospettiva per la **Direzione Sales**, nata l'11 ott) — quest'ultima sta in **§37, Parte 16**. Condividono la pelle letta dal sito del cliente, non il contenuto né l'interlocutore.
   - **Lo stato corrente del deck «Connessioni Intelligenti» sta in §36 (Parte 8), non in §26 (Parte 7)**: §26 è la storia della biforcazione, §36 è la riscrittura del 9 ott con il design system vero del cliente e il panel a due giri, **più §36.9: la sera del 9 la riunione ha ridotto il perimetro a due fonti** (Analytics di trenitalia.com + CRM), e il panel copre lo stato precedente.

2. **New experience?** Start with the **`/experience-design`** skill (Step 0 = intake router → type **Prospettiva · Storia · Blueprint · Playbook**), then `pnpm brand:tokens`, the `experience-brief` skill, **`pnpm new:experience --slug … --type …`** (scaffold that builds and passes the audit, registered everywhere), content, `audit:deck`, **`/panel-review`**, `/handover`. **`docs/new-client-in-30-min.md`** (~0.9k tok) keeps the older manual steps + gotchas (still valid: Tailwind v4 + monorepo, trailing slash, base URL, GSAP scroller, reduced-motion, hyphenated TS keys, CSS translucency).
3. **`docs/AUDIT.md`** (~4.9k tok) — read **only if** working on **Max Mara / Acquisizione**. Phase‑1 diagnosis (dated 2026‑06‑16); proposals **not yet applied** — validate before acting.
4. **`docs/storyboard.md`** (~1.6k tok) — narrative storyboard; read if you need the story arc.
5. **`docs/superpowers/specs/2026-06-15-…-design.md`** — original design spec; background only.

For UniCredit specifics the freshest reference is the memory **`unicredit-personas-credibility`** (personas, copy/credibility rules, verified analytics naming) — HANDOVER §5 mirrors it.

## ⚠️ Do NOT read these wholesale (context / size hazard)
- **`docs/*.pptx`** (up to ~2.8 GB) and **`docs/*.mp4` / `*.mov`** — large binaries, **git-ignored (local‑only)**: they are **not in a fresh clone**. Never `Read` them (it will blow context / fail). They are Adobe source-of-truth decks (e.g. `Summit 2026 Analytics Track MEGA DECK.pptx`).
  - The facts already extracted from them are distilled in **HANDOVER §5.3** and the memory above — use those.
  - If you must re-verify and the file is present locally, extract slide text selectively:
    ```bash
    cd /tmp && unzip -q "<path>/<deck>.pptx" 'ppt/slides/*.xml'
    # then strip <a:t> runs per slide and grep for the term you need
    ```
- Generated assets under `apps/*/src/assets/generated/` — binary; don't read.

## Keeping this current
When state changes materially, update **HANDOVER.md** (it's the living state doc) and, if a
durable fact changes, the relevant memory file. This README only changes if the **set** of docs
or the reading order changes.
