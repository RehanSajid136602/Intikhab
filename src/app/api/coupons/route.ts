import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const code = String(body.code || "").trim().toUpperCase();
  const discountType = body.discount_type || body.discountType;
  const discountValue = Number(body.discount_value ?? body.discountValue);

  if (!code || !["percentage", "fixed"].includes(discountType) || discountValue <= 0) {
    return NextResponse.json({ error: "Invalid coupon data" }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("coupons")
    .insert({
      code,
      discount_type: discountType,
      discount_value: discountValue,
      active: body.active ?? true,
      minimum_order_amount:
        body.minimum_order_amount ?? body.minimumOrderAmount ?? null,
      usage_limit: body.usage_limit ?? body.usageLimit ?? null,
      expires_at: body.expires_at || body.expiresAt || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
