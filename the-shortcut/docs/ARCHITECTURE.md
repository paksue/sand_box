# Technical Architecture

## Deployment
Client-side-only static site hosted on GitHub Pages. No runtime secret keys and no OpenAI API key in browser code.

## Approved runtime stack
- React
- TypeScript
- Vite
- React Three Fiber + Three.js
- DOM overlays for text-heavy UI
- localStorage initially; IndexedDB only if justified
- GLB/glTF 2.0 only for realtime 3D assets that actually need to ship

## Hybrid 2.5D rendering model
The default scene does not require a fully detailed realtime 3D environment.

Runtime may combine:
- one or more authored background plates;
- foreground/occlusion layers;
- optional depth maps/masks;
- hidden walkmesh/navigation geometry;
- hotspot/interaction anchors;
- realtime characters;
- selected realtime props;
- lightweight environment FX;
- DOM UI.

The simulation must not care whether the visible environment came from a PNG/WebP layer or a GLB mesh.

## Optional Blender production lane
Blender is an offline art/consistency tool, not a runtime dependency.

Potential outputs:
- structural scene render;
- camera metadata;
- depth/occlusion masks;
- floor/walk masks;
- prop anchor positions;
- lightweight collision/nav geometry;
- selected GLB hero props;
- consistent time-of-day renders.

Web ChatGPT Work must not assume access to a local Blender installation. Milestones 01–03 must remain fully executable without Blender. Later art milestones may use Blender only when an execution environment with Blender is explicitly available.

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
  scene/background compositor
  walk/depth/occlusion mapping
  camera
  realtime character presentation
  selected 3D props
  animation
  atmosphere/FX
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

art/
  scene plates
  foreground layers
  masks/depth
  character references
  realtime models
  prop anchors
  visual reference boards
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
Target desktop browsers first with reasonable laptop performance. Buy visual quality with composition, authored backgrounds, lighting, and selective realtime elements before brute-force geometry.
