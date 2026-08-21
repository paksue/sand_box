# Pages preview verification checklist

Before sharing the playable preview URL:

1. `npm ci` succeeds.
2. Vite builds with base `/sand_box/previews/tag-arena/`.
3. Built `index.html` references `/sand_box/previews/tag-arena/assets/`.
4. Built `assets/` exists.
5. The compiled artifact is inspected before merge.
6. After merge, the workflow commits the compiled output under `previews/tag-arena/` on `main`.
7. Share `https://paksue.github.io/sand_box/previews/tag-arena/`, not the raw source path.
