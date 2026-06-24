'use client';

import dynamic from 'next/dynamic';

const OrdersTable = dynamic(
  () => import('@/components/admin/OrdersTable'),
  { 
    loading: () => <TableSkeleton />,
    ssr: false
  },
);

function TableSkeleton() {
  return (
    <div className="bg-white rounded-sm border border-brand-border p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

/**
 * Admin orders page with status filter tabs, date range filter, orders table, export button.
 */
export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <OrdersTable />
    </div>
  );
}
