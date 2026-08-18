import { featureDistance } from './landmark-features.js';

const LABELS = ['start', 'pause', 'none'];

function meanNearest(feature, references, k) {
  if (!Array.isArray(references) || !references.length) return Infinity;
  const nearest = [];
  for (const reference of references) {
    const distance = featureDistance(feature, reference);
    if (!Number.isFinite(distance)) continue;
    let index = nearest.findIndex((value) => distance < value);
    if (index < 0) index = nearest.length;
    nearest.splice(index, 0, distance);
    if (nearest.length > k) nearest.pop();
  }
  if (!nearest.length) return Infinity;
  return nearest.reduce((sum, value) => sum + value, 0) / nearest.length;
}

export function classifyPersonalizedGesture(feature, references, { k = 5 } = {}) {
  if (!Array.isArray(feature) || !references) return null;
  const distances = LABELS.map((label) => ({
    label,
    distance: meanNearest(feature, references[label], k)
  })).filter((item) => Number.isFinite(item.distance));

  if (distances.length < 2) return null;
  distances.sort((a, b) => a.distance - b.distance);
  const best = distances[0];
  const second = distances[1];
  const separation = Math.max(0, Math.min(1, (second.distance - best.distance) / Math.max(second.distance, 1e-6)));
  const confidence = Math.max(0.5, Math.min(0.99, 0.5 + separation * 0.5));

  return {
    label: best.label,
    confidence,
    distance: best.distance,
    separation,
    classDistances: Object.fromEntries(distances.map((item) => [item.label, item.distance]))
  };
}
