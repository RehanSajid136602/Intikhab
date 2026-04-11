"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useCartStore } from "@/stores/cartStore";
import { formatPKR } from "@/lib/utils";
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import type { Product, SizeStock } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";

interface ProductDetailPageProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailPage({
  product,
  relatedProducts,
}: ProductDetailPageProps) {
  const { addItem } = useCartStore();
  const router = useRouter();
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const params = useParams();

  const sizeStockMap: Map<string, number> = new Map(
    (product.sizeStock || []).map((s: SizeStock) => [s.size, s.stock]),
  );

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addItem(product, selectedSize);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addItem(product, selectedSize);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-brand-gray hover:text-brand-dark transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* LEFT - Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-brand-light-gray rounded-sm overflow-hidden mb-4 group">
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-contain p-8"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />

              {/* Left Arrow */}
              {product.images.length > 1 && (
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev > 0 ? prev - 1 : product.images.length - 1,
                    )
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-brand-dark" />
                </button>
              )}

              {/* Right Arrow */}
              {product.images.length > 1 && (
                <button
                  onClick={() =>
                    setActiveImage((prev) =>
                      prev < product.images.length - 1 ? prev + 1 : 0,
                    )
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-brand-dark" />
                </button>
              )}

              {/* Image Counter */}
              {product.images.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-sm">
                  {activeImage + 1} / {product.images.length}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-sm overflow-hidden border-2 transition-colors ${
                      activeImage === i
                        ? "border-brand-dark"
                        : "border-brand-border"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT - Product Info */}
          <div className="space-y-6">
            {/* Badge */}
            {product.badge && (
              <span className="inline-block bg-brand-dark text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                {product.badge}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">
              {product.name}
            </h1>

            <p className="text-sm text-brand-gray">SKU: {product.sku}</p>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-brand-dark">
                {formatPKR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-brand-gray line-through">
                  {formatPKR(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-brand-gray leading-relaxed">
              {product.description}
            </p>

            {/* Sizes */}
            {product.sizeStock && product.sizeStock.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-brand-dark mb-2">
                  Select Size
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizeStock.map((ss: SizeStock) => {
                    const hasStock = ss.stock > 0;
                    const isSelected = selectedSize === ss.size;
                    return (
                      <button
                        key={ss.size}
                        onClick={() => hasStock && setSelectedSize(ss.size)}
                        disabled={!hasStock}
                        className={`w-12 h-12 flex items-center justify-center border text-sm rounded-sm transition-all ${
                          !hasStock
                            ? "border-brand-border text-brand-gray line-through cursor-not-allowed opacity-50"
                            : isSelected
                              ? "border-brand-dark bg-brand-dark text-white font-semibold"
                              : "border-brand-border text-brand-dark hover:border-brand-dark cursor-pointer"
                        }`}
                        title={
                          hasStock ? `${ss.stock} in stock` : "Out of stock"
                        }
                      >
                        {ss.size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <p
              className={`text-sm font-medium ${product.inStock && product.sizeStock.some((ss: SizeStock) => ss.stock > 0) ? "text-brand-green" : "text-brand-red"}`}
            >
              {product.inStock &&
              product.sizeStock.some((ss: SizeStock) => ss.stock > 0)
                ? "✓ In Stock"
                : "✗ Out of Stock"}
              {selectedSize &&
                sizeStockMap.has(selectedSize) &&
                sizeStockMap.get(selectedSize)! > 0 &&
                sizeStockMap.get(selectedSize)! <= 10 && (
                  <span className="ml-2 text-brand-red">
                    (Only {sizeStockMap.get(selectedSize)} left in size{" "}
                    {selectedSize})
                  </span>
                )}
            </p>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-dark text-white py-4 font-semibold uppercase tracking-wider rounded-sm hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="flex-1 bg-brand-red text-white py-4 font-semibold uppercase tracking-wider rounded-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Installment */}
            {product.installment > 0 && (
              <p className="text-sm text-brand-gray text-center pt-2">
                Or pay in installments of {formatPKR(product.installment)}/month
              </p>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 md:mt-24">
            <h2 className="text-2xl font-bold text-brand-dark mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((rp) => (
                <ProductCard key={rp.id} product={rp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
