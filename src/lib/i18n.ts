import en from '@/i18n/en.json';
import ar from '@/i18n/ar.json';

export type Locale = 'en' | 'ar';
export const LOCALES: Locale[] = ['en', 'ar'];
export const DEFAULT_LOCALE: Locale = 'en';

const DICT: Record<Locale, unknown> = { en, ar };

/** Text direction for a locale. */
export function dir(locale: Locale): 'ltr' | 'rtl' {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/** Root URL for a locale (optionally with a section hash). */
export function localizedPath(locale: Locale, hash?: string): string {
  const base = locale === 'ar' ? '/ar/' : '/';
  return hash ? `${base}#${hash}` : base;
}

/** The alternate locale (for a two-language switcher). */
export function otherLocale(locale: Locale): Locale {
  return locale === 'ar' ? 'en' : 'ar';
}

/**
 * Resolve a dot-path string key for a locale.
 * Returns the key itself when missing so content gaps are visible, never fatal.
 */
export function t(locale: Locale, key: string): string {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, DICT[locale]);
  return typeof value === 'string' ? value : key;
}

/**
 * Resolve a key expected to hold an array (e.g. experience steps).
 * Returns [] when missing.
 */
export function tList<T = unknown>(locale: Locale, key: string): T[] {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, DICT[locale]);
  return Array.isArray(value) ? (value as T[]) : [];
}

/** A bound translator for a locale — convenient in components. */
export function translator(locale: Locale) {
  return {
    t: (key: string) => t(locale, key),
    list: <T = unknown>(key: string) => tList<T>(locale, key),
    dir: dir(locale),
    locale,
  };
}
