"""
spiegazioni.py — le scene a passi che SPIEGANO un meccanismo (non sfondi).

Una scena è una sequenza di passi; ogni passo è un tratto di fotogrammi che il deck
riproduce e poi ferma (il video segue chi parla). Le regole, prese dalla ricerca sui
canali che spiegano meglio (report «Spiegare concetti complessi in video», docs/Factory):

· UNA COSA PER PASSO. Il passo introduce un solo cambiamento; il resto sta fermo.
· UN COLORE, UN SIGNIFICATO. Grigio = anonimo / escluso / spento. Bianco = un dato, un
  evento. Verde di marchio = ciò che Adobe aggiunge, o ciò che è identificato e scelto.
· LO STESSO OGGETTO PER TUTTA LA SCENA. Giulia è sempre la stessa pedina, il profilo è
  sempre lo stesso contenitore: si trasformano, non vengono sostituiti.
· PRIMA IL CONCRETO. Si parte da una persona e da un gesto (simula la rata), non dallo
  schema.
· NIENTE TESTO NEL RENDER. Ogni oggetto che ha un nome dichiara un'ANCORA; lo script
  calcola dove cade sullo schermo alla fine di ogni passo e l'HTML ci posa l'etichetta.
"""
import math

import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Matrix, Vector


def lin(hexstr, a=1.0):
    h = hexstr.lstrip("#")
    out = []
    for i in (0, 2, 4):
        c = int(h[i:i + 2], 16) / 255
        out.append(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4)
    return (*out, a)


def mescola(h1, h2, t):
    a = [int(h1.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4)]
    b = [int(h2.lstrip("#")[i:i + 2], 16) for i in (0, 2, 4)]
    return "#" + "".join(f"{round(x + (y - x) * t):02x}" for x, y in zip(a, b))


