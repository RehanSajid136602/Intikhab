import { ReactNode } from 'react';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

/**
 * Reusable layout component for legal pages (Privacy Policy, Terms & Conditions, etc.).
 * Provides consistent styling with title, last updated date, and centered content.
 */
export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
            {title}
          </h1>
          <p className="text-brand-gray">
            Last updated: {lastUpdated}
          </p>
        </header>
        
        <main className="prose prose-lg max-w-none">
          {children}
        </main>
      </div>
    </div>
  );
}
