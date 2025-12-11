// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 12 languages based on Home Assistant user demographics
// See: https://analytics.home-assistant.io/
export const locales = {
  en: { label: 'English', flag: '🇺🇸' },
  de: { label: 'Deutsch', flag: '🇩🇪' },
  nl: { label: 'Nederlands', flag: '🇳🇱' },
  fr: { label: 'Français', flag: '🇫🇷' },
  zh: { label: '中文', flag: '🇨🇳' },
  it: { label: 'Italiano', flag: '🇮🇹' },
  es: { label: 'Español', flag: '🇪🇸' },
  pl: { label: 'Polski', flag: '🇵🇱' },
  sv: { label: 'Svenska', flag: '🇸🇪' },
  ru: { label: 'Русский', flag: '🇷🇺' },
  'pt-br': { label: 'Português', flag: '🇧🇷' },
  uk: { label: 'Українська', flag: '🇺🇦' },
};

export default defineConfig({
  site: 'https://solentlabs.io',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'en',
    locales: Object.keys(locales),
    routing: {
      prefixDefaultLocale: false, // /about instead of /en/about
    },
  },
  build: {
    format: 'directory', // /de/index.html instead of /de.html
  },
});
