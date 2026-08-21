# Tag Arena — Architecture

## Purpose
The architecture is optimized for AI-assisted development from ChatGPT web. The project must be easy for an agent to inspect, modify, test, and verify without relying on hidden local state.

## Core boundaries

### Simulation
Owns deterministic gameplay state transitions.
- No DOM access.
- No canvas access.
- No wall-clock time.
- No gameplay use of `Math.random()`.
- All randomness comes from an injected seeded RNG.

### Rendering
Reads state and draws it.
- May not calculate damage, collision outcomes, scoring, tagging rules, or other gameplay truth.
- Must not mutate simulation internals directly.

### Input
Translates keyboard/gamepad/test actions into a small input state consumed by the simulation.

### Debug bridge
Development builds expose `window.__TAG_ARENA__` so browser automation can inspect and control the game.
The bridge may call public simulation APIs but must not duplicate gameplay rules.

## Determinism
The same initial seed plus the same ordered input sequence and tick count must produce the same serialized state.

Simulation advances in fixed ticks. Rendering frequency must not change simulation outcomes.

## Phase 0 simulation rules
Player intent and physical momentum are distinct concepts.
- Neutral movement derives velocity from normalized directional input.
- Hitstun and rope rebound advance using stored physical velocity rather than fresh movement input.
- Body collision resolution belongs entirely to simulation code.
- Attack range, facing checks, damage, cooldown, knockback, and hitstun belong entirely to simulation code.
- Rope contact clamps fighters inside the arena and reverses the incoming velocity component with deterministic retention.

The renderer may visualize fighter state, facing, velocity-derived outcomes, and health, but may not recreate any of those rules.

## Phase 1 timing rules
Combat feel is also simulation truth, not renderer truth.
- Attack startup, active timing, recovery, and hit-stop are integer simulation ticks.
- A successful strike may create global hit-stop by setting deterministic simulation state.
- During hit-stop, position integration, knockback decay, hitstun countdown, attack recovery, and cooldown progression are frozen.
- Input latches continue to synchronize during hit-stop so a held button cannot become a false fresh press when simulation resumes.
- Impact metadata is emitted by simulation and may be visualized by the renderer.
- Camera shake, impact bursts, labels, and other visual treatment may derive from deterministic impact state, but must not change gameplay outcomes.

This keeps impact timing identical in Node tests, Chromium tests, and the interactive browser game.

## Browser automation contract
`window.__TAG_ARENA__` must provide at minimum:
- `getState()` — serializable snapshot
- `reset(seed?)`
- `setInput(playerId, input)`
- `step(ticks)` — deterministic manual stepping for tests
- `getEvents()` — recent simulation events
- `version` — debug-contract version

The bridge also exposes:
- `loadScenario(name)` — loads a named deterministic acceptance scenario through the public simulation API.

Named scenarios are preferred over arbitrary state mutation because they are reviewable, reproducible, and safe for regression tests.

## CI contract
A relevant push or pull request runs:
1. architecture/unit tests
2. static browser server
3. Chromium smoke/combat acceptance test
4. artifact upload even when the browser test fails

Artifacts should include machine-readable JSON and screenshots so ChatGPT can review evidence rather than only a green/red status.

## Dependency policy
The current project uses browser-native ES modules and Node's built-in test runner. Playwright is installed by CI only. Add runtime frameworks only after they materially improve the game.

## Growth path
As the project grows, likely production structure becomes:
- `src/sim/` deterministic simulation
- `src/render/` rendering adapter (likely PixiJS if useful)
- `src/input/`
- `src/debug/`
- `src/content/` data-driven fighters and moves
- `tests/scenarios/`
- `tests/replays/`

If TypeScript is introduced, simulation and public debug contracts should become strongly typed first.
