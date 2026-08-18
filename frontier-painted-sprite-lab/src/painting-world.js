const Phaser = window.Phaser;
const spineRuntime = window.spine;

if (!Phaser) throw new Error('Phaser 4.2.1 did not load.');

const STAGE_W = 1280;
const STAGE_H = 800;

const stageEl = document.querySelector('#paintingWorldStage');
const worldStatus = document.querySelector('#worldStatus');
const worldMetric = document.querySelector('#worldMetric');
const selectedActorEl = document.querySelector('#selectedActor');
const spineStatusEl = document.querySelector('#spineStatus');
const heroYEl = document.querySelector('#heroY');
const heroScaleEl = document.querySelector('#heroScale');
const heroDepthEl = document.querySelector('#heroDepth');
const fpsEl = document.querySelector('#worldFps');

const perspectiveToggle = document.querySelector('#perspectiveScale');
const depthToggle = document.querySelector('#depthSort');
const guideToggle = document.querySelector('#showGuide');
const pathsToggle = document.querySelector('#showPaths');

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function smoothstep(t) { return t * t * (3 - 2 * t); }

class PaintingWorld {
  constructor() {
    this.horizonY = 405;
    this.nearY = 755;
    this.farScale = .34;
    this.nearScale = 1.08;
    this.perspectiveEnabled = true;
    this.depthEnabled = true;
  }

  clampGround(x, y) {
    return {
      x: clamp(x, 45, STAGE_W - 45),
      y: clamp(y, this.horizonY + 16, this.nearY),
    };
  }

  sample(y) {
    const raw = clamp((y - this.horizonY) / (this.nearY - this.horizonY), 0, 1);
    const t = smoothstep(raw);
    return {
      t,
      scale: this.perspectiveEnabled
        ? Phaser.Math.Linear(this.farScale, this.nearScale, t)
        : .76,
      depth: this.depthEnabled ? Math.round(y) : 500,
    };
  }
}

function createBuffaloTexture(scene) {
  if (scene.textures.exists('buffalo-standin')) return;
  const g = scene.make.graphics({ add: false });
  g.fillStyle(0x2e2018, 1);
  g.fillEllipse(195, 112, 222, 112);
  g.fillStyle(0x40291c, 1);
  g.fillEllipse(92, 92, 82, 72);
  g.fillCircle(68, 84, 25);
  g.lineStyle(7, 0xd9c99f, 1);
  g.beginPath(); g.moveTo(53, 72); g.lineTo(33, 58); g.lineTo(27, 67); g.strokePath();
  g.beginPath(); g.moveTo(82, 70); g.lineTo(103, 57); g.lineTo(110, 66); g.strokePath();
  g.fillStyle(0x251a14, 1);
  g.fillRect(118, 145, 18, 70);
  g.fillRect(174, 146, 18, 69);
  g.fillRect(247, 143, 18, 72);
  g.fillRect(292, 137, 18, 77);
  g.lineStyle(10, 0x2a1d17, 1);
  g.beginPath(); g.moveTo(292, 102); g.lineTo(331, 80); g.strokePath();
  g.generateTexture('buffalo-standin', 360, 220);
  g.destroy();
}

function createHeroTexture(scene) {
  if (scene.textures.exists('hero-standin')) return;
  const g = scene.make.graphics({ add: false });

  // horse
  g.fillStyle(0xded4c4, 1);
  g.fillEllipse(222, 196, 210, 96);
  g.fillTriangle(296, 189, 350, 105, 366, 197);
  g.fillEllipse(366, 105, 55, 40);
  g.fillStyle(0xb2aa9c, 1);
  g.fillTriangle(385, 90, 414, 81, 393, 105);
  g.lineStyle(17, 0xcfc5b5, 1);
  g.beginPath(); g.moveTo(158, 222); g.lineTo(128, 318); g.strokePath();
  g.beginPath(); g.moveTo(205, 226); g.lineTo(191, 320); g.strokePath();
  g.beginPath(); g.moveTo(274, 225); g.lineTo(300, 316); g.strokePath();
  g.beginPath(); g.moveTo(315, 213); g.lineTo(352, 301); g.strokePath();
  g.lineStyle(14, 0x8c8174, 1);
  g.beginPath(); g.moveTo(135, 205); g.lineTo(60, 171); g.strokePath();

  // rider
  g.lineStyle(20, 0x8d5331, 1);
  g.beginPath(); g.moveTo(220, 151); g.lineTo(231, 79); g.strokePath();
  g.fillStyle(0x9b6039, 1);
  g.fillCircle(233, 59, 16);
  g.fillStyle(0x754128, 1);
  g.fillTriangle(211, 81, 253, 79, 247, 157);
  g.lineStyle(12, 0x9b6039, 1);
  g.beginPath(); g.moveTo(218, 102); g.lineTo(168, 143); g.strokePath();
  g.beginPath(); g.moveTo(245, 97); g.lineTo(290, 136); g.strokePath();
  g.lineStyle(8, 0x5d3f2a, 1);
  g.beginPath(); g.moveTo(169, 143); g.lineTo(346, 42); g.strokePath();
  g.lineStyle(6, 0xd3ad64, 1);
  g.beginPath(); g.moveTo(336, 49); g.lineTo(365, 31); g.strokePath();
  g.beginPath(); g.moveTo(340, 54); g.lineTo(370, 50); g.strokePath();
  g.lineStyle(6, 0x34241e, 1);
  g.beginPath(); g.moveTo(228, 44); g.lineTo(201, 18); g.strokePath();
  g.beginPath(); g.moveTo(233, 43); g.lineTo(228, 7); g.strokePath();
  g.beginPath(); g.moveTo(239, 44); g.lineTo(258, 12); g.strokePath();

  g.generateTexture('hero-standin', 420, 330);
  g.destroy();
}

