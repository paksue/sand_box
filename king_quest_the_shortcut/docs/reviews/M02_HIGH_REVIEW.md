# Milestone 02 independent high review

**Decision: HOLD the design-quality gate. M02 demonstrates a completable story skeleton; it does not yet demonstrate a strong adventure game.** Proceed only to an explicitly authorized M03 redesign/puzzle pass, not final art. This review proposes changes; it does not amend approved design documents or implement them.

Reviewed on 2026-09-29 (America/New_York), against latest `main` at review start: **`1b9ce4f96e4b7783b86e2a2845c2619a264dbaad`**. Scope: `the-shortcut/` only. Review perspectives: senior narrative design, classic adventure puzzles, systems/continuity, and adversarial playtesting. These are separate analytical passes by one reviewer, not claims of multiple independent testers.

## 1. Findings first

The strongest foundation is the separation of technical recovery from public explanation. Keeping a service running, assigning responsibility, and preserving relationships can be different problems. The recorded provenance, persistent claims, optional missed opportunities, and fail-forward ending also deserve preservation.

The central weakness is that **the player mostly acquires flags and selects authored conclusions**. The interface names the relevant evidence, shows the solution before it is earned, and enables that solution after the required reading. The office supplies locations for menus more often than problems to understand. Several nominal consequences exist only in stored fields or retrospective prose.

The morning does not materially shape the production incident. The current implementation deliberately makes yesterday's deployed wrapper the cause, independently of today's matching route, QA decisions, claims, and upload. This solves a completion problem while weakening the story's promised escalation. Meanwhile, the easiest cooperative matching route finishes before the copying route and all three reach the same QA slot. The titular shortcut has little practical attraction.

There are also verified state-order failures: disclose the cause and then blame Sarah, and the ending says the reverse happened; correct the task and then falsify it, and the ending calls the correction later. At closing, substantial actions can complete for zero elapsed time. These undermine the authority of the behavioral reconstruction and the meaning of schedules.

### Severity and gate assessment

“Blocking” below means blocking approval of the M03 design outcome, not demanding implementation in this review PR.

| Gate | Assessment | Reason |
| --- | --- | --- |
| A — Story | **Hold** | Central incident is largely detached from morning agency; some consequences and chronology are unreliable. |
| B — Puzzle web | **Fail at present** | No core puzzle requires the player to demonstrate the intended inference; hints and action labels frequently supply it. |
| C — Graybox | **Completable, qualified** | Four complete normal-action reducer routes finish. Existing browser evidence supports M02 completion. Completableness does not establish fairness, engagement, or causal quality. |
| E — Character continuity, preliminary | **Hold** | Voices have a useful starting distinction; wants, schedules, audience knowledge, and accumulated grievances rarely control behavior. |
| G — Playtest | **Partial** | Build and 15 tests pass; additional adversarial failures reproduced. Fresh browser and human blind-player validation remain outstanding. |

## 2. Review method and evidence limits

Read `AGENTS.md`, all requested design documents, the M02/M03 milestone specifications, `KINGS_QUEST_REFERENCES.md`, README, all story content and simulation code, interaction/render code, tests, and M02 acceptance/results. Inspected the four committed route saves and representative desktop/mobile captures. Relevant entry points:

| Reference | What it establishes |
| --- | --- |
| [Story content](../../src/content/story.ts) | Record wording, action labels, prerequisites, costs, timed beats. |
| [Story simulation](../../src/simulation/story.ts) | Availability, knowledge, consequences, reconstruction, objectives, hints. |
| [Game reducer](../../src/simulation/game.ts) | Walking, wait boundaries, clock behavior, save handling. |
| [World](../../src/content/world.ts) and [scene](../../src/render/Scene.tsx) | Spatial opportunities, schedules, placeholder staging. |
| [Main UI](../../src/main.tsx) and [StoryPanel](../../src/ui/StoryPanel.tsx) | Global selector, visible solutions, notebook, ending. |
| [M02 acceptance](../../evidence/milestone-02/ACCEPTANCE.md) | Implementation team's claims, limitations, prior fixes. |
| [Browser results](../../evidence/milestone-02/browser-results.json) and [route script](../../tests/story-browser.mjs) | Four scripted browser routes and fourteen recorded save/reload checkpoints. |
| [Arrival](../../evidence/milestone-02/full-arrival.png), [timeline](../../evidence/milestone-02/full-timeline.png), [private message](../../evidence/milestone-02/full-private.png), [recovery](../../evidence/milestone-02/full-recovery.png) | Existing visual evidence used for interaction/pacing critique. |
| [Full ending](../../evidence/milestone-02/full-ending.png), [quiet ending](../../evidence/milestone-02/quiet-ending.png), [mobile ending](../../evidence/milestone-02/full-mobile-ending.png) | Reconstruction density and presentation. |

Fresh verification:

