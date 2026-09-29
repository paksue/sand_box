# Milestone 01 acceptance

Scope: `docs/milestones/01-graybox.md` only. All changes are inside `the-shortcut/`.

## Results

| Criterion | Evidence |
| --- | --- |
| Production build boots | `npm run build`; browser loads Vite production preview at `/sand_box/the-shortcut/` |
| Daniel click-to-move | Browser clicks projected floor coordinate and checks saved arrival position |
| Inspect three objects | Actual mesh clicks on both workstations and noticeboard; each opens an inspection after approach; inspected IDs persist |
| Sarah schedule changes | 09:00 stand-up, 09:40 coffee, 09:50 return; debug controls and scene screenshots |
| Minimal save/reload | Paused 09:40 state restored exactly: time, position, inspection history, pending action fields; rendered debug state also checked |
| Simulation outside meshes | Pure reducer and serialization in `simulation/game.ts`; schedule and spatial data in `content/world.ts`; meshes only display state and dispatch input |
| Mostly playfield | Default UI occupies only corners/edges; debug is closed by default; inspection is contextual and dismissible |
| Browser errors | Zero captured console errors and uncaught page errors in Chromium |

Additional checks: deterministic fixed-step outcomes, pause, backward time jumps, Mark departure, invalid navigation, inspection cancellation, mid-walk serialization, schema validation, keyboard inspection, corrupt-save recovery, and 390×844 responsive layout.

## Screenshot review

- `01-boot.png`: initial exploration; all three placeholders and three inspectable objects visible.
- `02-standup-debug.png`: both NPCs at stand-up anchors; state inspector open.
- `03-coffee-debug.png`: Sarah at coffee anchor; Mark absent after departure; persisted three-object inspection state.
- `04-inspection.png`: contextual object response with scene visible.
- `05-mobile.png`: narrow viewport and compact controls.

Compared against the **composition requirements in** `VISUAL_BIBLE.md` and `KINGS_QUEST_REFERENCES.md`: fixed three-quarter camera, readable small characters, clear action plane, distinct object silhouettes, architecture providing depth, and environment-dominant UI. This is deliberately neutral graybox geometry, not a final-art reference-board pass or an assertion that the painterly visual target has been reached. No copyrighted assets were copied.

## Issues found and fixed

1. Noticeboard approach originally fell outside save validation's walk bounds, causing reload to start fresh. Corrected the anchor and added save round-trip assertions after every inspection.
2. Initial framing left excessive unused desktop space. Tightened the fixed camera field of view.
3. Portrait viewport cropped room edges. Widened portrait camera field of view.
4. Environment's browser-download route failed. Test execution used locally unpacked `@sparticuz/chromium` 153 with software WebGL via the test runner's optional `CHROMIUM_PATH`. Normal environments can use Playwright's installed Chromium. Browser runtime is not shipped or committed.

## Limits / deliberate deferrals

- NPCs snap to scheduled placeholder anchors. The coffee interval is a documented test fixture.
- No dialogue, story consequences, computer puzzles, final characters, art, or audio implemented.
- No other rooms, full workday, or Milestone 02 implementation.
- GitHub Pages base path is tested locally; production deployment is not part of this change.
- Vite reports a non-blocking bundle-size warning (Three.js/R3F; approximately 311 KB gzip). No remote runtime assets or network services are required.
- Browser tested: headless Chromium, software WebGL; not a claim of Safari/Firefox or physical mobile-device testing.
