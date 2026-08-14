# WorldTap Next — Gold Renderer Lab

This is a renderer-only experiment for the next WorldTap architecture.

## Goal

Validate the **MapLibre GL JS + Three.js shared-WebGL-context architecture on a real iPhone before rebuilding the game around it**.

MapLibre owns:
- globe projection and camera
- drag / pinch interaction
- geographic picking
- country geometry
- Tokyo → Nairobi great-circle route

Three.js owns:
- Nairobi 3D/glow beacon
- animated traveling route-head
- additive game-style effects

There is one MapLibre camera and one WebGL context. Three.js renders as a MapLibre custom 3D layer.

## Engines pinned for this lab

- MapLibre GL JS 6.0.0 ESM
- Three.js r184 / 0.184.0

The lab uses exact-version ESM CDN imports with an alternate-CDN fallback so it can run directly under the repository's existing GitHub Pages setup without a build step. If this renderer passes the quality gate, the production implementation should move these same pinned dependencies into the bundled app.

## Test

Open `/sand_box/worldtap-next/` on the target phone.

1. Spin the globe slowly and quickly.
2. Pinch zoom in and out.
3. Tap arbitrary points and confirm geographic picking follows the tap.
4. Press **REVEAL TOKYO → NAIROBI**.
5. During and after the reveal, spin and zoom the globe.
6. Confirm the green Three.js Nairobi beacon stays geographically attached to Nairobi.
7. Watch the FPS readout for obvious drops during normal spin and during the reveal.

## Quality gates

### A — Touch
The globe must feel directly attached to the finger, without the sticky SVG feel of the original prototype.

### B — Geospatial correctness
The Three.js beacon must remain attached to Nairobi through rotation, zoom, and camera animation.

### C — Performance
Target approximately 60 fps on an iPhone 11-class device. Visual effects that meaningfully harm interaction performance do not ship.

## Not implemented intentionally

- five-question daily game
- scoring
- hints
- learning / retrieval system
- Journey mode
- accounts / friends
- production bundler

Those come only after the renderer passes the phone test.
