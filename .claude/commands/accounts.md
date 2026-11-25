---
description: "Vista d'insieme su tutti gli account, Adobe compresa: cosa è scaduto, cosa è fermo da settimane, chi ha la palla; con `rinfresca`, i renewal brief di Labrador sui rinnovi vicini. Uso: /accounts [fermi|rinfresca]"
argument-hint: "[fermi|rinfresca]"
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

## `/accounts rinfresca` — i renewal brief di Labrador sui rinnovi vicini

Lo snapshot di Panorama si rifà a mano una volta al mese, e fra un giro e l'altro i rinnovi
vicini invecchiano. Labrador risponde **oggi**, ma un account alla volta e con un budget di
chiamate condiviso: quindi lo script **sceglie** a zero token, e la sessione chiama.

1. `pnpm --silent accounts --labrador` → righe `RINFRESCA <account> · Sub <id|da risolvere> ·
   rinnovo <data> <prodotti> · brief <età|mai fatto>`. Al massimo **sei**, prima quelle con
   un rinnovo che conta per il piano. Output vuoto = niente da rinfrescare: dillo e fermati.
2. Per ogni riga, **una alla volta** (mai in parallelo):
   - `Sub da risolvere` → `ask_labrador_chat` col nome; dalla lista scegli l'entità giusta
     (geo, nome esatto) e scrivila in `docs/Adobe/Radar/Labrador/sub_id.md`. Se è ambigua,
     **non scegliere**: salta la riga e chiedi;
   - `ask_renewal_brief` con «<nome>, Sub ID <id>, EMEA»;
   - salva la risposta grezza in `Radar/Labrador/<account>_AAAAMMGG-brief.md` (formato in
     `LEGGIMI.md`).
   Un `rate_limited` → aspetta `retry_after_seconds` **una volta**; al secondo, fermati e
   di' quante righe restano.
3. Riferisci per account, **sintetizzato**: solo ciò che cambia la lettura del Radar —
   utilizzo sotto il commit su un rinnovo eleggibile (è il primo argomento del procurement),
   casi di supporto aperti, righe in scadenza che il Radar non aveva, scarti di ARR. Gli
   scarti si **propongono** come correzioni del Radar con la fonte `Labrador brief <data>`;
   non si scrivono da qui.
4. Valgono i limiti misurati scritti in `/account-open` (passo 1bis): niente sforamenti,
   niente concorrenti, il team non si legge da lì, l'AI Summary è un riassunto automatico.

Lo script legge i `ACCOUNT.md`, quindi un account «senza registro» non vuol dire «senza
lavoro»: vuol dire che il registro non è ancora nato, e lo crea il primo `/account-open`.
Se l'elenco dei senza registro è lungo, dillo una volta e non ripeterlo.
