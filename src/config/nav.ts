export interface NavItem {
  /** Section id / anchor target. */
  id: string;
  /** i18n key for the visible label. */
  key: string;
}

export const nav: NavItem[] = [
  { id: 'home', key: 'nav.home' },
  { id: 'story', key: 'nav.story' },
  { id: 'menu', key: 'nav.menu' },
  { id: 'experience', key: 'nav.experience' },
  { id: 'delivery', key: 'nav.delivery' },
  { id: 'contact', key: 'nav.contact' },
];
