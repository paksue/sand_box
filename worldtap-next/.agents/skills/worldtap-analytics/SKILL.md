---
name: worldtap-analytics
description: Use for WorldTap product analytics, event instrumentation, funnel diagnosis, retention, sharing, monetization metrics, experiment design, and growth recommendations. Keeps measurement small, decision-oriented, privacy-conscious, and independent of gameplay availability.
---

# WorldTap Analytics

## Read first

Read `AGENTS.md`, `PRODUCT.md`, and `ARCHITECTURE.md`.

## Mission

Use the smallest useful measurement system to answer:

> **Where are players falling out of find → try → love → return → pay → tell?**

Analytics exists to make decisions, not to maximize event volume or dashboard complexity.

## Core funnel

Keep these canonical events stable unless there is a strong reason to change them:

- `game_started`
- `round_completed`
- `game_completed`
- `result_shared`
- `plus_viewed`
- `checkout_started`
- `checkout_completed`

Optional future events should be added only when they answer a concrete decision, for example challenge-link creation/opening.

## Event semantics

### game_started

Fire once when the player meaningfully enters a daily/themed game, not merely when HTML loads.

Suggested properties only if needed:

- mode (`daily`, theme id, archive)
- puzzle key/date
- anonymous/authenticated

### round_completed

Use for gameplay/drop-off analysis.

Possible properties:

- round index
- category
- score bucket or score
- distance bucket if precise distance is not necessary

Avoid collecting unnecessary sensitive location/player data.

### game_completed

Fire once after the final round is recorded.

Possible properties:

- mode
- total score
- streak count if already locally available

### result_shared

Fire on a real share attempt/action, not merely rendering the share button.

Track share mechanism only if it changes a decision.

### plus_viewed

Fire when the paid value proposition is actually visible enough to be considered viewed.

Include entry point (`result`, `archive`, `theme`, `mastery`) when useful.

### checkout_started

Fire after the player intentionally starts the payment flow, ideally once the trusted checkout session/URL exists.

### checkout_completed

Prefer trusted billing/backend confirmation for revenue truth. Client redirect events may be useful for UX but must not be the canonical source of paid conversion.

## Executive metrics

Keep the primary dashboard small.

### Acquisition

- players/unique visitors per day and 7 days
- source/channel only where attribution is reliable

### Activation

`game_completed / game_started`

Also inspect round-by-round drop-off if activation is poor.

### Retention

- next-day return
- 7-day return
- streak distribution

Define retention cohorts explicitly; do not mix anonymous browser identities and authenticated users without noting the limitation.

### Virality

`result_shared / game_completed`

Later, challenge-loop metrics may include:

- challenge created
- challenge opened
- challenge completed

### Monetization

- Plus views
- checkout starts
- trusted completed purchases
- active paid users
- normalized recurring revenue/MRR

Do not count an annual upfront payment as equivalent to that entire amount of MRR; normalize recurring value for business reporting while also tracking cash collected separately if useful.

## Funnel diagnosis

Use this order before recommending features:

### Low acquisition, strong activation/retention

Distribution problem. Do not “fix” by redesigning the core game unless user evidence says otherwise.

### Acquisition, low activation

Inspect loading, comprehension, touch controls, clue difficulty, early round drop-off, viewport problems.

### Good activation, low retention

Inspect content quality, session satisfaction, streak/return cues, difficulty balance, reveal learning value.

### Good retention, low Plus views

Paid continuation is not being discovered or is shown at the wrong moment.

### Plus views, low checkout starts

Value proposition, product packaging, trust, or price framing may be weak.

### Checkout starts, low trusted purchases

Investigate checkout friction, payment/provider failure, pricing, trust, device/browser issues.

## Experiment method

Every experiment should state:

1. **Observation** — what metric/qualitative behavior is weak?
2. **Hypothesis** — why might it be weak?
3. **Change** — smallest intervention.
4. **Primary metric** — one main success signal.
5. **Guardrail** — what must not get worse (often completion, retention, or touch performance).
6. **Decision rule** — keep, revert, or iterate.

Avoid simultaneous large changes that make causal learning impossible.

## Small-sample discipline

WorldTap's early samples will be tiny.

Do not pretend weak early data is statistically decisive.

At small scale:

- combine metrics with direct user observation/interviews
- look for large obvious failures before tiny percentage differences
- prefer repeated directional evidence to faux precision
- label uncertain conclusions as hypotheses

The first stranger paying is stronger evidence than a sophisticated forecast about hypothetical conversion.

## Analytics implementation principles

- analytics must never block gameplay
- failures should be swallowed/logged safely without altering game state
- use a thin analytics adapter so providers can be swapped
- use stable event names and typed/validated properties when productionized
- avoid duplicate firing on rerenders/navigation
- separate product analytics from canonical billing/account state
- verify current provider SDK/privacy behavior before implementation

Initial provider hypothesis may be PostHog or equivalent, but the product must not depend on a vendor-specific event API throughout game code.

## Privacy

WorldTap is geographic, but that does **not** justify collecting the player's precise physical location.

Do not put into analytics unless explicitly required/approved:

- precise device geolocation
- email address
- name
- billing identifiers
- raw auth tokens
- sensitive free-form text

Use anonymous/stable identifiers appropriate to the consent/privacy model and document limitations.

## Agent reporting format

When diagnosing performance, return:

### What is happening

The smallest set of metrics that demonstrates the issue.

### Most likely bottleneck

Acquisition / activation / retention / sharing / monetization.

### Evidence strength

Strong / moderate / weak, with sample-size caveat.

### Next experiment

One smallest high-information change.

### Do not build yet

Name tempting features that the current data does not justify.

## Guardrail

Never recommend manipulating users with dark patterns simply to increase conversion. Protect trust, the permanently free daily-game promise, and long-term retention over short-term paywall clicks.
