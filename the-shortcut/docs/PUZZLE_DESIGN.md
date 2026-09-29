# Puzzle Design Doctrine

The POC must be an adventure game, not a sequence of morality dialogue boxes.

## Sierra lessons to preserve
- KQ I: object/world logic and alternate solutions.
- KQ III: schedules and authority absence as the puzzle.
- KQ IV: time/world-state changes alter what is possible.
- KQ VI: cross-location dependencies, alternate routes, and remembered outcomes.

We copy design principles, not puzzle content.

## Core puzzle set
### P1 — How behind am I?
Before stand-up, determine Daniel's real situation using source state, task history, requirements, yesterday's messages, and test output. Stand-up still proceeds if the player remains ignorant.

### P2 — Sarah's matching algorithm
Solve by asking Sarah, deriving from requirements/sample data, or observing Sarah's routine and inspecting her implementation while she is away. Routes differ in time cost, evidence, trust, and credit.

### P3 — QA failure
A recent QA configuration is a plausible false hypothesis. Comparing test output, config, code, and prior expectations reveals Daniel's defect.

### P4 — Private message
The challenge is whether to pursue information that is visibly private. Reading it must unlock useful information later so the temptation is real.

### P5 — Timeline contradiction
Compare Git history, task tracker, chat timestamps, QA upload time, and local state. Some records are editable; some are effectively permanent. Insight: changing one record cannot make every source agree.

### P6 — Production mismatch
Clue chain: duplicate-name failures → Sarah library returns candidate sets → Daniel wrapper assumes a single result → prior tests lacked duplicates. False hypothesis: Sarah's library is broken. Valid technical responses include correcting wrapper, rollback, and safe temporary handling; social response remains separate.

## Puzzle contract
Every major puzzle specifies:
- player question;
- observable clues;
- false but plausible hypothesis;
- intended aha;
- valid solutions;
- optional discoveries;
- story consequences;
- failure/recovery behavior;
- hint ladder.

## Hint ladder
1. Environmental clue.
2. Direct clue available through deliberate inspection/conversation.
3. Optional stronger hint after evidence of being stuck.

## Seven quality tests
1. Fairness.
2. Causality.
3. Aha.
4. Agency.
5. Integration.
6. Alternatives where appropriate.
7. Consequence.

## Anti-patterns
No arbitrary logic without setup, pixel hunting, hidden one-time unwinnable states, dialogue giving the solution, fake alternatives, or puzzle objects buried in decorative clutter.
