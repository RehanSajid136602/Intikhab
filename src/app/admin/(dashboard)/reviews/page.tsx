"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  status: string;
  guest_name: string | null;
  customer_email: string | null;
  products?: { name: string } | null;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);

  async function load() {
    const response = await fetch("/api/reviews");
    if (response.ok) setReviews(await response.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function update(id: string, status: string) {
    await fetch(`/api/reviews/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Reviews" subtitle="Moderate customer product reviews before they appear publicly." />
      <div className="surface-card overflow-hidden">
        {reviews.length === 0 ? (
          <div className="p-8 text-sm text-brand-gray">No reviews yet.</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-brand-border p-5">
              <div className="flex flex-col justify-between gap-3 md:flex-row">
                <div>
                  <p className="text-sm font-semibold text-brand-dark">
                    {review.products?.name || "Product"} · {review.rating}/5
                  </p>
                  <p className="mt-1 text-xs text-brand-gray">
                    {review.guest_name || review.customer_email || "Customer"} · {review.status}
                  </p>
                  {review.title && <p className="mt-3 font-medium">{review.title}</p>}
                  <p className="mt-2 text-sm text-brand-gray">{review.body}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => update(review.id, "approved")} className="ghost-cta text-brand-green">Approve</button>
                  <button onClick={() => update(review.id, "rejected")} className="ghost-cta text-brand-red">Reject</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
