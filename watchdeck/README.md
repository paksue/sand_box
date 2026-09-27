# Watchdeck

A private, client-side movie + TV tracker built for the `paksue/sand_box` GitHub Pages site.

## Product
Watchdeck optimizes the loop: **open → see what's next → mark watched → move on**.

- TV search works immediately through TVmaze.
- Optional TMDB Read Access Token in Settings enables unified movie/TV discovery, richer metadata and watch-provider information.
- Library, episode progress, history and settings stay in the browser's IndexedDB.
- Export/import provides portable JSON backup.
- No backend, account system or committed API secret.

## Pages release
The source was QA-tested as a self-contained static app. The Pages entry point reconstructs that immutable compressed release payload in-browser from `.payload/` fragments. This avoids a build server and asset-path failures while keeping the deployment client-only.

Pages path: `/sand_box/watchdeck/`.
