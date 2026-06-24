import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = {};
  for (const key of ["name", "slug", "description", "image", "active"]) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (body.sort_order !== undefined || body.sortOrder !== undefined) {
    updates.sort_order = Number(body.sort_order ?? body.sortOrder);
  }
  updates.updated_at = new Date().toISOString();

  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("categories")
    .update({ active: false, updated_at: new Date().toISOString() })
    .eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
