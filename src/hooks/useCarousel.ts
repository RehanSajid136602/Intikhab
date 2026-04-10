import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * Hook managing horizontal carousel scroll position, navigation,
 * and arrow visibility based on scroll boundaries.
 */
interface UseCarouselReturn {
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollLeft: () => void;
  scrollRight: () => void;
}

export function useCarousel(): UseCarouselReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  }, []);

  const scrollLeft = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({ left: -container.clientWidth / 2, behavior: 'smooth' });
  }, []);

  const scrollRight = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollBy({ left: container.clientWidth / 2, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateScrollState();
    container.addEventListener('scroll', updateScrollState);
    window.addEventListener('resize', updateScrollState);

    return () => {
      container.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  return {
    containerRef,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
  };
}