- `npm run build`: PASS, with the existing bundle-size advisory.
- `npm test`: **15/15 PASS**.
- Four end-to-end reducer replays used only normal `inspect`, movement `tick`, `story`, `dismiss`, and `wait` actions, with serialization round trips. No debug `time` action, flag injection, or constructed midgame save was used in those replays. All finished. This is **simulation-level playthrough evidence, not a new browser pass**.
- Separate small `act`/`advanceStory` probes isolated state-order problems. A combined normal-control reducer route then reproduced the disclosure-order and closing-time exploits without debug jumps.
- The repository's existing browser evidence was reviewed, not regenerated or overwritten. A fresh Playwright Chromium install returned an empty/truncated archive; no compatible installed Chromium was available. A package-manager fallback also failed. Consequently, fresh pointer/keyboard behavior, console errors, and rendered UI were not independently revalidated in this review.
- This is informed adversarial review after reading the design, **not blind-solver validation**. No claim is made that human completion takes 35–50 minutes or that new players find the clues fair.

The King's Quest comparisons below use the principles explicitly adopted in [the project's reference study](../KINGS_QUEST_REFERENCES.md) and [puzzle doctrine](../PUZZLE_DESIGN.md). They are qualitative design comparisons, not measured equivalence to those games. The linked external walkthroughs could not be retrieved during this review; no new historical verification is claimed.

## 3. Blocking design problems

### B1 — The crisis is scheduled, but the player's morning does not cause or meaningfully alter it

**Evidence:** `advanceStory`, incident branch, always sets `production = "wrong totals"` and creates the same yesterday-at-16:05 deployment audit. `diagnose` and the P6 records always identify the same wrapper assumption. Neither morning route nor QA repair feeds that decision. Ignoring the entire morning, then investigating and patching, produces `matching: unfinished` alongside `production: correct totals; feature active`.

Separating an existing production job from today's unfinished build is technically plausible. The failure is dramatic causality and naming: that distinction arrives mainly at the crisis, and a “feature active” recovery can coexist with the feature never being implemented. P3 teaches an empty-candidate failure; P6 teaches a multiple-candidate failure. The player cannot apply that broader contract insight early enough to change exposure.

**Required M03 change:** retain the existing deployed-wrapper premise, but establish it in P1 and distinguish the existing job, today's demo build, and deployed revision throughout. Seed the coming production workload and let morning validation/review/release handling change whether the defect reaches it, how many rows are affected, or how quickly it can be contained. Preserve the 14:20 dramatic checkpoint as an incident, a contained alert, or a demonstrated near miss according to state. A player who tests the right case early must not be forced to rediscover the same defect later.

**Acceptance:** compare a careless fast route, an early diagnostic route, and a no-work route. Before any afternoon recovery choice, at least two must have different operational states and available responses, with an intelligible causal trace. Preserve responsibility for Daniel's existing wrapper; do not invent a new culprit to punish a successful player.

### B2 — The dominant puzzle mechanic is “read the listed records, click the answer”

**Evidence:** `assess`, `derive`, `qa-fix`, `compare`, and `diagnose` test possession of flags. `StoryPanel.shown` keeps unmet-prerequisite actions visible; `unavailableReason` lists missing records. Labels include “Retain unresolved rows” and “Reproduce duplicate names against the library contract.” P5's source descriptions already explain why editing cannot reconcile the audit.

The player can follow the enabled-button sequence without interpreting a row, constructing a test, reconciling a timestamp, or choosing a hypothesis. Reading can be a valid adventure activity; here it usually substitutes for the inference the design promises.

**Required M03 change:** replace automatic solution buttons with small, authored work surfaces: choose specimen rows, run a comparison, inspect the returned result, and enact a proposed operation. Use simple domain language and a tiny deterministic data set; do not build a programming IDE or require software-engineering knowledge. Accept a valid inference without demanding every possible clue. Incorrect experiments should yield informative results and remain recoverable.

**Acceptance:** someone who merely opens every document cannot auto-complete P2, P3, P5, or P6. Each requires an observable reasoning action, and each correct result has a legible causal explanation.

### B3 — Time and social costs are mostly cosmetic, and closing removes time costs entirely

**Evidence:** normal-action replays finished matching at **09:45 with Sarah, 09:48 by copying, and 10:05 independently**, all before the common 10:30 QA slot. Asking costs 25 minutes, but Sarah's own integration does not actually lose a slot or move. Copying costs fewer work minutes but its later availability erases the expected speed advantage. The 12-minute QA diversion changes the clock and prose, not Maya's later work availability. “Investigation time shifts” after accusing Sarah has a one-minute action cost and no corresponding colleague task simulation.

`act` clamps action completion to 1035. Once 17:15 arrives, eligible work can be performed without advancing the clock. With diagnosis/access already acquired, wait until closing, patch production, read requirements/samples, derive the matcher, and leave: all post-closing actions finish at 17:15. The verified normal-control replay does this after Luis's emergency isolation.

**Required M03 change:** define a small set of visible commitments: Sarah's own review, Maya's queue, the production workload, Luis's authorized window, and the handover. Actions consume or reschedule these resources. At closing, stop accepting new work or explicitly extend into an overtime/handover state with real duration and character availability. Process schedule crossings consistently for conversations, copying, repairs, and notification access.

