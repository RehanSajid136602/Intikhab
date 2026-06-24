'use client';

import { useState } from 'react';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { AddProductModal } from '@/components/admin/AddProductModal';
import type { Product } from '@/types/product';

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
