# Frontier Painted Sprite Lab

An isolated visual R&D project for one question:

> Can a reusable animated game object move clearly while still looking like it belongs inside a 19th-century painting?

This project does **not** import or modify `frontier-journey/`.

## Milestone 1: The Living Ox

The first prototype deliberately contains only one hero subject: a painted ox. The ox is sampled from George Stubbs' public-domain oil painting *The Lincolnshire Ox* (1790), cropped as a raster texture, then deformed with a PixiJS mesh. It is not redrawn with geometric primitives and it is not frame-by-frame animation.

The prairie backdrop uses Albert Bierstadt's public-domain *Emigrants Crossing the Plains / The Oregon Trail* (1869) as a temporary environment reference.

## Technical direction

- PixiJS 8.19.0
- `MeshSimple` with a 9×6 deformable grid
- one continuous raster-painted source texture
- 15 fps pose cadence, 60 fps renderer/environment cadence
- broad mesh deformation instead of rigid cardboard-part rotations
- contact shadow, atmospheric fade, warm scene tint, dust, shared canvas grain
- neutral and mesh debug views for judging the asset independently of the background

PixiJS 8.19 was selected after consulting the official `https://pixijs.com/llms.txt` and `llms-medium.txt` documentation. The official PixiJS docs specifically describe `MeshSimple` as a dynamic mesh whose vertex buffer can be updated per frame, and PixiJS 8.19 includes the official AI-agent skills in its ecosystem.

## Quality gates

### Static gate
Pause at arbitrary points in the loop. The subject should continue to read as finished painted artwork rather than a puppet or vector object.

### Motion gate
The movement should attract attention through weight and silhouette without breaking the visual language of the environment.

### Scene integration gate
Toggle between Scene and Neutral. If the sprite only looks acceptable because the background hides defects, the prototype fails.

## Deliberate limitations

This is an engineering/art-pipeline proof, not final production art. The source painting was not authored for skeletal deformation, so it contains no hidden joint artwork and no clean alpha-separated limbs. If this prototype proves the mesh approach, the next step is to commission/create an original production-quality ox painted specifically for rigging, including hidden shoulder/leg/neck material and clean transparency.

## Historical image sources

- George Stubbs, *The Lincolnshire Ox* (1790), public-domain reproduction via Wikimedia Commons.
- Albert Bierstadt, *Emigrants Crossing the Plains / The Oregon Trail* (1869), public-domain reproduction via Wikimedia Commons.
