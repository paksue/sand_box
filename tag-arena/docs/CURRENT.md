# Tag Arena — Current State

## Phase
Phase 2 contextual close-contact grapple/throw is **verified on the production architecture**.

## Active branch
`agent/tag-arena-phase2-contextual-grapple`

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

## Verified foundation
- production-stack migration PR #34 is merged;
- legacy migration oracle cleanup PR #35 is merged;
- `src/sim/` is the only gameplay implementation;
- Phase 1 movement, collision, strike startup, impact pause, knockback, and rope rebound remain covered and unchanged.

## Phase 2 contextual rule
The existing Action input now has two deterministic contexts:
- normal strike distance: existing strike path;
- body contact (`<= 44 px`) with one fresh Action press: grapple.

No new primary combat button was added.

During grapple:
- both fighters remain position-locked for 6 simulation ticks;
- the attacker's most recent non-zero movement direction selects throw direction without moving either fighter;
- no direction defaults to attacker facing;
- throw applies 15 damage, 13 px/tick momentum, 14 hitstun ticks, 4 global pause ticks, and 6 attacker recovery ticks;
- throw momentum uses the same existing arena-edge rebound rules;
- simultaneous close-range Action presses are symmetric and start two ordinary strikes instead of selecting a grapple winner.

## Browser/debug contract
Debug bridge version: `5`.

Named Phase 2 scenarios:
- `grapple`
- `grapple-rope`

Pixi visualizes serialized clinch direction, grapple/throw fighter modes, and distinct throw-impact state. Rendering owns no grapple rules.

## Verification evidence
GitHub Actions run #97 passed the locked production pipeline:
- `npm ci`;
- strict TypeScript typecheck;
- native gameplay and architecture tests;
- Vite production build;
- real Chromium Pixi/WebGL acceptance test;
- artifact upload.

The uploaded JSON and screenshot were downloaded and inspected. Exact browser evidence includes:
- debug bridge `5`;
- renderer `pixi-v8-webgl`;
- console errors `0`;
- movement regression `48 px`;
- collision regression `40 px`;
- existing strike still hits on tick `3`, `100 -> 90`, with 3 pause ticks;
- grapple begins on tick `1` with 6 hold ticks and no damage;
- direction changes to `(0, 1)` on tick `2` without position movement;
- throw resolves on tick `7`, `100 -> 85`, velocity `(0, 13)`, hitstun `14`, pause `4`, recovery `6`;
- victim position and countdowns remain frozen through the 4 pause ticks;
- first resumed tick moves exactly `13 px`;
- rightward throw rebounds at arena X `780` with negative return velocity;
- simultaneous close-range input creates 2 strike starts and 0 grapple starts;
- screenshot is the exact tick-7 throw-impact frame and visibly reports `THROWSTOP 4`.

## Next phase
After Phase 2 merges, the next gameplay slice should build on the same small-control philosophy. The strongest next candidate is 2v2 tagging and inactive-partner recovery, before adding character specials or final art.
