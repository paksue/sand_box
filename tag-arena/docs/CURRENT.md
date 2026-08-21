# Tag Arena — Current State

## Phase
Production architecture is verified. Post-migration cleanup is retiring the temporary legacy oracle so strict TypeScript becomes the only gameplay implementation.

## Active branch
`agent/tag-arena-retire-legacy-oracle`

## Production stack
- TypeScript 7.0.2 strict
- PixiJS 8.20.0 with WebGL preference
- Vite 8.2.2
- Vitest 4.1.10
- Playwright 1.62.1
- custom deterministic 60 Hz simulation
- committed dependency lock; CI uses `npm ci`

## Single source of truth
- gameplay state/rules: `src/sim/`
- rendering: `src/render/`
- input: `src/input/`
- fixed-step composition: `src/runtime/`
- browser/AI control: `src/debug/`

The temporary JavaScript simulation/RNG oracle and its equivalence test have been removed. The migration already proved complete serialized state/event equivalence before retirement. Native TypeScript regression tests and Chromium acceptance tests now protect behavior going forward.

## Verified production evidence
Migration PR #34 passed strict typing, native regressions, legacy equivalence, architecture checks, Vite production build, locked `npm ci`, and real Pixi/WebGL Chromium tests. Its inspected browser artifact reported debug bridge version 4, renderer `pixi-v8-webgl`, one canvas, zero console errors, and unchanged deterministic measurements.

The final migration head passed run #78 after obsolete browser paths were removed.

## Old experimental branch
`agent/tag-arena-phase2-grapple` predates the production architecture and must not be merged.

## Next phase
After this small cleanup passes and merges, create a fresh production-based branch for the first contextual close-contact wrestling interaction while preserving the small control set.
