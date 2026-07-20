import type { Metadata } from "next";
import { ComingSoonPage } from '@/components/ui/ComingSoon';
import { getMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}): Promise<Metadata> {
  const path = `/${params.slug.join('/')}`;
  return getMetadata({
    title: "Page Coming Soon | Intikhab",
    description: "This page is coming soon. Stay tuned!",
    path,
    noindex: true,
  });
}

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
