export const SAVE_VERSION = 1;

const clone = (value) => JSON.parse(JSON.stringify(value));

export const RATIONALES = Object.freeze({
  fewer_deaths: {
    appliesTo: 'pull',
    label: 'If someone must die, fewer deaths is better.',
    statement: 'When deaths cannot be avoided, choose the action that leaves fewer people dead.',
    dimensions: ['consequences'],
  },
  prevent_more: {
    appliesTo: 'pull',
    label: 'I could prevent four unnecessary deaths.',
    statement: 'If I can prevent a greater loss of life, I should intervene.',
    dimensions: ['consequences', 'agency'],
  },
  five_over_one: {
    appliesTo: 'pull',
    label: 'Five lives matter more than one.',
    statement: 'When lives directly conflict, saving the greater number should decide the action.',
    dimensions: ['consequences'],
  },
  pull_intuition: {
    appliesTo: 'pull',
    label: 'I do not know. It just seemed right.',
    statement: 'In an unavoidable one-versus-five tradeoff, I accept sacrificing one person to save five.',
    dimensions: ['intuition', 'consequences'],
  },
  do_not_redirect: {
    appliesTo: 'stay',
    label: 'I would not redirect the danger onto someone else.',
    statement: 'I should not intentionally redirect lethal harm onto an innocent person, even to save more people.',
    dimensions: ['agency', 'rights'],
  },
  omission_difference: {
    appliesTo: 'stay',
    label: 'Causing a death feels worse than failing to prevent deaths.',
    statement: 'Intentionally causing a person’s death can be worse than allowing a greater harm I did not create.',
    dimensions: ['agency', 'intention'],
  },
  one_has_rights: {
    appliesTo: 'stay',
    label: 'The person on the side track had a right not to be sacrificed by me.',
    statement: 'An innocent person cannot be deliberately sacrificed merely because doing so benefits more people.',
    dimensions: ['rights', 'means'],
  },
  stay_intuition: {
    appliesTo: 'stay',
    label: 'I do not know. Pulling it just felt wrong.',
    statement: 'In an unavoidable one-versus-five tradeoff, I refuse to make one person the target of my intervention.',
    dimensions: ['intuition', 'agency'],
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

function lastDecision(state, scenarioId) {
  return [...state.decisions].reverse().find((decision) => decision.scenarioId === scenarioId) ?? null;
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

  const trolleyChoice = lastDecision(state, 'trolley_switch')?.choice ?? null;
  if (!trolleyChoice) throw new Error('A trolley decision is required before creating Rule 01.');
  if (rationale.appliesTo !== trolleyChoice) throw new Error(`Rationale ${rationaleId} does not apply to ${trolleyChoice}.`);

  const next = clone(state);
  const principle = {
    id: `rule-${next.principles.length + 1}`,
    version: 1,
    source: 'trolley_switch',
    originChoice: trolleyChoice,
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

  if (scenarioId === 'bridge') {
    const choice = rule.originChoice === 'stay' ? 'refuse' : 'push';
    return {
      ruleId: rule.id,
      choice,
      explanation: choice === 'push'
        ? 'One person dies instead of five. Your rule favors intervening for the smaller loss of life.'
        : 'Your rule rejects deliberately making one innocent person the target or means of your intervention.',
    };
  }

  if (scenarioId === 'surgeon') {
    const choice = rule.originChoice === 'stay' ? 'refuse' : 'harvest';
    return {
      ruleId: rule.id,
      choice,
      explanation: choice === 'harvest'
        ? 'One person dies and five live. On the structure of your first rule, the sacrifice is favored.'
        : 'Your first rule resists intentionally sacrificing one innocent person even to save five.',
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