**Acceptance:** no positive-cost action can complete instantly because of the day cap; waiting cannot improve an unresolved incident for free; an advertised time cost must affect a reachable commitment. Missing a window must still offer a costlier recovery route, not a hidden dead end.

### B4 — Order-insensitive flags falsify the ending and some NPC beliefs

**Verified reproductions:**

| Route fragment | Actual result | Why blocking |
| --- | --- | --- |
| Diagnose → `incident-tell` → `incident-blame` → patch → ending | Ending: “You first directed suspicion toward Sarah, then corrected the team's explanation.” Sarah thanks Daniel; Maya/Kevin currently suspect the library. | The actual order is the reverse. A later accusation is effectively forgiven by an earlier disclosure flag. |
| Compare → `correct-record` → `edit-task` | Ending says a **later** dated correction remains beside the edit. | An earlier correction cannot retract a subsequent falsification. |
| Accuse Sarah → diagnose → `incident-tell` before repair | Team beliefs update, but observation has `correction: false`. | Prior correction fixes do not cover this immediate-disclosure route. |
| Leave production unresolved → at 16:10 choose `mark-short` | Mark responds “Stable is useful” while truth remains `wrong totals`. | A lie may be allowed, but the response should reflect what Mark verified or merely accepted, not silently validate it. |

**Required M03 change:** derive current beliefs and reconstruction from ordered communications with explicit audience, claim/retraction links, and supersession. Preserve conflicting claims rather than letting `disclosed` function as permanent absolution. Record a correction against the specific earlier assertion, including immediate disclosure after blame. Sarah can appreciate the repair while remaining angry about a later accusation or workstation access.

**Acceptance:** replay accusation→disclosure, disclosure→accusation, correction→edit, edit→correction, and repeated topic changes. The summary must describe the true order and unresolved contradiction; knowledge and current belief must be distinguishable. No “first/then/later” sentence may be derived merely from the presence of two flags.

### B5 — The interface supplies the route and makes the office optional

**Evidence:** the global “Nearby interactions” list contains every named object and NPC, including absent people. It still walks Daniel to an anchor—it is **not teleportation**—but discovery is replaced by choosing a known destination. Objectives enumerate matching routes and advertise Kevin's private message. The player is told to inspect the exact records and often sees the conclusion while the action is still disabled.

**Required M03 change:** remove the global omniscient destination/action list from the default experience. Preserve keyboard and screen-reader access through a scene-local, spatially ordered focus list with the same discoverability and presence rules as pointer interaction. An optional hotspot reveal should mark visible affordances without naming undiscovered answers. Keep objectives about Daniel's problem, not the designer's required click sequence.

**Acceptance:** a tester using either input method discovers Sarah's routine and Kevin's notification through observable circumstances, can explain why a destination matters, and does not learn absent actors or puzzle solutions from a global menu.

## 4. Puzzle-by-puzzle review

Ratings concern the implemented experience: **Pass** = meaningful evidence; **Partial** = useful foundation with a material weakness; **Fail** = the intended test is not met. “Alternatives” does not require gratuitous alternate solutions to every small puzzle. P4 is judged as an optional temptation encounter, not forced into a riddle.

| Puzzle | Fairness | Causality | Aha | Agency | Integration | Alternatives | Consequence |
| --- | --- | --- | --- | --- | --- | --- | --- |
| P1 — How behind am I? | Partial | Partial | Fail | Partial | Partial | Partial | Partial |
| P2 — Matching | Partial | Partial | Fail | Partial | Partial | Partial | Partial |
| P3 — QA failure | Partial | Partial | Fail | Partial | Partial | Partial | Partial |
| P4 — Private message | Partial | Partial | Fail as puzzle | Partial | Partial | Partial | Fail on useful payoff |
| P5 — Timeline | Partial | Partial | Fail | Partial | Partial | Partial | Partial |
| P6 — Production | Partial | Fail across the day | Partial concept, fail enactment | Partial | Partial | Partial | Partial |

### P1 — How behind am I?

- **Fairness:** relevant material is available before nine and ignorance does not block stand-up. However, the opening already states the feature is unfinished, the source says TODO, and the test record says 0/6. Four mandatory reads to enable `assess` are redundant. The precise truthful stand-up answer is offered even without inspection.
- **Causality:** the records coherently explain missed work, but `assessed` does not meaningfully change later handling. The displayed task is initially accurate; the real discrepancy is yesterday's promise versus actual work, not a mysterious inconsistent tracker.
- **Aha:** clicking Compare supplies the conclusion. There is no uncertain estimate, misleading passing subcomponent, or distinction between “integration exists” and “matcher works” for the player to resolve.
- **Agency:** four utterances and silence are useful; the player cannot substantiate a limited claim with a working artifact, revise an estimate, or negotiate a concrete scope/build time.
- **Integration:** a credible opening to this story, weakened by generic records and the failure to establish yesterday's production deployment.
- **Alternatives:** ignorance is allowed, but evidence possession does not create a meaningful informed route. A shorter diagnostic path should be valid.
- **Consequence:** Mark's confidence changes and the claim is remembered. His “reserve the afternoon” instruction does not actually reschedule Maya; truthful admission has mainly nominal cost.

