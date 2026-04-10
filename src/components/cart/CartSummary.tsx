'use client';

import { useRouter } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { formatPKR } from '@/lib/utils';
import { ReturnPolicySnippet } from '@/components/ReturnPolicySnippet';

/**
 * Cart subtotal and checkout button.
 * Navigates to checkout form instead of opening WhatsApp directly.
 */
function CartSummary() {
  const { totalPrice, toggleCart, items } = useCartStore();
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty. Please add items to your cart before checkout.');
      return;
    }
    toggleCart(); // Close the cart drawer
    router.push('/checkout');
  };

  return (
    <div className="border-t border-brand-border pt-4 mt-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-brand-dark">Subtotal</span>
        <span className="text-sm font-bold text-brand-dark">
          {formatPKR(totalPrice)}
        </span>
      </div>
      <ReturnPolicySnippet variant="mini" className="mb-3" />
      <button
        onClick={handleCheckout}
        className="w-full bg-brand-red text-white text-xs font-bold uppercase tracking-widest py-3 hover:bg-red-600 transition-colors"
      >
        PROCEED TO CHECKOUT
      </button>
      <button
        onClick={toggleCart}
        className="w-full text-center text-xs font-medium text-brand-gray hover:text-brand-dark transition-colors uppercase tracking-wider"
      >
        CONTINUE SHOPPING
      </button>
    </div>
  );
}

export { CartSummary };
