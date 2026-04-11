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
    href: '/shoes/women',
    dropdown: [
      { label: 'Casual', href: '/shoes/women?subcategory=casual' },
      { label: 'Formal', href: '/shoes/women?subcategory=formal' },
      { label: 'Sports', href: '/shoes/women?subcategory=sports' },
      { label: 'Sneakers', href: '/shoes/women?subcategory=sneakers' },
    ],
  },
  {
    label: 'MEN',
    href: '/shoes/men',
    dropdown: [
      { label: 'Casual', href: '/shoes/men?subcategory=casual' },
      { label: 'Formal', href: '/shoes/men?subcategory=formal' },
      { label: 'Sports', href: '/shoes/men?subcategory=sports' },
      { label: 'Sneakers', href: '/shoes/men?subcategory=sneakers' },
    ],
  },
  {
    label: 'KIDS',
    href: '/shoes/kids',
    dropdown: [
      { label: 'Boys', href: '/shoes/kids?subcategory=boys' },
      { label: 'Girls', href: '/shoes/kids?subcategory=girls' },
      { label: 'Infants', href: '/shoes/kids?subcategory=infants' },
    ],
  },
  {
    label: 'BAGS',
    href: '/bags/women',
    dropdown: [
      { label: 'Handbags', href: '/bags/women?subcategory=handbags' },
      { label: 'Backpacks', href: '/bags/women?subcategory=backpacks' },
      { label: 'Clutches', href: '/bags/women?subcategory=clutches' },
    ],
  },
  {
    label: 'ACCESSORIES',
    href: '/accessories/unisex',
    dropdown: [
      { label: 'Belts', href: '/accessories/unisex?subcategory=belts' },
      { label: 'Wallets', href: '/accessories/unisex?subcategory=wallets' },
      { label: 'Socks', href: '/accessories/unisex?subcategory=socks' },
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
    { label: 'Blog', href: '/blog' },
    { label: 'Press', href: '/coming-soon' },
  ],
  help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping', href: '/coming-soon' },
    { label: 'Returns', href: '/terms-and-conditions' },
    { label: 'Size Guide', href: '/size-guide' },
  ],
  collections: [
    { label: 'Men\'s Shoes', href: '/shoes/men' },
    { label: 'Women\'s Shoes', href: '/shoes/women' },
    { label: 'Kids\' Shoes', href: '/shoes/kids' },
    { label: 'Bags', href: '/bags/women' },
    { label: 'Accessories', href: '/accessories/unisex' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
  ],
};
