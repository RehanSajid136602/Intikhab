import type { Metadata } from 'next';
import { FeedbackPageClient } from './FeedbackPageClient';

export const metadata: Metadata = {
  title: 'Feedback - Intikhab',
  description: 'We value your feedback. Help us improve Intikhab.',
};

export default function FeedbackPage() {
  return <FeedbackPageClient />;
}
