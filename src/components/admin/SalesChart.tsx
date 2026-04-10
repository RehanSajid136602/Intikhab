'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  weeklyRevenue,
  monthlyRevenue,
  quarterlyRevenue,
} from '@/data/admin';
import { formatPKR } from '@/lib/utils';
import type { ChartDataPoint } from '@/types/admin';

const ranges = ['7D', '30D', '90D'] as const;

const dataMap: Record<string, ChartDataPoint[]> = {
  '7D': weeklyRevenue,
  '30D': monthlyRevenue,
  '90D': quarterlyRevenue,
};

/**
 * Revenue area chart with Recharts, date range tabs, and custom tooltip.
 */
function SalesChart() {
  const [range, setRange] = useState<'7D' | '30D' | '90D'>('7D');
  const data = dataMap[range];

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
    </div>
  );
}

export { SalesChart };
