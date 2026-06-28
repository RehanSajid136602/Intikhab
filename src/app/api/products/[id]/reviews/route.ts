import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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

import { reviewSchema } from "@/lib/validation";
import { getClientIp, checkRateLimit } from "@/lib/rateLimit";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const ip = getClientIp(request);
  const rateLimitResult = await checkRateLimit(`reviews:${ip}`, 5, 10 * 60 * 1000);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many review attempts. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const body = await request.json();

  const result = reviewSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.format() },
      { status: 400 },
    );
  }

  const { rating, title, body: reviewBody, guestName: bodyGuestName, guestEmail: bodyGuestEmail } = result.data;

  const session = await auth.api.getSession({
    headers: headers(),
  }).catch(() => null);
  const customerEmail = session?.user?.email || null;
  const guestName = customerEmail ? null : bodyGuestName;
  const guestEmail = customerEmail ? null : bodyGuestEmail;

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
