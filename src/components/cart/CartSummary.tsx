'use client';

import { useCartStore } from '@/stores/cartStore';
import { formatPKR } from '@/lib/utils';
import { BRAND } from '@/lib/constants';
import { ReturnPolicySnippet } from '@/components/ReturnPolicySnippet';

/**
 * Cart subtotal and checkout button.
 */
function CartSummary() {
  const { totalPrice, toggleCart, items } = useCartStore();

  const handleCheckout = () => {
    // Check if cart is empty
    if (items.length === 0) {
      alert('Your cart is empty. Please add items to your cart before checkout.');
      return;
    }

    // Build WhatsApp message with cart items
    let message = `🛒 *New Order - Intikhab*\n\n`;
    message += `*Order Details:*\n`;
    message += `-------------------\n`;
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ${formatPKR(item.price)}\n`;
      message += `   Subtotal: ${formatPKR(item.price * item.quantity)}\n\n`;
    });
    
    message += `-------------------\n`;
    message += `*Total: ${formatPKR(totalPrice)}*\n\n`;
    message += `Please confirm my order. Thank you!`;
    
    // Convert phone number to international format (0319 2776896 -> 923192776896)
    // Remove spaces first, then replace leading 0 with 92
    const cleanPhone = BRAND.phone.replace(/\s/g, '');
    const phoneNumber = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
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
