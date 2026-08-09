const PIXI = window.PIXI;

export const OX_SOURCE_URL = 'https://upload.wikimedia.org/wikipedia/commons/a/a1/George_Stubbs_-_The_Lincolnshire_Ox_-_Google_Art_Project.jpg';

const SOURCE_CROP = { x: 300, y: 990, w: 1710, h: 1060 };
const ART_W = 760;
const ART_H = 471;
const GRID_COLS = 9;
const GRID_ROWS = 6;

const clamp01 = (value) => Math.max(0, Math.min(1, value));

function smoothstep(edge0, edge1, value) {
  const x = clamp01((value - edge0) / (edge1 - edge0));
  return x * x * (3 - 2 * x);
}

function buildGrid(cols, rows, width, height) {
  const vertices = new Float32Array(cols * rows * 2);
  const uvs = new Float32Array(cols * rows * 2);
  const indices = [];
  let cursor = 0;
  for (let row = 0; row < rows; row += 1) {
    const v = row / (rows - 1);
    for (let col = 0; col < cols; col += 1) {
      const u = col / (cols - 1);
      vertices[cursor] = u * width;
      vertices[cursor + 1] = v * height;
      uvs[cursor] = u;
      uvs[cursor + 1] = v;
      cursor += 2;
    }
  }
  for (let row = 0; row < rows - 1; row += 1) {
    for (let col = 0; col < cols - 1; col += 1) {
      const a = row * cols + col;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      indices.push(a, b, d, a, d, c);
    }
  }
  return { vertices, uvs, indices: new Uint32Array(indices) };
}

