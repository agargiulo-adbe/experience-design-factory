# HANDOVER — Experience Design Factory

> Documento di passaggio di consegne. Stato al **2026-10-07**.
> Lingua: italiano per la narrativa, inglese per path/comandi/nomi prodotto.
> Companion di `CLAUDE.md` (guida agente, sempre valida) e delle memorie in
> `~/.claude/projects/.../memory/`. Se una cosa qui contraddice il codice, **vince il codice** —
> segnalalo e aggiorna questo file.
>
> **Nuova sessione CC:** l'indice/ordine di lettura è in `docs/README.md`. Leggere **tutti** i
> `.md` costa ~20k token (ok). **Non** aprire mai i `.pptx`/`.mp4` in `docs/` (binari giganti,
> git-ignored, non presenti in un clone pulito) — i fatti utili sono già distillati qui (§5.3).
>
> ✅ **Working tree pulito al 7 ott 2026.** Il 6 ottobre ha prodotto due cose. La prima: i dossier
> interni hanno **un solo motore** (`packages/core/.../DossierPage.astro`) al posto di sei copie
> divergenti, con un gate deterministico — `pnpm audit:dossier`, cinque viewport, **sei dossier a
> zero rilievi** — e una skill che ne tiene il metodo (`skills/dossier/`). Il gate ha trovato cose
> vecchie che nessuno vedeva, fra cui cinque righe **invisibili da settembre** in un dossier già
> consegnato. La seconda: **Intesa Sanpaolo Assicurazioni «Dopo la firma»** (§35), dossier e quattro
> slide per l'incontro di **giovedì 8 ottobre**, con il perimetro del cliente verificato sulle sue
> superfici invece che ipotizzato.
>
> Quattro regole generalizzate il 6 ottobre, tutte da errori veri: un dossier si scrive per **chi non sa
> nulla della Factory**; le idee **si verificano prima di scriverle** e quello che il cliente fa già
> da sé non si propone; esiste una **gerarchia delle fonti** e «non trovato» non significa «falso»;
> una **dichiarazione ha una data di scadenza**. Le prime due sono anche in `CLAUDE.md`.
>
> **In serata**, senza toccare il codice: su **Unipol** il rinnovo di **Adobe Target** (31 dicembre
> 2026) è a rischio per un POC con un concorrente di personalizzazione, e l'argomento scelto è
> **Coworker su CJA e Target insieme** — con l'ask, portata alla call dell'8 ottobre, di estendere a
> Target l'high-touch già in corso su CJA (§11, voce della sera; memoria
> `unipol-target-retention-coworker`). Da lì anche un fatto operativo: il connettore **Microsoft 365
> è in sola lettura**, le bozze Outlook si creano via **AppleScript**.
>
> **Fra il 6 e il 7 ottobre, preparando l'incontro Poste.** Due dubbi sollevati in una call interna sono stati portati
> alla fonte: su Adobe Analytics i casi d'uso di Coworker erano uno solo **fino al 2 ottobre** (poi
> l'indice di Experience League ha aggiunto `aa` e `aa-root-cause-analysis`), e l'ipotesi che si
> passasse dall'Analytics Source Connector dentro AEP è **falsa**. Da lì un overclaim corretto in
> cinque punti del deck — su AA l'«apri in Analysis Workspace» **non è nativo** — con `CLAUDE.md` e la
> memoria riallineati su «rollout dal 2 ott, GA **TBD**». Il video demo del cliente **non si mostra
> intero** (è una sessione di preparazione su dati CJA): due clip tagliate, player offline, **nessun
> upload**. Il dossier Poste è passato da «War Room» a **«Dossier»** e ha una §13 nuova sul perché
> Coworker e non un server MCP collegato al proprio assistente. Tutto in **§32.10 (Parte 12)**.
>
> **7 ottobre, mattina dell'incontro.** Cinque commit fra le 08:23 e le 11:42, tutti su Poste e tutti
> con lo stesso movimento: dire quello che è vero e citare dove sta scritto. Il **costo** detto come un
> fatto e il limite di reporting col numero pubblico; **«Evolvere» riprogettato** da elenco di funzioni
> a **proposta di avvio** (4 → 7 slide), con l'**istruttoria che torna a Poste** e le promesse su
> retention e residenza ritirate; lo **slug del dossier** che non nomina più il referente
> (`poste-sperandeo` → `poste-sei-domande`, **stesso `share_token`**: il link distribuito regge);
> e **«In azione»**, l'intermezzo con le due clip del cliente — nel flusso e nella nav senza numero,
> fuori dalla griglia 2×3 della home — le cui **clip restano fuori dal Release pubblico**, perché
> mostrano l'interfaccia di un prodotto in rollout. Deck a **39 slide su 8 rotte**, 0 HARD su 123
> controlli. Tutto in **§32.11 (Parte 12)**.
>
> Il **backlog P0 di §10 (Parte 2)** resta la prima cosa da leggere: apre con i nomi di referenti
> cliente dentro file tracciati su un repository pubblico — inventario rifatto il 7 ott, due spec
> tracciate in più di quante se ne contassero — e il più urgente in agenda è **il panel review
> mancante sulle slide di domani, 8 ottobre**.

