import { getAllEntries, putEntry } from './db.js';

const sheetRoot = document.querySelector('#sheet-root');
const toastRoot = document.querySelector('#toast-root');
let enhancing = false;

function localDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function activeDate() { return document.querySelector('.day-pill.selected')?.dataset.date || localDate(); }
function nowTime() { return new Date().toTimeString().slice(0, 5); }
function dateTime(date, time) { return `${date}T${time || nowTime()}:00`; }
function uid(prefix = 'e') { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`; }
function toast(message) {
  if (!toastRoot) return;
  toastRoot.innerHTML = `<div class="toast">${message}</div>`;
  setTimeout(() => { if (toastRoot.textContent === message) toastRoot.innerHTML = ''; }, 2200);
}
function refresh() { document.querySelector('.nav-btn.active')?.click(); }
function shown(value) { return value === undefined || value === null || value === '' ? '—' : String(value); }

function enhanceWrapForm() {
  const form = document.querySelector('form[data-form="wrap"]');
  if (!form || form.dataset.qaIntegrityEnhanced) return;
  form.dataset.qaIntegrityEnhanced = 'true';
  const original = form.elements.worstBloat;
  if (!original) return;
  const field = original.closest('.field');
  original.removeAttribute('name');
  field.querySelector('.range-wrap')?.remove();
  const select = document.createElement('select');
  select.name = 'worstBloat';
  select.innerHTML = `<option value="">Not checked</option>${Array.from({length:11},(_,i)=>`<option value="${i}">${i}</option>`).join('')}`;
  const existing = Number.isFinite(Number(original.value)) && form.dataset.existingId ? original.value : '';
  select.value = existing;
  field.append(select);
  const help = field.querySelector('.help');
  if (help) help.textContent = 'Optional · choose only if you remember the worst bloating today.';
}

async function saveWrap(form) {
  const fd = new FormData(form);
  const date = activeDate();
  const entry = {
    id: form.dataset.existingId || uid('wrap'),
    type: 'wrap',
    date,
    dateTime: dateTime(date, nowTime()),
    waterRating: String(fd.get('waterRating') || ''),
    fiberRating: String(fd.get('fiberRating') || ''),
    poopSummary: String(fd.get('poopSummary') || ''),
    prunesSummary: String(fd.get('prunesSummary') || '')
  };
  const worst = String(fd.get('worstBloat') || '');
  if (worst !== '') entry.worstBloat = Number(worst);
  await putEntry(entry);
}

document.addEventListener('submit', async event => {
  const form = event.target.closest('form[data-form="wrap"]');
  if (!form) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  try {
    await saveWrap(form);
    sheetRoot.innerHTML = '';
    refresh();
    toast('Done for today');
  } catch (error) {
    console.error(error);
    toast('Your evening check-in wasn’t saved. Please try again.');
  }
}, true);

async function repairTimelineText() {
  const cards = [...document.querySelectorAll('[data-entry-id]')];
  if (!cards.length) return;
  const all = await getAllEntries();
  const byId = new Map(all.map(e => [e.id, e]));
  cards.forEach(card => {
    const entry = byId.get(card.dataset.entryId);
    if (!entry) return;
    const title = card.querySelector('.entry-title');
    const meta = card.querySelector('.entry-meta');
    if (entry.type === 'symptom') {
      if (title) title.textContent = `Symptoms · bloating ${shown(entry.bloating)}${entry.bloating === undefined ? '' : '/10'}`;
      if (meta) meta.textContent = `Pain ${shown(entry.pain)}${entry.pain === undefined ? '' : '/10'} · gas ${shown(entry.gas)} · hard/swollen ${shown(entry.hardSwollen)}`;
    }
    if (entry.type === 'wrap' && meta) {
      meta.textContent = `Water ${shown(entry.waterRating)} · fiber ${shown(entry.fiberRating)} · worst bloat ${shown(entry.worstBloat)}${entry.worstBloat === undefined ? '' : '/10'}`;
    }
    if (entry.type === 'drink' && entry.estimate === 'fewSips' && meta) {
      meta.textContent = 'Qualitative amount: few sips';
    }
  });
}

async function enhance() {
  if (enhancing) return;
  enhancing = true;
  try {
    enhanceWrapForm();
    await repairTimelineText();
  } finally {
    enhancing = false;
  }
}

const observer = new MutationObserver(() => queueMicrotask(enhance));
observer.observe(document.body, { childList: true, subtree: true });
enhance();
