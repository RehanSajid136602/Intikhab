import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/cart
 * Upserts cart items for a given customer email.
 * Expects: { email: string, items: [{ productId, quantity, size }] }
 */
export async function POST(request: NextRequest) {
  const supabase = createClient();
  const body = await request.json();

  const { email, items } = body;

  if (!email || !items || !Array.isArray(items)) {
    return NextResponse.json(
      { error: "Missing email or items array" },
      { status: 400 },
    );
  }

  // Upsert each cart item
  for (const item of items) {
    const { error } = await supabase.from("carts").upsert(
      {
        id: crypto.randomUUID(),
        customerEmail: email,
        productId: item.productId,
        quantity: item.quantity,
        size: item.size ?? null,
        updatedAt: new Date().toISOString(),
      },
      { onConflict: "customerEmail,productId" },
    );

    if (error) {
      console.error("Cart upsert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }

  return NextResponse.json({ success: true, count: items.length });
}

/**
 * GET /api/cart?email=xxx
 * Returns cart items for the given email.
 */
export async function GET(request: NextRequest) {
  const supabase = createClient();
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "Missing email parameter" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase
    .from("carts")
    .select("*")
    .eq("customerEmail", email);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    items: data.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      size: item.size,
    })),
  });
}
