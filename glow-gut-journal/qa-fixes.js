import {
  getAllEntries,
  getEntriesByDate,
  getSetting,
  getWeekly,
  putEntry
} from './db.js';

const app = document.querySelector('#app');
const sheetRoot = document.querySelector('#sheet-root');
const toastRoot = document.querySelector('#toast-root');
let enhancing = false;
let summarizing = false;

const KNOWN_LIQUID_OZ = {
  halfCup: 4,
  oneCup: 8,
  twoCups: 16,
  halfSmallBottle: 8,
  fullSmallBottle: 16,
  fullLargeBottle: 32
};

const LABELS = {
  fewSips: 'Few sips',
  halfCup: '½ cup · ~4 oz',
  oneCup: '1 cup · ~8 oz',
  twoCups: '2 cups · ~16 oz',
  halfSmallBottle: '½ small bottle · ~8 oz',
  fullSmallBottle: 'Full small bottle · ~16 oz',
  fullLargeBottle: 'Full large bottle · ~32 oz',
  custom: 'Custom'
};

function localDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function dateObj(date) { return new Date(`${date}T12:00:00`); }
function addDays(date, days) { const d = dateObj(date); d.setDate(d.getDate() + days); return localDate(d); }
function formatDate(date, opts = { month: 'short', day: 'numeric' }) { return new Intl.DateTimeFormat(undefined, opts).format(dateObj(date)); }
function activeDate() { return document.querySelector('.day-pill.selected')?.dataset.date || localDate(); }
function nowTime() { return new Date().toTimeString().slice(0, 5); }
function timeOf(entry) { return entry.dateTime?.slice(11, 16) || entry.time || ''; }
function dateTime(date, time) { return `${date}T${time || nowTime()}:00`; }
function uid(prefix = 'e') { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
function esc(value = '') { return String(value).replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c])); }
function setText(node, value) { const next = String(value); if (node && node.textContent !== next) node.textContent = next; }
function numOrMissing(value) { return value === '' || value === null || value === undefined ? undefined : Number(value); }
function validNumbers(values) { return values.filter(v => v !== '' && v !== null && v !== undefined && Number.isFinite(Number(v))).map(Number); }
function maxNum(values) { const nums = validNumbers(values); return nums.length ? Math.max(...nums) : null; }
function avgNum(values) { const nums = validNumbers(values); return nums.length ? nums.reduce((a,b)=>a+b,0)/nums.length : null; }
function toast(message) {
  if (!toastRoot) return;
  toastRoot.innerHTML = `<div class="toast">${esc(message)}</div>`;
  setTimeout(() => { if (toastRoot.textContent === message) toastRoot.innerHTML = ''; }, 2200);
}
function refreshActiveTab() {
  const active = document.querySelector('.nav-btn.active');
  if (active) active.click();
}
function closeSheet() { sheetRoot.innerHTML = ''; }

function inferMealType(time = nowTime()) {
  const [h, m] = String(time).split(':').map(Number);
  const minutes = (h * 60) + (m || 0);
  if (minutes < 10 * 60 + 30) return 'breakfast';
  if (minutes < 14 * 60 + 30) return 'lunch';
  if (minutes < 17 * 60 + 15) return 'snack';
  if (minutes < 21 * 60 + 30) return 'dinner';
  return 'other';
}

function ensureBlankOption(select, label = 'Not recorded') {
  if (!select) return;
  let blank = [...select.options].find(o => o.value === '');
  if (!blank) {
    blank = document.createElement('option');
    blank.value = '';
    blank.textContent = label;
    select.prepend(blank);
  } else if (!blank.textContent.trim()) {
    blank.textContent = label;
  }
}

function buttonChoiceGroup(select, choices, { clearLabel = 'Not recorded', className = '' } = {}) {
  if (!select || select.dataset.qaEnhanced) return;
  select.dataset.qaEnhanced = 'true';
  ensureBlankOption(select, clearLabel);
  select.value = select.value || '';
  select.classList.add('qa-hidden-control');

  const group = document.createElement('div');
  group.className = `qa-choice-grid ${className}`.trim();
  group.setAttribute('role', 'group');
  choices.forEach(([value, label]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'qa-choice';
    button.dataset.value = value;
    button.textContent = label;
    button.setAttribute('aria-pressed', String(select.value === value));
    button.addEventListener('click', () => {
      select.value = value;
      group.querySelectorAll('.qa-choice').forEach(b => {
        const selected = b.dataset.value === value;
        b.classList.toggle('selected', selected);
        b.setAttribute('aria-pressed', String(selected));
      });
      select.dispatchEvent(new Event('change', { bubbles: true }));
    });
    if (select.value === value) button.classList.add('selected');
    group.append(button);
  });
  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'qa-choice qa-clear-choice';
  clear.dataset.value = '';
  clear.textContent = clearLabel;
  clear.setAttribute('aria-pressed', String(select.value === ''));
  if (!select.value) clear.classList.add('selected');
  clear.addEventListener('click', () => {
    select.value = '';
    group.querySelectorAll('.qa-choice').forEach(b => {
      const selected = b.dataset.value === '';
      b.classList.toggle('selected', selected);
      b.setAttribute('aria-pressed', String(selected));
    });
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  group.append(clear);
  select.after(group);
}

function scorePicker(field, name) {
  if (!field || field.dataset.qaScoreEnhanced) return;
  field.dataset.qaScoreEnhanced = 'true';
  const range = field.querySelector(`input[name="${name}"]`);
  if (!range) return;
  range.removeAttribute('name');
  const wrap = field.querySelector('.range-wrap');
  const help = field.querySelector('.help');
  if (wrap) wrap.remove();
  const hidden = document.createElement('input');
  hidden.type = 'hidden';
  hidden.name = name;
  hidden.value = '';
  const group = document.createElement('div');
  group.className = 'qa-score-grid';
  group.setAttribute('role', 'group');
  for (let n = 0; n <= 10; n += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'qa-score';
    button.textContent = String(n);
    button.dataset.value = String(n);
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      hidden.value = String(n);
      group.querySelectorAll('.qa-score').forEach(b => {
        const selected = b.dataset.value === String(n);
        b.classList.toggle('selected', selected);
        b.setAttribute('aria-pressed', String(selected));
      });
      clear.classList.remove('selected');
      clear.setAttribute('aria-pressed', 'false');
    });
    group.append(button);
  }
  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'qa-score-clear selected';
  clear.textContent = 'Not checked';
  clear.setAttribute('aria-pressed', 'true');
  clear.addEventListener('click', () => {
    hidden.value = '';
    group.querySelectorAll('.qa-score').forEach(b => {
      b.classList.remove('selected');
      b.setAttribute('aria-pressed', 'false');
    });
    clear.classList.add('selected');
    clear.setAttribute('aria-pressed', 'true');
  });
  field.append(hidden, group, clear);
  if (help) help.textContent = 'Optional · 0 none · 5 moderate · 10 worst';
}

