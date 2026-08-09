# Frontier Painted Sprite Lab

An isolated visual R&D project for one question:

> Can a reusable animated game object move clearly while still looking like it belongs inside a 19th-century painting?

This project does **not** import or modify `frontier-journey/`.

## Milestone 1: The Living Ox

The first runtime prototype contains one hero subject: a transparent painterly ox derived from Rosa Bonheur's public-domain animal painting *A Pair of Oxen*. The visible animal remains raster-painted artwork throughout animation. It is not replaced with vector/geometric drawing and it is not frame-by-frame animation.

The temporary prairie environment uses Albert Bierstadt's public-domain *Emigrants Crossing the Plains / The Oregon Trail* (1869) as an art-direction reference.

## Milestone 2: Weighted two-ox rig test

`rig-test.html` keeps the same painterly source pixels but tests the production rig architecture recommended for a final game sprite:

- one game-level `OxTeam` entity;
- two independently animated oxen;
- separate gait phases so the animals do not look cloned;
- denser 17×11 deformable meshes per animal;
- bone-like weighted regions for head/neck, torso, shoulder, hip, foreleg and hindleg motion;
- planted-hoof damping during stance;
- shoulder/hip compression for perceived weight;
- 15 fps painterly pose cadence over a normal 60 fps renderer/environment loop;
- Scene, Neutral and Skeleton inspection modes;
- an instant Whole-mesh baseline for comparison.

This is intentionally a **Spine-style architecture test**, not a redistribution of the proprietary Spine runtime. The official `spine-pixi-v8` runtime supports PixiJS 8.16+ and WebGL/WebGPU, but production use requires the appropriate Spine license and the Spine trial cannot save/export projects. If the weighted test wins visually, the production handoff is to reproduce the proven bone/mesh structure in Spine Professional with real weighted meshes, IK hoof targets and purpose-painted layered artwork.

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
- `MeshSimple` deformable raster meshes
- painterly pose cadence at 15 fps, renderer/environment at 60 fps
- no geometric replacement art
- contact shadow, atmospheric fade, warm scene tint, dust, shared canvas grain
- neutral and debug views for judging the sprite independently of the background
- offline `rembg`/Pillow authoring workflow for candidate matting

PixiJS 8.19 was selected after consulting the official `https://pixijs.com/llms.txt` and related PixiJS AI/documentation resources. `MeshSimple` is useful here because the source artwork can remain a textured raster image while its vertex positions are updated dynamically.

## Quality gates

### Static gate
Pause at arbitrary points in the loop. The subject should continue to read as finished painted artwork rather than a puppet, vector object, or 3D overlay.

### Motion gate
The movement should attract attention through weight and silhouette without breaking the visual language of the environment.

### Neutral-background gate
Toggle to Neutral. If the sprite only looks acceptable because a busy painting hides defects, the prototype fails.

### Rig gate
Compare Weighted rig with Whole mesh. The extra rig complexity is justified only if the animal gains believable weight, stance and independent motion without losing painterly integrity.

### Production-rig gate
The current public-domain source was not painted for skeletal locomotion, so motion remains restrained. A convincing full draft-ox walk ultimately requires original painterly art authored for a Spine-style rig: transparent overlapping body parts, hidden shoulder/leg/neck paint, controlled draw order, weighted meshes, and a few alternate painted attachments for extreme poses.

## Why earlier experiments were rejected

- **Procedural/vector ox:** technically animated but visually incompatible with the painting.
- **Hard polygon crop from an oil painting:** preserved paint texture but produced obvious angular background wedges around legs.
- **Runtime OpenCV GrabCut:** better conceptual matting but far too slow for an interactive web lab.

The current direction keeps the useful lesson—animate real painterly pixels—but moves expensive image preparation to authoring time and tests increasingly production-like rigging without touching the real game.

## Historical image sources

- Rosa Bonheur, *A Pair of Oxen*, public-domain reproduction via Wikimedia Commons.
- Albert Bierstadt, *Emigrants Crossing the Plains / The Oregon Trail* (1869), public-domain reproduction via Wikimedia Commons.
