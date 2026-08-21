# Tag Arena — Current State

## Phase
Phase 1: deterministic impact feel — verified.

## Active branch
`agent/tag-arena-phase1-feel`

## Verified foundation
- Phase -1 AI harness is merged to `main`.
- Phase 0 movement, collision, one attack, hitstun/knockback, and rope rebound are merged to `main`.

## Phase 1 goal
Improve contact feel without increasing control complexity or adding new gameplay systems.

## Implemented and verified
- attack press now has exactly 2 startup ticks before becoming active
- successful hit begins exactly 3 global hit-stop ticks
- hit-stop freezes victim position, hitstun countdown, attacker recovery, and attacker cooldown
- knockback resumes immediately after hit-stop
- attack has 4 deterministic recovery ticks
- debug bridge version `3`
- deterministic impact state exposed to renderer rather than invented by rendering code
- windup indication, impact burst, `HITSTOP` status, and deterministic micro-shake
- previous movement, collision, edge-collision, attack latching, knockback, and rope behaviors remain covered
- punch -> hit-stop -> knockback -> rope rebound remains valid

## Verification evidence
GitHub Actions run #29 completed successfully on 2026-08-21.

The uploaded Chromium artifact was downloaded and inspected. Exact results:
- browser console errors: `0`
- debug bridge version: `3`
- movement delta: `48 px`
- collision distance: `40 px`
- attack press: tick `1`, target health `100`, startup remaining `2`
- pre-impact: tick `2`, target health still `100`
- impact: tick `3`, target health `90`, hit-stop `3`
- target X at impact: `400`
- after three frozen ticks: tick `6`, target X still `400`, victim hitstun unchanged
- first resumed simulation tick: tick `7`, target X `410`
- punch -> rope chain still returns P2 with X velocity `-3.3909132`
- uploaded artifacts: `phase1-impact.png`, `playtest-report.json`

The screenshot was visually inspected at the frozen tick-3 impact frame. It shows P1 in attack, P2 in hitstun, the impact burst, reduced P2 health, and `HITSTOP 3` telemetry.

## Explicitly not part of Phase 1
- new buttons
- grapples or throws
- jumping
- tagging
- specials / Power Core
- CPU opponent
- final fighter art or animation
- networking
- progression/economy

## Phase 1 exit criteria
Completed:
1. attack does not damage immediately on button press;
2. hit occurs on deterministic tick 3;
3. successful hit creates exactly three frozen simulation ticks;
4. knockback/recovery/hitstun remain frozen during hit-stop;
5. physics resumes on the first tick after hit-stop;
6. Phase 0 mechanics remain green in Node and Chromium;
7. browser artifact contains inspectable visual + machine-readable proof.

## Next phase
Phase 2: introduce the first wrestling interaction without adding a new button. At close body contact, the existing Attack action should become a contextual grapple/throw interaction; at normal striking distance it remains the current strike. Keep it deterministic and simple before adding tagging.
