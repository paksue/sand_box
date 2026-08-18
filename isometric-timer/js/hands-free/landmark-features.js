export const HAND_FEATURE_SIZE = 63;

function handednessName(value) {
  if (typeof value === 'string') return value;
  if (value?.categoryName) return value.categoryName;
  if (value?.category_name) return value.category_name;
  return '';
}

export function normalizeHandLandmarks(landmarks, handedness = '') {
  if (!Array.isArray(landmarks) || landmarks.length < 21) return null;

  const points = landmarks.slice(0, 21).map((point) => [
    Number(point?.x) || 0,
    Number(point?.y) || 0,
    Number(point?.z) || 0
  ]);

  const [wx, wy, wz] = points[0];
  const relative = points.map(([x, y, z]) => [x - wx, y - wy, z - wz]);

  if (handednessName(handedness).toLowerCase().startsWith('left')) {
    for (const point of relative) point[0] *= -1;
  }

  const [mx, my] = relative[9];
  const angle = Math.atan2(my, mx);
  const delta = -Math.PI / 2 - angle;
  const cos = Math.cos(delta);
  const sin = Math.sin(delta);
  for (const point of relative) {
    const [x, y] = point;
    point[0] = cos * x - sin * y;
    point[1] = sin * x + cos * y;
  }

  let scale = Math.hypot(relative[9][0], relative[9][1], relative[9][2]);
  if (scale < 1e-6) {
    scale = Math.max(1e-6, ...relative.map(([x, y, z]) => Math.hypot(x, y, z)));
  }

  const feature = [];
  for (const [x, y, z] of relative) feature.push(x / scale, y / scale, z / scale);
  return feature.length === HAND_FEATURE_SIZE && feature.every(Number.isFinite) ? feature : null;
}

export function featureDistance(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length || !a.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) {
    const delta = a[i] - b[i];
    sum += delta * delta;
  }
  return Math.sqrt(sum / a.length);
}
