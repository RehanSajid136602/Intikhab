import { cn } from '@/lib/utils';
import type { ProductBadge } from '@/types/product';

interface ProductBadgeComponentProps {
  badge: ProductBadge;
  className?: string;
}

/**
 * Absolute positioned product badge (SALE in red, NEW in green).
 */
function ProductBadgeComponent({ badge, className }: ProductBadgeComponentProps) {
  if (!badge) return null;

  const isSale = badge === 'SALE';

  return (
    <div
      className={cn(
        'absolute top-3 left-3 z-10 text-white text-[10px] font-semibold px-2 py-0.5 uppercase tracking-wider',
        isSale ? 'bg-brand-red' : 'bg-brand-green',
        className,
      )}
    >
      {badge}
    </div>
  );
}

export { ProductBadgeComponent };
export type { ProductBadgeComponentProps };
