/**
 * Le storie di clienti — FONTE UNICA.
 *
 * Due storie pubbliche, aperte e lette il 17 novembre 2026 sulle pagine di
 * business.adobe.com. Una referenza Adobe su un gestore di prestazioni
 * sanitarie (un TPA) non risulta pubblicata: non si finge di averla, si
 * portano i due casi più vicini e si dice perché.
 *
 * ⚠️ Inail: la pagina pubblica dice 98% di recapito; un deck interno Adobe
 * dice 99%. Vince la pagina, che il cliente può aprire.
 * ⚠️ CSS: il «riprendere da dove ci si era fermati» riguarda chi SOTTOSCRIVE
 * una polizza, non chi chiede un rimborso. Lo stack del caso (Campaign dal
 * 2020) è precedente a Journey Optimizer: la slide lo dice.
 * ⚠️ Unipol è stato tolto il 17 nov 2026 (decisione dell'owner): concorrente
 * diretto di InSalute, e la referente non vuole il paragone.
 */
export const FONTI = {
  inail: 'https://business.adobe.com/it/customer-success-stories/inail.html',
  css: 'https://business.adobe.com/it/customer-success-stories/css-versicherung-case-study.html',
};

type L = { it: string; en: string };
export interface Caso {
  slug: string; nome: string;
  occ: L;
  titolo: { pre: L; accento: L };
  hero: { occ: L; prima?: { n: L }; oggi: { k: L; n: L }; l?: L };
  metrica: { n: string; l: L; lBreve?: L };
  nota?: L;
  riquadri: { n: string; l: L; lBreve?: L }[];
  fascia: { occ: L; testo: L; icona: 'riprende' | 'rete' | 'strati' };
  ponte?: L; ponteBreve?: L;
  fonte: { url: string; nome: string };
  /** Dopo il link: di che cosa è fonte. */
  fonteCoda?: L;
}

const VERIFICATO: L = {
  it: ' · caso pubblico, verificato il 17 novembre 2026',
  en: ' · public case study, checked 17 November 2026',
};

export const CASI: Record<'inail' | 'css', Caso> = {
  inail: {
    slug: 'inail', nome: 'Inail',
    occ: { it: 'Un caso italiano · assicurazione pubblica', en: 'An Italian case · public insurer' },
    titolo: {
      pre: { it: 'Inail:', en: 'Inail:' },
      accento: { it: 'oltre 200 moduli diventati servizi digitali', en: 'over 200 forms turned into digital services' },
    },
    hero: {
      occ: { it: 'Moduli e documenti per assicurati e aziende', en: 'Forms and documents for policyholders and employers' },
      oggi: { k: { it: 'Moduli convertiti', en: 'Forms converted' }, n: { it: '200+', en: '200+' } },
      l: { it: 'accessibili e conformi a WCAG 2.1 AA, su ogni dispositivo', en: 'accessible and WCAG 2.1 AA compliant, on every device' },
    },
    metrica: { n: '98%', l: { it: 'tasso di recapito su oltre 135.000 comunicazioni ai clienti', en: 'delivery rate across more than 135,000 customer communications' } },
    riquadri: [
      { n: '+18%', l: { it: 'traffico sul sito dopo il lancio del nuovo portale', en: 'site traffic after the new portal launched' } },
      { n: '700+', l: { it: 'servizi digitali per lavoratori, datori di lavoro e partner', en: 'digital services for workers, employers and partners' } },
    ],
    fascia: {
      icona: 'strati',
      occ: { it: 'Prima pubblica amministrazione italiana su Experience Manager Forms', en: 'The first Italian public body on Experience Manager Forms' },
      testo: { it: 'Experience Manager Sites e Forms · Journey Optimizer · Customer Journey Analytics · Target', en: 'Experience Manager Sites and Forms · Journey Optimizer · Customer Journey Analytics · Target' },
    },
    ponte: {
      it: 'Come voi, Inail serve assicurati, aziende e partner: moduli e comunicazioni sono la parte del servizio che si vede.',
      en: 'Like you, Inail serves policyholders, employers and partners: forms and communications are the visible part of the service.',
    },
    fonte: { url: FONTI.inail, nome: 'business.adobe.com · Inail' },
    fonteCoda: VERIFICATO,
  },
  css: {
    slug: 'css', nome: 'CSS',
    occ: { it: 'Un caso internazionale · assicurazione malattia, Svizzera', en: 'An international case · health insurer, Switzerland' },
    titolo: {
      pre: { it: 'CSS:', en: 'CSS:' },
      accento: { it: 'ogni passo della pratica, confermato', en: 'every step of the process, confirmed' },
    },
    hero: {
      occ: { it: 'Il tempo per preparare una comunicazione', en: 'Time to prepare a communication' },
      prima: { n: { it: '1 giornata', en: '1 day' } },
      oggi: { k: { it: 'Oggi', en: 'Today' }, n: { it: '1 ora', en: '1 hour' } },
      l: { it: 'per una newsletter, da quando è entrato Adobe Campaign', en: 'for a newsletter, since Adobe Campaign came in' },
    },
    metrica: { n: '+570%', l: { it: 'polizze sottoscritte online, senza passare da un consulente', en: 'policies taken out online, without an adviser' } },
    riquadri: [],
    fascia: {
      icona: 'riprende',
      occ: { it: 'Una email di conferma a ogni passaggio', en: 'A confirmation email at every step' },
      testo: { it: 'Chi sottoscrive una polizza riprende da dove si era fermato, <span class="ins-coda">su qualunque dispositivo.</span>', en: 'People taking out a policy pick up where they left off, on any device.' },
    },
    ponte: {
      it: 'Un caso del 2020, su Adobe Campaign: è il principio della prima idea, avvisare prima che l’assicurato chieda.',
      en: 'A 2020 case, on Adobe Campaign: the principle behind our first idea, telling people before they ask.',
    },
    fonte: { url: FONTI.css, nome: 'business.adobe.com · CSS' },
    fonteCoda: VERIFICATO,
  },
};
