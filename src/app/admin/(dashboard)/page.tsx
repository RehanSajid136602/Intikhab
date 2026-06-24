import { TrendingUp, ShoppingCart, Package, Users, MessageSquareText } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { SalesChart } from '@/components/admin/SalesChart';
import { RecentOrders } from '@/components/admin/RecentOrders';
import { LatestFeedback } from '@/components/admin/LatestFeedback';
import { createClient } from '@/lib/supabase/server';
import type { StatsCardConfig } from '@/types/admin';

async function getDashboardStats(): Promise<StatsCardConfig[]> {
  const supabase = createClient();

  // Fetch products count
  const { count: activeProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active');

  // Fetch orders
  const { data: orders } = await supabase
    .from('orders')
    .select('total, createdAt');

  // Fetch new feedback count
  const { count: newFeedback } = await supabase
    .from('feedback')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');

  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + (o.total || 0), 0) || 0;
  const productsSold = orders?.length || 0; // Simplified

  // Last month orders for change calc
  const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const lastMonthOrders = orders?.filter((o) => new Date(o.createdAt) < oneMonthAgo).length || 0;
  const orderChange = lastMonthOrders > 0
    ? Math.round(((totalOrders - lastMonthOrders) / lastMonthOrders) * 100)
    : 0;

  return [
    {
      title: 'Total Revenue',
      value: `PKR ${formatPKR(totalRevenue)}`,
      change: orderChange > 0 ? `+${orderChange}%` : orderChange < 0 ? `${orderChange}%` : 'No data yet',
      changeType: orderChange > 0 ? 'up' as const : orderChange < 0 ? 'down' as const : 'neutral' as const,
      icon: TrendingUp,
      iconBg: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      change: orderChange > 0 ? `+${orderChange}%` : orderChange < 0 ? `${orderChange}%` : 'No data yet',
      changeType: orderChange > 0 ? 'up' as const : orderChange < 0 ? 'down' as const : 'neutral' as const,
      icon: ShoppingCart,
      iconBg: 'bg-blue-500',
    },
    {
      title: 'Products Sold',
      value: `${productsSold} units`,
      change: orderChange > 0 ? `+${orderChange}%` : orderChange < 0 ? `${orderChange}%` : 'No data yet',
      changeType: orderChange > 0 ? 'up' as const : orderChange < 0 ? 'down' as const : 'neutral' as const,
      icon: Package,
      iconBg: 'bg-purple-500',
    },
    {
      title: 'Active Customers',
      value: totalOrders.toString(),
      change: orderChange > 0 ? `+${orderChange}%` : orderChange < 0 ? `${orderChange}%` : 'No data yet',
      changeType: orderChange > 0 ? 'up' as const : orderChange < 0 ? 'down' as const : 'neutral' as const,
      icon: Users,
      iconBg: 'bg-orange-500',
    },
    {
      title: 'New Feedback',
      value: (newFeedback || 0).toString(),
      change: '',
      changeType: 'neutral' as const,
      icon: MessageSquareText,
      iconBg: 'bg-amber-500',
    },
  ];
}

function formatPKR(value: number): string {
  return value.toLocaleString('en-PK');
}

/**
 * Admin dashboard page with real stats from Supabase, chart, and recent orders.
 */
export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  // Fetch recent orders for the RecentOrders component
  const supabase = createClient();
  const { data: recentOrders } = await supabase
    .from('orders')
    .select('id, "customerName", "customerEmail", total, status, "createdAt"')
    .order('createdAt', { ascending: false })
    .limit(10);

  const formattedOrders = (recentOrders || []).map((order) => ({
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    shippingAddress: '',
    items: [],
    total: order.total,
    status: order.status as 'Pending' | 'Processing' | 'Shipped' | 'Delivered',
    date: new Date(order.createdAt).toISOString().split('T')[0],
  }));

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Chart */}
      <SalesChart />

      {/* Orders + Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders orders={formattedOrders} />
        </div>
        <LatestFeedback />
      </div>
    </div>
  );
}
