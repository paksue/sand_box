import { PREP_MS } from '../domain/timer-machine.js';

export class AudioCueService {
  constructor() {
    this.context = null;
    this.nodes = [];
    this.generationGain = null;
  }

  async arm() {
    const Ctor = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!Ctor) return false;
    if (!this.context) this.context = new Ctor();
    try {
      if (this.context.state === 'suspended') await this.context.resume();
    } catch {
      return false;
    }
    return this.context.state === 'running';
  }

  cancel() {
    if (this.generationGain && this.context) {
      try {
        const now = this.context.currentTime;
        this.generationGain.gain.cancelScheduledValues(now);
        this.generationGain.gain.setValueAtTime(0, now);
      } catch { /* best effort */ }
    }
    for (const node of this.nodes) {
      try { node.stop(); } catch { /* ended */ }
      try { node.disconnect(); } catch { /* ended */ }
    }
    this.nodes = [];
    this.generationGain = null;
  }

  tone(offsetSeconds, frequency, durationSeconds = 0.08, volume = 0.17) {
    if (!this.context || this.context.state !== 'running' || !this.generationGain) return;
    const startAt = this.context.currentTime + Math.max(0.015, offsetSeconds);
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, volume), startAt + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durationSeconds);
    oscillator.connect(gain);
    gain.connect(this.generationGain);
    oscillator.start(startAt);
    oscillator.stop(startAt + durationSeconds + 0.03);
    this.nodes.push(oscillator);
    oscillator.addEventListener('ended', () => {
      this.nodes = this.nodes.filter((item) => item !== oscillator);
      try { oscillator.disconnect(); } catch { /* no-op */ }
      try { gain.disconnect(); } catch { /* no-op */ }
    }, { once: true });
  }

  scheduleFinalCountdown(holdMs, offsetSeconds = 0) {
    const totalSeconds = Math.max(0, holdMs / 1000);
    for (let remaining = 5; remaining >= 1; remaining -= 1) {
      const at = totalSeconds - remaining;
      if (at >= 0.04) this.tone(offsetSeconds + at, 760, 0.065, 0.13);
    }
    this.tone(offsetSeconds + totalSeconds, 1050, 0.34, 0.22);
    this.tone(offsetSeconds + totalSeconds + 0.18, 1320, 0.24, 0.13);
  }

  schedule(timer, { soundEnabled, freshPreparation = false } = {}) {
    this.cancel();
    if (!soundEnabled || !this.context || this.context.state !== 'running') return;
    this.generationGain = this.context.createGain();
    this.generationGain.gain.setValueAtTime(1, this.context.currentTime);
    this.generationGain.connect(this.context.destination);

    if (timer.mode === 'PREPARE') {
      const prepRemainingMs = Math.max(0, (timer.phaseEndAt ?? Date.now()) - Date.now());
      const prepOffset = prepRemainingMs / 1000;
      if (freshPreparation && prepRemainingMs > PREP_MS - 500) {
        this.tone(0, 520, 0.075, 0.12);
        this.tone(1, 580, 0.075, 0.12);
        this.tone(2, 650, 0.075, 0.13);
      }
      this.tone(prepOffset, 920, 0.18, 0.19);
      this.scheduleFinalCountdown(timer.pendingHoldMs, prepOffset);
    } else if (timer.mode === 'HOLD') {
      this.scheduleFinalCountdown(Math.max(0, (timer.phaseEndAt ?? Date.now()) - Date.now()), 0);
    }
  }
}
