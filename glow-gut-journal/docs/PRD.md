# Glow Gut Journal — V1 PRD

## Mission
Make a teen's gut/symptom journal quick enough to use daily while preserving the full information content of the paper journal and producing a clinician-readable weekly review.

## Primary user
Teenager using a phone. The experience must be private, fast, neutral, non-clinical in everyday use, and nonjudgmental.

## V1 scope
- Local-only storage with IndexedDB
- PWA shell/offline caching
- Event-based meal, drink, poop and symptom logging
- Daily metadata, cycle/habits and bedtime wrap-up
- Bristol stool guide
- History by day
- Seven-day objective summary
- Subjective weekly pattern review
- Doctor report with the source paper's pediatrician questions
- JSON backup/restore and CSV export

## Out of scope
- Diagnosis
- Treatment or dosing recommendations
- Calorie or weight tracking
- Cloud accounts/sync
- Parent surveillance
- Automated causal claims
- Social features

## Success criteria
1. Every source-paper field is represented in `PDF_COVERAGE.md`.
2. A common event can be saved without navigating a long daily form.
3. Reloading the app retains data.
4. Weekly report derives objective counts from logs but asks the user for subjective relationships.
5. No journal data is uploaded automatically.
6. The app remains usable at a 393px iPhone viewport with 44px touch targets.
