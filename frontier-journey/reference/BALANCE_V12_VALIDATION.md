# Frontier Journey V1.2 production validation

This is the final validation pass for the V1.2 benchmark-driven balance profile.

Unlike the earlier 400-run ox-wear calibration, this pass uses **actual profession budgets** after purchasing the real default V1.2 outfit ($585). That matters because ferry and fort decisions depend on remaining cash.

## Browser regression

The production branch passed the visible Chromium regression:

- first clear Prairie/Steady day: **20 miles**;
- manual **Stop / Inspect** freezes continuous travel;
- Kansas River automatically stops travel at **102 miles**;
- benchmark arrival date: **April 7** from an April 1 start;
- food at Kansas River on Filling rations: **910 lb**, matching the measured 1990 reference sequence;
- Hunt and Repair at Grueling selected pace do not incorrectly apply travel-pace health damage on stationary days;
- no browser/page errors in the regression.

## 100-run production grade

Test population:

- 20 deterministic seeds × 5 professions = **100 runs**;
- actual V1.2 default outfit and prices;
- actual profession starting budgets;
- Steady pace;
- competent reference policy switches from the player-facing default Filling rations to Meager before travel;
- conservative treatment, hunting, resting, repair, ferry, and fort-resupply policy.

### Overall

| Metric | Result |
|---|---:|
| Completed | **77 / 100** |
| Completion rate | **77%** |
| Average distance | **1,970 mi** |
| Average survivors | **4.89 / 5** |
| Average calendar days | **202** |
| Average meaningful actions | **87** |
| Average hunts | **20.0** |
| Average repairs | **7.8** |
| Ox-exhaustion rate | **23%** |
| Food-zero rate | **5%** |
| Full-party wipe rate | **1%** |

### By profession

| Profession | Trail cash after default outfit | Completion | Avg distance | Avg survivors | Avg days |
|---|---:|---:|---:|---:|---:|
| Banker | $1,015 | **80%** | 1,985 | 4.95 | 202 |
| Carpenter | $315 | **70%** | 1,979 | 5.00 | 195 |
| Farmer | $65 | **85%** | 1,997 | 4.75 | 208 |
| Hunter | $215 | **70%** | 1,931 | 5.00 | 194 |
| Doctor | $265 | **80%** | 1,959 | 4.75 | 209 |

Average ferry uses per run reflected cash differences: Banker 2.9, Carpenter 2.8, Farmer 1.4, Hunter 2.1, Doctor 2.5.

## Interpretation

The 77% result is intentionally interpreted as a **competent normal-play reference**, not a new-player success rate. The policy already knows to switch to Meager, hunts before starvation, treats weak sick members, repairs a damaged wagon, and buys/ferries when affordable.

This is near the intended upper end for skilled normal play and is therefore acceptable as a V1.2 anchor. It should not be made harsher by restoring arbitrary daily attrition simply to force deaths.

The remaining weakness is the opposite: surviving parties are usually too healthy (4.89/5 average survivors). Future challenge should come from richer Oregon Trail II-inspired systems—disease-specific risks, route hazards, meaningful character traits/skills, contextual obstacles, and a larger event pool—rather than recreating the MVP's starvation/oxen death spiral.

## Decision

**KEEP V1.2 profile.**

- Ship the measured classic-style continuous-travel interaction.
- Ship the $585 benchmark-informed default outfit.
- Ship calibrated terrain, wagon, ox, weather, and Meager-ration values.
- Treat 77% competent-policy completion as the baseline for later difficulty/content work.
