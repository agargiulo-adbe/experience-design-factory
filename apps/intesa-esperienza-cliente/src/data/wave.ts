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

/* `q` è il trimestre del report; `per` dice che cosa vuol dire quel quadrante
   per una banca: senza, il quadrante è una medaglia di qualcun altro. Righe
   riprese dalla versione del 5 nov 2026 (owner, 13 nov: la slide aveva perso
   il suo senso «Adobe nei servizi finanziari»). La riga `pro` di allora, il
   perché di Forrester, NON torna: per CDP ed Email non è mai stata ritrovata
   sul report, e mezza fonte davanti a un CIO è peggio di nessuna. */
export const WAVE = [
  { img: wCdp, cat: 'Customer Data Platforms for B2C', breve: 'CDP B2C', url: 'https://business.adobe.com/resources/reports/forrester-wave-customer-data-platforms-b2c-2026.html',
    q: { it: 'Leader · 3° trim. 2026', en: 'Leader · Q3 2026' },
    per: { it: 'Un profilo per ogni cliente, pronto da usare su tutti i canali', en: 'One profile per customer, ready to use across every channel' } },
  { img: wAnalytics, cat: 'Customer Analytics Technologies', breve: 'Customer Analytics', url: 'https://business.adobe.com/blog/adobe-is-a-leader-in-the-forrester-wave-customer-analytics-technologies-q2-2026',
    q: { it: 'Leader · 2° trim. 2026', en: 'Leader · Q2 2026' },
    per: { it: 'Capire dove i clienti si fermano, tra app, sito e filiale', en: 'See where customers stall, across app, site and branch' } },
  { img: wOptimization, cat: 'Experience Optimisation Solutions', breve: 'Experience Optimisation', url: 'https://business.adobe.com/uk/blog/2026-forrester-experience-optimization-solutions',
    q: { it: 'Leader · 3° trim. 2026', en: 'Leader · Q3 2026' },
    per: { it: 'Testare e personalizzare ogni esperienza, dal sito al singolo messaggio', en: 'Test and personalise every experience, from the site to a single message' } },
  { img: wEmail, cat: 'Email Marketing Service Providers', breve: 'Email Marketing', url: 'https://business.adobe.com/blog/leading-ai-era-email-marketing-adobe-journey-optimizer',
    q: { it: 'Leader · 1° trim. 2026', en: 'Leader · Q1 2026' },
    per: { it: 'Messaggi personalizzati e conformi, su email e sugli altri canali', en: 'Personalised, compliant messages over email and other channels' } },
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
