import { auth0 } from "@/lib/auth0";
import { redirect } from "next/navigation";

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function requireAdmin() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  const userEmail = session.user.email?.toLowerCase();

  if (!userEmail || !adminEmails.includes(userEmail)) {
    redirect("/");
  }

  return session;
}
