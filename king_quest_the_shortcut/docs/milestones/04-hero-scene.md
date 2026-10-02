# Milestone 04 — Hero Visual Scene

> **Historical office-prototype milestone — superseded.** Its developer-bullpen scene, characters, and R3F assumptions are not current direction. See [`../README.md`](../README.md).

## Goal
Bring the developer bullpen to near-final art quality before propagating style.

## Default approach
Use the approved hybrid 2.5D pipeline. Do not default to a fully realtime 3D office merely because the runtime uses R3F.

## Work
- build a reference board from KQ III–VI galleries;
- generate and compare multiple concept directions;
- approve one visual North Star;
- lock scene camera and composition;
- approve Daniel/Sarah/Kevin character direction;
- establish morning and late-afternoon lighting;
- create the structural scene source using Blender **if explicitly available**, otherwise use a deterministic browser/Three.js blockout plus layout data;
- produce/refine the final painterly background plate/layers;
- align walkmesh, occlusion, hotspots, characters, and selected realtime props to the plate;
- establish UI typography and interaction cues.

## Blender rule
Blender is optional. Do not block this milestone waiting for access to a local Blender instance. If a Blender-capable desktop/local execution path is later provided, it may replace or improve the structural scene source without changing simulation architecture.

## Acceptance
Provide screenshots showing:
- reference-vs-target reasoning;
- clean three-plane depth;
- clear focal hierarchy;
- readable traversal;
- Sarah's workstation visible but not over-signaled;
- characters readable at gameplay distance;
- convincing compositing between authored background and realtime elements;
- no generic asset-pack/dashboard feel.

Do not beautify every room until this gate passes.