---

<!-- HANDOVER-SPLIT -->

Handover splittato per dimensione (contratto `/handover`: ≤1500 righe, ≤48 KB, ≤1800 char per riga).
**Leggi le parti in ordine.** Se devi decidere cosa fare, la Parte 2 basta: è il backlog P0/P1.

- [Parte 1 — §1–8: stato generale, architettura, comandi, tipo per esperienza, UniCredit content model, Admin Console, audit](./HANDOVER-01.md) — come è fatta la Factory e come si lavora.
- [Parte 2 — §9 Deploy & segreti · §10 backlog **P0 e P1**](./HANDOVER-02.md) — **leggila per prima**: cosa resta da fare adesso.
- [Parte 3 — §11 change log datato (recente)](./HANDOVER-03.md) — dal 7 ott 2026 all'indietro, fino al 29 set.
- [Parte 4 — §11 change log datato (seguito)](./HANDOVER-04.md) — da metà settembre al 2 set.
- [Parte 5 — §12 puntatori · §13 **Factory Showcase** · §14 Ferrari /scoping](./HANDOVER-05.md) — la vetrina in iperdettaglio, fino a §13.12 (la verifica generale del 3 ott).
- [Parte 6 — §15 hub e parity · §16 Agos · §17 Brand Visibility e de-AI · §18–20 Ferrari /scoping · §22 **core trasversali**](./HANDOVER-06.md) — §22 contiene la regola sugli stili scoped contro il DOM a runtime.
- [Parte 7 — §26 FS Park × Trenitalia · §27 UniCredit attribution e dossier · §28 MIM](./HANDOVER-07.md).
- [Parte 8 — §29 pipeline Firefly · §30 Aperture · §31 Isybank](./HANDOVER-08.md).
- [Parte 9 — §21 Experience Atelier · §23 redesign E2E · §24 Eni · §25 core responsive e nav](./HANDOVER-09.md).
- [Parte 10 — §10.b backlog **P2 e note non azionabili**](./HANDOVER-10.md) — la coda della §10, spezzata ai sotto-livelli perché da sola superava i 48 KB.
- [Parte 11 — §33 **Intesa «Su scala umana»** · §34 **il motore unico dei dossier** · §35 **Intesa Assicurazioni «Dopo la firma»**](./HANDOVER-11.md) — le due stanze Intesa (22 ott e 8 ott), il motore che regge tutti i dossier, e il panel review a due giri sulle undici slide dell’8 ottobre.
- [Parte 12 — §32 **Poste «Sei domande»**](./HANDOVER-12.md) — uscita dalla Parte 8 per dimensione; §32.10 è la verifica alla fonte del 6–7 ott (rollout ≠ GA, l'«apri in Workspace» ridimensionato, il video tenuto in locale, il dossier rinominato) e **§32.11 la mattina dell'incontro** (costo, «Evolvere» come proposta di avvio, lo slug senza il cognome, l'intermezzo «In azione»).
- [Parte 13 — §11 change log datato (coda)](./HANDOVER-13.md) — dal 2 set 2026 all'indietro, fino a luglio. Creata il 7 ott: il change log da solo superava due parti.
