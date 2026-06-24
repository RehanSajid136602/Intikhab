import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { status } = await request.json();
  if (!["pending", "approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("reviews")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", params.id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
