#!/usr/bin/env python3
"""
Indice ricercabile delle librerie Adobe in .pptx.

PERCHÉ ESISTE
In `docs/` ci sono ~7 GB di librerie Adobe (FSI Use Case Library, CXO POV,
Product Screenshot Library, pitch deck di prodotto…). Sono il materiale grafico
migliore che abbiamo — illustrazioni isometriche, screenshot di prodotto veri,
diagrammi — e finora per trovarci dentro una slide bisognava aprire un file da
600 MB e sfogliarlo. Così non si eredita: si reinventa, peggio e a mano.
L'indice rende la ricerca una riga di comando, e tiene la PROVENIENZA (file +
numero di slide) perché una slide ereditata si cita, non si spaccia per propria.

Produce  docs/Factory/pptx-index/<nome>.json  e  _indice.json (riepilogo).
Non copia nulla: registra dove sta la cosa.

Uso:
  python3 scripts/pptx/index-library.py                 # tutte le librerie in docs/
  python3 scripts/pptx/index-library.py <file.pptx> ...  # solo questi
  python3 scripts/pptx/index-library.py --cerca "call center"
"""
import json, pathlib, re, sys, time
from pptx import Presentation
from pptx.util import Emu

REPO = pathlib.Path(__file__).resolve().parents[2]
OUT = REPO / "docs/Factory/pptx-index"
MAX_MB = 3200


def walk(shapes):
    for sh in shapes:
        yield sh
        if sh.shape_type == 6:
            yield from walk(sh.shapes)


def indicizza(path):
    prs = Presentation(str(path))
    slides = []
    for i, s in enumerate(prs.slides, 1):
        titolo, testi, immagini, forme = "", [], 0, 0
        massimo = 0
        for sh in walk(s.shapes):
            forme += 1
            if sh.shape_type == 13:
                immagini += 1
            if sh.has_text_frame and sh.text_frame.text.strip():
                t = re.sub(r"\s+", " ", sh.text_frame.text.strip())
                testi.append(t)
                # il titolo è il testo col corpo più grande, o il placeholder titolo
                corpo = 0
                for p in sh.text_frame.paragraphs:
                    for r in p.runs:
                        if r.font.size:
                            corpo = max(corpo, r.font.size.pt)
                if sh.is_placeholder and int(sh.placeholder_format.type) in (0, 2):
                    corpo = max(corpo, 999)
                if corpo > massimo:
                    massimo, titolo = corpo, t[:160]
        slides.append({
            "n": i, "layout": s.slide_layout.name, "titolo": titolo,
            "testo": " · ".join(testi)[:2200],
            "immagini": immagini, "forme": forme,
        })
    return {"file": str(path.relative_to(REPO)) if path.is_relative_to(REPO) else str(path),
            "mb": round(path.stat().st_size / 1e6, 1),
            "slide": len(slides), "slides": slides}


def cerca(q):
    risultati = []
    for f in sorted(OUT.glob("*.json")):
        if f.name == "_indice.json":
            continue
        d = json.loads(f.read_text("utf-8"))
        for s in d["slides"]:
            blob = f"{s['titolo']} {s['testo']}".lower()
            if q.lower() in blob:
                risultati.append((d["file"], s))
    print(f"\n«{q}» → {len(risultati)} slide\n")
    for file, s in risultati[:40]:
        print(f"  {pathlib.Path(file).name}  slide {s['n']:>3}  [{s['immagini']} img]  {s['titolo'][:92]}")
    if len(risultati) > 40:
        print(f"  … e altre {len(risultati)-40}")
    print("\nPer vederne una:  python3 scripts/pptx/extract.py \"<file>\" <n> [<n>…]\n")


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    if "--cerca" in sys.argv:
        return cerca(" ".join(sys.argv[sys.argv.index("--cerca") + 1:]))

    espliciti = [pathlib.Path(a) for a in sys.argv[1:] if not a.startswith("--")]
    if espliciti:
        files = espliciti
    else:
        files = sorted(p for p in (REPO / "docs").rglob("*.pptx")
                       if "output" not in p.parts and p.stat().st_size > 5e6)

    riepilogo = []
    for p in files:
        mb = p.stat().st_size / 1e6
        dest = OUT / (re.sub(r"[^\w\-]+", "_", p.stem)[:80] + ".json")
        if dest.exists() and dest.stat().st_mtime > p.stat().st_mtime:
            d = json.loads(dest.read_text("utf-8"))
            print(f"  ✓ già indicizzato  {p.name[:58]:<58} {d['slide']:>4} slide")
            riepilogo.append({k: d[k] for k in ("file", "mb", "slide")})
            continue
        if mb > MAX_MB:
            print(f"  ⤬ salto (>{MAX_MB} MB)  {p.name}")
            continue
        t0 = time.time()
        try:
            d = indicizza(p)
        except Exception as e:
            print(f"  ⤬ errore  {p.name}: {type(e).__name__}")
            continue
        dest.write_text(json.dumps(d, ensure_ascii=False, indent=1), "utf-8")
        print(f"  ✓ {time.time()-t0:5.1f}s  {p.name[:58]:<58} {d['slide']:>4} slide  {d['mb']:>7.1f} MB")
        riepilogo.append({k: d[k] for k in ("file", "mb", "slide")})

    (OUT / "_indice.json").write_text(json.dumps(
        {"aggiornato": time.strftime("%Y-%m-%d"), "librerie": riepilogo,
         "slide_totali": sum(r["slide"] for r in riepilogo)}, ensure_ascii=False, indent=1), "utf-8")
    print(f"\n{len(riepilogo)} librerie · {sum(r['slide'] for r in riepilogo)} slide indicizzate → {OUT}")


if __name__ == "__main__":
    main()
