# ADR-0002: Isolate voice and vision behind replaceable hands-free adapters

Status: Proposed

## Context

V2 adds optional probabilistic input sources: voice commands and hand gestures. Future experiments may add pose detection. These capabilities have different runtimes, permissions, model sizes, performance characteristics, and browser support. If any perception library directly controls timer state, the timer becomes coupled to a specific ML implementation and difficult to test or replace.

Forces:

- Timer must work without AI.
- All inference should remain client-side for V2.
- Camera/microphone permissions must be explicit and recoverable.
- Probabilistic detections need confidence, dwell, and cooldown handling.
- Voice implementation may evolve from general ASR to a smaller keyword model.
- Gesture implementation may evolve independently of voice.
- Future pose recognition should not require rewriting timer logic.

## Decision

Introduce a Hands-Free subsystem containing:

1. `HandsFreeManager` for adapter lifecycle and media/resource ownership.
2. Replaceable voice/gesture adapters that output intent candidates only.
3. `IntentGate` for confidence, dwell, duplicate suppression, cooldown, and impossible-state rejection.
4. One normalized command router shared by touch, keyboard, voice, gestures, and future pose input.

No hands-free adapter may mutate timer state or call timer operations directly.

## Considered options

### Option A — Direct ML-to-timer callbacks

Pros:
- Fastest prototype.
- Fewest files.

Cons:
- Tight coupling between model labels and product behavior.
- Duplicate state rules across voice and gesture implementations.
- Hard to test false-positive suppression.
- Difficult to replace model/runtime later.
- AI failure risks core timer regression.

### Option B — Adapter + IntentGate + command router (chosen)

Pros:
- Timer remains deterministic.
- Same product command rules apply to every input source.
- Voice/gesture engines are replaceable.
- Confidence/debounce policy is centralized.
- Future pose capability can plug in without changing timer domain.
- Fake adapters make end-to-end command testing possible before loading ML.

Cons:
- More architecture than a quick ML demo.
- Requires clear intent contracts and lifecycle management.
- Slightly more indirection when debugging commands.

### Option C — One generalized multimodal AI controller

Pros:
- Superficially unified API.
- Could combine audio/video context later.

Cons:
- Unnecessarily heavy for four timer commands.
- Harder privacy story and resource profile.
- Increases model/runtime coupling and startup cost.
- Makes failure modes less isolated.

## Voice implementation consequence

The architecture does not permanently bind to one recognition engine.

First implementation may use local browser ASR with a small/quantized Whisper-compatible model via Transformers.js, preferably off the main thread. If profiling shows that fixed-command keyword classification is materially better for latency/battery/download size, replace only the voice adapter/model while preserving normalized intents.

Do not make browser/network-backed `SpeechRecognition` a required dependency for the local inference promise.

## Gesture implementation consequence

Initial gesture vocabulary remains intentionally tiny:

- thumbs-up -> positive primary action appropriate to current state
- open palm -> pause while holding

MediaPipe Gesture Recognizer is an implementation detail behind the gesture adapter. Gesture outputs must pass through dwell/confidence/cooldown rules before becoming commands.

## Privacy consequences

- No raw audio/video persistence.
- No landmark persistence.
- No app-authored upload of microphone/camera data.
- Media streams are opened only after explicit user enablement.
- Media tracks stop when a capability is disabled.
- UI exposes active microphone/camera status.

## Fitness functions

- Hands-free modules cannot import or mutate timer state implementation directly.
- A fake adapter can drive the entire command flow through the router.
- Permission denial and model failure leave touch timer functional.
- Duplicate/low-confidence gesture events cannot cause repeated commands.
- Disabling gesture/voice releases owned media resources.
- No ML model/runtime loads on cold boot while hands-free is off.

## Rollback

Any adapter can be disabled or removed without changing the timer domain. If a model/runtime update regresses reliability, pin/rollback that adapter independently. If all hands-free features are disabled, V2 must behave as a conventional V1-compatible timer plus optional progression.