# Frontier Journey balance research

This document records the benchmark-driven tuning path from the first playable MVP to V1.2. It follows the spirit of Karpathy's AutoResearch workflow: establish a fixed baseline, make controlled changes, measure, keep/discard, and preserve enough history to avoid repeating failed experiments.

## Fixed reference points

### 1990 DOS pacing benchmark

Measured from the exact MECC DOS build via the repository's DOSBox harness:

- Continue starts continuous travel rather than advancing one day per click.
- Opening Independence → Kansas River segment: 102 miles.
- Clear/Steady opening speed: about 20 miles/day.
- Filling rations: 3 lb/person/day.
- Banker reference outfit: 6 oxen, 1,000 lb food, 10 clothing sets, 300 bullets, two each wheel/axle/tongue; $510 total without medicine.

The interaction cadence and opening speed are treated as reference measurements. Later-terrain speeds and Frontier Journey-specific systems are tuning variables, not claims about the classic.

## First Frontier Journey baseline

Early browser playtesting exposed two different problems:

1. **Interaction pacing:** hundreds of Continue clicks because one click advanced one day.
2. **Simulation balance:** food/ammo depletion and runaway ox/wagon attrition prevented normal completion.

After implementing classic-style continuous Travel, the first 10-seed balance baseline was:

| Metric | Baseline |
|---|---:|
| Completion | 0 / 10 |
| Average distance | 995 mi |
| Average survivors | 1.5 |
| Meaningful actions | 49 |
| Calendar days | 105 |
| Hunts | 7.0 |
| Repairs | 2.6 |
| Rests | 2.9 |

Conclusion: input pacing was fixed, but the simulation remained far too lethal.

## Controlled experiment history

### Starting resources alone — discard

Using a roughly classic-sized 1,000 lb / 300 bullet / 6 ox outfit dramatically improved party survival, but all 10 runs still failed near 1,163 miles because ox condition collapsed.

**Finding:** starvation was not the only root cause. More supplies exposed the draft-animal feedback loop.

### Moderate ox-wear reduction — discard

Lower passive ox wear moved average distance into roughly 1,560–1,650 miles, but runs remained extremely long and hunt-heavy.

**Finding:** tired oxen caused a positive feedback loop: lower condition → fewer miles/day → more calendar days → even more wear.

### Very low ox wear + faster mid/late terrain — promising

The first viable family reached 6/10 completion, but Filling rations required roughly 28–32 hunts and ~226–241 calendar days.

**Finding:** once oxen became viable, food policy became the next pacing bottleneck.

### Gentle Meager rations — keep direction

Changing Meager's deterministic health drift from `-0.5 HP/day` to `-0.1 HP/day`, while retaining 2 lb/person/day food use, produced a much healthier envelope:

- 7/10 completion in the small sweep
- ~1,982 average miles
- all five travelers alive on average
- ~81 meaningful actions
- ~190 calendar days
- ~18 hunts

**Finding:** Meager should be a real trade-off, not a months-long automatic health sentence.

## 400-run ox calibration

A 400-run sweep tested four nearby Steady ox-wear values using 20 seeds × five professions for each candidate. These runs intentionally held trail cash equal to isolate ox wear.

| Steady ox wear | Completion | Avg days | Avg actions | Avg hunts | Ox-zero failures |
|---:|---:|---:|---:|---:|---:|
| 0.05 | 81% | 197 | 84 | 18.7 | 19% |
| 0.06 | 76% | 199 | 85 | 19.0 | 24% |
| 0.07 | 75% | 197 | 85 | 18.9 | 25% |
| **0.08** | **74%** | **195** | **83** | **18.3** | **26%** |

### Selected V1.2 anchor: 0.08

The competent-reference policy's 74% completion sits near the intended upper end for a skilled normal-mode player, while keeping draft-animal failure meaningful. The lower-wear variants were increasingly forgiving without materially improving pacing.

## V1.2 production profile

### Outfitting

| Item | Default | Price |
|---|---:|---:|
| Food | 1,000 lb | $0.20/lb |
| Ammunition | 300 rounds | $0.10/round |
| Medicine | 3 | $25 |
| Clothing | 10 | $10 |
| Wheels | 2 | $10 |
| Axles | 2 | $10 |
| Tongues | 2 | $10 |
| Oxen | 6 | $20 |

Total default outfit: **$585**, including $75 of Frontier Journey medicine that was not part of the measured $510 classic reference outfit.

### Terrain base miles

- Prairie 17
- Plains 16
- Foothills 14
- Mountains 12
- High Desert 14
- Columbia 13
- Valley 15

### Steady attrition

- wagon wear: 0.05/day
- ox wear: 0.08/day

Strenuous and Grueling retain substantially higher attrition so pace remains a consequential choice; their exact balance still needs a dedicated future sweep.

### Rations

- Filling remains the initial/default policy.
- Meager remains 2 lb/person/day but deterministic health drift is reduced from -0.5 to -0.1 HP/day.
- Bare Bones remains intentionally dangerous.

## Important limitation of the 400-run calibration

The ox sweep assigned equal trail cash to all professions so it could isolate ox wear. The production game uses actual profession budgets. With the $585 default outfit:

- Banker starts trail with $1,015
- Carpenter $315
- Farmer $65
- Hunter $215
- Doctor $265

Therefore V1.2 is not considered complete until a production validation sweep runs with these real cash differences, because ferry and fort-resupply choices depend on money.

## Next research after V1.2

Do not make the base simulation harsh again merely to manufacture deaths. The tuned model tends to keep surviving parties healthy; future difficulty should come from richer, state-linked content:

- more diseases with distinct causes/treatments;
- route-specific hazards;
- meaningful party skills and weaknesses;
- obstacle choices;
- richer events;
- route forks;
- dedicated Strenuous/Grueling balance calibration.

This follows the Oregon Trail II lesson: add consequential systems, not inventory clutter or arbitrary attrition.
