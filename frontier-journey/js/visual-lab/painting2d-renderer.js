const P = () => window.PIXI;

function makeWheel(radius = 32) {
  const PIXI = P();
  const root = new PIXI.Container();
  const shadow = new PIXI.Graphics().ellipse(2, 5, radius * 1.1, radius * .45).fill({ color: 0x2b1c12, alpha: .16 });
  shadow.y = radius * .72;
  const rim = new PIXI.Graphics().circle(0, 0, radius).stroke({ color: 0x3b2719, width: 7, alpha: .96 });
  const inner = new PIXI.Graphics().circle(0, 0, radius - 6).stroke({ color: 0x8a5b34, width: 2.5, alpha: .8 });
  const spokes = new PIXI.Graphics();
  for (let i = 0; i < 12; i += 1) {
    const a = i * Math.PI * 2 / 12;
    spokes.moveTo(0, 0).lineTo(Math.cos(a) * (radius - 7), Math.sin(a) * (radius - 7));
  }
  spokes.stroke({ color: 0x4b301e, width: 2.4, alpha: .9 });
  const hub = new PIXI.Graphics().circle(0, 0, 5.5).fill(0x3a2417);
  root.addChild(shadow, rim, inner, spokes, hub);
  return root;
}

function makeOx(index = 0) {
  const PIXI = P();
  const root = new PIXI.Container();
  const outline = 0x35271d;
  const hide = index ? 0x685947 : 0x77634d;
  const hideLight = index ? 0x8b7660 : 0x978069;

  const bodyShadow = new PIXI.Graphics().ellipse(0, 30, 69, 16).fill({ color: 0x2a1b12, alpha: .16 });
  const body = new PIXI.Graphics()
    .ellipse(0, 0, 69, 35).fill(hide)
    .stroke({ color: outline, width: 3, alpha: .65 });
  const shoulder = new PIXI.Graphics().ellipse(42, -1, 28, 31).fill(hideLight).stroke({ color: outline, width: 2, alpha: .45 });
  const head = new PIXI.Container();
  head.x = 73;
  head.y = -9;
  const headShape = new PIXI.Graphics().ellipse(0, 0, 25, 21).fill(0x574838).stroke({ color: outline, width: 3, alpha: .6 });
  const muzzle = new PIXI.Graphics().ellipse(20, 5, 15, 11).fill(0x9c856e).stroke({ color: outline, width: 1.5, alpha: .35 });
  const eye = new PIXI.Graphics().circle(8, -5, 2.3).fill(0x21170f);
  const horns = new PIXI.Graphics()
    .moveTo(-8, -16).bezierCurveTo(-15, -31, -28, -31, -32, -24)
    .moveTo(7, -17).bezierCurveTo(14, -32, 28, -30, 33, -22)
    .stroke({ color: 0xd8c7a4, width: 4, alpha: .95 });
  head.addChild(horns, headShape, muzzle, eye);

  const legs = [];
  [-42, 35].forEach((x, pair) => {
    [-1, 1].forEach((side, sideIndex) => {
      const legRoot = new PIXI.Container();
      legRoot.x = x + sideIndex * 12;
      legRoot.y = 21;
      const leg = new PIXI.Graphics()
        .roundRect(-5, 0, 10, 42, 4).fill(0x4b3d30)
        .roundRect(-6, 34, 12, 12, 4).fill(0x30261e);
      legRoot.addChild(leg);
      root.addChild(legRoot);
      legs.push(legRoot);
    });
  });

  const tail = new PIXI.Graphics()
    .moveTo(-62, -8).bezierCurveTo(-88, -10, -83, 18, -91, 28)
    .stroke({ color: outline, width: 4, alpha: .78 });
  const tailTuft = new PIXI.Graphics().ellipse(-92, 31, 6, 10).fill(0x34281f);

  root.addChild(bodyShadow, body, shoulder, tail, tailTuft, head);
  root.head = head;
  root.legs = legs;
  return root;
}

function makeWagon() {
  const PIXI = P();
  const root = new PIXI.Container();
  const coverBack = new PIXI.Graphics()
    .roundRect(36, -94, 178, 112, 58)
    .fill({ color: 0xd5c5a4, alpha: .58 });
  const cover = new PIXI.Graphics()
    .roundRect(31, -102, 184, 116, 58)
    .fill(0xe9dec4)
    .stroke({ color: 0x4e3524, width: 4, alpha: .8 });
  const coverHighlight = new PIXI.Graphics()
    .moveTo(55, -83).bezierCurveTo(94, -112, 155, -109, 193, -72)
    .stroke({ color: 0xfff4d8, width: 8, alpha: .4 });
  const body = new PIXI.Graphics()
    .roundRect(22, -10, 216, 57, 5).fill(0x805538)
    .stroke({ color: 0x3c271a, width: 4 });
  const slat = new PIXI.Graphics()
    .moveTo(34, 10).lineTo(225, 10)
    .moveTo(34, 28).lineTo(225, 28)
    .stroke({ color: 0x4f321f, width: 2, alpha: .48 });
  const tongue = new PIXI.Graphics().roundRect(232, 15, 172, 8, 4).fill(0x4f331f);
  const axle = new PIXI.Graphics().roundRect(60, 46, 145, 7, 3).fill(0x37251a);
  const wheel1 = makeWheel(33);
  const wheel2 = makeWheel(33);
  wheel1.position.set(73, 53);
  wheel2.position.set(198, 53);

  root.addChild(coverBack, cover, coverHighlight, body, slat, tongue, axle, wheel1, wheel2);
  root.wheels = [wheel1, wheel2];
  root.cover = cover;
  return root;
}

