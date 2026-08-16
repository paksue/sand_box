# Optional ML assets

V2 does not precache ML models with the core timer.

- Voice currently lazy-loads `onnx-community/whisper-tiny.en` through pinned Transformers.js 4.2.0 in `workers/voice-worker.js`.
- Gesture control lazy-loads MediaPipe Tasks Vision 1.0.1 and Google's gesture recognizer model in `js/hands-free/gesture-adapter.js`.

The core timer must remain fully usable if these network/model loads fail. No camera frames, microphone buffers, transcripts, or landmarks are persisted by app code.
