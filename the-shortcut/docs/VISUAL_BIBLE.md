# Visual Bible

## North Star
“A lost 1993 Sierra CD-ROM adventure, beautifully remastered in 2026.”

Not pixel-art parody, photorealistic office simulator, generic low-poly indie office, SaaS dashboard with a 3D background, or CRT/VHS nostalgia filter.

## Default visual production architecture
Use a **hybrid 2.5D fixed-camera pipeline**.

The goal is authored-image quality first, realtime rendering second.

Preferred scene layers:
1. high-quality authored/painterly background plate;
2. optional depth/occlusion/foreground layers;
3. hidden/lightweight walk geometry and hotspot anchors;
4. realtime Daniel/NPC characters;
5. realtime hero props only where interaction benefits;
6. realtime atmosphere/FX such as rain, monitor glow, light transitions;
7. DOM UI.

Do not force every wall, desk, and decoration to remain fully realtime 3D if a fixed-camera rendered/art-directed plate produces a substantially better image.

## Camera
- fixed or semi-fixed three-quarter cinematic views;
- roughly 30–40° elevation as a starting language;
- natural perspective rather than extreme isometric flattening;
- restrained 35–50mm-equivalent lens feel;
- camera movement only for staging, transitions, or emotional emphasis.

## Composition doctrine
Every authored view needs foreground framing, a readable player/NPC action plane, architectural depth, one dominant focal hierarchy, clear traversable space, and important interactables that read without glowing like loot.

The environment dominates the frame; characters remain readable but not oversized.

## Art language
Painterly, authored, storybook-like scene treatment supported by controlled geometry where useful. Favor coherent lighting, material language, silhouette, texture, and composition over polygon count.

## Art-generation workflow
1. Build a KQ III–VI reference board.
2. Generate multiple concept directions.
3. Select one approved visual North Star.
4. Lock camera and room composition.
5. Produce a structural scene source:
   - Blender if available/appropriate, or
   - browser/Three.js blockout plus explicit layout data if Blender is unavailable.
6. Render/export a clean structural image.
7. Refine toward the approved painterly target with controlled image editing/generation.
8. Compare with North Star and KQ reference board.
9. Reject drift.
10. Export final scene layers plus masks/anchors needed by runtime.

AI image generation is an art-direction/refinement tool, not permission to regenerate every scene independently from text.

## Blender lane
Blender is optional but valuable for:
- consistent perspective;
- repeated camera views;
- exact architecture;
- character scale;
- lighting variants;
- depth and occlusion;
- spatial anchors;
- reusable structural exports.

Blender is **not required for Milestones 01–03** and must not block web Astra work. If used later, its outputs are production assets/specifications consumed by the browser game.

## Time-of-day palette
Morning: warm ivory, muted teal, rain-softened gold.
Midday: cooler corporate whites, glass blues.
Afternoon: longer shadows, warmer edges.
After-hours: deep navy, isolated fluorescents, monitor pools, reflective rain.

## Hero scene
The developer bullpen is the visual benchmark and must reach near-final quality before style propagates. Required: rain/window depth; Daniel/Sarah/Kevin readable; Sarah's workstation identifiable but not screaming “quest item”; warm/cool contrast; uncluttered navigation; foreground silhouette framing; lived-in detail without random AI clutter.

## UI
Normal exploration shows almost no chrome: compact time/status only if needed, transient interaction prompt, dialogue only during dialogue, inventory/journal on demand. Computer mode is deliberately full-screen and convincing.

## Character consistency
Approve shared-style character sheets before final character production: front, profile, 3/4, clothing/material palette, silhouette, facial/pose language. Reuse approved references; do not independently regenerate characters from text for each scene.

## Visual QA
Compare focal point, character scale, depth separation, color hierarchy, path readability, interactives, clutter, HUD obstruction, and emotional time-of-day read. A technically correct scene fails if it looks like a default asset pack.
