import { getAllEntries, getSetting } from './db.js';

const app = document.querySelector('#app');
const sheetRoot = document.querySelector('#sheet-root');
let scheduled = false;

function localDate(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function dateObj(date) { return new Date(`${date}T12:00:00`); }
function addDays(date, days) { const d = dateObj(date); d.setDate(d.getDate() + days); return localDate(d); }
function fmt(date) { return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(dateObj(date)); }
function setTextQuietly(node, value) {
  if (!node) return;
  const next = String(value);
  if (node.childNodes.length === 1 && node.firstChild?.nodeType === Node.TEXT_NODE) {
    if (node.firstChild.nodeValue !== next) node.firstChild.nodeValue = next;
    return;
  }
  if (node.textContent !== next) node.textContent = next;
}

async function summary() {
  const prefs = await getSetting('preferences', {});
  const start = prefs.startDate || localDate();
  const dates = Array.from({ length: 7 }, (_, index) => addDays(start, index));
  const elapsed = dates.filter(date => date <= localDate());
  const entries = (await getAllEntries()).filter(entry => dates.includes(entry.date));
  const poopDays = new Set(entries.filter(entry => entry.type === 'poop').map(entry => entry.date));
  const confirmed = new Set(entries.filter(entry => entry.type === 'wrap' && entry.poopSummary === 'none' && !poopDays.has(entry.date)).map(entry => entry.date));
  const unconfirmed = elapsed.filter(date => !poopDays.has(date) && !confirmed.has(date));
  return { start, confirmed: confirmed.size, unconfirmed: unconfirmed.length };
}

function updateRow(container, labels, value, replacementLabel) {
  for (const row of container.querySelectorAll('.summary-row')) {
    const label = row.querySelector('span');
    if (!labels.includes(label?.textContent.trim())) continue;
    if (replacementLabel) setTextQuietly(label, replacementLabel);
    setTextQuietly(row.querySelector('strong'), value);
  }
}

async function apply() {
  scheduled = false;
  const result = await summary();
  if (app.querySelector('.hero h1')?.textContent.trim() === 'Insights') {
    for (const metric of app.querySelectorAll('.metric')) {
      if (metric.querySelector('.metric-label')?.textContent.trim() === 'Bowel movements') {
        setTextQuietly(metric.querySelector('.metric-foot'), `${result.confirmed} confirmed no-poop · ${result.unconfirmed} unconfirmed`);
      }
    }
    const legacyWeekNote = app.querySelector('#week-progress-note');
    if (legacyWeekNote) legacyWeekNote.hidden = true;
    const trackingNote = app.querySelector('#qa-tracking-note');
    if (trackingNote) {
      trackingNote.hidden = false;
      setTextQuietly(trackingNote, `Uses the journal start date (${fmt(result.start)}), not Monday–Sunday. Missing entries are not treated as “no poop.”`);
    }
  }
  const report = sheetRoot.querySelector('#doctor-report');
  if (report) updateRow(report, ['Days with no logged poop', 'Confirmed days with no poop'], result.confirmed, 'Confirmed days with no poop');
  if (sheetRoot.querySelector('.sheet-title')?.textContent.trim() === 'Weekly pattern review') {
    updateRow(sheetRoot, ['Days with no logged poop', 'Confirmed days with no poop'], result.confirmed, 'Confirmed days with no poop');
  }
}

function schedule() {
  if (scheduled) return;
  scheduled = true;
  queueMicrotask(() => apply().catch(error => { scheduled = false; console.error(error); }));
}

const observer = new MutationObserver(schedule);
observer.observe(document.body, { childList: true, subtree: true });
document.addEventListener('click', event => {
  if (event.target.closest('[data-tab="insights"], [data-action="doctor-report"], [data-action="weekly-review"], [data-sheet-action="weekly-review"]')) {
    setTimeout(schedule, 140);
  }
}, true);
schedule();
