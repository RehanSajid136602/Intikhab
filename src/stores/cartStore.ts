import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '@/types/product';
import type { Product } from '@/types/product';

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
