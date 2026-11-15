"""
render.py — scene 3D della Factory, rese da Blender senza interfaccia.

Si lancia da `pnpm render:3d` (scripts/render-3d.ts), mai a mano: il wrapper legge i
colori dal global.css dell'experience e li passa qui come JSON dopo `--`.

    blender -b --factory-startup -P scripts/3d/render.py -- '<json>'

Perché uno script e non una sessione MCP: un asset del deck deve potersi RIFARE. Se la
palette cambia o il cliente chiede un'altra inquadratura, si rilancia il comando e il
file esce identico salvo la modifica. Una scena composta parlando con Blender non si
ripete; la si esplora così, poi la si congela qui.

Due regole che valgono per ogni scena:
· NIENTE TESTO NEL RENDER. Le etichette stanno in HTML sopra il video: si traducono,
  passano audit:wrap e si correggono senza rendere di nuovo.
· UN LOOP SI CHIUDE PER COSTRUZIONE. Ogni moto è funzione della fase θ = 2π·f/N e si
  rendono i fotogrammi 0…N-1: il fotogramma N coinciderebbe con lo 0, quindi il giro
  non ha stacco e `loop:seamless` non deve ricucire niente.
"""
import json
import math
import sys

import bpy
from mathutils import Matrix, Vector

ARGS = json.loads(sys.argv[sys.argv.index("--") + 1])
P = ARGS["palette"]  # hex: notte, notte2, accento, accentoTenue, chiaro


# ── utilità ──────────────────────────────────────────────────────────────────

def lin(hexstr: str, a: float = 1.0):
    """hex sRGB → RGBA lineare, che è quello che vogliono i nodi."""
    h = hexstr.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, a)


def pulisci():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def motore(sc):
    ids = [e.identifier for e in sc.render.bl_rna.properties["engine"].enum_items]
    for cand in ("BLENDER_EEVEE", "BLENDER_EEVEE_NEXT"):
        if cand in ids:
            sc.render.engine = cand
            break
    try:
        sc.eevee.taa_render_samples = ARGS.get("campioni", 32)
    except AttributeError:
        pass
    # Il colore deve uscire come nei token: niente curva «Filmic/AgX» che lo sposta.
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.look = "None"


def uscita(sc, n_frame):
    sc.render.resolution_x = ARGS["larghezza"]
    sc.render.resolution_y = ARGS["altezza"]
    sc.render.resolution_percentage = 100
    sc.render.fps = ARGS["fps"]
    sc.frame_start = 0
    sc.frame_end = n_frame - 1
    sc.render.image_settings.file_format = "PNG"
    sc.render.image_settings.color_mode = "RGB"
    sc.render.filepath = ARGS["cartella"].rstrip("/") + "/f_"


def mondo(sc, colore, forza=1.0):
    w = bpy.data.worlds.new("Mondo")
    sc.world = w
    w.use_nodes = True
    bg = w.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = lin(colore)
    bg.inputs["Strength"].default_value = forza


def materiale(nome, base, rough=0.5, emis=None, forza=0.0, metal=0.0):
    m = bpy.data.materials.new(nome)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = lin(base)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if emis:
        key = "Emission Color" if "Emission Color" in b.inputs else "Emission"
        b.inputs[key].default_value = lin(emis)
        b.inputs["Emission Strength"].default_value = forza
    return m


def lastra(nome, dim, pos, mat, smusso=0.06):
    bpy.ops.mesh.primitive_cube_add(size=1, location=pos)
    o = bpy.context.active_object
    o.name = nome
    # Si scala la MESH, non l'oggetto: in Blender 5.3 `transform_apply(scale=True)` cuoce
    # anche la posizione nella geometria e azzera `location`, e ogni animazione dopo
    # si somma a una quota già cotta (la piattaforma finiva 9 unità sotto il quadro).
    o.data.transform(Matrix.Diagonal((*dim, 1.0)))
    bev = o.modifiers.new("Smusso", "BEVEL")
    bev.width = smusso
    bev.segments = 4
    o.data.materials.append(mat)
    return o


def luce_area(nome, colore, energia, pos, mira, dim=4.0):
    d = bpy.data.lights.new(nome, "AREA")
    d.color = lin(colore)[:3]
    d.energy = energia
    d.size = dim
    o = bpy.data.objects.new(nome, d)
    bpy.context.scene.collection.objects.link(o)
    o.location = pos
    o.rotation_euler = (Vector(mira) - Vector(pos)).to_track_quat("-Z", "Y").to_euler()
    return o


