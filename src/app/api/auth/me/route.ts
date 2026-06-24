import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: headers(),
    }).catch(() => null);

    if (!session?.user) {
      return NextResponse.json({ email: null, name: null });
    }

    return NextResponse.json({
      email: session.user.email || null,
      name: session.user.name || null,
    });
  } catch {
    return NextResponse.json({ email: null, name: null });
  }
}

