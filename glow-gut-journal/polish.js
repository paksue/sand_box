import { deleteEntry, getAllEntries, putEntry } from './db.js';

const sheetRoot = document.querySelector('#sheet-root');
const toastRoot = document.querySelector('#toast-root');
let lastFocus = null;
let activeSheet = null;
let undoEntry = null;
let undoTimer = null;
let enhancing = false;

const reportPrefs = {
  symptoms: true,
  foodLiquid: true,
  period: false,
  routine: true,
  repeated: true,
  questions: true
};

function esc(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

function refresh() {
  document.querySelector('.nav-btn.active')?.click();
}

function closeSheet() {
  sheetRoot.innerHTML = '';
}

function showToast(message) {
  if (!toastRoot) return;
  toastRoot.innerHTML = `<div class="toast">${esc(message)}</div>`;
  setTimeout(() => {
    if (toastRoot.textContent === message) toastRoot.innerHTML = '';
  }, 2500);
}

function showUndoToast(entry) {
  undoEntry = entry;
  clearTimeout(undoTimer);
  toastRoot.innerHTML = `<div class="toast polish-undo-toast"><span>Entry deleted</span><button type="button" data-polish-undo>Undo</button></div>`;
  undoTimer = setTimeout(() => {
    undoEntry = null;
    toastRoot.innerHTML = '';
  }, 6500);
}

function sheetIsDirty(sheet = sheetRoot.querySelector('.sheet')) {
  return sheet?.dataset.polishDirty === 'true';
}

function confirmDiscard(sheet) {
  if (!sheetIsDirty(sheet)) return true;
  return window.confirm('Discard the changes you made?');
}

function markDirty(event) {
  if (!event.isTrusted) return;
  const sheet = event.target.closest('.sheet');
  if (sheet) sheet.dataset.polishDirty = 'true';
}

function focusables(sheet) {
  return [...sheet.querySelectorAll('button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')]
    .filter(node => !node.hidden && !node.classList.contains('qa-hidden-control') && node.offsetParent !== null && getComputedStyle(node).visibility !== 'hidden');
}

function associateFieldLabels(sheet) {
  let index = 0;
  for (const field of sheet.querySelectorAll('.field')) {
    const label = field.querySelector(':scope > label');
    const control = field.querySelector(':scope > input:not([type="hidden"]), :scope > select, :scope > textarea');
    if (!label || !control || control.classList.contains('qa-hidden-control')) continue;
    if (!control.id) control.id = `dialog-field-${Date.now()}-${index++}`;
    label.htmlFor = control.id;
  }
}

function prepareDialog(sheet) {
  if (!sheet || sheet.dataset.polishDialogReady) return;
  sheet.dataset.polishDialogReady = 'true';
  const title = sheet.querySelector('.sheet-title');
  if (title) {
    title.id ||= `dialog-title-${Math.random().toString(36).slice(2, 8)}`;
    title.tabIndex = -1;
    sheet.setAttribute('aria-labelledby', title.id);
    sheet.removeAttribute('aria-label');
    requestAnimationFrame(() => title.focus({ preventScroll: true }));
  }

  associateFieldLabels(sheet);
  for (const group of sheet.querySelectorAll('.qa-choice-grid, .qa-score-grid')) {
    const label = group.closest('.field')?.querySelector('label, .label')?.textContent?.trim();
    if (label) group.setAttribute('aria-label', label);
    group.setAttribute('role', 'group');
  }
  for (const button of sheet.querySelectorAll('.qa-score')) {
    const label = button.closest('.field')?.querySelector('label')?.textContent?.trim() || 'Score';
    button.setAttribute('aria-label', `${label} ${button.dataset.value} out of 10`);
  }
  for (const button of sheet.querySelectorAll('.qa-score-clear')) {
    const label = button.closest('.field')?.querySelector('label')?.textContent?.trim() || 'Score';
    button.setAttribute('aria-label', `${label} not checked`);
  }
}

function previewFileInput(input) {
  if (!input || input.dataset.polishPreview) return;
  input.dataset.polishPreview = 'true';
  const holder = document.createElement('div');
  holder.className = 'polish-photo-preview';
  holder.hidden = true;
  input.after(holder);

  const clear = () => {
    const img = holder.querySelector('img');
    if (img?.dataset.objectUrl) URL.revokeObjectURL(img.dataset.objectUrl);
    input.value = '';
    holder.innerHTML = '';
    holder.hidden = true;
    input.closest('.sheet')?.setAttribute('data-polish-dirty', 'true');
  };

  input.addEventListener('change', () => {
    const old = holder.querySelector('img');
    if (old?.dataset.objectUrl) URL.revokeObjectURL(old.dataset.objectUrl);
    holder.innerHTML = '';
    const file = input.files?.[0];
    if (!file) {
      holder.hidden = true;
      return;
    }
    const url = URL.createObjectURL(file);
    holder.hidden = false;
    holder.innerHTML = `<img class="photo-preview" alt="Selected photo preview"><button class="secondary" type="button" data-polish-clear-photo>Remove photo</button>`;
    const img = holder.querySelector('img');
    img.src = url;
    img.dataset.objectUrl = url;
    holder.querySelector('[data-polish-clear-photo]').addEventListener('click', clear);
  });
}

async function enhanceEntryMenu() {
  const sheet = sheetRoot.querySelector('.sheet');
  const title = sheet?.querySelector('.sheet-title');
  if (title?.textContent.trim() !== 'Entry options' || sheet.dataset.polishPhotoChecked) return;
  sheet.dataset.polishPhotoChecked = 'true';
  const id = sheetRoot.querySelector('[data-sheet-action="delete-entry"]')?.dataset.id;
  if (!id) return;
  const entry = (await getAllEntries()).find(item => item.id === id);
  if (!entry?.photo) return;
  const deleteButton = sheetRoot.querySelector('[data-sheet-action="delete-entry"]');
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'menu-row';
  remove.dataset.polishRemovePhoto = id;
  remove.innerHTML = '<div><strong>Remove photo</strong><small>Keep the entry, remove only its photo</small></div><span>›</span>';
  deleteButton.before(remove);
}

function reportGroupForHeading(text) {
  if (['Bowel pattern', 'Pain & blood', 'Bloating'].includes(text)) return 'symptoms';
  if (['Liquid', 'Food pattern'].includes(text)) return 'foodLiquid';
  if (text === 'Period') return 'period';
  if (text === 'Routine / bathroom') return 'routine';
  if (text === 'Repeated meal patterns') return 'repeated';
  if (text === 'Questions for the pediatrician') return 'questions';
  return null;
}

function applyReportVisibility(report) {
  for (const node of report.querySelectorAll('[data-report-group]')) {
    node.hidden = reportPrefs[node.dataset.reportGroup] === false;
  }
}

function enhanceDoctorReport() {
  const report = sheetRoot.querySelector('#doctor-report');
  if (!report || report.dataset.polishPrivacy) return;
  report.dataset.polishPrivacy = 'true';

  for (const heading of report.querySelectorAll(':scope > h2')) {
    const group = reportGroupForHeading(heading.textContent.trim());
    if (!group) continue;
    heading.dataset.reportGroup = group;
    let node = heading.nextElementSibling;
    while (node && node.tagName !== 'H2') {
      node.dataset.reportGroup = group;
      node = node.nextElementSibling;
    }
  }

  const panel = document.createElement('section');
  panel.id = 'polish-report-controls';
  panel.className = 'card no-print polish-report-controls';
  const controls = [
    ['symptoms', 'Bowel, pain & bloating'],
    ['foodLiquid', 'Liquid & food'],
    ['period', 'Period'],
    ['routine', 'Bathroom routine'],
    ['repeated', 'Repeated meals'],
    ['questions', 'Questions for pediatrician']
  ];
  panel.innerHTML = `<div><h3>Choose what to share</h3><p class="subtle">Period information is excluded by default. Turn on only the sections you want in the printed/PDF report.</p></div><div class="polish-report-grid">${controls.map(([key, label]) => `<label class="polish-check"><input type="checkbox" data-report-toggle="${key}" ${reportPrefs[key] ? 'checked' : ''}><span>${esc(label)}</span></label>`).join('')}</div>`;
  report.before(panel);
  panel.addEventListener('change', event => {
    const input = event.target.closest('[data-report-toggle]');
    if (!input) return;
    reportPrefs[input.dataset.reportToggle] = input.checked;
    applyReportVisibility(report);
  });
  applyReportVisibility(report);
}

async function removePhoto(id) {
  const entry = (await getAllEntries()).find(item => item.id === id);
  if (!entry?.photo) return;
  const next = { ...entry };
  delete next.photo;
  delete next.photoEncoding;
  await putEntry(next);
  closeSheet();
  refresh();
  showToast('Photo removed');
}

async function deleteWithUndo(id) {
  const entry = (await getAllEntries()).find(item => item.id === id);
  if (!entry) return;
  if (!window.confirm('Delete this entry?')) return;
  await deleteEntry(id);
  closeSheet();
  refresh();
  showUndoToast(entry);
}

function enhance() {
  if (enhancing) return;
  enhancing = true;
  try {
    const sheet = sheetRoot.querySelector('.sheet');
    if (sheet && sheet !== activeSheet) {
      if (!activeSheet) lastFocus = document.activeElement;
      activeSheet = sheet;
      prepareDialog(sheet);
    }
    if (!sheet && activeSheet) {
      activeSheet = null;
      if (lastFocus?.isConnected) requestAnimationFrame(() => lastFocus.focus({ preventScroll: true }));
      lastFocus = null;
    }
    document.querySelectorAll('input[type="file"][accept*="image"]').forEach(previewFileInput);
    enhanceEntryMenu().catch(console.error);
    enhanceDoctorReport();
  } finally {
    enhancing = false;
  }
}

window.addEventListener('input', markDirty, true);
window.addEventListener('change', markDirty, true);
window.addEventListener('click', event => {
  if (!event.isTrusted) return;
  const interactive = event.target.closest('.qa-choice, .qa-score, .qa-score-clear, .chip');
  const sheet = interactive?.closest('.sheet');
  if (sheet) sheet.dataset.polishDirty = 'true';
}, true);

window.addEventListener('click', event => {
  const sheet = sheetRoot.querySelector('.sheet');
  if (!sheet) return;
  const close = event.target.closest('[data-sheet-action="close"], [data-qa-close]');
  const backdrop = event.target.classList?.contains('sheet-backdrop');
  if ((close || backdrop) && !confirmDiscard(sheet)) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
}, true);

window.addEventListener('click', event => {
  const remove = event.target.closest('[data-polish-remove-photo]');
  if (remove) {
    event.preventDefault();
    event.stopImmediatePropagation();
    removePhoto(remove.dataset.polishRemovePhoto).catch(console.error);
    return;
  }

  const del = event.target.closest('[data-sheet-action="delete-entry"][data-id]');
  if (del) {
    event.preventDefault();
    event.stopImmediatePropagation();
    deleteWithUndo(del.dataset.id).catch(console.error);
    return;
  }

  const undo = event.target.closest('[data-polish-undo]');
  if (undo && undoEntry) {
    event.preventDefault();
    const entry = undoEntry;
    undoEntry = null;
    clearTimeout(undoTimer);
    putEntry(entry).then(() => {
      refresh();
      showToast('Entry restored');
    }).catch(console.error);
  }
}, true);

window.addEventListener('keydown', event => {
  const sheet = sheetRoot.querySelector('.sheet');
  if (!sheet) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (confirmDiscard(sheet)) closeSheet();
    return;
  }
  if (event.key !== 'Tab') return;
  const items = focusables(sheet);
  if (!items.length) return;
  const first = items[0];
  const last = items.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}, true);

const observer = new MutationObserver(() => queueMicrotask(enhance));
observer.observe(document.body, { childList: true, subtree: true });
enhance();
