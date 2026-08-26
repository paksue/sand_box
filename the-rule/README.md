# THE RULE — Milestone 1

A client-side moral-pressure game inspired by the reasoning method demonstrated in Michael Sandel's *Justice* lectures.

## Play
GitHub Pages path: `https://paksue.github.io/sand_box/the-rule/`

## Milestone
This build proves one core experience:

**trolley choice → explain why → Rule 01 → bridge test → the rule predicts your next action → contradiction/consistency → mutated case or harder-case cliffhanger**

It is intentionally a vertical slice, not the full course/game.

## Runtime
- Static HTML/CSS/JavaScript only.
- Phaser 4.2.0 from CDN for cinematic canvas rendering.
- DOM overlay for semantic choices, text and rulebook.
- Web Audio API for generated impact cues.
- `localStorage` for client-only run persistence.
- No backend, login, database or API key.

## Architecture
- `core.mjs`: pure moral state, principles, prediction, contradiction and mutation selection.
- `app.mjs`: presentation orchestration, Phaser scene drawing, DOM interaction and audio.
- `tests.mjs`: deterministic pure-engine tests.
- `e2e.spec.mjs`: Playwright golden path, phone layout assertions and screenshot evidence.

## Loop engineering
See:
- `AGENTS.md`
- `MILESTONE_1.json`
- `QUALITY_RUBRIC.json`
- `LOOP.md`

Every change in this folder triggers `.github/workflows/the-rule-validation.yml`, which runs syntax checks, pure-engine tests, static contracts, a Chromium playthrough, desktop/mobile assertions, and screenshot capture.

Automated passes are necessary but do not waive the human taste gates for impact, originality and desire to continue.
