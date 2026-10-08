/**
 * Le fonti citate in pagina. Ogni numero del deck ha una fonte PUBBLICA e una
 * data: è la regola della lista say/don't («Numeri solo se hanno una fonte
 * pubblica e una data. In dubbio, nessun numero»).
 *
 * Tutte e tre sono fonti DEL CLIENTE su sé stesso, non nostre letture: è questo
 * che rende il primo capitolo «il vostro anno visto da fuori» invece di un
 * verbale di quello che ci hanno detto in una call.
 *
 * ⚠️ Una cifra è stata SCARTATA di proposito: l'«80% delle richieste gestite
 * dall'AI entro il 2029» circola sulla stampa ma non si trova in nessuna fonte
 * di prima mano del gruppo. In dubbio, nessun numero.
 */
export const SOURCES = {
  piano: {
    label: {
      it: 'Intesa Sanpaolo, Piano d’Impresa 2026-2029, approvato il 2 febbraio 2026',
      en: 'Intesa Sanpaolo, 2026-2029 Business Plan, approved on 2 February 2026',
    },
    short: 'group.intesasanpaolo.com',
    url: 'https://group.intesasanpaolo.com/en/newsroom/all-news/news/2026/business-plan-2026-2029-growth-strategy',
  },
  tecnologia: {
    label: {
      it: 'Intesa Sanpaolo, intervista al Sole 24 Ore del 24 febbraio 2026, ripubblicata dal gruppo',
      en: 'Intesa Sanpaolo, Il Sole 24 Ore interview of 24 February 2026, republished by the group',
    },
    short: 'group.intesasanpaolo.com',
    url: 'https://group.intesasanpaolo.com/it/newsroom/tutte-le-news/news/2026/intervista-massimo-proverbio-sole24ore',
  },
  santander: {
    label: {
      it: 'Caso cliente pubblicato da Adobe · Santander Brasil',
      en: 'Customer story published by Adobe · Santander Brasil',
    },
    short: 'business.adobe.com',
    url: 'https://business.adobe.com/br/customer-success-stories/santander-case-study.html',
  },
} as const;
