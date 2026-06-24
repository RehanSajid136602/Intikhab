'use client';

import { useState, useEffect } from 'react';
import { MessageSquareText, Star, ExternalLink } from 'lucide-react';
import { getLatestFeedback } from '@/app/admin/actions';
import type { AdminFeedback } from '@/types/feedback';
import Link from 'next/link';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils';

const typeLabels: Record<string, string> = {
  bug: 'Bug Report',
  suggestion: 'Suggestion',
  content_issue: 'Content Issue',
  general: 'General Feedback',
};

const typeColors: Record<string, string> = {
  bug: 'text-brand-red bg-red-50',
  suggestion: 'text-blue-600 bg-blue-50',
  content_issue: 'text-amber-600 bg-amber-50',
  general: 'text-brand-dark bg-brand-light-gray',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            'w-3 h-3',
            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-brand-border',
          )}
        />
      ))}
    </div>
  );
}

export function LatestFeedback() {
  const [feedback, setFeedback] = useState<AdminFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestFeedback(5).then((data) => {
      setFeedback(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-white rounded-sm border border-brand-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">
          Latest Feedback
        </h3>
        <Link
          href="/admin/feedback"
          className="text-xs text-brand-gray hover:text-brand-dark transition-colors flex items-center gap-1"
        >
          View all
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-brand-gray">
          Loading feedback...
        </div>
      ) : feedback.length === 0 ? (
        <div className="py-8 text-center">
          <MessageSquareText className="w-8 h-8 text-brand-gray/40 mx-auto mb-2" />
          <p className="text-sm text-brand-gray">No feedback yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedback.map((f) => (
            <div
              key={f.id}
              className="border border-brand-border rounded-sm p-3 hover:bg-brand-light-gray/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-1.5 py-0.5 rounded-sm',
                      typeColors[f.type] || typeColors.general,
                    )}
                  >
                    {typeLabels[f.type] || f.type}
                  </span>
                  {f.status === 'new' && (
                    <span className="text-[10px] font-semibold text-brand-red bg-red-50 px-1.5 py-0.5 rounded-sm">
                      New
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-brand-gray whitespace-nowrap">
                  {formatDate(f.createdAt)}
                </span>
              </div>
              {f.subject && (
                <p className="text-xs font-medium text-brand-dark truncate mb-0.5">{f.subject}</p>
              )}
              <p className="text-sm text-brand-dark line-clamp-2 mb-1">
                {f.message}
              </p>
              <div className="flex items-center justify-between">
                <StarRating rating={f.rating} />
                <span className="text-[11px] text-brand-gray truncate max-w-[150px]">
                  {f.name || f.customerEmail || f.email || 'Unknown'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