function enhanceMealForm(form) {
  if (form.dataset.qaFormEnhanced) return;
  form.dataset.qaFormEnhanced = 'true';
  const time = form.elements.time;
  const mealType = form.elements.mealType;
  if (mealType) {
    mealType.value = inferMealType(time?.value || nowTime());
    buttonChoiceGroup(mealType, [
      ['breakfast','Breakfast'], ['lunch','Lunch'], ['snack','Snack'], ['dinner','Dinner'], ['other','Other']
    ], { clearLabel: 'Other', className: 'qa-meal-types' });
  }
  time?.addEventListener('change', () => {
    if (!mealType || mealType.dataset.qaUserPicked === 'true') return;
    mealType.value = inferMealType(time.value);
    mealType.nextElementSibling?.querySelector(`[data-value="${mealType.value}"]`)?.click();
  });
  mealType?.nextElementSibling?.addEventListener('click', () => { mealType.dataset.qaUserPicked = 'true'; });
  const estimate = form.elements.liquidEstimate;
  if (estimate) {
    estimate.value = '';
    buttonChoiceGroup(estimate, Object.entries(LABELS), { clearLabel: 'No drink amount' });
  }
}

function enhanceDrinkForm(form) {
  if (form.dataset.qaFormEnhanced) return;
  form.dataset.qaFormEnhanced = 'true';
  const type = form.elements.drinkType;
  if (type) buttonChoiceGroup(type, [['water','Water'],['milk','Milk'],['juice','Juice'],['tea','Tea'],['soup','Soup'],['other','Other']], { clearLabel: 'Other' });
  const estimate = form.elements.estimate;
  if (estimate) {
    ensureBlankOption(estimate, 'Not recorded');
    estimate.value = '';
    buttonChoiceGroup(estimate, Object.entries(LABELS), { clearLabel: 'Not recorded' });
  }
}

function enhancePoopForm(form) {
  if (form.dataset.qaFormEnhanced) return;
  form.dataset.qaFormEnhanced = 'true';
  const amount = form.elements.amount;
  if (amount) {
    amount.value = '';
    buttonChoiceGroup(amount, [['tiny','Tiny'],['small','Small'],['medium','Medium'],['large','Large']], { clearLabel: 'Not sure / skip' });
  }
  const blood = form.elements.blood;
  if (blood) {
    blood.value = '';
    buttonChoiceGroup(blood, [['no','No'],['yes','Yes'],['not sure','Not sure']], { clearLabel: 'Skip' });
  }
  const pain = [...form.querySelectorAll('.field')].find(f => f.querySelector('label')?.textContent.trim() === 'Pain');
  scorePicker(pain, 'pain');
}

function enhanceSymptomForm(form) {
  if (form.dataset.qaFormEnhanced) return;
  form.dataset.qaFormEnhanced = 'true';
  const bloating = [...form.querySelectorAll('.field')].find(f => f.querySelector('label')?.textContent.trim() === 'Bloating');
  const pain = [...form.querySelectorAll('.field')].find(f => f.querySelector('label')?.textContent.includes('Belly / pelvic pain'));
  scorePicker(bloating, 'bloating');
  scorePicker(pain, 'pain');
  const gas = form.elements.gas;
  if (gas) {
    gas.value = '';
    buttonChoiceGroup(gas, [['none','None'],['mild','Mild'],['a lot','A lot']], { clearLabel: 'Skip' });
  }
  const hard = form.elements.hardSwollen;
  if (hard) {
    hard.value = '';
    buttonChoiceGroup(hard, [['no','No'],['yes','Yes'],['not sure','Not sure']], { clearLabel: 'Skip' });
  }
}