class Scena:
    """Il telaio comune: palette, tempi dei passi, materiali animabili, ancore."""

    def __init__(self, args, passi_secondi):
        self.A = args
        self.P = args["palette"]
        P = self.P
        # I quattro stati di colore della grammatica, derivati dalla palette letta.
        self.C = {
            "fondo": P["notte"],
            "pavimento": mescola(P["notte"], P["notte2"], 0.6),
            "grigio": mescola(P["notte2"], "#9aa39a", 0.55),
            "bianco": P["chiaro"],
            "verde": P["accentoTenue"],
            "marchio": P["accento"],
        }
        fps = args["fps"]
        self.fps = fps
        self.passi = []
        t = 0
        for s in passi_secondi:
            n = int(round(s * fps))
            self.passi.append((t, t + n - 1))
            t += n
        self.n = t
        self.ancore = {}  # nome → (oggetto, offset)
        self.sc = bpy.context.scene

    # ── tempo ────────────────────────────────────────────────────────────────
    def p(self, i, frac=0.0):
        """Il fotogramma a `frac` (0…1) dentro il passo i (1-based)."""
        a, b = self.passi[i - 1]
        return int(round(a + (b - a) * frac))

    # ── materiali ────────────────────────────────────────────────────────────
    def mat(self, colore, emis=0.0, rough=0.5, alpha=1.0, nome="m"):
        m = bpy.data.materials.new(nome)
        m.use_nodes = True
        b = m.node_tree.nodes.get("Principled BSDF")
        b.inputs["Base Color"].default_value = lin(colore)
        b.inputs["Roughness"].default_value = rough
        key = "Emission Color" if "Emission Color" in b.inputs else "Emission"
        b.inputs[key].default_value = lin(colore)
        b.inputs["Emission Strength"].default_value = emis
        b.inputs["Alpha"].default_value = alpha
        try:
            m.surface_render_method = "BLENDED" if alpha < 1 else "DITHERED"
        except AttributeError:
            m.blend_method = "BLEND" if alpha < 1 else "OPAQUE"
        return m

    def colore(self, o, f, colore, emis=None, alpha=None):
        """Chiave di colore sul materiale PROPRIO dell'oggetto (uno per oggetto)."""
        b = o.active_material.node_tree.nodes.get("Principled BSDF")
        key = "Emission Color" if "Emission Color" in b.inputs else "Emission"
        for nome, val in (("Base Color", lin(colore)), (key, lin(colore))):
            b.inputs[nome].default_value = val
            b.inputs[nome].keyframe_insert("default_value", frame=f)
        if emis is not None:
            b.inputs["Emission Strength"].default_value = emis
            b.inputs["Emission Strength"].keyframe_insert("default_value", frame=f)
        if alpha is not None:
            b.inputs["Alpha"].default_value = alpha
            b.inputs["Alpha"].keyframe_insert("default_value", frame=f)

    def vira(self, o, f0, f1, da, a, emis=(None, None), alpha=(None, None)):
        self.colore(o, f0, da, emis[0], alpha[0])
        self.colore(o, f1, a, emis[1], alpha[1])

    # ── geometria ────────────────────────────────────────────────────────────
    def _fine(self, o, colore, emis, alpha, rough):
        o.data.materials.append(self.mat(colore, emis, rough, alpha, nome=o.name))
        return o

    def scatola(self, nome, dim, pos, colore, emis=0.0, alpha=1.0, smusso=0.06, rough=0.5):
        bpy.ops.mesh.primitive_cube_add(size=1, location=pos)
        o = bpy.context.active_object
        o.name = nome
        # Si scala la mesh: in Blender 5.3 transform_apply cuoce anche la posizione.
        o.data.transform(Matrix.Diagonal((*dim, 1.0)))
        if smusso:
            bev = o.modifiers.new("Smusso", "BEVEL")
            bev.width = min(smusso, min(dim) * 0.45)
            bev.segments = 4
        return self._fine(o, colore, emis, alpha, rough)

    def cilindro(self, nome, r, h, pos, colore, emis=0.0, alpha=1.0, vertici=48, rough=0.5):
        bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, location=pos, vertices=vertici)
        o = bpy.context.active_object
        o.name = nome
        bpy.ops.object.shade_smooth()
        return self._fine(o, colore, emis, alpha, rough)

    def anello(self, nome, r, spessore, pos, colore, emis=0.0, alpha=1.0):
        bpy.ops.mesh.primitive_torus_add(major_radius=r, minor_radius=spessore, location=pos,
                                         major_segments=96, minor_segments=12)
        o = bpy.context.active_object
        o.name = nome
        o.scale = (1, 1, 0.35)
        bpy.ops.object.shade_smooth()
        return self._fine(o, colore, emis, alpha, 0.4)

    def sfera(self, nome, r, pos, colore, emis=0.0):
        bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=pos, segments=32, ring_count=16)
        o = bpy.context.active_object
        o.name = nome
        bpy.ops.object.shade_smooth()
        return self._fine(o, colore, emis, 1.0, 0.3)

    def pedina(self, nome, pos, colore, alpha=1.0):
        """La persona: testa e busto, nient'altro. Riconoscibile, non illustrata."""
        x, y, z = pos
        busto = self.cilindro(nome, 0.32, 0.7, (x, y, z + 0.35), colore, alpha=alpha)
        bev = busto.modifiers.new("Smusso", "BEVEL")
        bev.width = 0.12
        bev.segments = 6
        testa = self.sfera(nome + "_testa", 0.22, (x, y, z + 0.98), colore)
        testa.data.materials.clear()
        testa.data.materials.append(busto.active_material)
        testa.parent = busto
        testa.location = (0, 0, 0.63)
        return busto

    # ── movimento ────────────────────────────────────────────────────────────
    def chiave(self, o, f, loc=None, scala=None, rot=None):
        if loc is not None:
            o.location = loc
            o.keyframe_insert("location", frame=f)
        if scala is not None:
            o.scale = (scala,) * 3 if isinstance(scala, (int, float)) else scala
            o.keyframe_insert("scale", frame=f)
        if rot is not None:
            o.rotation_euler = rot
            o.keyframe_insert("rotation_euler", frame=f)

    def compare(self, o, f0, f1, scala=1.0):
        """Nasce in f0…f1 (scala 0 → 1); prima non esiste."""
        s = o.scale.copy() if scala is None else None
        self.chiave(o, 0, scala=0.0001)
        self.chiave(o, f0, scala=0.0001)
        self.chiave(o, f1, scala=s if s is not None else scala)

    def scompare(self, o, f0, f1):
        self.chiave(o, f0, scala=tuple(o.scale))
        self.chiave(o, f1, scala=0.0001)

    def sposta(self, o, f0, f1, a):
        self.chiave(o, f0, loc=tuple(o.location))
        self.chiave(o, f1, loc=a)

    def percorso(self, o, f0, f1, tappe, arco=0.0):
        """Su una spezzata, con velocità costante e un arco verticale facoltativo."""
        lung = [0.0]
        for a, b in zip(tappe, tappe[1:]):
            lung.append(lung[-1] + (Vector(b) - Vector(a)).length)
        for f in range(f0, f1 + 1):
            t = (f - f0) / max(1, f1 - f0)
            t = t * t * (3 - 2 * t)  # dolce in partenza e in arrivo
            u = t * lung[-1]
            for j in range(len(tappe) - 1):
                if u <= lung[j + 1] or j == len(tappe) - 2:
                    w = (u - lung[j]) / max(1e-6, lung[j + 1] - lung[j])
                    pnt = Vector(tappe[j]).lerp(Vector(tappe[j + 1]), min(1, w))
                    pnt.z += arco * math.sin(math.pi * t)
                    o.location = pnt
                    break
            o.keyframe_insert("location", frame=f)

    def gettone(self, nome, tappe, f0, f1, colore=None, r=0.13, arco=0.0, resta=False):
        """Un dato che viaggia: nasce in partenza, sparisce all'arrivo (o resta)."""
        s = self.sfera(nome, r, tappe[0], colore or self.C["bianco"], emis=3.0)
        self.chiave(s, 0, scala=0.0001)
        self.chiave(s, f0 - 1, scala=0.0001)
        self.chiave(s, f0, scala=1.0)
        self.percorso(s, f0, f1, tappe, arco)
        if not resta:
            self.chiave(s, f1, scala=1.0)
            self.chiave(s, f1 + 2, scala=0.0001)
        _costanti(s, "scale")
        return s

    def filo(self, nome, da, a, f0, f1, colore, spessore=0.05, emis=3.0):
        """Un segnale di RELAZIONE (Boucheix & Lowe 2013): un tratto che si disegna da A
        verso B. Funziona meglio di un oggetto che si accende, perché in una scena che
        si muove l'accensione da sola si perde."""
        A, B = Vector(da), Vector(a)
        L = (B - A).length
        o = self.scatola(nome, (L, spessore, spessore), (0, 0, 0), colore, emis=emis, smusso=0)
        o.data.transform(Matrix.Translation((L / 2, 0, 0)))  # origine all'inizio del tratto
        o.location = A
        o.rotation_euler = (B - A).to_track_quat("X", "Z").to_euler()
        self.chiave(o, 0, scala=0.0001)
        self.chiave(o, f0 - 1, scala=0.0001)
        self.chiave(o, f0, scala=(0.0001, 1, 1))
        self.chiave(o, f1, scala=(1, 1, 1))
        return o

    # ── scena ────────────────────────────────────────────────────────────────
    def ancora(self, nome, o, offset=(0, 0, 0)):
        self.ancore[nome] = (o, Vector(offset))

    def ambiente(self, camera_mira, camera_dist=30, alzata=34, azimut=-28, ortho=14.0):
        sc = self.sc
        w = bpy.data.worlds.new("Mondo")
        sc.world = w
        w.use_nodes = True
        w.node_tree.nodes["Background"].inputs["Color"].default_value = lin(self.C["fondo"])
        # Pavimento che si perde nel fondo: dà appoggio senza disegnare un orizzonte.
        self.scatola("Pavimento", (80, 80, 0.1), (0, 0, -0.05), self.C["fondo"], smusso=0, rough=0.9)
        for nome, col, en, pos, dim in (
            ("Chiave", self.C["bianco"], 2200, (-8, -10, 14), 16),
            ("Marchio", self.C["marchio"], 900, (12, 6, 5), 12),
            ("Contro", self.C["bianco"], 300, (6, -12, 4), 10),
        ):
            d = bpy.data.lights.new(nome, "AREA")
            d.color = lin(col)[:3]
            d.energy = en
            d.size = dim
            o = bpy.data.objects.new(nome, d)
            sc.collection.objects.link(o)
            o.location = pos
            o.rotation_euler = (Vector(camera_mira) - Vector(pos)).to_track_quat("-Z", "Y").to_euler()
        cam = bpy.data.objects.new("Camera", bpy.data.cameras.new("Camera"))
        sc.collection.objects.link(cam)
        sc.camera = cam
        cam.data.type = "ORTHO"
        cam.data.ortho_scale = ortho
        el, az = math.radians(alzata), math.radians(azimut)
        m = Vector(camera_mira)
        cam.location = m + Vector((camera_dist * math.cos(el) * math.sin(az),
                                   -camera_dist * math.cos(el) * math.cos(az),
                                   camera_dist * math.sin(el)))
        cam.rotation_euler = (m - cam.location).to_track_quat("-Z", "Y").to_euler()
        self.cam = cam
        return cam

    def inquadra(self, f, mira=None, ortho=None):
        """Movimento di camera: si stringe o si allarga sul soggetto del passo."""
        # Si mettono SEMPRE le due chiavi: una sola chiave terrebbe la camera spostata
        # per tutta la scena, anche prima del passo che la muove.
        cam = self.cam
        if mira is not None:
            d = cam.location - self._mira_attuale()
            cam.location = Vector(mira) + d
        if ortho is not None:
            cam.data.ortho_scale = ortho
        cam.keyframe_insert("location", frame=f)
        cam.data.keyframe_insert("ortho_scale", frame=f)

    def _mira_attuale(self):
        cam = self.cam
        avanti = cam.rotation_euler.to_matrix() @ Vector((0, 0, -1))
        # il punto dove l'asse ottico incontra z = 0
        t = -cam.location.z / avanti.z if avanti.z else 0
        return cam.location + avanti * t

    def chiudi(self):
        """Le posizioni a schermo delle ancore alla fine di ogni passo (0…1, y dall'alto)."""
        sc = self.sc
        uscita = []
        for i, (a, b) in enumerate(self.passi, start=1):
            sc.frame_set(b)
            dg = bpy.context.evaluated_depsgraph_get()
            for nome, (o, off) in self.ancore.items():
                oe = o.evaluated_get(dg)
                p = oe.matrix_world.translation + off
                visibile = min(oe.matrix_world.to_scale()) > 0.05
                co = world_to_camera_view(sc, self.cam, p)
                uscita.append({"passo": i, "nome": nome, "x": round(co.x, 4), "y": round(1 - co.y, 4),
                               "visibile": bool(visibile and 0 <= co.x <= 1 and 0 <= co.y <= 1)})
        sc.frame_set(0)
        return uscita


