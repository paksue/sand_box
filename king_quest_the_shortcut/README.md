# The Shortcut: The Moon Bell

An original Sierra/King’s Quest-inspired fantasy graphical adventure. The imported simulation and story remain intact: Mara travels through ten locations, solves six connected puzzles through alternate routes, meets NPCs whose schedules and memories respond to her actions, and carries those choices into the fairy-tale ending.

## Current state

The Checkpoint 4 paintings and phase artwork are integrated into the playable game. Recorded migration and route QA is summarized in [`evidence/sites/ACCEPTANCE.md`](evidence/sites/ACCEPTANCE.md). The current interface and animation work focuses on the opening Vale Locksmith scene; the other nine rooms retain their earlier controls. See [`evidence/village-v2/REVIEW.md`](evidence/village-v2/REVIEW.md) for the latest opening-screen changes and recorded checks.

The ChatGPT Sites checkout is the working source and its preview remains private. The GitHub folder `paksue/sand_box/king_quest_the_shortcut` is a source-only reference copy; it is not deployed with GitHub Pages. See [`SITES_MIGRATION.md`](SITES_MIGRATION.md) for the original migration contract and its status.

## Play

In the opening village, choose Walk, Look, Hand, or Talk, then click the scene. Mara walks to people and objects before acting. Use keys 1–4 or right-click to cycle cursors; arrow keys move her. F10 reveals the compact toolbar, I opens the satchel, H reveals visible objects, Tab/Enter activate scene objects, and Escape cancels or closes. Select a satchel item to use it on a scene object.

In the other rooms, click the ground to move; click an object to look and open any available contextual actions. I opens the satchel, H reveals visible hotspots, and Escape closes or cancels. Reading and menus pause the game clock.

Saves are local to the browser and use the preserved `the-shortcut:moon-bell:v2` schema. A save from the old GitHub Pages origin is separate from a save on the Site origin.

## Develop and validate

```sh
npm ci
npm run dev
npm run build
npm test
```

The production browser suite can be run with:

```sh
CHROMIUM_PATH=/path/to/chromium node --import tsx tests/sites-browser.ts
```

It exercises the four major route styles, schedule and save boundaries, artwork loading, and responsive layouts. For recorded results and limitations, see [`docs/QUALITY_GATES.md`](docs/QUALITY_GATES.md).

Painted environments and actor art live in `public/art/`. `src/render/layout.ts` registers scene artwork and hotspots together. Simulation rules live under `src/simulation/`; current rendering and interface details are summarized in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md). The full documentation map is [`docs/README.md`](docs/README.md).

## ChatGPT Sites hosting

`.openai/hosting.json` binds this source to the private Site. Vite builds portable relative asset paths into `dist/`, which Sites serves as static assets. The game has no backend, database, runtime keys, or in-game accounts.