function enhanceCommonForms() {
  const meal = document.querySelector('form[data-form="meal"]');
  if (meal) enhanceMealForm(meal);
  const drink = document.querySelector('form[data-form="drink"]');
  if (drink) enhanceDrinkForm(drink);
  const poop = document.querySelector('form[data-form="poop"]');
  if (poop) enhancePoopForm(poop);
  const symptom = document.querySelector('form[data-form="symptom"]');
  if (symptom) enhanceSymptomForm(symptom);
}

function selectedValues(group) {
  return [...sheetRoot.querySelectorAll(`[data-multi="${group}"].selected`)].map(b => b.dataset.value);
}

function parseBristolFromSheet() {
  const subtitle = sheetRoot.querySelector('.sheet-subtitle')?.textContent || '';
  const match = subtitle.match(/Type\s+(\d)/i);
  return match ? Number(match[1]) : undefined;
}

async function saveCommonForm(form) {
  const fd = new FormData(form);
  const kind = form.dataset.form;
  const date = activeDate();
  if (kind === 'meal') {
    const entry = {
      id: uid('meal'), type: 'meal', date, dateTime: dateTime(date, fd.get('time')),
      mealType: fd.get('mealType') || inferMealType(fd.get('time')),
      description: String(fd.get('description') || '').trim(),
      tags: selectedValues('tag'),
      fiberFoods: {
        prunes: String(fd.get('prunes') || '').trim(),
        kiwi: String(fd.get('kiwi') || '').trim(),
        pear: String(fd.get('pear') || '').trim()
      }
    };
    const photo = fd.get('photo');
    if (photo instanceof File && photo.size) entry.photo = photo;
    const estimate = String(fd.get('liquidEstimate') || '');
    const drinkType = String(fd.get('drinkType') || '');
    if (drinkType) entry.drinkType = drinkType;
    if (estimate) {
      entry.liquidEstimate = estimate;
      const customOz = Number(fd.get('mealCustomOz')) || 0;
      if (estimate === 'custom' && customOz > 0) entry.liquidOz = customOz;
      else if (KNOWN_LIQUID_OZ[estimate]) entry.liquidOz = KNOWN_LIQUID_OZ[estimate];
    }
    await putEntry(entry);
    return { message: 'Meal saved' };
  }
  if (kind === 'drink') {
    const estimate = String(fd.get('estimate') || '');
    const customOz = Number(fd.get('customOz')) || 0;
    const entry = {
      id: uid('drink'), type: 'drink', date, dateTime: dateTime(date, fd.get('time')),
      drinkType: String(fd.get('drinkType') || 'other')
    };
    if (estimate) entry.estimate = estimate;
    if (estimate === 'custom' && customOz > 0) entry.estimatedOz = customOz;
    else if (KNOWN_LIQUID_OZ[estimate]) entry.estimatedOz = KNOWN_LIQUID_OZ[estimate];
    const note = String(fd.get('drinkNote') || '').trim();
    if (note) entry.note = note;
    const photo = fd.get('drinkPhoto');
    if (photo instanceof File && photo.size) entry.photo = photo;
    await putEntry(entry);
    return { message: 'Drink added' };
  }
  if (kind === 'poop') {
    const entry = {
      id: uid('poop'), type: 'poop', date, dateTime: dateTime(date, fd.get('time')),
      bristol: parseBristolFromSheet(),
      details: selectedValues('detail'),
      note: String(fd.get('note') || '').trim()
    };
    const amount = String(fd.get('amount') || '');
    const pain = numOrMissing(fd.get('pain'));
    const blood = String(fd.get('blood') || '');
    if (amount) entry.amount = amount;
    if (pain !== undefined) entry.pain = pain;
    if (blood) entry.blood = blood;
    await putEntry(entry);
    return { message: 'Poop saved', safety: blood === 'yes' || (pain !== undefined && pain >= 8) };
  }
  if (kind === 'symptom') {
    const entry = {
      id: uid('symptom'), type: 'symptom', date, dateTime: dateTime(date, fd.get('time')),
      when: String(fd.get('when') || 'custom'),
      note: String(fd.get('note') || '').trim()
    };
    const bloating = numOrMissing(fd.get('bloating'));
    const pain = numOrMissing(fd.get('pain'));
    const gas = String(fd.get('gas') || '');
    const hard = String(fd.get('hardSwollen') || '');
    if (bloating !== undefined) entry.bloating = bloating;
    if (pain !== undefined) entry.pain = pain;
    if (gas) entry.gas = gas;
    if (hard) entry.hardSwollen = hard;
    await putEntry(entry);
    return { message: 'Symptoms saved', safety: hard === 'yes' || (pain !== undefined && pain >= 8) };
  }
  return null;
}

function showSafetyPrompt() {
  sheetRoot.innerHTML = `<div class="sheet-backdrop" data-qa-safety-backdrop><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="qa-safety-title">
    <div class="grabber"></div><div class="sheet-head"><div><h2 id="qa-safety-title" class="sheet-title">Check safety information</h2><p class="sheet-subtitle">A severe or concerning symptom was recorded.</p></div><button class="icon-btn" data-qa-close aria-label="Close">×</button></div>
    <div class="note danger">Glow cannot tell what is causing a symptom. Review the journal's safety information if the symptom is severe, worsening, or concerning.</div>
    <div class="sticky-actions"><button class="primary" data-qa-review-safety>Review safety information</button></div>
  </section></div>`;
}

