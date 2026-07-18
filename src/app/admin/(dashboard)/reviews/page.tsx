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
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const filtered = reviews.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchesProduct = r.products?.name?.toLowerCase().includes(q);
      const matchesCustomer = (r.guest_name || r.customer_email || "").toLowerCase().includes(q);
      const matchesBody = r.body.toLowerCase().includes(q);
      if (!matchesProduct && !matchesCustomer && !matchesBody) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Reviews" subtitle="Moderate customer product reviews before they appear publicly." />

      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-dark bg-white min-w-[200px]"
        />
        <div className="flex gap-1">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs font-medium uppercase tracking-wider rounded-sm transition-colors ${
                statusFilter === s
                  ? "bg-brand-dark text-white"
                  : "bg-white text-brand-gray border border-brand-border hover:border-brand-dark"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="text-xs text-brand-gray ml-auto">{filtered.length} review{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      <div className="bg-white rounded-sm border border-brand-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-8 text-sm text-brand-gray text-center">No reviews found.</div>
        ) : (
          filtered.map((review) => (
            <div key={review.id} className="border-b border-brand-border p-5 last:border-b-0">
              <div className="flex flex-col justify-between gap-3 md:flex-row">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-brand-dark">
                      {review.products?.name || "Product"}
                    </p>
                    <span className="text-xs text-brand-gray">·</span>
                    <span className="text-xs text-amber-500 font-medium">{review.rating}/5</span>
                    <span className="text-xs text-brand-gray">·</span>
                    <span className={`text-xs font-medium uppercase ${
                      review.status === "approved" ? "text-green-600" :
                      review.status === "rejected" ? "text-red-600" : "text-amber-600"
                    }`}>
                      {review.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-brand-gray">
                    {review.guest_name || review.customer_email || "Customer"}
                  </p>
                  {review.title && <p className="mt-3 text-sm font-medium text-brand-dark">{review.title}</p>}
                  <p className="mt-1 text-sm text-brand-gray leading-relaxed">{review.body}</p>
                </div>
                {review.status === "pending" && (
                  <div className="flex gap-2 items-start shrink-0">
                    <button
                      onClick={() => update(review.id, "approved")}
                      className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider bg-green-600 text-white rounded-sm hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => update(review.id, "rejected")}
                      className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider bg-red-600 text-white rounded-sm hover:bg-red-700 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
