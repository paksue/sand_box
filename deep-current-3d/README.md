# Deep Current — Cinematic 3D Rebuild

Version 0.5.0 • TypeScript / React / Three.js / Vite.

**Why rebuilt:** v0.4.1 used a two-dimensional Canvas scene and lacked true pitch and mast controls. This rebuild uses actual 3D geometry, GPU water waves, animated ships/wakes, camera yaw and pitch, optical zoom, and separately controlled mast raising and submarine depth. One cinematic presentation; no retro/3D modes.

## Run

```bash
npm install
npm run build
npm run dev
```

## Gameplay

1. Begin Patrol → choose a mission → Launch.
2. Drag across the periscope view to aim horizontally AND vertically; mouse wheel or zoom buttons change magnification.
3. Use RAISE / LOWER to operate the periscope mast. Use DIVE / RISE to change the submarine's physical depth.
4. Set heading/speed. Use SONAR or MAP to find a convoy. Return to SCOPE to target.
5. Set gyro or press COMPUTE LEAD, choose a tube, and FIRE; the ship and torpedo travel independently in 3D.
6. Dive deep, reduce speed and evade destroyer escorts after the attack.

## Controls

Drag = periscope yaw/pitch; mouse wheel = zoom; arrow keys = yaw/pitch; Q/E = zoom; R/F = mast up/down; W/S = speed; A/D = ship heading; Z/X = submarine depth; Space = launch torpedo; 1/2/3 = Scope/Map/Sonar; Escape = pause. Touch and mouse controls are supported; the page should never trap vertical scrolling outside the periscope viewport.

## Architecture

- `src/simulation.ts`: deterministic core and torpedo/escort state (no Three or React imports).
- `src/three-world.ts`: WebGL scene, real procedural ship meshes, animated water, wakes, sky, optical camera.
- `src/main.tsx`: React game stations, input actions and HUD. Simulation ticks at 30Hz, render at frame refresh.
- `src/style.css`: Cinematic A design tokens; responsive HUD.
- `tests/*`: simulation and interface smoke validation.

## Quality gates

A passed build alone is **not** a visual approval. Release requires observed 3D movement, real yaw/pitch, visible raise/lower transition, working torpedo collision, and mobile/browser tests. Current 3D geometry is original procedural prototype art—not a claim of historically exact ship modeling. Cinematic visual direction remains authoritative.
