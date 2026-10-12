# Il conto operativo d'account — design

**Data:** 12 ott 2026 · **Stato:** fase 1 implementata, fase 2 dichiarata e non implementata

## Il problema

`docs/` serviva due mestieri senza distinguerli, e ne nascevano due difetti.

**Uno di riservatezza.** Le cartelle cliente erano escluse da git con un **elenco a mano
nel `.gitignore` di root**, una riga per cliente. Ogni cliente nuovo nasceva **esposto**
finché qualcuno non si ricordava di aggiungere la sua riga — e il 12 ott 2026
`docs/Banca Generali/`, arrivata quel giorno con l'Adobe Footprint e la SUM Usage
Dashboard del cliente, **non era ignorata**. Verificato con `git check-ignore`. Il repo è
pubblico e `main` fa deploy automatico. Nulla era mai stato committato (`git ls-files
docs`), quindi il danno non c'era: bastava però un `git add -A`.

**Uno di contesto.** Lo stato di un conto vive sparso in decine di thread di posta. Il
12 ott la posizione su Banca Generali / Intermonte — due thread interni del 6, una
risposta dei contratti del 7, footprint e consumo estratti il 12, due opzioni tecniche,
tre blocchi aperti — è stata ricostruita a mano dentro una mail. Quel lavoro si rifà da
zero ogni volta.

## Le decisioni

| Decisione | Alternative scartate | Perché |
| --- | --- | --- |
| Il materiale **resta** in `docs/<Cliente>/` | albero fuori dal repo; repo privato separato | il materiale è già lì in volume (Intesa 399 file, Poste 158) e in gran parte binario, per cui git è il posto sbagliato; e ogni riferimento `docs/<Cliente>/` in `CLAUDE.md`, negli `HANDOVER` e nelle skill `dossier`/`panel-review` continua a funzionare |
| `.gitignore` **fail-closed** in `docs/` | continuare a elencare i clienti | un elenco a mano richiede che qualcuno si ricordi; rovesciare la regola fa nascere protetto ogni cliente futuro **per costruzione** |
| **Un file per cliente**, i casi come sezioni | indice + un file per caso; registro minimale | è la stessa logica con cui `HANDOVER.md` si è spezzato: quando ha toccato il tetto, non prima. Un indice da tenere sincronizzato è la cosa che diverge per prima |
| L'agente **si aggiorna all'apertura** dalla posta | sola lettura; aggiornamento solo su richiesta | è l'unica che attacca il difetto di contesto: se il registro dipende dal fatto che gli si racconti la novità, resta indietro ogni volta che la novità è arrivata per mail |
| **Un solo** strato di istruzioni e di procedura | una «modalità» per cliente | fra due clienti non cambia la procedura, cambiano i dati. I vincoli propri di un cliente stanno in una sezione del suo registro |
| Il `CLAUDE.md` di root **non si tocca** | snellirlo adesso | sono 725 righe che governano dieci deck: è un progetto a sé, e metterlo qui dentro accorperebbe una falla di sicurezza, un sistema documentale nuovo e un refactoring del cuore della Factory |

## Fase 1 — implementata

### `docs/.gitignore` fail-closed
Ignora tutto (`*`) e riammette i soli documenti della Factory, elencati. In contropartita
le sedici righe per cliente sono state **rimosse dal `.gitignore` di root**, dove
restavano come rumore aggiornabile male. `.DS_Store` va re-ignorato dopo
`!superpowers/**`, che altrimenti lo riammette (un `.gitignore` più profondo vince su
quello di root).

### `pnpm audit:docs` (`scripts/docs-guard.ts`)
Quattro controlli, tutti HARD: il `*` fail-closed è al suo posto; `docs/.gitignore`
esiste; nessun file di cliente è **tracciato**; nessuno è **tracciabile** (né tracciato né
ignorato — quello che un `git add -A` raccoglie). Più la direzione opposta: nessuna
riammissione `!` che non sia un markdown della Factory o `superpowers/`, perché
«riammetto questo documento, serve al team» è l'altro modo di aprire la falla.

Verificato in **entrambe le direzioni**: passa a stato pulito, e falla con un file di
cliente tracciabile, con il `*` rimosso e con il file cancellato. L'output è limitato a 20
rilievi: la prima prova ne stampava 1066 su 400 KB, e un gate che vomita non lo legge
nessuno.

