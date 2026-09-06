# NIGHT SIGNAL

A client-side coastal search-and-rescue deduction thriller built as a one-shot browser-game prototype.

## Play

https://paksue.github.io/sand_box/night-signal/

## Player loop

1. Sweep 460–470 MHz for signal peaks.
2. Rotate the directional array until signal coherence reaches 82%+.
3. Hold **LOCK CARRIER** to recover the transmission.
4. Use **ARCHIVE** to cross-check registry, signal behavior, and drift evidence.
5. Use **DISPATCH** to commit the single available rescue boat.

There are three contacts, one rescue asset, multiple endings, and a best grade based on both the decision and how completely the player investigated.

## Controls

- Mouse/touch: sliders, tabs, carrier lock, archive, dispatch.
- Keyboard: Left/Right adjust frequency; Up/Down adjust bearing; hold Space to lock a coherent signal.
- Shift + Left/Right performs a faster frequency step.

## Technical constraints

- Static client-side game only.
- No backend, login, API key, database, analytics, or runtime AI.
- No external libraries or runtime asset dependencies.
- One `index.html` contains gameplay, UI, Canvas rendering, responsive CSS, and procedural Web Audio.
- Runs directly from the repository's existing GitHub Pages setup.

## Visual / audio direction

Diegetic North Atlantic rescue console: dark naval glass, phosphor-cyan radar, amber warnings, storm rain, scanline treatment, directional radar sweep, live waveform, and synthesized radio-room ambience.

## Next production pass

Highest-value extensions: add a second case with different signal logic, voiced/local audio fragments, more physical radio controls, stronger onboarding for frequency-first then bearing-second search, accessibility options, and automated browser screenshot/playthrough tests.
