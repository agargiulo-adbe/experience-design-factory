
    <!-- ── Firma (ultima slide del percorso: lockup grande + una riga + ritorno).
         Slide a sé per contratto co-brand; fallisce il check SOFT `i` di proposito
         (il lockup è un SVG, il parser non lo conta): non si aggiusta rimpicciolendo. -->
    <Slide id="slide-signature" bg="inverse" align="center">
      <div slot="backdrop" class="ex-bg-night"></div>
      <CoBrand variant="hero" data-reveal />
      <T
        as="p"
        class="ex-sig-line"
        it={`${SITE.name}. Il passo dopo: ${lcFirst(type.nextStep.it)}.`}
        en={`${SITE.name}. The next step: ${lcFirst(type.nextStep.en)}.`}
        data-reveal data-reveal-delay="0.1"
      />
      <a href={href(base, '/')} class="edf-sig-cta" data-reveal data-reveal-delay="0.18"><span data-lang-it>Torna all’inizio →</span><span data-lang-en>Back to the start →</span></a>
    </Slide>
