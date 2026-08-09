import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.PAINTED_SPRITE_URL || 'http://127.0.0.1:4175/';
const outDir = path.resolve('frontier-painted-sprite-lab/test-results-child-light');
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', (error) => errors.push(error.message));

await page.goto(new URL('child-light.html', base).toString(), { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForFunction(() => Boolean(window.__childLightLab?.rig?.ready), null, { timeout: 30_000 });

// First prove the actual runtime loop advances while the default quality test
// keeps the actor root planted. Do not use arbitrary runtime phases to measure
// gait amplitude: two samples can land on visually similar points in the cycle.
const runtimeBefore = await page.evaluate(() => ({
  rig: window.__childLightLab.rig.getDebugState(),
  scene: window.__childLightLab.getSceneState(),
}));
await page.waitForTimeout(850);
const runtimeAfter = await page.evaluate(() => ({
  rig: window.__childLightLab.rig.getDebugState(),
  scene: window.__childLightLab.getSceneState(),
}));

if (runtimeBefore.scene.travel !== 'in-place') {
  throw new Error(`Expected default in-place mode, got ${runtimeBefore.scene.travel}`);
}
const rootTravel = Math.abs(runtimeAfter.rig.rootX - runtimeBefore.rig.rootX);
if (rootTravel > 2) throw new Error(`Walk-in-place cheated with root translation: ${rootTravel.toFixed(2)}px`);
if (runtimeAfter.rig.poseVersion <= runtimeBefore.rig.poseVersion) throw new Error('Articulated rig pose did not advance.');

// Freeze automatic updates, then measure a deterministic half-cycle. This is
// the real visual motion gate: opposite gait poses must move painted hoof
// endpoints by a clearly visible amount at the default on-screen scale.
await page.click('#playPause');
await page.evaluate(() => window.__childLightLab.rig.updatePose(0));
const poseA = await page.evaluate(() => window.__childLightLab.rig.getDebugState());
await page.evaluate(() => window.__childLightLab.rig.updatePose(Math.PI));
const poseB = await page.evaluate(() => window.__childLightLab.rig.getDebugState());

const toeKeys = Object.keys(poseA.toes);
if (toeKeys.length < 4) throw new Error(`Expected four articulated hoof endpoints, got ${toeKeys.length}`);
const toeDeltas = toeKeys.map((key) => {
  const a = poseA.toes[key];
  const b = poseB.toes[key];
  return Math.hypot(b.x - a.x, b.y - a.y) * poseB.scale;
});
const maxToeDelta = Math.max(...toeDeltas);
const clearlyMovingToes = toeDeltas.filter((value) => value >= 6).length;
if (maxToeDelta < 12) throw new Error(`Deterministic hoof arc is visually too small: ${maxToeDelta.toFixed(2)} screen px`);
if (clearlyMovingToes < 2) throw new Error(`Too few hooves move visibly: ${clearlyMovingToes} of ${toeDeltas.length}`);

// Capture two deliberately different, aesthetically useful gait poses for human
// art-direction review. A green numeric test is never considered sufficient.
await page.evaluate(() => window.__childLightLab.rig.updatePose(0.38));
await page.screenshot({ path: path.join(outDir, 'child-light-scene-a.png'), fullPage: true });
await page.evaluate(() => window.__childLightLab.rig.updatePose(2.05));
await page.screenshot({ path: path.join(outDir, 'child-light-scene-b.png'), fullPage: true });

await page.click('[data-view="neutral"]');
if (await page.getAttribute('#stage', 'data-view') !== 'neutral') throw new Error('Neutral view did not activate.');
await page.screenshot({ path: path.join(outDir, 'child-light-neutral.png'), fullPage: true });

await page.click('[data-view="rig"]');
const rigVisible = await page.evaluate(() => window.__childLightLab.rig.debugLayer.visible);
if (!rigVisible) throw new Error('Rig debug view did not activate.');
await page.screenshot({ path: path.join(outDir, 'child-light-rig.png'), fullPage: true });

// Through-scene mode is a separate presentation feature. It must move visibly,
// but it is never allowed to substitute for the in-place local gait test above.
await page.click('[data-view="scene"]');
await page.click('[data-travel="scene"]');
await page.click('#playPause');
const travelBefore = await page.evaluate(() => window.__childLightLab.rig.root.x);
await page.waitForTimeout(750);
const travelAfter = await page.evaluate(() => window.__childLightLab.rig.root.x);
const worldTravel = Math.abs(travelAfter - travelBefore);
if (worldTravel < 22) throw new Error(`Through-scene mode did not translate visibly: ${worldTravel.toFixed(2)}px`);

await page.click('#playPause');
const pausedBefore = await page.evaluate(() => ({
  poseVersion: window.__childLightLab.rig.poseVersion,
  rootX: window.__childLightLab.rig.root.x,
}));
await page.waitForTimeout(400);
const pausedAfter = await page.evaluate(() => ({
  poseVersion: window.__childLightLab.rig.poseVersion,
  rootX: window.__childLightLab.rig.root.x,
}));
if (pausedAfter.poseVersion !== pausedBefore.poseVersion || Math.abs(pausedAfter.rootX - pausedBefore.rootX) > 0.01) {
  throw new Error('Pause did not freeze both local gait and world travel.');
}

if (errors.length) throw new Error(`Browser console errors:\n${errors.join('\n')}`);

console.log(JSON.stringify({
  status: 'ok',
  runtimePoseVersions: [runtimeBefore.rig.poseVersion, runtimeAfter.rig.poseVersion],
  inPlaceRootTravelPx: Math.round(rootTravel * 100) / 100,
  deterministicMaxHoofDeltaPx: Math.round(maxToeDelta * 100) / 100,
  deterministicHoofDeltasPx: toeDeltas.map((value) => Math.round(value * 100) / 100),
  clearlyMovingToes,
  throughSceneTravelPx: Math.round(worldTravel * 100) / 100,
}, null, 2));

await browser.close();
