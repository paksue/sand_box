const Phaser = window.Phaser;
const spineRuntime = window.spine;
if (!Phaser) throw new Error('Phaser 4.2.1 did not load.');

const STAGE_W = 960;
const STAGE_H = 600;
const HERO_PAINTING_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/The_Last_of_the_Buffalo.jpg/1280px-The_Last_of_the_Buffalo.jpg';
// Crop calibrated against the approved horse/rider detail. It is normalized back
// to the 316×264 coordinate system used by the painterly masks below.
const HERO_CROP = { x: 467, y: 240, w: 421, h: 352, outW: 316, outH: 264 };
const PARTS = [{"name":"tail","bbox":[181,134,249,198],"poly":[[188,141],[201,143],[213,148],[225,153],[237,158],[241,167],[237,178],[230,188],[221,190],[219,179],[214,171],[205,165],[197,160],[190,156]],"atlas":{"x":4,"y":4,"w":68,"h":64}},{"name":"hind_leg","bbox":[129,135,196,245],"poly":[[162,142],[177,142],[187,152],[188,167],[186,185],[181,202],[168,216],[154,226],[142,237],[136,232],[144,220],[154,208],[163,197],[168,185],[170,169],[166,156]],"atlas":{"x":76,"y":4,"w":67,"h":110}},{"name":"horse_body","bbox":[54,80,210,186],"poly":[[70,111],[88,93],[111,87],[133,89],[148,101],[161,120],[177,135],[194,143],[202,153],[198,165],[185,174],[166,178],[147,169],[129,164],[109,163],[89,157],[72,148],[61,135]],"atlas":{"x":147,"y":4,"w":156,"h":106}},{"name":"front_legs","bbox":[11,105,111,166],"poly":[[80,112],[69,117],[58,124],[48,127],[39,132],[27,139],[18,151],[25,158],[38,153],[48,145],[58,140],[68,139],[78,143],[90,138],[101,128],[103,118]],"atlas":{"x":307,"y":4,"w":100,"h":61}},{"name":"horse_head_neck","bbox":[77,41,161,147],"poly":[[93,58],[105,53],[124,48],[140,51],[151,62],[153,79],[148,94],[145,112],[139,129],[128,139],[112,137],[97,127],[87,114],[84,97],[88,80]],"atlas":{"x":411,"y":4,"w":84,"h":106}},{"name":"rider_torso_leg","bbox":[134,57,189,185],"poly":[[148,69],[159,64],[172,65],[180,73],[181,86],[176,101],[170,113],[168,128],[169,143],[164,158],[158,174],[148,177],[141,167],[141,151],[143,133],[144,114],[142,97],[144,82]],"atlas":{"x":4,"y":118,"w":55,"h":128}},{"name":"rider_arm_spear","bbox":[156,17,302,92],"poly":[[163,76],[174,72],[183,66],[194,59],[208,52],[222,46],[236,40],[249,34],[264,30],[279,26],[293,24],[294,30],[280,35],[266,40],[252,45],[237,50],[223,56],[210,61],[198,68],[186,77],[175,83],[168,84]],"atlas":{"x":63,"y":118,"w":146,"h":75}},{"name":"rider_head_feathers","bbox":[147,44,212,87],"poly":[[154,57],[161,52],[170,51],[177,55],[183,61],[190,57],[197,55],[204,57],[199,62],[194,64],[200,67],[194,70],[186,68],[181,73],[176,79],[168,79],[160,74],[154,68]],"atlas":{"x":213,"y":118,"w":65,"h":43}}];
const SPINE_SKELETON = {"skeleton":{"hash":"frontier-master-animator-poc","spine":"4.3.0","x":-158,"y":0,"width":316,"height":246,"images":"./"},"bones":[{"name":"root"},{"name":"horse_body","parent":"root","x":-28,"y":101},{"name":"horse_head_neck","parent":"horse_body","x":9,"y":33},{"name":"front_legs","parent":"horse_body","x":-48,"y":24},{"name":"hind_leg","parent":"horse_body","x":36,"y":-6},{"name":"tail","parent":"horse_body","x":62,"y":-6},{"name":"rider_torso_leg","parent":"horse_body","x":25,"y":0},{"name":"rider_arm_spear","parent":"rider_torso_leg","x":14,"y":66},{"name":"rider_head_feathers","parent":"rider_torso_leg","x":10,"y":77}],"slots":[{"name":"tail","bone":"tail","attachment":"tail"},{"name":"hind_leg","bone":"hind_leg","attachment":"hind_leg"},{"name":"horse_body","bone":"horse_body","attachment":"horse_body"},{"name":"front_legs","bone":"front_legs","attachment":"front_legs"},{"name":"horse_head_neck","bone":"horse_head_neck","attachment":"horse_head_neck"},{"name":"rider_torso_leg","bone":"rider_torso_leg","attachment":"rider_torso_leg"},{"name":"rider_arm_spear","bone":"rider_arm_spear","attachment":"rider_arm_spear"},{"name":"rider_head_feathers","bone":"rider_head_feathers","attachment":"rider_head_feathers"}],"skins":[{"name":"default","attachments":{"tail":{"tail":{"x":23.0,"y":-15.0,"width":68,"height":64}},"hind_leg":{"hind_leg":{"x":-3.5,"y":-39.0,"width":67,"height":110}},"horse_body":{"horse_body":{"x":2.0,"y":12.0,"width":156,"height":106}},"front_legs":{"front_legs":{"x":-21.0,"y":-14.5,"width":100,"height":61}},"horse_head_neck":{"horse_head_neck":{"x":-20.0,"y":18.0,"width":84,"height":106}},"rider_torso_leg":{"rider_torso_leg":{"x":6.5,"y":24.0,"width":55,"height":128}},"rider_arm_spear":{"rider_arm_spear":{"x":60.0,"y":24.5,"width":146,"height":75}},"rider_head_feathers":{"rider_head_feathers":{"x":14.5,"y":2.5,"width":65,"height":43}}}}],"animations":{}};

