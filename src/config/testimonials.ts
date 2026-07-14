/* ============================================================================
   DASTUR — Guest experiences (DEMO / PLACEHOLDER).
   These are sample quotes for layout only. Do NOT publish as verified reviews.
   Replace with your own approved testimonials before launch. No ratings are
   shown by design (avoid implying verified aggregate scores).
   ========================================================================== */
import type { Locale } from '@/lib/i18n';

export interface Testimonial {
  id: string;
  quote: Record<Locale, string>;
  author: string;
  location: string;
  demo: true;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote: {
      en: 'The machboos tasted like my grandmother’s table — and it arrived warm, in the most beautiful box.',
      ar: 'كان طعم المجبوس كمائدة جدتي — ووصل دافئاً في أجمل صندوق.',
    },
    author: 'Aisha M.',
    location: 'Dubai',
    demo: true,
  },
  {
    id: 't2',
    quote: {
      en: 'We ordered the family box for a gathering. Everything felt considered, from the food to the packaging.',
      ar: 'طلبنا صندوق العائلة لجمعة أهل. كان كل شيء مدروساً، من الطعام إلى التغليف.',
    },
    author: 'Khalid R.',
    location: 'Sharjah',
    demo: true,
  },
  {
    id: 't3',
    quote: {
      en: 'Luqaimat and gahwa after a long day — this is comfort, delivered with real care.',
      ar: 'لقيمات وقهوة بعد يوم طويل — راحة حقيقية تصل بعناية.',
    },
    author: 'Mariam A.',
    location: 'Abu Dhabi',
    demo: true,
  },
];
