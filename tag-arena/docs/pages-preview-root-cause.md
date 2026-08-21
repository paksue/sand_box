# Raw-source Pages failure

Observed symptom at `/sand_box/tag-arena/`:
- default browser typography;
- no Pixi canvas;
- no production CSS.

Root cause:
`tag-arena/index.html` is the Vite development/source entry and loads `/src/main.ts`. In the repository's branch-backed GitHub Pages configuration, that source HTML is served directly, so the TypeScript module path does not resolve as a production bundle.

Resolution:
publish Vite's compiled `dist/` output under `previews/tag-arena/`, using `/sand_box/previews/tag-arena/` as the Vite base.
