"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useCartStore } from "@/stores/cartStore";
import { ProductCard } from "@/components/products/ProductCard";
import { formatPKR } from "@/lib/utils";
import { toast } from "sonner";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  React.useEffect(() => {
    const store = useWishlistStore.getState();
    store.syncToAccount().then(() => store.loadFromAccount());
  }, []);

  const handleMoveToCart = (product: any) => {
    if (!product.sizeStock || product.sizeStock.length === 0) {
      toast.error("No sizes available");
      return;
    }
    addItem(product, product.sizeStock[0].size);
    removeItem(product.id);
    toast.success("Moved to cart");
  };

  const handleRemove = (id: string) => {
    removeItem(id);
    toast.success("Removed from wishlist");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white py-8 md:py-12 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="w-20 h-20 text-brand-gray mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-brand-dark mb-4">
              Your wishlist is empty
            </h1>
            <p className="text-brand-gray mb-8">
              Save your favorite items to see them here
            </p>
            <Link
              href="/"
              className="inline-block bg-brand-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-black transition-colors"
            >
              Start Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 md:py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">
            My Wishlist
          </h1>
          <p className="text-brand-gray">
            {items.length} item{items.length !== 1 ? "s" : ""} saved
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="bg-white border border-brand-border rounded-lg overflow-hidden">
                {/* Product Card */}
                <div className="relative">
                  <ProductCard product={product} showImageCarousel={false} />
                </div>

                {/* Action Buttons */}
                <div className="p-3 border-t border-brand-border flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="flex-1 flex items-center justify-center gap-2 bg-brand-dark text-white py-2 text-xs font-semibold rounded hover:bg-black transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="p-2 border border-brand-border rounded hover:border-red-500 hover:text-red-500 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Clear All Button */}
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center"
          >
            <button
              onClick={clearWishlist}
              className="text-brand-red hover:underline text-sm font-medium"
            >
              Clear All Items
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
