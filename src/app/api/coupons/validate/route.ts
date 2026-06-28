import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getClientIp, checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimitResult = await checkRateLimit(`coupon-validate:${ip}`, 10, 5 * 60 * 1000);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const { code, subtotal } = body || {};
  const normalizedCode = String(code || "").trim().toUpperCase();
  const orderSubtotal = Number(subtotal || 0);

  if (!normalizedCode) {
    return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
  }

  const supabase = createClient();
  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", normalizedCode)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
  }
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
  }
  if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
    return NextResponse.json({ error: "Coupon usage limit reached" }, { status: 400 });
  }
  if (
    coupon.minimum_order_amount !== null &&
    orderSubtotal < coupon.minimum_order_amount
  ) {
    return NextResponse.json(
      { error: `Minimum order amount is PKR ${coupon.minimum_order_amount.toLocaleString("en-PK")}` },
      { status: 400 },
    );
  }

  const discount =
    coupon.discount_type === "percentage"
      ? Math.floor((orderSubtotal * coupon.discount_value) / 100)
      : coupon.discount_value;

  return NextResponse.json({
    code: normalizedCode,
    discount: Math.max(0, Math.min(discount, orderSubtotal)),
  });
}
