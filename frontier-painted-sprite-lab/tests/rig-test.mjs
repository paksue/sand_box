import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.PAINTED_SPRITE_URL || 'http://127.0.0.1:4175/';
const outDir = path.resolve('frontier-painted-sprite-lab/test-results-rig');
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 1000 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', (error) => errors.push(error.message));

await page.goto(new URL('rig-test.html', base).toString(), { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForFunction(() => Boolean(window.__weightedRigLab?.rig?.ready), null, { timeout: 30_000 });

const before = await page.evaluate(() => window.__weightedRigLab.rig.getDebugState());
await page.waitForTimeout(750);
const after = await page.evaluate(() => window.__weightedRigLab.rig.getDebugState());

if (after.poseVersion <= before.poseVersion) throw new Error('Weighted rig pose did not advance.');
if (Math.abs(after.frontPhase - after.backPhase) < 0.2) throw new Error('Two oxen are not independently phased.');

const frontDelta = after.frontVertices.reduce((sum, value, index) => sum + Math.abs(value - before.frontVertices[index]), 0);
const backDelta = after.backVertices.reduce((sum, value, index) => sum + Math.abs(value - before.backVertices[index]), 0);
if (frontDelta < 1 || backDelta < 1) throw new Error(`Weighted meshes did not deform enough: front=${frontDelta}, back=${backDelta}`);

await page.click('#playPause');
await page.evaluate(() => window.__weightedRigLab.rig.updatePose(0));
await page.screenshot({ path: path.join(outDir, 'weighted-scene-pose-a.png'), fullPage: true });
await page.evaluate(() => window.__weightedRigLab.rig.updatePose(Math.PI * 0.72));
await page.screenshot({ path: path.join(outDir, 'weighted-scene-pose-b.png'), fullPage: true });

await page.click('[data-view="neutral"]');
if (await page.getAttribute('#stage', 'data-view') !== 'neutral') throw new Error('Neutral view did not activate.');
await page.screenshot({ path: path.join(outDir, 'weighted-neutral.png'), fullPage: true });

await page.click('[data-view="skeleton"]');
const skeletonVisible = await page.evaluate(() => ({
  front: window.__weightedRigLab.rig.frontOx.debugLayer.visible,
  back: window.__weightedRigLab.rig.backOx.debugLayer.visible,
}));
if (!skeletonVisible.front || !skeletonVisible.back) throw new Error('Weighted skeleton debug view did not activate for both oxen.');
await page.screenshot({ path: path.join(outDir, 'weighted-skeleton.png'), fullPage: true });

await page.click('[data-mode="baseline"]');
const visibility = await page.evaluate(() => ({
  rig: window.__weightedRigLab.rig.root.visible,
  baseline: window.__weightedRigLab.baseline.root.visible,
}));
if (visibility.rig || !visibility.baseline) throw new Error('Whole-mesh baseline toggle did not switch renderers.');
await page.click('[data-view="scene"]');
await page.screenshot({ path: path.join(outDir, 'baseline-scene.png'), fullPage: true });

const pausedBefore = await page.evaluate(() => window.__weightedRigLab.rig.poseVersion);
await page.waitForTimeout(450);
const pausedAfter = await page.evaluate(() => window.__weightedRigLab.rig.poseVersion);
if (pausedAfter !== pausedBefore) throw new Error('Pause did not freeze weighted rig automatic updates.');

if (errors.length) throw new Error(`Browser console errors:\n${errors.join('\n')}`);

console.log(JSON.stringify({
  status: 'ok',
  poseVersions: [before.poseVersion, after.poseVersion],
  phaseOffset: Math.round(after.phaseOffset * 1000) / 1000,
  frontVertexDelta: Math.round(frontDelta * 100) / 100,
  backVertexDelta: Math.round(backDelta * 100) / 100,
}, null, 2));

await browser.close();
