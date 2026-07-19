import type { Metadata } from "next";
import { getMetadata } from "@/lib/seo";
import TrackOrderClient from "./TrackOrderClient";

export const metadata: Metadata = getMetadata({
  title: "Track Order — Intikhab",
  description:
    "Track your Intikhab shoe order with your Order ID and phone number. No login required.",
  path: "/track-order",
});

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
