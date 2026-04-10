import { LegalPageLayout } from '@/components/legal/LegalPageLayout';

export default function CookiePolicyPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated={currentDate}>
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          What Are Cookies?
        </h2>
        <p className="mb-4">
          Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by allowing the website to remember your preferences and understand how you use our services.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          How We Use Cookies
        </h2>
        <p className="mb-4">
          We use cookies to improve your experience in the following ways:
        </p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li><strong>Essential Cookies:</strong> Required for the website to function properly (navigation, cart, checkout)</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website (Google Analytics)</li>
        </ul>
        <p className="mb-4">
          No legal obligation under Pakistani law requires this disclosure, but we include it for transparency.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          Managing Cookies
        </h2>
        <p className="mb-4">
          You can disable cookies through your browser settings. Most browsers allow you to block or delete cookies. Please note that disabling essential cookies may affect website functionality.
        </p>
      </section>

      <hr className="border-brand-border my-8" />

      <section>
        <h2 className="text-xl font-semibold text-brand-dark mb-4">
          More Information
        </h2>
        <p className="mb-4">
          For more information about how we collect, use, and protect your personal data, please refer to our{' '}
          <a href="/privacy-policy" className="text-brand-red hover:underline">
            Privacy Policy
          </a>.
        </p>
        <p className="mb-4">
          If you have any questions about our use of cookies, please contact us at{' '}
          <span className="bg-yellow-200 px-2 py-1 rounded font-semibold">
            [BUSINESS_EMAIL]
          </span>.
        </p>
      </section>
    </LegalPageLayout>
  );
}
