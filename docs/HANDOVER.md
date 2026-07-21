# HANDOVER — Experience Design Factory

> Documento di passaggio di consegne. Stato al **2026-07-21**.
> Lingua: italiano per la narrativa, inglese per path/comandi/nomi prodotto.
> Companion di `CLAUDE.md` (guida agente, sempre valida) e delle memorie in
> `~/.claude/projects/.../memory/`. Se una cosa qui contraddice il codice, **vince il codice** —
> segnalalo e aggiorna questo file.
>
> **Nuova sessione CC:** l'indice/ordine di lettura è in `docs/README.md`. Leggere **tutti** i
> `.md` costa ~15k token (ok). **Non** aprire mai i `.pptx`/`.mp4` in `docs/` (binari giganti,
> git-ignored, non presenti in un clone pulito) — i fatti utili sono già distillati qui (§5.3).

---

<!-- HANDOVER-SPLIT -->

> **Handover splittato per dimensione** (3 parti, contratto ≤48KB/≤1500 righe per file). Leggile in ordine — ognuna è leggibile in una singola `Read`.

- [Parte 1 di 3](./HANDOVER-01.md) — §1. Cos'è e stato generale; 2. Architettura; 3. Comandi; 4. Stato per esperienza; 5. UniCredit Engagement — modello di contenuto (dettaglio); 6. Feature runtime del deck (tutte in UniCredit; molte in core); 7. Admin Console; 8. Deck visual contract & audit; 9. Deploy & segreti; 10. Pending / TODO / rischi noti; 11. Change log recente (Atelier 17 lug + UniCredit + Hub/Trenitalia + Showcase); 12. Puntatori; 13. Factory Showcase — sito vetrina (iperdettaglio)
- [Parte 2 di 3](./HANDOVER-02.md) — §14. Ferrari — sezione `/scoping` (calcolatore di licensing; **v2 §14.9 → v3 §20**); 15. Root hub, feature parity & Connessioni Intelligenti (13–14 lug 2026); 16. Trait d'Union — Agos (14 lug 2026); 17. Adobe Brand Visibility, de-AI copy, comando /handover & **passata copy morbido UniCredit §17.6** (15 lug 2026); 18. Ferrari /scoping — modello Adobe-fedele, CI verde & Save resiliente (15 lug 2026); 19. Ferrari /scoping v2 + sezione «Casi d'uso» (15 lug 2026, commit `a3fc86a`); 20. **Ferrari /scoping v3 — standalone-only, costo per istanza editabile, niente prezzi** (15 lug 2026, commit `ff03a71`)
- [Parte 3 di 3](./HANDOVER-03.md) — §21. **Experience Atelier — deck trilingue EN/IT/FR del piano di crescita** (17 lug 2026, ritoccato 20 lug): struttura 8 sezioni/30 slide, Gantt roadmap + KPI scorecard + de-celebrazione copy (§21.5b), gating come controllo d'audience, disciplina fatti, verifica, pending Boardroom Quest; 22. **Modifiche core trasversali** (i18n trilingue retrocompatibile + fix gating dopo nav SPA su tutte le 6 esperienze); 23. **Redesign «eccellenza» E2E dei 6 deck** (`/impeccable`, 21 lug, live in main): design-system `.xx-*` per esperienza, copy verbatim, fix flip-ink su slide inverse/brand (§23.1), nota CI typecheck≠build (§23.2)
