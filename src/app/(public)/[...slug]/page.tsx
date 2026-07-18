import type { Metadata } from 'next';
import { ComingSoonPage } from '@/components/ui/ComingSoon';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CatchAllPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const routeLabel = params.slug
    .map((segment) => segment.replace(/-/g, ' '))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' — ');

  return <ComingSoonPage routeLabel={routeLabel} />;
}
