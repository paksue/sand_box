const TARGET_RATE = 16000;
const CHUNK_SECONDS = 1.6;
const MIN_RMS = 0.012;

function downsample(buffer, inputRate, outputRate = TARGET_RATE) {
  if (inputRate === outputRate) return Float32Array.from(buffer);
  if (outputRate > inputRate) return Float32Array.from(buffer);
  const ratio = inputRate / outputRate;
  const length = Math.max(1, Math.round(buffer.length / ratio));
  const result = new Float32Array(length);
  let offset = 0;
  for (let i = 0; i < length; i += 1) {
    const nextOffset = Math.min(buffer.length, Math.round((i + 1) * ratio));
    let sum = 0;
    let count = 0;
    for (; offset < nextOffset; offset += 1) {
      sum += buffer[offset];
      count += 1;
    }
    result[i] = count ? sum / count : 0;
  }
  return result;
}

function rms(samples) {
  if (!samples.length) return 0;
  let sum = 0;
  for (let i = 0; i < samples.length; i += 1) sum += samples[i] * samples[i];
  return Math.sqrt(sum / samples.length);
}

function mapTranscript(text, mode) {
  const normalized = String(text || '').toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!normalized) return null;
  const words = new Set(normalized.split(' '));
  if (words.has('pause') || words.has('stop')) return mode === 'HOLD' ? 'PAUSE' : null;
  if (words.has('resume') || words.has('continue')) return mode === 'PAUSED' ? 'RESUME' : null;
  if (words.has('again') || (words.has('do') && words.has('again'))) return mode === 'DONE' ? 'REPEAT' : null;
  if (words.has('start') || words.has('go')) return mode === 'READY' ? 'START' : null;
  return null;
}

export class VoiceAdapter {
  constructor({ onCandidate, onStatus, getMode }) {
    this.onCandidate = onCandidate;
    this.onStatus = onStatus;
    this.getMode = getMode;
    this.stream = null;
    this.context = null;
    this.source = null;
    this.processor = null;
    this.silenceGain = null;
    this.worker = null;
    this.buffers = [];
    this.bufferedSamples = 0;
    this.workerBusy = false;
    this.workerReady = false;
    this.running = false;
  }

  async start() {
    if (this.running) return;
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Microphone access is unavailable in this browser.');
    this.onStatus('LOADING', 'Loading local voice model…');
    this.worker = new Worker(new URL('../../workers/voice-worker.js', import.meta.url), { type: 'module' });
    this.worker.onmessage = (event) => this.handleWorkerMessage(event.data);
    this.worker.onerror = () => {
      this.stop(true);
      this.onStatus('ERROR', 'Local voice model failed to load.');
    };
    this.worker.postMessage({ type: 'init' });

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false
      });
    } catch (error) {
      this.disposeWorker();
      if (error?.name === 'NotAllowedError' || error?.name === 'PermissionDeniedError') {
        this.onStatus('PERMISSION_DENIED', 'Microphone permission was denied.');
      } else {
        this.onStatus('ERROR', 'Microphone could not be started.');
      }
      throw error;
    }

    const AudioContextCtor = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AudioContextCtor) throw new Error('Web Audio is unavailable.');
    this.context = new AudioContextCtor();
    if (this.context.state === 'suspended') await this.context.resume();
    this.source = this.context.createMediaStreamSource(this.stream);
    this.processor = this.context.createScriptProcessor(4096, 1, 1);
    this.silenceGain = this.context.createGain();
    this.silenceGain.gain.value = 0;
    this.processor.onaudioprocess = (event) => this.capture(event.inputBuffer.getChannelData(0));
    this.source.connect(this.processor);
    this.processor.connect(this.silenceGain);
    this.silenceGain.connect(this.context.destination);
    this.running = true;
  }

  capture(frame) {
    if (!this.running) return;
    const copy = Float32Array.from(frame);
    this.buffers.push(copy);
    this.bufferedSamples += copy.length;
    const needed = this.context.sampleRate * CHUNK_SECONDS;
    if (this.bufferedSamples < needed) return;
    if (!this.workerReady || this.workerBusy) {
      this.buffers = [];
      this.bufferedSamples = 0;
      return;
    }

    const joined = new Float32Array(this.bufferedSamples);
    let offset = 0;
    for (const chunk of this.buffers) {
      joined.set(chunk, offset);
      offset += chunk.length;
    }
    this.buffers = [];
    this.bufferedSamples = 0;

    if (rms(joined) < MIN_RMS) return;
    const samples = downsample(joined, this.context.sampleRate, TARGET_RATE);
    this.workerBusy = true;
    this.worker?.postMessage({ type: 'transcribe', samples }, [samples.buffer]);
  }

  handleWorkerMessage(message) {
    if (!message || typeof message !== 'object') return;
    if (message.type === 'ready') {
      this.workerReady = true;
      this.onStatus('ACTIVE', 'Listening for Start, Pause, Resume, Again');
      return;
    }
    if (message.type === 'error') {
      this.workerBusy = false;
      this.workerReady = false;
      this.stop(true);
      this.onStatus('ERROR', message.message || 'Local voice model failed.');
      return;
    }
    if (message.type === 'transcript') {
      this.workerBusy = false;
      const intent = mapTranscript(message.text, this.getMode());
      if (!intent) return;
      this.onCandidate({
        intent,
        source: 'voice',
        confidence: 0.82,
        timestamp: Date.now(),
        rawLabel: String(message.text || '').trim().slice(0, 80)
      });
    }
  }

  async stop(silent = false) {
    this.running = false;
    if (this.processor) this.processor.onaudioprocess = null;
    try { this.source?.disconnect(); } catch { /* no-op */ }
    try { this.processor?.disconnect(); } catch { /* no-op */ }
    try { this.silenceGain?.disconnect(); } catch { /* no-op */ }
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.buffers = [];
    this.bufferedSamples = 0;
    this.workerBusy = false;
    this.workerReady = false;
    this.disposeWorker();
    if (this.context) {
      try { await this.context.close(); } catch { /* no-op */ }
    }
    this.context = null;
    if (!silent) this.onStatus('OFF', '');
  }

  disposeWorker() {
    this.worker?.terminate();
    this.worker = null;
  }
}
