# First-screen King’s Quest review and implementation

> **Superseded first pass.** This report documents the earlier four-frame Mara sprite and opening UI iteration. The current opening-screen implementation and its recorded checks are in [`../village-v2/REVIEW.md`](../village-v2/REVIEW.md).

Scope: Vale Locksmith, the existing opening screen of **The Shortcut: The Moon Bell**. This is an iteration of the imported game, not a replacement runtime. Other rooms retain their earlier interface. The existing paintings, Mara/Aldus identities, item IDs, routes, memories, schedules, phase plates, save format and epilogue are preserved.

## References reviewed

- Sierra’s 1991 technical manual, icon interface and mouse/keyboard controls: https://www.sierragamers.com/wp-content/uploads/2019/12/Tech_Manual_1991_Color.pdf
- Official King’s Quest Collection manual: https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/10100/manuals/KQManual.pdf
- Original game screenshots and product materials: https://www.gog.com/en/game/kings_quest_4_5_6
- KQVI controls cross-check: https://strategywiki.org/wiki/King%27s_Quest_VI%3A_Heir_Today%2C_Gone_Tomorrow/Controls

V–VI’s SCI icon interface is the closest match to the project’s 1993 CD-ROM target. Earlier parser entries are useful references for deliberate exploration and routines, but are not the control model used here. This is an original interface and original artwork, with no copied Sierra assets.

| Craft principle | Previous opening | Implemented opening |
| --- | --- | --- |
| Control the protagonist in the room | Instant relocation; remote actions | Continuous painted walk cycle; approach before Talk, Take or Use; walk to exit |
| Choose an action cursor | Click always Looks, then separate verb panel | Walk / Eye / Hand / Talk bar, corresponding cursor, right click cycling, 1–4 shortcuts |
| Stage protects the illustration | Heading and permanent narration outside/over scene | Compact title rail, one icon bar, tiny command rail; reading in dismissible story dialogue |
| Object manipulation | Generic inventory glyphs, vector counter props | Painted starters in room and satchel; selected item cursor; authored wrong-use response |
| Figure inhabits composed space | Fixed scale and painter’s order | Registered step/lane boundary, perspective scale, left/right facing, Aldus depth occlusion |
| Reading is distinct from exploration | Persistent narrative strip | Brief parchment dialogue with portrait; focus containment, Enter / Space / Escape |
| Modern accessibility | Scene-local focusable targets | Same targets preserved; arrow walking; optional reveal; reduced-motion arrival; touch-sized toolbar |

Movement animation uses presentation time only. Puzzle minutes still advance solely through the existing reducer actions. Pending actions are canceled when another walk, cursor or menu is chosen. Interrupted walking commits its current valid position so Save/Restore does not jump back to the beginning of the walk. Village movement gains a registered walkable boundary; all other movement remains unchanged.

## Assets and generation

Built-in image generation produced project-integrated assets:

- `public/art/mara-walk.png`: four-frame strip, same shipped Mara identity, bottom-centered 256×256 slots, one shared scale; alpha preserved. Reference: shipped `characters.png` top-left Mara.
- `public/art/item-thread.png`, `item-mirror.png`, `item-bottle.png`, `item-cake.png`: isolated painted counter and inventory objects, 256×256 canvases.
- `public/art/cursor-{thread,mirror,bottle,cake}.png`: 32-pixel cursor derivatives.

Final prompt set:

Mara: “Production sprite animation asset for an original fairy-tale graphical adventure. Reference is a character atlas: use ONLY the young woman in the TOP LEFT, Mara, russet cloak, brown hair, leather locksmith satchel, cream sleeves, green trousers and brown boots. Create one exact FOUR FRAME walk-cycle strip, FOUR equally spaced square cells in ONE horizontal row on transparent canvas. Same Mara identity, same painted style, same height and scale in every frame, feet anchored to same bottom baseline, facing RIGHT in EVERY frame. Frames: right leg forward contact; passing pose; left leg forward contact; opposite passing pose. Clear alternating stride with boots separated, subtle natural cloak swing. Full body visible with generous transparent space inside each cell. No shadows, no scenery, no extra people, no words, no borders. Beautiful hand-painted 1993 fairy-tale adventure remastered. This is a game sprite sheet, not a poster.”

Thread / mirror / bottle share this production prompt, with respective subject inserted: “Production isolated object sprite for an original fairy-tale adventure game. Subject: [small wooden spool of rich red locksmith thread / small oval tarnished brass hand mirror with a short ornate handle / small blue cobalt glass medicine bottle with a cork stopper]. One single object centered, three-quarter view, entire object in frame with generous transparent margins. Painterly gouache and oil storybook rendering, warm late afternoon from upper left, believable wear and texture, beautiful 1993 Sierra-style fairy-tale CD-ROM remastered in 2026. Readable at 35 pixels tall. No text, no background, no surrounding scene, no UI, no duplicate objects. Actual transparent background.”

Cake: “One small round rustic honey bun, deep warm brown golden crust, hand-painted fantasy game prop sprite. Completely isolated object on transparent background. Simple domed bread cake with cross scored in the brown crust. No cloth. No wrapper. No white object. No glow, no shadow, no aura. Whole object centered with empty transparent space, three-quarter view. Gouache painterly texture. No background whatsoever.” A subtle folded cloth is rendered beneath it in the room, preserving the existing wrapped-supper object. Earlier cake variants with unwanted halos were discarded.

## Verification

- TypeScript and production build pass.
- All 15 original simulation tests pass.
- Production-browser complete Helpful, Expedient, Late and Minimal routes pass; phase/schedule/save boundaries pass; no browser console or runtime errors.
- Dedicated village production-browser QA checks opening dialogue, normal-motion traversal, no remote pickup, cancellation of pending Take, direct Hand pickup, Look, right click, keyboard Talk, selected Sun Key use, arrows, save/reload, 390/768/1920 layouts, asset decoding, mill exit, and village relief-courier epilogue.
- Screenshots reviewed and final portrait crop / desktop fit corrected. Evidence lives alongside this review.
- Site remains owner-private. No original GitHub migration-branch push.
