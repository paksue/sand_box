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
    const attackPressed = api.getState();
    api.step(1);
    const attackPreImpact = api.getState();
    api.step(1);
    const attackImpact = api.getState();
    const attackEvents = api.getEvents();
    const impactTargetX = attackImpact.fighters.p2.x;
    const impactRecovery = attackImpact.fighters.p1.attackRecoveryTicks;
    const impactHitstun = attackImpact.fighters.p2.hitstunTicks;
    api.step(3);
    const attackFrozen = api.getState();
    api.step(1);
    const attackResumed = api.getState();

    api.loadScenario('rope');
    api.setInput('p1', { left: true });
    api.step(3);
    const ropeState = api.getState();
    const ropeEvents = api.getEvents();

    api.loadScenario('rope-hit');
    api.setInput('p1', { attack: true });
    api.step(1);
    api.setInput('p1', {});
    api.step(2);
    api.step(3);
    api.step(4);
    const ropeHitState = api.getState();
    const ropeHitEvents = api.getEvents();

    // Finish on the actual frozen impact frame for visual evidence.
    api.loadScenario('attack');
    api.setInput('p1', { attack: true });
    api.step(1);
    api.setInput('p1', {});
    api.step(2);

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
        pressed: attackPressed,
        preImpact: attackPreImpact,
        impact: attackImpact,
        frozen: attackFrozen,
        resumed: attackResumed,
        impactTargetX,
        impactRecovery,
        impactHitstun,
        hitSeen: attackEvents.some((event) => event.type === 'attack-hit'),
        hitstopSeen: attackEvents.some((event) => event.type === 'hitstop-start'),
      },
      rope: {
        state: ropeState,
        reboundSeen: ropeEvents.some((event) => event.type === 'rope-rebound'),
      },
      ropeHit: {
        state: ropeHitState,
        attackSeen: ropeHitEvents.some((event) => event.type === 'attack-hit'),
        hitstopSeen: ropeHitEvents.some((event) => event.type === 'hitstop-start'),
        reboundSeen: ropeHitEvents.some((event) => event.type === 'rope-rebound' && event.fighterId === 'p2'),
      },
    };
  });

  assert.equal(result.bridgeVersion, 3);
  assert.equal(result.movement.deltaX, 48);
  assert.equal(result.movement.end.tick, 12);

  assert.ok(result.collision.distance >= 40 - 1e-9);
  assert.equal(result.collision.eventSeen, true);

  assert.equal(result.attack.pressed.tick, 1);
  assert.equal(result.attack.pressed.fighters.p2.health, 100);
  assert.equal(result.attack.pressed.fighters.p1.attackStartupTicks, 2);
  assert.equal(result.attack.preImpact.tick, 2);
  assert.equal(result.attack.preImpact.fighters.p2.health, 100);
  assert.equal(result.attack.impact.tick, 3);
  assert.equal(result.attack.impact.fighters.p2.health, 90);
  assert.equal(result.attack.impact.hitstopTicks, 3);
  assert.ok(result.attack.impact.impact);
  assert.equal(result.attack.hitSeen, true);
  assert.equal(result.attack.hitstopSeen, true);

  assert.equal(result.attack.frozen.tick, 6);
  assert.equal(result.attack.frozen.hitstopTicks, 0);
  assert.equal(result.attack.frozen.fighters.p2.x, result.attack.impactTargetX);
  assert.equal(result.attack.frozen.fighters.p2.hitstunTicks, result.attack.impactHitstun);
  assert.equal(result.attack.frozen.fighters.p1.attackRecoveryTicks, result.attack.impactRecovery);

  assert.equal(result.attack.resumed.tick, 7);
  assert.equal(result.attack.resumed.fighters.p2.x, result.attack.impactTargetX + 10);
  assert.equal(result.attack.resumed.fighters.p2.hitstunTicks, result.attack.impactHitstun - 1);
  assert.equal(result.attack.resumed.fighters.p1.attackRecoveryTicks, result.attack.impactRecovery - 1);

  assert.equal(result.rope.state.fighters.p1.x, 20);
  assert.equal(result.rope.state.fighters.p1.state, 'rebound');
  assert.ok(result.rope.state.fighters.p1.vx > 0);
  assert.equal(result.rope.reboundSeen, true);

  assert.equal(result.ropeHit.state.fighters.p2.x, 780);
  assert.ok(result.ropeHit.state.fighters.p2.vx < 0);
  assert.equal(result.ropeHit.attackSeen, true);
  assert.equal(result.ropeHit.hitstopSeen, true);
  assert.equal(result.ropeHit.reboundSeen, true);

  assert.equal(report.consoleErrors.length, 0, `browser console errors: ${report.consoleErrors.join('; ')}`);

  report = { ...report, ...result, pass: true };
} catch (error) {
  report.error = error?.stack || String(error);
  process.exitCode = 1;
} finally {
  if (page) {
    try {
      await page.screenshot({ path: fileURLToPath(new URL('phase1-impact.png', outDir)), fullPage: true });
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
  attackImpactTick: report.attack?.impact?.tick,
  hitstopTicks: report.attack?.impact?.hitstopTicks,
  frozenTargetX: report.attack?.frozen?.fighters?.p2?.x,
  resumedTargetX: report.attack?.resumed?.fighters?.p2?.x,
  ropeHitVelocityX: report.ropeHit?.state?.fighters?.p2?.vx,
  error: report.error || null,
}, null, 2));
