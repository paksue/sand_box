# Isometric Hold Timer — V2 Architecture

Status: Proposed architecture for implementation handoff

## 1. Architectural intent

Evolve the current static isometric timer into an intelligent, hands-free, progression-aware timer while preserving the current product's strongest property: the timer must remain fast, understandable, and fully usable when every optional AI capability is unavailable.

Hard constraints:

- Static client-side web application only.
- One `index.html` entry point served by GitHub Pages or any static host.
- No backend, cloud database, login, API server, or server-side inference.
- No runtime framework requirement.
- No build step required to run production.
- Core timer works offline after first successful load.
- AI features are progressive enhancements and may fail independently.
- Microphone and camera data must never be persisted or uploaded by app code.

Quality priorities, in order:

1. Timer correctness and recoverability.
2. Simplicity of the primary exercise flow.
3. Local privacy and permission clarity.
4. Maintainability/testability.
5. Hands-free responsiveness.
6. Offline capability.
7. AI sophistication.

## 2. Architecture style

Use a modular, event-driven static web application built with browser-native ES modules.

Do not keep growing `index.html` as a monolith. The HTML file becomes a semantic shell plus module bootstrap. CSS, domain logic, device services, persistence, UI rendering, and AI adapters become separate static files.

Do not add React/Vue/Svelte for V2. The application has one primary screen, a few sheets/dialogs, a small state space, and no server-driven component tree. Native modules keep startup small and preserve direct control of timing/device APIs.

Architecture principle:

`all inputs -> normalized intent -> command router -> domain transition -> effects -> render/persist`

Touch, keyboard, voice, gestures, and future pose detection must all enter through the same command boundary.

## 3. C4-style system view

### System context

User -> Isometric Hold Timer PWA -> Browser/device capabilities

Optional ML runtimes/models are downloaded only when a hands-free feature is enabled.

### Browser containers

1. UI Shell
   - Semantic HTML
   - Timer screen
   - Exercise sheet
   - Hands-free sheet
   - Completion/progression flow

2. Domain Core
   - Timer state machine
   - Command policy
   - Training/progression rules
   - Exercise catalog

3. Effect Services
   - Clock/deadline service
   - Wake Lock service
   - Audio cue service
   - Visibility/lifecycle service
   - Vibration service

4. Persistence
   - Versioned localStorage repository
   - Active timer recovery snapshot
   - Preferences
   - Exercise history/progression data

5. Hands-Free Subsystem
   - HandsFreeManager
   - IntentGate
   - Voice adapter
   - Gesture adapter
   - Future pose adapter

6. Service Worker
   - Core app shell caching
   - Versioned cache management
   - Optional runtime/model caching support
   - Never owns timer state or timing

## 4. Proposed static file layout

```text
isometric-timer/
  index.html
  manifest.webmanifest
  sw.js

  styles/
    app.css

  js/
    main.js
    app-controller.js

    domain/
      timer-machine.js
      commands.js
      exercise-catalog.js
      training.js
      progression.js

    state/
      app-state.js
      schema.js
      migrations.js

    services/
      clock.js
      persistence.js
      audio.js
      wake-lock.js
      visibility.js
      vibration.js

    ui/
      render.js
      timer-view.js
      completion-view.js
      exercise-sheet.js
      hands-free-sheet.js
      accessibility.js

    hands-free/
      manager.js
      intent-gate.js
      voice-adapter.js
      gesture-adapter.js

  workers/
    voice-worker.js

  assets/
    models/
      README.md

  tests/
    index.html
    timer-machine.test.js
    progression.test.js
    command-router.test.js
    persistence.test.js

  ARCHITECTURE_V2.md
  PROGRAMMER_HANDOFF_V2.md
  adr/
    0001-static-modular-es-modules.md
    0002-hands-free-adapter-boundary.md
```

Do not create a pose adapter in production code until the pose prototype phase begins. Keep the interface extensible enough to add one later.

## 5. Core state model

Keep three concerns separate.

### Timer state machine

Legal modes:

