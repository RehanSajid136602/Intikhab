import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyAdmin } from "@/lib/supabase/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const { authenticated } = await verifyAdmin(request);
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = String(body.name || "").trim();
  const slug = String(body.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")).replace(/^-|-$/g, "");
  if (!name || !slug) {
    return NextResponse.json({ error: "Name and slug are required" }, { status: 400 });
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name,
      slug,
      description: body.description || null,
      image: body.image || null,
      active: body.active ?? true,
      sort_order: Number(body.sort_order ?? body.sortOrder ?? 0),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}
