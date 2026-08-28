# D&D Miniature Tabletop — Visual Production Specification

Status: **locked target for the art spike**

## 1. Product image target

The target is **a photograph of a handcrafted 28–32 mm fantasy tabletop diorama**, not life-size architectural photorealism and not a conventional stylized video-game environment.

The visual language to preserve from the reference:

- hand-painted resin / foam / plaster terrain
- square worn stone paving with dark recessed joints
- visible dry-brushing, cavity washes, chips, stains, pores and tiny color variation
- static grass, flock, moss foam, gravel and hobby scatter merging the paving into the board edge
- model-tree construction: sculpted trunk/roots plus porous, fibrous lichen-like canopy
- painted classical ruin columns with grime in recesses, chipped edges and broken pieces
- round miniature bases, dice and small props as scale cues
- warm indoor tabletop illumination and tight contact shadows

The renderer must never solve art problems by adding arbitrary procedural polygons when a source asset/material belongs in the DCC/asset pipeline.

## 2. Benchmark scene

The acceptance scene is intentionally small and fixed:

- one 7×9-ish stone battle area
- one hero miniature on a round black base
- three enemy miniatures on round bases
- one large tree on a raised root/moss mound
- five to seven ruined classical columns, including at least one broken and one fallen element
- one die
- several small loose props / rubble pieces
- dense mixed perimeter flock/moss/gravel
- wooden tabletop visible around the board
- warm red/pink fantasy backdrop, defocused or visually secondary

## 3. Required cameras

### A. Tabletop reference camera

Purpose: answer **“does this read like the physical reference photograph?”**

- fixed position, FOV and target
- never changed during comparisons
- square 700×700 CI capture
- UI hidden

### B. Miniature-eye camera

Purpose: answer **“does the illusion survive from the character’s perspective?”**

- lens height approximately 28–40 mm in miniature scale
- sees tile sides, root undersides, column backs and the rear of characters
- fixed comparison shot

A scene that only works from the tabletop camera does **not** pass.

## 4. Art pipeline

Master assets are authored outside runtime code:

1. source scan / CC0 model / AI-assisted mesh / sculpt
2. DCC cleanup and art direction (Blender or equivalent)
3. topology / UV / scale validation
4. physically based material authoring
5. miniature-paint pass: edge dry-brush, cavity wash, painted variation, grime
6. GLB/glTF export
7. visual approval in beauty scene
8. web optimization only after approval

Runtime Three.js is responsible for loading, lighting, camera, interaction and effects — **not for sculpting the final terrain**.

## 5. PBR minimum

Important hero terrain surfaces use real source maps where available:

- base color / diffuse
- normal (OpenGL convention)
- roughness
- ambient occlusion or packed ARM where useful
- displacement/height for authoring or hero surfaces when justified

Color textures are sRGB. Data textures are non-color. Rough terrain remains highly matte; specular response is subdued.

## 6. Lighting benchmark

Raster target:

- photographic HDR environment / image-based lighting
- PMREM-filtered environment for PBR
- warm soft key light matching indoor tabletop photography
- tight contact occlusion / GTAO-class grounding
- soft but readable shadows
- ACES filmic tone mapping
- no gratuitous bloom

Beauty diagnostic:

- same approved scene can be tested with `three-gpu-pathtracer`
- path tracing is a diagnostic / beauty mode, not assumed to be the normal game renderer

Interpretation:

- if path trace and raster both look wrong → asset/material problem
- if path trace looks right but raster does not → image-formation / realtime-rendering problem

## 7. Asset-source policy for the spike

Prefer assets that are legally unambiguous and usable in a public/commercial prototype.

Initial source family: **Poly Haven CC0** for scanned PBR textures/models and HDRIs.

Candidate source assets:

- weathered square-pavement PBR set
- forest-ground / soil material
- moss / ground-cover model
- scanned root/stump model
- mossy rocks / rubble
- small studio or indoor HDRI

The art spike may temporarily leave columns or character models as placeholders if a high-fidelity legal source is not yet selected, but placeholders are visually labeled as blockers and are excluded from pass scoring.

## 8. Visual QA loop

Every art-spike change runs:

1. exact-commit local preview in CI
2. fixed tabletop screenshot
3. fixed miniature-eye screenshot
4. mobile layout screenshot (non-gating)
5. comparison against the clean reference
6. region-level review

Review regions:

- stone geometry
- stone surface/material
- grout/joints
- ground integration
- tree trunk/roots
- tree canopy
- columns/ruins
- miniatures/scale cues
- lighting/contact
- composition

A change is accepted because the **pixels improve**, not because the implementation is more sophisticated.

## 9. Acceptance rubric

0–5 human art-direction score per region.

A candidate is eligible to replace the current procedural scene only when:

- all non-placeholder terrain/material categories are **≥ 4.0 / 5**
- no category regresses by more than 0.25 relative to the prior accepted spike
- tabletop view reads as physical miniature terrain at first glance
- miniature-eye view does not expose obvious flat cards, floating scatter, giant texture scale, missing backsides or fake geometry
- CI capture succeeds deterministically

Optional perceptual metrics (LPIPS or equivalent) may be recorded as secondary signals, but they never override art-direction judgment.

## 10. Optimization gate

Do not optimize the beauty master before it passes.

After approval, derive the web version using a reproducible optimization pipeline:

- prune unused data
- deduplicate
- simplify where visually safe
- generate LODs
- Meshopt/Draco as appropriate
- KTX2/Basis texture compression
- texture-size budgets by asset importance
- draw-call and VRAM measurement

The optimized build must rerun the same screenshot gate and remain within the agreed visual regression threshold.

## 11. Current hypothesis

The current procedural scene has demonstrated that runtime geometry noise is not enough. The next spike is specifically testing whether **scan-quality PBR source material + real modeled organic assets + photographic lighting** produces the expected jump before more gameplay code is added.