**M03 prescription:** show a limited working integration and a failing required behavior. Let the player run a short demo/test and compare it with the promised acceptance condition. Stand-up can then attach that result, give an estimate, or make an unsupported claim. Put yesterday's deployed consumer and today's pending build side by side. Remove `assess` as a compulsory four-record collection gate; retain a notebook summary as optional assistance. A negotiated reduced demo scope should alter an afternoon obligation.

### P2 — Sarah's matching algorithm

- **Fairness:** asking and independent derivation remain after missing coffee, which is good. The schedule is explicitly printed rather than discovered. “Derive” needs two read flags, not understanding.
- **Causality:** all three routes produce the same functional state and later QA defect. Provenance persists, but code sharing, workstation permission, and authorship are conflated.
- **Aha:** the intended insight—stable account identity matters more than a name—is written on the action. No sample requires the player to apply it.
- **Agency:** three routes exist; within each, Daniel completes the work automatically. There is no permission request to inspect Sarah's branch, interrupted copying decision, or response to being caught.
- **Integration:** Sarah's expertise fits her role. Her professed competing integration work is not a real commitment. Common workplace reuse is not inherently dishonest; the specific boundary crossed must be clear.
- **Alternatives:** costs/provenance differ, but earliest completion favors asking and all routes converge before QA. Their opportunity costs need differentiation.
- **Consequence:** copied signatures and a late witness are recorded. Yet independent derivation still offers `credit`, awards Sarah confidence, and records “Sarah acknowledged.” A generic commit message is automatically interpreted as “Daniel only.” These are poor proxies for authorship and intent.

**M03 prescription:** give the player a small ledger with repeated names and stable account identifiers. Require matching or unresolved tagging through that surface. Sarah can teach one relationship while sacrificing a named review slot; independent work consumes a longer available window; her unattended local branch offers genuinely earlier access to a useful shortcut or test fixture. Make permission, technical reuse, acknowledgment, and claimed authorship separate facts. Allow requesting the shared branch without using her workstation. Model being noticed according to presence and exposure duration, including lingering after inspection, and offer a believable response.

### P3 — QA failure

- **Fairness:** expected versus actual behavior is intelligible and the repro persists. Requiring the configuration record before applying a directly demonstrated empty-result fix is an arbitrary evidence gate.
- **Causality:** an empty-candidate branch dropping rows is a coherent defect. The locale change is a plausible initial lead, but the inspection text and UI quickly discredit it. Every matching route still produces the flaw even though requirements and samples already say to preserve unmatched rows.
- **Aha:** the action “Retain unresolved rows” reveals the repair before the player establishes where the row vanished.
- **Agency:** the player can ask Maya to revert, defer, or apply the fix. They cannot independently rerun the same input under both locales, inspect input/output counts, or formulate a provisional hypothesis separately from assigning fault.
- **Integration:** Maya's evidence-first voice works. `qa-defer` says “I need to finish the matcher first” even though QA failure requires a submitted build, which requires matching and commit. This line contradicts the reachable state.
- **Alternatives:** false lead, repair, and postponement exist. The false lead always consumes exactly twelve minutes and is classified as protecting apparent progress, even if a player sincerely wants to eliminate an environmental variable.
- **Consequence:** the diversion/correction is remembered, but Maya's retest queue and later assistance do not reflect it.

**M03 prescription:** expose a controlled comparison: same row, two locales; then local and QA outputs. Let the player follow the missing row and select “retain unresolved” as an operation after seeing the result. An alternate sufficient evidence path should work without collecting config. Distinguish asking for a test from asserting Maya caused the fault. Let the wasted/recovered slot affect her availability or verification capacity. Keep the missed-row fix transferable to P6's zero/one/many candidate model.

### P4 — Private message

- **Fairness:** privacy and the optional window are clear; skipping it does not strand the player. The global objective advertising it turns a private temptation into an apparent assignment.
- **Causality:** Kevin's lunch and visible preview establish opportunity. His trace-help request does not actually gate or contextualize access; Daniel can open the private thread without first helping him.
- **Aha:** there is no deduction. That is acceptable for an interlude, but it should not count as one of six demonstrated reasoning puzzles.
- **Agency:** reading is an enacted action and walking away is possible. After reading, the system declares how Daniel feels rather than letting the information change a practical decision.
- **Integration:** Sarah's worry about becoming the cleanup person is relevant. The explicit gossip preview and immediately available “If Mark asks you to lead” line make the scenario feel staged for a moral test.
- **Alternatives:** leave it alone/read are genuine actions; a normal public conversation about workload or future responsibility is missing. Ordinary career conversation is artificially locked behind illicit knowledge.
- **Consequence:** reading unlocks `lead-talk` and `mark-lead`, but neither yields a useful operational advantage. Sarah becomes suspicious; Mark defers the discussion. This fails the doctrine's requirement that private knowledge unlock something useful enough to tempt.

