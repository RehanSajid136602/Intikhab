import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, rating, title, body, guest_name, customer_email, created_at")
    .eq("product_id", params.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const reviews = data || [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  return NextResponse.json({
    reviews,
    averageRating,
    reviewCount: reviews.length,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const rating = Number(body.rating);
  const title = body.title ? String(body.title).trim() : null;
  const reviewBody = String(body.body || "").trim();

  if (rating < 1 || rating > 5 || !reviewBody) {
    return NextResponse.json({ error: "Rating and review are required" }, { status: 400 });
  }

  const session = await auth0.getSession().catch(() => null);
  const customerEmail = session?.user?.email || null;
  const guestName = customerEmail ? null : String(body.guestName || "").trim();
  const guestEmail = customerEmail ? null : String(body.guestEmail || "").trim();

  if (!customerEmail && (!guestName || !guestEmail)) {
    return NextResponse.json(
      { error: "Name and email are required for guest reviews" },
      { status: 400 },
    );
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      product_id: params.id,
      customer_email: customerEmail,
      guest_name: guestName,
      guest_email: guestEmail,
      rating,
      title,
      body: reviewBody,
      status: "pending",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
