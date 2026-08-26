# THE RULE — Agent Map

This folder is a self-contained browser game milestone.

## Product north star
The player makes moral decisions. Each explanation becomes a rule. The game remembers the rule and constructs later cases that stress-test it.

The game must feel like a cinematic adversary, not a philosophy quiz.

## Read first
1. `PRODUCT.md` — player fantasy, tone, design constraints.
2. `MILESTONE_1.json` — executable acceptance target.
3. `QUALITY_RUBRIC.json` — evaluator rubric.
4. `LOOP.md` — iteration protocol and stop conditions.

## Architecture contract
- `core.mjs` owns moral state, rules, predictions, contradictions, serialization.
- `app.mjs` owns orchestration and presentation only.
- Phaser owns canvas animation, camera, particles, lighting-like effects and scene rendering.
- HTML/CSS owns readable controls, rulebook, text, accessibility and responsive layout.
- Content text may call `core.mjs`; presentation must never become the source of moral truth.
- No backend. No login. No API keys.
- Milestone 1 must work from GitHub Pages as static files.

## Change discipline
- Do not weaken tests or acceptance criteria to make a failing build pass.
- Add or update tests when changing moral-engine behavior.
- Prefer one canonical implementation over parallel abstractions.
- Treat screenshots/real play as required evidence for visual completion.
- If three iterations improve implementation but not the experience rubric, stop polishing and reconsider the design.
