# Oregon Trail II (1995) systems reference

Status: **source-backed design reference; not yet emulator-verified in this repository**.

The 1990 DOS benchmark is our pacing reference. Oregon Trail II is the deeper systems reference: it expanded the trail model substantially while preserving the journey/decision structure. This document separates features worth borrowing from complexity we should deliberately avoid.

## Source hierarchy

Primary / near-primary sources used for this reference:

1. Minnesota Educational Computing Consortium's Oregon Trail II history/product page (`mecc.co/oregon-trail-ii/`).
2. ERIC record ED385482 for the official 80-page *Oregon Trail II CD (Macintosh/Windows CD Version 1.0) Manual* (1995), which explicitly says the manual contains “Notes on the Simulation and Its Underlying Models.”
3. Period review/specification material confirming Windows 3.1-era requirements.

Secondary cross-checks:

- MobyGames for release/gameplay metadata.
- Long-form GameFAQs mechanical FAQ for player-observed edge cases and weak mechanics. Treat these observations as empirical community notes, not authoritative source code facts.

## Confirmed scope expansion over the classic game

MECC's own comparison describes Oregon Trail II 1.0 as adding:

- multiple difficulty levels rather than one level;
- Oregon, California, and Mormon trails;
- multiple departure points and destinations, yielding more than 100 possible routes;
- selectable travel years from 1840 through 1860;
- 25 occupations and more than a dozen skills;
- over 200 landmarks rather than roughly 15;
- more geographically/historically detailed weather and underlying simulation models;
- more than 100 voiced characters and substantially richer talk/advice interactions;
- a built-in journal/guidebook layer.

The three named play levels are **Greenhorn**, **Adventurer**, and **Trail Guide**.

## Systems Frontier Journey should borrow

### 1. Route topology as gameplay

Do not make the trail a single linear progress bar forever.

Borrow:

- multiple plausible routes;
- cutoffs that trade distance for water, terrain, services, or danger;
- route-specific landmarks and hazard profiles;
- route choice based on current resources and party condition rather than a simple “short vs long” label.

Frontier Journey target:

- 2–3 meaningful macro route forks in the first full version;
- each branch changes at least three systems (distance, supply access, weather/water/hazard distribution, etc.);
- no branch is universally dominant.

### 2. Skills that alter outcomes

OT II ties occupations/skills to activities and event resolution. Examples documented in secondary mechanical descriptions include medical skill influencing recovery and sharpshooting affecting hunting.

Frontier Journey target:

- keep professions mechanically distinct;
- represent each important skill with a small, auditable modifier;
- surface the benefit to the player when it matters (“Carpentry reduced repair time”, “Medical skill improved prognosis”);
- never make profession merely “different starting cash + score multiplier.”

### 3. Disease-specific decisions

OT II's guidebook treats diseases differently rather than as one generic sickness bar. Period-style guidance links conditions to weather, contaminated food/water, season, diet, rest, and specific treatments.

Frontier Journey target:

- begin with a compact set of 8–12 clinically/historically distinct conditions;
- each has a cause/risk profile, progression speed, best response, and recovery behavior;
- the player should infer treatment from symptoms/conditions when information is incomplete;
- avoid dozens of cosmetic diseases that resolve identically.

### 4. Environment-linked hazards

OT II's deeper model connects terrain/weather/water to consequences: mud, dust, temperature, river state, hills, water scarcity, draft-animal condition, and disease risk.

Frontier Journey target:

- events should usually have a state-based cause rather than feel like an unrelated random card;
- weather and terrain should change the probability distribution of hazards;
- the UI should expose enough context that the player can say “I accepted that risk.”

### 5. Situation-specific obstacle choices

OT II expands beyond rivers into hills, canyons, mud/deep sand, obstructions, waterless stretches, and route cutoffs. Community documentation notes choices such as double-teaming animals or lightening a wagon when stuck.

Frontier Journey target obstacle vocabulary:

- ford / float / ferry / wait / scout;
- double-team animals;
- lighten load;
- wait for ground/weather to improve;
- detour;
- repair first;
- proceed cautiously;
- accept a risky shortcut.

The important pattern is **state + visible context + several plausible actions + downstream consequence**, not the exact historical wording.

### 6. Morale only if it changes decisions

OT II includes morale in its broader party simulation. Frontier Journey should only keep morale if it has clear causes and consequences.

Good uses:

