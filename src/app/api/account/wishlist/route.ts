import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { createClient } from "@/lib/supabase/server";

async function requireEmail() {
  const session = await auth0.getSession();
  return session?.user?.email || null;
}

export async function GET() {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient();
  const { data, error } = await supabase
    .from("wishlist_items")
    .select("product_id, products(*)")
    .eq("customer_email", email);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(
    (data || []).map((item: any) => item.products).filter(Boolean),
  );
}

export async function POST(request: NextRequest) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const productIds: string[] = Array.isArray(body.productIds)
    ? body.productIds
    : body.productId
      ? [body.productId]
      : [];

  if (productIds.length === 0) {
    return NextResponse.json({ error: "No products provided" }, { status: 400 });
  }

  const supabase = createClient();
  const rows = productIds.map((productId) => ({
    customer_email: email,
    product_id: productId,
  }));
  const { error } = await supabase
    .from("wishlist_items")
    .upsert(rows, { onConflict: "customer_email,product_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
