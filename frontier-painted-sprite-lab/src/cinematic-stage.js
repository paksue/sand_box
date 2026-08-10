import * as THREE from 'three';
import { ChildLightOxRig } from './child-light-rig.js';

const PIXI = window.PIXI;
const gsap = window.gsap;

const SHOT_DURATION = 12;
const BIERSTADT_URL = 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Emigrants_Crossing_the_Plains%2C_or_The_Oregon_Trail_%28Albert_Bierstadt%29%2C_1869.jpg';

const mount = document.querySelector('#threeMount');
const stageEl = document.querySelector('#cinematicStage');
const playPause = document.querySelector('#playPause');
const replayShot = document.querySelector('#replayShot');
const scrub = document.querySelector('#shotScrub');
const timeReadout = document.querySelector('#timeReadout');
const beatCaption = document.querySelector('#beatCaption');
const rendererCaption = document.querySelector('#rendererCaption');
const rendererMetric = document.querySelector('#rendererMetric');
const layerMetric = document.querySelector('#layerMetric');
const fpsMetric = document.querySelector('#fpsMetric');
const grainEl = document.querySelector('#cinemaGrain');
const cameraToggle = document.querySelector('#cameraMotion');
const foregroundToggle = document.querySelector('#foreground');
const atmosphereToggle = document.querySelector('#atmosphere');
const grainToggle = document.querySelector('#grain');

if (!mount || !PIXI || !gsap) throw new Error('Cinematic stage dependencies did not load.');

const state = {
  ready: false,
  cameraMotion: true,
  foreground: true,
  atmosphere: true,
  grain: true,
  backgroundLoaded: false,
};

function makeCanvasTexture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  draw(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

function frac(value) {
  return value - Math.floor(value);
}

function seeded(index, salt = 0) {
  return frac(Math.sin(index * 91.713 + salt * 37.119) * 43758.5453123);
}

function createFallbackPaintingTexture() {
  return makeCanvasTexture(1600, 1000, (ctx, w, h) => {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#a98969');
    sky.addColorStop(.43, '#c4a578');
    sky.addColorStop(.64, '#8d7b5e');
    sky.addColorStop(1, '#57462f');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    const glow = ctx.createRadialGradient(w * .72, h * .24, 30, w * .72, h * .24, w * .42);
    glow.addColorStop(0, 'rgba(246,214,157,.52)');
    glow.addColorStop(1, 'rgba(246,214,157,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = 'rgba(78,70,61,.68)';
    ctx.beginPath();
    ctx.moveTo(0, h * .57);
    ctx.lineTo(w * .12, h * .43);
    ctx.lineTo(w * .24, h * .53);
    ctx.lineTo(w * .38, h * .37);
    ctx.lineTo(w * .53, h * .55);
    ctx.lineTo(w * .68, h * .46);
    ctx.lineTo(w * .82, h * .57);
    ctx.lineTo(w, h * .49);
    ctx.lineTo(w, h * .72);
    ctx.lineTo(0, h * .72);
    ctx.closePath();
    ctx.fill();

    const ground = ctx.createLinearGradient(0, h * .55, 0, h);
    ground.addColorStop(0, 'rgba(113,94,62,.82)');
    ground.addColorStop(1, '#4b3823');
    ctx.fillStyle = ground;
    ctx.fillRect(0, h * .55, w, h * .45);

    for (let i = 0; i < 260; i += 1) {
      const x = seeded(i, 1) * w;
      const y = h * (.58 + seeded(i, 2) * .42);
      const len = 5 + seeded(i, 3) * 19;
      ctx.strokeStyle = `rgba(238,203,143,${.025 + seeded(i, 4) * .08})`;
      ctx.lineWidth = .5 + seeded(i, 5) * 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + (seeded(i, 6) - .5) * 6, y - len);
      ctx.stroke();
    }
  });
}

function createHazeTexture() {
  return makeCanvasTexture(1200, 650, (ctx, w, h) => {
    const haze = ctx.createLinearGradient(0, 0, 0, h);
    haze.addColorStop(0, 'rgba(233,210,176,0)');
    haze.addColorStop(.35, 'rgba(225,201,163,.11)');
    haze.addColorStop(.68, 'rgba(210,183,143,.27)');
    haze.addColorStop(1, 'rgba(174,143,104,.06)');
    ctx.fillStyle = haze;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 8; i += 1) {
      const x = seeded(i, 10) * w;
      const y = h * (.35 + seeded(i, 11) * .42);
      const r = 130 + seeded(i, 12) * 240;
      const cloud = ctx.createRadialGradient(x, y, 0, x, y, r);
      cloud.addColorStop(0, 'rgba(239,217,181,.11)');
      cloud.addColorStop(1, 'rgba(239,217,181,0)');
      ctx.fillStyle = cloud;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  });
}

function createGrassTexture() {
  return makeCanvasTexture(1800, 760, (ctx, w, h) => {
    const base = ctx.createLinearGradient(0, h * .63, 0, h);
    base.addColorStop(0, 'rgba(48,41,29,0)');
    base.addColorStop(1, 'rgba(41,31,21,.86)');
    ctx.fillStyle = base;
    ctx.fillRect(0, h * .56, w, h * .44);

    for (let i = 0; i < 210; i += 1) {
      const x = seeded(i, 20) * w;
      const y = h * (.74 + seeded(i, 21) * .27);
      const len = 32 + seeded(i, 22) * 145;
      const lean = (seeded(i, 23) - .5) * 50;
      const alpha = .16 + seeded(i, 24) * .33;
      ctx.strokeStyle = `rgba(${52 + Math.floor(seeded(i, 25) * 30)},${46 + Math.floor(seeded(i, 26) * 22)},${27 + Math.floor(seeded(i, 27) * 18)},${alpha})`;
      ctx.lineWidth = 1 + seeded(i, 28) * 4.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + lean * .32, y - len * .58, x + lean, y - len);
      ctx.stroke();
    }
  });
}

