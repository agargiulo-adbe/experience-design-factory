---
target: La voce del Ministero (apps/mim-alfabeti)
total_score: 25
p0_count: 0
p1_count: 3
timestamp: 2026-09-08T17-42-25Z
slug: apps-mim-alfabeti
---
Method: dual-agent degraded — B (detector+audit+misure) completo; A (design review) stallato senza report → review visiva fatta dal coordinatore su 23 slide a 1920 + 1366/1280.

## Score 25/40 (Acceptable)
Visibilità 3 · Mondo reale 3 · Controllo 2 · Coerenza 3 · Prevenzione 3 · Riconoscimento 2 · Flessibilità 3 · Minimalismo 2 · Recupero 2 · Aiuto 2

## Anti-pattern
Template fatigue: 8 slide "titolo-solo" su backdrop (35% del deck), 8 slide "eyebrow + titolo + 3 card bianche identiche", 3 slide "5 righe card", 0 grafici, 0 immagini figurative. Una sola slide con UI vera (storia/slide-evolve). Detector: solo overused-font Inter. audit:deck 0 HARD IT+EN (37/34 soft a/i).

## Priority
- [P1] Contrasto righe fonti su navy: .alf-src 2.48:1 (storia/slide-notte), 3.79 cover, 4.25 domanda/processes (global.css:339 flippa solo i link).
- [P1] 1366×768 (laptop DG, non coperto dall'audit): 6 slide scrollano (journeys +110px, evolve +131px, metrics +109px, processes/procurement/route +13–18px).
- [P1] Peso immagini: ~1 MB di webp per route (navy-1 609 KB), backdrop via CSS var senza preload, LCP ~1.3 s locale.
- [P2] storia/slide-evolve etichette stato 12.96px (<0.75rem).
- [P2] aria-label toggle "Language" fisso EN; axe: nessun landmark (region).
- [P2] Numeri chiave (234.576 / 665.000 / 41.901 / 26,9%) resi come testo o stat tile, mai come grafico.

## Evolution brief (rank)
1 Tre slide-firma con data viz reale · 2 Giulia come spina dorsale + journey interattiva · 3 Simulatore "la voce" (processo×ruolo×regione → journey+KPI) · 4 Dieta card-grid + cover con contenuto (−7 slide) · 5 Identità PA (Designers Italia) senza carta-crema, navy default · 6 Video Firefly (ora funzionante) su 3 slide + dieta immagini · 7 Presenter tooling (cut DG, note, timer) · 8 Modalità leggibilità + a11y PA · 9 Fix 1366 · 10 Ordine narrativo (cold open Giulia)
