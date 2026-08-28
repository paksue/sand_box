# Visual Fidelity Loop

The project is optimized by comparing the rendered scene against the original physical tabletop reference, not by judging code quality alone.

## Golden target

The target is the original physical tabletop photo from the project conversation: weathered individual stone slabs, dark irregular seams, dense moss/grass transitions, sculpted classical columns, a lichen-like miniature tree with visible trunk/roots, dimensional soil/rubble, painted miniature scale, and photographic material response.

The reference is intentionally treated as a *visual target*, not as a pixel-perfect image target. Camera, background, and characters can differ; material realism and tabletop-scale cues are the score that matters.

## Automated capture

Every relevant push runs `.github/workflows/dnd-miniature-visual-capture.yml`.

It serves the exact checked-out commit locally and captures two images:

1. `terrain-square.png` — 700x700, UI hidden with `?visualCapture=1`. This is the deterministic fidelity-review frame.
2. `mobile-ui.png` — 430x932 with the real UI visible. This catches mobile composition/UI regressions.

Both are uploaded as the `dnd-miniature-visual-capture` workflow artifact.

## Agent review rubric

For each iteration, compare the new `terrain-square.png` with the golden reference and score these categories from 0–5:

| Category | What 5/5 means |
| --- | --- |
| Stone geometry | slabs look individually cast/chipped, not rounded UI tiles |
| Stone material | porous, speckled, stained, rough, irregular color and edge wear |
| Ground integration | moss, dirt, grass, gravel and rubble naturally bridge tile/soil boundaries |
| Tree silhouette | irregular natural miniature-tree silhouette; no geometric/poly-ball read |
| Tree surface | trunk/roots/foliage read as physical hobby materials at close range |
| Columns/ruins | sculpted fluting/capitals, chips, age, grime and broken forms |
| Scale cues | terrain immediately reads as a photographed tabletop miniature set |
| Lighting | warm photographic light, contact shadows, useful contrast, no flat CG feel |
| Composition | scene framing resembles the reference enough to make comparison meaningful |
| Mobile UI | controls remain usable without obscuring the scene |

## Loop procedure

1. **Capture baseline** from the exact commit.
2. **Compare visually** against the golden reference.
3. **Write the gap list**, ordered by perceptual impact, not implementation difficulty.
4. **Pick one or two dominant gaps only**. Avoid changing everything at once.
5. **Implement** the smallest change capable of moving those rubric scores.
6. **Deploy/commit**.
7. **Capture again automatically**.
8. **Compare before/after and reference**.
9. **Keep, revise, or revert** based on visible improvement.
10. Repeat until no category is below 4/5, then switch from procedural geometry to authored/CC0 GLB assets wherever procedural modeling is the limiting factor.

## Engineering rules

- No low-poly placeholder is allowed to become the visual target.
- Do not call an iteration better merely because it has more geometry.
- If a procedural object visibly reads as procedural, replace it with an authored asset or a materially better technique.
- Preserve a deterministic capture camera so comparisons remain meaningful.
- Mobile usability and scene fidelity are tested separately.
- Automated numerical pixel differences are not treated as the quality score; the source photograph and visual rubric are authoritative.

## Current priority order

1. Stone slabs and seams
2. Tree foliage/trunk/roots
3. Ground scatter and moss transitions
4. Column sculpt/detail/weathering
5. Lighting/contact shadows
6. Add high-fidelity miniature GLBs
7. Only then add game mechanics
