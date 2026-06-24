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

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
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

  async function toggle(coupon: Coupon) {
    await fetch(`/api/coupons/${coupon.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !coupon.active }),
    });
    await load();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Coupons" subtitle="Create and manage checkout discount codes." />
      <form onSubmit={createCoupon} className="surface-card grid gap-3 p-5 md:grid-cols-6">
        <input className="form-field" placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
        <select className="form-field" value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value })}>
          <option value="percentage">Percentage</option>
          <option value="fixed">Fixed</option>
        </select>
        <input className="form-field" type="number" placeholder="Value" value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: Number(e.target.value) })} required />
        <input className="form-field" type="number" placeholder="Min order" value={form.minimum_order_amount} onChange={(e) => setForm({ ...form, minimum_order_amount: e.target.value })} />
        <input className="form-field" type="number" placeholder="Usage limit" value={form.usage_limit} onChange={(e) => setForm({ ...form, usage_limit: e.target.value })} />
        <button className="primary-cta" type="submit">Add</button>
      </form>
      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-brand-border text-left">
            <tr><th className="p-3">Code</th><th>Discount</th><th>Used</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-brand-border/60">
                <td className="p-3 font-semibold">{coupon.code}</td>
                <td>{coupon.discount_value}{coupon.discount_type === "percentage" ? "%" : " PKR"}</td>
                <td>{coupon.used_count}{coupon.usage_limit ? ` / ${coupon.usage_limit}` : ""}</td>
                <td>{coupon.active ? "Active" : "Inactive"}</td>
                <td><button onClick={() => toggle(coupon)} className="ghost-cta">{coupon.active ? "Disable" : "Enable"}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
