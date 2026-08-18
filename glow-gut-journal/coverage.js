import { getEntriesByDate, putEntry } from './db.js';

function localDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function activeDate() { return document.querySelector('.day-pill.selected')?.dataset.date || localDate(); }
function timeOf(entry) { return entry.dateTime?.slice(11,16) || entry.time || ''; }

function enhanceDrinkForm() {
  const form = document.querySelector('form[data-form="drink"]');
  if (!form || form.querySelector('[data-source-drink-extra]')) return;
  const actions = form.querySelector('.sticky-actions');
  if (!actions) return;
  const extra = document.createElement('div');
  extra.dataset.sourceDrinkExtra = 'true';
  extra.className = 'form';
  extra.innerHTML = `<div class="field"><label>Short drink note <span class="subtle">(optional)</span></label><input class="input" name="drinkNote" placeholder="e.g. smoothie, broth, unsure"></div><div class="field"><label>Optional drink photo</label><input class="input" type="file" name="drinkPhoto" accept="image/*" capture="environment"></div>`;
  actions.before(extra);
}

function enhanceMealCustomLiquid() {
  const form = document.querySelector('form[data-form="meal"]');
  if (!form || form.querySelector('[data-source-custom-liquid]')) return;
  const details = [...form.querySelectorAll('details')].find(item => item.querySelector('summary')?.textContent.includes('Add drink with meal'));
  const body = details?.querySelector('.details-body');
  if (!body) return;
  const field = document.createElement('div');
  field.dataset.sourceCustomLiquid = 'true';
  field.className = 'field';
  field.innerHTML = `<label>Custom amount in ounces <span class="subtle">(if “Custom”)</span></label><input class="input" type="number" min="0" step="0.5" name="mealCustomOz" placeholder="optional">`;
  body.append(field);
}

async function findSavedEntry(kind, snapshot) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const entries = await getEntriesByDate(snapshot.date);
    const candidates = entries.filter(entry => entry.type === kind && timeOf(entry) === snapshot.time);
    if (candidates.length) return candidates.at(-1);
    await new Promise(resolve => setTimeout(resolve, 75));
  }
  return null;
}

async function attachExtras(kind, snapshot) {
  const entry = await findSavedEntry(kind, snapshot);
  if (!entry) return;
  let changed = false;
  if (kind === 'drink') {
    if (snapshot.note) { entry.note = snapshot.note; changed = true; }
    if (snapshot.photo instanceof File && snapshot.photo.size) { entry.photo = snapshot.photo; changed = true; }
  }
  if (kind === 'meal' && snapshot.customOz > 0) {
    entry.liquidEstimate = 'custom';
    entry.liquidOz = snapshot.customOz;
    entry.liquidCustomOz = snapshot.customOz;
    changed = true;
  }
  if (changed) {
    await putEntry(entry);
    document.querySelector('.nav-btn.active')?.click();
  }
}

document.addEventListener('submit', event => {
  const form = event.target.closest('form[data-form]');
  if (!form) return;
  const kind = form.dataset.form;
  const date = activeDate();
  if (kind === 'drink') {
    const fd = new FormData(form);
    const photo = fd.get('drinkPhoto');
    const note = String(fd.get('drinkNote') || '').trim();
    if ((photo instanceof File && photo.size) || note) {
      attachExtras('drink', { date, time:String(fd.get('time') || ''), photo, note }).catch(console.error);
    }
  }
  if (kind === 'meal') {
    const fd = new FormData(form);
    const customOz = Number(fd.get('mealCustomOz')) || 0;
    if (fd.get('liquidEstimate') === 'custom' && customOz > 0) {
      attachExtras('meal', { date, time:String(fd.get('time') || ''), customOz }).catch(console.error);
    }
  }
}, true);

const observer = new MutationObserver(() => {
  enhanceDrinkForm();
  enhanceMealCustomLiquid();
});
observer.observe(document.body, { childList:true, subtree:true });
enhanceDrinkForm();
enhanceMealCustomLiquid();
