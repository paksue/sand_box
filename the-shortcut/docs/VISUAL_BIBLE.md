# Visual Bible — The Moon Bell

## North Star

**"A lost 1993 Sierra fairy-tale CD-ROM adventure, beautifully remastered in 2026."**

The player should immediately see **fantasy**, not an office or generic 3D tech demo.

## Reference principles

Draw from the craft of King's Quest III–VI:
- theatrical fixed-camera rooms;
- environment larger than protagonist;
- strong foreground/midground/background;
- painterly storybook detail;
- readable exits and puzzle props;
- whimsical-but-grounded fairy-tale architecture;
- dramatic day-to-night palette shifts.

Do not copy any copyrighted KQ scene, character, castle, map, puzzle, or asset.

## Runtime visual strategy

Hybrid 2.5D:
1. authored/procedural background plate;
2. optional foreground occlusion;
3. hidden walk/depth data;
4. realtime Mara/NPCs;
5. selected realtime puzzle props;
6. atmosphere particles/lighting;
7. sparse DOM dialogue/inventory.

For the one-shot build, provisional art may use:
- layered SVG/canvas/Three geometry;
- gradients;
- hand-authored silhouettes;
- simple low-poly props;
- procedural foliage;
- restrained textures.

It must still read unmistakably as a fairy-tale world.

## Scene palette progression

### Late afternoon
Honey gold, warm stone, wet greens, silver river.

### Golden hour
Amber highlights, long blue-green shadows.

### Dusk
Rose-violet sky, deepening forest greens, first firefly lights.

### Moonrise
Indigo, silver-blue moonlight, pale cyan magical accents, warm window lanterns.

### Late
Deep navy, stronger silver rim light, visible briar silhouettes.

## Scene composition targets

### Village lane
Workshop foreground keys/doorframe; washed road vista; distant castle.

### Mill
Large wheel as focal mechanism; diagonal river; broken crossing clearly readable.

### Crossroads
Three paths framed by crooked trunks; signposts central but not UI-like; stable oak visually distinct.

### Ysabet cottage
Storybook crooked roof, herb bundles, lantern visible but not glowing quest-item style.

### Chapel
Ivy arches, broken roof, moon mural in side wall, magpie movement.

### Moonwell
Circular composition; moonbeam becomes strong visual line after dusk.

### Brindle bridge
Bridge spans deep ravine; troll silhouette under arch; thorn-swallowed toll bell visible.

### Castle approach
Castle dominates distance; main gate and vine-hidden postern share composition without making secret obvious.

### Bell tower
Hero vista. Bell fills upper frame, Mara small below, valley and moon beyond.

## Character style

Painterly/stylized proportions with readable silhouettes.

Mara:
- travel cloak;
- locksmith satchel;
- practical boots;
- warm red/russet accent for readability against green/blue world.

Ysabet:
- layered herbalist clothing;
- no Halloween-witch stereotype.

Brindle:
- massive but gentle-looking moss/stone textures.

Sella:
- practical storm-duty armor, not ornate battle fantasy.

## UI

Exploration: minimal chrome.

Dialogue: lower-third or compact storybook panel.

Inventory: simple illustrated/object slots.

No SaaS panels, tabs, developer consoles, task lists, chat windows, or computer-app metaphors in normal play.

Debug tools may remain hidden behind explicit Debug mode.

## Audio direction

Even if only placeholders:
- river/mill creak;
- forest birds and distant wood knocks;
- cottage kettle/herb rustle;
- dusk insects/fireflies;
- low magical hum at Moonwell;
- troll snore/bridge groan;
- distant bell/castle wind;
- final Moon Bell resonance.

## Visual acceptance

A screenshot with UI hidden must be recognizable as a fantasy adventure scene within one second.

If a screenshot could plausibly be mistaken for an office prototype, dashboard, or generic dev graybox, it fails.
