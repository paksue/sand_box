# Tag Arena agent map

Read this file first, then follow the linked project documents. This file is intentionally short: it is a map, not the full project specification.

## Mission
Build a fast, deterministic, AI-legible browser tag-fighting game inspired by the immediacy of classic arena wrestling games without copying protected characters, names, art, or assets.

## Source of truth
- Product intent: `docs/PRODUCT.md`
- Architecture and boundaries: `docs/ARCHITECTURE.md`
- Current project state: `docs/CURRENT.md`

## Production path
- gameplay: `src/sim/` (strict TypeScript)
- rendering: `src/render/` (PixiJS view only)
- composition/fixed clock: `src/runtime/`
- physical input adapters: `src/input/`
- AI/browser control: `src/debug/`

There is one gameplay implementation: `src/sim/`. Do not create a second rules path inside rendering, input, or debug code.

## Non-negotiable engineering rules
1. Gameplay simulation must be deterministic for the same seed and input sequence.
2. Gameplay randomness must use the project seeded RNG; never `Math.random()` inside simulation code.
3. Pixi rendering consumes state/events and never owns gameplay rules or gameplay time.
4. Browser tests must inspect/control development state through `window.__TAG_ARENA__`.
5. Every new mechanic needs at least one executable acceptance scenario or replay.
6. Prefer small, reviewable changes over broad rewrites.
7. Architectural boundaries must be mechanically tested, not only documented.
8. Do not add runtime dependencies without documenting the measured need.

## Before declaring work complete
Run or ensure CI runs:
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run test:browser`

If behavior is visual, inspect the uploaded screenshot as well as machine-readable state evidence.
