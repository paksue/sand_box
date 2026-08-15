# Isometric Hold Timer

A focused client-side timer for isometric holds.

## Run

Open `index.html` from the GitHub Pages path for this folder. The app has no runtime dependencies and no backend.

## Behavior

- 30-second default hold with 15/20/30/45/60-second presets and 5–300-second custom holds.
- 3-second get-ready countdown before each hold and before resuming a paused hold.
- Uses absolute wall-clock deadlines for suspend/reload recovery instead of relying on one-second timer callbacks.
- Uses a monotonic `performance.now()` deadline while visible for smooth foreground rendering.
- Requests a Screen Wake Lock during prepare/hold and reacquires it when the page becomes visible again when possible.
- Uses Web Audio cues initialized from a user gesture; final 5-second cues plus a distinct completion sound.
- Persists active timer state and preferences in `localStorage`.
- Service worker caches the small app shell for offline use after the first successful load.

## Important browser limitation

A web page cannot guarantee an audible alarm while the operating system has fully suspended the browser after a manual device lock. The app keeps logical time by deadline and reconciles immediately when it becomes active again. Wake Lock is used to prevent the normal auto-lock path while a hold is active when the browser/OS allows it.

## Keyboard

- `Space`: start / pause / resume / repeat
- `R`: reset
