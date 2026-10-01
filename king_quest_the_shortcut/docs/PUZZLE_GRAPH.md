# Puzzle / World Graph — The Moon Bell

```mermaid
flowchart TD
  A[15:30 Vale Locksmith: receive Sun Key] --> B{P1 Flooded Mill}
  B --> B1[Help Bram + repair span]
  B --> B2[Manipulate sluice + stepping stones]
  B --> B3[Wait for dusk ferry]
  B1 --> C[P2 Briar Crossroads]
  B2 --> C
  B3 --> C

  C --> C1[Mark fixed oak / expose moving signs]
  C --> C2[Late fallback: follow moonmoths]
  C1 --> D[Crossroads hub]
  C2 --> D

  D --> E[Ysabet Cottage]
  D --> F[Ruined Chapel]

  E --> E1[Ask/help Ysabet]
  E --> E2[Observe schedule / take lantern]
  E --> E3[Late glowjar alternative]
  F --> F1[Recover Mallow]
  F --> F2[Learn Moonwell mural + courier postern]
  F --> F3[Optional moon-disc / magpie interaction]

  E1 --> G[P3 Whispering Hollow]
  E2 --> G
  E3 --> G

  G --> H{P4 Moonwell after dusk}
  H --> H1[Reflect beam + align moon-rings]
  H --> H2[Ysabet favor: receive Moonwater]

  H1 --> I{P5 Brindle Bridge}
  H2 --> I

  I --> I1[Sleeping: use visible key]
  I --> I2[Awake: free toll bell with Moonwater]
  I --> I3[True-Path lantern reveals pilgrim ledge]

  I1 --> J[Castle approach]
  I2 --> J
  I3 --> J

  J --> K{Before 21:00?}
  K -->|yes| K1[Main gate / Captain Sella]
  K -->|no| K2[Old courier postern]

  K1 --> L[P6 Moon Bell Tower]
  K2 --> L

  L --> M[Use Sun Key + resolve current mechanism state]
  M --> N[Ring Moon Bell]
  N --> O[Epilogue callbacks + optional path summary]
```

## Structural rule

The graph folds at major landmarks, but solution history remains meaningful:
- time;
- inventory;
- permission;
- favors;
- witnessed actions;
- NPC memories;
- which clues were discovered;
- world phase.

No reconvergence may silently erase those.