class PaintingActor {
  constructor(scene, world, cfg) {
    this.scene = scene;
    this.world = world;
    this.id = cfg.id;
    this.label = cfg.label;
    this.baseScale = cfg.baseScale ?? 1;
    this.selected = false;
    this.moving = false;
    this.moveTween = null;
    this.initial = { x: cfg.x, y: cfg.y };
    this.color = cfg.color ?? 0xf0c969;

    this.root = scene.add.container(cfg.x, cfg.y);
    this.shadow = scene.add.ellipse(0, -4, cfg.shadowW ?? 150, cfg.shadowH ?? 26, 0x1a120e, .34).setOrigin(.5);
    this.glow = scene.add.image(0, 0, cfg.texture)
      .setOrigin(.5, 1)
      .setTint(this.color)
      .setAlpha(.44)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setScale(1.07);
    this.sprite = scene.add.image(0, 0, cfg.texture).setOrigin(.5, 1);
    this.ring = scene.add.ellipse(0, 2, cfg.ringW ?? 170, cfg.ringH ?? 42, this.color, .06)
      .setStrokeStyle(3, this.color, .82)
      .setOrigin(.5);

    this.root.add([this.shadow, this.glow, this.sprite, this.ring]);
    this.sprite.setInteractive({ useHandCursor: true });
    this.sprite.on('pointerdown', () => {
      scene.actorClickGuard = true;
      scene.selectActor(this);
    });
    this.updatePerspective();
  }

  setSelected(value) {
    this.selected = value;
    const color = value ? 0x45eaff : this.color;
    this.glow.setTint(color).setAlpha(value ? .66 : .42);
    this.ring.setFillStyle(color, value ? .13 : .055)
      .setStrokeStyle(value ? 4 : 3, color, value ? 1 : .76);
  }

  moveTo(x, y, duration = 1600) {
    const target = this.world.clampGround(x, y);
    if (this.moveTween) this.moveTween.stop();
    this.moving = true;
    this.scene.drawMovePath(this.root.x, this.root.y, target.x, target.y, this.selected ? 0x54eeff : this.color);
    this.moveTween = this.scene.tweens.add({
      targets: this.root,
      x: target.x,
      y: target.y,
      duration,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.moving = false;
        this.sprite.setPosition(0, 0).setRotation(0);
        this.glow.setPosition(0, 0).setRotation(0);
      },
    });
  }

  reset() {
    if (this.moveTween) this.moveTween.stop();
    this.root.setPosition(this.initial.x, this.initial.y);
    this.moving = false;
    this.updatePerspective();
  }

  update(time) {
    if (this.moving) {
      const gait = Math.sin(time * .014 + this.initial.x * .01);
      const lift = -Math.abs(gait) * (this.id === 'hero' ? 5 : 3);
      const tilt = gait * (this.id === 'hero' ? .018 : .012);
      this.sprite.y = lift;
      this.glow.y = lift;
      this.sprite.rotation = tilt;
      this.glow.rotation = tilt;
    } else {
      const breath = Math.sin(time * .0022 + this.initial.y) * 1.1;
      this.sprite.y = breath;
      this.glow.y = breath;
    }
    this.updatePerspective();
  }

  updatePerspective() {
    const p = this.world.sample(this.root.y);
    this.currentPerspective = p;
    this.root.setScale(p.scale * this.baseScale);
    if (this.world.depthEnabled) this.root.setDepth(p.depth);
  }
}

