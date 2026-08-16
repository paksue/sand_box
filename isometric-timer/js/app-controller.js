import { createIntent, INTENTS, isIntentAllowed } from './domain/commands.js';
import { reconcileTimer, setTimerDuration, transitionTimer } from './domain/timer-machine.js';
import { getExercise } from './domain/exercise-catalog.js';
import { applyDifficultyFeedback, recordCompletedSession, selectExercise, setExerciseTarget } from './domain/training.js';
import { createAppState } from './state/app-state.js';
import { DeadlineClock } from './services/clock.js';
import { PersistenceRepository } from './services/persistence.js';
import { AudioCueService } from './services/audio.js';
import { WakeLockService } from './services/wake-lock.js';
import { completionVibration } from './services/vibration.js';
import { subscribeVisibility } from './services/visibility.js';
import { HandsFreeManager } from './hands-free/manager.js';
import { renderApp, refreshSheets } from './ui/render.js';
import { announce } from './ui/accessibility.js';

function activeMode(mode) {
  return mode === 'PREPARE' || mode === 'HOLD';
}

export class AppController {
  constructor(elements) {
    this.elements = elements;
    this.repository = new PersistenceRepository();
    this.clock = new DeadlineClock();
    this.audio = new AudioCueService();
    this.state = createAppState(this.repository.loadAll());
    this.lastRenderedMode = null;
    this.frameId = null;
    this.visibilityUnsubscribe = null;
    this.wake = new WakeLockService((status) => {
      this.state.wakeStatus = status;
      this.render();
    });
    this.handsFree = new HandsFreeManager({
      getMode: () => this.state.timer.mode,
      onIntent: (candidate) => this.dispatch(candidate),
      onStateChange: () => {
        this.state.handsFree = { ...this.state.handsFree, ...this.handsFree.snapshot() };
        this.render();
      }
    });
  }

  init() {
    // Never request camera/mic automatically after a reload. Hands-free must be re-enabled explicitly.
    if (this.state.settings.handsFree.voiceEnabled || this.state.settings.handsFree.gestureEnabled) {
      this.state.settings.handsFree.voiceEnabled = false;
      this.state.settings.handsFree.gestureEnabled = false;
      this.repository.saveSettings(this.state.settings);
    }

    this.state.training = selectExercise(this.state.training, this.state.settings.selectedExerciseId);
    this.reconcile({ recovered: true });
    this.clock.sync(this.state.timer);
    this.visibilityUnsubscribe = subscribeVisibility((visibility) => this.handleVisibility(visibility));
    if (activeMode(this.state.timer.mode)) this.wake.request();
    this.render(true);
    this.loop();
  }

  dispose() {
    if (this.frameId) cancelAnimationFrame(this.frameId);
    this.visibilityUnsubscribe?.();
    this.handsFree.dispose();
    this.wake.release();
    this.audio.cancel();
  }

  selectedExercise() {
    return getExercise(this.state.training.selectedExerciseId);
  }

  selectedTargetSeconds() {
    const exercise = this.selectedExercise();
    if (exercise.id === 'quick-hold') return this.state.settings.quickHoldSeconds;
    return this.state.training.targets[exercise.id] || exercise.defaultTargetSeconds;
  }

  persistCore() { this.repository.saveCore(this.state.timer); }
  persistSettings() { this.repository.saveSettings(this.state.settings); }
  persistTraining() { this.repository.saveTraining(this.state.training); }

  async dispatch(envelope) {
    if (!envelope?.intent || !isIntentAllowed(this.state.timer.mode, envelope.intent)) return false;
    if (this.state.settings.soundEnabled && ['touch', 'keyboard'].includes(envelope.source)) await this.audio.arm();

    const enriched = {
      ...envelope,
      exerciseId: this.state.training.selectedExerciseId
    };
    const now = activeMode(this.state.timer.mode) ? this.clock.domainNow(this.state.timer) : Date.now();
    const result = transitionTimer(this.state.timer, enriched, now);
    if (!result.accepted) return false;

    const previousMode = this.state.timer.mode;
    this.state.timer = result.state;
    this.clock.sync(this.state.timer);
    this.persistCore();
    await this.applyTimerEffects(result.effects, { previousMode, recovered: false });
    this.render(true);
    return true;
  }

