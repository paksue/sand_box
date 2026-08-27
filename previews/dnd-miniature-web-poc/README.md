# Miniature Tabletop Renderer — visual-fidelity POC

The first milestone proves only this: **the browser can render high-detail fantasy miniatures with a physical-tabletop look**.

No combat rules, multiplayer, character sheets, pathfinding, AI, map editor, or inventory yet.

## Why this POC is deliberately simple

The visual target is dominated by **asset quality**, not game logic. So this prototype does not create character geometry in JavaScript. It loads the real sculpted/textured GLB mesh and renders it with physically based lighting.

The included board/ruins are only a neutral tabletop stage. The characters you import are never replaced by procedural low-poly stand-ins.

## Stack

- plain Three.js / WebGL
- GLB / glTF 2.0 runtime assets
- GLTFLoader
- Draco + Meshopt decode support
- PBR materials
- ACES filmic tone mapping
- environment lighting
- high-resolution dynamic shadows
- DOM UI around the WebGL playfield

There is **no npm install and no build step** for this POC.

## Run

From this folder:

```bash
python -m http.server 8000
```

On Windows, if `python` is not the command:

```bash
py -m http.server 8000
```

Then open:

`http://localhost:8000`

The page loads Three.js modules from jsDelivr, so the browser needs internet access for the library files.

## Use

1. Click **Import GLB**, or drag a `.glb` file onto the page.
2. Import up to 8 miniatures/props.
3. Use **Tabletop**, **Miniature eye**, and **Top** camera presets.
4. Drag/orbit and zoom to inspect material and sculpt quality.

The HUD reports triangle count, material count, and file size for each imported asset.

## Fidelity target

For a hero miniature close to the supplied D&D tabletop reference, start around:

- 50K–300K triangles for the hero in the desktop POC
- 2K–4K base-color/albedo
- normal map
- roughness and metallic where appropriate
- baked/sculpted fine detail
- embedded textures inside GLB for the easiest import path
- physically meaningful scale/origin after the Blender cleanup pass

A 5K-triangle low-poly knight will still look low-poly no matter how sophisticated the renderer is.

For this first proof, **do not optimize away quality yet**. Once the target look is proven, optimize without visibly changing it.

## Candidate high-quality source assets found during research

- Sketchfab has downloadable medieval/fantasy knights around 50K and 118K triangles under CC Attribution.
- AIPRINTGEN has a fantasy NPC knight described as PBR/game-ready, with an approximately 40 MB full-quality version.
- Marco Brito's free hero knight on itch.io includes detailed armor, cape/leather, PBR materials/textures, and Blender + FBX source.

Check the exact license for every asset before shipping a public/commercial game.

## Production asset pipeline after the visual target is approved

1. Sculpt/model or source in Blender/other DCC.
2. Clean topology, UVs, transforms, origin, names and materials.
3. Export GLB/glTF 2.0.
4. Validate in this viewer.
5. Optimize with glTF Transform.
6. Prefer Meshopt geometry compression.
7. Add KTX2/Basis texture compression.
8. Add LODs only where needed.
9. Keep a high-fidelity hero LOD for close-up/character perspective.

## Next milestone

Only after one hero + several props meet the visual bar:

- rigged character animation playback
- click/select miniature
- move to board square
- miniature-eye/over-shoulder controlled camera
- asset manifest and scene loading
- one authored encounter

That keeps us from building a whole game around visuals we do not actually like.
