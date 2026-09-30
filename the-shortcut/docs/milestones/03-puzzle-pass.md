# Milestone 03 — Puzzle Quality Pass

## Goal

Turn the complete M02 graybox into a genuine adventure-game experience.

M03 is a **design and interaction pass**, not an art pass. Preserve the confined workday, existing story spine, named cast, evidence model, save architecture, and behavioral-reconstruction concept. Do not add final art, voice, new rooms, a broad workplace simulator, a programming IDE, or new morality dimensions.

The approved design input is `docs/reviews/M02_HIGH_REVIEW.md`.

## Director priorities

### 1. Make the morning causally change the afternoon

The 14:20 production event must no longer be identical regardless of the player's morning.

Keep Daniel responsible for the pre-existing deployed wrapper, but establish the distinction among:
- yesterday's deployed production wrapper,
- today's unfinished/demo build,
- the production workload that will expose duplicate-name behavior.

Morning investigation, testing, review, or containment must change the 14:20 operational state. At minimum compare:
- careless/expedient route,
- early diagnostic/careful route,
- no-work route.

At least two must reach 14:20 with materially different production state and available responses. A player who identifies the duplicate-name/candidate-set problem early must not be forced to rediscover it later.

### 2. Replace checklist solving with enacted inference

Opening every record must not automatically solve P2, P3, P5, or P6.

Build **one small reusable workbench mechanic** for P2/P3/P6 using a tiny deterministic ledger/data set. The player should be able to:
- choose or inspect specimen rows,
- run a comparison/test,
- observe returned candidates or missing/ambiguous output,
- choose an operation or hypothesis,
- see informative results for plausible wrong experiments.

Use ordinary language. No coding knowledge or text programming is required.

For P1/P5, use a compact evidence/timeline surface where the player compares actual facts and timestamps rather than clicking a prewritten conclusion.

Correct reasoning should not require collecting every possible clue.

### 3. Make time matter, but keep the simulation small

Model only a few visible commitments:
- Sarah's own work/review commitment,
- Maya's QA queue,
- Luis's recovery authorization/window,
- production/handover state.

Actions that advertise a time cost must affect one of these commitments or a meaningful opportunity.

No positive-cost action may complete for zero time at 17:15. At closing either:
- new work is blocked and handed over, or
- the game enters an explicit overtime/handover state with real elapsed time and actor availability.

Missing a timed opportunity must remain recoverable through a costlier route, never a hidden dead end.

### 4. Make claims, beliefs, and the ending order-aware

Do not infer chronology from permanent flags.

Communications need enough ordered state to represent:
- speaker,
- audience/channel,
- topic,
- claim,
- time,
- correction/retraction link,
- whether the audience has actually read/observed it.

Replays must distinguish:
- accusation → disclosure,
- disclosure → accusation,
- edit → correction,
- correction → later edit,
- private discussion → unsent correction,
- Mark receiving information only after landing/reading.

Current NPC belief must be distinguishable from historical claims.

The behavioral reconstruction must never say “first,” “then,” or “later” merely because two flags are present.

### 5. Restore spatial discovery

Remove the default global omniscient Interact roster.

Normal play should expose only scene-local, currently present interactions. Preserve accessibility with a keyboard/screen-reader scene-local focus list using the same presence/discovery rules as pointer play.

An optional hotspot reveal may show visible affordances, but it must not name undiscovered solutions or absent actors.

Objectives should describe Daniel's problem, not the click sequence.

## Puzzle requirements

### P1 — How behind am I?

Replace the opening checklist with a demonstrable progress assessment.

The player should be able to compare what actually works with what was promised. A short demo/test can reveal partial success versus required completion.

Establish yesterday's deployed wrapper and today's pending build here so the later incident is not a surprise retcon.

Valid informed stand-up responses may attach evidence, estimate remaining time, or negotiate reduced scope. Ignorance/silence remains allowed.

### P2 — Sarah's matching algorithm

Preserve three broad routes:
- ask Sarah,
- derive independently,
- inspect/adapt her implementation while she is away.

The player must apply the stable-identity insight to a concrete sample rather than click “derive.”

Clarify permission/authorship separately:
- asking for help,
- asking for read-only/shared code,
- unauthorized workstation use,
- credit/acknowledgment.

Routes must differ in more than stored metadata: time, Sarah's commitment, provenance, later help, or witness state should matter.

### P3 — QA failure

The locale change remains a plausible false hypothesis.

Allow the player to test locale without automatically “blaming Maya.” Distinguish:
- provisional hypothesis,
- diagnostic test,
- public attribution.

A correct solution should come from comparing the missing row with the wrapper behavior. Reasonable wrong experiments must produce useful feedback.

### P4 — Private message

Treat this as an optional temptation encounter, not proof of puzzle skill.

Do not advertise it as the main objective.

Reading it must provide concrete but nonexclusive utility later; declining must still leave ordinary ownership/leadership conversations available.

