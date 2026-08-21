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

    const movementStart = api.getState();
    api.setInput('p1', { right: true });
    api.step(12);
    api.setInput('p1', {});
    const movementEnd = api.getState();

    api.loadScenario('collision');
    api.setInput('p1', { right: true });
    api.setInput('p2', { left: true });
    api.step(12);
    const collisionState = api.getState();
    const collisionEvents = api.getEvents();
    const collisionDistance = Math.hypot(
      collisionState.fighters.p2.x - collisionState.fighters.p1.x,
      collisionState.fighters.p2.y - collisionState.fighters.p1.y,
    );

    api.loadScenario('attack');
    api.setInput('p1', { attack: true });
    api.step(1);
    api.setInput('p1', {});
    const attackState = api.getState();
    const attackEvents = api.getEvents();

    api.loadScenario('rope');
    api.setInput('p1', { left: true });
    api.step(3);
    const ropeState = api.getState();
    const ropeEvents = api.getEvents();

    api.loadScenario('rope-hit');
    api.setInput('p1', { attack: true });
    api.step(1);
    api.setInput('p1', {});
    api.step(4);
    const ropeHitState = api.getState();
    const ropeHitEvents = api.getEvents();

    // Leave Chromium on the most legible combat frame for the uploaded screenshot.
    api.loadScenario('attack');
    api.setInput('p1', { attack: true });
    api.step(1);
    api.setInput('p1', {});

    return {
      bridgeVersion: api.version,
      movement: {
        start: movementStart,
        end: movementEnd,
        deltaX: movementEnd.fighters.p1.x - movementStart.fighters.p1.x,
      },
      collision: {
        state: collisionState,
        distance: collisionDistance,
        eventSeen: collisionEvents.some((event) => event.type === 'body-collision'),
      },
      attack: {
        state: attackState,
        hitSeen: attackEvents.some((event) => event.type === 'attack-hit'),
        knockbackSeen: attackEvents.some((event) => event.type === 'knockback'),
      },
      rope: {
        state: ropeState,
        reboundSeen: ropeEvents.some((event) => event.type === 'rope-rebound'),
      },
      ropeHit: {
        state: ropeHitState,
        attackSeen: ropeHitEvents.some((event) => event.type === 'attack-hit'),
        reboundSeen: ropeHitEvents.some((event) => event.type === 'rope-rebound' && event.fighterId === 'p2'),
      },
    };
  });

  assert.equal(result.bridgeVersion, 2);
  assert.equal(result.movement.deltaX, 48);
  assert.equal(result.movement.end.tick, 12);

  assert.ok(result.collision.distance >= 40 - 1e-9);
  assert.equal(result.collision.eventSeen, true);

  assert.equal(result.attack.state.fighters.p2.health, 90);
  assert.equal(result.attack.state.fighters.p1.state, 'attack');
  assert.equal(result.attack.state.fighters.p2.state, 'hitstun');
  assert.ok(result.attack.state.fighters.p2.vx > 0);
  assert.equal(result.attack.hitSeen, true);
  assert.equal(result.attack.knockbackSeen, true);

  assert.equal(result.rope.state.fighters.p1.x, 20);
  assert.equal(result.rope.state.fighters.p1.state, 'rebound');
  assert.ok(result.rope.state.fighters.p1.vx > 0);
  assert.equal(result.rope.reboundSeen, true);

  assert.equal(result.ropeHit.state.fighters.p2.x, 780);
  assert.ok(result.ropeHit.state.fighters.p2.vx < 0);
  assert.equal(result.ropeHit.attackSeen, true);
  assert.equal(result.ropeHit.reboundSeen, true);

  assert.equal(report.consoleErrors.length, 0, `browser console errors: ${report.consoleErrors.join('; ')}`);

  report = { ...report, ...result, pass: true };
} catch (error) {
  report.error = error?.stack || String(error);
  process.exitCode = 1;
} finally {
  if (page) {
    try {
      await page.screenshot({ path: fileURLToPath(new URL('phase0-combat.png', outDir)), fullPage: true });
    } catch (error) {
      report.screenshotError = error?.message || String(error);
    }
  }

  await writeFile(new URL('playtest-report.json', outDir), `${JSON.stringify(report, null, 2)}\n`);
  if (browser) await browser.close();
}

console.log(JSON.stringify({
  pass: report.pass,
  movementDeltaX: report.movement?.deltaX,
  collisionDistance: report.collision?.distance,
  attackHealth: report.attack?.state?.fighters?.p2?.health,
  ropeVelocityX: report.rope?.state?.fighters?.p1?.vx,
  ropeHitVelocityX: report.ropeHit?.state?.fighters?.p2?.vx,
  error: report.error || null,
}, null, 2));
