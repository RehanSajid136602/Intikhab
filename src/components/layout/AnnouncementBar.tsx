'use client';

import { useUIStore } from '@/stores/uiStore';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Red announcement marquee bar with close button.
 */
function AnnouncementBar() {
  const { announcementVisible, dismissAnnouncement } = useUIStore();

  return (
    <AnimatePresence>
      {announcementVisible && (
        <motion.div
          initial={{ height: 36, opacity: 1 }}
          exit={{ height: 0, opacity: 0, transition: { duration: 0.3 } }}
          className="bg-brand-red h-9 flex items-center overflow-hidden relative"
        >
          <div className="marquee-content flex items-center whitespace-nowrap pl-full">
            <span className="text-white text-xs font-medium tracking-wider uppercase">
              Summer Collection &apos;25 LIVE! Enjoy up to 50% OFF on your favorite articles. Free Delivery on all Prepaid Orders above PKR 5,000. Shop Now →
            </span>
          </div>
          <button
            onClick={dismissAnnouncement}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-lg hover:opacity-80"
            aria-label="Close announcement"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { AnnouncementBar };
