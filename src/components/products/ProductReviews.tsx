"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  guest_name: string | null;
  customer_email: string | null;
  created_at: string;
}

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [message, setMessage] = useState("");

  async function loadReviews() {
    const response = await fetch(`/api/products/${productId}/reviews`);
    if (!response.ok) return;
    const data = await response.json();
    setReviews(data.reviews || []);
    setAverageRating(data.averageRating || 0);
  }

  useEffect(() => {
    loadReviews();
  }, [productId]);

  async function submitReview(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const response = await fetch(`/api/products/${productId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(data.error || "Could not submit review.");
      return;
    }
    form.reset();
    setMessage("Review submitted. It will appear after approval.");
  }

  return (
    <section className="mt-16 border-t border-brand-border pt-10">
      <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Customer Reviews</p>
          <h2 className="section-title mt-2">Fit and quality feedback</h2>
        </div>
        <p className="text-sm text-brand-gray">
          {reviews.length > 0
            ? `${averageRating.toFixed(1)} / 5 from ${reviews.length} review${reviews.length === 1 ? "" : "s"}`
            : "No approved reviews yet"}
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="surface-card p-6 text-sm text-brand-gray">
          No reviews yet. Be the first to share feedback after your order.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {reviews.map((review) => (
            <article key={review.id} className="surface-card p-5">
              <div className="mb-2 flex gap-1 text-brand-gold">
                {Array.from({ length: review.rating }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              {review.title && (
                <h3 className="font-semibold text-brand-dark">{review.title}</h3>
              )}
              <p className="mt-2 text-sm leading-relaxed text-brand-gray">
                {review.body}
              </p>
              <p className="mt-3 text-xs text-brand-gray">
                {review.guest_name || review.customer_email || "Customer"}
              </p>
            </article>
          ))}
        </div>
      )}

      <form onSubmit={submitReview} className="surface-card mt-6 space-y-4 p-5">
        <h3 className="font-semibold text-brand-dark">Write a review</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <input name="guestName" className="form-field" placeholder="Name" />
          <input name="guestEmail" type="email" className="form-field" placeholder="Email" />
          <select name="rating" className="form-field" defaultValue="5">
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} stars
              </option>
            ))}
          </select>
        </div>
        <input name="title" className="form-field" placeholder="Review title (optional)" />
        <textarea name="body" required rows={4} className="form-field resize-none" placeholder="How was the fit, comfort, and quality?" />
        {message && <p className="text-xs text-brand-gray">{message}</p>}
        <button className="primary-cta" type="submit">
          Submit Review
        </button>
      </form>
    </section>
  );
}