In **CI** è il primo passo dopo l'install, non l'ultimo: è un gate di riservatezza e costa
secondi. Nota sui limiti: in CI il clone non contiene le cartelle cliente, quindi lì
valgono i controlli 1, 2 e 4; il controllo 3 — «sta per sfuggire» — ha senso solo in
locale. Le due esecuzioni sono complementari.

### `docs/CLAUDE.md`
Un file solo, in `docs/`: si carica sia aprendo `docs/` sia aprendo `docs/<Cliente>/`,
perché Claude Code risale le cartelle padre (verificato, non supposto). Un `CLAUDE.md` per
cliente è stato escluso: dipenderebbe da un caricamento su richiesta non verificato, e non
aggiunge niente.

Contiene: la dichiarazione che **le regole dei deck non si applicano** in questo
sottoalbero; il protocollo di apertura e quello di chiusura; la **regola delle quattro
cose** (si scrive solo se cambia dove siamo, chi ha la palla, il prossimo passo, o entra
un fatto con una fonte); le regole di mestiere ereditate dal repo rese operative; la
regola di riservatezza; il confine con `dossier`, `PANEL-*`, memoria e `HANDOVER`; e il
**template**, dentro il file stesso così non può divergere dalle istruzioni che lo
descrivono.

### `/conto` e `/conti`
`/conto` esegue l'apertura, `/conto chiudi` la chiusura, `/conto` su un cliente senza
registro lo crea e lo fa approvare. `/conti` dà la vista d'insieme chiamando
`pnpm conti` (`scripts/conti.ts`), che legge i registri e stampa: i passi **scaduti**, i
conti **fermi** da più di 21 giorni, una riga per conto con chi ha la palla e da quanto, e
l'elenco dei clienti ancora senza registro. Tutti i rami verificati, incluso quello degli
scaduti.

### Tre registri come prova del formato
`Banca Generali` (caso vivo, fatti letti alla fonte), `Enel` (due casi aperti, con la
distinzione fra un calcolo di un collega e un dato di sistema marcata nel registro) e
`Unipol` (nato da materiale in cartella e da memoria, con in testa l'avvertenza che **non
è ancora riconciliato con la posta**). Gli altri dieci clienti nascono alla prima sessione:
è una decisione, non un residuo.

## Fase 2 — dichiarata, non implementata

Un **mod** (plugin con handler JS dentro Claude Code), uno solo, non uno per cliente:

1. **`/conti` come comando del mod** — gira senza un turno di Claude, a costo zero di
   token, anche mentre Claude lavora. Delega a `pnpm conti`, che esiste già: il mod non
   reimplementa la logica, la chiama.
2. **Banda sopra il prompt** con lo stato del conto su cui si sta lavorando.
3. **Hook `tool.call`** che ferma un `git add` con file di una cartella cliente e chiede
   conferma prima di un invio di posta — seconda cintura oltre al `.gitignore`.

**Due blocchi noti, da chiudere prima.** L'installazione è **2.1.263**; i mods chiedono
**2.1.287** nel terminale (2.1.286 nell'app Desktop). E nel **pannello chat
dell'estensione VS Code gli hook girano ma il mod non disegna**: banda e pane si vedono
nel terminale (anche quello integrato) e nell'app Desktop. Se la banda serve, quelle
sessioni vanno aperte con `claude` nel terminale.

Il mod non è stato scritto perché l'API di `ui.render` e dei comandi va letta sulla
reference, non ricostruita a memoria: un mod scritto alla cieca contro una versione che
non è installata non è un deliverable, è un debito.

## Lavoro successivo, fuori da questa spec

- **Snellire il `CLAUDE.md` di root** (725 righe, 71 KB ≈ 18k token caricati in ogni
  sessione d'account): le regole dei deck in reference caricate a richiamo. Alto valore,
  alto rischio, chiede la disciplina del delta misurato.
- Un **hook `Stop`** che renda deterministico il protocollo di chiusura. Il repo già usa
  un hook `Stop` per Impeccable, quindi il meccanismo è provato qui. Da misurare prima di
  dichiararlo.
- `pnpm audit:leaks` è **citato** in un commento del `.gitignore` ma non esiste fra gli
  script: o si scrive o si corregge il commento.

## Come si verifica

```bash
pnpm audit:docs                       # 0 rilievi, e deve fallare se si rimuove il `*`
git status --porcelain docs/          # nessun file di cliente
git check-ignore -q "docs/<finto>/"   # un cliente mai dichiarato è già ignorato
pnpm conti                            # legge i registri, stampa scaduti e fermi
```
