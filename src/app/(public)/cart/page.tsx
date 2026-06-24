"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { CartItemComponent } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import { PageHeader, PageShell } from "@/components/ui/PageShell";
import { useCartStore } from "@/stores/cartStore";

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Shopping Cart"
        title="Review your selected items"
        description="Check sizes, quantities, and subtotal before moving to checkout."
      />

      <section className="store-container pb-16">
        {items.length === 0 ? (
          <div className="surface-card flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light-gray">
              <ShoppingBag className="h-8 w-8 text-brand-gray" />
            </div>
            <h2 className="section-title text-2xl">Your cart is empty</h2>
            <p className="body-muted mt-3 max-w-md">
              Add a pair you like, then come back here to review your order.
            </p>
            <Link href="/products" className="primary-cta mt-6">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="surface-card p-4 md:p-6">
              {items.map((item) => (
                <CartItemComponent
                  key={item.lineId || `${item.id}:${item.size}`}
                  item={item}
                />
              ))}
            </div>
            <aside className="surface-card h-fit p-5 shadow-sticky lg:sticky lg:top-24">
              <CartSummary />
            </aside>
          </div>
        )}
      </section>
    </PageShell>
  );
}
