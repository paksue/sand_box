# Technical Architecture

## Deployment
Client-side-only static site hosted on GitHub Pages. No runtime secret keys and no OpenAI API key in browser code.

## Approved stack
React, TypeScript, Vite, React Three Fiber, Three.js, DOM overlays for text-heavy UI, localStorage initially, IndexedDB only if justified, GLB/glTF 2.0 for shipped 3D assets.

## Boundaries
```
simulation/
  clock
  world state
  NPC schedules
  knowledge
  relationships
  story/event rules
  puzzle state
  behavior observations
  save serialization

render/
  scene composition
  camera
  character presentation
  animation
  lighting
  interaction adapters

ui/
  dialogue
  computer apps
  inventory/journal
  menus/settings
  accessibility

content/
  characters
  schedules
  dialogue
  interactions
  puzzle definitions
  storylets/events
```

Renderer objects are never the source of truth for gameplay.

## Core state objects
GameState, WorldClock, NPCState, Schedule, KnowledgeState, RelationshipState, InteractionState, PuzzleState, Evidence, Event, DialogueNode, Utterance, Consequence, BehaviorObservation, SaveState.

## Time
Use a deterministic game clock. Story-critical schedules must be testable through debug time controls.

## Events
Prefer declarative trigger + condition + effects. Events must be inspectable in debug mode.

## Save
Save serializable simulation state only. Include save versioning/migration from first implementation.

## Debug
Support set/jump game time, NPC schedule/location inspection, knowledge flags, relationship values, puzzle/event state, force/replay key beats, and state export.

## Performance
Target desktop browsers first with reasonable laptop performance. Keep draw calls/material variety/assets restrained. Buy visual quality with composition and lighting before brute-force complexity.
