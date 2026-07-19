import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getClientIp, checkRateLimit } from "@/lib/rateLimit";
import { phonesMatch } from "@/lib/phone";
import { sanitizeText } from "@/lib/validation";

const trackOrderSchema = z
  .object({
    orderId: z
      .string()
      .min(3, "Order ID is required")
      .max(50)
      .transform((val) => sanitizeText(val.trim().toUpperCase())),
    phone: z
      .string()
      .optional()
      .nullable()
      .transform((val) => (val ? sanitizeText(val.trim()) : "")),
    email: z
      .string()
      .optional()
      .nullable()
      .transform((val) => (val ? sanitizeText(val.trim().toLowerCase()) : "")),
  })
  .refine((data) => Boolean(data.phone) || Boolean(data.email), {
    message: "Phone number or email is required",
    path: ["phone"],
  });

/**
 * POST /api/orders/track
 * Public guest order lookup. Requires Order ID + phone OR email.
 * Never allows lookup by Order ID alone (privacy).
 */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimitResult = await checkRateLimit(
    `track-order:${ip}`,
    10,
    5 * 60 * 1000,
  );
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = trackOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:
          "Please enter your Order ID and the phone number or email used at checkout.",
      },
      { status: 400 },
    );
  }

  const { orderId, phone, email } = parsed.data;
  const supabase = createClient();

  // Fetch by ID only inside the server — never return without phone/email match
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  // Uniform not-found response (don't reveal whether the ID exists)
  const notFound = () =>
    NextResponse.json(
      {
        error:
          "We couldn't find that order — check your Order ID and phone number",
      },
      { status: 404 },
    );

  if (error || !order) {
    return notFound();
  }

  const phoneOk = phone ? phonesMatch(phone, order.phone || "") : false;
  const emailOk = email
    ? String(order.customerEmail || "").toLowerCase() === email.toLowerCase()
    : false;

  if (!phoneOk && !emailOk) {
    return notFound();
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("orderId", orderId);

  return NextResponse.json({
    id: order.id,
    customerName: order.customerName,
    // Mask email/phone slightly for privacy on shared screens
    customerEmail: maskEmail(order.customerEmail || ""),
    phone: maskPhone(order.phone || ""),
    shippingAddress: order.shippingAddress,
    city: order.city,
    province: order.province,
    paymentMethod: order.paymentMethod,
    items: (items || []).map((item) => ({
      productId: item.productId,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
      size: item.size,
    })),
    subtotal: order.subtotal || order.total,
    shippingFee: order.shippingFee || 0,
    couponCode: order.couponCode || null,
    couponDiscount: order.couponDiscount || 0,
    total: order.total,
    receiptUrl: order.receiptUrl || null,
    status: order.status,
    date: new Date(order.createdAt).toISOString().split("T")[0],
    createdAt: order.createdAt,
  });
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  if (local.length <= 2) return `${local[0] || "*"}***@${domain}`;
  return `${local.slice(0, 2)}***@${domain}`;
}

function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone;
  const last4 = digits.slice(-4);
  return `***${last4}`;
}
