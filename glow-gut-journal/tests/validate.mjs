import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const required = [
  'index.html','styles.css','qa-fixes.css','polish.css','print.css','app.js','patch.js','qa-fixes.js','qa-data-integrity.js','coverage.js','qa-summary-stable.js','polish.js','db.js','sw.js',
  'manifest.webmanifest','assets/icon.svg','docs/PDF_COVERAGE.md','docs/PRD.md','AGENTS.md','playwright.config.mjs','tests/playtest.spec.mjs','tests/round2.spec.mjs','tests/live-smoke.mjs'
];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing required file: ${file}`);
}

const coverage = fs.readFileSync(path.join(root, 'docs/PDF_COVERAGE.md'), 'utf8');
if (coverage.includes('❌') || coverage.includes('⬜')) throw new Error('PDF coverage contract contains incomplete rows.');
for (const sourceField of ['| Name |', '| Start date |', '| Appetite normal/low |', '| Last period start |', '| Meal/drink photo |']) {
  if (!coverage.includes(sourceField)) throw new Error(`Coverage contract missing source field: ${sourceField}`);
}

const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const patch = fs.readFileSync(path.join(root, 'patch.js'), 'utf8');
const qaFixes = fs.readFileSync(path.join(root, 'qa-fixes.js'), 'utf8');
const qaIntegrity = fs.readFileSync(path.join(root, 'qa-data-integrity.js'), 'utf8');
const qaSummary = fs.readFileSync(path.join(root, 'qa-summary-stable.js'), 'utf8');
const polish = fs.readFileSync(path.join(root, 'polish.js'), 'utf8');
const sourceExtras = fs.readFileSync(path.join(root, 'coverage.js'), 'utf8');
const implementation = `${app}\n${patch}\n${qaFixes}\n${qaIntegrity}\n${qaSummary}\n${polish}\n${sourceExtras}`;
for (const token of [
  'periodStartedToday','daysLate','spotting','crampsPain','heldPoop','satAfterMeal',
  'feetSupported','urineColor','appetite','waterRating','fiberRating','prunesSummary',
  'worseAfterMeals','betterAfterPoopGas','startDate','Journal profile','drinkPhoto','mealCustomOz'
]) {
  if (!implementation.includes(token)) throw new Error(`Required source field missing from implementation: ${token}`);
}

for (const qaToken of ['confirmedNoPoopDays','unconfirmedDays','inferMealType','showEditor','Not checked','fewSips','stopImmediatePropagation','tracking period']) {
  if (!qaFixes.includes(qaToken)) throw new Error(`Playtest fix missing contract token: ${qaToken}`);
}
for (const integrityToken of ['data-form="wrap"','Not checked','repairTimelineText','worstBloat']) {
  if (!qaIntegrity.includes(integrityToken)) throw new Error(`Data-integrity fix missing contract token: ${integrityToken}`);
}
for (const summaryToken of ['confirmedNoPoopDays','Missing entries are not treated as','Best stool type (user review)','qa-summary-stable']) {
  const haystack = `${qaSummary}\n${indexSafe(root)}`;
  if (!haystack.includes(summaryToken)) throw new Error(`Stable summary fix missing contract token: ${summaryToken}`);
}
for (const polishToken of ['Choose what to share','data-polish-undo','Discard the changes you made?','aria-labelledby','Remove photo','reportPrefs']) {
  if (!polish.includes(polishToken)) throw new Error(`Round-two polish missing contract token: ${polishToken}`);
}

for (const forbidden of ['XMLHttpRequest', 'navigator.sendBeacon']) {
  if (implementation.includes(forbidden)) throw new Error(`Unexpected network-capable code in journal modules: ${forbidden}`);
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const asset of ['styles.css','qa-fixes.css','polish.css','print.css','app.js','patch.js','qa-fixes.js','qa-data-integrity.js','coverage.js','qa-summary-stable.js','polish.js','manifest.webmanifest']) {
  if (!index.includes(asset)) throw new Error(`index.html does not reference required asset: ${asset}`);
}
if (!index.includes('name="glow-build" content="round2"')) throw new Error('Round-two build marker missing from index.html');

const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
for (const asset of ['styles.css','qa-fixes.css','polish.css','print.css','app.js','patch.js','qa-fixes.js','qa-data-integrity.js','coverage.js','qa-summary-stable.js','polish.js','db.js']) {
  if (!sw.includes(asset)) throw new Error(`Offline cache missing asset: ${asset}`);
}

const playtest = fs.readFileSync(path.join(root, 'tests/playtest.spec.mjs'), 'utf8');
for (const assertion of ['estimatedOz','Entry options','tracking period','confirmed no-poop','worstBloat']) {
  if (!playtest.includes(assertion)) throw new Error(`Browser playtest missing scenario: ${assertion}`);
}
const round2 = fs.readFileSync(path.join(root, 'tests/round2.spec.mjs'), 'utf8');
for (const assertion of ['data-polish-undo','periodStartedToday','glow-backup.json','data-report-toggle="period"','serviceWorker.controller','doctor-report-mobile']) {
  if (!round2.includes(assertion)) throw new Error(`Round-two browser playtest missing scenario: ${assertion}`);
}
const liveSmoke = fs.readFileSync(path.join(root, 'tests/live-smoke.mjs'), 'utf8');
if (!liveSmoke.includes('https://paksue.github.io/sand_box/glow-gut-journal/')) throw new Error('Live Pages smoke target is missing');

console.log('Glow validation passed: source coverage, playtest fixes, round-two privacy/accessibility, browser scenarios, offline assets, and live smoke are present.');

function indexSafe(rootDir) {
  const p = path.join(rootDir, 'index.html');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}
