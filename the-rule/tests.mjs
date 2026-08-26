import assert from 'node:assert/strict';
import {
  createInitialState,
  recordDecision,
  createPrincipleFromRationale,
  predictChoice,
  judgeAgainstPrediction,
  recordDistinction,
  getMutation,
  serializeState,
  deserializeState,
} from './core.mjs';

function buildRuledState(rationale = 'fewer_deaths') {
  let state = createInitialState();
  state = recordDecision(state, 'trolley_switch', 'pull');
  state = createPrincipleFromRationale(state, rationale);
  return state;
}

{
  const state = createInitialState();
  assert.equal(state.phase, 'intro');
  assert.deepEqual(state.decisions, []);
  assert.deepEqual(state.principles, []);
}

{
  const state = buildRuledState();
  assert.equal(state.principles.length, 1);
  assert.match(state.principles[0].statement, /fewer people dead/i);
}

{
  const state = buildRuledState('prevent_more');
  const prediction = predictChoice(state, 'bridge');
  assert.equal(prediction.choice, 'push');
  assert.equal(prediction.ruleId, 'rule-1');
}

{
  const state = buildRuledState();
  const result = judgeAgainstPrediction(state, 'bridge', 'refuse');
  assert.equal(result.prediction.choice, 'push');
  assert.equal(result.contradiction.actualChoice, 'refuse');
  assert.equal(result.state.contradictions.length, 1);
  assert.equal(result.state.phase, 'contradiction');
}

{
  const state = buildRuledState();
  const result = judgeAgainstPrediction(state, 'bridge', 'push');
  assert.equal(result.contradiction, null);
  assert.equal(result.state.contradictions.length, 0);
}

{
  let state = buildRuledState();
  state = judgeAgainstPrediction(state, 'bridge', 'refuse').state;
  state = recordDistinction(state, 'physical_contact');
  assert.equal(state.mutation, 'bridge_trapdoor');
  assert.match(getMutation(state).eyebrow, /PHYSICAL CONTACT/);
}

{
  let state = buildRuledState();
  state = recordDistinction(state, 'consent');
  const restored = deserializeState(serializeState(state));
  assert.equal(restored.mutation, 'volunteer_bridge');
  assert.equal(restored.principles[0].id, 'rule-1');
}

{
  const restored = deserializeState('{ definitely not json');
  assert.equal(restored.phase, 'intro');
  assert.equal(restored.principles.length, 0);
}

console.log('THE RULE core tests: PASS');
