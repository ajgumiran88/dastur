/* ============================================================================
   DASTUR — Gallery.
   Real packaging photography is extracted from the brand PDF. Dish/prep tiles
   are branded DEMO placeholders (data-demo) — replace with your own photos.
   `span` drives the asymmetric editorial layout.
   ========================================================================== */
import type { ImageMetadata } from 'astro';
import type { Locale } from '@/lib/i18n';

import ropeBoxes from '@/assets/packaging/rope-boxes.jpg';
import greenBento from '@/assets/packaging/green-bento.jpg';
import spoonBox from '@/assets/packaging/spoon-box.jpg';
import kraftBag from '@/assets/packaging/kraft-bag.jpg';

export type GallerySpan = 'std' | 'wide' | 'tall' | 'big';
export type GalleryAccent = 'palm' | 'oud' | 'indigo' | 'sand';
export type GalleryMotif = 'palm' | 'dhow' | 'windtower' | 'arch' | 'diamond';

export interface GalleryItem {
  id: string;
  kind: 'photo' | 'demo';
  image?: ImageMetadata;
  alt: Record<Locale, string>;
  span: GallerySpan;
  accent?: GalleryAccent;
  motif?: GalleryMotif;
  label?: Record<Locale, string>;
  demo?: boolean;
}

export const galleryItems: GalleryItem[] = [
  {
    id: 'g-rope',
    kind: 'photo',
    image: ropeBoxes,
    alt: {
      en: 'DASTUR rope-handle pyramid boxes with the engraved heritage skyline.',
      ar: 'صناديق دستور الهرمية بمقبض الحبل ونقش أفق المدينة التراثي.',
    },
    span: 'big',
  },
  {
    id: 'g-dish-machboos',
    kind: 'demo',
    accent: 'palm',
    motif: 'palm',
    label: { en: 'Machboos Laham', ar: 'مجبوس لحم' },
    alt: { en: 'Demo tile for a signature rice dish.', ar: 'بطاقة تجريبية لطبق أرز مميّز.' },
    span: 'std',
    demo: true,
  },
  {
    id: 'g-green',
    kind: 'photo',
    image: greenBento,
    alt: {
      en: 'Palm-green bento carry-box with dates, luqaimat and machboos.',
      ar: 'صندوق أخضر بأقسام يضم التمر واللقيمات والمجبوس.',
    },
    span: 'wide',
  },
  {
    id: 'g-prep',
    kind: 'demo',
    accent: 'oud',
    motif: 'windtower',
    label: { en: 'In the kitchen', ar: 'في المطبخ' },
    alt: { en: 'Demo tile for a preparation detail.', ar: 'بطاقة تجريبية لتفصيل التحضير.' },
    span: 'tall',
    demo: true,
  },
  {
    id: 'g-spoon',
    kind: 'photo',
    image: spoonBox,
    alt: {
      en: 'Cream carry-box with a brass spoon and engraved skyline.',
      ar: 'صندوق كريمي مع ملعقة نحاسية ونقش الأفق.',
    },
    span: 'std',
  },
  {
    id: 'g-ingredients',
    kind: 'demo',
    accent: 'sand',
    motif: 'diamond',
    label: { en: 'Loomi & dates', ar: 'لومي وتمر' },
    alt: { en: 'Demo tile for Emirati ingredients.', ar: 'بطاقة تجريبية للمكوّنات الإماراتية.' },
    span: 'std',
    demo: true,
  },
  {
    id: 'g-kraft',
    kind: 'photo',
    image: kraftBag,
    alt: {
      en: 'Kraft delivery bag with palm-green band and heritage skyline.',
      ar: 'كيس توصيل كرافت بشريط أخضر ونقش الأفق التراثي.',
    },
    span: 'wide',
  },
  {
    id: 'g-family',
    kind: 'demo',
    accent: 'indigo',
    motif: 'arch',
    label: { en: 'Family box', ar: 'صندوق العائلة' },
    alt: { en: 'Demo tile for the family sharing box.', ar: 'بطاقة تجريبية لصندوق مشاركة العائلة.' },
    span: 'std',
    demo: true,
  },
];
