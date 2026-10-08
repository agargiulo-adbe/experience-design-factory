/**
 * Le fonti citate in pagina. Ogni numero del deck ha una fonte PUBBLICA e una
 * data: è la regola della lista say/don't («Numeri solo se hanno una fonte
 * pubblica e una data. In dubbio, nessun numero»).
 *
 * Quello che il cliente ci ha detto di sé NON sta qui: è una fonte privata, si
 * attribuisce in pagina come «quello che ci avete detto» e senza data pubblica.
 */
export const SOURCES = {
  santander: {
    label: {
      it: 'Caso cliente pubblicato da Adobe · Santander Brasil',
      en: 'Customer story published by Adobe · Santander Brasil',
    },
    url: 'https://business.adobe.com/br/customer-success-stories/santander-case-study.html',
  },
} as const;
