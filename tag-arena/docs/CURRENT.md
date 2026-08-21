# Tag Arena — Current State

## Phase
Phase 0: deterministic combat slice — implementation complete, CI verification pending.

## Active branch
`agent/tag-arena-phase0-combat`

## Verified foundation
Phase -1 was merged to `main` after passing deterministic tests and a real Chromium control test with uploaded JSON + screenshot evidence.

## Phase 0 scope
Exactly five gameplay capabilities are being added:
1. two-fighter movement;
2. body collision;
3. one facing attack;
4. attack knockback / hitstun;
5. rope rebound that preserves part of incoming momentum.

## Implemented on this branch
- explicit fighter states: `idle`, `move`, `attack`, `hitstun`, `rebound`
- separate player movement from physical knockback/rebound momentum
- deterministic circle-vs-circle body collision and separation
- single press-triggered facing attack with cooldown
- health damage, knockback, and short hitstun
- rope rebound with retained velocity
- deterministic debug scenarios: `baseline`, `collision`, `attack`, `rope`, `rope-hit`
- P1 local controls: arrow keys + Space
- P2 local controls: WASD + F
- visible health, facing direction, and simulation state labels
- expanded Node tests for every mechanic
- expanded Chromium test for every mechanic plus attack -> knockback -> rope interaction

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
CI must prove:
1. deterministic replay remains stable;
2. fighters cannot overlap after body collision resolution;
3. a facing attack removes exactly 10 health and creates hitstun/knockback;
4. holding the attack button does not retrigger attacks;
5. running into a rope reverses velocity;
6. attack knockback can carry the opponent into a rope and rebound them;
7. Chromium reports zero console errors and uploads screenshot + JSON evidence.

## Next phase after verification
Phase 1 should focus on feel rather than feature count: tune impact timing, hit pause, collision response, and rope behavior until the two-circle prototype is genuinely satisfying before adding grapples or tags.
