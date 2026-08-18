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

async function verifyProductionPackage() {
  const entries = await Promise.all(Object.entries(FILES).map(async ([name, url]) => [name, await fileExists(url)]));
  return Object.fromEntries(entries);
}

function renderBlocked(missing) {
  stateEl.textContent = 'production Spine package required';
  stage.dataset.ready = 'blocked';
  messageEl.innerHTML = `Missing Spine runtime package: <strong>${missing.join(', ')}</strong>. The V1 runtime-generated puppet is intentionally not used here.`;
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
      // spine-phaser-v4 selects binary parsing from the .skel extension.
      this.load.spineSkeleton('frontier-hero-data', FILES.skeleton);
      // The atlas loader resolves its PNG texture page(s).
      this.load.spineAtlas('frontier-hero-atlas', FILES.atlas);
    }

    create() {
      this.add.ellipse(480, 520, 440, 62, 0x120f0c, .24).setDepth(1);
      this.add.ellipse(480, 505, 365, 58, 0x31dff2, .06)
        .setStrokeStyle(3, 0x5fefff, .72).setDepth(2);

      // Phaser 4 WebGL's default Spine backend renders the skeleton through Mesh2D.
      this.hero = this.add.spine(480, 500, 'frontier-hero-data', 'frontier-hero-atlas', {
        renderer: 'phaser'
      });
      this.hero.setDepth(10);
      this.hero.setScale(.92);

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
      stateEl.textContent = 'Spine 4.3 binary runtime package loaded';
      messageEl.textContent = 'Spine .skel + atlas + painterly texture loaded through spineSkeleton + spineAtlas; internal performance is owned by Spine AnimationState.';
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
      this.hero.animationState.timeScale = this.speed;
      clipEl.textContent = name;
      this.paused = false;
    }

    setSpeed(speed) {
      this.speed = speed;
      if (this.hero && !this.paused) this.hero.animationState.timeScale = speed;
    }

    currentEntry() {
      // Spine 4.3 exposes current entries via AnimationState.tracks.
      return this.hero?.animationState?.tracks?.[0] || null;
    }

    ikConstraintData() {
      // Spine 4.3 unifies constraint data under SkeletonData.constraints.
      const constraints = this.hero?.skeleton?.data?.constraints || [];
      return constraints.filter((constraint) => constraint?.name?.endsWith('_ik'));
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
      const entry = this.currentEntry();
      const data = this.hero?.skeleton?.data;
      const ik = this.ikConstraintData();
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
        slotCount: this.hero?.skeleton?.slots?.length || 0,
        ikCount: ik.length,
        boneNames: (data?.bones || []).map((bone) => bone.name),
        ikNames: ik.map((constraint) => constraint.name),
        animations: (data?.animations || []).map((animation) => animation.name),
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

const packageStatus = await verifyProductionPackage();
const missing = Object.entries(packageStatus).filter(([, ok]) => !ok).map(([name]) => name);
if (missing.length) renderBlocked(missing);
else bootProductionHero();
