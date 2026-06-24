'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Palette,
  MessageSquare,
  Settings,
  MessageSquareText,
  LogOut,
  Tags,
  TicketPercent,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const navLinks = [
  { label: 'Dashboard', href: ROUTES.adminDashboard, icon: LayoutDashboard },
  { label: 'Products', href: ROUTES.adminProducts, icon: Package },
  { label: 'Orders', href: ROUTES.adminOrders, icon: ShoppingCart },
  { label: 'Customers', href: ROUTES.adminCustomers, icon: Users },
  { label: 'Categories', href: ROUTES.adminCategories, icon: Tags },
  { label: 'Coupons', href: ROUTES.adminCoupons, icon: TicketPercent },
  { label: 'Reviews', href: ROUTES.adminReviews, icon: Star },
  { label: 'Appearance', href: ROUTES.adminAppearance, icon: Palette },
  { label: 'Messages', href: ROUTES.adminMessages, icon: MessageSquare },
  { label: 'Feedback', href: ROUTES.adminFeedback, icon: MessageSquareText },
  { label: 'Settings', href: ROUTES.adminSettings, icon: Settings },
];

/**
 * Admin sidebar navigation with dark bg, icon links, active state, and logout.
 */
function Sidebar({ userEmail }: { userEmail?: string }) {
  const pathname = usePathname();

  const handleLogout = async () => {
    const { signOut } = await import('@/lib/auth-client');
    await signOut();
    window.location.href = '/admin/login';
  };

  return (
    <aside className="w-[260px] bg-brand-dark h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <span className="text-white font-bold text-lg">Intikhab Admin</span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-6 py-3 text-sm transition-colors',
                isActive
                  ? 'bg-white/10 text-white border-l-2 border-brand-red'
                  : 'text-white/60 hover:bg-white/5 hover:text-white',
              )}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom User Info */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-white/60" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">Admin</p>
            <p className="text-xs text-white/40 truncate">{userEmail || 'admin@intikhab.pk'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/40 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

export { Sidebar };
