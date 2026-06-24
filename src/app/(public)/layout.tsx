import dynamic from 'next/dynamic';
import { UtilityBar } from '@/components/layout/UtilityBar';
import { NavbarWrapper } from '@/components/layout/NavbarWrapper';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/BackToTop';

const CartDrawer = dynamic(
  () => import('@/components/cart/CartDrawer').then((m) => m.CartDrawer),
  { ssr: false, loading: () => null },
);

const FeedbackWidget = dynamic(
  () => import('@/components/FeedbackWidget').then((m) => m.FeedbackWidget),
  { ssr: false, loading: () => null },
);

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <UtilityBar />
      <NavbarWrapper />
      <MobileMenu />
      <CartDrawer />
      <FeedbackWidget />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </>
  );
}
