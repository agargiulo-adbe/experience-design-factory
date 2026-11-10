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
  si applicano**, e c'è scritto perché. Da fuori sessione la stessa parola è una funzione di shell:
  `accounts` per il quadro, **`accounts --apertura`** per la conversazione da avviare oggi e
  **`accounts --decidi <id> si|no|dopo`** per la risposta (§39.8-39.9, Parte 16). Spec:
  `docs/superpowers/specs/2026-10-12-account-operativo-design.md` e
  `…/2026-10-13-apertura-conversazioni-design.md`.

⚠️ Le cartelle cliente sotto `docs/` sono **ignorate da git** (`docs/.gitignore` è
fail-closed: ignora tutto e riammette i soli documenti della Factory). Il repo è
**pubblico**: niente di quelle cartelle si copia in un file tracciato. Gate: `pnpm audit:docs`.

## What loads automatically (don't re-read)
- **`/CLAUDE.md`** (~4k tok) — agent guide, Quality Bar, deck contract, **Type & legibility contract (BINDING for every deck slide)**, aesthetics. Auto-loaded every session.
- **memory `MEMORY.md`** (~3k tok) — index of auto-memories, **111 al 19 ott 2026** (nuove: `grafo-contatti-dalla-posta` e `apertura-e-giro-di-ritorno`; `launchd-non-e-la-tua-shell` aggiornata con «`env -i` non è launchd»). I singoli file si caricano a richiamo, non tutti insieme.

