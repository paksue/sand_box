# Phase 2 — Contextual Close-Contact Grapple

## Goal
Add the first unmistakably wrestling-specific interaction without adding another primary button.

The existing Action/Attack input remains the only combat action:
- at normal distance: current strike behavior is unchanged;
- at body-contact distance: a single fresh Action press starts a clinch;
- during the clinch: movement direction selects the automatic throw direction.

## Deterministic rules
- body center collision distance: `40 px`
- contextual grapple range: `44 px`
- facing threshold: same `0.35` dot-product threshold as the strike
- clinch hold: `6` simulation ticks
- throw damage: `15`
- throw speed: `13 px/tick`
- throw hitstun: `14` ticks
- throw impact pause: `4` ticks
- throw recovery: `6` ticks
- grapple cooldown: `22` ticks

## Input semantics
1. Exactly one player freshly presses Action while both fighters are eligible, facing correctly, and within grapple range -> contextual grapple.
2. No new input action is introduced.
3. During the six-tick hold, the attacker may choose any normalized movement direction. The most recent non-zero direction becomes the throw direction.
4. If no direction is supplied, the attacker's facing direction at grapple start is used.
5. Two simultaneous fresh Action presses at close range do **not** privilege Player 1: both proceed into the existing strike startup instead of selecting a grapple winner.

## State semantics
- active clinch is explicit serialized simulation state;
- both fighters are locked in `grapple` mode during the hold;
- body collision and normal movement do not advance during the hold;
- throw impact clears grapple state, applies target momentum/hitstun, puts attacker in `throw` recovery, and starts deterministic global pause;
- subsequent arena-edge rebound uses the existing momentum/rope rules rather than a special throw-only path.

## Required regression scenarios
- `grapple`: fighters begin at body contact, facing one another;
- `grapple-rope`: fighters begin at body contact near the right boundary so a default rightward throw reaches the rope.

## Acceptance tests
1. Existing strike scenario at `50 px` still uses strike startup and lands on the same tick as before.
2. A fresh Action press at `40 px` starts grapple immediately and causes no immediate damage.
3. Fighter positions remain unchanged throughout the six hold ticks.
4. Direction input during hold changes serialized throw direction without moving either fighter.
5. Throw resolves after exactly six hold ticks, reduces target health `100 -> 85`, creates `13 px/tick` initial momentum and `14` hitstun ticks, and starts a four-tick global pause.
6. Victim momentum is frozen during the four pause ticks, then moves on the first resumed tick.
7. A rightward grapple throw near the right rope rebounds through the existing rope system.
8. Simultaneous close-range Action presses start two normal strikes and never create a one-sided grapple.
9. Chromium verifies the contextual path and leaves its screenshot on the throw-impact frame.
