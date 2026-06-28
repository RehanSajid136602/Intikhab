import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { messageSchema } from "@/lib/validation";
import { getClientIp, checkRateLimit } from "@/lib/rateLimit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateLimitResult = await checkRateLimit(`messages:${ip}`, 5, 5 * 60 * 1000);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const body = await request.json();

  const result = messageSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.format() },
      { status: 400 },
    );
  }

  const { name, email, phone, subject, message, type } = result.data;

  const supabase = createClient();
  const { error } = await supabase.from("messages").insert({
    id: crypto.randomUUID(),
    name,
    email,
    phone,
    subject,
    body: message,
    type,
    status: "unread",
    updatedAt: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