- `READY`
- `PREPARE`
- `HOLD`
- `PAUSED`
- `DONE`

Legal primary transitions:

```text
READY -> PREPARE -> HOLD -> DONE
                   |       |
                   v       v
                 PAUSED   READY
                   |
                   v
                 PREPARE -> HOLD
```

A reset may return PREPARE/HOLD/PAUSED/DONE to READY.

The timer machine owns timing state only. It must not know about microphone, camera, MediaPipe, Whisper, DOM elements, CSS, or storage APIs.

### Training state

Contains:

- selected exercise id
- current target duration
- personal best per exercise
- compact session history
- most recent difficulty feedback
- recommended next target

### Hands-free capability state

Each adapter independently owns:

- `OFF`
- `LOADING`
- `READY`
- `ACTIVE`
- `PERMISSION_DENIED`
- `ERROR`

Hands-free capability state must never be encoded into timer mode.

## 6. Normalized input contract

All interaction sources emit an intent envelope conceptually containing:

- intent
- source
- timestamp
- optional confidence
- optional raw label for diagnostics only

Supported normalized intents for V2:

- `START`
- `PAUSE`
- `RESUME`
- `CANCEL_PREPARE`
- `REPEAT`
- `RESET`

Sources:

- touch
- keyboard
- voice
- gesture
- future pose

The command router validates intent against current timer mode before dispatching it to the timer machine.

Example policy:

| Timer mode | Accepted intents |
|---|---|
| READY | START |
| PREPARE | CANCEL_PREPARE, RESET |
| HOLD | PAUSE, RESET |
| PAUSED | RESUME, RESET |
| DONE | REPEAT, RESET |

Gesture mappings may be contextual at the adapter boundary, e.g. thumbs-up -> START when READY, RESUME when PAUSED, REPEAT when DONE. Open palm -> PAUSE only while HOLD is active.

AI adapters must not mutate timer state directly.

## 7. Timer correctness contract

Preserve the successful V1 timing model.

- Persist wall-clock phase deadlines using `Date.now()` for suspension/reload recovery.
- Use a monotonic `performance.now()` deadline while visible for smooth foreground rendering.
- Never implement countdown correctness by decrementing a number once per second.
- On visibility restoration, page show, or reload: reconcile state from the persisted deadline before rendering.
- If a deadline passed while hidden, transition directly to the mathematically correct state.
- Wake Lock is an effect, not a prerequisite for timer correctness.
- Service Worker is never used as an alarm clock.

## 8. Domain/effect separation

The timer machine should be as pure as practical.

A domain transition receives current timer state, an intent/event, and the relevant time value; it returns new timer state plus requested effects.

Effect categories can include:

- request/release wake lock
- schedule/cancel audio cues
- vibrate
- persist snapshot
- record completed session
- announce accessibility status

The effect coordinator performs browser API calls. Browser failures become effect results and UI capability status; they do not corrupt domain state.

## 9. Persistence architecture

Use a repository wrapper around `localStorage` for V2 rather than direct `localStorage` calls scattered through modules.

Suggested logical stores:

- `hold.core.v2` — active timer recovery snapshot
- `hold.settings.v2` — sound, duration, selected exercise, hands-free preferences
- `hold.training.v2` — compact exercise records/history

Every stored object includes a schema version.

`migrations.js` performs deterministic migrations before the application state is created.

Do not introduce IndexedDB yet. The repository abstraction is the migration seam if storage volume later proves localStorage insufficient.

Never persist:

- camera frames
- audio buffers
- transcripts beyond transient command matching
- face/hand/body landmarks
- biometric templates

## 10. Exercise and progression domain

Exercise metadata lives in `exercise-catalog.js`, not hard-coded into UI components.

Initial catalog should remain intentionally small. The architecture supports adding exercises without changing timer logic.

Suggested exercise record fields:

- stable id
- display name
- default target seconds
- progression step seconds
- min/max target bounds
- optional future pose profile id

Progression is a pure policy function.

Initial transparent policy:

- Too hard -> target minus one progression step
- Good -> same target
- Easy -> target plus one progression step

