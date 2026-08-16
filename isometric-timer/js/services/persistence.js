import { migrateV1 } from '../state/migrations.js';
import { STORAGE_KEYS, normalizeSettings } from '../state/schema.js';
import { createTimerState, normalizeTimerState } from '../domain/timer-machine.js';
import { createTrainingState, normalizeTrainingState } from '../domain/training.js';

function safeParse(value) {
  if (!value) return null;
  try { return JSON.parse(value); } catch { return null; }
}

export class PersistenceRepository {
  constructor(storage = globalThis.localStorage) {
    this.storage = storage;
  }

  get(key) {
    try { return safeParse(this.storage?.getItem(key)); } catch { return null; }
  }

  set(key, value) {
    try {
      this.storage?.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  }

  remove(key) {
    try { this.storage?.removeItem(key); } catch { /* storage optional */ }
  }

  loadAll() {
    const coreRaw = this.get(STORAGE_KEYS.CORE);
    const settingsRaw = this.get(STORAGE_KEYS.SETTINGS);
    const trainingRaw = this.get(STORAGE_KEYS.TRAINING);

    if (coreRaw || settingsRaw || trainingRaw) {
      const settings = normalizeSettings(settingsRaw);
      return {
        core: normalizeTimerState(coreRaw || createTimerState(settings.quickHoldSeconds * 1000), settings.quickHoldSeconds * 1000),
        settings,
        training: normalizeTrainingState(trainingRaw || createTrainingState())
      };
    }

    const v1 = this.get(STORAGE_KEYS.V1);
    const migrated = migrateV1(v1);
    this.saveAll(migrated);
    return migrated;
  }

  saveCore(core) { return this.set(STORAGE_KEYS.CORE, { ...core, version: 2 }); }
  saveSettings(settings) { return this.set(STORAGE_KEYS.SETTINGS, { ...settings, version: 2 }); }
  saveTraining(training) { return this.set(STORAGE_KEYS.TRAINING, { ...training, version: 2 }); }

  saveAll({ core, settings, training }) {
    this.saveCore(core);
    this.saveSettings(settings);
    this.saveTraining(training);
  }
}
