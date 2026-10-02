# Milestone 01 — Architecture + Graybox Skeleton

> **Historical office-prototype milestone — superseded.** Retained as project history only; do not use as current game or renderer direction. See [`../README.md`](../README.md).

## Goal
Create a client-side project that boots and proves the core architectural boundaries without attempting final art.

## Build
- React + TypeScript + Vite + R3F;
- GitHub Pages-safe base path;
- simulation state separate from rendering;
- deterministic game clock;
- one graybox developer-area scene;
- Daniel click-to-move;
- Sarah and Mark placeholder NPCs;
- basic NPC schedule system;
- interaction probe;
- debug overlay for time/NPC/state;
- save/reload of minimal serializable state.

## Acceptance
Game boots from a production build; player moves and inspects three objects; advancing/debugging time changes Sarah's scheduled location; reload preserves state; no core game logic lives in mesh objects; screenshot is mostly playfield, not panels.

Stop here. Do not add story polish or final art.