Private information may change specificity or timing, not grant a mandatory branch token.

### P5 — Timeline contradiction

The player should reconcile actual timestamps and records on a compact timeline/evidence surface.

At least one editable record and multiple independent immutable records must be visible as separate sources.

The insight—that changing one displayed record cannot reconcile independent evidence—must be demonstrated by the player's comparison, not stated by the action label.

Allow sufficient-short-path reasoning; do not require opening every record if the contradiction is already proven.

### P6 — Production mismatch

Use the same small workbench as P2/P3.

The player should be able to compare:
- duplicate-name inputs,
- candidate-set output,
- Daniel's wrapper behavior,
- prior test coverage.

Preserve the plausible false hypothesis that Sarah's library is broken.

Split operational response into:
1. containment,
2. diagnosis,
3. permanent repair,
4. verification/backlog handover.

Do not make rollback, hold, and patch permanently mutually exclusive if a sensible sequence uses more than one.

Early morning insight may reduce or avoid bad totals, producing a contained alert or near-miss instead of forcing identical failure.

## Character continuity

Do not expand the cast or add large side systems. Improve reactions through existing state.

- **Sarah:** one visible competing commitment; help has a cost; preserve mixed reactions to help, credit, workstation access, accusation, repair, and privacy.
- **Maya:** maintain a small QA queue and revise hypotheses after tests; distinguish Daniel's claim from her observed result.
- **Kevin:** prior help can yield one bounded later contribution such as retrieving a log or corroborating timing.
- **Mark:** morning estimate/scope affects later expectations; his handover can request one follow-up rather than becoming permanently locked after one reply.
- **Luis:** access is a visible authorization/window with a fallback; distinguish what he witnessed from what Daniel explained.

Knowledge propagation must respect source, timing, and audience. A sent message is not automatically the same as every NPC having read and believed it.

## Hint and objective policy

Use a per-puzzle three-rung ladder:
1. problem/environment clue,
2. deliberate nudge toward a discrepancy,
3. explicit next experiment only when the player asks again.

Track help per puzzle and solved state.

Do not expose private-message opportunities, exact required records, or solution text in unsolicited objectives.

Example opening objective:

> Mark expects a usable build. What can Daniel actually show at stand-up?

## Ending

Stage the human elevator beat before the expandable audit.

The default ending should show only 3–5 factual contrasts chosen from enacted state:
- what Daniel knew,
- what he said,
- what changed,
- what remains unresolved.

Avoid motive diagnosis unless directly supported. Prefer factual chronology such as:
> You requested a locale rerun before inspecting the empty-result branch.

The full audit can remain expandable.

Do not display raw action IDs. Remove redundant “No verdict” framing.

Sarah may hold mixed views; a good repair does not erase a later accusation or unrelated boundary violation.

## Required adversarial scenarios

Implement automated/state tests for at least:

1. Careful, expedient, and idle mornings produce intelligible differences at 14:20.
2. Correct P3/P6 inference succeeds without opening every unrelated record.
3. Plausible wrong experiments provide coherent feedback and recovery.
4. Long actions crossing coffee/lunch/recovery/closing boundaries behave consistently.
5. Accusation→disclosure and disclosure→accusation produce different final beliefs and summaries.
6. Edit→correction and correction→later edit preserve true chronology.
7. Private discussion without sending does not update the whole team.
8. Rollback/hold containment may be followed by later patch/verification when state allows.
9. Sarah can simultaneously remember help/credit and remain upset about workstation access or accusation.
10. Pointer and keyboard discovery expose the same scene-local interactions without solution leakage.
11. Save/reload works on both sides of timed commitments and after ordered communications.

## Human playtest gate

Automated routes are necessary but not sufficient.

Before M03 is approved for M04 art production, conduct at least one genuinely blind human playtest; target three if practical, including one player without a software background.

Record:
- completion time,
- requested hints,
- wrong hypotheses,
- abandoned actions,
- where the player was bored/confused,
- which puzzle produced an “aha,”
- which early action they believe changed the afternoon.

The target remains roughly 35–50 minutes, but treat the small sample as diagnostic rather than statistical proof.

## Acceptance

M03 passes only when:

- every major puzzle passes fairness, causality, aha, agency, integration, alternatives where appropriate, and consequence;
- P2/P3/P5/P6 require an observable reasoning action, not only record possession;
- morning state materially changes the 14:20 encounter;
- no required route depends on arbitrary guessing, pixel hunting, or a hidden one-shot unwinnable state;
- timed commitments have real consequences without creating dead ends;
- ordered claims/beliefs/reconstruction remain chronologically correct under adversarial permutations;
- the normal interaction loop is scene-first rather than global-menu-first;
- P4 remains optional and useful without becoming mandatory;
- the ending is factual, concise, and state-derived;
- M01/M02 save architecture and simulation/render separation remain intact;
- final art is still deferred.

After implementation: run an independent adversarial critique and the human playtest gate before approving Milestone 04.
