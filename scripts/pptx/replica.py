#!/usr/bin/env python3
"""
replica — il deck HTML come .pptx MODIFICABILE (stadio 2 di 2: la scrittura).

Legge la cartella scritta da `scripts/deck-replica.ts` (manifest.json + immagini)
e compone un .pptx 16:9 con oggetti NATIVI:

  sfondo      un'immagine a tutta pagina, sotto tutto (foto, sfumature, filetti)
  box         rettangolo (anche arrotondato) con riempimento, trasparenza e bordi;
              `clip-path` a 5/6 punti → freccia «pentagono» / «gallone»
  text        casella di testo: run con carattere, corpo, peso, corsivo, colore,
              spaziatura, link; interlinea esatta in punti
  img         immagine ritagliata a 2× (loghi, ritratti, quadranti, marchi)
  gruppi      ogni gruppo `g ≥ 0` entra in dissolvenza DOPO il precedente,
              come nella pagina: la slide si costruisce da sola, senza clic
  note        le note del relatore

Scala: la pagina è 1920 px = 13,333 pollici, quindi 1 px = 6350 EMU e 1 px di
corpo = 0,5 pt.

  uv run --with python-pptx python scripts/pptx/replica.py <cartella> <file.pptx>

⚠️ Il carattere deve esistere sulla macchina che apre il file (per InSalute:
Open Sans, gratuito su Google Fonts). Se manca, PowerPoint ripiega e gli a capo
cambiano: il .pptx non può incorporarlo.
"""
import json
import sys
from pathlib import Path

from lxml import etree
from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR, MSO_AUTO_SIZE
from pptx.oxml.ns import qn
from pptx.util import Emu, Pt

PX = 6350  # EMU per px (1920 px = 12 192 000 EMU)


def emu(v):
    return Emu(int(round(v * PX)))


def alpha_el(parent_fill_el, a):
    """Aggiunge <a:alpha> al colore pieno di una forma o di un run."""
    if a >= 0.999:
        return
    clr = parent_fill_el.find(qn('a:srgbClr'))
    if clr is None:
        return
    el = etree.SubElement(clr, qn('a:alpha'))
    el.set('val', str(int(round(a * 100000))))


def rgb(c):
    return RGBColor(int(c[0]), int(c[1]), int(c[2]))


def set_fill(shape, c):
    shape.fill.solid()
    shape.fill.fore_color.rgb = rgb(c)
    sp_fill = shape._element.spPr.find(qn('a:solidFill'))
    alpha_el(sp_fill, c[3])


def piatta(shape):
    """Toglie lo stile di tema dalla forma: senza, PowerPoint aggiunge un'ombra."""
    st = shape._element.find(qn('p:style'))
    if st is not None:
        shape._element.remove(st)
    return shape


def no_line(shape):
    shape.line.fill.background()


def add_box(slide, o):
    lati = o.get('lati') or []
    x, y, w, h = o['x'], o['y'], o['w'], o['h']
    clip = o.get('clip') or 0
    shapes = []
    if o.get('fill'):
        if clip == 5:
            kind = MSO_SHAPE.PENTAGON           # freccia «pentagono»: il primo passo
        elif clip == 6:
            kind = MSO_SHAPE.CHEVRON            # «gallone»: i passi successivi
        elif o.get('radius', 0) > 0.5:
            kind = MSO_SHAPE.ROUNDED_RECTANGLE
        else:
            kind = MSO_SHAPE.RECTANGLE
        s = piatta(slide.shapes.add_shape(kind, emu(x), emu(y), emu(w), emu(h)))
        set_fill(s, o['fill'])
        if kind == MSO_SHAPE.ROUNDED_RECTANGLE:
            s.adjustments[0] = min(0.5, o['radius'] / max(1, min(w, h)))
        if kind in (MSO_SHAPE.PENTAGON, MSO_SHAPE.CHEVRON):
            # la tacca è 1rem (16 px) sulla larghezza della forma
            s.adjustments[0] = min(0.9, 16 / max(1, h))
        # un bordo uniforme su tutti e quattro i lati si porta come contorno
        if len(lati) == 4 and len({(l['w'], tuple(l['c'])) for l in lati}) == 1:
            s.line.color.rgb = rgb(lati[0]['c'])
            s.line.width = Pt(lati[0]['w'] * 0.5)
            alpha_el(s._element.spPr.find(qn('a:ln')).find(qn('a:solidFill')), lati[0]['c'][3])
            lati = []
        else:
            no_line(s)
        s.text_frame.text = ''
        shapes.append(s)
    elif len(lati) == 4 and len({(l['w'], tuple(l['c'])) for l in lati}) == 1:
        kind = MSO_SHAPE.ROUNDED_RECTANGLE if o.get('radius', 0) > 0.5 else MSO_SHAPE.RECTANGLE
        s = piatta(slide.shapes.add_shape(kind, emu(x), emu(y), emu(w), emu(h)))
        s.fill.background()
        if kind == MSO_SHAPE.ROUNDED_RECTANGLE:
            s.adjustments[0] = min(0.5, o['radius'] / max(1, min(w, h)))
        s.line.color.rgb = rgb(lati[0]['c'])
        s.line.width = Pt(lati[0]['w'] * 0.5)
        alpha_el(s._element.spPr.find(qn('a:ln')).find(qn('a:solidFill')), lati[0]['c'][3])
        shapes.append(s)
        lati = []
    # i bordi su un lato solo (il filetto sotto le card, la riga a sinistra)
    for l in lati:
        bw = l['w']
        geo = {
            'Top': (x, y, w, bw), 'Bottom': (x, y + h - bw, w, bw),
            'Left': (x, y, bw, h), 'Right': (x + w - bw, y, bw, h),
        }[l['l']]
        s = piatta(slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, *[emu(v) for v in geo]))
        set_fill(s, l['c'])
        no_line(s)
        shapes.append(s)
    return shapes


