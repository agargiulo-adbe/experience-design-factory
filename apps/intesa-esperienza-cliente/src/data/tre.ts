/**
 * LE TRE COSE — fonte unica delle due slide di sintesi.
 *
 * La slide dei blocchi dell'offerta legge `riga`. Una fonte sola: due copie divergono.
 */
export interface Cosa {
  n: string;
  /** Il gruppo dell'offerta: porta il colore, che è un contratto. */
  gruppo: 'trovare' | 'engagement' | 'piattaforma';
  /** L'ancora: due o tre parole, non una frase. */
  t: { it: string; en: string };
  /** Slide A — che cosa vedrete. Una riga. */
  riga: { it: string; en: string };
  prodotto: string;
}

export const TRE: Cosa[] = [
  {
    n: '1', gruppo: 'trovare', prodotto: 'Adobe Brand Visibility',
    t: { it: 'Farsi trovare', en: 'Being found' },
    riga: { it: 'Chi cerca casa lo chiede anche a un assistente AI. Se Intesa non è citata, il confronto parte senza di voi.', en: 'People looking for a home also ask an AI assistant. If Intesa is not cited, the comparison starts without you.' },
  },
  {
    n: '2', gruppo: 'engagement', prodotto: 'Adobe Experience Platform',
    t: { it: 'Ingaggio del cliente e del prospect', en: 'Customer and prospect engagement' },
    riga: { it: 'La proposta giusta a ogni persona, su ogni canale.', en: 'The right proposal for each person, on every channel.' },
  },
  {
    n: '3', gruppo: 'piattaforma', prodotto: 'Adobe CX Analytics',
    t: { it: 'Misurare in un posto solo', en: 'Measuring in one place' },
    riga: { it: 'App, sito, contact center e filiale: quanti report servono oggi per tenerli insieme?', en: 'App, site, contact centre and branch: how many reports does it take today to hold them together?' },
  },
];
