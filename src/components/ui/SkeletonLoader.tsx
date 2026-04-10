/**
 * Reusable skeleton loader components.
 */

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-sm overflow-hidden border border-brand-border">
      <div className="aspect-square bg-brand-light-gray animate-pulse" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-brand-light-gray rounded animate-pulse w-1/3" />
        <div className="h-4 bg-brand-light-gray rounded animate-pulse w-3/4" />
        <div className="h-4 bg-brand-light-gray rounded animate-pulse w-1/4" />
        <div className="h-8 bg-brand-light-gray rounded animate-pulse w-full mt-3" />
      </div>
    </div>
  );
}

export function FormFieldSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-4 bg-brand-light-gray rounded animate-pulse w-1/4" />
      <div className="h-10 bg-brand-light-gray rounded animate-pulse" />
    </div>
  );
}
