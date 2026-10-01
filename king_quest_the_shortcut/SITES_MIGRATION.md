# ChatGPT Sites Migration Handoff — The Shortcut: The Moon Bell

## Purpose

This branch is a frozen migration snapshot of the working fantasy build at GitHub checkpoint 3.

**Source branch:** `sites/the-shortcut-moon-bell`
**Snapshot commit:** `4db2c60741aab4a6bbaac7ff3875fa62b8358bc6`

The destination is **ChatGPT Sites**. Sites should become the new live editing/preview/publishing workspace. GitHub remains a backup/reference snapshot.

## Critical instruction

**DO NOT rebuild the game from scratch.**
Import/reuse the existing implementation and preserve its behavior unless a Sites-specific adaptation is required.

The current build already contains:
- fantasy runtime;
- Mara player character;
- 10 fantasy locations;
- deterministic time/world phases;
- inventory and provenance;
- NPC schedules and memory;
- P1–P6;
- Helpful / Expedient / Late / Minimal-item routes;
- fairy-tale epilogue;
- save/reload;
- route and state tests.

## Authoritative creative docs

Read these before changing the game:
- `AGENTS.md`
- `docs/VISION.md`
- `docs/WORLD.md`
- `docs/STORY.md`
- `docs/CHARACTERS.md`
- `docs/ITEMS_MAGIC.md`
- `docs/PUZZLE_DESIGN.md`
- `docs/PUZZLE_GRAPH.md`
- `docs/INTERACTION_DESIGN.md`
- `docs/STATE_MODEL.md`
- `docs/VISUAL_BIBLE.md`
- `docs/AUDIO_DIRECTION.md`
- `docs/QUALITY_GATES.md`
- `docs/ONE_SHOT_BUILD.md`

Office-era material is historical only and must not appear in the live Site.

## Sites migration goals

1. Import/adapt the existing React/TypeScript fantasy game into a ChatGPT Site.
2. Preserve simulation state and existing puzzle logic.
3. Replace GitHub-Pages-specific deployment assumptions with Sites-native hosting.
4. Keep the game fully client-side unless Sites requires an equivalent local persistence mechanism.
5. Preserve local save/restore behavior.
6. Do not add auth, backend, accounts, databases, combat, RPG systems, or unrelated features.
7. Keep the live Site private during migration until the owner reviews it.

## Visual continuation

The next production priority is **Checkpoint 4: visual integration**.

Generate and integrate painted/storybook scene art for:
- Village / locksmith lane
- Old Mill
- Briar Crossroads
- Ysabet's Cottage
- Ruined Chapel
- Whispering Hollow
- Moonwell
- Brindle's Bridge
- Castle approach
- Moon Bell Tower

Target:
**"A lost 1993 Sierra fairy-tale CD-ROM adventure, beautifully remastered in 2026."**

Art must be integrated into the actual playable Site, not left only as generated-output cards.

Preserve:
- hotspot alignment;
- Mara traversal;
- puzzle props;
- foreground/midground/background;
- afternoon/dusk/moonrise variants;
- pointer and keyboard accessibility.

## Final QA after visual integration

Exercise:
- Helpful/Early route;
- Expedient route;
- Late/fail-forward route;
- Minimal-item route;
- save/reload around dusk;
- Ysabet leave/return;
- Brindle sleep/wake;
- 21:00 castle transition;
- late tower;
- pointer;
- keyboard;
- mobile layout;
- console/runtime errors.

Replace obsolete office evidence with fresh fantasy evidence.

## Publishing rule

Create a private Site preview first.
Do not publish publicly until the owner has played and approved it.

## Source-of-truth transition

After migration:
- ChatGPT Sites = live build and visual iteration workspace.
- This GitHub branch = migration snapshot / rollback reference.

Do not silently sync changes back to GitHub unless the owner explicitly asks.