def chiave(o, f, **attr):
    for k, v in attr.items():
        setattr(o, k, v)
        o.keyframe_insert(data_path=k, frame=f)


# ── scena: fondo ─────────────────────────────────────────────────────────────

def scena_fondo():
    """Una superficie scura che respira, toccata da una luce del colore di marchio.
    Il rumore si campiona lungo un CERCHIO (l'empty gira su sé stesso): dopo un giro
    il campione è di nuovo lo stesso, quindi la superficie torna identica."""
    sc = bpy.context.scene
    n = ARGS["fps"] * ARGS["secondi"]
    motore(sc)
    uscita(sc, n)
    mondo(sc, P["notte"], 1.0)

    bpy.ops.mesh.primitive_plane_add(size=24, location=(0, 0, 0))
    piano = bpy.context.active_object
    sub = piano.modifiers.new("Suddividi", "SUBSURF")
    sub.subdivision_type = "SIMPLE"
    sub.levels = sub.render_levels = 6

    guida = bpy.data.objects.new("Guida", None)
    sc.collection.objects.link(guida)
    tex = bpy.data.textures.new("Onda", "CLOUDS")
    tex.noise_scale = 2.4
    tex.noise_depth = 1
    disp = piano.modifiers.new("Onda", "DISPLACE")
    disp.texture = tex
    disp.texture_coords = "OBJECT"
    disp.texture_coords_object = guida
    disp.strength = 0.7
    piano.modifiers.new("Liscia", "SUBSURF").levels = 1
    bpy.ops.object.shade_smooth()
    piano.data.materials.append(materiale("Superficie", P["notte2"], rough=0.32))

    r = 1.6
    for f in range(n + 1):
        th = 2 * math.pi * f / n
        guida.location = (r * math.cos(th), r * math.sin(th), 0.0)
        guida.keyframe_insert("location", frame=f)
    for fc in _curve(guida):
        for k in fc.keyframe_points:
            k.interpolation = "LINEAR"

    # Luci grandi e radenti: la superficie si legge dai riflessi, non da macchie.
    luce_area("Marchio", P["accento"], 1400, (-10, 6, 3.0), (0, 0, 0), dim=14)
    luce_area("Riflesso", P["accentoTenue"], 500, (10, 8, 4.0), (0, 0, 0), dim=16)
    luce_area("Aria", P["chiaro"], 40, (0, -4, 12), (0, 0, 0), dim=20)

    cam = bpy.data.objects.new("Camera", bpy.data.cameras.new("Camera"))
    sc.collection.objects.link(cam)
    sc.camera = cam
    # Dall'alto e senza orizzonte: lo sfondo sta dietro al testo, non deve avere un
    # punto di fuga che tiri l'occhio.
    cam.location = (0, -6.5, 6.5)
    cam.rotation_euler = (math.radians(50), 0, 0)
    cam.data.lens = 50
    cam.data.dof.use_dof = True
    cam.data.dof.focus_distance = 9.2
    cam.data.dof.aperture_fstop = 5.6
    return {"fotogrammi": n, "loop": True}


# ── scena: innesto ───────────────────────────────────────────────────────────

# I quattro blocchi del perimetro della banca e i tre componenti Adobe, nello stesso
# ordine di `apps/intesa-esperienza-cliente/src/data/innesto.ts`. Qui sono SOLO
# geometria: i nomi li mette l'HTML sopra, con le parole della slide.
PERIMETRO = ["data-lake", "motore", "iniziative", "canali"]
COMPONENTI = ["riconosce", "sceglie", "misura"]


