# Tag Arena — Product Constitution

## Product goal
Create an original, instantly understandable browser tag-fighting game that captures the immediacy, chaos, positioning, tagging, and special-move excitement of classic compact arena wrestling games while using original characters, art, names, and rules.

## Player-facing principles
1. Basic play must be understandable within about 10 seconds.
2. A match must start quickly with minimal menu friction.
3. The control surface should stay tiny; depth should come from timing, position, momentum, tagging, and interacting systems rather than long command lists.
4. Hits must feel consequential and readable.
5. Tagging must create a real strategic choice, not merely swap sprites.
6. The arena must matter to combat.
7. Matches should generate surprising, funny, or dramatic moments.
8. A losing player should usually understand why they lost.
9. Prefer short rematch-friendly sessions over long progression loops in the initial product.
10. Do not copy Kinnikuman characters, names, sprites, music, or other protected assets.

## Phase -1 goal
Before implementing the actual fighting game, prove an AI-first development loop that can be driven from ChatGPT web through GitHub:

ChatGPT instruction -> isolated branch -> code change -> deterministic tests -> real Chromium playtest -> machine-readable report + screenshot artifact -> review/fix.

## First playable goal after the harness
Two simple placeholder fighters in one arena with deterministic movement, collision, one attack, knockback, and rope rebound. If that is not fun and responsive, do not expand scope.
