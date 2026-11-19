"""Il montaggio di una ripresa fatta con riprendi.js: calcola la timeline, non rende niente.

Uso: python3 -I monta.py <spec.json> <out_dir>

Per scena: cartello con la domanda (2,4 s) → il prompt appena inviato (1 s) → l'attesa
tagliata a 0,8 s → la risposta che arriva a 4x → lo scorrimento a 2,5x → pausa 1,6 s →
cartello facoltativo con la risposta in due righe (3 s). Le velocità vengono dal ritorno
di un collega sul primo montaggio (18 nov 2026): «molto lento, anche a 1,5x» e «andrebbe
contestualizzato». Non si rallentano: chi guarda legge il cartello, non la chat.

spec.json:
  {"rec": "<cartella dei fotogrammi>",
   "brand": "#007A91",                       # colore di cartelli e fascia (del cliente o Adobe)
   "nota": "Ambiente dimostrativo Adobe · dati fittizi · attese accelerate",
   "intro": {"k": "occhiello", "big": ["riga", "riga"], "sub": []},
   "outro": {"k": "...", "big": [...], "sub": [...]},
   "scenes": [{"n": "1 di 4", "q": "La domanda breve", "ctx": ["contesto"], "a": ["risposta", "in due righe"]}]}
I numeri di fotogramma (sent/done/toured) e "dt" si leggono da <rec>/marks.json; si scrivono
a mano in una scena solo per correggerli (per esempio per far partire una scena più tardi).
Una scena da escludere (nomi di altri clienti nell'ambiente demo condiviso) si toglie da
"scenes" con "skip": true — la sua posizione in marks.json resta, così le altre non scorrono.
"""
import json, sys
from pathlib import Path

spec = json.load(open(sys.argv[1])); OUT = Path(sys.argv[2]); OUT.mkdir(parents=True, exist_ok=True)
REC = Path(spec["rec"])
marks = json.loads((REC / "marks.json").read_text()) if (REC / "marks.json").exists() else {}
DT = spec.get("dt") or marks.get("dt")
if not DT: sys.exit("manca dt: né in spec né in marks.json")

# ricava sent/done/toured per ogni scena, in ordine
auto, cur = [], {}
for m in marks.get("marks", []):
    if m["kind"] in ("sent", "done", "toured"): cur[m["kind"]] = m["frame"]
    if m["kind"] == "toured": auto.append(cur); cur = {}
scenes = spec["scenes"]
if auto and len(auto) != len(scenes):
    sys.exit(f"marks.json ha {len(auto)} scene complete, la spec {len(scenes)}: allinea (usa skip, non togliere)")

REVEAL_X, TOUR_X = 4, 2.5
entries, bands, t = [], [], 0.0
def frame(n):
    p = REC / f"f_{n:06d}.jpg"
    return str(p) if p.exists() else None
def span(a, b, speed):
    global t
    step = max(1, round(speed)); dur = DT * step / speed
    for n in range(a, b, step):
        f = frame(n)
        if f: entries.append(["f", f, dur]); t += dur
def hold(n, d):
    global t
    f = frame(n)
    if f: entries.append(["f", f, d]); t += d
def card(ref, d):
    global t
    entries.append(["c", ref, d]); t += d

card("intro", 3.6)
for i, s in enumerate(scenes):
    if s.get("skip"): continue
    s = {**(auto[i] if auto else {}), **s}
    card(str(i), 2.4)
    t0 = t
    hold(s["sent"] + 10, 1.0)
    hold(s["sent"] + 40, 0.8)
    span(max(s["sent"] + 41, s["done"] - 170), s["done"], REVEAL_X)
    span(s["done"], s["toured"] + 1, TOUR_X)
    hold(s["toured"], 1.6)
    bands.append([s["n"] + " · " + s["q"], t0, t])
    if s.get("a"): card(f"a{i}", 3.0)
card("outro", 3.0)
(OUT / "timeline.json").write_text(json.dumps({"entries": entries, "bands": bands, "total": t}, ensure_ascii=False))
print(f"durata {t:.1f}s · {len(bands)} scene · dt {DT:.4f}")
