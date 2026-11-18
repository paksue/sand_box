# SandBox App Library

**Live launcher:** https://paksue.github.io/sand_box/
**Repository:** https://github.com/paksue/sand_box

A visual, searchable launcher for standalone projects in this repository. Existing app folders and URLs remain unchanged.

## Using the launcher

- Search by project title, description, tag or folder name. Press / or Ctrl/Cmd + K to focus search.
- Browse by category, switch grid/list layout, and sort projects.
- Tap ☆ to save a favorite. The Recently opened view records apps launched through this homepage.
- Open Details to view GitHub source, see alternate versions, and save personal notes.
- Favorites, launch history, layout and notes use browser localStorage. They do NOT sync across devices. No account or server is required.
- The launcher and GitHub Pages projects are public. Do not commit secrets or personal notes to a public repository.

## Automatic project discovery

Information comes from:
1. catalog/apps.json — generated static catalog and first-load fallback.
2. catalog/project-metadata.json — readable titles, descriptions, tags, categories, glyphs, themes and featured status.
3. scripts/generate-sandbox-catalog.cjs — scans top-level app entrypoints and previews, groups versions, and records latest Git commit dates.
4. .github/workflows/sandbox-catalog.yml — automatically regenerates the catalog when entrypoints or metadata change.
5. Runtime refresh — the launcher loads latest raw GitHub catalog content and optionally scans the Git tree API. This can detect new apps without waiting for a Pages rebuild.

GitHub's unauthenticated API is rate-limited. The published static catalog remains usable if the live scan cannot run.

To add an app: create your-app/index.html (or previews/your-app/index.html). Add a corresponding record to catalog/project-metadata.json for a polished title and description. Newly discovered directories without metadata receive a generic entry.

To regenerate locally:

    node scripts/generate-sandbox-catalog.cjs
    node --check assets/sandbox.js

For compiled applications, the primary URL is the built preview. Source entries remain available as alternate variants. The older previews/sat-planner-2026-27/ is grouped with college-sat-act-planner and the latter is preferred.

## Deployment and safety

The launcher uses plain HTML, CSS and JavaScript on the existing branch-based GitHub Pages site. Fuse.js 7.1.0 is pinned on jsDelivr for fuzzy search, with local text-search fallback if the library cannot load. No database or server is required.

New files are isolated to the root homepage, assets/sandbox.*, catalog, the generator and one dedicated GitHub Actions workflow. Other applications and their URLs are untouched.

Design uses charcoal navigation, lime hero, project-specific CSS illustrations and mobile-first app cards. Illustrated card covers are not claimed screenshots of the underlying projects.

## Cover images

The gallery now uses real images instead of oversized emoji glyphs. Seven projects use custom visual artwork stored in `assets/covers/curated/<project-id>.webp`: SAT/ACT Planner, Harran Field Manual, Deep Current 3D, Midnight Japanese, AI Concepts Explorer, Camera Safety Notifier, and Cochrane Integrity Atlas.

All other published apps are shown using project-specific screenshots captured by `.github/workflows/sandbox-covers.yml` and `scripts/capture-sandbox-covers.cjs`. The workflow uses a clean browser with no personal localStorage, stores compressed WebP previews in `assets/covers/screenshots/`, and can be rerun through Actions. On apps that are not renderable in headless Chromium, a styled fallback remains in place. The gallery loads assets through public GitHub raw URLs so new covers do not have to wait for a separate Pages redeploy.

For future projects, provide a curated WebP under the same ID to override the screenshot. A curated image must depict the specific project rather than just its category. Source-only copies, including `king_quest_the_shortcut`, are not listed as published apps.
