# SnowPro Recall — Expanded COF-C03 & Historical Coverage

Phone-first, installable PWA for SnowPro Core study.

**Use:** https://paksue.github.io/sand_box/snowpro-recall/

**iPhone:** Open the link in Safari → Share → Add to Home Screen.

## What's included (November 2026)

- **415 original recall flashcards:** 381 focused on the current COF-C03 exam and 34 separately labeled historical COF-C01/COF-C02 cards.
- All **19 objective identifiers** from the July 8, 2026 official COF-C03 study guide represented by dedicated cards. This means objective-level representation, *not every possible exam question.*
- Five C03 domains: 86 Architecture/AI, 74 Governance, 95 Loading, 96 Performance/SQL, and 54 Data Collaboration (counts include 34 historical cards).
- Deep-dive explanations, decision traps, SQL examples, links to official Snowflake documentation, and optional legacy browsing.
- **Coverage Map:** View all 19 objectives, their cards and personal review progress; tap any objective to study.
- **Question Sources:** The July 2026 official study guide/sample questions, official practice exam portal, Snowflake free prep, our original 100-question exam app, and public third-party practice links.
- 2/5/10 minute sessions; due/new mix; Exam Sprint; write-the-SQL review; topic search; bookmarks and notes.
- FSRS-style spaced-repetition scheduling, 3D card flips, responsive portrait mobile UI, JSON progress backups and offline-ready app shell.

## Scope and limitations

Snowflake does **not** release its complete past/current certification exam question banks. Historical materials are not reliable evidence of today's exam answers. The app does not reproduce unauthorized question dumps or claim to contain every real exam question. Cards are original recall prompts designed to cover publicly documented concepts and exam objectives. The official guides explicitly state objectives aren't exhaustive.

No third-party practice exam is scraped or republished. The separate original 100-question SnowPro COF-C03 mock is accessible at https://paksue.github.io/sand_box/snowpro-cof-c03-exam-lab/.

## Preserving your existing history

All original `sp001`–`sp162` card IDs are unchanged, and the `snowpro-recall-v1` browser-storage key is unchanged. Existing ratings, due dates, bookmarks, notes, and backups remain compatible. Historical cards are excluded from the automatic *current C03* review queue; open **Decks → COF-C01/C02 history** or choose **Library → Historical** to include them explicitly.

Saved progress is **local to each browser and site origin**, not synced through GitHub. Use Settings → Export JSON regularly. Offline use requires opening the site once online. External references require internet.

## Source and editing

- `index.html`: complete standalone app, including all 415 built-in cards.
- `cards.json`: full deck for inspection/editing.
- `make_cards.py` and `extra_cards.py`: historical scripts for reconstructing the original 405-card set; do **not** run these to update the current 415-card deck.
- `lessons.json`: authored concept-teaching sequences; `exam-links.json`: original public Exam Lab answer keys and question-to-topic links (NO personal answers).
- `app.js`, `style.css`, `template.html`, `build.py`: app source and reproducible build.
- `service-worker.js`, `manifest.webmanifest`, `icon.svg`: PWA install/offline assets.

Build locally:

```bash
python build.py
```

### Main sources

- July 8, 2026 COF-C03 Exam Study Guide (user-provided PDF).
- [Snowflake COF-C03 certification page](https://learn.snowflake.com/en/certifications/snowpro-core-c03/).
- [Official SnowPro Practice Exams](https://learn.snowflake.com/en/certifications/snowpro-practice-exams/).
- [Official C03 core preparation course](https://learn.snowflake.com/en/courses/OD-COREPREP/).
- Snowflake Documentation URLs within individual cards.
- Publicly available historical COF-C02 study-guide outlines.

Independent study tool; unaffiliated with Snowflake Inc.

## Interactive learning panels (November 2026 update)

The original **tap-to-flip** behavior remains. Once the main answer is revealed, swipe **left** or **right** to explore a sequence dedicated to that topic. Navigate using the large arrow buttons, progress dots, or keyboard Left/Right arrows as well. Panels include:

- The short answer (panel 1; tap again to flip back to the main question)
- Why the answer works
- Actual SQL and exact syntax, when the card includes an example
- A contrasting exam trap or exception
- Up to two real related recall prompts, selected from the existing card corpus, with tap-to-reveal solutions
- Official Snowflake documentation and related study topics

No swipe changes the main flashcard. **Again / Hard / Good / Easy** rates the main answer and moves forward. Exploring is optional, so a quick review can remain quick. The current panel and revealed variation state autosave with the existing session; the app preserves the existing `snowpro-recall-v1` progress storage key.

The original 405 cards and associated ratings are retained; 10 educational prompts have been added. The interaction is built using plain JavaScript and CSS transforms; there is no extra library or backend.

## Review tracking and queue rotation fix (November 16, 2026)

- **Tap/flip/view** is now counted separately as a *viewed* card; it is not a graded recall review.
- **Again / Hard / Good / Easy** immediately records a rating, updates the FSRS due date, and shows an onscreen confirmation.
- Home and Insights clearly distinguish **cards opened** from **cards rated**; Insights includes recent study-set history even for sessions ended early.
- Starting another Smart Review, Exam Sprint, or SQL set prefers cards not offered by the last few sets, **including cards not yet rated**. Due and previously difficult cards can still recur deliberately according to spaced-repetition needs.
- "2 / 5 / 10 minutes" indicates a suggested study set (7 / 16 / 32 cards), not an automatic countdown. Sessions are complete when those cards are rated or skipped.
- Replacing a partly completed session keeps all previous ratings and logs a set summary, but the prior unfinished set is not independently resumable. **Resume** continues the current unfinished session.
- The storage key and previous card IDs remain unchanged. Review history is not erased by this upgrade.

## Concept-first learning and Exam Lab gap import (November 2026)

- **415 cards**: all previous 405 IDs unchanged; 10 new concept-oriented prompts `sp406`–`sp415`. Historical C01/C02 remain opt-in.
- **59 guided cards** across 33 original expert-authored lessons and related concept variants. Guiding panels follow: core answer → meaning → three-step mechanism → worked example (with SQL where suitable) → contrasting boundaries → teach-it-back (tap to reveal) → official docs. The remaining cards retain shorter explanatory panels until further enrichment.
- **Learn concepts deeply** studies current guided cards in rotating short sets, separate from Smart Review.
- **Learn from mock gaps** opens a locally imported exam-based learning path. Choose the `snowpro-core-progress-*.json` exported by the separately hosted [SnowPro Exam Lab](https://paksue.github.io/sand_box/snowpro-cof-c03-exam-lab/). The app calculates per-exam results from the two original 100-question public mock answer keys and groups the 21 known missed-question topics into 20 core lessons; future/unmapped questions are not silently treated as known.
- **Privacy:** The 200 original mock answer keys and concept-mapping identifiers are public code, but **your personal exam responses/results are never included in the repository**. The uploaded progress JSON stays inside the browser and is stored locally under the existing `snowpro-recall-v1` key. No new network endpoint, analytics service, or backend is used.
- **Preserved ratings:** All earlier flashcard IDs, ratings, due times, bookmarks and notes remain intact. Starting a new learning set uses existing session-history behavior and does not retroactively grade your old study sessions.

To build from the canonical source:

```bash
python build.py
```

`cards.json`, `lessons.json`, `exam-links.json`, `app.js`, `style.css`, and `template.html` together reproduce `index.html`. Do not rerun legacy generators unless intentionally rebuilding the historical card bank.
