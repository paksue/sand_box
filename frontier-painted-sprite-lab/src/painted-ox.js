const PIXI = window.PIXI;

export const OX_SOURCE_URL = 'https://upload.wikimedia.org/wikipedia/commons/a/a1/George_Stubbs_-_The_Lincolnshire_Ox_-_Google_Art_Project.jpg';

// The source is a public-domain oil painting. We intentionally preserve raster
// paint pixels and produce a soft alpha matte client-side rather than redrawing
// the ox with geometric primitives.
const SOURCE_CROP = { x: 300, y: 990, w: 1710, h: 1060 };
const ART_W = 1100;
const ART_H = 682;
const GRID_COLS = 9;
const GRID_ROWS = 6;

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

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

function loadCrossOriginImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.decoding = 'async';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Unable to load painterly source: ${url}`));
    image.src = url;
  });
}

function drawSureForeground(mask, cv) {
  // GrabCut is initialized from a rectangle, then given a few conservative
  // "definitely foreground" regions that sit well inside the animal. These
  // strokes deliberately avoid silhouette edges so the algorithm decides the
  // soft painted boundary from image evidence rather than a hard polygon.
  const fg = new cv.Scalar(cv.GC_FGD);
  cv.rectangle(mask, new cv.Point(235, 145), new cv.Point(785, 390), fg, -1);
  cv.rectangle(mask, new cv.Point(120, 280), new cv.Point(360, 430), fg, -1);
  cv.rectangle(mask, new cv.Point(690, 250), new cv.Point(870, 420), fg, -1);
}

async function buildPainterlyMatte() {
  const cv = await window.cvReady;
  if (!cv?.grabCut) throw new Error('OpenCV GrabCut did not initialize.');

  const image = await loadCrossOriginImage(OX_SOURCE_URL);
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = ART_W;
  cropCanvas.height = ART_H;
  const cropCtx = cropCanvas.getContext('2d', { willReadFrequently: true });
  cropCtx.imageSmoothingEnabled = true;
  cropCtx.imageSmoothingQuality = 'high';
  cropCtx.drawImage(
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

    const rect = new cv.Rect(12, 12, ART_W - 24, ART_H - 24);
    cv.grabCut(rgb, mask, rect, bgdModel, fgdModel, 5, cv.GC_INIT_WITH_RECT);

    drawSureForeground(mask, cv);
    cv.grabCut(rgb, mask, new cv.Rect(), bgdModel, fgdModel, 3, cv.GC_INIT_WITH_MASK);

    alpha = cv.Mat.zeros(ART_H, ART_W, cv.CV_8UC1);
    const maskData = mask.data;
    const alphaData = alpha.data;
    for (let i = 0; i < maskData.length; i += 1) {
      const cls = maskData[i];
      alphaData[i] = cls === cv.GC_FGD || cls === cv.GC_PR_FGD ? 255 : 0;
    }

    // Close tiny holes and feather only a few pixels so the brushy silhouette
    // survives without the cut-paper look of the old polygon mask.
    const kernel = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(5, 5));
    cv.morphologyEx(alpha, alpha, cv.MORPH_CLOSE, kernel);
    kernel.delete();
    alphaSoft = new cv.Mat();
    cv.GaussianBlur(alpha, alphaSoft, new cv.Size(7, 7), 0, 0, cv.BORDER_DEFAULT);

    const original = cropCtx.getImageData(0, 0, ART_W, ART_H);
    const pixels = original.data;
    const soft = alphaSoft.data;
    for (let i = 0, p = 0; i < soft.length; i += 1, p += 4) {
      pixels[p + 3] = soft[i];
    }

    const result = document.createElement('canvas');
    result.width = ART_W;
    result.height = ART_H;
    result.getContext('2d').putImageData(original, 0, 0);
    return result;
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
    this.grid = null;
    this.motionStrength = 0.48;
    this.depth = 0.46;
    this.colorMatch = true;
    this.atmosphere = true;
    this.shadowEnabled = true;
    this.dustEnabled = true;
    this.meshDebug = false;
    this.posePhase = 0;
    this.poseVersion = 0;
    this.dust = [];
    this.noiseFilter = new PIXI.NoiseFilter({ noise: 0.024, seed: 0.63 });
    this.dustBlur = new PIXI.BlurFilter({ strength: 3.2, quality: 2 });
    this.shadowBlur = new PIXI.BlurFilter({ strength: 5.5, quality: 2 });
  }

  async init() {
    const segmentedCanvas = await buildPainterlyMatte();
    const texture = PIXI.Texture.from(segmentedCanvas);

    this.grid = buildGrid(GRID_COLS, GRID_ROWS, ART_W, ART_H);
    this.baseVertices = new Float32Array(this.grid.vertices);

    this.mesh = new PIXI.MeshSimple({
      texture,
      vertices: new Float32Array(this.grid.vertices),
      uvs: this.grid.uvs,
      indices: this.grid.indices,
    });
    this.mesh.autoUpdate = true;
    this.mesh.filters = [this.noiseFilter];

    this.shadow = new PIXI.Graphics()
      .ellipse(ART_W * 0.49, ART_H * 0.87, ART_W * 0.29, ART_H * 0.045)
      .fill({ color: 0x352116, alpha: 0.27 });
    this.shadow.filters = [this.shadowBlur];

    this.root.addChild(this.shadow, this.mesh, this.dustLayer, this.debugLayer);
    this.root.pivot.set(ART_W * 0.50, ART_H * 0.79);

    this.createDust();
    this.setIntegration({});
    this.setDepth(this.depth);
    return this;
  }

  createDust() {
    this.dustLayer.filters = [this.dustBlur];
    for (let i = 0; i < 13; i += 1) {
      const radius = 12 + (i % 5) * 5;
      const puff = new PIXI.Graphics()
        .circle(0, 0, radius)
        .fill({ color: 0xb47d45, alpha: 0.08 + (i % 3) * 0.018 });
      puff.x = ART_W * (0.25 + (i % 7) * 0.072);
      puff.y = ART_H * (0.84 + (i % 3) * 0.018);
      puff.scale.set(0.48 + (i % 4) * 0.07);
      this.dustLayer.addChild(puff);
      this.dust.push({ node: puff, seed: i * 0.83, age: (i % 6) / 6 });
    }
  }

  setMotionStrength(value) {
    this.motionStrength = clamp01(value);
  }

  setDepth(value) {
    this.depth = clamp01(value);
    this.applyIntegration();
  }

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
    this.mesh.alpha = 1 - haze * 0.20;
    this.mesh.tint = this.colorMatch ? 0xffd8ad : 0xffffff;
    this.noiseFilter.noise = this.colorMatch ? 0.024 : 0.008;
    this.shadow.visible = this.shadowEnabled;
    this.shadow.alpha = 1 - haze * 0.40;
    this.dustLayer.visible = this.dustEnabled;
    this.dustLayer.alpha = 1 - haze * 0.28;
  }

  layout(screenWidth, screenHeight) {
    // The previous proof made the ox dominate the Bierstadt landscape. Here it
    // remains a readable hero object but respects the painting's scale.
    const targetWidth = screenWidth * (0.31 - this.depth * 0.09);
    const scale = targetWidth / ART_W;
    this.root.scale.set(scale);
    this.root.x = screenWidth * (0.57 - this.depth * 0.02);
    this.root.y = screenHeight * (0.78 - this.depth * 0.09);
  }

  resetPose() {
    this.posePhase = 0;
    this.updatePose(0);
  }

  updatePose(phase) {
    if (!this.mesh) return;
    this.posePhase = phase;
    this.poseVersion += 1;
    const vertices = this.mesh.vertices;
    const strength = this.motionStrength;
    const frontStep = Math.sin(phase);
    const rearStep = Math.sin(phase + Math.PI);
    const bodyLift = Math.sin(phase * 2) * 2.8 * strength;

    for (let i = 0; i < vertices.length; i += 2) {
      const baseX = this.baseVertices[i];
      const baseY = this.baseVertices[i + 1];
      const u = baseX / ART_W;
      const v = baseY / ART_H;
      let dx = 0;
      let dy = bodyLift * smoothstep(0.12, 0.60, u) * (1 - smoothstep(0.70, 1, v));

      // Broad, restrained deformations preserve the original oil-painted
      // surface. This milestone is intentionally closer to "living painting"
      // than rubber-limbed procedural locomotion.
      const headWeight = (1 - smoothstep(0.28, 0.44, u)) * smoothstep(0.24, 0.80, v);
      dx += Math.cos(phase + 0.35) * 3.2 * strength * headWeight;
      dy += Math.sin(phase + 0.45) * 5.6 * strength * headWeight;

      const shoulderWeight = smoothstep(0.20, 0.34, u) * (1 - smoothstep(0.45, 0.55, u)) * smoothstep(0.35, 0.82, v);
      dy += Math.max(0, frontStep) * 4.0 * strength * shoulderWeight;
      dx -= frontStep * 2.4 * strength * shoulderWeight;

      const lower = smoothstep(0.58, 0.98, v);
      const frontLegU = smoothstep(0.19, 0.29, u) * (1 - smoothstep(0.44, 0.51, u));
      dx += frontStep * 9.5 * strength * frontLegU * lower;
      dy += Math.max(0, -frontStep) * 4.2 * strength * frontLegU * lower;

      const rearLegU = smoothstep(0.55, 0.65, u) * (1 - smoothstep(0.82, 0.90, u));
      dx += rearStep * 8.8 * strength * rearLegU * lower;
      dy += Math.max(0, -rearStep) * 3.8 * strength * rearLegU * lower;

      const hipWeight = smoothstep(0.66, 0.80, u) * (1 - smoothstep(0.92, 0.99, u)) * smoothstep(0.28, 0.74, v);
      dy += Math.sin(phase * 2 + 0.55) * 2.4 * strength * hipWeight;

      const tailWeight = smoothstep(0.82, 0.94, u) * smoothstep(0.28, 0.75, v);
      dx += Math.sin(phase * 0.5 + 1.4) * 3.8 * strength * tailWeight;

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
    g.stroke({ width: 2.8, color: 0xffc55c, alpha: 0.84 });

    for (let i = 0; i < vertices.length; i += 2) {
      g.circle(vertices[i], vertices[i + 1], 4.4).fill({ color: 0xffe2a0, alpha: 0.88 });
    }
  }

  updateContinuous(deltaSeconds, phase) {
    if (this.shadow) {
      this.shadow.scale.x = 1 + Math.sin(phase * 2) * 0.018 * this.motionStrength;
      this.shadow.alpha = (this.shadowEnabled ? 0.82 : 0) * (1 - this.depth * 0.32);
    }

    for (const puff of this.dust) {
      puff.age += deltaSeconds * (0.20 + this.motionStrength * 0.14);
      if (puff.age > 1) puff.age -= 1;
      const t = puff.age;
      puff.node.x += deltaSeconds * (10 + puff.seed * 0.6);
      if (puff.node.x > ART_W * 0.82) puff.node.x = ART_W * 0.24;
      puff.node.y = ART_H * (0.86 - t * 0.038) + Math.sin(puff.seed + phase) * 3;
      const scale = 0.42 + t * 0.58;
      puff.node.scale.set(scale);
      puff.node.alpha = this.dustEnabled ? Math.sin(Math.PI * t) * 0.12 : 0;
    }
  }
}
