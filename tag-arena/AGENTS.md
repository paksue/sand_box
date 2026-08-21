# Tag Arena agent map

Read this file first, then follow the linked project documents. This file is intentionally short: it is a map, not the full project specification.

## Mission
Build a fast, deterministic, AI-legible browser tag-fighting game inspired by the immediacy of classic arena wrestling games without copying protected characters, names, art, or assets.

## Source of truth
- Product intent: `docs/PRODUCT.md`
- Architecture and boundaries: `docs/ARCHITECTURE.md`
- Current project state: `docs/CURRENT.md`

## Non-negotiable engineering rules
1. Gameplay simulation must be deterministic for the same seed and input sequence.
2. Gameplay randomness must use the project RNG; never `Math.random()` inside simulation code.
3. Rendering must consume state/events and must not own gameplay rules.
4. Browser tests must be able to inspect development state through `window.__TAG_ARENA__`.
5. Every new mechanic needs at least one executable acceptance scenario.
6. Prefer small, reviewable changes over broad rewrites.
7. Do not add frameworks or dependencies unless the task requires them and the architecture doc is updated.

## Before declaring work complete
Run or ensure CI runs:
- deterministic simulation tests
- browser smoke test
- architecture checks

If behavior is visual, capture evidence in CI artifacts.
