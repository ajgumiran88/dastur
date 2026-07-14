import { describe, it, expect } from 'vitest';
import { foodEstablishmentJsonLd, pageMeta } from './seo';

describe('seo', () => {
  it('emits FoodEstablishment with Emirati cuisine', () => {
    const ld = foodEstablishmentJsonLd('en');
    expect(ld['@type']).toBe('FoodEstablishment');
    expect(ld.servesCuisine).toBe('Emirati');
  });

  it('does not claim a dine-in address/geo (cloud kitchen)', () => {
    const ld = foodEstablishmentJsonLd('en');
    expect(ld.address).toBeUndefined();
    expect(ld.geo).toBeUndefined();
  });

  it('page meta carries hreflang alternates for both locales', () => {
    const m = pageMeta('en');
    const langs = m.hreflang.map((h) => h.hreflang);
    expect(langs).toEqual(expect.arrayContaining(['en', 'ar', 'x-default']));
  });

  it('canonical differs by locale', () => {
    expect(pageMeta('en').canonical).not.toBe(pageMeta('ar').canonical);
    expect(pageMeta('ar').canonical).toContain('/ar/');
  });
});
