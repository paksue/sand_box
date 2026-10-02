# Interaction Design — Fantasy Adventure

## Primary rule

The player interacts with the **scene**, not a global task menu.

## Current implementation scope

Vale Locksmith, the opening screen, uses a classic icon-cursor model: Walk, Look, Hand, and Talk. Mara physically approaches people and objects before talking, taking, or using an item. This is the current King’s Quest-inspired interaction pass; it is an original design, not a literal recreation of Sierra’s interface.

The other nine locations retain the earlier click-to-walk, click-to-look, contextual-action model. Keep that distinction explicit in documentation and QA until those rooms receive their own interaction pass.

At Vale Locksmith:
- keys 1–4 select Walk / Look / Hand / Talk;
- right-click cycles those cursors;
- arrow keys move Mara; F10 opens the compact toolbar;
- I opens the Satchel, H reveals visible objects, Tab/Enter activate scene objects, and Escape closes or cancels;
- selecting an inventory item changes the cursor to Use, then the player targets a visible scene object;
- walking, facing, and action poses are presentation only; puzzle time advances through simulation actions.

Default loop:
1. walk;
2. notice;
3. choose a scene action and target a visible object/person;
4. see immediate world feedback.

## Normal verbs

Look, Talk, Take, Use, Give, Open, Pull, Turn, Place, Pour, Light, Wait.

At Vale Locksmith, show the four scene cursors in the classic toolbar. In the other rooms, keep actions contextual rather than showing every possible verb. Do not make an object interaction happen remotely: the opening-screen actions should approach the target first.

## Exploration

- fixed/semi-fixed composed views;
- click-to-move;
- clear exits;
- modest transition time;
- no global "Nearby interactions" list containing the entire game;
- no minimap required for this POC.

Optional accessibility/hotspot reveal:
- highlights only currently visible/currently present interactables;
- uses scene-local spatial order;
- must not reveal hidden routes, absent NPCs, or solution names.

Keyboard/screen-reader path must use the same scene-local availability rules as pointer play.

## Inventory

Compact horizontal/vertical inventory tray on demand.

Selecting an item changes cursor/prompt to "use [item] with..." until canceled.

Reasonable wrong uses should get authored feedback.

No inventory crafting grid. Any combination (e.g. glowjar) should happen through an obvious scene interaction or one direct item-on-item use.

## Dialogue

Dialogue is brief and characterful.

Use natural utterances only when a response choice genuinely matters. Do not present morality labels.

NPCs can:
- refuse;
- offer a task;
- remember promises;
- interrupt because of schedule;
- notice visible inventory/actions.

Conversations should not solve puzzles by simply stating the answer unless player requested the third-rung hint.

## Time and waiting

The current time is subtle, not a dominant HUD element.

"Wait" should state the next notable observable change if Mara plausibly knows it, e.g.:
- wait until dusk;
- wait a little while.

Do not expose hidden schedules as exact optimization data unless learned from dialogue/signage.

Reading inventory/journal/pause screens pauses time.

## Scene-state changes

Revisiting matters.

Examples:
- mill water level differs after sluice action;
- Crossroads signs change after a loop;
- Ysabet is absent/present;
- moonflowers open at dusk;
- Brindle sleeps/wakes;
- castle gate closes at ninth bell;
- briar growth intensifies after moonrise.

These changes should be visible before they are textual.

## Journal

Optional lightweight journal records:
- quest objective;
- things Mara has personally learned;
- optional hints requested.

Do not turn it into a checklist of undiscovered puzzle steps.

## Saving

Autosave plus manual save.
Restoring must preserve:
- time;
- location;
- inventory;
- world phase;
- NPC schedules/memory;
- puzzle state;
- witnessed actions;
- item locations.

## Accessibility

- keyboard parity;
- readable dialogue;
- touch-friendly hotspots;
- reduced motion;
- subtitles for meaningful audio;
- scene-local hotspot reveal;
- no puzzle depends solely on color or sound.
