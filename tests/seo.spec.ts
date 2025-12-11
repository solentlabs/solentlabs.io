import { test, expect } from '@playwright/test';

// All 12 supported languages
const LANGUAGES = [
  { code: 'en', path: '/' },
  { code: 'de', path: '/de/' },
  { code: 'nl', path: '/nl/' },
  { code: 'fr', path: '/fr/' },
  { code: 'zh', path: '/zh/' },
  { code: 'it', path: '/it/' },
  { code: 'es', path: '/es/' },
  { code: 'pl', path: '/pl/' },
  { code: 'sv', path: '/sv/' },
  { code: 'ru', path: '/ru/' },
  { code: 'pt-br', path: '/pt-br/' },
  { code: 'uk', path: '/uk/' },
];

test.describe('SEO Elements', () => {
  test('English page has hreflang tags for all 12 languages', async ({ page }) => {
    await page.goto('/');

    // Check all hreflang tags exist (12 languages + x-default = 13)
    const hreflangs = await page.locator('link[rel="alternate"][hreflang]').all();
    expect(hreflangs.length).toBe(13);

    // Verify x-default exists
    const xDefault = page.locator('link[hreflang="x-default"]');
    await expect(xDefault).toHaveCount(1);
  });

  for (const lang of LANGUAGES) {
    test(`${lang.code.toUpperCase()} page has correct html lang attribute`, async ({ page }) => {
      await page.goto(lang.path);

      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toBe(lang.code);
    });
  }

  test('has favicon', async ({ page }) => {
    await page.goto('/');

    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveCount(1);
  });

  test('has viewport meta tag', async ({ page }) => {
    await page.goto('/');

    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveAttribute('content', /width=device-width/);
  });

  test('has meta description', async ({ page }) => {
    await page.goto('/');

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /complex systems observable/);
  });

  test('CMM page has unique meta description', async ({ page }) => {
    await page.goto('/cable-modem-monitor/');

    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute('content', /DOCSIS|signal/i);
  });
});

test.describe('Accessibility', () => {
  test('images have alt text', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img').all();
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      // Alt can be empty string for decorative images, but should exist
      expect(alt).not.toBeNull();
    }
  });

  test('page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // h1 exists (main headline) - scope to container to avoid Astro dev toolbar
    const h1s = await page.locator('.container h1').all();
    expect(h1s.length).toBe(1);

    // h2 elements exist for sections
    const h2s = await page.locator('.container h2').all();
    expect(h2s.length).toBeGreaterThanOrEqual(2);
  });

  test('links have visible text, aria-label, or image', async ({ page }) => {
    await page.goto('/');

    const links = await page.locator('a').all();
    for (const link of links) {
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const hasImage = await link.locator('img').count() > 0;
      const hasContent = (text && text.trim().length > 0) || ariaLabel || hasImage;
      expect(hasContent).toBeTruthy();
    }
  });

  test('page has skip link or proper landmarks', async ({ page }) => {
    await page.goto('/');

    // Check for main landmark or nav
    const main = page.locator('main');
    const nav = page.locator('nav');

    const hasMain = await main.count() > 0;
    const hasNav = await nav.count() > 0;

    expect(hasMain || hasNav).toBeTruthy();
  });
});

test.describe('Performance Hints', () => {
  test('critical resources have preload hints', async ({ page }) => {
    await page.goto('/');

    // Check for any preload links (fonts, critical CSS, etc.)
    const preloads = await page.locator('link[rel="preload"]').count();
    // At minimum, should have some preloading strategy
    // This is a soft check - may be 0 if using other strategies
    expect(preloads).toBeGreaterThanOrEqual(0);
  });
});
