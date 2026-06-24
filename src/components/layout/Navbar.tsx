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
  LogOut,
} from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useUIStore } from '@/stores/uiStore';
import { mainNavItems } from '@/data/navigation';
import { BRAND } from '@/lib/constants';
import { SearchBar } from './SearchBar';
import { cn } from '@/lib/utils';
import { signOut } from '@/lib/auth-client';

interface NavbarProps {
  isAuthenticated?: boolean;
  userEmail?: string;
}

function Navbar({ isAuthenticated = false, userEmail }: NavbarProps) {
  const { totalItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const { toggleMobileMenu, toggleSearch, searchOpen } = useUIStore();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/');
            router.refresh();
          },
        },
      });
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-brand-border bg-brand-surface/95 backdrop-blur transition-shadow duration-300">
      <div className="store-container">
        <div className="flex h-16 items-center gap-4 md:h-18">
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 -ml-2 flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link
            href="/"
            className="flex-shrink-0 text-2xl font-bold tracking-tight text-brand-dark"
            aria-label="Go to homepage"
          >
            {BRAND.name}
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-5 text-[11px] font-semibold uppercase tracking-[0.16em] md:flex">
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

                {item.dropdown && (
                  <div className="dropdown-menu absolute left-0 top-full z-50 min-w-[210px] rounded-card border border-brand-border bg-white p-3 shadow-subtle">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className="block rounded-control px-3 py-2 text-brand-gray hover:bg-brand-light-gray hover:text-brand-red transition-colors"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              onClick={toggleSearch}
              className="rounded-control p-2 hover:bg-brand-light-gray hover:text-brand-red transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="p-2 hover:bg-brand-light-gray rounded-control hover:text-brand-red transition-colors duration-200 relative group"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-brand-dark text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    Account
                  </span>
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-brand-border rounded-lg shadow-lg z-50 py-1">
                      {userEmail && (
                        <div className="px-4 py-2 border-b border-brand-border">
                          <p className="text-xs text-brand-gray truncate">
                            {userEmail}
                          </p>
                        </div>
                      )}
                      <Link
                        href="/account"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-brand-dark hover:bg-brand-light-gray transition-colors"
                      >
                        My Account
                      </Link>
                      <div className="border-t border-brand-border mt-1 pt-1">
                        <button
                          onClick={handleSignOut}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors text-left font-normal"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="hidden text-xs font-semibold uppercase tracking-wider text-brand-dark hover:text-brand-red transition-colors px-3 py-1.5 sm:inline-flex"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="hidden rounded-control bg-brand-dark px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-black sm:inline-flex"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <Link
              href="/wishlist"
              className="relative rounded-control p-2 hover:bg-brand-light-gray hover:text-brand-red transition-colors duration-200"
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
              className="relative rounded-control p-2 hover:bg-brand-light-gray hover:text-brand-red transition-colors duration-200"
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

        <SearchBar />
      </div>
    </nav>
  );
}

export { Navbar };
