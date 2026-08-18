import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const required = [
  'index.html','styles.css','print.css','app.js','patch.js','db.js','sw.js',
  'manifest.webmanifest','assets/icon.svg','docs/PDF_COVERAGE.md','docs/PRD.md','AGENTS.md'
];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Missing required file: ${file}`);
}

const coverage = fs.readFileSync(path.join(root, 'docs/PDF_COVERAGE.md'), 'utf8');
if (coverage.includes('❌') || coverage.includes('⬜')) throw new Error('PDF coverage contract contains incomplete rows.');
for (const sourceField of ['| Name |', '| Start date |', '| Appetite normal/low |', '| Last period start |']) {
  if (!coverage.includes(sourceField)) throw new Error(`Coverage contract missing source field: ${sourceField}`);
}

const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const patch = fs.readFileSync(path.join(root, 'patch.js'), 'utf8');
const implementation = `${app}\n${patch}`;
for (const token of [
  'periodStartedToday','daysLate','spotting','crampsPain','heldPoop','satAfterMeal',
  'feetSupported','urineColor','appetite','waterRating','fiberRating','prunesSummary',
  'worseAfterMeals','betterAfterPoopGas','startDate','Journal profile'
]) {
  if (!implementation.includes(token)) throw new Error(`Required source field missing from implementation: ${token}`);
}

for (const forbidden of ['XMLHttpRequest', 'navigator.sendBeacon']) {
  if (implementation.includes(forbidden)) throw new Error(`Unexpected network-capable code in journal modules: ${forbidden}`);
}

const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const asset of ['styles.css','print.css','app.js','patch.js','manifest.webmanifest']) {
  if (!index.includes(asset)) throw new Error(`index.html does not reference required asset: ${asset}`);
}

const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
for (const asset of ['styles.css','print.css','app.js','patch.js','db.js']) {
  if (!sw.includes(asset)) throw new Error(`Offline cache missing asset: ${asset}`);
}

console.log('Glow validation passed: source coverage, required local files, offline assets, and core fields are present.');
