import { useState, useEffect, useCallback, useRef } from 'react';

const AUTO_ADVANCE_INTERVAL = 3000;

/**
 * Hook that auto-cycles through a product's images every 3 seconds.
 * Pauses on hover. Respects prefers-reduced-motion.
 * Returns current image index and pause control.
 */
interface UseProductImageCarouselReturn {
  currentImageIndex: number;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}

export function useProductImageCarousel(
  imageCount: number,
): UseProductImageCarouselReturn {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (imageCount <= 1 || prefersReducedMotion) return;
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imageCount);
    }, AUTO_ADVANCE_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [imageCount, isPaused]);

  return { currentImageIndex, isPaused, setIsPaused };
}