export class Painting2DRenderer {
  constructor() {
    this.app = null;
    this.root = null;
    this.world = null;
    this.wagon = null;
    this.oxen = [];
    this.grass = [];
    this.dust = [];
    this.rain = [];
    this.birds = [];
    this.lastCpuMs = 0;
    this.fps = 0;
    this.frames = 0;
    this.lastFpsStamp = performance.now();
    this.stageElement = null;
  }

  async init(container) {
    const PIXI = P();
    this.stageElement = container.closest('.painting-stage');
    const app = new PIXI.Application();
    await app.init({ resizeTo: container, backgroundAlpha: 0, antialias: true, resolution: Math.min(2, devicePixelRatio || 1), autoDensity: true });
    container.appendChild(app.canvas);
    app.ticker.stop();
    this.app = app;

    const root = new PIXI.Container();
    root.eventMode = 'none';
    app.stage.addChild(root);
    this.root = root;

    const world = new PIXI.Container();
    root.addChild(world);
    this.world = world;

    this.createEnvironment();
    this.createTravelParty();
    this.resize();
    return this;
  }

  createEnvironment() {
    const PIXI = P();
    const wash = new PIXI.Graphics().rect(0, 0, 1400, 700).fill({ color: 0xc58949, alpha: .035 });
    this.world.addChild(wash);

    for (let i = 0; i < 58; i += 1) {
      const tuft = new PIXI.Graphics();
      const height = 18 + (i % 6) * 3;
      tuft
        .moveTo(0, height).bezierCurveTo(4, height * .52, 8, height * .25, 10, 0)
        .moveTo(7, height).bezierCurveTo(10, height * .6, 18, height * .4, 22, height * .12)
        .moveTo(13, height).bezierCurveTo(16, height * .58, 24, height * .42, 29, height * .3)
        .stroke({ color: i % 3 ? 0x4c5333 : 0x6e6338, width: 3 + (i % 2), alpha: .62 });
      tuft.x = (i * 137) % 1400;
      tuft.y = 440 + ((i * 71) % 190);
      tuft.scale.set(.72 + (i % 5) * .08);
      tuft.metadata = { baseX: tuft.x, phase: i * .63, baseY: tuft.y };
      this.grass.push(tuft);
      this.world.addChild(tuft);
    }

    for (let i = 0; i < 24; i += 1) {
      const puff = new PIXI.Graphics().ellipse(0, 0, 20 + (i % 5) * 6, 10 + (i % 4) * 4).fill({ color: 0xd9b279, alpha: .14 });
      puff.metadata = { phase: i / 24, seed: (i * .618) % 1 };
      this.dust.push(puff);
      this.world.addChild(puff);
    }

    for (let i = 0; i < 85; i += 1) {
      const drop = new PIXI.Graphics().moveTo(0, 0).lineTo(-8, 22).stroke({ color: 0xe3ece9, width: 1.5, alpha: .44 });
      drop.metadata = { phase: (i * .731) % 1, x: (i * 83) % 1450 };
      drop.visible = false;
      this.rain.push(drop);
      this.world.addChild(drop);
    }

    for (let i = 0; i < 5; i += 1) {
      const bird = new PIXI.Graphics()
        .moveTo(-12, 0).bezierCurveTo(-7, -5, -3, -5, 0, 0)
        .bezierCurveTo(4, -5, 8, -5, 13, 0)
        .stroke({ color: 0x3a3023, width: 2.2, alpha: .55 });
      bird.metadata = { phase: i * 1.34, y: 90 + i * 25, baseX: 180 + i * 240 };
      this.birds.push(bird);
      this.world.addChild(bird);
    }
  }

  createTravelParty() {
    const PIXI = P();
    const team = new PIXI.Container();
    team.position.set(320, 405);
    this.team = team;

    const yoke = new PIXI.Graphics()
      .roundRect(278, -4, 92, 7, 3).fill({ color: 0x5d3d25, alpha: .9 })
      .moveTo(320, 0).lineTo(410, 18).stroke({ color: 0x4c311f, width: 5, alpha: .82 });

    const oxBack = makeOx(1);
    oxBack.scale.set(.68);
    oxBack.position.set(388, -2);
    oxBack.alpha = .9;
    const oxFront = makeOx(0);
    oxFront.scale.set(.73);
    oxFront.position.set(355, 12);

    const wagon = makeWagon();
    wagon.position.set(0, 0);
    wagon.scale.set(.82);
    this.wagon = wagon;
    this.oxen = [oxBack, oxFront];

    team.addChild(wagon, yoke, oxBack, oxFront);
    this.world.addChild(team);
  }

