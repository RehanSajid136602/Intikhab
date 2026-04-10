import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPKR } from '@/lib/utils';
import type { StatsCardConfig } from '@/types/admin';

/**
 * Admin stats metric card with title, value, change percentage, icon, and colored bg.
 */
function StatsCard({ title, value, change, changeType, icon: Icon, iconBg }: StatsCardConfig) {
  return (
    <div className="bg-white rounded-sm border border-brand-border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-1">
          {changeType === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : changeType === 'down' ? (
            <TrendingDown className="w-4 h-4 text-brand-red" />
          ) : null}
          <span
            className={`text-sm font-medium ${
              changeType === 'up' ? 'text-green-500' : changeType === 'down' ? 'text-brand-red' : 'text-brand-gray'
            }`}
          >
            {changeType === 'up' ? '+' : ''}{change}%
          </span>
        </div>
      </div>
      <h3 className="text-2xl font-bold text-brand-dark">{value}</h3>
      <p className="text-xs text-brand-gray mt-1">{title}</p>
    </div>
  );
}

export { StatsCard };
export type { StatsCardConfig };
