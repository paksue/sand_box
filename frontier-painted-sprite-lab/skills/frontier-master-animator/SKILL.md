---
name: frontier-master-animator
description: Create and critique premium painterly Spine animations for Frontier living-painting actors in Phaser. Use for horse, rider, ox, buffalo, wagon-creature, or other painted actor rigging, gait, landing, idle, walk, run, mounted secondary motion, source-art fidelity, and animation QA.
---

# Frontier Master Animator

## Mission

Make a historical-painting-quality actor move with convincing weight while preserving the painterly visual language. Phaser owns where the actor is in the world. Spine owns the actor hierarchy, deformation, constraints, and animation. Never replace approved painterly art with geometric stand-ins in a production-quality pass.

## Production Runtime Contract

Production means a **real Spine Editor export**, not a skeleton assembled in browser JavaScript.

- Spine Editor: 4.3.
- spine-phaser-v4: 4.3.x, 4.3.11 or newer.
- Phaser: 4.2.1 or newer; this project pins 4.2.1 for the milestone.
- Renderer: WebGL using Spine's default `phaser` backend, which renders through Phaser Mesh2D.
- Runtime package: `.skel` + `.atlas` + one or more packed `.png` atlas pages.
- Loading: `Scene.load.spineSkeleton()` + `Scene.load.spineAtlas()`.
- Playback: `SpineGameObject.animationState`; do not drive production clips by writing every bone from custom scene JavaScript.

If those files do not exist, the production hero is **blocked**, even if an earlier runtime-generated POC looks animated.

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

1. Start from an approved painterly master design, but rebuild it as a purpose-authored animation master rather than slicing a flattened historical crop.
2. Author at 2K minimum / 4K preferred character height.
3. Separate all independently moving pieces into transparent source layers. A mounted horse normally needs 25–35 source layers, including separate upper/lower/hoof chains for all four legs, horse mass regions, mane/tail, rider pelvis/torso/head/arms, hair/feathers, spear and reins.
4. Paint hidden anatomy under every overlap. At 4K authoring size, preserve roughly 24–64 px of useful overlap paint around rotating joints.
5. Import the layered art into Spine Editor 4.3.
6. Convert horse neck, chest, barrel, pelvis transitions and rider torso to weighted meshes. Do not turn every painted piece into a rigid card.
7. Use mostly rigid/lighter meshes for lower legs, hooves and spear.
8. Add four independent leg IK constraints so planted hooves can remain fixed while the body moves over them.
9. Add secondary chains/constraints for mane, tail, hair and feathers.
10. Use alternate painted attachments/corrective pieces for extreme poses rather than forcing one texture through an ugly deformation.
11. Export the runtime package from Spine; then and only then integrate it into the production Phaser page.

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

## Required First Clips

Do not broaden the animation library until these pass:

1. `idle_alive`
2. `walk`
3. `land_step`
4. `rear_action`

Define exact Spine events for `hoof_front_contact`, `hoof_rear_contact`, and `impact` so Phaser can trigger dust/audio/camera feedback from animation timing rather than guesses.

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

- **Spine:** bones, meshes, weights, IK, constraints, attachments, AnimationState, animation mixing, secondary motion.
- **Phaser:** actor world position, path/movement, perspective scaling, depth sorting, selection glow, particles, camera, and scene effects.
- **PaintingWorld:** thin mapping from painting ground coordinates to scale/depth/occlusion.

Keep these boundaries explicit so painterly actor quality can improve without rewriting the game world.

## POC-to-Production Rule

A flattened historical crop may be used to prove hierarchy and timing, but it is not enough for a production walk cycle because occluded anatomy does not exist. Production promotion requires purpose-painted hidden shoulder/leg artwork, clean transparent layers, weighted mesh deformation, four-leg IK, authored Spine animations, and a real Spine export package loaded by the official Phaser Spine plugin.
