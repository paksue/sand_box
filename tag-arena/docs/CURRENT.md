# Tag Arena — Current State

## Phase
Phase -1: AI development harness.

## Active branch
`agent/tag-arena-ai-harness`

## Goal of this branch
Prove that the project can be changed from ChatGPT web, validated in GitHub Actions, exercised in real Chromium, and reviewed from uploaded evidence.

## Implemented on this branch
- project-level AI instructions
- product constitution
- architecture contract

## Being built now
- deterministic placeholder simulation
- seedable RNG
- canvas renderer
- `window.__TAG_ARENA__` debug/control bridge
- Node unit + architecture tests
- Playwright Chromium smoke test
- CI artifact bundle

## Explicitly not part of Phase -1
- real fighting mechanics
- final art
- character roster
- networking
- accounts/backend
- progression/economy

## Exit criteria
Phase -1 is complete when CI can:
1. prove deterministic state for a known seed and inputs;
2. launch the game in Chromium;
3. drive Player 1 through the debug bridge;
4. verify numerical movement;
5. save a screenshot and JSON playtest report;
6. expose enough evidence for ChatGPT to diagnose a deliberately introduced failure.

## Next phase
Phase 0: two placeholder fighters; movement, collision, one attack, knockback, and rope rebound.
