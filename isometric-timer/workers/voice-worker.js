const TRANSFORMERS_URL = 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0';
const MODEL_ID = 'onnx-community/whisper-tiny.en';
let transcriberPromise = null;

async function createTranscriber() {
  const { pipeline } = await import(TRANSFORMERS_URL);
  const preferred = self.navigator?.gpu ? 'webgpu' : 'wasm';
  try {
    return await pipeline('automatic-speech-recognition', MODEL_ID, { device: preferred });
  } catch (error) {
    if (preferred === 'wasm') throw error;
    return pipeline('automatic-speech-recognition', MODEL_ID, { device: 'wasm' });
  }
}

async function getTranscriber() {
  if (!transcriberPromise) transcriberPromise = createTranscriber();
  return transcriberPromise;
}

self.onmessage = async (event) => {
  const message = event.data;
  if (!message || typeof message !== 'object') return;
  if (message.type === 'init') {
    try {
      await getTranscriber();
      self.postMessage({ type: 'ready' });
    } catch (error) {
      self.postMessage({ type: 'error', message: error?.message || 'Voice model failed to load.' });
    }
    return;
  }

  if (message.type === 'transcribe' && message.samples instanceof Float32Array) {
    try {
      const transcriber = await getTranscriber();
      const output = await transcriber(message.samples, { language: 'en', task: 'transcribe' });
      self.postMessage({ type: 'transcript', text: output?.text || '' });
    } catch (error) {
      self.postMessage({ type: 'error', message: error?.message || 'Voice recognition failed.' });
    }
  }
};
