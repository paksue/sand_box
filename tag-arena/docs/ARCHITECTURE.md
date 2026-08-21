# Tag Arena — Architecture

## Purpose
The architecture is optimized for AI-assisted development from ChatGPT web. The project must be easy for an agent to inspect, modify, test, and verify without relying on hidden local state.

## Production stack
- strict TypeScript for gameplay/runtime contracts
- PixiJS 8 as rendering only
- Vite for dev/build
- Vitest for simulation, equivalence, and architecture tests
- Playwright for real Chromium verification
- GitHub Actions as the remote execution/evidence loop

No general-purpose physics engine or ECS is used at this scale. The deterministic simulation owns the small number of fighters and interactions directly.

## One-way production boundaries

### `src/sim/`
Owns deterministic gameplay state transitions.
- No DOM access.
- No canvas/Pixi access.
- No wall-clock time.
- No gameplay use of `Math.random()`.
- All randomness comes from the project seeded RNG.
- Fixed integer simulation ticks are gameplay time.

### `src/render/`
Reads serialized `GameState` and draws it with PixiJS.
- May not calculate damage, collision outcomes, scoring, tagging, attack timing, or other gameplay truth.
- Must not call simulation mutation APIs.
- Visual shake, impact bursts, labels, and animations may derive from simulation state/events.

### `src/input/`
Translates keyboard/gamepad/test controls into typed `InputState` only.

### `src/runtime/`
The sole production composition layer.
- feeds current input intent to the simulation;
- advances the simulation at exactly 60 fixed ticks/sec;
- renders the latest state independently of display refresh rate.

Pixi's ticker/render frequency is never gameplay time.

### `src/debug/`
Development builds expose `window.__TAG_ARENA__` so browser automation can inspect and control the public runtime/simulation surface. The bridge must not duplicate gameplay rules.

## Determinism
The same initial seed plus the same ordered input sequence and tick count must produce the same serialized state and event sequence.

Display frequency may be 60/120/144 Hz without changing outcomes. Browser tests can bypass wall time with `step(ticks)`.

## Current combat truth
Player intent and physical momentum are distinct concepts.
- Neutral movement derives velocity from normalized directional input.
- Hitstun and rope rebound use stored physical velocity.
- Body collision resolution belongs entirely to simulation code.
- Attack range, facing, damage, cooldown, knockback, and hitstun belong entirely to simulation code.
- Rope contact clamps inside the arena and reverses incoming velocity with deterministic retention.
- Attack startup, active timing, recovery, and hit-stop are integer simulation ticks.
- During global hit-stop, position integration, knockback decay, hitstun countdown, attack recovery, and cooldown are frozen.
- Input latches synchronize during hit-stop so a held button cannot become a false new press.

## Migration oracle
During the production-stack migration only, `src/simulation.js` and `src/rng.js` remain untouched as the verified Phase-1 behavior oracle.

Vitest runs identical scripts against legacy JS and `src/sim/Game.ts` and compares full state + event output. Production HTML does not load the legacy controller. Once the migration is merged and a follow-up cleanup is green, the oracle may be removed.

## Browser automation contract
`window.__TAG_ARENA__` provides:
- `getState()`
- `reset(seed?)`
- `setInput(playerId, input)`
- `step(ticks)`
- `getEvents()`
- `loadScenario(name)`
- `version`
- renderer identity for migration verification

Named deterministic scenarios are preferred over arbitrary state mutation.

## CI contract
A relevant push or pull request runs:
1. dependency installation from committed lockfile once migration bootstrap is complete;
2. strict TypeScript typecheck;
3. Vitest native simulation + legacy equivalence + architecture tests;
4. Vite production build;
5. Chromium production-stack acceptance test;
6. artifact upload even when browser verification fails.

Artifacts include machine-readable JSON and screenshots, and during the bootstrap run also the generated `package-lock.json`.

## Dependency policy
Runtime dependencies are intentionally minimal. PixiJS is the rendering dependency. Add another runtime framework only when it provides a measured capability that cannot remain simple inside these boundaries, and update this document plus architecture tests in the same change.

## Intended growth path
- `src/sim/` may later split `Game.ts` into Combat/Collision/Ropes/Tagging once tests make extraction mechanical.
- `src/content/` will hold data-driven fighters and moves.
- `src/render/` may add Spine/particle/audio adapters without moving gameplay truth out of simulation.
- `tests/scenarios/` and `tests/replays/` will grow as mechanics are added.
