# Phase 3A — Tag-Team Foundation

## Status
**Implemented and verified in GitHub Actions run #114.** Final documented branch head must pass the same locked pipeline before merge.

## Goal
Add the core 2v2 tag-team structure while preserving all verified Phase 2 active-fighter combat behavior.

Each player controls one team of two persistent wrestlers:
- one active fighter participates in arena combat;
- one inactive partner waits at that team's home corner;
- Tag swaps the two persistent fighter records when the active fighter is eligible and inside the home tag zone.

## Compatibility strategy
The proven `state.fighters.p1` / `state.fighters.p2` active-combat surface remains intact.

Persistent team state is layered around it:
- `fighters.p1/p2` remain the active combat slots;
- `partners.p1/p2` hold inactive persistent fighters;
- unique `rosterId` values (`p1a`, `p1b`, `p2a`, `p2b`) keep health/identity attached to each wrestler;
- `teams.p1/p2` hold deterministic tag timers.

## Tag zones and input
- P1 home corner: `(70, 380)`
- P2 home corner: `(730, 70)`
- tag eligibility radius: `64 px`
- P1 Tag: `Enter`
- P2 Tag: `G`

Action remains the only attack/grapple input.

## Deterministic tag rules
A fresh Tag press succeeds only when:
1. active wrestler is alive;
2. inactive partner is alive;
3. team tag cooldown is `0`;
4. active wrestler is inside the `64 px` home tag zone;
5. active wrestler is neutral and action-eligible;
6. no global impact pause is active;
7. no active grapple state is in progress.

On successful tag:
- active and partner persistent records swap;
- incoming appears at outgoing active position with neutral transient state and zero velocity;
- outgoing moves to the exact home anchor and becomes `inactive`;
- health/roster identity remain attached to the wrestler;
- cooldown becomes `120` ticks;
- inactive recovery counter resets to `0`;
- `tag-completed` records outgoing/incoming roster IDs and health;
- incoming cannot start Action on the same tick.

If Tag and Action are freshly pressed together on an eligible tick, Tag wins.

## Team timers
- tag cooldown: `120` eligible simulation ticks;
- inactive recovery interval: `60` eligible ticks;
- recovery amount: `+1 HP`, capped at `100`;
- only living damaged inactive partner recovers;
- global impact pause freezes tag cooldown and recovery counters;
- normal gameplay and grapple-hold ticks advance team timers.

## State additions
- `InputState.tag`
- `FighterState.rosterId`
- fighter mode `inactive`
- `GameState.partners`
- `GameState.teams`
- `TeamState.tagCooldownTicks`
- `TeamState.partnerRecoveryTicks`
- serialized state version `5`
- debug bridge version `6`

## Named scenarios
- `tag-ready`
- `tag-ready-p2`
- `tag-recovery`
- all Phase 1/2 combat scenarios remain available and unchanged in meaning.

## Acceptance tests — verified
1. Existing movement/strike/grapple/throw/rope regressions pass against `fighters.p1/p2`.
2. Tag outside the home zone does nothing.
3. Fresh Tag inside the zone swaps `p1a -> p1b` and preserves wrestler health.
4. Outgoing wrestler is placed at the exact home anchor and marked `inactive`.
5. Incoming appears at outgoing arena position, neutral with zero velocity.
6. Cooldown becomes `120`; immediate tag-back is rejected.
7. Tag becomes eligible again after exactly 120 eligible countdown ticks.
8. Damaged inactive partner gains exactly `+1 HP` after 60 eligible ticks.
9. Global hit-stop freezes tag cooldown and recovery counters.
10. Tag + Action same tick performs Tag with no incoming attack/grapple start.
11. P2 behavior is symmetric.
12. Chromium verifies successful tag, lockout, recovery, P2 symmetry, and the full Phase 2 contextual-grapple contract.

## Inspected run #114 evidence
The uploaded JSON and screenshot were downloaded and inspected directly.

Observed browser values:
- bridge version `6`;
- game-state version `5`;
- renderer `pixi-v8-webgl`;
- console errors `0`;
- movement `48 px`, collision distance `40 px` retained;
- Phase 2 throw remains target `85 HP`, throw velocity `13`, pause `4`;
- before P1 tag: active `p1a`, partner `p1b` at `80 HP`;
- after P1 tag: active `p1b` at `80 HP`, partner `p1a` at `100 HP`, cooldown `120`;
- immediate re-tag attempt remains active `p1b`, cooldown `118`;
- inactive recovery changes `p1a 60 -> 61` exactly at the 60-tick boundary;
- Tag+Action: one tag completion, zero attack starts, zero grapple starts;
- P2 tag: active `p2b` at `75 HP`, partner `p2a`, cooldown `120`;
- screenshot visibly shows tag zones, partner health indicators, roster identities, and tag cooldown telemetry.
