import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, phone, subject, message, type } = body;

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "Name, email, subject, and message are required." },
      { status: 400 },
    );
  }

  const supabase = createClient();
  const { error } = await supabase.from("messages").insert({
    id: crypto.randomUUID(),
    name: String(name).trim(),
    email: String(email).trim(),
    phone: phone ? String(phone).trim() : null,
    subject: String(subject).trim(),
    body: String(message).trim(),
    type: type || "general",
    status: "unread",
    updatedAt: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
