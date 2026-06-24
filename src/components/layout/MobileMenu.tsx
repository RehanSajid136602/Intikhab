'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useUIStore } from '@/stores/uiStore';
import { mainNavItems } from '@/data/navigation';

/**
 * Full-screen mobile slide-in menu drawer.
 */
function MobileMenu() {
  const { mobileMenuOpen, setMobileMenu } = useUIStore();

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] bg-white md:hidden"
        >
          <div className="p-4 flex justify-between items-center border-b border-brand-border">
            <span className="text-xl font-bold text-brand-dark">Intikhab</span>
            <button
              onClick={() => setMobileMenu(false)}
              className="p-2"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-4 space-y-2">
            {mainNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenu(false)}
                className={`block rounded-control px-3 py-3 ${
                  item.isSale
                    ? 'text-brand-red font-semibold'
                    : 'text-brand-dark font-semibold'
                } hover:bg-brand-light-gray`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { MobileMenu };
