# WorldTap Architecture Constitution

## Architectural goal

Build the smallest production architecture that preserves WorldTap's tactile game quality and can support the first **$100/month recurring revenue**.

Architecture is a means to validate the business loop—not an independent optimization target.

## Current state

`worldtap-next` began as a renderer validation lab and now also contains a daily-game prototype.

Important existing evidence:

- MapLibre GL JS owns globe projection/camera/drag/pinch/geographic picking.
- Three.js renders game effects in the same WebGL context through a MapLibre custom layer.
- The renderer targets iPhone 11-class hardware and approximately 60 fps interaction.
- `daily-engine.js` already provides deterministic five-round daily sets, local persistence, streak/history helpers, and a tap guard.
- `daily-touch.html` is the active touch-oriented daily prototype.
- tests exist for daily-engine and browser flows.

Do not discard working behavior simply because the project is being productionized.

## Target Phase 1 architecture

```text
                         WORLDTAP
                            |
              +-------------+-------------+
              |                           |
              v                           v
       STATIC GAME CLIENT            SMALL BACKEND
     Vite + TypeScript                 Supabase
     MapLibre + Three.js                   |
              |                     +------+------+ 
              |                     |      |      |
              |                    Auth    DB    Edge Functions
              |                     |      |      |
              |                     |      |      v
              |                     |      |   Billing provider
              |                     |      |
              +-----------+---------+------+ 
                          |
                          v
                       PostHog
                 product analytics
```

This is a target, not permission to implement every box immediately. Follow the gates below.

## Static-first rule

The default is:

> **If it can safely be a static asset or computed locally, keep it static/local.**

Good static/client candidates:

- daily question bank / puzzle manifests
- category metadata
- scoring calculations
- geographic distance calculations
- today's deterministic set
- anonymous streak/history
- share-card text generation
- visual assets

Do not put daily questions in a database merely because a database exists.

A public daily game can tolerate motivated users inspecting static assets. Anti-cheat infrastructure is not justified until there is a real competitive/prize requirement.

## Client production target

When the renderer quality gate is satisfied, productionize toward:

- Vite
- TypeScript
- pinned/bundled MapLibre
- pinned/bundled Three.js
- small DOM UI modules rather than a framework rewrite by default

Suggested direction:

```text
src/
  game/
    globe.ts
    scoring.ts
    daily.ts
    game-state.ts
  ui/
    hud.ts
    reveal.ts
    result-card.ts
    paywall.ts
    profile.ts
    mastery-map.ts
  auth/
  billing/
  analytics/
  app.ts
```

This structure is illustrative. Preserve behavior first; extract modules incrementally.

## Framework rule

Do **not** introduce React, Next.js, or another major UI framework simply because production code usually has one.

A framework becomes reasonable only when measured UI state/complexity makes it cheaper than the current approach. The MapLibre/Three renderer is imperative and should not be wrapped in needless component churn.

## Core availability boundary

A backend outage must not prevent a player from completing today's daily game wherever practical.

Core loop:

**load → play → score/reveal → finish → share**

should remain client-capable.

Backend-dependent extras may degrade gracefully:

- account sync
- paid archive/unlimited entitlements
- cloud history
- cross-device mastery
- later social features

## Backend responsibilities

Until evidence requires more, backend responsibilities are limited to:

1. authentication / identity
2. paid subscription entitlement
3. optional cloud sync of game results/stats
4. server-side integration with payment provider
5. later proven social features

Do not build generalized CMS, notification, social, recommendation, or event-processing platforms in Phase 1.

## Authentication

Target: Supabase Auth.

Principles:

- anonymous play first
- ask for authentication when the player requests cross-device/premium value
- prefer low-friction methods such as Google and email magic link/OTP
- do not create a local password system
- preserve local anonymous history and migrate/merge it after account creation

For Supabase implementation, agents must consult current official Supabase documentation/skills instead of relying solely on model memory.

## Data model

Keep the initial schema minimal.

Possible core tables:

### profiles

- `id` (user id)
- `created_at`
- `display_name` only if/when actually needed

### subscriptions

- `id`
- `user_id`
- `provider`
- `provider_customer_id`
- `provider_subscription_id`
- `product_id`
- `variant_id`
- `status`
- `renews_at`
- `ends_at`
- timestamps

### game_results

- `id`
- `user_id`
- `puzzle_key` / date
- `score`
- minimal round/result payload only if product requirements need it
- `completed_at`

Do not persist derived mastery aggregates until query cost or product requirements justify them. Derive first; cache later.

## Entitlements

Application code must depend on semantic capabilities, not price/SKU checks.

Good:

```text
worldtap_plus = true
```

Bad:

```text
if price == 19.99
```

The entitlement layer should allow monthly, annual, gifted, promotional, founder, or migrated access to map to the same capability.

Premium UI asks: **Does this user have `worldtap_plus`?**

## Billing

Initial provider hypothesis: a merchant-of-record provider such as Lemon Squeezy to minimize tax/compliance overhead at tiny revenue.

