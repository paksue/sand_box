import { normalizeHandLandmarks } from '../hands-free/landmark-features.js';
import {
  loadPublicNegativeFeatures,
  savePersonalizedProfile,
  setGestureModelPreference
} from '../hands-free/personalized-profile.js';
import { readStoredZip } from './zip-store-reader.js';

const MEDIAPIPE_VERSION = '1.0.1';
const MEDIAPIPE_MODULE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}`;
const MEDIAPIPE_WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task';
const IMAGE_PATTERN = /\/(start|pause|none)\/[^/]+\.(?:jpe?g|png|webp)$/i;

function mimeFor(name) {
  const lower = name.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
}

async function decodeImage(blob) {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(blob);
      return { source: bitmap, close: () => bitmap.close?.() };
    } catch {
      // Safari fallback below.
    }
  }

  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.decoding = 'async';
  const loaded = new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = () => reject(new Error('Could not decode a training image.'));
  });
  image.src = url;
  await loaded;
  return { source: image, close: () => URL.revokeObjectURL(url) };
}

function handednessFrom(result) {
  return result?.handedness?.[0]?.[0]?.categoryName || result?.handednesses?.[0]?.[0]?.categoryName || '';
}

export async function installPersonalizedGestureProfile(file, { onProgress = () => {} } = {}) {
  if (!(file instanceof Blob)) throw new Error('Choose a Hold training ZIP first.');

  onProgress({ phase: 'reading', message: 'Reading training ZIP…' });
  const entries = readStoredZip(await file.arrayBuffer());
  const images = entries.map((entry) => {
    const match = entry.name.match(IMAGE_PATTERN);
    return match ? { ...entry, label: match[1].toLowerCase() } : null;
  }).filter(Boolean);
  const inputCounts = images.reduce((counts, image) => {
    counts[image.label] += 1;
    return counts;
  }, { start: 0, pause: 0, none: 0 });

  if (inputCounts.start < 30 || inputCounts.pause < 30) {
    throw new Error(`Need at least 30 START and 30 PAUSE images. Found ${inputCounts.start} START and ${inputCounts.pause} PAUSE.`);
  }

  onProgress({ phase: 'loading', message: 'Loading on-device hand detector…' });
  const [module, publicNone] = await Promise.all([
    import(MEDIAPIPE_MODULE),
    loadPublicNegativeFeatures()
  ]);
  const vision = await module.FilesetResolver.forVisionTasks(MEDIAPIPE_WASM);
  const recognizer = await module.GestureRecognizer.createFromOptions(vision, {
    baseOptions: { modelAssetPath: MODEL_URL },
    runningMode: 'IMAGE',
    numHands: 1,
    minHandDetectionConfidence: 0.45,
    minHandPresenceConfidence: 0.45,
    cannedGesturesClassifierOptions: { scoreThreshold: 0 }
  });

  const features = { start: [], pause: [], none: [] };
  let skipped = 0;
  try {
    for (let index = 0; index < images.length; index += 1) {
      const image = images[index];
      const decoded = await decodeImage(new Blob([image.bytes], { type: mimeFor(image.name) }));
      try {
        const result = recognizer.recognize(decoded.source);
        const landmarks = result?.landmarks?.[0];
        const feature = normalizeHandLandmarks(landmarks, handednessFrom(result));
        if (feature) features[image.label].push(feature);
        else skipped += 1;
      } catch {
        skipped += 1;
      } finally {
        decoded.close();
      }

      if (index % 4 === 0 || index === images.length - 1) {
        onProgress({
          phase: 'extracting',
          current: index + 1,
          total: images.length,
          message: `Learning your hand shape ${index + 1}/${images.length}…`
        });
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
  } finally {
    recognizer.close?.();
  }

  if (features.start.length < 20 || features.pause.length < 20) {
    throw new Error(`Too few hands were detected (${features.start.length} START, ${features.pause.length} PAUSE). Re-capture with the hand clearly visible.`);
  }

  const profile = savePersonalizedProfile({
    version: 1,
    createdAt: new Date().toISOString(),
    sourceFile: file.name || 'hold-training.zip',
    start: features.start,
    pause: features.pause,
    none: features.none,
    counts: {
      input: inputCounts,
      detected: {
        start: features.start.length,
        pause: features.pause.length,
        none: features.none.length
      },
      publicNone: publicNone.features.length,
      skipped
    }
  });
  setGestureModelPreference('personalized');

  return {
    profile,
    publicNoneCount: publicNone.features.length,
    inputCounts,
    detectedCounts: profile.counts.detected,
    skipped
  };
}
