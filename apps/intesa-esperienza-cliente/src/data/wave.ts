/**
 * I QUATTRO FORRESTER WAVE DEL 2026 e i numeri di Adobe — fonte unica della
 * slide «adobe/slide-fsi», nel percorso dal 13 nov 2026.
 *
 * I quadranti sono le immagini originali estratte dal deck ufficiale: un Wave
 * ridisegnato da noi non sarebbe più una fonte.
 */
import wCdp from '../assets/forrester/forrester-cdp.png';
import wAnalytics from '../assets/forrester/forrester-analytics.png';
import wOptimization from '../assets/forrester/forrester-optimization.png';
import wEmail from '../assets/forrester/forrester-email.png';

export const WAVE = [
  { img: wCdp, cat: 'Customer Data Platforms for B2C', breve: 'CDP B2C', url: 'https://business.adobe.com/resources/reports/forrester-wave-customer-data-platforms-b2c-2026.html' },
  { img: wAnalytics, cat: 'Customer Analytics Technologies', breve: 'Customer Analytics', url: 'https://business.adobe.com/blog/adobe-is-a-leader-in-the-forrester-wave-customer-analytics-technologies-q2-2026' },
  { img: wOptimization, cat: 'Experience Optimisation Solutions', breve: 'Experience Optimisation', url: 'https://business.adobe.com/uk/blog/2026-forrester-experience-optimization-solutions' },
  { img: wEmail, cat: 'Email Marketing Service Providers', breve: 'Email Marketing', url: 'https://business.adobe.com/blog/leading-ai-era-email-marketing-adobe-journey-optimizer' },
];

/* I numeri, dal deck (slide 6). Fonti: Form 10-K FY2025, risultati Q4 e FY2025,
   Fast Facts. ⚠️ I link a quelle tre fonti NON sono in pagina: l'11 nov 2026
   adobe.com rispondeva 403 a ogni accesso automatico e business.adobe.com non
   era raggiungibile, e un link non aperto non si mette (regola delle fonti). */
export const NUMERI = [
  { k: '1982', v: { it: 'fondata da J. Warnock e C. Geschke', en: 'founded by J. Warnock and C. Geschke' } },
  { k: '$23,77 mld', v: { it: 'ricavi nell’esercizio 2025', en: 'fiscal 2025 revenue' } },
  { k: '+11%', v: { it: 'crescita dei ricavi nell’esercizio 2025', en: 'revenue growth in fiscal 2025' } },
  { k: '31.360', v: { it: 'dipendenti, metà fuori dagli Stati Uniti', en: 'employees, half outside the United States' } },
];
