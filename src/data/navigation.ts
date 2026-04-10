/**
 * Navigation links and mega menu structure.
 */

export interface NavDropdownItem {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  dropdown?: NavDropdownItem[];
  isSale?: boolean;
}

export const mainNavItems: NavItem[] = [
  { label: 'SALE', href: '/coming-soon', isSale: true },
  { label: 'SUMMER', href: '/coming-soon' },
  {
    label: 'NEW IN',
    href: '/coming-soon',
    dropdown: [
      { label: 'New Arrivals', href: '/coming-soon' },
      { label: 'Trending Now', href: '/coming-soon' },
      { label: 'Best Sellers', href: '/coming-soon' },
      { label: 'Coming Soon', href: '/coming-soon' },
    ],
  },
  {
    label: 'WOMEN',
    href: '/women',
    dropdown: [
      { label: 'Casual', href: '/women' },
      { label: 'Formal', href: '/women' },
      { label: 'Sports', href: '/women' },
      { label: 'Sneakers', href: '/women' },
    ],
  },
  {
    label: 'MEN',
    href: '/men',
    dropdown: [
      { label: 'Casual', href: '/men' },
      { label: 'Formal', href: '/men' },
      { label: 'Sports', href: '/men' },
      { label: 'Sneakers', href: '/men' },
    ],
  },
  {
    label: 'KIDS',
    href: '/kids',
    dropdown: [
      { label: 'Boys', href: '/kids' },
      { label: 'Girls', href: '/kids' },
      { label: 'Infants', href: '/kids' },
    ],
  },
  {
    label: 'BAGS',
    href: '/bags',
    dropdown: [
      { label: 'Handbags', href: '/bags' },
      { label: 'Backpacks', href: '/bags' },
      { label: 'Wallets', href: '/bags' },
    ],
  },
  { label: 'FRAGRANCES', href: '/coming-soon' },
  { label: 'BEST SELLER', href: '/coming-soon' },
  { label: 'NAYZA', href: '/coming-soon' },
  { label: 'PRET', href: '/coming-soon' },
];

export const footerLinks = {
  getInTouch: {
    email: 'intikhab.pakistan@gmail.com',
    phone: '0319 2776896',
    hours: 'Monday–Saturday, 10:00 am to 9:30 pm',
    whatsapp: true,
  },
  quickLinks: [
    { label: 'About Us', href: '/coming-soon' },
    { label: 'Careers', href: '/coming-soon' },
    { label: 'Blog', href: '/coming-soon' },
    { label: 'Press', href: '/coming-soon' },
  ],
  help: [
    { label: 'FAQ', href: '/coming-soon' },
    { label: 'Shipping', href: '/coming-soon' },
    { label: 'Returns', href: '/coming-soon' },
    { label: 'Size Guide', href: '/size-guide' },
  ],
  collections: [
    { label: 'Men', href: '/men' },
    { label: 'Women', href: '/women' },
    { label: 'Kids', href: '/kids' },
    { label: 'Bags', href: '/bags' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
  ],
};
