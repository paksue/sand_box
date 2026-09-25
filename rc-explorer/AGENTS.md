# Tiny Trails · RC Explorer agent map

## Mission
Build the best-feeling client-side 3D RC exploration game we can ship as a static browser application. It is about wandering, crawling, scale, atmosphere and discovery — never competitive racing.

## Source of truth
Read in order: `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/CURRENT.md`.

## Boundaries
- `src/car.js`: vehicle simulation and visual suspension.
- `src/world.js`: deterministic world geometry, terrain, surfaces and environmental art.
- `src/main.js`: runtime composition, input, camera, HUD and debug harness.
- DOM owns HUD/menus; WebGL owns the world.
- `window.__RC_EXPLORER__` is the automation contract.

## Non-negotiables
1. Client-only production runtime: no API server, database, auth, API key or cloud inference.
2. GitHub Pages deployment under `/sand_box/previews/rc-explorer/`.
3. Gameplay state does not live inside Three.js mesh transforms.
4. `?manual=1` allows deterministic browser-driven stepping.
5. Visual changes require a browser screenshot in CI.
6. Maintain a low-chrome HUD that protects the 3D playfield.
7. Prefer procedural/reused/instanced content over uncontrolled asset bloat.
8. No racing opponents or race-centric progression.
