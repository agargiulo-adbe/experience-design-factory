/**
 * LE FRASI CHE VIVONO IN DUE PERCORSI, definite UNA VOLTA.
 *
 * ⚠️ PERCHÉ ESISTE QUESTO FILE. Il percorso intero e il taglio da dieci minuti
 * dicono alcune cose uguali: la chiusa di un capitolo, il titolo del modello di
 * costo, le due righe su che cosa muove il conto. Finché quelle frasi stanno
 * scritte a mano in due pagine, divergono — non è una possibilità, è una
 * certezza, e diverge il taglio corto, perché le correzioni arrivano sul lungo.
 * Qui stanno una volta sola, e le due pagine le importano.
 *
 * Lo verifica `DECK_URL=… pnpm audit:taglio --app bper-sopra-quello-che-avete`,
 * che è HARD su una stringa scritta a mano in due pagine e in nessuna fonte.
 */
export interface Due { it: string; en: string }

/** Le chiuse di capitolo che il taglio riprende. */
export const CHIUSE = {
  perimetro: {
    it: 'Il perimetro del cambiamento è la fascia di mezzo. Sopra e sotto non si tocca niente.',
    en: 'The change is confined to the middle band. Above and below, nothing is touched.',
  },
  mappa: {
    it: 'Due blocchi escono. Di nove, sette non li tocchiamo',
    en: 'Two blocks go out. Of nine, we touch none of the other seven',
  },
  terzoModulo: {
    it: 'Il modulo che cambia la giornata di chi fa campagne è il terzo, e oggi in casa non ha un equivalente.',
    en: "The module that changes a campaign manager’s day is the third, and today it has no equivalent in-house.",
  },
} as const satisfies Record<string, Due>;

/** Il modello di costo: titolo e le due righe che muovono il conto. */
export const COSTO = {
  titolo: {
    it: 'Si paga su quanto si usa, non su quante persone lo usano',
    en: 'You pay on how much is used, not on how many people use it',
  },
  alza: {
    it: 'Il dato portato dentro quando poteva restare fuori: per questo le due domande di prima contano.',
    en: 'Data brought in when it could have stayed out: that is why the two earlier questions matter.',
  },
  abbassa: {
    it: 'Partire da un canale e un percorso: si paga il perimetro acceso, non quello previsto.',
    en: 'Starting from one channel and one journey: you pay for what is switched on, not for what is planned.',
  },
  cifra: {
    it: 'Una cifra senza perimetro è un numero da ritirare.',
    en: 'A figure without scope is a number to be withdrawn.',
  },
} as const satisfies Record<string, Due>;

/** L’ask: sta in UN posto solo. Due versioni della richiesta sono il modo più
 *  rapido di sembrare confusi davanti a un cliente. */
export const ASK = {
  titolo: {
    it: 'Mezza giornata, con chi conosce i vostri sistemi',
    en: 'Half a day, with the people who know your systems',
  },
  riga: {
    it: "Due blocchi cambiano, il resto resta vostro. Il passo successivo è una mezza giornata sui vostri sistemi, non un’altra presentazione.",
    en: 'Two blocks change, the rest stays yours. The next step is half a day on your systems, not another presentation.',
  },
} as const satisfies Record<string, Due>;
