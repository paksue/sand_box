# HaGRIDv2 negative landmark features

`hagrid-negative-features-v1.json` contains **300 derived, normalized hand-landmark feature vectors** sampled from the HaGRIDv2 `no_gesture` image class for Hold Personalized v1.

- Source: HaGRID / HaGRIDv2 — https://github.com/hukenovs/hagrid
- Source class: `no_gesture`
- Sampling seed: `20260817`
- Feature size: 63 values (21 MediaPipe hand landmarks × x/y/z)
- Normalization: wrist-centered; left hands mirrored into a right-hand canonical frame; wrist→middle-finger MCP rotated vertical; scale normalized by wrist→middle-MCP distance.
- Source license: HaGRID repository identifies the dataset license as a CC BY-SA 4.0 variant. Follow the upstream repository/license for attribution and redistribution requirements.

The app does **not** ship the source HaGRID images. It ships only the derived landmark feature vectors used as broad examples of “hand present, but not a Hold command.”

Personal user training photos are never committed to this repository. When a user installs Personalized v1, their training ZIP is processed locally in the browser and only normalized feature vectors are stored in that browser's local storage.
