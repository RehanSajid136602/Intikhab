"use client";

import { useEffect, useState } from "react";

interface Address {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  province: string;
  postal_code: string;
  address_line: string;
  is_default: boolean;
}

const emptyForm = {
  full_name: "",
  phone: "",
  city: "",
  province: "",
  postal_code: "",
  address_line: "",
  is_default: false,
};

export function AddressesClient() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function load() {
    const response = await fetch("/api/account/addresses");
    if (response.ok) setAddresses(await response.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(
      editingId ? `/api/account/addresses/${editingId}` : "/api/account/addresses",
      {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setMessage(data.error || "Could not save address.");
      return;
    }
    setForm(emptyForm);
    setEditingId(null);
    setMessage("Address saved.");
    await load();
  }

  async function remove(id: string) {
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        {addresses.length === 0 ? (
          <div className="surface-card p-8 text-center text-sm text-brand-gray">
            No saved addresses yet.
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="surface-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-brand-dark">
                    {address.full_name}
                    {address.is_default && (
                      <span className="ml-2 rounded-full bg-brand-light-gray px-2 py-0.5 text-xs text-brand-gray">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-sm text-brand-gray">{address.phone}</p>
                  <p className="mt-2 text-sm text-brand-gray">
                    {address.address_line}, {address.city}, {address.province} {address.postal_code}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(address.id);
                      setForm({
                        full_name: address.full_name,
                        phone: address.phone,
                        city: address.city,
                        province: address.province,
                        postal_code: address.postal_code,
                        address_line: address.address_line,
                        is_default: address.is_default,
                      });
                    }}
                    className="ghost-cta"
                  >
                    Edit
                  </button>
                  <button onClick={() => remove(address.id)} className="ghost-cta text-brand-red">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={save} className="surface-card h-fit space-y-4 p-5">
        <h2 className="text-lg font-semibold text-brand-dark">
          {editingId ? "Edit Address" : "Add Address"}
        </h2>
        {[
          ["full_name", "Full name"],
          ["phone", "Phone"],
          ["city", "City"],
          ["province", "Province"],
          ["postal_code", "Postal code"],
          ["address_line", "Full address"],
        ].map(([key, label]) => (
          <label key={key} className="block text-sm text-brand-dark">
            {label}
            <input
              value={form[key as keyof typeof form] as string}
              onChange={(event) =>
                setForm((current) => ({ ...current, [key]: event.target.value }))
              }
              className="form-field mt-1"
              required={key !== "province"}
            />
          </label>
        ))}
        <label className="flex items-center gap-2 text-sm text-brand-gray">
          <input
            type="checkbox"
            checked={form.is_default}
            onChange={(event) =>
              setForm((current) => ({ ...current, is_default: event.target.checked }))
            }
          />
          Use as default address
        </label>
        {message && <p className="text-xs text-brand-gray">{message}</p>}
        <button className="primary-cta w-full" type="submit">
          Save Address
        </button>
      </form>
    </div>
  );
}
