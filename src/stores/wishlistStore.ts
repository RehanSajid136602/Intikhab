import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types/product';

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  toggleItem: (product: Product) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  syncToAccount: () => Promise<void>;
  loadFromAccount: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          if (state.items.some((item) => item.id === product.id)) {
            return state;
          }
          return { items: [...state.items, product] };
        });
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      toggleItem: (product) => {
        set((state) => {
          const exists = state.items.some((item) => item.id === product.id);
          if (exists) {
            fetch(`/api/account/wishlist/${product.id}`, { method: 'DELETE' }).catch(() => {});
            return { items: state.items.filter((item) => item.id !== product.id) };
          }
          fetch('/api/account/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id }),
          }).catch(() => {});
          return { items: [...state.items, product] };
        });
      },
      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },
      clearWishlist: () => {
        set({ items: [] });
      },
      syncToAccount: async () => {
        const { items } = get();
        if (items.length === 0) return;
        await fetch('/api/account/wishlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds: items.map((item) => item.id) }),
        }).catch(() => {});
      },
      loadFromAccount: async () => {
        const response = await fetch('/api/account/wishlist').catch(() => null);
        if (!response?.ok) return;
        const remoteItems = (await response.json()) as Product[];
        set((state) => {
          const merged = [...state.items];
          for (const product of remoteItems) {
            if (!merged.some((item) => item.id === product.id)) {
              merged.push(product);
            }
          }
          return { items: merged };
        });
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
