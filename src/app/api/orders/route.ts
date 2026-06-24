import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/auth";
import { getFirstProductImage } from "@/lib/utils";

/**
 * POST /api/orders
 * Creates a new order (guest checkout — no auth required).
 * Uses the PostgreSQL function `create_order_with_stock_deduction` for
 * atomic order creation with stock validation and automatic deduction.
 *
 * Expects: { customerName, customerEmail, phone, shippingAddress, province, city, paymentMethod, orderNotes, items: [{ productId, name, image, quantity, price }], total }
 */
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const body = await request.json();

  const {
    customerName,
    customerEmail,
    phone,
    shippingAddress,
    postalCode,
    province,
    city,
    paymentMethod,
    orderNotes,
    items,
    couponCode,
  } = body;

  console.log("Order payload:", JSON.stringify(body, null, 2));

  if (!customerEmail || !items || !Array.isArray(items) || items.length === 0) {
    console.error("Missing required fields:", {
      customerEmail: !!customerEmail,
      items: !!items,
      itemsLength: Array.isArray(items) ? items.length : 0,
    });
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  if (!customerName || !phone || !shippingAddress || !city || !postalCode) {
    return NextResponse.json(
      { error: "Missing customer or shipping details" },
      { status: 400 },
    );
  }

  const productIds = Array.from(new Set(items.map((item) => item.productId)));
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("id, name, images, price, sizeStock, inStock, stock, status")
    .in("id", productIds)
    .eq("status", "active");

  if (productError) {
    return NextResponse.json({ error: productError.message }, { status: 500 });
  }

  const productMap = new Map((products || []).map((product) => [product.id, product]));
  const insufficientStockItems: unknown[] = [];
  let subtotal = 0;

  const recalculatedItems = items.map((item: Record<string, unknown>) => {
    const product = productMap.get(item.productId as string);
    const requestedQuantity = Number(item.quantity || 0);
    const size = String(item.size || "");

    if (!product || requestedQuantity <= 0 || !size) {
      insufficientStockItems.push({
        productId: item.productId,
        name: item.name || "Unavailable product",
        size,
        requestedQuantity,
        availableStock: 0,
      });
      return null;
    }

    const sizeStock = product.sizeStock as
      | { size: string | number; stock: number }[]
      | null;
    const sizeEntry = sizeStock?.find((entry) => String(entry.size) === size);
    const availableStock = sizeEntry?.stock ?? (product.inStock ? product.stock : 0);

    if (availableStock < requestedQuantity) {
      insufficientStockItems.push({
        productId: product.id,
        name: product.name,
        size,
        requestedQuantity,
        availableStock,
      });
    }

    subtotal += product.price * requestedQuantity;

    return {
      productId: product.id,
      name: product.name,
      image: getFirstProductImage(product.images) || "",
      quantity: requestedQuantity,
      price: product.price,
      size,
    };
  });

  if (insufficientStockItems.length > 0 || recalculatedItems.some((item) => !item)) {
    return NextResponse.json(
      { error: "Some cart items are unavailable", insufficientStockItems },
      { status: 400 },
    );
  }

  const safeItems = recalculatedItems.filter(
    (item): item is NonNullable<typeof item> => Boolean(item),
  );

  const { data: settings } = await supabase
    .from("store_settings")
    .select("freeDeliveryEnabled, freeDeliveryMinimum, standardDeliveryFee")
    .limit(1)
    .maybeSingle();

  const shippingFee =
    settings?.freeDeliveryEnabled && subtotal >= (settings.freeDeliveryMinimum || 0)
      ? 0
      : settings?.standardDeliveryFee ?? 150;

  let normalizedCouponCode: string | null = null;
  let couponDiscount = 0;
  if (couponCode && typeof couponCode === "string" && couponCode.trim()) {
    normalizedCouponCode = couponCode.trim().toUpperCase();
    const { data: coupon, error: couponError } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", normalizedCouponCode)
      .maybeSingle();

    if (couponError) {
      return NextResponse.json({ error: couponError.message }, { status: 500 });
    }

    const now = new Date();
    if (!coupon || !coupon.active) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }
    if (coupon.expires_at && new Date(coupon.expires_at) < now) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }
    if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
      return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
    }
    if (
      coupon.minimum_order_amount !== null &&
      subtotal < coupon.minimum_order_amount
    ) {
      return NextResponse.json(
        { error: `Minimum order amount for this coupon is PKR ${coupon.minimum_order_amount.toLocaleString("en-PK")}` },
        { status: 400 },
      );
    }

    couponDiscount =
      coupon.discount_type === "percentage"
        ? Math.floor((subtotal * coupon.discount_value) / 100)
        : coupon.discount_value;
    couponDiscount = Math.max(0, Math.min(couponDiscount, subtotal));
  }

  const finalTotal = subtotal + shippingFee - couponDiscount;

  // Generate order ID: INK-XXXXX format
  const orderId = `INK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  const accessToken = randomBytes(24).toString("hex");
  const accessTokenHash = createHash("sha256").update(accessToken).digest("hex");

  // Call the atomic PostgreSQL function
  const { data, error } = await supabase.rpc(
    "create_order_with_stock_deduction",
    {
      p_order_id: orderId,
      p_customer_email: customerEmail,
      p_customer_name: customerName || "",
      p_phone: phone || "",
      p_shipping_address: `${shippingAddress}, Postal Code: ${postalCode}`,
      p_province: province || "",
      p_city: city || "",
      p_payment_method: paymentMethod || "cod",
      p_order_notes: orderNotes || "",
      p_total: finalTotal,
      p_items: safeItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
      })),
    },
  );

  if (error) {
    console.error("Order RPC error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Check for insufficient stock error from the function
  if (!data.success) {
    return NextResponse.json(
      {
        error: data.error || "Insufficient stock",
        insufficientStockItems: data.insufficientStockItems || [],
      },
      { status: 400 },
    );
  }

  await supabase
    .from("orders")
    .update({
      subtotal,
      shippingFee,
      couponCode: normalizedCouponCode,
      couponDiscount,
      access_token_hash: accessTokenHash,
    })
    .eq("id", orderId);

  if (normalizedCouponCode) {
    const { data: coupon } = await supabase
      .from("coupons")
      .select("used_count")
      .eq("code", normalizedCouponCode)
      .maybeSingle();
    if (coupon) {
      await supabase
        .from("coupons")
        .update({ used_count: (coupon.used_count || 0) + 1 })
        .eq("code", normalizedCouponCode);
    }
  }

  return NextResponse.json(
    {
      id: orderId,
      customerName,
      customerEmail,
      shippingAddress,
      province,
      city,
      phone,
      paymentMethod,
      orderNotes,
      items: safeItems,
      subtotal,
      shippingFee,
      couponCode: normalizedCouponCode,
      couponDiscount,
      total: finalTotal,
      accessToken,
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    },
    { status: 201 },
  );
}

/**
 * GET /api/orders
 * Admin only: returns all orders with pagination.
 * Query params: ?limit=N, ?offset=N, ?status=Pending|Processing|Shipped|Delivered
 */
export async function GET(request: NextRequest) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient();

  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const status = searchParams.get("status");

  let query = supabase
    .from("orders")
    .select("*")
    .order("createdAt", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }

  const { data: orders, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch order items for each order
  const orderIds = orders.map((o) => o.id);
  const { data: orderItems } = await supabase
    .from("order_items")
    .select("*")
    .in("orderId", orderIds);

  // Group items by order
  const itemsByOrder: Record<string, unknown[]> = {};
  orderItems?.forEach((item) => {
    if (!itemsByOrder[item.orderId]) {
      itemsByOrder[item.orderId] = [];
    }
    itemsByOrder[item.orderId].push({
      productId: item.productId,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
      size: item.size, // Size is now a string (updated in Prisma schema)
    });
  });

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    shippingAddress: order.shippingAddress,
    city: order.city,
    phone: order.phone,
    paymentMethod: order.paymentMethod,
    orderNotes: order.orderNotes,
    items: itemsByOrder[order.id] || [],
    total: order.total,
    status: order.status,
    date: new Date(order.createdAt).toISOString().split("T")[0],
  }));

  return NextResponse.json(formattedOrders);
}
