'use client';

import Link from 'next/link';
import { Facebook, Instagram, Mail, MessageCircle, Phone } from 'lucide-react';
import { footerLinks } from '@/data/navigation';
import { BRAND } from '@/lib/constants';

/**
 * Full 5-column footer with contact info, quick links, help, collections, legal,
 * social media icons, payment methods row, and copyright.
 */
function Footer() {
  const { getInTouch, quickLinks, help, collections, legal } = footerLinks;

  return (
    <footer className="border-t border-brand-border bg-brand-surface pt-12 pb-6">
      <div className="store-container">
        {/* Row 1: 5 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Col 1: Get In Touch */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-brand-dark mb-4">
              Get In Touch
            </h3>
            <div className="space-y-3 text-sm text-brand-gray">
              <a href={`mailto:${getInTouch.email}`} className="flex items-center gap-2 text-brand-gray hover:text-brand-red transition-colors">
                <Mail className="h-4 w-4" /> {getInTouch.email}
              </a>
              <a href={`tel:${getInTouch.phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-brand-red">
                <Phone className="h-4 w-4" /> {getInTouch.phone}
              </a>
              <p className="font-semibold text-brand-dark mt-4">
                Customer Services Timing
              </p>
              <div className="space-y-2 text-sm text-brand-gray">
                <p>{getInTouch.hours.split(',')[0]}</p>
                <p>{getInTouch.hours.split(',')[1]}</p>
                <a href={`https://wa.me/92${getInTouch.phone.replace(/\D/g, '').replace(/^0/, '')}`} className="mt-2 flex items-center gap-2 text-brand-gray hover:text-brand-red transition-colors duration-200" target="_blank" rel="noreferrer">
                  <MessageCircle className="h-4 w-4" /> WhatsApp Chat
                </a>
              </div>
            </div>
            {/* Social Icons */}
            <div className="flex gap-3 mt-4">
              <a href={BRAND.facebook} target="_blank" rel="noopener noreferrer" className="text-brand-gray hover:text-brand-red transition-colors duration-200" aria-label="Visit our Facebook page">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="text-brand-gray hover:text-brand-red transition-colors duration-200" aria-label="Visit our Instagram page">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-brand-dark mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-gray hover:text-brand-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Help */}
          <div>
            <h3 className="text-sm font-semibold text-brand-dark mb-4">
              Help
            </h3>
            <ul className="space-y-2">
              {help.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-gray hover:text-brand-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Collections */}
          <div>
            <h3 className="text-sm font-semibold text-brand-dark mb-4">
              Collections
            </h3>
            <ul className="space-y-2">
              {collections.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-gray hover:text-brand-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Legal */}
          <div>
            <h3 className="text-sm font-semibold text-brand-dark mb-4">
              Legal
            </h3>
            <ul className="space-y-2">
              {legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-gray hover:text-brand-red transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods Row */}
        <div className="border-t border-brand-border pt-6 pb-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-brand-gray md:justify-start">
            <span>Payment options:</span>
            <span className="font-medium">Cash on Delivery</span>
            <span className="font-medium">Manual JazzCash</span>
            <span className="font-medium">Manual Easypaisa</span>
          </div>
          <p className="text-xs text-brand-gray">
            &copy; {new Date().getFullYear()} {BRAND.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
