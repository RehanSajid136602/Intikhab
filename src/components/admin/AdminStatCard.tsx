import type { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  iconBg: string;
}

function AdminStatCard({ label, value, icon: Icon, iconBg }: AdminStatCardProps) {
  return (
    <div className="bg-white rounded-sm border border-brand-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-full ${iconBg} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <p className="text-2xl font-bold text-brand-dark">{value}</p>
      <p className="text-xs text-brand-gray mt-0.5">{label}</p>
    </div>
  );
}

export { AdminStatCard };
