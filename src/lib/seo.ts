import type { Locale } from '@/lib/i18n';
import { site } from '@/config/site';

export interface HreflangAlt {
  hreflang: string;
  href: string;
}

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  locale: Locale;
  hreflang: HreflangAlt[];
}

const ORIGIN = 'https://dastur.example'; // PLACEHOLDER — must match astro.config `site`.

function abs(path: string): string {
  return new URL(path, ORIGIN).href;
}

/** Head metadata for a locale route. */
export function pageMeta(locale: Locale): PageMeta {
  const canonical = abs(locale === 'ar' ? '/ar/' : '/');
  return {
    title: site.seo.title[locale],
    description: site.seo.description[locale],
    canonical,
    ogImage: abs(site.seo.ogImage),
    locale,
    hreflang: [
      { hreflang: 'en', href: abs('/') },
      { hreflang: 'ar', href: abs('/ar/') },
      { hreflang: 'x-default', href: abs('/') },
    ],
  };
}

/**
 * FoodEstablishment structured data adapted to a delivery-focused cloud kitchen.
 * Only broadly-safe fields are emitted. Address/geo/telephone are intentionally
 * omitted until verified business data is supplied (see README).
 */
export function foodEstablishmentJsonLd(locale: Locale): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FoodEstablishment',
    name: site.brand.name,
    description: site.seo.description[locale],
    servesCuisine: 'Emirati',
    url: ORIGIN + (locale === 'ar' ? '/ar/' : '/'),
    image: abs(site.seo.ogImage),
    priceRange: '$$',
    // Cloud kitchen: delivery/takeaway available, no dine-in seating.
    hasMenu: ORIGIN + (locale === 'ar' ? '/ar/#menu' : '/#menu'),
    servesCuisineDelivery: true,
    areaServed: site.serviceAreas.map((name) => ({
      '@type': 'AdministrativeArea',
      name,
    })),
    potentialAction: {
      '@type': 'OrderAction',
      target: ORIGIN + (locale === 'ar' ? '/ar/#delivery' : '/#delivery'),
      deliveryMethod: 'http://purl.org/goodrelations/v1#DeliveryModeOwnFleet',
    },
  };
}
