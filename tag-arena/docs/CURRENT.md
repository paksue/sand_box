# Tag Arena — Current State

## Phase
Production-stack migration: Phase 1 gameplay preserved, verification pending.

## Active branch
`agent/tag-arena-production-stack`

## Verified gameplay foundation
- Phase -1 AI harness is merged to `main`.
- Phase 0 movement, collision, strike, hitstun/knockback, and rope rebound are merged to `main`.
- Phase 1 deterministic startup, impact, three-tick hit-stop, recovery, and resumed knockback are merged to `main`.

## Migration goal
Replace the minimal browser-native harness runtime with the production architecture before adding grapples or tags, without changing any verified gameplay outcome.

## Production stack
- TypeScript 7.0.2, strict mode
- PixiJS 8.20.0, WebGL rendering preference
- Vite 8.2.2
- Vitest 4.1.10
- Playwright 1.62.1
- deterministic custom 60 Hz simulation; no general-purpose physics engine or ECS

## Production boundaries
- `src/sim/` owns all gameplay truth and has no browser/Pixi/wall-clock dependency.
- `src/render/` is a read-only Pixi view over serialized `GameState`.
- `src/input/` translates physical controls into typed input intent.
- `src/runtime/` is the only production layer that connects input, fixed-step simulation, and rendering.
- `src/debug/` exposes the public simulation/runtime surface to Chromium automation.

## Temporary migration oracle
`src/simulation.js` and `src/rng.js` are the verified Phase-1 legacy simulation and are retained temporarily only so Vitest can compare the new TypeScript simulation against them.

Do not add features to those legacy files. New gameplay work targets `src/sim/` only after equivalence passes.

## Migration exit criteria
1. strict TypeScript typecheck passes;
2. native TypeScript gameplay regression tests pass;
3. legacy-vs-TypeScript seeded state and event equivalence passes for movement, collision, attack timing, hit-stop, and ropes;
4. Vite production build succeeds;
5. Chromium boots the TypeScript entry and PixiJS WebGL path, not legacy `app.js`;
6. browser measurements remain identical to verified Phase 1 values;
7. CI uploads JSON, screenshot, built bundle, and a generated lockfile;
8. generated `package-lock.json` is committed and CI switches to `npm ci` before merge.

## Frozen feature work
The experimental `agent/tag-arena-phase2-grapple` branch is not part of this migration and must not be merged on top of `main` until the production stack is verified.

## Next phase after migration
Return to contextual close-contact grapple/throw using the existing Attack action, implemented only on the typed production architecture.
