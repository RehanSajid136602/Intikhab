'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCarousel } from '@/hooks/useCarousel';
import { cn } from '@/lib/utils';

interface ProductCarouselProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Scrollable horizontal carousel wrapper with prev/next arrow buttons.
 */
function ProductCarousel({ children, className }: ProductCarouselProps) {
  const { containerRef, canScrollLeft, canScrollRight, scrollLeft, scrollRight } =
    useCarousel();

  return (
    <div className="relative">
      {/* Left Arrow */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={containerRef}
        className={cn('overflow-x-auto scrollbar-hide scroll-smooth', className)}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {children}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 rounded-full shadow-md flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export { ProductCarousel };
export type { ProductCarouselProps };
