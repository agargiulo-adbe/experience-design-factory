---
description: "Prima di una stanza: il panel copre quello che proietti? il lavoro è committato? il link pubblico mostra la stessa cosa? i gate sono verdi? Uso: /preflight-sala <slug>"
argument-hint: "<slug dell'app>"
---

Verifica che l'experience sia pronta per la sala. Argomento ricevuto: `$ARGUMENTS`

Questo comando esiste perché `/handover` trova questi difetti **a valle**, e tre volte su
cinque li ha trovati il giorno della stanza o dopo. Qui si guardano insieme, prima.

Se l'argomento è vuoto, chiedi quale experience — **non indovinare**: in questo repo ci sono
due Trenitalia e quattro Intesa, e sbagliare app significa dare un verde su un deck che non
è quello che va in sala.

## 1. I controlli deterministici

Esegui `pnpm preflight <slug>` dalla radice. Lo script guarda quattro cose e non ne inventa
nessuna:

- **Panel review** — il verdetto si attribuisce leggendo **dentro** i file
  `docs/*/PANEL-VERDICT-*.md`, che nominano `apps/<slug>`. Non si attribuisce dalla cartella
  del cliente: su `docs/Ferrovie/` ci sono i verdetti di due experience diverse e si
  distinguono solo per data. ⚠️ Un verdetto **non copre il lavoro non committato**: se il
  tree è sporco di contenuto, il panel è rosso anche se la data è di stamattina.
- **Working tree** — file non committati su quell'app.
- **In rete** — se ci sono commit non pushati *su quell'app* o file non committati, allora il
  link pubblico serve un build diverso da quello che hai davanti.
- **Gate** — li elenca e basta: li lanci tu, al punto 2.

## 2. I gate

Lanciali **tutti**, nell'ordine, e riporta i numeri veri:

```
pnpm --filter <slug> audit:deck
pnpm audit:ink    && pnpm audit:wrap
pnpm audit:copy   && pnpm audit:fonti
```

⚠️ **`audit:wrap` va dopo ogni modifica di copia, e `audit:deck` va rilanciato dopo di lui**:
legare una riga sposta il punto di rottura, e una stringa che non va più a capo può sbordare
— che è un HARD. Se nella giornata sono cambiate molte stringhe, questo giro non è
facoltativo.

## 3. Il giudizio, che non è dello script

Dopo i numeri, rispondi a tre domande che nessun gate sa porre:

1. **Che cosa, di quello che si proietta, nessuna persona ha mai visto?** Elenca le slide,
   non i file. È la domanda da cui nasce il giro delta.
2. **Il deck nomina terzi?** Un partner, un servizio Adobe, un cliente portato come
   referenza. Ogni nome di terzi in slide è una decisione, non un dettaglio: verifica che
   sia agli atti che si può dire. Se non lo è, è la riga da togliere — di solito è un campo
   solo.
3. **Quello che gira sul link è quello che proietti?** Se no, va detto a chi riceve il link,
   oppure si pubblica prima della stanza.

## 4. L'esito

Chiudi con un semaforo e **una sola riga di raccomandazione**: si va in sala così, si
chiude prima X, oppure si va in sala mettendo agli atti che Y non è coperto. Niente elenchi
di buoni propositi: chi legge ha poche ore.

Se trovi un rosso che resterà aperto, **scrivilo nel backlog** (`docs/HANDOVER-02.md`, §10)
prima di chiudere — altrimenti alla prossima sessione non esiste.
