import { Metadata } from 'next';
import ComingSoonClient from './ComingSoonClient';

export const metadata: Metadata = {
  title: 'Coming Soon | Intikhab Shoe Store',
  description: 'Exciting new collections and features coming soon to Intikhab. Stay tuned for the latest shoe trends and exclusive offers.',
  openGraph: {
    title: 'Coming Soon | Intikhab Shoe Store',
    description: 'Exciting new collections and features coming soon to Intikhab. Stay tuned for the latest shoe trends and exclusive offers.',
    url: '/coming-soon',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Coming Soon | Intikhab Shoe Store',
    description: 'Exciting new collections and features coming soon to Intikhab. Stay tuned for the latest shoe trends and exclusive offers.',
  },
};

export default function ComingSoonPage() {
  return <ComingSoonClient />;
}
