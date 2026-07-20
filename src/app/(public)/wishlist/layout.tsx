import type { Metadata } from "next";
import { getMetadata } from "@/lib/seo";

export const metadata: Metadata = getMetadata({
  title: "My Wishlist | Intikhab",
  description: "View and manage your wishlist items at Intikhab.",
  path: "/wishlist",
  noindex: true,
});

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
