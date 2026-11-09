---
description: "L'ambiente sta in piedi? Binari, push, server MCP, Radar, posta — i pezzi che quando muoiono non lo dicono. Uso: /dottore"
---

Verifica la salute dell'ambiente di lavoro.

Esiste per una ragione misurata: il 9 novembre, migrando su un altro Mac, **due cose si sono
rotte senza dirlo**. `posta.py` cercava un profilo Outlook che qui ha un altro nome e
restituiva zero messaggi — che è indistinguibile da «non è arrivato niente». E `git push`
falliva perché il credential helper invoca `gh`, che non era più installato: si è visto solo
provando a pubblicare. Un mese prima il Radar era rimasto fermo **dieci giorni** senza che
nessuno se ne accorgesse.

È sempre la stessa forma: un pezzo smette di funzionare e il sistema continua a sembrare
sano. Questo comando guarda i pezzi che tacciono quando muoiono.

## 1. Lancia

```
./scripts/dottore.sh
```

Non ripara niente: dice e basta. Esce 1 se c'è almeno un rosso.

## 2. Leggi i rossi con le regole giuste

- **`gh` manca** → `brew install gh && gh auth login`. Finché manca, ogni push muore con un
  messaggio che parla d'altro («Authentication failed»), non del binario assente.
- **`push` rosso con origin leggibile** → i token sono scaduti o assenti. ⚠️ `git ls-remote`
  **non** è una prova: su un repo pubblico passa in anonimo. Serve `gh auth login`, ed è
  interattivo: lo fa l'utente, non tu.
- **Un server MCP con comando assente** → quel server non parte, i suoi tool non compaiono, e
  la sessione **non te lo dice**: sembra solo che quella capacità non esista. ⚠️ I server si
  caricano **all'avvio della sessione**: se ne hai aggiunto uno adesso, non lo vedi finché
  non riavvii.
- **Radar fermo da più di due giorni** → `pnpm radar:install`, e controlla
  `/tmp/radar-giro.err`. «Caricato» non basta: la volta che è morto, launchd lo dava per vivo.
- **Profilo Outlook giallo «non leggibile da qui»** → non è un guasto: è TCC, cioè il
  processo che ha lanciato il dottore non ha l'Accesso completo al disco. Dipende da chi
  lancia, non dalla macchina. Rosso è solo «non trovato».

## 3. Riporta

Poche righe: che cosa è rotto, che cosa ne consegue per il lavoro di oggi, e il comando per
chiuderlo. **Non proporre di riparare quello che richiede una decisione o una password**:
dillo e fermati.

Se un rosso resterà aperto oltre oggi, va nel backlog (`docs/HANDOVER-02.md`, §10) — come
ogni altra cosa che sopravvive alla sessione.
