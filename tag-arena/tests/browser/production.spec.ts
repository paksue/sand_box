import { mkdir, writeFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

const evidenceDir = new URL('../../test-results/', import.meta.url);

test('Pixi runtime preserves contextual combat and verifies 2v2 tagging', async ({ page }) => {
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

    // Preserve the verified movement/collision/strike measurements.
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

    // Preserve the Phase 2 contextual grapple contract.
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

    api.loadScenario('grapple-rope');
    api.setInput('p1', { attack: true });
    api.step(1);
    api.setInput('p1', {});
    api.step(6);
    api.step(4);
    const grappleRope = api.step(2);
    const grappleRopeEvents = api.getEvents();

    api.loadScenario('grapple');
    api.setInput('p1', { attack: true });
    api.setInput('p2', { attack: true });
    const simultaneous = api.step(1);
    const simultaneousEvents = api.getEvents();

    // Phase 3A: persistent tag swap + lockout.
    api.loadScenario('tag-ready');
    const tagBefore = api.getState();
    api.setInput('p1', { tag: true });
    const tagCompleted = api.step(1);
    const tagEvents = api.getEvents();
    api.setInput('p1', {});
    api.step(1);
    api.setInput('p1', { tag: true });
    const tagLocked = api.step(1);

    // Phase 3A: inactive recovery.
    api.loadScenario('tag-recovery');
    api.setInput('p1', { tag: true });
    const recoveryTagged = api.step(1);
    api.setInput('p1', {});
    const recoveryBefore = api.step(59);
    const recoveryAfter = api.step(1);
    const recoveryEvents = api.getEvents();

    // Tag wins over Action on an eligible same-tick press.
    api.loadScenario('tag-ready');
    api.setInput('p1', { tag: true, attack: true });
    const tagPriority = api.step(1);
    const tagPriorityEvents = api.getEvents();

    // P2 must have the same tag semantics.
    api.loadScenario('tag-ready-p2');
    api.setInput('p2', { tag: true });
    const p2Tag = api.step(1);

    // Leave visual evidence immediately after a successful P1 tag.
    api.loadScenario('tag-ready');
    api.setInput('p1', { tag: true });
    const screenshotState = api.step(1);

    return {
      bridgeVersion: api.version,
      renderer: api.renderer,
      gameStateVersion: screenshotState.version,
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
      tagBefore,
      tagCompleted,
      tagLocked,
      tagCompletedEvents: tagEvents.filter((event) => event.type === 'tag-completed').length,
      recoveryTagged,
      recoveryBefore,
      recoveryAfter,
      recoverySeen: recoveryEvents.some(
        (event) => event.type === 'partner-recovered' && event.rosterId === 'p1a' && event.health === 61,
      ),
      tagPriority,
      tagPriorityTagStarts: tagPriorityEvents.filter((event) => event.type === 'tag-completed').length,
      tagPriorityAttackStarts: tagPriorityEvents.filter(
        (event) => event.type === 'attack-start' && event.fighterId === 'p1',
      ).length,
      tagPriorityGrappleStarts: tagPriorityEvents.filter(
        (event) => event.type === 'grapple-start' && event.attackerId === 'p1',
      ).length,
      p2Tag,
      screenshotState,
      canvasCount: document.querySelectorAll('canvas').length,
      legacyCanvasControllerLoaded: Boolean(document.querySelector('script[src*="app.js"]')),
    };
  });

  expect(result.bridgeVersion).toBe(6);
  expect(result.gameStateVersion).toBe(5);
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

  // Phase 3A persistent tag-team contract.
  expect(result.tagBefore.fighters.p1.rosterId).toBe('p1a');
  expect(result.tagBefore.partners.p1.rosterId).toBe('p1b');
  expect(result.tagBefore.partners.p1.health).toBe(80);
  expect(result.tagCompleted.fighters.p1.rosterId).toBe('p1b');
  expect(result.tagCompleted.fighters.p1.health).toBe(80);
  expect(result.tagCompleted.partners.p1.rosterId).toBe('p1a');
  expect(result.tagCompleted.partners.p1.health).toBe(100);
  expect(result.tagCompleted.partners.p1.x).toBe(70);
  expect(result.tagCompleted.partners.p1.y).toBe(380);
  expect(result.tagCompleted.partners.p1.state).toBe('inactive');
  expect(result.tagCompleted.teams.p1.tagCooldownTicks).toBe(120);
  expect(result.tagCompletedEvents).toBe(1);
  expect(result.tagLocked.fighters.p1.rosterId).toBe('p1b');
  expect(result.tagLocked.teams.p1.tagCooldownTicks).toBe(118);

  expect(result.recoveryTagged.partners.p1.rosterId).toBe('p1a');
  expect(result.recoveryTagged.partners.p1.health).toBe(60);
  expect(result.recoveryBefore.partners.p1.health).toBe(60);
  expect(result.recoveryAfter.partners.p1.health).toBe(61);
  expect(result.recoverySeen).toBe(true);

  expect(result.tagPriority.fighters.p1.rosterId).toBe('p1b');
  expect(result.tagPriority.fighters.p1.attackStartupTicks).toBe(0);
  expect(result.tagPriorityTagStarts).toBe(1);
  expect(result.tagPriorityAttackStarts).toBe(0);
  expect(result.tagPriorityGrappleStarts).toBe(0);

  expect(result.p2Tag.fighters.p2.rosterId).toBe('p2b');
  expect(result.p2Tag.fighters.p2.health).toBe(75);
  expect(result.p2Tag.partners.p2.rosterId).toBe('p2a');
  expect(result.p2Tag.teams.p2.tagCooldownTicks).toBe(120);

  expect(result.screenshotState.fighters.p1.rosterId).toBe('p1b');
  expect(result.screenshotState.partners.p1.rosterId).toBe('p1a');
  expect(result.screenshotState.teams.p1.tagCooldownTicks).toBe(120);
  expect(consoleErrors).toEqual([]);

  await page.screenshot({ path: new URL('phase3a-tag-team.png', evidenceDir).pathname, fullPage: true });
  await writeFile(
    new URL('phase3a-tag-team-report.json', evidenceDir),
    `${JSON.stringify({ pass: true, consoleErrors, ...result }, null, 2)}\n`,
  );
});
