import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = {};
  if (body.code !== undefined) updates.code = String(body.code).trim().toUpperCase();
  if (body.discount_type !== undefined || body.discountType !== undefined) {
    updates.discount_type = body.discount_type || body.discountType;
  }
  if (body.discount_value !== undefined || body.discountValue !== undefined) {
    updates.discount_value = Number(body.discount_value ?? body.discountValue);
  }
  if (body.active !== undefined) updates.active = Boolean(body.active);
  if (body.minimum_order_amount !== undefined || body.minimumOrderAmount !== undefined) {
    updates.minimum_order_amount = body.minimum_order_amount ?? body.minimumOrderAmount;
  }
  if (body.usage_limit !== undefined || body.usageLimit !== undefined) {
    updates.usage_limit = body.usage_limit ?? body.usageLimit;
  }
  if (body.expires_at !== undefined || body.expiresAt !== undefined) {
    updates.expires_at = body.expires_at || body.expiresAt || null;
  }
  updates.updated_at = new Date().toISOString();

  const supabase = createClient();
  const { data, error } = await supabase
    .from("coupons")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient();
  const { error } = await supabase.from("coupons").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
