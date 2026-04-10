import { useInView, type UseInViewOptions } from 'framer-motion';
import { useRef, type RefObject } from 'react';

interface UseScrollRevealReturn {
  ref: React.RefObject<HTMLElement | null>;
  isInView: boolean;
}

export function useScrollReveal(
  options?: UseInViewOptions,
): UseScrollRevealReturn {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref as RefObject<HTMLDivElement>, {
    once: true,
    margin: '-100px',
    ...options,
  });

  return { ref, isInView };
}
