# Current state

## Implemented
- Static/client-only 3D runtime
- RC throttle, reverse, braking, steering, terrain grip and visual suspension
- Keyboard, touch and Gamepad API input
- Four camera experiences, headlights and photo mode
- Backyard After Rain: creek, bridge, deck/ramp, shed, drain pipe, rocks, roots, giant plants, puddles, fence and instanced grass
- Seven locally persisted discoveries
- Locally synthesized electric-motor audio
- Adaptive render-resolution fallback
- Responsive low-chrome HUD and field guide
- Deterministic browser automation API
- Playwright smoke/discovery tests with screenshots
- GitHub Actions validation and Pages publishing

## Asset strategy
V1 is intentionally procedural so it has no external binary-art dependency. The architecture can accept optimized GLB environment chunks later without changing the client-only contract.
