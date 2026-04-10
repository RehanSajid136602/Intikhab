/**
 * Supabase database type definitions matching the actual schema.
 * All column names use camelCase as stored in the database.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          brand: string;
          category: string;
          price: number;
          originalPrice: number | null;
          images: string[] | null;
          badge: string | null;
          inStock: boolean;
          stock: number;
          installment: number;
          description: string;
          sku: string;
          status: string;
          sizes: number[] | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          brand?: string;
          category: string;
          price: number;
          originalPrice?: number | null;
          images?: string[] | null;
          badge?: string | null;
          inStock?: boolean;
          stock?: number;
          installment?: number;
          description?: string;
          sku: string;
          status?: string;
          sizes?: number[] | null;
          createdAt?: string;
          updatedAt: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          brand?: string;
          category?: string;
          price?: number;
          originalPrice?: number | null;
          images?: string[] | null;
          badge?: string | null;
          inStock?: boolean;
          stock?: number;
          installment?: number;
          description?: string;
          sku?: string;
          status?: string;
          sizes?: number[] | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          email: string;
          phone: string;
          fullName: string;
          createdAt: string;
          lastOrderAt: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          phone?: string;
          fullName?: string;
          createdAt?: string;
          lastOrderAt?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          phone?: string;
          fullName?: string;
          createdAt?: string;
          lastOrderAt?: string | null;
        };
      };
      orders: {
        Row: {
          id: string;
          customerEmail: string;
          customerName: string;
          shippingAddress: string;
          province: string;
          city: string;
          phone: string;
          paymentMethod: string;
          orderNotes: string | null;
          total: number;
          status: string;
          createdAt: string;
        };
        Insert: {
          id: string;
          customerEmail: string;
          customerName?: string;
          shippingAddress: string;
          province?: string;
          city?: string;
          phone?: string;
          paymentMethod?: string;
          orderNotes?: string | null;
          total: number;
          status?: string;
          createdAt?: string;
        };
        Update: {
          id?: string;
          customerEmail?: string;
          customerName?: string;
          shippingAddress?: string;
          province?: string;
          city?: string;
          phone?: string;
          paymentMethod?: string;
          orderNotes?: string | null;
          total?: number;
          status?: string;
          createdAt?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          orderId: string;
          productId: string;
          name: string;
          image: string;
          quantity: number;
          price: number;
        };
        Insert: {
          id?: string;
          orderId: string;
          productId: string;
          name: string;
          image: string;
          quantity: number;
          price: number;
        };
        Update: {
          id?: string;
          orderId?: string;
          productId?: string;
          name?: string;
          image?: string;
          quantity?: number;
          price?: number;
        };
      };
      carts: {
        Row: {
          id: string;
          customerEmail: string;
          productId: string;
          quantity: number;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          customerEmail: string;
          productId: string;
          quantity?: number;
          createdAt?: string;
          updatedAt: string;
        };
        Update: {
          id?: string;
          customerEmail?: string;
          productId?: string;
          quantity?: number;
          createdAt?: string;
          updatedAt?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
