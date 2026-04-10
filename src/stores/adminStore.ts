import { create } from 'zustand';
import { toast } from 'sonner';
import type { Product } from '@/types/product';
import type { Order, OrderStatus } from '@/types/order';

// ── API response shapes ───────────────────────────────────────────────

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// ── Admin state ───────────────────────────────────────────────────────

interface AdminState {
  products: Product[];
  orders: Order[];
  productsLoading: boolean;
  ordersLoading: boolean;

  // Data fetching
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;

  // Product mutations
  addProduct: (product: Partial<Product>) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  // Order mutations
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;

  // Filtering helpers
  filteredProducts: (category?: string) => Product[];
  filteredOrders: (status?: string) => Order[];
}

// ── API helpers ───────────────────────────────────────────────────────

async function apiFetch<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      ...options,
    });

    if (!res.ok) {
      const error = await res.text();
      return { error: error || `HTTP ${res.status}` };
    }

    const data = await res.json();
    return { data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Network error' };
  }
}

async function apiPost<T>(url: string, body: Record<string, unknown>): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    if (!res.ok) {
      const error = await res.text();
      return { error: error || `HTTP ${res.status}` };
    }

    const data = await res.json();
    return { data };
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Network error' };
  }
}

// ── Store ─────────────────────────────────────────────────────────────

export const useAdminStore = create<AdminState>()((set, get) => ({
  products: [],
  orders: [],
  productsLoading: false,
  ordersLoading: false,

  fetchProducts: async () => {
    set({ productsLoading: true });
    const { data, error } = await apiFetch<Product[]>('/api/products?limit=500');
    set({ productsLoading: false });
    if (error) {
      toast.error(`Failed to load products: ${error}`);
      return;
    }
    if (data) set({ products: data });
  },

  fetchOrders: async () => {
    set({ ordersLoading: true });
    const { data, error } = await apiFetch<Order[]>('/api/orders?limit=500');
    set({ ordersLoading: false });
    if (error) {
      toast.error(`Failed to load orders: ${error}`);
      return;
    }
    if (data) set({ orders: data });
  },

  addProduct: async (product) => {
    const { data, error } = await apiPost<Product>('/api/products', product);
    if (error) {
      toast.error(`Failed to add product: ${error}`);
      return null;
    }
    if (data) {
      set((state) => ({ products: [...state.products, data] }));
      return data;
    }
    return null;
  },

  updateProduct: async (id, updates) => {
    const { error } = await apiFetch<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
      credentials: 'include',
    });
    if (error) {
      toast.error(`Failed to update product: ${error}`);
      return;
    }
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  deleteProduct: async (id) => {
    const { error } = await apiFetch<Record<string, never>>(`/api/products/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (error) {
      toast.error(`Failed to delete product: ${error}`);
      return;
    }
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
  },

  updateOrderStatus: async (orderId, status) => {
    const { error } = await apiFetch<Order>(`/api/orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
      credentials: 'include',
    });
    if (error) {
      toast.error(`Failed to update order: ${error}`);
      return;
    }
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