const stageEl = document.querySelector('#heroMotionStage');
const sourceReference = document.querySelector('#sourceReference');
const liveState = document.querySelector('#liveState');
const clipCaption = document.querySelector('#clipCaption');
const timeCaption = document.querySelector('#timeCaption');
const currentClipEl = document.querySelector('#currentClip');
const scrub = document.querySelector('#motionScrub');
const scrubOutput = document.querySelector('#scrubOutput');
const strength = document.querySelector('#motionStrength');
const strengthOutput = document.querySelector('#strengthOutput');
const secondaryToggle = document.querySelector('#secondaryMotion');
const impactToggle = document.querySelector('#impactFx');
const selectionToggle = document.querySelector('#selectionGlow');

const engineMetric = document.querySelector('#engineMetric');
const rigMetric = document.querySelector('#rigMetric');
const partsMetric = document.querySelector('#partsMetric');
const dropMetric = document.querySelector('#dropMetric');
const travelMetric = document.querySelector('#travelMetric');
const fpsMetric = document.querySelector('#fpsMetric');

function smooth(t) {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
}

function sample(frames, t) {
  if (!frames?.length) return 0;
  if (t <= frames[0][0]) return frames[0][1];
  for (let i = 0; i < frames.length - 1; i += 1) {
    const a = frames[i], b = frames[i + 1];
    if (t <= b[0]) {
      const u = smooth((t - a[0]) / Math.max(.0001, b[0] - a[0]));
      return Phaser.Math.Linear(a[1], b[1], u);
    }
  }
  return frames[frames.length - 1][1];
}

