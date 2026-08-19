import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.PAINTED_SPRITE_URL || 'http://127.0.0.1:4175/';
const outDir = path.resolve('frontier-painted-sprite-lab/test-results-painting-world');
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1680, height: 1100 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (error) => errors.push(error.message));

await page.goto(new URL('painting-world.html', base).toString(), { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForFunction(() => document.querySelector('#paintingWorldStage')?.dataset.ready === 'true', null, { timeout: 30_000 });

const initial = await page.evaluate(() => window.paintingWorldPOC.snapshot());
if (!initial.ready) throw new Error('PaintingWorld did not report ready.');
if (!String(initial.engine).startsWith('4.2')) throw new Error(`Expected Phaser 4.2.x, got ${initial.engine}`);
if (!initial.spinePlugin) throw new Error('Official Spine Phaser scene plugin was not registered.');
if (initial.selected !== 'hero') throw new Error(`Expected hero selected initially, got ${initial.selected}`);

await page.locator('#paintingWorldStage').screenshot({ path: path.join(outDir, 'painting-world-initial.png') });

// Move the hero deep into the painting. The PaintingWorld mapper should reduce
// its scale and lower its render depth automatically.
await page.evaluate(() => window.paintingWorldPOC.moveSelectedTo(910, 455, 450));
await page.waitForTimeout(650);
const far = await page.evaluate(() => window.paintingWorldPOC.snapshot());
if (far.hero.y > 470) throw new Error(`Hero did not reach far ground: y=${far.hero.y}`);
if (far.hero.scale >= initial.hero.scale - .12) {
  throw new Error(`Perspective scale did not shrink enough: ${initial.hero.scale} -> ${far.hero.scale}`);
}
if (far.hero.depth >= initial.hero.depth) throw new Error(`Depth did not move farther back: ${initial.hero.depth} -> ${far.hero.depth}`);
await page.locator('#paintingWorldStage').screenshot({ path: path.join(outDir, 'painting-world-far.png') });

// Cross at a Y coordinate behind Buffalo B. Standard Y-depth sorting should put
// the hero behind that nearer animal without a hand-authored cinematic layer.
await page.evaluate(() => window.paintingWorldPOC.moveSelectedTo(900, 545, 420));
await page.waitForTimeout(620);
const cross = await page.evaluate(() => window.paintingWorldPOC.snapshot());
const buffaloB = cross.buffalo.find((b) => b.id === 'buffalo-right');
if (!buffaloB) throw new Error('Buffalo B missing from actor registry.');
if (!(cross.hero.depth < buffaloB.depth)) {
  throw new Error(`Expected hero behind Buffalo B by Y-depth: hero=${cross.hero.depth}, buffalo=${buffaloB.depth}`);
}
await page.locator('#paintingWorldStage').screenshot({ path: path.join(outDir, 'painting-world-behind-buffalo.png') });

// Bring the same actor toward camera. It should become substantially larger and
// sort in front of both buffalo actors.
await page.evaluate(() => window.paintingWorldPOC.moveSelectedTo(510, 744, 450));
await page.waitForTimeout(650);
const near = await page.evaluate(() => window.paintingWorldPOC.snapshot());
if (near.hero.y < 730) throw new Error(`Hero did not reach foreground: y=${near.hero.y}`);
if (near.hero.scale <= far.hero.scale + .25) throw new Error(`Foreground scale did not grow enough: ${far.hero.scale} -> ${near.hero.scale}`);
if (!near.buffalo.every((b) => near.hero.depth > b.depth)) {
  throw new Error(`Hero should render in front near camera: ${JSON.stringify(near)}`);
}
await page.locator('#paintingWorldStage').screenshot({ path: path.join(outDir, 'painting-world-near.png') });

// Perspective guide is a development aid for painting-specific authoring.
await page.check('#showGuide');
await page.waitForTimeout(100);
await page.locator('#paintingWorldStage').screenshot({ path: path.join(outDir, 'painting-world-perspective-guide.png') });

if (errors.length) throw new Error(`Browser console errors:\n${errors.join('\n')}`);

console.log(JSON.stringify({
  status: 'ok',
  engine: initial.engine,
  spinePlugin: initial.spinePlugin,
  backgroundLoaded: initial.backgroundLoaded,
  initialHero: initial.hero,
  farHero: far.hero,
  behindBuffalo: { heroDepth: cross.hero.depth, buffaloDepth: buffaloB.depth },
  nearHero: near.hero,
}, null, 2));

await browser.close();
