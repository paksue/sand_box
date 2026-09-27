# Watchdeck Agent Constitution

This file governs all work under `watchdeck/`.

## Mission
Build the best personal movie + TV tracking console that can live entirely on GitHub Pages: fast to use, visually cinematic, private by default, and durable without a backend.

## Prime directives
1. The primary loop is **open → see next thing → mark watched → move on**.
2. Personal history belongs to the user. Keep it local-first and exportable.
3. No private API credential may be committed to this public repository.
4. Core library/history must keep working if external catalog APIs fail.
5. Posters are the discovery surface, but readability and speed beat decoration.
6. TV progress must never silently skip or duplicate an episode.
7. Mobile is a first-class surface.
8. External APIs provide metadata; they are never the source of truth for watch history.
9. Prefer browser-native/static capabilities over server infrastructure.
10. Every release passes syntax, contract, data-integrity, accessibility and responsive review.

## Agent handoff
`orchestrator → research/product → architect → design → engineering → QA → release`

A failed QA gate returns to the role responsible for the defect.
