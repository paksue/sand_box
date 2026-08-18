# Glow agent rules

## Mission
Preserve every data point in the source Glow Up Gut Journal while making logging dramatically faster and more dignified for a teenager.

## Non-negotiables
1. Treat `docs/PDF_COVERAGE.md` as the source-coverage contract. Do not remove a covered field without explicitly updating the contract and explaining why.
2. Local-first by default. Do not add analytics, remote logging, cloud sync, trackers, or external APIs without explicit approval.
3. Do not diagnose, infer causation, score foods, count calories, add weight-loss features, or shame missed logs.
4. Keep the common paths short: meal, drink, poop, and symptom logging should remain usable one-handed on a phone.
5. Use progressive disclosure for optional or sensitive fields.
6. Objective calculations and subjective user judgments must remain distinct.
7. Doctor-facing summaries use neutral wording and identify calculated values as summaries of user-entered data.
8. Preserve backup compatibility. Schema changes require an IndexedDB version migration and backup schema migration plan.
9. Minimum interactive target: 44px. Do not rely on color alone.
10. Before calling a change complete, run syntax checks for `app.js`, `patch.js`, `coverage.js`, `db.js`, and `sw.js`, then run `node tests/validate.mjs`.

## Architecture
- `index.html`: static entry point
- `styles.css`: design system and layouts
- `app.js`: primary UI, flows, calculations, reporting
- `patch.js`: source-profile, exact Bristol wording, partial-week/report safeguards
- `coverage.js`: source-paper drink photo/note and custom meal-liquid capture
- `db.js`: IndexedDB storage and backup/restore
- `sw.js`: offline shell cache
- `docs/`: product and coverage contracts

## Product principle
Capture → retain → retrieve → summarize → analyze. Do not build speculative analytics ahead of reliable capture.
