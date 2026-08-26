export const SAVE_VERSION = 1;

const clone = (value) => JSON.parse(JSON.stringify(value));

export const RATIONALES = Object.freeze({
  fewer_deaths: {
    label: 'If someone must die, fewer deaths is better.',
    statement: 'When deaths cannot be avoided, choose the action that leaves fewer people dead.',
    dimensions: ['consequences'],
  },
  prevent_more: {
    label: 'I could prevent four unnecessary deaths.',
    statement: 'If I can prevent a greater loss of life, I should intervene.',
    dimensions: ['consequences', 'agency'],
  },
  five_over_one: {
    label: 'Five lives matter more than one.',
    statement: 'When lives directly conflict, saving the greater number should decide the action.',
    dimensions: ['consequences'],
  },
  intuition: {
    label: 'I do not know. It just seemed right.',
    statement: 'In an unavoidable life-or-death tradeoff, I accept sacrificing one person to save five.',
    dimensions: ['intuition', 'consequences'],
  },
});

export const DISTINCTIONS = Object.freeze({
  physical_contact: {
    label: 'I had to physically push him.',
    dimension: 'physical_contact',
    mutation: 'bridge_trapdoor',
  },
  intention: {
    label: 'His death was part of what I intended.',
    dimension: 'intention',
    mutation: 'side_effect_switch',
  },
  using_person: {
    label: 'I was using him as the thing that stops the trolley.',
    dimension: 'means',
    mutation: 'side_effect_switch',
  },
  consent: {
    label: 'He never consented to be sacrificed.',
    dimension: 'consent',
    mutation: 'volunteer_bridge',
  },
  personal_killing: {
    label: 'It felt like I personally killed him.',
    dimension: 'agency',
    mutation: 'bridge_trapdoor',
  },
  intuition: {
    label: 'I cannot name it. It just feels different.',
    dimension: 'intuition',
    mutation: 'bridge_trapdoor',
  },
});

export const MUTATIONS = Object.freeze({
  bridge_trapdoor: {
    id: 'bridge_trapdoor',
    eyebrow: 'VARIABLE REMOVED: PHYSICAL CONTACT',
    title: 'The Button',
    body: 'You are no longer beside him. A button opens the floor beneath his feet. He falls onto the track. His body stops the trolley. Five people live.',
    primary: 'PRESS THE BUTTON',
    secondary: 'REFUSE',
  },
  side_effect_switch: {
    id: 'side_effect_switch',
    eyebrow: 'TESTING: INTENTION',
    title: 'The Side Track',
    body: 'A switch redirects the trolley. One worker will be struck, but his body is not what saves the five. His death is a foreseen side effect, not the mechanism.',
    primary: 'PULL THE SWITCH',
    secondary: 'REFUSE',
  },
  volunteer_bridge: {
    id: 'volunteer_bridge',
    eyebrow: 'TESTING: CONSENT',
    title: 'The Volunteer',
    body: 'The person beside you understands exactly what will happen. He asks you to push him so the five can live. Nothing else has changed.',
    primary: 'HONOR HIS CHOICE',
    secondary: 'REFUSE',
  },
});

export function createInitialState() {
  return {
    version: SAVE_VERSION,
    phase: 'intro',
    decisions: [],
    principles: [],
    contradictions: [],
    distinctions: [],
    mutation: null,
    updatedAt: Date.now(),
  };
}

function touch(state) {
  state.updatedAt = Date.now();
  return state;
}

export function recordDecision(state, scenarioId, choice, meta = {}) {
  const next = clone(state);
  next.decisions.push({
    scenarioId,
    choice,
    meta: clone(meta),
    sequence: next.decisions.length + 1,
  });
  next.phase = scenarioId;
  return touch(next);
}

export function createPrincipleFromRationale(state, rationaleId) {
  const rationale = RATIONALES[rationaleId];
  if (!rationale) throw new Error(`Unknown rationale: ${rationaleId}`);

  const next = clone(state);
  const principle = {
    id: `rule-${next.principles.length + 1}`,
    version: 1,
    source: 'trolley_switch',
    rationaleId,
    statement: rationale.statement,
    dimensions: [...rationale.dimensions],
    status: 'active',
  };
  next.principles.push(principle);
  next.phase = 'rule_created';
  return touch(next);
}

export function activeRule(state) {
  return state.principles.find((rule) => rule.status === 'active') ?? null;
}

export function predictChoice(state, scenarioId) {
  const rule = activeRule(state);
  if (!rule) return null;

  const consequenceDriven = rule.dimensions.includes('consequences') || rule.rationaleId === 'intuition';
  if (!consequenceDriven) return null;

  if (scenarioId === 'bridge') {
    return {
      ruleId: rule.id,
      choice: 'push',
      explanation: 'One person dies instead of five. Your rule treats the smaller loss of life as the action to choose.',
    };
  }

  if (scenarioId === 'surgeon') {
    return {
      ruleId: rule.id,
      choice: 'harvest',
      explanation: 'One person dies and five live. On outcome alone, your rule points toward the sacrifice.',
    };
  }

  return null;
}

export function judgeAgainstPrediction(state, scenarioId, actualChoice) {
  const prediction = predictChoice(state, scenarioId);
  const next = recordDecision(state, scenarioId, actualChoice, { predicted: prediction?.choice ?? null });
  if (!prediction) return { state: next, prediction: null, contradiction: null };

  if (prediction.choice === actualChoice) {
    return { state: next, prediction, contradiction: null };
  }

  const contradiction = {
    id: `conflict-${next.contradictions.length + 1}`,
    scenarioId,
    ruleId: prediction.ruleId,
    predictedChoice: prediction.choice,
    actualChoice,
    status: 'unresolved',
  };
  next.contradictions.push(contradiction);
  next.phase = 'contradiction';
  touch(next);
  return { state: next, prediction, contradiction };
}

export function recordDistinction(state, distinctionId) {
  const distinction = DISTINCTIONS[distinctionId];
  if (!distinction) throw new Error(`Unknown distinction: ${distinctionId}`);

  const next = clone(state);
  next.distinctions.push({
    id: distinctionId,
    label: distinction.label,
    dimension: distinction.dimension,
  });
  next.mutation = distinction.mutation;
  next.phase = 'mutation';
  return touch(next);
}

export function getMutation(state) {
  if (!state.mutation) return null;
  return clone(MUTATIONS[state.mutation] ?? null);
}

export function moralSnapshot(state) {
  return {
    decisions: state.decisions.length,
    activeRule: activeRule(state),
    contradictions: state.contradictions.filter((item) => item.status === 'unresolved').length,
    distinctions: clone(state.distinctions),
    mutation: getMutation(state),
  };
}

export function serializeState(state) {
  return JSON.stringify(state);
}

export function deserializeState(raw) {
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : clone(raw);
    if (!parsed || parsed.version !== SAVE_VERSION) return createInitialState();
    if (!Array.isArray(parsed.decisions) || !Array.isArray(parsed.principles)) return createInitialState();
    if (!Array.isArray(parsed.contradictions) || !Array.isArray(parsed.distinctions)) return createInitialState();
    return parsed;
  } catch {
    return createInitialState();
  }
}
