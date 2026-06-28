'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/stores/uiStore';
import { mainNavItems } from '@/data/navigation';
import { useSession, signOut } from '@/lib/auth-client';

/**
 * Full-screen mobile slide-in menu drawer with subcategories and auth controls.
 */
function MobileMenu() {
  const { mobileMenuOpen, setMobileMenu } = useUIStore();
  const { data: session } = useSession();
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            setMobileMenu(false);
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
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenu(false)}
            className="fixed inset-0 z-[99] bg-brand-dark md:hidden"
          />

          {/* Slide-in menu container */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed bottom-0 left-0 top-0 z-[100] flex w-[85%] max-w-[360px] flex-col bg-brand-background shadow-drawer md:hidden"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-brand-border bg-brand-surface px-4">
              <span className="text-xl font-bold text-brand-dark tracking-tight">Intikhab</span>
              <button
                onClick={() => setMobileMenu(false)}
                className="rounded-control p-2 hover:bg-brand-light-gray text-brand-dark transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation Area */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <div className="space-y-1">
                {mainNavItems.map((item) => {
                  const hasDropdown = item.dropdown && item.dropdown.length > 0;
                  const isExpanded = !!expandedItems[item.label];

                  return (
                    <div key={item.label} className="border-b border-brand-border/40 last:border-b-0 pb-1">
                      {hasDropdown ? (
                        <div>
                          <button
                            onClick={() => toggleExpand(item.label)}
                            className="flex w-full items-center justify-between rounded-control px-3 py-3 text-left font-semibold text-brand-dark hover:bg-brand-light-gray transition-colors"
                          >
                            <span className={item.isSale ? 'text-brand-red' : ''}>{item.label}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-brand-gray transition-transform duration-200 ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>

                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden bg-brand-surface/40 rounded-lg ml-2 pl-2 border-l border-brand-sand/50 space-y-1"
                              >
                                {item.dropdown!.map((subItem) => (
                                  <Link
                                    key={subItem.label}
                                    href={subItem.href}
                                    onClick={() => setMobileMenu(false)}
                                    className="block rounded-control px-3 py-2 text-sm font-medium text-brand-gray hover:bg-brand-light-gray hover:text-brand-red transition-colors"
                                  >
                                    {subItem.label}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setMobileMenu(false)}
                          className={`block rounded-control px-3 py-3 font-semibold ${
                            item.isSale
                              ? 'text-brand-red'
                              : 'text-brand-dark'
                          } hover:bg-brand-light-gray transition-colors`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Account Section */}
            <div className="border-t border-brand-border bg-brand-surface p-4">
              {session ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-sand/30 text-brand-gray">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs text-brand-gray uppercase tracking-wider font-semibold">Logged In</p>
                      <p className="truncate text-sm font-semibold text-brand-dark">{session.user.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/account"
                      onClick={() => setMobileMenu(false)}
                      className="flex items-center justify-center rounded-control border border-brand-dark py-2.5 text-xs font-bold uppercase tracking-wider text-brand-dark hover:bg-brand-dark hover:text-white transition-colors"
                    >
                      Account
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center justify-center gap-1 rounded-control bg-brand-red py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-center text-xs text-brand-gray">Welcome to Intikhab. Sign in to sync your cart.</p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenu(false)}
                      className="flex items-center justify-center rounded-control border border-brand-dark py-3 text-xs font-bold uppercase tracking-wider text-brand-dark hover:bg-brand-dark hover:text-white transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenu(false)}
                      className="flex items-center justify-center rounded-control bg-brand-dark py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export { MobileMenu };
