# SnowPro Recall — COF-C03 Mobile Flashcards

A portrait-first, private, installable web app for SnowPro Core study.

## Use it

**GitHub Pages:** https://paksue.github.io/sand_box/snowpro-recall/

**iPhone:** Open in Safari, tap Share → Add to Home Screen. On Android Chrome, use Install app.

## What is included

- 162 *original* compact flashcards with short answers, explanations, SQL examples, exam traps, related concepts, and Snowflake documentation links.
- Five exam domains: 31 Architecture/AI, 28 Governance, 40 Loading, 42 Performance/SQL (including string functions), 21 Collaboration.
- 2-, 5- and 10-minute sessions; due/new mix, exam sprint, SQL typing practice, domain decks, search and filters.
- 3D CSS card flips, touch/keyboard interaction, Again/Hard/Good/Easy review ratings, subtle optional haptics, reduced-motion support.
- Default FSRS-6 memory parameters with short-step review safeguards and a configurable recall target. The scheduler estimates review intervals; it is not personalized by optimization on a user's history.
- Immediate browser `localStorage` persistence for session position, ratings, notes, bookmarks and settings.
- Progress insights including history, domain learning, 21-day activity map and weak-card prioritization.
- JSON backup export and import for moving between browsers or restoring progress.
- Offline-first progressive web app shell with a service worker. Once visited online, the built-in cards are readable offline; external Snowflake documentation links require internet.

## Important storage note

GitHub Pages does **not** store your ratings. All data stays in the browser's storage area for that exact site origin. Using the local HTML file, another domain, another device, or private browsing does not reuse the same storage. Export a backup from Settings if you need to transfer or retain progress before clearing browser data.

## Files

- `index.html`: standalone complete web app and card data (no runtime libraries).
- `manifest.webmanifest`: PWA install metadata.
- `service-worker.js`: offline cache for the app shell.
- `icon.svg`: brand icon.
- `cards.json`: editable source deck.
- `make_cards.py`, `template.html`, `style.css`, `app.js`, `build.py`: source and repeatable build.

To rebuild locally:

```bash
python make_cards.py
python build.py
```

## References

- Official Snowflake COF-C03 Exam Study Guide (July 2026), provided by user.
- Snowflake SQL and features documentation linked within each card.
- FSRS-6 published algorithm: https://github.com/open-spaced-repetition/awesome-fsrs/wiki/The-Algorithm

This is an independent educational study tool and not an official Snowflake product or official exam score predictor. Cards are original summaries and should be checked against current documentation when product behavior changes.