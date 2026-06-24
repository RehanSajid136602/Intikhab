"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  active: boolean;
  sort_order: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");

  async function load() {
    const response = await fetch("/api/categories");
    if (response.ok) setCategories(await response.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function add(event: React.FormEvent) {
    event.preventDefault();
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    await load();
  }

  async function archive(id: string) {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Categories" subtitle="Manage storefront category records used by filters and navigation." />
      <form onSubmit={add} className="surface-card flex gap-3 p-5">
        <input className="form-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" required />
        <button className="primary-cta" type="submit">Add</button>
      </form>
      <div className="surface-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-brand-border text-left">
            <tr><th className="p-3">Name</th><th>Slug</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-b border-brand-border/60">
                <td className="p-3 font-semibold">{category.name}</td>
                <td>{category.slug}</td>
                <td>{category.active ? "Active" : "Inactive"}</td>
                <td><button onClick={() => archive(category.id)} className="ghost-cta text-brand-red">Archive</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
