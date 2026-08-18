# Glow — Private Gut Journal

Mobile-first, local-first PWA that turns the 7-day paper Glow Up Gut Journal into fast event logging and an automatic doctor-friendly weekly summary.

## Run locally

Serve this directory with any static server, for example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy

This directory is designed to run directly from GitHub Pages at:

`https://paksue.github.io/sand_box/glow-gut-journal/`

No build step or server is required.

## Privacy model

- No account.
- No automatic network upload of journal data.
- Journal data and optional meal/drink photos are stored in browser IndexedDB.
- The user explicitly chooses when to export JSON/CSV or print/save a doctor report.
- Clearing site data removes local records.

## Core flows

- Journal profile: name + tracking start date
- Meal + optional photo, food tags, prunes/kiwi/pear, attached drink estimate/custom amount
- Drink amount, short note, and optional photo
- Bristol Type 1–7 stool logging
- Stool amount, pain and blood
- Bloating, belly/pelvic pain, gas and hard/swollen abdomen
- Period + daily habit check-in
- Day type, wake time, bed time
- Evening wrap-up
- Safety symptom notes
- History
- Weekly pattern summary
- Repeated-meal review
- Doctor report
- JSON backup/restore and CSV export

## Validation

```bash
node --check app.js
node --check patch.js
node --check coverage.js
node --check db.js
node --check sw.js
node tests/validate.mjs
```

The repository workflow runs the same checks automatically for Glow changes.

See `docs/PDF_COVERAGE.md` for the source-journal requirement matrix.
