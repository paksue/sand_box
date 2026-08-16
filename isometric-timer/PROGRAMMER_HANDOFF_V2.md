# Senior Programmer Handoff — Isometric Hold Timer V2

This document is the implementation contract for the next programming pass. Read `ARCHITECTURE_V2.md` before modifying runtime code.

## Non-negotiable constraints

- Static client-side application only.
- No backend, account system, cloud database, or server inference.
- One `index.html` entry point; production remains directly hostable on GitHub Pages.
- No React/Vue/Svelte and no mandatory production build step.
- Core timer must work with hands-free features completely disabled or broken.
- Preserve deadline-based suspend/reload correctness from V1.
- Do not ask for microphone/camera permission at page load.
- Do not persist or upload audio, video, landmarks, or biometric data.
- Do not implement pose/gaze controls in this cycle.

## Implementation order

### Slice 0 — Freeze V1 parity

Before refactoring, establish expected behavior for:

- READY -> PREPARE -> HOLD -> DONE
- pause -> 3-2-1 resume
- reset
- duration changes
- page hide/show recovery
- reload while active
- reload after deadline
- wake-lock failure/reacquisition
- sound on/off
- offline core load

Do not redesign the screen in this slice.

### Slice 1 — Extract modules without feature changes

Target:

- `index.html` becomes semantic markup + module bootstrap.
- Extract app CSS.
- Extract timer machine/domain.
- Extract browser effect services.
- Extract UI renderer.
- Extract persistence behind a repository.

Acceptance:

- User-visible V1 behavior is unchanged.
- No new permissions.
- No ML/network request on startup.

### Slice 2 — State schema V2 and migration

Create versioned state objects and deterministic migration from the existing V1 key/state.

Acceptance:

- Existing users do not lose selected duration or active-session recovery where migration is possible.
- Malformed old storage safely falls back to defaults.
- Storage logic exists only behind persistence module.

### Slice 3 — Exercise + progression

Add a deliberately small exercise catalog plus Quick Hold.

Add completion feedback:

- Too hard
- Good
- Easy

Implement transparent progression policy through pure `progression.js`.

Add compact local session history and next-target storage.

Acceptance:

- Timer itself does not know exercise names.
- Progression can be tested without DOM/browser APIs.
- User can ignore feedback and continue using timer normally.

### Slice 4 — Hands-free framework with fake adapter

Before any ML library, implement:

- HandsFreeManager
- adapter lifecycle contract
- capability statuses
- IntentGate
- normalized intent envelopes
- permission/failure UI states
- fake deterministic adapter for tests

Acceptance:

- Fake voice/gesture events can start/pause/resume/repeat via same command router as touch.
- Invalid commands are ignored by mode policy.
- Timer state has zero imports from hands-free modules.

### Slice 5 — Voice adapter

Implement local voice recognition behind `voice-adapter.js` and `voice-worker.js`.

Initial vocabulary only:

- Start
- Pause
- Resume
- Again

Requirements:

- lazy load after explicit enablement
- local inference only
- worker/off-main-thread inference where practical
- transient transcript only
- no transcript history
- command cooldown/de-duplication
- capability status: loading/ready/active/error/permission denied
- core timer remains available if model loading fails

Prefer small/quantized Whisper-compatible browser ASR as the first working adapter. Keep runtime/model identifiers centralized in adapter configuration so they can later be replaced by a dedicated keyword classifier.

### Slice 6 — Gesture adapter

Initial gestures only:

- thumbs up -> start/resume/repeat depending on timer state
- open palm -> pause while HOLD is active

Requirements:

- explicit camera enablement
- no preview by default
- local inference
- dwell confirmation around 500-700 ms
- confidence threshold
- post-command cooldown
- intentional frame sampling
- stop camera tracks when disabled

Acceptance:

- random single-frame detection never triggers a command.
- disabling gesture mode turns off camera use.
- camera denial leaves touch and voice modes usable.

### Slice 7 — Offline/lifecycle hardening

Update service-worker cache version and core precache list after module extraction.

Optional ML assets must not block service-worker installation.

Verify:

- page hidden during active timer
- page restored after timer completion
- hands-free feature hidden/restored
- model unavailable offline before first model download
- model available offline after successful cached load where supported
- device orientation changes
- microphone/camera stream cleanup

### Slice 8 — QA and architecture fitness

Verify the invariants in `ARCHITECTURE_V2.md`.

At minimum test:

- domain modules are browser-API free
- command router state matrix
- timer deadline math
- pause/resume math
- progression policy
- storage migration
- duplicate AI intent suppression
- gesture dwell/cooldown
- permission denial
- model-load failure
- no ML load on cold boot
- camera/mic shutdown

## File ownership rules

`domain/`
- Pure business/timer/training behavior.
- Must not import DOM, storage, MediaPipe, Transformers.js, Wake Lock, getUserMedia, service worker.

`services/`
- Browser/device side effects.
- Must not decide product progression or command legality.

`hands-free/`
- Convert uncertain perception results into intent candidates.
- Must not mutate timer state.

`ui/`
- Render state and emit user actions.
- Must not own timer calculations or ML inference.

`app-controller.js`
- Composition root.
- Connects router, domain, effects, persistence, views, and HandsFreeManager.
- Avoid turning it into a God module; orchestration only.

## Normalized command rules

Every input source must converge before domain execution.

Touch and keyboard are deterministic.

Voice and gesture are probabilistic and therefore pass through IntentGate first.

No adapter is allowed to call functions such as `startHold()` or `pauseHold()` directly.

## Product behavior to preserve

The normal user who never enables hands-free should experience nearly the same product as V1:

Open -> Start -> 3-2-1 -> Hold -> Done.

Exercise identity and progression should remain progressive disclosure, not onboarding friction.

## Definition of done

Implementation is ready for senior QA only when:

1. Core V1 timer parity passes.
2. Module boundaries match architecture.
3. Exercise/progression works locally.
4. Voice commands work through normalized intents or fail gracefully.
5. Gesture commands work through normalized intents or fail gracefully.
6. No camera/microphone request occurs without explicit activation.
7. No audio/video/landmark data is stored or uploaded by app code.
8. No ML assets load during normal timer startup.
9. Offline core timer still works.
10. Architecture docs remain accurate after implementation.

## Explicitly deferred

Do not implement in this programming pass:

- pose auto-start/auto-stop
- gaze/eye control
- face gesture control
- AI chatbot/coaching
- cloud sync
- accounts
- social features
- leaderboards
- subscription/payments
- Apple Health/Google Health integration
- generalized interval workout builder
- large exercise library

If implementation discovers a reason to violate an architecture decision, stop that slice and write a superseding ADR rather than silently changing the architecture.