ALIGN = {'left': PP_ALIGN.LEFT, 'start': PP_ALIGN.LEFT, 'center': PP_ALIGN.CENTER,
         'right': PP_ALIGN.RIGHT, 'end': PP_ALIGN.RIGHT, 'justify': PP_ALIGN.JUSTIFY}


def font_name(r):
    f = r.get('font') or 'Open Sans'
    if f.lower().startswith('open sans'):
        if r['weight'] >= 800:
            return 'Open Sans ExtraBold', False
        if r['weight'] <= 300:
            return 'Open Sans Light', False
        return 'Open Sans', r['weight'] >= 600
    return f, r['weight'] >= 600


def add_text(slide, o):
    runs = o['runs']
    if not runs:
        return []
    # un po' d'aria a destra: le metriche di PowerPoint non sono quelle di Chrome,
    # e una parola che in pagina sta per un pixel qui andrebbe a capo.
    slack = 0 if o.get('middle') else 0.04 * o['w'] + 6
    x, w = o['x'], o['w'] + slack
    if o.get('align') == 'center':
        x -= slack / 2
    elif o.get('align') in ('right', 'end'):
        x -= slack
    tb = slide.shapes.add_textbox(emu(x), emu(o['y']), emu(w), emu(max(o['h'], 4)))
    tf = tb.text_frame
    tf.word_wrap = True
    tf.auto_size = MSO_AUTO_SIZE.NONE
    tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE if o.get('middle') else MSO_ANCHOR.TOP
    p = tf.paragraphs[0]
    p.alignment = ALIGN.get(o.get('align'), PP_ALIGN.LEFT)
    # interlinea esatta: 1 px = 0,5 pt
    pPr = p._p.get_or_add_pPr()
    ln = etree.SubElement(pPr, qn('a:lnSpc'))
    etree.SubElement(ln, qn('a:spcPts')).set('val', str(int(round(o['lh'] * 0.5 * 100))))
    for r in runs:
        if r.get('br'):
            p.add_line_break()
            continue
        run = p.add_run()
        run.text = r['t'].replace(' ', ' ')
        f = run.font
        name, bold = font_name(r)
        f.name = name
        f.bold = bold
        f.italic = bool(r.get('italic'))
        f.size = Pt(round(r['size'] * 0.5 * 2) / 2)
        f.color.rgb = rgb(r['color'])
        rPr = run._r.get_or_add_rPr()
        alpha_el(rPr.find(qn('a:solidFill')), r['color'][3])
        if r.get('ls'):
            rPr.set('spc', str(int(round(r['ls'] * 0.5 * 100))))
        if r.get('u'):
            f.underline = True
        href = r.get('href') or ''
        if href.startswith('http') and not any(h in href for h in ('127.0.0.1', 'localhost')):
            # solo i link ESTERNI (le fonti): quelli fra pagine del deck puntano
            # all'anteprima locale e nel file non servono.
            run.hyperlink.address = href
            hl = rPr.find(qn('a:hlinkClick'))
            # il link usa il colore del testo, come nella pagina (una fonte non è
            # una CTA): estensione «hlinkClr» di Office 2019+, senza la quale
            # PowerPoint lo dipinge di blu tema.
            ext_lst = etree.SubElement(hl, qn('a:extLst'))
            ext = etree.SubElement(ext_lst, qn('a:ext'))
            ext.set('uri', '{A12FA001-AC4F-418D-AE19-62706E023703}')
            hc = etree.SubElement(ext, '{http://schemas.microsoft.com/office/drawing/2018/hyperlinkcolor}hlinkClr',
                                  nsmap={'ahyp': 'http://schemas.microsoft.com/office/drawing/2018/hyperlinkcolor'})
            hc.set('val', 'tx')
    return [tb]


