'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquareText, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import type {
  FeedbackType,
  ExperienceCategory,
  RecommendChoice,
  HeardFrom,
  FeedbackAuth,
} from '@/types/feedback';

const FEEDBACK_TYPES: { value: FeedbackType; label: string }[] = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'suggestion', label: 'Suggestion' },
  { value: 'content_issue', label: 'Content Issue' },
  { value: 'general', label: 'General Feedback' },
];

const EXPERIENCE_CATEGORIES: { value: ExperienceCategory; label: string }[] = [
  { value: 'shopping_experience', label: 'Shopping Experience' },
  { value: 'product_quality', label: 'Product Quality' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'customer_service', label: 'Customer Service' },
  { value: 'website_usability', label: 'Website Usability' },
  { value: 'other', label: 'Other' },
];

const RECOMMEND_CHOICES: { value: RecommendChoice; label: string }[] = [
  { value: 'yes', label: 'Yes, definitely' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'no', label: 'Not really' },
];

const HEARD_FROM_OPTIONS: { value: HeardFrom; label: string }[] = [
  { value: 'social_media', label: 'Social Media' },
  { value: 'friend_family', label: 'Friend or Family' },
  { value: 'search_engine', label: 'Search Engine' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'influencer', label: 'Influencer' },
  { value: 'other', label: 'Other' },
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
              'w-6 h-6 transition-colors',
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

export function FeedbackPageClient() {
  const [auth, setAuth] = useState<FeedbackAuth | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [type, setType] = useState<FeedbackType>('general');
  const [subject, setSubject] = useState('');
  const [experienceCategory, setExperienceCategory] = useState<ExperienceCategory>('shopping_experience');
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState<RecommendChoice | ''>('');
  const [heardFrom, setHeardFrom] = useState<HeardFrom | ''>('');
  const [contactPermission, setContactPermission] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/account/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.authEmail) {
          const fullName = data.authName || data.profile?.fullName || '';
          setAuth({
            loggedIn: true,
            name: fullName,
            email: data.authEmail,
            phone: data.profile?.phone || '',
            city: data.profile?.city || '',
          });
          setName(fullName);
          setEmail(data.authEmail);
          if (data.profile?.phone) setPhone(data.profile.phone);
        } else {
          setAuth({ loggedIn: false, name: '', email: '', phone: '', city: '' });
        }
      })
      .catch(() => setAuth({ loggedIn: false, name: '', email: '', phone: '', city: '' }))
      .finally(() => setLoadingAuth(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!message.trim()) {
      setError('Please enter a message.');
      return;
    }

    if (!subject.trim()) {
      setError('Please enter a subject.');
      return;
    }

    const payload = {
      type,
      subject: subject.trim(),
      experienceCategory,
      rating: rating || undefined,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      message: message.trim(),
      orderId: orderId.trim() || undefined,
      wouldRecommend: (wouldRecommend as RecommendChoice) || undefined,
      heardFrom: (heardFrom as HeardFrom) || undefined,
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  if (loadingAuth) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center">
        <p className="text-brand-gray">Loading...</p>
      </section>
    );
  }

  if (!auth?.loggedIn) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-brand-light-gray rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-10 h-10 text-brand-gray" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark mb-2">Sign In Required</h1>
          <p className="text-brand-gray mb-8">
            Please sign in to your account to submit detailed feedback.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-all duration-200"
          >
            Sign In
          </Link>
        </motion.div>
      </section>
    );
  }

  if (submitted) {
    return (
      <section className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-brand-dark mb-2">Thank You!</h1>
          <p className="text-brand-gray mb-8">
            Your detailed feedback has been submitted.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-brand-dark text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-all duration-200"
          >
            Back to Home
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-brand-light-gray rounded-full flex items-center justify-center">
            <MessageSquareText className="w-5 h-5 text-brand-dark" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-brand-dark">Detailed Feedback</h1>
            <p className="text-sm text-brand-gray">
              Signed in as <span className="font-medium">{auth.email}</span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                Feedback Type <span className="text-brand-red">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as FeedbackType)}
                className="w-full border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-dark bg-white"
              >
                {FEEDBACK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                Experience Category <span className="text-brand-red">*</span>
              </label>
              <select
                value={experienceCategory}
                onChange={(e) => setExperienceCategory(e.target.value as ExperienceCategory)}
                className="w-full border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-dark bg-white"
              >
                {EXPERIENCE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1.5">
              Subject <span className="text-brand-red">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief summary of your feedback"
              className="w-full border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1.5">
              Overall Rating (optional)
            </label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <fieldset className="border border-brand-border p-5 space-y-5">
            <legend className="text-sm font-semibold text-brand-dark px-2">Your Details</legend>
            <p className="text-xs text-brand-gray -mt-3">
              Pre-filled from your account. Update in your{' '}
              <Link href="/account" className="text-blue-600 hover:underline">profile settings</Link>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-dark bg-zinc-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  className="w-full border border-brand-border px-4 py-3 text-sm outline-none bg-zinc-50 cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                Phone (optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XX XXXXXXX"
                className="w-full border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-dark"
              />
            </div>
          </fieldset>

          <fieldset className="border border-brand-border p-5 space-y-5">
            <legend className="text-sm font-semibold text-brand-dark px-2">Order Reference (optional)</legend>
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                Order ID
              </label>
              <input
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. INK-00123"
                className="w-full border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-dark"
              />
              <p className="text-xs text-brand-gray mt-1">
                If this feedback is about a specific order, enter the order ID.
              </p>
            </div>
          </fieldset>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1.5">
              Your Message <span className="text-brand-red">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="Tell us in detail about your experience..."
              className="w-full border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-dark resize-none"
            />
          </div>

          <fieldset className="border border-brand-border p-5 space-y-5">
            <legend className="text-sm font-semibold text-brand-dark px-2">A Few More Questions</legend>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-3">
                Would you recommend Intikhab to others?
              </label>
              <div className="flex flex-wrap gap-4">
                {RECOMMEND_CHOICES.map((choice) => (
                  <label
                    key={choice.value}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 border text-sm cursor-pointer transition-colors',
                      wouldRecommend === choice.value
                        ? 'border-brand-dark bg-brand-light-gray'
                        : 'border-brand-border hover:border-brand-dark',
                    )}
                  >
                    <input
                      type="radio"
                      name="wouldRecommend"
                      value={choice.value}
                      checked={wouldRecommend === choice.value}
                      onChange={(e) => setWouldRecommend(e.target.value as RecommendChoice)}
                      className="accent-brand-dark"
                    />
                    {choice.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1.5">
                How did you hear about us?
              </label>
              <select
                value={heardFrom}
                onChange={(e) => setHeardFrom(e.target.value as HeardFrom | '')}
                className="w-full border border-brand-border px-4 py-3 text-sm outline-none focus:border-brand-dark bg-white"
              >
                <option value="">Select an option...</option>
                {HEARD_FROM_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={contactPermission}
              onChange={(e) => setContactPermission(e.target.checked)}
              className="mt-0.5 accent-brand-dark"
            />
            <span className="text-sm text-brand-gray group-hover:text-brand-dark transition-colors">
              I&apos;m okay with being contacted about my feedback
            </span>
          </label>

          {error && (
            <p className="text-sm text-brand-red">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-brand-dark text-white text-sm font-bold uppercase tracking-widest hover:bg-black transition-all duration-200"
          >
            Send Detailed Feedback
          </button>
        </form>
      </motion.div>
    </section>
  );
}
