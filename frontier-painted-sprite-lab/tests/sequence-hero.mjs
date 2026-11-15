import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import fs from 'node:fs/promises';

const base = process.env.PAINTED_SPRITE_URL || 'http://127.0.0.1:4175/';
await fs.mkdir('frontier-painted-sprite-lab/test-results-sequence', { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });

await page.goto(new URL('sequence-hero.html', base).toString(), { waitUntil: 'networkidle', timeout: 60_000 });
await page.waitForFunction(() => document.querySelector('#sequenceHeroStage')?.dataset.ready === 'true' && window.sequenceHeroPOC, null, { timeout: 15_000 });

const initial = await page.evaluate(() => window.sequenceHeroPOC.snapshot());
if (!initial.spineObject) throw new Error('Painted sequence did not create a real Spine object.');
for (const name of ['idle_alive', 'walk', 'land_step', 'rear_action']) {
  if (!initial.animations.includes(name)) throw new Error(`Missing animation ${name}`);
}
if (initial.boneCount !== 34) throw new Error(`Expected 34-bone production topology, got ${initial.boneCount}`);
if (initial.ikCount !== 4) throw new Error(`Expected four hoof IK constraints, got ${initial.ikCount}`);
for (const name of ['front_near_leg_ik', 'front_far_leg_ik', 'hind_near_leg_ik', 'hind_far_leg_ik']) {
  if (!initial.ikNames.includes(name)) throw new Error(`Missing IK constraint ${name}`);
}

// Prove walk now changes the visible painted horse pose while all four IK targets participate underneath.
await page.evaluate(() => { window.sequenceHeroPOC.setSpeed(1); window.sequenceHeroPOC.play('walk'); });
await page.waitForTimeout(70);
const walkA = await page.evaluate(() => window.sequenceHeroPOC.snapshot());
await page.waitForTimeout(310);
const walkB = await page.evaluate(() => window.sequenceHeroPOC.snapshot());
const targetNames = ['front_near_ik', 'front_far_ik', 'hind_near_ik', 'hind_far_ik'];
const gaitDelta = targetNames.reduce((sum, name) => {
  const a = walkA.ikTargets[name];
  const b = walkB.ikTargets[name];
  if (!a || !b) throw new Error(`Missing IK target telemetry for ${name}`);
  return sum + Math.hypot(b.x - a.x, b.y - a.y);
}, 0);
if (gaitDelta < 10) throw new Error(`Four-hoof gait targets barely moved: ${gaitDelta.toFixed(2)}`);
if (!walkB.gaitPhase || walkB.gaitPhase === '—') throw new Error(`Walk gait phase events did not fire: ${JSON.stringify(walkB)}`);
if (!walkA.attachment?.startsWith('gait_')) throw new Error(`Walk A is not a painted gait attachment: ${walkA.attachment}`);
if (!walkB.attachment?.startsWith('gait_')) throw new Error(`Walk B is not a painted gait attachment: ${walkB.attachment}`);
if (walkA.attachment === walkB.attachment) throw new Error(`Visible horse pose did not change across gait: ${walkA.attachment}`);

// Render QA: state/attachment tests alone once allowed a broken atlas to pass while the actor rendered as an opaque black quad.
const canvasDataUrl = await page.evaluate(() => document.querySelector('#sequenceHeroMount canvas')?.toDataURL('image/png') || null);
if (!canvasDataUrl) throw new Error('Unable to capture Spine canvas for pixel QA.');
const canvasPng = PNG.sync.read(Buffer.from(canvasDataUrl.split(',')[1], 'base64'));
let opaque = 0;
let luminance = 0;
for (let i = 0; i < canvasPng.data.length; i += 4) {
  const a = canvasPng.data[i + 3];
  if (a > 24) {
    opaque += 1;
    luminance += 0.2126 * canvasPng.data[i] + 0.7152 * canvasPng.data[i + 1] + 0.0722 * canvasPng.data[i + 2];
  }
}
const totalPixels = canvasPng.width * canvasPng.height;
const opaqueRatio = opaque / totalPixels;
const meanOpaqueLuminance = opaque ? luminance / opaque : 0;
if (opaqueRatio < 0.01) throw new Error(`Gait actor is effectively blank: opaqueRatio=${opaqueRatio.toFixed(4)}`);
if (opaqueRatio > 0.28) throw new Error(`Gait actor rendered as an oversized opaque quad: opaqueRatio=${opaqueRatio.toFixed(4)}`);
if (meanOpaqueLuminance < 18) throw new Error(`Gait actor pixels are effectively black: luminance=${meanOpaqueLuminance.toFixed(2)}`);

await page.screenshot({ path: 'frontier-painted-sprite-lab/test-results-sequence/sequence-walk-gait.png', fullPage: true });

// Preserve the painted corrective-pose landing benchmark and inspect it in slow motion.
await page.evaluate(() => { window.sequenceHeroPOC.setSpeed(.25); window.sequenceHeroPOC.play('land_step'); });
await page.waitForTimeout(1000);
const contact = await page.evaluate(() => window.sequenceHeroPOC.snapshot());
await page.screenshot({ path: 'frontier-painted-sprite-lab/test-results-sequence/sequence-contact.png', fullPage: true });
await page.waitForTimeout(1000);
const later = await page.evaluate(() => window.sequenceHeroPOC.snapshot());
await page.screenshot({ path: 'frontier-painted-sprite-lab/test-results-sequence/sequence-later.png', fullPage: true });

if (contact.clip !== 'land_step' || contact.trackTime <= 0) throw new Error(`Land-step did not advance: ${JSON.stringify(contact)}`);
if (later.trackTime <= contact.trackTime) throw new Error('Land-step timeline did not continue.');
if (!later.attachment?.startsWith('land_')) throw new Error(`Expected painted land attachment, got ${later.attachment}`);
if (errors.length) throw new Error(`Browser errors:\n${errors.join('\n')}`);

console.log(JSON.stringify({
  status: 'ok',
  initial,
  gaitDelta: Number(gaitDelta.toFixed(2)),
  opaqueRatio: Number(opaqueRatio.toFixed(4)),
  meanOpaqueLuminance: Number(meanOpaqueLuminance.toFixed(2)),
  walkA,
  walkB,
  contact,
  later
}, null, 2));
await browser.close();