# Oregon Trail 1990 benchmark

This directory contains a reproducible reference harness for studying the 1990 MECC DOS release of *The Oregon Trail* without committing third-party game binaries to this repository. The GitHub Actions workflow temporarily downloads the Internet Archive item `msdos_Oregon_Trail_The_1990`, boots it under DOSBox, captures reference screens, and uploads them only as workflow artifacts.

## Why this exists

Frontier Journey's first MVP advanced exactly one simulated day for every press of **Continue**. A browser playtest showed that this produced hundreds of low-value clicks and an overlong journey. Rather than guessing at a better cadence, this harness measures the classic game's actual interaction model.

## Verified 1990 baseline

The benchmark uses:

- Banker from Boston
- Five-person party
- April departure
- Steady pace
- Filling rations
- Matt's General Store recommendations as the starting outfit

### Starting economy

The banker begins with **$1,600**.

Measured store prices and recommended quantities:

| Supply | Reference quantity | Price | Cost |
|---|---:|---:|---:|
| Oxen | 3 yoke / 6 oxen | $40/yoke | $120 |
| Food | 1,000 lb (200 lb/person) | $0.20/lb | $200 |
| Clothing | 10 sets (2/person) | $10/set | $100 |
| Ammunition | 15 boxes / 300 bullets | $2/box of 20 | $30 |
| Spare wheels | 2 | $10 | $20 |
| Spare axles | 2 | $10 | $20 |
| Spare tongues | 2 | $10 | $20 |
| **Total** | | | **$510** |

The banker therefore leaves with about **$1,090 in reserve** while still following the game's recommended starting outfit.

## Main trail menu

At Independence the game exposes these choices:

1. Continue on trail
2. Check supplies
3. Look at map
4. Change pace
5. Change food rations
6. Stop to rest
7. Attempt to trade
8. Talk to people
9. Buy supplies

The party begins with **Good** health, **Steady** pace, and **Filling** rations.

## Most important pacing result: Continue means continuous travel

The classic does **not** require a Continue click for each simulated day.

The measured flow is:

1. Player chooses **Continue on trail**.
2. The game presents the distance to the next landmark.
3. After acknowledging that card, the wagon moves continuously.
4. Dates, miles, food, weather, and health advance without further player input.
5. The travel screen says **Press ENTER to size up the situation**. ENTER is an optional manual interruption.
6. A landmark, river, event, or other situation can interrupt travel automatically.

This is the primary pacing reference for Frontier Journey V1.1. A normal uneventful travel day should not require its own player click.

## Measured first segment

Independence to the Kansas River is **102 miles**.

With Steady pace and Filling rations, the emulator captures showed:

- April 1: departure with 1,000 lb food
- April 6: 100 miles traveled, 2 miles remaining, 925 lb food, health still Good
- Kansas River arrival: approximately April 7 / 102 miles; a prior clean capture showed 910 lb food on arrival

This implies roughly **20 miles/day** in the opening terrain and exactly **15 lb food/day** for five people at Filling rations (3 lb/person/day). The final partial travel day still advances the calendar/food use.

The key interaction result is more important than the exact speed: the entire 102-mile segment can be initiated by a single Continue decision and then runs autonomously until something worth the player's attention occurs.

## Design implications for Frontier Journey

1. Replace one-click-per-day travel with **continuous travel until interruption**.
2. While traveling, keep the HUD alive and advance date/resources day by day so the player can watch the simulation.
3. Provide a **Stop / Inspect** control analogous to the classic's ENTER-to-size-up behavior.
4. Automatically pause for events, landmarks, rivers, critical resource/health thresholds, or run-ending conditions.
5. Count meaningful interruptions/decisions in playtests rather than raw simulated days.
6. Do not copy the 1990 economy blindly; use it as a known reference point and tune Frontier Journey around its own professions and systems.

## Reproducibility and media

The repository contains only the harness and notes. It does not contain the Oregon Trail executable or archive. The workflow fetches the archived game at runtime for reference testing and leaves captures in GitHub Actions artifacts.
