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

## Testing

### Site Structure Notes
- **Two footers exist**: Site footer (theme toggle) and content footer (brand "Solent Labs™")
  - Use specific selectors: `.container footer, footer:has-text("Solent Labs™")` for content footer
- **Language switcher**: Hover dropdown with 12 languages
  - Ukrainian is the last item (position matters for test timing)
  - May need `element.evaluate((el) => el.click())` for bottom items

### Playwright Patterns
When clicks timeout despite visible elements:
1. Try explicit visibility wait: `await expect(element).toBeVisible()`
2. Try force click: `element.click({ force: true })`
3. Use programmatic click: `element.evaluate((el) => el.click())` - bypasses actionability checks

**Strict mode violations** (`locator resolved to N elements`):
- Scope selectors: `.product-feature h2:has-text("Projects")` not just `text=Projects`
- Use `.first()` when multiple matches expected

### Running Tests
- `npm test` - Full test suite (150 tests: chromium + mobile-chrome)
- Tests run automatically in pre-push hook (chromium only, 75 tests)
- Error context saved to `test-results/*/error-context.md` for debugging
