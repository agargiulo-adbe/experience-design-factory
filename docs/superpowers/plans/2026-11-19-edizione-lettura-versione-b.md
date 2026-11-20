# Edizione da distribuire — versione B «Da costruire insieme» · Implementation Plan

> Esecuzione inline (sessione del 19 nov 2026). Spec: `docs/superpowers/specs/2026-11-19-edizione-lettura-design.md`,
> sezioni «Le risposte dell'owner» e «Revisione del 19 nov sera», che prevalgono su §5-§8.

**Goal:** accanto alla versione A («Da leggere», `/intesa-storia/`, già live) una versione B dallo stesso
sorgente, con il modulo anonimo, «Chiedeteci di questo» su ogni slide, il riepilogo per la banca gated
e la curatela per noi. L'AE le valida tutte e due, il referente sceglie: per questo **B esce a un percorso
suo** (`/intesa-storia-insieme/`) e A resta com'è.

## Le scelte del builder (correggibili)

| Tema | Scelta | Perché |
|---|---|---|
| Interruttore | `PUBLIC_EDF_VERSIONE=insieme` sopra `PUBLIC_EDF_EDIZIONE=lettura`; `build:insieme` → `dist-insieme/` | due versioni da confrontare dal vivo, un sorgente |
| Rotte | `riepilogo` esiste solo in B (`soloInsieme` nell'integrazione d'edizione) | A non deve nemmeno avere la pagina |
| Modulo | `<dialog>` del motore (`ModuloContributo.astro`), anonimo: sezione, testo, funzione, livello, una casella «nel riepilogo» spenta | revisione del 19 sera: niente nome, niente contatto |
| «Chiedeteci di questo» | pulsante nel chrome, fuori dalle slide, che precompila «capitolo · titolo della slide» | non tocca la composizione delle slide, quindi non l'audit |
| Telefono | il modulo si apre da «Parliamone» della pagina breve; nessun pulsante per momento | la pagina breve è misurata al pixel su un iPhone vero |
| Ruolo in copertina | **non costruito**: la mappa dei percorsi per ruolo non è approvata, e senza mappa il ruolo non cambierebbe niente | spec: «finché non è approvata, il ruolo non cambia il percorso» |
| Soglie del riepilogo | calcolate **nel database** (RPC `security definer`): il token non vede mai una funzione sotto 3 né il livello accanto a una frase | la privacy non si affida al JavaScript |
| Stato del riepilogo | `in preparazione` (meno di 3 funzioni) → `bozza` → `approvato` (dal referente, a voce o per mail: lo segniamo noi); un contributo curato dopo l'approvazione lo riporta in bozza | spec §8 + approvazione a voce |
| Chi legge | `progetto_membri` + super admin, via RLS | spec «Chi legge i dati» |
| Anti-abuso | trigger: per progetto al massimo 20 contributi in 10 minuti e 200 al giorno | senza IP non c'è limite per mittente |
| Avviso | launchd ogni 10 minuti sul Mac dell'owner, RPC che restituisce solo **conteggi**, con una chiave dedicata fuori dal repo | nessun provider di posta, nessuna chiave service_role su disco |
| Curatela | pagina `contributi/` della console: stato, area evolutiva, testo curato, risposta, anteprima del riepilogo, aperture per giorno | il cruscotto di §9 nella sua forma minima |

## Task

1. Motore: `Versione` in `utils/edizione.ts`, `soloInsieme` nell'integrazione (test).
2. Motore: `utils/contributi.ts` — funzioni, livelli, validazione della riga, sezione corrente (test).
3. Motore: `ModuloContributo.astro` (dialog, pulsante di chrome, invio senza rete prima del clic).
4. Motore: `blocks/doc/RiepilogoPage.astro` (token → RPC, aree, ampiezza, filigrana Bozza, stampa).
5. Supabase `0041_contributi.sql` (tabelle, RLS, trigger, RPC, aperture di B) — applicata e provata in transazione.
6. App Intesa: config, script, `riepilogo.astro`, modulo nel layout e in «Parliamone», contatore per versione.
7. Console: `contributi/` per la curatela.
8. Avviso: `scripts/contributi-avviso.sh` + `pnpm contributi:install` (launchd).
9. Deploy: build e copia di B; `check:edizione` esteso a B.
10. Verifica: build sala identica, A identica, B con audit, schermate, prova di invio e di lettura negata.
