import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE_URL = process.env.FRONTIER_URL || 'http://127.0.0.1:4173/';
const outDir = path.resolve('frontier-journey/test-results-visual-lab');
await fs.mkdir(outDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 1560, height: 1080 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const response = await page.goto(new URL('visual-lab.html', BASE_URL).href, { waitUntil: 'networkidle', timeout: 90000 });
  assert(response?.ok(), `Visual lab failed to load: ${response?.status()}`);
  await page.waitForFunction(() => window.frontierVisualLab?.ready === true, null, { timeout: 60000 });
  await page.waitForSelector('#babylonCanvas', { state: 'visible' });
  await page.waitForSelector('#pixiLab canvas', { state: 'visible' });

  const start = await page.evaluate(() => ({ state: window.frontierVisualLab.state, metrics: window.frontierVisualLab.getMetrics() }));
  assert(start.metrics.optionA.backend, 'Option A backend not reported');
  assert(start.metrics.optionB.backend, 'Option B backend not reported');

  await page.waitForTimeout(450);
  const moving = await page.evaluate(() => window.frontierVisualLab.state.elapsed);
  assert(moving > start.state.elapsed, 'Shared visual clock did not advance');

  await page.click('#pauseButton');
  const pausedAt = await page.evaluate(() => window.frontierVisualLab.state.elapsed);
  await page.waitForTimeout(280);
  const pausedAfter = await page.evaluate(() => window.frontierVisualLab.state.elapsed);
  assert(Math.abs(pausedAfter - pausedAt) < 0.02, `Pause did not freeze shared clock (${pausedAt} -> ${pausedAfter})`);

  await page.selectOption('#timeSelect', 'dusk');
  await page.selectOption('#weatherSelect', 'storm');
  await page.evaluate(() => window.frontierVisualLab.setState({ elapsed: 7.25, paused: true, wind: 0.72, atmosphere: 0.8 }));
  await page.waitForTimeout(200);
  const deterministic = await page.evaluate(() => window.frontierVisualLab.state);
  assert(deterministic.timeOfDay === 'dusk' && deterministic.weather === 'storm', 'Shared state controls did not propagate');

  await page.click('#blinkButton');
  await page.waitForSelector('#blinkDeck:not(.hidden)');
  await page.click('#blinkB');
  const blink = await page.evaluate(() => window.frontierVisualLab.blinkSide);
  assert(blink === 'b', 'Blink compare did not switch to option B');
  await page.click('#blinkExit');

  await page.evaluate(() => window.frontierVisualLab.setState({ source: 'bierstadt', timeOfDay: 'golden', weather: 'clear', elapsed: 12.5, paused: true, wind: 0.45, atmosphere: 0.68, travelSpeed: 1 }));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, 'visual-lab-ab.png'), fullPage: true });

  await page.setViewportSize({ width: 920, height: 980 });
  await page.evaluate(() => window.frontierVisualLab.resize());
  await page.waitForTimeout(250);
  const narrow = await page.evaluate(() => {
    const a = document.querySelector('#babylonCanvas').getBoundingClientRect();
    const b = document.querySelector('#pixiLab canvas').getBoundingClientRect();
    return { a: { width: a.width, height: a.height }, b: { width: b.width, height: b.height } };
  });
  assert(narrow.a.width > 300 && narrow.a.height > 300, `Option A collapsed at narrow width: ${JSON.stringify(narrow.a)}`);
  assert(narrow.b.width > 300 && narrow.b.height > 300, `Option B collapsed at narrow width: ${JSON.stringify(narrow.b)}`);

  assert(pageErrors.length === 0, `Page errors: ${pageErrors.join('; ')}`);
  assert(consoleErrors.length === 0, `Console errors: ${consoleErrors.join('; ')}`);

  const result = { status: 'pass', start, deterministic, narrow, finalMetrics: await page.evaluate(() => window.frontierVisualLab.getMetrics()) };
  await fs.writeFile(path.join(outDir, 'summary.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await context.close();
} finally {
  await browser.close();
}
