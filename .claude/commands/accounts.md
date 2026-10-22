---
description: "Vista d'insieme su tutti gli account, Adobe compresa: cosa è scaduto, cosa è fermo da settimane, chi ha la palla. Uso: /accounts [fermi]"
argument-hint: "[fermi]"
---

Dai la vista d'insieme sugli account. Argomento ricevuto: `$ARGUMENTS`

1. Esegui `pnpm --silent accounts` (con `--fermi` se l'argomento è `fermi`) da qualunque
   cartella del repo. Fuori dal repo l'utente ha la funzione di shell `accounts`, che fa
   la stessa cosa — è documentata in `docs/CLAUDE.md`.
2. Riporta l'esito **sintetizzato**, non incollato: in testa ciò che chiede attenzione oggi
   — passi scaduti e account fermi — poi il resto.
3. Se qualcosa è scaduto o fermo da settimane, **proponi** da quale cominciare e perché. Un
   account fermo con un caso bloccato su un terzo pesa più di un account fermo senza casi
   aperti; un account con una data vicina in calendario pesa più di uno senza.
4. Non aprire la posta e non leggere i registri uno per uno: per quello c'è
   **`/account-open`** sul singolo account, ed è lì che si confronta con i thread.
5. **WhatsApp è una fonte, sempre** — per questo comando e per tutto ciò che ne deriva
   (apertura del giro, grafo dei contatti, `/account-open`, `/account-close`). Lo script
   non lo legge: legge solo file locali, per restare a zero token. Quindi quando dallo
   script nasce un giudizio su **un** account — «è fermo», «non ha risposto», «va
   sollecitato» — quel giudizio **non si dà** senza aver guardato WhatsApp su quella
   persona: su quel numero arrivano le cose dette in fretta, e sono le più recenti che hai.
   Se Centralino non risponde, si dichiara la fonte **cieca** nell'esito; non si dichiara
   completo un giro con WhatsApp non letto. Il perché sta in `docs/CLAUDE.md`, sezione
   «WhatsApp è sempre una fonte».

Lo script legge i `ACCOUNT.md`, quindi un account «senza registro» non vuol dire «senza
lavoro»: vuol dire che il registro non è ancora nato, e lo crea il primo `/account-open`.
Se l'elenco dei senza registro è lungo, dillo una volta e non ripeterlo.
