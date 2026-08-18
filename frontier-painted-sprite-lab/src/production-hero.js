const Phaser = window.Phaser;
const spineRuntime = window.spine;

const stage = document.querySelector('#productionHeroStage');
const stateEl = document.querySelector('#productionState');
const messageEl = document.querySelector('#productionMessage');
const clipEl = document.querySelector('#productionClip');
const timeEl = document.querySelector('#productionTime');

const BASE = './assets/frontier-hero/runtime/';
const FILES = {
  skeleton: `${BASE}frontier-hero.skel`,
  atlas: `${BASE}frontier-hero.atlas`,
  texture: `${BASE}frontier-hero.png`,
};

async function fileExists(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
    return response.ok;
  } catch {
    return false;
  }
}

async function verifyProductionExport() {
  const entries = await Promise.all(Object.entries(FILES).map(async ([name, url]) => [name, await fileExists(url)]));
  return Object.fromEntries(entries);
}

function renderBlocked(missing) {
  stateEl.textContent = 'production export required';
  stage.dataset.ready = 'blocked';
  messageEl.innerHTML = `Missing real Spine export: <strong>${missing.join(', ')}</strong>. The V1 runtime-generated skeleton is intentionally not used here.`;
  clipEl.textContent = 'BLOCKED';
  timeEl.textContent = 'asset authoring';
}

function bootProductionHero() {
  if (!Phaser || !spineRuntime?.SpinePlugin) {
    stateEl.textContent = 'engine dependency error';
    messageEl.textContent = 'Phaser 4.2.1 or spine-phaser-v4 4.3 failed to load.';
    stage.dataset.ready = 'error';
    return;
  }

  class ProductionHeroScene extends Phaser.Scene {
    constructor() {
      super('ProductionHero');
      this.hero = null;
      this.currentClip = 'idle_alive';
      this.paused = false;
      this.speed = 1;
      this.impactCount = 0;
    }

    preload() {
      // Official spine-phaser-v4 4.3.11+ loader contract.
      this.load.spineSkeleton('frontier-hero-data', FILES.skeleton);
      this.load.spineAtlas('frontier-hero-atlas', FILES.atlas);
    }

    create() {
      this.add.ellipse(480, 520, 440, 62, 0x120f0c, .24).setDepth(1);
      this.add.ellipse(480, 505, 365, 58, 0x31dff2, .06)
        .setStrokeStyle(3, 0x5fefff, .72).setDepth(2);

      // Default Phaser backend renders Spine attachments through Mesh2D in WebGL.
      this.hero = this.add.spine(480, 500, 'frontier-hero-data', 'frontier-hero-atlas', {
        renderer: 'phaser'
      });
      this.hero.setDepth(10);

      // AnimationState owns the performance. Phaser does not puppet bones here.
      this.hero.animationStateData.defaultMix = 0.16;
      this.hero.animationStateData.setMix('idle_alive', 'walk', 0.18);
      this.hero.animationStateData.setMix('walk', 'idle_alive', 0.18);
      this.hero.animationStateData.setMix('rear_action', 'land_step', 0.08);
      this.hero.animationStateData.setMix('land_step', 'idle_alive', 0.18);

      this.hero.animationState.addListener({
        event: (_entry, event) => {
          if (event?.data?.name === 'impact') {
            this.impactCount += 1;
            this.cameras.main.shake(65, .0011);
          }
        },
        complete: (entry) => {
          if (!entry.loop && this.currentClip !== 'idle_alive') this.play('idle_alive');
        }
      });

      this.play('idle_alive');
      stateEl.textContent = 'real Spine export loaded';
      messageEl.textContent = 'Production package loaded through spineSkeleton + spineAtlas; motion is driven by Spine AnimationState.';
      stage.dataset.ready = 'true';
      this.bindControls();

      window.productionHeroPOC = {
        play: (name) => this.play(name),
        setSpeed: (speed) => this.setSpeed(speed),
        snapshot: () => this.snapshot(),
      };
    }

    play(name) {
      if (!this.hero) return;
      const loop = name === 'idle_alive' || name === 'walk';
      this.currentClip = name;
      this.hero.animationState.setAnimation(0, name, loop);
      clipEl.textContent = name;
      this.paused = false;
    }

    setSpeed(speed) {
      this.speed = speed;
      if (this.hero) this.hero.animationState.timeScale = speed;
    }

    bindControls() {
      document.querySelectorAll('[data-clip]').forEach((button) => {
        button.addEventListener('click', () => this.play(button.dataset.clip));
      });
      document.querySelectorAll('.production-speed').forEach((button) => {
        button.addEventListener('click', () => {
          this.setSpeed(Number(button.dataset.speed));
          document.querySelectorAll('.production-speed').forEach((b) => b.classList.toggle('active', b === button));
        });
      });
      document.querySelector('#productionPause').addEventListener('click', (event) => {
        this.paused = !this.paused;
        this.hero.animationState.timeScale = this.paused ? 0 : this.speed;
        event.currentTarget.textContent = this.paused ? 'Resume' : 'Pause';
      });
    }

    snapshot() {
      const entry = this.hero?.animationState?.getCurrent(0);
      return {
        ready: stage.dataset.ready === 'true',
        engine: Phaser.VERSION,
        spineObject: Boolean(this.hero?.skeleton),
        renderer: 'phaser/Mesh2D',
        clip: this.currentClip,
        speed: this.speed,
        paused: this.paused,
        trackTime: Number((entry?.trackTime || 0).toFixed(3)),
        impactEvents: this.impactCount,
        boneCount: this.hero?.skeleton?.bones?.length || 0,
        ikCount: this.hero?.skeleton?.data?.ikConstraints?.length || 0,
      };
    }

    update() {
      const entry = this.hero?.animationState?.getCurrent(0);
      timeEl.textContent = entry ? `${entry.trackTime.toFixed(2)} s` : '—';
    }
  }

  new Phaser.Game({
    type: Phaser.WEBGL,
    width: 960,
    height: 600,
    parent: 'productionHeroMount',
    transparent: true,
    render: { antialias: true, roundPixels: false },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    plugins: {
      scene: [{ key: 'spine.SpinePlugin', plugin: spineRuntime.SpinePlugin, mapping: 'spine' }]
    },
    scene: [ProductionHeroScene]
  });
}

const exportStatus = await verifyProductionExport();
const missing = Object.entries(exportStatus).filter(([, ok]) => !ok).map(([name]) => name);
if (missing.length) renderBlocked(missing);
else bootProductionHero();
