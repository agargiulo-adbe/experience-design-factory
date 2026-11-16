/**
 * I MOVIMENTI DEI MECCANISMI 2D (components/Meccanismo.astro), dietro `?pop3d=1`.
 *
 * Una timeline per scena, con un'etichetta per passo: ogni «Avanti» del pop-in suona
 * SOLO il suo tratto e si ferma sullo stato finale (segmentazione); «Indietro» e la
 * riduzione del movimento saltano allo stato, senza animare.
 *
 * Il gesto ricorrente è il VOLO: una pillola con un nome parte dall'oggetto che la
 * produce e si posa nel posto che la aspetta. Il posto d'arrivo è nel layout vero (flex),
 * la partenza si misura: niente coordinate scritte a mano che divergono dal CSS.
 * Si misura a pop-in aperto, una volta, con il palco già scalato.
 */
type G = typeof import('gsap').gsap;
type TL = ReturnType<G['timeline']>;
export interface Meccanismo { vai(p: number, avanti: boolean): void; adatta(): void }

const W = 1600, H = 720;
const ENTRA = 'expo.out', MUOVE = 'power2.inOut';

export async function prepara(root: HTMLElement): Promise<Meccanismo> {
  const { gsap } = await import('gsap');
  const palco = root.querySelector<HTMLElement>('.mc-palco')!;
  const scena = root.dataset.mc!;
  const q = (k: string) => root.querySelector<HTMLElement>(`[data-k="${k}"]`)!;
  const qq = (...k: string[]) => k.map(q);

  const adatta = () => {
    const k = Math.min(root.clientWidth / W, root.clientHeight / H);
    palco.style.setProperty('--mc-k', String(k || .6));
  };
  adatta();

  /** Dove sta un elemento, in unità di palco (1600×720), senza le sue trasformazioni gsap. */
  const dove = (el: HTMLElement) => {
    const r = el.getBoundingClientRect(), p = palco.getBoundingClientRect(), k = p.width / W;
    const x = Number(gsap.getProperty(el, 'x')) || 0, y = Number(gsap.getProperty(el, 'y')) || 0;
    return { x: (r.left - p.left) / k - x, y: (r.top - p.top) / k - y, w: r.width / k, h: r.height / k };
  };

  const T: TL = gsap.timeline({ paused: true, defaults: { duration: .8, ease: ENTRA } });

  /** Un posto d'arrivo (già nel layout) che arriva volando dalla sua fonte. */
  const vola = (posto: HTMLElement, fonte: HTMLElement, at: string | number, durata = 1) => {
    const a = dove(posto), b = dove(fonte);
    const dx = b.x + b.w / 2 - (a.x + a.w / 2), dy = b.y + b.h / 2 - (a.y + a.h / 2);
    T.fromTo(posto, { autoAlpha: 0, x: dx, y: dy, scale: .92 },
      { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: durata, ease: MUOVE, immediateRender: true }, at);
  };
  /** Una pillola libera che viaggia da un oggetto a un altro, e lì si posa o sparisce. */
  const viaggia = (pill: HTMLElement, da: HTMLElement, a: HTMLElement, at: string | number, resta = false) => {
    const p = dove(pill), s = dove(da), d = dove(a);
    const x0 = s.x + s.w / 2 - p.w / 2, y0 = s.y + s.h / 2 - p.h / 2;
    const x1 = d.x + d.w / 2 - p.w / 2, y1 = d.y + d.h / 2 - p.h / 2;
    gsap.set(pill, { left: 0, top: 0 });
    T.fromTo(pill, { autoAlpha: 0, x: x0, y: y0 }, { autoAlpha: 1, x: x0, y: y0, duration: .2, immediateRender: true }, at)
     .to(pill, { x: x1, y: y1, duration: 1, ease: MUOVE }, '>');
    if (!resta) T.to(pill, { autoAlpha: 0, duration: .25 }, '>-.05');
  };
  const appare = (el: HTMLElement | HTMLElement[], at: string | number, extra: gsap.TweenVars = {}) =>
    T.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: .6, immediateRender: true, ...extra }, at);
  const classe = (el: HTMLElement, c: string, at: string | number) =>
    T.set(el, { className: `${el.className} ${c}` }, at);

  let etichette: string[] = [];
  /** Stato delle CLASSI a fine passo p, per i salti (indietro, capitoli, ingresso a metà):
      il ripristino all'indietro di un set di `className` in gsap non è affidabile. */
  let allinea: ((p: number) => void) | null = null;
  /** Un passo comincia quando è finito TUTTO il precedente, non l'ultima tween aggiunta. */
  const passo = (nome: string) => T.addLabel(nome, nome === 'p1' ? 0 : T.duration() + .1);

  if (scena === 'decisioning') {
    const [motore, core, profilo, arbitro, sito, invio, cja, esito] = qq('motore', 'core', 'profilo', 'arbitro', 'sito', 'invio', 'cja', 'esito');
    const [o0, o1, o2, o3] = qq('o0', 'o1', 'o2', 'o3');
    passo('p1');
    appare([motore, core], 'p1', { stagger: .15 });
    T.fromTo(q('c-prop'), { backgroundColor: 'rgba(255,255,255,0)' }, { backgroundColor: 'rgba(255,255,255,.25)', duration: .4, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: true }, 'p1+=.6');
    passo('p2');
    appare(profilo, 'p2');
    vola(q('a-prop'), q('c-prop'), 'p2+=.5');
    vola(q('a-eleg'), q('c-eleg'), 'p2+=.9');
    passo('p3');
    appare(arbitro, 'p3');
    appare([o0, o2, o1, o3], 'p3+=.3', { stagger: .14 });
    gsap.set(root.querySelectorAll('.mc-rango'), { autoAlpha: 0, scale: .4 });
    passo('p4');
    const regola = q('regola'), vassoio = q('vassoio');
    appare(vassoio, 'p4', { duration: .4 });
    T.fromTo(regola, { autoAlpha: 0, y: 0 }, { autoAlpha: 1, duration: .2, immediateRender: true }, 'p4')
     .to(regola, { y: 360, duration: 1.8, ease: 'none' }, 'p4+=.2');
    classe(o2, 'mc-fuori', 'p4+=.75');
    T.to(o2, { y: 476 - 162, duration: .8, ease: MUOVE }, 'p4+=.85');
    classe(o3, 'mc-fuori', 'p4+=1.75');
    T.to(o3, { y: 584 - 342, duration: .8, ease: MUOVE }, 'p4+=1.85')
     .to(o1, { y: 162 - 252, duration: .6, ease: MUOVE }, 'p4+=2.2')
     .to(regola, { autoAlpha: 0, duration: .25 }, 'p4+=2.05');
    passo('p5');
    T.fromTo(q('a-prop'), { boxShadow: '0 0 0 0 rgba(250,150,0,0)' }, { boxShadow: '0 0 0 7px rgba(250,150,0,.5)', duration: .35, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: true }, 'p5')
     .to(o0.querySelector('.mc-rango'), { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(2)' }, 'p5+=.6')
     .to(o1.querySelector('.mc-rango'), { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(2)' }, 'p5+=.8');
    passo('p6');
    appare(sito, 'p6');
    const spazio = q('spazio'), banner = q('banner');
    gsap.set(banner, { autoAlpha: 0 });
    classe(o1, 'mc-seconda', 'p6+=.3');
    T.to(o1, { autoAlpha: .5, duration: .5 }, 'p6+=.3');
    classe(o0, 'mc-vince', 'p6+=.5');
    gsap.set(q('v-prop'), { autoAlpha: 0 });
    viaggia(q('v-prop'), o0, spazio, 'p6+=.7');
    T.to(banner, { autoAlpha: 1, duration: .45 }, '>-.1');
    appare(invio, '>');
    passo('p7');
    appare(cja, 'p7');
    T.to(invio, { autoAlpha: 0, duration: .3 }, 'p7');
    const e = dove(esito), si = dove(sito), cj = dove(cja), ar = dove(arbitro);
    gsap.set(esito, { left: 0, top: 0 });
    T.fromTo(esito, { autoAlpha: 0, x: si.x + si.w / 2 - e.w / 2, y: si.y + si.h - 30 }, { autoAlpha: 1, duration: .2, immediateRender: true }, 'p7+=.4')
     .to(esito, { keyframes: [
        { x: cj.x + cj.w - e.w - 30, y: cj.y + cj.h / 2 - e.h / 2, duration: .9, ease: MUOVE },
        { x: ar.x + ar.w / 2 - e.w / 2, y: ar.y + 120, duration: .9, ease: MUOVE },
      ] }, '>')
     .to(esito, { autoAlpha: 0, duration: .3 }, '>')
     .fromTo(o1.querySelector('.mc-rango'), { scale: 1 }, { scale: 1.35, duration: .25, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, '>-.1');
    passo('fine');
    etichette = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'fine'];
  }

  if (scena === 'cdp') {
    const [sito, profilo, anon, nome, sessione, ajo, crm, lead, banner] = qq('sito', 'profilo', 'anon', 'nome', 'sessione', 'ajo', 'crm', 'lead', 'banner');
    passo('p1');
    appare(sito, 'p1');
    appare(profilo, 'p1+=.2');
    gsap.set([nome, banner, q('email'), q('e-mail'), q('v-sito'), q('v-ajo'), q('v-crm')], { autoAlpha: 0 });
    vola(q('p-visita'), sito.querySelector<HTMLElement>('.mc-pag h5')!, 'p1+=.7');
    passo('p2');
    const rata = sito.querySelector<HTMLElement>('.mc-rata')!;
    gsap.set(rata, { autoAlpha: 0 });
    T.to(rata, { autoAlpha: 1, duration: .4 }, 'p2');
    vola(q('p-sim'), rata, 'p2+=.3');
    vola(q('seg'), q('p-sim'), 'p2+=1.1', .8);
    T.fromTo(q('seg'), { boxShadow: '0 0 0 0 rgba(37,137,0,0)' }, { boxShadow: '0 0 0 8px rgba(37,137,0,.35)', duration: .3, yoyo: true, repeat: 1, immediateRender: false }, '>');
    passo('p3');
    viaggia(q('v-sito'), q('seg'), q('spazio'), 'p3');
    T.to(banner, { autoAlpha: 1, duration: .5 }, '>-.15');
    passo('p4');
    T.to(q('email'), { autoAlpha: 1, duration: .5 }, 'p4');
    viaggia(q('e-mail'), q('email'), anon, 'p4+=.5');
    T.to(nome, { autoAlpha: 1, duration: .6 }, '>-.1')
     .to(sessione, { borderColor: '#258900', borderStyle: 'solid', backgroundColor: '#f1f7ee', duration: .6 }, '>-.2');
    T.set(sessione.querySelector('.mc-cas-t'), { textContent: 'Visite di Giulia, anche quelle di prima' }, '<');
    passo('p5');
    appare(ajo, 'p5');
    viaggia(q('v-ajo'), profilo, ajo, 'p5+=.3');
    appare(crm, 'p5+=1.2');
    gsap.set(lead, { autoAlpha: 0 });
    viaggia(q('v-crm'), ajo, crm, 'p5+=1.6');
    T.to(lead, { autoAlpha: 1, duration: .5 }, '>-.1');
    passo('fine');
    etichette = ['p1', 'p2', 'p3', 'p4', 'p5', 'fine'];
  }

  if (scena === 'cja') {
    const [zd, zf, motore, cja, percorso, barre] = qq('z-dig', 'z-fis', 'motore', 'cja', 'percorso', 'barre');
    passo('p1');
    appare([zd, zf], 'p1', { stagger: .2 });
    gsap.set([motore, cja], { autoAlpha: 0 });
    passo('p2');
    appare(cja, 'p2');
    gsap.set([percorso, barre, q('cav')], { autoAlpha: 0 });
    vola(q('p-sito'), q('f-sito'), 'p2+=.5');
    vola(q('p-app'), q('f-app'), 'p2+=.8');
    passo('p3');
    vola(q('p-crm'), q('f-crm'), 'p3');
    vola(q('p-fd'), q('f-fd'), 'p3+=.5');
    passo('p4');
    appare(motore, 'p4');
    vola(q('p-seg'), q('c-seg'), 'p4+=.4');
    passo('p5');
    T.to([zd, zf, motore], { autoAlpha: 0, duration: .5 }, 'p5');
    appare(percorso, 'p5+=.2', { duration: .4 });
    appare(q('chiave'), 'p5+=.3', { duration: .4 });
    appare(qq('t0', 't1', 't2', 't3', 't4'), 'p5+=.5', { stagger: .3 });
    passo('p6');
    appare(barre, 'p6', { duration: .4 });
    appare(q('cav'), 'p6+=1.4');
    T.fromTo(qq('b0', 'b1', 'b2', 'b3'), { scaleX: 0 }, { scaleX: 1, duration: 1, stagger: .2, immediateRender: true }, 'p6+=.3');
    passo('fine');
    etichette = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'fine'];
  }

  if (scena === 'e2e') {
    /* IL RACCONTO UNICO. Il gesto in più rispetto alle tre scene è il FUOCO: ogni passo
       accende le colonne in gioco e abbassa le altre, così l'occhio sa dove guardare
       mentre la fascia di Giulia, sopra, dice in che punto del suo percorso siamo. */
    const [rta, ajo, canaliT, sito, mail, cja, motore, iniz, crm, fd] =
      qq('rta', 'ajo', 'canali-t', 'sito', 'mail', 'cja', 'motore', 'iniz', 'crm', 'fd');
    const tutte = [rta, ajo, canaliT, sito, cja, motore, iniz, crm, fd];
    const fuoco = (on: HTMLElement[], at: string) =>
      T.to(tutte, { opacity: (_i: number, el: HTMLElement) => (on.includes(el) ? 1 : .3), duration: .55, ease: MUOVE }, at);
    const base = new Map<HTMLElement, string>();
    const stato = (el: HTMLElement, c: string, at: string | number) => {
      if (!base.has(el)) base.set(el, el.className);
      // Un set su un'etichetta nuda scatterebbe anche alla FINE del passo prima (il tratto
      // arriva fino all'etichetta, inclusa): lo si sposta appena dentro il passo suo.
      const t = typeof at === 'string' && /^p\d+$/.test(at) ? `${at}+=.02` : at;
      T.set(el, { className: `${base.get(el)} ${c}`.trim() }, t);
    };
    const tappe = ['02', '03', '04', '05', '06', '07'].map((n) => q(`m${n}`));
    const fill = q('fill');
    gsap.set(fill, { scaleX: 0 });
    const tappa = (i: number, at: string) => {
      tappe.forEach((li, j) => stato(li, j < i ? 'mc-fatto' : j === i ? 'mc-qui' : '', at));
      T.to(fill, { scaleX: i / 5, duration: .9, ease: MUOVE }, at);
    };
    const accende = (el: HTMLElement, at: string) => stato(el, 'mc-attivo', at);
    const spegne = (el: HTMLElement, at: string) => stato(el, '', at);
    const pulsa = (el: HTMLElement, at: string, rgb = '37,137,0') =>
      T.fromTo(el, { boxShadow: `0 0 0 0 rgba(${rgb},0)` }, { boxShadow: `0 0 0 8px rgba(${rgb},.35)`, duration: .32, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, at);

    const [anon, foto, st0, st1, st2] = qq('g-anon', 'g-foto', 'st0', 'st1', 'st2');
    const [ecid, email, pratica, ndg, seg, segSim, sess, sessT0, sessT1, visita, sim] =
      qq('id-ecid', 'id-email', 'id-pratica', 'id-ndg', 'seg', 'seg-sim', 'sess', 'sess-t0', 'sess-t1', 'p-visita', 'p-sim');
    const [ev, score, regola, o0, o1, o2, o3] = qq('ev', 'a-score', 'regola', 'o0', 'o1', 'o2', 'o3');
    const [rata, spazio, banner] = qq('rata', 'spazio', 'banner');
    const fonti = qq('f-sito', 'f-app', 'f-crm', 'f-fd');
    const [percorso, barre, ctrl] = qq('percorso', 'barre', 'ctrl');
    const punti = ['02', '03', '04', '05', '06', '07'].map((n) => q(`c${n}`));
    const [motorePoi, inizPoi, inizPoi2, crmPoi] = qq('motore-poi', 'iniz-poi', 'iniz-poi2', 'crm-poi');
    const [vEmail, vProp, vApp, vRit, vSim, vIniz] = qq('v-email', 'v-prop', 'v-app', 'v-ritorno', 'v-simili', 'v-iniz');
    const ranghi = [o0, o1].map((o) => o.querySelector<HTMLElement>('.mc-rango')!);

    gsap.set([foto, st1, st2, sessT1, banner, mail, percorso, barre, ctrl, motorePoi, inizPoi, inizPoi2, crmPoi, vEmail, vProp, vApp, vRit, vSim, vIniz, regola, segSim], { autoAlpha: 0 });
    gsap.set([o0, o1, o2, o3], { autoAlpha: 0 });
    gsap.set(ranghi, { autoAlpha: 0, scale: .4 });

    // ── Riconosce ──
    passo('p1');
    fuoco([rta, sito, canaliT], 'p1');
    tappa(0, 'p1');
    vola(ecid, sito, 'p1+=.4', .9);
    vola(visita, sito.querySelector<HTMLElement>('.mc-pag h5')!, 'p1+=.9');
    gsap.set([email, pratica, ndg, seg, sim], { autoAlpha: 0 });

    passo('p2');
    tappa(1, 'p2');
    pulsa(rata, 'p2', '250,150,0');
    vola(sim, rata, 'p2+=.3');
    vola(seg, sim, 'p2+=1.2', .8);
    pulsa(seg, '>');

    passo('p3');
    viaggia(vEmail, tappe[1], rta, 'p3');
    T.to(anon, { autoAlpha: 0, scale: .6, duration: .4 }, '>-.1')
     .fromTo(foto, { autoAlpha: 0, scale: .6 }, { autoAlpha: 1, scale: 1, duration: .6, ease: 'back.out(1.6)', immediateRender: false }, '<.1')
     .to(st0, { autoAlpha: 0, duration: .3 }, '<')
     .to(st1, { autoAlpha: 1, duration: .4 }, '<.15');
    appare(email, '<', { duration: .5 });
    // Il codice pratica nasce qui, con l'email (ipotesi di lavoro dichiarata, 16 nov 2026).
    appare(pratica, '<.25', { duration: .5 });
    pulsa(pratica, '>');
    T.to(sessT0, { autoAlpha: 0, duration: .3 }, '<')
     .to(sessT1, { autoAlpha: 1, duration: .4 }, '<.1')
     .to(sess, { borderColor: '#258900', borderStyle: 'solid', backgroundColor: '#f1f7ee', duration: .6 }, '<');

    // ── Sceglie e invia ──
    passo('p4');
    fuoco([rta, ajo, motore], 'p4');
    tappa(2, 'p4');
    gsap.set([ev, score], { autoAlpha: 0 });
    vola(ev, sess, 'p4+=.4');
    accende(motore, 'p4+=.9');
    vola(score, q('c-score'), 'p4+=1.1');

    passo('p5');
    fuoco([ajo], 'p5');
    spegne(motore, 'p5');
    appare([o0, o1, o2, o3], 'p5+=.2', { stagger: .12, duration: .45 });
    const discesa = () => (q('offerte').offsetHeight || 280) - 20;
    T.fromTo(regola, { autoAlpha: 0, y: 0 }, { autoAlpha: 1, duration: .2, immediateRender: false }, 'p5+=.9')
     .to(regola, { y: discesa(), duration: 1.6, ease: 'none' }, '>');
    stato(o2, 'mc-fuori', 'p5+=1.75');
    stato(o3, 'mc-fuori', 'p5+=2.35');
    T.to(regola, { autoAlpha: 0, duration: .25 }, 'p5+=2.75')
     .to(ranghi[0], { autoAlpha: 1, scale: 1, duration: .45, ease: 'back.out(2)' }, 'p5+=2.9')
     .to(ranghi[1], { autoAlpha: 1, scale: 1, duration: .45, ease: 'back.out(2)' }, 'p5+=3.05');

    passo('p6');
    fuoco([ajo, sito, canaliT, iniz], 'p6');
    tappa(3, 'p6');
    stato(o0, 'mc-vince', 'p6');
    stato(o1, 'mc-seconda', 'p6');
    T.to(o1, { opacity: .55, duration: .4 }, 'p6');
    viaggia(vProp, o0, spazio, 'p6+=.3');
    T.to(banner, { autoAlpha: 1, duration: .45 }, '>-.1');
    T.fromTo(mail, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .7, immediateRender: false }, '>+.2');
    accende(iniz, '<');
    appare(inizPoi, '<.2');

    // ── Misura ──
    passo('p7');
    fuoco([rta, crm, canaliT], 'p7');
    spegne(iniz, 'p7');
    tappa(4, 'p7');
    T.to(mail, { opacity: .45, duration: .5 }, 'p7');
    viaggia(vApp, mail, crm, 'p7+=.2');
    accende(crm, '>-.1');
    appare(crmPoi, '<');
    // In filiale la pratica è la stessa della simulazione: l'NDG non nasce qui.
    pulsa(pratica, '>+.2');

    passo('p8');
    fuoco([cja, sito, canaliT, crm, fd], 'p8');
    spegne(crm, 'p8');
    tappa(5, 'p8');
    T.to(st1, { autoAlpha: 0, duration: .3 }, 'p8').to(st2, { autoAlpha: 1, duration: .4 }, '<.1');
    // Alla firma il core emette l'NDG, che si lega al codice pratica.
    vola(ndg, tappe[5], 'p8+=.2', 1);
    pulsa(ndg, '>');
    gsap.set(fonti, { autoAlpha: 0 });
    vola(fonti[0], sito, 'p8+=.3');
    vola(fonti[1], tappe[5], 'p8+=.55');
    vola(fonti[2], crm, 'p8+=.8');
    vola(fonti[3], fd, 'p8+=1.05');
    appare(percorso, 'p8+=1.9', { duration: .4 });
    appare(punti, 'p8+=2.1', { stagger: .12, duration: .35 });

    passo('p9');
    fuoco([cja], 'p9');
    appare(barre, 'p9', { duration: .4 });
    T.fromTo(qq('b0', 'b1', 'b2', 'b3'), { scaleX: 0 }, { scaleX: 1, duration: 1, stagger: .18, immediateRender: false }, 'p9+=.3');
    appare(ctrl, 'p9+=1.5');

    passo('p10');
    fuoco([cja, ajo, rta], 'p10');
    viaggia(vRit, cja, ajo, 'p10+=.2');
    T.fromTo(ranghi[0], { scale: 1 }, { scale: 1.35, duration: .25, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, '>-.1');
    // Il look-alike passa da Real-Time Activation (call interna, 16 nov 2026).
    viaggia(vSim, cja, rta, '>+.25');
    appare(segSim, '>-.15', { duration: .45 });
    pulsa(segSim, '>');

    passo('p11');
    fuoco([cja, iniz, motore], 'p11');
    viaggia(vIniz, cja, iniz, 'p11+=.2');
    accende(iniz, '>-.1');
    T.to(inizPoi, { autoAlpha: 0, duration: .25 }, '<');
    appare(inizPoi2, '<.15', { duration: .45 });
    accende(motore, '<');
    appare(motorePoi, '<');
    passo('fine');
    etichette = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11', 'fine'];
    const QUI = [0, 1, 1, 2, 2, 3, 4, 5, 5, 5, 5];
    const classi = (el: HTMLElement, c: string) => { el.className = `${base.get(el) ?? el.className} ${c}`.trim(); };
    [...tappe, motore, iniz, crm, o0, o1, o2, o3].forEach((el) => { if (!base.has(el)) base.set(el, el.className); });
    allinea = (p) => {
      const i = QUI[p - 1] ?? 0;
      tappe.forEach((li, j) => classi(li, j < i ? 'mc-fatto' : j === i ? 'mc-qui' : ''));
      classi(motore, p === 4 || p === 11 ? 'mc-attivo' : '');
      classi(iniz, p === 6 || p === 11 ? 'mc-attivo' : '');
      classi(crm, p === 7 ? 'mc-attivo' : '');
      classi(o2, p >= 5 ? 'mc-fuori' : ''); classi(o3, p >= 5 ? 'mc-fuori' : '');
      classi(o0, p >= 6 ? 'mc-vince' : ''); classi(o1, p >= 6 ? 'mc-seconda' : '');
    };
  }

  let corsa: ReturnType<TL['tweenFromTo']> | null = null;
  return {
    adatta,
    vai(p, avanti) {
      const da = etichette[p - 1], a = etichette[p];
      if (!da || !a) return;
      const ridotto = matchMedia('(prefers-reduced-motion: reduce)').matches;
      // Il tratto in corsa si ferma PRIMA: altrimenti continua a spingere la timeline.
      corsa?.kill(); corsa = null;
      // Avanti si anima anche quando si ENTRA a metà (il racconto unico apre al capitolo
      // della carta): si parte dallo stato del passo prima e si suona solo il tratto.
      if (avanti && !ridotto) { T.seek(da, false); corsa = T.tweenFromTo(da, a); }
      else { T.pause(); T.seek(a, false); allinea?.(p); }
    },
  };
}
