'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { footerLinks } from '@/data/navigation';
import { BRAND } from '@/lib/constants';

/**
 * Full 5-column footer with contact info, quick links, help, collections, legal,
 * social media icons, payment methods row, and copyright.
 */
function Footer() {
  const { getInTouch, quickLinks, help, collections, legal } = footerLinks;

  return (
    <footer className="bg-white border-t border-brand-border pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Row 1: 5 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Col 1: Get In Touch */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-sm font-semibold text-brand-dark mb-4">
              Get In Touch
            </h3>
            <div className="space-y-2 text-sm text-brand-gray">
              <Link href="/coming-soon" className="text-brand-gray hover:text-brand-red transition-colors">
                ✉️ {getInTouch.email}
              </Link>
              <p>📞 {getInTouch.phone}</p>
              <p className="font-semibold text-brand-dark mt-4">
                Customer Services Timing
              </p>
              <div className="space-y-2 text-sm text-brand-gray">
                <p>{getInTouch.hours.split(',')[0]}</p>
                <p>{getInTouch.hours.split(',')[1]}</p>
                <Link href="/coming-soon" className="text-brand-gray hover:text-brand-red transition-colors duration-200 mt-2 block">
                  💬 WhatsApp Chat
                </Link>
              </div>
            </div>
            {/* Social Icons */}
            <div className="flex gap-3 mt-4">
              <a href={BRAND.facebook} target="_blank" rel="noopener noreferrer" className="text-brand-gray hover:text-brand-red transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="text-brand-gray hover:text-brand-red transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="/coming-soon" className="text-brand-gray hover:text-brand-red transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="/coming-soon" className="text-brand-gray hover:text-brand-red transition-colors duration-200">
                <Youtube className="w-5 h-5" />
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
          <div className="flex items-center gap-4 text-sm text-brand-gray">
            <span>Accepted Payments:</span>
            <span className="font-medium">Visa</span>
            <span className="font-medium">MasterCard</span>
            <span className="font-medium">JazzCash</span>
            <span className="font-medium">EasyPaisa</span>
            <span className="font-medium">COD</span>
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
