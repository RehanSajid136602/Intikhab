import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request: Request) {
  try {
    await auth.api.signOut({
      headers: headers(),
    });
  } catch (error) {
    console.error("Error during server-side signout:", error);
  }
  return NextResponse.redirect(new URL("/", request.url));
}