async function getOpenCV(timeoutMs = 20_000) {
  const started = performance.now();
  while (performance.now() - started < timeoutMs) {
    if (window.cv) {
      try {
        const candidate = typeof window.cv.then === 'function' ? await window.cv : window.cv;
        if (candidate?.Mat && candidate?.grabCut) return candidate;
      } catch (error) {
        console.warn('OpenCV module not ready yet.', error);
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error('OpenCV.js did not become ready in time.');
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load painterly source: ${url}`));
    image.src = url;
  });
}

function rectangleNorm(cv, mask, x1, y1, x2, y2, value) {
  cv.rectangle(
    mask,
    new cv.Point(Math.round(ART_W * x1), Math.round(ART_H * y1)),
    new cv.Point(Math.round(ART_W * x2), Math.round(ART_H * y2)),
    new cv.Scalar(value),
    -1,
  );
}

function addForegroundHints(cv, mask) {
  // Conservative sure-foreground strokes well inside the painted animal.
  rectangleNorm(cv, mask, 0.22, 0.21, 0.71, 0.57, cv.GC_FGD); // torso
  rectangleNorm(cv, mask, 0.12, 0.42, 0.32, 0.62, cv.GC_FGD); // head/neck mass
  rectangleNorm(cv, mask, 0.64, 0.38, 0.79, 0.61, cv.GC_FGD); // rear torso
}

async function buildPainterlyMatte() {
  const cv = await getOpenCV();
  const image = await loadImage(OX_SOURCE_URL);
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = ART_W;
  cropCanvas.height = ART_H;
  const ctx = cropCanvas.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    image,
    SOURCE_CROP.x, SOURCE_CROP.y, SOURCE_CROP.w, SOURCE_CROP.h,
    0, 0, ART_W, ART_H,
  );

  let rgba;
  let rgb;
  let mask;
  let bgdModel;
  let fgdModel;
  let alpha;
  let alphaSoft;
  try {
    rgba = cv.imread(cropCanvas);
    rgb = new cv.Mat();
    cv.cvtColor(rgba, rgb, cv.COLOR_RGBA2RGB);
    mask = cv.Mat.zeros(ART_H, ART_W, cv.CV_8UC1);
    bgdModel = new cv.Mat();
    fgdModel = new cv.Mat();

    const margin = 7;
    cv.grabCut(
      rgb,
      mask,
      new cv.Rect(margin, margin, ART_W - margin * 2, ART_H - margin * 2),
      bgdModel,
      fgdModel,
      3,
      cv.GC_INIT_WITH_RECT,
    );
    addForegroundHints(cv, mask);
    cv.grabCut(rgb, mask, new cv.Rect(), bgdModel, fgdModel, 2, cv.GC_INIT_WITH_MASK);

    alpha = cv.Mat.zeros(ART_H, ART_W, cv.CV_8UC1);
    for (let i = 0; i < mask.data.length; i += 1) {
      const cls = mask.data[i];
      alpha.data[i] = cls === cv.GC_FGD || cls === cv.GC_PR_FGD ? 255 : 0;
    }

    const kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(3, 3));
    cv.morphologyEx(alpha, alpha, cv.MORPH_CLOSE, kernel);
    kernel.delete();
    alphaSoft = new cv.Mat();
    cv.GaussianBlur(alpha, alphaSoft, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);

    const imageData = ctx.getImageData(0, 0, ART_W, ART_H);
    for (let i = 0, p = 0; i < alphaSoft.data.length; i += 1, p += 4) {
      imageData.data[p + 3] = alphaSoft.data[i];
    }
    const output = document.createElement('canvas');
    output.width = ART_W;
    output.height = ART_H;
    output.getContext('2d').putImageData(imageData, 0, 0);
    return output;
  } finally {
    rgba?.delete();
    rgb?.delete();
    mask?.delete();
    bgdModel?.delete();
    fgdModel?.delete();
    alpha?.delete();
    alphaSoft?.delete();
  }
}

export class PaintedOx {
  constructor() {
    this.root = new PIXI.Container();
    this.mesh = null;
    this.shadow = null;
    this.dustLayer = new PIXI.Container();
    this.debugLayer = new PIXI.Graphics();
    this.baseVertices = null;
    this.motionStrength = 0.48;
    this.depth = 0.46;
    this.colorMatch = true;
    this.atmosphere = true;
    this.shadowEnabled = true;
    this.dustEnabled = true;
    this.meshDebug = false;
    this.poseVersion = 0;
    this.dust = [];
    this.noiseFilter = new PIXI.NoiseFilter({ noise: 0.022, seed: 0.63 });
    this.dustBlur = new PIXI.BlurFilter({ strength: 2.6, quality: 2 });
    this.shadowBlur = new PIXI.BlurFilter({ strength: 4.2, quality: 2 });
  }

  async init() {
    const matteCanvas = await buildPainterlyMatte();
    const texture = PIXI.Texture.from(matteCanvas);
    const grid = buildGrid(GRID_COLS, GRID_ROWS, ART_W, ART_H);
    this.baseVertices = new Float32Array(grid.vertices);
    this.mesh = new PIXI.MeshSimple({
      texture,
      vertices: new Float32Array(grid.vertices),
      uvs: grid.uvs,
      indices: grid.indices,
    });
    this.mesh.autoUpdate = true;
    this.mesh.filters = [this.noiseFilter];

    this.shadow = new PIXI.Graphics()
      .ellipse(ART_W * 0.49, ART_H * 0.87, ART_W * 0.28, ART_H * 0.042)
      .fill({ color: 0x352116, alpha: 0.24 });
    this.shadow.filters = [this.shadowBlur];

    this.root.addChild(this.shadow, this.mesh, this.dustLayer, this.debugLayer);
    this.root.pivot.set(ART_W * 0.50, ART_H * 0.79);
    this.createDust();
    this.applyIntegration();
    return this;
  }

  createDust() {
    this.dustLayer.filters = [this.dustBlur];
    for (let i = 0; i < 11; i += 1) {
      const puff = new PIXI.Graphics()
        .circle(0, 0, 8 + (i % 4) * 4)
        .fill({ color: 0xb47d45, alpha: 0.07 + (i % 3) * 0.015 });
      puff.x = ART_W * (0.25 + (i % 6) * 0.082);
      puff.y = ART_H * (0.84 + (i % 3) * 0.018);
      this.dustLayer.addChild(puff);
      this.dust.push({ node: puff, seed: i * 0.83, age: (i % 6) / 6 });
    }
  }

  setMotionStrength(value) { this.motionStrength = clamp01(value); }
  setDepth(value) { this.depth = clamp01(value); this.applyIntegration(); }

  setDebugMesh(enabled) {
    this.meshDebug = enabled;
    this.debugLayer.visible = enabled;
    if (enabled) this.drawDebugMesh();
  }

  setIntegration({ colorMatch, atmosphere, shadow, dust } = {}) {
    if (typeof colorMatch === 'boolean') this.colorMatch = colorMatch;
    if (typeof atmosphere === 'boolean') this.atmosphere = atmosphere;
    if (typeof shadow === 'boolean') this.shadowEnabled = shadow;
    if (typeof dust === 'boolean') this.dustEnabled = dust;
    this.applyIntegration();
  }

  applyIntegration() {
    if (!this.mesh) return;
    const haze = this.atmosphere ? this.depth : 0;
    this.mesh.alpha = 1 - haze * 0.18;
    this.mesh.tint = this.colorMatch ? 0xffd8ad : 0xffffff;
    this.noiseFilter.noise = this.colorMatch ? 0.022 : 0.006;
    this.shadow.visible = this.shadowEnabled;
    this.shadow.alpha = 1 - haze * 0.38;
    this.dustLayer.visible = this.dustEnabled;
    this.dustLayer.alpha = 1 - haze * 0.26;
  }

  layout(screenWidth, screenHeight) {
    const targetWidth = screenWidth * (0.30 - this.depth * 0.085);
    const scale = targetWidth / ART_W;
    this.root.scale.set(scale);
    this.root.x = screenWidth * (0.57 - this.depth * 0.018);
    this.root.y = screenHeight * (0.79 - this.depth * 0.085);
  }

  resetPose() { this.updatePose(0); }

  updatePose(phase) {
    if (!this.mesh) return;
    this.poseVersion += 1;
    const vertices = this.mesh.vertices;
    const strength = this.motionStrength;
    const frontStep = Math.sin(phase);
    const rearStep = -frontStep;
    const bodyLift = Math.sin(phase * 2) * 1.9 * strength;

    for (let i = 0; i < vertices.length; i += 2) {
      const baseX = this.baseVertices[i];
      const baseY = this.baseVertices[i + 1];
      const u = baseX / ART_W;
      const v = baseY / ART_H;
      let dx = 0;
      let dy = bodyLift * smoothstep(0.12, 0.60, u) * (1 - smoothstep(0.70, 1, v));

      const head = (1 - smoothstep(0.28, 0.44, u)) * smoothstep(0.24, 0.80, v);
      dx += Math.cos(phase + 0.35) * 2.2 * strength * head;
      dy += Math.sin(phase + 0.45) * 3.7 * strength * head;

      const shoulder = smoothstep(0.20, 0.34, u) * (1 - smoothstep(0.45, 0.55, u)) * smoothstep(0.35, 0.82, v);
      dy += Math.max(0, frontStep) * 2.7 * strength * shoulder;

      const lower = smoothstep(0.60, 0.98, v);
      const frontLeg = smoothstep(0.19, 0.29, u) * (1 - smoothstep(0.44, 0.51, u));
      dx += frontStep * 5.8 * strength * frontLeg * lower;
      dy += Math.max(0, -frontStep) * 2.5 * strength * frontLeg * lower;

      const rearLeg = smoothstep(0.55, 0.65, u) * (1 - smoothstep(0.82, 0.90, u));
      dx += rearStep * 5.2 * strength * rearLeg * lower;
      dy += Math.max(0, -rearStep) * 2.3 * strength * rearLeg * lower;

      const hip = smoothstep(0.66, 0.80, u) * (1 - smoothstep(0.92, 0.99, u)) * smoothstep(0.28, 0.74, v);
      dy += Math.sin(phase * 2 + 0.55) * 1.5 * strength * hip;

      vertices[i] = baseX + dx;
      vertices[i + 1] = baseY + dy;
    }
    if (this.meshDebug) this.drawDebugMesh();
  }

  drawDebugMesh() {
    if (!this.mesh) return;
    const vertices = this.mesh.vertices;
    const g = this.debugLayer;
    g.clear();
    for (let row = 0; row < GRID_ROWS; row += 1) {
      for (let col = 0; col < GRID_COLS - 1; col += 1) {
        const a = (row * GRID_COLS + col) * 2;
        const b = a + 2;
        g.moveTo(vertices[a], vertices[a + 1]).lineTo(vertices[b], vertices[b + 1]);
      }
    }
    for (let col = 0; col < GRID_COLS; col += 1) {
      for (let row = 0; row < GRID_ROWS - 1; row += 1) {
        const a = (row * GRID_COLS + col) * 2;
        const b = ((row + 1) * GRID_COLS + col) * 2;
        g.moveTo(vertices[a], vertices[a + 1]).lineTo(vertices[b], vertices[b + 1]);
      }
    }
    g.stroke({ width: 2.2, color: 0xffc55c, alpha: 0.84 });
    for (let i = 0; i < vertices.length; i += 2) {
      g.circle(vertices[i], vertices[i + 1], 3.3).fill({ color: 0xffe2a0, alpha: 0.88 });
    }
  }

  updateContinuous(deltaSeconds, phase) {
    if (this.shadow) {
      this.shadow.scale.x = 1 + Math.sin(phase * 2) * 0.014 * this.motionStrength;
      this.shadow.alpha = (this.shadowEnabled ? 0.80 : 0) * (1 - this.depth * 0.32);
    }
    for (const puff of this.dust) {
      puff.age += deltaSeconds * (0.18 + this.motionStrength * 0.12);
      if (puff.age > 1) puff.age -= 1;
      const t = puff.age;
      puff.node.x += deltaSeconds * (7 + puff.seed * 0.45);
      if (puff.node.x > ART_W * 0.82) puff.node.x = ART_W * 0.24;
      puff.node.y = ART_H * (0.86 - t * 0.032) + Math.sin(puff.seed + phase) * 2;
      const scale = 0.42 + t * 0.54;
      puff.node.scale.set(scale);
      puff.node.alpha = this.dustEnabled ? Math.sin(Math.PI * t) * 0.10 : 0;
    }
  }
}
