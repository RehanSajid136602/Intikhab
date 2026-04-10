import { cn } from '@/lib/utils';

type BadgeColor = 'red' | 'green' | 'blue' | 'yellow' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
}

const colorClasses: Record<BadgeColor, string> = {
  red: 'bg-brand-red text-white',
  green: 'bg-brand-green text-white',
  blue: 'bg-blue-500 text-white',
  yellow: 'bg-yellow-400 text-brand-dark',
  purple: 'bg-purple-500 text-white',
};

/**
 * Status badge component with color variants.
 */
function Badge({ children, color = 'red', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider',
        colorClasses[color],
        className,
      )}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeColor, BadgeProps };
