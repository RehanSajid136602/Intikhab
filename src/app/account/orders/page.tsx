import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Package, User, LogOut, ArrowLeft, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPKR } from "@/lib/utils";

interface OrderItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  size: string | number;
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  city: string;
  phone: string;
  items: OrderItem[];
}

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: headers(),
  }).catch(() => null);

  if (!session) {
    redirect("/login");
  }

  const { user } = session;
  const supabase = createClient();

  const { data: ordersData } = await supabase
    .from("orders")
    .select("*")
    .eq("customerEmail", user.email)
    .order("createdAt", { ascending: false });

  let orders: Order[] = [];

  if (ordersData && ordersData.length > 0) {
    const orderIds = ordersData.map((o) => o.id);
    const { data: itemsData } = await supabase
      .from("order_items")
      .select("*")
      .in("orderId", orderIds);

    orders = ordersData.map((o) => ({
      id: o.id,
      total: o.total,
      status: o.status,
      createdAt: o.createdAt,
      city: o.city || "",
      phone: o.phone || "",
      items: (itemsData || []).filter((i) => i.orderId === o.id).map((i) => ({
        productId: i.productId,
        name: i.name,
        image: i.image,
        quantity: i.quantity,
        price: i.price,
        size: i.size,
      })),
    }));
  }

  const statusColors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-800",
    Processing: "bg-blue-100 text-blue-800",
    Shipped: "bg-purple-100 text-purple-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Order History</h1>
          <p className="text-zinc-500 text-sm mt-1">{user.name || user.email || "Welcome back"}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              <Link
                href="/account"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 transition-colors whitespace-nowrap"
              >
                <User className="w-4 h-4" />
                Dashboard
              </Link>
              <span className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm bg-zinc-100 text-zinc-900 font-medium whitespace-nowrap">
                <Package className="w-4 h-4" />
                Order History
              </span>
              <Link
                href="/"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 transition-colors whitespace-nowrap"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Store
              </Link>
              <Link
                href="/account/addresses"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-zinc-600 hover:bg-zinc-100 transition-colors whitespace-nowrap"
              >
                <MapPin className="w-4 h-4" />
                Saved Addresses
              </Link>
              <a
                href="/auth/logout"
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </a>
            </nav>
          </aside>

          <main className="lg:col-span-3">
            <div className="bg-white border border-zinc-200 rounded-xl p-6">
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-zinc-400" />
                  </div>
                  <p className="text-zinc-500 text-sm mb-4">No orders yet. Start shopping!</p>
                  <Link
                    href="/products"
                    className="inline-flex items-center bg-zinc-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-black transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      href={`/order-confirmation?orderId=${order.id}`}
                      className="block border border-zinc-200 rounded-lg p-4 hover:border-zinc-400 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-sm font-mono font-semibold text-zinc-900">
                            {order.id}
                          </p>
                          <p className="text-xs text-zinc-500">
                            {new Date(order.createdAt).toLocaleDateString("en-PK", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status] || "bg-zinc-100 text-zinc-700"}`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {order.items.slice(0, 4).map((item, idx) => (
                          <div
                            key={idx}
                            className="relative w-12 h-12 bg-zinc-50 rounded-lg overflow-hidden shrink-0 border border-zinc-100"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-contain p-1"
                              sizes="48px"
                            />
                          </div>
                        ))}
                        {order.items.length > 4 && (
                          <div className="w-12 h-12 bg-zinc-100 rounded-lg flex items-center justify-center shrink-0">
                            <span className="text-xs font-medium text-zinc-500">
                              +{order.items.length - 4}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-100">
                        <p className="text-xs text-zinc-500">
                          {order.items.length} item{order.items.length > 1 ? "s" : ""}
                          {order.city ? ` · ${order.city}` : ""}
                        </p>
                        <p className="text-sm font-semibold text-zinc-900">
                          {formatPKR(order.total)}
                        </p>
                      </div>
                      <p className="text-xs text-zinc-400 mt-2">
                        View order details →
                      </p>
                    </Link>
                  ))}
                </div>
              )}
              <p className="text-xs text-zinc-500 mt-4 text-center">
                Guest order?{" "}
                <Link href="/track-order" className="text-zinc-900 font-medium underline underline-offset-2">
                  Track with Order ID + phone
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
