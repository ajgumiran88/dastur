/* ============================================================================
   DASTUR — Menu (DEMO CONTENT).
   Dishes, descriptions and prices are placeholders for demonstration only.
   Replace with your approved menu before launch. Every dish is flagged demo.
   Arabic names are placeholder transliterations — have them reviewed.
   ========================================================================== */
import type { Locale } from '@/lib/i18n';

export type DishTag =
  | 'vegetarian'
  | 'vegan'
  | 'spicy'
  | 'contains-nuts'
  | 'dairy'
  | 'gluten-free'
  | 'chef-signature';

export interface Dish {
  id: string;
  name: Record<Locale, string>;
  desc: Record<Locale, string>;
  price: number;
  currency: string;
  tags: DishTag[];
  /** Optional real/AI photo. When absent, a branded placeholder renders. */
  image?: string;
  demo: true;
}

export interface MenuCategory {
  id: string;
  /** i18n key for the category label. */
  key: string;
  /** Placeholder tint driving the demo card gradient. */
  accent: 'palm' | 'oud' | 'indigo' | 'sand';
  motif: 'palm' | 'dhow' | 'windtower' | 'arch' | 'diamond';
  dishes: Dish[];
}

const AED = 'AED';
const dishImages: Record<string, string> = {
  'machboos-laham': '/images/menu-food/rice.jpg',
  'machboos-robyan': '/images/menu-food/rice.jpg',
  'biryani-dajaj': '/images/menu-food/rice.jpg',
  'madrooba-rice': '/images/menu-food/rice.jpg',
  harees: '/images/menu-food/stew.jpg',
  thereed: '/images/menu-food/stew.jpg',
  salona: '/images/menu-food/stew.jpg',
  'mixed-grill': '/images/menu-food/grill.jpg',
  'samak-mashwi': '/images/menu-food/fish.jpg',
  'lamb-ouzi': '/images/menu-food/grill.jpg',
  regag: '/images/menu-food/breakfast.jpg',
  balaleet: '/images/menu-food/breakfast.jpg',
  fattoush: '/images/menu-food/salad.jpg',
  luqaimat: '/images/menu-food/dessert.jpg',
  khabees: '/images/menu-food/dessert.jpg',
  'date-pudding': '/images/menu-food/dessert.jpg',
  karak: '/images/menu-food/tea.jpg',
  gahwa: '/images/menu-food/coffee-dates.jpg',
  jallab: '/images/menu-food/tea.jpg',
  'family-feast': '/images/menu-food/grill.jpg',
  'majlis-box': '/images/menu-food/coffee-dates.jpg',
  'breakfast-box': '/images/menu-food/breakfast.jpg',
  'chicken-madrooba': '/images/menu-food/stew.jpg',
  'shish-tawook': '/images/menu-food/grill.jpg',
  hummus: '/images/menu-food/salad.jpg',
  'saffron-pudding': '/images/menu-food/dessert.jpg',
  'mint-tea': '/images/menu-food/tea.jpg',
  'grill-sharing-box': '/images/menu-food/grill.jpg',
};

const d = (
  id: string,
  en: string,
  ar: string,
  denEn: string,
  denAr: string,
  price: number,
  tags: DishTag[] = [],
): Dish => ({
  id,
  name: { en, ar },
  desc: { en: denEn, ar: denAr },
  price,
  currency: AED,
  tags,
  image: dishImages[id],
  demo: true,
});

