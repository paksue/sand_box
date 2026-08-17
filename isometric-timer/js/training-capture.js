const LABELS = Object.freeze({
  start: {
    title: 'START',
    emoji: '👍',
    target: 200,
    instruction: 'Show your normal thumbs-up. Slowly vary distance, position, and wrist angle.'
  },
  pause: {
    title: 'PAUSE',
    emoji: '✋',
    target: 200,
    instruction: 'Show an open palm. Include straight-on and slightly rotated versions at exercise distance.'
  },
  none: {
    title: 'NONE',
    emoji: '✊',
    target: 300,
    instruction: 'Show non-command hand poses and realistic movement: relaxed hand, fist, partial hand, adjusting, scratching.'
  }
});

const CAPTURE_INTERVAL_MS = 250;
const OUTPUT_SIZE = 320;
const JPEG_QUALITY = 0.8;
const DUPLICATE_THRESHOLD = 4.2;

const state = {
  activeLabel: 'start',
  facingMode: 'user',
  stream: null,
  capturing: false,
  timer: null,
  captureBusy: false,
  saved: 0,
  skipped: 0,
  samples: { start: [], pause: [], none: [] },
  lastFingerprint: { start: null, pause: null, none: null }
};

const q = (id) => document.getElementById(id);
const els = {
  camera: q('camera'),
  cameraShell: q('cameraShell'),
  cameraMessage: q('cameraMessage'),
  cameraButton: q('cameraButton'),
  flipButton: q('flipButton'),
  captureFlash: q('captureFlash'),
  captureCanvas: q('captureCanvas'),
  fingerprintCanvas: q('fingerprintCanvas'),
  labelEmoji: q('labelEmoji'),
  labelTitle: q('labelTitle'),
  labelInstruction: q('labelInstruction'),
  currentCount: q('currentCount'),
  currentTarget: q('currentTarget'),
  progressFill: q('progressFill'),
  captureButton: q('captureButton'),
  captureIcon: q('captureIcon'),
  captureText: q('captureText'),
  singleButton: q('singleButton'),
  savedCount: q('savedCount'),
  skippedCount: q('skippedCount'),
  startCount: q('startCount'),
  pauseCount: q('pauseCount'),
  noneCount: q('noneCount'),
  summaryStart: q('summaryStart'),
  summaryPause: q('summaryPause'),
  summaryNone: q('summaryNone'),
  exportButton: q('exportButton'),
  clearButton: q('clearButton'),
  exportStatus: q('exportStatus'),
  tabs: [...document.querySelectorAll('[data-label]')]
};

function count(label) {
  return state.samples[label].length;
}

function totalSamples() {
  return count('start') + count('pause') + count('none');
}

function setStatus(message) {
  els.exportStatus.textContent = message || '';
}

function render() {
  const config = LABELS[state.activeLabel];
  const current = count(state.activeLabel);
  els.labelEmoji.textContent = config.emoji;
  els.labelTitle.textContent = config.title;
  els.labelInstruction.textContent = config.instruction;
  els.currentCount.textContent = current;
  els.currentTarget.textContent = config.target;
  els.progressFill.style.width = `${Math.min(100, current / config.target * 100)}%`;

  for (const label of Object.keys(LABELS)) {
    const element = els[`${label}Count`];
    element.textContent = `${count(label)} / ${LABELS[label].target}`;
  }
  els.summaryStart.textContent = count('start');
  els.summaryPause.textContent = count('pause');
  els.summaryNone.textContent = count('none');
  els.savedCount.textContent = state.saved;
  els.skippedCount.textContent = state.skipped;

  els.tabs.forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.label === state.activeLabel)));
  const cameraReady = Boolean(state.stream && els.camera.readyState >= 2);
  els.captureButton.disabled = !cameraReady;
  els.singleButton.disabled = !cameraReady || state.captureBusy;
  els.flipButton.disabled = !state.stream;
  els.exportButton.disabled = totalSamples() === 0 || state.capturing;
  els.clearButton.disabled = totalSamples() === 0 || state.capturing;
  els.captureButton.dataset.capturing = String(state.capturing);
  els.captureIcon.textContent = state.capturing ? '■' : '●';
  els.captureText.textContent = state.capturing ? 'Stop capture' : 'Start capture';
}