Clamp to exercise bounds.

The UI presents the recommendation as editable; progression never silently overrides user intent.

Session records should capture at minimum:

- session id
- exercise id
- target duration
- completed duration
- completed timestamp
- completion reason
- difficulty feedback if supplied
- recommended next target
- initiating input source

## 11. Hands-free architecture

### HandsFreeManager

Owns lifecycle of optional adapters.

Responsibilities:

- lazy load requested adapter
- request permission only after explicit user action
- start/stop adapter according to app visibility and hands-free setting
- surface capability status to UI
- dispose media tracks/resources when disabled
- merge adapter outputs into the IntentGate

It does not understand timer transitions.

### IntentGate

All probabilistic inputs pass through one gate before reaching the command router.

Responsibilities:

- confidence threshold
- dwell/temporal confirmation where appropriate
- duplicate suppression
- cooldown after accepted command
- state-sensitive rejection of impossible commands
- diagnostic reason for ignored candidates

Initial gesture policy target:

- thumbs-up must remain stable for roughly 500-700 ms before acceptance
- open palm must remain stable for roughly 500-700 ms before acceptance
- after an accepted gesture, apply a short cooldown before another gesture can fire

Exact thresholds are tuning constants, not domain logic.

## 12. Voice adapter decision

Architect the voice feature as a replaceable adapter.

V2 implementation target:

- local browser inference
- fixed command vocabulary: Start, Pause, Resume, Again
- model/runtime lazy-loaded only after voice is enabled
- inference should be isolated from the timer/render loop, preferably through `voice-worker.js`
- transcript/text is transient and used only to map to a command

Recommended first implementation path: browser-local automatic speech recognition using a small/quantized Whisper-compatible model through Transformers.js, with WASM as baseline and WebGPU used only when supported and verified.

Long-term optimization path: replace the ASR adapter with a small dedicated keyword-classification model if testing shows lower latency, bandwidth, memory, and battery use. Because the rest of the app depends only on normalized intents, this swap must not affect timer or UI modules.

Do not use network-backed browser speech recognition as the architectural dependency for the local/privacy promise.

## 13. Gesture adapter decision

Use a browser-local hand gesture recognizer adapter.

Initial vocabulary:

- thumbs-up -> context-appropriate positive action (start/resume/repeat)
- open palm -> pause while holding

The adapter may use MediaPipe Gesture Recognizer in live-stream/video mode.

Camera rules:

- permission requested only after explicit hands-free activation
- one camera stream owned by HandsFreeManager
- no recording
- no frame persistence
- no uploads by app code
- camera preview off by default
- camera tracks stopped when gesture mode is disabled
- lower inference frame rate than display frame rate; do not process every camera frame if unnecessary

## 14. Future pose boundary

Pose recognition is a separate future capability, not part of the first V2 implementation.

When introduced, it must implement the same adapter contract and emit normalized intents/events such as:

- pose_ready
- hold_started
- hold_broken

The first pose prototype should support one exercise only (recommended: plank) before the architecture is generalized.

Never let pose heuristics enter the timer machine.

## 15. UI architecture

The DOM remains deliberately small.

Primary surfaces:

1. Timer screen
2. Exercise sheet
3. Hands-free sheet
4. Completion/progression state

`render.js` is the top-level renderer. Feature-specific view modules update only their owned DOM regions.

Do not create a generic component framework or virtual DOM.

UI receives a serializable view model derived from app state. UI event handlers emit normalized UI actions to AppController; they do not call services directly.

## 16. Lifecycle and resource ownership

AppController owns application startup/shutdown.

Rules:

- Wake Lock exists only during PREPARE/HOLD and is reacquired when visible if possible.
- Audio context is initialized from a user gesture and reused.
- Camera and microphone streams belong to HandsFreeManager only.
- Media tracks are stopped when corresponding capability is disabled.
- Heavy ML resources are not initialized at boot.
- Hidden-page behavior prioritizes timer recovery; camera inference may stop when page is hidden.
- On return, reconcile timer first, then restore optional capabilities.

## 17. Service worker contract

