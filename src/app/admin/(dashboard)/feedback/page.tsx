'use client';

import { useState, useEffect, useMemo } from 'react';
import { MessageSquareText, Star, Search, CheckCircle2, Clock } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { AdminStatusBadge } from '@/components/admin/AdminStatusBadge';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { getFeedbackList, getFeedbackStats, updateFeedbackStatus } from '@/app/admin/actions';
import { cn } from '@/lib/utils';
import type { AdminFeedback, FeedbackType, FeedbackStatus } from '@/types/feedback';

const typeLabels: Record<FeedbackType, string> = {
  bug: 'Bug Report',
  suggestion: 'Suggestion',
  content_issue: 'Content Issue',
  general: 'General Feedback',
};

const typeVariants: Record<FeedbackType, 'red' | 'yellow' | 'green' | 'purple'> = {
  bug: 'red',
  suggestion: 'yellow',
  content_issue: 'green',
  general: 'purple',
};

const statusVariants: Record<FeedbackStatus, 'red' | 'green' | 'gray'> = {
  new: 'red',
  read: 'gray',
  resolved: 'green',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });
}

function StarRating({ rating, size = 'sm' }: { rating: number | null; size?: 'sm' | 'md' }) {
  if (!rating) return null;
  const cls = size === 'md' ? 'w-4 h-4' : 'w-3 h-3';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            cls,
            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-brand-border',
          )}
        />
      ))}
    </div>
  );
}

