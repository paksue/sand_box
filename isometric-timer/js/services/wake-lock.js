export class WakeLockService {
  constructor(onStatus = () => {}) {
    this.lock = null;
    this.onStatus = onStatus;
  }

  async request() {
    if (document.visibilityState !== 'visible') return 'released';
    if (!('wakeLock' in navigator)) {
      this.onStatus('unsupported');
      return 'unsupported';
    }
    if (this.lock && !this.lock.released) {
      this.onStatus('active');
      return 'active';
    }
    try {
      const lock = await navigator.wakeLock.request('screen');
      this.lock = lock;
      this.onStatus('active');
      lock.addEventListener('release', () => {
        if (this.lock === lock) this.lock = null;
        this.onStatus('released');
      }, { once: true });
      return 'active';
    } catch {
      this.lock = null;
      this.onStatus('failed');
      return 'failed';
    }
  }

  async release() {
    const lock = this.lock;
    this.lock = null;
    this.onStatus('idle');
    if (lock && !lock.released) {
      try { await lock.release(); } catch { /* best effort */ }
    }
  }
}
