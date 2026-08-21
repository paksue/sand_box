# Tag Arena — Current State

## Phase
Phase -1: AI development harness — verified.

## Active branch
`agent/tag-arena-ai-harness`

## Goal of this branch
Prove that the project can be changed from ChatGPT web, validated in GitHub Actions, exercised in real Chromium, and reviewed from uploaded evidence.

## Implemented and verified
- project-level AI instructions
- product constitution
- architecture contract
- deterministic placeholder simulation
- seedable RNG
- canvas renderer
- `window.__TAG_ARENA__` debug/control bridge
- Node unit + architecture tests
- Playwright Chromium smoke test
- screenshot + JSON CI artifact bundle

## Verification evidence
GitHub Actions run #7 completed successfully on 2026-08-21.

Browser smoke test:
- seed: `48129`
- tick: `0 -> 12`
- P1 x: `180 -> 228`
- exact delta: `48 px`
- browser console errors: `0`
- uploaded artifacts: `harness.png`, `playtest-report.json`

The screenshot and report were inspected from the uploaded CI artifact, not inferred from job status alone.

## Explicitly not part of Phase -1
- real fighting mechanics
- final art
- character roster
- networking
- accounts/backend
- progression/economy

## Phase -1 exit criteria
Completed:
1. deterministic state for a known seed and input sequence;
2. real Chromium launch in CI;
3. browser control through the debug bridge;
4. numerical movement verification;
5. screenshot and JSON playtest evidence;
6. ChatGPT-accessible CI/job/artifact inspection.

## Next phase
Phase 0: two placeholder fighters; movement, collision, one attack, knockback, and rope rebound.

Phase 0 should begin as a separate small branch after this harness PR is accepted.