// Capture first so the legacy form handler cannot turn unanswered fields into 0 / No.
document.addEventListener('submit', async event => {
  const form = event.target.closest('form[data-form]');
  if (!form || !['meal','drink','poop','symptom'].includes(form.dataset.form)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  try {
    const result = await saveCommonForm(form);
    closeSheet();
    refreshActiveTab();
    toast(result?.message || 'Saved');
    if (result?.safety) setTimeout(showSafetyPrompt, 180);
  } catch (error) {
    console.error(error);
    toast('Your entry wasn’t saved. Please try again.');
  }
}, true);

function editorField(label, control) { return `<div class="field"><label>${label}</label>${control}</div>`; }
function options(values, selected, blank = 'Not recorded') {
  return `<option value="">${blank}</option>${values.map(v => `<option value="${esc(v)}" ${String(v) === String(selected ?? '') ? 'selected' : ''}>${esc(v)}</option>`).join('')}`;
}
function scoreOptions(selected) {
  return `<option value="">Not checked</option>${Array.from({length:11},(_,i)=>`<option value="${i}" ${String(i)===String(selected??'')?'selected':''}>${i}</option>`).join('')}`;
}

async function showEditor(id) {
  const all = await getAllEntries();
  const e = all.find(item => item.id === id);
  if (!e) return;
  let fields = editorField('Time', `<input class="input" type="time" name="time" value="${esc(timeOf(e))}">`);
  if (e.type === 'meal') {
    fields += editorField('Meal', `<select name="mealType">${options(['breakfast','lunch','snack','dinner','other'], e.mealType, 'Choose')}</select>`);
    fields += editorField('What did you have?', `<textarea name="description">${esc(e.description || '')}</textarea>`);
  } else if (e.type === 'drink') {
    fields += editorField('Drink', `<select name="drinkType">${options(['water','milk','juice','tea','soup','other'], e.drinkType, 'Choose')}</select>`);
    fields += editorField('Amount', `<select name="estimate">${options(Object.keys(LABELS), e.estimate, 'Not recorded')}</select>`);
    fields += editorField('Custom ounces', `<input class="input" type="number" min="0" step="0.5" name="customOz" value="${esc(e.estimatedOz || '')}" placeholder="only for Custom">`);
    fields += editorField('Note', `<input class="input" name="note" value="${esc(e.note || '')}">`);
  } else if (e.type === 'poop') {
    fields += editorField('Bristol type', `<select name="bristol">${options(['1','2','3','4','5','6','7'], e.bristol, 'Not sure')}</select>`);
    fields += editorField('Amount', `<select name="amount">${options(['tiny','small','medium','large'], e.amount, 'Not recorded')}</select>`);
    fields += editorField('Pain', `<select name="pain">${scoreOptions(e.pain)}</select>`);
    fields += editorField('Blood?', `<select name="blood">${options(['no','yes','not sure'], e.blood, 'Not recorded')}</select>`);
    fields += editorField('Note', `<textarea name="note">${esc(e.note || '')}</textarea>`);
  } else if (e.type === 'symptom') {
    fields += editorField('Bloating', `<select name="bloating">${scoreOptions(e.bloating)}</select>`);
    fields += editorField('Belly / pelvic pain', `<select name="pain">${scoreOptions(e.pain)}</select>`);
    fields += editorField('Gas', `<select name="gas">${options(['none','mild','a lot'], e.gas, 'Not recorded')}</select>`);
    fields += editorField('Hard / swollen?', `<select name="hardSwollen">${options(['no','yes','not sure'], e.hardSwollen, 'Not recorded')}</select>`);
    fields += editorField('Note', `<textarea name="note">${esc(e.note || '')}</textarea>`);
  } else if (e.type === 'wrap') {
    fields += editorField('Water', `<select name="waterRating">${options(['low','OK','good'], e.waterRating, 'Skip')}</select>`);
    fields += editorField('Fiber', `<select name="fiberRating">${options(['low','OK','good'], e.fiberRating, 'Skip')}</select>`);
    fields += editorField('Worst bloating', `<select name="worstBloat">${scoreOptions(e.worstBloat)}</select>`);
    fields += editorField('Poop summary', `<select name="poopSummary">${options(['none','pebbly','hard','normal','loose'], e.poopSummary, 'Skip')}</select>`);
    fields += editorField('Prunes', `<select name="prunesSummary">${options(['no','little','yes','more gas'], e.prunesSummary, 'Skip')}</select>`);
  } else if (e.type === 'checkin') {
    fields += editorField('Period started today?', `<select name="periodStartedToday">${options(['no','yes'], e.periodStartedToday, 'Skip')}</select>`);
    fields += editorField('Spotting?', `<select name="spotting">${options(['no','yes','not sure'], e.spotting, 'Skip')}</select>`);
    fields += editorField('Days late', `<input class="input" type="number" min="0" name="daysLate" value="${esc(e.daysLate || '')}">`);
    fields += editorField('Cramps / pelvic pain', `<select name="crampsPain">${scoreOptions(e.crampsPain)}</select>`);
    fields += editorField('Held poop / avoided public bathroom?', `<select name="heldPoop">${options(['no','yes'], e.heldPoop, 'Skip')}</select>`);
    fields += editorField('Sat after meal 5–10 min?', `<select name="satAfterMeal">${options(['no','yes'], e.satAfterMeal, 'Skip')}</select>`);
    fields += editorField('Feet supported?', `<select name="feetSupported">${options(['no','yes'], e.feetSupported, 'Skip')}</select>`);
    fields += editorField('Activity / walk', `<select name="activity">${options(['none','some','good'], e.activity, 'Skip')}</select>`);
    fields += editorField('Stress', `<select name="stress">${options(['low','medium','high'], e.stress, 'Skip')}</select>`);
    fields += editorField('Urine color', `<select name="urineColor">${options(['pale','yellow','dark'], e.urineColor, 'Skip')}</select>`);
    fields += editorField('Appetite', `<select name="appetite">${options(['normal','low'], e.appetite, 'Skip')}</select>`);
  } else {
    fields += editorField('Note', `<textarea name="note">${esc(e.note || '')}</textarea>`);
  }
  sheetRoot.innerHTML = `<div class="sheet-backdrop"><section class="sheet" role="dialog" aria-modal="true" aria-labelledby="qa-edit-title"><div class="grabber"></div>
    <div class="sheet-head"><div><h2 id="qa-edit-title" class="sheet-title">Edit ${esc(e.type)}</h2><p class="sheet-subtitle">Correct only what needs changing.</p></div><button class="icon-btn" data-qa-close aria-label="Close">×</button></div>
    <form id="qa-edit-form" class="form" data-id="${esc(e.id)}" data-type="${esc(e.type)}">${fields}<div class="sticky-actions"><button class="primary" type="submit">Save changes</button></div></form>
  </section></div>`;
}

async function saveEditor(form) {
  const all = await getAllEntries();
  const entry = all.find(e => e.id === form.dataset.id);
  if (!entry) throw new Error('Entry not found');
  const fd = new FormData(form);
  const next = { ...entry };
  const time = String(fd.get('time') || timeOf(entry));
  next.dateTime = dateTime(entry.date, time);
  const optionalNumber = name => {
    const v = numOrMissing(fd.get(name));
    if (v === undefined) delete next[name]; else next[name] = v;
  };
  const optionalString = name => {
    const v = String(fd.get(name) || '');
    if (!v) delete next[name]; else next[name] = v;
  };
  if (entry.type === 'meal') {
    next.mealType = String(fd.get('mealType') || entry.mealType || 'other');
    next.description = String(fd.get('description') || '').trim();
  } else if (entry.type === 'drink') {
    next.drinkType = String(fd.get('drinkType') || entry.drinkType || 'other');
    const estimate = String(fd.get('estimate') || '');
    if (estimate) next.estimate = estimate; else delete next.estimate;
    const customOz = Number(fd.get('customOz')) || 0;
    if (estimate === 'custom' && customOz > 0) next.estimatedOz = customOz;
    else if (KNOWN_LIQUID_OZ[estimate]) next.estimatedOz = KNOWN_LIQUID_OZ[estimate];
    else delete next.estimatedOz;
    next.note = String(fd.get('note') || '').trim();
  } else if (entry.type === 'poop') {
    optionalNumber('bristol'); optionalString('amount'); optionalNumber('pain'); optionalString('blood'); next.note = String(fd.get('note') || '').trim();
  } else if (entry.type === 'symptom') {
    optionalNumber('bloating'); optionalNumber('pain'); optionalString('gas'); optionalString('hardSwollen'); next.note = String(fd.get('note') || '').trim();
  } else if (entry.type === 'wrap') {
    optionalString('waterRating'); optionalString('fiberRating'); optionalNumber('worstBloat'); optionalString('poopSummary'); optionalString('prunesSummary');
  } else if (entry.type === 'checkin') {
    ['periodStartedToday','spotting','daysLate','heldPoop','satAfterMeal','feetSupported','activity','stress','urineColor','appetite'].forEach(optionalString);
    optionalNumber('crampsPain');
  } else {
    next.note = String(fd.get('note') || '').trim();
  }
  await putEntry(next);
}

function enhanceEntryMenu() {
  const title = sheetRoot.querySelector('.sheet-title');
  if (title?.textContent.trim() !== 'Entry options' || sheetRoot.querySelector('[data-qa-edit-id]')) return;
  const deleteButton = sheetRoot.querySelector('[data-sheet-action="delete-entry"][data-id]');
  if (!deleteButton) return;
  const edit = document.createElement('button');
  edit.className = 'menu-row';
  edit.dataset.qaEditId = deleteButton.dataset.id;
  edit.innerHTML = '<div><strong>Edit entry</strong><small>Correct time or details without deleting it</small></div><span>›</span>';
  deleteButton.before(edit);
}

document.addEventListener('submit', async event => {
  const form = event.target.closest('#qa-edit-form');
  if (!form) return;
  event.preventDefault();
  try {
    await saveEditor(form);
    closeSheet();
    refreshActiveTab();
    toast('Entry updated');
  } catch (error) {
    console.error(error);
    toast('Changes weren’t saved. Please try again.');
  }
}, true);

document.addEventListener('click', async event => {
  const edit = event.target.closest('[data-qa-edit-id]');
  if (edit) {
    event.preventDefault(); event.stopImmediatePropagation();
    await showEditor(edit.dataset.qaEditId); return;
  }
  if (event.target.closest('[data-qa-close]')) { event.preventDefault(); closeSheet(); return; }
  if (event.target.closest('[data-qa-review-safety]')) {
    event.preventDefault(); closeSheet();
    document.querySelector('[data-tab="more"]')?.click();
    setTimeout(() => document.querySelector('[data-action="safety"]')?.click(), 80);
  }
}, true);

async function trackingWindow() {
  const prefs = await getSetting('preferences', {});
  const start = prefs.startDate || localDate();
  return { start, end: addDays(start, 6), dates: Array.from({length:7}, (_,i)=>addDays(start,i)) };
}

async function sourceWeekSummary() {
  const { start, end, dates } = await trackingWindow();
  const all = await getAllEntries();
  const entries = all.filter(e => dates.includes(e.date));
  const poops = entries.filter(e => e.type === 'poop');
  const symptoms = entries.filter(e => e.type === 'symptom');
  const meals = entries.filter(e => e.type === 'meal');
  const drinks = entries.filter(e => e.type === 'drink');
  const checkins = entries.filter(e => e.type === 'checkin');
  const wraps = entries.filter(e => e.type === 'wrap');
  const elapsed = dates.filter(d => d <= localDate());
  const poopDays = new Set(poops.map(e => e.date));
  const confirmedNoPoopDays = new Set(wraps.filter(w => w.poopSummary === 'none' && !poopDays.has(w.date)).map(w => w.date));
  const unconfirmedDays = elapsed.filter(d => !poopDays.has(d) && !confirmedNoPoopDays.has(d));
  const type1Days = new Set(poops.filter(p => Number(p.bristol) === 1).map(p => p.date));
  const stoolCounts = Array.from({length:7}, (_,i) => poops.filter(p => Number(p.bristol) === i+1).length);
  const darkUrineDays = new Set(checkins.filter(c => c.urineColor === 'dark').map(c => c.date));
  const fiberDays = new Set(meals.filter(m => {
    const tags = m.tags || []; const f = m.fiberFoods || {};
    return tags.some(t => ['fruit','vegetables','oats','beans'].includes(t)) || Object.values(f).some(Boolean);
  }).map(m => m.date));
  const dairyDays = new Set(meals.filter(m => (m.tags || []).includes('dairyCheeseHeavy')).map(m => m.date));
  const whiteCarbDays = new Set(meals.filter(m => (m.tags || []).includes('whiteCarbHeavy')).map(m => m.date));
  const pruneDays = new Set(meals.filter(m => Boolean(m.fiberFoods?.prunes)).map(m => m.date));
  const repeated = new Map();
  meals.forEach(m => { const key = (m.description || '').trim().toLowerCase(); if (key) repeated.set(key, (repeated.get(key) || 0) + 1); });
  const repeatedMeals = [...repeated.entries()].filter(([,n])=>n>1).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const allCheckins = all.filter(e => e.type === 'checkin');
  const lastPeriod = allCheckins.filter(e => e.periodStartedToday === 'yes').sort((a,b)=>(b.dateTime || b.date || '').localeCompare(a.dateTime || a.date || ''))[0]?.date;
  const lastCheckin = checkins.slice().sort((a,b)=>(b.dateTime || '').localeCompare(a.dateTime || ''))[0];
  const fewSipsCount = [...drinks, ...meals].filter(e => e.estimate === 'fewSips' || e.liquidEstimate === 'fewSips').length;
  const knownLiquidOz = [...drinks, ...meals].reduce((sum,e)=>sum + (Number(e.estimatedOz) || Number(e.liquidOz) || 0), 0);
  const bloodValues = poops.map(p => p.blood).filter(Boolean);
  return {
    start, end, dates, entries, poops, symptoms, meals, drinks, checkins, wraps, elapsed,
    totalPoops: poops.length,
    confirmedNoPoopDays: confirmedNoPoopDays.size,
    unconfirmedDays: unconfirmedDays.length,
    type1Days: type1Days.size,
    stoolCounts,
    highestPoopPain: maxNum(poops.map(p=>p.pain)),
    blood: bloodValues.includes('yes') ? 'yes' : (poops.length && bloodValues.length === poops.length ? 'no' : 'not fully recorded'),
    highestBellyPain: maxNum(symptoms.map(s=>s.pain)),
    avgBloat: avgNum(symptoms.map(s=>s.bloating)),
    worstBloat: maxNum(symptoms.map(s=>s.bloating)),
    darkUrineDays: darkUrineDays.size,
    fiberDays: fiberDays.size,
    dairyDays: dairyDays.size,
    whiteCarbDays: whiteCarbDays.size,
    pruneDays: pruneDays.size,
    lastPeriod,
    daysLate: lastCheckin?.daysLate || '',
    maxCramps: maxNum(checkins.map(c=>c.crampsPain)),
    heldPoopDays: new Set(checkins.filter(c=>c.heldPoop === 'yes').map(c=>c.date)).size,
    satAfterMealDays: new Set(checkins.filter(c=>c.satAfterMeal === 'yes').map(c=>c.date)).size,
    repeatedMeals,
    fewSipsCount,
    knownLiquidOz,
    weekly: await getWeekly(start)
  };
}

function updateSummaryRow(container, label, value, newLabel = null) {
  for (const row of container.querySelectorAll('.summary-row')) {
    const span = row.querySelector('span');
    if (span?.textContent.trim() === label) {
      if (newLabel) setText(span, newLabel);
      setText(row.querySelector('strong'), value);
    }
  }
}

function updateInsights(s) {
  if (app.querySelector('.hero h1')?.textContent.trim() !== 'Insights') return;
  const subtitle = app.querySelector('.hero .subtle');
  setText(subtitle, `${formatDate(s.start)} – ${formatDate(s.end)} · tracking period`);
  for (const metric of app.querySelectorAll('.metric')) {
    const label = metric.querySelector('.metric-label')?.textContent.trim();
    if (label === 'Bowel movements') {
      setText(metric.querySelector('.metric-value'), s.totalPoops);
      setText(metric.querySelector('.metric-foot'), `${s.confirmedNoPoopDays} confirmed no-poop day${s.confirmedNoPoopDays===1?'':'s'} · ${s.unconfirmedDays} unconfirmed`);
    }
    if (label === 'Worst bloating') {
      metric.querySelector('.metric-value').innerHTML = s.worstBloat === null ? '—' : `${s.worstBloat}<small>/10</small>`;
      setText(metric.querySelector('.metric-foot'), `Average ${s.avgBloat === null ? '—' : s.avgBloat.toFixed(1)}`);
    }
    if (label === 'Fiber-food days') metric.querySelector('.metric-value').innerHTML = `${s.fiberDays}<small>/7</small>`;
    if (label === 'Dark urine days') setText(metric.querySelector('.metric-value'), s.darkUrineDays);
  }
  app.querySelector('#week-progress-note')?.remove();
  const baseNote = app.querySelector('.note.info');
  if (baseNote && !app.querySelector('#qa-tracking-note')) {
    const note = document.createElement('div');
    note.id = 'qa-tracking-note'; note.className = 'note'; note.style.marginTop = '8px'; note.style.background = 'var(--surface-2)';
    note.textContent = `This summary follows the journal start date (${formatDate(s.start)}), not a Monday–Sunday calendar week. Missing entries are not treated as “no poop.”`;
    baseNote.after(note);
  }
  const bristolSection = [...app.querySelectorAll('.section.card')].find(section => section.querySelector('h2')?.textContent.trim() === 'Bristol types');
  bristolSection?.querySelectorAll('.bar-col').forEach((col, i) => {
    const n = s.stoolCounts[i];
    const bar = col.querySelector('.bar'); if (bar) bar.style.height = `${Math.max(3, n ? 18 + n * 22 : 3)}px`;
  });
  const bloatSection = [...app.querySelectorAll('.section.card')].find(section => section.querySelector('h2')?.textContent.trim() === 'Bloating over time');
  if (bloatSection) {
    const pointsByDay = s.dates.map(date => {
      const values = s.symptoms.filter(x => x.date === date).map(x => x.bloating).filter(v => v !== undefined);
      return values.length ? Math.max(...values.map(Number)) : null;
    });
    const points = pointsByDay.map((v,i)=>v===null?null:`${15+i*(270/6)},${145-v*12}`).filter(Boolean).join(' ');
    const oldChart = bloatSection.querySelector('.line-chart, .empty');
    const holder = document.createElement('div');
    holder.innerHTML = points ? `<svg class="line-chart" viewBox="0 0 300 160" role="img" aria-label="Highest bloating score by tracking day"><line x1="15" y1="145" x2="285" y2="145" stroke="#dfe4e1"/><line x1="15" y1="25" x2="15" y2="145" stroke="#dfe4e1"/><polyline points="${points}" fill="none" stroke="#267c74" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${pointsByDay.map((v,i)=>v===null?'':`<circle cx="${15+i*(270/6)}" cy="${145-v*12}" r="5" fill="#fff" stroke="#267c74" stroke-width="3"/>`).join('')}</svg>` : '<div class="empty">More symptom entries are needed before a trend can be shown.</div>';
    if (oldChart) oldChart.replaceWith(holder.firstElementChild);
    const legend = bloatSection.querySelector('.legend');
    if (legend) legend.innerHTML = s.dates.map((d,i)=>`<span>Day ${i+1}: ${pointsByDay[i] ?? '—'}</span>`).join('');
  }
  const repeatSection = [...app.querySelectorAll('.section.card')].find(section => section.querySelector('h2')?.textContent.trim() === 'Repeated meals');
  if (repeatSection) {
    [...repeatSection.children].filter(c => !c.classList.contains('section-head')).forEach(c => c.remove());
    if (s.repeatedMeals.length) s.repeatedMeals.forEach(([name,count]) => {
      const row = document.createElement('div'); row.className = 'summary-row'; row.innerHTML = `<span>${esc(name)}</span><strong>${count}×</strong>`; repeatSection.append(row);
    });
    else { const empty = document.createElement('div'); empty.className = 'empty'; empty.textContent = 'No repeated meal labels yet.'; repeatSection.append(empty); }
  }
}

function updateTodayLiquid(s) {
  if (app.querySelector('.hero h1')?.textContent.trim() !== 'Today') return;
  const item = [...app.querySelectorAll('.glance-item')].find(x => x.querySelector('.glance-label')?.textContent.trim() === 'Drinks');
  if (!item) return;
  let value = s.knownLiquidOz ? `${Math.round(s.knownLiquidOz)} oz` : '—';
  if (s.fewSipsCount) value = s.knownLiquidOz ? `${Math.round(s.knownLiquidOz)} oz + sips` : `${s.fewSipsCount} “few sips”`;
  setText(item.querySelector('.glance-value'), value);
  setText(item.querySelector('.glance-meta'), s.fewSipsCount ? 'known amounts + qualitative sips' : 'estimated');
}

async function updateDoctorReport(s) {
  const report = sheetRoot.querySelector('#doctor-report');
  if (!report) return;
  const generated = report.querySelector('small');
  if (generated) generated.textContent = `${formatDate(s.start)} – ${formatDate(s.end)} · tracking period · Generated ${new Date().toLocaleDateString()}`;
  updateSummaryRow(report, 'Total poops', s.totalPoops);
  updateSummaryRow(report, 'Days with no logged poop', s.confirmedNoPoopDays, 'Confirmed days with no poop');
  updateSummaryRow(report, 'Days with pebbly Type 1', s.type1Days);
  updateSummaryRow(report, 'Highest poop pain', s.highestPoopPain === null ? '—' : `${s.highestPoopPain}/10`);
  updateSummaryRow(report, 'Blood recorded', s.blood);
  updateSummaryRow(report, 'Highest belly / pelvic pain', s.highestBellyPain === null ? '—' : `${s.highestBellyPain}/10`);
  updateSummaryRow(report, 'Average logged bloating', s.avgBloat === null ? '—' : `${s.avgBloat.toFixed(1)}/10`);
  updateSummaryRow(report, 'Worst logged bloating', s.worstBloat === null ? '—' : `${s.worstBloat}/10`);
  updateSummaryRow(report, 'Dark urine days', s.darkUrineDays);
  updateSummaryRow(report, 'Fiber-food days', `${s.fiberDays}/7`);
  updateSummaryRow(report, 'Dairy/cheese-heavy days', `${s.dairyDays}/7`);
  updateSummaryRow(report, 'White-carb-heavy days', `${s.whiteCarbDays}/7`);
  updateSummaryRow(report, 'Prune days', `${s.pruneDays}/7`);
  updateSummaryRow(report, 'Last logged period start', s.lastPeriod ? formatDate(s.lastPeriod) : '—');
  updateSummaryRow(report, 'Days late by latest check-in', s.daysLate || '—');
  updateSummaryRow(report, 'Highest cramps/pelvic pain', s.maxCramps === null ? '—' : `${s.maxCramps}/10`);
  updateSummaryRow(report, 'Held poop / avoided public bathroom', `${s.heldPoopDays} logged day(s)`);
  updateSummaryRow(report, 'Sat after meal 5–10 min', `${s.satAfterMealDays} logged day(s)`);
  if (!report.querySelector('#qa-unknown-days')) {
    const note = document.createElement('div'); note.id = 'qa-unknown-days'; note.className = 'note'; note.style.marginTop = '10px'; note.style.background = 'var(--surface-2)';
    note.textContent = `${s.unconfirmedDays} elapsed day${s.unconfirmedDays===1?' has':'s have'} neither a poop entry nor an explicit “none” evening summary, so they are not counted as no-poop days.`;
    report.querySelector('.note.info')?.after(note);
  } else {
    setText(report.querySelector('#qa-unknown-days'), `${s.unconfirmedDays} elapsed day${s.unconfirmedDays===1?' has':'s have'} neither a poop entry nor an explicit “none” evening summary, so they are not counted as no-poop days.`);
  }
  const tbody = report.querySelector('table tbody');
  if (tbody) {
    const weekly = s.weekly || {};
    tbody.innerHTML = [1,2,3].map(i => {
      const suggestion = s.repeatedMeals[i-1] || [];
      return `<tr><td>${esc(weekly[`meal${i}`] || suggestion[0] || '—')}</td><td>${esc(weekly[`meal${i}Count`] || suggestion[1] || '—')}</td><td>${esc(weekly[`meal${i}Pebbly`] || 'unsure')}</td><td>${esc(weekly[`meal${i}Bloat`] || 'unsure')}</td></tr>`;
    }).join('');
  }
}

async function updateWeeklyReview(s) {
  if (sheetRoot.querySelector('.sheet-title')?.textContent.trim() !== 'Weekly pattern review') return;
  const subtitle = sheetRoot.querySelector('.sheet-subtitle');
  setText(subtitle, `${formatDate(s.start)} – ${formatDate(s.end)}`);
  const form = sheetRoot.querySelector('form[data-form="weekly"]');
  if (form?.elements.weekStart) form.elements.weekStart.value = s.start;
  updateSummaryRow(sheetRoot, 'Total poops', s.totalPoops);
  updateSummaryRow(sheetRoot, 'Days with no logged poop', s.confirmedNoPoopDays, 'Confirmed days with no poop');
  updateSummaryRow(sheetRoot, 'Days with Type 1', s.type1Days);
  updateSummaryRow(sheetRoot, 'Worst bloating', s.worstBloat === null ? '—' : `${s.worstBloat}/10`);
  const w = s.weekly;
  if (form && w && !form.dataset.qaPrefilled) {
    form.dataset.qaPrefilled = 'true';
    for (const [key, value] of Object.entries(w)) {
      if (key === 'weekStart' || !form.elements[key]) continue;
      form.elements[key].value = value;
    }
  }
}

async function enhanceSummaries() {
  if (summarizing) return;
  summarizing = true;
  try {
    const s = await sourceWeekSummary();
    updateTodayLiquid(s);
    updateInsights(s);
    await updateDoctorReport(s);
    await updateWeeklyReview(s);
  } finally {
    summarizing = false;
  }
}

async function enhance() {
  if (enhancing) return;
  enhancing = true;
  try {
    enhanceCommonForms();
    enhanceEntryMenu();
    await enhanceSummaries();
  } finally {
    enhancing = false;
  }
}

const observer = new MutationObserver(() => queueMicrotask(enhance));
observer.observe(document.body, { childList: true, subtree: true });
enhance();
