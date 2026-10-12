---
description: "Una riga per conto: dove siamo, chi ha la palla, cosa è scaduto, cosa è fermo da settimane. Uso: /conti [fermi]"
argument-hint: "[fermi]"
---

Dai la vista d'insieme sui conti cliente. Argomento ricevuto: `$ARGUMENTS`

1. Esegui `pnpm --silent conti` (con `--fermi` se l'argomento è `fermi`) dalla radice
   del repo.
2. Riporta l'esito **sintetizzato**, non incollato: in testa ciò che chiede attenzione
   oggi — passi scaduti e conti fermi — poi il resto.
3. Se qualcosa è scaduto o fermo da settimane, **proponi** da quale cominciare e perché.
   Un conto fermo con un caso bloccato su un terzo pesa più di un conto fermo senza casi
   aperti.
4. Non aprire la posta e non leggere i registri uno per uno: per quello c'è `/conto` sul
   singolo cliente, ed è lì che si confronta con i thread.

Lo script legge i `CONTO.md`, quindi un cliente «senza registro» non vuol dire «senza
lavoro»: vuol dire che il registro non è ancora nato. Se l'elenco dei senza registro è
lungo, dillo una volta e non ripeterlo.
