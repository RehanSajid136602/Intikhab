import type { Metadata } from "next";
import { getMetadata } from "@/lib/seo";

export const metadata: Metadata = getMetadata({
  title: "Secure Checkout | Intikhab",
  description: "Complete your purchase securely at Intikhab.",
  path: "/checkout",
  noindex: true,
});

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
