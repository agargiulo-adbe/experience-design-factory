# HANDOVER — Experience Design Factory

> Documento di passaggio di consegne. Stato al **2026-10-02**.
> Lingua: italiano per la narrativa, inglese per path/comandi/nomi prodotto.
> Companion di `CLAUDE.md` (guida agente, sempre valida) e delle memorie in
> `~/.claude/projects/.../memory/`. Se una cosa qui contraddice il codice, **vince il codice** —
> segnalalo e aggiorna questo file.
>
> **Nuova sessione CC:** l'indice/ordine di lettura è in `docs/README.md`. Leggere **tutti** i
> `.md` costa ~20k token (ok). **Non** aprire mai i `.pptx`/`.mp4` in `docs/` (binari giganti,
> git-ignored, non presenti in un clone pulito) — i fatti utili sono già distillati qui (§5.3).
>
> ✅ **Working tree pulito al 2 ott 2026, sera.** Il lavoro del 1–2 ott (showcase dopo i due giri di
> panel, `noindex` sui cinque deck che non l'avevano, minimi tipografici, fix su Ferrari) e il terzo
> giro di panel su Poste, col marchio nuovo e l'anteprima del link, sono **committati, spinti e
> online** (`f2b60f8` → `ef5f741`, deploy Pages success). Il backlog P0 di §10 (Parte 2) resta la prima cosa da leggere prima di decidere.

---

<!-- HANDOVER-SPLIT -->

> **Handover splittato per dimensione** (9 parti, contratto ≤48KB/≤1500 righe per file). Leggile in ordine — ognuna è leggibile in una singola `Read`.

- [Parte 1 di 9](./HANDOVER-01.md) — §1 Cos'è e stato generale (**nove esperienze cliente** + Aperture/Atelier/hub/showcase/console) · 2 Architettura · 3 **Comandi** (`brand:tokens`, `new:experience`, `loop:seamless`, i comandi-skill) · 4 **Stato per esperienza, col tipo** · 5 **UniCredit content model** · 6 Feature runtime deck · 7 **Admin Console — 4 tab** · 8 **Audit — 12 check**, la lezione sul gate che mentiva e, dal 1 ott, quella sul connettore che esce dal suo box — ⚠️ **§9 Deploy è stata spostata nella Parte 2** (ribilanciamento del 2 ott)
- [Parte 2 di 9](./HANDOVER-02.md) — §9 **Deploy & segreti** (spostata qui dalla Parte 1) · §10 **Pending / backlog prioritario** — **leggi il backlog per primo se devi decidere cosa fare**. **P0**: giro **delta** del panel su Poste (le correzioni sono state applicate dopo che le personas avevano letto il deck) · le **due decisioni** che il panel non può prendere per l'autore (dove vivono le experience con marchio cliente; richiesta a Security/Legal) · **sei fallimenti HARD aperti** su Max Mara (5) e UniCredit (1). Poi i P1 e i P2.
- [Parte 3 di 9](./HANDOVER-03.md) — §11 **Change log datato, parte 1** (in cima **2 ott sera tardi: marchio «faccia del sei» e anteprima del link con immagine; poi voce del deck al plurale istituzionale (regola BINDING nuova), prova esterna su Poste verificata e tenuta fuori dal deck, 15 fatti refutati corretti dal terzo panel, tutto committato, spinto e online**; poi **1 ott sera → 2 ott: migrazione 0016 applicata, minimi tipografici, 3 HARD preesistenti chiusi su Ferrari, showcase portato a due giri di panel con personas reali, le otto domande ad Adobe chiuse alla fonte**; poi 1 ott pom. tassonomia e `new:experience`; poi la skill `panel-review`; poi Poste «Sei domande»; poi 14 set Atelier; 11–12 set firma co-brand, loop, credito, design system letto dal sito; 10 set UniCredit; 9 set Isybank; …)
- [Parte 4 di 9](./HANDOVER-04.md) — §11 **Change log datato, parte 2** (continua dall'8 set: Aperture, Atelier, FSTechnology, UniCredit workshop cut, MIM, Eni, biforcazione FS, redesign E2E, e a scendere fino a giugno)
- [Parte 5 di 9](./HANDOVER-05.md) — §12 Puntatori · 13 **Factory Showcase** (§13.7 catena di build · §13.8 tipo sulle card e primo panel · **§13.9 panel giro 2 con personas reali: cosa è stato confutato e cosa è stato applicato**) · 14 **Ferrari /scoping** · 15 Root hub, parity & Connessioni Intelligenti (vincoli LOCKED) — ⚠️ **§16 Agos è stata spostata nella Parte 6** (ribilanciamento del 2 ott)
- [Parte 6 di 9](./HANDOVER-06.md) — §16 **Trait d'Union — Agos** (spostata qui dalla Parte 5) · 17 Adobe Brand Visibility + de-AI copy + /handover · 18–20 Ferrari /scoping · 22 Core trasversali (§22.4 regole BINDING) · 23 **Redesign E2E 6 deck** · 24 **Orbita — Eni** · 25 Core responsive + nav single-line — ⚠️ **§21 Experience Atelier è nella Parte 9**
- [Parte 7 di 9](./HANDOVER-07.md) — §26 **Biforcazione FS Park × Trenitalia** (+ §26.8 dossier FSTechnology) · 27 **UniCredit — Attribution «Analizza» + Dossier** · 28 **«La voce del Ministero» — MIM**
- [Parte 8 di 9](./HANDOVER-08.md) — §29 **Firefly asset+video pipeline** (+ §29.3 regole BINDING · §29.4 API immagine Adobe) · 30 **Aperture** · 31 **«Il momento giusto» — Isybank** · **32 «Sei domande» — Poste** (§32.5 panel review · §32.6 tipo Playbook e minimi tipografici · §32.7 le otto domande ad Adobe chiuse alla fonte · **§32.8 terzo giro di panel: 15 fatti refutati corretti, i due P0 che restano** · §32.9 marchio e anteprima del link)
- [Parte 9 di 9](./HANDOVER-09.md) — §21 **Experience Atelier** (spostata qui dalla Parte 6 per dimensione): storia del deck trilingue, disciplina dei fatti, passate del 20 lug / 8 set / 14 set, e in fondo **§21.8 redesign sulle tre mosse (14 set)** — struttura a 36 slide con `gap`/`moves`, taglio sponsor a 20, le due prove (telemetria del deck + MCP server `atelier`), calendario nov 2026 → giu 2027, esito dei gate
