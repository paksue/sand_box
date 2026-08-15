# Implementation Notes

- Core UI and logic live in `index.html`; there is no framework and no build step.
- `manifest.webmanifest` and `sw.js` are progressive enhancements for install/offline behavior.
- Timer correctness is deadline-based, not callback-count-based.
- Screen Wake Lock is requested only during PREPARE/HOLD and is treated as best-effort.
- Background/hidden recovery uses wall-clock reconciliation; foreground rendering uses a monotonic performance deadline.
- Audio is armed only from explicit user interaction and can be muted at any time.
