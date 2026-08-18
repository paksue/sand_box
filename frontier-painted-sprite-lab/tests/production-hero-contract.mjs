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

const runtimeDir = path.join(root, 'assets/frontier-hero/runtime');
const runtimeFiles = ['frontier-hero.skel', 'frontier-hero.atlas', 'frontier-hero.png'];
const runtimePresent = (await Promise.all(runtimeFiles.map(async (name) => {
  try { await fs.access(path.join(runtimeDir, name)); return true; }
  catch { return false; }
}))).every(Boolean);

if (Boolean(manifest.runtime.productionReady) !== runtimePresent) {
  throw new Error(`productionReady=${manifest.runtime.productionReady} does not match actual runtime package presence=${runtimePresent}.`);
}

const base = process.env.PAINTED_SPRITE_URL || 'http://127.0.0.1:4175/';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

await page.goto(new URL('production-hero.html', base).toString(), { waitUntil: 'networkidle', timeout: 60_000 });

let state;
if (!runtimePresent) {
  await page.waitForFunction(() => document.querySelector('#productionHeroStage')?.dataset.ready === 'blocked', null, { timeout: 10_000 });
  state = await page.evaluate(() => ({
    ready: document.querySelector('#productionHeroStage')?.dataset.ready,
    label: document.querySelector('#productionState')?.textContent,
    message: document.querySelector('#productionMessage')?.textContent,
  }));
  if (!state.label?.includes('production export required')) throw new Error(`Unexpected production state: ${state.label}`);
  if (!state.message?.includes('Missing real Spine export')) throw new Error(`Missing export diagnostic not shown: ${state.message}`);
} else {
  await page.waitForFunction(() => document.querySelector('#productionHeroStage')?.dataset.ready === 'true' && window.productionHeroPOC, null, { timeout: 15_000 });
  state = await page.evaluate(() => window.productionHeroPOC.snapshot());
  if (!state.spineObject) throw new Error('Runtime package loaded without a real SpineGameObject.');
  if (state.renderer !== 'phaser/Mesh2D') throw new Error(`Unexpected renderer: ${state.renderer}`);
  if (state.ikCount < manifest.rig.requiredIK.length) throw new Error(`Expected >=${manifest.rig.requiredIK.length} IK constraints, got ${state.ikCount}`);
  for (const name of manifest.rig.requiredBones) {
    if (!state.boneNames.includes(name)) throw new Error(`Exported skeleton missing bone: ${name}`);
  }
  for (const name of manifest.rig.requiredIK) {
    if (!state.ikNames.includes(name)) throw new Error(`Exported skeleton missing IK: ${name}`);
  }
  for (const name of manifest.animations.required) {
    if (!state.animations.includes(name)) throw new Error(`Exported skeleton missing animation: ${name}`);
  }

  await page.evaluate(() => window.productionHeroPOC.play('walk'));
  await page.waitForTimeout(350);
  const walk = await page.evaluate(() => window.productionHeroPOC.snapshot());
  if (walk.clip !== 'walk' || walk.trackTime <= 0) throw new Error(`Walk AnimationState did not advance: ${JSON.stringify(walk)}`);

  await page.evaluate(() => { window.productionHeroPOC.setSpeed(0.25); window.productionHeroPOC.play('land_step'); });
  await page.waitForTimeout(800);
  const slow = await page.evaluate(() => window.productionHeroPOC.snapshot());
  if (slow.speed !== 0.25 || slow.clip !== 'land_step') throw new Error(`Slow-motion QA path failed: ${JSON.stringify(slow)}`);
}

if (errors.length) throw new Error(`Browser errors:\n${errors.join('\n')}`);

console.log(JSON.stringify({
  status: 'ok',
  productionReady: manifest.runtime.productionReady,
  runtimePresent,
  requiredLayers: manifest.requiredLayers.length,
  requiredBones: manifest.rig.requiredBones.length,
  requiredIK: manifest.rig.requiredIK.length,
  requiredAnimations: manifest.animations.required,
  rendererBackend: manifest.runtime.rendererBackend,
  pageState: state.ready,
}, null, 2));

await browser.close();
