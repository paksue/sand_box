# WorldTap Agent Constitution

This file governs all work under `worldtap-next/`.

## Mission

Build WorldTap into a tiny, durable consumer game that can reach **$100/month in recurring revenue** with the smallest reliable product. Optimize for a delightful daily game, retention, sharing, and learning—not infrastructure volume or feature count.

## Required context

Before changing product behavior, UI, architecture, backend, analytics, or monetization, read the relevant constitution files:

- `PRODUCT.md` — product promise, free/paid boundary, milestones, metrics, non-goals.
- `DESIGN.md` — interaction, visual hierarchy, mobile rules, paywall behavior, accessibility.
- `ARCHITECTURE.md` — technical boundaries, static-first architecture, backend responsibilities, security.

Use the project skills in `.agents/skills/` when the task matches them:

- `worldtap-architect` — architecture and build-vs-defer decisions.
- `worldtap-design` — UI/UX generation and review.
- `worldtap-engineering` — production frontend/game implementation and QA.
- `worldtap-billing` — subscriptions, checkout, webhooks, entitlements.
- `worldtap-analytics` — instrumentation, funnels, experiments, growth diagnosis.

For external platform work, prefer current official guidance. In particular, use current Supabase skills/docs for Supabase/Postgres work and current web-interface guidelines for UI review rather than relying on stale model memory.

## Prime directives

1. **Earth is the interface.** Preserve direct, tactile globe interaction.
2. **The daily game is free and anonymous by default.** Never require sign-in before a player can complete and share today's game.
3. **The game must survive backend failure.** Core daily play, scoring, reveal, streak storage, and sharing should remain available client-side wherever practical.
4. **Do not rewrite the proven renderer for fashion.** The current MapLibre + Three.js shared-WebGL approach is an intentional architecture and must only be replaced with measured evidence.
5. **Prefer static data and local computation.** Do not add a database/API for content that can safely ship as static assets.
6. **Backend scope is narrow until evidence expands it:** identity, paid entitlements, optional synced history/stats, and later social features that have proven demand.
7. **No speculative scale architecture.** No microservices, queues, Redis, Kubernetes, or complex event systems without a measured need.
8. **Performance is a feature.** Target iPhone 11-class hardware; interaction smoothness wins over decorative effects.
9. **Measure before optimizing growth.** Instrument activation/retention/sharing before adding a paywall.
10. **Every substantial feature must name the metric or user problem it is intended to improve.**

## Current reality

The repository began as a renderer lab. It now also contains a working daily prototype and deterministic daily engine (`daily-touch.html`, `daily-engine.js`) with five rounds, local persistence, streak/history helpers, scoring flow, and tests. Treat working behavior as valuable evidence, not disposable prototype code.

## Authority levels

### Green — agents may do without product-owner approval

- research and audits
- tests and test fixes that do not alter intended behavior
- accessibility review
- performance diagnosis
- analytics reports
- documentation
- refactors with no observable behavior change

### Yellow — implement as a reviewable change

- UI changes
- analytics instrumentation
- performance optimizations
- production bundling/module extraction
- bug fixes that affect behavior
- backend schema/functions within the approved architecture

### Red — explicit product-owner approval required

- pricing changes
- moving anything from free to paid
- changing the daily-game core mechanic
- changing payment provider
- sending marketing messages or posting publicly
- introducing ads
- destructive customer-data operations
- public leaderboards, chat, friend networks, or other major social scope
- replacing the renderer/engine architecture

## Delivery rules

- Prefer small, reversible changes.
- Keep the free loop fast: **arrive → play → reveal → finish → share**.
- Do not introduce account prompts into the active daily-game flow.
- Add tests for deterministic game logic and critical monetization/security paths.
- Never expose service-role keys, billing secrets, webhook secrets, or private credentials to browser code.
- For UI work, verify small-screen layout and touch behavior; avoid requiring page scrolling during active guessing when reasonably possible.
- When a task conflicts with this constitution, stop and surface the conflict rather than silently weakening the product principles.
