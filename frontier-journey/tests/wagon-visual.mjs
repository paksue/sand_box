import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const BASE_URL = process.env.FRONTIER_URL || 'http://127.0.0.1:4173/';
const outDir = new URL('../test-results-wagon/', import.meta.url);
await fs.mkdir(outDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function center(bounds) {
  return { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 920, height: 780 } });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });

  const response = await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  assert(response?.ok(), `Game failed to load: ${BASE_URL}`);
  await page.waitForFunction(() => window.frontierVisualFix?.installed === true);

  await page.click('#startButton');
  await page.waitForSelector('#gameScreen:not(.hidden)');
  await page.waitForSelector('#pixiScene canvas', { state: 'visible' });
  await page.waitForTimeout(150);

  const initial = await page.evaluate(() => window.frontierVisualFix.getSnapshot());
  assert(initial.ox, 'Ox bounds were not exposed by the repaired scene');
  assert(initial.root.scaleX > 0 && initial.root.scaleX <= 1, `Unexpected scene scale ${initial.root.scaleX}`);

  for (const [name, bounds] of [['wheel1', initial.wheel1], ['wheel2', initial.wheel2], ['ox', initial.ox]]) {
    assert(bounds.x >= -2, `${name} is clipped off the left side: x=${bounds.x}`);
    assert(bounds.y >= -2, `${name} is clipped off the top: y=${bounds.y}`);
    assert(bounds.x + bounds.width <= initial.renderer.width + 2, `${name} is clipped off the right side: right=${bounds.x + bounds.width}, renderer=${initial.renderer.width}`);
    assert(bounds.y + bounds.height <= initial.renderer.height + 2, `${name} is clipped off the bottom: bottom=${bounds.y + bounds.height}, renderer=${initial.renderer.height}`);
  }

  // When stopped, the old ticker must no longer make the scenery/wheels drift.
  const stoppedA = center(initial.wheel1);
  await page.waitForTimeout(250);
  const stoppedB = center((await page.evaluate(() => window.frontierVisualFix.getSnapshot())).wheel1);
  assert(distance(stoppedA, stoppedB) < 1.5, `Wheel drifted while stopped by ${distance(stoppedA, stoppedB).toFixed(2)} px`);

  await page.click('.action-panel button[data-action="continue"]');
  await page.waitForFunction(() => window.frontierAutoTravel?.active === true);

  const movingA = await page.evaluate(() => ({
    snapshot: window.frontierVisualFix.getSnapshot(),
    rotation: scene.wheel1.rotation,
  }));
  await page.waitForTimeout(220);
  const movingB = await page.evaluate(() => ({
    snapshot: window.frontierVisualFix.getSnapshot(),
    rotation: scene.wheel1.rotation,
  }));

  assert(Math.abs(movingB.rotation - movingA.rotation) > 0.01, 'Wheel did not rotate during travel');
  const movingCenterA = center(movingA.snapshot.wheel1);
  const movingCenterB = center(movingB.snapshot.wheel1);
  assert(distance(movingCenterA, movingCenterB) < 5, `Wheel center orbited during rotation by ${distance(movingCenterA, movingCenterB).toFixed(2)} px`);

  // Stop manually and verify the scene settles again.
  await page.click('.action-panel button[data-action="continue"]');
  await page.waitForFunction(() => window.frontierAutoTravel?.active === false);
  await page.waitForTimeout(100);
  const final = await page.evaluate(() => window.frontierVisualFix.getSnapshot());
  assert(Math.abs(final.wheel1.y - initial.wheel1.y) < 2, 'Wheel did not return to its stopped wagon position');

  await page.screenshot({ path: new URL('./wagon-fixed.png', outDir), fullPage: true });

  assert(pageErrors.length === 0, `Page errors: ${pageErrors.join('; ')}`);
  assert(consoleErrors.length === 0, `Console errors: ${consoleErrors.join('; ')}`);

  const result = { status: 'pass', initial, movingA, movingB, final };
  console.log(JSON.stringify(result, null, 2));
  await fs.writeFile(new URL('./summary.json', outDir), JSON.stringify(result, null, 2));
  await context.close();
} finally {
  await browser.close();
}
