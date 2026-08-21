# Tag Arena

AI-first browser fighting game experiment in `paksue/sand_box`.

## Why this branch exists
Before building the actual wrestling/fighting game, this project proves a development loop that can be driven from ChatGPT web:

1. change code on an isolated Git branch;
2. run deterministic Node tests;
3. launch the real browser build in Chromium;
4. control the game through `window.__TAG_ARENA__`;
5. verify numerical state transitions;
6. capture a screenshot and machine-readable playtest report in GitHub Actions.

## Run locally
From `tag-arena/`:

```bash
python3 -m http.server 4178
```

Open:

```text
http://127.0.0.1:4178/
```

Arrow keys move Player 1.

For deterministic manual control:

```text
http://127.0.0.1:4178/?debug=1&manual=1&seed=48129
```

Then use `window.__TAG_ARENA__` from the browser console or automation.

## Tests

```bash
npm test
```

The Chromium smoke test is normally run by GitHub Actions because CI installs Playwright for the job.

## Project truth
Read in this order:

1. `AGENTS.md`
2. `docs/PRODUCT.md`
3. `docs/ARCHITECTURE.md`
4. `docs/CURRENT.md`

## Phase -1 acceptance signal
The browser smoke test must move Player 1 exactly 48 pixels to the right over 12 manual simulation ticks, with no browser console errors, and upload:

- `test-results/harness.png`
- `test-results/playtest-report.json`
