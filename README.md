# News Agency (Electron + React + TypeScript)

A desktop app for:
- fetching news (BBC + APNews via NewsAPI)
- filtering by category/source/search
- storing normalized articles in SQLite
- showing simple sentiment/topic analysis

## Project structure (quick mental model)

- `src/renderer/` → React UI (list, detail, filters, analysis panel)
- `electron/preload.ts` → safe IPC bridge exposed as `window.newsBridge`
- `electron/main.ts` → Electron app entry + IPC handlers
- `electron/news-service.ts` → app/service layer orchestration
- `electron/news-api.ts` → NewsAPI fetch + normalization
- `electron/analysis.ts` → sentiment/topics placeholder analysis
- `electron/db.ts` → SQLite schema + upsert/query
- `src/shared/types.ts` → shared contracts between renderer/main

## Prerequisites

- Node.js 20+ (recommended)
- npm

## Setup

```bash
npm install
```

## Environment

Set your NewsAPI key before running. The Electron main process now loads `.env` automatically in development.

```bash
NEWS_API_KEY="<your_newsapi_key>"
```

If `NEWS_API_KEY` is missing, the app uses a fallback sample article.

## Run (development)

```bash
npm run dev
```

What this does:
- starts Vite dev server for React UI
- starts Electron app and loads the UI

## Verify NewsAPI

Use this when you are on a cloud server and cannot see the Electron window:

```bash
npm run check:news
```

Expected result:
- prints `OK articles=<number>`
- prints a few article titles

## Build (production assets)

```bash
npm run build
```

This compiles TypeScript and builds renderer assets under `dist/`.

## Preview renderer only

```bash
npm run preview
```

## Common troubleshooting

### 1) No live articles
- Check `.env` contains `NEWS_API_KEY=...`
- Verify the key is valid on the NewsAPI dashboard
- Restart `npm run dev` after changing `.env`
- Run `npm run check:news` to confirm the NewsAPI path works independently of the Electron window

### 2) `localhost:5173` works but no news loads
- That URL is renderer-only in development
- Live NewsAPI fetches happen through Electron IPC, so use the Electron window opened by `npm run dev`

### 3) Electron starts in "Node mode" instead of opening the app
- If your shell exports `ELECTRON_RUN_AS_NODE=1`, Electron will not expose the normal desktop app APIs
- `npm run dev` now unsets that variable for the Electron child process automatically

### 4) Running on headless Linux / cloud VM
- If no `DISPLAY` is available, the dev launcher now wraps Electron with `xvfb-run`
- This is mainly for remote Linux environments where there is no active desktop session

### 5) Native module install issues (`better-sqlite3`)
- Ensure Node version is supported
- Reinstall clean:

```bash
rm -rf node_modules package-lock.json
npm install
```

### 6) IPC type mismatch errors
- Check `src/shared/types.ts`
- Ensure both renderer and electron files use same shared types

## Notes

- SQLite DB file is created in Electron `userData` path (`news_agency.db`).
- Analysis logic is intentionally simple placeholder logic and can be upgraded later.


# Remember to upload this to Git Repo