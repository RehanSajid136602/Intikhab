import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Intikhab Shoe Store',
  description: 'Blog posts coming soon. Stay tuned for the latest updates on shoes, fashion trends, and more.',
  openGraph: {
    title: 'Blog | Intikhab Shoe Store',
    description: 'Blog posts coming soon. Stay tuned for the latest updates on shoes, fashion trends, and more.',
    url: '/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Intikhab Shoe Store',
    description: 'Blog posts coming soon. Stay tuned for the latest updates on shoes, fashion trends, and more.',
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">
            Blog
          </h1>
          <p className="text-xl text-brand-gray mb-8">
            Blog posts coming soon!
          </p>
          <p className="text-brand-gray">
            Stay tuned for the latest updates on shoes, fashion trends, style tips, and more.
          </p>
          <div className="mt-12">
            <a
              href="/"
              className="inline-block bg-brand-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-red/90 transition-colors"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
