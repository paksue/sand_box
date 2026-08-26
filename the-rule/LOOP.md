# JUSTICE LOOP

## Inner loop — correctness
1. Read current milestone failures.
2. Implement the smallest coherent change.
3. Run syntax checks.
4. Run pure-engine tests.
5. Fix failures before adding scope.

## Browser loop — experience
1. Open from static hosting.
2. Play the full current golden path using real controls.
3. Capture key screenshots at phone portrait and desktop widths.
4. Inspect console/runtime errors.
5. Grade against `QUALITY_RUBRIC.json`.
6. Feed only concrete findings into the next implementation iteration.

## Meta loop — every 3 to 5 implementation iterations
Run three independent critiques:
- Architecture: state ownership, duplication, scene/UI coupling, unnecessary abstractions.
- Experience: boredom, exposition, unclear cause/effect, weak emotional beats.
- Simplification: what can be deleted while preserving or improving the experience?

## Stop / pivot rules
- Never claim completion from code inspection alone for visual gates.
- After 3 iterations with no rubric improvement, stop polishing the same solution and change the design approach.
- Stop an automated loop on repeated identical failure, infrastructure failure, or inability to produce new evidence.
- Do not weaken an evaluator or remove a gate to achieve a pass.
- Human sign-off is required for impact, originality and player-pull gates.

## Durable memory
Each iteration should leave:
- passing/failing milestone gates,
- concise findings,
- changed files,
- test evidence,
- unresolved design questions.

Git history is the canonical iteration history.
