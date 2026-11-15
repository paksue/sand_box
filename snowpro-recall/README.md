# SnowPro Recall — 405-card COF-C03 & historical study library

Live app: https://paksue.github.io/sand_box/snowpro-recall/

## Current release (November 2026)
- **405 original flashcards**: 371 current COF-C03, 34 optional historical COF-C01/COF-C02.
- All **19 published COF-C03 objective identifiers** (July 8, 2026 guide) represented by dedicated questions. This is objective representation, not a claim to know every live exam question.
- Five exam domains: 86 Architecture, 74 Governance, 95 Loading, 96 Performance/SQL, 54 Collaboration (historical included).
- Coverage map, historical filter, linked question-source directory, official Snowflake docs and original SQL/scenario explanations.
- 2/5/10-minute reviews, Exam Sprint, typed SQL, ratings, notes, bookmarks, FSRS-style scheduling and offline PWA shell.
- Existing sp001–sp162 identifiers and localStorage key are unchanged. Progress remains compatible.
- Historical cards are excluded from normal current-exam daily reviews unless explicitly selected.

## Important
Snowflake does not release its complete exam-question pool. The app does **not** contain every real historical/current exam question, or unauthorized exam dumps. Older questions may be outdated. Use the official current certification outline to prioritize.

Your original 100-question practice exam is available separately:
https://paksue.github.io/sand_box/snowpro-cof-c03-exam-lab/

## Editing / building
`cards.json` is the source of truth for all card text. **Do not regenerate it from an older 162-card script.**
`app.js`, `style.css` and `template.html` are the front-end sources. Run `python build.py` to rebuild the standalone `index.html` with `cards.json`.
`make_cards.py` validates the JSON data only.
The full source bundle including original expanded card authorship script is provided with the release ZIP.

## Saving
All ratings and notes are saved to localStorage on this exact website origin, after each interaction; they are not synchronized across devices. Export JSON from Settings regularly.

## References
- Snowflake official COF-C03 July 2026 Exam Study Guide: https://learn.snowflake.com/en/certifications/snowpro-core-c03/
- Official SnowPro Practice Exams: https://learn.snowflake.com/en/certifications/snowpro-practice-exams/
- Snowflake core preparation: https://learn.snowflake.com/en/courses/OD-COREPREP/
- Snowflake docs for each card.

Independent educational study app, not affiliated with Snowflake.
