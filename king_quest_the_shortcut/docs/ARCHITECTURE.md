# Technical Architecture — Fantasy Reboot

## Deployment
Client-side static GitHub Pages game. No runtime secrets, backend, database, or auth.

## Runtime stack
- React
- TypeScript
- Vite
- React Three Fiber + Three.js
- DOM overlays for dialogue/inventory/settings/debug
- localStorage for save
- GLB/glTF only when useful

## Core rule
Simulation state is authoritative. Rendering never owns puzzle truth.

## Recommended boundaries

```
simulation/
  clock
  location/world phase
  inventory + item provenance
  NPC schedules
  NPC memory/knowledge
  puzzle state P1-P6
  ordered event log
  save serialization

render/
  scene compositor
  camera
  walk/depth/occlusion
  realtime characters
  puzzle props
  atmosphere/lighting
  interaction adapters

ui/
  dialogue
  inventory
  journal/hints
  menus/settings
  accessibility
  hidden debug tools

content/
  locations
  characters
  schedules
  dialogue
  puzzle definitions
  item definitions
  story events
```

## Scene model
Each location defines:
- id;
- exits and destination;
- walkable bounds/nav data;
- hotspot anchors;
- phase variants;
- NPC presence;
- interactable state;
- camera/composition metadata.

Travel costs time and processes phase/schedule boundaries.

## Time
Deterministic game clock from 15:30 onward.

Meaningful actions and travel consume authored minutes.
Reading/menu surfaces pause time.
Waiting advances to a known/selected observable moment.
Crossing a boundary fires world-state changes exactly once.

## Inventory
Serializable item state with provenance/permission where relevant.
Sun Key cannot be discarded into an unwinnable state.

## Events
Prefer declarative condition/effect events.
Maintain an ordered event log for epilogue and debugging.

## Save
New fantasy schema version. Old office saves may be invalidated cleanly rather than migrated semantically.

## Debug
Hidden debug tools:
- jump time;
- jump location;
- inspect inventory;
- inspect NPC schedule/memory;
- inspect puzzle states;
- inspect event log;
- force phase;
- export state.

Debug controls never appear as normal fantasy UI.

## Performance
Buy visual quality through fixed-camera composition, layered plates, selective geometry, and restrained effects before adding heavy 3D complexity.
