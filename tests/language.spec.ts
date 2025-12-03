import { test, expect } from '@playwright/test';

test.describe('Language Auto-Detection', () => {
  test.beforeEach(async ({ context }) => {
    // Clear localStorage before each test
    await context.addInitScript(() => {
      localStorage.clear();
    });
  });

  test('redirects Spanish browser to /lang/es/', async ({ page, context }) => {
    // Set browser language to Spanish
    await context.setExtraHTTPHeaders({
      'Accept-Language': 'es-ES,es;q=0.9',
    });

    // Override navigator.language
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', { value: 'es-ES', configurable: true });
      Object.defineProperty(navigator, 'languages', { value: ['es-ES', 'es'], configurable: true });
    });

    await page.goto('/');
    await expect(page).toHaveURL(/\/lang\/es\//);
  });

  test('redirects Portuguese browser to /lang/pt-br/', async ({ page, context }) => {
    await context.setExtraHTTPHeaders({
      'Accept-Language': 'pt-BR,pt;q=0.9',
    });

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', { value: 'pt-BR', configurable: true });
    });

    await page.goto('/');
    await expect(page).toHaveURL(/\/lang\/pt-br\//);
  });

  test('redirects German browser to /lang/de/', async ({ page, context }) => {
    await context.setExtraHTTPHeaders({
      'Accept-Language': 'de-DE,de;q=0.9',
    });

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', { value: 'de-DE', configurable: true });
    });

    await page.goto('/');
    await expect(page).toHaveURL(/\/lang\/de\//);
  });

  test('redirects French browser to /lang/fr/', async ({ page, context }) => {
    await context.setExtraHTTPHeaders({
      'Accept-Language': 'fr-FR,fr;q=0.9',
    });

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', { value: 'fr-FR', configurable: true });
    });

    await page.goto('/');
    await expect(page).toHaveURL(/\/lang\/fr\//);
  });

  test('English browser stays on root', async ({ page, context }) => {
    await context.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', { value: 'en-US', configurable: true });
    });

    await page.goto('/');

    // Should stay on root (no redirect)
    await page.waitForLoadState('networkidle');
    expect(page.url()).toMatch(/\/$/);
  });

  test('unsupported language stays on root', async ({ page, context }) => {
    await context.setExtraHTTPHeaders({
      'Accept-Language': 'ja-JP,ja;q=0.9',
    });

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', { value: 'ja-JP', configurable: true });
    });

    await page.goto('/');

    await page.waitForLoadState('networkidle');
    expect(page.url()).toMatch(/\/$/);
  });
});

test.describe('Language Preference Storage', () => {
  test('stores preference when manually switching language', async ({ page }) => {
    await page.goto('/');

    // Click on Spanish link
    await page.click('a[href*="lang/es"]');
    await expect(page).toHaveURL(/\/lang\/es\//);

    // Check localStorage
    const storedLang = await page.evaluate(() => localStorage.getItem('solent-lang'));
    expect(storedLang).toBe('es');
  });

  test('respects stored preference on return visit', async ({ page, context }) => {
    // Set Spanish browser language
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'language', { value: 'es-ES', configurable: true });
      // Pre-set English preference
      localStorage.setItem('solent-lang', 'en');
    });

    await page.goto('/');

    // Should stay on root because of stored 'en' preference
    await page.waitForLoadState('networkidle');
    expect(page.url()).toMatch(/\/$/);
  });

  test('switching from subpage stores preference', async ({ page }) => {
    await page.goto('/lang/fr/');

    // Click on German link
    await page.click('a[href*="lang/de"]');
    await expect(page).toHaveURL(/\/lang\/de\//);

    // Check localStorage
    const storedLang = await page.evaluate(() => localStorage.getItem('solent-lang'));
    expect(storedLang).toBe('de');
  });
});
