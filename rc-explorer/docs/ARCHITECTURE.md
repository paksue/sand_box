# Architecture

## Runtime
Vite + modern JavaScript + Three.js. Static output only.

## State flow
physical input -> explicit action state -> vehicle simulation -> serializable state -> Three.js presentation

Rendering never becomes the gameplay source of truth.

## Simulation
Fixed 60 Hz. The RC dynamics model includes acceleration/braking, speed-dependent steering, surface grip/drag, four terrain samples for pitch/roll and visual wheel suspension. It favors controllable crawler feel over full-size automotive simulation.

## World and rendering
Deterministic procedural geometry keeps the initial shipping payload small. Repeated vegetation is instanced. ACES tone mapping, physical materials, shadows and fog sell the macro scale. Height/surface functions are shared by driving and visuals.

## Persistence and privacy
Only localStorage is used for discovery progress. There are no accounts, API keys, backend calls or network writes.

## AI/MCP playtest contract
`window.__RC_EXPLORER__` exposes reset, snapshot, fixed-step, teleport and discovery inspection. Playwright drives the actual browser stack and captures screenshot evidence.

## Deployment
GitHub Actions builds `rc-explorer/dist`, validates Chromium, and on main copies compiled output into `previews/rc-explorer`, served by the sandbox GitHub Pages site.
