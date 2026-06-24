'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { CartItemComponent } from './CartItem';
import { CartSummary } from './CartSummary';

/**
 * Cart drawer sliding from right with AnimatePresence, dark overlay, items list,
 * and empty state fallback.
 */
function CartDrawer() {
  const { isOpen, toggleCart, items } = useCartStore();
  const setCartDrawer = useUIStore((state) => state.setCartDrawer);

  const handleClose = () => {
    toggleCart();
    setCartDrawer(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[150]"
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed right-0 top-0 z-[160] flex h-full w-full max-w-md flex-col bg-brand-surface shadow-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-brand-border">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark">
                Your Cart
              </h3>
              <button
                onClick={handleClose}
                className="p-1 text-brand-gray hover:text-brand-dark transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                /* Empty State */
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                  <div className="w-20 h-20 bg-brand-light-gray rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-brand-gray" />
                  </div>
                  <p className="text-base font-semibold text-brand-dark mb-2">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-brand-gray mb-6 max-w-xs">
                    Looks like you haven't added anything to your cart yet
                  </p>
                  <button
                    onClick={handleClose}
                    className="primary-cta"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <CartItemComponent
                    key={item.lineId || `${item.id}:${item.size}`}
                    item={item}
                  />
                ))
              )}
            </div>

            {/* Summary */}
            {items.length > 0 && (
              <div className="p-4">
                <CartSummary />
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export { CartDrawer };
