import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, PageShell } from "@/components/ui/PageShell";
import { getMetadata } from "@/lib/seo";
import { BUSINESS, SERVICE_CITIES, buildShippingCitiesLine } from "@/lib/business";

export const metadata: Metadata = getMetadata({
  title: "About Intikhab — Premium Footwear in Pakistan",
  description:
    "Learn about Intikhab, a Pakistan-based fashion footwear store focused on selected styles, reliable delivery, and easy support.",
  path: "/about",
});

export default function AboutPage() {
  const citiesLine = buildShippingCitiesLine(SERVICE_CITIES);
  return (
    <PageShell>
      <PageHeader
        eyebrow="About Intikhab"
        title="Selected footwear for everyday confidence."
        description="Intikhab is built around a simple promise: make it easy for Pakistani shoppers to find polished, wearable shoes with clear pricing, dependable support, and a calm buying experience."
      />

      <section className="store-container pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ["Curated selection", "We focus on styles that work for real wardrobes instead of overwhelming you with endless clutter."],
            ["Pakistan-first support", "Cash on Delivery, WhatsApp support, and clear local delivery expectations are part of the buying flow."],
            ["Fit matters", "Size guidance, exchanges, and stock-aware size selection help reduce guesswork before checkout."],
          ].map(([title, body]) => (
            <article key={title} className="surface-card p-6">
              <h2 className="text-lg font-semibold text-brand-dark">{title}</h2>
              <p className="body-muted mt-3">{body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-card bg-brand-dark px-6 py-8 text-white md:px-10">
          <p className="eyebrow text-brand-sand">Serving customers across Pakistan</p>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">
            Message us before you order.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
            {BUSINESS.name} delivers nationwide from {BUSINESS.baseCity}. {citiesLine}{" "}
            If you are unsure about size, delivery, or product availability, contact support and we will help before you checkout.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/products" className="primary-cta">
              Shop Collection
            </Link>
            <Link href="/contact" className="secondary-cta border-white text-white hover:bg-white hover:text-brand-dark">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
