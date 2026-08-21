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
- May not calculate damage, collision outcomes, scoring, tagging, action timing, grapple selection, throw direction, tag eligibility, cooldown, or recovery.
- Must not call simulation mutation APIs.
- Visual shake, impact bursts, labels, clinch links, throw arrows, tag-zone guides, and partner health indicators may derive from simulation state/events.

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

Current debug contract version: `6`.
Current serialized game-state version: `5`.

## Determinism
The same initial seed plus the same ordered input sequence and tick count must produce the same serialized state and event sequence.

Display frequency may be 60/120/144 Hz without changing outcomes. Browser tests can bypass wall time with `step(ticks)`.

## Active-combat compatibility surface
`state.fighters.p1` and `state.fighters.p2` remain the two active arena slots.

All established movement, body-collision, strike, grapple, throw, hitstun, and arena-edge rules operate only on those active slots. Phase 3A intentionally does not convert combat into a four-entity simulation.

Persistent team identity is layered around that stable surface:
- `state.partners.p1/p2` hold inactive persistent wrestler records;
- every wrestler has a unique `rosterId` (`p1a`, `p1b`, `p2a`, `p2b`);
- `state.teams.p1/p2` hold team cooldown/recovery counters;
- Tag swaps persistent wrestler records into/out of the active slot.

This preserves proven combat logic while allowing per-wrestler health and identity to survive tagging.

## Current gameplay timing truth
Player intent and physical momentum are distinct concepts.
- Neutral movement derives velocity from normalized directional input.
- Hitstun and arena-edge rebound use stored physical velocity.
- Body collision resolution belongs entirely to simulation code.
- Range, facing, damage, cooldown, knockback, and hitstun belong entirely to simulation code.
- Arena-edge contact clamps inside the arena and reverses incoming velocity with deterministic retention.
- Startup, active timing, recovery, and global pause are integer simulation ticks.
- During global pause, position integration, momentum decay, state countdowns, action recovery, tag cooldown, and inactive recovery are frozen.
- Input latches synchronize during global pause so held buttons cannot become false fresh presses.

## Contextual Action / grapple state machine
There is one combat Action input. Context is resolved inside simulation:
- normal range -> strike path;
- one fresh Action press at body contact within `44 px`, with eligibility/facing satisfied -> grapple path;
- simultaneous eligible close-range fresh presses -> both take the strike path, preventing player-order advantage.

Active grapple is explicit serialized state with attacker, target, hold ticks, and selected throw direction.

While grapple state exists, simulation advances it before ordinary movement/collision/actions. Team cooldown/recovery clocks do advance during grapple-hold ticks; the fighters themselves remain locked. Throw momentum subsequently re-enters the same generic hitstun/arena-edge path.

## Tag-team state machine
Tag is a separate team-management input, not another combat move.

Eligibility is simulation truth:
- active and partner alive;
- team cooldown zero;
- active fighter inside the team's home tag zone;
- active fighter neutral and eligible to act;
- no global pause;
- no active grapple state.

Home anchors/radius:
- P1 `(70,380)`;
- P2 `(730,70)`;
- radius `64 px`.

On successful Tag:
1. outgoing active and incoming partner persistent records are captured;
2. incoming record is placed at the outgoing active arena position and reset to neutral transient state;
3. outgoing record is placed at the exact home anchor and marked `inactive`;
4. health and `rosterId` remain attached to the wrestler record;
5. team cooldown becomes `120` ticks;
6. inactive recovery counter resets to `0`;
7. `tag-completed` records outgoing/incoming roster IDs and health;
8. the tagged player is skipped by Action-start processing for that tick.

When Tag and Action are freshly pressed on the same eligible tick, Tag wins. The Action latch is still synchronized so holding Action cannot create a delayed false press on the next tick.

## Team timers
Team timers advance once per eligible simulation tick before active gameplay logic:
- tag cooldown counts down from `120` toward zero;
- inactive recovery counter advances toward `60`;
- at 60 ticks, a living damaged inactive partner recovers exactly `+1 HP`, capped at 100, and the counter resets;
- global impact pause bypasses team timer advancement entirely;
- grapple-hold ticks do advance team timers.

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

Named deterministic scenarios are preferred over arbitrary state mutation. Current team scenarios are `tag-ready`, `tag-ready-p2`, and `tag-recovery`; established combat/grapple scenarios remain available.

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
