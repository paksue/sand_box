# ChatGPT Sites Migration Handoff — The Shortcut: The Moon Bell

## Current status — 2026-10-02

This file preserves the original migration contract. The requested import, Checkpoint 4 art integration, and Checkpoint 5 route/browser QA are recorded as complete in [`evidence/sites/ACCEPTANCE.md`](evidence/sites/ACCEPTANCE.md). The subsequent Vale Locksmith cursor, movement, and animation iteration is recorded in [`evidence/village-v2/REVIEW.md`](evidence/village-v2/REVIEW.md).

The current continuation is focused on improving the classic PC adventure feel of the opening screen. That interface redesign currently applies to Vale Locksmith only. The Site preview remains private for owner testing. The separate GitHub folder `paksue/sand_box/king_quest_the_shortcut` is for source reference; it is not a GitHub Pages deployment target.

## Purpose

At the time this contract was written, the source was the working fantasy build at GitHub checkpoint 3.

**Source branch named in the original contract:** `sites/the-shortcut-moon-bell`
**Contract snapshot commit:** `4db2c60741aab4a6bbaac7ff3875fa62b8358bc6`
The imported source commit is recorded in [`evidence/sites/ACCEPTANCE.md`](evidence/sites/ACCEPTANCE.md).

The destination is **ChatGPT Sites**. Sites is the live editing and private preview workspace. GitHub is a source/reference copy only.

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
- `docs/README.md`
- `docs/ARCHITECTURE.md`
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
- `docs/KINGS_QUEST_REFERENCES.md`

Office-era material is historical only. It is not current implementation guidance and must not appear in the live game.

## Sites migration goals

1. Import/adapt the existing React/TypeScript fantasy game into a ChatGPT Site.
2. Preserve simulation state and existing puzzle logic.
3. Replace GitHub-Pages-specific deployment assumptions with Sites-native hosting.
4. Keep the game fully client-side unless Sites requires an equivalent local persistence mechanism.
5. Preserve local save/restore behavior.
6. Do not add auth, backend, accounts, databases, combat, RPG systems, or unrelated features.
7. Keep the live Site private during migration until the owner reviews it.

## Original visual continuation — Checkpoint 4 (complete)

The original production priority was **Checkpoint 4: visual integration**. It is complete; the list below records the scope of that requirement.

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

## Final QA after visual integration — Checkpoint 5 (recorded complete)

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

The recorded results are in [`evidence/sites/ACCEPTANCE.md`](evidence/sites/ACCEPTANCE.md). The later opening-screen pass has its own checks in [`evidence/village-v2/REVIEW.md`](evidence/village-v2/REVIEW.md). These are recorded results; a documentation update does not constitute a new QA run. A blind first-time human playtest and other browser engines remain owner review items.

## Publishing rule

Create a private Site preview first.
Do not publish publicly until the owner has played and approved it.

## Source-of-truth and deployment boundary

- ChatGPT Sites checkout = current working source and private preview.
- `paksue/sand_box/king_quest_the_shortcut` = GitHub source/reference copy only; do not configure GitHub Pages.
- Do not publish the Site publicly or update the GitHub source copy unless the owner explicitly asks.
