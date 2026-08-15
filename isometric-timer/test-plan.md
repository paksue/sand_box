# QA Test Plan

## Core flow

1. Open app in portrait mobile viewport.
2. Start a 30-second hold.
3. Verify 3-2-1 preparation, HOLD state, final-five audio cues, DONE state.
4. Verify Do Again starts a fresh 3-second preparation.

## State and timing

- Start -> PREPARE -> HOLD -> DONE follows absolute deadlines.
- Pause freezes the remaining hold duration.
- Resume performs a new 3-second preparation and then resumes the saved remaining duration.
- Reset from HOLD or PAUSED returns to READY without stray future audio.
- Reload during PREPARE/HOLD restores the mathematically correct state.
- Reload after the stored deadline shows DONE immediately.
- Returning from a hidden tab reconciles elapsed wall-clock time rather than replaying missed seconds.

## Device lifecycle

- Wake Lock requested in PREPARE/HOLD when supported.
- Wake Lock released on PAUSED/DONE/READY.
- Visible-page return reacquires Wake Lock when still active.
- Unsupported/failed Wake Lock shows `Keep screen on` rather than failing the timer.

## Audio

- No sound is attempted before a user gesture.
- Sound toggle cancels already-scheduled future tones when muted.
- Re-enabling sound from a tap schedules only future cues for the current state.
- Completion vibration is optional and feature-detected.

## Responsive/accessibility

- Portrait phone, landscape phone, tablet, and desktop layouts do not clip controls.
- Touch targets are at least 48px high.
- Keyboard Space and R behavior works outside the settings dialog.
- Reduced-motion preference removes nonessential transition duration.
- Phase changes use an ARIA live region; individual seconds are not announced.

## Offline

- First online load installs service worker.
- Later navigation can load cached `index.html` and manifest offline.
- Service worker does not own timer state or scheduling.
