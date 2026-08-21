# Tag Arena — Current State

## Phase
Phase 3A 2v2 tag-team foundation is **verified on the production architecture**.

## Active branch
`agent/tag-arena-phase3a-tag-team-foundation`

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

## Verified combat foundation
Phase 1 and Phase 2 behavior remains unchanged and covered:
- deterministic movement/body collision;
- strike startup/impact/recovery;
- hit-stop and momentum;
- arena-edge rebound;
- contextual close-contact grapple;
- six-tick clinch and directional throw;
- four-tick throw impact pause;
- simultaneous close-range Action fairness.

## Phase 3A persistent teams
Each player now owns two persistent wrestlers while the proven active-combat API remains stable:
- `fighters.p1/p2` are the currently active combat slots;
- `partners.p1/p2` are inactive partners;
- unique wrestler identities: `p1a`, `p1b`, `p2a`, `p2b` via `rosterId`;
- wrestler health follows the persistent wrestler record across tags;
- `teams.p1/p2` own deterministic tag cooldown/recovery counters.

This avoided rewriting strike/grapple/rope rules for four simultaneous entities.

## Tag rules
Home tag anchors:
- P1 `(70, 380)`;
- P2 `(730, 70)`;
- eligibility radius `64 px`.

Controls:
- P1 Tag: `Enter`;
- P2 Tag: `G`.

Successful Tag requires an alive active wrestler and partner, zero team cooldown, neutral active state, no active global pause/grapple, and active wrestler inside the home tag zone.

On success:
- active and partner persistent records swap;
- incoming wrestler appears at outgoing arena position with neutral transient state;
- outgoing wrestler moves to the exact home anchor and becomes `inactive`;
- health/roster identity remain attached to the wrestler;
- cooldown becomes `120` ticks;
- inactive recovery counter resets;
- incoming wrestler cannot Action on the same tick;
- Tag takes priority over Action if both are freshly pressed on an eligible tick.

## Inactive recovery
- inactive partner gains `+1 HP` every `60` eligible simulation ticks;
- health is capped at `100`;
- global impact pause freezes both tag cooldown and recovery counters;
- normal gameplay and grapple-hold ticks advance team timers.

## Browser/debug contract
Debug bridge version: `6`.
Game-state version: `5`.

Named Phase 3A scenarios:
- `tag-ready`;
- `tag-ready-p2`;
- `tag-recovery`.

Pixi displays both inactive partners, tag zones, partner health, roster identities, and cooldown telemetry while owning no tag eligibility/timer rules.

## Verification evidence
GitHub Actions run #114 passed the full locked production pipeline:
- `npm ci`;
- strict TypeScript typecheck;
- native gameplay and architecture tests;
- Vite production build;
- real Chromium Pixi/WebGL acceptance test;
- artifact upload.

The uploaded JSON and screenshot were downloaded and inspected directly. Exact evidence includes:
- debug bridge `6`, state version `5`, renderer `pixi-v8-webgl`;
- console errors `0`;
- movement regression `48 px`, collision regression `40 px`;
- Phase 2 throw regression remains target `85 HP`, throw velocity `13`, impact pause `4`;
- P1 persistent swap `p1a -> p1b`;
- incoming `p1b` preserves `80 HP`;
- outgoing `p1a` preserves `100 HP` and becomes inactive at the corner;
- cooldown starts at `120`;
- immediate tag-back remains locked (`p1b`, cooldown `118` after two eligible ticks);
- inactive `p1a` recovers exactly `60 -> 61` after 60 eligible ticks;
- Tag+Action evidence: `1` tag, `0` attack starts, `0` grapple starts;
- P2 swaps symmetrically to `p2b` at `75 HP`, cooldown `120`;
- screenshot visibly shows tag zones, active/partner state, health bars, roster IDs, and cooldown telemetry.

## Next phase
After Phase 3A merges, keep scope narrow. Strong candidates are stamina/tag-recovery depth or the Power Core/special system; do not add both in one slice.
