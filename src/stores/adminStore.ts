import { create } from 'zustand';
import type { Product } from '@/types/product';
import type { Order, OrderStatus } from '@/types/order';
import { products as initialProducts } from '@/data/products';
import { mockOrders as initialOrders } from '@/data/admin';

interface AdminState {
  products: Product[];
  orders: Order[];

  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  filteredProducts: (category?: string) => Product[];
  filteredOrders: (status?: string) => Order[];
}

export const useAdminStore = create<AdminState>()((set, get) => ({
  products: initialProducts,
  orders: initialOrders,

  addProduct: (product: Product) => {
    set((state) => ({ products: [...state.products, product] }));
  },

  updateProduct: (id: string, updates: Partial<Product>) => {
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  deleteProduct: (id: string) => {
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },

  updateOrderStatus: (orderId: string, status: OrderStatus) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
  },

  filteredProducts: (category?: string) => {
    const { products } = get();
    if (!category) return products;
    return products.filter((p) => p.category === category);
  },

  filteredOrders: (status?: string) => {
    const { orders } = get();
    if (!status) return orders;
    return orders.filter((o) => o.status === status);
  },
}));
