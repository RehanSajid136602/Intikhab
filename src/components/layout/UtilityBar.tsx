import { Phone, Mail } from 'lucide-react';
import { BRAND } from '@/lib/constants';
import Link from 'next/link';

/**
 * Top utility bar with contact info and quick links.
 * Hidden on mobile except phone number.
 */
function UtilityBar() {
  return (
    <div className="border-b border-brand-border h-8 flex items-center">
      <div className="container mx-auto px-4 flex justify-between items-center text-xs text-brand-gray w-full">
        <div className="hidden md:flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {BRAND.phone}
          </span>
          <span className="flex items-center gap-1">
            <Mail className="w-3 h-3" />
            {BRAND.email}
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 ml-auto">
          <Link href="/coming-soon" className="hover:text-brand-dark transition-colors">
            Track Order
          </Link>
          <span className="text-brand-border">|</span>
          <Link href="/coming-soon" className="hover:text-brand-dark transition-colors">
            Store Locator
          </Link>
          <span className="text-brand-border">|</span>
          <span>Free Delivery on Prepaid Orders</span>
        </div>
        <div className="md:hidden text-xs text-brand-gray">
          <span>📞 {BRAND.phone}</span>
        </div>
      </div>
    </div>
  );
}

export { UtilityBar };
