export class IntentGate {
  constructor({
    voiceThreshold = 0.55,
    gestureThreshold = 0.72,
    gestureDwellMs = 600,
    cooldownMs = 1100,
    onAccepted = () => {},
    onIgnored = () => {}
  } = {}) {
    this.voiceThreshold = voiceThreshold;
    this.gestureThreshold = gestureThreshold;
    this.gestureDwellMs = gestureDwellMs;
    this.cooldownMs = cooldownMs;
    this.onAccepted = onAccepted;
    this.onIgnored = onIgnored;
    this.lastAcceptedAt = 0;
    this.gestureCandidate = null;
  }

  resetGesture() {
    this.gestureCandidate = null;
  }

  offer(candidate) {
    const now = Number(candidate?.timestamp) || Date.now();
    if (candidate?.source === 'gesture' && !candidate?.intent) {
      this.resetGesture();
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
      if ((candidate.confidence ?? 0) < this.gestureThreshold) {
        this.resetGesture();
        this.onIgnored({ ...candidate, reason: 'low-confidence' });
        return false;
      }
      const key = `${candidate.rawLabel || ''}:${candidate.intent}`;
      if (!this.gestureCandidate || this.gestureCandidate.key !== key) {
        this.gestureCandidate = { key, startedAt: now, candidate };
        return false;
      }
      this.gestureCandidate.candidate = candidate;
      if (now - this.gestureCandidate.startedAt < this.gestureDwellMs) return false;
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
