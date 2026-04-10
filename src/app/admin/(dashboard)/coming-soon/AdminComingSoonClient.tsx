'use client';

import Link from 'next/link';
import { ArrowLeft, Bell, Clock, Package, Palette, MessageSquare, Users, Settings } from 'lucide-react';

const featureIcons: Record<string, React.ReactNode> = {
  customers: <Users className="w-16 h-16" />,
  appearance: <Palette className="w-16 h-16" />,
  messages: <MessageSquare className="w-16 h-16" />,
  settings: <Settings className="w-16 h-16" />,
  notifications: <Bell className="w-16 h-16" />,
  default: <Clock className="w-16 h-16" />,
};

/**
 * Admin coming soon page with back to dashboard button.
 */
export default function AdminComingSoonClient() {
  const featureKey = 'default';
  const icon = featureIcons[featureKey] || featureIcons.default;

  return (
    <div className="min-h-screen bg-brand-light-gray flex items-center justify-center p-4">
      <div className="bg-white rounded-sm border border-brand-border p-12 max-w-lg w-full text-center space-y-6">
        {/* Icon */}
        <div className="w-24 h-24 mx-auto bg-brand-light-gray rounded-full flex items-center justify-center text-brand-gray">
          {icon}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-brand-dark uppercase tracking-wider">
          Coming Soon
        </h1>

        {/* Description */}
        <p className="text-brand-gray leading-relaxed">
          This feature is currently under development and will be available soon.
          We&apos;re working hard to bring you the best admin experience.
        </p>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px w-16 bg-brand-border" />
          <p className="text-xs font-semibold text-brand-gray uppercase tracking-widest">
            Stay Tuned
          </p>
          <div className="h-px w-16 bg-brand-border" />
        </div>

        {/* Upcoming Features */}
        <div className="grid grid-cols-2 gap-3 text-sm text-brand-gray">
          <div className="flex items-center gap-2 bg-brand-light-gray rounded-sm px-3 py-2">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </div>
          <div className="flex items-center gap-2 bg-brand-light-gray rounded-sm px-3 py-2">
            <Users className="w-4 h-4" />
            <span>Customers</span>
          </div>
          <div className="flex items-center gap-2 bg-brand-light-gray rounded-sm px-3 py-2">
            <Palette className="w-4 h-4" />
            <span>Appearance</span>
          </div>
          <div className="flex items-center gap-2 bg-brand-light-gray rounded-sm px-3 py-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </div>
        </div>

        {/* Back to Dashboard */}
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-3 text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
