# HANDOVER — Experience Design Factory

> Documento di passaggio di consegne. Stato al **2026-09-02**.
> Lingua: italiano per la narrativa, inglese per path/comandi/nomi prodotto.
> Companion di `CLAUDE.md` (guida agente, sempre valida) e delle memorie in
> `~/.claude/projects/.../memory/`. Se una cosa qui contraddice il codice, **vince il codice** —
> segnalalo e aggiorna questo file.
>
> **Nuova sessione CC:** l'indice/ordine di lettura è in `docs/README.md`. Leggere **tutti** i
> `.md` costa ~18k token (ok). **Non** aprire mai i `.pptx`/`.mp4` in `docs/` (binari giganti,
> git-ignored, non presenti in un clone pulito) — i fatti utili sono già distillati qui (§5.3).

---

<!-- HANDOVER-SPLIT -->

> **Handover splittato per dimensione** (3 parti, contratto ≤48KB/≤1500 righe per file). Leggile in ordine — ognuna è leggibile in una singola `Read`.

- [Parte 1 di 3](./HANDOVER-01.md) — §1. Cos'è e stato generale (ora **7 esperienze** incl. **Eni Orbita** e **Alfabeti MIM**); 2. Architettura; 3. Comandi; 4. Stato per esperienza; 5. UniCredit content model; 6. Feature runtime deck; 7. Admin Console; 8. **Audit-vs-legibility**; 9. Deploy & segreti; 10. **Pending/backlog prioritario (P1 dossier UniCredit QC live + Eni pre-meeting/VPN)**; 11. Change log datato (2 set: **UniCredit attribution + Dossier login-gated** + **Alfabeti MIM** · 1–2 set CI lint/Selling-to-Executives/a11y · Atelier depubblicata 1 set · biforcazione Trenitalia 31 ago · Eni 28 ago · redesign 21 lug)
- [Parte 2 di 3](./HANDOVER-02.md) — §12. Puntatori; 13. **Factory Showcase (iperdettaglio)**; 14. **Ferrari /scoping** (calcolatore; v2 §14.9 → **v3 in §20, parte 3**); 15. Root hub, feature parity & Connessioni Intelligenti **(§15.3–15.4 struttura SUPERATA dalla biforcazione →§26, ma i 13 vincoli LOCKED e le fonti restano PIENAMENTE validi)**; 16. **Trait d'Union — Agos**; 17. Adobe Brand Visibility + de-AI copy + comando /handover + passata copy morbido UniCredit §17.6
- [Parte 3 di 3](./HANDOVER-03.md) — §18. Ferrari /scoping Adobe-fedele/CI/Save; 19. /scoping v2 + «Casi d'uso» (`a3fc86a`); 20. **/scoping v3 in produzione** (standalone-only, niente prezzi, `ff03a71`); 21. **Experience Atelier** (deck trilingue del growth plan); 22. Modifiche core trasversali (i18n `fr` + fix gating SPA); 23. **Redesign «eccellenza» E2E dei 6 deck** (21 lug); 24. **Orbita — Eni** (28 ago: deck EN/IT + dossier war-room; meeting Chessa 10 set); 25. **Core responsive envelope + nav single-line + sweep 536 screenshot** (21–22 lug); 26. **Biforcazione Connessioni Intelligenti — FS Park × Trenitalia** (31 ago: tronco+bivio+2 rami autoconsistenti, runtime branch-aware, gotcha; **§26.7 revisioni 1 set**: copy/obiezione CDP/connettori verificati/2 closer visual, Elena rimossa); 27. **UniCredit — Attribution al centro di «Analizza» + Dossier Attribution login-gated** (2 set: +2 slide, sezione HARD-clean, dossier `/dossier/` Supabase RLS bilingue IT/EN + PDF, gotcha `is:global`); 28. **Alfabeti — MIM** (2 set: nuova experience, 8 sezioni IT+EN, sezione «realtà» gated *interno*, doppio uso client/interno)
