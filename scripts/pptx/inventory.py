#!/usr/bin/env python3
"""
Catalogo dei layout approvati del template Adobe.

Perché esiste: il template di Brand Center porta 166 layout già disegnati e già
a norma di marchio. Un deck si COMPONE scegliendone uno e riempiendolo, non si
disegna a mano — «do not create slides from scratch», è la regola di Brand.
Senza un catalogo nessuno sa che cosa c'è dentro, e si finisce per usare sempre
«Title Only» e ridisegnare tutto (è successo: vedi il builder dell'8 ottobre).

Produce:
  · <out>/layouts.json   — nome, master, segnaposto con tipo e geometria
  · <out>/layouts.pptx   — una slide per layout, con i segnaposto etichettati
  · <out>/sheet-NN.png   — le pagine rese, da GUARDARE prima di scegliere

Uso:  python3 scripts/pptx/inventory.py [template.pptx] [--out DIR] [--no-render]
"""
import json, pathlib, subprocess, sys, shutil
from pptx import Presentation
from pptx.util import Emu, Pt

REPO = pathlib.Path(__file__).resolve().parents[2]
DEFAULT_TPL = REPO / "docs/Intesa Sanpaolo/output/build/adobe_template_2026_empty.pptx"

PH_TYPE = {0:"TITLE",1:"BODY",2:"CENTER_TITLE",3:"SUBTITLE",4:"DATE",5:"SLIDE_NUMBER",
           6:"FOOTER",7:"HEADER",8:"OBJECT",9:"CHART",10:"TABLE",11:"CLIP_ART",
           12:"ORG_CHART",13:"PICTURE",14:"MEDIA_CLIP",15:"DGM",16:"BODY"}

def inventory(tpl_path):
    prs = Presentation(str(tpl_path))
    out = []
    for mi, master in enumerate(prs.slide_masters):
        for layout in master.slide_layouts:
            phs = []
            for ph in layout.placeholders:
                f = ph.placeholder_format
                phs.append({
                    "idx": f.idx,
                    "type": PH_TYPE.get(int(f.type), str(f.type)),
                    "name": ph.name,
                    "left_in": round(Emu(ph.left).inches, 2) if ph.left is not None else None,
                    "top_in": round(Emu(ph.top).inches, 2) if ph.top is not None else None,
                    "w_in": round(Emu(ph.width).inches, 2) if ph.width is not None else None,
                    "h_in": round(Emu(ph.height).inches, 2) if ph.height is not None else None,
                })
            out.append({
                "master": mi,
                "index": len(out),
                "name": layout.name,
                "placeholders": phs,
                "n_shapes": len(layout.shapes),
            })
    return prs, out

def build_sheet(tpl_path, inv, dest):
    """Una slide per layout, segnaposto etichettati: il catalogo da guardare."""
    prs = Presentation(str(tpl_path))
    for row in inv:
        master = prs.slide_masters[row["master"]]
        layout = master.slide_layouts[[l.name for l in master.slide_layouts].index(row["name"])] \
                 if False else None
        # indicizzazione posizionale robusta: ricostruisco l'ordine globale
    # più semplice e sicuro: scorro di nuovo nello stesso ordine di inventory()
    prs = Presentation(str(tpl_path))
    flat = [(m, l) for m in prs.slide_masters for l in m.slide_layouts]
    for i, (m, layout) in enumerate(flat):
        s = prs.slides.add_slide(layout)
        for ph in list(s.placeholders):
            f = ph.placeholder_format
            etichetta = f"[{i:03d}] {layout.name}" if f.type in (0, 2) else \
                        f"{PH_TYPE.get(int(f.type), f.type)} idx={f.idx}"
            try:
                ph.text_frame.text = etichetta
                for p in ph.text_frame.paragraphs:
                    for r in p.runs:
                        r.font.size = Pt(14)
            except Exception:
                pass
    prs.save(str(dest))
    return dest

def render(pptx_path, out_dir):
    soffice = shutil.which("soffice")
    if not soffice:
        print("  soffice non trovato: salto il rendering"); return []
    subprocess.run([soffice, "--headless", "--convert-to", "pdf", "--outdir", str(out_dir), str(pptx_path)],
                   check=True, capture_output=True)
    pdf = out_dir / (pptx_path.stem + ".pdf")
    subprocess.run(["pdftoppm", "-png", "-r", "70", str(pdf), str(out_dir / "sheet")], check=True)
    return sorted(out_dir.glob("sheet-*.png"))

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    tpl = pathlib.Path(args[0]) if args else DEFAULT_TPL
    out = pathlib.Path(sys.argv[sys.argv.index("--out")+1]) if "--out" in sys.argv else REPO/"docs/Factory/pptx-layouts"
    out.mkdir(parents=True, exist_ok=True)
    if not tpl.exists(): sys.exit(f"template non trovato: {tpl}")

    prs, inv = inventory(tpl)
    (out/"layouts.json").write_text(json.dumps({
        "template": str(tpl.relative_to(REPO)) if tpl.is_relative_to(REPO) else str(tpl),
        "canvas_in": [round(Emu(prs.slide_width).inches,2), round(Emu(prs.slide_height).inches,2)],
        "count": len(inv), "layouts": inv}, ensure_ascii=False, indent=2), "utf-8")
    print(f"{len(inv)} layout · canvas {Emu(prs.slide_width).inches:.2f}×{Emu(prs.slide_height).inches:.2f} in")
    print(f"→ {out/'layouts.json'}")

    nomi = {}
    for r in inv: nomi.setdefault(r["name"], []).append(r["index"])
    print(f"\nnomi distinti: {len(nomi)} (su {len(inv)} layout: i duplicati sono le varianti per master)")
    for n, idxs in sorted(nomi.items(), key=lambda kv: -len(kv[1]))[:12]:
        print(f"   {len(idxs):>2}× {n}")

    if "--no-render" not in sys.argv:
        sheet = build_sheet(tpl, inv, out/"layouts.pptx")
        pngs = render(sheet, out)
        print(f"\ncatalogo visivo: {len(pngs)} pagine → {out}")

if __name__ == "__main__":
    main()
