import { HAND_FEATURE_SIZE } from './landmark-features.js';

export const PERSONALIZED_PROFILE_KEY = 'hold.gesture.personalized.v1';
export const GESTURE_MODEL_PREFERENCE_KEY = 'hold.gesture.model.v1';
export const PUBLIC_NEGATIVE_URL = './assets/models/hagrid-negative-features-v1.json';

function validFeature(feature) {
  return Array.isArray(feature)
    && feature.length === HAND_FEATURE_SIZE
    && feature.every(Number.isFinite);
}

function cleanFeatures(features) {
  return Array.isArray(features) ? features.filter(validFeature) : [];
}

export function validatePersonalizedProfile(value) {
  if (!value || value.version !== 1) return null;
  const profile = {
    version: 1,
    createdAt: value.createdAt || null,
    sourceFile: value.sourceFile || '',
    start: cleanFeatures(value.start),
    pause: cleanFeatures(value.pause),
    none: cleanFeatures(value.none),
    counts: value.counts || {}
  };
  if (profile.start.length < 10 || profile.pause.length < 10) return null;
  return profile;
}

export function loadPersonalizedProfile(storage = localStorage) {
  try {
    const raw = storage.getItem(PERSONALIZED_PROFILE_KEY);
    return raw ? validatePersonalizedProfile(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function savePersonalizedProfile(profile, storage = localStorage) {
  const valid = validatePersonalizedProfile(profile);
  if (!valid) throw new Error('Personalized gesture profile is incomplete.');
  storage.setItem(PERSONALIZED_PROFILE_KEY, JSON.stringify(valid));
  return valid;
}

export function getGestureModelPreference(storage = localStorage) {
  try {
    const value = storage.getItem(GESTURE_MODEL_PREFERENCE_KEY);
    return value === 'personalized' ? 'personalized' : 'google';
  } catch {
    return 'google';
  }
}

export function setGestureModelPreference(value, storage = localStorage) {
  const safe = value === 'personalized' ? 'personalized' : 'google';
  storage.setItem(GESTURE_MODEL_PREFERENCE_KEY, safe);
  return safe;
}

export async function loadPublicNegativeFeatures(fetchImpl = fetch) {
  const response = await fetchImpl(PUBLIC_NEGATIVE_URL, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Could not load public NONE features (${response.status}).`);
  const payload = await response.json();
  const samples = Array.isArray(payload?.samples)
    ? payload.samples.map((sample) => sample?.f ?? sample).filter(validFeature)
    : [];
  if (samples.length < 50) throw new Error('Public NONE feature set is incomplete.');
  return {
    features: samples,
    metadata: {
      count: samples.length,
      source: payload.source || 'HaGRIDv2 no_gesture',
      license: payload.license || ''
    }
  };
}
