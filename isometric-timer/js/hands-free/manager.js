import { IntentGate } from './intent-gate.js';

const VALID_STATUS = new Set(['OFF', 'LOADING', 'READY', 'ACTIVE', 'PERMISSION_DENIED', 'ERROR']);

export class HandsFreeManager {
  constructor({ getMode, onIntent, onStateChange, adapterFactories = {} }) {
    this.getMode = getMode;
    this.onIntent = onIntent;
    this.onStateChange = onStateChange;
    this.adapterFactories = adapterFactories;
    this.adapters = { voice: null, gesture: null };
    this.enabled = { voice: false, gesture: false };
    this.status = {
      voice: { status: 'OFF', message: '' },
      gesture: { status: 'OFF', message: '' }
    };
    this.gate = new IntentGate({
      onAccepted: (candidate) => this.onIntent(candidate),
      onIgnored: (candidate) => this.onStateChange?.({ ignored: candidate })
    });
  }

  snapshot() {
    return {
      voice: { ...this.status.voice },
      gesture: { ...this.status.gesture }
    };
  }

  setStatus(kind, status, message = '') {
    this.status[kind] = { status: VALID_STATUS.has(status) ? status : 'ERROR', message };
    this.onStateChange?.({ kind, state: this.snapshot() });
  }

  candidate(candidate) {
    this.gate.offer(candidate);
  }

  async enable(kind) {
    if (!['voice', 'gesture'].includes(kind)) return false;
    this.enabled[kind] = true;
    if (this.adapters[kind]) return true;
    this.setStatus(kind, 'LOADING', kind === 'voice' ? 'Loading local voice model…' : 'Loading gesture controls…');
    try {
      let adapter;
      if (typeof this.adapterFactories[kind] === 'function') {
        adapter = this.adapterFactories[kind]({
          onCandidate: (candidate) => this.candidate(candidate),
          onStatus: (status, message) => this.setStatus(kind, status, message),
          getMode: this.getMode
        });
      } else {
        const module = kind === 'voice'
          ? await import('./voice-adapter.js')
          : await import('./gesture-adapter.js');
        const Adapter = kind === 'voice' ? module.VoiceAdapter : module.GestureAdapter;
        adapter = new Adapter({
          onCandidate: (candidate) => this.candidate(candidate),
          onStatus: (status, message) => this.setStatus(kind, status, message),
          getMode: this.getMode
        });
      }
      this.adapters[kind] = adapter;
      await adapter.start();
      if (this.status[kind].status === 'LOADING') this.setStatus(kind, 'ACTIVE', 'Ready');
      return true;
    } catch {
      if (!['PERMISSION_DENIED', 'ERROR'].includes(this.status[kind].status)) this.setStatus(kind, 'ERROR', 'Hands-free control could not start.');
      this.enabled[kind] = false;
      this.adapters[kind] = null;
      return false;
    }
  }

  async disable(kind, { preservePreference = false } = {}) {
    if (!['voice', 'gesture'].includes(kind)) return;
    if (!preservePreference) this.enabled[kind] = false;
    const adapter = this.adapters[kind];
    this.adapters[kind] = null;
    if (adapter) {
      try { await adapter.stop(); } catch { /* best effort */ }
    }
    this.setStatus(kind, 'OFF', '');
    this.gate.resetGesture();
  }

  async handleVisibility(visibility) {
    if (visibility === 'hidden') {
      for (const kind of ['voice', 'gesture']) {
        if (this.enabled[kind]) await this.disable(kind, { preservePreference: true });
      }
      return;
    }
    for (const kind of ['voice', 'gesture']) {
      if (this.enabled[kind] && !this.adapters[kind]) await this.enable(kind);
    }
  }

  async dispose() {
    this.enabled.voice = false;
    this.enabled.gesture = false;
    await Promise.all([this.disable('voice'), this.disable('gesture')]);
  }
}
