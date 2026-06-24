import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: Request,
  { params }: { params: { productId: string } },
) {
  const session = await auth.api.getSession({
    headers: headers(),
  }).catch(() => null);
  const email = session?.user?.email;
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient();
  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("customer_email", email)
    .eq("product_id", params.productId);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
