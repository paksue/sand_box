import { contextualGestureIntent } from '../domain/commands.js';

const MEDIAPIPE_VERSION = '1.0.1';
const MEDIAPIPE_MODULE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}`;
const MEDIAPIPE_WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`;
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task';
const SAMPLE_INTERVAL_MS = 120;

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
  }

  async start() {
    if (this.running) return;
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access is unavailable in this browser.');
    this.onStatus('LOADING', 'Loading gesture controls…');

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
          scoreThreshold: 0.65,
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
    this.onStatus('ACTIVE', 'Gestures ready: 👍 start · ✋ pause');
    this.loop();
  }

  loop() {
    if (!this.running || !this.recognizer || !this.video) return;
    if (this.video.readyState >= 2) {
      try {
        const result = this.recognizer.recognizeForVideo(this.video, performance.now());
        const category = result?.gestures?.[0]?.[0];
        if (category?.categoryName) {
          const intent = contextualGestureIntent(this.getMode(), category.categoryName);
          this.onCandidate({
            intent,
            source: 'gesture',
            confidence: Number(category.score) || 0,
            timestamp: Date.now(),
            rawLabel: category.categoryName
          });
        } else {
          this.onCandidate({ intent: null, source: 'gesture', confidence: 0, timestamp: Date.now(), rawLabel: 'None' });
        }
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
    this.onStatus('OFF', '');
  }
}
