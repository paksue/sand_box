# AGENTS.md — The Shortcut

This directory contains a deliberately authored game. Treat the documents here as production constraints, not suggestions.

## Product
- Client-side-only web game.
- Target host: GitHub Pages from `paksue/sand_box`.
- No backend, database, authentication, or secret runtime API keys.
- POC playtime: 35–50 minutes.
- One complete story: **The Conference**.

## Required working method
1. Read `docs/VISION.md`, then the docs referenced by the milestone.
2. Use the narrowest relevant Game Studio skill.
3. Do not redesign the story, characters, puzzle insights, or visual target while implementing.
4. Make reversible technical decisions independently.
5. Keep simulation state separate from rendering.
6. Prefer data-driven story, dialogue, schedules, interactions, and consequences.
7. Run the build and verify the milestone against its acceptance criteria.
8. For visual milestones, capture screenshots and compare against `docs/VISUAL_BIBLE.md` and `docs/KINGS_QUEST_REFERENCES.md`.
9. For puzzle milestones, play blind enough to confirm that clues support the intended insight without revealing the answer.
10. Do not proceed to a later milestone because the code merely compiles.

## Skill routing
- Umbrella/router: `game-studio`
- Architecture/state: `web-game-foundations`
- React 3D runtime: `react-three-fiber-game`
- UI/HUD/dialogue surfaces: `game-ui-frontend`
- 3D assets: `web-3d-asset-pipeline`
- Authored room construction: `build-3d-game-rooms`
- Browser QA/playtesting: `game-playtest`

Do not mix Phaser and Three.js/R3F implementations. The approved direction is React + TypeScript + Vite + React Three Fiber/Three.js, unless the director docs are explicitly changed.

## Non-negotiable creative rules
- Never show a morality score during play.
- Never label choices GOOD/BAD, HONEST/DISHONEST, etc.
- Do not turn dilemmas into obvious menu quizzes when they can be enacted through the world.
- Dishonest behavior may succeed in the short term.
- Honest behavior may have real cost.
- No secret unwinnable states.
- No giant open world, combat, crafting, platforming, skill tree, or generic SaaS dashboard UI.
- The scene should dominate the viewport.
- Important puzzle objects must read visually; decorative clutter must not masquerade as interaction.
- NPCs only know what they plausibly observed or were told.

## Definition of done for any milestone
A milestone is complete only when:
- its acceptance criteria pass;
- the game boots;
- existing behavior still works;
- no severe console/runtime error remains;
- representative states were actually exercised;
- visual work was screenshot-reviewed;
- puzzle work was tested for fairness, causality, aha, agency, integration, alternatives, and consequence.
