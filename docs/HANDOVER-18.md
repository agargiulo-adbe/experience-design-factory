# Handover — Parte 18 di 18
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

<!-- sezione spostata dalla Parte 1 il 21 ott 2026: la Parte 1 aveva superato il contratto di dimensione -->

## 8. Deck visual contract & audit

Contratto e **12 check** (`a b c d e g h i j k m` + `exp`; **non** esistono `f` e `l` — la dicitura «12 check a–l» era sbagliata e fu corretta a 11 il 10 set; il dodicesimo, **`m`**, è stato **aggiunto il 12 set**, non recuperato) **+ il Type & legibility contract (vincolante)** in `CLAUDE.md`. `pnpm --filter <app> audit:deck` gira su **1920/1440/1280** e misura bounding box → pass/fail.

> **`m` — allineamento (HARD, dal 12 set):** i blocchi di primo livello con `text-align: left|start` devono condividere il bordo sinistro (±4px). Le composizioni **centrate** sono esenti; sono esclusi anche la decorazione fuori flusso (`position:absolute` — un backdrop finito dentro `.slide-inner` dava un falso positivo) e i blocchi senza testo. La trappola che l'ha generato: il reset di base cappa i `<p>` dentro una slide, si «libera» un blocco con `max-width:none` e quello **si allarga a tutta la safe-area** mentre i fratelli restano nella colonna (su isybank: fonti 197px fuori riga).

> ⚠️ **IL GATE HA MENTITO (scoperto 11 set).** `audit:deck --only a,b` finiva in un **secondo** filtro posizionale in `main()` che leggeva il valore del flag come il nome di rotta letterale `"a,b"`: **zero rotte auditate**, e «PASS — all decks clean» stampato lo stesso. Corretto (il valore dei flag non è più un filtro posizionale; zero rotte esce con **codice 2**). Due conseguenze pratiche: **`DECK_URL` è l'ORIGIN**, non il path dell'app (le rotte nel set sono già percorsi completi — con il path doppio ogni pagina è un 404); e **ogni «0 failures» dichiarato prima dell'11 set va considerato non verificato**. Se un PASS arriva sospettosamente in fretta, **contare le rotte stampate**.

> ⚠️ **LEZIONE CHIAVE (lug 2026):** `audit:deck` PASS **≠ leggibile**. L'audit misura solo testo **≥16px** (per band/coverage) e il contrasto — non la *generosità* del type né l'equilibrio della composizione. Su Trenitalia una remediation aveva rimpicciolito il body a 0.5–0.75rem *per far passare l'audit* → illeggibile in proiezione. Regola: dopo che l'audit è a 0, **leggi uno screenshot 1920 di ogni slide** e verifica type generoso (body ≥0.95rem) + composizione bilanciata. Dettaglio completo nel **Type & legibility contract** di `CLAUDE.md`.
>
> **L'audit va lanciato contro un PREVIEW statico** (il dev server con HMR blocca il `networkidle` di Playwright → timeout): `build` → `preview --port N` → `DECK_URL=http://localhost:N pnpm --filter <app> audit:deck`. Contrasto: il parser dell'audit **non legge `oklab()`/`color-mix()`** (li tratta come bianco → falso PASS su `h`) — usa `rgba()` esplicito per chrome/bottoni/card tintate.

**Stato attuale:** tutti e 4 i deck (maxmara, unicredit, ferrari, trenitalia) sono a **`audit:deck` 0 fallimenti** su 3 viewport (giri dedicati Ferrari 74→0 e Trenitalia 165→0, lug 2026). `scripts/deck-audit.ts` ha `ROUTE_SETS` per tutti e 4; maxmara usa le rotte `/generazioni-maxmara/…`.

**Aggiornamento 15 lug 2026:** aggiunta la route **`visibilita`** al `ROUTE_SET` unicredit di `deck-audit.ts` (prima non coperta). Poi **bonifica audit UniCredit** (§17.4): azzerati **tutti** i fallimenti HARD (`c` overflow/margini 22→0, `e` text-on-text 1→0, `j` clipping 7→0) su 14 slide/8 sezioni con fix meaning-preserving. Restano solo **soft** `a`/`i`/`g` (94/64/12, totale 200→170) su composizioni volutamente ariose/dense + il limite parser di `marco-moment`: **non** si forzano rimpicciolendo il type (contratto).

**Agg. 9 set 2026:** UniCredit **0 HARD** su home + 6 capitoli a 1920/1440/1280 (bonificati anche residui pre-esistenti su aem-agents/brand-visibility/brand-concierge/cases). Gotcha: l'audit legge `--slide-safe-inset` da `:root` (80px), **non** l'override `[data-deck]` per breakpoint → a 1280×800 il contenuto deve stare in **640px** utili.

**Agg. 1 ott 2026 — un connettore che unisce due box non può stare dentro uno dei due (Ferrari, check `c` HARD).** Sulla copertina di `protagonisti` i tre apex della racing line erano `flex: 1 1 0` e ciascuno si portava dentro il proprio connettore (`position:absolute; left:50%; width:100%`): il segmento arrivava fino al centro dell'apex successivo, quindi **usciva dal box del suo genitore** e l'audit misurava un overflow vero (`scrollWidth` 495 su `clientWidth` 330, a tutti e tre i viewport). Era lì dal commit `16c13d6` e non era mai stato notato: il deck veniva dato per «0 fallimenti» leggendo il totale invece delle colonne. La regola generale: **il blocco di riferimento di una decorazione che attraversa due elementi è la riga, non l'elemento** — `position: relative` sulla riga, `static` sui figli, offset per indice (tre apex di pari larghezza → centri a 1/6, 1/2, 5/6, quindi `left: 16.667%` e `left: 50%` con `width: 33.333%`). Geometria identica a prima, verificata a schermo. Ferrari torna a **0 HARD** (34 soft `a`/`i`, da 37 con 3 HARD). Corollario di metodo: quando si tocca un deck, **auditare la baseline prima della modifica** — senza, un HARD preesistente sembra una propria regressione e un totale invariato sembra un successo.

**Come leggerlo (importante):** il deck ha una **baseline di fallimenti pre-esistenti** (~176–200 su unicredit) che sono **check aspirazionali soft** — soprattutto `a` (banda di lettura 30–70%) e `i` (uso spazio ≥45%) su slide volutamente ariose o dense. **Non inseguire il numero assoluto.** Quello che conta sono i **check "hard"**: `b` (collisione con la chrome), `j` (clipping fuori viewport), `k` (scroll nascosto). Baseline hard: **`j:F`=7, b/k=0**.

**Metodo di verifica anti-regressione** (usato in tutti i round): confronta contro baseline via `git stash`:
```bash
# con le tue modifiche
pnpm --filter unicredit-engagement build && pnpm --filter unicredit-engagement audit:deck > /tmp/after.txt
git stash push -- apps/unicredit-engagement && pnpm --filter unicredit-engagement build
pnpm --filter unicredit-engagement audit:deck > /tmp/before.txt && git stash pop
# poi confronta i conteggi hard: grep -oE "b:F|j:F|k:F" /tmp/{before,after}.txt | sort | uniq -c
```
Regola pratica: **è accettabile aumentare `a`/`i` (soft) ma NON `b`/`j`/`k` (hard)**. Se aumentano gli hard, hai introdotto clipping/scroll/collisione → riduci densità/altezza.

---
