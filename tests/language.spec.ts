import { test, expect } from '@playwright/test';

// All 12 supported languages
const LANGUAGES = [
  { code: 'en', path: '/', flag: '🇺🇸' },
  { code: 'de', path: '/de/', flag: '🇩🇪' },
  { code: 'nl', path: '/nl/', flag: '🇳🇱' },
  { code: 'fr', path: '/fr/', flag: '🇫🇷' },
  { code: 'zh', path: '/zh/', flag: '🇨🇳' },
  { code: 'it', path: '/it/', flag: '🇮🇹' },
  { code: 'es', path: '/es/', flag: '🇪🇸' },
  { code: 'pl', path: '/pl/', flag: '🇵🇱' },
  { code: 'sv', path: '/sv/', flag: '🇸🇪' },
  { code: 'ru', path: '/ru/', flag: '🇷🇺' },
  { code: 'pt-br', path: '/pt-br/', flag: '🇧🇷' },
  { code: 'uk', path: '/uk/', flag: '🇺🇦' },
];

test.describe('Language Switcher', () => {
  test('English page has language switcher with 12 options', async ({ page }) => {
    await page.goto('/');

    // Language switcher exists
    const langSwitcher = page.locator('.lang-switcher');
    await expect(langSwitcher).toBeVisible();

    // Has 12 language options in dropdown
    const langOptions = page.locator('.lang-option');
    await expect(langOptions).toHaveCount(12);
  });

  test('clicking DE navigates to German page', async ({ page }) => {
    await page.goto('/');

    // Hover to reveal dropdown, then click German
    await page.locator('.lang-switcher').hover();
    await page.click('a[href="/de/"]');
    await expect(page).toHaveURL(/\/de\/?$/);

    // German page loads with correct lang attribute
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('de');
  });

  test('clicking FR navigates to French page', async ({ page }) => {
    await page.goto('/');

    await page.locator('.lang-switcher').hover();
    await page.click('a[href="/fr/"]');
    await expect(page).toHaveURL(/\/fr\/?$/);

    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('fr');
  });

  test('clicking UK navigates to Ukrainian page', async ({ page }) => {
    await page.goto('/');

    await page.locator('.lang-switcher').hover();
    await page.click('a[href="/uk/"]');
    await expect(page).toHaveURL(/\/uk\/?$/);

    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('uk');
  });

  test('language switcher works on localized pages', async ({ page }) => {
    // Start on German page
    await page.goto('/de/');

    // Navigate to French
    await page.locator('.lang-switcher').hover();
    await page.click('a[href="/fr/"]');
    await expect(page).toHaveURL(/\/fr\/?$/);

    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('fr');
  });
});

test.describe('Translation Content', () => {
  test('German page has translated content', async ({ page }) => {
    await page.goto('/de/');

    // German title should be visible
    await expect(page).toHaveTitle(/Solent Labs™/);

    // Content should be in German (check for German-specific text)
    // "Products" in German is "Produkte"
    await expect(page.locator('text=Produkte')).toBeVisible();
  });

  test('French page has translated content', async ({ page }) => {
    await page.goto('/fr/');

    // "Products" in French is "Produits"
    await expect(page.locator('text=Produits')).toBeVisible();
  });

  test('Ukrainian page has translated content', async ({ page }) => {
    await page.goto('/uk/');

    // "Products" in Ukrainian is "Продукти"
    await expect(page.locator('text=Продукти')).toBeVisible();
  });

  test('Chinese page has translated content', async ({ page }) => {
    await page.goto('/zh/');

    // "Products" in Chinese is "产品"
    await expect(page.locator('text=产品')).toBeVisible();
  });

  test('Spanish page has translated content', async ({ page }) => {
    await page.goto('/es/');

    // "Products" in Spanish is "Productos"
    await expect(page.locator('text=Productos')).toBeVisible();
  });
});

test.describe('HTML Lang Attributes', () => {
  for (const lang of LANGUAGES) {
    test(`${lang.code.toUpperCase()} page has correct html lang="${lang.code}"`, async ({ page }) => {
      await page.goto(lang.path);

      const htmlLang = await page.locator('html').getAttribute('lang');
      expect(htmlLang).toBe(lang.code);
    });
  }
});