**M03 prescription:** treat P4 as an optional character encounter attached to legitimate API-trace help. Remove it from the mandatory objective chain. Keep the private preview local to Kevin's screen; do not make reading it the only route to a leadership discussion. The information should let the player anticipate an unannounced handover responsibility and prepare a useful artifact or negotiate ownership earlier. A slower public route to that opportunity should also exist. If a credible payoff cannot fit this POC, cut the current lead-dialogue branch rather than retaining a privacy quiz with token rewards.

### P5 — Timeline contradiction

- **Fairness:** audit permanence is explained clearly—so clearly that it reveals the entire intended insight before any comparison. Four records are short descriptions of record systems, not a timeline the player reconstructs.
- **Causality:** editing one display cannot change independent records, a strong premise. But a later commit/upload alone does not disprove that work was complete earlier; genuine contradiction requires evidence of unfinished behavior or a claim about submission. The baseline source snapshot matters and must be distinguished from current source.
- **Aha:** `compare` calculates the chronology and delivers its lesson. The player does not associate a claim with the record that supports or refutes it.
- **Agency:** one conspicuous falsification and one correction are offered. There is no truthful selective report, partial disclosure, evidence attachment, or inquiry into who has already seen which version.
- **Integration:** good potential for self-investigation. At 13:30 the same “different stories” prompt appears even after a truthful stand-up, or when no build was made. That can manufacture guilt or a puzzle where the history actually agrees.
- **Alternatives:** editing, correcting, or doing nothing are possible, but the insight has only one collection route. Records inexplicably become readable only at 13:30 instead of accumulating naturally.
- **Consequence:** the task edit and independent audit persist. The correction-before-edit exploit misreports order. No actor meaningfully benefits from or initially relies on the misleading task display, so editing is nearly all downside after its futility has been explained.

**M03 prescription:** use actual event rows from the current playthrough: claim, baseline test, implementation, commit, upload, edit, acknowledgment. Let the player assemble a handover by attaching records to assertions, not answering a moral question. Mark may initially read a summary while Maya has the upload ledger; exposure should follow those channels. Preserve immutable audit history. A truthful route can confirm consistency and discover the old deployed revision's relevance rather than being forced through a contradiction. Allow correcting the latest misleading version even after an earlier correction.

### P6 — Production mismatch

- **Fairness:** duplicate names, candidate sets, the first-element wrapper, and missing fixtures form the best latent clue chain. However, requiring all four evidence flags rejects a correct inference with fewer clues. Recovery and safety options are easy to discover.
- **Causality:** the local bug explanation works; the full-day causal relationship fails B1. Patch output also conflates restored production capability with completion of today's feature.
- **Aha:** “the library returned a valid set; the caller misused it” is a worthwhile insight. Current records, action names, and automatic reproduction tell it instead of letting the player discover it.
- **Agency:** technical/social responses are separated, a genuine strength. However, immediate warning of uncertainty is impossible: `incident-tell` requires full diagnosis and a specific confession. Accusing the library is available sooner. This artificially privileges blame over responsible provisional communication.
- **Integration:** using P2's identity insight and P3's boundary cases could make a strong climax. Those earlier insights currently cannot change the crisis. Sarah's contract conversation grants a flag, not collaborative investigation.
- **Alternatives:** patch, rollback, and hold have different recorded outcomes. Rollback can occur before diagnosis, correctly. But once any recovery sets `recovered`, all others are disabled: stabilize by rollback/hold and then deploy a tested fix—the obvious competent workflow—is impossible.
- **Consequence:** rollback removes capability and hold leaves a queue, but the queue, verification work, and demo losses are not enacted. B4 makes later social consequences unreliable; Luis rescues an ignored incident only at closing without a developing escalation.

**M03 prescription:** let players choose failing rows and run the library and wrapper separately; compare candidate sets and posted totals. Allow a provisional alert and containment before attribution. Split containment, diagnosis, permanent repair, backlog resolution, and verified recovery into distinct stages. Preserve mutually exclusive simultaneous deployments, not permanently exclusive recovery strategies. Make the manual queue or reduced demo a visible remaining task with an owner. Let early work change this encounter, including avoiding bad totals.

## 5. Character and continuity findings

