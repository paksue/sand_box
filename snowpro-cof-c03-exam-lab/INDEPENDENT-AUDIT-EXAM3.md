# Independent Exam #3 correctness audit — instructions for a separate AI agent/session

You are a **different, independent reviewer** of the attached `exam3-bank.json`, authored by another AI assistant. Do not assume the proposed answers, reasoning, or documentation links are correct. The exam is an unofficial 45-question SnowPro Core COF-C03 gap-focused challenge.

For **every** question C001–C045:

1. Read the full scenario and all four answer choices. Independently determine the correct option(s) before looking at the proposed `answer` field, and record the result.
2. Confirm the proposed key and whether any alternative is arguably correct, especially SELECT TWO questions. Check the exactly-two answer count.
3. Verify every technical assertion in the explanation, each option rationale, at least three learning bullets, practical example, and exam trap.
4. Open official current docs at `docs.snowflake.com`. Cite the exact documentation page and relevant supporting passage. Do not use the submitted doc links as automatic proof.
5. Check for time- or region-dependent features (warehouse generations and prices, Trust Center notifications, Streamlit runtimes, Native App releases).
6. Flag outdated, ambiguous, overly easy, repeated, outside-blueprint, or technically unverifiable questions. Categorize as blocker/high/medium/low.
7. Propose exact revised question text, option(s), answer key, and explanations for every issue.

**Output:** A JSON report keyed by question ID with validated key, pass/fail, official reference URL, confidence and specific edits. Include an overall assessment and a list of questions that should not be scored until repaired.

Exam #3 targets official guide objectives 1.2, 1.3, 1.4, 1.6, 2.1, 2.2, 2.3, 3.1, 3.3, 4.1, 4.3, 5.3. Its distribution is intentionally not the full exam blueprint. Do not penalize uneven blueprint coverage as an error in this targeted form.