import { chromium } from 'playwright';
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

console.log(JSON.stringify({ status: 'ok', initial, contact, later }, null, 2));
await browser.close();
