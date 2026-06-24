'use client';

import { useRef, useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores/uiStore';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Slide-down search input below nav links.
 */
function SearchBar() {
  const { searchOpen, setSearch } = useUIStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [query, setQuery] = useState('');

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
          <form
            className="relative"
            onSubmit={(event) => {
              event.preventDefault();
              const trimmed = query.trim();
              if (!trimmed) return;
              setSearch(false);
              router.push(`/products?search=${encodeURIComponent(trimmed)}`);
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for products, brands..."
              className="form-field pr-24"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <button
                type="submit"
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
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { SearchBar };
