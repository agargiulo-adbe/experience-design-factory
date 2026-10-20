/**
 * Le fonti citate in pagina. Ogni numero del deck ha una fonte PUBBLICA e una
 * data: è la regola della lista say/don't («Numeri solo se hanno una fonte
 * pubblica e una data. In dubbio, nessun numero»).
 *
 * Le fonti del cliente sono fonti DEL CLIENTE su sé stesso, non nostre letture:
 * è questo che rende il primo capitolo «il vostro anno visto da fuori» invece
 * di un verbale di quello che ci hanno detto in una call.
 *
 * FORMA DELL'ETICHETTA. È una citazione COMPATTA: che cos'è, e quando. Niente
 * «Intesa Sanpaolo,» in testa alle fonti del cliente — il deck è indirizzato a
 * loro e l'occhiello della slide dice già «dichiarati da voi»; per le fonti
 * Adobe l'editore invece si nomina, perché lì non è ovvio. L'etichetta è anche
 * il LINK: il dominio accanto raddoppiava la riga senza aggiungere niente, e
 * con due fonti sulla stessa riga lo stesso dominio compariva due volte.
 *
 * ⚠️ Una cifra è stata SCARTATA di proposito: l'«80% delle richieste gestite
 * dall'AI entro il 2029» circola sulla stampa ma non si trova in nessuna fonte
 * di prima mano del gruppo. In dubbio, nessun numero.
 */
export const SOURCES = {
  piano: {
    label: {
      it: 'Piano d’Impresa 2026-2029, approvato il 2 febbraio 2026',
      en: '2026-2029 Business Plan, approved 2 February 2026',
    },
    short: 'group.intesasanpaolo.com',
    url: 'https://group.intesasanpaolo.com/en/newsroom/all-news/news/2026/business-plan-2026-2029-growth-strategy',
  },
  tecnologia: {
    label: {
      it: 'Intervista al Sole 24 Ore del 24 febbraio 2026, ripubblicata dal gruppo',
      en: 'Il Sole 24 Ore interview of 24 February 2026, republished by the group',
    },
    short: 'group.intesasanpaolo.com',
    url: 'https://group.intesasanpaolo.com/it/newsroom/tutte-le-news/news/2026/intervista-massimo-proverbio-sole24ore',
  },
  /* Il comunicato dell'8 ottobre 2026. Prima il deck citava i 20 miliardi con
     la data ma SENZA il documento: un fatto datato e non verificabile è
     esattamente ciò che la regola delle fonti esiste per impedire. Dallo stesso
     comunicato vengono le «circa 800.000 piccole e piccolissime aziende
     clienti della Divisione», che è il numero che rende concreta la slide. */
  piccoleImprese: {
    label: {
      it: 'Comunicato della Divisione Banca dei Territori, 8 ottobre 2026',
      en: 'Banca dei Territori Division press release, 8 October 2026',
    },
    short: 'group.intesasanpaolo.com',
    url: 'https://group.intesasanpaolo.com/it/newsroom/comunicati-stampa/2026/10/intesa-sanpaolo-e-le-associazioni-di-categoria-del-commercio--tu',
  },
  santander: {
    label: {
      it: 'Caso cliente pubblicato da Adobe · Santander Brasil',
      en: 'Customer story published by Adobe · Santander Brasil',
    },
    short: 'business.adobe.com',
    url: 'https://business.adobe.com/br/customer-success-stories/santander-case-study.html',
  },
  /* ── Le fonti di prodotto ─────────────────────────────────────────────
     Servono perché una slide che spiega una capacità deve poter essere
     verificata da chi la riceve, senza passare da noi. La data di lettura sta
     in etichetta, perché le pagine prodotto cambiano. */
  genstudioPm: {
    label: {
      it: 'Adobe, pagina prodotto GenStudio for Performance Marketing, letta l’8 ottobre 2026',
      en: 'Adobe, GenStudio for Performance Marketing product page, read 8 October 2026',
    },
    short: 'business.adobe.com',
    url: 'https://business.adobe.com/products/genstudio/performance-marketing.html',
  },
  brandVisibility: {
    label: {
      it: 'Adobe, pagina prodotto Brand Visibility, letta l’8 ottobre 2026',
      en: 'Adobe, Brand Visibility product page, read 8 October 2026',
    },
    short: 'business.adobe.com',
    url: 'https://business.adobe.com/products/brand-visibility.html',
  },
  aiDecisioning: {
    label: {
      it: 'Adobe, pagina prodotto AI decisioning in Journey Optimizer, letta il 9 ottobre 2026',
      en: 'Adobe, AI decisioning in Journey Optimizer product page, read 9 October 2026',
    },
    short: 'business.adobe.com',
    url: 'https://business.adobe.com/products/journey-optimizer/ai-decisioning.html',
  },
  cjaUpgrade: {
    label: {
      it: 'Adobe Experience League, passaggio a Customer Journey Analytics, aggiornata il 16 ottobre 2026',
      en: 'Adobe Experience League, upgrade to Customer Journey Analytics, updated 16 October 2026',
    },
    short: 'experienceleague.adobe.com',
    url: 'https://experienceleague.adobe.com/en/docs/analytics-platform/using/compare-aa-cja/upgrade-to-cja/cja-upgrade-recommendations',
  },
  /* La slide «quattro domande» nomina Coworker e gli attribuisce una capacità:
     la domanda scritta a parole e la risposta sui dati di percorso. Un prodotto
     nominato porta la sua pagina pubblica, come ogni altra fonte. */
  coworkerChat: {
    label: {
      it: 'Adobe Experience League, Coworker Chat, letta il 20 ottobre 2026',
      en: 'Adobe Experience League, Coworker Chat, read 20 October 2026',
    },
    short: 'experienceleague.adobe.com',
    url: 'https://experienceleague.adobe.com/en/docs/coworker/content/chat/overview',
  },
} as const;

export type SourceKey = keyof typeof SOURCES;
