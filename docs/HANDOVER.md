# HANDOVER — Experience Design Factory

> Documento di passaggio di consegne. Stato al **2026-10-04**.
> Lingua: italiano per la narrativa, inglese per path/comandi/nomi prodotto.
> Companion di `CLAUDE.md` (guida agente, sempre valida) e delle memorie in
> `~/.claude/projects/.../memory/`. Se una cosa qui contraddice il codice, **vince il codice** —
> segnalalo e aggiorna questo file.
>
> **Nuova sessione CC:** l'indice/ordine di lettura è in `docs/README.md`. Leggere **tutti** i
> `.md` costa ~20k token (ok). **Non** aprire mai i `.pptx`/`.mp4` in `docs/` (binari giganti,
> git-ignored, non presenti in un clone pulito) — i fatti utili sono già distillati qui (§5.3).
>
> ✅ **Working tree pulito al 4 ott 2026.** Il 3 ott è stato una giornata in due tempi: la tassonomia in vetrina
> più il terzo giro di panel (§13.10–13.11, Parte 5), e poi una **verifica generale** che ha trovato
> lo stesso difetto — stili scoped di Astro contro DOM costruito a runtime — in **altri due posti**,
> fra cui `AdminConsole.astro`, cioè l'editor delle slide personalizzate **senza stile in 11 app**.
> Corretto e verificato. Corretta anche, alla fonte, la GA di CX Enterprise Coworker su Analytics
> (è un **rollout**, GA **TBD**) in vetrina, hub e deck Poste. Build+typecheck+lint verdi.
> Il **backlog P0 di §10 (Parte 2)** resta la prima cosa da leggere: apre con i nomi di referenti
> cliente dentro file tracciati su un repository pubblico.

---

<!-- HANDOVER-SPLIT -->

Handover splittato per dimensione (contratto `/handover`: ≤1500 righe, ≤48 KB, ≤1800 char per riga).
**Leggi le parti in ordine.** Se devi decidere cosa fare, la Parte 2 basta: è il backlog P0/P1.

- [Parte 1 — §1–8: stato generale, architettura, comandi, tipo per esperienza, UniCredit content model, Admin Console, audit](./HANDOVER-01.md) — come è fatta la Factory e come si lavora.
- [Parte 2 — §9 Deploy & segreti · §10 backlog **P0 e P1**](./HANDOVER-02.md) — **leggila per prima**: cosa resta da fare adesso.
- [Parte 3 — §11 change log datato (recente)](./HANDOVER-03.md) — dal 3 ott 2026 all'indietro.
- [Parte 4 — §11 change log datato (seguito)](./HANDOVER-04.md) — la storia più vecchia.
- [Parte 5 — §12 puntatori · §13 **Factory Showcase** · §14 Ferrari /scoping](./HANDOVER-05.md) — la vetrina in iperdettaglio, fino a §13.12 (la verifica generale del 3 ott).
- [Parte 6 — §15 hub e parity · §16 Agos · §17 Brand Visibility e de-AI · §18–20 Ferrari /scoping · §22 **core trasversali**](./HANDOVER-06.md) — §22 contiene la regola sugli stili scoped contro il DOM a runtime.
- [Parte 7 — §26 FS Park × Trenitalia · §27 UniCredit attribution e dossier · §28 MIM](./HANDOVER-07.md).
- [Parte 8 — §29 pipeline Firefly · §30 Aperture · §31 Isybank · §32 **Poste «Sei domande»**](./HANDOVER-08.md) — §32 apre con la correzione del claim portante (rollout, non GA).
- [Parte 9 — §21 Experience Atelier · §23 redesign E2E · §24 Eni · §25 core responsive e nav](./HANDOVER-09.md).
- [Parte 10 — §10.b backlog **P2 e note non azionabili**](./HANDOVER-10.md) — la coda della §10, spezzata ai sotto-livelli perché da sola superava i 48 KB.
- [Parte 11 — §33 **Intesa Sanpaolo «Su scala umana»**](./HANDOVER-11.md) — dossier gated + quattro slide per il 22 ott; perché NON è un'experience e perché l'app non è generata.
