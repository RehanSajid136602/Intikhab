"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface ProfileFormProps {
  authName: string;
  authEmail: string;
  savedName: string;
  savedPhone: string;
  savedCity: string;
}

const CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Peshawar",
  "Quetta",
  "Sialkot",
  "Gujranwala",
  "Hyderabad",
  "Abbottabad",
  "Murree",
  "Other",
];

export function ProfileForm({
  authName,
  authEmail,
  savedName,
  savedPhone,
  savedCity,
}: ProfileFormProps) {
  const [fullName, setFullName] = useState(savedName || authName);
  const [phone, setPhone] = useState(savedPhone);
  const [city, setCity] = useState(savedCity);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, city }),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Profile saved");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-zinc-900 mb-4">
        Default Contact &amp; Shipping Info
      </h2>
      <p className="text-sm text-zinc-500 mb-5">
        These will pre-fill at checkout. You can still edit them per-order.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={authEmail}
            readOnly
            className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg bg-zinc-50 text-zinc-500 text-sm cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900"
            placeholder="03XX-XXXXXXX"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">
            City
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2.5 border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 bg-white"
          >
            <option value="">Select city</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-zinc-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
