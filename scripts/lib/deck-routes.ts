/**
 * LE ROTTE DEI DECK, in un posto solo.
 *
 * Le usano `deck-audit` (il gate di layout) e `wrap-audit` (gli a capo). Stava
 * dentro il primo: il secondo avrebbe dovuto tenerne una copia, e una copia di
 * un elenco di rotte diverge alla prima experience nuova — esattamente il
 * difetto che queste regole esistono per evitare.
 */
export interface Rotta {
  name: string;
  route: string;
}

export const ROUTE_SETS: Record<string, Rotta[]> = {
  maxmara: [
    { name: 'home',         route: '/experience-design-factory/generazioni-maxmara/' },
    { name: 'acquisizione', route: '/experience-design-factory/generazioni-maxmara/acquisizione/' },
    { name: 'engagement',   route: '/experience-design-factory/generazioni-maxmara/engagement/' },
    { name: 'conversione',  route: '/experience-design-factory/generazioni-maxmara/conversione/' },
    { name: 'loyalty',      route: '/experience-design-factory/generazioni-maxmara/loyalty/' },
    { name: 'persona',      route: '/experience-design-factory/generazioni-maxmara/persona/' },
    { name: 'motore-adobe', route: '/experience-design-factory/generazioni-maxmara/motore-adobe/' },
    { name: 'chiusura',     route: '/experience-design-factory/generazioni-maxmara/chiusura/' },
  ],
  unicredit: [
    { name: 'home',         route: '/experience-design-factory/unicredit-engagement/' },
    { name: 'coworker',     route: '/experience-design-factory/unicredit-engagement/coworker/' },
    { name: 'motore-adobe', route: '/experience-design-factory/unicredit-engagement/motore-adobe/' },
    { name: 'scenario',     route: '/experience-design-factory/unicredit-engagement/scenario/' },
    { name: 'visibilita',   route: '/experience-design-factory/unicredit-engagement/visibilita/' },
    { name: 'acquisisci',   route: '/experience-design-factory/unicredit-engagement/acquisisci/' },
    { name: 'analizza',     route: '/experience-design-factory/unicredit-engagement/analizza/' },
    { name: 'coinvolgi',    route: '/experience-design-factory/unicredit-engagement/coinvolgi/' },
    { name: 'conosci',      route: '/experience-design-factory/unicredit-engagement/conosci/' },
    { name: 'contenuti',    route: '/experience-design-factory/unicredit-engagement/contenuti/' },
    { name: 'b2b',          route: '/experience-design-factory/unicredit-engagement/b2b/' },
    { name: 'risultati',    route: '/experience-design-factory/unicredit-engagement/risultati/' },
    { name: 'chiusura',     route: '/experience-design-factory/unicredit-engagement/chiusura/' },
  ],
  ferrari: [
    { name: 'home',         route: '/experience-design-factory/ferrari-racing/' },
    { name: 'protagonisti', route: '/experience-design-factory/ferrari-racing/protagonisti/' },
    { name: 'define',       route: '/experience-design-factory/ferrari-racing/define/' },
    { name: 'create',       route: '/experience-design-factory/ferrari-racing/create/' },
    { name: 'activate',     route: '/experience-design-factory/ferrari-racing/activate/' },
    { name: 'analisi',      route: '/experience-design-factory/ferrari-racing/analisi/' },
    { name: 'proof',        route: '/experience-design-factory/ferrari-racing/proof/' },
    { name: 'loop',         route: '/experience-design-factory/ferrari-racing/loop/' },
    { name: 'casi-duso',    route: '/experience-design-factory/ferrari-racing/casi-duso/' },
    // scoping is intentionally excluded: its slide-calculator is an interactive
    // full-bleed exemption (scroll + info chips) a keynote audit can't pass. Its
    // teaching slides (metrics/model/assumptions/disclaimer) are verified by eye.
  ],
  trenitalia: [
    { name: 'home',                route: '/experience-design-factory/trenitalia-connessioni/' },
    { name: 'scenario',            route: '/experience-design-factory/trenitalia-connessioni/scenario/' },
    { name: 'bivio',               route: '/experience-design-factory/trenitalia-connessioni/bivio/' },
    { name: 'fsp-partenza',        route: '/experience-design-factory/trenitalia-connessioni/fs-park/partenza/' },
    { name: 'fsp-fondamenta',      route: '/experience-design-factory/trenitalia-connessioni/fs-park/fondamenta/' },
    { name: 'fsp-convergenza',     route: '/experience-design-factory/trenitalia-connessioni/fs-park/convergenza/' },
    { name: 'fsp-meta-invisibile', route: '/experience-design-factory/trenitalia-connessioni/fs-park/meta-invisibile/' },
    { name: 'fsp-percorso',        route: '/experience-design-factory/trenitalia-connessioni/fs-park/percorso/' },
    { name: 'trn-partenza',        route: '/experience-design-factory/trenitalia-connessioni/trenitalia/partenza/' },
    { name: 'trn-fondamenta',      route: '/experience-design-factory/trenitalia-connessioni/trenitalia/fondamenta/' },
    { name: 'trn-convergenza',     route: '/experience-design-factory/trenitalia-connessioni/trenitalia/convergenza/' },
    { name: 'trn-meta-invisibile', route: '/experience-design-factory/trenitalia-connessioni/trenitalia/meta-invisibile/' },
    { name: 'trn-percorso',        route: '/experience-design-factory/trenitalia-connessioni/trenitalia/percorso/' },
  ],
  agos: [
    { name: 'home',         route: '/experience-design-factory/agos-trait-dunion/' },
    { name: 'scenario',     route: '/experience-design-factory/agos-trait-dunion/scenario/' },
    { name: 'fondamenta',   route: '/experience-design-factory/agos-trait-dunion/fondamenta/' },
    { name: 'evoluzione',   route: '/experience-design-factory/agos-trait-dunion/evoluzione/' },
    { name: 'trait-dunion', route: '/experience-design-factory/agos-trait-dunion/trait-dunion/' },
    { name: 'orizzonti',    route: '/experience-design-factory/agos-trait-dunion/orizzonti/' },
    { name: 'valore',       route: '/experience-design-factory/agos-trait-dunion/valore/' },
    { name: 'roadmap',      route: '/experience-design-factory/agos-trait-dunion/roadmap/' },
  ],
  'aperture-email': [
    { name: 'home',         route: '/experience-design-factory/aperture-email/' },
    { name: 'metodo',       route: '/experience-design-factory/aperture-email/metodo/' },
    { name: 'numeri',       route: '/experience-design-factory/aperture-email/numeri/' },
    { name: 'pattern',      route: '/experience-design-factory/aperture-email/pattern/' },
    { name: 'prima-dopo',   route: '/experience-design-factory/aperture-email/prima-dopo/' },
    { name: 'banche',       route: '/experience-design-factory/aperture-email/banche/' },
    { name: 'implicazioni', route: '/experience-design-factory/aperture-email/implicazioni/' },
  ],
  'eni-orbita': [
    { name: 'home',        route: '/experience-design-factory/eni-orbita/' },
    { name: 'domanda',     route: '/experience-design-factory/eni-orbita/domanda/' },
    { name: 'piattaforma', route: '/experience-design-factory/eni-orbita/piattaforma/' },
    { name: 'traiettorie', route: '/experience-design-factory/eni-orbita/traiettorie/' },
    { name: 'mappa',       route: '/experience-design-factory/eni-orbita/mappa/' },
    { name: 'persone',     route: '/experience-design-factory/eni-orbita/persone/' },
    { name: 'rotta',       route: '/experience-design-factory/eni-orbita/rotta/' },
  ],
  atelier: [
    { name: 'home',           route: '/experience-design-factory/atelier/' },
    { name: 'method',         route: '/experience-design-factory/atelier/method/' },
    { name: 'capability',     route: '/experience-design-factory/atelier/capability/' },
    { name: 'gap',            route: '/experience-design-factory/atelier/gap/' },
    { name: 'moves',          route: '/experience-design-factory/atelier/moves/' },
    { name: 'plan',           route: '/experience-design-factory/atelier/plan/' },
    { name: 'asks',           route: '/experience-design-factory/atelier/asks/' },
    { name: 'closing',        route: '/experience-design-factory/atelier/closing/' },
  ],
  'isybank-momento': [
    { name: 'home',    route: '/experience-design-factory/isybank-momento/' },
    { name: 'domanda', route: '/experience-design-factory/isybank-momento/domanda/' },
    { name: 'idee',    route: '/experience-design-factory/isybank-momento/idee/' },
    { name: 'rotta',   route: '/experience-design-factory/isybank-momento/rotta/' },
  ],
  'poste-sei-domande': [
    { name: 'home',       route: '/experience-design-factory/poste-sei-domande/' },
    { name: 'accendere',  route: '/experience-design-factory/poste-sei-domande/accendere/' },
    { name: 'rispondere', route: '/experience-design-factory/poste-sei-domande/rispondere/' },
    { name: 'capire',     route: '/experience-design-factory/poste-sei-domande/capire/' },
    { name: 'governare',  route: '/experience-design-factory/poste-sei-domande/governare/' },
    { name: 'proteggere', route: '/experience-design-factory/poste-sei-domande/proteggere/' },
    { name: 'in-azione',  route: '/experience-design-factory/poste-sei-domande/in-azione/' },
    { name: 'evolvere',   route: '/experience-design-factory/poste-sei-domande/evolvere/' },
  ],
  'mim-alfabeti': [
    { name: 'home',        route: '/experience-design-factory/mim-alfabeti/' },
    { name: 'domanda',     route: '/experience-design-factory/mim-alfabeti/domanda/' },
    { name: 'storia',      route: '/experience-design-factory/mim-alfabeti/storia/' },
    { name: 'voce',        route: '/experience-design-factory/mim-alfabeti/voce/' },
    { name: 'competenze',  route: '/experience-design-factory/mim-alfabeti/competenze/' },
    { name: 'accesso',     route: '/experience-design-factory/mim-alfabeti/accesso/' },
    { name: 'persone',     route: '/experience-design-factory/mim-alfabeti/persone/' },
    { name: 'rotta',       route: '/experience-design-factory/mim-alfabeti/rotta/' },
  ],
  // «Su scala umana» — Prospettiva per l'incontro del 22 ottobre. L'app NON è
  // registrata in hub, showcase e deploy pubblico (handover §33.3): qui sì,
  // perché deck-audit è un utensile locale e un deck non misurato non esiste.
  'intesa-scala-umana': [
    { name: 'home',     route: '/experience-design-factory/intesa-scala-umana/' },
    { name: 'apertura', route: '/experience-design-factory/intesa-scala-umana/apertura/' },
    { name: 'domanda',  route: '/experience-design-factory/intesa-scala-umana/domanda/' },
    { name: 'idee',     route: '/experience-design-factory/intesa-scala-umana/idee/' },
    { name: 'rotta',    route: '/experience-design-factory/intesa-scala-umana/rotta/' },
    { name: 'exec',     route: '/experience-design-factory/intesa-scala-umana/exec/' },
  ],
};

/** Il nome dell'app ricavato dalla cartella da cui si lancia il comando. */
export const CWD_ALIAS: Record<string, string> = {
  'generazioni-maxmara': 'maxmara',
  'unicredit-engagement': 'unicredit',
  'ferrari-racing': 'ferrari',
  'trenitalia-connessioni': 'trenitalia',
  'agos-trait-dunion': 'agos',
  'atelier': 'atelier',
  'eni-orbita': 'eni-orbita',
  'mim-alfabeti': 'mim-alfabeti',
  'isybank-momento': 'isybank-momento',
  'aperture-email': 'aperture-email',
  'poste-sei-domande': 'poste-sei-domande',
  'intesa-scala-umana': 'intesa-scala-umana',
};
