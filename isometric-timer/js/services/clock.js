export class DeadlineClock {
  constructor({ wallNow = () => Date.now(), perfNow = () => performance.now() } = {}) {
    this.wallNow = wallNow;
    this.perfNow = perfNow;
    this.syncedWallDeadline = null;
    this.perfDeadline = null;
  }

  sync(timer) {
    if ((timer.mode === 'PREPARE' || timer.mode === 'HOLD') && Number.isFinite(timer.phaseEndAt)) {
      this.syncedWallDeadline = timer.phaseEndAt;
      this.perfDeadline = this.perfNow() + Math.max(0, timer.phaseEndAt - this.wallNow());
    } else {
      this.syncedWallDeadline = null;
      this.perfDeadline = null;
    }
  }

  clear() {
    this.syncedWallDeadline = null;
    this.perfDeadline = null;
  }

  remaining(timer) {
    if (timer.mode === 'PAUSED') return Math.max(0, timer.pausedHoldMs || 0);
    if (timer.mode !== 'PREPARE' && timer.mode !== 'HOLD') return 0;
    if (!Number.isFinite(timer.phaseEndAt)) return 0;
    if (document.visibilityState === 'visible' && this.syncedWallDeadline === timer.phaseEndAt && Number.isFinite(this.perfDeadline)) {
      return Math.max(0, this.perfDeadline - this.perfNow());
    }
    return Math.max(0, timer.phaseEndAt - this.wallNow());
  }

  domainNow(timer) {
    if ((timer.mode === 'PREPARE' || timer.mode === 'HOLD') && Number.isFinite(timer.phaseEndAt)) {
      return timer.phaseEndAt - this.remaining(timer);
    }
    return this.wallNow();
  }
}
