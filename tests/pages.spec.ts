import { test, expect } from '@playwright/test';

// All 12 supported languages with their paths and expected titles
const LANGUAGES = [
  { code: 'en', path: '/', titleKey: 'Solent Labs™' },
  { code: 'de', path: '/de/', titleKey: 'Solent Labs™' },
  { code: 'nl', path: '/nl/', titleKey: 'Solent Labs™' },
  { code: 'fr', path: '/fr/', titleKey: 'Solent Labs™' },
  { code: 'zh', path: '/zh/', titleKey: 'Solent Labs™' },
  { code: 'it', path: '/it/', titleKey: 'Solent Labs™' },
  { code: 'es', path: '/es/', titleKey: 'Solent Labs™' },
  { code: 'pl', path: '/pl/', titleKey: 'Solent Labs™' },
  { code: 'sv', path: '/sv/', titleKey: 'Solent Labs™' },
  { code: 'ru', path: '/ru/', titleKey: 'Solent Labs™' },
  { code: 'pt-br', path: '/pt-br/', titleKey: 'Solent Labs™' },
  { code: 'uk', path: '/uk/', titleKey: 'Solent Labs™' },
];

test.describe('Homepage Rendering', () => {
  for (const lang of LANGUAGES) {
    test(`${lang.code.toUpperCase()} homepage loads correctly`, async ({ page }) => {
      await page.goto(lang.path);

      // Title contains brand name
      await expect(page).toHaveTitle(new RegExp(lang.titleKey));

      // Logo is visible in nav
      await expect(page.locator('nav').first()).toBeVisible();

      // Hero section exists
      await expect(page.locator('h1').first()).toBeVisible();

      // Footer inside content container has brand
      await expect(page.locator('.container footer, footer:has-text("Solent Labs™")').first()).toBeVisible();
      await expect(page.locator('.container footer, footer:has-text("Solent Labs™")').first()).toContainText('Solent Labs™');
    });
  }
});


test.describe('CMM Product Page', () => {
  const CMM_PAGES = [
    { code: 'en', path: '/cable-modem-monitor/' },
    { code: 'de', path: '/de/cable-modem-monitor/' },
    { code: 'nl', path: '/nl/cable-modem-monitor/' },
    { code: 'fr', path: '/fr/cable-modem-monitor/' },
    { code: 'zh', path: '/zh/cable-modem-monitor/' },
    { code: 'it', path: '/it/cable-modem-monitor/' },
    { code: 'es', path: '/es/cable-modem-monitor/' },
    { code: 'pl', path: '/pl/cable-modem-monitor/' },
    { code: 'sv', path: '/sv/cable-modem-monitor/' },
    { code: 'ru', path: '/ru/cable-modem-monitor/' },
    { code: 'pt-br', path: '/pt-br/cable-modem-monitor/' },
    { code: 'uk', path: '/uk/cable-modem-monitor/' },
  ];

  for (const lang of CMM_PAGES) {
    test(`${lang.code.toUpperCase()} CMM page loads correctly`, async ({ page }) => {
      await page.goto(lang.path);

      // Title contains Cable Modem Monitor
      await expect(page).toHaveTitle(/Cable Modem Monitor/);

      // Header section exists
      await expect(page.locator('h1').first()).toContainText('Cable Modem Monitor');

      // Stats section visible (10+ modems, 700+ tests, 12 languages)
      await expect(page.locator('.stats-row .stat').first()).toBeVisible();
    });
  }
});

test.describe('Navigation', () => {
  test('Homepage has link to CMM product page', async ({ page }) => {
    await page.goto('/');

    // Check for CMM link in products section (not nav dropdown)
    const cmmLink = page.locator('.products-section a[href*="cable-modem-monitor"], .cta-button[href*="cable-modem-monitor"]').first();
    await expect(cmmLink).toBeVisible();
  });

  test('CMM link works from localized homepage', async ({ page }) => {
    await page.goto('/de/');

    // Click the CMM link in the products section
    const cmmLink = page.locator('.products-section a[href*="cable-modem-monitor"], .cta-button[href*="cable-modem-monitor"]').first();
    await cmmLink.click();
    await expect(page).toHaveURL(/\/de\/cable-modem-monitor/);
  });
});

test.describe('Content Sections', () => {
  test('Homepage has philosophy section', async ({ page }) => {
    await page.goto('/');

    // AI-accelerated principle
    await expect(page.locator('text=AI-accelerated')).toBeVisible();
    // Systems-first principle
    await expect(page.locator('text=Systems-first')).toBeVisible();
    // Root cause principle
    await expect(page.locator('text=Root cause')).toBeVisible();
    // DRY architecture principle
    await expect(page.locator('text=DRY architecture')).toBeVisible();
  });

  test('Homepage has Why Solent section', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=/Why.*Solent/i')).toBeVisible();
  });

  test('Homepage has community section', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('section.community h2')).toContainText('Community');
    await expect(page.locator('section.community a[href*="github.com"]').first()).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('Mobile viewport renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Nav is visible
    await expect(page.locator('nav').first()).toBeVisible();

    // Language switcher is visible
    await expect(page.locator('.lang-switcher')).toBeVisible();
  });

  test('Tablet viewport renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page.locator('.container footer, footer:has-text("Solent Labs™")').first()).toBeVisible();
  });
});