def _costanti(o, path):
    ad = o.animation_data
    if not ad or not ad.action:
        return
    act = ad.action
    curve = list(getattr(act, "fcurves", []) or [])
    if not curve:
        for layer in getattr(act, "layers", []):
            for strip in layer.strips:
                cb = strip.channelbag(ad.action_slot) if ad.action_slot else None
                if cb:
                    curve.extend(cb.fcurves)
    for fc in curve:
        if fc.data_path == path:
            for k in fc.keyframe_points:
                k.interpolation = "CONSTANT"


# ═════════════════════════════════════════════════════════════════════════════
# REAL-TIME ACTIVATION — il profilo che prende un nome (5 passi)
# ═════════════════════════════════════════════════════════════════════════════

def scena_rta(args):
    S = Scena(args, [3.0, 3.0, 2.6, 4.2, 3.4])
    C = S.C
    S.ambiente(camera_mira=(0, 0, 0.6), ortho=13.0)

    # Il sito: una lastra verticale, a sinistra. Giulia davanti.
    sito = S.scatola("Sito", (0.18, 2.6, 1.8), (-5.2, 0, 1.0), C["grigio"], rough=0.4)
    S.ancora("sito", sito, (0, 0, 1.15))
    giulia = S.pedina("Giulia", (-3.9, -0.4, 0), C["grigio"])
    S.ancora("giulia", giulia, (0, 0, 1.0))

    # Il profilo: un contenitore trasparente al centro. Grigio finché non ha un nome.
    prof = S.scatola("Profilo", (1.7, 1.7, 2.4), (0.2, 0, 1.2), C["grigio"], alpha=0.28, smusso=0.12, rough=0.2)
    S.ancora("profilo", prof, (0, 0, 1.45))

    # Passo 1: tre gesti sul sito diventano tre eventi nel profilo, senza nome.
    eventi = []
    for k in range(3):
        f0 = S.p(1, 0.15 + k * 0.25)
        dest = (0.2, 0, 0.25 + k * 0.3)
        g = S.scatola(f"Evento{k}", (0.9, 0.9, 0.18), (-4.6, -0.2, 1.2), C["bianco"], emis=0.4, smusso=0.04)
        S.compare(g, f0, f0 + 4)
        S.percorso(g, f0 + 4, f0 + 22, [(-4.6, -0.2, 1.2), (-2.2, -0.1, 2.4), dest], arco=0.6)
        eventi.append(g)

    # Passo 2: simula la rata → un evento di marchio, e il profilo entra nel segmento.
    f0 = S.p(2, 0.05)
    rata = S.scatola("Rata", (0.9, 0.9, 0.18), (-4.6, -0.2, 1.2), C["verde"], emis=1.2, smusso=0.04)
    S.compare(rata, f0, f0 + 4)
    S.percorso(rata, f0 + 4, f0 + 24, [(-4.6, -0.2, 1.2), (-2.2, -0.1, 2.6), (0.2, 0, 1.15)], arco=0.6)
    seg = S.anello("Segmento", 1.55, 0.05, (0.2, 0, 0.04), C["verde"], emis=2.5)
    S.compare(seg, S.p(2, 0.55), S.p(2, 0.8))
    S.ancora("segmento", seg, (2.2, -1.4, 0))

    # Passo 3: torna sul sito → dal profilo parte una proposta, il sito si accende.
    S.gettone("Riprendi", [(0.2, 0, 2.5), (-2.5, 0, 3.0), (-5.0, 0, 1.6)], S.p(3, 0.1), S.p(3, 0.55),
              colore=C["verde"], r=0.16)
    S.vira(sito, S.p(3, 0.5), S.p(3, 0.65), C["grigio"], C["verde"], emis=(0.0, 0.8))
    S.vira(sito, S.p(4, 0.0), S.p(4, 0.1), C["verde"], C["grigio"], emis=(0.8, 0.0))

    # Passo 4: lascia email e consenso. Il profilo prende colore, e con lui gli eventi
    # di PRIMA: è lo stitching, ed è il punto da far vedere.
    busta = S.scatola("Email", (0.55, 0.08, 0.38), (-3.9, -0.4, 1.6), C["bianco"], emis=1.5, smusso=0.03)
    S.compare(busta, S.p(4, 0.05), S.p(4, 0.12))
    S.sposta(busta, S.p(4, 0.12), S.p(4, 0.28), (-3.9, -0.4, 1.35))
    S.scompare(busta, S.p(4, 0.45), S.p(4, 0.5))
    # Il segnale: un filo si tende dall'email (sulla pedina) alla storia anonima nel
    # profilo, POI il profilo prende colore. Prima la relazione, poi l'effetto.
    tirante = S.filo("Tirante", (-3.9, -0.4, 1.35), (0.2, 0, 0.6), S.p(4, 0.3), S.p(4, 0.45), C["verde"])
    # Il filo resta teso fino alla fine del passo (è lo stato da guardare) e si
    # scioglie all'inizio del successivo.
    S.chiave(tirante, S.p(5, 0.0), scala=(1, 1, 1))
    S.chiave(tirante, S.p(5, 0.1), scala=(1, 0.0001, 0.0001))
    S.ancora("tirante", tirante, (2.0, 0.2, 0.1))  # a metà del filo
    S.vira(prof, S.p(4, 0.42), S.p(4, 0.6), C["grigio"], C["verde"], emis=(0.0, 0.25), alpha=(0.28, 0.4))
    S.vira(giulia, S.p(4, 0.42), S.p(4, 0.6), C["grigio"], C["verde"], emis=(0.0, 0.3))
    for k, g in enumerate(eventi):
        S.vira(g, S.p(4, 0.6 + k * 0.1), S.p(4, 0.7 + k * 0.1), C["bianco"], C["verde"], emis=(0.4, 1.0))

    # Passo 5: con un nome, il profilo può essere usato da due parti.
    ajo = S.scatola("AJO", (1.6, 1.3, 1.0), (4.6, 1.5, 0.5), C["grigio"], smusso=0.1)
    crm = S.scatola("CRM", (1.6, 1.3, 1.0), (4.6, -1.9, 0.5), C["grigio"], smusso=0.1)
    for o in (ajo, crm):
        S.compare(o, S.p(5, 0.0), S.p(5, 0.15))
    S.ancora("ajo", ajo, (0, 0, 0.8))
    S.ancora("crm", crm, (0, 0, 0.8))
    S.gettone("VersoAJO", [(1.1, 0.4, 1.6), (3.0, 1.2, 2.2), (4.6, 1.5, 1.1)], S.p(5, 0.2), S.p(5, 0.5), C["verde"])
    S.vira(ajo, S.p(5, 0.45), S.p(5, 0.55), C["grigio"], C["marchio"], emis=(0.0, 0.6))
    S.gettone("VersoCRM", [(1.1, -0.4, 1.6), (3.0, -1.4, 2.2), (4.6, -1.9, 1.1)], S.p(5, 0.5), S.p(5, 0.8), C["bianco"])
    S.vira(crm, S.p(5, 0.75), S.p(5, 0.85), C["grigio"], mescola(C["grigio"], C["bianco"], 0.5), emis=(0.0, 0.2))
    # La camera si allarga di poco all'ultimo passo, quando entrano due destinazioni.
    S.inquadra(S.p(5, 0.0), ortho=13.0)
    S.inquadra(S.p(5, 0.2), mira=(0.6, 0, 0.6), ortho=14.2)
    return S


