---
name: worldtap-design
description: Use for WorldTap UI/UX design, interaction, responsive layout, copy, paywall presentation, accessibility, motion, and visual review. Protects the globe-first, touch-first identity and keeps monetization out of the active daily game.
---

# WorldTap Design

## Read first

Read `AGENTS.md`, `PRODUCT.md`, and `DESIGN.md` before designing or reviewing production UI.

If an external frontend-design skill or current web-interface-guidelines skill is available, use it as a complementary quality pass. Project-specific WorldTap rules in this skill take precedence where they are more specific.

## North star

**Earth is the interface.**

The player should feel like they are touching/spinning the planet, not navigating a conventional app dashboard.

## Active-round hierarchy

Preserve this priority:

1. clue / target
2. globe
3. commit action
4. reveal feedback
5. progression / secondary information

Keep the UI visually quiet while guessing.

## Mobile rules

Design portrait-first for small phones.

- Keep the active round above the fold where reasonably possible.
- Let the globe use most of the viewport.
- Keep important controls thumb-reachable.
- Respect safe areas.
- Avoid tiny targets and edge-hugging buttons.
- Do not allow page scroll gestures to fight globe gestures.
- Test with long clue text and browser text scaling.
- Touch responsiveness outranks visual flourish.

## Reveal rules

The reveal must quickly teach:

- player's guess
- correct location
- distance
- round score
- geographic relationship between the two

Motion should clarify that relationship, then get out of the way.

## End-state rules

The result screen should prioritize:

1. total performance
2. share/compare
3. streak/progress
4. optional continuation into Plus content

Never transform the result screen into a dense pricing dashboard.

## Monetization rules

Never interrupt an active free daily game with:

- paywall
- account prompt
- ad
- subscription popup

Good paid-entry moments include:

- after finishing today's game
- tapping a locked archive day
- selecting a clearly extra theme
- entering a deeper mastery view

WorldTap+ should feel like **more Earth to explore**, not punishment for reaching a wall.

## Paywall constraint

First-version paywall:

- one headline/value statement
- at most three strong benefits
- primary annual choice
- secondary monthly choice
- explicit statement that today's WorldTap remains free
- clear close/back path

Avoid fake urgency, confusing trial copy, SaaS pricing tables, or feature overload.

## Visual identity

Aim for:

- planetary
- tactile
- modern
- confident
- intelligent but not academic
- playful but not childish

Use the globe and geographic effects as the visual signature. Do not default to generic AI-design tropes such as excessive glassmorphism, floating cards, neon gradients, giant pill buttons, and decorative glow everywhere.

## Copy

Prefer short, concrete language.

Good:

- `Find Machu Picchu.`
- `Where did Apollo 11 launch?`
- `18 km away`
- `Play yesterday`
- `Share score`

Avoid vague labels such as `Continue` when a specific action can be named.

## Accessibility review

Every production UI pass should verify:

- usable contrast
- visible keyboard focus
- semantic controls/labels
- non-color-only status communication
- reduced-motion handling for nonessential motion
- comfortable touch targets
- recoverable error states
- zoom/font scaling resilience where practical

## Performance review

A design is not approved if decorative choices make globe manipulation feel less direct on the target phone.

When forced to choose between visual richness and interaction smoothness, choose smoothness.

## Review method

For any proposed screen/change, answer:

1. What is the single primary player action?
2. Is the globe still visually dominant where it should be?
3. Can a first-time player understand the next action in seconds?
4. Does the screen fit on a small phone without troublesome active-play scrolling?
5. Is the paid prompt happening after value?
6. What can be removed?
7. Does motion clarify a geographic relationship or state transition?
8. Are labels specific and accessible?
9. Does the change preserve touch performance?
10. Which product metric/user problem is this design intended to improve?

If #10 has no answer, challenge whether the UI should exist.
