# State Model — Fantasy Reboot

## Principle

World truth, visible evidence, NPC knowledge, and NPC memory are distinct.

## GameState

At minimum:
- schema/version;
- world clock;
- current location;
- player position/transition;
- inventory;
- item locations;
- world phase (afternoon / golden / dusk / moonrise / late);
- puzzle states P1–P6;
- NPC schedule states;
- NPC memories/knowledge;
- discovered clues;
- hint level per puzzle;
- event log;
- ending state.

## Puzzle state

Each core puzzle should store meaningful state rather than only `solved: true`.

Examples:

P1 Mill:
- wheel jammed/freed;
- sluice setting;
- beam placed;
- bridge secured;
- ferry active;
- crossing route used.

P2 Crossroads:
- loop count;
- landmark marked;
- signs observed moving;
- true route inferred;
- moonmoth fallback active.

P3 Light:
- Mallow found/returned;
- lantern permission state;
- lantern possession;
- Ysabet noticed absence;
- glowjar made.

P4 Moonwell:
- dusk active;
- reflector used;
- ring positions;
- beam path;
- moonwater obtained;
- source of moonwater.

P5 Brindle:
- asleep/awake;
- key location;
- key taken;
- bell thorn state;
- ledge revealed;
- crossing route;
- Brindle knowledge/memory.

P6 Castle:
- arrival time;
- gate state;
- Sella present;
- postern discovered/opened;
- bell briar severity;
- yoke unlocked;
- release mechanism state;
- bell rung.

## Event log

Store ordered events:
- time;
- location;
- actor;
- action;
- object/target;
- witnesses;
- result.

Use the ordered log for epilogue chronology instead of inferring order from boolean flags.

## NPC memory

Prefer concrete entries:
- saw Mara help Bram;
- lent lantern to Mara;
- lantern missing while Ysabet away;
- saw Mara holding lantern later;
- Brindle found gate key missing;
- Sella heard Aldus was delayed;
- Mara returned borrowed object.

Knowledge requires a plausible source.

## Inventory provenance

Where useful, track:
- obtained from;
- permission;
- current owner;
- returned;
- consumed.

This supports consequences without a morality score.

## Time

Deterministic.

Long actions process schedule/world-boundary crossings correctly. An action started before dusk and ending after dusk should trigger dusk changes once.

No positive-duration action may become zero-duration because the clock reached a cap.

After 22:00, do not permit arbitrary unfinished work. Resolve remaining state through explicit late/handover logic.

## Save migration

The old office save schema does not need narrative migration into the fantasy story.

If an old office save is detected:
- invalidate it cleanly;
- start a fresh fantasy session;
- show a brief "A new adventure has begun" style notice if desired.

Do not attempt to map office story flags into fantasy state.
