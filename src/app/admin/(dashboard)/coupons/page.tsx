"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  active: boolean;
  minimum_order_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  expires_at: string | null;
}

const PAGE_SIZE = 10;

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [page, setPage] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: 10,
    minimum_order_amount: "",
    usage_limit: "",
    expires_at: "",
  });

  async function load() {
    const response = await fetch("/api/coupons");
    if (response.ok) setCoupons(await response.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function createCoupon(event: React.FormEvent) {
    event.preventDefault();
    await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        discount_value: Number(form.discount_value),
        minimum_order_amount: form.minimum_order_amount ? Number(form.minimum_order_amount) : null,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
        expires_at: form.expires_at || null,
      }),
    });
    setForm({ code: "", discount_type: "percentage", discount_value: 10, minimum_order_amount: "", usage_limit: "", expires_at: "" });
    await load();
  }

  async function updateCoupon(id: string) {
    await fetch(`/api/coupons/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        minimum_order_amount: form.minimum_order_amount ? Number(form.minimum_order_amount) : null,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
        expires_at: form.expires_at || null,
      }),
    });
    setEditingId(null);
    setForm({ code: "", discount_type: "percentage", discount_value: 10, minimum_order_amount: "", usage_limit: "", expires_at: "" });
    await load();
  }

  async function toggle(coupon: Coupon) {
    await fetch(`/api/coupons/${coupon.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !coupon.active }),
    });
    await load();
  }

  function startEdit(coupon: Coupon) {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      minimum_order_amount: coupon.minimum_order_amount?.toString() || "",
      usage_limit: coupon.usage_limit?.toString() || "",
      expires_at: coupon.expires_at ? coupon.expires_at.split("T")[0] : "",
    });
  }

  const totalPages = Math.ceil(coupons.length / PAGE_SIZE);
  const paged = coupons.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Coupons" subtitle="Create and manage checkout discount codes." />

      <form onSubmit={editingId ? (e) => { e.preventDefault(); updateCoupon(editingId); } : createCoupon} className="bg-white rounded-sm border border-brand-border grid gap-3 p-5 md:grid-cols-7">
        <input
          className="border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-dark bg-white"
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
        <select
          className="border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-dark bg-white"
          value={form.discount_type}
          onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
        >
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>
        <input
          className="border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-dark bg-white"
          type="number" placeholder="Value" value={form.discount_value}
          onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })}
          required
        />
        <input
          className="border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-dark bg-white"
          type="number" placeholder="Min order" value={form.minimum_order_amount}
          onChange={(e) => setForm({ ...form, minimum_order_amount: e.target.value })}
        />
        <input
          className="border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-dark bg-white"
          type="number" placeholder="Usage limit" value={form.usage_limit}
          onChange={(e) => setForm({ ...form, usage_limit: e.target.value })}
        />
        <input
          className="border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-dark bg-white"
          type="date" value={form.expires_at}
          onChange={(e) => setForm({ ...form, expires_at: e.target.value })}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-brand-dark text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-black transition-colors"
        >
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <div className="bg-white rounded-sm border border-brand-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-brand-border bg-brand-light-gray">
            <tr>
              <th className="p-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-wider">Code</th>
              <th className="p-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-wider">Discount</th>
              <th className="p-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-wider">Used</th>
              <th className="p-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-wider">Expires</th>
              <th className="p-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-wider">Status</th>
              <th className="p-3 text-right text-xs font-semibold text-brand-dark uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((coupon) => (
              <tr key={coupon.id} className="border-b border-brand-border/60 last:border-b-0">
                <td className="p-3 font-semibold">{coupon.code}</td>
                <td className="p-3">{coupon.discount_value}{coupon.discount_type === "percentage" ? "%" : " PKR"}</td>
                <td className="p-3 text-brand-gray">{coupon.used_count}{coupon.usage_limit ? ` / ${coupon.usage_limit}` : ""}</td>
                <td className="p-3 text-brand-gray text-xs">
                  {coupon.expires_at ? new Date(coupon.expires_at).toLocaleDateString() : "—"}
                </td>
                <td className="p-3">
                  <span className={`text-xs font-medium uppercase ${coupon.active ? "text-green-600" : "text-red-600"}`}>
                    {coupon.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => startEdit(coupon)}
                      className="px-2 py-1 text-xs font-medium text-brand-dark border border-brand-border rounded-sm hover:bg-brand-light-gray transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggle(coupon)}
                      className={`px-2 py-1 text-xs font-medium rounded-sm transition-colors ${
                        coupon.active
                          ? "text-amber-600 border border-amber-200 hover:bg-amber-50"
                          : "text-green-600 border border-green-200 hover:bg-green-50"
                      }`}
                    >
                      {coupon.active ? "Disable" : "Enable"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 text-xs font-medium rounded-sm transition-colors ${
                page === i
                  ? "bg-brand-dark text-white"
                  : "bg-white text-brand-dark border border-brand-border hover:border-brand-dark"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