function stopTracks() {
  state.stream?.getTracks().forEach((track) => track.stop());
  state.stream = null;
  els.camera.srcObject = null;
  els.cameraShell.dataset.state = 'idle';
  els.cameraMessage.textContent = 'Camera is off';
}

async function startCamera() {
  stopCapture();
  stopTracks();
  if (!navigator.mediaDevices?.getUserMedia) {
    els.cameraMessage.textContent = 'Camera is unavailable in this browser';
    return;
  }
  els.cameraShell.dataset.state = 'loading';
  els.cameraMessage.textContent = 'Starting camera…';
  try {
    state.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: state.facingMode },
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30, max: 30 }
      },
      audio: false
    });
    els.camera.srcObject = state.stream;
    await els.camera.play();
    els.cameraShell.dataset.state = 'active';
    els.cameraShell.dataset.facing = state.facingMode;
    els.cameraButton.textContent = 'Stop camera';
    setStatus('Camera ready. Move naturally while capturing.');
  } catch (error) {
    stopTracks();
    els.cameraMessage.textContent = error?.name === 'NotAllowedError' ? 'Camera permission denied' : 'Could not start camera';
    els.cameraButton.textContent = 'Start camera';
    setStatus('Camera did not start. Check Safari camera permission and try again.');
  }
  render();
}

async function toggleCamera() {
  if (state.stream) {
    stopCapture();
    stopTracks();
    els.cameraButton.textContent = 'Start camera';
    setStatus('Camera stopped. Captured samples are still in memory.');
    render();
    return;
  }
  await startCamera();
}

async function flipCamera() {
  state.facingMode = state.facingMode === 'user' ? 'environment' : 'user';
  await startCamera();
}

function sourceSquare(video) {
  const width = video.videoWidth;
  const height = video.videoHeight;
  const size = Math.min(width, height);
  return {
    sx: Math.max(0, (width - size) / 2),
    sy: Math.max(0, (height - size) / 2),
    size
  };
}

function makeFingerprint(canvas) {
  const ctx = els.fingerprintCanvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(canvas, 0, 0, 8, 8);
  const data = ctx.getImageData(0, 0, 8, 8).data;
  const values = new Uint8Array(64);
  for (let i = 0; i < 64; i += 1) {
    const offset = i * 4;
    values[i] = Math.round(data[offset] * 0.299 + data[offset + 1] * 0.587 + data[offset + 2] * 0.114);
  }
  return values;
}

function fingerprintDistance(a, b) {
  if (!a || !b) return Infinity;
  let sum = 0;
  for (let i = 0; i < a.length; i += 1) sum += Math.abs(a[i] - b[i]);
  return sum / a.length;
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not encode training image.')), 'image/jpeg', JPEG_QUALITY);
  });
}

function flashCapture() {
  els.captureFlash.classList.add('on');
  setTimeout(() => els.captureFlash.classList.remove('on'), 70);
}

