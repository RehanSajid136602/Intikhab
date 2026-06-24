import { cn } from '@/lib/utils';

type BadgeVariant = 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'gray';

const variantClasses: Record<BadgeVariant, string> = {
  red: 'bg-brand-red/10 text-brand-red border-brand-red/20',
  green: 'bg-brand-green/10 text-brand-green border-brand-green/20',
  blue: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  yellow: 'bg-yellow-400/10 text-yellow-600 border-yellow-400/20',
  purple: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  gray: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

interface AdminStatusBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

function AdminStatusBadge({ children, variant = 'gray', className }: AdminStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-sm border',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export { AdminStatusBadge };
export type { BadgeVariant };
