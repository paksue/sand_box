export class IntentGate {
  constructor({
    voiceThreshold = 0.55,
    gestureThreshold = 0.72,
    gestureThresholdByLabel = {
      Open_Palm: 0.60,
      Hold_Start: 0.75,
      Hold_Pause: 0.75
    },
    gestureDwellMs = 600,
    gestureDwellByLabel = {
      Open_Palm: 420,
      Hold_Start: 500,
      Hold_Pause: 400
    },
    gestureDropoutGraceMs = 300,
    cooldownMs = 1100,
    onAccepted = () => {},
    onIgnored = () => {}
  } = {}) {
    this.voiceThreshold = voiceThreshold;
    this.gestureThreshold = gestureThreshold;
    this.gestureThresholdByLabel = { ...gestureThresholdByLabel };
    this.gestureDwellMs = gestureDwellMs;
    this.gestureDwellByLabel = { ...gestureDwellByLabel };
    this.gestureDropoutGraceMs = gestureDropoutGraceMs;
    this.cooldownMs = cooldownMs;
    this.onAccepted = onAccepted;
    this.onIgnored = onIgnored;
    this.lastAcceptedAt = 0;
    this.gestureCandidate = null;
  }

  resetGesture() {
    this.gestureCandidate = null;
  }

  gestureThresholdFor(candidate) {
    return this.gestureThresholdByLabel[candidate?.rawLabel] ?? this.gestureThreshold;
  }

  gestureDwellFor(candidate) {
    return this.gestureDwellByLabel[candidate?.rawLabel] ?? this.gestureDwellMs;
  }

  withinGestureGrace(now) {
    return Boolean(this.gestureCandidate && now - this.gestureCandidate.lastSeenAt <= this.gestureDropoutGraceMs);
  }

  offer(candidate) {
    const now = Number(candidate?.timestamp) || Date.now();

    if (candidate?.source === 'gesture' && !candidate?.intent) {
      if (!this.withinGestureGrace(now)) this.resetGesture();
      return false;
    }
    if (!candidate?.intent) return false;
    if (now - this.lastAcceptedAt < this.cooldownMs) {
      this.onIgnored({ ...candidate, reason: 'cooldown' });
      return false;
    }

    if (candidate.source === 'voice') {
      if ((candidate.confidence ?? 1) < this.voiceThreshold) {
        this.onIgnored({ ...candidate, reason: 'low-confidence' });
        return false;
      }
      this.lastAcceptedAt = now;
      this.onAccepted(candidate);
      return true;
    }

    if (candidate.source === 'gesture') {
      const key = `${candidate.rawLabel || ''}:${candidate.intent}`;
      const threshold = this.gestureThresholdFor(candidate);

      if ((candidate.confidence ?? 0) < threshold) {
        if (!this.gestureCandidate || this.gestureCandidate.key !== key || !this.withinGestureGrace(now)) {
          this.resetGesture();
        }
        this.onIgnored({ ...candidate, reason: 'low-confidence' });
        return false;
      }

      if (!this.gestureCandidate || this.gestureCandidate.key !== key) {
        this.gestureCandidate = { key, startedAt: now, lastSeenAt: now, candidate };
        return false;
      }

      if (now - this.gestureCandidate.lastSeenAt > this.gestureDropoutGraceMs) {
        this.gestureCandidate = { key, startedAt: now, lastSeenAt: now, candidate };
        return false;
      }

      this.gestureCandidate.lastSeenAt = now;
      this.gestureCandidate.candidate = candidate;
      if (now - this.gestureCandidate.startedAt < this.gestureDwellFor(candidate)) return false;

      this.lastAcceptedAt = now;
      const accepted = this.gestureCandidate.candidate;
      this.resetGesture();
      this.onAccepted(accepted);
      return true;
    }

    this.lastAcceptedAt = now;
    this.onAccepted(candidate);
    return true;
  }
}
