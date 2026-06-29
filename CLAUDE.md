# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies (Node.js >= 18 required)
npm run dev          # Start Vite dev server with HMR (http://localhost:5173)
npm run buildmap     # Production build (tsc + vite build via buildmap.vite.config.ts)
npm run preview      # Serve dist/ with CORS headers after buildmap
npm run upload       # buildmap + upload to WA Map Storage
npm run upload-only  # Upload without rebuilding
```

There are no test commands — this project has no test suite.

## Architecture

This is a **WorkAdventure map starter kit** with two distinct runtime environments:

### Browser (map scripts)
- `src/main.ts` — TypeScript map script executed in the browser by WorkAdventure. Uses `WA.*` globals from `@workadventure/iframe-api-typings`. All map scripts **must** live in `src/` to be compiled by Vite.
- `.tmj` files (e.g. `office.tmj`, `conference.tmj`) — Tiled map files in the project root. They reference scripts via a `script` property pointing to `src/main.ts`.

### Server (dev only)
- `app/app.ts` — Express entry point that wraps `@workadventure/map-starter-kit-core`. It adds one middleware to filter `extra/` maps from the `/maps/list` endpoint, then delegates everything else to the core package. **Do not add server logic here.**

### Two Vite configs
- `web.vite.config.ts` — Used by `npm run dev`. Adds `vite-plugin-node` to run the Express server alongside the Vite dev server.
- `buildmap.vite.config.ts` — Used by `npm run buildmap`. Builds only map assets (no server). Excludes the `extra/` directory. Reads `TILESET_OPTIMIZATION` env vars to optionally compress tileset PNGs.

### Map optimizer
Both configs use `wa-map-optimizer-vite` (`getMaps`, `getMapsScripts`, `getMapsOptimizers`) to auto-discover `.tmj` files and wire them into Rollup inputs, excluding the `extra/` directory.

## Environment variables (`.env`)

| Variable | Purpose |
|---|---|
| `LOG_LEVEL` | Build log verbosity (0=none, 1=info, 2=verbose) |
| `TILESET_OPTIMIZATION` | Set `true` to compress tilesets during build |
| `TILESET_OPTIMIZATION_QUALITY_MIN/MAX` | PNG quality range (0.0–1.0) |
| `UPLOAD_MODE` | `MAP_STORAGE` (default) or `GH_PAGES` |
| `MAP_STORAGE_URL` | WA Map Storage URL (local in `.env`, CI via secret) |
| `MAP_STORAGE_API_KEY` | API key — store in `.env.secret` locally, GitHub secret in CI |
| `UPLOAD_DIRECTORY` | Target directory on storage server |

## CI/CD

`.github/workflows/build-and-deploy.yml` runs on pushes to `master`. It reads `UPLOAD_MODE` from `.env` to decide between WA Map Storage (requires `MAP_STORAGE_API_KEY` secret) and GitHub Pages deployment.

## Committing

Only commit when the user explicitly requests it. Do not auto-commit docs, specs, or any other files.

## Adding a new map

1. Copy `office.tmj` and rename it in the project root.
2. Create a matching script in `src/` if needed (e.g. `src/mymap.ts`).
3. Set the `script` property in the new `.tmj` to point to `src/mymap.ts`.
4. The optimizer auto-discovers all `.tmj` files in the root — no config changes needed.
