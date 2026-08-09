export const SOURCES = {
  bierstadt: {
    label: 'Albert Bierstadt — Emigrants Crossing the Plains (1869)',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Emigrants_Crossing_the_Plains%2C_or_The_Oregon_Trail_%28Albert_Bierstadt%29%2C_1869.jpg',
    page: 'https://commons.wikimedia.org/wiki/File:Emigrants_Crossing_the_Plains,_or_The_Oregon_Trail_(Albert_Bierstadt),_1869.jpg',
  },
  palmer: {
    label: 'Fanny Palmer / Currier & Ives — The Rocky Mountains (1866)',
    image: 'https://cdn.loc.gov/service/pnp/pga/00800/00894v.jpg',
    page: 'https://www.loc.gov/pictures/item/92504636/',
  },
};

export const DEFAULT_VISUAL_STATE = Object.freeze({
  source: 'bierstadt',
  timeOfDay: 'golden',
  weather: 'clear',
  travelSpeed: 1,
  wind: 0.45,
  atmosphere: 0.68,
  paused: false,
  elapsed: 0,
});

export class VisualStateStore extends EventTarget {
  constructor(initial = {}) {
    super();
    this.state = { ...DEFAULT_VISUAL_STATE, ...initial };
  }

  get snapshot() {
    return { ...this.state };
  }

  set(patch, { silent = false } = {}) {
    this.state = { ...this.state, ...patch };
    if (!silent) this.dispatchEvent(new CustomEvent('change', { detail: this.snapshot }));
  }

  reset() {
    this.state = { ...DEFAULT_VISUAL_STATE };
    this.dispatchEvent(new CustomEvent('change', { detail: this.snapshot }));
  }
}

export class SharedVisualClock {
  constructor(store) {
    this.store = store;
    this.last = performance.now();
    this.running = false;
    this.listeners = new Set();
    this.frameHandle = 0;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.last = performance.now();
    const tick = (now) => {
      if (!this.running) return;
      const rawDelta = Math.min(0.05, Math.max(0, (now - this.last) / 1000));
      this.last = now;
      const state = this.store.state;
      const delta = state.paused ? 0 : rawDelta;
      if (delta) this.store.state.elapsed += delta;
      const snapshot = this.store.snapshot;
      for (const listener of this.listeners) listener(delta, snapshot, now);
      this.frameHandle = requestAnimationFrame(tick);
    };
    this.frameHandle = requestAnimationFrame(tick);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frameHandle);
  }
}
