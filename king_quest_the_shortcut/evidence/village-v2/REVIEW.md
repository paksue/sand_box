# First-screen performance pass

The Shortcut: The Moon Bell remains the imported fantasy adventure. This pass changes Vale Locksmith presentation only; the reducer, puzzle rules, inventory IDs, schedules, save format, other nine rooms and epilogue are preserved.

## Changes

- Mara now has six poses each for side, front and back walking, plus a physical action sequence. Leftward side movement mirrors the original rightward poses. Idle poses retain the last facing direction.
- Walk frames advance by distance traveled, normalized for perspective size, rather than by a fixed animation timer unrelated to speed. Vertical travel is slower. Motion rendering does not advance puzzle time.
- The stair lip uses a visibility-graph path instead of a straight tween clamped onto the floor each frame. Presentation arrival still commits through the existing movement action.
- Counter items are smaller, Mara and Aldus are staged at consistent human scale relative to the counter, and the original painted foreground bushes occlude figures through a registered clip layer.
- Take and Use approach, face and reach before applying their original simulation action. Counter pickups use the upper reach pose. New input or Escape cancels the pending action; reduced motion skips the performance.
- The verb palette appears at the upper edge, through its compact button, keyboard focus or F10. Inventory, journal, waiting, saving, reveal and keyboard shortcuts remain available.

## Asset production

Built-in imagegen produced the original Mara atlas using the existing Mara sprite as the identity reference. The final shipped asset is `public/art/mara-directional-v2.png`, 1536×1024 RGBA, six columns and four rows. No Sierra art was copied into the game.

Prompt brief: preserve Mara’s russet cloak, curled brown hair, pale sleeves, brown vest, green trousers, practical boots and satchel; simplified painterly readable at game size; full-body six-frame right-facing walk, six toward-viewer frames, six away frames, and six right-facing idle/reach/bend/withdraw/straighten/idle poses. Transparent canvas, fixed cells and baseline, consistent identity and costume, no scenery or labels.

The raw generation crossed nominal row boundaries. Production slicing used boundaries 0/277/528/772/1024, one shared scale to 232px maximum content height, fixed horizontal character anchor at raw-cell x150, and bottom alignment inside256px cells. This prevents cloak or reaching-arm bounds from moving the whole figure sideways between poses.

## Visual limits

This is a first-screen iteration for owner playtesting, not a claim of exact King's Quest reproduction. The generated side cycle still has subtle opposite-leg distinction; future hand-tuned animation could improve it. The existing detailed environment plate and static Aldus performance are retained. Later rooms do not yet use this directional animation/UI.

## Verification

- 17 simulation/navigation tests pass, including all four alternate routes and save/schedule boundaries.
- Production browser QA completes Helpful, Expedient, Late and Minimal routes, with save/reload and dusk, Ysabet, Brindle, castle and late-tower boundary checks; no console/runtime errors.
- Normal-motion browser QA verifies facing toward/away/side, approach and physical pickup, cancellation, inventory, F10 toolbar, save/reload and 390/768/1920 layouts.
- Screenshots of idle exploration, side/back walking, reach and responsive layouts reviewed. Final corrections removed toolbar interception, reduced prop scale and corrected sprite viewport aspect handling.

The Site remains owner-private. No push to the original GitHub migration snapshot.
