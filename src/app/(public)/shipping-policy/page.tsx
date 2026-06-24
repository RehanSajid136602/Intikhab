import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { getMetadata } from "@/lib/seo";

export const metadata: Metadata = getMetadata({
  title: "Shipping Policy | Intikhab",
  description:
    "Shipping policy for Intikhab orders in Pakistan, including delivery timelines, support, and address requirements.",
  path: "/shipping-policy",
});

export default function ShippingPolicyPage() {
  return (
    <LegalPageLayout title="Shipping Policy" lastUpdated="June 24, 2026">
      <section className="space-y-6 text-brand-gray">
        <div>
          <h2 className="mb-3 text-xl font-semibold text-brand-dark">
            Delivery Coverage
          </h2>
          <p>
            Intikhab ships orders across Pakistan. Delivery availability and timelines may vary by city, address quality, courier coverage, and public holidays.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-brand-dark">
            Estimated Delivery Time
          </h2>
          <p>
            Standard delivery usually takes 3 to 5 business days after order confirmation. Remote areas can take longer.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-brand-dark">
            Shipping Fee
          </h2>
          <p>
            Shipping is confirmed during checkout or by support after order placement. If free delivery applies, it will be shown clearly before confirmation.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-brand-dark">
            Address Requirements
          </h2>
          <p>
            Please provide your full name, phone number, city, postal code, and complete delivery address. Orders with incomplete contact details may be delayed.
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-semibold text-brand-dark">
            Order Confirmation
          </h2>
          <p>
            For Cash on Delivery orders, Intikhab may confirm the order by phone or WhatsApp before dispatch.
          </p>
        </div>
      </section>
    </LegalPageLayout>
  );
}
