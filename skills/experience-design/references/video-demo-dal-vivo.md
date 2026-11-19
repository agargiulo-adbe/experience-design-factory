# Il video di una demo dal vivo (Coworker e ogni app di Experience Cloud)

Nato il 17-18 nov 2026 su UniCredit: due video di CX Enterprise Coworker (Analytics, e
Analytics → Target) girati, montati e caricati senza che nessuno toccasse il mouse, e
**senza Claude in Chrome**. Da allora è il modo standard: per un'experience (slide video
di una Storia o di un Playbook) e per un account (un video da mandare dopo una call).

## Perché non serve l'estensione

Il browser lo guida il server **Playwright MCP** (`npx @playwright/mcp@latest`, già in
`~/.claude.json`). Apre un **Chromium suo**, con un profilo separato da Chrome: niente
estensioni, niente cookie, nessun account. Per questo sembra una finestra ospite. Il
login non lo fa Claude: lo fa la persona, **una volta**, in quella finestra.

## I cinque passi

1. **Apri e fai entrare la persona.** `browser_resize` 1600×900, poi `browser_navigate`
   sull'app nell'**org demo** (mai un'org di cliente). Si chiede alla persona: «fai il
   login lì dentro, con SSO e MFA, e scrivimi "fatto"». Si aspetta, non si prova da sé.
2. **Prova i prompt prima di girare.** Una domanda alla volta, a mano, con
   `browser_run_code_unsafe`: si legge la risposta (testo dell'iframe) e si decide se
   regge. Una demo si scrive come una scena: quattro domande che il team del cliente
   farebbe davvero, ognuna che parte dalla risposta della precedente.
3. **Gira.** Si legge `scripts/video-demo/riprendi.js`, si sostituisce solo il blocco
   `CONFIG` (cartella **nuova**, url, prompt) e si passa tutto come `code` a
   `browser_run_code_unsafe`. Dura quanto Coworker: dieci-dodici minuti per quattro
   domande. Esce una cartella di fotogrammi JPEG (~6 fps) e `marks.json` con i punti di
   taglio di ogni scena.
4. **Guarda i fotogrammi PRIMA di montare.** L'org demo è **condivisa**: Coworker può
   mostrare attività, bozze o nomi di altri clienti. Su UniCredit una scena Target li
   mostrava ed è stata tolta. Si fanno i mosaici (`ffmpeg … tile=3x4`) e si guardano.
5. **Monta e rendi.** Si scrive una `spec.json` (formato in testa a `monta.py`: colore,
   cartello d'apertura e di chiusura, per ogni scena domanda breve, contesto e risposta in
   due righe) e si lancia:
   ```
   bash scripts/video-demo/rendi.sh <spec.json> <out_dir> <nome>
   ```
   Esce `<nome>.mp4` (H.264, faststart) e `foglio.jpg`, sei fotogrammi da **guardare**.

## Le regole del montaggio, e da dove vengono

- **Le attese si tagliano, la risposta no.** Cartello con la domanda 2,4 s → prompt 1 s →
  attesa 0,8 s → risposta che arriva a 4x → scorrimento a 2,5x → cartello con la risposta.
  Il primo montaggio teneva il ritmo reale e un collega l'ha detto: «molto lento, anche a
  1,5x», «andrebbe contestualizzato». Chi guarda legge il cartello, non la chat.
- **La nota resta in fascia per tutto il video:** «Ambiente dimostrativo Adobe · dati
  fittizi · attese accelerate». Un'accelerazione non dichiarata è una promessa di velocità
  che il prodotto non fa.
- **Il colore** di cartelli e fascia è quello del design system del documento in cui il
  video finisce: del cliente in un'experience, Adobe in un .pptx (vedi `deliverable-format.md`).
- **Niente audio parlato**: traccia muta, così il video regge in sala e in una mail.

## Le trappole già pagate

- **Coworker vive in un iframe.** Il campo è
  `page.frameLocator('iframe').first().getByRole('textbox', {name:'AI Prompt'})`, e il testo
  della risposta si legge dal frame il cui url contiene `coworker`.
- **«Ask me later»** compare all'apertura e copre il campo: si chiude prima di tutto.
- **La fine della risposta** non ha un evento: si considera finita quando il testo resta
  uguale per quattro letture di fila e non c'è più «Thinking…».
- **«In attesa del tuo input» / «Waiting for your input»**: Coworker chiede conferma prima di
  creare qualcosa. La ripresa si ferma lì. Non si conferma al buio in un'org condivisa.
- **Un ciclo di cattura vecchio continua a scrivere** se la chiamata precedente non è finita
  pulita. Si gira sempre in una cartella nuova (lo script rifiuta una cartella piena), e il
  vecchio ciclo si ferma con `chmod a-w <cartella vecchia>`.
- **L'ffmpeg di Homebrew non ha `drawtext`**: i testi li rende `sharp` (in `render.mjs`).
- **I fotogrammi stanno in `.playwright-mcp/`** sotto la cwd della sessione, quindi in una
  cartella di account: sono materiale d'account, non si committano.

## Dove va il video

- **In un'experience**: copiato nella app e mostrato in una slide video (vedi i video di
  UniCredit Coworker POD). Prima di toccare il deck si mostra il video alla persona.
- **In un account**: nella cartella del cliente e nella cartella Teams condivisa
  (memoria `doc-in-cartella-teams`). Se serve un link interno, AEM Assets dell'org demo,
  con lo stesso Playwright: `Create Folder` → `Add Assets` → `setInputFiles` sull'input
  file dell'iframe di upload.
- Nel `ACCOUNT.md` entra la riga di log («video demo Coworker su X, mandato a Y»), non il
  metodo: il metodo è qui.
