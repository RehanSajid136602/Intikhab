'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareText, X, Star, ChevronRight, LogIn } from 'lucide-react';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { FeedbackType, FeedbackAuth } from '@/types/feedback';

const FEEDBACK_TYPES: { value: FeedbackType; label: string }[] = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'suggestion', label: 'Suggestion' },
  { value: 'content_issue', label: 'Content Issue' },
  { value: 'general', label: 'General Feedback' },
];

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0.5 transition-colors hover:scale-110"
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            className={cn(
              'w-5 h-5 transition-colors',
              star <= value
                ? 'fill-amber-400 text-amber-400'
                : 'text-brand-border',
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function FeedbackWidget() {
  const { feedbackWidgetOpen, setFeedbackWidget } = useUIStore();
  const [showTip, setShowTip] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [auth, setAuth] = useState<FeedbackAuth | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [type, setType] = useState<FeedbackType>('general');
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [contactPermission, setContactPermission] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/account/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.authEmail) {
          setAuth({
            loggedIn: true,
            name: data.authName || data.profile?.fullName || '',
            email: data.authEmail,
            phone: data.profile?.phone || '',
            city: data.profile?.city || '',
          });
          setEmail(data.authEmail);
        } else {
          setAuth({ loggedIn: false, name: '', email: '', phone: '', city: '' });
        }
      })
      .catch(() => setAuth({ loggedIn: false, name: '', email: '', phone: '', city: '' }))
      .finally(() => setLoadingAuth(false));
  }, []);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('feedbackTipDismissed');
    if (!dismissed && !feedbackWidgetOpen) {
      const timer = setTimeout(() => setShowTip(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [feedbackWidgetOpen]);

  const handleClose = useCallback(() => {
    setFeedbackWidget(false);
  }, [setFeedbackWidget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }

    const payload = {
      type,
      rating: rating || undefined,
      message: message.trim(),
      email: email.trim() || undefined,
      contactPermission,
      pageUrl: window.location.href,
    };

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit feedback');
      }

      setSubmitted(true);
      setTimeout(() => {
        handleClose();
        setSubmitted(false);
        setMessage('');
        setContactPermission(false);
        setRating(0);
        setType('general');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  const dismissTip = () => {
    setShowTip(false);
    sessionStorage.setItem('feedbackTipDismissed', 'true');
  };

  return (
    <>
      <AnimatePresence>
        {showTip && !feedbackWidgetOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-20 left-6 z-40 bg-brand-dark text-white text-xs px-3 py-2 rounded-sm shadow-lg max-w-[200px]"
          >
            <button
              onClick={dismissTip}
              className="absolute -top-1.5 -right-1.5 bg-white text-brand-dark rounded-full p-0.5 shadow"
              aria-label="Dismiss tip"
            >
              <X className="w-3 h-3" />
            </button>
            Got feedback? We&apos;d love to hear it!
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setFeedbackWidget(true);
          dismissTip();
        }}
        className="fixed bottom-6 left-6 z-40 bg-brand-dark text-white p-3 rounded-full shadow-lg hover:bg-black transition-colors"
        aria-label="Open feedback form"
      >
        <MessageSquareText className="w-5 h-5" />
      </motion.button>

      <AnimatePresence>
        {feedbackWidgetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[150]"
              onClick={handleClose}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[160] flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-label="Feedback form"
            >
              <div className="flex items-center justify-between p-4 border-b border-brand-border">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark">
                  Send Feedback
                </h3>
                <button
                  onClick={handleClose}
                  className="p-1 text-brand-gray hover:text-brand-dark transition-colors"
                  aria-label="Close feedback form"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitted ? (
                <div className="flex-1 flex items-center justify-center p-8 text-center">
                  <div>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-base font-semibold text-brand-dark mb-1">Thank you!</p>
                    <p className="text-sm text-brand-gray">Your feedback has been submitted.</p>
                  </div>
                </div>
              ) : loadingAuth ? (
                <div className="flex-1 flex items-center justify-center text-sm text-brand-gray">
                  Loading...
                </div>
              ) : !auth?.loggedIn ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-16 h-16 bg-brand-light-gray rounded-full flex items-center justify-center mb-4">
                    <LogIn className="w-8 h-8 text-brand-gray" />
                  </div>
                  <p className="text-base font-semibold text-brand-dark mb-2">
                    Sign in to share feedback
                  </p>
                  <p className="text-sm text-brand-gray mb-6 max-w-xs">
                    Please log in to your account so we can follow up if needed.
                  </p>
                  <Link
                    href="/auth/login"
                    className="px-8 py-3 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-all duration-200"
                  >
                    Sign In
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-brand-border">
                    <div className="w-8 h-8 rounded-full bg-brand-light-gray flex items-center justify-center text-xs font-bold text-brand-dark">
                      {(auth.name || auth.email)[0].toUpperCase()}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-brand-dark leading-tight">{auth.name || 'User'}</p>
                      <p className="text-xs text-brand-gray">{auth.email}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-dark mb-1.5">
                      Feedback Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as FeedbackType)}
                      className="w-full border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-dark bg-white"
                    >
                      {FEEDBACK_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-dark mb-1.5">
                      Rating (optional)
                    </label>
                    <StarRating value={rating} onChange={setRating} />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-dark mb-1.5">
                      Message <span className="text-brand-red">*</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="Tell us what's on your mind..."
                      className="w-full border border-brand-border px-3 py-2.5 text-sm outline-none focus:border-brand-dark resize-none"
                    />
                  </div>

                  <label className="flex items-start gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={contactPermission}
                      onChange={(e) => setContactPermission(e.target.checked)}
                      className="mt-0.5 accent-brand-dark"
                    />
                    <span className="text-xs text-brand-gray group-hover:text-brand-dark transition-colors">
                      I&apos;m okay with being contacted about my feedback
                    </span>
                  </label>

                  {error && (
                    <p className="text-xs text-brand-red">{error}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-all duration-200"
                  >
                    Send Feedback
                  </button>

                  <div className="text-center pt-2 border-t border-brand-border">
                    <Link
                      href="/feedback"
                      onClick={handleClose}
                      className="inline-flex items-center gap-1 text-xs text-brand-gray hover:text-brand-dark transition-colors"
                    >
                      Want to give detailed feedback?
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
