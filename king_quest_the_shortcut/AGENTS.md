# Project directions — The Shortcut: The Moon Bell

## Product and current focus

This is an original Sierra/King’s Quest-inspired fantasy graphical adventure. Preserve the imported game; do not rebuild it from scratch or replace its story and systems.

- Title: **The Shortcut: The Moon Bell**.
- The complete game has ten locations, Mara, inventory, deterministic time and world phases, NPC routines and memories, puzzles P1–P6, four major route styles, save/restore, and a fairy-tale epilogue.
- The ten painted environments and phase artwork are integrated into the playable game.
- The current design focus is the opening, Vale Locksmith: make it feel more like a classic PC graphical adventure through its scene composition, small animated protagonist, physical movement, and selectable action cursors.
- That King’s Quest-inspired cursor and movement redesign currently applies to the opening screen only. Preserve the existing interaction model in the other nine locations unless a later task explicitly expands the redesign.
- Take the craft as inspiration. Do not copy Sierra art, characters, maps, dialogue, or puzzle solutions.

## Source and hosting

- The ChatGPT Sites checkout is the working source for the playable Site. Its preview must remain private unless the owner asks to publish it publicly.
- The GitHub folder `paksue/sand_box/king_quest_the_shortcut` is a source copy for reference. It is not the live Site source and must not be configured for GitHub Pages deployment.
- Do not sync to GitHub or publish the Site as part of an unrelated task. Follow the owner’s explicit instruction for each external update.
- The game is client-side. Do not add an account system, backend, database, runtime secrets, or unrelated product features.

## Read current direction

Start with [`docs/README.md`](docs/README.md), which identifies active specifications, historical records, and current evidence. Then read `README.md` and the active documents relevant to the task. For the opening-screen interaction and animation, read `docs/INTERACTION_DESIGN.md` and the latest review at `evidence/village-v2/REVIEW.md`.

Do not use office-era briefs, milestones, or reviews as implementation instructions. They are retained only as project history; the office prototype is not part of this game.

## Design rules

- Make exploration, physical actions, readable clues, inventory, NPC routines, magic with understandable rules, and changing locations the center of play.
- Let the world show consequences. NPCs know only what they plausibly see, hear, infer, or are told.
- Keep alternate solutions and fail-forward routes. Avoid arbitrary pixel hunts, parser guessing, secret unwinnable states, and unfair saves.
- Do not add a morality meter, good/bad labels, generic RPG systems, combat, skill trees, or office/software/workplace content.
- Keep the simulation authoritative. Rendering and animation must not own puzzle truth or advance puzzle time on their own.
- Check whether a design statement describes a shipped feature, a planned idea, or a deferred idea before documenting it as current behavior.

## Runtime facts

- Stack: React, TypeScript, and Vite.
- The current room renderer composes SVG scenes over painted image plates, with state-driven props, actor artwork, and CSS/DOM interface elements. The declared Three.js packages do not define the renderer’s current architecture.
- Simulation, puzzle rules, schedules, and save state live under `src/simulation/`; room content and hotspots are in `src/content/`; scene presentation is in `src/render/`; interface code is in `src/ui/`.
- Keep visual anchors and clickable hotspot anchors registered together. Do not change simulation IDs to reposition artwork.
- The production Site is a static Vite build served by ChatGPT Sites. Keep asset paths portable.

## Completion and QA

Use the acceptance criteria in `docs/QUALITY_GATES.md`. Review existing QA records before repeating checks; label results as recorded evidence or newly run checks. For changes to the game, build and test the actual affected routes, preserve save/schedule boundaries, inspect representative screenshots, and check keyboard and responsive behavior where relevant.
