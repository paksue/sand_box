---
name: frontier-master-animator
description: Create and critique premium painterly Spine animations for Frontier living-painting actors in Phaser. Use for horse, rider, ox, buffalo, wagon-creature, or other painted actor rigging, gait, landing, idle, walk, run, mounted secondary motion, source-art fidelity, and animation QA.
---

# Frontier Master Animator

## Mission

Make a historical-painting-quality actor move with convincing weight while preserving the original painterly pixels. Phaser owns where the actor is in the world. Spine owns the actor hierarchy, deformation, constraints, and animation. Never replace approved painterly art with geometric stand-ins in a production-quality pass.

## Studio Roles

Run every hero animation through five roles, even if one agent executes them sequentially.

1. **Art Fidelity Director**
   - Lock one approved master still as visual truth.
   - Preserve silhouette, palette, brush softness, anatomy, lighting, costume, and edge treatment.
   - Reject vector-looking redraws, sticker edges, palette drift, and AI frame drift.
2. **Quadruped Motion Animator**
   - Build the horse/ox/buffalo motion from real gait phases and planted contacts.
   - Author strong key poses before interpolation.
   - Use body compression and center-of-mass travel to communicate weight.
3. **Mounted Rider Secondary Motion Director**
   - Horse pelvis/body leads.
   - Rider pelvis follows the saddle.
   - Torso lags, then arm/spear, then feathers/accessories.
   - Never move rider, spear, and horse as one rigid block.
4. **Biomechanics Critic**
   - Inspect at 1x, 0.5x, 0.25x, and random frozen frames.
   - Reject hoof sliding, impossible joint arcs, weightless landings, bad contact timing, silhouette collapse, or anatomical distortion.
5. **Phaser Integration Director**
   - Treat the finished Spine actor as one world object.
   - Phaser controls x/y travel, perspective scale, depth, selection effects, and world occlusion.
   - Animation state must be derived from movement/action state, not ad-hoc scene flags.

## Asset Pipeline

1. Start from an approved painterly master frame.
2. Separate the actor into the fewest useful overlapping raster pieces. Typical mounted horse hierarchy:
   - horse body / shoulder-hip mass
   - neck + head
   - front leg chain(s)
   - rear leg chain(s)
   - tail / mane secondary pieces
   - rider pelvis/torso
   - rider arm + weapon
   - head / feathers / loose gear
3. Preserve hidden overlap paint under joints. If the flattened source does not contain it, flag the limitation instead of inventing a clean vector patch.
4. Use Spine region/mesh attachments. Prefer weighted meshes for shoulder, chest, hip, neck, cloth, and other soft transitions in production assets.
5. Add IK targets for planted hooves/feet when full separated leg anatomy exists.
6. Use alternate painted attachments/corrective pieces for extreme poses rather than forcing one texture through an ugly deformation.

## Motion Authoring Rules

### Horse landing + one step

Use this action grammar:

`airborne -> front-hoof contact -> shoulder/body compression -> hindquarter catch-up -> one deliberate step -> rider catch-up -> spear/feather settle -> hold`

The body must drop into contact before meaningful forward travel. Contact should create a readable change in velocity. Secondary motion peaks after the horse's primary impact, not at the same instant.

### Walk/gait

For each hoof, explicitly mark:
- contact
- load
- passing
- push-off
- swing
- next contact

A planted hoof should remain approximately fixed in world space while the body moves over it. Do not hide foot sliding with dust.

### Idle

Idle is not frozen art and not constant bobbing. Use tiny asymmetric changes in:
- breathing/body mass
- neck/head
- tail/mane
- rider torso
- loose gear

Keep amplitude low enough that random freeze frames still look painted.

## Source Fidelity Gates

Reject a pass if any of these are true:
- visible moving pixels are replaced with geometric redraws
- cutout seams open during motion
- brush/edge character becomes substantially sharper than the painting
- limbs visibly stretch because hidden anatomy is missing
- character proportions drift between poses
- palette/lighting no longer belongs to the source scene

## Biomechanics Gates

Reject a pass if any of these are true:
- hoof slides during a planted phase
- body moves forward before impact/compression sells weight
- shoulder/hip response does not correspond to the contacting limb
- rider moves exactly in phase with horse body
- spear/feathers stop at exactly the same time as rider torso
- silhouette becomes ambiguous at important key poses

## QA Loop

For every hero clip:
1. Render/play at 1x.
2. Play at 0.5x.
3. Play at 0.25x.
4. Freeze at contact, deepest compression, passing/step, and settle.
5. Capture deterministic screenshots of those poses.
6. Compare each to the approved master for style and anatomy.
7. Record measurable checks: body drop, actor travel, planted-foot drift, rider lag, spear lag.
8. Revise until both art-fidelity and biomechanics gates pass.

Never approve a clip merely because it is smooth.

## Phaser / Spine Boundary

- **Spine:** bones, meshes, IK, constraints, attachments, animation mixing, secondary motion.
- **Phaser:** actor world position, path/movement, perspective scaling, depth sorting, selection glow, particles, camera, and scene effects.
- **PaintingWorld:** thin mapping from painting ground coordinates to scale/depth/occlusion.

Keep these boundaries explicit so painterly actor quality can improve without rewriting the game world.

## POC-to-Production Rule

A flattened historical crop may be used to prove hierarchy and timing, but it is not enough for a production walk cycle because occluded anatomy does not exist. Production promotion requires purpose-prepared hidden shoulder/leg artwork, cleaner masks, and—where appropriate—weighted mesh deformation + IK.
