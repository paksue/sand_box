# The Shortcut

A client-side browser adventure game inspired by the design craft of classic Sierra adventures, especially King's Quest III–VI, without copying their characters, art, maps, dialogue, or assets.

## POC goal
Ship one polished 35–50 minute story: **The Conference**. The player is Daniel, a software engineer whose manager leaves for a conference after morning stand-up. A mundane lie about unfinished work can expand into a network of choices, clues, temptations, puzzle-solving, social consequences, and an end-of-day behavioral reflection.

## Creative target
“A lost 1993 Sierra CD-ROM adventure, beautifully remastered in 2026.”

The game must combine:
- painterly, authored three-quarter scenes;
- exploration and observation;
- real adventure-game puzzles;
- NPC schedules and time-based opportunities;
- multiple legitimate solutions;
- consequences that persist;
- hidden behavioral modeling without GOOD/EVIL meters;
- a complete authored dramatic arc.

## Start here
1. Read `AGENTS.md`.
2. Read `docs/VISION.md`.
3. Read `docs/STORY.md`, `docs/CHARACTERS.md`, and `docs/PUZZLE_DESIGN.md`.
4. Read `docs/VISUAL_BIBLE.md` and `docs/KINGS_QUEST_REFERENCES.md`.
5. Implement only the current milestone under `docs/milestones/`.

No implementation has been approved yet. This commit is the director package/source of truth.

## Milestone 01 implementation

The architecture/graybox skeleton is implemented; the full story and final art are not part of this build.

Requires Node 22.12+ (tested with Node 24).

```sh
cd the-shortcut
npm ci
npm run dev
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
npm test
npx playwright install chromium
npm run test:browser
```

Production preview: `http://127.0.0.1:4173/sand_box/the-shortcut/`. Deploy the **contents of `dist/`** at `/sand_box/the-shortcut/`; the Vite base resolves assets under that GitHub Pages subdirectory. This milestone does not modify the repository's deployment workflow or publish a site.

Click the clear floor to move Daniel; click either workstation or the noticeboard to approach and inspect. Gold = Daniel, teal = Sarah, mauve = Mark. Debug exposes time controls, NPC locations, inspected-object state, and keyboard-accessible inspection buttons. Pause freezes movement and automatic clock advancement; debug time changes still work while paused. Resume to finish an approach.

Save writes to localStorage; autosave runs every two seconds and on page hide. Reload restores time, pause, position, movement target, pending inspection, current inspection, and inspected-object IDs. Reset asks before replacing the session. Browser saves are local to this origin/device. Invalid or unsupported-version saves start a fresh session with a diagnostic message; schema v1 is the first version, so there is no legacy schema to migrate.

### Boundaries

- `src/content/world.ts`: object definitions, spatial anchors, schedule fixtures, walk bounds.
- `src/simulation/game.ts`: pure fixed-step reducer, schedule derivation, serialization/validation.
- `src/simulation/store.ts`: browser timing, persistence, and subscriptions.
- `src/render/Scene.tsx`: fixed-camera graybox, placeholder characters, click adapters only.
- `src/main.tsx`, `src/ui/`: DOM session controls, inspection and debug UI.
- `tests/`: simulation regression tests and production-build browser acceptance.
- `evidence/`: representative screenshots and acceptance report.

Time advances six game seconds per real second using fixed 50 ms steps. Background suspension does not fast-forward missed wall time. Direct time jumps recompute NPC locations from the content schedule, including backward jumps. Sarah's 09:40–09:50 coffee interval is a provisional **Milestone 01 test fixture**, not an addition to the approved story. NPC placeholders switch between scheduled anchors; authored transitions and dialogue remain later work.
