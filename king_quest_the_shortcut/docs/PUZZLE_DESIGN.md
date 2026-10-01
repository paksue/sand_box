# Puzzle Design — The Moon Bell

## Doctrine

This must play like a classic fantasy graphical adventure.

The dominant loop is:
**observe world → form idea → try physical/social action → see result → revise → progress**.

Never:
objective → global menu → collect flags → click prewritten conclusion.

## Seven tests
Every major puzzle must pass:
1. Fairness
2. Causality
3. Aha
4. Agency
5. Integration
6. Alternatives where appropriate
7. Consequence

## P1 — Flooded Mill Crossing

### Player question
How do I get across the river now that the bridge is broken?

### Observable clues
- missing footbridge span;
- jammed wheel;
- spare beam;
- rope/capstan;
- sluice gauge and water marks;
- ferry landing sign indicating dusk service.

### Valid routes
A. Help Bram free the wheel, release rope, secure beam, cross repaired span.
B. Understand sluice marks, lower water briefly, cross exposed stones before flow returns.
C. Wait until dusk and take ferry.

### Aha
The mill is not background decoration: changing water/mechanical state changes the crossing.

### Wrong-but-reasonable
Try beam without securing it → unstable feedback.
Open wrong sluice state → water rises / Bram warns / recoverable.
Wait → world advances, not game over.

### Consequences
Bram help/favor; time differences; item availability; later dialogue.

## P2 — Moving Crossroads

### Player question
Why do all three "castle" paths return me here?

### Observable clues
- signposts change orientation after a loop;
- courier stone and ancient oak never move;
- thread/chalk marker remains on tree;
- daytime birds ignore sign direction;
- after dusk moonmoths drift toward the true deeper path.

### Valid routes
A. Mark stable landmark and infer signs move; choose route relative to fixed oak/courier stone.
B. After dusk, follow moonmoths as fallback.
C. Strong True-Path Lantern can reveal the glamoured edge if acquired via an unusual order.

### Aha
The forest moves the signs, not the ancient boundary.

### Consequence
Earlier solution saves time; late fallback changes downstream schedules.

## P3 — Light for Whispering Hollow

### Player question
How can I cross a place where visible paths lie?

### Valid routes
A. Help Ysabet recover Mallow → lantern lent willingly.
B. Observe her absence → take/borrow lantern without permission.
C. After dusk make/use glowjar.

### Aha
The needed property is **true-path light**, not a specific inventory object.

### Consequences
Permission/knowledge, Ysabet availability, later hidden details, timing.

### Important
Do not offer "Steal lantern / Be honest" menu choices. The cottage and object exist in the world; player acts.

## P4 — Moonwell

### Player question
How do I wake a dry well that reacts only after dusk?

### Observable clues
- closed moonflowers before dusk, open after;
- reflective socket;
- three moon-rings;
- chapel mural showing moonbeam → disc → well;
- live beam visibly moves when ring/disc changes.

### Valid routes
A. Use mirror or moon-disc and align rings to direct beam into basin.
B. If Mara helped Ysabet, receive a vial of Moonwater from her after dusk.

### Aha
The "water" is produced by directing moonlight through the old mechanism.

### Wrong-but-reasonable
Try in daylight → readable response that time/state is wrong.
Use nonreflective object → physical rejection, not generic "can't use."

### Consequence
Moonwater opens helpful routes and late recovery options.

## P5 — Brindle's Bridge

### Player question
How do I cross the locked moss bridge?

### State
Brindle sleeps before 19:15 and wakes after.

### Valid routes
A. Before wake: take/use visible bridge key near his nest.
B. Awake: use Moonwater to free thorn-swallowed toll bell; Brindle opens gate and grants bridge charm.
C. With True-Path Lantern: reveal old pilgrim ledge and bypass gate.

### Aha
Schedule and magical tool change the physical routes, not merely dialogue.

### Consequence
Brindle remembers what he plausibly observed. Bridge charm may simplify late tower state.

## P6 — Castle / Moon Bell

### Player question
How do I get inside and ring the bell in the world state I created?

### Arrival states
Before 21:00:
- main gate open, Sella present.

After 21:00:
- main gate shut;
- briar stronger;
- old courier postern becomes main route.

### Entry routes
- on-time: Sun Key + credible Bellkeeper errand;
- late: discover postern through chapel clue / True-Path light, unlock with Sun Key.

### Tower states
On-time: normal release.
Late: briar-bound mechanism.
Optional earlier rewards simplify late state:
- Moonwater loosens briar;
- Bridge charm calms briar;
- True-Path Lantern reveals old release catch;
- Bram rope scrap can repair a damaged pull if that state is present.

### Aha
The whole journey prepared the final mechanism; there is no arbitrary final riddle.

### Consequence
Timing and route affect epilogue and which characters/favors mattered.

## Optional temptation — Ysabet's Moon-Glass Cabinet

Only include if it can be implemented without bloating scope.

A visibly special moon-glass tool offers a powerful shortcut. The player can leave it, ask about it, or trespass/take it if access permits. It may reveal hidden paths faster but creates plausible later evidence.

Do not make this required.

## Hint ladder

Each puzzle tracks its own hint level.

1. Environmental nudge: point attention to a discrepancy.
2. Direct observation hint: identify a relevant object/state.
3. Explicit experiment: suggest what to try, not the final thematic conclusion.

Hints are player-requested. Never announce the private temptation or exact route list as an objective.

## Anti-patterns
- no parser-like wording guesses;
- no invisible hotspot smaller than a reasonable click/touch target;
- no mandatory arbitrary item combo;
- no one-shot miss that makes the save unwinnable;
- no generic "you can't do that" for reasonable experiments;
- no puzzle whose solution is printed on its action button;
- no giant destination roster;
- no lore dump that substitutes for observation.
