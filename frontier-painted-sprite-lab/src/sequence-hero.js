const Phaser = window.Phaser;
const spineRuntime = window.spine;

const stateEl = document.querySelector('#sequenceState');
const stageEl = document.querySelector('#sequenceHeroStage');
const clipEl = document.querySelector('#sequenceClip');
const timeEl = document.querySelector('#sequenceTime');
const runtimeEl = document.querySelector('#sequenceRuntime');
const attachmentsEl = document.querySelector('#sequenceAttachments');
const impactsEl = document.querySelector('#sequenceImpacts');
const bonesEl = document.querySelector('#sequenceBones');
const ikEl = document.querySelector('#sequenceIK');
const phaseEl = document.querySelector('#sequencePhase');

const BASE = './assets/frontier-hero/runtime-preview/';
const FILES = {
  skeleton: `${BASE}frontier-hero-preview.json`,
  atlas: `${BASE}frontier-hero-preview.atlas`,
};

const IK_TARGETS = ['front_near_ik', 'front_far_ik', 'hind_near_ik', 'hind_far_ik'];

class PaintedSequenceScene extends Phaser.Scene {
  constructor() {
    super('PaintedSequence');
    this.hero = null;
    this.currentClip = 'idle_alive';
    this.speed = 1;
    this.paused = false;
    this.impactCount = 0;
    this.lastEvent = '—';
    this.gaitPhase = '—';
  }

  preload() {
    this.load.spineSkeleton('frontier-sequence-data', FILES.skeleton);
    this.load.spineAtlas('frontier-sequence-atlas', FILES.atlas);
  }

  create() {
    this.hero = this.add.spine(470, 420, 'frontier-sequence-data', 'frontier-sequence-atlas', { renderer: 'phaser' });
    this.hero.setScale(2.8);
    this.hero.setDepth(10);

    this.hero.animationStateData.defaultMix = 0.08;
    this.hero.animationStateData.setMix('idle_alive', 'walk', 0.12);
    this.hero.animationStateData.setMix('walk', 'idle_alive', 0.12);
    this.hero.animationStateData.setMix('rear_action', 'land_step', 0.06);
    this.hero.animationStateData.setMix('land_step', 'idle_alive', 0.12);

    this.hero.animationState.addListener({
      event: (_entry, event) => {
        const name = event?.data?.name || '—';
        this.lastEvent = name;
        if (name.startsWith('walk_')) {
          this.gaitPhase = name.replace('walk_', '').replaceAll('_', ' ');
          if (phaseEl) phaseEl.textContent = this.gaitPhase;
        }
        if (name === 'impact') {
          this.impactCount += 1;
          impactsEl.textContent = String(this.impactCount);
          this.cameras.main.shake(55, .00075);
        }
      }
    });

    this.play('land_step');
    stageEl.dataset.ready = 'true';
    stateEl.textContent = 'painted corrective poses · 34-bone / 4-IK gait rig';
    runtimeEl.textContent = `Phaser ${Phaser.VERSION} + Spine 4.3`;
    attachmentsEl.textContent = '9';
    if (bonesEl) bonesEl.textContent = String(this.hero.skeleton?.bones?.length || 0);
    if (ikEl) ikEl.textContent = String(this.hero.skeleton?.data?.ikConstraints?.length || 0);

    this.bindControls();

    window.sequenceHeroPOC = {
      play: (name) => this.play(name),
      setSpeed: (speed) => this.setSpeed(speed),
      snapshot: () => this.snapshot(),
    };
  }

  play(name) {
    if (!this.hero) return;
    const loop = name === 'idle_alive' || name === 'walk';
    this.currentClip = name;
    this.gaitPhase = name === 'walk' ? 'contact near' : '—';
    if (phaseEl) phaseEl.textContent = this.gaitPhase;
    this.hero.animationState.setAnimation(0, name, loop);
    this.hero.animationState.timeScale = this.speed;
    this.paused = false;
    clipEl.textContent = name;
    document.querySelector('#sequencePause').textContent = 'Pause';
    document.querySelectorAll('[data-sequence-clip]').forEach((b) => b.classList.toggle('active', b.dataset.sequenceClip === name));
  }

  setSpeed(speed) {
    this.speed = speed;
    if (this.hero && !this.paused) this.hero.animationState.timeScale = speed;
  }

  bindControls() {
    document.querySelectorAll('[data-sequence-clip]').forEach((button) => {
      button.addEventListener('click', () => this.play(button.dataset.sequenceClip));
    });
    document.querySelectorAll('.sequence-speed').forEach((button) => {
      button.addEventListener('click', () => {
        this.setSpeed(Number(button.dataset.speed));
        document.querySelectorAll('.sequence-speed').forEach((b) => b.classList.toggle('active', b === button));
      });
    });
    document.querySelector('#sequenceReplay').addEventListener('click', () => this.play(this.currentClip));
    document.querySelector('#sequencePause').addEventListener('click', (event) => {
      this.paused = !this.paused;
      this.hero.animationState.timeScale = this.paused ? 0 : this.speed;
      event.currentTarget.textContent = this.paused ? 'Resume' : 'Pause';
    });
  }

  currentEntry() {
    return this.hero?.animationState?.tracks?.[0] || null;
  }

  ikTargetSnapshot() {
    const skeleton = this.hero?.skeleton;
    if (!skeleton) return {};
    return Object.fromEntries(IK_TARGETS.map((name) => {
      const bone = skeleton.findBone(name);
      const pose = bone?.appliedPose;
      return [name, pose ? {
        x: Number((pose.worldX || 0).toFixed(2)),
        y: Number((pose.worldY || 0).toFixed(2)),
      } : null];
    }));
  }

  snapshot() {
    const entry = this.currentEntry();
    const slot = this.hero?.skeleton?.findSlot('hero');
    const attachment = slot?.attachment || slot?.pose?.attachment || null;
    const data = this.hero?.skeleton?.data;
    return {
      ready: stageEl.dataset.ready === 'true',
      engine: Phaser.VERSION,
      spineObject: Boolean(this.hero?.skeleton),
      renderer: 'phaser/Mesh2D',
      clip: this.currentClip,
      speed: this.speed,
      trackTime: Number((entry?.trackTime || 0).toFixed(3)),
      impactEvents: this.impactCount,
      lastEvent: this.lastEvent,
      gaitPhase: this.gaitPhase,
      attachment: attachment?.name || null,
      animations: (data?.animations || []).map((a) => a.name),
      boneCount: this.hero?.skeleton?.bones?.length || 0,
      slotCount: this.hero?.skeleton?.slots?.length || 0,
      ikCount: data?.ikConstraints?.length || 0,
      ikNames: (data?.ikConstraints || []).map((ik) => ik.name),
      ikTargets: this.ikTargetSnapshot(),
    };
  }

  update() {
    const entry = this.currentEntry();
    timeEl.textContent = entry ? `${entry.trackTime.toFixed(2)} s` : '—';
  }
}

new Phaser.Game({
  type: Phaser.WEBGL,
  width: 960,
  height: 600,
  parent: 'sequenceHeroMount',
  transparent: true,
  render: { antialias: true, roundPixels: false },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  plugins: { scene: [{ key: 'spine.SpinePlugin', plugin: spineRuntime.SpinePlugin, mapping: 'spine' }] },
  scene: [PaintedSequenceScene],
});
