export interface NavItem {
  /** Section id / anchor target. */
  id: string;
  /** i18n key for the visible label. */
  key: string;
}

export const nav: NavItem[] = [
  { id: 'home', key: 'nav.home' },
  { id: 'menu', key: 'nav.menu' },
  { id: 'delivery', key: 'nav.delivery' },
  { id: 'story', key: 'nav.story' },
  { id: 'experience', key: 'nav.experience' },
  { id: 'contact', key: 'nav.contact' },
];
