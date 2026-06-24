import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth.api.getSession({
    headers: headers(),
  }).catch(() => null);

  if (!session) {
    redirect("/login");
  }

  return session;
}

