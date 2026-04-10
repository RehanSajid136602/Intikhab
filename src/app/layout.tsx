import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import Script from 'next/script';
import { UtilityBar } from '@/components/layout/UtilityBar';
import { Navbar } from '@/components/layout/Navbar';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { Footer } from '@/components/layout/Footer';
import dynamic from 'next/dynamic';
import './globals.css';

const CartDrawer = dynamic(
  () => import('@/components/cart/CartDrawer').then((m) => m.CartDrawer),
  { ssr: false, loading: () => null },
);

const BackToTop = dynamic(
  () => import('@/components/BackToTop').then((m) => m.BackToTop),
  { ssr: false },
);

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://intikhab.vercel.app'),
  title: {
    default: 'Intikhab — Pakistan\'s #1 Online Shoe Store',
    template: '%s | Intikhab',
  },
  description:
    'Shop the latest sneakers, shoes, and accessories for men, women, and kids. Free nationwide delivery on prepaid orders. Cash on delivery available.',
  icons: {
    icon: '/favicon.ico',
  },
  keywords: [
    'shoes',
    'sneakers',
    'footwear',
    'Pakistan',
    'online shopping',
    'men shoes',
    'women shoes',
    'kids shoes',
    'Intikhab',
  ],
  authors: [{ name: 'Intikhab' }],
  creator: 'Intikhab',
  publisher: 'Intikhab',
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://intikhab.vercel.app',
    siteName: 'Intikhab',
    title: 'Intikhab — Selection That Matters',
    description:
      'Shop the latest sneakers, shoes, and accessories for men, women, and kids. Free nationwide delivery.',
    images: [
      {
        url: '/shoe_collection.jpeg',
        width: 1200,
        height: 630,
        alt: 'Intikhab Shoe Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Intikhab — Selection That Matters',
    description:
      'Shop the latest sneakers, shoes, and accessories for men, women, and kids.',
    images: ['/shoe_collection.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

/**
 * Root layout with Poppins font, Toaster provider, and persistent layout components.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="bg-white font-poppins">
        <UtilityBar />
        <Navbar />
        <MobileMenu />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
        <BackToTop />
        <Toaster position="top-right" richColors />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
