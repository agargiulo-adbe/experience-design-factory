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
    riga: { it: 'Chi cerca casa lo chiede anche a un assistente AI. Se l’assistente cita altre tre banche, il confronto si fa su quelle.', en: 'People looking for a home also ask an AI assistant. If it cites three other banks, the comparison happens on those.' },
  },
  {
    n: '2', gruppo: 'engagement', prodotto: 'Adobe Experience Platform',
    t: { it: 'Ingaggio di clienti e non clienti', en: 'Engaging customers and non-customers' },
    riga: { it: 'Quale proposta mostrare a chi non è ancora cliente, sul canale che il consenso permette.', en: 'Which offer to show someone not yet a customer, on the channel consent allows.' },
  },
  {
    n: '3', gruppo: 'piattaforma', prodotto: 'Adobe CX Analytics',
    t: { it: 'Misurare in un posto solo', en: 'Measuring in one place' },
    riga: { it: 'Filiale, Filiale Digitale, app e sito nello stesso report, fino alla firma.', en: 'Branch, Filiale Digitale, app and site in the same report, up to the signature.' },
  },
];