type FilterValue = 'all' | FeedbackStatus;

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<AdminFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterValue>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [stats, setStats] = useState({ new: 0, read: 0, resolved: 0, total: 0, avgRating: null as string | null });

  useEffect(() => {
    Promise.all([getFeedbackList(), getFeedbackStats()]).then(([data, s]) => {
      setFeedback(data);
      setStats(s);
      setLoading(false);
    });
  }, []);

  const filteredFeedback = useMemo(() => {
    let result = feedback;
    if (filter !== 'all') {
      result = result.filter((f) => f.status === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) => f.message.toLowerCase().includes(q) || (f.email || '').toLowerCase().includes(q) || f.type.toLowerCase().includes(q),
      );
    }
    return result;
  }, [feedback, filter, search]);

  const selectedFeedback = feedback.find((f) => f.id === selectedId) || null;

  const handleStatusChange = async (id: string, status: FeedbackStatus) => {
    const result = await updateFeedbackStatus(id, status);
    if (result.success) {
      setFeedback((prev) => prev.map((f) => f.id === id ? { ...f, status } : f));
      if (status === 'resolved') setSelectedId(null);
    }
  };

  const filters: { key: FilterValue; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: feedback.length },
    { key: 'new', label: 'New', count: stats.new },
    { key: 'read', label: 'Read', count: stats.read },
    { key: 'resolved', label: 'Resolved', count: stats.resolved },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Feedback"
        subtitle="Review user feedback, bug reports, and suggestions."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AdminStatCard label="New" value={loading ? '...' : stats.new.toString()} icon={MessageSquareText} iconBg="bg-brand-red" />
        <AdminStatCard label="Read" value={loading ? '...' : stats.read.toString()} icon={Clock} iconBg="bg-blue-500" />
        <AdminStatCard label="Resolved" value={loading ? '...' : stats.resolved.toString()} icon={CheckCircle2} iconBg="bg-brand-green" />
        <AdminStatCard label="Avg Rating" value={loading ? '...' : stats.avgRating || '—'} icon={Star} iconBg="bg-amber-500" />
      </div>

      <div className="bg-white rounded-sm border border-brand-border p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-sm transition-colors ${
                  filter === f.key
                    ? 'bg-brand-dark text-white'
                    : 'text-brand-gray hover:text-brand-dark hover:bg-brand-light-gray'
                }`}
              >
                {f.label}
                <span className="ml-1.5 opacity-60">({f.count})</span>
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-brand-gray absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search feedback..."
              className="w-full border border-brand-border pl-9 pr-4 py-1.5 text-sm outline-none focus:border-brand-dark transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm border border-brand-border overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[500px]">
          <div className={`lg:w-[400px] lg:min-w-[400px] border-r border-brand-border ${selectedId ? 'hidden lg:block' : 'block'}`}>
            <div className="overflow-y-auto max-h-[600px]">
              {loading ? (
                <div className="p-8 text-center text-sm text-brand-gray">Loading feedback...</div>
              ) : filteredFeedback.length === 0 ? (
                <AdminEmptyState
                  icon={MessageSquareText}
                  title="No feedback yet"
                  description="User feedback from the website will appear here."
                />
              ) : (
                filteredFeedback.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { setSelectedId(f.id); if (f.status === 'new') handleStatusChange(f.id, 'read'); }}
                    className={`w-full text-left px-5 py-4 border-b border-brand-border/50 hover:bg-brand-light-gray/50 transition-colors ${
                      selectedId === f.id ? 'bg-brand-light-gray/50 border-l-2 border-l-brand-dark' : ''
                    } ${f.status === 'new' ? 'bg-brand-red/[0.02]' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <AdminStatusBadge variant={typeVariants[f.type]}>{typeLabels[f.type]}</AdminStatusBadge>
                        {f.status === 'new' && (
                          <span className="text-[10px] font-bold text-brand-red">NEW</span>
                        )}
                      </div>
                      <span className="text-[11px] text-brand-gray whitespace-nowrap">
                        {formatDate(f.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-brand-dark truncate mb-0.5">
                      {f.subject || '(no subject)'}
                    </p>
                    <p className="text-sm text-brand-dark line-clamp-2 mb-1">{f.message}</p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={f.rating} />
                      <span className="text-[11px] text-brand-gray truncate">
                        {f.name || f.customerEmail || f.email || 'Unknown'}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className={`flex-1 ${selectedId ? 'block' : 'hidden lg:block'}`}>
            {selectedFeedback ? (
              <div className="h-full flex flex-col">
                <div className="border-b border-brand-border px-6 py-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-brand-dark uppercase tracking-wider">Feedback Details</h3>
                  <div className="flex items-center gap-2">
                    {selectedFeedback.status !== 'resolved' && (
                      <button
                        onClick={() => handleStatusChange(selectedFeedback.id, 'resolved')}
                        className="text-xs px-3 py-1.5 text-brand-green border border-brand-green/30 rounded-sm hover:bg-brand-green/5 transition-colors"
                      >
                        Resolve
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedId(null)}
                      className="text-xs text-brand-gray hover:text-brand-dark transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-5 border-b border-brand-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-brand-light-gray flex items-center justify-center text-brand-dark font-bold text-sm">
                        {(selectedFeedback.name || selectedFeedback.customerEmail || 'A')[0].toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-brand-dark">
                          {selectedFeedback.subject || typeLabels[selectedFeedback.type]}
                        </h4>
                        <p className="text-xs text-brand-gray">
                          {selectedFeedback.name ? `${selectedFeedback.name} — ` : ''}
                          {selectedFeedback.customerEmail || selectedFeedback.email || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center text-xs text-brand-gray">
                      <AdminStatusBadge variant={typeVariants[selectedFeedback.type]}>{typeLabels[selectedFeedback.type]}</AdminStatusBadge>
                      <AdminStatusBadge variant={statusVariants[selectedFeedback.status]}>
                        {selectedFeedback.status.charAt(0).toUpperCase() + selectedFeedback.status.slice(1)}
                      </AdminStatusBadge>
                      <span>{formatDate(selectedFeedback.createdAt)}</span>
                    </div>
                  </div>

                  {selectedFeedback.experienceCategory && (
                    <div className="px-6 py-3 border-b border-brand-border bg-brand-light-gray/30">
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
                        <span>
                          <span className="text-brand-gray">Category:</span>{' '}
                          <span className="text-brand-dark font-medium capitalize">
                            {selectedFeedback.experienceCategory.replace(/_/g, ' ')}
                          </span>
                        </span>
                        {selectedFeedback.phone && (
                          <span>
                            <span className="text-brand-gray">Phone:</span>{' '}
                            <span className="text-brand-dark">{selectedFeedback.phone}</span>
                          </span>
                        )}
                        {selectedFeedback.orderId && (
                          <span>
                            <span className="text-brand-gray">Order:</span>{' '}
                            <span className="text-brand-dark font-mono">{selectedFeedback.orderId}</span>
                          </span>
                        )}
                        {selectedFeedback.wouldRecommend && (
                          <span>
                            <span className="text-brand-gray">Recommends:</span>{' '}
                            <span className="text-brand-dark">{selectedFeedback.wouldRecommend}</span>
                          </span>
                        )}
                        {selectedFeedback.heardFrom && (
                          <span>
                            <span className="text-brand-gray">Heard from:</span>{' '}
                            <span className="text-brand-dark capitalize">
                              {selectedFeedback.heardFrom.replace(/_/g, ' ')}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="px-6 py-5 border-b border-brand-border">
                    <div className="flex items-center gap-4 mb-4">
                      <StarRating rating={selectedFeedback.rating} size="md" />
                      {selectedFeedback.pageUrl && (
                        <a
                          href={selectedFeedback.pageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline truncate max-w-[300px]"
                        >
                          {selectedFeedback.pageUrl}
                        </a>
                      )}
                    </div>
                    <div className="text-sm text-brand-dark leading-relaxed whitespace-pre-line">
                      {selectedFeedback.message}
                    </div>
                  </div>

                  <div className="px-6 py-5">
                    <h5 className="text-xs font-semibold text-brand-gray uppercase tracking-wider mb-2">Contact Permission</h5>
                    <p className="text-sm text-brand-dark">
                      {selectedFeedback.contactPermission
                        ? 'User is okay with being contacted'
                        : 'User did not give contact permission'}
                    </p>
                    {selectedFeedback.notifiedAt && (
                      <p className="text-xs text-brand-gray mt-3">
                        WhatsApp notified: {formatDate(selectedFeedback.notifiedAt)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <MessageSquareText className="w-10 h-10 text-brand-gray/40 mx-auto mb-3" />
                  <p className="text-sm text-brand-gray">Select feedback to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedId && (
        <button
          onClick={() => setSelectedId(null)}
          className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-6 py-2.5 bg-brand-dark text-white text-xs font-semibold rounded-sm shadow-lg"
        >
          Back to Feedback
        </button>
      )}
    </div>
  );
}
