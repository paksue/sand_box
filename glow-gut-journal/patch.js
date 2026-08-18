import { getAllEntries, getDay, getSetting, putDay, setSetting } from './db.js';

const app = document.querySelector('#app');
const sheetRoot = document.querySelector('#sheet-root');
let enhancing = false;

function localDate(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function dateObj(date) { return new Date(`${date}T12:00:00`); }
function addDays(date, days) { const d = dateObj(date); d.setDate(d.getDate() + days); return localDate(d); }
function formatDate(date, opts = { month: 'short', day: 'numeric' }) { return new Intl.DateTimeFormat(undefined, opts).format(dateObj(date)); }
function esc(value = '') { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function setText(node, value) { const next = String(value); if (node && node.textContent !== next) node.textContent = next; }

async function preferences() {
  const prefs = await getSetting('preferences', {});
  if (!prefs.startDate) {
    prefs.startDate = localDate();
    await setSetting('preferences', prefs);
  }
  return prefs;
}

function mondayOf(date) {
  const d = dateObj(date);
  const weekday = d.getDay();
  d.setDate(d.getDate() + (weekday === 0 ? -6 : 1 - weekday));
  return localDate(d);
}

function elapsedCalendarWeekDates(date = localDate()) {
  const start = mondayOf(date);
  const dates = [];
  let d = start;
  while (d <= date && dates.length < 7) {
    dates.push(d);
    d = addDays(d, 1);
  }
  return dates;
}

function exactBristol() {
  return {
    1: ['Separate hard lumps (hard to pass)', 'Constipation / very hard'],
    2: ['Lumpy, hard, sausage-shaped', 'Constipation / hard'],
    3: ['Sausage-shaped with cracks on the surface', 'OK / improving'],
    4: ['Sausage-shaped or snake-like; smooth and soft', 'Ideal normal'],
    5: ['Soft blobs with clear-cut edges (easy to pass)', 'Softer than normal'],
    6: ['Fluffy pieces with ragged edges; mushy', 'Loose'],
    7: ['Entirely liquid, watery, no solid pieces', 'Diarrhea / watery']
  };
}

async function enhanceWelcome() {
  const startButton = app.querySelector('[data-action="finish-onboarding"]');
  if (!startButton || document.querySelector('#source-profile-onboarding')) return;
  const prefs = await preferences();
  const card = document.createElement('div');
  card.id = 'source-profile-onboarding';
  card.className = 'card';
  card.innerHTML = `<div class="input-row">
    <div class="field"><label for="source-name">Name <span class="subtle">(optional)</span></label><input id="source-name" class="input" value="${esc(prefs.name || '')}" placeholder="Name"></div>
    <div class="field"><label for="source-start">Tracking start date</label><input id="source-start" class="input" type="date" value="${esc(prefs.startDate || localDate())}"></div>
  </div>`;
  startButton.before(card);
  const save = async () => {
    const latest = await preferences();
    latest.name = card.querySelector('#source-name').value.trim();
    latest.startDate = card.querySelector('#source-start').value || localDate();
    await setSetting('preferences', latest);
  };
  card.querySelectorAll('input').forEach(input => input.addEventListener('change', save));
}

async function enhanceMore() {
  const heading = app.querySelector('.hero h1');
  if (heading?.textContent.trim() !== 'More') return;
  const list = app.querySelector('.list-menu');
  if (list && !list.querySelector('[data-patch-action="profile"]')) {
    const prefs = await preferences();
    const row = document.createElement('button');
    row.className = 'menu-row';
    row.dataset.patchAction = 'profile';
    row.innerHTML = `<div><strong>Journal profile</strong><small>${prefs.name ? esc(prefs.name) + ' · ' : ''}started ${formatDate(prefs.startDate || localDate())}</small></div><span>›</span>`;
    list.prepend(row);
  }

  for (const row of app.querySelectorAll('.switch-row')) {
    if (row.querySelector('strong')?.textContent.trim() === 'Wording') row.remove();
  }

  for (const row of app.querySelectorAll('.menu-row')) {
    if (row.querySelector('strong')?.textContent.trim() === 'Today details') {
      delete row.dataset.action;
      row.dataset.patchAction = 'today-details';
    }
  }
}

function enhanceToday() {
  const heading = app.querySelector('.hero h1');
  if (heading?.textContent.trim() !== 'Today' || document.querySelector('#patch-daily-checkin')) return;
  const evening = app.querySelector('.card.checkin');
  if (!evening) return;
  const section = document.createElement('section');
  section.id = 'patch-daily-checkin';
  section.className = 'section card';
  section.innerHTML = `<div class="checkin-row"><div class="checkin-badge" style="background:var(--teal-wash);color:var(--teal)">♡</div><div style="flex:1"><h3>Daily check-in</h3><div class="subtle" style="font-size:13px;margin-top:3px">Period, bathroom habits, activity, stress, urine and appetite.</div></div><button class="secondary" data-log="checkin">Check in</button></div>`;
  evening.before(section);
}

function enhanceBristolGuide() {
  const title = sheetRoot.querySelector('.sheet-title');
  if (title?.textContent.trim() !== 'Bristol stool guide') return;
  const exact = exactBristol();
  sheetRoot.querySelectorAll('.bristol').forEach(row => {
    const type = Number(row.querySelector('.bristol-num')?.textContent.match(/\d+/)?.[0]);
    if (!exact[type]) return;
    setText(row.querySelector('strong'), exact[type][0]);
    setText(row.querySelector('small'), exact[type][1]);
  });
}

async function weeklyCorrections() {
  const all = await getAllEntries();
  const elapsed = elapsedCalendarWeekDates();
  const poops = all.filter(e => e.type === 'poop' && elapsed.includes(e.date));
  const poopDays = new Set(poops.map(e => e.date));
  const noLoggedPoop = Math.max(0, elapsed.length - poopDays.size);

  const insightsHeading = app.querySelector('.hero h1');
  if (insightsHeading?.textContent.trim() === 'Insights') {
    for (const metric of app.querySelectorAll('.metric')) {
      if (metric.querySelector('.metric-label')?.textContent.trim() === 'Bowel movements') {
        setText(metric.querySelector('.metric-foot'), `${noLoggedPoop} elapsed day${noLoggedPoop === 1 ? '' : 's'} with no logged poop`);
      }
    }
    const note = app.querySelector('.note.info');
    if (note && !app.querySelector('#week-progress-note') && elapsed.length < 7) {
      const progress = document.createElement('div');
      progress.id = 'week-progress-note';
      progress.className = 'note';
      progress.style.marginTop = '8px';
      progress.style.background = 'var(--surface-2)';
      progress.textContent = `This week is in progress. “No logged poop” counts only the ${elapsed.length} elapsed day${elapsed.length === 1 ? '' : 's'}.`;
      note.after(progress);
    }
  }

  const report = sheetRoot.querySelector('#doctor-report');
  if (report) {
    for (const row of report.querySelectorAll('.summary-row')) {
      const label = row.querySelector('span')?.textContent.trim();
      if (label === 'Days with no logged poop') setText(row.querySelector('strong'), noLoggedPoop);
      if (label === 'Blood recorded' && poops.length === 0) setText(row.querySelector('strong'), '—');
    }
    if (elapsed.length < 7 && !report.querySelector('#report-week-progress')) {
      const note = document.createElement('div');
      note.id = 'report-week-progress';
      note.className = 'note';
      note.style.marginTop = '10px';
      note.style.background = 'var(--surface-2)';
      note.textContent = `Week in progress: “days with no logged poop” includes only elapsed days (${elapsed.length}/7).`;
      report.querySelector('.note.info')?.after(note);
    }

    const latestPeriod = all
      .filter(e => e.type === 'checkin' && e.periodStartedToday === 'yes')
      .sort((a,b) => (b.dateTime || b.date || '').localeCompare(a.dateTime || a.date || ''))[0];
    if (latestPeriod) {
      for (const row of report.querySelectorAll('.summary-row')) {
        if (row.querySelector('span')?.textContent.trim() === 'Last logged period start') {
          setText(row.querySelector('strong'), formatDate(latestPeriod.date));
        }
      }
    }
  }

  const weeklyTitle = sheetRoot.querySelector('.sheet-title');
  if (weeklyTitle?.textContent.trim() === 'Weekly pattern review') {
    for (const row of sheetRoot.querySelectorAll('.summary-row')) {
      if (row.querySelector('span')?.textContent.trim() === 'Days with no logged poop') setText(row.querySelector('strong'), noLoggedPoop);
    }
  }
}

async function enhanceDoctorProfile() {
  const report = sheetRoot.querySelector('#doctor-report');
  if (!report || report.querySelector('#doctor-profile')) return;
  const prefs = await preferences();
  if (!prefs.name && !prefs.startDate) return;
  const profile = document.createElement('div');
  profile.id = 'doctor-profile';
  profile.className = 'summary-list';
  profile.style.marginTop = '12px';
  profile.innerHTML = `${prefs.name ? `<div class="summary-row"><span>Name</span><strong>${esc(prefs.name)}</strong></div>` : ''}<div class="summary-row"><span>Tracking start date</span><strong>${formatDate(prefs.startDate || localDate(), {year:'numeric',month:'short',day:'numeric'})}</strong></div>`;
  const generated = report.querySelector('small');
  generated?.after(profile);
}

function patchModal(title, subtitle, body) {
  sheetRoot.innerHTML = `<div class="sheet-backdrop" id="patch-backdrop"><section class="sheet" role="dialog" aria-modal="true"><div class="grabber"></div><div class="sheet-head"><div><h2 class="sheet-title">${title}</h2>${subtitle ? `<p class="sheet-subtitle">${subtitle}</p>` : ''}</div><button class="icon-btn" data-patch-action="close-sheet" aria-label="Close">×</button></div>${body}</section></div>`;
  const backdrop = sheetRoot.querySelector('#patch-backdrop');
  backdrop.addEventListener('click', e => { if (e.target === backdrop) closePatchModal(); });
}
function closePatchModal() { sheetRoot.innerHTML = ''; }

async function showProfile() {
  const prefs = await preferences();
  patchModal('Journal profile', 'These fields come from the journal cover page.', `<form id="profile-form" class="form">
    <div class="field"><label>Name</label><input class="input" name="name" value="${esc(prefs.name || '')}" placeholder="optional"></div>
    <div class="field"><label>Tracking start date</label><input class="input" type="date" name="startDate" value="${esc(prefs.startDate || localDate())}"></div>
    <div class="note info">The profile is stored only in this browser with the rest of the journal.</div>
    <div class="sticky-actions"><button class="primary" type="submit">Save profile</button></div>
  </form>`);
  sheetRoot.querySelector('#profile-form').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const latest = await preferences();
    latest.name = String(fd.get('name') || '').trim();
    latest.startDate = String(fd.get('startDate') || '') || localDate();
    await setSetting('preferences', latest);
    closePatchModal();
    app.querySelector('[data-tab="more"]')?.click();
  });
}

