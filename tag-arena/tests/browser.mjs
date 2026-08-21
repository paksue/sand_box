import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const baseUrl = process.env.TAG_ARENA_URL || 'http://127.0.0.1:4178/';
const outDir = new URL('../test-results/', import.meta.url);
await mkdir(outDir, { recursive: true });

let browser;
let page;
let report = {
  pass: false,
  url: baseUrl,
  testedAt: new Date().toISOString(),
  consoleErrors: [],
};

try {
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage({ viewport: { width: 1100, height: 760 } });

  page.on('console', (message) => {
    if (message.type() === 'error') report.consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => report.consoleErrors.push(error.message));

  await page.goto(`${baseUrl}?debug=1&manual=1&seed=48129`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Boolean(window.__TAG_ARENA__));

  const result = await page.evaluate(() => {
    const api = window.__TAG_ARENA__;
    const start = api.getState();
    api.setInput('p1', { right: true });
    api.step(12);
    api.setInput('p1', {});
    const end = api.getState();

    return {
      bridgeVersion: api.version,
      start,
      end,
      deltaX: end.fighters.p1.x - start.fighters.p1.x,
      events: api.getEvents().slice(-12),
    };
  });

  assert.equal(result.bridgeVersion, 1);
  assert.equal(result.deltaX, 48);
  assert.equal(result.end.tick, 12);
  assert.equal(report.consoleErrors.length, 0, `browser console errors: ${report.consoleErrors.join('; ')}`);

  report = { ...report, ...result, pass: true };
} catch (error) {
  report.error = error?.stack || String(error);
  process.exitCode = 1;
} finally {
  if (page) {
    try {
      await page.screenshot({ path: fileURLToPath(new URL('harness.png', outDir)), fullPage: true });
    } catch (error) {
      report.screenshotError = error?.message || String(error);
    }
  }

  await writeFile(new URL('playtest-report.json', outDir), `${JSON.stringify(report, null, 2)}\n`);
  if (browser) await browser.close();
}

console.log(JSON.stringify({ pass: report.pass, deltaX: report.deltaX, error: report.error || null }, null, 2));
