import { mkdir, writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const evidenceDir = new URL('../../test-results/', import.meta.url);

test('Pixi production runtime preserves Phase 1 and verifies contextual grapple', async ({ page }) => {
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

    // Preserve the previously verified Phase 1 measurements.
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

    // Phase 2 contextual grapple: one Action press at body contact.
    api.loadScenario('grapple');
    api.setInput('p1', { attack: true });
    const grappleStarted = api.step(1);
    api.setInput('p1', { down: true });
    const grappleDirected = api.step(1);
    api.setInput('p1', {});
    const throwImpact = api.step(5);
    const throwEvents = api.getEvents();
    const throwFrozen = api.step(4);
    const throwResumed = api.step(1);

    // The same throw momentum must use the existing rope path.
    api.loadScenario('grapple-rope');
    api.setInput('p1', { attack: true });
    api.step(1);
    api.setInput('p1', {});
    api.step(6);
    api.step(4);
    const grappleRope = api.step(2);
    const grappleRopeEvents = api.getEvents();

    // Simultaneous close-range Action presses must not privilege one player.
    api.loadScenario('grapple');
    api.setInput('p1', { attack: true });
    api.setInput('p2', { attack: true });
    const simultaneous = api.step(1);
    const simultaneousEvents = api.getEvents();

    // Leave the screenshot on the exact default-direction throw impact frame.
    api.loadScenario('grapple');
    api.setInput('p1', { attack: true });
    api.step(1);
    api.setInput('p1', {});
    const screenshotState = api.step(6);

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
      grappleStarted,
      grappleDirected,
      throwImpact,
      throwFrozen,
      throwResumed,
      throwImpactSeen: throwEvents.some((event) => event.type === 'throw-impact'),
      grappleDirectionSeen: throwEvents.some((event) => event.type === 'grapple-direction'),
      grappleRope,
      grappleRopeReboundSeen: grappleRopeEvents.some(
        (event) => event.type === 'rope-rebound' && event.fighterId === 'p2',
      ),
      simultaneous,
      simultaneousAttackStarts: simultaneousEvents.filter((event) => event.type === 'attack-start').length,
      simultaneousGrappleStarts: simultaneousEvents.filter((event) => event.type === 'grapple-start').length,
      screenshotState,
      canvasCount: document.querySelectorAll('canvas').length,
      legacyCanvasControllerLoaded: Boolean(document.querySelector('script[src*="app.js"]')),
    };
  });

  expect(result.bridgeVersion).toBe(5);
  expect(result.renderer).toBe('pixi-v8-webgl');
  expect(result.canvasCount).toBe(1);
  expect(result.legacyCanvasControllerLoaded).toBe(false);

  // Phase 1 regression contract.
  expect(result.movementDeltaX).toBe(48);
  expect(result.collisionDistance).toBeCloseTo(40, 9);
  expect(result.attackTick1.grapple).toBeNull();
  expect(result.attackTick1.fighters.p2.health).toBe(100);
  expect(result.attackTick1.fighters.p1.attackStartupTicks).toBe(2);
  expect(result.attackTick2.fighters.p2.health).toBe(100);
  expect(result.attackTick2.fighters.p1.attackStartupTicks).toBe(1);
  expect(result.impactTick3.fighters.p2.health).toBe(90);
  expect(result.impactTick3.hitstopTicks).toBe(3);
  expect(result.impactTick3.impact?.kind).toBe('strike');
  expect(result.impactTick3.fighters.p2.x).toBe(400);
  expect(result.frozenThroughTick6.fighters.p2.x).toBe(400);
  expect(result.frozenThroughTick6.fighters.p2.hitstunTicks).toBe(result.impactTick3.fighters.p2.hitstunTicks);
  expect(result.frozenThroughTick6.fighters.p1.attackRecoveryTicks).toBe(result.impactTick3.fighters.p1.attackRecoveryTicks);
  expect(result.resumedTick7.fighters.p2.x).toBe(410);
  expect(result.ropeHit.fighters.p2.x).toBe(780);
  expect(result.ropeHit.fighters.p2.vx).toBeCloseTo(-3.3909132, 7);
  expect(result.ropeHitReboundSeen).toBe(true);

  // Phase 2 contextual grapple contract.
  expect(result.grappleStarted.tick).toBe(1);
  expect(result.grappleStarted.grapple?.ticksRemaining).toBe(6);
  expect(result.grappleStarted.grapple?.throwX).toBe(1);
  expect(result.grappleStarted.grapple?.throwY).toBe(0);
  expect(result.grappleStarted.fighters.p1.state).toBe('grapple');
  expect(result.grappleStarted.fighters.p2.state).toBe('grapple');
  expect(result.grappleStarted.fighters.p2.health).toBe(100);

  expect(result.grappleDirected.grapple?.ticksRemaining).toBe(5);
  expect(result.grappleDirected.grapple?.throwX).toBe(0);
  expect(result.grappleDirected.grapple?.throwY).toBe(1);
  expect(result.grappleDirected.fighters.p1.x).toBe(result.grappleStarted.fighters.p1.x);
  expect(result.grappleDirected.fighters.p1.y).toBe(result.grappleStarted.fighters.p1.y);
  expect(result.grappleDirected.fighters.p2.x).toBe(result.grappleStarted.fighters.p2.x);
  expect(result.grappleDirected.fighters.p2.y).toBe(result.grappleStarted.fighters.p2.y);
  expect(result.grappleDirectionSeen).toBe(true);

  expect(result.throwImpact.tick).toBe(7);
  expect(result.throwImpact.grapple).toBeNull();
  expect(result.throwImpact.impact?.kind).toBe('throw');
  expect(result.throwImpact.hitstopTicks).toBe(4);
  expect(result.throwImpact.fighters.p2.health).toBe(85);
  expect(result.throwImpact.fighters.p2.vx).toBe(0);
  expect(result.throwImpact.fighters.p2.vy).toBe(13);
  expect(result.throwImpact.fighters.p2.hitstunTicks).toBe(14);
  expect(result.throwImpact.fighters.p1.grappleRecoveryTicks).toBe(6);
  expect(result.throwImpactSeen).toBe(true);

  expect(result.throwFrozen.hitstopTicks).toBe(0);
  expect(result.throwFrozen.fighters.p2.y).toBe(result.throwImpact.fighters.p2.y);
  expect(result.throwFrozen.fighters.p2.hitstunTicks).toBe(result.throwImpact.fighters.p2.hitstunTicks);
  expect(result.throwFrozen.fighters.p1.grappleRecoveryTicks).toBe(result.throwImpact.fighters.p1.grappleRecoveryTicks);
  expect(result.throwResumed.fighters.p2.y).toBe(result.throwImpact.fighters.p2.y + 13);
  expect(result.throwResumed.fighters.p2.hitstunTicks).toBe(13);
  expect(result.throwResumed.fighters.p1.grappleRecoveryTicks).toBe(5);

  expect(result.grappleRope.fighters.p2.x).toBe(780);
  expect(result.grappleRope.fighters.p2.vx).toBeLessThan(0);
  expect(result.grappleRopeReboundSeen).toBe(true);

  expect(result.simultaneous.grapple).toBeNull();
  expect(result.simultaneous.fighters.p1.attackStartupTicks).toBe(2);
  expect(result.simultaneous.fighters.p2.attackStartupTicks).toBe(2);
  expect(result.simultaneousAttackStarts).toBe(2);
  expect(result.simultaneousGrappleStarts).toBe(0);

  expect(result.screenshotState.impact?.kind).toBe('throw');
  expect(result.screenshotState.hitstopTicks).toBe(4);
  expect(consoleErrors).toEqual([]);

  await page.screenshot({ path: new URL('phase2-contextual-grapple.png', evidenceDir).pathname, fullPage: true });
  await writeFile(
    new URL('phase2-contextual-grapple-report.json', evidenceDir),
    `${JSON.stringify({ pass: true, consoleErrors, ...result }, null, 2)}\n`,
  );
});
