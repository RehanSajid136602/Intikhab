import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { getMetadata } from "@/lib/seo";

export const metadata: Metadata = getMetadata({
  title: "Return & Exchange Policy | Intikhab",
  description:
    "Read Intikhab's return and exchange policy for footwear orders in Pakistan, including size exchange conditions.",
  path: "/return-exchange-policy",
});

export default function ReturnExchangePolicyPage() {
  return (
    <LegalPageLayout title="Return & Exchange Policy" lastUpdated="June 24, 2026">
      <section className="space-y-6 text-brand-gray">
        <div>
          <h2 className="mb-3 text-xl font-semibold text-brand-dark">
            Return Window
          </h2>
          <p>
            We offer a 7-day return window from the date of delivery. Please contact support as early as possible if you need help with a return or exchange.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-brand-dark">
            Product Condition
          </h2>
          <p>
            Items must be unworn, clean, and returned with original packaging, tags, and accessories where applicable. Used or damaged products may not qualify.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-brand-dark">
            Size Exchange
          </h2>
          <p>
            Size exchanges are subject to stock availability. If your requested size is not available, support will guide you through the available options.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-brand-dark">
            How to Request Help
          </h2>
          <p>
            Contact us at intikhab.pakistan@gmail.com or WhatsApp/call +92 332 3130689 with your order ID, product name, and reason for return or exchange.
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
