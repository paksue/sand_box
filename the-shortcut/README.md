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

The documents in `docs/` remain the approved creative source of truth. Implementation status is recorded below.

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

## Milestone 02 — The Conference in graybox

The full 08:47–17:15 day is playable. Only placeholder geometry and characters are used. No final art or Milestone 03 puzzle expansion is included.

- Use **Interact** (or click an object/NPC) to approach a workstation, person, noticeboard, infrastructure desk or elevator. This also supplies keyboard access outside Debug.
- Inspect Daniel’s source, requirements, yesterday’s chat and test output. Join stand-up through the noticeboard at 09:00.
- Workstation apps group Work, Messages, Records and Incident actions. The notebook retains evidence, the day log and optional hints.
- Open object/NPC inspections pause the clock. Authored actions show their game-minute costs. **Wait to next moment** advances to the next schedule/story boundary; it is a normal player control, not a debug cheat.
- Sarah’s 09:40–09:50 coffee opportunity and Kevin’s 12:00–12:30 private-message opportunity are optional. Asking Sarah or independent derivation remain available after missing coffee.
- Luis supplies infrastructure access. Technical recovery (patch, rollback, holding ambiguous rows) and team disclosure use separate interactions.
- At 16:10 reply to Mark from Messages. At 17:15 approach the elevator to reconstruct the day. Ignored problems remain in the handover; they do not create a softlock.
- Debug exposes state, schedules and JSON export. Backward time jumps change schedules but do not erase already recorded events; reset to replay a fresh day.

`src/content/story.ts` owns authored action definitions, records, characters and beat times. `src/simulation/story.ts` owns serializable truth, claims, evidence, NPC knowledge/beliefs, directional NPC→Daniel relationships, observations and consequences. The original movement reducer and R3F boundary remain. R3F reads the live 20 Hz simulation; DOM subscribers publish on actions, minute boundaries, story changes, arrival and autosave instead of every movement tick.

Save envelope v1 is retained for compatibility, with a versioned `story.schema = 1` extension. An M01 save without that extension initializes narrative state at its saved time; unsupported/malformed data is rejected. M01 saves have no narrative choices to reconstruct. New saves preserve the entire day, including open interactions, evidence, relationships and ending.

The infrastructure audit distinguishes Daniel’s previously deployed wrapper from today’s unfinished feature build. This lets the scheduled production incident occur even if Daniel never uploads today’s work. Luis isolates unresolved production at closing; the report records that fallback instead of crediting Daniel with a repair.

### Verification

```sh
npm run build
npm test                 # original M01 tests plus narrative regressions
npm run test:browser     # unchanged M01 browser suite
npm run test:story-browser
```

Browser tests use Playwright Chromium; set `CHROMIUM_PATH` if supplying a compatible local executable. The M02 browser suite performs four complete normal-control routes without debug time or state injection, saves/reloads at multiple story points, checks console/page errors and captures screenshots. Results and exact acceptance mapping: [evidence/milestone-02/ACCEPTANCE.md](evidence/milestone-02/ACCEPTANCE.md).

Known scope limits: this is an authored graybox, not final visual production; human 35–50 minute pacing and independent blind-player puzzle quality are not yet validated. The deterministic test routes use the normal wait control to skip idle time. Characters use schedule anchors rather than final walking/acting animation. Cross-browser/device testing beyond the documented Chromium desktop/mobile-viewports remains outstanding. The pre-existing Three.js bundle-size advisory remains non-blocking.
