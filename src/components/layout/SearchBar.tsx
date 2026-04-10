'use client';

import { useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Slide-down search input below nav links.
 */
function SearchBar() {
  const { searchOpen, setSearch } = useUIStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="pb-4"
        >
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for products, brands..."
              className="w-full border border-brand-border px-4 py-3 text-sm focus:outline-none focus:border-brand-dark pr-12"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                className="text-brand-gray hover:text-brand-dark"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSearch(false)}
                className="text-brand-gray hover:text-brand-dark"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { SearchBar };
