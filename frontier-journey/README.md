# Frontier Journey — client-side MVP

A browser-only trail survival prototype inspired by the *structure* of classic overland journey games, implemented as original code and content.

## What is implemented

- Profession selection with different starting budgets/bonuses
- Five named party members with individual health, illness, injury, and death
- Departure month and deterministic run seed
- Starting outfitting store with food, ammunition, medicine, clothing, spare parts, and oxen
- Daily travel simulation with terrain, pace, rations, weather, wagon condition, and ox condition
- Hunting, resting, and wagon repair actions
- Weighted bad/good trail events
- Landmark progression and higher-priced fort resupply
- Three river crossings with ford / float / ferry / wait decisions
- Journal and route map
- End-of-run scoring and memorial summary
- IndexedDB save/resume through Dexie
- PixiJS animated travel scene with weather treatment
- Tiny generated sound cues played through Howler (no audio assets or backend)
- Responsive HTML/CSS interface

## Architecture

The simulation owns the rules and state. Rendering never decides outcomes.

```text
Game state + seeded RNG
        |
        v
Daily simulation / actions / events
        |
        +----> HTML/CSS UI
        +----> PixiJS travel scene
        +----> Howler sound cues
        +----> Dexie IndexedDB save
```

Everything runs in the browser. There is no server application, account system, API, or build tool.

## Run locally

Because browser module/security behavior is more predictable over HTTP, serve the directory with any static server instead of double-clicking the file.

Examples:

```bash
cd frontier-journey
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Dependencies

Loaded from jsDelivr CDN in `index.html`:

- PixiJS 8
- Dexie 4
- Howler 2

No npm install is required.

## MVP design philosophy

The first milestone deliberately omits several systems from the longer GDD (morale, relationships, deep route branching, 3D scenes, large dialogue trees). The goal is to prove the classic loop first:

**outfit → travel → pace/rations → events → hunt/rest/repair → river → landmark → survive or fail**

Once that loop is fun, later milestones can add depth without masking weak fundamentals.

## Recommended next milestones

1. **Balance harness** — extract simulation functions so thousands of seeded runs can be simulated headlessly and profession win rates tuned.
2. **Content pass** — expand to 50–80 regional events and more distinct landmark encounters.
3. **Treatment UI** — dedicated medicine/treatment decisions rather than generic recovery only.
4. **Hunting minigame** — replace menu resolution with a short PixiJS skill sequence.
5. **Art/audio pass** — original pixel/illustrated wagon sprites, landmark cards, ambient loops, storms, and camp scenes.
6. **Strategic expansion** — route branches, scouting, trade offers, party traits, then morale/relationships only if they improve choices.
7. **Optional Three.js spikes** — prototype river/mountain cinematic scenes separately; keep only if they improve the game enough to justify 3D complexity.

## Originality note

This prototype uses generic historical trail-survival concepts and original text/code. It intentionally does not reproduce proprietary artwork, dialogue, UI, or source code from *The Oregon Trail*.
