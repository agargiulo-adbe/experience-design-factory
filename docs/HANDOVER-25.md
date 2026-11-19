# Handover — Parte 25 di 25
> Torna all'indice: [HANDOVER.md](./HANDOVER.md) · [README.md](./README.md)

## 42.26 Storia di Intesa · il 18 sera e il 19 novembre, la slide Forrester sul messaggio, la copia offline, il video di Coworker che «non parte»

Nata il **19 nov** perché la Parte 24 è a 1,2 KB dal tetto.

### La slide Forrester (`#slide-fsi`, `src/pages/adobe.astro`) — `8196055`, `b64f677`, `1f3f16b`
- **Il messaggio è il titolo.** «Servizi finanziari, la prima industry di Adobe» (EN «Financial services, Adobe's number one industry») era prima un occhiello (`8196055`), troppo piccolo per lo scopo dichiarato dall'owner: *lasciare loro questo messaggio chiaro*. Con `1f3f16b` diventa l'`h2`; l'occhiello sparisce (ban del craft floor, e comunque ridondante).
- **Gerarchia a tre livelli:** titolo (`.im-fsi-t`, `clamp(2.1rem, 3·--vu, 5.8rem)`) → prova 1 in lead, «Le dieci maggiori banche degli Stati Uniti usano Adobe Experience Cloud» (`b64f677`, fonte Adobe Fast Facts · Fortune 500, 2023) → prova 2 come `h3` verde, «Leader in quattro Forrester Wave del 2026», sopra i quattro quadranti → la striscia dei numeri in fondo, più sommessa.
- **19 nov, owner:** il titolo diventa «FSI, la prima industry di Adobe» (EN «FSI, Adobe's number one industry») e il lead perde il punto finale; etichetta in `slides.ts` e nota del relatore allineate. Gate: `wrap-audit` PULITO, `audit:deck --only adobe` stessi 11 rilievi preesistenti.
- ⚠️ **Scelta dell'owner, non fatto verificato:** nessuna fonte pubblica dice che i servizi finanziari sono «la prima industry» di Adobe. L'owner l'ha tenuta sapendolo; la frase di ripiego sta nella nota del relatore (`src/data/relatore.ts`, `seChiedono`, con la riserva «Fortune 500 2023, solo USA»). Non promuoverla a fatto in altri deck.
- Trappole incontrate: `[data-slide] #slide-fsi …` **non** prende niente perché `[data-slide]` e `#slide-fsi` sono lo **stesso** elemento (serve `#slide-fsi h2…`); come quinta colonna della striscia la frase sulle banche sborda a 1280 (+2 rilievi); a 1280×800 la riga delle fonti andava a capo sul co-brand, accorciata in «Fortune 500, 2023».
- Gate: `audit:deck --only adobe` 11 fallimenti, **tutti preesistenti** (baseline invariata); `wrap-audit` PULITO. Inglese **non** verificato a vista (in Playwright `localStorage edf:lang` non cambia lingua).

### La copia offline per il 19 (non nel repo)
- `Deck Intesa 19 nov - offline.zip` (170 MB) nella cartella OneDrive del team Intesa, `202611_Meeting_Calabrese`. Stessa forma di quella del 13 nov: eseguibile Mac universale (`deno compile` aarch64 + x86, `lipo`, firma ad hoc), `.exe` Windows, cartella «Riserva» con avvio PowerShell/Python, Open Sans e le due clip dell'innesto **locali**; rifatto il 19 sul commit del titolo «FSI» (il `LEGGIMI.txt` dice quale).
- **Lo script che la genera** era rimasto in uno scratchpad di sessione (perso): ricostruito e ora in **`docs/Factory/pacchetto-offline/`** (git-ignorato): `pacchetto.sh <commit> <cartella di destinazione>` più `src/` (`server.ts`, `LEGGIMI.txt`, lanciatori di riserva). Va rilanciato dopo `pnpm --filter intesa-esperienza-cliente build` se il deck cambia.
- Il server si lega a **127.0.0.1** dalla porta 4417 in su, ma stampa e apre `localhost`: su una macchina dove `[::1]:4417` è di un'altra anteprima, `localhost` apre l'app sbagliata. Il link sicuro è `http://127.0.0.1:4417/experience-design-factory/intesa-esperienza-cliente/`.
- Prova a rete esterna bloccata: carattere, clip di copertina e slide nuove a posto. **Il video di Coworker resta online** (streaming Dynamic Media): senza rete non parte.

### «Il video di Coworker non parte al play» (19 nov) — non è il deck
- Riprodotto nel **Google Chrome 157 vero** (Playwright `channel: 'chrome'`; il Chromium di Playwright lo fa partire e inganna): al play il video gira ~0,2 s e riceve un `pause` **nativo**: nessuno script chiama `pause()`, l'elemento non esce dal DOM. Uguale **online** e sulla pagina `/play` di Adobe aperta da sola.
- **In muto scorre; con l'audio si ferma.** Sul Mac l'uscita audio predefinita erano le cuffie Bluetooth Bose QC Ultra, collegate: la causa più probabile è la loro pausa automatica quando non si indossano, che Chrome esegue. Non verificata cambiando l'uscita. In sala (audio su HDMI o altoparlanti) non si presenta.
- **Metodo da tenere:** quando «non parte» si prova nel browser vero dell'utente, si separa muto da audio, e si intercettano `HTMLMediaElement.prototype.pause` + l'evento `pause`: se c'è l'evento e non la chiamata, la pausa viene da fuori della pagina.
- Difetto minore trovato strada facendo (P2): il ripiego a 9 s in `coworker.astro` (`setTimeout(… ripiego …, 9000)`) scatta anche se la slide del video è ancora nascosta; quando la slide si apre il player vero lo sostituisce, quindi non blocca.

⚠️ **Panel:** lo stato del 18 sera **non** è coperto da nessun giro; resta il P0 Intesa in Parte 2.
