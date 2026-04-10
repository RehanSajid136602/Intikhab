'use client';

import Image from 'next/image';
import { Minus, Plus, X } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { formatPKR } from '@/lib/utils';
import type { CartItem } from '@/types/product';

interface CartItemComponentProps {
  item: CartItem;
}

/**
 * Single cart line item with 40×40px image, name, price, quantity controls, remove button.
 */
function CartItemComponent({ item }: CartItemComponentProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  return (
    <div className="flex gap-3 py-3 border-b border-brand-border">
      {/* Image */}
      <div className="w-10 h-10 flex-shrink-0 bg-brand-light-gray rounded-sm overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          width={40}
          height={40}
          className="w-full h-full object-contain"
          sizes="40px"
          quality={80}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-brand-dark truncate">{item.name}</p>
        <p className="text-xs text-brand-dark font-semibold">{formatPKR(item.price)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-6 h-6 flex items-center justify-center border border-brand-border text-xs hover:bg-brand-light-gray transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-6 h-6 flex items-center justify-center border border-brand-border text-xs hover:bg-brand-light-gray transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.id)}
        className="text-brand-gray hover:text-brand-red transition-colors self-start"
        aria-label="Remove item"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export { CartItemComponent };
export type { CartItemComponentProps };
