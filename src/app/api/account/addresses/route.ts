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
    .from("addresses")
    .select("*")
    .eq("customer_email", email)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const required = ["full_name", "phone", "city", "postal_code", "address_line"];
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }

  const supabase = createClient();
  await supabase.from("customers").upsert(
    {
      email,
      fullName: body.full_name,
      phone: body.phone,
      city: body.city,
    },
    { onConflict: "email" },
  );

  if (body.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("customer_email", email);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      customer_email: email,
      full_name: body.full_name,
      phone: body.phone,
      city: body.city,
      province: body.province || "",
      postal_code: body.postal_code,
      address_line: body.address_line,
      is_default: Boolean(body.is_default),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