## Read order (on demand, via the Read tool)
1. **`docs/HANDOVER.md`** — **read this first.** Dated current state (**2026-11-10**). **Splittato per dimensione** (contratto ≤48KB/≤1500 righe/≤1800 char per riga, via il comando `/handover`): `HANDOVER.md` è un **manifest** che instrada a **21 parti**, da leggere in ordine (≈34k tok totali; ognuna sta in una singola `Read`). La mappa sezione→parte sta nel manifest e non si duplica qui; quattro cose vale la pena sapere prima di aprirlo:
   - **Se devi decidere cosa fare, la Parte 2 basta**: contiene il **backlog P0 e P1 caldi**. Al 10 nov conta **20 P0 e 32 P1**, più **27 P1 di fondo
     e 48 P2** nella Parte 10. ⚠️ **La Prospettiva Sales di Trenitalia ha la stanza il 10 novembre** ed è in rete: il panel è del 9 nov e non copre il giro del 10 (§37.18-19, Parte 19), e il perimetro Analytics/Target è ancora da portare nel deck. Subito dopo viene il gate 3.4 su **BPER**, stanza
     il **12 novembre**. ⚠️ **Per l'incontro Intesa ci sono DUE experience e su nessuna delle due il panel è mai stato lanciato** — «Adobe × Intesa
     Sanpaolo» (§42, Parte 18) e «Dove ci innestiamo» (§40, Parte 18): la Storia è slittata al **19 nov**, la stanza del Blueprint era il **5 nov** e
     se si è tenuta l'esito non è registrato; **le personas di quel tavolo si scrivono una volta** perché servono a entrambe. ⚠️ «Su scala umana» è
     andata in sala il 22 ott senza panel: è il P0 più vecchio (§33.10, Parte 11). ⚠️ Stessa forma sulla **Storia di Intesa**: panel del 30 ott,
     quattro commit di contenuto la notte fra il 6 e il 7. Il P0 più pesante resta quello dei **18 file di un altro workstream finiti su `main`**
     (§38, Parte 16), e il P1 del 13 ott sono i **480 rilievi di copia** che `copy-audit` non vedeva finché leggeva solo gli attributi bilingui.
   - **Il motore dei dossier interni sta nella Parte 11 (§34)**, non fra i core trasversali: ha regole di contenuto e di ricerca proprie, e una skill (`skills/dossier/`) con il suo gate `pnpm audit:dossier`. ⚠️ Il dossier FSTechnology di `trenitalia-connessioni` **è stato riportato sul motore** il 15 ott (da 533 righe a un wrapper gated di 43): quel P0 è chiuso, resta un P2 sulla storia di git. **`eni-orbita`** ha ancora il contenuto nel bundle statico.
   - **Le parti sono ribilanciate quando una tocca il tetto**, quindi *la numerazione delle sezioni non segue sempre quella delle parti*: §15 è passata alla Parte 6,
     §8 alla Parte 18, §23–25 alla Parte 9, §10.b alla Parte 10, e **§32 (Poste) è spezzata a sotto-livello su due parti** — 12 (§32.1–32.9) e **13** (§32.10–32.12);
     **§35 (Intesa Assicurazioni) è uscita dalla Parte 11 ed è la Parte 15**. Il change log §11 sta su **cinque** parti: 3 (recente, dal **9 nov** al 26 ott) → 4
     (seguito) → **14** (coda) → **17** (settembre) → **20** (luglio, creata il 3 nov); l'ultimo ribilanciamento è del **21 ott**: la solita catena 3 → 4 →
     14 → 17, più la **Parte 1 che ha ceduto per la prima volta** — §8 è scesa nella **Parte 18**, creata in coda. **Le Parti 16 e 17 sono nuove del 12 ott**: la 16
     tiene §37 (la Prospettiva per la Direzione Sales di Trenitalia, con il panel in §37.7 e il giro di linearità in §37.10) e §38 (TIM); **§39, il lavoro
     operativo d'account, è uscita nella Parte 21 il 4 nov** — e dal 13 ott arriva fino a **§39.9: il grafo dei contatti, l'apertura di ogni mattina e il giro
     di ritorno delle decisioni**. ⚠️ Rimisurate il
     **3 nov**, dopo un giro che ha richiesto **due parti nuove**: §43 (BPER) è uscita dalla 18 — che aveva sforato a 51,8 KB — ed è la **Parte 19**; le voci di
     luglio del change log sono scese nella **Parte 20**, perché la catena 3 → 4 → 14 → 17 non si chiudeva (la voce da spostare pesava 7,5 KB, il margine della 17 ne
     aveva 4,2). Rimisurate il **6 nov**, dopo un giro che ha richiesto la catena **3 → 4 → 14 → 17** e lo spostamento di **§9 (Deploy & segreti) dalla Parte 2 alla Parte 1**, per
     far posto al backlog. Rimisurate il **7 nov**, con la stessa catena **3 → 4 → 14 → 17 → 20** e una riserva di 2,5 KB lasciata a ogni anello perché il prossimo giro non debba
     ribilanciare. Rimisurate il **9 nov**, con la catena piena **3 → 4 → 14 → 17 → 20** e la catena del backlog **2 → 10** (tre P1 scesi). ⚠️ **Il punto stretto si è spostato sul backlog**: la **Parte 10 è a 576 byte** dal tetto e **la catena 2 → 10 è esaurita** — al prossimo giro che tocca il backlog **serve la Parte 22**, scorporandoci i 48 P2 di §10.b. Le altre a filo sono la **7** (49,0 · ⚠️ **145 byte**, da anni non toccata), la **2** (48,2 · 958 byte), la **4** (47,9 · 1,3 KB) e la **16** (48,1) su 48; la **4** è a 44 caratteri dal tetto di RIGA. Quelle con più spazio restano la **19** (11,7), la **21** (22,4), la **13** (24,6) e la **15** (27,8). Il manifest è sempre aggiornato; fidati di quello, non della memoria.
   - ⚠️ **Le experience Trenitalia sono due, e non vanno confuse**: «Connessioni Intelligenti» (`trenitalia-connessioni`, Blueprint, il tavolo FSTechnology) e **«Dove può arrivare il viaggio»** (`trenitalia-prospettiva-sales`, Prospettiva per la **Direzione Sales**, nata l'11 ott) — quest'ultima sta in **§37, Parte 16**. Condividono la pelle letta dal sito del cliente, non il contenuto né l'interlocutore.
   - ⚠️ **Le experience Intesa sono quattro, e DUE sono per la stessa stanza**: «Su scala umana» (`intesa-scala-umana`, Prospettiva, il 22 ott — §33, Parte 11), «Dopo la firma» (`intesa-dopo-la-firma`, il fronte assicurativo — §35, Parte 15) e, **entrambe per il 5 novembre**, **«Dove ci innestiamo»** (`intesa-innesto`, **Blueprint** tecnico — §40, Parte 18) e **«Adobe × Intesa Sanpaolo»** (`intesa-esperienza-cliente`, **Storia** per il business, nove capitoli — §42, Parte 18). Le prime due sono tavoli diversi e non si citano l'una per l'altra; le ultime due sono lo **stesso** tavolo visto da due lati, e la console della Storia rimanda ai dossier del Blueprint.
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