| Character | What works | What currently makes them a function | Exact M03 direction |
| --- | --- | --- | --- |
| Daniel | Avoidance, technical competence, and public/private behavior fit the premise. | Automatically solves technical problems; opening tells him the answer; observation metadata often assigns motive regardless of knowledge. | Let the player demonstrate competence and uncertainty. Record asserted claim, evidence known, audience, and actual outcome; avoid declaring “protect apparent progress” for every diagnostic request or brief reply. |
| Sarah | Precise contract language; ambition and fear of cleanup are coherent. | Unlimited useful help outside a ten-minute coffee break; own work never visibly suffers; gratitude takes priority over earlier grievances. | Give her one visible independent deliverable and a negotiated help commitment. Preserve mixed reactions to credit, access, accusation, repair, and privacy clues. Asking for credit cannot automatically settle unauthorized desk use. |
| Maya | Repro-first dialogue, retained evidence, plausible initial uncertainty. | A report dispenser and fixed twelve-minute penalty; her locale suspicion persists despite a failed revert; “matcher unfinished” defer line is impossible. | Give her an actual queue and an updated hypothesis after each test. Distinguish Daniel's explanation from her independently observed result; let verification arrive through a defined message/upload channel. |
| Kevin | Friendly API-help exchange suggests reciprocity. | Mostly supplies private information and follows a library accusation without independent work. Helping him stores warmth that does not influence later options. | Make the earlier favor produce a bounded technical/witness contribution later: e.g. he can fetch a relevant prior job log while Daniel handles containment. Let him resist being made mediator and revise a hypothesis when evidence arrives. |
| Mark | Compact questions about status and risk fit a busy manager. | Morning admission changes a number more than his plan; all handovers receive a brief canned response; one answer locks the conversation even when he requests details. | Tie morning estimates to scope/QA commitments. Let handover attach current risks, receive a specific request, and permit follow-up. Separate thread delivery from Mark reading it during travel. Do not give a generic approving response to unverified stability. |
| Luis | Deployment audit and procedural recovery permission are credible. | Effectively a three-minute key; access remains usable after he is gone; his rescue arrives on a clock rather than operational evidence. | Make access a legible authorization/window with a fallback. Have him announce escalation and containment based on the continuing incident. Credit his intervention and distinguish what he witnessed from what was explained. |

### Knowledge needs sources, timing, and belief revision

`team()` immediately distributes knowledge to everyone except Luis, including Mark while travelling. A sent team message may plausibly be available to him, but “available in thread” and “read/understood” are not equivalent. The return event is already intended to model reading on landing; use it consistently. Similarly, `credit` immediately gives Sarah knowledge and confidence without an acknowledgment event. This may be abstracted, but then the abstraction needs a visible notification and consistent timing.

`challenge-blame` at Sarah's conversation immediately updates the whole team even though its line says “I should correct the thread.” Either enact sending the correction or keep that statement private until sent. For an office game about who knows what, this distinction is gameplay.

The latest global `story.message` is rendered inside every inspected actor/object panel. That can carry another person's line into an unrelated conversation. Use a shared event feed only where clearly identified, and local responses in local interactions. Sarah's panel says she stops typing even at the elevator; Mark's inspection can still describe his suitcase by the door after departure. Condition first-look text on place and schedule.

P1's source/test entries remain 08:47 snapshots even when first inspected after the build passes. The test text labels itself baseline, which is good; “Local source” is less clear. Keep historical evidence immutable, display event time separately from collection time, and offer a current-state view so a solved task does not look unfinished. Do not overwrite history to fix the presentation.

## 6. Interaction, pacing, and adventure identity

### King's Quest lessons: present in outline, weak in operation

| Reference principle | Current implementation | Assessment and improvement |
| --- | --- | --- |
| KQ III: observe routines, plan under authority's absence | Mark leaves; Sarah has a coffee window; costs are printed; Wait targets known boundaries. | **Not comparably structural.** Mark's presence does not materially constrain early work; helping is gated until 09:20 regardless. A printed rota and Wait button do most of the planning. Make routines observable, commitments compete, and an interrupted action produce a recoverable consequence. Preserve pause-on-reading and avoid unforgiving real-time traps. |
| KQ IV: revisiting a changed world changes possibilities | Actor anchors/visibility and timed action lists change. | **Mostly menu changes.** Morning/afternoon reuse the same room and evidence surfaces without much transformed meaning. Revisit the QA station as a blocked queue, the workstation as an audited history, and infrastructure as a live containment problem. Graybox indicators suffice for M03; final art is not required. |
| KQ VI: alternate routes, cross-location dependencies, remembered outcomes | Three matching routes, three recoveries, flags and elevator variants. | **A foundation, not yet a comparable web.** Cross-location dependencies largely mean fetching flags; route history seldom opens or closes later methods. Let Sarah's available time, Kevin's returned favor, Maya's verification, and evidence provenance change how the same crisis can be solved. Fold the plot while retaining operational differences. |

### The game currently invites compliance more than exploration

The default loop is objective → global target → records → enabled action → Wait. That is closer to a narrated workflow with moral choices than to an adventure in which the player forms a plan. Removing the selector alone would merely add walking to the same checklist. Pair scene-local interaction with real hypotheses, contextual tool use, and stateful revisits.

The screenshots show a readable graybox and a largely visible room when panels are closed. Final-art quality is deliberately out of scope. The workstation panel dominates most puzzle activity and consists of rows of full-width buttons. Its problem is the interaction structure, not its color or opacity. Replace button lists with compact playable records and evidence surfaces; avoid simply reskinning a task dashboard.

### Objectives and hints disclose too much, sometimes before the player asks

