import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const base = process.env.PAINTED_SPRITE_URL || 'http://127.0.0.1:4175/';
const outDir = path.resolve('frontier-painted-sprite-lab/test-results');
await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1500, height: 980 }, deviceScaleFactor: 1 });
const errors = [];
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text());
});
page.on('pageerror', (error) => errors.push(error.message));

await page.goto(base, { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForFunction(() => Boolean(window.__paintedSpriteLab?.ox?.mesh), null, { timeout: 30_000 });

const before = await page.evaluate(() => ({
  poseVersion: window.__paintedSpriteLab.ox.poseVersion,
  vertices: Array.from(window.__paintedSpriteLab.ox.mesh.vertices),
  backend: document.querySelector('#rendererMetric').textContent,
}));

await page.waitForTimeout(700);
const after = await page.evaluate(() => ({
  poseVersion: window.__paintedSpriteLab.ox.poseVersion,
  vertices: Array.from(window.__paintedSpriteLab.ox.mesh.vertices),
}));

if (after.poseVersion <= before.poseVersion) throw new Error('Painterly mesh pose did not advance.');
const totalVertexDelta = after.vertices.reduce((sum, value, index) => sum + Math.abs(value - before.vertices[index]), 0);
if (totalVertexDelta < 1) throw new Error(`Mesh vertices did not deform enough; total delta=${totalVertexDelta}.`);
if (!/PixiJS 8\.19/.test(before.backend)) throw new Error(`Unexpected renderer label: ${before.backend}`);

await page.click('[data-view="neutral"]');
if (await page.getAttribute('#stage', 'data-view') !== 'neutral') throw new Error('Neutral view did not activate.');

await page.click('[data-view="mesh"]');
const debugVisible = await page.evaluate(() => window.__paintedSpriteLab.ox.debugLayer.visible);
if (!debugVisible) throw new Error('Mesh debug view did not become visible.');

await page.click('[data-view="scene"]');
await page.click('#playPause');
const pausedVersion = await page.evaluate(() => window.__paintedSpriteLab.ox.poseVersion);
await page.waitForTimeout(500);
const pausedVersionAfter = await page.evaluate(() => window.__paintedSpriteLab.ox.poseVersion);
if (pausedVersionAfter !== pausedVersion) throw new Error('Pause did not freeze pose updates.');
await page.click('#playPause');

await page.screenshot({ path: path.join(outDir, 'living-ox-scene.png'), fullPage: true });

if (errors.length) {
  throw new Error(`Browser console errors:\n${errors.join('\n')}`);
}

console.log(JSON.stringify({
  status: 'ok',
  backend: before.backend,
  poseVersions: [before.poseVersion, after.poseVersion],
  totalVertexDelta: Math.round(totalVertexDelta * 100) / 100,
}, null, 2));
await browser.close();
