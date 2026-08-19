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

const before = await page.evaluate(() => ({
  debug: window.__weightedRigLab.rig.getDebugState(),
  rootX: window.__weightedRigLab.rig.root.x,
  rootY: window.__weightedRigLab.rig.root.y,
}));
await page.waitForTimeout(750);
const after = await page.evaluate(() => ({
  debug: window.__weightedRigLab.rig.getDebugState(),
  rootX: window.__weightedRigLab.rig.root.x,
  rootY: window.__weightedRigLab.rig.root.y,
}));

if (after.debug.poseVersion <= before.debug.poseVersion) throw new Error('Weighted rig pose did not advance.');
const totalDelta = after.debug.vertices.reduce((sum, value, index) => sum + Math.abs(value - before.debug.vertices[index]), 0);
if (totalDelta < 1) throw new Error(`Weighted mesh did not deform enough: delta=${totalDelta}`);
if (after.debug.grid[0] !== 19 || after.debug.grid[1] !== 13) throw new Error(`Unexpected weighted mesh grid: ${after.debug.grid}`);

// Regression for the exact user-visible failure: the first version technically
// changed vertices while appearing stationary. Default travel must move the
// actor by an unmistakable number of screen pixels within 750 ms.
const travelPixels = Math.hypot(after.rootX - before.rootX, after.rootY - before.rootY);
if (travelPixels < 18) throw new Error(`Default locomotion is not visibly moving: ${travelPixels.toFixed(2)}px`);

await page.click('#playPause');

const poseA = await page.evaluate(() => {
  const lab = window.__weightedRigLab;
  lab.rig.updatePose(0);
  return {
    vertices: Array.from(lab.rig.mesh.vertices),
    scale: lab.rig.root.scale.x,
    skeleton: lab.rig.getDebugState().skeletonPoints,
  };
});
await page.waitForTimeout(80);
await page.screenshot({ path: path.join(outDir, 'weighted-scene-pose-a.png'), fullPage: true });

const poseB = await page.evaluate(() => {
  const lab = window.__weightedRigLab;
  lab.rig.updatePose(Math.PI * 0.72);
  return {
    vertices: Array.from(lab.rig.mesh.vertices),
    scale: lab.rig.root.scale.x,
    skeleton: lab.rig.getDebugState().skeletonPoints,
  };
});
await page.waitForTimeout(80);
await page.screenshot({ path: path.join(outDir, 'weighted-scene-pose-b.png'), fullPage: true });

let maxLocalVertexMotion = 0;
for (let i = 0; i < poseA.vertices.length; i += 2) {
  const dx = poseB.vertices[i] - poseA.vertices[i];
  const dy = poseB.vertices[i + 1] - poseA.vertices[i + 1];
  maxLocalVertexMotion = Math.max(maxLocalVertexMotion, Math.hypot(dx, dy));
}
const maxScreenVertexMotion = maxLocalVertexMotion * poseB.scale;
if (maxScreenVertexMotion < 3) {
  throw new Error(`Weighted gait is still effectively sub-pixel: max=${maxScreenVertexMotion.toFixed(2)}px`);
}

function skeletonMotion(a, b, key) {
  return Math.hypot(b[key].x - a[key].x, b[key].y - a[key].y) * poseB.scale;
}
const skeletonPixels = Math.max(
  skeletonMotion(poseA.skeleton, poseB.skeleton, 'frontMuzzle'),
  skeletonMotion(poseA.skeleton, poseB.skeleton, 'rearMuzzle'),
  skeletonMotion(poseA.skeleton, poseB.skeleton, 'foreFoot'),
  skeletonMotion(poseA.skeleton, poseB.skeleton, 'hindFoot'),
);
if (skeletonPixels < 3) throw new Error(`Skeleton debug endpoints appear static: ${skeletonPixels.toFixed(2)}px`);

await page.click('[data-view="neutral"]');
if (await page.getAttribute('#stage', 'data-view') !== 'neutral') throw new Error('Neutral view did not activate.');
await page.screenshot({ path: path.join(outDir, 'weighted-neutral.png'), fullPage: true });

await page.click('[data-view="skeleton"]');
const skeletonVisible = await page.evaluate(() => window.__weightedRigLab.rig.debugLayer.visible);
if (!skeletonVisible) throw new Error('Weighted skeleton debug view did not activate.');
await page.screenshot({ path: path.join(outDir, 'weighted-skeleton.png'), fullPage: true });

await page.click('[data-mode="baseline"]');
const visibility = await page.evaluate(() => ({
  rig: window.__weightedRigLab.rig.root.visible,
  baseline: window.__weightedRigLab.baseline.root.visible,
}));
if (visibility.rig || !visibility.baseline) throw new Error('Whole-mesh baseline toggle did not switch renderers.');
await page.click('[data-view="scene"]');
await page.evaluate(() => window.__weightedRigLab.baseline.updatePose(Math.PI * 0.72));
await page.screenshot({ path: path.join(outDir, 'baseline-scene.png'), fullPage: true });

const pausedBefore = await page.evaluate(() => ({
  poseVersion: window.__weightedRigLab.rig.poseVersion,
  rootX: window.__weightedRigLab.rig.root.x,
}));
await page.waitForTimeout(450);
const pausedAfter = await page.evaluate(() => ({
  poseVersion: window.__weightedRigLab.rig.poseVersion,
  rootX: window.__weightedRigLab.rig.root.x,
}));
if (pausedAfter.poseVersion !== pausedBefore.poseVersion) throw new Error('Pause did not freeze weighted rig automatic updates.');
if (Math.abs(pausedAfter.rootX - pausedBefore.rootX) > 0.1) throw new Error('Pause did not freeze viewport travel.');

if (errors.length) throw new Error(`Browser console errors:\n${errors.join('\n')}`);

console.log(JSON.stringify({
  status: 'ok',
  poseVersions: [before.debug.poseVersion, after.debug.poseVersion],
  weightedVertexDelta: Math.round(totalDelta * 100) / 100,
  defaultTravelPixels750ms: Math.round(travelPixels * 100) / 100,
  maxScreenVertexMotion: Math.round(maxScreenVertexMotion * 100) / 100,
  skeletonEndpointMotion: Math.round(skeletonPixels * 100) / 100,
  grid: after.debug.grid,
}, null, 2));

await browser.close();
