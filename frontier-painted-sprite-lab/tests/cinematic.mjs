import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.PAINTED_SPRITE_URL || 'http://127.0.0.1:4175/';
const outDir = path.resolve('frontier-painted-sprite-lab/test-results-cinematic');
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1050 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (error) => errors.push(error.message));

await page.goto(new URL('cinematic.html', base).toString(), { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForFunction(() => Boolean(window.__cinematicLab?.state?.ready), null, { timeout: 30_000 });

const initial = await page.evaluate(() => window.__cinematicLab.getDebugState());
if (!initial.ready) throw new Error('Cinematic stage did not report ready.');
if (!(initial.layers.backgroundZ < initial.layers.hazeZ && initial.layers.hazeZ < initial.layers.actorZ && initial.layers.actorZ < initial.layers.foregroundZ)) {
  throw new Error(`Expected real Z-separated stage layers, got ${JSON.stringify(initial.layers)}`);
}

// Prove this is an authored shot, not a static scene: timeline, camera and actor
// all advance together while foreground remains independently placed in Z.
await page.waitForTimeout(900);
const runtime = await page.evaluate(() => window.__cinematicLab.getDebugState());
if (runtime.time <= initial.time + .45) throw new Error(`Shot timeline did not advance: ${initial.time.toFixed(2)} -> ${runtime.time.toFixed(2)}`);
if (Math.abs(runtime.camera.x - initial.camera.x) < .03) throw new Error('Camera did not visibly begin its authored move.');
if (Math.abs(runtime.actor.x - initial.actor.x) < .08) throw new Error('Actor layer did not advance through the shot.');

// Pause must freeze the movie timeline exactly while the render loop continues.
await page.click('#playPause');
const pausedA = await page.evaluate(() => window.__cinematicLab.getDebugState());
await page.waitForTimeout(450);
const pausedB = await page.evaluate(() => window.__cinematicLab.getDebugState());
if (Math.abs(pausedB.time - pausedA.time) > .01) throw new Error(`Pause did not freeze shot time: ${pausedA.time} -> ${pausedB.time}`);

// Deterministic director captures at three beats. These are the human visual QA
// artifacts: engineering checks cannot decide whether the shot actually reads.
await page.evaluate(() => window.__cinematicLab.seek(2));
const at2 = await page.evaluate(() => window.__cinematicLab.getDebugState());
await page.locator('#cinematicStage').screenshot({ path: path.join(outDir, 'cinematic-02s-establish.png') });

await page.evaluate(() => window.__cinematicLab.seek(6.6));
const at66 = await page.evaluate(() => window.__cinematicLab.getDebugState());
await page.locator('#cinematicStage').screenshot({ path: path.join(outDir, 'cinematic-066s-foreground.png') });

await page.evaluate(() => window.__cinematicLab.seek(10.5));
const at105 = await page.evaluate(() => window.__cinematicLab.getDebugState());
await page.locator('#cinematicStage').screenshot({ path: path.join(outDir, 'cinematic-105s-settle.png') });

const actorTravel = Math.abs(at105.actor.x - at2.actor.x);
const cameraTravel = Math.abs(at105.camera.x - at2.camera.x);
if (actorTravel < 1.8) throw new Error(`Authored actor travel too small: ${actorTravel.toFixed(2)} world units`);
if (cameraTravel < .65) throw new Error(`Authored camera travel too small: ${cameraTravel.toFixed(2)} world units`);

// Camera choreography is optional stage machinery. Turning it off should fix the
// camera without stopping actor/story choreography, making the parallax benefit
// directly inspectable rather than merely asserted.
await page.click('#cameraMotion');
await page.evaluate(() => window.__cinematicLab.seek(2));
const flatA = await page.evaluate(() => window.__cinematicLab.getDebugState());
await page.evaluate(() => window.__cinematicLab.seek(10));
const flatB = await page.evaluate(() => window.__cinematicLab.getDebugState());
if (Math.abs(flatB.camera.x - flatA.camera.x) > .01 || Math.abs(flatB.camera.z - flatA.camera.z) > .01) {
  throw new Error('Camera-off comparison still moved the camera.');
}
if (Math.abs(flatB.actor.x - flatA.actor.x) < 1.5) throw new Error('Camera-off comparison incorrectly stopped shot choreography.');
await page.locator('#cinematicStage').screenshot({ path: path.join(outDir, 'cinematic-camera-off.png') });

// Foreground and atmosphere need to be independently directable scene layers.
await page.click('#foreground');
await page.click('#atmosphere');
const toggled = await page.evaluate(() => window.__cinematicLab.getDebugState());
if (toggled.foregroundVisible) throw new Error('Foreground layer did not toggle off.');
if (toggled.atmosphereVisible) throw new Error('Atmosphere layer did not toggle off.');

if (errors.length) throw new Error(`Browser console errors:\n${errors.join('\n')}`);

console.log(JSON.stringify({
  status: 'ok',
  timelineAdvancedSeconds: Math.round((runtime.time - initial.time) * 100) / 100,
  actorTravelWorldUnits: Math.round(actorTravel * 100) / 100,
  cameraTravelWorldUnits: Math.round(cameraTravel * 100) / 100,
  layers: initial.layers,
  backgroundLoadedDuringTest: at105.backgroundLoaded,
}, null, 2));

await browser.close();
