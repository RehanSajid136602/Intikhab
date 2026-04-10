import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Intikhab Shoe Store',
  description: 'Read our Terms & Conditions for purchasing shoes online in Pakistan. Learn about order placement, payment terms, shipping policies, and consumer rights.',
  openGraph: {
    title: 'Terms & Conditions | Intikhab Shoe Store',
    description: 'Read our Terms & Conditions for purchasing shoes online in Pakistan. Learn about order placement, payment terms, shipping policies, and consumer rights.',
    url: '/terms-and-conditions',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms & Conditions | Intikhab Shoe Store',
    description: 'Read our Terms & Conditions for purchasing shoes online in Pakistan. Learn about order placement, payment terms, shipping policies, and consumer rights.',
  },
};

export default function TermsAndConditionsPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated={currentDate}>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Acceptance of Terms
        </h2>
        <p className="mb-4">
          By accessing and using the Intikhab website, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our website.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Product Descriptions & Pricing
        </h2>
        <p className="mb-4">
          We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions, colors, or other content are accurate, complete, reliable, current, or error-free.
        </p>
        <p className="mb-4">
          Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Order Placement & Cancellation
        </h2>
        <p className="mb-4">
          When you place an order through our website, you are offering to purchase the products listed in your order. Your order constitutes an offer to purchase and is not accepted by us until we confirm the order by email.
        </p>
        <p className="mb-4">
          We reserve the right to refuse or cancel any order for any reason, including but not limited to product availability, errors in pricing or product information, or suspected fraud.
        </p>
        <p className="mb-4">
          You may cancel your order within <strong>24 hours</strong> of placing it by contacting our customer service at <a href="mailto:intikhab.pakistan@gmail.com" className="font-bold text-brand-red hover:underline">intikhab.pakistan@gmail.com</a>.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Return & Exchange Policy
        </h2>
        <p className="mb-4">
          We offer a <strong>7-day return policy</strong> from the date of delivery. This 7-day window includes courier time, so please initiate your return promptly.
        </p>
        <p className="mb-4">
          <strong>Return Conditions:</strong>
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>You must notify us within 2-3 days of delivery if you wish to return the item</li>
          <li>Shoes should be in almost the same condition as when you received them</li>
          <li>Original packaging and tags must be intact</li>
          <li>Shoes must be unworn</li>
        </ul>
        <p className="mb-4">
          <strong>How to Initiate a Return:</strong>
        </p>
        <p className="mb-4">
          Contact us at <a href="mailto:intikhab.pakistan@gmail.com" className="font-bold text-brand-red hover:underline">intikhab.pakistan@gmail.com</a> or call <a href="tel:03192776896" className="font-bold text-brand-red hover:underline">0319 2776896</a> to initiate your return. Our team will guide you through the process and provide return shipping instructions.
        </p>
        <p className="mb-4">
          <strong>Size Exchanges:</strong>
        </p>
        <p className="mb-4">
          If the size doesn't fit, we offer free size exchanges within the 7-day return window, subject to availability.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Payment Terms
        </h2>
        <p className="mb-4">
          We accept the following payment methods:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Credit/Debit Cards (Visa, MasterCard)</li>
          <li>JazzCash</li>
          <li>Easypaisa</li>
          <li>Cash on Delivery (COD)</li>
        </ul>
        <p className="mb-4">
          Prices displayed are <strong>inclusive</strong> of applicable GST as per FBR requirements.
        </p>
        <p className="mb-4">
          All payments are processed securely through our payment partners. We do not store your complete credit card information on our servers.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Intellectual Property
        </h2>
        <p className="mb-4">
          All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of Intikhab or its content suppliers and is protected by copyright laws.
        </p>
        <p className="mb-4">
          You may not use, reproduce, modify, or distribute any content from this website without our prior written consent.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Limitation of Liability
        </h2>
        <p className="mb-4">
          Intikhab shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of this website.
        </p>
        <p className="mb-4">
          In no event shall our total liability to you for all claims exceed the amount you paid to us for the products purchased through this website.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Consumer Rights
        </h2>
        <p className="mb-4">
          We comply with the Consumer Protection Acts of all provinces of Pakistan. Your rights as a consumer are protected under these provincial laws, including rights related to product quality, fair pricing, and dispute resolution.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Governing Law
        </h2>
        <p className="mb-4">
          This agreement is governed by the laws of Pakistan. Any disputes shall be subject to the exclusive jurisdiction of courts in <strong>Rawalpindi</strong>, Pakistan. We comply with the Consumer Protection Acts of all provinces of Pakistan.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section>
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Contact Us
        </h2>
        <p className="mb-4">
          If you have any questions about these Terms & Conditions, please contact us:
        </p>
        <ul className="list-none space-y-2">
          <li>
            <strong>Email:</strong>{' '}
            <a href="mailto:intikhab.pakistan@gmail.com" className="font-bold text-brand-red hover:underline">
              intikhab.pakistan@gmail.com
            </a>
          </li>
          <li>
            <strong>Phone:</strong>{' '}
            <a href="tel:03192776896" className="font-bold text-brand-red hover:underline">
              0319 2776896
            </a>
          </li>
        </ul>
      </section>
    </LegalPageLayout>
  );
}
