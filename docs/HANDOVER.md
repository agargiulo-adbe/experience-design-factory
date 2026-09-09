# HANDOVER — Experience Design Factory

> Documento di passaggio di consegne. Stato al **2026-09-09**.
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

- [Parte 1 di 5](./HANDOVER-01.md) — §1. Cos'è e stato generale (**8 esperienze cliente** incl. **Eni Orbita**, **Alfabeti MIM** e **Isybank «Il momento giusto»** (9 set), + **Aperture** deck di ricerca 8 set); 2. Architettura; 3. Comandi; 4. Stato per esperienza; 5. **UniCredit content model** (deck **bilingue IT/EN** + **§5.6 «workshop cut» 7 set: 6 capitoli, single-persona Marco, backdrop Firefly**); 6. Feature runtime deck; 7. Admin Console; 8. **Audit-vs-legibility**; 9. Deploy & segreti; 10. **Pending/backlog prioritario** (P1 **Isybank Valitutti 10 set** / FSTechnology Adobe Day / Eni pre-meeting / VPN / **Atelier: confermare date+decisione** / dossier UniCredit; poi P2)
- [Parte 2 di 5](./HANDOVER-02.md) — §11. **Change log datato** (in cima **9 set: MIM evoluzione UI/UX + Firefly Video; 8 set: Aperture, pass critique Atelier, dossier FSTechnology Adobe Day + skill «dossier=pagina web interna»**; poi 7 set UniCredit workshop cut + fix deck trasversali; MIM 7/4 set, Agos, bilingue UniCredit, ecc.); 12. Puntatori; 13. **Factory Showcase (iperdettaglio)** (§13.4 skill + output dossier)
- [Parte 3 di 5](./HANDOVER-03.md) — §14. **Ferrari /scoping** (calcolatore; v3 in §20); 15. Root hub, feature parity & Connessioni Intelligenti **(§15.3–15.4 struttura SUPERATA dalla biforcazione →§26, ma i 13 vincoli LOCKED restano validi)**; 16. **Trait d'Union — Agos**; 17. Adobe Brand Visibility + de-AI copy + /handover
- [Parte 4 di 5](./HANDOVER-04.md) — §18. Ferrari /scoping Adobe-fedele/CI/Save; 19. /scoping v2 + «Casi d'uso»; 20. **/scoping v3**; 21. **Experience Atelier** (**§21.6 pass critique 8 set**: piano ridatato, 7 exp, sponsor cut `?s=asks`); 22. Modifiche core trasversali (i18n `fr`, fix gating SPA, **§22.3 fix freccia-indietro**, **§22.4 regole BINDING roadmap+title**); 23. **Redesign «eccellenza» E2E dei 6 deck**; 24. **Orbita — Eni**; 25. **Core responsive envelope + nav single-line**; 26. **Biforcazione Connessioni Intelligenti — FS Park × Trenitalia** (incl. **§26.8 dossier war-room FSTechnology / Adobe Day, 8 set**)
- [Parte 5 di 5](./HANDOVER-05.md) — §27. **UniCredit — Attribution «Analizza» + Dossier** (login-gated **+ unlisted secret-link** §27.7 + deck **bilingue IT/EN**); 28. **«La voce del Ministero» — MIM** (customer re-arch §28.1–3; redesign 100% B1 §28.4 + imagery Firefly §28.5; **§28.6 arricchimento + persona Giulia + `/trasformazione` rimossa**; **§28.7 (9 set) evoluzione UI/UX post-critique: 18 slide, journey builder, video Firefly, presenter**); 29. **Firefly asset+video pipeline** (engine build-time riusabile; **Video API sbloccata 8 set**); 30. **Aperture — Osservatorio email tracking** (deck di ricerca IT/EN, hub-only, 8 set); 31. **«Il momento giusto» — Isybank** (deck + dossier per l'AD Valitutti, 10 set; 9 set)
