---
description: "Committa con lo stage esplicito: mai `git add -A`, mai file di un workstream che non è il tuo. Uso: /commit [nota]"
argument-hint: "[nota sul perché]"
---

Committa il lavoro in corso. Nota ricevuta: `$ARGUMENTS`

## La regola, e il giorno in cui è nata

**`git add -A` è vietato in questo repo.** L'11 ottobre un `git add -A` lanciato mentre il
working tree era su un altro ramo ha incluso **18 file di un collega** in un commit di
Trenitalia, li ha pushati e li ha deployati. L'app risponde 200, è registrata ovunque, e
**la decisione su cosa farne è ancora aperta un mese dopo**: è il P0 più vecchio del backlog.
Non è stato un errore di distrazione — è stato un comando che fa esattamente quello che
promette, su un tree che conteneva più di quello che si credeva.

Lo stesso vale per `git commit -a` e per `git add .` dalla radice.

## 1. Guarda prima di toccare

```
git status --short
git diff --stat
```

Se il tree contiene **più di un workstream** — due app diverse, o un'app più file di
infrastruttura — dillo e **chiedi quale si committa**. Non decidere tu: in questo repo è
normale avere due experience aperte insieme, e sono per clienti diversi.

## 2. Stage esplicito, per percorso

```
git add apps/<slug>/<file> <altro percorso>
```

Percorsi nominati uno per uno, o al massimo la cartella dell'**unica** app in gioco. Poi
verifica che sia andato dentro solo quello:

```
git diff --cached --name-only
git diff --name-only        # ← quello che RESTA fuori, e deve restarci
```

⚠️ Prima di procedere, guarda anche i **non tracciati** (`??`): un file nuovo non entra con
`git add <cartella>` se è ignorato, e **entra** se non lo è. Entrambi i casi vanno visti.

## 3. Due cose che vanno guardate ogni volta

- **Riservatezza.** Il repo è **pubblico**. Nessun nome di referente cliente, nessuna cifra
  contrattuale, nessun nome di un altro cliente Adobe nei commenti del codice — è già
  successo, sedici volte, e la bonifica non raggiunge la history di git.
  Gate: `pnpm audit:docs`.
- **I gate dell'app toccata.** Se hai cambiato copia: `audit:wrap` e poi di nuovo
  `audit:deck`, in quest'ordine. Legare sposta il punto di rottura.

## 4. Il messaggio

Conventional commit, in italiano, **con il perché e non solo il cosa**. Lo stile di casa è
quello del change log: si dice che cosa è cambiato e quale errore o richiesta l'ha causato.
Niente elenco di file — quello lo fa git.

## 5. Dopo

Non pushare se non te l'hanno chiesto. Se l'app committata ha una stanza vicina, lancia
**`/preflight-sala <slug>`**: il commit chiude «working tree sporco», non chiude «il panel
non copre questo».
