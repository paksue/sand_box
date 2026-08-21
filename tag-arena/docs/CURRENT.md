# Tag Arena — Current State

## Phase
Production-stack migration: **verified**. The previously verified Phase 1 behavior is preserved on the typed PixiJS production architecture.

## Active branch
`agent/tag-arena-production-stack`

## Production stack
- TypeScript 7.0.2 in strict mode
- PixiJS 8.20.0 with WebGL preference
- Vite 8.2.2
- Vitest 4.1.10
- Playwright 1.62.1
- custom deterministic 60 Hz simulation
- committed `package-lock.json`; CI uses `npm ci`

## Production boundaries
- `src/sim/` owns gameplay state and deterministic rules.
- `src/render/` is a read-only Pixi view of serialized state.
- `src/input/` translates physical controls to typed intent.
- `src/runtime/` is the only production composition layer connecting input, fixed-step simulation, and rendering.
- `src/debug/` exposes the public runtime surface for browser automation.
- the obsolete legacy browser controller and old browser harness have been removed.

## Temporary migration oracle
`src/simulation.js` and `src/rng.js` remain temporarily as the untouched Phase 1 behavior oracle. Vitest runs identical seeds, scenarios, inputs, and tick counts through legacy JavaScript and the new TypeScript simulation and compares complete serialized state and event output.

Do not add features to the oracle files. New development targets `src/sim/` only.

## Verification
The production pipeline proves:
- strict TypeScript typecheck passes;
- 6 native TypeScript gameplay regression tests pass;
- 7 legacy-vs-TypeScript equivalence tests pass;
- 4 architecture-boundary tests pass;
- Vite production build succeeds;
- Chromium boots the TypeScript entry and `pixi-v8-webgl` renderer;
- exactly one Pixi canvas is present and the legacy controller is absent;
- zero browser console errors;
- all previously verified deterministic movement, collision, timing, pause, momentum, and arena-boundary measurements remain unchanged.

### Inspected browser evidence
Run #67 produced a JSON report and screenshot that were downloaded and inspected. The report confirmed debug bridge version 4, `pixi-v8-webgl`, the expected deterministic numeric measurements, and zero console errors. The screenshot visibly showed the expected paused interaction frame and telemetry.

### Locked workflow
Run #72 passed the same complete pipeline using the committed dependency lock, read-only GitHub contents permission, npm 12.0.2 CLI, and `npm ci`.

## Exit criteria
Completed:
1. strict typing;
2. native TypeScript regression coverage;
3. legacy-vs-TypeScript state/event equivalence;
4. production build;
5. real Pixi/WebGL Chromium verification;
6. unchanged deterministic behavior;
7. inspectable JSON/screenshot/build artifacts;
8. reproducible locked CI.

## Old experimental branch
`agent/tag-arena-phase2-grapple` predates this architecture and must not be merged. The next gameplay branch should start fresh from production `main` after this migration merges.

## Next phase
Create a fresh production-based branch for the first contextual close-contact wrestling interaction while keeping the same small control set.
