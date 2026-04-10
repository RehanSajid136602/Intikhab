'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useProductImageCarousel } from '@/hooks/useProductImageCarousel';
import { ProductBadgeComponent } from './ProductBadge';
import { formatPKR } from '@/lib/utils';
import { toast } from 'sonner';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
  showImageCarousel?: boolean;
}

/**
 * Product card with wishlist heart, image, brand, title, price, COD badge,
 * and ADD TO CART button that appears on hover.
 * Optional showImageCarousel enables auto-cycling images.
 */
function ProductCard({ product, showImageCarousel }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const { currentImageIndex, setIsPaused } = useProductImageCarousel(
    showImageCarousel ? product.images.length : 1,
  );

  const currentImage = showImageCarousel
    ? product.images[currentImageIndex]
    : product.images[0];

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    toast.success(
      isInWishlist ? 'Removed from Wishlist' : 'Added to Wishlist'
    );
  };

  return (
    <Link href={`/products/${product.slug}`} className="block">
      <div className="product-card relative bg-white rounded-sm overflow-hidden border border-brand-border group cursor-pointer">
        {/* Badge */}
        <ProductBadgeComponent badge={product.badge} />

        {/* Wishlist Heart */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-200 ${
              isInWishlist
                ? 'fill-brand-red text-brand-red'
                : 'text-brand-gray hover:text-brand-red'
            }`}
          />
        </button>

        {/* Image */}
        <div
          className="aspect-square overflow-hidden bg-brand-light-gray relative"
          onMouseEnter={() => showImageCarousel && setIsPaused(true)}
          onMouseLeave={() => showImageCarousel && setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={currentImage}
                alt={`${product.name} — ${product.brand} ${product.category} sneaker`}
                fill
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={100}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-[11px] text-brand-gray uppercase tracking-wider mb-1">
            {product.brand}
          </p>
          <h3 className="text-[13px] font-medium text-brand-dark leading-tight mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            {product.originalPrice && (
              <span className="text-[12px] line-through text-brand-gray">
                {formatPKR(product.originalPrice)}
              </span>
            )}
            <span
              className={`text-[14px] font-semibold ${
                product.originalPrice ? 'text-brand-red' : 'text-brand-dark'
              }`}
            >
              {formatPKR(product.price)}
            </span>
          </div>
          <p className="text-[11px] text-brand-green font-medium mb-3">
            ✓ Cash on Delivery Available
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              addItem(product);
            }}
            className="add-to-cart-btn w-full bg-brand-dark text-white text-[11px] font-bold uppercase tracking-widest py-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </Link>
  );
}

export { ProductCard };
export type { ProductCardProps };
