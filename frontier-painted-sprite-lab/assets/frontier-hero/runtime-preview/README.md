# Painted sequence benchmark

This folder contains the current AI-authored painterly motion benchmark for the Frontier horse+rider.

It is intentionally separate from `../runtime/`, which is reserved for the final Spine Editor production export.

## What this benchmark proves

- Purpose-created horse/rider artwork can preserve anatomy and painterly silhouette better than slicing a flattened historical painting.
- Phaser 4.2.1 can render the actor through the official `spine-phaser-v4` 4.3 plugin.
- Spine `AnimationState` drives named clips (`idle_alive`, `walk`, `land_step`, `rear_action`).
- `land_step` uses six fully painted corrective pose attachments with explicit contact / impact / step events.
- The runtime uses the Phaser renderer backend (Mesh2D).

## Production direction

Use a hybrid Spine actor:

1. **Weighted-mesh + four-leg IK rig** for reusable idle/walk/trot locomotion.
2. **Corrective painted attachments / pose swaps** for extreme silhouettes such as rear, airborne landing, deepest compression, and attack poses.
3. Rider, spear, hair, mane, tail, reins, and feathers get delayed secondary motion rather than moving as one rigid block.

The benchmark is not the final character. It exists to raise the visual-quality bar before the final `.spine` / `.skel + .atlas + .png` production export.
