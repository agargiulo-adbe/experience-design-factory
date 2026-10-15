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
  /* ── Entrate o corrette il 15 ottobre 2026, dopo il panel ─────────────
     Il giro del panel ha chiesto una cosa sola, e la stessa a cinque voci:
     ogni numero di terzi deve avere la dignità dei numeri del cliente, cioè
     istituto, anno e link. Dove non ce l'aveva — il 60% e il 4,4× del
     capitolo «Le idee» — la fonte primaria è entrata qui.

     `cetif` resta l'unica fonte SENZA link, ed è giusto così: l'evento ha un
     programma pubblico, le slide no. Per la stessa ragione in pagina le tre
     direzioni sono una DOMANDA e non un'affermazione: una fonte che chi
     riceve il deck non può aprire non può reggere un'affermazione su di lui.

     ⚠️ Il nome della Divisione è «Banca dei Territori». «Retail & SME
     Division» è la dicitura inglese che compare nella firma dell'intervento,
     ma scritta in italiano accanto a «Banca dei Territori» fa sembrare che
     siano due cose diverse: chi legge dentro la banca lo vede subito. */
  cetif: {
    label: {
      it: 'Divisione Banca dei Territori, intervento al workshop CETIF del 17 settembre 2026. Evento di settore: il programma è pubblico, le slide no.',
      en: 'Banca dei Territori Division, address to the CETIF workshop of 17 September 2026. Industry event: the programme is public, the slides are not.',
    },
  },
  pmi20mld: {
    label: {
      it: 'Intesa Sanpaolo, comunicato stampa dell’8 ottobre 2026 sul piano da 20 miliardi per commercio, turismo e artigianato',
      en: 'Intesa Sanpaolo, press release of 8 October 2026 on the €20 billion plan for retail, tourism and crafts',
    },
    short: 'group.intesasanpaolo.com',
    url: 'https://group.intesasanpaolo.com/it/newsroom/comunicati-stampa/2026/10/intesa-sanpaolo-e-le-associazioni-di-categoria-del-commercio--tu',
  },
  bain: {
    label: {
      it: 'Bain & Company, «Goodbye Clicks, Hello AI», ricerca su consumatori statunitensi, 2025',
      en: 'Bain & Company, “Goodbye Clicks, Hello AI”, survey of US consumers, 2025',
    },
    short: 'bain.com',
    url: 'https://www.bain.com/insights/goodbye-clicks-hello-ai-zero-click-search-redefines-marketing/',
  },
  semrush: {
    label: {
      it: 'Semrush (società Adobe), studio sul traffico da ricerca generativa, media fra settori',
      en: 'Semrush (an Adobe company), study on AI-search traffic, cross-industry average',
    },
    short: 'semrush.com',
    url: 'https://www.semrush.com/blog/ai-search-seo-traffic-study/',
  },
  coworker: {
    label: {
      it: 'Adobe Experience League, catalogo dei flussi di CX Enterprise Coworker su Customer Journey Analytics, aggiornato il 14 ottobre 2026',
      en: 'Adobe Experience League, CX Enterprise Coworker workflow catalogue for Customer Journey Analytics, updated 14 October 2026',
    },
    short: 'experienceleague.adobe.com',
    url: 'https://experienceleague.adobe.com/en/docs/coworker/content/chat/use-cases/workflows',
  },
  /* La capacità della slide «lo schermo del Gestore». La prima versione citava
     la pagina di Decision Management che descrive il portale di chi riceve le
     chiamate: il fact-check l'ha bocciata, ed è un rilievo giusto — quella
     pagina è marcata «Legacy». La capacità corrente è il canale «code-based
     experience», che restituisce JSON a qualunque applicazione lo chieda, e la
     documentazione di Adobe arriva a nominare proprio «a customer agent's
     computer». Fonte migliore, e claim più preciso. */
  codeBased: {
    label: {
      it: 'Adobe Experience League, canale «code-based experience» di Journey Optimizer, letta il 15 ottobre 2026',
      en: 'Adobe Experience League, Journey Optimizer code-based experience channel, read on 15 October 2026',
    },
    short: 'experienceleague.adobe.com',
    url: 'https://experienceleague.adobe.com/en/docs/journey-optimizer/using/channels/code-based-experience/get-started-code-based',
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
