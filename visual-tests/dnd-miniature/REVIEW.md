# D&D Miniature Visual Review Ledger

Golden target: the original physical tabletop photograph supplied for this project.

The scores below are visual design scores, 0–5. They are not code-quality scores and they are not pixel-diff scores.

## Loop 1 — pre-visual-loop baseline

Capture: `visual-tests/dnd-miniature/latest/terrain-square.png` from the first automated capture.

| Category | Score | Observation |
| --- | ---: | --- |
| Stone geometry | 1.5 | Rounded, regular slabs read like UI tiles rather than cast dungeon stones. |
| Stone material | 1.0 | Flat beige/gray; little visible pore, stain, aggregate, or edge wear. |
| Ground integration | 1.0 | Sparse grass/moss; board and dirt read as separate layers. |
| Tree silhouette | 0.5 | Alpha-card canopy effectively disappeared in deterministic capture. |
| Tree surface | 0.5 | Bare procedural trunk/branches dominated the read. |
| Columns/ruins | 2.0 | Recognizable but too clean and simplified. |
| Scale cues | 1.5 | Reads as CG board more than a photographed hobby diorama. |
| Lighting | 2.0 | Functional, but flat/dark compared with the warm physical reference. |
| Composition | 2.0 | Board angle is usable, but background and visual weight differ strongly. |
| Mobile UI | 4.0 | Compact enough after the mobile HUD pass. |

Dominant failures chosen for the next iteration: **stone geometry** and **tree/ground density**.

## Loop 2 — opaque 3D foliage + irregular slabs

Implementation changes:

- Replaced rounded-box tiles with irregular beveled extruded slab outlines.
- Added explicit surface crack geometry.
- Replaced transparent tree foliage cards with opaque high-detail 3D canopy clusters.
- Added a curved trunk, branches and exposed roots.
- Added instanced moss, static-grass blades and rubble.
- Added a wooden tabletop and warm DM-screen-like backdrop.
- Kept the original GLB import/game interaction layer intact.

| Category | Score | Observation |
| --- | ---: | --- |
| Stone geometry | 2.6 | Better outline and spacing; still too planar and uniformly manufactured. |
| Stone material | 1.8 | More variation, but texture/bump does not yet read strongly at the capture distance. |
| Ground integration | 2.2 | Moss/rubble now survives capture and edges are busier; still much less dense than the reference. |
| Tree silhouette | 3.0 | Canopy is reliably present and roughly the correct mass. |
| Tree surface | 1.7 | Main remaining flaw: canopy reads as faceted rock instead of fibrous hobby lichen. |
| Columns/ruins | 2.3 | Fluting/stacked forms are clearer, but weathering and sculpt detail remain weak. |
| Scale cues | 2.2 | Wood table, scatter and backdrop help, but lack of painted miniatures hurts the physical-table read. |
| Lighting | 2.4 | Warmer and brighter, but materials are still too CG-flat. |
| Composition | 2.8 | More comparable to the reference; tree and columns occupy similar zones. |
| Mobile UI | 4.0 | Remains usable and non-dominant. |

## Next ranked changes

1. **Tree surface / silhouette** — replace faceted polyhedron clusters with smoothly deformed high-segment geometry plus many tiny opaque lichen nodules/tendrils. The result must read as hobby foliage, not rocks.
2. **Stone material / micro-relief** — add stronger large-scale mottling, pits, stains, edge chips and top-surface relief that remain visible at a 700 px capture.
3. **Ground integration** — thicken edge flock, seam moss, dry grass and mixed-size rubble until soil/stone boundaries are organically obscured.
4. **Columns** — add chips, grime accumulation, broken capitals and color variation.
5. **Scale cues** — embed at least one genuinely high-detail licensed miniature for deterministic captures; do not use a low-poly placeholder as the visual target.

## Stop/accept condition

Do not call the terrain visually successful until every terrain/material category is at least 4/5 in the same deterministic capture and the side-by-side comparison no longer has an obvious “physical miniature vs simple CG board” split.
