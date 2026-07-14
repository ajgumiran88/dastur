/* ============================================================================
   DASTUR — Business configuration.
   EVERY value here is a PLACEHOLDER. Replace with verified details before
   launch (see README "Verify Before Launch"). Nothing here is confirmed.
   ========================================================================== */
import type { Locale } from '@/lib/i18n';

export interface SocialLink {
  name: string;
  label: string;
  url: string;
  enabled: boolean;
}

export interface DeliveryPlatform {
  name: string;
  url: string;
  enabled: boolean;
  demo: boolean;
}

export interface SiteConfig {
  brand: {
    name: string;
    legalName: string;
    tagline: string;
    cuisine: string;
  };
  contact: {
    /** International format, digits may include spaces — normalized at link build. */
    phone: string;
    whatsapp: string;
    email: string;
  };
  serviceAreas: string[];
  hours: string;
  minOrder: string;
  deliveryEta: string;
  socials: SocialLink[];
  deliveryPlatforms: DeliveryPlatform[];
  /** Direct online-ordering page (your own storefront). Placeholder. */
  orderOnlineUrl: string;
  legal: {
    privacy: string;
    terms: string;
    allergen: string;
  };
  seo: {
    title: Record<Locale, string>;
    description: Record<Locale, string>;
    ogImage: string;
    themeColor: string;
  };
}

export const site: SiteConfig = {
  brand: {
    name: 'DASTUR',
    legalName: 'DASTUR Cloud Kitchen', // PLACEHOLDER legal entity name
    tagline: 'Heritage Inspiration. Modern Experience.',
    cuisine: 'Emirati',
  },
  contact: {
    phone: '+971 4 000 0000', // PLACEHOLDER
    whatsapp: '+971 50 000 0000', // PLACEHOLDER
    email: 'orders@dastur.example', // PLACEHOLDER
  },
  serviceAreas: ['Dubai', 'Sharjah', 'Abu Dhabi'], // PLACEHOLDER
  hours: '12:00 PM – 11:00 PM, daily', // PLACEHOLDER
  minOrder: 'AED 50', // PLACEHOLDER
  deliveryEta: '35–55 minutes', // PLACEHOLDER
  orderOnlineUrl: '#', // PLACEHOLDER — your direct ordering storefront
  socials: [
    { name: 'instagram', label: 'Instagram', url: '#', enabled: true },
    { name: 'tiktok', label: 'TikTok', url: '#', enabled: true },
    { name: 'facebook', label: 'Facebook', url: '#', enabled: false },
  ],
  deliveryPlatforms: [
    // Enable/disable per confirmed partnership. Do NOT enable unconfirmed platforms.
    { name: 'Talabat', url: '#', enabled: true, demo: true },
    { name: 'Deliveroo', url: '#', enabled: true, demo: true },
    { name: 'Careem', url: '#', enabled: true, demo: true },
    { name: 'Noon Food', url: '#', enabled: true, demo: true },
  ],
  legal: {
    privacy: '#privacy', // PLACEHOLDER — link to your Privacy Policy
    terms: '#terms', // PLACEHOLDER — link to your Terms
    allergen: '#allergen', // PLACEHOLDER — link to Allergen Notice
  },
  seo: {
    title: {
      en: 'DASTUR — Contemporary Emirati Cuisine · Cloud Kitchen',
      ar: 'دستور — مطبخ إماراتي معاصر · مطبخ سحابي',
    },
    description: {
      en: 'Authentic Emirati flavors reimagined for today — freshly prepared and delivered in premium heritage packaging. A contemporary Emirati cloud kitchen.',
      ar: 'نكهات إماراتية أصيلة بروح عصرية — تُحضَّر طازجة وتصل بتغليف تراثي فاخر. مطبخ إماراتي معاصر.',
    },
    ogImage: '/og-image.jpg',
    themeColor: '#1c2630',
  },
};
