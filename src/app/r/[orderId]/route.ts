import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const token = request.nextUrl.searchParams.get("token");

  if (!orderId || !token) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const supabase = createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("receipturl, access_token_hash")
    .eq("id", orderId)
    .maybeSingle();

  if (!order || !order.receipturl) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const tokenHash = createHash("sha256").update(token).digest("hex");
  if (tokenHash !== order.access_token_hash) {
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }

  return NextResponse.redirect(order.receipturl, 302);
}
