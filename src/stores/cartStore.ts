import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types/product';
import type { Product } from '@/types/product';
import { toast } from 'sonner';

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;

  totalItems: number;
  totalPrice: number;

  // Supabase sync methods
  syncCartToSupabase: (email: string) => Promise<boolean>;
  loadCartFromSupabase: (email: string) => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product: Product) => {
    set((state) => {
      const baseName = product.name.split(' — ')[0];
      const existing = state.items.find(
        (item) => item.name === baseName,
      );
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.name === baseName
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
          totalItems: state.totalItems + 1,
          totalPrice: state.totalPrice + product.price,
        };
      }
      const newItem: CartItem = {
        id: product.id,
        name: baseName,
        price: product.price,
        image: product.images[0],
        quantity: 1,
      };
      return {
        items: [...state.items, newItem],
        isOpen: true,
        totalItems: state.totalItems + 1,
        totalPrice: state.totalPrice + product.price,
      };
    });
  },

  removeItem: (id: string) => {
    set((state) => {
      const item = state.items.find((item) => item.id === id);
      if (!item) return state;
      return {
        items: state.items.filter((item) => item.id !== id),
        totalItems: state.totalItems - item.quantity,
        totalPrice: state.totalPrice - item.price * item.quantity,
      };
    });
  },

  updateQuantity: (id: string, quantity: number) => {
    set((state) => {
      const item = state.items.find((item) => item.id === id);
      if (!item) return state;
      const safeQuantity = Math.max(1, quantity);
      const diff = safeQuantity - item.quantity;
      return {
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: safeQuantity } : item,
        ),
        totalItems: state.totalItems + diff,
        totalPrice: state.totalPrice + diff * item.price,
      };
    });
  },

  clearCart: () => {
    set({ items: [], isOpen: false, totalItems: 0, totalPrice: 0 });
  },

  toggleCart: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  syncCartToSupabase: async (email: string) => {
    try {
      const { items } = get();
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sync cart');
      }

      return true;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `Cart sync failed: ${error.message}`
          : 'Failed to sync cart to cloud',
      );
      return false;
    }
  },

  loadCartFromSupabase: async (email: string) => {
    try {
      const response = await fetch(`/api/cart?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      // Note: This would merge with local cart, but for now we just log it
      // Full merge logic would require fetching product details
      if (data.items && data.items.length > 0) {
        toast.info(`Found ${data.items.length} items in your cloud cart`);
      }
    } catch {
      // Silently fail - localStorage cart is the source of truth for guests
    }
  },

  totalItems: 0,
  totalPrice: 0,
}),
    {
      name: 'intikhab-cart',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }),
    },
  ),
);
