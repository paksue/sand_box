import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('frontier-painted-sprite-lab');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'assets/frontier-hero/manifest.json'), 'utf8'));
const rig = JSON.parse(await fs.readFile(path.join(root, 'assets/frontier-hero/source/frontier-hero-rig-template.json'), 'utf8'));

if (manifest.runtime.phaser !== '4.2.1') throw new Error(`Unexpected Phaser contract: ${manifest.runtime.phaser}`);
if (!manifest.runtime.spineRuntime.includes('4.3.11')) throw new Error(`Unexpected Spine runtime contract: ${manifest.runtime.spineRuntime}`);
if (manifest.runtime.rendererBackend !== 'phaser/Mesh2D') throw new Error('Production renderer must be Phaser Mesh2D backend.');
if (manifest.runtime.loader.join(',') !== 'spineSkeleton,spineAtlas') throw new Error(`Unexpected loader contract: ${manifest.runtime.loader}`);
if (manifest.runtime.productionReady !== false) throw new Error('Production must remain blocked until the real Spine export is present.');

const boneNames = new Set((rig.bones || []).map((b) => b.name));
for (const name of manifest.rig.requiredBones) {
  if (!boneNames.has(name)) throw new Error(`Rig template missing required bone: ${name}`);
}

const ikNames = new Set((rig.ik || []).map((ik) => ik.name));
for (const name of manifest.rig.requiredIK) {
  if (!ikNames.has(name)) throw new Error(`Rig template missing required IK constraint: ${name}`);
}

const clips = new Set(Object.keys(rig.animations || {}));
for (const name of manifest.animations.required) {
  if (!clips.has(name)) throw new Error(`Rig template missing required animation: ${name}`);
}

const eventNames = new Set(Object.keys(rig.events || {}));
for (const name of manifest.animations.events) {
  if (!eventNames.has(name)) throw new Error(`Rig template missing required event: ${name}`);
}

const base = process.env.PAINTED_SPRITE_URL || 'http://127.0.0.1:4175/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

await page.goto(new URL('production-hero.html', base).toString(), { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForFunction(() => document.querySelector('#productionHeroStage')?.dataset.ready === 'blocked', null, { timeout: 10_000 });
const state = await page.evaluate(() => ({
  ready: document.querySelector('#productionHeroStage')?.dataset.ready,
  label: document.querySelector('#productionState')?.textContent,
  message: document.querySelector('#productionMessage')?.textContent,
}));

if (state.ready !== 'blocked') throw new Error(`Expected blocked production boundary, got ${state.ready}`);
if (!state.label?.includes('production export required')) throw new Error(`Unexpected production state: ${state.label}`);
if (!state.message?.includes('Missing real Spine export')) throw new Error(`Missing export diagnostic not shown: ${state.message}`);
if (errors.length) throw new Error(`Browser errors:\n${errors.join('\n')}`);

console.log(JSON.stringify({
  status: 'ok',
  productionReady: manifest.runtime.productionReady,
  requiredLayers: manifest.requiredLayers.length,
  requiredBones: manifest.rig.requiredBones.length,
  requiredIK: manifest.rig.requiredIK.length,
  requiredAnimations: manifest.animations.required,
  rendererBackend: manifest.runtime.rendererBackend,
  pageState: state.ready,
}, null, 2));

await browser.close();
