/**
 * Order and order item type definitions.
 */

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered";

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  size: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  date: string;
}