  resize() {
    if (!this.app) return;
    this.app.renderer.resize(this.app.canvas.parentElement.clientWidth, this.app.canvas.parentElement.clientHeight);
    const w = this.app.renderer.width / this.app.renderer.resolution;
    const h = this.app.renderer.height / this.app.renderer.resolution;
    const scale = Math.min(w / 1400, h / 700);
    this.root.scale.set(scale);
    this.root.position.set((w - 1400 * scale) / 2, (h - 700 * scale) / 2);
  }

  update(delta, state) {
    if (!this.app) return;
    const start = performance.now();
    const t = state.elapsed;
    const speed = state.travelSpeed;
    const moving = !state.paused && speed > .01;
    const gait = t * (4.8 + speed * 2.7);

    this.team.y = 405 + (moving ? Math.sin(gait * .72) * 2.2 : 0);
    this.team.rotation = moving ? Math.sin(gait * .34) * .0035 : 0;
    this.wagon.wheels.forEach((wheel) => { if (moving) wheel.rotation = gait * .78; });
    this.wagon.cover.scale.y = 1 + Math.sin(t * 1.45) * .006 * state.wind;

    this.oxen.forEach((ox, oxIndex) => {
      ox.y = (oxIndex ? -2 : 12) + (moving ? Math.sin(gait + oxIndex * .7) * 2.5 : 0);
      ox.head.rotation = moving ? Math.sin(gait * .48 + oxIndex) * .04 : 0;
      ox.legs.forEach((leg, legIndex) => {
        leg.rotation = moving ? Math.sin(gait + legIndex * Math.PI / 2 + oxIndex * .55) * .3 : 0;
      });
    });

    this.grass.forEach((tuft) => {
      const travelOffset = moving ? (t * speed * 44) : 0;
      tuft.x = ((tuft.metadata.baseX - travelOffset) % 1470 + 1470) % 1470 - 35;
      tuft.skew.x = Math.sin(t * 1.35 + tuft.metadata.phase) * state.wind * .18;
      tuft.y = tuft.metadata.baseY + Math.sin(t * 1.8 + tuft.metadata.phase) * state.wind * 1.8;
    });

    this.dust.forEach((puff, index) => {
      const p = (puff.metadata.phase + t * (.09 + speed * .065)) % 1;
      puff.visible = moving && state.weather !== 'rain' && state.weather !== 'storm';
      puff.x = 300 - p * (170 + speed * 70);
      puff.y = 456 - p * 65 + Math.sin(index * 1.7) * 8;
      const s = .55 + p * 2.2;
      puff.scale.set(s);
      puff.alpha = Math.max(0, (1 - p) * (.28 + state.atmosphere * .2));
    });

    const wet = state.weather === 'rain' || state.weather === 'storm';
    this.rain.forEach((drop, index) => {
      drop.visible = wet;
      if (!wet) return;
      const p = (drop.metadata.phase + t * (1.1 + (state.weather === 'storm' ? .8 : .25))) % 1;
      drop.x = drop.metadata.x - p * (90 + state.wind * 150);
      drop.y = -20 + p * 760;
      drop.alpha = state.weather === 'storm' ? .58 : .38;
      drop.scale.set(state.weather === 'storm' ? 1.25 : 1);
    });

    this.birds.forEach((bird) => {
      bird.x = bird.metadata.baseX + Math.sin(t * .15 + bird.metadata.phase) * 70;
      bird.y = bird.metadata.y + Math.sin(t * .42 + bird.metadata.phase) * 8;
      bird.scale.y = .85 + Math.sin(t * 3 + bird.metadata.phase) * .16;
      bird.visible = state.weather === 'clear' || state.weather === 'wind';
    });

    const sky = this.stageElement?.querySelector('.layer-sky');
    const mountains = this.stageElement?.querySelector('.layer-mountains');
    const ground = this.stageElement?.querySelector('.layer-ground');
    if (sky && mountains && ground) {
      const drift = moving ? t * speed : 0;
      const windWave = Math.sin(t * .19) * state.wind;
      sky.style.transform = `scale(1.07) translate3d(${(-drift * .25 + windWave * 3).toFixed(2)}px,0,0)`;
      mountains.style.transform = `scale(1.07) translate3d(${(-drift * .85).toFixed(2)}px,${Math.sin(t * .1) * .8}px,0)`;
      ground.style.transform = `scale(1.08) translate3d(${(-drift * 2.1).toFixed(2)}px,0,0)`;
    }

    this.app.renderer.render(this.app.stage);
    this.lastCpuMs = performance.now() - start;
    this.frames += 1;
    const now = performance.now();
    if (now - this.lastFpsStamp >= 600) {
      this.fps = this.frames * 1000 / (now - this.lastFpsStamp);
      this.frames = 0;
      this.lastFpsStamp = now;
    }
  }

  getMetrics() {
    return {
      backend: this.app?.renderer?.type === P().RendererType.WEBGPU ? 'WebGPU' : 'WebGL',
      fps: this.fps,
      cpuMs: this.lastCpuMs,
      objects: this.world?.children?.length || 0,
    };
  }

  destroy() {
    this.app?.destroy(true, { children: true });
  }
}
