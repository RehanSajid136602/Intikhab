'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  ChevronDown,
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useUIStore } from '@/stores/uiStore';
import { mainNavItems } from '@/data/navigation';
import { BRAND } from '@/lib/constants';
import { SearchBar } from './SearchBar';
import { cn } from '@/lib/utils';

/**
 * Sticky main navigation with mega dropdowns, search, account, wishlist, cart icons,
 * and mobile hamburger toggle.
 */
function Navbar() {
  const { totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { toggleMobileMenu, toggleSearch, searchOpen } = useUIStore();
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm transition-shadow duration-300">
      <div className="container mx-auto px-4">
        <div className="h-16 md:h-14 flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 -ml-2 flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-brand-dark flex-shrink-0"
            aria-label="Go to homepage"
          >
            {BRAND.name}
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-4 text-xs font-semibold uppercase tracking-wider">
            {mainNavItems.map((item) => (
              <div key={item.label} className="nav-item relative">
                {item.dropdown ? (
                  <button
                    onClick={() => router.push(item.href)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        router.push(item.href);
                      }
                    }}
                    className={cn(
                      'text-brand-dark hover:text-brand-red transition-colors flex items-center gap-1 cursor-pointer',
                      item.isSale && 'text-brand-red',
                    )}
                  >
                    {item.label}
                    {item.isSale && (
                      <span className="w-1.5 h-1.5 bg-brand-red rounded-full blink-dot" />
                    )}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      'text-brand-dark hover:text-brand-red transition-colors',
                      item.isSale && 'text-brand-red flex items-center gap-1',
                    )}
                  >
                    {item.label}
                    {item.isSale && (
                      <span className="w-1.5 h-1.5 bg-brand-red rounded-full blink-dot" />
                    )}
                  </Link>
                )}

                {/* Mega Dropdown */}
                {item.dropdown && (
                  <div className="dropdown-menu absolute top-full left-0 bg-white shadow-lg border-t border-brand-border p-4 min-w-[180px] z-50">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block py-2 text-brand-gray hover:text-brand-red transition-colors"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSearch}
              className="p-2 hover:text-brand-red transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 hover:text-brand-red transition-colors duration-200 relative group">
              <User className="w-5 h-5" />
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-brand-dark text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                My Account
              </span>
            </button>
            <Link
              href="/wishlist"
              className="p-2 hover:text-brand-red transition-colors duration-200 relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => useCartStore.getState().toggleCart()}
              className="p-2 hover:text-brand-red transition-colors duration-200 relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-red text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar />
      </div>
    </nav>
  );
}

export { Navbar };
