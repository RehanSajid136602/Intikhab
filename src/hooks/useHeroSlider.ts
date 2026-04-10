import { useState, useEffect, useCallback, useRef } from 'react';
import { HERO_SLIDER } from '@/lib/constants';

/**
 * Hook managing hero slider state: current slide, auto-advance,
 * navigation, dot clicks, and pause on hover.
 */
interface UseHeroSliderReturn {
  currentSlide: number;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
}

export function useHeroSlider(): UseHeroSliderReturn {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback((index: number) => {
    const normalizedIndex =
      ((index % HERO_SLIDER.totalSlides) + HERO_SLIDER.totalSlides) %
      HERO_SLIDER.totalSlides;
    setCurrentSlide(normalizedIndex);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    if (isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDER.totalSlides);
    }, HERO_SLIDER.autoPlayInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  return {
    currentSlide,
    goToSlide,
    nextSlide,
    prevSlide,
    isPaused,
    setIsPaused,
  };
}