This is an implementation hypothesis, not a permanent dependency. Before building billing, verify current pricing, supported countries, webhook behavior, subscription APIs, customer portal, tax handling, and terms against the provider's current official documentation.

Browser code must never contain billing secrets.

Expected flow:

```text
authenticated user
      |
      v
server/edge create-checkout function
      |
      v
hosted/overlay checkout
      |
      v
signed payment webhook
      |
      v
subscription record + entitlement
      |
      v
WorldTap+ unlocked
```

Webhook processing must be:

- signature-verified
- idempotent
- tolerant of duplicate/out-of-order delivery where provider behavior requires it
- auditable enough to diagnose customer access problems

Use the provider's hosted customer portal rather than building subscription-management UI when feasible.

## Supabase security

All exposed user-owned tables must use Row Level Security appropriate to the access model.

Baseline:

- users can read/write only their own private data unless a feature explicitly requires otherwise
- service-role credentials never ship to the browser
- Edge Function secrets stay server-side
- validate authorization server-side for privileged operations
- migrations and RLS policies are version-controlled

For database/schema/RLS work, load current Supabase and Postgres best-practice guidance.

## Anonymous-to-account migration

A player may accumulate local history before creating an account.

Account creation must not punish that user.

Design a migration/merge path that:

- preserves completed days and scores
- avoids duplicate game results
- is retry-safe
- handles an account that already has cloud history
- defines conflict behavior explicitly

Do not implement the full migration system until account sync is actually being built, but do not choose local data formats that make migration unnecessarily difficult.

## Analytics

Install analytics before billing so baseline behavior exists.

Phase 1 product event vocabulary should stay small and stable:

- `game_started`
- `round_completed`
- `game_completed`
- `result_shared`
- `plus_viewed`
- `checkout_started`
- `checkout_completed`

Add properties only when they answer a decision. Avoid event-name proliferation and auto-capturing sensitive data.

Initial analytics hypothesis: PostHog or an equivalent lightweight product analytics platform. Verify current pricing/privacy/deployment details before implementation.

## Privacy/data minimization

Collect the least data necessary to run the game and diagnose the funnel.

Do not collect precise real-world player location merely because WorldTap is geographic.

Avoid putting personally identifying information into analytics event properties.

Document any future use of cookies/storage/analytics necessary for public deployment and consent requirements.

## Performance budget

Touch responsiveness is a release gate.

Priorities:

1. direct globe manipulation
2. accurate geographic picking
3. reveal correctness
4. stable frame rate
5. visual effects

If an effect harms interaction performance on the target class of phone, reduce/remove the effect.

Production bundling must not accidentally duplicate Three.js/MapLibre instances or create multiple competing render loops.

## Reliability philosophy

At this scale, favor simple failure modes.

Examples:

- static daily game continues when analytics is unavailable
- analytics failure never blocks gameplay
- billing UI communicates temporary billing failure without corrupting local play
- entitlement checks can fail closed for paid content while leaving free daily play available
- repeated webhook delivery does not create duplicate subscriptions

## Testing

Preserve and expand the existing test direction.

Critical test layers:

### Pure logic

- deterministic daily selection
- score/distance calculations
- streak/history behavior
- anonymous-to-account merge rules
- entitlement mapping

### Browser/game flow

- start and complete five rounds
- touch/pointer protections
- reveal behavior
- result/share flow
- small-screen layout smoke tests

### Backend/security when added

- RLS isolation
- authenticated checkout creation
- webhook signature rejection/acceptance
- webhook idempotency
- subscription cancellation/expiration transitions
- premium entitlement access

Never require a live payment to run routine CI.

## Delivery gates

### Gate 0 — renderer/gameplay trust

Touch, picking, reveal, five-round flow and phone performance are trustworthy.

### Gate 1 — productionize

Move toward bundled/pinned dependencies, TypeScript/modules, reliable automated tests and deploy previews without intentionally changing gameplay.

### Gate 2 — instrument

Add activation/retention/sharing analytics before monetization.

### Gate 3 — retention loop

Solidify streak, history, share artifact, daily number/return hook.

### Gate 4 — account/sync

Add Supabase Auth and minimal result sync only when it creates player value.

### Gate 5 — paid experiences behind development entitlement

Build archive, unlimited themes, and mastery as usable experiences before integrating real billing.

### Gate 6 — billing

Add checkout, webhook sync, semantic entitlements, and customer portal.

### Gate 7 — first stranger pays

Stop default feature expansion. Diagnose acquisition/activation/retention/monetization until the first paid proof exists.

## Complexity budget

The following require explicit evidence/approval:

- microservices
- Redis/cache layer
- message queues
- server-side rendering for the globe
- custom auth/password infrastructure
- custom billing portal
- custom tax/VAT system
- real-time multiplayer backend
- generalized social graph
- CMS for static daily content

The default answer is **not yet**.

## Architecture decision rule

For any material architectural proposal, document:

1. current user/product problem
2. evidence the problem exists
3. simplest viable approach
4. alternatives considered
5. operational/security cost
6. rollback path
7. metric or failure mode that would justify revisiting the decision

Favor reversible decisions and local simplicity over theoretical future scale.
