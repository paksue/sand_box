# Frontier Hero runtime export

This folder is intentionally reserved for the **real Spine export**. It must not contain runtime-generated skeleton approximations.

Expected production files:

- `frontier-hero.skel` — binary skeleton + animation data exported from Spine 4.3.
- `frontier-hero.atlas` — Spine texture-atlas metadata.
- `frontier-hero.png` — packed painterly texture page. Additional numbered PNG pages are allowed if packing requires them.

Phaser 4.2.1 + spine-phaser-v4 4.3.11+ loads the package with the official Spine scene plugin using:

- `this.load.spineSkeleton('frontier-hero-data', './assets/frontier-hero/runtime/frontier-hero.skel')`
- `this.load.spineAtlas('frontier-hero-atlas', './assets/frontier-hero/runtime/frontier-hero.atlas')`

The actor is then created as a real `SpineGameObject` and animations are played through its Spine `AnimationState`. The WebGL `phaser` renderer backend is used so weighted meshes render through Phaser's Mesh2D system.

Do not hand-author a fake `.skel` file and do not substitute a sprite sheet here. The purpose of this folder is to make the production boundary explicit and auditable.
