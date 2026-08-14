# WorldTap

A mobile-first geography game inspired by the simplicity of daily tap-the-map games.

## Design rule

**One action. Five places. Five tiny discoveries. About 90 seconds.**

The player rotates a globe and taps a location. Each reveal gives immediate distance/score feedback plus one short fact and one geographic anchor so mistakes become useful spatial memories.

## Included in this POC

- Five-question deterministic daily game
- Orthographic SVG globe powered by D3 + Natural Earth data via `world-atlas`
- Drag to rotate, wheel/pinch-friendly mobile layout, tap to guess
- Haversine distance scoring, max 1,000 points
- Optional regional hint with a score cap
- Guess/answer pins plus geodesic reveal line
- Five question families: cities, flags, landmarks, history, physical geography
- Tiny educational fact + memorable geographic anchor after every guess
- Local streak, best score, and places-seen memory using `localStorage`
- End-of-game one-question retrieval challenge based on the player's weakest round
- Shareable emoji result
- Bonus Journey mode: trace five stops along the Silk Road

## Run

Open `index.html` from a web server. The repository's GitHub Pages setup serves this folder directly at `/sand_box/worldtap/`.

No build step or backend is required. D3, TopoJSON, and the compact world map are loaded from public CDNs.

## Next product steps

1. Add a larger curated question bank with editorial review and difficulty labels.
2. Add true spaced review scheduling while keeping the algorithm invisible to the player.
3. Add private friend groups / daily comparisons when a small backend is available.
4. Add image clues using licensed/public-domain landmark assets.
5. Add accessibility improvements including keyboard map navigation and reduced-motion handling.
6. Add lightweight analytics around completion, hint usage, and replay behavior.
