# ADR-0001: Keep the application static and modularize with native ES modules

Status: Proposed

## Context

V1 is intentionally simple and currently places UI, CSS, timer state, browser effects, persistence, and rendering in one `index.html`. V2 adds exercise progression plus optional voice and gesture perception. Continuing to place all responsibilities in one file would create a high-coupling God module, while moving to a framework would add runtime/build complexity that is not justified by the product surface.

Forces:

- Must remain a client-only static web app.
- Core timer startup should remain extremely small and reliable.
- Optional AI code must not slow normal startup.
- Timer/domain behavior needs deterministic testing.
- GitHub Pages deployment should remain trivial.
- Future programmer should have clear ownership boundaries.

## Decision

Keep one `index.html` entry point and GitHub Pages/static hosting, but move runtime logic into browser-native ES modules organized by domain, services, UI, state, and hands-free adapters.

No production framework and no mandatory production build step will be introduced for V2.

## Considered options

### Option A — Continue the single-file application

Pros:
- Simplest deployment.
- No import graph.
- Easy to copy as one file.

Cons:
- Timer, persistence, ML, permissions, UI, and training logic become tightly coupled.
- Harder to test pure timing/progression behavior.
- Higher risk that AI additions regress core timer behavior.
- Poor programmer handoff as file size grows.

### Option B — Native ES modules (chosen)

Pros:
- Preserves static deployment and no-build runtime.
- Creates explicit boundaries with minimal machinery.
- Supports lazy dynamic imports for AI features.
- Pure domain modules can be tested independently.
- Easy incremental migration from V1.

Cons:
- More files and imports than V1.
- Requires correct service-worker cache management across module files.
- Programmer must enforce boundaries without framework conventions.

### Option C — React/Vue/Svelte application

Pros:
- Mature component/state ecosystems.
- Strong tooling for larger applications.

Cons:
- Introduces build/package/runtime complexity for a small single-screen instrument.
- Does not improve timer correctness, Wake Lock, or media-permission reliability.
- Encourages app-shell complexity before the product needs it.
- Makes the zero-dependency/static premise weaker.

## Consequences

Positive:
- Core timer can stay small and isolated.
- ML features can lazy-load independently.
- Product logic becomes testable without browser APIs.
- Static GitHub Pages deployment remains valid.

Negative:
- A module naming/ownership discipline must be maintained manually.
- More HTTP module requests exist on first uncached load, mitigated by HTTP/2 and service-worker caching on the deployed host.
- Service worker must update its core asset list when modules change.

## Fitness functions

- Domain modules must not import browser/device/ML APIs.
- Core page load with hands-free disabled must make no ML model/runtime request.
- Static deployment must work without a package manager or server process.
- V1 timer lifecycle parity must pass after modular extraction.

## Rollback

The modular extraction is performed incrementally with behavior parity. If a slice fails, revert that slice while keeping the previous working static implementation. No data migration should become irreversible before parity is verified.