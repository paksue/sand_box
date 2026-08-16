import { equal, assert } from './assert.js';
import { createTimerState, transitionTimer, reconcileTimer } from '../js/domain/timer-machine.js';

export async function runTimerMachineTests() {
  let timer = createTimerState(30000);
  let result = transitionTimer(timer, { intent: 'START', source: 'test', exerciseId: 'plank' }, 1000);
  assert(result.accepted, 'START should be accepted from READY');
  timer = result.state;
  equal(timer.mode, 'PREPARE');
  equal(timer.phaseEndAt, 4000);
  equal(timer.exerciseId, 'plank');

  result = reconcileTimer(timer, 3999);
  assert(!result.changed, 'PREPARE should not finish early');
  result = reconcileTimer(timer, 4001);
  timer = result.state;
  equal(timer.mode, 'HOLD');
  equal(timer.phaseEndAt, 34000);

  result = transitionTimer(timer, { intent: 'PAUSE', source: 'test' }, 10000);
  timer = result.state;
  equal(timer.mode, 'PAUSED');
  equal(timer.pausedHoldMs, 24000);

  result = transitionTimer(timer, { intent: 'RESUME', source: 'test' }, 12000);
  timer = result.state;
  equal(timer.mode, 'PREPARE');
  equal(timer.pendingHoldMs, 24000);

  result = reconcileTimer(timer, 15001);
  timer = result.state;
  equal(timer.mode, 'HOLD');
  equal(timer.phaseEndAt, 39000);

  result = reconcileTimer(timer, 40000);
  timer = result.state;
  equal(timer.mode, 'DONE');
  equal(timer.completionReason, 'timer-complete');

  const recovering = transitionTimer(createTimerState(5000), { intent: 'START', source: 'test' }, 0).state;
  const recovered = reconcileTimer(recovering, 10000);
  equal(recovered.state.mode, 'DONE', 'A fully elapsed hidden session should recover directly to DONE');
  assert(recovered.effects.some((effect) => effect.type === 'SESSION_COMPLETE' && effect.recovered), 'Recovered completion effect expected');
}