class LivingPaintingScene extends Phaser.Scene {
  constructor() {
    super('LivingPainting');
    this.worldMap = new PaintingWorld();
    this.actors = [];
    this.selected = null;
    this.actorClickGuard = false;
    this.lastMetricUpdate = 0;
  }

  create() {
    createBuffaloTexture(this);
    createHeroTexture(this);

    this.pathGraphics = this.add.graphics().setDepth(1800);
    this.guideGraphics = this.add.graphics().setDepth(1900);
    this.guideLabels = [];
    this.createGuide();

    this.actors = [
      new PaintingActor(this, this.worldMap, {
        id: 'buffalo-left', label: 'Buffalo A', texture: 'buffalo-standin', x: 342, y: 628,
        baseScale: .63, color: 0xf3c74f, shadowW: 170, ringW: 185,
      }),
      new PaintingActor(this, this.worldMap, {
        id: 'buffalo-right', label: 'Buffalo B', texture: 'buffalo-standin', x: 840, y: 575,
        baseScale: .55, color: 0xf3c74f, shadowW: 170, ringW: 185,
      }),
      new PaintingActor(this, this.worldMap, {
        id: 'hero', label: 'Hero rider', texture: 'hero-standin', x: 668, y: 682,
        baseScale: .72, color: 0x45eaff, shadowW: 190, shadowH: 30, ringW: 210, ringH: 48,
      }),
    ];

    this.hero = this.actors.find((a) => a.id === 'hero');
    this.selectActor(this.hero);

    const spineRegistered = !!this.add.spine;
    spineStatusEl.textContent = spineRegistered
      ? 'official runtime registered · painted rig asset pending'
      : 'runtime unavailable';

    this.input.on('pointerdown', (pointer) => {
      if (this.actorClickGuard) {
        this.actorClickGuard = false;
        return;
      }
      if (!this.selected) return;
      const target = this.worldMap.clampGround(pointer.worldX, pointer.worldY);
      this.selected.moveTo(target.x, target.y, 1450);
      worldStatus.textContent = `${this.selected.label} moving to (${Math.round(target.x)}, ${Math.round(target.y)})`;
    });

    this.bindDomControls();

    window.paintingWorldPOC = {
      command: (name) => this.command(name),
      moveSelectedTo: (x, y, duration = 500) => this.selected?.moveTo(x, y, duration),
      select: (id) => {
        const actor = this.actors.find((item) => item.id === id);
        if (actor) this.selectActor(actor);
      },
      snapshot: () => this.snapshot(),
    };

    stageEl.dataset.ready = 'true';
    worldStatus.textContent = 'Ready · select an actor or click the ground';
    worldMetric.textContent = `Phaser ${Phaser.VERSION} · PaintingWorld · Spine ${spineRegistered ? 'registered' : 'missing'}`;
    window.__paintingWorldDebug = this.snapshot();
  }

  createGuide() {
    this.guideGraphics.clear();
    const ys = [425, 500, 585, 670, 745];
    for (const y of ys) {
      const p = this.worldMap.sample(y);
      this.guideGraphics.lineStyle(1, 0x8defff, .44);
      this.guideGraphics.lineBetween(30, y, STAGE_W - 30, y);
      const label = this.add.text(42, y - 22, `ground y ${y} · scale ${p.scale.toFixed(2)}`, {
        fontFamily: 'monospace', fontSize: '13px', color: '#aef4ff',
        backgroundColor: 'rgba(14,29,32,.62)', padding: { x: 5, y: 3 },
      }).setDepth(1901);
      this.guideLabels.push(label);
    }
    this.setGuideVisible(false);
  }

  setGuideVisible(visible) {
    this.guideGraphics.setVisible(visible);
    for (const label of this.guideLabels) label.setVisible(visible);
  }

  refreshGuide() {
    for (const label of this.guideLabels) label.destroy();
    this.guideLabels = [];
    this.createGuide();
    this.setGuideVisible(guideToggle.checked);
  }

  drawMovePath(x1, y1, x2, y2, color) {
    this.pathGraphics.clear();
    if (!pathsToggle.checked) return;
    this.pathGraphics.lineStyle(3, color, .72);
    this.pathGraphics.beginPath();
    this.pathGraphics.moveTo(x1, y1);
    this.pathGraphics.lineTo((x1 + x2) / 2, Math.min(y1, y2) - 18);
    this.pathGraphics.lineTo(x2, y2);
    this.pathGraphics.strokePath();
    this.pathGraphics.fillStyle(color, .9);
    this.pathGraphics.fillCircle(x2, y2, 6);
    this.time.delayedCall(1550, () => this.pathGraphics.clear());
  }

