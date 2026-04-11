"use client";

import { useState, useEffect } from "react";
import { Bell, Search, Menu, Users, X, Package } from "lucide-react";
import { ADMIN_TOPBAR_HEIGHT } from "@/lib/constants";
import { formatPKR } from "@/lib/utils";

interface TopBarProps {
  pageTitle: string;
  onMenuToggle?: () => void;
}

interface Notification {
  id: string;
  message: string;
  amount: string;
  time: string;
  status: string;
}

const LAST_SEEN_KEY = "admin-last-seen-orders";

function getLastSeenAt(): string | null {
  return localStorage.getItem(LAST_SEEN_KEY);
}

function setLastSeenAt(timestamp: string) {
  localStorage.setItem(LAST_SEEN_KEY, timestamp);
}

/**
 * Admin top bar with hamburger (mobile), page title, notification bell, search, avatar.
 */
function TopBar({ pageTitle, onMenuToggle }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnreadOrders = async () => {
    try {
      const lastSeenAt = getLastSeenAt();
      const limit = lastSeenAt ? 20 : 5;
      const res = await fetch(`/api/orders?limit=${limit}`, {
        credentials: "include",
      });
      if (res.ok) {
        const orders = await res.json();
        const allNotifications = orders.map((o: Record<string, unknown>) => ({
          id: o.id as string,
          message: `Order from ${o.customerName}`,
          amount: formatPKR(o.total as number),
          time: o.date as string,
          status: o.status as string,
          createdAt: o.date as string,
        }));

        // On first visit, mark all existing orders as seen
        if (!lastSeenAt) {
          setLastSeenAt(new Date().toISOString());
          setNotifications(allNotifications.slice(0, 5));
          setUnreadCount(0);
          return;
        }

        // Filter to only unread orders
        const unread = allNotifications.filter(
          (n: { createdAt: string }) =>
            new Date(n.createdAt) > new Date(lastSeenAt),
        );
        setUnreadCount(unread.length);
        setNotifications(unread.slice(0, 5));
      }
    } catch {
      // Silently fail
    }
  };

  useEffect(() => {
    fetchUnreadOrders();
  }, []);

  const handleBellClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      // Mark all as read when opening
      setLastSeenAt(new Date().toISOString());
      setUnreadCount(0);
    }
  };

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
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={handleBellClick}
            className="relative p-2 text-brand-gray hover:text-brand-dark transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-[14px] bg-brand-red text-white text-[8px] rounded-full flex items-center justify-center px-1">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-brand-border rounded-sm shadow-lg z-50">
              <div className="flex items-center justify-between p-3 border-b border-brand-border">
                <h3 className="text-xs font-semibold text-brand-dark uppercase">
                  Recent Orders
                </h3>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="p-1 hover:text-brand-dark"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {notifications.length === 0 ? (
                <p className="p-4 text-xs text-brand-gray text-center">
                  No new orders
                </p>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-3 border-b border-brand-border hover:bg-brand-light-gray/50 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <Package className="w-4 h-4 text-brand-gray mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-brand-dark truncate">
                            {n.message}
                          </p>
                          <p className="text-xs text-brand-gray">
                            {n.amount} — {n.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="hidden sm:block relative">
          <input
            type="text"
            placeholder="Search..."
            className="border border-brand-border pl-9 pr-4 py-1.5 text-sm outline-none focus:border-brand-dark w-48"
          />
          <Search className="w-4 h-4 text-brand-gray absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-brand-light-gray flex items-center justify-center">
          <Users className="w-4 h-4 text-brand-gray" />
        </div>
      </div>
    </header>
  );
}

export { TopBar };
export type { TopBarProps };