async function captureFrame({ force = false } = {}) {
  if (state.captureBusy || !state.stream || els.camera.readyState < 2) return false;
  state.captureBusy = true;
  try {
    const { sx, sy, size } = sourceSquare(els.camera);
    const ctx = els.captureCanvas.getContext('2d', { alpha: false });
    // Save the raw camera orientation used by MediaPipe inference. The preview is
    // mirrored for front-camera ergonomics in CSS, but the training pixels are not.
    ctx.drawImage(els.camera, sx, sy, size, size, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    const fingerprint = makeFingerprint(els.captureCanvas);
    const prior = state.lastFingerprint[state.activeLabel];
    if (!force && fingerprintDistance(fingerprint, prior) < DUPLICATE_THRESHOLD) {
      state.skipped += 1;
      render();
      return false;
    }

    const blob = await canvasToBlob(els.captureCanvas);
    const label = state.activeLabel;
    const index = count(label) + 1;
    state.samples[label].push({
      blob,
      filename: `${String(index).padStart(4, '0')}_${Date.now()}.jpg`,
      capturedAt: new Date().toISOString(),
      facingMode: state.facingMode
    });
    state.lastFingerprint[label] = fingerprint;
    state.saved += 1;
    flashCapture();
    render();
    return true;
  } finally {
    state.captureBusy = false;
  }
}

function captureTick() {
  if (!state.capturing) return;
  captureFrame().finally(() => {
    if (state.capturing) state.timer = setTimeout(captureTick, CAPTURE_INTERVAL_MS);
  });
}

function startCapture() {
  if (state.capturing || !state.stream) return;
  state.capturing = true;
  setStatus(`Capturing ${LABELS[state.activeLabel].title}. Move slowly; similar frames are skipped.`);
  render();
  captureTick();
}

function stopCapture() {
  state.capturing = false;
  if (state.timer) clearTimeout(state.timer);
  state.timer = null;
  render();
}

function toggleCapture() {
  if (state.capturing) {
    stopCapture();
    setStatus('Capture paused. Switch class or continue when ready.');
  } else {
    startCapture();
  }
}

function selectLabel(label) {
  if (!LABELS[label]) return;
  stopCapture();
  state.activeLabel = label;
  setStatus(`${LABELS[label].title} selected.`);
  render();
}

function clearSamples() {
  if (!totalSamples()) return;
  const confirmed = window.confirm('Clear all captured training images from this page? This cannot be undone.');
  if (!confirmed) return;
  stopCapture();
  state.samples = { start: [], pause: [], none: [] };
  state.lastFingerprint = { start: null, pause: null, none: null };
  state.saved = 0;
  state.skipped = 0;
  setStatus('Captured data cleared.');
  render();
}

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i += 1) crc = CRC_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function dosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { dosTime, dosDate };
}

function view(size) {
  const bytes = new Uint8Array(size);
  return { bytes, data: new DataView(bytes.buffer) };
}

function localHeader(nameBytes, size, crc, date) {
  const { bytes, data } = view(30 + nameBytes.length);
  data.setUint32(0, 0x04034b50, true);
  data.setUint16(4, 20, true);
  data.setUint16(6, 0x0800, true);
  data.setUint16(8, 0, true);
  data.setUint16(10, date.dosTime, true);
  data.setUint16(12, date.dosDate, true);
  data.setUint32(14, crc, true);
  data.setUint32(18, size, true);
  data.setUint32(22, size, true);
  data.setUint16(26, nameBytes.length, true);
  data.setUint16(28, 0, true);
  bytes.set(nameBytes, 30);
  return bytes;
}

function centralHeader(nameBytes, size, crc, date, offset) {
  const { bytes, data } = view(46 + nameBytes.length);
  data.setUint32(0, 0x02014b50, true);
  data.setUint16(4, 20, true);
  data.setUint16(6, 20, true);
  data.setUint16(8, 0x0800, true);
  data.setUint16(10, 0, true);
  data.setUint16(12, date.dosTime, true);
  data.setUint16(14, date.dosDate, true);
  data.setUint32(16, crc, true);
  data.setUint32(20, size, true);
  data.setUint32(24, size, true);
  data.setUint16(28, nameBytes.length, true);
  data.setUint16(30, 0, true);
  data.setUint16(32, 0, true);
  data.setUint16(34, 0, true);
  data.setUint16(36, 0, true);
  data.setUint32(38, 0, true);
  data.setUint32(42, offset, true);
  bytes.set(nameBytes, 46);
  return bytes;
}

