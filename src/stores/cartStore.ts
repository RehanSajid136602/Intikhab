import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/product";
import type { Product } from "@/types/product";
import { toast } from "sonner";
import { getFirstProductImage } from "@/lib/utils";

const getLineId = (productId: string, size: string) => `${productId}:${size}`;

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  addItem: (product: Product, size: string) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
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

      addItem: (product: Product, size: string) => {
        if (product.status === "coming_soon") {
          toast.error("This product is coming soon and cannot be added to the cart");
          return;
        }
        set((state) => {
          const baseName = product.name.split(" — ")[0];
          const selectedSizeStock = product.sizeStock?.find(
            (entry) => entry.size === size,
          );
          const availableStock =
            selectedSizeStock?.stock ?? (product.inStock ? product.stock : 0);

          if (availableStock <= 0) {
            toast.error("Selected size is out of stock");
            return state;
          }

          const lineId = getLineId(product.id, size);
          const existing = state.items.find(
            (item) => (item.lineId || getLineId(item.id, item.size)) === lineId,
          );
          if (existing) {
            if (existing.quantity >= availableStock) {
              toast.error(`Only ${availableStock} available in this size`);
              return state;
            }
            return {
              items: state.items.map((item) =>
                (item.lineId || getLineId(item.id, item.size)) === lineId
                  ? {
                      ...item,
                      lineId,
                      quantity: item.quantity + 1,
                      availableStock,
                    }
                  : item,
              ),
              totalItems: state.totalItems + 1,
              totalPrice: state.totalPrice + product.price,
            };
          }
          const newItem: CartItem = {
            lineId,
            id: product.id,
            name: baseName,
            price: product.price,
            image: getFirstProductImage(product.images) || '',
            quantity: 1,
            size,
            availableStock,
            productType: product.productType,
          };
          return {
            items: [...state.items, newItem],
            isOpen: true,
            totalItems: state.totalItems + 1,
            totalPrice: state.totalPrice + product.price,
          };
        });
      },

      removeItem: (lineId: string) => {
        set((state) => {
          const item = state.items.find(
            (item) => (item.lineId || getLineId(item.id, item.size)) === lineId,
          );
          if (!item) return state;
          return {
            items: state.items.filter(
              (item) =>
                (item.lineId || getLineId(item.id, item.size)) !== lineId,
            ),
            totalItems: state.totalItems - item.quantity,
            totalPrice: state.totalPrice - item.price * item.quantity,
          };
        });
      },

      updateQuantity: (lineId: string, quantity: number) => {
        set((state) => {
          const item = state.items.find(
            (item) => (item.lineId || getLineId(item.id, item.size)) === lineId,
          );
          if (!item) return state;
          const maxQuantity = item.availableStock ?? Number.MAX_SAFE_INTEGER;
          const safeQuantity = Math.min(Math.max(1, quantity), maxQuantity);
          if (quantity > maxQuantity) {
            toast.error(`Only ${maxQuantity} available in this size`);
          }
          const diff = safeQuantity - item.quantity;
          return {
            items: state.items.map((item) =>
              (item.lineId || getLineId(item.id, item.size)) === lineId
                ? { ...item, lineId, quantity: safeQuantity }
                : item,
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
          const response = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email,
              items: items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                size: item.size,
              })),
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to sync cart");
          }

          return true;
        } catch (error) {
          toast.error(
            error instanceof Error
              ? `Cart sync failed: ${error.message}`
              : "Failed to sync cart to cloud",
          );
          return false;
        }
      },

      loadCartFromSupabase: async (email: string) => {
        try {
          const response = await fetch(
            `/api/cart?email=${encodeURIComponent(email)}`,
          );
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
      name: "intikhab-cart",
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
      }),
    },
  ),
);
