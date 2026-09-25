# Frontier horse gait director

This is the motion contract for the production horse/rider Spine asset. It is intentionally stricter than a generic sprite loop.

## Walk cycle

One cycle = 1.0 s at baseline speed, authored as eight readable phases. The exact cadence may be retimed after reference-footage review, but the ordering and planted/swing responsibilities must remain physically coherent.

| t | phase | front near | front far | hind near | hind far | body / rider note |
|---|---|---|---|---|---|---|
| 0.000 | contact near | plant | support | support | plant/release | body begins accepting weight |
| 0.125 | load near | planted | support | support/release | swing starts | chest lowers slightly; rider still descending |
| 0.250 | passing near | swing | support | swing | swing | body crosses planted diagonal support |
| 0.375 | push near | swing forward | release | swing forward | support arrives | pelvis drives; neck counterbalances |
| 0.500 | contact far | support | plant | plant/release | support | opposite half-cycle begins |
| 0.625 | load far | support/release | planted | swing starts | support | body accepts weight on far side |
| 0.750 | passing far | swing | swing | swing | support | rider torso trails pelvis by several frames |
| 0.875 | push far | support arrives | swing forward | support | swing forward | tail / mane / feathers finish after body |
| 1.000 | contact near | same as 0 | same as 0 | same as 0 | same as 0 | seamless loop |

## Hoof rules

- A planted hoof may not drift visibly along the ground.
- Hoof lift must precede forward swing; forward translation may not begin while the hoof is still visually weight-bearing.
- Each hoof target gets an explicit IK controller.
- Contact frames are authored and reviewed at 0.25x speed.
- Far-side legs must remain readable but slightly lower contrast than near-side legs.

## Body rules

- Vertical body motion is small and driven by weight acceptance, not a generic sine-wave bob.
- Chest and pelvis may phase differently; the horse is not one rigid plank.
- Neck/head counterbalance body motion.
- Shoulder compression must be visible on load/contact beats.
- Pelvis/hindquarter push must precede forward recovery.

## Rider rules

Order of response:

1. horse mass moves;
2. rider pelvis follows saddle;
3. rider torso catches up;
4. head/arm react;
5. spear, hair, feathers and reins finish last.

The rider may never be keyed as a single rigid block with the horse.

## Extreme action policy

Reusable locomotion uses weighted meshes + IK. Extreme silhouettes use complete painted corrective attachments when mesh deformation would compromise anatomy or painterly quality.

Required corrective beats for `land_step`:

1. airborne;
2. front-hoof contact;
3. deepest compression;
4. hindquarter transfer;
5. deliberate step;
6. rider/weapon follow-through;
7. settle.

## Acceptance gates

- 4 independently moving hoof IK targets.
- 0 visible planted-hoof skating at normal playback.
- Land/contact shows a clear center-of-mass drop before recovery.
- Rider torso response visibly lags horse body.
- Spear / feathers / hair settle after rider torso.
- Every important freeze frame remains a plausible painting.
- Silhouette is readable at final in-game scale.
- 0.25x playback must improve inspection, not reveal broken anatomy.

## Runtime contract

The browser must only consume exported Spine data through `spine-phaser-v4` and Phaser's `SpineGameObject`. Phaser owns world position, scale, depth and game state. Spine owns the character's internal performance.