export const menuCategories: MenuCategory[] = [
  {
    id: 'rice',
    key: 'menu.categories.rice',
    accent: 'palm',
    motif: 'palm',
    dishes: [
      d('machboos-laham', 'Machboos Laham', 'مجبوس لحم', 'Spiced slow-cooked lamb over fragrant loomi rice.', 'لحم مطهو على مهل مع أرز اللومي المتبّل.', 58, ['spicy', 'chef-signature']),
      d('machboos-robyan', 'Machboos Robyan', 'مجبوس روبيان', 'Gulf prawns folded through aromatic basmati.', 'روبيان خليجي مع أرز بسمتي عطري.', 64, ['spicy']),
      d('biryani-dajaj', 'Chicken Biryani', 'برياني دجاج', 'Layered saffron rice with tender marinated chicken.', 'أرز بالزعفران مع دجاج متبّل طري.', 46, []),
      d('madrooba-rice', 'Madrooba Rice Bowl', 'مضروبة', 'Creamy spiced grain bowl, a winter comfort.', 'وعاء حبوب كريمي متبّل، دفء الشتاء.', 42, ['dairy']),
    ],
  },
  {
    id: 'favorites',
    key: 'menu.categories.favorites',
    accent: 'oud',
    motif: 'windtower',
    dishes: [
      d('harees', 'Harees', 'هريس', 'Slow-whipped wheat and lamb, silken and warm.', 'قمح ولحم مخفوق ببطء، ناعم ودافئ.', 38, ['chef-signature']),
      d('thereed', 'Thereed', 'ثريد', 'Layered regag bread in rich vegetable and lamb stew.', 'رقاق مع مرق الخضار واللحم الغني.', 44, []),
      d('salona', 'Salona', 'صالونة', 'Home-style tomato broth with the day’s vegetables.', 'مرق طماطم منزلي مع خضار اليوم.', 36, ['spicy']),
      d('chicken-madrooba', 'Chicken Madrooba', 'مضروبة الدجاج', 'Slow-cooked chicken and rice with warming spices.', 'دجاج وأرز مطهو ببطء مع التوابل.', 40, []),
    ],
  },
  {
    id: 'grills',
    key: 'menu.categories.grills',
    accent: 'indigo',
    motif: 'dhow',
    dishes: [
      d('mixed-grill', 'DASTUR Mixed Grill', 'مشاوي دستور', 'Lamb kofta, shish tawook and tikka over embers.', 'كفتة وشيش طاووق وتكة على الجمر.', 72, ['chef-signature']),
      d('samak-mashwi', 'Samak Mashwi', 'سمك مشوي', 'Whole gulf fish, charred and dressed with loomi.', 'سمك خليجي مشوي بلمسة اللومي.', 68, []),
      d('lamb-ouzi', 'Lamb Ouzi', 'قوزي', 'Whole-roast lamb shoulder over jewelled rice.', 'كتف خروف محمّر على أرز مزيّن.', 88, ['contains-nuts']),
      d('shish-tawook', 'Shish Tawook', 'شيش طاووق', 'Chargrilled chicken skewers with garlic sauce and flatbread.', 'أسياخ دجاج مشوية مع صلصة الثوم والخبز.', 48, []),
    ],
  },
  {
    id: 'sides',
    key: 'menu.categories.sides',
    accent: 'palm',
    motif: 'diamond',
    dishes: [
      d('regag', 'Regag with Cheese', 'رقاق بالجبن', 'Crisp thin bread with melted cheese and egg.', 'خبز رقيق مقرمش مع جبن وبيض.', 24, ['vegetarian', 'dairy']),
      d('balaleet', 'Balaleet', 'بلاليط', 'Sweet-savory vermicelli with saffron and egg.', 'شعيرية حلوة مالحة بالزعفران والبيض.', 22, ['vegetarian', 'dairy']),
      d('fattoush', 'Loomi Fattoush', 'فتوش باللومي', 'Garden greens, sumac and dried-lime dressing.', 'خضار طازجة مع السماق وصلصة اللومي.', 26, ['vegetarian', 'vegan']),
      d('hummus', 'Hummus with Olive Oil', 'حمص بزيت الزيتون', 'Creamy chickpeas and tahini, finished with olive oil.', 'حمص كريمي مع الطحينة وزيت الزيتون.', 22, ['vegan']),
    ],
  },
  {
    id: 'desserts',
    key: 'menu.categories.desserts',
    accent: 'oud',
    motif: 'diamond',
    dishes: [
      d('luqaimat', 'Luqaimat', 'لقيمات', 'Golden dumplings in date syrup and sesame.', 'كرات ذهبية بدبس التمر والسمسم.', 28, ['vegetarian', 'contains-nuts', 'chef-signature']),
      d('khabees', 'Khabees', 'خبيص', 'Toasted flour pudding scented with cardamom.', 'حلوى الطحين المحمّص بالهيل.', 24, ['vegetarian', 'dairy']),
      d('date-pudding', 'Date & Tahini Pudding', 'حلوى التمر والطحينة', 'Warm date pudding, tahini cream.', 'حلوى تمر دافئة مع كريمة الطحينة.', 26, ['vegetarian', 'contains-nuts']),
      d('saffron-pudding', 'Saffron Milk Pudding', 'مهلبية بالزعفران', 'Silky milk pudding scented with saffron and rose water.', 'مهلبية ناعمة بالزعفران وماء الورد.', 24, ['vegetarian', 'dairy']),
    ],
  },
  {
    id: 'beverages',
    key: 'menu.categories.beverages',
    accent: 'sand',
    motif: 'palm',
    dishes: [
      d('karak', 'Karak Chai', 'كرك', 'Strong spiced milk tea, the everyday ritual.', 'شاي حليب متبّل قوي، طقس كل يوم.', 9, ['dairy']),
      d('gahwa', 'Gahwa Arabiya', 'قهوة عربية', 'Cardamom coffee with dates, served the traditional way.', 'قهوة بالهيل مع التمر، تُقدَّم على الأصول.', 14, []),
      d('jallab', 'Jallab', 'جلاب', 'Date-molasses cooler with pine nuts and rose.', 'مشروب دبس منعش مع الصنوبر وماء الورد.', 16, ['vegan', 'contains-nuts']),
      d('mint-tea', 'Fresh Mint Tea', 'شاي بالنعناع', 'Fresh mint steeped in black tea, served warm.', 'شاي أسود بالنعناع الطازج يقدم دافئاً.', 10, ['vegan']),
    ],
  },
  {
    id: 'boxes',
    key: 'menu.categories.boxes',
    accent: 'palm',
    motif: 'arch',
    dishes: [
      d('family-feast', 'Family Feast Box', 'صندوق وليمة العائلة', 'A shareable spread for four: rice, grills, sides, sweets.', 'مائدة لأربعة: أرز ومشاوي وجوانب وحلويات.', 249, ['chef-signature']),
      d('majlis-box', 'Majlis Sharing Box', 'صندوق المجلس', 'Coffee, dates, luqaimat and savory bites for guests.', 'قهوة وتمر ولقيمات ولقمات مالحة للضيوف.', 149, ['vegetarian', 'contains-nuts']),
      d('breakfast-box', 'Emirati Breakfast Box', 'صندوق الفطور الإماراتي', 'Balaleet, regag, cheese, honey and karak for two.', 'بلاليط ورقاق وجبن وعسل وكرك لاثنين.', 96, ['vegetarian', 'dairy']),
      d('grill-sharing-box', 'Grill Sharing Box', 'صندوق المشاوي للمشاركة', 'Chicken skewers, lamb kofta, bread and dips for four.', 'أسياخ دجاج وكفتة وخبز ومقبلات لأربعة.', 219, []),
    ],
  },
];
