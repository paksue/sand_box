# SnowPro Core COF-C03 — Exam #2 independent reviewer handoff

This is a **new, separate 100-question form** for the SnowPro Core COF-C03 study app. It is unofficial practice material, not exam-recall content. **A separate AI agent/session has not yet audited it**, so its scoring should not be treated as certification-readiness evidence until that review is completed.

## Reviewer assignment (paste into a separate ChatGPT session)

> You are an independent Snowflake COF-C03 exam-content auditor. I have attached `snowpro-exam2-bank.json`, a 100-question unofficial practice exam with the author's proposed `answer`, `reason`, per-option `feedback`, `clue`, `learn`, and `docs`. **Do not accept the author's answer key as evidence.** For every question, independently validate the scenario, all four answer choices, the exact number of correct choices, the proposed key, per-option explanations, and cited documentation using current official Snowflake documentation. Check nuanced assumptions and edition restrictions, current billing, default parameters, syntax and feature limitations. Flag questions with more than one defensible key, ambiguous phrasing, incorrect facts, outdated features, broken sources, or superficial distractors. Also compare with Exam #1 if supplied, to detect substantive recycled question patterns. Return a table with question ID, verdict (pass / needs correction), exact issue, verified correct choice(s), link to decisive official docs, and a suggested edit. Give a final count of approved/flagged questions. Do not silently change an answer key.

## Content contract

- Exam #2 IDs `B001` through `B100`, kept separate from the Exam #1 IDs `Q001` through `Q100`.
- Target domains: 31 architecture, 20 governance, 18 loading/connectivity, 21 performance/query/transform, 10 collaboration.
- 85 single-select and 15 exact-match select-two questions; 4 options each.
- Each question has full explanations for every answer, a deciding clue, additional learning topics, and Snowflake docs links.
- No user's saved results or personally identifiable data is part of this audit package.

## Automated checks already performed by the author

- Schema/unique ID/domain distribution checked; options and answer keys nonempty and unique.
- TF-IDF stem/topic similarity compared with original Exam #1: highest cosine similarity approximately 0.33; this catches close wording but **does not establish substantive originality or technical correctness**.
- Chromium browser smoke tests: preserve the imported 91/100 Exam #1 result, start Exam #2 with 100 distinct B-IDs, autosave a timed selection, restore it, persist notes, hide explanations before submission, show explanations after Learning Mode submission, display independent audit export after completion, and avoid mobile overflow.
- Official Snowflake docs spot-checked for nuanced subjects, including managed access schemas, cross-database sharing `REFERENCE_USAGE`, `COPY INTO` transform restrictions, `ALTER PIPE REFRESH` seven-day scope, materialized view join restrictions, row policy owner rights, and the modern `AI_CLASSIFY` naming.

## Limitations

- The **full independent content audit remains pending**; do not describe this package as independently audited.
- The app is unofficial. The numerical percentage from its custom bank is not comparable to Snowflake's proprietary scaled certification score.
- Avoid memorizing this bank instead of practicing the underlying concepts; use a fresh timed form once the independent review is complete.