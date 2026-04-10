'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCard } from '@/components/products/ProductCard';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ReturnPolicySnippet } from '@/components/ReturnPolicySnippet';
import { useCartStore } from '@/stores/cartStore';
import { formatPKR } from '@/lib/utils';
import { BRAND } from '@/lib/constants';
import type { Product } from '@/types/product';

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

/**
 * Client component for product detail page with interactive features
 */
export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedSize, setSelectedSize] = React.useState<number | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);
  const [isZoomed, setIsZoomed] = React.useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addItem(product);
  };

  const handleWhatsAppOrder = () => {
    const size = selectedSize ? `Size: ${selectedSize}` : 'Size not selected';
    const message = `Hi, I'd like to order:\n\n${product.name}\nPrice: ${formatPKR(product.price)}\n${size}\n\nPlease confirm availability and payment details.`;
    const cleanPhone = BRAND.phone.replace(/\s/g, '');
    const phoneNumber = cleanPhone.startsWith('0') ? '92' + cleanPhone.slice(1) : cleanPhone;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images[0],
    description: product.description,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'PKR',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
  };

  const sizes = product.sizes || [6, 7, 8, 9, 10, 11];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-white py-8 md:py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: product.category.charAt(0).toUpperCase() + product.category.slice(1), href: `/${product.category}` },
              { label: product.name },
            ]}
            className="mb-6"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* LEFT COLUMN - Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div
                className="relative aspect-square bg-brand-light-gray overflow-hidden cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[selectedImageIndex]}
                      alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                      fill
                      className={`object-contain p-8 transition-transform duration-300 ${
                        isZoomed ? 'scale-150' : 'scale-100'
                      }`}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      quality={85}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : product.images.length - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev < product.images.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square w-20 flex-shrink-0 bg-brand-light-gray rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index ? 'border-brand-dark' : 'border-transparent hover:border-brand-gray'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-contain p-2"
                        sizes="80px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - Product Info */}
            <div className="space-y-6">
              {/* Brand & Name */}
              <div>
                <p className="text-sm text-brand-gray uppercase tracking-wider mb-2">
                  {product.brand}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold text-brand-dark leading-tight">
                  {product.name}
                </h1>
              </div>

              {/* Price & Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {product.originalPrice && (
                    <span className="text-lg line-through text-brand-gray">
                      {formatPKR(product.originalPrice)}
                    </span>
                  )}
                  <span className={`text-3xl font-bold ${product.originalPrice ? 'text-brand-red' : 'text-brand-dark'}`}>
                    {formatPKR(product.price)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand-red text-brand-red" />
                  ))}
                  <span className="text-sm text-brand-gray ml-1">(4.5)</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-brand-gray leading-relaxed">
                {product.description}
              </p>

              <hr className="border-brand-border" />

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-brand-dark">
                    Select Size
                  </label>
                  <Link
                    href="/size-guide"
                    className="text-sm text-brand-red hover:underline"
                  >
                    Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border-2 rounded-lg font-semibold transition-all ${
                        selectedSize === size
                          ? 'border-brand-dark bg-brand-dark text-white'
                          : 'border-brand-border text-brand-dark hover:border-brand-dark'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-xs text-brand-red mt-2">Please select a size</p>
                )}
              </div>

              {/* Stock Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                {product.badge && (
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-brand-red text-white">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Return Policy Snippet */}
              <div className="bg-brand-light-gray p-4 rounded-lg">
                <ReturnPolicySnippet variant="mini" />
                <Link
                  href="/terms-and-conditions"
                  className="text-sm text-brand-red hover:underline mt-1 inline-block"
                >
                  Full return policy →
                </Link>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-brand-dark text-white py-4 font-semibold uppercase tracking-wider hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {/* WhatsApp Order */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-600 text-white py-4 font-semibold uppercase tracking-wider hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                Order via WhatsApp
              </button>

              {/* Wishlist */}
              <button className="flex items-center justify-center gap-2 text-brand-dark hover:text-brand-red transition-colors py-2">
                <Heart className="w-5 h-5" />
                <span className="text-sm font-medium">Add to Wishlist</span>
              </button>

              <hr className="border-brand-border" />

              {/* Product Details Accordion */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-brand-dark mb-2">Description</h3>
                  <p className="text-brand-gray text-sm leading-relaxed">
                    {product.description} This premium sneaker features high-quality materials and craftsmanship, designed for both comfort and style. Perfect for everyday wear with its versatile design that complements any outfit.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark mb-2">Size & Fit</h3>
                  <p className="text-brand-gray text-sm">
                    True to size. If you are between sizes, we recommend sizing up for better comfort. Refer to our size guide for accurate measurements.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark mb-2">Materials & Care</h3>
                  <p className="text-brand-gray text-sm">
                    Upper: Premium synthetic material. Sole: Durable rubber. Care: Wipe clean with a damp cloth. Do not machine wash. Air dry away from direct sunlight.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-brand-dark mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relatedProduct, index) => (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <ProductCard product={relatedProduct} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}