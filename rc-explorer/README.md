# Tiny Trails · RC Explorer

A client-side-only 3D RC exploration game in `paksue/sand_box`.

## Play
Drive a miniature RC crawler through **Backyard After Rain**. There are no opponents and no required races: explore wet grass, a creek and bridge, a stone garden, a deck climb, a shed, a drain tunnel and giant plants.

Controls: WASD, C camera, L lights, R recover, P photo mode. Gamepads and touch controls are supported.

## Local development
```bash
npm install
npm run dev
```

## Verification
```bash
npm run build
npx playwright install chromium
npm run test:browser
```

Automation can load `/?manual=1` and control the fixed-step game through `window.__RC_EXPLORER__`.

## Production
The app has no server, database, login, API key or remote AI requirement. GitHub Actions publishes the compiled static build to:

`/sand_box/previews/rc-explorer/`
