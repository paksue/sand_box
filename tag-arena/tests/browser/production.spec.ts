import { mkdir, writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const evidenceDir = new URL('../../test-results/', import.meta.url);

test('Pixi production runtime preserves verified Phase 1 behavior', async ({ page }) => {
  await mkdir(evidenceDir, { recursive: true });
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', (error) => consoleErrors.push(error.message));

  await page.goto('/?debug=1&manual=1&seed=48129', { waitUntil: 'networkidle' });
  await page.waitForFunction(() => Boolean(window.__TAG_ARENA__));

  const result = await page.evaluate(() => {
    const api = window.__TAG_ARENA__!;

    const movementStart = api.getState();
    api.setInput('p1', { right: true });
    api.step(12);
    api.setInput('p1', {});
    const movementEnd = api.getState();

    api.loadScenario('collision');
    api.setInput('p1', { right: true });
    api.setInput('p2', { left: true });
    api.step(12);
    const collision = api.getState();
    const collisionDistance = Math.hypot(
      collision.fighters.p2.x - collision.fighters.p1.x,
      collision.fighters.p2.y - collision.fighters.p1.y,
    );

    api.loadScenario('attack');
    api.setInput('p1', { attack: true });
    const attackTick1 = api.step(1);
    api.setInput('p1', {});
    const attackTick2 = api.step(1);
    const impactTick3 = api.step(1);
    const frozenThroughTick6 = api.step(3);
    const resumedTick7 = api.step(1);

    api.loadScenario('rope-hit');
    api.setInput('p1', { attack: true });
    api.step(3);
    api.setInput('p1', {});
    api.step(3);
    const ropeHit = api.step(4);
    const ropeHitEvents = api.getEvents();

    // Leave the screenshot on the exact impact frame.
    api.loadScenario('attack');
    api.setInput('p1', { attack: true });
    api.step(3);
    api.setInput('p1', {});

    return {
      bridgeVersion: api.version,
      renderer: api.renderer,
      movementDeltaX: movementEnd.fighters.p1.x - movementStart.fighters.p1.x,
      collisionDistance,
      attackTick1,
      attackTick2,
      impactTick3,
      frozenThroughTick6,
      resumedTick7,
      ropeHit,
      ropeHitReboundSeen: ropeHitEvents.some(
        (event) => event.type === 'rope-rebound' && event.fighterId === 'p2',
      ),
      canvasCount: document.querySelectorAll('canvas').length,
      legacyCanvasControllerLoaded: Boolean(document.querySelector('script[src*="app.js"]')),
    };
  });

  expect(result.bridgeVersion).toBe(4);
  expect(result.renderer).toBe('pixi-v8-webgl');
  expect(result.canvasCount).toBe(1);
  expect(result.legacyCanvasControllerLoaded).toBe(false);
  expect(result.movementDeltaX).toBe(48);
  expect(result.collisionDistance).toBeCloseTo(40, 9);

  expect(result.attackTick1.fighters.p2.health).toBe(100);
  expect(result.attackTick1.fighters.p1.attackStartupTicks).toBe(2);
  expect(result.attackTick2.fighters.p2.health).toBe(100);
  expect(result.attackTick2.fighters.p1.attackStartupTicks).toBe(1);
  expect(result.impactTick3.fighters.p2.health).toBe(90);
  expect(result.impactTick3.hitstopTicks).toBe(3);
  expect(result.impactTick3.fighters.p2.x).toBe(400);

  expect(result.frozenThroughTick6.fighters.p2.x).toBe(400);
  expect(result.frozenThroughTick6.fighters.p2.hitstunTicks).toBe(result.impactTick3.fighters.p2.hitstunTicks);
  expect(result.frozenThroughTick6.fighters.p1.attackRecoveryTicks).toBe(result.impactTick3.fighters.p1.attackRecoveryTicks);
  expect(result.resumedTick7.fighters.p2.x).toBe(410);

  expect(result.ropeHit.fighters.p2.x).toBe(780);
  expect(result.ropeHit.fighters.p2.vx).toBeCloseTo(-3.3909132, 7);
  expect(result.ropeHitReboundSeen).toBe(true);
  expect(consoleErrors).toEqual([]);

  await page.screenshot({ path: new URL('production-stack-impact.png', evidenceDir).pathname, fullPage: true });
  await writeFile(
    new URL('production-stack-report.json', evidenceDir),
    `${JSON.stringify({ pass: true, consoleErrors, ...result }, null, 2)}\n`,
  );
});
