# Documentation map — The Shortcut: The Moon Bell

Use this page to tell current direction from project history and recorded evidence. `AGENTS.md` is the contributor entry point; this index is the map for the documents below.

## Current direction

| Document | Use |
| --- | --- |
| [`VISION.md`](VISION.md) | Game identity, player experience, and creative limits. |
| [`WORLD.md`](WORLD.md), [`STORY.md`](STORY.md), [`CHARACTERS.md`](CHARACTERS.md) | Setting, story, and character intentions. Check described features against runtime status below. |
| [`ITEMS_MAGIC.md`](ITEMS_MAGIC.md), [`PUZZLE_DESIGN.md`](PUZZLE_DESIGN.md), [`PUZZLE_GRAPH.md`](PUZZLE_GRAPH.md), [`STATE_MODEL.md`](STATE_MODEL.md) | Object rules, puzzle logic, route structure, state, and continuity. |
| [`INTERACTION_DESIGN.md`](INTERACTION_DESIGN.md) | Current interaction model and accessibility. The King’s Quest-inspired cursor/movement model currently applies to Vale Locksmith only. |
| [`KINGS_QUEST_REFERENCES.md`](KINGS_QUEST_REFERENCES.md), [`VISUAL_BIBLE.md`](VISUAL_BIBLE.md) | Original-art reference principles and current visual direction. |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Actual renderer, simulation boundaries, saves, and hosting. |
| [`AUDIO_DIRECTION.md`](AUDIO_DIRECTION.md) | Future audio concept; audio is not currently part of the playable build. |
| [`QUALITY_GATES.md`](QUALITY_GATES.md) | Acceptance criteria and the status of recorded verification. |

## Current implementation notes

These notes prevent design intent from being mistaken for shipped behavior. Confirm changes against `src/` before updating them.

- **Implemented:** all ten fantasy locations, painted base environments, available phase/night art, simulation routes, inventory, schedules, saves, and epilogue. See [`../evidence/sites/ACCEPTANCE.md`](../evidence/sites/ACCEPTANCE.md).
- **Opening-screen iteration:** Vale Locksmith has the Walk / Look / Hand / Talk cursors, directional Mara movement, approach-and-act interactions, and its own keyboard/touch behavior. It is a first-screen iteration; the other nine locations retain their earlier interaction model. See [`../evidence/village-v2/REVIEW.md`](../evidence/village-v2/REVIEW.md).
- **Deferred ideas:** Ysabet’s Moon-Glass Cabinet and back window are not current hotspots. Ysabet’s schedule is implemented at her cottage; a later visit to the Moonwell is not implemented. Mallow is a chapel hotspot with puzzle interactions, not a visibly moving NPC. Do not document these as current features or add them unless a task explicitly brings them into scope.
- **Future direction:** the audio design is a proposal only; the runtime currently has no audio implementation.

## Historical design records

The files below document the abandoned office prototype and its conversion. They are kept for history and are not current specifications or task instructions.

- [`ONE_SHOT_BUILD.md`](ONE_SHOT_BUILD.md)
- [`milestones/`](milestones/) — original milestone plans, including the office-era prototype.
- [`reviews/M02_HIGH_REVIEW.md`](reviews/M02_HIGH_REVIEW.md) — review of that prototype.

Each historical file should retain its own warning in case someone reaches it directly.

## Evidence and revisions

- [`../evidence/sites/ACCEPTANCE.md`](../evidence/sites/ACCEPTANCE.md) — completed migration/checkpoint record; it predates the latest opening-screen iteration.
- [`../evidence/village/REVIEW.md`](../evidence/village/REVIEW.md) — superseded first opening-screen pass.
- [`../evidence/village-v2/REVIEW.md`](../evidence/village-v2/REVIEW.md) — latest opening-screen pass and recorded QA.

QA reports describe checks run at the time of each report. A later documentation pass does not rerun those checks; new work should say whether evidence is previously recorded or newly verified.
