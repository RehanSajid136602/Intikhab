"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Could not send your message.");
      setStatus("error");
      return;
    }

    event.currentTarget.reset();
    setStatus("success");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-brand-dark">
            Your Name
          </label>
          <input id="name" name="name" required className="form-field" placeholder="Enter your name" />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-brand-dark">
            Email Address
          </label>
          <input id="email" name="email" type="email" required className="form-field" placeholder="Enter your email" />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-medium text-brand-dark">
          Phone Number
        </label>
        <input id="phone" name="phone" type="tel" className="form-field" placeholder="e.g. 0300 1234567" />
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block text-sm font-medium text-brand-dark">
          Subject
        </label>
        <input id="subject" name="subject" required className="form-field" placeholder="What is your query about?" />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-brand-dark">
          Message
        </label>
        <textarea id="message" name="message" rows={5} required className="form-field resize-none" placeholder="Write your message here..." />
      </div>

      {status === "success" && (
        <p className="rounded-control bg-green-50 px-4 py-3 text-sm text-brand-green">
          Message sent. Support will get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="rounded-control bg-red-50 px-4 py-3 text-sm text-brand-red">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "submitting"} className="primary-cta">
        <Send className="h-4 w-4" />
        {status === "submitting" ? "Sending..." : "Submit Message"}
      </button>
    </form>
  );
}
