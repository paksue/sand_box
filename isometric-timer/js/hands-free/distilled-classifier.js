const MODEL_URL = new URL('../../assets/models/hold-gestures-v1-q8.json', import.meta.url);

function decodeBytes(base64) {
  if (typeof atob === 'function') {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }
  if (typeof Buffer !== 'undefined') return new Uint8Array(Buffer.from(base64, 'base64'));
  throw new Error('Base64 decoding is unavailable.');
}

function decodeFloat32(base64) {
  const bytes = decodeBytes(base64);
  if (bytes.byteLength % 4) throw new Error('Invalid float model data.');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const values = new Float32Array(bytes.byteLength / 4);
  for (let i = 0; i < values.length; i += 1) values[i] = view.getFloat32(i * 4, true);
  return values;
}

function decodeInt8(base64) {
  const bytes = decodeBytes(base64);
  const values = new Int8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 1) values[i] = bytes[i] > 127 ? bytes[i] - 256 : bytes[i];
  return values;
}

export function inflateDistilledGestureModel(raw) {
  if (!raw || raw.format !== 'hold-distilled-mlp-q8' || raw.featureSize !== 63 || raw.hiddenSize !== 32) {
    throw new Error('Unsupported Hold gesture model.');
  }
  const model = {
    version: raw.version,
    featureSize: raw.featureSize,
    hiddenSize: raw.hiddenSize,
    classes: [...raw.classes],
    commandThreshold: Number(raw.commandThreshold) || 0.8,
    training: raw.training || {},
    mean: decodeFloat32(raw.scalerMeanF32),
    scale: decodeFloat32(raw.scalerScaleF32),
    w0: decodeInt8(raw.w0.q8),
    w0Scale: Number(raw.w0.scale),
    b0: decodeFloat32(raw.b0F32),
    w1: decodeInt8(raw.w1.q8),
    w1Scale: Number(raw.w1.scale),
    b1: decodeFloat32(raw.b1F32)
  };
  if (
    model.mean.length !== 63 || model.scale.length !== 63 ||
    model.w0.length !== 63 * 32 || model.b0.length !== 32 ||
    model.w1.length !== 32 * 3 || model.b1.length !== 3 || model.classes.length !== 3
  ) throw new Error('Hold gesture model dimensions are invalid.');
  return model;
}

export async function loadDistilledGestureModel() {
  const response = await fetch(MODEL_URL, { cache: 'force-cache' });
  if (!response.ok) throw new Error(`Hold gesture model failed to load (${response.status}).`);
  return inflateDistilledGestureModel(await response.json());
}

export function classifyDistilledGesture(feature, model) {
  if (!Array.isArray(feature) || feature.length !== model?.featureSize) return null;

  const hidden = new Float64Array(model.hiddenSize);
  for (let j = 0; j < model.hiddenSize; j += 1) {
    let sum = model.b0[j];
    for (let i = 0; i < model.featureSize; i += 1) {
      const standardized = (Number(feature[i]) - model.mean[i]) / model.scale[i];
      sum += standardized * model.w0[i * model.hiddenSize + j] * model.w0Scale;
    }
    hidden[j] = Math.max(0, sum);
  }

  const logits = new Float64Array(model.classes.length);
  let maxLogit = -Infinity;
  for (let k = 0; k < model.classes.length; k += 1) {
    let sum = model.b1[k];
    for (let j = 0; j < model.hiddenSize; j += 1) {
      sum += hidden[j] * model.w1[j * model.classes.length + k] * model.w1Scale;
    }
    logits[k] = sum;
    if (sum > maxLogit) maxLogit = sum;
  }

  const probabilities = new Float64Array(logits.length);
  let denominator = 0;
  for (let k = 0; k < logits.length; k += 1) {
    probabilities[k] = Math.exp(logits[k] - maxLogit);
    denominator += probabilities[k];
  }

  let bestIndex = 0;
  let bestProbability = -1;
  for (let k = 0; k < probabilities.length; k += 1) {
    probabilities[k] /= denominator;
    if (probabilities[k] > bestProbability) {
      bestProbability = probabilities[k];
      bestIndex = k;
    }
  }

  const predicted = model.classes[bestIndex];
  const accepted = predicted === 'none' || bestProbability >= model.commandThreshold;
  return {
    label: accepted ? predicted : 'none',
    predicted,
    confidence: bestProbability,
    probabilities: Object.fromEntries(model.classes.map((label, index) => [label, probabilities[index]]))
  };
}
