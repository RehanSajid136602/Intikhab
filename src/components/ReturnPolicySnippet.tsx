import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ReturnPolicySnippetProps {
  variant?: 'mini' | 'full';
  className?: string;
}

/**
 * Return policy snippet component with mini and full variants.
 * Mini: One line for product detail/cart
 * Full: Detailed version for checkout
 */
export function ReturnPolicySnippet({
  variant = 'mini',
  className,
}: ReturnPolicySnippetProps) {
  if (variant === 'mini') {
    return (
      <div className={cn('text-xs text-brand-gray', className)}>
        🔄 30-day returns · 📦 Free size exchange · ✅ 100% authentic
      </div>
    );
  }

  return (
    <div className={cn('bg-gray-50 p-4 rounded-lg', className)}>
      <p className="text-sm text-brand-dark mb-2">
        <strong>Return Policy:</strong>
      </p>
      <p className="text-sm text-brand-gray mb-2">
        🔄 30-day easy returns on all orders
      </p>
      <p className="text-sm text-brand-gray mb-2">
        📦 Free exchange if size doesn't fit
      </p>
      <p className="text-sm text-brand-gray mb-4">
        ✅ 100% authentic products guaranteed
      </p>
      <Link
        href="/terms-and-conditions"
        className="text-sm text-brand-red hover:underline"
      >
        Full return policy →
      </Link>
    </div>
  );
}
