# AGENTS.md — The Shortcut: The Moon Bell

This directory now contains an **original fantasy graphical-adventure game** inspired by the design craft of Sierra's King's Quest III–VI.

## Absolute creative directive

**THE SHORTCUT IS A FANTASY ADVENTURE GAME FIRST.**

The workplace prototype ("The Conference") is obsolete creative content. It may remain in Git history and old evidence/review files, but it is **not** a source of story, characters, locations, puzzles, tone, UI, or art direction.

Do not reskin office mechanics with medieval nouns. Build an actual fairy-tale adventure: physical places, exploration, inventory, NPC routines, magic with understandable rules, revisiting changed locations, alternate solutions, environmental clues, and consequences enacted through the world.

## Product
- Title: **The Shortcut: The Moon Bell**
- Client-side-only browser game.
- Host: GitHub Pages in `paksue/sand_box`.
- Target playtime: roughly 35–55 minutes for a first successful run.
- One complete story, beginning to ending.
- Runtime: React + TypeScript + Vite + React Three Fiber/Three.js.
- No backend, database, authentication, or runtime secret keys.
- Current office implementation may be refactored aggressively at the content/UI layer.
- Preserve useful engine foundations: deterministic time, save/versioning, simulation/render separation, NPC knowledge, schedules, branch-and-fold state, browser QA.

## Required reading order
1. `docs/VISION.md`
2. `docs/WORLD.md`
3. `docs/STORY.md`
4. `docs/CHARACTERS.md`
5. `docs/ITEMS_MAGIC.md`
6. `docs/PUZZLE_DESIGN.md`
7. `docs/PUZZLE_GRAPH.md`
8. `docs/INTERACTION_DESIGN.md`
9. `docs/STATE_MODEL.md`
10. `docs/VISUAL_BIBLE.md`
11. `docs/QUALITY_GATES.md`
12. `docs/ONE_SHOT_BUILD.md`

If an older office-era document, review, test, or evidence file conflicts with these, **these fantasy-reboot documents win**.

## Design DNA to preserve
- KQ III: learn routines, exploit or respect absence, plan around time.
- KQ IV: revisit a world changed by dusk/night.
- KQ VI: alternate routes, cross-location dependencies, remembered consequences.
- Classic Sierra: readable scenes, inventory/object logic, fairy-tale humor, danger, surprise, and strong authored composition.
- Modern correction: no arbitrary pixel hunting, no secret unwinnable states, no parser-guessing, no unfair dead-man-walking saves.

We copy principles, never copyrighted characters, maps, dialogue, art, or puzzle solutions.

## Non-negotiable creative rules
- No office, software engineering, QA, conference, corporate dashboard, task tracker, chat app, or workplace-simulator content in the live game.
- No morality meter.
- No GOOD/BAD choice labels.
- Do not turn choices into questionnaires when the player can enact them in the scene.
- Do not build a generic RPG: no combat system, levels, crafting tree, open world, stats, loot rarity, or skill tree.
- Do not build a programming simulator or productivity interface.
- World interaction and exploration must dominate.
- Important objects must be visually readable without glowing loot outlines.
- NPCs know only what they plausibly see, hear, infer, or are told.
- Every core puzzle needs a fair clue, an intended insight, a recoverable wrong hypothesis, and at least one satisfying world response.

## Skill routing
- Umbrella: `game-studio`
- Architecture/state: `web-game-foundations`
- React/R3F: `react-three-fiber-game`
- UI/dialogue/inventory: `game-ui-frontend`
- Browser QA: `game-playtest`
- Optional 3D production: `web-3d-asset-pipeline`, `build-3d-game-rooms`

## Visual architecture
Hybrid 2.5D fixed/semi-fixed camera:
- authored or procedural storybook background plates/layers;
- walk/depth/occlusion data;
- realtime player/NPCs;
- selected realtime props;
- atmosphere/FX;
- sparse DOM dialogue/inventory/menu UI.

Blender is optional offline tooling, never a blocker.

## Definition of done
The fantasy build is done only when:
- the entire adventure is playable start-to-finish;
- all core puzzles are solvable without design notes;
- alternate routes and missed windows fail forward;
- time/world-state changes matter;
- save/reload preserves puzzle and schedule state;
- no office-era content appears in normal play;
- the game is unmistakably a fantasy graphical adventure even with provisional art;
- browser tests exercise multiple materially different routes;
- representative screenshots are reviewed;
- no severe console/runtime errors remain.
