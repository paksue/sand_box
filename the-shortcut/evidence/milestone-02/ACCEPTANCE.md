# Milestone 02 — acceptance evidence

Scope: `the-shortcut/` only, based on main `5cafffc6fe023b3d073e9da0740f3efc6362e362` (completed M01). Approved story/character/puzzle/visual documents remain unchanged. Placeholder geometry only; no Milestone 03 or final art.

## Acceptance matrix

| Requirement | Result | Evidence |
| --- | --- | --- |
| Complete 08:47–17:15 day without developer intervention | PASS | Four end-to-end Chromium routes use only Interact, normal actions and Wait; no debug-time jump or state injection. All finish at the elevator. |
| All dramatic beats | PASS | Arrival; stand-up; departure; matching; QA; private-message opportunity; timeline comparison; production incident; Mark return; reconstruction; Sarah elevator line. Nine timed events plus initial arrival and player-triggered ending. |
| All named NPCs | PASS | Daniel, Sarah Chen, Maya Patel, Kevin Brooks, Mark Ellison, Luis Romero have graybox representation and story interactions. Mark communicates remotely after departure. |
| Schedules and knowledge | PASS | Coffee, stand-up, lunch, infrastructure availability, Mark travel/return and closing affect scene or action availability. Private reading does not give NPCs omniscient knowledge. M01 forward/backward schedule tests still pass. |
| Relationships, evidence, consequences | PASS | Directional NPC→Daniel trust, suspicion, warmth, confidence and resentment; evidence source/time/editability/access/provenance; distinct truth, claims and beliefs. QA diversion costs time; rollback removes feature; temporary handling creates a manual queue. |
| P1: real progress before stand-up | PASS | Inspect requirements/source/yesterday’s message/tests and compare. Stand-up also proceeds if ignored. |
| P2: matching algorithm | PASS | Asking Sarah, independent derivation and unattended adaptation all played through. Different costs, provenance, credit and witness state. |
| P3: QA failure | PASS | Compare missing-row report, locale diff, requirements and empty-result branch; repair and optionally correct Maya’s belief. Full route first pursues the false locale hypothesis. |
| P4: private information | PASS | Open Kevin’s unattended message during lunch; knowledge unlocks later lead-role utterances. Other routes leave it unread and still finish. |
| P5: timeline contradiction | PASS | Collect Git/task/chat/upload records and compare against local source. Edit and subsequent correction preserve independent timestamps and audit evidence. |
| P6: production mismatch | PASS | Duplicate-name log → candidate-set contract → first-candidate wrapper → absent duplicate fixtures → reproduction. Three recovery mechanisms are exercised. |
| Multiple natural stand-up responses | PASS | Four utterances plus non-response; all five tested in simulation. Three utterances exercised in browser routes. |
| At least three materially different incident responses | PASS | Technical: patch / rollback / quarantine ambiguous rows. Social: immediate disclosure / later admission / silence / steering blame. Four browser routes combine these independently. |
| Behavioral reconstruction from player records | PASS | Report consumes recorded claims, observations, facts, repairs and disclosures. It describes order, omissions, consequences and corrections; no fixed morality-ending enum or visible score. Four distinct final state files and ending screenshots. |
| Preserve M01 architecture and tests | PASS | Original simulation and browser test files unchanged and passing. R3F consumes simulation; no gameplay truth in render geometry. |
| Save/reload | PASS | Browser checkpoints after QA, optional private reading, recovery and ending; original M01 suite verifies paused exact round-trip and movement/inspection persistence. Legacy narrative-free saves migrate; malformed saves reject. |
| Console/runtime errors | PASS | Final browser results record an empty error list. Both console errors and page exceptions are collected. |
| Responsive screenshot review | PASS | Desktop graybox, stand-up, QA, private message, timeline, recovery, Mark conversation, four endings and mobile ending captured. M01 mobile regression also passes. |

## Executed checks

