# Handover — Parte 16 di 17
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

---

## 37. Trenitalia — «Dove può arrivare il viaggio» (Prospettiva, Direzione Sales)

`apps/trenitalia-prospettiva-sales` · nata l'**11 ottobre 2026**, live il 12 · tipo **Prospettiva**
· IT · **27 slide su 8 rotte** · `defaultPublished: false` (fuori dalla vetrina pubblica).
È l'artefatto che il P1 del 9 ottobre chiedeva di costruire, e che quella voce dava ancora come
«da fare»: il dossier era pronto da giorni, l'experience no.

### 37.1 Da dove viene — la registrazione, non il riassunto

Il punto di partenza è la riunione interna di preparazione del **9 ottobre** (registrazione Plaud).
La trascrizione è stata letta **per intero**: il riassunto automatico, come al solito, sbagliava
nomi propri e appiattiva i disaccordi. Tre cose sono uscite solo dal parlato:

- un **disaccordo interno non risolto** sul posizionamento rispetto al referente tecnologico di
  Gruppo — registrato nel dossier **come disaccordo**, non ricomposto a tavolino;
- la richiesta esplicita di preparare **agenda e abstract** da mandare alla segreteria;
- l'ipotesi, poi verificata e **smentita**, che un certo prodotto fosse disponibile:
  **Conversation Insights non è uscito ed è di CJA**, non di Analytics (memoria
  `trenitalia-direzione-sales`).

Il dossier interno (`docs/Ferrovie/`, git-ignorata) è passato da 16 a **17 sezioni** con la bozza
di agenda titolo per titolo, e ha incassato nove fonti nuove. Dall'agenda interna sono nati i due
artefatti per il cliente: la **proposta di agenda** e un `.eml` apribile in Outlook
(`X-Unsent: 1`, oggetto ASCII, `multipart/alternative`) — perché la segreteria riceve una mail,
non un file Markdown.

### 37.2 I sette capitoli

