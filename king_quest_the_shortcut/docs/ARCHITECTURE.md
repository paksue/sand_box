# Technical Architecture — The Moon Bell

## Current runtime

The game is a client-side React, TypeScript, and Vite application. Its current scene renderer uses a 1000×650 SVG viewBox with painted WebP environment plates, state-driven SVG props and characters, and CSS/DOM interface elements. Vale Locksmith also uses a directional Mara sprite atlas and a presentation-only movement layer. The other nine rooms use the earlier scene interaction and character presentation.

Three.js and React Three Fiber are listed in `package.json`, but the current `src/` renderer does not use them. Describe the system that runs today; do not infer architecture from installed dependencies.

## Runtime boundaries

Simulation state is authoritative. Rendering, animation, and UI do not own puzzle truth.

| Area | Responsibility |
| --- | --- |
| `src/simulation/` | Deterministic clock and phase changes, inventory/provenance, puzzle rules P1–P6, schedules, memories, event history, save/restore. |
| `src/content/` | Location and hotspot definitions, world content, opening-scene walk boundaries. |
| `src/render/` | Painted plate composition, registered visual/hotspot anchors, state-driven props and actors, scene interactions. |
| `src/ui/` | Opening-scene cursor/movement experience, dialogue, inventory, journal, menus, and accessible controls. |
| `public/art/` | Painted environment plates, actor atlases, and authored item sprites. |

Keep presentation time separate from simulation time. A walk or action animation must not advance the puzzle clock independently of its existing reducer action.

## Scene model

Each room has a painted composition and registered scene anchors. The renderer layers the current room plate, applicable time-of-day artwork, live props and actors, and interaction targets. Puzzle state and schedules determine which elements appear and what actions do.

When adjusting art, register the clickable target to the same composition as its visible object. Preserve simulation IDs, exit behavior, walkable bounds, keyboard access, and responsive scaling. Avoid adding scene-local geometry or effects that obscure puzzle clues.

## Time and world state

The deterministic game clock begins at 15:30. Meaningful actions and travel consume authored minutes. Reading and menus pause time. Crossing schedule and phase boundaries updates the world through the simulation; boundary events should fire once and remain consistent after save/restore.

## Inventory and events

Inventory is serializable and preserves item location and provenance where relevant. Important quest items cannot be lost into an unwinnable state. Ordered events support NPC knowledge and the epilogue; do not replace that history with a generic morality score.

## Saves

The current local save schema is `the-shortcut:moon-bell:v2`, stored in browser local storage. A browser save belongs to its origin, so saves from the previous GitHub Pages origin do not automatically appear on the ChatGPT Sites origin.

## Hosting

ChatGPT Sites serves the static Vite output from `dist/`. Asset paths must work from the Site origin. The runtime requires no backend, database, authentication, or secret key. The separate GitHub source copy is not a deployment target.

## Debugging and performance

Debug controls may expose time, location, inventory, schedules, puzzle state, events, or serialized state only through an explicit debug path; they must not appear as normal fantasy UI.

The scenes are fixed-composition illustrated rooms. Improve readability through painting, staging, carefully registered actors/props, and restrained phase effects before introducing a new rendering engine or heavier real-time geometry.
