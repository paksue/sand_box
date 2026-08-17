# WorldTap Design Constitution

## Design thesis

**Earth is the interface.**

WorldTap should feel like touching the planet, not operating a dashboard that happens to contain a globe.

The best WorldTap screen is visually calm, immediately understandable, and dominated by the globe. Interface chrome should recede during guessing and become more expressive during reveal/results.

## Experience hierarchy

During an active round, prioritize in this order:

1. target / clue
2. globe
3. commit action
4. reveal feedback
5. progression / secondary information

Anything that competes with the first three should justify itself.

## Mobile-first interaction

The primary interaction target is a phone, including iPhone 11-class hardware.

Requirements:

- touch rotation should feel directly attached to the finger
- pinch/zoom must not fight page scrolling
- active guessing should fit above the fold where reasonably possible
- essential controls must be reachable by thumb
- avoid tiny targets and edge-hugging controls
- do not require precise taps on small UI controls when the globe itself is the intended interaction
- safe areas must be respected on modern phones
- landscape support is welcome, but portrait is the primary product experience unless evidence changes that

## Active-round layout

Prefer a simple composition:

- compact top target/clue
- globe occupying the majority of the viewport
- one clear commit/guess control when needed
- small progress indicator such as `2 / 5`

Avoid during active guessing:

- pricing prompts
- account prompts
- navigation drawers
- dense stats
- unrelated calls to action
- persistent ad slots
- decorative panels that shrink the globe

## Reveal moment

The reveal is the emotional payoff.

It should communicate, quickly and unmistakably:

- where the player guessed
- where the correct location is
- distance between them
- round score
- enough geographic context to understand the mistake

Use motion to clarify spatial relationship, not merely to decorate.

The reveal should create one of these feelings:

- “I was incredibly close.”
- “I was way off.”
- “Oh—that is where it actually is.”

Prefer a readable, short reveal over a cinematic sequence that delays the next round.

## End-of-game result

The result screen should make three actions obvious:

1. understand performance
2. share/compare
3. return or continue

A good hierarchy is:

- total score
- concise performance context
- share result
- streak / recent progress
- optional WorldTap+ continuation such as archive or themed play

Do not make the result screen a pricing page.

## Sharing

A share artifact should be meaningful even before the recipient knows WorldTap.

It should communicate:

- WorldTap daily number/date
- round performance in a compact recognizable pattern
- total score
- challenge/URL

Avoid revealing daily answers in plain text when that would spoil the game.

Sharing should feel like “beat my score,” not “please promote this product.”

## WorldTap+ merchandising

Paid value appears **after free value has been experienced**.

Good moments:

- end of today's game
- tapping a locked archive day
- tapping a themed mode that is clearly extra
- opening deeper mastery/progress views

Bad moments:

- before first play
- mid-round
- blocking today's daily game
- deceptive close buttons or artificial countdowns

WorldTap+ should feel like:

> **There is more Earth to explore.**

Not:

> You hit a wall.

## Paywall principles

Keep the first paywall extremely simple.

Communicate:

- what becomes possible
- three strongest benefits at most
- one primary annual choice
- one secondary monthly choice
- clear statement that today's game remains free

Avoid:

- three-column SaaS pricing tables
- fake urgency
- prechecked hidden add-ons
- confusing trial terms
- feature lists that exceed what a person can scan in seconds

## Visual identity

WorldTap should feel:

- planetary
- modern
- tactile
- intelligent without being academic
- playful without being childish

The globe itself should provide much of the visual richness.

Prefer restrained UI surfaces around it. Do not compensate for a weak layout with gradients, glass panels, glows, or excessive animation.

Distinctive effects are welcome when they strengthen geographic feedback—routes, beacons, distance lines, target pulses, atmospheric cues—and remain performant.

## Typography and copy

Copy should be short, specific, and human.

Prefer:

- `Find Machu Picchu.`
- `Where did Apollo 11 launch?`
- `18 km away`
- `Play yesterday`

Avoid vague buttons such as `Continue` when a more specific label is possible.

Avoid jargon like `entitlement`, `SKU`, `subscription state`, or internal category names in player-facing UI.

## Accessibility

Every production UI pass should include an accessibility review.

Minimum expectations:

- sufficient text/control contrast
- meaningful focus states for keyboard users
- controls have accessible labels
- important information is not encoded only by color
- respect reduced-motion preferences for nonessential motion
- tap targets are comfortably sized
- text remains usable under browser font scaling where practical
- errors explain how to recover

The globe interaction is inherently visual/spatial, but surrounding UI should not add avoidable barriers.

## Motion

Motion has three legitimate jobs:

1. preserve direct manipulation
2. teach geographic relationship
3. make success/failure emotionally legible

Do not use motion simply because it looks premium.

Performance degradation during touch is a design failure, not merely an engineering failure.

## Desktop

Desktop may use additional space for context or stats, but it should remain recognizably the same game.

Do not turn desktop into a dense dashboard while mobile remains a game.

## Design review rubric

Before shipping a UI change, review it with these questions:

1. Is Earth still the dominant object?
2. Can a new user understand what to do within seconds?
3. Does this make the active game easier, faster, or more emotionally satisfying?
4. Is the primary action visually obvious?
5. Does it fit a small phone without troublesome scrolling during active play?
6. Does touch remain smooth?
7. Is the paid prompt appearing only after value?
8. Are labels specific and accessible?
9. Does motion clarify rather than delay?
10. Would removing any element make the screen better?

When in doubt, remove UI before adding UI.
