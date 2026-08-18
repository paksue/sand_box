import { contextualGestureIntent } from '../domain/commands.js';
import { normalizeHandLandmarks } from './landmark-features.js';
import { classifyPersonalizedGesture } from './personalized-classifier.js';
import {
  getGestureModelPreference,
  loadPersonalizedProfile,
  loadPublicNegativeFeatures
} from './personalized-profile.js';

const MEDIAPIPE_VERSION = '1.0.1';
const MEDIAPIPE_MODULE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}`;
const MEDIAPIPE_WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task';
const SAMPLE_INTERVAL_MS = 120;
const DIAGNOSTIC_MIN_INTERVAL_MS = 220;
const DIAGNOSTIC_REPEAT_MS = 500;
const NO_GESTURE_DELAY_MS = 420;

function gestureDiagnostic(label, score) {
  const percent = Math.max(0, Math.min(100, Math.round((Number(score) || 0) * 100)));
  if (label === 'Personalized_Start') return { key: `PStart:${Math.round(percent / 5) * 5}`, text: `P1 · 👍 Start · ${percent}%` };
  if (label === 'Personalized_Pause') return { key: `PPause:${Math.round(percent / 5) * 5}`, text: `P1 · ✋ Pause · ${percent}%` };
  if (label === 'Personalized_None') return { key: 'PNone', text: 'P1 · No command' };
  if (label === 'Open_Palm') return { key: `Open_Palm:${Math.round(percent / 5) * 5}`, text: `✋ Open Palm · ${percent}%` };
  if (label === 'Thumb_Up') return { key: `Thumb_Up:${Math.round(percent / 5) * 5}`, text: `👍 Thumbs up · ${percent}%` };
  return { key: 'none', text: 'No gesture' };
}

function resultHandedness(result) {
  return result?.handedness?.[0]?.[0]?.categoryName || result?.handednesses?.[0]?.[0]?.categoryName || '';
}

export class GestureAdapter {
  constructor({ onCandidate, onStatus, getMode }) {
    this.onCandidate = onCandidate;
    this.onStatus = onStatus;
    this.getMode = getMode;
    this.stream = null;
    this.video = null;
    this.recognizer = null;
    this.frameTimer = null;
    this.running = false;
    this.personalized = null;
    this.lastDiagnosticAt = 0;
    this.lastDiagnosticKey = '';
    this.lastGestureSeenAt = 0;
  }

  async loadPersonalized() {
    if (getGestureModelPreference() !== 'personalized') return null;
    const profile = loadPersonalizedProfile();
    if (!profile) return null;
    try {
      const publicNone = await loadPublicNegativeFeatures();
      return {
        references: {
          start: profile.start,
          pause: profile.pause,
          none: [...profile.none, ...publicNone.features]
        },
        counts: {
          start: profile.start.length,
          pause: profile.pause.length,
          none: profile.none.length + publicNone.features.length
        }
      };
    } catch {
      return null;
    }
  }

  reportDiagnostic(label, score, { force = false } = {}) {
    const now = performance.now();
    if (label && label !== 'Personalized_None') this.lastGestureSeenAt = now;
    if (!label && !force && this.lastGestureSeenAt && now - this.lastGestureSeenAt < NO_GESTURE_DELAY_MS) return;

    const diagnostic = gestureDiagnostic(label, score);
    const elapsed = now - this.lastDiagnosticAt;
    if (!force && elapsed < DIAGNOSTIC_MIN_INTERVAL_MS) return;
    if (!force && diagnostic.key === this.lastDiagnosticKey && elapsed < DIAGNOSTIC_REPEAT_MS) return;

    this.lastDiagnosticAt = now;
    this.lastDiagnosticKey = diagnostic.key;
    this.onStatus('ACTIVE', diagnostic.text);
  }

  emitNoGesture(rawLabel = 'None') {
    this.onCandidate({ intent: null, source: 'gesture', confidence: 0, timestamp: Date.now(), rawLabel });
  }

  emitPersonalized(result) {
    const landmarks = result?.landmarks?.[0];
    const feature = normalizeHandLandmarks(landmarks, resultHandedness(result));
    if (!feature) {
      this.reportDiagnostic('Personalized_None', 0);
      this.emitNoGesture('Personalized_None');
      return;
    }

    const classification = classifyPersonalizedGesture(feature, this.personalized.references);
    if (!classification || classification.label === 'none') {
      this.reportDiagnostic('Personalized_None', classification?.confidence || 0);
      this.emitNoGesture('Personalized_None');
      return;
    }

    const isStart = classification.label === 'start';
    const cannedEquivalent = isStart ? 'Thumb_Up' : 'Open_Palm';
    const rawLabel = isStart ? 'Personalized_Start' : 'Personalized_Pause';
    this.reportDiagnostic(rawLabel, classification.confidence);
    this.onCandidate({
      intent: contextualGestureIntent(this.getMode(), cannedEquivalent),
      source: 'gesture',
      confidence: classification.confidence,
      timestamp: Date.now(),
      rawLabel
    });
  }

  emitGoogle(result) {
    const category = result?.gestures?.[0]?.[0];
    if (category?.categoryName) {
      const confidence = Number(category.score) || 0;
      this.reportDiagnostic(category.categoryName, confidence);
      this.onCandidate({
        intent: contextualGestureIntent(this.getMode(), category.categoryName),
        source: 'gesture',
        confidence,
        timestamp: Date.now(),
        rawLabel: category.categoryName
      });
    } else {
      this.reportDiagnostic(null, 0);
      this.emitNoGesture();
    }
  }

  async start() {
    if (this.running) return;
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access is unavailable in this browser.');
    this.onStatus('LOADING', 'Loading gesture controls…');

    this.personalized = await this.loadPersonalized();

    let module;
    try {
      module = await import(MEDIAPIPE_MODULE);
      const vision = await module.FilesetResolver.forVisionTasks(MEDIAPIPE_WASM);
      this.recognizer = await module.GestureRecognizer.createFromOptions(vision, {
        baseOptions: { modelAssetPath: MODEL_URL },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.55,
        minHandPresenceConfidence: 0.55,
        minTrackingConfidence: 0.5,
        cannedGesturesClassifierOptions: {
          scoreThreshold: 0.55,
          categoryAllowlist: ['Thumb_Up', 'Open_Palm']
        }
      });
    } catch (error) {
      this.onStatus('ERROR', 'Gesture model failed to load.');
      throw error;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 }, frameRate: { ideal: 15, max: 24 } },
        audio: false
      });
    } catch (error) {
      this.recognizer?.close?.();
      this.recognizer = null;
      if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') {
        this.onStatus('PERMISSION_DENIED', 'Camera permission was denied.');
      } else {
        this.onStatus('ERROR', 'Camera could not be started.');
      }
      throw error;
    }

    this.video = document.createElement('video');
    this.video.muted = true;
    this.video.playsInline = true;
    this.video.autoplay = true;
    this.video.srcObject = this.stream;
    this.video.setAttribute('aria-hidden', 'true');
    this.video.style.position = 'fixed';
    this.video.style.width = '1px';
    this.video.style.height = '1px';
    this.video.style.opacity = '0';
    this.video.style.pointerEvents = 'none';
    document.body.appendChild(this.video);
    await this.video.play();
    this.running = true;
    this.reportDiagnostic(this.personalized ? 'Personalized_None' : null, 0, { force: true });
    this.loop();
  }

  loop() {
    if (!this.running || !this.recognizer || !this.video) return;
    if (this.video.readyState >= 2) {
      try {
        const result = this.recognizer.recognizeForVideo(this.video, performance.now());
        if (this.personalized) this.emitPersonalized(result);
        else this.emitGoogle(result);
      } catch {
        // One bad frame should never kill the timer or the gesture loop.
      }
    }
    this.frameTimer = setTimeout(() => this.loop(), SAMPLE_INTERVAL_MS);
  }

  async stop() {
    this.running = false;
    if (this.frameTimer) clearTimeout(this.frameTimer);
    this.frameTimer = null;
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    if (this.video) {
      this.video.srcObject = null;
      this.video.remove();
    }
    this.video = null;
    try { this.recognizer?.close?.(); } catch { /* no-op */ }
    this.recognizer = null;
    this.personalized = null;
    this.lastDiagnosticAt = 0;
    this.lastDiagnosticKey = '';
    this.lastGestureSeenAt = 0;
    this.onStatus('OFF', '');
  }
}