async function zipBlob(files) {
  const encoder = new TextEncoder();
  const parts = [];
  const central = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const content = file.bytes instanceof Uint8Array ? file.bytes : new Uint8Array(await file.blob.arrayBuffer());
    const crc = crc32(content);
    const date = dosDateTime(file.date || new Date());
    const local = localHeader(nameBytes, content.length, crc, date);
    parts.push(local, content);
    central.push(centralHeader(nameBytes, content.length, crc, date, offset));
    offset += local.length + content.length;
  }

  const centralOffset = offset;
  const centralSize = central.reduce((sum, part) => sum + part.length, 0);
  parts.push(...central);
  const { bytes: end, data } = view(22);
  data.setUint32(0, 0x06054b50, true);
  data.setUint16(4, 0, true);
  data.setUint16(6, 0, true);
  data.setUint16(8, files.length, true);
  data.setUint16(10, files.length, true);
  data.setUint32(12, centralSize, true);
  data.setUint32(16, centralOffset, true);
  data.setUint16(20, 0, true);
  parts.push(end);
  return new Blob(parts, { type: 'application/zip' });
}

function manifest() {
  return {
    formatVersion: 1,
    createdAt: new Date().toISOString(),
    source: 'Hold Gesture Lab',
    labels: {
      start: { meaning: 'Thumbs-up command for START / RESUME', count: count('start') },
      pause: { meaning: 'Open-palm command for PAUSE', count: count('pause') },
      none: { meaning: 'Required negative class for all non-command gestures', count: count('none') }
    },
    capture: {
      imageSize: `${OUTPUT_SIZE}x${OUTPUT_SIZE}`,
      imageFormat: 'image/jpeg',
      jpegQuality: JPEG_QUALITY,
      captureIntervalMs: CAPTURE_INTERVAL_MS,
      duplicateThreshold: DUPLICATE_THRESHOLD,
      mirroredFrontCameraBeforeSave: false
    },
    privacy: 'Images were captured and exported locally in the browser. Hold does not upload this dataset.'
  };
}

async function exportDataset() {
  if (!totalSamples() || state.capturing) return;
  els.exportButton.disabled = true;
  setStatus('Building ZIP locally…');
  try {
    const root = 'hold-gesture-dataset';
    const files = [];
    for (const label of Object.keys(LABELS)) {
      for (const sample of state.samples[label]) {
        files.push({ name: `${root}/${label}/${sample.filename}`, blob: sample.blob, date: new Date(sample.capturedAt) });
      }
    }
    const encoder = new TextEncoder();
    files.push({ name: `${root}/manifest.json`, bytes: encoder.encode(JSON.stringify(manifest(), null, 2)) });
    files.push({
      name: `${root}/README.txt`,
      bytes: encoder.encode(
`Hold custom gesture training dataset

Folders:
  start/  thumbs-up command
  pause/  open-palm command
  none/   required negative/non-command class

Google MediaPipe Model Maker expects <dataset_path>/<label>/<image> and requires a label named none.
Unzip this archive, set dataset_path to the hold-gesture-dataset directory, then run the repository Colab notebook.
`
      )
    });

    const zip = await zipBlob(files);
    const link = document.createElement('a');
    const url = URL.createObjectURL(zip);
    link.href = url;
    link.download = `hold-gesture-dataset-${new Date().toISOString().slice(0, 10)}.zip`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    const mb = (zip.size / (1024 * 1024)).toFixed(1);
    setStatus(`Exported ${totalSamples()} images (${mb} MB). Keep the ZIP private until you intentionally upload it to Colab.`);
  } catch (error) {
    console.error(error);
    setStatus(`Export failed: ${error?.message || 'unknown error'}`);
  } finally {
    render();
  }
}

els.cameraButton.addEventListener('click', toggleCamera);
els.flipButton.addEventListener('click', flipCamera);
els.captureButton.addEventListener('click', toggleCapture);
els.singleButton.addEventListener('click', () => captureFrame({ force: true }));
els.exportButton.addEventListener('click', exportDataset);
els.clearButton.addEventListener('click', clearSamples);
els.tabs.forEach((tab) => tab.addEventListener('click', () => selectLabel(tab.dataset.label)));

window.addEventListener('pagehide', () => {
  stopCapture();
  stopTracks();
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') stopCapture();
});

render();
