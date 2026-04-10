import { cn } from '@/lib/utils';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * Centered section title with em-dash prefix/suffix and optional subtitle.
 */
function SectionTitle({ title, subtitle, className }: SectionTitleProps) {
  return (
    <div className={cn('text-center mb-8', className)}>
      <h2 className="text-lg md:text-xl font-semibold text-brand-dark">
        — {title} —
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm text-brand-gray">{subtitle}</p>
      )}
    </div>
  );
}

export { SectionTitle };
export type { SectionTitleProps };
