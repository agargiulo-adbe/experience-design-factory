---
description: "Aggiorna la doc di handover in dettaglio, impone il contratto di dimensione (righe/byte/riga), splitta per sezione con manifest e verifica che una nuova sessione riesca a leggerla. Uso: /handover [check]"
argument-hint: "[check]"
---

Sei incaricato di mantenere la documentazione di **handover** del monorepo Experience Design
Factory, così che una **nuova sessione di Claude Code** possa leggerla per intero all'avvio.

Argomento ricevuto: `$ARGUMENTS`
- Se è `check` → esegui **solo** gli step 6–7 (misura + verifica leggibilità) e il report, in
  **sola lettura**: nessuna riscrittura, nessun commit. Segnala i file oltre soglia e fermati.
- Altrimenti → esegui il flusso completo (step 1–8).

## Contratto di dimensione (COSTANTI — ritoccabili qui)
Un file è "leggibile in sicurezza da una nuova sessione" **solo se rispetta TUTTI e tre**:
- `MAX_RIGHE   = 1500`   (il tool Read ne legge max 2000 per chiamata → margine)
- `MAX_BYTE    = 49152`  (48 KB)
- `MAX_RIGA    = 1800`   (caratteri sulla riga più lunga; Read tronca le righe >2000 char)

File che una nuova sessione legge all'avvio (ordine da `docs/README.md`):
`docs/README.md` → `docs/HANDOVER.md` (+ eventuali `docs/HANDOVER-NN.md`). Auto-caricati dal harness:
`CLAUDE.md`, `MEMORY.md` (su questi la verifica è **solo-warning**, non splittarli).

## Step 1 — Stato corrente
- `git log --oneline -20`, `git status --short`, branch corrente.
- Individua cosa è cambiato dall'ultimo aggiornamento handover (cerca l'ultima data nel change log
  di HANDOVER e confronta con i commit successivi).
- Leggi `docs/README.md` e `docs/HANDOVER.md`. Se HANDOVER è un manifest splittato (contiene il marker
  `<!-- HANDOVER-SPLIT -->`), leggi in ordine tutte le `docs/HANDOVER-NN.md` elencate.

## Step 2 — Ricostruisci il contenuto logico completo
Se splittato, concatena i **corpi** delle parti (senza le loro intestazioni di parte) nell'ordine dei
numeri → ottieni l'HANDOVER completo come se fosse un unico file. Altrimenti usa HANDOVER.md così com'è.

## Step 3 — Aggiorna in modalità handover DETTAGLIATA
Aggiorna il contenuto completo mantenendo la struttura a sezioni `##` esistente:
- Stato per-experience (per ognuna: live/draft, cosa fa, ultime modifiche, pending).
- **Change log datato**: aggiungi le voci per i commit nuovi; converti ogni data relativa in **assoluta**
  (usa la data odierna del sistema).
- Pending / TODO / rischi noti aggiornati.
- Fatti verificati (naming prodotti, personas, numeri, fonti) — non inventare: se non sei sicuro, marca `(da verificare)`.
- Non rimuovere storia utile; se una sezione diventa enorme, è lo split (step 5) a gestirla, non il taglio.

## Step 4 — Misura (pre-partizione)
Per il contenuto aggiornato calcola righe, byte, riga più lunga. Decidi se serve lo split (una qualsiasi
soglia superata → split).

## Step 5 — Partiziona (solo se necessario)
- **Sotto soglia** → scrivi tutto in `docs/HANDOVER.md`; **elimina** eventuali `docs/HANDOVER-NN.md`
  stantii; assicurati che NON contenga il marker `<!-- HANDOVER-SPLIT -->`.
- **Oltre soglia** → conta le parti necessarie `nParti = ceil(byte_totali / MAX_BYTE)` e mira a parti
  **bilanciate** (~`byte_totali / nParti` ciascuna) accumulando **sezioni intere ai confini `##`**, senza
  mai superare le soglie hard. **Mai** spezzare a metà una sezione. Se una **singola** sezione `##` da
  sola supera una soglia, spezzala ai `###` e aggiungi una nota `<!-- sezione spezzata a sotto-livello -->`.
  - Scrivi `docs/HANDOVER-01.md`, `-02.md`, … Ogni parte inizia con:
    ```
    # Handover — Parte N di M
    > Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)
    ```
    seguita dalle sue sezioni `##`.
  - Riscrivi `docs/HANDOVER.md` come **manifest/router** (deve stare sotto soglia): titolo, riga
    `<!-- HANDOVER-SPLIT -->`, breve istruzione ("Handover splittato per dimensione: leggi le parti in
    ordine"), e l'elenco `- [Parte N — titoli sezioni](./HANDOVER-0N.md) — riassunto in una riga`.

## Step 6 — README come indice/router
Aggiorna `docs/README.md`: la voce dell'handover deve riflettere single-file **oppure** multi-parte
(puntando a `HANDOVER.md`, che a sua volta instrada). Verifica che l'ordine di lettura e tutti i link
puntino a file esistenti (nessun link morto). Verifica anche che il puntatore in `CLAUDE.md`
("leggi prima docs/README.md") resti coerente; se non lo è, **segnalalo** (non modificare CLAUDE.md).

## Step 7 — VERIFICA di leggibilità (obbligatoria)
Per **ogni** file che una nuova sessione legge (`docs/README.md`, `docs/HANDOVER.md`, ogni
`docs/HANDOVER-NN.md`): esegui una `Read` COMPLETA (senza `offset`/`limit`) e controlla che
1. l'ultimo numero di riga mostrato coincida con `wc -l` del file (⇒ nessun troncamento),
2. non compaia alcun avviso di troncamento / "file too large" / richiesta di offset.
Misura anche righe/byte/riga-max e confronta con le soglie. Per `CLAUDE.md` e `MEMORY.md` fai la stessa
Read+misura ma **solo come warning**.
Se un file **fallisce** la Read o supera una soglia → torna allo Step 5, splitta più finemente, e
ripeti la verifica finché **tutti** passano.
Stampa una tabella: `file · righe · KB · riga_max · soglie(ok/❌) · Read-OK(✓/✗)`.

## Step 8 — Commit + push
Solo in modalità completa: `git add` dei file doc toccati (`docs/README.md`, `docs/HANDOVER*.md`) —
**non** usare `git add -A` (il repo ha file enormi git-ignorati e `dist/`). Commit conventional
(`docs(handover): …`) e `git push`. Chiudi con la tabella di verifica.

## Regole
- Non toccare `CLAUDE.md`/`MEMORY.md` (solo warning). Non committare segreti né file binari/grandi.
- Idempotente: rilanciarlo senza cambiamenti nei commit non deve stravolgere i file (solo eventuale ribilanciamento delle parti).
- Se `check`: nessuna scrittura, nessun commit — solo report; exit segnalando se qualcuno è oltre soglia.
