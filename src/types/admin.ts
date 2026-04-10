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