# ═════════════════════════════════════════════════════════════════════════════
# AI DECISIONING — quattro proposte, una scelta (7 passi)
# ═════════════════════════════════════════════════════════════════════════════

def scena_decisioning(args):
    S = Scena(args, [2.8, 2.8, 2.4, 3.2, 2.8, 3.0, 3.2])
    C = S.C
    S.ambiente(camera_mira=(0, 0, 0.6), ortho=13.5)

    # I sistemi della banca, a sinistra: restano grigi per tutta la scena.
    motore = S.scatola("Motore", (1.6, 1.4, 1.0), (-5.4, 1.4, 0.5), C["grigio"], smusso=0.1)
    core = S.scatola("Core", (1.6, 1.4, 0.7), (-5.4, -1.6, 0.35), C["grigio"], smusso=0.1)
    S.ancora("motore", motore, (0, 0, 0.8))
    S.ancora("core", core, (0, 0, 0.65))
    # Il profilo: la stessa colonna della scena prima, già con un nome.
    prof = S.scatola("Profilo", (1.2, 1.2, 2.2), (-2.4, 0, 1.1), C["verde"], alpha=0.4, emis=0.2, smusso=0.1, rough=0.2)
    S.ancora("profilo", prof, (0, 0, 1.35))

    # Passo 1: il motore calcola (pulsa), il core tiene l'eleggibilità.
    for k in range(2):
        f = S.p(1, 0.2 + k * 0.35)
        S.vira(motore, f, f + 6, C["grigio"], mescola(C["grigio"], C["bianco"], 0.5), emis=(0.0, 0.3))
        S.vira(motore, f + 7, f + 14, mescola(C["grigio"], C["bianco"], 0.5), C["grigio"], emis=(0.3, 0.0))

    # Passo 2: score ed eleggibilità entrano nel profilo come anelli-attributo.
    attr = []
    for k, (src, z) in enumerate((((-5.4, 1.4, 1.1), 0.7), ((-5.4, -1.6, 0.8), 1.2))):
        f0 = S.p(2, 0.1 + k * 0.35)
        S.gettone(f"Attr{k}", [src, (-3.8, 0, 2.6), (-2.4, 0, z)], f0, f0 + 24, C["bianco"], arco=0.3)
        a = S.anello(f"Anello{k}", 0.78, 0.045, (-2.4, 0, z), C["bianco"], emis=2.0)
        S.compare(a, f0 + 22, f0 + 28)
        attr.append(a)
    S.ancora("attributi", attr[1], (0.9, 0, 0))

    # Passo 3: quattro proposte candidate davanti all'arbitro.
    xs = [0.6, 2.2, 3.8, 5.4]
    cand = []
    for k, x in enumerate(xs):
        c = S.scatola(f"Proposta{k}", (1.2, 0.16, 1.5), (x, 0, 0.85), C["bianco"], emis=0.25, smusso=0.04)
        S.compare(c, S.p(3, 0.1 + k * 0.15), S.p(3, 0.25 + k * 0.15))
        cand.append(c)
        S.ancora(f"proposta{k}", c, (0, 0, 1.0))
    pedana = S.scatola("Arbitro", (6.6, 2.4, 0.12), (3.0, 0, 0.06), C["marchio"], emis=0.15, smusso=0.04)
    S.compare(pedana, S.p(3, 0.0), S.p(3, 0.12))
    S.ancora("arbitro", pedana, (0, -1.4, 0))

    # Passo 4: le regole. Un portale scorre sulle proposte; due non passano e scendono.
    portale = S.scatola("Regole", (0.1, 2.6, 2.4), (-0.4, 0, 1.2), C["verde"], emis=1.4, alpha=0.5, smusso=0.02)
    S.compare(portale, S.p(4, 0.0), S.p(4, 0.08))
    S.sposta(portale, S.p(4, 0.08), S.p(4, 0.75), (6.4, 0, 1.2))
    S.scompare(portale, S.p(4, 0.8), S.p(4, 0.9))
    for k in (2, 3):  # contatto telefonico senza consenso · polizza solo dopo la firma
        f = S.p(4, 0.15 + (xs[k] + 0.4) / 6.8 * 0.6)
        # L'esclusione si VEDE: la proposta resta, arretra e diventa grigia. Farla
        # sparire cancellerebbe proprio la cosa da capire (le regole tolgono).
        S.vira(cand[k], f, f + 5, C["bianco"], C["grigio"], emis=(0.25, 0.0), alpha=(1.0, 0.4))
        S.sposta(cand[k], f + 5, f + 18, (xs[k], 1.5, 0.85))
    S.ancora("regole", portale, (0, 0, 1.4))

    # Passo 5: la classifica. Le due ammesse salgono a quote diverse.
    S.sposta(cand[0], S.p(5, 0.15), S.p(5, 0.6), (xs[0], 0, 1.75))
    S.sposta(cand[1], S.p(5, 0.15), S.p(5, 0.6), (xs[1], 0, 1.2))
    S.gettone("Priorita", [(-2.4, 0, 2.3), (-0.5, 0, 3.1), (xs[0], 0, 2.7)], S.p(5, 0.0), S.p(5, 0.35), C["verde"])

    # Passo 6: resta una sola proposta; va verso il canale ammesso (il sito).
    canale = S.scatola("Canale", (0.18, 2.2, 1.6), (7.6, -1.2, 0.9), C["grigio"], rough=0.4)
    S.compare(canale, S.p(6, 0.0), S.p(6, 0.15))
    S.ancora("canale", canale, (0, 0, 1.05))
    S.vira(cand[1], S.p(6, 0.1), S.p(6, 0.25), C["bianco"], C["grigio"], emis=(0.25, 0.0), alpha=(1.0, 0.35))
    S.sposta(cand[1], S.p(6, 0.25), S.p(6, 0.45), (xs[1], 0.9, 1.2))
    S.vira(cand[0], S.p(6, 0.2), S.p(6, 0.35), C["bianco"], C["verde"], emis=(0.25, 1.0))
    S.chiave(cand[0], S.p(6, 0.4), loc=(xs[0], 0, 1.75))
    S.percorso(cand[0], S.p(6, 0.4), S.p(6, 0.85), [(xs[0], 0, 1.75), (4.0, -0.8, 2.6), (7.2, -1.2, 1.1)], arco=0.4)
    S.vira(canale, S.p(6, 0.8), S.p(6, 0.9), C["grigio"], C["verde"], emis=(0.0, 0.7))
    S.inquadra(S.p(6, 0.0), ortho=13.5)
    S.inquadra(S.p(6, 0.3), mira=(1.2, 0, 0.6), ortho=15.0)

    # Passo 7: la misura torna indietro e corregge priorità e regole.
    striscia = S.scatola("CJA", (12.0, 0.7, 0.1), (1.2, -3.2, 0.05), C["marchio"], emis=0.6, smusso=0.04)
    S.compare(striscia, S.p(7, 0.0), S.p(7, 0.15))
    S.ancora("cja", striscia, (0, -0.2, 0))
    S.gettone("Esito", [(7.4, -1.6, 0.4), (6.0, -3.2, 0.4), (-1.5, -3.2, 0.4), (3.0, -1.2, 0.3)],
              S.p(7, 0.2), S.p(7, 0.85), C["bianco"])
    S.vira(pedana, S.p(7, 0.8), S.p(7, 0.88), C["marchio"], C["verde"], emis=(0.15, 1.2))
    S.vira(pedana, S.p(7, 0.9), S.p(7, 1.0), C["verde"], C["marchio"], emis=(1.2, 0.15))
    return S


