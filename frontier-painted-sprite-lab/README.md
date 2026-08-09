# Frontier Painted Sprite Lab

An isolated visual R&D project for one question:

> Can a reusable animated game object move clearly while still looking like it belongs inside a 19th-century painting?

This project does **not** import or modify `frontier-journey/`.

## Milestone 1: The Living Ox

The first runtime prototype contains only one hero subject: a transparent painterly ox pair derived from Rosa Bonheur's public-domain animal painting *A Pair of Oxen*. The visible animal remains raster-painted artwork throughout animation. It is not replaced with vector/geometric drawing and it is not frame-by-frame animation.

The temporary prairie environment uses Albert Bierstadt's public-domain *Emigrants Crossing the Plains / The Oregon Trail* (1869) as an art-direction reference.

## Production-shaped pipeline

Asset authoring and runtime are deliberately separated:

1. Source/audition public-domain painterly animal art offline.
2. Run high-quality background removal/matting once during authoring (`tools/build_candidates.py`).
3. Review candidates on a neutral checkerboard; reject weak silhouettes before animation.
4. Commit the selected transparent runtime asset to `assets/`.
5. The browser loads only that finished transparent asset.
6. PixiJS performs lightweight mesh deformation, atmosphere, shadow, dust and scene compositing.

Background removal is **not** performed in the player's browser. An earlier OpenCV/GrabCut experiment proved too slow and is intentionally abandoned.

## Technical direction

- PixiJS 8.19.0
- `MeshSimple` with an 11×7 deformable grid
- one continuous transparent raster-painted source texture
- 15 fps painterly pose cadence, 60 fps renderer/environment cadence
- broad low-amplitude deformation instead of rigid cardboard-part rotations
- contact shadow, atmospheric fade, warm scene tint, dust, shared canvas grain
- neutral and mesh debug views for judging the sprite independently of the background
- offline `rembg`/Pillow authoring workflow for candidate matting

PixiJS 8.19 was selected after consulting the official `https://pixijs.com/llms.txt` and related PixiJS AI/documentation resources. `MeshSimple` is being used specifically because the source artwork can remain a textured raster image while its vertex positions are updated dynamically.

## Quality gates

### Static gate
Pause at arbitrary points in the loop. The subject should continue to read as finished painted artwork rather than a puppet, vector object, or 3D overlay.

### Motion gate
The movement should attract attention through weight and silhouette without breaking the visual language of the environment.

### Neutral-background gate
Toggle to Neutral. If the sprite only looks acceptable because a busy painting hides defects, the prototype fails.

### Production-rig gate
This first asset was not painted for skeletal locomotion, so its motion is intentionally subtle. A convincing full draft-ox walk must ultimately use original painterly art authored for a Spine-style rig: transparent overlapping body parts, hidden shoulder/leg/neck paint, controlled draw order, and deformable meshes.

## Why the first experiments were rejected

- **Procedural/vector ox:** technically animated but visually incompatible with the painting.
- **Hard polygon crop from an oil painting:** preserved paint texture but produced obvious angular background wedges around legs.
- **Runtime OpenCV GrabCut:** better conceptual matting but far too slow for an interactive web lab.

The current direction keeps the useful lesson—animate real painterly pixels—but moves expensive image preparation to authoring time.

## Historical image sources

- Rosa Bonheur, *A Pair of Oxen*, public-domain reproduction via Wikimedia Commons.
- Albert Bierstadt, *Emigrants Crossing the Plains / The Oregon Trail* (1869), public-domain reproduction via Wikimedia Commons.
