# Hold — Isometric Timer V2

A static, client-side timer for isometric holds with optional local hands-free controls.

## Core flow

- Choose an exercise or use Quick Hold.
- Start with touch, keyboard, or an enabled hands-free command.
- 3-second preparation countdown.
- Accurate hold timing using persisted wall-clock deadlines for suspend/reload recovery.
- Pause/resume with a fresh 3-second preparation period.
- Completion feedback can adjust the next target for supported exercises.

## Progression

Plank, wall sit, side plank, glute bridge hold, hollow hold, and squat hold use a transparent local policy:

- Too hard: target -5 seconds.
- Good: keep the same target.
- Easy: target +5 seconds.

Targets are clamped to exercise-specific bounds and remain editable by the user.

## Hands-free controls

Hands-free features are optional and lazy-loaded only after explicit enablement.

- Voice: Start, Pause, Resume, Again.
- Gesture: thumbs-up for the context-appropriate positive action; open palm to pause during a hold.

Voice uses browser-local speech inference. Gesture recognition uses browser-local MediaPipe processing. The first enablement may require a network connection to download the optional ML runtime/model; the core timer does not.

The app does not persist or upload microphone audio, camera frames, transcripts, or hand landmarks.

## Timing and phone lifecycle

- Wall-clock deadlines (`Date.now()`) are the source of truth for suspension/reload recovery.
- A monotonic performance clock is used while visible for smooth foreground rendering.
- Screen Wake Lock is requested during prepare/hold when available.
- Wake Lock failure does not affect logical timer correctness.
- A fully suspended browser cannot guarantee an audible completion alarm; the app reconciles immediately when active again.

## Offline

The core app shell is cached by a service worker after the first successful load. Optional AI model assets are not part of the initial precache.

## Tests

Open `tests/` from the deployed static site to run the browser test harness for timer state, progression, persistence migration, and normalized hands-free commands.

## Architecture

See `ARCHITECTURE_V2.md`, `PROGRAMMER_HANDOFF_V2.md`, and `adr/`.
