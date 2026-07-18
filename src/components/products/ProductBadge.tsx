import { cn } from '@/lib/utils';
import type { ProductBadge } from '@/types/product';

interface ProductBadgeComponentProps {
  badge: ProductBadge;
  comingSoon?: boolean;
  className?: string;
}

/**
 * Absolute positioned product badge (SALE in red, NEW in green, COMING SOON in amber).
 */
function ProductBadgeComponent({ badge, comingSoon, className }: ProductBadgeComponentProps) {
  const label = comingSoon ? "COMING SOON" : badge;
  if (!label) return null;

  const color = comingSoon
    ? 'bg-amber-600'
    : badge === 'SALE'
      ? 'bg-brand-red'
      : 'bg-brand-green';

  return (
    <div
      className={cn(
        'absolute top-3 left-3 z-10 text-white text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider',
        color,
        className,
      )}
    >
      {label}
    </div>
  );
}

export { ProductBadgeComponent };
export type { ProductBadgeComponentProps };