- Initial objective names every P1 record; the opening already supplies the answer.
- Matching objective explicitly lists ask/derive/coffee, bypassing discovery.
- Midday objective promotes the private message to the day's main task, even after it is read or deliberately ignored.
- QA objective names the precise comparison; disabled actions show the repair.
- P5 hint states the intended immutable-audit insight directly.
- Hints alternate using one global counter rather than a per-puzzle, evidence-sensitive ladder. They can remain about a solved problem.

**Replace with three layers:** problem statement first; player-requested nudge toward a discrepancy second; explicit next experiment only after another request. Track per-puzzle help and solved state. Do not require a hidden stuck timer before offering accessibility assistance. A suggested opening objective is “Mark expects a usable build. What can I actually show?”—not a list of files to collect.

### Pacing is not validated by the clock

The authored day is 508 game minutes. At six game seconds per real second, doing nothing would take about **84 minutes 40 seconds**, excluding reading pauses. Meaningful actions skip time and Wait skips gaps, so neither the day length nor automated route duration establishes a 35–50-minute human experience.

The four reducer routes used 12–13 Wait actions each. There is a substantial gap after early QA repair before Kevin's 11:30 help action, another before 13:30 records, and often another after recovery before Mark lands. Repeated waiting can make the player feel they are triggering scheduled scenes. Move opportunities forward when their prerequisites are satisfied, or fill selected gaps with consequential optional work. Do not pad with more reading or longer walking.

The notebook does not itself pause the simulation: only `s.inspection` stops clock ticks. Opening it from the room can therefore spend an opportunity while opening it over an inspection does not. Standardize the rule for all reading surfaces and state it clearly. Also show what event the player proposes to wait for and warn about a known expiring commitment. The current wait-target list includes Kevin's lunch return but omits Maya's 13:00 return.

### Reasonable things the player cannot presently try

| Player intention | Current obstacle | Recommended response |
| --- | --- | --- |
| Test a suspected duplicate-name issue before the incident | P6 records/actions unlock at 14:20. | Permit early experiments using available samples; reward foresight with changed exposure. |
| Ask for Sarah's shared code without using her workstation | Only the 25-minute help action or unattended adaptation. | Offer permission/read-only sharing with a meaningful time or dependency cost. |
| Answer Sarah when she catches desk use | A witness line is recorded, without follow-up. | Permit explanation, admission, or backing away, conditioned on what she saw. |
| Eliminate the locale hypothesis without implying Maya is at fault | One request is classified as blame. | Separate test request, provisional hypothesis, and public attribution. |
| Warn the team while still uncertain | Specific own-fault disclosure requires diagnosis. | Allow “totals are wrong; please pause this job; cause unconfirmed.” |
| Roll back now, patch after testing | `recovered` disables all further recovery methods. | Separate containment from final repair. |
| Correct a new false statement after correcting an earlier one | One-shot actions and persistent correction flags. | Allow a dated update linked to the new claim. |
| Supply details after Mark asks for them | `markAnswered` removes all remaining replies. | Permit a short follow-up handover with actual outstanding work. |
| Ignore the private message yet discuss ownership | Relevant leadership line requires `private`. | Preserve ordinary public conversation; private information changes timing/specificity. |

## 7. Ending: facts first, interpretation restrained

The ending's lack of a numeric score and its attention to repair versus disclosure are appropriate. The prior fix correctly treats authorized deployments as public repairs rather than covert acts. Preserve that distinction. The existing report nevertheless reads as an audit checklist, with raw identifiers such as `fix-wrapper`, repeated low-oversight labels, and an explicit “No verdict” assurance. It often explains the thematic lesson instead of letting the day make it felt.

The bigger issue is accuracy: B4's false chronology makes even neutral wording preachy, because the system is claiming authority it has not earned. `observe` also attaches motive-like benefit/rationalization fields from action IDs. A sincere wrong hypothesis and a deliberate diversion are not the same observed behavior. A private inspection is not proof of a stable personality trait.

**M03 ending changes:**

1. Fix event-order/audience correctness before writing new evaluative prose.
2. Show three to five selected contrasts: what Daniel knew, what he said, what changed, and what remains. Let the player expand the full audit rather than always displaying the whole log.
3. Describe evidence and order, not diagnoses of character. For example, “You requested a locale rerun before inspecting the empty-result branch” is supported; a motive is not necessarily supported.
4. Name tangible remaining obligations: queued ambiguous rows, disabled demo capability, Sarah's delayed work, or Maya's pending verification. These must come from enacted state, not invented ending flavor.
5. Let Sarah hold mixed views. Gratitude for containment can coexist with “Ask before using my workstation.” A later repair should not erase a later accusation or an unrelated boundary breach.
6. Put the elevator scene before the expandable record. Remove redundant “No verdict” framing and raw action IDs. A brief, specific human exchange should carry the emotional ending.

## 8. Exact recommended M03 work order

This is a proposed implementation brief for a future authorized pass. This PR changes only this review.

