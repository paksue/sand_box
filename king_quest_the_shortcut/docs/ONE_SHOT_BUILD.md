# ONE-SHOT BUILD BRIEF — The Shortcut: The Moon Bell

## Mission
In one implementation pass, transform the existing office prototype into a complete playable fantasy graphical adventure.

Do not merely reskin the office. Replace the live content, locations, cast, puzzles, and normal UI with the fantasy game defined in the authoritative docs.

## Preserve where useful
- React/TypeScript/Vite/R3F;
- client-side hosting;
- deterministic clock;
- simulation/render separation;
- save/versioning infrastructure;
- schedules and explicit NPC memory;
- debug/state tools;
- browser QA harness.

## Remove from normal play
Daniel, Sarah, Maya, Kevin, Mark, Luis, the office, workstations, QA/source/deployment fiction, corporate tabs, global omniscient interaction lists, and the office behavioral reconstruction.

## Required live game
Implement:
- Mara and Aldus opening;
- Bram;
- Ysabet;
- Mallow;
- Brindle;
- Captain Sella;
- Pip if useful;
- all L1–L10 locations;
- P1–P6;
- inventory;
- afternoon→dusk→moonrise→late phases;
- NPC schedules;
- multiple valid routes;
- epilogue callbacks.

## Scene requirement
Do not use one room for the whole kingdom.
Every location needs a distinct fixed/semi-fixed fantasy composition, walkable area, visible exits, puzzle props, and relevant phase changes.

Provisional art may use Three.js/SVG/CSS/gradients/simple geometry, but screenshots must clearly look like a fantasy adventure.

## Input
Pointer/touch:
- click ground to walk;
- click visible object/NPC;
- click exits when reachable.

Keyboard:
- scene-local focusable interaction list using the same availability rules;
- Enter activate, Escape close;
- inventory fully usable.

No global list of every object/NPC in the game.

## Inventory
Implement Sun Key, thread, mirror, blue bottle, honey cake, True-Path Lantern, glowjar, moon-disc, Moonwater, bridge charm, and rope/favor state as applicable.
Only show obtained items.

## Puzzle rule
Do not implement solutions as buttons named after conclusions.

The player must manipulate/observe world state:
- mill sluice/wheel/beam;
- mark Crossroads and observe changed signs;
- physically obtain/return lantern;
- rotate Moonwell rings and see beam feedback;
- interact with sleeping/awake Brindle and bridge routes;
- discover/open late postern;
- operate Bell yoke/mechanism.

## Time
Actions/travel consume time.
Boundary crossings trigger schedule/world updates.
No positive-duration action can become zero-duration at a clock cap.
Late play remains completable through explicit changed state.

## Hints
Per-puzzle three-rung, requested by player, adaptive to seen clues.
Objectives stay broad and never list solution routes.

## Epilogue
1. visual/audio payoff from ringing Moon Bell;
2. 3–5 specific callbacks based on route;
3. optional expandable "Your path" chronology.

No score or morality label.

## Required route tests

### A — Helpful/early
Help Bram → solve Crossroads early → return Mallow → borrow lantern with permission → solve Moonwell → help Brindle → main gate before 21:00 → ring bell.

### B — Expedient
Sluice crossing → solve Crossroads → take lantern during Ysabet's absence → mechanical Moonwell → sleeping Brindle key → near-deadline castle → ring bell. Consequences must reflect plausible evidence.

### C — Late/fail-forward
Wait for ferry → moonmoth fallback → glowjar → late bridge route → arrive after 21:00 → courier postern → late Bell mechanism → ring bell.

### D — Minimal-item robustness
Skip at least two optional starter items and confirm alternate paths prevent softlock.

## Boundary tests
Save/reload:
- before/after dusk;
- Ysabet leave/return;
- Brindle sleep/wake;
- 20:59→21:00 castle change;
- late tower;
- borrowed/returned ownership;
- Sun Key persistence.

## Browser acceptance
- production build;
- all tests;
- multiple browser routes if Chromium available;
- console/page-error capture;
- screenshots: Mill, Cottage, Moonwell-night, Brindle Bridge, Castle/Bell Tower, ending;
- mobile smoke test;
- keyboard smoke test;
- Sites asset-path verification.

## ChatGPT Sites

This implementation is imported from the frozen migration snapshot under the contract in `SITES_MIGRATION.md`. Build with portable asset paths and owner-private Sites hosting. Do not push changes back to the GitHub migration branch.

## Definition of success
A user opens the private Site URL and can play from Mara receiving the Sun Key through ringing the Moon Bell, with:
- zero office content in normal play;
- no developer intervention;
- at least three materially different full routes;
- unmistakable fantasy identity;
- fair, enacted puzzles;
- schedule and dusk/night changes that matter.

## Delivery

Deploy the verified build to the owner-private Site. Return the playable private preview and stop for the owner to test. No public publishing until the owner has played and approved it.
