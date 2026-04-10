import { LegalPageLayout } from '@/components/legal/LegalPageLayout';
import { Accordion } from '@/components/ui/Accordion';

export default function FAQPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const faqItems = [
    // Orders
    {
      question: 'How do I place an order?',
      answer: 'Add items to your cart, proceed to checkout, and pay via your preferred method (JazzCash, Easypaisa, Credit/Debit Card, or Cash on Delivery).',
    },
    {
      question: 'Can I cancel my order?',
      answer: `Yes, you can cancel your order within <span class="bg-yellow-200 px-2 py-1 rounded font-semibold">[X hours]</span> of placing it by contacting us at <span class="bg-yellow-200 px-2 py-1 rounded font-semibold">[BUSINESS_EMAIL]</span>.`,
    },
    // Shipping
    {
      question: 'How long does delivery take?',
      answer: `Delivery typically takes <span class="bg-yellow-200 px-2 py-1 rounded font-semibold">[X–Y business days]</span> depending on your location in Pakistan.`,
    },
    {
      question: 'Do you deliver across Pakistan?',
      answer: `Yes, we deliver nationwide via <span class="bg-yellow-200 px-2 py-1 rounded font-semibold">[COURIER_NAME]</span>.`,
    },
    {
      question: 'How do I track my order?',
      answer: 'Once your order is shipped, you will receive a tracking link via email and WhatsApp. You can use this link to track your package in real-time.',
    },
    // Returns
    {
      question: 'What is your return policy?',
      answer: `You can return unused items in their original packaging within <span class="bg-yellow-200 px-2 py-1 rounded font-semibold">[RETURN_WINDOW]</span> days of delivery.`,
    },
    {
      question: 'How do I initiate a return?',
      answer: `Contact us at <span class="bg-yellow-200 px-2 py-1 rounded font-semibold">[BUSINESS_EMAIL]</span> or call <span class="bg-yellow-200 px-2 py-1 rounded font-semibold">[PHONE]</span> to initiate your return.`,
    },
    {
      question: 'Can I exchange for a different size?',
      answer: 'Yes, you can exchange for a different size within the return window, subject to availability.',
    },
    // Sizing
    {
      question: 'Are your shoes true to size?',
      answer: 'Generally yes, but we recommend checking our <a href="/size-guide" class="text-brand-red hover:underline">Size Guide</a> for accurate measurements.',
    },
    {
      question: 'What if I am between sizes?',
      answer: 'If you are between sizes, we recommend sizing up for better comfort.',
    },
    // Payment
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept JazzCash, Easypaisa, Credit/Debit Cards (Visa, MasterCard), and Cash on Delivery (COD).',
    },
    {
      question: 'Is online payment secure?',
      answer: `Yes, all online payments are processed securely via <span class="bg-yellow-200 px-2 py-1 rounded font-semibold">[PAYMENT_GATEWAY]</span> with industry-standard encryption.`,
    },
    {
      question: 'Do prices include GST?',
      answer: `<span class="bg-yellow-200 px-2 py-1 rounded font-semibold">[YES/NO]</span> - Please check the product page for pricing details.`,
    },
  ];

  return (
    <LegalPageLayout title="Frequently Asked Questions" lastUpdated={currentDate}>
      <section className="mb-8">
        <p className="text-brand-gray mb-6">
          Find answers to common questions about orders, shipping, returns, sizing, and payment. Can't find what you're looking for? Contact our support team.
        </p>
      </section>

      <Accordion items={faqItems} />
    </LegalPageLayout>
  );
}
