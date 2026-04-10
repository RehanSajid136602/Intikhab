'use client';

import { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatPKR } from '@/lib/utils';
import type { ChartDataPoint } from '@/types/admin';

const ranges = ['7D', '30D', '90D'] as const;

interface RevenueResponse {
  date: string;
  revenue: number;
}

async function fetchRevenueData(days: number): Promise<ChartDataPoint[]> {
  try {
    const res = await fetch(`/api/orders?limit=500`);
    if (!res.ok) return [];

    const orders = await res.json();
    const now = new Date();
    const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    // Create day buckets
    const buckets: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      buckets[key] = 0;
    }

    // Aggregate orders
    orders.forEach((order: Record<string, unknown>) => {
      const orderDate = new Date(order.createdAt as string).toISOString().split('T')[0];
      if (buckets[orderDate] !== undefined && order.status !== 'Cancelled') {
        buckets[orderDate] += (order.total as number) || 0;
      }
    });

    // Format for chart
    return Object.entries(buckets).map(([date, revenue]) => ({
      day: new Date(date + 'T00:00:00').toLocaleDateString('en-PK', {
        month: 'short',
        day: 'numeric',
      }),
      revenue,
    }));
  } catch {
    return [];
  }
}

/**
 * Revenue area chart with Recharts, date range tabs, and custom tooltip.
 * Fetches real order data from Supabase via API.
 */
function SalesChart() {
  const [range, setRange] = useState<'7D' | '30D' | '90D'>('7D');
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const daysMap = { '7D': 7, '30D': 30, '90D': 90 };
    const days = daysMap[range];
    setLoading(true);
    fetchRevenueData(days).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [range]);

  return (
    <div className="bg-white rounded-sm border border-brand-border p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">
          Revenue Overview
        </h3>
        <div className="flex gap-1">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-3 py-1 text-xs font-medium rounded-sm transition-colors ${
                r === range
                  ? 'bg-brand-dark text-white'
                  : 'text-brand-gray hover:bg-brand-light-gray'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-[300px] text-sm text-brand-gray">
          Loading chart...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E53935" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E53935" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#6B7280" />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#6B7280"
              tickFormatter={(v: number) => `${v / 1000}k`}
            />
            <Tooltip
              formatter={(value: number) => formatPKR(value)}
              contentStyle={{
                border: '1px solid #E8E8E8',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#E53935"
              fillOpacity={1}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export { SalesChart };