def scena_innesto():
    """Prototipo: l'innesto come oggetto che si costruisce. Quattro fasi, ognuna un
    intervallo di fotogrammi scritto in `capitoli.json`, così il deck può fermarsi a
    ogni sotto-passo invece di far correre un filmato."""
    sc = bpy.context.scene
    fps = ARGS["fps"]
    fasi = [  # (chiave, secondi)
        ("perimetro", 2.0),   # il processo di oggi: un impulso corre lungo i quattro blocchi
        ("piattaforma", 2.0), # la lastra di Experience Platform sale da sotto
        ("componenti", 3.0),  # i tre componenti si alzano, uno alla volta
        ("flussi", 3.0),      # i dati scendono, la Next Best Experience sale, la misura torna
    ]
    capitoli, t = [], 0
    for k, s in fasi:
        capitoli.append({"fase": k, "da": t, "a": t + int(s * fps) - 1})
        t += int(s * fps)
    n = t + fps  # un secondo fermo in coda: l'ultimo stato si legge
    motore(sc)
    uscita(sc, n)
    mondo(sc, P["notte"], 1.0)

    m_banca = materiale("Banca", P["accentoTenue"], rough=0.6, emis=P["chiaro"], forza=0.03)
    m_lastra = materiale("Lastra", P["notte"], rough=0.7)
    m_aep = materiale("AEP", P["notte2"], rough=0.4, emis=P["accento"], forza=0.0)
    m_comp = materiale("Componente", P["accentoTenue"], rough=0.35, emis=P["accentoTenue"], forza=0.0)
    m_imp_bianco = materiale("Impulso", P["chiaro"], emis=P["chiaro"], forza=8)
    m_imp_acc = materiale("ImpulsoAccento", P["accentoTenue"], emis=P["accentoTenue"], forza=10)

    passo = 3.0
    xs = [(i - 1.5) * passo for i in range(4)]
    lastra("Perimetro", (13.4, 3.6, 0.12), (0, 0, 1.6), m_lastra, smusso=0.04)
    blocchi = [lastra(f"Banca_{k}", (2.5, 2.2, 0.55), (x, 0, 1.95), m_banca) for k, x in zip(PERIMETRO, xs)]

    # La piattaforma sta SOTTO e DAVANTI: esattamente sotto, da 32° di alzata la lastra
    # della banca la copre per intero (servirebbero 6,4 unità di scarto, ne ha 3,6).
    YA = -4.6
    aep = lastra("Piattaforma", (13.4, 3.6, 0.12), (0, YA, -9.0), m_aep, smusso=0.04)
    comp_x = [-3.6, 0.0, 3.6]
    comp = [lastra(f"Adobe_{k}", (2.9, 2.2, 0.5), (x, YA, -9.0), m_comp) for k, x in zip(COMPONENTI, comp_x)]

    def ease(o, f0, f1, z0, z1):
        chiave(o, f0, location=(o.location.x, o.location.y, z0))
        chiave(o, f1, location=(o.location.x, o.location.y, z1))

    c = {x["fase"]: x for x in capitoli}

    # fase 2: la piattaforma sale e il bordo si accende
    ease(aep, c["piattaforma"]["da"], c["piattaforma"]["a"], -9.0, -2.4)
    em = m_aep.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"]
    em.default_value = 0.0
    em.keyframe_insert("default_value", frame=c["piattaforma"]["da"])
    em.default_value = 0.1
    em.keyframe_insert("default_value", frame=c["piattaforma"]["a"])
    for o in comp:  # i componenti viaggiano nascosti dentro la lastra
        ease(o, c["piattaforma"]["da"], c["piattaforma"]["a"], -9.0, -2.45)

    # fase 3: i componenti si alzano uno alla volta
    durata = (c["componenti"]["a"] - c["componenti"]["da"]) // 3
    for i, o in enumerate(comp):
        f0 = c["componenti"]["da"] + i * durata
        ease(o, f0, f0 + int(durata * 0.8), -2.45, -1.95)
    ec = m_comp.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"]
    ec.default_value = 0.0
    ec.keyframe_insert("default_value", frame=c["componenti"]["da"])
    ec.default_value = 1.1
    ec.keyframe_insert("default_value", frame=c["componenti"]["a"])

    def impulso(nome, mat, tappe, f0, f1, r=0.16):
        """Una sfera luminosa che percorre una spezzata, visibile solo fra f0 e f1."""
        bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=tappe[0])
        s = bpy.context.active_object
        s.name = nome
        s.data.materials.append(mat)
        lung = [0.0]
        for a, b in zip(tappe, tappe[1:]):
            lung.append(lung[-1] + (Vector(b) - Vector(a)).length)
        for f in range(f0, f1 + 1):
            u = (f - f0) / max(1, f1 - f0) * lung[-1]
            for j in range(len(tappe) - 1):
                if u <= lung[j + 1] or j == len(tappe) - 2:
                    w = (u - lung[j]) / max(1e-6, lung[j + 1] - lung[j])
                    s.location = Vector(tappe[j]).lerp(Vector(tappe[j + 1]), min(1, w))
                    break
            s.keyframe_insert("location", frame=f)
        for f, vis in ((0, 0.0), (f0, 1.0), (f1 + 1, 0.0)):
            s.scale = (vis, vis, vis)
            s.keyframe_insert("scale", frame=f)
        for fc in _curve(s):
            for k in fc.keyframe_points:
                k.interpolation = "CONSTANT" if fc.data_path == "scale" else "LINEAR"

    zt = 2.35  # quota sopra i blocchi della banca
    zc = -1.55  # quota sopra i componenti Adobe
    # fase 1: il processo di oggi
    impulso("Oggi", m_imp_bianco, [(x, 0, zt) for x in xs], c["perimetro"]["da"], c["perimetro"]["a"])
    # fase 4: dati giù dal data lake (a «riconosce»), NBE su (da «sceglie» alle
    # iniziative e ai canali), misura che torna (dai canali a «misura»)
    F = c["flussi"]
    terzo = (F["a"] - F["da"]) // 3
    yb, ya = -1.25, YA + 1.15  # bordo davanti dei blocchi della banca, bordo dietro dei componenti
    impulso("Dati", m_imp_bianco, [(xs[0], 0, zt), (xs[0], yb, zt), (comp_x[0], ya, zc), (comp_x[0], YA, zc)],
            F["da"], F["da"] + terzo)
    impulso("NBE", m_imp_acc, [(comp_x[1], YA, zc), (comp_x[1], ya, zc), (xs[2], yb, zt), (xs[2], 0, zt), (xs[3], 0, zt)],
            F["da"] + terzo, F["da"] + 2 * terzo)
    impulso("Misura", m_imp_acc, [(xs[3], 0, zt), (xs[3], yb, zt), (comp_x[2], ya, zc), (comp_x[2], YA, zc)],
            F["da"] + 2 * terzo, F["a"])

    luce_area("Chiave", P["chiaro"], 1800, (-6, -10, 12), (0, 0, 0), dim=14)
    luce_area("Marchio", P["accento"], 500, (8, 4, -2), (0, 0, 0), dim=7)

    # Assonometria frontale: ortografica, alzata di 32°, azimut 0. La fila dei quattro
    # blocchi corre lungo x e si legge da sinistra a destra, come nella slide; con un
    # azimut obliquo la lastra di Experience Platform usciva dal fondo del quadro.
    cam = bpy.data.objects.new("Camera", bpy.data.cameras.new("Camera"))
    sc.collection.objects.link(cam)
    sc.camera = cam
    cam.data.type = "ORTHO"
    cam.data.ortho_scale = 17.5
    d = 30
    el, az = math.radians(32), 0.0
    cam.location = (d * math.cos(el) * math.sin(az), -2.3 - d * math.cos(el) * math.cos(az), d * math.sin(el) - 0.2)
    cam.rotation_euler = (Vector((0, -2.3, -0.2)) - cam.location).to_track_quat("-Z", "Y").to_euler()
    return {"fotogrammi": n, "loop": False, "capitoli": capitoli}


def _curve(o):
    """Le F-curve di un oggetto. In Blender 5 l'azione è stratificata (layer → strip →
    channelbag) e `action.fcurves` non c'è più: si passa dal channelbag dello slot."""
    ad = o.animation_data
    if not ad or not ad.action:
        return []
    act = ad.action
    if hasattr(act, "fcurves") and len(getattr(act, "fcurves", [])):
        return list(act.fcurves)
    out = []
    for layer in getattr(act, "layers", []):
        for strip in layer.strips:
            cb = strip.channelbag(ad.action_slot) if ad.action_slot else None
            if cb:
                out.extend(cb.fcurves)
    return out


SCENE = {"fondo": scena_fondo, "innesto": scena_innesto}

pulisci()
info = SCENE[ARGS["scena"]]()
with open(ARGS["cartella"].rstrip("/") + "/scena.json", "w") as fh:
    json.dump(info, fh, indent=2)
bpy.ops.render.render(animation=True)
