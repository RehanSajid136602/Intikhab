/**
 * Admin dashboard type definitions.
 */

import type { LucideIcon } from 'lucide-react';

export interface DashboardStats {
  revenue: { value: number; change: number; period: string };
  orders: { value: number; change: number; period: string };
  productsSold: { value: number; change: number; period: string };
  activeCustomers: { value: number; change: number; period: string };
}

export interface StatsCardConfig {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  iconBg: string;
}

export interface ChartDataPoint {
  day: string;
  revenue: number;
}

export interface AdminSidebarLink {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
}

export type CustomerStatus = 'active' | 'vip' | 'blocked';

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  totalSpent: number;
  status: CustomerStatus;
  joined: string;
  newsletter: boolean;
  notes: string | null;
}

export type MessageType = 'order-support' | 'size-question' | 'delivery' | 'return' | 'general';
export type MessageStatus = 'unread' | 'open' | 'resolved' | 'archived';

export interface AdminMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  body: string;
  type: MessageType;
  status: MessageStatus;
  date: string;
}

export interface StoreSettings {
  id: string;
  storeName: string;
  publicEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  storeLocation: string;
  businessHours: string;
  codEnabled: boolean;
  jazzcashEnabled: boolean;
  easypaisaEnabled: boolean;
  cardEnabled: boolean;
  freeDeliveryEnabled: boolean;
  freeDeliveryMinimum: number;
  standardDeliveryFee: number;
  estimatedDeliveryDays: number;
  newOrderEmailNotifications: boolean;
  lowStockAlerts: boolean;
  customerMessageAlerts: boolean;
  newsletterSignupAlerts: boolean;
}

export interface AppearanceSettings {
  id: string;
  storeName: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaLabel: string;
  heroCtaLink: string;
  heroImage: string | null;
  showHero: boolean;
  showCategoryCards: boolean;
  showInstagramFeed: boolean;
  showTestimonials: boolean;
  showNewsletter: boolean;
  showTrustBadges: boolean;
}

export type CustomerFilter = 'all' | 'active' | 'vip' | 'blocked';
export type MessageFilter = 'all' | 'unread' | 'open' | 'resolved' | 'archived';
export type MessageTypeFilter = 'all' | MessageType;
