# The Shortcut: The Moon Bell

An original client-side fantasy graphical adventure. Imported from `paksue/sand_box`, branch `sites/the-shortcut-moon-bell`, commit `a8f1cf4173613330c7746d4ef7b9aa244d01a4ad`.

The deterministic simulation, P1–P6, inventory provenance, NPC memories, alternate routes, local saves and epilogue are retained. ChatGPT Sites is the live build workspace. The GitHub migration branch remains a frozen reference; this project does not push changes back there.

## Play

Click the ground to move Mara. Click an object to look, then choose a contextual action. Select an item in the Satchel and click its target. Tab/Enter/Space activate the same scene objects. I opens the Satchel; H reveals currently visible hotspots and a touch-friendly scene-object strip. Escape closes panels or cancels item use. Reading does not advance the clock. Menu contains Save, Restore and New adventure.

Local browser saves use the preserved `the-shortcut:moon-bell:v2` schema. A save on the old GitHub Pages origin is separate from the new Site origin.

## Develop and validate

`npm ci`, `npm run dev`, `npm run build`, `npm test`.

`CHROMIUM_PATH=/path/to/chromium node --import tsx tests/sites-browser.ts` runs the production browser suite with a local static server in the same process. It exercises four UI routes, schedules, save/reload, artwork loading and responsive layouts.

Paintings live in `public/art/`. State-dependent actors/props and phase lighting live in `src/render/`; `layout.ts` registers visual/hotspot anchors to each plate without changing the simulation. `evidence/sites/` contains fresh fantasy evidence.

## Sites hosting

`.openai/hosting.json` binds this source to the owner-private Site. Vite builds portable relative asset paths into `dist/`; Sites serves that directory as static assets. No backend, database, runtime keys or in-game accounts.