| Order | Change | Main owners | Required observable result |
| --- | --- | --- | --- |
| 1 | Establish production/demo/build identities and morning-to-incident causality (B1). | Story content, story simulation, puzzle design proposal. | Early validation or containment changes the 14:20 state; no-work remains completable with explicit cost. |
| 2 | Replace permanent disclosure/correction flags as the source of current truth; close the zero-time ending exploit (B3/B4). | Story simulation and reducer. | Ordered claims, correct audience beliefs, no impossible chronology, no free late work. |
| 3 | Build one shared small ledger/test surface for P2/P3/P6. | Content, simulation, workstation UI. | Player selects examples/operations and learns from outputs; technical knowledge is accessible without writing code. |
| 4 | Rework P1 into a demonstrable progress assessment and P5 into a playthrough-derived evidence handover. | Content, records UI, claim/evidence state. | Partial success is distinguishable from promised completion; a valid inference need not collect every record. |
| 5 | Add only a few consequential commitments and make route tradeoffs real. | Schedules, action costs, NPC task state. | Sarah's help, Maya's queue, Kevin's contribution, and Luis's window affect later methods and costs. |
| 6 | Replace global discovery/solution lists; implement per-puzzle optional hints. | Main UI, StoryPanel, objectives/hints. | Scene-first exploration with equal keyboard access; no unsolicited solution or private-message objective. |
| 7 | Reframe P4 as optional information temptation with a concrete, nonexclusive payoff, or cut its token reward branch. | Content, ownership/handover state. | Reading can confer an understandable advantage; declining remains viable and interesting. |
| 8 | Condition dialogue/first-look text on current state, preserve mixed relationships, and stage a restrained ending. | Content, knowledge propagation, reconstruction. | People react to what they observed, retain their own work, and do not erase unrelated grievances. |
| 9 | Run adversarial route permutations and genuinely blind human puzzle/pacing sessions. | Test/acceptance process. | Seven-test evidence for each puzzle and observed 35–50-minute pacing, with failures recorded rather than assumed away. |

### Mechanics to remove or substantially redesign

- **Remove automatic “compare/diagnose/derive” conclusions as the core puzzle solution.** Retain summaries only as optional assistance after meaningful experiments.
- **Remove the default global omniscient Interact roster.** Preserve an accessible scene-local equivalent and optional hotspot visibility.
- **Remove raw prerequisite inventories under unreached solution actions.** Show contextual affordances and optional hints instead.
- **Replace the single `recovered` lock with containment/repair/verification stages.** Do not forbid a sound sequential recovery plan.
- **Remove P4 from the mandatory-feeling objective chain.** Do not count a privacy decision as proof of deduction quality.
- **Replace binary credit/no-credit inference from generic commit text.** Track actual contribution, permission, acknowledgment, and authored claims.
- **Replace theme-summary ending boilerplate with selected factual contrasts and a human scene.** Keep the complete audit expandable.

### Proposed M03 acceptance scenarios

These are new gates to implement and verify later, not tests added by this PR.

1. **Causal trio:** replay careful, expedient, and idle mornings. Compare the 14:20 world before recovery; explain every difference using a recorded earlier event.
2. **Deduction without collection:** solve P3 and P6 via a sufficient short clue path; unrelated unread records must not block a correct experiment. Blind players must state the inference in their own words.
3. **Wrong but reasonable experiments:** test locale, suspect the library, match by name, and inspect an irrelevant timestamp. Each yields coherent feedback rather than a dead end or automatic moral classification.
4. **Time boundaries:** begin each long action just before a commitment, coffee return, lunch return, and closing. Check interruption/completion, witnesses, costs, recovery, and save/reload on both sides.
5. **Communications order:** test both orders of disclosure/accusation and correction/edit; include a later retraction, private discussion without sending, and Mark reading after landing. Final beliefs and summaries must match the actual latest unresolved claims.
6. **Operational alternatives:** contain by rollback or hold, then repair and clear/hand over remaining work. Compare against direct patch and Luis's fail-forward intervention.
7. **Mixed relationships:** Sarah helps, Daniel accesses her desk, acknowledges her, accuses her, then repairs. Her behavior must retain supported, potentially conflicting memories rather than picking one positive flag.
8. **Discovery/input parity:** complete core discovery through the scene with pointer and keyboard; inspect mobile layouts. No solution is exposed only by an accessibility list, and no required object relies on pixel hunting.
9. **Blind pacing:** recruit at least three fresh players, including someone without a software background. Record active reasoning time, reading, waiting, requested hints, abandoned hypotheses, and completion time. Ask which early action changed the afternoon and which puzzle required an inference. Treat this small sample as diagnostic evidence, not statistical validation.

## 9. Final recommendation

Keep the confined workday, believable technical/social stakes, persistent evidence, and separation of recovery from explanation. Do not add more rooms, more moral dimensions, or final art to compensate for the current interaction loop.

The highest-value M03 is a focused redesign: **make the player discover one reusable technical idea, apply it under competing human commitments, and see the resulting workday change**. Until that is demonstrated—and the reconstruction reliably tells the truth about action order—the project has a functional narrative prototype rather than an approved adventure-game experience.
