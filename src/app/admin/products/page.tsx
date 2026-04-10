'use client';

import { useState } from 'react';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { AddProductModal } from '@/components/admin/AddProductModal';
import dynamic from 'next/dynamic';
import type { Product } from '@/types/product';

const OrdersTable = dynamic(
  () => import('@/components/admin/OrdersTable').then((m) => m.OrdersTable),
  { loading: () => <TableSkeleton /> },
);

function TableSkeleton() {
  return (
    <div className="bg-white rounded-sm border border-brand-border p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

/**
 * Admin products page with header, ProductsTable, and AddProductModal.
 */
export default function AdminProductsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const handleAddProduct = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <ProductsTable
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
      />
      <AddProductModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditProduct(null);
        }}
        editProduct={editProduct}
      />
    </div>
  );
}
