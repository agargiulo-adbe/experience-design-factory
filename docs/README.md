# docs/ — start here (reading guide for a new Claude Code session)

This index tells a fresh CC session **what to read, in what order, and what to avoid**, so
you get up to speed without wasting context. Everything tracked here is small Markdown —
reading **every** doc below costa ~**40k token** (l'handover da solo ne vale ~36k su 19 parti). Read on demand;
you don't need all of it for most tasks.

## Due mestieri, due guide
`docs/` ospita **due cose diverse**, e la guida giusta dipende da che cosa stai facendo:
- **lavoro sulla Factory** (experience, deck, motore) → continua a leggere questo file;
- **lavoro operativo d'account** (una mail, un'analisi, un rinnovo, un blocco contrattuale
  su un cliente) → la guida è **`docs/CLAUDE.md`**, che si carica da sé, più il registro
  `docs/<Account>/ACCOUNT.md` e i comandi `/account-open`, `/account-close` e `/accounts`. Lì le regole dei deck **non
  si applicano**, e c'è scritto perché. Da fuori sessione la stessa parola è una funzione di shell:
  `accounts` per il quadro, **`accounts --apertura`** per la conversazione da avviare oggi e
  **`accounts --decidi <id> si|no|dopo`** per la risposta (§39.8-39.9, Parte 16). Spec:
  `docs/superpowers/specs/2026-10-12-account-operativo-design.md` e
  `…/2026-10-13-apertura-conversazioni-design.md`.

⚠️ Le cartelle cliente sotto `docs/` sono **ignorate da git** (`docs/.gitignore` è
fail-closed: ignora tutto e riammette i soli documenti della Factory). Il repo è
**pubblico**: niente di quelle cartelle si copia in un file tracciato. Gate: `pnpm audit:docs`.

## What loads automatically (don't re-read)
- **`/CLAUDE.md`** (**~23k tok**, 940 righe — misurato il 29 ott 2026; il «~4k» scritto qui prima era vecchio di mesi) — agent guide, Quality Bar, deck contract, **Type & legibility contract (BINDING for every deck slide)**, aesthetics. Auto-loaded every session.
- **memory `MEMORY.md`** (~7k tok) — index of auto-memories, **124 al 29 ott 2026**. ⚠️ Il file è a 27,4 KB su un tetto di 24,4: il harness ne carica **solo una parte**, quindi qualche voce dell'indice non si vede (P1, Parte 10). Originariamente **111 al 19 ott 2026** (nuove: `grafo-contatti-dalla-posta` e `apertura-e-giro-di-ritorno`; `launchd-non-e-la-tua-shell` aggiornata con «`env -i` non è launchd»). I singoli file si caricano a richiamo, non tutti insieme.

## Read order (on demand, via the Read tool)
1. **`docs/HANDOVER.md`** — **read this first.** Dated current state (**2026-10-29**). **Splittato per dimensione** (contratto ≤48KB/≤1500 righe/≤1800 char per riga, via il comando `/handover`): `HANDOVER.md` è un **manifest** che instrada a **19 parti**, da leggere in ordine (≈36k tok totali; ognuna sta in una singola `Read`). La mappa sezione→parte sta nel manifest e non si duplica qui; cinque cose vale la pena sapere prima di aprirlo:
   - **Se devi decidere cosa fare, la Parte 2 basta**: contiene il **backlog P0 e P1 caldi**. Al 29 ott conta **18 P0 e 32 P1** (Parte 2), più **29 P1 di fondo** nella Parte 10 e **49 P2** nella **Parte 19**, nata il 29 ott quando la Parte 10 è arrivata a 168 byte dal tetto. ⚠️ **I due P0 nuovi sono di Unipol**: l'experience «Cinque domande» e quindici file tracciati **non sono committati** (stanno solo sul disco, e su un ramo che parla d'altro), e non ha mai visto una panel review. ⚠️ **Intesa «Dove ci innestiamo» va in sala il 5 novembre senza panel**, ed è cambiata ancora il 27 ott. ⚠️ **Il panel di «Connessioni Intelligenti» copre ora un deck di due riscritture fa**: al perimetro ridotto del 9 ott si è aggiunto il 28 un capitolo intero di casi d'uso. Il P0 più vecchio e più pesante resta quello dei **18 file di un altro workstream finiti su `main`**, e il P1 del 13 ott sono i **480 rilievi di copia** che `copy-audit` non vedeva finché leggeva solo gli attributi bilingui.
   - **Il motore dei dossier interni sta nella Parte 11 (§34)**, non fra i core trasversali: ha regole di contenuto e di ricerca proprie, e una skill (`skills/dossier/`) con il suo gate `pnpm audit:dossier`. ⚠️ Il dossier FSTechnology di `trenitalia-connessioni` **è stato riportato sul motore** il 15 ott (da 533 righe a un wrapper gated di 43): quel P0 è chiuso, resta un P2 sulla storia di git. **`eni-orbita`** ha ancora il contenuto nel bundle statico.
   - **Le parti sono ribilanciate quando una tocca il tetto**, quindi *la numerazione delle sezioni non segue quella delle parti*: §8 sta nella Parte 18, §15 nella 6, §23–25 nella 9, §35 nella 15; **§32 (Poste) è spezzata su due parti** (12 e 13), il **change log §11 su quattro** (3 → 4 → 14 → 17) e il **backlog §10 su tre** (2 caldo → 10 P1 di fondo → **19 P2**, nata il 29 ott). ⚠️ **Le dimensioni per parte NON si ripetono qui**: erano già invecchiate due volte. Stanno nella «Nota di dimensione» del manifest, che è l'unico posto dove si aggiornano — **fidati di quella, non di questa pagina e non della memoria**.
   - 🆕 **Due cose nate fra il 27 e il 28 ott**: **Unipol «Cinque domande»** (`apps/unipol-cinque-domande`, Playbook, **§41, Parte 18**) — il secondo Playbook dopo Poste, con un ottavo capitolo «registro» che cresce a ogni sessione — e il **capitolo dei casi d'uso** di «Connessioni Intelligenti» (**§36.10, Parte 8**). ⚠️ Unipol **non è committata**: se non la trovi in `git log`, è perché sta solo nel working tree.
   - ⚠️ **Le experience Trenitalia sono due, e non vanno confuse**: «Connessioni Intelligenti» (`trenitalia-connessioni`, Blueprint, il tavolo FSTechnology) e **«Dove può arrivare il viaggio»** (`trenitalia-prospettiva-sales`, Prospettiva per la **Direzione Sales**, nata l'11 ott) — quest'ultima sta in **§37, Parte 16**. Condividono la pelle letta dal sito del cliente, non il contenuto né l'interlocutore.
   - ⚠️ **Le experience Intesa sono tre**: «Su scala umana» (`intesa-scala-umana`, Prospettiva, la stanza del 22 ott — §33, Parte 11), «Dopo la firma» (`intesa-dopo-la-firma`, il fronte assicurativo — §35, Parte 15) e **«Dove ci innestiamo»** (`intesa-innesto`, Blueprint, **la stanza del 5 novembre** — §40, Parte 18). Sono tre tavoli diversi dello stesso gruppo, con pubblici diversi: non si citano l'uno per l'altro.
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
