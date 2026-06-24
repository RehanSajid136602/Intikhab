import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: headers(),
  }).catch(() => null);

  if (!session) {
    redirect("/admin/login");
  }

  const userEmail = session.user.email?.trim().toLowerCase();

  if (!userEmail) {
    redirect("/admin/login");
  }

  // Check env allowlist first
  if (adminEmails.includes(userEmail)) {
    return session;
  }

  // Check admin_users database table next
  try {
    const adminUser = await prisma.adminUser.findUnique({
      where: { email: userEmail },
    });

    if (adminUser && adminUser.active) {
      return session;
    }
  } catch (err) {
    console.error("Error verifying admin access via prisma:", err);
  }

  // Fail closed
  redirect("/admin/login");
}

