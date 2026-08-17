---
name: worldtap-engineering
description: Use for WorldTap frontend/game implementation, refactors, productionization, performance work, tests, and integration changes. Preserves working MapLibre/Three behavior, touch quality, deterministic daily logic, and small reversible delivery.
---

# WorldTap Engineering

## Read first

Read `AGENTS.md`, `PRODUCT.md`, `DESIGN.md`, and `ARCHITECTURE.md` before substantial implementation.

For backend/database tasks, also load current official Supabase/Postgres guidance. For UI work, use `worldtap-design` and a current interface-guidelines review when available.

## Engineering mission

Ship the smallest reliable change that improves a proven user/business need while protecting the free daily game's speed and tactile quality.

## Preserve before refactor

The current prototype contains working evidence. Before restructuring:

1. identify observable behavior being preserved
2. locate existing tests
3. add characterization tests when important behavior is unprotected
4. refactor incrementally
5. verify behavior on the target interaction path

Do not use “prototype” as permission for a ground-up rewrite.

## Renderer constraints

The current architecture intentionally uses:

- MapLibre for globe projection/camera/drag/pinch/geographic picking
- Three.js for game effects
- one shared WebGL context through a MapLibre custom layer

Do not introduce a second independent globe camera/render loop or replace this architecture without explicit approval and measured evidence.

Avoid framework/component lifecycles repeatedly mounting/unmounting the renderer.

## Productionization direction

When Gate 1 is active, prefer incremental movement toward:

- Vite
- TypeScript
- pinned bundled dependencies
- cohesive modules for game, UI, auth, billing, analytics
- automated tests
- previewable deployments

Productionization should not intentionally change core gameplay in the same patch unless the task explicitly requires it.

## State ownership

Keep a clear source of truth.

- anonymous daily state: local/client state first
- deterministic puzzle selection: pure/reproducible logic
- cloud result sync: enhancement, not required for daily play
- paid access: semantic entitlement from trusted backend state
- analytics: observational only; never a gameplay dependency

Avoid duplicating mutable game state across DOM, renderer objects, localStorage, and backend without explicit synchronization rules.

## Implementation style

Prefer:

- small pure functions for scoring/daily selection/merge rules
- explicit state transitions
- dependency injection or thin boundaries around analytics/auth/billing
- feature flags/development entitlements for incomplete paid experiences
- code that can be deleted if the experiment fails

Avoid:

- speculative generic abstractions
- large utility frameworks
- hidden global mutation
- network calls in rendering/touch hot paths
- coupling game completion to analytics success

## Performance

The user-visible order is:

1. touch responsiveness
2. picking correctness
3. reveal correctness
4. stable frame rate
5. decorative effects

Measure before optimizing.

When adding UI/effects:

- avoid layout work in animation hot paths
- avoid unnecessary allocations per frame
- avoid duplicate render loops
- avoid repeated heavy GeoJSON/data transforms
- preserve GPU/resource cleanup when objects are replaced
- test target-class phone behavior, not desktop alone

A visually impressive change that makes touch feel worse does not ship.

## Tests

Before finishing a change, run the relevant existing tests and add coverage for new critical behavior.

### Pure logic candidates

- deterministic daily set
- date boundaries
- score/distance rules
- streak/history
- merge/dedupe
- entitlement mapping

### Browser candidates

- five-round completion
- tap/pointer guard
- reveal flow
- result/share UI
- mobile viewport layout
- premium locked/unlocked states

### Backend candidates

- RLS user isolation
- webhook signature verification
- webhook idempotency
- subscription lifecycle → entitlement mapping
- unauthorized checkout rejection

Routine tests must not depend on a live paid transaction.

## Error handling

Fail soft around non-core services.

- analytics error → game continues
- auth sync error → preserve local game/history and explain retry
- billing provider error → free game continues; paid action gives a recoverable error
- premium entitlement service unavailable → protect paid content while not blocking the free daily

Do not swallow errors that would cause silent customer-access corruption.

## Security

Never expose:

- service-role keys
- billing API secrets
- webhook signing secrets
- private admin credentials

Treat browser input, URL state, localStorage, and webhook payloads as untrusted at server boundaries.

Do not rely on a hidden button/client flag to secure premium server data.

## Change checklist

Before marking implementation complete:

- [ ] named the user problem/metric
- [ ] read relevant constitution files
- [ ] preserved free anonymous daily play unless explicitly approved otherwise
- [ ] avoided needless backend dependency
- [ ] kept globe/touch performance in mind
- [ ] added/updated relevant tests
- [ ] handled failure paths
- [ ] avoided secret exposure
- [ ] kept the change reversible
- [ ] documented a new architectural decision if the change creates a lasting boundary/dependency

## Stop conditions

Pause and surface the decision instead of proceeding when a task would:

- move daily play behind auth/paywall
- replace the renderer architecture
- introduce a major framework/infrastructure dependency without evidence
- change pricing/provider
- require destructive customer-data behavior
- materially degrade target-phone interaction performance
