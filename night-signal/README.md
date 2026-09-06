# NIGHT SIGNAL

A client-side coastal search-and-rescue deduction thriller designed as a compact, high-production-value browser game.

## Play

https://paksue.github.io/sand_box/night-signal/

## V2 player loop

1. Sweep 460–470 MHz for a carrier edge.
2. Rotate the directional array to maximize signal coherence.
3. Read the signal fingerprint: live voice, drift, repeating packet, beacon framing.
4. Hold **STABILIZE CARRIER** to recover the transmission.
5. Use **ARCHIVE** cross-checks selectively; each one consumes 6 seconds of storm window.
6. Mark contacts high/low risk as your working hypothesis.
7. Use **DISPATCH** to commit the single available rescue boat through an irreversible final-order screen.

Three contacts compete for one rescue asset. The best ending depends on the dispatch choice, how thoroughly the player investigated, and whether the player's risk assessment matched the evidence.

## What changed in V2

- Stronger physical rescue-console visual language with a bearing instrument, radar, storm telemetry, spectrum display, and signal-fingerprint indicators.
- Signal-specific waveform behavior: the ghost packet visibly repeats; the anchored fishing vessel produces a different transient pattern; the live drifting vessel resolves differently.
- Frequency-first / bearing-second acquisition feedback instead of a generic percentage hunt.
- Time-costed archive checks, making investigation a real resource decision.
- Player-authored risk marking before dispatch.
- Escalating weather orders at 02:00 and 01:00 remaining.
- Guided first-run tutorial cues.
- Custom in-world dispatch confirmation instead of a browser confirm dialog.
- Refined procedural Web Audio cues for acquisition, archive checks, warnings, dispatch, success and failure.
- Responsive mobile layout and `prefers-reduced-motion` handling.

## Controls

- Mouse/touch: sliders, tabs, carrier lock, archive, risk marking, dispatch.
- Keyboard: Left/Right adjust frequency; Up/Down adjust bearing; hold Space to stabilize a coherent signal.
- Shift + Left/Right performs a faster frequency step.

## Technical constraints

- Static client-side game only.
- No backend, login, API key, database, analytics, runtime AI, external library, or runtime asset dependency.
- One `index.html` contains gameplay, UI, Canvas rendering, responsive CSS, and procedural Web Audio.
- Runs directly from the repository's GitHub Pages setup.

## QA notes

- JavaScript syntax checked before commit.
- Source re-fetched from GitHub after commit to verify the V2 code landed on `main`.
- Desktop and mobile breakpoints, safe-area padding, reduced-motion behavior, pointer/touch controls, and keyboard bindings were reviewed statically.
- A true screenshot/browser-automation pass should still be run in a browser-capable environment before calling this production-ready; the current ChatGPT connector environment cannot render the live GitHub Pages canvas for screenshot inspection.

## Next production milestone

The highest-value next step is **Case 02**, not more chrome: a second night with a different deception pattern, different geography, and at least one signal whose spoken story is true but whose apparent priority is misleading. That would test whether NIGHT SIGNAL has repeatable game depth rather than a single excellent puzzle.
