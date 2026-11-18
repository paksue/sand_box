# Independent Exam #3 correctness audit — separate reviewer handoff

You are a **new, independent reviewer** of the attached `exam3-bank.json` and `index.html`. This is a **66-question** unofficial SnowPro Core COF-C03 gap-focused challenge, with C001–C045 from an earlier coverage-gap bank and new C046–C066 created for missed Exam #1 and Exam #2 concepts.

For **every** question C001–C066:

1. Read the complete scenario and all four choices. Decide the correct answer(s) **without first trusting** the embedded answer field.
2. Check there is exactly one or exactly two defensibly correct choices as indicated. Validate all 19 select-two keys under exact-match scoring.
3. Verify the reason, four individual feedback strings, clue, all learning bullets, worked example, and exam trap. Flag any ambiguous edge cases or incorrect SQL syntax.
4. Open current official documentation at `docs.snowflake.com`, not merely the submitted docs URL, and cite the exact decisive passage and URL.
5. Check edition and region limits, current defaults, Snowflake service availability, security privileges, latest data-sharing behavior and cost controls.
6. Flag unsupported, overly easy, duplicated, ambiguous, outdated or out-of-blueprint questions. Categorize blocker/high/medium/low and propose exact edited wording/answers.
7. Especially verify **C062**, whose topic is unload validation: COPY INTO <location> supports `VALIDATION_MODE=RETURN_ROWS`, whereas load-validation syntax offers RETURN_ERRORS / RETURN_ALL_ERRORS. Also inspect C046 Iceberg external-volume nuance, C058 join-policy attachment and C061 CSV null formatting.

Output a per-question report with independently validated key, pass/fail, official citation, confidence, and exact corrections. Give a do-not-score list until issues are repaired.

## Coverage and provenance

- The 21 additions have `sourceId` matching the 9 wrong Exam #1 IDs and 12 wrong Exam #2 IDs. They are *new scenarios*, not repeats from those old banks.
- New IDs: C046–C066; old C001–C045 text and IDs remain unchanged.
- Domain counts 24/16/12/8/6; deliberately **not** a full COF-C03 blueprint-weighted mock (31/20/18/21/10).
- Questions C001–C066 have 19 select-two items total. Every item has 4 options.
- Do not describe the answer keys as independently audited until this review has actually been completed.