  async applyTimerEffects(effects, { previousMode, recovered }) {
    for (const effect of effects) {
      if (effect.type === 'PHASE_STARTED') {
        await this.wake.request();
        const shouldReschedule = effect.phase === 'PREPARE' || recovered;
        if (this.state.settings.soundEnabled && shouldReschedule) {
          this.audio.schedule(this.state.timer, { soundEnabled: true, freshPreparation: Boolean(effect.fresh) });
        }
      }
      if (effect.type === 'PAUSED' || effect.type === 'RESET') {
        this.audio.cancel();
        await this.wake.release();
      }
      if (effect.type === 'SESSION_COMPLETE') {
        if (recovered || effect.recovered) this.audio.cancel();
        await this.wake.release();
        this.recordCurrentCompletion();
        if (!recovered && !effect.recovered) completionVibration();
      }
    }

    if (previousMode !== this.state.timer.mode) announce(this.elements.phaseAnnouncer, this.state.timer.mode === 'HOLD' ? 'Hold' : this.state.timer.mode.toLowerCase());
  }

  recordCurrentCompletion() {
    const timer = this.state.timer;
    if (!timer.sessionId) return;
    const session = {
      sessionId: timer.sessionId,
      exerciseId: timer.exerciseId || this.state.training.selectedExerciseId,
      targetDurationSeconds: Math.round(timer.durationMs / 1000),
      completedDurationSeconds: Math.round(timer.durationMs / 1000),
      completedAt: timer.completedAt || Date.now(),
      completionReason: timer.completionReason || 'timer-complete',
      difficultyFeedback: null,
      recommendedNextTarget: null,
      initiatingInputSource: timer.initiatingSource || 'touch'
    };
    this.state.training = recordCompletedSession(this.state.training, session);
    this.persistTraining();
  }

  reconcile({ recovered = true } = {}) {
    const previousMode = this.state.timer.mode;
    const result = reconcileTimer(this.state.timer, Date.now());
    if (!result.changed) return false;
    this.state.timer = result.state;
    this.clock.sync(this.state.timer);
    this.persistCore();
    // Recovered lifecycle effects are intentionally fire-and-forget; timer correctness never waits on them.
    this.applyTimerEffects(result.effects, { previousMode, recovered });
    return true;
  }

  async handleVisibility(visibility) {
    if (visibility === 'hidden') {
      this.persistCore();
      this.clock.clear();
      await this.handsFree.handleVisibility('hidden');
      return;
    }

    this.reconcile({ recovered: true });
    this.clock.sync(this.state.timer);
    if (activeMode(this.state.timer.mode)) {
      await this.wake.request();
      if (this.state.settings.soundEnabled) this.audio.schedule(this.state.timer, { soundEnabled: true });
    }
    await this.handsFree.handleVisibility('visible');
    this.render(true);
  }

  async toggleSound() {
    this.state.settings.soundEnabled = !this.state.settings.soundEnabled;
    this.persistSettings();
    if (!this.state.settings.soundEnabled) this.audio.cancel();
    else {
      await this.audio.arm();
      if (activeMode(this.state.timer.mode)) this.audio.schedule(this.state.timer, { soundEnabled: true });
    }
    this.render(true);
  }

  setDurationSeconds(seconds) {
    if (!['READY', 'DONE'].includes(this.state.timer.mode)) return;
    const safe = Math.min(300, Math.max(5, Math.round(Number(seconds) || 30)));
    const exercise = this.selectedExercise();
    if (exercise.id === 'quick-hold') {
      this.state.settings.quickHoldSeconds = safe;
      this.persistSettings();
    } else {
      this.state.training = setExerciseTarget(this.state.training, exercise.id, safe);
      this.persistTraining();
    }
    this.state.timer = setTimerDuration(this.state.timer, safe * 1000);
    this.persistCore();
    this.clock.sync(this.state.timer);
    this.render(true);
  }

