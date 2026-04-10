import Link from 'next/link';
import { Home } from 'lucide-react';

/**
 * Custom 404 page.
 */
export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-brand-light-gray rounded-full flex items-center justify-center mb-8">
        <span className="text-4xl font-bold text-brand-dark">404</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-3">
        Page Not Found
      </h2>
      <p className="text-brand-gray mb-8 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-brand-dark text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-black transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
