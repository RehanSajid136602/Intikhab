import type { Metadata } from "next";
import { getMetadata } from "@/lib/seo";

export const metadata: Metadata = getMetadata({
  title: "Order Confirmed | Intikhab",
  description: "Thank you for your order. Your purchase has been confirmed.",
  path: "/order-confirmation",
  noindex: true,
});

export default function OrderConfirmationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
