import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { BRAND } from '@/lib/constants';
import type { Metadata } from 'next';
import { getMetadata } from '@/lib/seo';

export const metadata: Metadata = getMetadata({
  title: 'Privacy Policy | Intikhab Shoe Store',
  description: 'Learn how Intikhab protects your personal information. Our Privacy Policy explains data collection, usage, and your rights under Pakistani law.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated={currentDate}>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Information We Collect
        </h2>
        <p className="mb-4">
          At {BRAND.name}, we collect the following types of personal information to provide you with the best shopping experience:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>
            <strong>Contact Information:</strong> Name, email address, phone number, and shipping/billing address
          </li>
          <li>
            <strong>Payment Information:</strong> Credit/debit card details, JazzCash, and Easypaisa information (processed securely through payment gateways)
          </li>
          <li>
            <strong>Account Information:</strong> Username, password (encrypted), and order history
          </li>
          <li>
            <strong>Browsing Data:</strong> IP address, device type, browser information, and pages visited
          </li>
        </ul>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          How We Use Your Information
        </h2>
        <p className="mb-4">
          We use your personal information for the following purposes:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Processing and fulfilling your orders</li>
          <li>Sending order confirmations and shipping notifications</li>
          <li>Providing customer support and responding to your inquiries</li>
          <li>Sending marketing communications (with your consent)</li>
          <li>Improving our website, products, and services</li>
          <li>Preventing fraud and ensuring website security</li>
        </ul>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Third-Party Sharing
        </h2>
        <p className="mb-4">
          We may share your information with trusted third parties who assist us in operating our website:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>
            <strong>Payment Processors:</strong> JazzCash, Easypaisa, and secure payment gateways for processing transactions
          </li>
          <li>
            <strong>Shipping Partners:</strong> Courier services for delivering your orders across Pakistan
          </li>
          <li>
            <strong>Analytics Providers:</strong> To understand website traffic and improve user experience
          </li>
        </ul>
        <p className="mb-4">
          We never sell your personal information to third parties for their marketing purposes.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Cookie Usage
        </h2>
        <p className="mb-4">
          We use cookies to enhance your browsing experience. Cookies are small text files stored on your device that help us:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Remember your preferences and login information</li>
          <li>Analyze website traffic and user behavior</li>
          <li>Provide personalized content and advertisements</li>
        </ul>
        <p className="mb-4">
          You can manage your cookie preferences through your browser settings. Please refer to our{' '}
          <a href="/cookie-policy" className="text-brand-red hover:underline">
            Cookie Policy
          </a>{' '}
          for more details.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Legal Basis & Compliance
        </h2>
        <p className="mb-4">
          Our data handling practices comply with the{' '}
          <strong>Prevention of Electronic Crimes Act (PECA) 2016</strong>, specifically Section 38, which prohibits unauthorized disclosure of personal data under Pakistani law.
        </p>
        <p className="mb-4">
          We ensure that all personal data is collected, processed, and stored with appropriate security measures to prevent unauthorized access or disclosure.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Your Rights
        </h2>
        <p className="mb-4">
          You have the following rights regarding your personal information:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li><strong>Access:</strong> Request a copy of your personal data</li>
          <li><strong>Deletion:</strong> Request deletion of your personal data</li>
          <li><strong>Correction:</strong> Request correction of inaccurate data</li>
          <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
        </ul>
        <p className="mb-4">
          To exercise these rights, please contact us at{' '}
          <span className="bg-yellow-200 px-2 py-1 rounded font-semibold">
            intikhab.pakistan@gmail.com
          </span>
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section>
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Contact Us
        </h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <ul className="list-none space-y-2">
          <li>
            <strong>Email:</strong>{' '}
            <span className="bg-yellow-200 px-2 py-1 rounded font-semibold">
              intikhab.pakistan@gmail.com
            </span>
          </li>
          <li>
            <strong>Phone:</strong>{' '}
            <span className="bg-yellow-200 px-2 py-1 rounded font-semibold">
              +92 332 3130689
            </span>
          </li>
        </ul>
      </section>
    </LegalPageLayout>
  );
}