async function showTodayDetails() {
  const date = localDate();
  const day = (await getDay(date)) || {};
  const options = ['home','camp','outing','travel'].map(v => `<option ${day.dayType === v ? 'selected' : ''}>${v}</option>`).join('');
  patchModal('Today details', formatDate(date, {weekday:'long',month:'long',day:'numeric'}), `<form id="today-details-form" class="form">
    <div class="field"><label>Day type</label><select name="dayType">${options}</select></div>
    <div class="input-row"><div class="field"><label>Wake</label><input class="input" type="time" name="wakeTime" value="${esc(day.wakeTime || '')}"></div><div class="field"><label>Bed</label><input class="input" type="time" name="bedTime" value="${esc(day.bedTime || '')}"></div></div>
    <div class="sticky-actions"><button class="primary" type="submit">Save today details</button></div>
  </form>`);
  sheetRoot.querySelector('#today-details-form').addEventListener('submit', async e => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await putDay({date, dayType:fd.get('dayType'), wakeTime:fd.get('wakeTime'), bedTime:fd.get('bedTime')});
    closePatchModal();
    app.querySelector('[data-tab="more"]')?.click();
  });
}

async function enhance() {
  if (enhancing) return;
  enhancing = true;
  try {
    await enhanceWelcome();
    await enhanceMore();
    enhanceToday();
    enhanceBristolGuide();
    await enhanceDoctorProfile();
    await weeklyCorrections();
  } finally {
    enhancing = false;
  }
}

document.addEventListener('click', async e => {
  const target = e.target.closest('[data-patch-action]');
  if (!target) return;
  const action = target.dataset.patchAction;
  e.preventDefault();
  e.stopPropagation();
  if (action === 'profile') await showProfile();
  if (action === 'today-details') await showTodayDetails();
  if (action === 'close-sheet') closePatchModal();
}, true);

const observer = new MutationObserver(() => queueMicrotask(enhance));
observer.observe(document.body, { childList:true, subtree:true });
enhance();
