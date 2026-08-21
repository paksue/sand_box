# Tag Arena — Current State

## Phase
Phase 0: deterministic combat slice — verified.

## Active branch
`agent/tag-arena-phase0-combat`

## Verified foundation
Phase -1 was merged to `main` after passing deterministic tests and a real Chromium control test with uploaded JSON + screenshot evidence.

## Phase 0 scope
Exactly five gameplay capabilities were added:
1. two-fighter movement;
2. body collision;
3. one facing attack;
4. attack knockback / hitstun;
5. rope rebound that preserves part of incoming momentum.

## Implemented and verified
- explicit fighter states: `idle`, `move`, `attack`, `hitstun`, `rebound`
- separate player movement from physical knockback/rebound momentum
- deterministic circle-vs-circle body collision and boundary-aware separation
- single press-triggered facing attack with cooldown
- health damage, knockback, and short hitstun
- rope rebound with retained velocity
- deterministic debug scenarios: `baseline`, `collision`, `edge-collision`, `attack`, `rope`, `rope-hit`
- P1 local controls: arrow keys + Space
- P2 local controls: WASD + F
- visible health, facing direction, and simulation state labels
- Node tests for all mechanics, attack latching, compound rope interaction, and collision at an arena edge
- Chromium acceptance test for movement, collision, attack, rope rebound, and attack -> knockback -> rope rebound

## Verification evidence
GitHub Actions run #21 completed successfully on 2026-08-21 after the boundary-collision hardening.

Inspected Chromium artifact:
- debug bridge version: `2`
- browser console errors: `0`
- baseline movement: P1 `180 -> 228`, exact delta `48 px` over 12 ticks
- body collision final center distance: `40 px`
- attack: P2 health `100 -> 90`, P1 state `attack`, P2 state `hitstun`
- run-to-rope rebound: P1 X velocity `-4 -> +3 px/tick`
- attack-to-rope chain: P2 reached right rope at `x=780` and returned at `vx=-3.3909132`
- uploaded artifacts: `phase0-combat.png`, `playtest-report.json`

The screenshot and JSON were inspected from the uploaded CI artifact rather than inferred from job status alone.

## Explicitly not part of Phase 0
- grapples
- jumping
- tagging
- specials / Power Core
- CPU opponent
- final fighter art or animation
- networking
- progression/economy

## Phase 0 exit criteria
Completed:
1. deterministic replay remains stable;
2. fighters retain full collision separation, including beside a rope;
3. a facing attack removes exactly 10 health and creates hitstun/knockback;
4. holding the attack button does not retrigger attacks;
5. running into a rope reverses velocity;
6. attack knockback can carry the opponent into a rope and rebound them;
7. Chromium reports zero console errors and uploads screenshot + JSON evidence.

## Next phase
Phase 1 should focus on **feel rather than feature count**: tune impact timing, hit pause, movement response, collision response, and rope behavior until the two-circle prototype is genuinely satisfying before adding grapples or tags.