  selectActor(actor) {
    this.selected = actor;
    for (const item of this.actors) item.setSelected(item === actor);
    selectedActorEl.textContent = actor.label;
    worldStatus.textContent = `${actor.label} selected · click ground to move`;
  }

  bindDomControls() {
    document.querySelector('#sendFar').addEventListener('click', () => this.command('far'));
    document.querySelector('#crossBehind').addEventListener('click', () => this.command('cross'));
    document.querySelector('#comeNear').addEventListener('click', () => this.command('near'));
    document.querySelector('#resetWorld').addEventListener('click', () => this.command('reset'));

    perspectiveToggle.addEventListener('change', () => {
      this.worldMap.perspectiveEnabled = perspectiveToggle.checked;
      this.actors.forEach((a) => a.updatePerspective());
      this.refreshGuide();
    });
    depthToggle.addEventListener('change', () => {
      this.worldMap.depthEnabled = depthToggle.checked;
      this.actors.forEach((a, index) => {
        if (depthToggle.checked) a.updatePerspective();
        else a.root.setDepth(500 + index);
      });
    });
    guideToggle.addEventListener('change', () => this.setGuideVisible(guideToggle.checked));
    pathsToggle.addEventListener('change', () => { if (!pathsToggle.checked) this.pathGraphics.clear(); });
  }

  command(name) {
    this.selectActor(this.hero);
    if (name === 'far') {
      this.hero.moveTo(910, 455, 1700);
      worldStatus.textContent = 'Hero moving deeper into the painting · watch scale decrease';
    } else if (name === 'cross') {
      this.hero.moveTo(925, 545, 1900);
      worldStatus.textContent = 'Hero crossing at a farther Y-depth · Buffalo B should render in front';
    } else if (name === 'near') {
      this.hero.moveTo(510, 744, 1750);
      worldStatus.textContent = 'Hero approaching foreground · watch scale and depth increase';
    } else if (name === 'reset') {
      this.pathGraphics.clear();
      this.actors.forEach((a) => a.reset());
      this.selectActor(this.hero);
      worldStatus.textContent = 'World reset';
    }
  }

  snapshot() {
    const hero = this.hero;
    return {
      ready: !!hero,
      engine: Phaser.VERSION,
      spinePlugin: !!this.add?.spine,
      backgroundLoaded: true,
      backgroundMode: 'fixed-dom-painting',
      selected: this.selected?.id ?? null,
      hero: hero ? {
        x: Number(hero.root.x.toFixed(2)),
        y: Number(hero.root.y.toFixed(2)),
        scale: Number(hero.root.scaleX.toFixed(3)),
        depth: hero.root.depth,
        moving: hero.moving,
      } : null,
      buffalo: this.actors.filter((a) => a.id.startsWith('buffalo')).map((a) => ({
        id: a.id,
        x: Number(a.root.x.toFixed(2)),
        y: Number(a.root.y.toFixed(2)),
        scale: Number(a.root.scaleX.toFixed(3)),
        depth: a.root.depth,
      })),
    };
  }

  update(time) {
    for (const actor of this.actors) actor.update(time);
    if (time - this.lastMetricUpdate > 180) {
      this.lastMetricUpdate = time;
      const snap = this.snapshot();
      window.__paintingWorldDebug = snap;
      heroYEl.textContent = snap.hero ? `${Math.round(snap.hero.y)} px` : '—';
      heroScaleEl.textContent = snap.hero ? `${snap.hero.scale.toFixed(2)}×` : '—';
      heroDepthEl.textContent = snap.hero ? String(snap.hero.depth) : '—';
      fpsEl.textContent = `${Math.round(this.game.loop.actualFps || 0)}`;
    }
  }
}

const spinePluginAvailable = !!spineRuntime?.SpinePlugin;
const config = {
  type: Phaser.WEBGL,
  width: STAGE_W,
  height: STAGE_H,
  parent: 'phaserMount',
  transparent: true,
  scene: [LivingPaintingScene],
  render: { antialias: true, roundPixels: false },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  plugins: spinePluginAvailable ? {
    scene: [{ key: 'spine.SpinePlugin', plugin: spineRuntime.SpinePlugin, mapping: 'spine' }],
  } : undefined,
};

new Phaser.Game(config);