# ═════════════════════════════════════════════════════════════════════════════
# CUSTOMER JOURNEY ANALYTICS — da due isole a un percorso solo (6 passi)
# ═════════════════════════════════════════════════════════════════════════════

def scena_cja(args):
    S = Scena(args, [2.8, 2.8, 2.8, 2.6, 3.6, 4.0])
    C = S.C
    S.ambiente(camera_mira=(0, 0.2, 1.0), ortho=16.5)

    # Passo 1: due isole che non si parlano. Digitale a sinistra, fisico a destra.
    isola_d = S.scatola("IsolaDigitale", (4.6, 3.4, 0.12), (-4.2, -1.0, 0.06), C["pavimento"], smusso=0.05)
    isola_f = S.scatola("IsolaFisica", (4.6, 3.4, 0.12), (4.2, -1.0, 0.06), C["pavimento"], smusso=0.05)
    S.ancora("digitale", isola_d, (0, -2.0, 0))
    S.ancora("fisico", isola_f, (0, -2.0, 0))
    fonti = {
        "sito": (-5.4, -1.0), "app": (-3.0, -1.0),
        "filiale": (3.0, -1.0), "filiale_digitale": (5.4, -1.0),
    }
    blocchi = {}
    for nome, (x, y) in fonti.items():
        b = S.scatola(f"Fonte_{nome}", (1.3, 1.3, 0.9), (x, y, 0.57), C["grigio"], smusso=0.1)
        blocchi[nome] = b
        S.ancora(nome, b, (0, 0, 0.75))
    # Una crepa fra le isole: il punto è che in mezzo non passa niente.
    for k in range(2):
        f = S.p(1, 0.3 + k * 0.3)
        S.gettone(f"Rimbalzo{k}", [(-1.8, -1.0, 0.9), (-0.3, -1.0, 1.3), (-1.8, -1.0, 0.9)], f, f + 16, C["grigio"])

    # Passo 2: CJA compare sopra, al centro, e raccoglie sito e app.
    cja = S.scatola("CJA", (7.6, 2.2, 0.16), (0, 2.6, 2.4), C["marchio"], emis=0.25, smusso=0.06)
    S.compare(cja, S.p(2, 0.0), S.p(2, 0.18))
    S.ancora("cja", cja, (-2.6, -1.3, 0.1))  # sul bordo davanti, non sulle tappe

    def flusso(nome, src, i, n=3, colore=None):
        x, y = fonti[src] if src in fonti else src
        for k in range(n):
            f0 = S.p(i, 0.2 + k * 0.18)
            dest = (x * 0.55, 2.6, 2.6)
            S.gettone(f"{nome}{k}", [(x, y, 1.1), (x * 0.8, 0.9, 2.2), dest], f0, f0 + 20, colore)

    for src in ("sito", "app"):
        flusso(f"F_{src}", src, 2)
        S.vira(blocchi[src], S.p(2, 0.2), S.p(2, 0.35), C["grigio"], mescola(C["grigio"], C["bianco"], 0.45))
    # Passo 3: entrano filiale e Filiale Digitale, una fonte alla volta.
    for j, src in enumerate(("filiale", "filiale_digitale")):
        flusso(f"F_{src}", src, 3)
        S.vira(blocchi[src], S.p(3, 0.2 + j * 0.2), S.p(3, 0.35 + j * 0.2), C["grigio"], mescola(C["grigio"], C["bianco"], 0.45))

    # Passo 4: il motore di targeting porta segmenti e score.
    motore = S.scatola("Motore", (1.6, 1.3, 1.0), (0, -3.6, 0.5), C["grigio"], smusso=0.1)
    S.compare(motore, S.p(4, 0.0), S.p(4, 0.15))
    S.ancora("motore", motore, (0, 0, 0.8))
    for k in range(3):
        f0 = S.p(4, 0.2 + k * 0.18)
        S.gettone(f"Seg{k}", [(0, -3.6, 1.1), (0, -0.5, 2.0), (0, 2.6, 2.6)], f0, f0 + 22, C["verde"])

    # Passo 5: per chi si identifica, i punti della stessa persona si mettono in fila.
    tappe = [("t_sito", -2.7, "sito"), ("t_email", -0.9, "app"), ("t_filiale", 0.9, "filiale"), ("t_firma", 2.7, None)]
    perle = []
    for k, (nome, x, src) in enumerate(tappe):
        col = C["verde"] if src is None else C["bianco"]
        p = S.scatola(nome, (1.2, 0.5, 0.3), (x, 2.6, 2.65), col, emis=0.6 if src else 1.6, smusso=0.06)
        f0 = S.p(5, 0.1 + k * 0.17)
        S.compare(p, f0, f0 + 6)
        perle.append(p)
        S.ancora(nome, p, (0, -0.55, -0.1))  # davanti alla tappa: sopra crescono le barre
    filo = S.scatola("Filo", (5.6, 0.06, 0.06), (0, 2.6, 2.65), C["verde"], emis=2.0, smusso=0)
    S.chiave(filo, 0, scala=0.0001)
    S.chiave(filo, S.p(5, 0.1) - 1, scala=0.0001)
    S.chiave(filo, S.p(5, 0.1), scala=(0.0001, 1, 1))
    S.chiave(filo, S.p(5, 0.75), scala=(1, 1, 1))
    S.inquadra(S.p(5, 0.0), ortho=16.5)
    S.inquadra(S.p(5, 0.4), mira=(0, 1.8, 2.4), ortho=11.0)

    # Passo 6: le firme si attribuiscono ai canali, filiale compresa. Barre che crescono
    # dalle tappe (valori della scena attuale del pop-in: sito 78, email 34, filiale 60).
    # Il segnale: il merito parte dalla firma e RISALE il percorso verso ciascuna tappa
    # (una quantità che si sposta, non etichette che si accendono). Poi le barre.
    for k in range(3):
        S.gettone(f"Merito{k}", [(2.7, 2.6, 3.0), (tappe[k][1], 2.6, 3.0)], S.p(6, 0.02), S.p(6, 0.2 + k * 0.06),
                  C["verde"], r=0.11)
    for k, (nome, v) in enumerate((("b_sito", 0.78), ("b_email", 0.34), ("b_filiale", 0.60))):
        x = tappe[k][1]
        h = 2.4 * v
        b = S.scatola(nome, (0.7, 0.35, h), (x, 3.2, 2.75 + h / 2), C["verde"] if k == 2 else C["bianco"],
                      emis=0.8, smusso=0.04)
        S.chiave(b, 0, scala=0.0001)
        S.chiave(b, S.p(6, 0.15 + k * 0.1) - 1, scala=0.0001)
        S.chiave(b, S.p(6, 0.15 + k * 0.1), scala=(1, 1, 0.0001))
        S.chiave(b, S.p(6, 0.55 + k * 0.1), scala=(1, 1, 1))
        b.location.z = 2.75  # cresce dal basso: origine alla base
        b.data.transform(Matrix.Translation((0, 0, h / 2)))
        S.ancora(nome, b, (0, 0, h + 0.25))
    S.inquadra(S.p(6, 0.0), ortho=11.0)
    S.inquadra(S.p(6, 0.3), mira=(0, 2.2, 3.0), ortho=11.0)
    return S



