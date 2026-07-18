/**
 * Brand constants, breakpoints, and configuration values.
 */

export const BRAND = {
  name: 'Intikhab',
  tagline: 'Selection That Matters',
  email: 'intikhab.pakistan@gmail.com',
  phone: '+92 332 3130689',
  facebook: 'https://www.facebook.com/share/1AjG4bGKpc/',
  instagram: 'https://www.instagram.com/intikhab_pakistan?igsh=aW5yaWJldTc0d2F2',
  instagramHandle: '@intikhab_pakistan',
} as const;

export const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1440,
} as const;

export const HERO_SLIDER = {
  autoPlayInterval: 5000,
  transitionDuration: 800,
  totalSlides: 3,
} as const;

export const ROUTES = {
  home: '/',
  admin: '/admin',
  adminDashboard: '/admin',
  adminProducts: '/admin/products',
  adminOrders: '/admin/orders',
  adminCustomers: '/admin/customers',
  adminCategories: '/admin/categories',
  adminCoupons: '/admin/coupons',
  adminReviews: '/admin/reviews',
  adminAppearance: '/admin/appearance',
  adminMessages: '/admin/messages',
  adminFeedback: '/admin/feedback',
  adminSettings: '/admin/settings',
  feedback: '/feedback',
} as const;

export const ADMIN_SIDEBAR_WIDTH = {
  desktop: 260,
  tablet: 72,
} as const;

export const ADMIN_TOPBAR_HEIGHT = 64;
