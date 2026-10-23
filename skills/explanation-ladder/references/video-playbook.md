# Video playbook — explanatory animation

This guide is loaded only when a video is the chosen output.

## Storyboard table

Plan scenes with these columns:

| Beat | Learning objective | On-screen objects | Transformation / camera | Spoken line | Duration |
| --- | --- | --- | --- | --- | --- |
| Hook | Pose a concrete contradiction | Familiar objects / values | Reveal comparison | 1–2 short sentences | 5–12 s |
| Model | Show the pieces | Visual variables and units | Place, label, connect | Define each variable | 10–25 s |
| Mechanism | Reveal cause and effect | Same objects with consistent mapping | Animate one change at a time | Explain what changed and why | 20–60 s |
| Test | Predict a new case | Altered input | Pause, then show outcome | Ask then answer | 10–30 s |
| Recap | Compress to one insight | Final diagram | Zoom out and connect | One sentence + caveat | 5–15 s |

Adapt times to the actual requested length. Estimate narration at a natural pace; do not cram labels or formula derivations.

## Media stack selection

- **Manim**: best for mathematics, diagrams, geometry, algorithm traces; Python-based, with CLI render.
- **Remotion**: best for React/TypeScript scene composition, branded components, mixed 2D motion, audio and captions.
- **HTML/SVG/canvas + recording**: best for repurposing a working interactive model into timed scenes.
- **FFmpeg**: muxing, captioning, audio normalization, stitching, quality checks.
- **Piper / installed local TTS**: offline narration when available; verify voice availability and licensing.
- **ElevenLabs**: cloud narration only with user-provided credentials and approval for associated costs.

Inspect which programs and dependencies really exist before selecting a pipeline. Prefer the smallest usable stack.

## Synchronization and production checks

1. Freeze exact narration text before timing animation beats.
2. Generate audio in separate sentences or scenes when it simplifies alignment.
3. Use actual audio durations for timing, not guesses.
4. Render sample frames; check off-screen clipping and font size at target resolution.
5. Make on-screen equations match narration exactly.
6. Provide accurate captions / text transcript, synchronized when feasible.
7. Render video, inspect its metadata and a few frames, listen to representative audio if possible, and ensure the final file exists.
8. State tested facts only. If a tool or voice is missing, don't call a script an MP4.

## Original style rather than imitation

Use the pedagogical techniques of intuitive math visualization and gradual construction, but do not copy another creator's graphic signature, logo, voice, scenes, or branded titles.
