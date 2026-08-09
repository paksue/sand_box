# Frontier Painted Sprite Lab

An isolated visual R&D project for one question:

> Can a reusable animated game object move clearly while still looking like it belongs inside a 19th-century painting?

This project does **not** import or modify `frontier-journey/`.

## Milestone 1: The Living Ox

The first runtime prototype contains one transparent painterly sprite derived from Rosa Bonheur's public-domain animal painting *A Pair of Oxen*. The selected raster actually contains **two overlapping oxen**. The visible pixels remain raster-painted artwork throughout animation; they are not replaced with vector/geometric drawing and the runtime is not frame-by-frame animation.

The temporary prairie environment uses Albert Bierstadt's public-domain *Emigrants Crossing the Plains / The Oregon Trail* (1869) as an art-direction reference.

## Milestone 2: Weighted painted-pair rig test

`rig-test.html` keeps the exact same two-ox raster source and compares two animation architectures:

- **Whole mesh:** the original 11×7 broad deformation prototype.
- **Weighted rig:** one denser 19×13 mesh influenced by multiple virtual bone fields for the two visible heads, neck, torso, foreleg region and hindleg region.

The weighted prototype adds planted-hoof damping, shoulder/hip compression, differentiated head motion, and a 15 fps painterly pose cadence over the normal 60 fps renderer/environment loop. Scene, Neutral and Skeleton modes make the comparison inspectable.

This correction is important: the historical source is flattened and the rear ox is partly occluded by the foreground ox. Duplicating the whole image would create four oxen, not two independently rigged animals. Therefore this milestone does **not** claim to prove two separate skeletons. It proves whether Spine-style weighting improves deformation of a real painterly game sprite while preserving the original brushwork.

This is intentionally a **Spine-style architecture test**, not a redistribution of the proprietary Spine runtime. The official `spine-pixi-v8` runtime supports current PixiJS 8/WebGL/WebGPU workflows, but production use requires the appropriate Spine license and the Spine trial cannot save/export projects. If weighting wins visually, the production handoff is to recreate the proven structure in Spine Professional using purpose-painted layered art, real weighted meshes, IK hoof targets, controlled draw order, and selective alternate attachments.

## Production-shaped pipeline

Asset authoring and runtime are deliberately separated:

1. Source/audition painterly animal art offline.
2. Run high-quality background removal/matting once during authoring (`tools/build_candidates.py`).
3. Review candidates on a neutral background; reject weak silhouettes before animation.
4. Commit the selected transparent runtime asset to `assets/`.
5. The browser loads only that finished transparent asset.
6. PixiJS performs lightweight mesh deformation, atmosphere, shadow, dust and scene compositing.

Background removal is **not** performed in the player's browser. An earlier OpenCV/GrabCut experiment proved too slow and is intentionally abandoned.

## Technical direction

- PixiJS 8.19.0
- `MeshSimple` deformable raster meshes
- weighted virtual-bone fields for the Milestone 2 test
- painterly pose cadence at 15 fps, renderer/environment at 60 fps
- no geometric replacement art
- contact shadow, atmospheric fade, warm scene tint, dust, shared canvas grain
- neutral and debug views for judging the sprite independently of the background
- offline `rembg`/Pillow authoring workflow for candidate matting

PixiJS 8.19 was selected after consulting the official `https://pixijs.com/llms.txt` and related PixiJS documentation. `MeshSimple` is useful here because the source artwork can remain a textured raster image while its vertex positions are updated dynamically.

## Quality gates

### Static gate
Pause at arbitrary points in the loop. The subject should continue to read as finished painted artwork rather than a puppet, vector object, or 3D overlay.

### Motion gate
The movement should attract attention through weight and silhouette without breaking the visual language of the environment.

### Neutral-background gate
Toggle to Neutral. If the sprite only looks acceptable because a busy painting hides defects, the prototype fails.

### Rig gate
Compare Weighted rig with Whole mesh. The extra rig complexity is justified only if stance/weight improve without damaging painterly integrity.

### Production-rig gate
The current public-domain source was not painted for independent skeletal locomotion. A convincing full draft-ox team ultimately requires original painterly art authored as overlapping layers: each ox complete underneath occlusions, hidden shoulder/leg/neck paint, controlled draw order, weighted meshes, and a few alternate painted attachments for extreme poses.

## Why earlier experiments were rejected

- **Procedural/vector ox:** technically animated but visually incompatible with the painting.
- **Hard polygon crop from an oil painting:** preserved paint texture but produced obvious angular background wedges around legs.
- **Runtime OpenCV GrabCut:** better conceptual matting but far too slow for an interactive web lab.
- **Duplicating the approved two-ox sprite:** mechanically created two animated objects but visually created four oxen, so the experiment was rejected before merge.

The current direction keeps the useful lesson—animate real painterly pixels—while making each experiment honest about what its source artwork can actually support.

## Historical image sources

- Rosa Bonheur, *A Pair of Oxen*, public-domain reproduction via Wikimedia Commons.
- Albert Bierstadt, *Emigrants Crossing the Plains / The Oregon Trail* (1869), public-domain reproduction via Wikimedia Commons.
