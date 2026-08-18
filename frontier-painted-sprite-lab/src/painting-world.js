const Phaser = window.Phaser;
const spineRuntime = window.spine;

if (!Phaser) throw new Error('Phaser 4.2.1 did not load.');

const STAGE_W = 1280;
const STAGE_H = 800;
const PAINTING_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Albert_Bierstadt_-_The_Last_of_the_Buffalo.jpg/1280px-Albert_Bierstadt_-_The_Last_of_the_Buffalo.jpg';
const SPINE_DATA_URL = 'https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/4.3/spine-ts/assets/spineboy-pro.skel';
const SPINE_ATLAS_URL = 'https://raw.githubusercontent.com/EsotericSoftware/spine-runtimes/4.3/spine-ts/assets/spineboy-pma.atlas';

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

const buffaloSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220">
  <defs>
    <linearGradient id="fur" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2f2118"/>
      <stop offset=".48" stop-color="#5b3c24"/>
      <stop offset="1" stop-color="#241914"/>
    </linearGradient>
    <filter id="rough"><feTurbulence baseFrequency=".04" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2"/></filter>
  </defs>
  <g filter="url(#rough)">
    <ellipse cx="190" cy="116" rx="112" ry="57" fill="url(#fur)"/>
    <path d="M90 120 C62 91 56 70 80 57 C103 43 129 59 137 89 C127 117 113 130 90 120Z" fill="#35231a"/>
    <ellipse cx="73" cy="85" rx="34" ry="30" fill="#2a1d17"/>
    <path d="M55 66 C38 51 28 55 30 66 C37 62 44 67 51 75" fill="none" stroke="#ded0ad" stroke-width="7" stroke-linecap="round"/>
    <path d="M88 66 C104 50 115 54 113 65 C106 61 99 67 92 75" fill="none" stroke="#ded0ad" stroke-width="7" stroke-linecap="round"/>
    <circle cx="63" cy="82" r="3.5" fill="#e6d8b8"/>
    <circle cx="84" cy="82" r="3.5" fill="#e6d8b8"/>
    <path d="M124 154 L112 205 L94 205 L100 150Z" fill="#2b1e17"/>
    <path d="M183 158 L178 208 L160 208 L160 154Z" fill="#37251a"/>
    <path d="M245 154 L253 207 L235 207 L224 153Z" fill="#2c1f17"/>
    <path d="M292 146 L312 202 L294 207 L273 151Z" fill="#251a15"/>
    <path d="M300 101 Q332 92 340 72" fill="none" stroke="#2a1d17" stroke-width="10" stroke-linecap="round"/>
  </g>
</svg>`;

const riderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 330">
  <defs>
    <linearGradient id="horse" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#f3eadb"/>
      <stop offset=".55" stop-color="#cfc5b4"/>
      <stop offset="1" stop-color="#8f877a"/>
    </linearGradient>
    <filter id="rough"><feTurbulence baseFrequency=".035" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.2"/></filter>
  </defs>
  <g filter="url(#rough)">
    <ellipse cx="223" cy="196" rx="105" ry="49" fill="url(#horse)"/>
    <path d="M306 184 Q343 142 363 100 Q380 87 394 105 Q368 142 345 203Z" fill="url(#horse)"/>
    <ellipse cx="376" cy="103" rx="29" ry="22" fill="#d9d0c1" transform="rotate(-20 376 103)"/>
    <path d="M391 92 L415 82 L399 103Z" fill="#b1a99b"/>
    <path d="M135 205 Q87 201 52 170" fill="none" stroke="#8c8174" stroke-width="16" stroke-linecap="round"/>
    <path d="M157 225 L129 314" stroke="#c9bfaf" stroke-width="18" stroke-linecap="round"/>
    <path d="M206 229 L191 319" stroke="#d8cfc0" stroke-width="17" stroke-linecap="round"/>
    <path d="M274 228 L298 315" stroke="#bdb4a6" stroke-width="18" stroke-linecap="round"/>
    <path d="M318 215 L351 298" stroke="#d2c8b8" stroke-width="17" stroke-linecap="round"/>
    <path d="M129 314 L119 324 M191 319 L179 327 M298 315 L310 323 M351 298 L363 303" stroke="#594a3b" stroke-width="8" stroke-linecap="round"/>
    <path d="M206 150 Q214 102 232 72" stroke="#8d5532" stroke-width="20" stroke-linecap="round"/>
    <circle cx="234" cy="58" r="16" fill="#9f623a"/>
    <path d="M217 68 Q193 111 198 152 L248 161 Q253 111 246 74Z" fill="#7e4429"/>
    <path d="M218 99 L167 143" stroke="#9f623a" stroke-width="12" stroke-linecap="round"/>
    <path d="M245 93 L290 137" stroke="#9f623a" stroke-width="12" stroke-linecap="round"/>
    <path d="M228 44 Q210 24 200 17 M232 43 Q224 16 226 6 M238 43 Q247 17 258 10" stroke="#3b2720" stroke-width="7" stroke-linecap="round"/>
    <path d="M173 143 L344 43" stroke="#5f402b" stroke-width="8" stroke-linecap="round"/>
    <path d="M335 47 L362 32 M339 51 L368 49" stroke="#d9b56b" stroke-width="6" stroke-linecap="round"/>
  </g>
</svg>`;

