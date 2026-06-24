import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: headers(),
    }).catch(() => null);
    if (!session?.user?.email) {
      return NextResponse.json({ profile: null });
    }

    const supabase = createClient();
    const { data } = await supabase
      .from("customers")
      .select("fullName, phone, city, email")
      .eq("email", session.user.email)
      .single();

    return NextResponse.json({
      profile: data || null,
      authEmail: session.user.email,
      authName: session.user.name || "",
    });
  } catch {
    return NextResponse.json({ profile: null, authEmail: null, authName: "" });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: headers(),
    }).catch(() => null);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fullName, phone, city } = body;
    const email = session.user.email;

    const supabase = createClient();

    // Check if customer exists
    const { data: existing } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    let error;
    if (existing) {
      const result = await supabase
        .from("customers")
        .update({
          fullName: fullName || "",
          phone: phone || "",
          city: city || "",
        })
        .eq("email", email);
      error = result.error;
    } else {
      const result = await supabase.from("customers").insert({
        id: crypto.randomUUID(),
        email,
        fullName: fullName || "",
        phone: phone || "",
        city: city || "",
      });
      error = result.error;
    }

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to update" },
      { status: 500 },
    );
  }
}
