import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/auth";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * GET /api/orders/[id]
 * Returns a single order by ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const orderId = params.id;
  const token = request.nextUrl.searchParams.get("token");

  // Fetch order
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const { authenticated: isAdmin } = await verifyAdmin(request);
  const session = await auth.api.getSession({
    headers: headers(),
  }).catch(() => null);
  const isOwner =
    Boolean(session?.user?.email) &&
    session?.user?.email?.toLowerCase() ===
      String(order.customerEmail).toLowerCase();
  const tokenHash = token
    ? createHash("sha256").update(token).digest("hex")
    : null;
  const hasValidToken =
    Boolean(tokenHash) && tokenHash === order.access_token_hash;

  if (!isAdmin && !isOwner && !hasValidToken) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch order items
  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("orderId", orderId);

  const formattedOrder = {
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    shippingAddress: order.shippingAddress,
    city: order.city,
    phone: order.phone,
    paymentMethod: order.paymentMethod,
    receiptUrl: order.receiptUrl || null,
    items: (items || []).map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
    })),
    total: order.total,
    subtotal: order.subtotal || order.total,
    shippingFee: order.shippingFee || 0,
    couponCode: order.couponCode || null,
    couponDiscount: order.couponDiscount || 0,
    status: order.status,
    date: new Date(order.createdAt).toISOString().split("T")[0],
  };

  return NextResponse.json(formattedOrder);
}

/**
 * PUT /api/orders/[id]
 * Admin only: updates order status.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient();
  const body = await request.json();

  const allowedStatuses = ["Pending", "Processing", "Shipped", "Delivered"];
  if (body.status !== undefined && !allowedStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};
  if (body.status !== undefined) updateData.status = body.status;

  const { data, error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    id: data.id,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    shippingAddress: data.shippingAddress,
    total: data.total,
    status: data.status,
    date: new Date(data.createdAt).toISOString().split("T")[0],
  });
}