def add_img(slide, o, root):
    pic = slide.shapes.add_picture(str(root / o['file']), emu(o['x']), emu(o['y']), emu(o['w']), emu(o['h']))
    return [pic]


# ── animazioni: dissolvenza d'entrata, un gruppo dopo l'altro ────────────────
P = 'http://schemas.openxmlformats.org/presentationml/2006/main'


def timing_xml(gruppi):
    """gruppi: lista di liste di shape id, nell'ordine. Il primo parte dopo
    l'entrata della slide, ogni gruppo dopo il precedente."""
    cid = [3]

    def nid():
        cid[0] += 1
        return cid[0]

    par_gruppi = []
    for k, ids in enumerate(gruppi):
        effetti = []
        for j, sid in enumerate(ids):
            node = 'afterEffect' if j == 0 else 'withEffect'
            effetti.append(f'''
<p:par><p:cTn id="{nid()}" presetID="10" presetClass="entr" presetSubtype="0" fill="hold" nodeType="{node}">
 <p:stCondLst><p:cond delay="0"/></p:stCondLst>
 <p:childTnLst>
  <p:set><p:cBhvr><p:cTn id="{nid()}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>
   <p:tgtEl><p:spTgt spid="{sid}"/></p:tgtEl><p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr>
   <p:to><p:strVal val="visible"/></p:to></p:set>
  <p:animEffect transition="in" filter="fade"><p:cBhvr><p:cTn id="{nid()}" dur="400"/><p:tgtEl><p:spTgt spid="{sid}"/></p:tgtEl></p:cBhvr></p:animEffect>
 </p:childTnLst></p:cTn></p:par>''')
        par_gruppi.append(f'''
<p:par><p:cTn id="{nid()}" fill="hold"><p:stCondLst><p:cond delay="{0 if k == 0 else 120}"/></p:stCondLst>
 <p:childTnLst>{''.join(effetti)}</p:childTnLst></p:cTn></p:par>''')
    # i gruppi in sequenza: ognuno parte alla fine del precedente
    seq = ''.join(par_gruppi)
    return f'''<p:timing xmlns:p="{P}"><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst>
<p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst>
<p:par><p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst>
<p:childTnLst>{seq}</p:childTnLst></p:cTn></p:par>
</p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst><p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq>
</p:childTnLst></p:cTn></p:par></p:tnLst></p:timing>'''


def main():
    root = Path(sys.argv[1])
    out = Path(sys.argv[2])
    m = json.loads((root / 'manifest.json').read_text())
    prs = Presentation()
    prs.slide_width = Emu(m['w'] * PX)
    prs.slide_height = Emu(m['h'] * PX)
    blank = prs.slide_layouts[6]
    for s in m['slides']:
        slide = prs.slides.add_slide(blank)
        bg = slide.shapes.add_picture(str(root / s['bg']), 0, 0, prs.slide_width, prs.slide_height)
        bg.name = 'Sfondo'
        gruppi = {}
        for o in s['oggetti']:
            if o['k'] == 'box':
                made = add_box(slide, o)
            elif o['k'] == 'text':
                made = add_text(slide, o)
            elif o['k'] == 'img':
                made = add_img(slide, o, root)
            else:
                made = []
            if o.get('g', -1) >= 0:
                gruppi.setdefault(o['g'], []).extend(sh.shape_id for sh in made)
        if gruppi:
            ordine = [gruppi[k] for k in sorted(gruppi)]
            slide._element.append(etree.fromstring(timing_xml(ordine)))
        # le slide passano con una dissolvenza breve, come la pagina
        tr = etree.SubElement(slide._element, qn('p:transition'))
        tr.set('spd', 'med')
        etree.SubElement(tr, qn('p:fade'))
        # p:transition deve stare PRIMA di p:timing
        timing = slide._element.find(qn('p:timing'))
        if timing is not None:
            slide._element.remove(tr)
            timing.addprevious(tr)
        if s.get('note'):
            slide.notes_slide.notes_text_frame.text = s['note']
    prs.save(out)
    print(f'replica: {len(m["slides"])} slide → {out}')


if __name__ == '__main__':
    main()
