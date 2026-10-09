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
  /* ── Le tre fonti di prodotto del capitolo «Le idee» ──────────────────
     Servono perché una slide che spiega una capacità deve poter essere
     verificata da chi la riceve, senza passare da noi. Tutte lette l'8
     ottobre 2026: la data sta in pagina, perché le pagine prodotto cambiano. */
  genstudioPm: {
    label: {
      it: 'Adobe, pagina prodotto GenStudio for Performance Marketing, letta l’8 ottobre 2026',
      en: 'Adobe, GenStudio for Performance Marketing product page, read on 8 October 2026',
    },
    short: 'business.adobe.com',
    url: 'https://business.adobe.com/products/genstudio/performance-marketing.html',
  },
  brandVisibility: {
    label: {
      it: 'Adobe, pagina prodotto Brand Visibility, letta l’8 ottobre 2026',
      en: 'Adobe, Brand Visibility product page, read on 8 October 2026',
    },
    short: 'business.adobe.com',
    url: 'https://business.adobe.com/products/brand-visibility.html',
  },
  aiDecisioning: {
    label: {
      it: 'Adobe, pagina prodotto AI decisioning in Journey Optimizer, letta il 9 ottobre 2026',
      en: 'Adobe, AI decisioning in Journey Optimizer product page, read on 9 October 2026',
    },
    short: 'business.adobe.com',
    url: 'https://business.adobe.com/products/journey-optimizer/ai-decisioning.html',
  },
  cjaUpgrade: {
    label: {
      it: 'Adobe Experience League, documentazione di passaggio a Customer Journey Analytics, aggiornata il 28 settembre 2026',
      en: 'Adobe Experience League, Customer Journey Analytics upgrade documentation, updated 28 September 2026',
    },
    short: 'experienceleague.adobe.com',
    url: 'https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/upgrade-to-cja/cja-upgrade-recommendations',
  },
} as const;
