# Tag Arena — Architecture

## Purpose
The architecture is optimized for AI-assisted development from ChatGPT web. The project must be easy for an agent to inspect, modify, test, and verify without relying on hidden local state.

## Production stack
- strict TypeScript for gameplay/runtime contracts
- PixiJS 8 as rendering only
- Vite for dev/build
- Vitest for simulation and architecture tests
- Playwright for real Chromium verification
- GitHub Actions as the remote execution/evidence loop

No general-purpose physics engine or ECS is used at this scale. The deterministic simulation owns the small number of fighters and interactions directly.

## One-way production boundaries

### `src/sim/`
The single source of gameplay truth.
- No DOM access.
- No canvas/Pixi access.
- No wall-clock time.
- No gameplay use of `Math.random()`.
- All randomness comes from the project seeded RNG.
- Fixed integer simulation ticks are gameplay time.

### `src/render/`
Reads serialized `GameState` and draws it with PixiJS.
- May not calculate damage, collision outcomes, scoring, tagging, action timing, grapple selection, throw direction, or other gameplay truth.
- Must not call simulation mutation APIs.
- Visual shake, impact bursts, labels, clinch links, throw arrows, and animations may derive from simulation state/events.

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

Current debug contract version: `5`.

## Determinism
The same initial seed plus the same ordered input sequence and tick count must produce the same serialized state and event sequence.

Display frequency may be 60/120/144 Hz without changing outcomes. Browser tests can bypass wall time with `step(ticks)`.

## Current gameplay timing truth
Player intent and physical momentum are distinct concepts.
- Neutral movement derives velocity from normalized directional input.
- Hitstun and arena-edge rebound use stored physical velocity.
- Body collision resolution belongs entirely to simulation code.
- Range, facing, damage, cooldown, knockback, and hitstun belong entirely to simulation code.
- Arena-edge contact clamps inside the arena and reverses incoming velocity with deterministic retention.
- Startup, active timing, recovery, and global pause are integer simulation ticks.
- During global pause, position integration, momentum decay, state countdowns, recovery, and cooldown are frozen.
- Input latches synchronize during global pause so a held button cannot become a false fresh press.

## Contextual Action / grapple state machine
There is still one combat Action input. Context is resolved inside simulation:
- normal range -> strike path;
- one fresh Action press at body contact within `44 px`, with eligibility/facing satisfied -> grapple path;
- simultaneous eligible close-range fresh presses -> both take the strike path, preventing player-order advantage.

Active grapple is explicit serialized state:
- attacker id;
- target id;
- hold ticks remaining;
- selected throw direction.

While grapple state exists, simulation advances it before ordinary movement/collision/actions:
1. both fighters are held in `grapple` mode with zero physical velocity;
2. attacker directional input updates the serialized normalized throw direction but does not move either fighter;
3. after exactly 6 hold ticks, simulation resolves the throw;
4. grapple state clears;
5. target receives deterministic damage, momentum, and hitstun;
6. attacker enters deterministic `throw` recovery;
7. a 4-tick global throw-impact pause begins;
8. after pause, target momentum enters the same generic hitstun and arena-edge rebound path used by other physical impulses.

Pixi does not infer any of these rules. It only renders `state.grapple`, fighter modes, and `state.impact.kind`.

## Browser automation contract
`window.__TAG_ARENA__` provides:
- `getState()`
- `reset(seed?)`
- `setInput(playerId, input)`
- `step(ticks)`
- `getEvents()`
- `loadScenario(name)`
- `version`
- renderer identity

Named deterministic scenarios are preferred over arbitrary state mutation. Current grapple scenarios are `grapple` and `grapple-rope`.

## CI contract
A relevant push or pull request runs:
1. locked dependency installation with `npm ci`;
2. strict TypeScript typecheck;
3. Vitest simulation + architecture tests;
4. Vite production build;
5. Chromium production acceptance test;
6. artifact upload even when browser verification fails.

Artifacts include machine-readable JSON, screenshots, the built bundle, and lockfile metadata.

## Dependency policy
Runtime dependencies are intentionally minimal. PixiJS is the rendering dependency. Add another runtime framework only when it provides a measured capability that cannot remain simple inside these boundaries, and update this document plus architecture tests in the same change.

## Intended growth path
- `src/sim/` may split `Game.ts` into focused rule modules once tests make extraction mechanical.
- `src/content/` will hold data-driven fighters and moves.
- `src/render/` may add Spine/particle/audio adapters without moving gameplay truth out of simulation.
- `tests/scenarios/` and `tests/replays/` will grow as mechanics are added.
