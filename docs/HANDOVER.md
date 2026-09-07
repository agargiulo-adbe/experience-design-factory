# HANDOVER — Experience Design Factory

> Documento di passaggio di consegne. Stato al **2026-09-07**.
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

> **Handover splittato per dimensione** (5 parti, contratto ≤48KB/≤1500 righe per file). Leggile in ordine — ognuna è leggibile in una singola `Read`.

- [Parte 1 di 5](./HANDOVER-01.md) — §1. Cos'è e stato generale (**7 esperienze** incl. **Eni Orbita** e **Alfabeti MIM**); 2. Architettura; 3. Comandi; 4. Stato per esperienza; 5. **UniCredit content model** (deck **bilingue IT/EN** + **§5.6 «workshop cut» 7 set: 6 capitoli, single-persona Marco, backdrop Firefly**); 6. Feature runtime deck; 7. Admin Console; 8. **Audit-vs-legibility**; 9. Deploy & segreti; 10. **Pending/backlog prioritario** (P1 Eni pre-meeting/VPN; poi P2)
- [Parte 2 di 5](./HANDOVER-02.md) — §11. **Change log datato** (in cima **7 set: UniCredit workshop cut + fix deck trasversali** — freccia-indietro-verso-hub + roadmap blocchi-uguali + `<title>` no-dup; poi MIM 7/4 set, Agos, bilingue UniCredit, ecc.); 12. Puntatori; 13. **Factory Showcase (iperdettaglio)**
- [Parte 3 di 5](./HANDOVER-03.md) — §14. **Ferrari /scoping** (calcolatore; v3 in §20); 15. Root hub, feature parity & Connessioni Intelligenti **(§15.3–15.4 struttura SUPERATA dalla biforcazione →§26, ma i 13 vincoli LOCKED restano validi)**; 16. **Trait d'Union — Agos**; 17. Adobe Brand Visibility + de-AI copy + /handover
- [Parte 4 di 5](./HANDOVER-04.md) — §18. Ferrari /scoping Adobe-fedele/CI/Save; 19. /scoping v2 + «Casi d'uso»; 20. **/scoping v3**; 21. **Experience Atelier**; 22. Modifiche core trasversali (i18n `fr`, fix gating SPA, **§22.3 fix freccia-indietro**, **§22.4 regole BINDING roadmap+title**); 23. **Redesign «eccellenza» E2E dei 6 deck**; 24. **Orbita — Eni**; 25. **Core responsive envelope + nav single-line**; 26. **Biforcazione Connessioni Intelligenti — FS Park × Trenitalia**
- [Parte 5 di 5](./HANDOVER-05.md) — §27. **UniCredit — Attribution «Analizza» + Dossier** (login-gated **+ unlisted secret-link** §27.7 + deck **bilingue IT/EN**); 28. **«La voce del Ministero» — MIM** (customer re-arch §28.1–3; redesign 100% B1 §28.4 + imagery Firefly §28.5; **§28.6 arricchimento + persona Giulia + `/trasformazione` rimossa**); 29. **Firefly asset+video pipeline** (engine build-time riusabile)
