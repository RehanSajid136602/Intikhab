"use client";

import { useEffect, useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { Tag } from "lucide-react";

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

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

  async function saveEdit(id: string) {
    if (!editName.trim()) return;
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName.trim() }),
    });
    setEditingId(null);
    setEditName("");
    await load();
  }

  async function toggleActive(id: string, current: boolean) {
    await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !current }),
    });
    await load();
  }

  const sorted = [...categories].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Categories" subtitle="Manage storefront category records used by filters and navigation." />

      <form onSubmit={add} className="bg-white rounded-sm border border-brand-border flex gap-3 p-5">
        <input
          className="border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-dark flex-1 bg-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-brand-dark text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-black transition-colors"
        >
          Add
        </button>
      </form>

      {sorted.length === 0 ? (
        <AdminEmptyState
          icon={Tag}
          title="No categories yet"
          description="Create your first category to organize products"
        />
      ) : (
      <div className="bg-white rounded-sm border border-brand-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-brand-border bg-brand-light-gray">
            <tr>
              <th className="p-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-wider">Name</th>
              <th className="p-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-wider">Slug</th>
              <th className="p-3 text-left text-xs font-semibold text-brand-dark uppercase tracking-wider">Status</th>
              <th className="p-3 text-right text-xs font-semibold text-brand-dark uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((category) => (
              <tr key={category.id} className="border-b border-brand-border/60 last:border-b-0">
                <td className="p-3">
                  {editingId === category.id ? (
                    <div className="flex gap-2">
                      <input
                        className="border border-brand-border px-2 py-1 text-sm outline-none focus:border-brand-dark bg-white"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(category.id)}
                        className="px-2 py-1 text-xs font-medium bg-brand-dark text-white rounded-sm hover:bg-black transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditName(""); }}
                        className="px-2 py-1 text-xs font-medium text-brand-gray hover:text-brand-dark transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="font-semibold">{category.name}</span>
                  )}
                </td>
                <td className="p-3 text-brand-gray">{category.slug}</td>
                <td className="p-3">
                  <span className={`text-xs font-medium uppercase ${category.active ? "text-green-600" : "text-red-600"}`}>
                    {category.active ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setEditingId(category.id);
                        setEditName(category.name);
                      }}
                      className="px-2 py-1 text-xs font-medium text-brand-dark border border-brand-border rounded-sm hover:bg-brand-light-gray transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleActive(category.id, category.active)}
                      className={`px-2 py-1 text-xs font-medium rounded-sm transition-colors ${
                        category.active
                          ? "text-amber-600 border border-amber-200 hover:bg-amber-50"
                          : "text-green-600 border border-green-200 hover:bg-green-50"
                      }`}
                    >
                      {category.active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}
