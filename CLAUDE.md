# Claude Rules

## Pre-Push Tests

This repo has a pre-push hook that runs Playwright tests. The dev server must start before tests run.

**Known issue:** Cold starts can timeout (120s limit). If push fails with "Timed out waiting for webServer":
1. Run `npm run dev` manually first to warm up
2. Or run `npm test` before pushing
3. Then retry the push

## AI Skills

See `ai-skills/website-translation.md` for the i18n workflow.

## Translation Workflow

- Source of truth: `src/i18n/en.json`
- Generated translations: `src/i18n/generated/*.json`
- Never manually edit generated files - regenerate using the translation skill

## Build & Deploy

- `npm run build` generates static site to `dist/`
- GitHub Pages deploys from `dist/` on push to main
