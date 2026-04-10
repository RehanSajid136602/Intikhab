'use client';

import { useEffect } from 'react';

/**
 * Global error boundary for the app router.
 * Displays error message with a reset button.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-2xl font-bold text-brand-dark mb-2">
        Something went wrong
      </h2>
      <p className="text-brand-gray text-sm mb-6">
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="bg-brand-dark text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
