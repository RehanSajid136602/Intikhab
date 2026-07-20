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
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/products' },
  {
    label: 'New Arrivals',
    href: '/products?sort=latest',
    dropdown: [
      { label: 'All New Arrivals', href: '/products?sort=latest' },
      { label: 'Women', href: '/shoes/women?sort=latest' },
      { label: 'Men', href: '/shoes/men?sort=latest' },
      { label: 'Kids', href: '/shoes/kids?sort=latest' },
    ],
  },
  {
    label: 'Categories',
    href: '/categories',
    dropdown: [
      { label: "Women's Shoes", href: '/shoes/women' },
      { label: "Men's Shoes", href: '/shoes/men' },
      { label: "Kids' Shoes", href: '/shoes/kids' },
      { label: 'Bags', href: '/bags/women' },
      { label: 'Accessories', href: '/accessories/unisex' },
    ],
  },
  {
    label: 'Women',
    href: '/shoes/women',
    dropdown: [
      { label: 'Casual', href: '/shoes/women?subcategory=casual' },
      { label: 'Formal', href: '/shoes/women?subcategory=formal' },
      { label: 'Sports', href: '/shoes/women?subcategory=sports' },
      { label: 'Sneakers', href: '/shoes/women?subcategory=sneakers' },
    ],
  },
  {
    label: 'Men',
    href: '/shoes/men',
    dropdown: [
      { label: 'Casual', href: '/shoes/men?subcategory=casual' },
      { label: 'Formal', href: '/shoes/men?subcategory=formal' },
      { label: 'Sports', href: '/shoes/men?subcategory=sports' },
      { label: 'Sneakers', href: '/shoes/men?subcategory=sneakers' },
    ],
  },
  {
    label: 'Kids',
    href: '/shoes/kids',
    dropdown: [
      { label: 'Boys', href: '/shoes/kids?subcategory=boys' },
      { label: 'Girls', href: '/shoes/kids?subcategory=girls' },
      { label: 'Infants', href: '/shoes/kids?subcategory=infants' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const footerLinks = {
  quickLinks: [
    { label: 'About Us', href: '/about' },
    { label: 'Shop All', href: '/products' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  help: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Shipping', href: '/shipping-policy' },
    { label: 'Returns & Exchanges', href: '/return-exchange-policy' },
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
    { label: 'Return & Exchange Policy', href: '/return-exchange-policy' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
  ],
};