Core precache:

- index.html
- app CSS
- core JS modules
- manifest and essential static assets

Do not include optional ML model payloads in the initial install precache.

AI assets use lazy runtime caching or the ML library's own browser cache after first enablement.

A failed model download must produce `Hands-free unavailable` while leaving the core timer usable.

Cache versions must be explicit so model/runtime upgrades cannot silently mix incompatible files.

## 18. Security/privacy boundaries

- Use only secure-context browser APIs in production HTTPS.
- No telemetry containing audio/video/landmarks.
- No raw media storage.
- No remote inference in V2.
- Permissions are feature-scoped and user-initiated.
- UI must visibly indicate microphone/camera active state.
- Disabling a hands-free capability immediately stops its stream and inference loop.
- Never claim permissions are guaranteed to remain active; surface failures recoverably.

## 19. Performance budgets

Architectural budgets, to be validated during implementation:

- Core timer must not load ML runtime/model assets during normal startup.
- Core interactions must remain responsive while ML inference is active.
- Voice inference must not run on the main render/timer path.
- Gesture recognition should intentionally sample camera input rather than infer on every display frame.
- Timer display continues from its own animation/reconciliation loop regardless of AI throughput.

## 20. Architectural fitness checks

The programmer should preserve these invariants with automated or browser-harness tests:

1. `domain/` modules never import DOM, MediaPipe, Transformers.js, Wake Lock, or storage APIs.
2. Hands-free adapters never mutate timer state.
3. All non-touch commands reach timer logic through the command router.
4. No AI runtime/model is requested on cold boot with hands-free disabled.
5. Timer reload recovery returns the mathematically correct remaining state.
6. Permission denial leaves touch timer fully usable.
7. Model-load failure leaves touch timer fully usable.
8. Camera/mic streams stop after hands-free disable.
9. Service worker never owns countdown scheduling.
10. Stored app schema migrates deterministically from V1 data.

## 21. Migration strategy from V1

Incremental, no big-bang rewrite.

Phase A — Baseline lock
- Record current V1 behavior and recovery cases.
- Do not change visuals.

Phase B — Modular extraction
- Move current timer logic/services/rendering out of `index.html` without feature changes.
- Preserve current storage compatibility.

Phase C — Versioned state/repository
- Introduce schema v2 and migration from current localStorage state.

Phase D — Exercise/progression
- Add exercise catalog, completion feedback, local history, next-target recommendation.

Phase E — Hands-free framework
- Add HandsFreeManager, adapter contract, IntentGate, permission UI with a fake/test adapter first.

Phase F — Voice adapter
- Add lazy local ASR worker and fixed command mapping.

Phase G — Gesture adapter
- Add camera permission, MediaPipe gesture recognition, dwell/cooldown gate.

Phase H — Hardening
- Offline/model cache behavior, mobile lifecycle tests, resource cleanup, accessibility, performance.

Pose detection, sets/rest programming, gaze controls, cloud sync, accounts, and generalized AI coaching remain explicitly out of scope for this implementation cycle.

## 22. Rollback strategy

Each phase must be independently releasable.

If progression causes problems, the modular timer remains usable with training features disabled.

If a hands-free adapter is unreliable, disable that adapter without altering timer code.

If a model/runtime upgrade breaks compatibility, pin/rollback the adapter's runtime/model version while retaining the core app.

The existing V1 can remain available from git history; migration should never require destroying the old timer implementation before parity is verified.

## 23. Senior Programmer acceptance condition

The architecture is implemented correctly when the application can answer all of these with independent modules:

- What time is left? -> Timer domain/clock.
- What should happen after Start? -> Command router + timer machine.
- What should my next target be? -> Progression domain.
- How is data saved? -> Persistence repository.
- How does the phone stay awake? -> Wake Lock service.
- How is a voice command recognized? -> Voice adapter.
- How is a gesture recognized? -> Gesture adapter.
- Should that probabilistic recognition trigger an action? -> IntentGate.
- How does the screen change? -> UI renderer.

No one module should need to understand all of those concerns.