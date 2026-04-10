import dynamic from 'next/dynamic';
import { UtilityBar } from '@/components/layout/UtilityBar';
import { Navbar } from '@/components/layout/Navbar';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/BackToTop';

const CartDrawer = dynamic(
  () => import('@/components/cart/CartDrawer').then((m) => m.CartDrawer),
  { ssr: false, loading: () => null },
);

/**
 * Public site layout with navbar, footer, cart drawer, etc.
 * Wraps all customer-facing pages (home, products, checkout, etc.).
 * Does NOT wrap admin pages.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UtilityBar />
      <Navbar />
      <MobileMenu />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
