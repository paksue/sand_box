---
name: worldtap-billing
description: Use for WorldTap checkout, subscription lifecycle, payment-provider integration, webhooks, semantic entitlements, customer access, and billing security. Keeps the daily game free and requires current official provider documentation before implementation.
---

# WorldTap Billing

## Read first

Read `AGENTS.md`, `PRODUCT.md`, and `ARCHITECTURE.md`.

Billing is a red-authority product area. Do not change pricing, provider, free/paid boundaries, or offers without explicit product-owner approval.

## Mission

Enable the smallest trustworthy paid loop:

**player experiences value → chooses WorldTap+ → pays → entitlement activates → access remains correct through renewal/cancel/expiration**

Billing must never become a dependency for today's free daily game.

## Current product hypothesis

Initial WorldTap+ pricing hypothesis:

- $3.99/month
- $19.99/year, primary presentation

Initial provider hypothesis:

- a merchant-of-record provider such as Lemon Squeezy to reduce tax/compliance burden at tiny revenue

These are hypotheses, not timeless facts. Before implementation, verify current official provider documentation for:

- pricing/fees
- supported countries/currencies
- subscription APIs
- checkout options
- tax/merchant-of-record behavior
- webhook signing and retries
- customer portal
- cancellation/refund/chargeback behavior
- sandbox/test mode

Do not implement from memory when current docs are available.

## Entitlement-first design

Application code asks for semantic capabilities:

```text
worldtap_plus = true
```

It must not infer access from a displayed price, product label, checkout URL, or client-side flag.

Billing-provider products/variants map server-side to internal entitlements.

This allows monthly, annual, gift, promotion, founder, migration, and manual-support grants to share one application capability.

## Expected architecture

```text
user requests premium purchase
        |
        v
authenticated server/edge endpoint
        |
        v
create provider checkout with trusted user linkage
        |
        v
provider-hosted/overlay checkout
        |
        v
signed provider webhook
        |
        v
idempotent subscription state update
        |
        v
recompute/record semantic entitlement
        |
        v
client refreshes trusted entitlement
```

Never make client checkout completion alone authoritative for access.

## Authentication requirement

A paid purchase needs a stable identity so access can be restored.

Do not require authentication before today's free game. Authentication is requested when the user chooses paid/cross-device value.

Do not invent custom password storage.

## Checkout creation

Checkout creation should happen through a trusted server/Edge Function when user linkage or privileged provider credentials are required.

Validate:

- authenticated user
- allowed internal plan/offer identifier
- server-side mapping to provider product/variant
- return/cancel destinations

Never allow a browser-supplied arbitrary product/price identifier to grant arbitrary entitlement.

## Webhook requirements

Webhook handling must be:

### Signature verified

Reject invalid signatures before processing business state.

### Idempotent

A duplicate event must not create duplicate subscriptions/grants.

### Lifecycle complete

Handle the provider events required to keep access correct across:

- initial purchase
- renewal
- failed payment / delinquency where relevant
- cancellation
- expiration
- plan change if later supported
- refund/chargeback if it affects entitlement

### Order tolerant

Where provider semantics permit events to arrive late/out of order, use provider timestamps/status/current-resource fetches as appropriate rather than assuming perfect delivery order.

### Auditable

Store enough provider IDs/event metadata/status timestamps to diagnose “I paid but cannot access” without storing unnecessary sensitive payment data.

## Subscription data

Store provider references and normalized internal state, not card details.

Possible normalized fields:

- user id
- provider
- provider customer id
- provider subscription id
- provider product/variant id
- normalized status
- renews/ends timestamp
- timestamps

Never store raw card numbers/CVV.

## Customer portal

Prefer provider-hosted subscription management for:

- payment method changes
- invoices/receipts where supported
- cancellation
- plan management

Do not build a custom billing portal before there is a proven product need.

## Access semantics

Define access as a pure, testable mapping from trusted normalized subscription/grant state to entitlement.

Examples to test:

- active annual → Plus
- active monthly → Plus
- canceled-but-valid-until-period-end → Plus until end
- expired → no Plus
- manual promotional grant → Plus according to grant rules
- duplicate webhook → no duplicate grant

Do not scatter subscription-status conditionals through UI components.

## Failure behavior

Billing failure must not break free play.

### Checkout unavailable

Show a concise recoverable message; keep the daily game working.

### Webhook delay

Provide a safe way for the client/server to refresh subscription state. Avoid permanently denying legitimate buyers because one webhook was delayed.

### Entitlement service unavailable

Protect paid-only server data, but do not block today's free daily game.

## Security

Never expose provider API keys, webhook secrets, or service-role credentials in browser bundles/repository public client config.

Treat these as untrusted:

- query parameters
- localStorage
- client “isPlus” flags
- checkout success redirects
- webhook JSON before signature validation

A success page is UX, not proof of payment.

## Tests required before production billing

- checkout requires authenticated user
- only approved offer identifiers can create checkout
- invalid webhook signatures are rejected
- duplicate webhook is idempotent
- purchase activates correct entitlement
- cancellation/period-end behavior is correct
- expiration removes entitlement
- free daily game still works when billing endpoints fail
- no secrets appear in built client assets

## Stop conditions

Stop and request product-owner decision if asked to:

- change prices
- add trials/discounts not already approved
- move today's game behind payment
- switch billing provider
- create hidden fees/add-ons
- implement dark patterns/fake urgency
- delete/alter customer billing records destructively
