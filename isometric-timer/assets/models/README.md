# ML assets

The timer remains fully usable if optional voice/gesture dependencies fail.

- Voice lazy-loads `onnx-community/whisper-tiny.en` through pinned Transformers.js 4.2.0 in `workers/voice-worker.js`.
- Hand detection/landmarks use MediaPipe Tasks Vision 1.0.1 and Google's Gesture Recognizer task in `js/hands-free/gesture-adapter.js`.
- `hold-gestures-v1-q8.json` is Hold's built-in 63→32→3 landmark classifier for `none`, `pause`, and `start`. It is precached by the PWA and requires no user installation.

## Hold gesture v1 training/privacy

Hold v1 was distilled from 202 detected START examples, 138 detected PAUSE examples, and 300 public HaGRID `no_gesture` landmark examples. The shipped JSON contains only scaler values, biases, and quantized model weights. It does **not** contain the original training photos or raw positive landmark examples.

Live camera frames and hand landmarks are processed in memory and are not persisted by Hold. If Hold v1 cannot load, gesture control falls back to Google's canned `Thumb_Up` / `Open_Palm` classifier.
