import type { Metadata } from 'next';
import { getMetadata } from '@/lib/seo';
import ComingSoonClient from './ComingSoonClient';

export const metadata: Metadata = getMetadata({
  title: 'Coming Soon | Intikhab Shoe Store',
  description: 'Exciting new collections and features coming soon to Intikhab. Stay tuned for the latest shoe trends and exclusive offers.',
  path: '/coming-soon',
});

export default function ComingSoonPage() {
  return <ComingSoonClient />;
}
