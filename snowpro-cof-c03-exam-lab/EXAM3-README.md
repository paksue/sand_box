# SnowPro Core COF-C03 Exam Lab — Exam #3 Knowledge Gap Challenge

This package contains an expanded standalone HTML exam app (`index.html`) with all three mock exam banks and 245 questions total, plus the standalone Exam #3 bank JSON.

## Exam #3

- 45 original, gap-focused questions. Distribution by official guide domain: Architecture 19; Governance 10; Loading and Connectivity 9; Performance 4; Collaboration 3.
- 7 select-two questions with all-or-nothing scoring.
- A 52-minute timed mode and a self-paced learning mode.
- Explanations after answers in Learning Mode and after completion in Timed Mode. Explanations cover **all four answer choices**, deciding clues, at least three related learning points, a practical mental-model example, an exam trap, and links to official Snowflake documentation.
- Official COF-C03 study-guide subobjective tags shown on questions and a gap-objective progress tracker on dashboard.
- Local instant persistence, session history, mistakes-only retests, bookmarks, notes, JSON export/import, and mobile-friendly larger text.

## Compatibility and history

Exam #1 (`Q001`–`Q100`) and Exam #2 (`B001`–`B100`) are **unmodified**. Exam #3 uses `C001`–`C045`; the existing `snowpro-cof-c03-lab-v1` browser `localStorage` key and state schema remain unchanged. Original 91/100 Exam #1 history is preserved on the same browser and site origin. The user's active selected form preference also remains intact. Download/import JSON backups when changing browsers.

The 45-question challenge intentionally does **not** mirror the official certification's five domain percentages; it is a gap-closure quiz targeting omissions identified in the 200-question coverage audit. It is not an official practice exam or a reliable pass prediction.

## Independent answer audit

This bank was authored with reference to the July 8, 2026 official COF-C03 guide and Snowflake documentation and has passed structural, duplicate-text, key-validity, browser-navigation and save/resume tests. A truly independent second AI session/agent has **not** reviewed every fact. Use `INDEPENDENT-AUDIT.md` and `exam3-bank.json` in a new session to obtain a fresh reviewer before relying on the entire answer key.