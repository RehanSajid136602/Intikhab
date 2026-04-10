import { cn } from '@/lib/utils';

type SkeletonVariant = 'rect' | 'circle' | 'text';

interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

/**
 * Loading skeleton component with variants for images, avatars, and text lines.
 */
function Skeleton({ variant = 'rect', className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        variant === 'rect' && 'rounded-sm',
        variant === 'circle' && 'rounded-full',
        variant === 'text' && 'h-4 rounded',
        className,
      )}
    />
  );
}

export { Skeleton };
export type { SkeletonProps };
