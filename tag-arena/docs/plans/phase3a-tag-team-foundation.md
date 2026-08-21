# Phase 3A — Tag-Team Foundation

## Goal
Add the core 2v2 tag-team structure while preserving all verified Phase 2 active-fighter combat behavior.

Each player controls one team of two persistent wrestlers:
- one active fighter participates in arena combat;
- one inactive partner waits at that team's home corner;
- Tag swaps the two persistent fighter records when the active fighter is eligible and inside the home tag zone.

## Compatibility strategy
Do not replace the proven `state.fighters.p1` / `state.fighters.p2` active-combat surface.

Instead:
- `fighters.p1` and `fighters.p2` remain the currently active combat slots;
- `partners.p1` and `partners.p2` hold the inactive persistent fighters;
- every fighter record gets a unique `rosterId` (`p1a`, `p1b`, `p2a`, `p2b`) so health and identity survive swaps;
- `teams.p1` / `teams.p2` hold deterministic tag timers.

This keeps existing strike/grapple/rope code focused on the two active slots.

## Tag zones
- P1 home corner: `(70, 380)`
- P2 home corner: `(730, 70)`
- tag eligibility radius: `64 px`

Inactive partners are rendered at these anchors and do not participate in body collision.

## Input
Add one dedicated `tag` input boolean.

Keyboard mapping:
- P1 Tag: `Enter`
- P2 Tag: `G`

Action remains the only attack/grapple input.

## Deterministic tag rules
A fresh Tag press succeeds only when:
1. the active fighter is alive;
2. the inactive partner is alive;
3. team tag cooldown is `0`;
4. active fighter is within `64 px` of the home corner;
5. active fighter is neutral — not in attack, grapple/throw recovery, hitstun, or rebound;
6. no global impact pause is active;
7. no active grapple state is in progress.

On successful tag:
- active and partner persistent records swap;
- incoming wrestler appears at the outgoing active fighter's current position;
- incoming velocity/action/recovery state is reset to neutral;
- outgoing wrestler is moved to the home partner anchor and marked `inactive`;
- team cooldown becomes `120` ticks (`2.0 s` at 60 Hz);
- inactive recovery counter resets to `0`;
- a `tag-completed` event records outgoing/incoming `rosterId` values and health;
- the newly incoming active fighter cannot start Action on the same tick.

If Tag and Action are both freshly pressed on a tag-eligible tick, Tag wins for that player.

## Team timers
- tag cooldown: `120` eligible simulation ticks;
- inactive recovery interval: `60` eligible simulation ticks;
- recovery amount: `+1 HP`;
- health cap: `100`;
- only the currently inactive partner recovers;
- global impact pause freezes team cooldown and recovery timers;
- normal gameplay ticks and grapple-hold ticks advance team timers.

## State additions
- `InputState.tag`
- `FighterState.rosterId`
- fighter mode `inactive`
- `GameState.partners`
- `GameState.teams`
- `TeamState.tagCooldownTicks`
- `TeamState.partnerRecoveryTicks`

Bump serialized game-state version and debug contract version.

## Required scenarios
- `tag-ready`: P1 active fighter begins inside the home corner; partner has visibly different health/identity.
- `tag-recovery`: P1 outgoing fighter begins damaged, tags out, then demonstrates deterministic inactive recovery.
- existing Phase 1/2 scenarios remain unchanged for active combat.

## Acceptance tests
1. Every existing movement/strike/grapple/throw/rope regression still passes against `fighters.p1/p2`.
2. Tag outside the home zone does nothing.
3. Fresh Tag inside the zone swaps `p1a -> p1b` immediately and preserves each wrestler's own health.
4. Partner/outgoing fighter is placed at the exact home anchor and marked `inactive`.
5. Incoming fighter appears at the outgoing fighter's exact arena position, neutral with zero velocity.
6. Team cooldown becomes `120`; an immediate second Tag press cannot swap back.
7. After exactly 120 eligible ticks, tagging is eligible again.
8. A damaged inactive partner gains exactly `1 HP` after 60 eligible ticks, never above 100.
9. Global hit-stop freezes tag cooldown/recovery timers.
10. Tag + Action on the same eligible tick performs Tag and does not start an attack/grapple for the incoming wrestler.
11. P2 behavior is symmetric.
12. Chromium verifies one successful tag, cooldown lockout, inactive recovery, and preserves the full Phase 2 contextual-grapple contract.
