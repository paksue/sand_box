const B = () => window.BABYLON;

function hexColor(hex) {
  return B().Color3.FromHexString(hex);
}

function pbr(scene, name, color, roughness = 0.82, alpha = 1) {
  const material = new (B().PBRMaterial)(name, scene);
  material.albedoColor = hexColor(color);
  material.roughness = roughness;
  material.metallic = 0;
  material.alpha = alpha;
  if (alpha < 1) material.transparencyMode = B().Material.MATERIAL_ALPHABLEND;
  return material;
}

function enableSoftEdges(mesh, alpha = 0.34, width = 1.35) {
  mesh.enableEdgesRendering();
  mesh.edgesWidth = width;
  mesh.edgesColor = new (B().Color4)(0.13, 0.075, 0.035, alpha);
}

export class BabylonPaintingRenderer {
  constructor() {
    this.engine = null;
    this.scene = null;
    this.camera = null;
    this.backend = 'WebGL';
    this.wagon = null;
    this.wheels = [];
    this.oxen = [];
    this.grass = [];
    this.dust = [];
    this.rain = [];
    this.lastCpuMs = 0;
    this.frames = 0;
    this.fps = 0;
    this.lastFpsStamp = performance.now();
  }

  async init(canvas) {
    const BABYLON = B();
    let engine = null;

    try {
      if (BABYLON.WebGPUEngine) {
        let supported = false;
        const supportValue = BABYLON.WebGPUEngine.IsSupportedAsync;
        supported = typeof supportValue === 'function' ? await supportValue() : await supportValue;
        if (supported) {
          engine = new BABYLON.WebGPUEngine(canvas, { adaptToDeviceRatio: true, antialias: true });
          await engine.initAsync();
          this.backend = 'WebGPU';
        }
      }
    } catch (error) {
      console.warn('Babylon WebGPU unavailable, using WebGL.', error);
    }

    if (!engine) {
      engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true, adaptToDeviceRatio: true });
      this.backend = 'WebGL';
    }

    this.engine = engine;
    this.scene = this.createScene();
    this.engine.runRenderLoop(() => {}); // clock is driven by the shared visual lab RAF.
    return this;
  }

  createScene() {
    const BABYLON = B();
    const scene = new BABYLON.Scene(this.engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
    scene.skipPointerMovePicking = true;

    const camera = new BABYLON.FreeCamera('paintingCamera', new BABYLON.Vector3(0, 1.65, -12), scene);
    camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
    camera.setTarget(new BABYLON.Vector3(0, 0.1, 0));
    camera.minZ = 0.1;
    camera.maxZ = 80;
    this.camera = camera;
    scene.activeCamera = camera;

    const hemi = new BABYLON.HemisphericLight('skyLight', new BABYLON.Vector3(0, 1, -0.2), scene);
    hemi.intensity = 1.08;
    hemi.groundColor = new BABYLON.Color3(0.34, 0.22, 0.12);
    this.hemi = hemi;

    const sun = new BABYLON.DirectionalLight('sun', new BABYLON.Vector3(-0.7, -1.2, 0.35), scene);
    sun.position = new BABYLON.Vector3(7, 9, -7);
    sun.intensity = 2.35;
    sun.diffuse = new BABYLON.Color3(1, 0.73, 0.42);
    this.sun = sun;

    const shadow = new BABYLON.ShadowGenerator(1024, sun);
    shadow.useBlurExponentialShadowMap = true;
    shadow.blurKernel = 20;
    shadow.bias = 0.002;
    this.shadow = shadow;

    const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 24, height: 8, subdivisions: 2 }, scene);
    ground.position.y = -1.38;
    ground.position.z = 1.6;
    ground.material = pbr(scene, 'groundPaint', '#76522e', 1, 0.24);
    ground.receiveShadows = true;
    this.ground = ground;

    this.createWagon();
    this.createOxTeam();
    this.createGrass();
    this.createDust();
    this.createRain();

    const pipeline = new BABYLON.DefaultRenderingPipeline('paintingPipeline', true, scene, [camera]);
    pipeline.fxaaEnabled = true;
    pipeline.bloomEnabled = true;
    pipeline.bloomThreshold = 0.82;
    pipeline.bloomWeight = 0.18;
    pipeline.bloomKernel = 40;
    pipeline.imageProcessingEnabled = true;
    pipeline.imageProcessing.contrast = 1.08;
    pipeline.imageProcessing.exposure = 1.02;
    this.pipeline = pipeline;

    this.resize();
    return scene;
  }

  createWagon() {
    const BABYLON = B();
    const scene = this.scene;
    const root = new BABYLON.TransformNode('wagonRoot', scene);
    root.position = new BABYLON.Vector3(-1.15, -0.78, -0.05);
    root.scaling = new BABYLON.Vector3(1.04, 1.04, 1.04);
    this.wagon = root;

    const wood = pbr(scene, 'wagonWood', '#7d5032', 0.9);
    const woodDark = pbr(scene, 'wagonWoodDark', '#412719', 0.95);
    const canvas = pbr(scene, 'wagonCanvas', '#eadfc4', 1);
    const iron = pbr(scene, 'iron', '#2b211a', 0.72);

    const body = BABYLON.MeshBuilder.CreateBox('wagonBody', { width: 2.25, height: 0.58, depth: 1.1 }, scene);
    body.parent = root;
    body.position.y = 0.05;
    body.material = wood;
    enableSoftEdges(body, .46, 1.15);

    const bed = BABYLON.MeshBuilder.CreateBox('wagonBed', { width: 2.42, height: 0.09, depth: 1.22 }, scene);
    bed.parent = root;
    bed.position.y = -0.28;
    bed.material = woodDark;

    const canopy = BABYLON.MeshBuilder.CreateCapsule('wagonCanopy', { height: 2.15, radius: 0.64, tessellation: 22, subdivisions: 2 }, scene);
    canopy.parent = root;
    canopy.rotation.z = Math.PI / 2;
    canopy.scaling = new BABYLON.Vector3(0.78, 1, 0.82);
    canopy.position.y = 0.82;
    canopy.material = canvas;
    enableSoftEdges(canopy, .28, .9);

    const tongue = BABYLON.MeshBuilder.CreateBox('wagonTongue', { width: 2.8, height: 0.08, depth: 0.1 }, scene);
    tongue.parent = root;
    tongue.position = new BABYLON.Vector3(2.35, -0.04, 0);
    tongue.material = woodDark;

    const axle = BABYLON.MeshBuilder.CreateBox('wagonAxle', { width: 1.7, height: 0.08, depth: 1.36 }, scene);
    axle.parent = root;
    axle.position.y = -0.42;
    axle.material = iron;

    [-0.73, 0.78].forEach((x, index) => {
      const wheel = new BABYLON.TransformNode(`wheelRoot${index}`, scene);
      wheel.parent = root;
      wheel.position = new BABYLON.Vector3(x, -0.48, -0.63);

      const rim = BABYLON.MeshBuilder.CreateTorus(`wheelRim${index}`, { diameter: 0.72, thickness: 0.065, tessellation: 32 }, scene);
      rim.parent = wheel;
      rim.rotation.x = Math.PI / 2;
      rim.material = iron;
      enableSoftEdges(rim, .4, .75);
      this.shadow.addShadowCaster(rim);

      const hub = BABYLON.MeshBuilder.CreateCylinder(`wheelHub${index}`, { diameter: 0.13, height: 0.18, tessellation: 16 }, scene);
      hub.parent = wheel;
      hub.rotation.x = Math.PI / 2;
      hub.material = woodDark;

      for (let i = 0; i < 10; i += 1) {
        const angle = (Math.PI * 2 * i) / 10;
        const spoke = BABYLON.MeshBuilder.CreateBox(`spoke${index}_${i}`, { width: 0.31, height: 0.025, depth: 0.025 }, scene);
        spoke.parent = wheel;
        spoke.position.x = Math.cos(angle) * 0.155;
        spoke.position.y = Math.sin(angle) * 0.155;
        spoke.rotation.z = angle;
        spoke.material = woodDark;
      }
      this.wheels.push(wheel);
    });

    [body, bed, canopy, tongue, axle].forEach((mesh) => this.shadow.addShadowCaster(mesh));
  }

  createOxTeam() {
    const BABYLON = B();
    const scene = this.scene;
    const hide = pbr(scene, 'oxHide', '#74604a', 0.98);
    const dark = pbr(scene, 'oxDark', '#403326', 0.98);
    const horn = pbr(scene, 'horn', '#d8c9aa', 1);

    [0, 1].forEach((index) => {
      const root = new BABYLON.TransformNode(`ox${index}`, scene);
      root.position = new BABYLON.Vector3(2.75 + index * 0.32, -0.82, index ? 0.36 : -0.28);
      root.scaling = new BABYLON.Vector3(0.9, 0.9, 0.9);

      const body = BABYLON.MeshBuilder.CreateSphere(`oxBody${index}`, { diameter: 1, segments: 18 }, scene);
      body.parent = root;
      body.scaling = new BABYLON.Vector3(1.25, 0.64, 0.58);
      body.material = hide;
      enableSoftEdges(body, .28, .8);

      const shoulders = BABYLON.MeshBuilder.CreateSphere(`oxShoulders${index}`, { diameter: .76, segments: 14 }, scene);
      shoulders.parent = root;
      shoulders.position.x = 0.43;
      shoulders.scaling = new BABYLON.Vector3(.7, .8, .7);
      shoulders.material = hide;

      const head = BABYLON.MeshBuilder.CreateSphere(`oxHead${index}`, { diameter: .53, segments: 14 }, scene);
      head.parent = root;
      head.position = new BABYLON.Vector3(0.92, 0.14, 0);
      head.scaling = new BABYLON.Vector3(.78, .72, .66);
      head.material = dark;

      const muzzle = BABYLON.MeshBuilder.CreateSphere(`oxMuzzle${index}`, { diameter: .3, segments: 12 }, scene);
      muzzle.parent = root;
      muzzle.position = new BABYLON.Vector3(1.13, .08, 0);
      muzzle.scaling = new BABYLON.Vector3(.78, .55, .7);
      muzzle.material = pbr(scene, `muzzleMat${index}`, '#9a8064', 1);

      const legs = [];
      [[-.55,-.38],[.46,-.38],[-.48,.32],[.42,.32]].forEach(([x,z], legIndex) => {
        const leg = new BABYLON.TransformNode(`oxLegRoot${index}_${legIndex}`, scene);
        leg.parent = root;
        leg.position = new BABYLON.Vector3(x, -.27, z);
        const limb = BABYLON.MeshBuilder.CreateCylinder(`oxLeg${index}_${legIndex}`, { height: .7, diameter: .12, tessellation: 8 }, scene);
        limb.parent = leg;
        limb.position.y = -.33;
        limb.material = dark;
        legs.push(leg);
        this.shadow.addShadowCaster(limb);
      });

      [-1, 1].forEach((side) => {
        const points = [
          new BABYLON.Vector3(.88, .35, side * .12),
          new BABYLON.Vector3(1.02, .49, side * .23),
          new BABYLON.Vector3(1.18, .42, side * .31),
        ];
        const hornLine = BABYLON.MeshBuilder.CreateTube(`horn${index}_${side}`, { path: points, radius: .018, tessellation: 8 }, scene);
        hornLine.parent = root;
        hornLine.material = horn;
      });

      [body, shoulders, head, muzzle].forEach((mesh) => this.shadow.addShadowCaster(mesh));
      this.oxen.push({ root, body, head, legs });
    });
  }

  createGrass() {
    const BABYLON = B();
    const scene = this.scene;
    const grassMat = pbr(scene, 'grassPaint', '#7a7043', 1);
    grassMat.alpha = .72;
    grassMat.transparencyMode = BABYLON.Material.MATERIAL_ALPHABLEND;

    for (let i = 0; i < 76; i += 1) {
      const blade = BABYLON.MeshBuilder.CreateBox(`grass${i}`, { width: .035, height: .32 + (i % 5) * .055, depth: .025 }, scene);
      blade.position = new BABYLON.Vector3(-8 + ((i * 2.61) % 16), -1.18, -0.8 + ((i * 1.73) % 3.7));
      blade.rotation.z = (i % 7 - 3) * .05;
      blade.material = grassMat;
      blade.metadata = { baseX: blade.position.x, baseRot: blade.rotation.z, phase: i * .71 };
      this.grass.push(blade);
    }
  }

  createDust() {
    const BABYLON = B();
    const scene = this.scene;
    const dustMat = pbr(scene, 'dustPaint', '#d7b47c', 1, .12);
    dustMat.emissiveColor = new BABYLON.Color3(.42, .29, .15);
    dustMat.disableLighting = false;
    for (let i = 0; i < 18; i += 1) {
      const puff = BABYLON.MeshBuilder.CreateSphere(`dust${i}`, { diameter: .34 + (i % 4) * .12, segments: 8 }, scene);
      puff.material = dustMat;
      puff.metadata = { phase: i / 18, seed: i * 0.618 };
      this.dust.push(puff);
    }
  }

  createRain() {
    const BABYLON = B();
    const scene = this.scene;
    const rainMat = pbr(scene, 'rainPaint', '#dce9eb', 1, .35);
    rainMat.emissiveColor = new BABYLON.Color3(.35, .46, .5);
    for (let i = 0; i < 64; i += 1) {
      const drop = BABYLON.MeshBuilder.CreateBox(`rain${i}`, { width: .018, height: .38, depth: .012 }, scene);
      drop.rotation.z = -.22;
      drop.material = rainMat;
      drop.metadata = { x: -8 + ((i * 2.17) % 16), y: -1 + ((i * 1.13) % 6.5), phase: (i * .73) % 1 };
      drop.isVisible = false;
      this.rain.push(drop);
    }
  }

  resize() {
    if (!this.engine || !this.camera) return;
    this.engine.resize();
    const canvas = this.engine.getRenderingCanvas();
    const aspect = Math.max(.2, canvas.clientWidth / Math.max(1, canvas.clientHeight));
    const height = 5.9;
    this.camera.orthoTop = height / 2;
    this.camera.orthoBottom = -height / 2;
    this.camera.orthoLeft = -(height * aspect) / 2;
    this.camera.orthoRight = (height * aspect) / 2;
  }

  update(delta, state) {
    if (!this.scene) return;
    const start = performance.now();
    const t = state.elapsed;
    const travel = state.travelSpeed;
    const wind = state.wind;
    const moving = !state.paused && travel > .01;
    const gait = t * (4.6 + travel * 2.6);

    this.wagon.position.y = -0.78 + (moving ? Math.sin(gait * .86) * .025 : 0);
    this.wagon.rotation.z = moving ? Math.sin(gait * .41) * .006 : 0;
    this.wheels.forEach((wheel) => { wheel.rotation.z = moving ? -gait * .72 : wheel.rotation.z; });

    this.oxen.forEach((ox, index) => {
      ox.root.position.y = -0.82 + (moving ? Math.sin(gait + index * .7) * .035 : 0);
      ox.head.rotation.z = moving ? Math.sin(gait * .5 + index) * .04 : 0;
      ox.legs.forEach((leg, legIndex) => {
        const side = legIndex % 2 ? 1 : -1;
        leg.rotation.z = moving ? Math.sin(gait + legIndex * Math.PI / 2 + index * .4) * .34 * side : 0;
      });
    });

    this.grass.forEach((blade) => {
      const drift = moving ? ((t * travel * .7 + blade.metadata.phase) % 16) : 0;
      blade.position.x = moving ? -8 + ((blade.metadata.baseX + 8 - drift + 32) % 16) : blade.metadata.baseX;
      blade.rotation.z = blade.metadata.baseRot + Math.sin(t * 1.9 + blade.metadata.phase) * (.04 + wind * .19);
    });

    this.dust.forEach((puff, index) => {
      const p = (puff.metadata.phase + t * (.08 + travel * .055)) % 1;
      puff.isVisible = moving && state.weather !== 'rain' && state.weather !== 'storm';
      puff.position.x = -1.9 - p * (2.2 + travel * .6);
      puff.position.y = -1.15 + Math.sin(index * 1.77 + t) * .06 + p * .68;
      puff.position.z = -.45 + (puff.metadata.seed % 1) * 1.25;
      const s = .35 + p * 1.4;
      puff.scaling.setAll(s);
      puff.visibility = Math.max(0, .32 * (1 - p)) * (0.65 + state.atmosphere * .5);
    });

    const wet = state.weather === 'rain' || state.weather === 'storm';
    this.rain.forEach((drop, index) => {
      drop.isVisible = wet;
      if (!wet) return;
      const phase = (drop.metadata.phase + t * (1.2 + (state.weather === 'storm' ? .8 : .25))) % 1;
      drop.position.x = drop.metadata.x - phase * (1.4 + wind * 2.2);
      drop.position.y = 3.2 - phase * 6.2;
      drop.position.z = -.9 + ((index * .43) % 3.2);
    });

    const light = {
      dawn: { sun: 1.4, hemi: .82, exposure: .86, color: [1, .61, .4] },
      day: { sun: 1.8, hemi: 1.1, exposure: 1.08, color: [1, .91, .72] },
      golden: { sun: 2.35, hemi: 1.05, exposure: 1.02, color: [1, .7, .38] },
      dusk: { sun: .82, hemi: .58, exposure: .68, color: [.86, .48, .34] },
    }[state.timeOfDay];
    this.sun.intensity = light.sun * (state.weather === 'storm' ? .42 : state.weather === 'rain' ? .68 : 1);
    this.hemi.intensity = light.hemi * (state.weather === 'storm' ? .62 : 1);
    this.sun.diffuse.set(light.color[0], light.color[1], light.color[2]);
    this.pipeline.imageProcessing.exposure = light.exposure * (state.weather === 'storm' ? .7 : state.weather === 'rain' ? .84 : 1);
    this.scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    this.scene.fogDensity = .006 + state.atmosphere * .009 + (state.weather === 'storm' ? .009 : 0);
    this.scene.fogColor = state.weather === 'storm' ? new BABYLON.Color3(.28,.31,.31) : new BABYLON.Color3(.67,.55,.39);

    this.scene.render();
    this.lastCpuMs = performance.now() - start;
    this.frames += 1;
    const now = performance.now();
    if (now - this.lastFpsStamp >= 600) {
      this.fps = this.engine.getFps();
      this.frames = 0;
      this.lastFpsStamp = now;
    }
  }

  getMetrics() {
    return {
      backend: this.backend,
      fps: Number.isFinite(this.fps) ? this.fps : 0,
      cpuMs: this.lastCpuMs,
      meshes: this.scene?.meshes?.length || 0,
    };
  }

  destroy() {
    this.scene?.dispose();
    this.engine?.dispose();
  }
}
