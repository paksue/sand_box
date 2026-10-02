# Character Bible — The Moon Bell

## Current implementation status

This is the character-design reference; the notes below distinguish intent from current behavior where they differ. Ysabet’s schedule currently moves her between home and herb gathering at the cottage. A later visit by her to the Moonwell is deferred. Mallow is a chapel hotspot with food and scene-geometry interactions; she is not currently shown moving between visible positions. Keep those future ideas out of claims about the playable build unless they are implemented and verified.

## Mara Vale — player character
Age: late teens / young adult.
Role: locksmith's apprentice and occasional errand-runner.

Traits:
- observant;
- practical;
- brave enough to try things;
- not automatically noble or dishonest;
- knows locks/mechanisms, not ancient magic.

Voice:
- concise internal observations;
- dry fairy-tale humor;
- never tells the player the puzzle answer.

Rule:
Mara's competence should be enacted by the player. Do not have her automatically solve a puzzle after collecting flags.

## Aldus Reed — Bellkeeper
Older keeper of the Moon Bell.
Injured in the opening, which is why Mara carries the key.

Want: the annual bell rung on time.
Knows: the ritual's real importance, the Sun Key, the old courier road.
Does not know: exactly what condition the storm left every route in.

Voice: warm, urgent, old-fashioned without parody.

Narrative use: inciting quest and closing callback, not a remote hint dispenser.

## Bram Tallow — miller
Broad, impatient, good-hearted, covered in flour and river mud.

Want: save his millwheel and keep floodwater out of the grain room.
Schedule: stays at Mill through early evening; later may leave if the wheel is stabilized.
Knowledge: mill machinery, ferry timing, recent flood.

Voice: practical complaints, concrete advice.

Consequence:
Helping him can yield a rope scrap/favor and later gratitude. Ignoring him is allowed.

## Ysabet Reed — hedge-witch
Aldus's cousin, though the game need not announce this immediately.

Public: herbalist, healer, keeper of old road lore.
Want: gather dusk-thyme and keep careless travelers from treating her tools as communal property.
Schedule:
- home/garden before ~17:30;
- gathering herbs ~17:30–18:00;
- returns afterward;

Voice:
precise, amused, a little prickly. Never cackles.

Important:
She is not a quest vending machine. Lending the lantern costs her convenience. Theft/borrowing without permission can be noticed through plausible evidence.

## Mallow — silver hen
Ysabet's escaped hen.
No speech.

Behavior:
reacts to food and to Mara closing the gap with a fallen stone. Visible position changes are a future presentation improvement, not current behavior.

Purpose:
physical, comic, low-stakes object/creature interaction; enables helpful lantern route.

## Brindle Mossback — bridge troll
Ancient, mossy, sleepy, surprisingly formal.

Want: keep his bridge working and his toll bell ringing.
Schedule:
- asleep under bridge before 19:15;
- awake afterward;
- may wake early if the player causes enough noise.

Voice:
slow, literal, courteous when treated courteously.

Important:
He is not a riddle cliché. The problem is the bridge and his schedule, not guessing a joke answer.

## Captain Sella Vane — castle gate captain
Competent, skeptical, tired from storm response.

Want: keep the castle secure while getting the Moon Bell ritual completed.
Schedule:
at main gate before 21:00; withdraws inside after the ninth bell.

Voice:
brief, professional, fantasy-world grounded.

Knowledge:
can know the Bellkeeper is delayed only if a messenger/report reached the castle. She should not automatically know Mara's route.

## Pip — magpie
Optional environmental character.
Attracted to polished objects, not magical omniscience.

Purpose:
small trade/visual gag and alternate access to a reflective moon-disc if needed.

## Relationship / memory model

Track concrete memories rather than a generic reputation:
- helped;
- promised;
- borrowed with permission;
- took without permission;
- returned;
- damaged/repaired;
- witnessed;
- told;
- thanked;
- still owed.

NPC dialogue should be derived from those memories plus current world state.

No character should know an off-screen action without a plausible evidence path.