function svgData(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

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

class PaintingActor {
  constructor(scene, world, cfg) {
    this.scene = scene;
    this.world = world;
    this.id = cfg.id;
    this.label = cfg.label;
    this.baseScale = cfg.baseScale ?? 1;
    this.targetable = cfg.targetable !== false;
    this.selected = false;
    this.moving = false;
    this.moveTween = null;
    this.initial = { x: cfg.x, y: cfg.y };
    this.color = cfg.color ?? 0xf0c969;

    this.root = scene.add.container(cfg.x, cfg.y);
    this.shadow = scene.add.ellipse(0, -4, cfg.shadowW ?? 150, cfg.shadowH ?? 26, 0x1a120e, .34);
    this.shadow.setOrigin(.5, .5);
    this.glow = scene.add.image(0, 0, cfg.texture).setOrigin(.5, 1).setTint(this.color).setAlpha(.42).setBlendMode(Phaser.BlendModes.ADD);
    this.glow.setScale(1.065);
    this.sprite = scene.add.image(0, 0, cfg.texture).setOrigin(.5, 1);
    this.ring = scene.add.ellipse(0, 2, cfg.ringW ?? 170, cfg.ringH ?? 42, this.color, .07).setStrokeStyle(3, this.color, .8);
    this.ring.setOrigin(.5, .5);

    this.root.add([this.shadow, this.glow, this.sprite, this.ring]);
    this.ring.setDepth(-1);
    this.shadow.setDepth(-2);

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
    this.glow.setTint(color).setAlpha(value ? .62 : .4);
    this.ring.setFillStyle(color, value ? .12 : .055).setStrokeStyle(value ? 4 : 3, color, value ? 1 : .72);
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
        this.sprite.y = 0;
        this.sprite.rotation = 0;
        this.glow.y = 0;
        this.glow.rotation = 0;
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
      const breath = Math.sin(time * .0022 + this.initial.y) * 1.2;
      this.sprite.y = breath;
      this.glow.y = breath;
    }
    this.updatePerspective();
  }

  updatePerspective() {
    const p = this.world.sample(this.root.y);
    this.currentPerspective = p;
    this.root.setScale(p.scale * this.baseScale);
    this.root.setDepth(p.depth);
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
    this.backgroundLoaded = true;
    this.spineAssetFailed = false;
  }

  preload() {
    this.load.image('painting', PAINTING_URL);
    this.load.svg('buffalo', svgData(buffaloSvg), { width: 360, height: 220 });
    this.load.svg('hero-rider', svgData(riderSvg), { width: 420, height: 330 });
    this.load.on('loaderror', (file) => {
      if (file.key === 'painting') this.backgroundLoaded = false;
      if (String(file.key).startsWith('spineboy')) this.spineAssetFailed = true;
    });

    if (this.load.spineSkeleton && this.load.spineAtlas) {
      this.load.spineSkeleton('spineboy-data', SPINE_DATA_URL);
      this.load.spineAtlas('spineboy-atlas', SPINE_ATLAS_URL);
    }
  }

  create() {
    this.cameras.main.setBackgroundColor('#50402f');

    if (this.textures.exists('painting')) {
      const painting = this.add.image(STAGE_W / 2, STAGE_H / 2, 'painting');
      painting.setDisplaySize(STAGE_W, STAGE_H).setDepth(0);
    } else {
      const fallback = this.add.graphics().setDepth(0);
      fallback.fillGradientStyle(0xb8a47e, 0x8b7d63, 0x796249, 0x453724, 1);
      fallback.fillRect(0, 0, STAGE_W, STAGE_H);
    }

    const wash = this.add.rectangle(STAGE_W / 2, STAGE_H / 2, STAGE_W, STAGE_H, 0x24180f, .08).setDepth(1);
    wash.setBlendMode(Phaser.BlendModes.MULTIPLY);

    this.pathGraphics = this.add.graphics().setDepth(1800);
    this.guideGraphics = this.add.graphics().setDepth(1900);
    this.guideLabels = [];
    this.createGuide();

    this.actors = [
      new PaintingActor(this, this.worldMap, {
        id: 'buffalo-left', label: 'Buffalo A', texture: 'buffalo', x: 342, y: 628,
        baseScale: .63, color: 0xf3c74f, shadowW: 170, ringW: 185,
      }),
      new PaintingActor(this, this.worldMap, {
        id: 'buffalo-right', label: 'Buffalo B', texture: 'buffalo', x: 840, y: 575,
        baseScale: .55, color: 0xf3c74f, shadowW: 170, ringW: 185,
      }),
      new PaintingActor(this, this.worldMap, {
        id: 'hero', label: 'Hero rider', texture: 'hero-rider', x: 668, y: 682,
        baseScale: .72, color: 0x45eaff, shadowW: 190, shadowH: 30, ringW: 210, ringH: 48,
      }),
    ];

    this.hero = this.actors.find((a) => a.id === 'hero');
    this.selectActor(this.hero);

    this.spineProof = null;
    let spineLive = false;
    if (this.add.spine && !this.spineAssetFailed) {
      try {
        this.spineProof = this.add.spine(-500, -500, 'spineboy-data', 'spineboy-atlas');
        this.spineProof.scale = .12;
        this.spineProof.animationState.setAnimation(0, 'walk', true);
        spineLive = true;
      } catch (error) {
        console.warn('Spine runtime smoke-test asset could not be instantiated.', error);
      }
    }

    spineStatusEl.textContent = spineLive
      ? 'live runtime + offscreen walk animation'
      : 'plugin loaded; painted Spine asset pending';

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
    stageEl.dataset.ready = 'true';
    worldStatus.textContent = 'Ready · select an actor or click the ground';
    worldMetric.textContent = `Phaser ${Phaser.VERSION} · PaintingWorld · Spine ${spineLive ? 'live' : 'ready'}`;

    window.paintingWorldPOC = {
      command: (name) => this.command(name),
      moveSelectedTo: (x, y, duration = 500) => this.selected?.moveTo(x, y, duration),
      select: (id) => {
        const actor = this.actors.find((item) => item.id === id);
        if (actor) this.selectActor(actor);
      },
      snapshot: () => this.snapshot(),
    };
    window.__paintingWorldDebug = this.snapshot();
  }

  createGuide() {
    this.guideGraphics.clear();
    const ys = [425, 500, 585, 670, 745];
    for (const y of ys) {
      const p = this.worldMap.sample(y);
      this.guideGraphics.lineStyle(1, 0x8defff, .44);
      this.guideGraphics.lineBetween(30, y, STAGE_W - 30, y);
      const label = this.add.text(42, y - 22, `ground y ${y}  ·  scale ${p.scale.toFixed(2)}`, {
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

  drawMovePath(x1, y1, x2, y2, color) {
    this.pathGraphics.clear();
    if (!pathsToggle.checked) return;
    this.pathGraphics.lineStyle(3, color, .72);
    this.pathGraphics.beginPath();
    this.pathGraphics.moveTo(x1, y1);
    const midX = (x1 + x2) / 2;
    const midY = Math.min(y1, y2) - 18;
    this.pathGraphics.lineTo(midX, midY);
    this.pathGraphics.lineTo(x2, y2);
    this.pathGraphics.strokePath();
    this.pathGraphics.fillStyle(color, .9).fillCircle(x2, y2, 6);
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

  refreshGuide() {
    for (let i = 0; i < this.guideLabels.length; i += 1) this.guideLabels[i].destroy();
    this.guideLabels = [];
    this.createGuide();
    this.setGuideVisible(guideToggle.checked);
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
      backgroundLoaded: this.backgroundLoaded,
      selected: this.selected?.id ?? null,
      hero: hero ? {
        x: Number(hero.root.x.toFixed(2)),
        y: Number(hero.root.y.toFixed(2)),
        scale: Number(hero.root.scaleX.toFixed(3)),
        depth: hero.root.depth,
        moving: hero.moving,
      } : null,
      buffalo: this.actors.filter((a) => a.id.startsWith('buffalo')).map((a) => ({
        id: a.id, x: a.root.x, y: a.root.y, scale: a.root.scaleX, depth: a.root.depth,
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
  backgroundColor: '#493a2c',
  scene: [LivingPaintingScene],
  render: { antialias: true, roundPixels: false },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  plugins: spinePluginAvailable ? {
    scene: [{ key: 'spine.SpinePlugin', plugin: spineRuntime.SpinePlugin, mapping: 'spine' }],
  } : undefined,
};

new Phaser.Game(config);