function createShadowTexture() {
  return makeCanvasTexture(512, 220, (ctx, w, h) => {
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(1, .26);
    const shadow = ctx.createRadialGradient(0, 0, 8, 0, 0, w * .42);
    shadow.addColorStop(0, 'rgba(37,24,15,.42)');
    shadow.addColorStop(.58, 'rgba(37,24,15,.18)');
    shadow.addColorStop(1, 'rgba(37,24,15,0)');
    ctx.fillStyle = shadow;
    ctx.beginPath();
    ctx.arc(0, 0, w * .44, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function createSoftParticleTexture() {
  return makeCanvasTexture(96, 96, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,231,190,.8)');
    g.addColorStop(.3, 'rgba(219,181,132,.38)');
    g.addColorStop(1, 'rgba(184,137,91,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0x443525, 1);
mount.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(27, 16 / 9, .1, 100);
camera.position.set(-.72, .18, 10.5);

const fallbackPainting = createFallbackPaintingTexture();
const paintingMaterial = new THREE.MeshBasicMaterial({ map: fallbackPainting, toneMapped: false });
const painting = new THREE.Mesh(new THREE.PlaneGeometry(18.4, 11.2), paintingMaterial);
painting.position.set(0, .15, -9);
painting.name = 'painted-background';
scene.add(painting);

const hazeMaterial = new THREE.MeshBasicMaterial({
  map: createHazeTexture(),
  transparent: true,
  opacity: .19,
  depthWrite: false,
  toneMapped: false,
});
const haze = new THREE.Mesh(new THREE.PlaneGeometry(13.7, 7.5), hazeMaterial);
haze.position.set(.25, -.1, -3.7);
haze.renderOrder = 2;
scene.add(haze);

const sunMaterial = new THREE.SpriteMaterial({
  map: createSoftParticleTexture(),
  color: 0xf1c780,
  transparent: true,
  opacity: .16,
  depthWrite: false,
  toneMapped: false,
});
const sunBloom = new THREE.Sprite(sunMaterial);
sunBloom.position.set(3.2, 1.85, -2.8);
sunBloom.scale.set(3.8, 3.8, 1);
sunBloom.renderOrder = 3;
scene.add(sunBloom);

const actorApp = new PIXI.Application();
await actorApp.init({
  width: 900,
  height: 620,
  backgroundAlpha: 0,
  antialias: true,
  autoStart: false,
  preference: 'webgl',
  preserveDrawingBuffer: true,
  resolution: 1,
});
actorApp.stop();

const oxRig = await new ChildLightOxRig().init();
oxRig.setMotionStrength(.79);
oxRig.setActorScale(1.28);
oxRig.setDustEnabled(false);
oxRig.setHeroFocus(true);
actorApp.stage.addChild(oxRig.root);
oxRig.layout(900, 620);
oxRig.root.x = 470;
oxRig.root.y = 520;
oxRig.updatePose(0);
actorApp.renderer.render(actorApp.stage);

const actorTexture = new THREE.CanvasTexture(actorApp.canvas);
actorTexture.colorSpace = THREE.SRGBColorSpace;
actorTexture.generateMipmaps = false;
actorTexture.minFilter = THREE.LinearFilter;
actorTexture.magFilter = THREE.LinearFilter;
actorTexture.needsUpdate = true;

const actorMaterial = new THREE.MeshBasicMaterial({
  map: actorTexture,
  transparent: true,
  alphaTest: .012,
  depthWrite: false,
  premultipliedAlpha: true,
  toneMapped: false,
});
const actor = new THREE.Mesh(new THREE.PlaneGeometry(5.15, 3.55), actorMaterial);
actor.position.set(2.2, -1.08, .15);
actor.renderOrder = 5;
actor.name = 'animated-actor-texture';
scene.add(actor);

const shadowMaterial = new THREE.MeshBasicMaterial({
  map: createShadowTexture(),
  transparent: true,
  opacity: .72,
  depthWrite: false,
  toneMapped: false,
});
const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.55, .92), shadowMaterial);
shadow.position.set(2.18, -2.02, .04);
shadow.renderOrder = 4;
scene.add(shadow);

const dustTexture = createSoftParticleTexture();
const dustSprites = [];
const dustGroup = new THREE.Group();
dustGroup.name = 'dust-front-and-back';
scene.add(dustGroup);
for (let i = 0; i < 28; i += 1) {
  const material = new THREE.SpriteMaterial({
    map: dustTexture,
    color: i % 3 === 0 ? 0xe0b98b : 0xc59d70,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    toneMapped: false,
  });
  const sprite = new THREE.Sprite(material);
  const baseScale = .11 + seeded(i, 31) * .22;
  sprite.scale.set(baseScale, baseScale, 1);
  sprite.renderOrder = i % 4 === 0 ? 7 : 4;
  dustGroup.add(sprite);
  dustSprites.push({
    sprite,
    baseScale,
    phase: seeded(i, 32),
    drift: .75 + seeded(i, 33) * 1.25,
    rise: .18 + seeded(i, 34) * .48,
    side: seeded(i, 35) - .5,
  });
}

const foregroundMaterial = new THREE.MeshBasicMaterial({
  map: createGrassTexture(),
  transparent: true,
  opacity: .94,
  depthWrite: false,
  toneMapped: false,
});
const foreground = new THREE.Mesh(new THREE.PlaneGeometry(10.5, 4.45), foregroundMaterial);
foreground.position.set(-.55, -1.48, 4.05);
foreground.renderOrder = 10;
foreground.name = 'foreground-grass';
scene.add(foreground);

const shotState = {
  cameraX: -.72,
  cameraY: .18,
  cameraZ: 10.5,
  targetX: .12,
  targetY: -.16,
  actorX: 2.2,
  actorY: -1.08,
  actorTilt: .012,
  foregroundX: -.55,
  hazeOpacity: .19,
  sunOpacity: .16,
};

function shotBeat(time) {
  if (time < 3) return 'Establish · camera enters the painted world';
  if (time < 6.5) return 'Travel · animated ox layer crosses the composition';
  if (time < 9.5) return 'Foreground wipe · near grass passes between viewer and actor';
  return 'Settle · camera eases into the end frame';
}

function syncTransport() {
  const time = shot.time();
  scrub.value = String(Math.round((time / SHOT_DURATION) * 1000));
  timeReadout.textContent = `${time.toFixed(1)} / ${SHOT_DURATION.toFixed(1)} s`;
  beatCaption.textContent = shotBeat(time);
}

const shot = gsap.timeline({
  paused: true,
  defaults: { ease: 'none' },
  onUpdate: syncTransport,
  onComplete: () => {
    playPause.textContent = 'Replay';
  },
});

shot.addLabel('establish', 0)
  .to(shotState, { cameraX: .58, cameraY: .04, cameraZ: 9.18, targetX: -.08, targetY: -.2, duration: SHOT_DURATION, ease: 'power1.inOut' }, 0)
  .to(shotState, { actorX: -1.28, actorY: -1.12, actorTilt: -.008, duration: SHOT_DURATION, ease: 'none' }, 0)
  .to(shotState, { hazeOpacity: .31, duration: 4.2, ease: 'sine.inOut' }, .9)
  .to(shotState, { hazeOpacity: .21, duration: 5.8, ease: 'sine.inOut' }, 5.1)
  .to(shotState, { sunOpacity: .27, duration: 5.4, ease: 'sine.inOut' }, .5)
  .to(shotState, { sunOpacity: .17, duration: 5.2, ease: 'sine.inOut' }, 6)
  .addLabel('travel', 3)
  .addLabel('foreground-wipe', 6.5)
  .to(shotState, { foregroundX: .82, duration: 3.3, ease: 'power1.inOut' }, 6.35)
  .addLabel('settle', 9.5);

shot.duration(SHOT_DURATION);
shot.pause(0);

function applyShotState(time) {
  if (state.cameraMotion) {
    camera.position.set(shotState.cameraX, shotState.cameraY, shotState.cameraZ);
    camera.lookAt(shotState.targetX, shotState.targetY, 0);
  } else {
    camera.position.set(0, .12, 10.2);
    camera.lookAt(0, -.18, 0);
  }

  actor.position.x = shotState.actorX;
  actor.position.y = shotState.actorY;
  actor.rotation.z = shotState.actorTilt;
  shadow.position.x = shotState.actorX - .02;
  shadow.position.y = shotState.actorY - .94;

  foreground.position.x = shotState.foregroundX;
  foreground.visible = state.foreground;

  hazeMaterial.opacity = state.atmosphere ? shotState.hazeOpacity : 0;
  sunMaterial.opacity = state.atmosphere ? shotState.sunOpacity : 0;
  dustGroup.visible = state.atmosphere;

  for (let i = 0; i < dustSprites.length; i += 1) {
    const dust = dustSprites[i];
    const life = frac(dust.phase + time * (.085 + (i % 5) * .004));
    const bell = Math.sin(Math.PI * life);
    dust.sprite.position.set(
      shotState.actorX - .4 + dust.side * 1.45 - life * dust.drift,
      shotState.actorY - .78 + life * dust.rise + (seeded(i, 36) - .5) * .16,
      i % 4 === 0 ? .95 : -.08,
    );
    const scale = dust.baseScale * (.45 + life * 1.55);
    dust.sprite.scale.set(scale, scale, 1);
    dust.sprite.material.opacity = state.atmosphere ? bell * (.055 + seeded(i, 37) * .11) : 0;
  }
}

let lastActorTime = Number.NaN;
function renderActor(time) {
  if (Math.abs(time - lastActorTime) < .0001) return;
  oxRig.updatePose(time * 2.68);
  actorApp.renderer.render(actorApp.stage);
  actorTexture.needsUpdate = true;
  lastActorTime = time;
}

function resize() {
  const width = Math.max(1, mount.clientWidth);
  const height = Math.max(1, mount.clientHeight);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

new ResizeObserver(resize).observe(mount);
resize();

const loader = new THREE.TextureLoader();
loader.setCrossOrigin('anonymous');
loader.load(
  BIERSTADT_URL,
  (texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    paintingMaterial.map = texture;
    paintingMaterial.needsUpdate = true;
    fallbackPainting.dispose();
    state.backgroundLoaded = true;
  },
  undefined,
  () => {
    state.backgroundLoaded = false;
  },
);

function updateToggleState() {
  state.cameraMotion = cameraToggle.checked;
  state.foreground = foregroundToggle.checked;
  state.atmosphere = atmosphereToggle.checked;
  state.grain = grainToggle.checked;
  grainEl.classList.toggle('off', !state.grain);
}

cameraToggle.addEventListener('change', updateToggleState);
foregroundToggle.addEventListener('change', updateToggleState);
atmosphereToggle.addEventListener('change', updateToggleState);
grainToggle.addEventListener('change', updateToggleState);

playPause.addEventListener('click', () => {
  if (shot.progress() >= .999) {
    shot.restart();
    playPause.textContent = 'Pause';
    return;
  }
  if (shot.paused()) {
    shot.play();
    playPause.textContent = 'Pause';
  } else {
    shot.pause();
    playPause.textContent = 'Play';
  }
});

replayShot.addEventListener('click', () => {
  shot.restart();
  playPause.textContent = 'Pause';
});

for (const button of document.querySelectorAll('.speed-button')) {
  button.addEventListener('click', () => {
    const speed = Number(button.dataset.speed);
    shot.timeScale(speed);
    document.querySelectorAll('.speed-button').forEach((candidate) => {
      candidate.classList.toggle('active', candidate === button);
    });
  });
}

scrub.addEventListener('input', () => {
  const progress = Number(scrub.value) / 1000;
  shot.pause();
  shot.progress(progress);
  playPause.textContent = progress >= .999 ? 'Replay' : 'Play';
  syncTransport();
});

updateToggleState();

const gl = renderer.getContext();
const rendererKind = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext ? 'WebGL2' : 'WebGL';
rendererMetric.textContent = `Three r185 · ${rendererKind}`;
rendererCaption.textContent = `Three.js r185 · ${rendererKind} · GSAP 3.13 shot timeline`;
layerMetric.textContent = 'background · haze · actor · dust · foreground';

let fpsFrames = 0;
let fpsElapsed = 0;
let lastFrameTime = performance.now();
function frame(now) {
  const delta = Math.min((now - lastFrameTime) / 1000, .1);
  lastFrameTime = now;
  fpsFrames += 1;
  fpsElapsed += delta;
  if (fpsElapsed >= .75) {
    fpsMetric.textContent = `${Math.round(fpsFrames / fpsElapsed)} fps`;
    fpsFrames = 0;
    fpsElapsed = 0;
  }

  const time = shot.time();
  applyShotState(time);
  renderActor(time);
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

state.ready = true;
stageEl.dataset.ready = 'true';
syncTransport();
shot.play(0);

window.__cinematicLab = {
  state,
  shot,
  renderer,
  scene,
  camera,
  actor,
  oxRig,
  seek(time) {
    shot.pause();
    shot.time(Math.max(0, Math.min(SHOT_DURATION, Number(time))));
    applyShotState(shot.time());
    renderActor(shot.time());
    renderer.render(scene, camera);
    syncTransport();
    playPause.textContent = shot.progress() >= .999 ? 'Replay' : 'Play';
  },
  getDebugState() {
    return {
      ready: state.ready,
      time: shot.time(),
      progress: shot.progress(),
      paused: shot.paused(),
      cameraMotion: state.cameraMotion,
      camera: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
      actor: { x: actor.position.x, y: actor.position.y, z: actor.position.z },
      layers: {
        backgroundZ: painting.position.z,
        hazeZ: haze.position.z,
        actorZ: actor.position.z,
        foregroundZ: foreground.position.z,
      },
      foregroundVisible: foreground.visible,
      atmosphereVisible: hazeMaterial.opacity > 0,
      backgroundLoaded: state.backgroundLoaded,
    };
  },
};