- repeated hunger, deaths, harsh pace, exposure, failed decisions reduce morale;
- safe landmarks, adequate food, rest, successful obstacles increase it;
- low morale may reduce recovery/efficiency or trigger a small number of party-conflict events.

Bad use:

- another meter that changes constantly but rarely affects a choice.

## Systems Frontier Journey should NOT copy blindly

### Inventory bloat

Community mechanical analysis of OT II points out that many miscellaneous items are weak, redundant, or effectively useless, while additional weight can itself be harmful.

Rule for Frontier Journey:

> Every purchasable item must answer “what decision does owning this change?”

If an item has no meaningful branch in gameplay, merge it into a broader category or remove it.

### Weak profession tradeoffs

Some OT II player analysis argues that occupations can collapse mostly into starting-money/score differences if the player ignores role-playing and scoring.

Rule for Frontier Journey:

- every profession gets at least one recurring mechanical strength;
- every profession gets at least one meaningful opportunity cost;
- profession win rates should be tuned, but strategy should also differ.

### Party members as passive hit-point buffers

Do not let extra people exist only to eat food and absorb illness/death rolls.

Frontier Journey target:

- one skill;
- one useful trait;
- one weakness;
- occasional member-specific action/event contribution.

Keep it light enough that the player still reads the party at a glance.

### Guidebook information that does not map to mechanics

OT II deliberately presents a historically flavored guidebook, and some details are educational flavor rather than simulated rules.

For Frontier Journey:

- clearly distinguish advice that reflects real game mechanics from purely historical flavor;
- if a tooltip tells the player a factor matters, the simulation should actually use it.

## Pacing relationship to the 1990 benchmark

MobyGames classifies OT II's pacing as real-time, and contemporary descriptions emphasize that events halt travel for decisions. The key design direction remains consistent with the measured 1990 DOS reference:

- routine travel progresses without one click per simulated day;
- important situations interrupt;
- stops/landmarks become decision hubs;
- the player spends input on choices, not calendar advancement.

Therefore Frontier Journey V1.1's continuous Travel / Stop-Inspect model should remain the base interaction model while OT II contributes deeper systems.

## Emulator target

Original PC requirements documented by MECC include:

- 486-class PC or greater;
- Microsoft Windows 3.1 or later;
- 640×480 / 256-color SVGA;
- 4 MB RAM minimum, 8 MB recommended;
- Windows-compatible mouse and sound;
- double-speed CD-ROM;
- roughly 12 MB hard-disk space.

### Reproducible emulator plan

Preferred reference environment: **DOSBox-X + a legally supplied Windows 3.1/3.11 installation + legally supplied Oregon Trail II CD image**.

Do not commit Windows or Oregon Trail II media to this repository.

When media is available, create a local-only reference VM containing:

1. DOSBox-X configured as a 486-class SVGA system.
2. Windows 3.1/3.11 in 640×480, 256 colors.
3. Sound Blaster-compatible audio.
4. OT II CD mounted as a CD-ROM drive.
5. QuickTime version compatible with the chosen release if required by the media.
6. A deterministic capture procedure (screenshots + action log + start configuration).

### Benchmark run to capture

Use a single reproducible scenario first:

- Greenhorn and Trail Guide as separate runs;
- Oregon-bound party;
- common/default jumping-off point;
- normal spring departure;
- sensible recommended supplies;
- six draft animals where appropriate;
- player follows guidebook advice rather than intentionally exploiting known quirks.

Record:

- wall-clock play time;
- calendar days;
- travel interruptions;
- player-issued travel commands;
- landmark/fort decisions;
- obstacle decisions;
- illnesses/injuries and treatments;
- hunts and time cost;
- food/water trajectory;
- wagon/draft-animal failures;
- route forks;
- surviving party;
- arrival date;
- final score.

## Frontier Journey design target after both references

**1990 DOS supplies the interaction cadence.**

- one Travel command starts motion;
- watch the simulation run;
- Stop / Inspect is optional;
- events/landmarks/critical states interrupt automatically.

**Oregon Trail II supplies the systemic depth.**

- route diversity;
- useful skills;
- contextual obstacles;
- disease-specific responses;
- richer environment model;
- characters/advice;
- more varied consequences.

**Frontier Journey should improve on both.**

- no inventory junk;
- no profession that is only a money setting;
- party members contribute mechanically;
- clear causality;
- fewer but more meaningful player inputs;
- deterministic seeded testing;
- automated balance evaluation.
