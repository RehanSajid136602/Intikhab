'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { X, Upload } from 'lucide-react';
import { useAdminStore } from '@/stores/adminStore';
import type { Product } from '@/types/product';

const productSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  sku: z.string().min(2, 'SKU must be at least 2 characters'),
  category: z.enum(['men', 'women', 'kids']),
  price: z.number().min(100, 'Price must be at least PKR 100'),
  originalPrice: z.number().optional(),
  stock: z.number().min(0, 'Stock cannot be negative'),
  description: z.string().optional(),
  status: z.enum(['active', 'draft']),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editProduct?: Product | null;
}

/**
 * Add/Edit product modal with React Hook Form + Zod validation,
 * image upload preview, and Sonner toast on submit.
 */
function AddProductModal({ isOpen, onClose, editProduct }: AddProductModalProps) {
  const { addProduct, updateProduct } = useAdminStore();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: editProduct?.name || '',
      sku: editProduct?.sku || '',
      category: editProduct?.category || 'men',
      price: editProduct?.price || undefined,
      originalPrice: editProduct?.originalPrice,
      stock: editProduct?.stock || 0,
      description: editProduct?.description || '',
      status: editProduct?.status || 'active',
    },
  });

  const category = watch('category');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const previews: string[] = [];
    Array.from(files)
      .slice(0, 4)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            previews.push(ev.target.result as string);
            if (previews.length === Math.min(files.length, 4)) {
              setImagePreviews(previews);
            }
          }
        };
        reader.readAsDataURL(file);
      });
  };

  const onSubmit = (data: ProductFormData) => {
    const newProduct: Product = {
      id: editProduct?.id || `INK-${Date.now()}`,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      name: data.name,
      brand: 'Intikhab',
      category: data.category,
      price: data.price,
      originalPrice: data.originalPrice,
      images:
        imagePreviews.length > 0
          ? imagePreviews
          : editProduct?.images || ['/shoe_collection.jpeg'],
      badge: data.originalPrice ? 'SALE' : null,
      inStock: data.stock > 0,
      stock: data.stock,
      installment: Math.ceil(data.price / 2),
      description: data.description || '',
      sku: data.sku,
      status: data.status,
    };

    if (editProduct) {
      updateProduct(editProduct.id, newProduct);
      toast.success('Product updated successfully');
    } else {
      addProduct(newProduct);
      toast.success('Product added successfully');
    }

    reset();
    setImagePreviews([]);
    onClose();
  };

  const handleClose = () => {
    reset();
    setImagePreviews([]);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white rounded-sm shadow-xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-brand-border">
              <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">
                {editProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <button
                onClick={handleClose}
                className="p-1 text-brand-gray hover:text-brand-dark transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Product Name *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full border border-brand-border px-4 py-2.5 text-sm outline-none focus:border-brand-dark"
                    placeholder="e.g. Black Sneaker — Classic"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-brand-red">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    SKU *
                  </label>
                  <input
                    {...register('sku')}
                    type="text"
                    className="w-full border border-brand-border px-4 py-2.5 text-sm outline-none focus:border-brand-dark"
                    placeholder="INK-BLK-001"
                  />
                  {errors.sku && (
                    <p className="mt-1 text-xs text-brand-red">
                      {errors.sku.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Category *
                  </label>
                  <select
                    {...register('category')}
                    className="w-full border border-brand-border px-4 py-2.5 text-sm outline-none focus:border-brand-dark bg-white"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Price PKR *
                  </label>
                  <input
                    {...register('price', { valueAsNumber: true })}
                    type="number"
                    className="w-full border border-brand-border px-4 py-2.5 text-sm outline-none focus:border-brand-dark"
                    placeholder="3500"
                  />
                  {errors.price && (
                    <p className="mt-1 text-xs text-brand-red">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Original Price PKR (optional)
                  </label>
                  <input
                    {...register('originalPrice', { valueAsNumber: true })}
                    type="number"
                    className="w-full border border-brand-border px-4 py-2.5 text-sm outline-none focus:border-brand-dark"
                    placeholder="4500"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Stock Quantity *
                  </label>
                  <input
                    {...register('stock', { valueAsNumber: true })}
                    type="number"
                    className="w-full border border-brand-border px-4 py-2.5 text-sm outline-none focus:border-brand-dark"
                    placeholder="24"
                  />
                  {errors.stock && (
                    <p className="mt-1 text-xs text-brand-red">
                      {errors.stock.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full border border-brand-border px-4 py-2.5 text-sm outline-none focus:border-brand-dark resize-none"
                    placeholder="Product description..."
                  />
                </div>

                {/* Image Upload */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Images (max 4)
                  </label>
                  <div className="border-2 border-dashed border-brand-border rounded-sm p-6 text-center">
                    <Upload className="w-8 h-8 text-brand-gray mx-auto mb-2" />
                    <p className="text-xs text-brand-gray mb-2">
                      Click to upload or drag and drop
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="product-images"
                    />
                    <label
                      htmlFor="product-images"
                      className="inline-block px-4 py-2 bg-brand-light-gray text-xs font-medium text-brand-dark rounded-sm cursor-pointer hover:bg-brand-border transition-colors"
                    >
                      Choose Files
                    </label>
                  </div>
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {imagePreviews.map((src, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-brand-light-gray rounded-sm overflow-hidden"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`Preview ${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-brand-dark mb-1.5">
                    Status
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        {...register('status')}
                        type="radio"
                        value="active"
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-brand-dark">Active</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        {...register('status')}
                        type="radio"
                        value="draft"
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-brand-dark">Draft</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 text-xs font-medium text-brand-gray hover:text-brand-dark transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-red text-white text-xs font-bold uppercase tracking-widest hover:bg-red-600 transition-colors"
                >
                  {editProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { AddProductModal };
export type { AddProductModalProps };
