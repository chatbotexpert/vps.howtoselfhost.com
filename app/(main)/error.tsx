'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Something went wrong</h2>
        <p className="text-muted text-sm mb-6">
          We encountered an unexpected error. Please try again or contact support if the issue persists.
        </p>
        <button
          onClick={() => reset()}
          className="bg-accent hover:opacity-90 text-white px-6 py-2.5 rounded-full font-semibold transition-all text-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
