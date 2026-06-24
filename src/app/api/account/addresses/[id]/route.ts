import { NextRequest, NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";
import { createClient } from "@/lib/supabase/server";

async function requireEmail() {
  const session = await auth0.getSession();
  return session?.user?.email || null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const supabase = createClient();

  if (body.is_default) {
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("customer_email", email);
  }

  const { data, error } = await supabase
    .from("addresses")
    .update({
      full_name: body.full_name,
      phone: body.phone,
      city: body.city,
      province: body.province || "",
      postal_code: body.postal_code,
      address_line: body.address_line,
      is_default: Boolean(body.is_default),
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .eq("customer_email", email)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const email = await requireEmail();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createClient();
  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", params.id)
    .eq("customer_email", email);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
