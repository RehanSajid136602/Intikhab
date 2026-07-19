"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Search, AlertCircle, MapPin, User } from "lucide-react";
import { formatPKR } from "@/lib/utils";

interface TrackedItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  size: string;
}

interface TrackedOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  shippingAddress: string;
  city: string;
  province?: string;
  paymentMethod?: string;
  items: TrackedItem[];
  subtotal: number;
  shippingFee: number;
  couponCode?: string | null;
  couponDiscount?: number;
  total: number;
  status: string;
  date: string;
  createdAt?: string;
}

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Processing: "bg-blue-100 text-blue-800 border-blue-200",
  Confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  Shipped: "bg-purple-100 text-purple-800 border-purple-200",
  Delivered: "bg-green-100 text-green-800 border-green-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
};

const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"] as const;

export default function TrackOrderClient() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [useEmail, setUseEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOrder(null);

    const trimmedId = orderId.trim();
    const trimmedPhone = phone.trim();
    const trimmedEmail = email.trim();

    if (!trimmedId) {
      setError("Please enter your Order ID.");
      return;
    }
    if (!useEmail && !trimmedPhone) {
      setError("Please enter the phone number used at checkout.");
      return;
    }
    if (useEmail && !trimmedEmail) {
      setError("Please enter the email used at checkout.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: trimmedId,
          phone: useEmail ? undefined : trimmedPhone,
          email: useEmail ? trimmedEmail : undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(
          data.error ||
            "We couldn't find that order — check your Order ID and phone number",
        );
        return;
      }
      setOrder(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const activeStepIndex = order
    ? Math.max(
        0,
        statusSteps.findIndex(
          (s) => s.toLowerCase() === order.status.toLowerCase(),
        ),
      )
    : -1;

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-16 px-4">
      <div className="container mx-auto max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-brand-dark text-white mb-4">
            <Package className="w-7 h-7" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-brand-dark mb-2">
            Track Your Order
          </h1>
          <p className="text-brand-gray text-sm md:text-base max-w-md mx-auto">
            Enter your Order ID and the phone number (or email) you used at
            checkout. No account required.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-brand-border rounded-2xl p-6 md:p-8 shadow-sm space-y-4 mb-6"
        >
          <div>
            <label
              htmlFor="orderId"
              className="block text-sm font-medium text-brand-dark mb-1.5"
            >
              Order ID
            </label>
            <input
              id="orderId"
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. INK-XXXXX-XXXX"
              autoComplete="off"
              className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm text-brand-dark placeholder:text-brand-gray/60 focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark font-mono"
            />
          </div>

          {!useEmail ? (
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-brand-dark mb-1.5"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XX XXXXXXX"
                autoComplete="tel"
                className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm text-brand-dark placeholder:text-brand-gray/60 focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark"
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-brand-dark mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full border border-brand-border rounded-lg px-4 py-3 text-sm text-brand-dark placeholder:text-brand-gray/60 focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setUseEmail((v) => !v);
              setError(null);
            }}
            className="text-xs text-brand-gray hover:text-brand-dark underline underline-offset-2 transition-colors"
          >
            {useEmail
              ? "Use phone number instead"
              : "Use email instead of phone"}
          </button>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-dark text-white py-3.5 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                Track Order
              </>
            )}
          </button>
        </form>

        {order && (
          <div className="bg-white border border-brand-border rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-brand-gray uppercase tracking-wide mb-1">
                  Order ID
                </p>
                <p className="font-mono font-semibold text-brand-dark text-lg">
                  {order.id}
                </p>
                <p className="text-xs text-brand-gray mt-1">
                  Placed on{" "}
                  {new Date(order.createdAt || order.date).toLocaleDateString(
                    "en-PK",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${statusColors[order.status] || "bg-zinc-100 text-zinc-700 border-zinc-200"}`}
              >
                {order.status}
              </span>
            </div>

            {/* Status timeline */}
            <div className="pt-2">
              <div className="flex items-center justify-between gap-1">
                {statusSteps.map((step, index) => {
                  const reached = activeStepIndex >= index;
                  return (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center flex-1 min-w-0">
                        <div
                          className={`w-3 h-3 rounded-full ${reached ? "bg-brand-dark" : "bg-zinc-200"}`}
                        />
                        <span
                          className={`mt-2 text-[10px] sm:text-xs text-center leading-tight ${reached ? "text-brand-dark font-medium" : "text-brand-gray"}`}
                        >
                          {step}
                        </span>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`h-0.5 flex-1 mb-5 ${activeStepIndex > index ? "bg-brand-dark" : "bg-zinc-200"}`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-start gap-2 text-brand-gray">
                <User className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="text-brand-dark font-medium">
                    {order.customerName}
                  </p>
                  <p className="text-xs">{order.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 text-brand-gray">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="text-brand-dark font-medium">
                    {order.city || "—"}
                  </p>
                  <p className="text-xs line-clamp-2">
                    {order.shippingAddress}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-brand-dark mb-3">
                Items
              </h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 bg-gray-50 rounded-lg overflow-hidden border border-brand-border shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          sizes="56px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-zinc-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-dark truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-brand-gray">
                        Size {item.size} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-brand-dark shrink-0">
                      {formatPKR(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-brand-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-brand-gray">
                <span>Subtotal</span>
                <span>{formatPKR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-gray">
                <span>Shipping</span>
                <span>{formatPKR(order.shippingFee)}</span>
              </div>
              {order.couponDiscount ? (
                <div className="flex justify-between text-green-700">
                  <span>Coupon {order.couponCode}</span>
                  <span>-{formatPKR(order.couponDiscount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between text-base font-bold text-brand-dark pt-1">
                <span>Total</span>
                <span>{formatPKR(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-brand-gray mt-8">
          Have an account?{" "}
          <Link
            href="/account/orders"
            className="text-brand-dark font-medium underline underline-offset-2 hover:no-underline"
          >
            View your order history
          </Link>
        </p>
      </div>
    </div>
  );
}
