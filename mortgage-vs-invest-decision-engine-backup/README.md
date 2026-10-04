# Mortgage vs. Invest Decision Engine backup

Standalone static Site backed up from its published source on October 3, 2026.

## Contents

- dist/: complete browser app, calculator engine, styles, and embedded historical return data.
- .openai/hosting.json: original Site identity and static output configuration.
- validate.mjs: mortgage arithmetic, equal cash flow, return parity, tax and reserve checks.
- smoke.mjs: application interaction and report-export smoke checks (DOM stub; not browser visual QA).

## Run the checks

From this folder, run `node validate.mjs` and `node smoke.mjs`. The app itself has no install step: serve dist/ as static files.

Historical data is Aswath Damodaran's annual US returns table (1928–2025): https://pages.stern.nyu.edu/adamodar/New_Home_Page/datafile/histretSP.html. The data source and retrieval date are also recorded in dist/history.json.

This is a source snapshot. Forward-looking market paths are illustrative assumptions, not calibrated forecasts. See the app’s “How it works” view for modeling scope and limitations.
