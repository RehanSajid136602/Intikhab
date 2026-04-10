import { TrendingUp, ShoppingCart, Package, Users } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { SalesChart } from '@/components/admin/SalesChart';
import { RecentOrders } from '@/components/admin/RecentOrders';
import { dashboardStats, mockOrders } from '@/data/admin';
import type { StatsCardConfig } from '@/types/admin';

const statsConfig: StatsCardConfig[] = [
  {
    title: 'Total Revenue',
    value: `PKR ${dashboardStats.revenue.value.toLocaleString()}`,
    change: `+${dashboardStats.revenue.change}% from last month`,
    changeType: 'up',
    icon: TrendingUp,
    iconBg: 'bg-green-500',
  },
  {
    title: 'Total Orders',
    value: dashboardStats.orders.value.toString(),
    change: `+${dashboardStats.orders.change}% from last month`,
    changeType: 'up',
    icon: ShoppingCart,
    iconBg: 'bg-blue-500',
  },
  {
    title: 'Products Sold',
    value: `${dashboardStats.productsSold.value} pairs`,
    change: `+${dashboardStats.productsSold.change}% from last month`,
    changeType: 'up',
    icon: Package,
    iconBg: 'bg-purple-500',
  },
  {
    title: 'Active Customers',
    value: dashboardStats.activeCustomers.value.toString(),
    change: `+${dashboardStats.activeCustomers.change}% from last month`,
    changeType: 'up',
    icon: Users,
    iconBg: 'bg-orange-500',
  },
];

/**
 * Admin dashboard page with stats, chart, and recent orders.
 */
export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsConfig.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Chart */}
      <SalesChart />

      {/* Recent Orders */}
      <RecentOrders orders={mockOrders} />
    </div>
  );
}
