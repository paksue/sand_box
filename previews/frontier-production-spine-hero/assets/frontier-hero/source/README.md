# Frontier Hero source-art package

This folder is the **authoring source**, not the Phaser runtime package.

The historical painting crop is reference only. The production actor must be repainted/rebuilt specifically for animation so the horse has complete anatomy under every overlap and each independently moving part exists on its own transparent layer.

## Required master

Create `frontier-hero-master.psd` at 2K minimum / 4K preferred character height. Use a calm side-to-three-quarter setup pose with all four legs readable. The master should preserve the approved painterly finish, palette, lighting and silhouette language.

## Layer contract

Use the exact layer names in `../manifest.json`. Each layer must have:

- transparent background;
- 24–64 px of hidden overlap paint beneath adjacent pieces at 4K authoring resolution;
- no baked buffalo/background pixels;
- no hard vector-style cut edge;
- enough painted continuation to survive the maximum planned joint rotation.

Horse neck, chest, barrel, pelvis and rider torso are intended to become **weighted mesh attachments** in Spine. Lower legs, hooves and spear can remain mostly rigid. Mane, tail, hair and feathers need independent layers for follow-through / physics.

## Spine import target

Import these layers into **Spine Editor 4.3**. Build the hierarchy, gait and constraints from:

- `frontier-hero-rig-template-v3.json` — current Spine 4.3 schema (`constraints` array with `type: "ik"`).
- `GAIT.md` — eight-phase horse gait and QA rules.
- `../manifest.json` — production files, layer names and quality gates.

`frontier-hero-rig-template.json` is retained only as an earlier experiment and must not be used as the production schema.

The final Editor project should be saved as:

`frontier-hero.spine`

Then export the browser package as:

- `../runtime/frontier-hero.skel`
- `../runtime/frontier-hero.atlas`
- `../runtime/frontier-hero.png` (plus additional atlas pages if Spine packing requires them)

Do not ship this source folder to the browser. Phaser consumes only the files under `../runtime/` after the Spine Editor export.
