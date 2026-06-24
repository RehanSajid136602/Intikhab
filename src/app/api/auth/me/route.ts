import { NextResponse } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function GET() {
  try {
    const session = await auth0.getSession();
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
