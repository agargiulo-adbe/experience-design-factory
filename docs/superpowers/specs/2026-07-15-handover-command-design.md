# `/handover` — comando custom per documentazione di handover (design)

**Data:** 2026-07-15 · **Stato:** approvato

## Problema
Una nuova sessione di Claude Code, all'avvio, legge la documentazione di handover
(`docs/README.md` → `docs/HANDOVER.md`, oltre a `CLAUDE.md` e `MEMORY.md` auto-caricati).
In "modalità handover dettagliata" `HANDOVER.md` cresce e può superare ciò che il tool
`Read` restituisce in una singola chiamata (limite 2000 righe · troncamento riga >2000 char ·
budget token per chiamata), rendendo la doc solo parzialmente leggibile a inizio sessione.

## Obiettivo
Un comando `/handover` che (1) aggiorna la doc di handover in modo dettagliato, (2) impone
un contratto di dimensione file-per-file, (3) splitta per sezione quando serve, e (4) verifica
per davvero che ogni file sia leggibile in una singola `Read` da una nuova sessione.

## Decisioni
- **Comando:** slash command di progetto → `.claude/commands/handover.md` (versionato).
- **Split:** ai confini di sezione `##` → parti numerate `docs/HANDOVER-01.md`, `-02.md`… Mai
  spezzare a metà sezione. `HANDOVER.md` resta sempre presente: se splittato diventa un
  **manifest/router** (sotto soglia) che elenca le parti; così i puntatori esistenti
  (`CLAUDE.md` → README → HANDOVER) restano validi senza modificare `CLAUDE.md`.
- **Soglia (conservativa):** `≤1500 righe` AND `≤48 KB` (49152 byte) AND `nessuna riga >1800 char`.
  Costanti in testa al comando, facili da ritoccare.
- **Verifica:** `Read` completa di ogni file → l'ultimo numero di riga mostrato deve combaciare
  con `wc -l` e non deve esserci alcun avviso di troncamento / "file too large". Tabella di report.

## Algoritmo (idempotente, auto-sanante)
1. **Stato:** `git log` dei commit recenti + `git status` + branch; leggi README/HANDOVER (+ parti).
2. **Ricostruisci** il contenuto handover logico completo (se già splittato, concatena le parti in ordine).
3. **Aggiorna** i contenuti in modalità dettagliata (stato per-experience, change log datato con date
   assolute, pending, fatti verificati); mantieni la struttura a sezioni.
4. **Partiziona:** se il contenuto completo ≤ soglia → scrivi tutto in `HANDOVER.md` e rimuovi eventuali
   `HANDOVER-NN.md` stantii. Se > soglia → partiziona greedy ai `##` in parti ≤ soglia; se una singola
   sezione supera la soglia, spezzala ai `###` e annotalo. Riscrivi `HANDOVER.md` come manifest.
5. **README index:** aggiorna la riga handover (single-file vs multi-parte) e l'ordine di lettura; nessun link morto.
6. **Verifica leggibilità** via `Read` su README + HANDOVER + ogni parte; warn-only su `CLAUDE.md`/`MEMORY.md`.
   Se un file fallisce → split ulteriore e ri-verifica finché tutti passano. Stampa la tabella.
7. **Commit + push** (conventional commit).

## Modalità
- `/handover` — flusso completo (aggiorna + split + verifica + commit).
- `/handover check` — solo misura + verifica leggibilità, nessuna riscrittura/commit; segnala i file oltre soglia.

## Fuori scope (YAGNI)
Non modifica `CLAUDE.md` (README è il router stabile). Nessun auto-merge aggressivo delle parti quando
si rimpiccioliscono: solo report. Non tocca doc fuori da `docs/` (es. spec/plan storici).
