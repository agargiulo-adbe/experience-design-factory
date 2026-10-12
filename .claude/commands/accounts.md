---
description: "Vista d'insieme su tutti i conti, Adobe compresa: cosa è scaduto, cosa è fermo da settimane, chi ha la palla. Uso: /accounts [fermi]"
argument-hint: "[fermi]"
---

Dai la vista d'insieme sui conti. Argomento ricevuto: `$ARGUMENTS`

1. Esegui `pnpm --silent accounts` (con `--fermi` se l'argomento è `fermi`) da qualunque
   cartella del repo. Fuori dal repo l'utente ha la funzione di shell `accounts`, che fa
   la stessa cosa — è documentata in `docs/CLAUDE.md`.
2. Riporta l'esito **sintetizzato**, non incollato: in testa ciò che chiede attenzione oggi
   — passi scaduti e conti fermi — poi il resto.
3. Se qualcosa è scaduto o fermo da settimane, **proponi** da quale cominciare e perché. Un
   conto fermo con un caso bloccato su un terzo pesa più di un conto fermo senza casi
   aperti; un conto con una data vicina in calendario pesa più di uno senza.
4. Non aprire la posta e non leggere i registri uno per uno: per quello c'è
   **`/account-open`** sul singolo conto, ed è lì che si confronta con i thread.

Lo script legge i `CONTO.md`, quindi un conto «senza registro» non vuol dire «senza
lavoro»: vuol dire che il registro non è ancora nato, e lo crea il primo `/account-open`.
Se l'elenco dei senza registro è lungo, dillo una volta e non ripeterlo.
