/**
 * i18n Translation System
 *
 * Structure:
 * - src/i18n/en.json           → Source of truth (English)
 * - src/i18n/generated/*.json  → AI-generated translations
 * - src/i18n/overrides/*.json  → Human corrections (sparse, merged on top)
 *
 * The merge order is: generated + overrides, so human corrections always win.
 */

import en from './en.json';

// Import generated translations
import de from './generated/de.json';
import nl from './generated/nl.json';
import fr from './generated/fr.json';
import zh from './generated/zh.json';
import it from './generated/it.json';
import es from './generated/es.json';
import pl from './generated/pl.json';
import sv from './generated/sv.json';
import ru from './generated/ru.json';
import ptBr from './generated/pt-br.json';
import uk from './generated/uk.json';

// Import overrides (human corrections) - these may be empty/sparse
import deOverrides from './overrides/de.json';
import nlOverrides from './overrides/nl.json';
import frOverrides from './overrides/fr.json';
import zhOverrides from './overrides/zh.json';
import itOverrides from './overrides/it.json';
import esOverrides from './overrides/es.json';
import plOverrides from './overrides/pl.json';
import svOverrides from './overrides/sv.json';
import ruOverrides from './overrides/ru.json';
import ptBrOverrides from './overrides/pt-br.json';
import ukOverrides from './overrides/uk.json';

type TranslationData = typeof en;

/**
 * Deep merge two objects, with source values taking precedence
 */
function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof target[key] === 'object' &&
        target[key] !== null
      ) {
        result[key] = deepMerge(
          target[key] as Record<string, unknown>,
          source[key] as Record<string, unknown>
        ) as T[Extract<keyof T, string>];
      } else {
        result[key] = source[key] as T[Extract<keyof T, string>];
      }
    }
  }

  return result;
}

// Merge generated translations with human overrides
const translations: Record<string, TranslationData> = {
  en: en,
  de: deepMerge(de, deOverrides),
  nl: deepMerge(nl, nlOverrides),
  fr: deepMerge(fr, frOverrides),
  zh: deepMerge(zh, zhOverrides),
  it: deepMerge(it, itOverrides),
  es: deepMerge(es, esOverrides),
  pl: deepMerge(pl, plOverrides),
  sv: deepMerge(sv, svOverrides),
  ru: deepMerge(ru, ruOverrides),
  'pt-br': deepMerge(ptBr, ptBrOverrides),
  uk: deepMerge(uk, ukOverrides),
};

/**
 * Get translations for a specific locale
 */
export function getTranslations(locale: string): TranslationData {
  return translations[locale] || translations.en;
}

/**
 * Get a specific translation key using dot notation
 * e.g., t('hero.headline', 'en') => "Tools that surface hidden data."
 */
export function t(key: string, locale: string): string {
  const keys = key.split('.');
  let value: unknown = getTranslations(locale);

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      // Fallback to English if key not found
      value = getTranslations('en');
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = (value as Record<string, unknown>)[fallbackKey];
        } else {
          return key; // Return the key itself if not found
        }
      }
      break;
    }
  }

  return typeof value === 'string' ? value : key;
}

export type { TranslationData };
