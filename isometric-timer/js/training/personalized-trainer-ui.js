import { installPersonalizedGestureProfile } from './personalized-trainer.js';
import {
  getGestureModelPreference,
  loadPersonalizedProfile,
  setGestureModelPreference
} from '../hands-free/personalized-profile.js';

const fileInput = document.getElementById('personalizedZipInput');
const installButton = document.getElementById('installPersonalizedButton');
const googleButton = document.getElementById('useGoogleGestureButton');
const status = document.getElementById('personalizedStatus');

function setBusy(busy) {
  if (installButton) installButton.disabled = busy;
  if (googleButton) googleButton.disabled = busy;
}

function renderCurrent() {
  if (!status) return;
  const profile = loadPersonalizedProfile();
  const preference = getGestureModelPreference();
  if (profile && preference === 'personalized') {
    const counts = profile.counts?.detected || {};
    const publicNone = Number(profile.counts?.publicNone) || 0;
    status.textContent = `Personalized v1 active · ${counts.start || profile.start.length} START · ${counts.pause || profile.pause.length} PAUSE · ${publicNone} public NONE.`;
  } else if (profile) {
    status.textContent = 'Personalized v1 is installed, but Google default is currently selected.';
  } else {
    status.textContent = 'No personalized model installed yet.';
  }
}

installButton?.addEventListener('click', () => fileInput?.click());
fileInput?.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  setBusy(true);
  status.textContent = 'Preparing local training…';
  try {
    const result = await installPersonalizedGestureProfile(file, {
      onProgress: ({ message }) => {
        if (message) status.textContent = message;
      }
    });
    status.textContent = `Installed Personalized v1: ${result.detectedCounts.start} START + ${result.detectedCounts.pause} PAUSE + ${result.detectedCounts.none} your NONE + ${result.publicNoneCount} HaGRID NONE. Photos were not stored.`;
  } catch (error) {
    console.error(error);
    status.textContent = `Could not install: ${error?.message || 'unknown error'}`;
  } finally {
    fileInput.value = '';
    setBusy(false);
  }
});

googleButton?.addEventListener('click', () => {
  setGestureModelPreference('google');
  renderCurrent();
});

renderCurrent();
