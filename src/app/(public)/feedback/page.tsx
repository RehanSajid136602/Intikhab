import type { Metadata } from 'next';
import { getMetadata } from '@/lib/seo';
import { FeedbackPageClient } from './FeedbackPageClient';

export const metadata: Metadata = getMetadata({
  title: 'Feedback | Intikhab',
  description: 'We value your feedback. Help us improve Intikhab.',
  path: '/feedback',
  noindex: true,
});

export default function FeedbackPage() {
  return <FeedbackPageClient />;
}