Apertura · La domanda · **La ricerca** · Il viaggio · Il contenuto · La rete · La rotta.
I quattro centrali sono **i quattro temi dell'agenda mandata al cliente**, nello stesso ordine:
così chi ha letto la mail ritrova il documento che si aspetta. Il filo è «dove si perdono le
vendite»: prima del sito (la visibilità nelle risposte generate), dentro l'offerta
(l'intermodale), a valle (il contenuto), nel canale suo (~70.000 punti vendita).

### 37.3 La misura — il capitolo che ha cambiato la tesi due volte

Il capitolo «La ricerca» non porta una teoria ma **una misura nostra**, rifatta davanti alla
stessa domanda: *quando qualcuno chiede a un assistente come si va da A a B, Trenitalia viene
nominata? E trenitalia.com compare fra le fonti?* Otto domande, una per conversazione nuova,
**nessun nome di marca dentro la domanda**.

| Misura | Google (risposta generata) | ChatGPT |
|---|---|---|
| Trenitalia nominata | 6 / 8 | 7 / 8 |
| `trenitalia.com` fra le fonti | **2 / 8** | **7 / 8** |
| Attribuzione sbagliata | 2 / 8 | 0 / 8 |

⚠️ **La misura ha corretto il deck due volte, e la seconda ha salvato una slide dall'accusa
sbagliata.** Con un motore solo la tesi era «gli assistenti vi ignorano»; con due è diventata
**«dipende da quale assistente»**, che è più debole da dire e molto più difendibile in sala —
e l'errore sulle Frecce, che stava per diventare un'accusa generica, si è rivelato **di Google**,
non di tutti. È il caso da ricordare quando viene la tentazione di misurare una fonte sola.

**Quello che non si è potuto completare** (12 ott): **Gemini 0 domande su 8** e **Perplexity 2 su
8**. Perplexity esaurisce le ricerche gratuite dopo tre domande; su Gemini la sessione aziendale
esiste sul profilo del browser, ma davanti alla chat c'è un dialogo di accettazione dei termini
che **non è un'azione da prendere per conto dell'owner**. Le due risposte di Perplexity — prodotto
nominato («Frecciarossa e Italo»), **operatore no**, fonti di blog di viaggio — puntano verso il
comportamento di Google; restano nel documento di misura e **fuori dal deck**, perché due risposte
non fanno una colonna. Il deck dichiara il proprio perimetro in chiaro, nel blocco di metodo.

Il blocco di metodo è un `HowItWorks` sulla copertina del capitolo: chi presenta non è obbligato
ad aprirlo, chi legge il deck da solo trova lì come è stata fatta la misura. Dice anche quale
assistente e **con quali domande**: una misura senza il suo metodo è un'opinione con dei numeri
davanti.

### 37.4 Pelle, asset, guscio sensoriale

Design system **letto** da trenitalia.com e condiviso con `trenitalia-connessioni`: ardesia di
sistema `#2f394e`, rosso di marchio `#d91835`, **Poppins** (per una volta il carattere vero del
cliente è distribuibile). Dominante **scura**, quindi `--surface-inverse` è la superficie
**chiara**: è la trappola che ha prodotto quasi tutti i difetti di questo giro.

- **8 sfondi Firefly** (`backdrops.manifest.ts`), due famiglie — `ink` per le slide scure, `soft`
  per le chiare — con **grade duotone** per slot. Il duotone non è un vezzo: chiesta la palette a
  parole il modello restituisce comunque neon ciano e arancio, cioè i colori di un'altra azienda.
  Il duotone rimappa la luminanza fra due colori del marchio, e l'immagine esce ardesia qualunque
  cosa abbia generato il modello.
- **2 clip in loop** (copertina e chiusura), camera bloccata con `pan, tilt, zoom, dolly` nel
  negativo, ricucite con `loop:seamless`. Gli `.mp4` stanno sul Release `media`, non nel repo.
- Niente treni, niente mezzi riconoscibili, niente persone: un treno generato somiglia sempre al
  treno di qualcuno, ed è la wrong-brand imagery che la Quality Bar vieta.

### 37.5 Due gate nuovi, nati dai difetti di questa experience

- **`pnpm audit:ink`** (`scripts/ink-audit.ts`) — il contrasto del **testo**, misurato sui pixel.
  È nato perché una copertina di capitolo era **ardesia su ardesia, illeggibile, con `audit:deck`
  a 0 HARD**: il check `h` guarda i bottoni, il testo delle slide non lo guardava nessuno. Non
  legge il CSS: ritaglia il rettangolo di ogni blocco dallo screenshot, prende il colore modale
  come fondo e il pixel più lontano come inchiostro, così scrim e backdrop sono già dentro la
  misura. ⚠️ Girato su tutto il monorepo ha trovato **259 blocchi sotto AA su 12 experience**
  (maxmara 77, ferrari 52, trenitalia-connessioni 52, unicredit 44; quattro pulite) — riportati,
  **non corretti**: fuori dal perimetro di questo lavoro, e sono un P1 a sé.
- **`pnpm audit:fonti`** (`scripts/source-audit.ts`) — ogni fonte pubblica porta il link, e il
  link risponde. HARD sui link che non rispondono, SOFT sulle righe di fonte senza link (che sono
  legittime quando rimandano a una misura nostra o a un documento interno). ⚠️ **403 non vuol dire
  rotto**: Gartner e parecchi editori rispondono 401/403/429 a qualunque accesso automatico, e
  `helpx.adobe.com` dà 403 a HEAD e 200 alla GET sullo stesso URL. Il gate ritenta con GET, aspetta
  e ritenta una seconda volta sui timeout, e mette i bloccati in una lista «da aprire a mano»:
  un gate che grida al lupo viene ignorato, ed è il contrario del suo scopo.

Entrambi sono **BINDING in `CLAUDE.md`**, insieme alla regola che `copy-audit` **si lancia**, non
si ricorda.

### 37.6 Lo stato dei gate al 12 ottobre

`audit:deck -- --tv` **0 HARD su 135 misure** slide×viewport (i 9 rilievi residui sono tutti `a`,
banda di lettura, SOFT) · `exp:ok` su ogni slide, quindi il blocco di metodo regge anche da aperto
· `audit:ink` **pulito** · `audit:wrap` **pulito** · `audit:fonti` nessun link rotto · `copy-audit`
**0 HARD / 0 SOFT**. Otto rotte a 200 in produzione.

### 37.7 Che cosa manca (le voci sono nel backlog §10, Parte 2)

**Panel review mai lanciata** — è un P0 di gate: l'experience è costruita, pubblicata e mai vista
da uno stakeholder simulato. **Cover dello showcase** assente (`shots/trenitalia-prospettiva-sales.webp`)
e la `desc` nel record della vetrina è ancora quella dello scaffold («copy e design system arrivano
ancora dal brief»), che oggi è falsa. **Letto sonoro** non montato: licenziare una traccia Adobe
Stock consuma una licenza, quindi si chiede prima. E la misura resta a **due motori su quattro**.

---

## 38. TIM — «Una campagna, molti formati» (stato di fatto, 12 ott 2026)

`apps/tim-contenuti-su-scala` · tipo **Prospettiva** · 4 capitoli · accento `#004691` ·
`defaultPublished: false`. **Non è lavoro di questa sessione**: è un workstream parallelo che
lavora sul ramo `feat/tim-content-at-scale`. Qui si registra solo quello che è verificabile nel
repo, perché il suo stato ha smesso di essere privato di quel ramo.

⚠️ **Come ci è finita su `main`.** L'11 ottobre un `git add -A` lanciato mentre il working tree era
su quel ramo ha incluso **18 file di TIM** in un commit di Trenitalia, che è stato pushato e
**deployato**: l'app risponde **200** su GitHub Pages ed è registrata in `deploy.yml`, nello hub,
nello showcase (spenta) e in `deck-routes.ts`. L'errore è stato dichiarato subito e il working tree
è stato restituito a quel ramo senza toccare i loro file. **La decisione su che cosa farne è
dell'owner** e sta nel backlog: togliere i file da `main`, togliere solo la card dello hub, o
lasciarli. Finché restano, valgono per quell'app le stesse regole delle altre — panel review
compresa, che non è mai stata lanciata.

**La regola che resta, ed è la parte utile dell'incidente:** in questo repo **non si usa
`git add -A`**, e si verifica il ramo prima di ogni commit. I file si elencano uno per uno. Dove
due lavori insistono sullo stesso tree, il commit si fa da un **worktree separato** sul ramo
giusto — è così che sono stati fatti i commit del 12 ottobre, senza sfiorare il lavoro altrui.

---
