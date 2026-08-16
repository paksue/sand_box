import { equal, assert } from './assert.js';
import { PersistenceRepository } from '../js/services/persistence.js';
import { STORAGE_KEYS } from '../js/state/schema.js';

class FakeStorage {
  constructor() { this.map = new Map(); }
  getItem(key) { return this.map.has(key) ? this.map.get(key) : null; }
  setItem(key, value) { this.map.set(key, String(value)); }
  removeItem(key) { this.map.delete(key); }
}

export async function runPersistenceTests() {
  const storage = new FakeStorage();
  storage.setItem(STORAGE_KEYS.V1, JSON.stringify({
    mode: 'READY',
    durationMs: 45000,
    soundEnabled: false
  }));
  const repo = new PersistenceRepository(storage);
  const loaded = repo.loadAll();
  equal(loaded.core.durationMs, 45000);
  equal(loaded.settings.quickHoldSeconds, 45);
  equal(loaded.settings.soundEnabled, false);
  assert(storage.getItem(STORAGE_KEYS.CORE), 'Migration should write V2 core state');
  assert(storage.getItem(STORAGE_KEYS.SETTINGS), 'Migration should write V2 settings');
}