  chooseExercise(exerciseId) {
    if (this.state.timer.mode !== 'READY') return;
    this.state.training = selectExercise(this.state.training, exerciseId);
    this.state.settings.selectedExerciseId = this.state.training.selectedExerciseId;
    const target = this.selectedTargetSeconds();
    this.state.timer = setTimerDuration(this.state.timer, target * 1000);
    this.state.timer = { ...this.state.timer, exerciseId: this.state.training.selectedExerciseId };
    this.persistSettings();
    this.persistTraining();
    this.persistCore();
    this.render(true);
  }

  applyFeedback(feedback) {
    if (this.state.timer.mode !== 'DONE') return;
    const exercise = this.selectedExercise();
    if (!exercise.progressive) return;
    this.state.training = applyDifficultyFeedback(this.state.training, exercise.id, feedback);
    const next = this.state.training.targets[exercise.id];
    this.state.timer = setTimerDuration(this.state.timer, next * 1000);
    this.persistTraining();
    this.persistCore();
    this.render(true);
  }

  async setHandsFree(kind, enabled) {
    if (!['voice', 'gesture'].includes(kind)) return false;
    await this.audio.arm(); // The settings tap is a user gesture; arm future exercise cues here too.
    if (enabled) {
      this.state.settings.handsFree[`${kind}Enabled`] = true;
      this.persistSettings();
      const ok = await this.handsFree.enable(kind);
      if (!ok) {
        this.state.settings.handsFree[`${kind}Enabled`] = false;
        this.persistSettings();
      }
      this.state.handsFree = { ...this.state.handsFree, ...this.handsFree.snapshot() };
      this.render(true);
      return ok;
    }

    this.state.settings.handsFree[`${kind}Enabled`] = false;
    this.persistSettings();
    await this.handsFree.disable(kind);
    this.state.handsFree = { ...this.state.handsFree, ...this.handsFree.snapshot() };
    this.render(true);
    return true;
  }

  currentMainIntent(source = 'touch') {
    const mode = this.state.timer.mode;
    if (mode === 'READY') return createIntent(INTENTS.START, source);
    if (mode === 'PREPARE') return createIntent(INTENTS.CANCEL_PREPARE, source);
    if (mode === 'HOLD') return createIntent(INTENTS.PAUSE, source);
    if (mode === 'PAUSED') return createIntent(INTENTS.RESUME, source);
    if (mode === 'DONE') return createIntent(INTENTS.REPEAT, source);
    return null;
  }

  async mainAction(source = 'touch') {
    const intent = this.currentMainIntent(source);
    if (intent) await this.dispatch(intent);
  }

  async reset(source = 'touch') {
    if (this.state.timer.mode === 'READY') return;
    await this.dispatch(createIntent(INTENTS.RESET, source));
  }

  loop() {
    if (activeMode(this.state.timer.mode) && this.clock.remaining(this.state.timer) <= 0) {
      const previousMode = this.state.timer.mode;
      const result = reconcileTimer(this.state.timer, this.clock.domainNow(this.state.timer));
      if (result.changed) {
        this.state.timer = result.state;
        this.clock.sync(this.state.timer);
        this.persistCore();
        this.applyTimerEffects(result.effects, { previousMode, recovered: false });
      }
    }
    this.render(false);
    this.frameId = requestAnimationFrame(() => this.loop());
  }

  render(force = false) {
    renderApp(this.elements, this.state, this.clock);
    if (force) refreshSheets(this.elements, this.state);
    if (this.lastRenderedMode !== this.state.timer.mode) {
      this.lastRenderedMode = this.state.timer.mode;
      refreshSheets(this.elements, this.state);
    }
  }
}
