'use client';

import { Bell, Search, Menu, Users } from 'lucide-react';
import { ADMIN_TOPBAR_HEIGHT } from '@/lib/constants';

interface TopBarProps {
  pageTitle: string;
  onMenuToggle?: () => void;
}

/**
 * Admin top bar with hamburger (mobile), page title, notification bell, search, avatar.
 */
function TopBar({ pageTitle, onMenuToggle }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-40 bg-white border-b border-brand-border flex items-center justify-between px-6"
      style={{ height: ADMIN_TOPBAR_HEIGHT }}
    >
      {/* Left: Hamburger + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 -ml-2 text-brand-gray hover:text-brand-dark"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">
          {pageTitle}
        </h1>
      </div>

      {/* Right: Bell + Search + Avatar */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-brand-gray hover:text-brand-dark transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-brand-red text-white text-[8px] rounded-full flex items-center justify-center">
            3
          </span>
        </button>
        <div className="hidden sm:block relative">
          <input
            type="text"
            placeholder="Search..."
            className="border border-brand-border pl-9 pr-4 py-1.5 text-sm outline-none focus:border-brand-dark w-48"
          />
          <Search className="w-4 h-4 text-brand-gray absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
        <div className="w-8 h-8 rounded-full bg-brand-light-gray flex items-center justify-center">
          <Users className="w-4 h-4 text-brand-gray" />
        </div>
      </div>
    </header>
  );
}

export { TopBar };
export type { TopBarProps };