function createPartCanvas(source, cfg) {
  const [l,t,r,b] = cfg.bbox;
  const w = r - l, h = b - t;
  const part = document.createElement('canvas');
  part.width = w; part.height = h;
  const ctx = part.getContext('2d');
  ctx.drawImage(source, -l, -t);

  const mask = document.createElement('canvas');
  mask.width = w; mask.height = h;
  const m = mask.getContext('2d');
  m.fillStyle = '#fff';
  m.beginPath();
  cfg.poly.forEach((p, i) => {
    const x = p[0] - l, y = p[1] - t;
    if (i === 0) m.moveTo(x, y); else m.lineTo(x, y);
  });
  m.closePath();
  m.fill();

  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(mask, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  return part;
}

function installPaintedSpineAsset(scene) {
  if (scene.game.cache.json.exists('frontier-hero-data')) return;
  const fullSource = scene.textures.get('hero-source').getSourceImage();
  const source = document.createElement('canvas');
  source.width = HERO_CROP.outW; source.height = HERO_CROP.outH;
  const sourceCtx = source.getContext('2d');
  sourceCtx.drawImage(fullSource, HERO_CROP.x, HERO_CROP.y, HERO_CROP.w, HERO_CROP.h, 0, 0, HERO_CROP.outW, HERO_CROP.outH);
  sourceReference.src = source.toDataURL('image/png');

  const atlasCanvas = document.createElement('canvas');
  atlasCanvas.width = 512; atlasCanvas.height = 512;
  const ctx = atlasCanvas.getContext('2d');
  ctx.clearRect(0, 0, 512, 512);

  for (const cfg of PARTS) {
    const part = createPartCanvas(source, cfg);
    ctx.drawImage(part, cfg.atlas.x, cfg.atlas.y);
  }

  const atlasText = [
    'hero-atlas.png',
    '\tsize: 512, 512',
    '\tfilter: Linear, Linear',
    '\tpma: false',
    ...PARTS.flatMap((cfg) => [
      cfg.name,
      `\tbounds: ${cfg.atlas.x}, ${cfg.atlas.y}, ${cfg.atlas.w}, ${cfg.atlas.h}`,
    ]),
    '',
  ].join('\n');

  scene.textures.addCanvas('frontier-hero-atlas!hero-atlas.png', atlasCanvas);
  scene.game.cache.text.add('frontier-hero-atlas', atlasText);
  scene.game.cache.json.add('frontier-hero-data', SPINE_SKELETON);
}

const CLIPS = {
  alive: {
    duration: 3.2,
    loop: true,
    travel: [[0,0],[1,0]],
    rootY: [[0,0],[.25,-1.5],[.5,0],[.75,1.2],[1,0]],
    bones: {
      horse_body: { rotation:[[0,0],[.25,-.45],[.5,0],[.75,.45],[1,0]], y:[[0,0],[.25,.8],[.5,0],[.75,-.7],[1,0]] },
      horse_head_neck: { rotation:[[0,0],[.25,1.6],[.5,0],[.75,-1.4],[1,0]] },
      front_legs: { rotation:[[0,0],[.5,.8],[1,0]] },
      hind_leg: { rotation:[[0,0],[.5,-.7],[1,0]] },
      tail: { rotation:[[0,-2],[.25,3.5],[.5,1],[.75,-3.2],[1,-2]] },
      rider_torso_leg: { rotation:[[0,0],[.32,-.75],[.62,.65],[1,0]] },
      rider_arm_spear: { rotation:[[0,0],[.42,-1.3],[.72,1.1],[1,0]] },
      rider_head_feathers: { rotation:[[0,0],[.45,-1.5],[.75,1.25],[1,0]] },
    },
  },
  landing: {
    duration: 1.72,
    loop: false,
    impactAt: .43,
    travel: [[0,0],[.34,0],[.50,4],[.64,20],[.82,46],[1,60]],
    rootY: [[0,-12],[.25,-8],[.40,-2],[.48,12],[.58,17],[.70,9],[.86,3],[1,0]],
    bones: {
      horse_body: {
        rotation:[[0,-2.5],[.30,-1],[.46,3.7],[.58,5.0],[.75,1.3],[1,0]],
        y:[[0,0],[.46,-2],[.58,-7],[.78,-2],[1,0]],
        scaleY:[[0,0],[.48,0],[.58,-.035],[.72,-.015],[1,0]],
      },
      horse_head_neck: { rotation:[[0,-3],[.33,-1],[.50,9.5],[.63,6],[.82,-1.5],[1,0]] },
      front_legs: { rotation:[[0,-9],[.25,-4],[.42,14],[.52,29],[.64,24],[.80,10],[1,0]], x:[[0,0],[.58,-2],[1,0]] },
      hind_leg: { rotation:[[0,0],[.42,-5],[.58,-9],[.72,12],[.88,4],[1,0]], x:[[0,0],[.72,4],[1,0]] },
      tail: { rotation:[[0,-3],[.42,-6],[.58,2],[.73,12],[.9,4],[1,0]] },
      rider_torso_leg: { rotation:[[0,-1],[.38,-2.5],[.52,-4.5],[.64,7.5],[.80,3.5],[1,0]], y:[[0,0],[.56,1.2],[.72,-1.5],[1,0]] },
      rider_arm_spear: { rotation:[[0,0],[.45,-1],[.58,-3],[.70,-8.5],[.86,5.5],[1,0]] },
      rider_head_feathers: { rotation:[[0,0],[.50,-2],[.66,-5.5],[.82,5],[1,0]] },
    },
  },
};

class MasterAnimator {
  constructor(scene, hero, glow) {
    this.scene = scene;
    this.hero = hero;
    this.glow = glow;
    this.clipName = 'alive';
    this.time = 0;
    this.speed = 1;
    this.playing = true;
    this.strength = 1;
    this.secondary = true;
    this.impactFx = true;
    this.selection = true;
    this.base = { x: 465, y: 470 };
    this.lastNorm = 0;
    this.dustEvents = 0;
    this.setup = new Map();
    for (const obj of [hero, glow]) {
      const map = new Map();
      for (const b of obj.skeleton.bones) map.set(b.data.name, { x:b.x, y:b.y, rotation:b.rotation, scaleX:b.scaleX, scaleY:b.scaleY });
      this.setup.set(obj, map);
      obj.beforeUpdateWorldTransforms = () => this.applyTo(obj);
    }
    this.applyNow();
  }

  get clip() { return CLIPS[this.clipName]; }
  get norm() { return Math.max(0, Math.min(1, this.time / this.clip.duration)); }

  play(name, restart = true) {
    if (!CLIPS[name]) return;
    this.clipName = name;
    if (restart) this.time = 0;
    this.playing = true;
    this.lastNorm = this.norm;
    this.clearDust();
    this.applyNow();
    this.syncUI();
  }

  pauseToggle() {
    this.playing = !this.playing;
    document.querySelector('#playPause').textContent = this.playing ? 'Pause' : 'Play';
  }

  seek(norm) {
    this.time = this.clip.duration * Math.max(0, Math.min(1, norm));
    this.playing = false;
    document.querySelector('#playPause').textContent = 'Play';
    this.lastNorm = this.norm;
    this.applyNow();
    this.syncUI();
  }

  advance(deltaMs) {
    if (this.playing) {
      const previous = this.norm;
      this.time += deltaMs / 1000 * this.speed;
      if (this.time > this.clip.duration) {
        if (this.clip.loop) this.time %= this.clip.duration;
        else { this.time = this.clip.duration; this.playing = false; document.querySelector('#playPause').textContent = 'Play'; }
      }
      const n = this.norm;
      if (this.clip.impactAt != null && previous < this.clip.impactAt && n >= this.clip.impactAt) this.impact();
      this.lastNorm = n;
    }
    this.syncUI();
  }

  applyTo(obj) {
    const clip = this.clip;
    const n = this.norm;
    const setup = this.setup.get(obj);
    for (const b of obj.skeleton.bones) {
      const s = setup.get(b.data.name);
      if (!s) continue;
      b.x = s.x; b.y = s.y; b.rotation = s.rotation; b.scaleX = s.scaleX; b.scaleY = s.scaleY;
    }
    for (const [boneName, tracks] of Object.entries(clip.bones)) {
      const b = obj.skeleton.findBone(boneName);
      const s = setup.get(boneName);
      if (!b || !s) continue;
      const secondaryBone = boneName.startsWith('rider_');
      const m = this.strength * (secondaryBone && !this.secondary ? .12 : 1);
      if (tracks.rotation) b.rotation = s.rotation + sample(tracks.rotation, n) * m;
      if (tracks.x) b.x = s.x + sample(tracks.x, n) * m;
      if (tracks.y) b.y = s.y + sample(tracks.y, n) * m;
      if (tracks.scaleX) b.scaleX = s.scaleX * (1 + sample(tracks.scaleX, n) * m);
      if (tracks.scaleY) b.scaleY = s.scaleY * (1 + sample(tracks.scaleY, n) * m);
    }

    const travel = sample(clip.travel, n) * this.strength;
    const drop = sample(clip.rootY, n) * this.strength;
    obj.x = this.base.x + travel;
    obj.y = this.base.y + drop;
    obj.setScale(obj === this.glow ? 1.86 : 1.80);
    if (obj === this.glow) obj.alpha = this.selection ? .18 + Math.sin(performance.now() * .006) * .035 : 0;
  }

  applyNow() {
    for (const obj of [this.hero, this.glow]) {
      this.applyTo(obj);
      try {
        const physics = spineRuntime?.Physics?.update;
        if (physics !== undefined) obj.skeleton.updateWorldTransform(physics);
      } catch {}
    }
  }

  impact() {
    this.dustEvents += 1;
    if (!this.impactFx) return;
    const x = this.hero.x - 105;
    const y = this.hero.y - 12;
    for (let i = 0; i < 14; i += 1) {
      const p = this.scene.add.circle(x + Phaser.Math.Between(-18,18), y + Phaser.Math.Between(-5,5), Phaser.Math.Between(2,6), 0xc7a46e, .38).setDepth(40);
      this.scene.dust.push(p);
      this.scene.tweens.add({
        targets:p,
        x:p.x + Phaser.Math.Between(-42,44),
        y:p.y - Phaser.Math.Between(8,34),
        alpha:0,
        scale:Phaser.Math.FloatBetween(1.4,2.4),
        duration:Phaser.Math.Between(420,760),
        ease:'Quad.easeOut',
        onComplete:()=>{ p.destroy(); this.scene.dust = this.scene.dust.filter(d => d !== p); },
      });
    }
    this.scene.cameras.main.shake(70, .00135);
    this.scene.impactRing.setPosition(x, y).setAlpha(.78).setScale(.4);
    this.scene.tweens.add({ targets:this.scene.impactRing, alpha:0, scaleX:1.5, scaleY:1.5, duration:300, ease:'Quad.easeOut' });
  }

  clearDust() {
    for (const p of this.scene.dust) p.destroy();
    this.scene.dust = [];
  }

  syncUI() {
    const n = this.norm;
    clipCaption.textContent = this.clipName === 'landing' ? 'LAND → COMPRESS → STEP → SETTLE' : 'ALIVE HOLD · subtle weight + secondary motion';
    timeCaption.textContent = `${this.time.toFixed(2)} s`;
    currentClipEl.textContent = this.clipName;
    scrub.value = String(Math.round(n * 1000));
    scrubOutput.textContent = `${Math.round(n * 100)}%`;
    strengthOutput.textContent = `${Math.round(this.strength * 100)}%`;
  }

  snapshot() {
    const front = this.hero.skeleton.findBone('front_legs');
    const rider = this.hero.skeleton.findBone('rider_torso_leg');
    const spear = this.hero.skeleton.findBone('rider_arm_spear');
    return {
      ready:true,
      engine:Phaser.VERSION,
      spinePlugin:!!this.scene.add.spine,
      actualSpineObject:!!this.hero?.skeleton,
      paintedParts:PARTS.length,
      sourcePixels:'public-domain-painting-crop',
      clip:this.clipName,
      time:Number(this.time.toFixed(3)),
      norm:Number(this.norm.toFixed(3)),
      playing:this.playing,
      speed:this.speed,
      heroX:Number(this.hero.x.toFixed(2)),
      heroY:Number(this.hero.y.toFixed(2)),
      frontLegRotation:Number((front?.rotation ?? 0).toFixed(2)),
      riderRotation:Number((rider?.rotation ?? 0).toFixed(2)),
      spearRotation:Number((spear?.rotation ?? 0).toFixed(2)),
      secondaryLag:Number(Math.abs((spear?.rotation ?? 0) - (rider?.rotation ?? 0)).toFixed(2)),
      dustEvents:this.dustEvents,
      selectionGlow:this.selection,
    };
  }
}

class HeroMotionScene extends Phaser.Scene {
  constructor() { super('HeroMotion'); this.dust=[]; this.lastMetric=0; }

  preload() {
    this.load.setCORS('anonymous');
    this.load.image('hero-source', HERO_PAINTING_URL);
  }

  create() {
    installPaintedSpineAsset(this);

    this.add.ellipse(490, 500, 410, 58, 0x17100c, .22).setDepth(1);
    this.selectionRing = this.add.ellipse(468, 490, 330, 54, 0x3aeaff, .08)
      .setStrokeStyle(3, 0x55efff, .72).setDepth(3);
    this.impactRing = this.add.ellipse(0,0,70,18,0xe1c181,0)
      .setStrokeStyle(3,0xf0d499,.7).setDepth(39);

    const glow = this.add.spine(465, 470, 'frontier-hero-data', 'frontier-hero-atlas');
    glow.setTint(0x48eaff).setBlendMode(Phaser.BlendModes.ADD).setDepth(8);

    const hero = this.add.spine(465, 470, 'frontier-hero-data', 'frontier-hero-atlas');
    hero.setDepth(10);

    this.hero = hero;
    this.glow = glow;
    this.animator = new MasterAnimator(this, hero, glow);

    liveState.textContent = 'actual Spine skeleton · painted raster layers';
    stageEl.dataset.ready = 'true';
    engineMetric.textContent = `Phaser ${Phaser.VERSION} + Spine 4.3`;
    rigMetric.textContent = `${hero.skeleton.bones.length} bones / ${hero.skeleton.slots.length} slots`;
    partsMetric.textContent = `${PARTS.length} source-painted layers`;
    dropMetric.textContent = '29 px action arc';
    travelMetric.textContent = '60 px / one step';

    this.bindControls();

    window.heroMotionPOC = {
      play:(name)=>this.animator.play(name === 'land' ? 'landing' : name),
      seek:(n)=>this.animator.seek(n),
      pause:()=>{ this.animator.playing=false; },
      resume:()=>{ this.animator.playing=true; },
      setSpeed:(v)=>{ this.animator.speed=v; },
      snapshot:()=>this.animator.snapshot(),
    };

    this.animator.syncUI();
    window.__heroMotionDebug = this.animator.snapshot();
  }

  bindControls() {
    document.querySelector('#playAlive').addEventListener('click', () => this.animator.play('alive'));
    document.querySelector('#playLanding').addEventListener('click', () => this.animator.play('landing'));
    document.querySelector('#replay').addEventListener('click', () => this.animator.play(this.animator.clipName));
    document.querySelector('#playPause').addEventListener('click', () => this.animator.pauseToggle());

    for (const btn of document.querySelectorAll('.speed-button')) {
      btn.addEventListener('click', () => {
        this.animator.speed = Number(btn.dataset.speed);
        document.querySelectorAll('.speed-button').forEach((b) => b.classList.toggle('active', b === btn));
      });
    }
    scrub.addEventListener('input', () => this.animator.seek(Number(scrub.value) / 1000));
    strength.addEventListener('input', () => {
      this.animator.strength = Number(strength.value) / 100;
      this.animator.applyNow();
      this.animator.syncUI();
    });
    secondaryToggle.addEventListener('change', () => {
      this.animator.secondary = secondaryToggle.checked;
      this.animator.applyNow();
    });
    impactToggle.addEventListener('change', () => { this.animator.impactFx = impactToggle.checked; });
    selectionToggle.addEventListener('change', () => {
      this.animator.selection = selectionToggle.checked;
      this.selectionRing.setVisible(this.animator.selection);
      this.animator.applyNow();
    });
  }

  update(_time, delta) {
    if (!this.animator) return;
    this.animator.advance(delta);
    this.animator.applyNow();

    const pulse = .96 + Math.sin(performance.now() * .0048) * .035;
    this.selectionRing.setPosition(this.hero.x - 4, 490).setScale(pulse, 1);

    if (_time - this.lastMetric > 180) {
      this.lastMetric = _time;
      const snap = this.animator.snapshot();
      window.__heroMotionDebug = snap;
      fpsMetric.textContent = `${Math.round(this.game.loop.actualFps || 0)}`;
    }
  }
}

const spinePluginAvailable = !!spineRuntime?.SpinePlugin;
const config = {
  type: Phaser.WEBGL,
  width: STAGE_W,
  height: STAGE_H,
  parent:'heroPhaserMount',
  transparent:true,
  scene:[HeroMotionScene],
  render:{ antialias:true, roundPixels:false },
  scale:{ mode:Phaser.Scale.FIT, autoCenter:Phaser.Scale.CENTER_BOTH },
  plugins: spinePluginAvailable ? {
    scene:[{ key:'spine.SpinePlugin', plugin:spineRuntime.SpinePlugin, mapping:'spine' }],
  } : undefined,
};

new Phaser.Game(config);