- `npm run build` — passes TypeScript and Vite production build. Existing large Three.js bundle advisory remains.
- `npm test` — 12 passing tests: four unchanged M01 regressions and eight narrative tests (several include route matrices).
- `npm run test:browser` — unchanged M01 production-base-path, mesh movement/inspection, schedule, keyboard, save/reload, mobile and corrupt-save checks pass.
- `npm run test:story-browser` — four complete routes, no debug-time or injected simulation state. See `browser-results.json` for exact checkpoint lists.
- `git diff --check` — passes.

Browser: headless Chromium with software WebGL, desktop 1440×900 and mobile viewport 390×844. Environment-specific `CHROMIUM_PATH` was used because the default Playwright browser download returned an empty archive. Browser provisioning files are excluded from the PR.

## Full-story routes

| Route | Matching | Incident recovery | Social response | Private message |
| --- | --- | --- | --- | --- |
| `full` | Sarah helps; credit given | Correct wrapper + duplicate tests | Disclose before patch | Read |
| `independent` | Derive from requirements/samples | Roll back; feature unavailable | Admit after rollback | Unread |
| `quiet` | Adapt unattended code; no credit | Hold ambiguous rows; manual queue | No team disclosure | Unread |
| `blame` | Adapt unattended code; credit given | Correct wrapper | Point team toward Sarah, leave explanation uncorrected | Read |

For each, `*-state.json` is the actual final browser save, not a constructed fixture. The simulations also exercise ignored work, all stand-up lines, late Sarah witness, missing clues, invalid location, expired opportunity, double recovery, malformed saves and M01 migration.

## Separate review passes and fixes

- **Narrative/continuity:** verified knowledge remains distinct from truth; the shared thread carries accusations/corrections. The previously deployed wrapper is separated from today’s unfinished feature so ignoring the morning does not cancel the production incident. Closing isolation is attributed to Luis, never credited as Daniel’s repair.
- **Puzzle/clue review:** P1–P6 have visible evidence and reachable routes. Missed coffee/private windows do not strand the player; explicit wait and optional clues expose timing. Causality and consequences are exercised by alternate paths. This is an implementation-side clue review, not an independent human blind playtest.
- **Visual review:** graybox scene remains dominant outside deliberately opened computer/dialogue surfaces. Fixed header/objective overlap and stale objective text; inspected screenshots for readable choices, scrollable evidence, ending text and mobile bounds. No art-production claims.
- **Exploit/state review:** reducer rejects wrong-place/locked actions and repeated mutually exclusive recovery; legacy saves migrate; time-triggered events do not erase persistent state on a backward debug jump. Re-reading evidence does not charge time or duplicate observations. Sarah can witness copying that crosses her return time.
- **Performance:** the original 20 Hz reducer continues; R3F reads live state. DOM subscribers receive action/story/minute/arrival boundaries and autosave notifications, not every movement step. This avoids making the expanded dialogue/evidence tree rerender 20 times per second.

An intermediate browser run was invalidated by rebuilding its preview assets during reload. It was discarded and the final suite was run against a stable build. Failed-run screenshots are not acceptance evidence.

## Known limitations / deferred work

- Entirely graybox: no final art, voice, animation polish or authored scene plates. Schedule position changes remain simple anchor changes.
- Human 35–50 minute pacing and an independent blind-player puzzle-quality gate remain unvalidated. Automated routes intentionally use the normal wait control.
- Only Chromium and a mobile viewport are covered here, not physical mobile devices or Safari/Firefox.
- Code/testing actions are authored simulation interactions, not an embedded code editor or real production deployment.
- The M01 outer save envelope is retained with a versioned narrative extension. An old save contains no historical narrative choices to recover.
- Backward debug time changes schedules without rewinding accumulated narrative; start a new session for a clean replay.

## Representative captures

- [Arrival](full-arrival.png)
- [Stand-up](full-standup.png)
- [Private message](full-private.png)
- [Timeline comparison](full-timeline.png)
- [Recovery](full-recovery.png)
- [Full route ending](full-ending.png)
- [Rollback ending](independent-ending.png)
- [Quiet recovery ending](quiet-ending.png)
- [Uncorrected blame ending](blame-ending.png)
- [Mobile ending](full-mobile-ending.png)