# ═════════════════════════════════════════════════════════════════════════════
# GENSTUDIO FOR PERFORMANCE MARKETING — dal brief all'annuncio, e ritorno (7 passi)
# Flusso verificato su Experience League il 16 nov 2026: linee guida (Brand, Prodotti,
# Personas) → Create genera varianti → content check su marchio, piattaforma e
# accessibilità → si corregge e si ricontrolla → revisione e approvazione → Activate
# consegna al canale a pagamento SPENTO (si accende dal gestore del canale) → Insights
# legge il rendimento per attributo e alimenta la Create successiva.
# ═════════════════════════════════════════════════════════════════════════════

def scena_genstudio(args):
    S = Scena(args, [3.0, 3.0, 3.4, 2.6, 3.0, 3.4, 4.2])
    C = S.C
    S.ambiente(camera_mira=(0.2, 0, 0.6), ortho=15.0)

    # Passo 1: le linee guida entrano una alla volta, poi diventano i binari della generazione.
    guide = []
    for k, (nome, y) in enumerate((("brand", 1.5), ("prodotti", 0.0), ("personas", -1.5))):
        g = S.scatola(f"Guida_{nome}", (1.3, 1.0, 0.16), (-6.6, y, 0.08), C["bianco"], emis=0.15, smusso=0.05)
        S.compare(g, S.p(1, 0.05 + k * 0.15), S.p(1, 0.2 + k * 0.15))
        guide.append(g)
        S.ancora(nome, g, (0, 0, 0.25))
    create = S.scatola("Create", (1.8, 2.6, 0.16), (-3.8, 0, 0.08), C["marchio"], emis=0.2, smusso=0.05)
    S.compare(create, S.p(1, 0.55), S.p(1, 0.7))
    S.ancora("create", create, (0, -1.6, 0))
    for k, g in enumerate(guide):
        f0 = S.p(1, 0.6 + k * 0.08)
        S.gettone(f"Regola{k}", [tuple(g.location) , (-5.2, g.location.y * 0.4, 0.9), (-3.8, 0, 0.3)], f0, f0 + 14, C["bianco"], r=0.1)
    binari = [S.filo(f"Binario{k}", (-2.8, y, 0.06), (4.2, y, 0.06), S.p(1, 0.75), S.p(1, 0.98), C["verde"], spessore=0.07, emis=1.5)
              for k, y in enumerate((1.0, -1.0))]
    S.ancora("binari", binari[1], (5.6, -0.2, 0))

    # Passo 2: un brief entra in Create; escono quattro varianti, dentro i binari.
    S.gettone("Brief", [(-3.8, -3.4, 0.6), (-3.8, -1.8, 1.4), (-3.8, 0, 0.4)], S.p(2, 0.0), S.p(2, 0.25), C["bianco"], r=0.16)
    xs = [-1.6, 0.0, 1.6, 3.2]
    var = []
    for k, x in enumerate(xs):
        v = S.scatola(f"Variante{k}", (1.0, 0.14, 1.4), (-3.8, 0, 0.85), C["bianco"], emis=0.25, smusso=0.04)
        f0 = S.p(2, 0.3 + k * 0.12)
        S.compare(v, f0, f0 + 4)
        S.percorso(v, f0, f0 + 16, [(-3.8, 0, 0.85), (x, 0, 0.85)], arco=0.5)
        var.append(v)
        S.ancora(f"variante{k}", v, (0, 0, 0.9))

    # Passo 3: il content check passa su ognuna. Due non passano: restano, grigie, di lato.
    porta = S.scatola("Controllo", (0.1, 2.4, 2.2), (-2.6, 0, 1.1), C["verde"], emis=1.4, alpha=0.5, smusso=0.02)
    S.compare(porta, S.p(3, 0.0), S.p(3, 0.08))
    S.sposta(porta, S.p(3, 0.08), S.p(3, 0.75), (4.2, 0, 1.1))
    S.scompare(porta, S.p(3, 0.8), S.p(3, 0.9))
    S.ancora("controllo", porta, (0, 0, 1.3))
    spunte = {}
    for k, x in enumerate(xs):
        f = S.p(3, 0.08 + (x + 2.6) / 6.8 * 0.67)
        if k in (1, 2):
            S.vira(var[k], f, f + 5, C["bianco"], C["grigio"], emis=(0.25, 0.0), alpha=(1.0, 0.55))
            S.sposta(var[k], f + 5, f + 18, (x, 1.9, 0.85))
        else:
            sp = S.sfera(f"Spunta{k}", 0.14, (x, 0, 1.85), C["verde"], emis=3.0)
            S.compare(sp, f + 2, f + 7)
            spunte[k] = sp

    # Passo 4: la variante 1 si corregge e si ricontrolla; la 2 resta da rivedere.
    S.vira(var[1], S.p(4, 0.1), S.p(4, 0.3), C["grigio"], C["bianco"], emis=(0.0, 0.25), alpha=(0.55, 1.0))
    S.sposta(var[1], S.p(4, 0.3), S.p(4, 0.6), (xs[1], 0, 0.85))
    sp = S.sfera("Spunta1", 0.14, (xs[1], 0, 1.85), C["verde"], emis=3.0)
    S.compare(sp, S.p(4, 0.7), S.p(4, 0.8))
    spunte[1] = sp

    # Passo 5: revisione e approvazione. Due persone (creativi, legale) e un varco.
    rev = [S.pedina(f"Revisore{k}", (5.2, y, 0), C["grigio"]) for k, y in enumerate((1.5, -1.5))]
    for k, r in enumerate(rev):
        S.compare(r, S.p(5, 0.0 + k * 0.08), S.p(5, 0.12 + k * 0.08))
    S.ancora("revisori", rev[0], (0, 0, 1.5))
    for j, k in enumerate((0, 1, 3)):
        f = S.p(5, 0.35 + j * 0.18)
        S.vira(var[k], f, f + 6, C["bianco"], C["verde"], emis=(0.25, 0.9))
        S.scompare(spunte[k], f, f + 6)

    # Passo 6: Activate. Le approvate arrivano al canale a pagamento, ma SPENTE.
    canale = S.scatola("Canale", (0.2, 3.0, 2.0), (7.8, 0, 1.0), C["grigio"], rough=0.4)
    S.compare(canale, S.p(6, 0.0), S.p(6, 0.12))
    S.ancora("canale", canale, (0, 0, 1.25))
    arrivi = {0: (7.2, -0.9, 0.85), 1: (7.2, 0.0, 0.85), 3: (7.2, 0.9, 0.85)}
    for j, (k, dest) in enumerate(arrivi.items()):
        f0 = S.p(6, 0.15 + j * 0.15)
        S.chiave(var[k], f0, loc=tuple(var[k].location))
        S.percorso(var[k], f0, f0 + 22, [(xs[k], 0, 0.85), (5.6, (dest[1]) * 0.5, 2.2), dest], arco=0.3)
        S.vira(var[k], f0 + 18, f0 + 24, C["verde"], C["verde"], emis=(0.9, 0.0), alpha=(1.0, 0.35))
    S.ancora("spente", var[3], (0, 0, 0.9))
    S.inquadra(S.p(6, 0.0), ortho=15.0)
    S.inquadra(S.p(6, 0.35), mira=(1.6, -0.4, 0.6), ortho=16.5)

    # Passo 7: il gestore del canale le accende; Insights legge il rendimento per
    # attributo e il risultato torna a Create, per la variante successiva.
    for k in arrivi:
        S.vira(var[k], S.p(7, 0.05), S.p(7, 0.18), C["verde"], C["verde"], emis=(0.0, 0.9), alpha=(0.35, 1.0))
    barre = []
    for j, (h, col) in enumerate(((1.6, C["verde"]), (0.7, C["bianco"]), (1.1, C["bianco"]))):
        b = S.scatola(f"Attributo{j}", (0.6, 0.6, h), (5.4 + j * 0.9, -3.0, h / 2), col, emis=0.3 if j == 0 else 0.15, smusso=0.04)
        # La base all'origine, così la barra cresce dal pavimento verso l'alto.
        b.data.transform(Matrix.Translation((0, 0, h / 2)))
        b.location = (5.4 + j * 0.9, -3.0, 0)
        f0 = S.p(7, 0.25 + j * 0.06)
        S.chiave(b, 0, scala=0.0001)          # prima del passo non esiste, nemmeno piatta
        S.chiave(b, f0 - 1, scala=0.0001)
        S.chiave(b, f0, scala=(1, 1, 0.0001))
        S.chiave(b, S.p(7, 0.45 + j * 0.06), scala=(1, 1, 1))
        barre.append(b)
        S.ancora(f"attributo{j}", b, (0, 0, h + 0.25))
    S.gettone("Ritorno", [(5.4, -3.0, 2.0), (2.0, -3.2, 1.2), (-3.8, -2.0, 0.6), (-3.8, 0, 0.4)],
              S.p(7, 0.6), S.p(7, 0.92), C["verde"], r=0.16)
    S.vira(create, S.p(7, 0.9), S.p(7, 0.95), C["marchio"], C["verde"], emis=(0.2, 1.2))
    S.vira(create, S.p(7, 0.96), S.p(7, 1.0), C["verde"], C["marchio"], emis=(1.2, 0.2))
    return S


SCENE = {"rta": scena_rta, "decisioning": scena_decisioning, "cja": scena_cja, "genstudio": scena_genstudio}
