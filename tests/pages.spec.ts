import { test, expect } from '@playwright/test';

const LANGUAGES = [
  { code: 'en', path: '/', title: 'Solent Labs™' },
  { code: 'pt-br', path: '/lang/pt-br/', title: 'Solent Labs™' },
  { code: 'es', path: '/lang/es/', title: 'Solent Labs™' },
  { code: 'de', path: '/lang/de/', title: 'Solent Labs™' },
  { code: 'fr', path: '/lang/fr/', title: 'Solent Labs™' },
];

test.describe('Page Rendering', () => {
  for (const lang of LANGUAGES) {
    test(`${lang.code.toUpperCase()} page loads correctly`, async ({ page }) => {
      await page.goto(lang.path);

      // Title is correct
      await expect(page).toHaveTitle(lang.title);

      // Logo is visible
      await expect(page.locator('header img')).toBeVisible();

      // Projects section exists
      await expect(page.locator('h2').first()).toBeVisible();

      // Footer is visible
      await expect(page.locator('footer')).toBeVisible();
      await expect(page.locator('footer')).toContainText('Solent Labs™');
    });

    test(`${lang.code.toUpperCase()} page has working language switcher`, async ({ page }) => {
      await page.goto(lang.path);

      // Language switcher exists with all 5 options
      const langSwitcher = page.locator('nav.lang-switcher');
      await expect(langSwitcher).toBeVisible();
      await expect(langSwitcher.locator('a')).toHaveCount(5);
    });
  }
});

test.describe('Content', () => {
  test('Home page has project links', async ({ page }) => {
    await page.goto('/');

    // Cable Modem Monitor link
    const cmmLink = page.locator('a[href*="cable_modem_monitor"]');
    await expect(cmmLink).toBeVisible();
    await expect(cmmLink).toContainText('Cable Modem Monitor');

    // Internet Health Monitor (coming soon)
    await expect(page.locator('text=Internet Health Monitor')).toBeVisible();
    await expect(page.locator('.badge')).toContainText('Coming Soon');
  });

  test('Why Solent section exists', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=Why "Solent"?')).toBeVisible();
    await expect(page.locator('text=The stay:')).toBeVisible();
    await expect(page.locator('text=The strait:')).toBeVisible();
    await expect(page.locator('text=The method:')).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('Mobile viewport renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('header img')).toBeVisible();
    await expect(page.locator('nav.lang-switcher')).toBeVisible();
  });
});
