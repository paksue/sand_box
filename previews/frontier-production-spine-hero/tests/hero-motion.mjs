import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.PAINTED_SPRITE_URL || 'http://127.0.0.1:4175/';
const outDir = path.resolve('frontier-painted-sprite-lab/test-results-hero-motion');
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', error => errors.push(error.message));

await page.goto(new URL('hero-motion.html', base).toString(), { waitUntil: 'networkidle', timeout: 60_000 });
try {
  await page.waitForFunction(() => document.querySelector('#heroMotionStage')?.dataset.ready === 'true', null, { timeout: 12_000 });
} catch (error) {
  await page.screenshot({ path: path.join(outDir, 'hero-boot-failure.png'), fullPage: true });
  const state = await page.evaluate(() => ({
    ready: document.querySelector('#heroMotionStage')?.dataset.ready,
    phaser: !!window.Phaser,
    spine: !!window.spine,
    api: !!window.heroMotionPOC,
  }));
  throw new Error(`Hero motion boot failed: ${JSON.stringify(state)}\nBrowser errors:\n${errors.join('\n') || '(none)'}\n${error.message}`);
}

const initial = await page.evaluate(() => window.heroMotionPOC.snapshot());
if (!initial.ready) throw new Error('Hero motion POC not ready.');
if (initial.engine !== '4.2.1') throw new Error(`Expected Phaser 4.2.1, got ${initial.engine}`);
if (!initial.spinePlugin || !initial.actualSpineObject) throw new Error('Expected a real registered Spine GameObject.');
if (initial.paintedParts !== 8) throw new Error(`Expected 8 source-painted parts, got ${initial.paintedParts}`);
await page.locator('#heroMotionStage').screenshot({ path: path.join(outDir, 'hero-00-source-rig.png') });

await page.evaluate(() => { window.heroMotionPOC.play('land'); window.heroMotionPOC.seek(.43); });
const contact = await page.evaluate(() => window.heroMotionPOC.snapshot());
await page.locator('#heroMotionStage').screenshot({ path: path.join(outDir, 'hero-43-contact.png') });

await page.evaluate(() => window.heroMotionPOC.seek(.58));
const compression = await page.evaluate(() => window.heroMotionPOC.snapshot());
await page.locator('#heroMotionStage').screenshot({ path: path.join(outDir, 'hero-58-compression.png') });

await page.evaluate(() => window.heroMotionPOC.seek(.72));
const follow = await page.evaluate(() => window.heroMotionPOC.snapshot());
await page.locator('#heroMotionStage').screenshot({ path: path.join(outDir, 'hero-72-rider-followthrough.png') });

await page.evaluate(() => window.heroMotionPOC.seek(1));
const settled = await page.evaluate(() => window.heroMotionPOC.snapshot());
await page.locator('#heroMotionStage').screenshot({ path: path.join(outDir, 'hero-100-settle.png') });

if (Math.abs(compression.frontLegRotation - initial.frontLegRotation) < 12) {
  throw new Error(`Front-leg action too weak: ${initial.frontLegRotation} -> ${compression.frontLegRotation}`);
}
if (compression.heroY - contact.heroY < 8) {
  throw new Error(`Expected visible weight compression after contact: ${contact.heroY} -> ${compression.heroY}`);
}
if (settled.heroX - initial.heroX < 45) {
  throw new Error(`Expected a deliberate one-step advance, got ${settled.heroX - initial.heroX}px`);
}
if (follow.secondaryLag < 2.5) {
  throw new Error(`Expected rider/spear phase separation, got ${follow.secondaryLag}°`);
}

await page.evaluate(() => { window.heroMotionPOC.setSpeed(1); window.heroMotionPOC.play('land'); });
await page.waitForTimeout(900);
const impactRun = await page.evaluate(() => window.heroMotionPOC.snapshot());
if (impactRun.dustEvents < 1) throw new Error('Landing crossed impact without firing the hoof-impact event.');
await page.locator('#heroMotionStage').screenshot({ path: path.join(outDir, 'hero-impact-live.png') });

await page.evaluate(() => window.heroMotionPOC.seek(.72));
const lagOn = await page.evaluate(() => window.heroMotionPOC.snapshot().secondaryLag);
await page.click('#secondaryMotion');
const lagOff = await page.evaluate(() => window.heroMotionPOC.snapshot().secondaryLag);
if (!(lagOff < lagOn * .45)) throw new Error(`Secondary-motion toggle did not materially reduce lag: ${lagOn} -> ${lagOff}`);

await page.click('#selectionGlow');
const noGlow = await page.evaluate(() => window.heroMotionPOC.snapshot());
if (noGlow.selectionGlow) throw new Error('Selection glow toggle did not turn off.');

if (errors.length) throw new Error(`Browser console errors:\n${errors.join('\n')}`);

console.log(JSON.stringify({
  status: 'ok',
  engine: initial.engine,
  actualSpineObject: initial.actualSpineObject,
  paintedParts: initial.paintedParts,
  contactY: contact.heroY,
  compressionY: compression.heroY,
  oneStepTravelPx: Number((settled.heroX - initial.heroX).toFixed(2)),
  frontLegRotationAtCompression: compression.frontLegRotation,
  riderSpearLagAtFollowthrough: follow.secondaryLag,
  impactEvents: impactRun.dustEvents,
  lagToggle: { on: lagOn, off: lagOff },
}, null, 2));

await browser.close();
