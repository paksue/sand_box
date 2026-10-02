# Sites migration acceptance — The Shortcut: The Moon Bell

> **Migration/checkpoint baseline.** This records the completed Checkpoint 4/5 migration pass before the later Vale Locksmith cursor, movement, and animation iteration. See [`../village-v2/REVIEW.md`](../village-v2/REVIEW.md) for that follow-up. Recorded QA below has not been rerun by this documentation update.

Source: `paksue/sand_box`, frozen branch `sites/the-shortcut-moon-bell`, imported at `a8f1cf4173613330c7746d4ef7b9aa244d01a4ad`. The migration contract was read first.

## Preservation

`src/content/world.ts` and all three `src/simulation/` files are byte-for-byte identical to the imported source. P1–P6, clocks, route logic, NPC knowledge/memory, inventory/provenance, local save schema and fairy-tale epilogue are preserved. Changes are hosting, presentation and QA.

## Checkpoint 4

Ten painted storybook environment plates are integrated into the playable build in `public/art/`. Eight matching night plates cover the revisitable outdoor scenes; Castle and Tower use their authored twilight/night paintings. Dusk blends toward the night painting; moonrise/late lighting and a live moon layer follow the clock. A transparent painted actor atlas includes Mara, the existing cast, both Brindle states and the relief courier.

`src/render/layout.ts` registers visual and clickable anchors together to the paintings without modifying simulation IDs. Live props disappear when taken and reflect puzzle state. NPC appearance follows the existing schedules. Moonwell water/beam/ring directions, moonflowers, bridge gate, toll-bell thorns, late tower briar and release catch follow state. The dormant Moonwell is dry. Returned Mallow appears in the coop.

## Checkpoint 5 QA

- Production TypeScript/Vite build: PASS.
- Existing simulation/route suite: 15/15 PASS.
- Browser UI Helpful/Early: ending reached at 19:49, repaired Mill and helped Brindle.
- Browser UI Expedient: ending reached at 21:03, sluice/lantern/key route; near-deadline actions continue into the late tower state.
- Browser UI Late/fail-forward: ending reached at 21:25 through courier postern, with Moonwater loosening late briar.
- Browser UI Minimal-item: ending reached at 21:19; no optional starter items, physical hen/lantern/pilgrim-ledge route, keyboard activation of scene and inventory interactions.
- Save/reload: entire completed route state restored exactly; fixtures cover dusk, Ysabet leave/return, Brindle sleep/wake, 21:00 castle transition and late tower.
- All ten base plates, eight night plates and the actor atlas decode successfully. Browser assertions decode every referenced SVG image.
- Pointer target registration, inventory use, visible-object controls, keyboard Enter/Escape: PASS.
- 390×844 phone, 768×1024 tablet and 1920×1080 desktop: no horizontal overflow; take/save/reload interactions PASS.
- Console/page errors captured during the four full routes: none.
- Fresh fantasy screenshots replace the obsolete office evidence. Representative Cottage, Bridge, Moonwell-night, Tower, full scene contact sheet and phone screenshots visually inspected.

Browser engine: Chromium 153. Other engines and a blind first-time human playtest remain owner review work. The contract requests stopping at the private preview.

## Hosting and access

Portable relative Vite assets replace the GitHub Pages base. Sites static hosting serves `dist/`, bound by `.openai/hosting.json`. The game remains client-side. The Site is deployed through the owner-private operation; no public sharing change is authorized or performed. The original GitHub migration branch is not modified. The separate source-copy folder is for reference only and is not a GitHub Pages deployment.

Local saves are scoped to the new Site origin; this preserves save behavior but does not automatically move a player's old GitHub Pages browser save.
