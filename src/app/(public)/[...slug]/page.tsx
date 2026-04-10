import { ComingSoonPage } from '@/components/ui/ComingSoon';

/**
 * Catch-all route for any unimplemented paths.
 * Maps the URL segments to a human-readable label (e.g. /men/casual → "Men — Casual").
 * Does NOT shadow existing routes (/, /admin, /admin/*) since static routes take priority.
 */
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
